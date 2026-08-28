import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

const COLLECTION_NAME = 'products';

/**
 * Service to handle Firestore Product operations
 */
export const productService = {
  /**
   * Fetch all active products for the marketplace
   */
  async getAllProducts(): Promise<Product[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // If Firestore is empty, return initial catalog
        return INITIAL_PRODUCTS;
      }

      const products: Product[] = [];
      querySnapshot.forEach((docSnap) => {
        products.push({ id: docSnap.id, ...(docSnap.data() as Omit<Product, 'id'>) });
      });
      return products;
    } catch (error) {
      console.warn('Firestore fetch products failed, falling back to local dataset:', error);
      return INITIAL_PRODUCTS;
    }
  },

  /**
   * Get single product by ID
   */
  async getProductById(productId: string): Promise<Product | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...(docSnap.data() as Omit<Product, 'id'>) };
      }
      return null;
    } catch (error) {
      console.warn('Firestore getProductById error:', error);
      return null;
    }
  },

  /**
   * Create or publish a new product offer (Producer)
   */
  async createProduct(productData: Omit<Product, 'id'>, customId?: string): Promise<string> {
    try {
      const id = customId || `prod-${Date.now()}`;
      const docRef = doc(db, COLLECTION_NAME, id);
      await setDoc(docRef, {
        ...productData,
        id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return id;
    } catch (error) {
      console.error('Failed to create product in Firestore:', error);
      throw error;
    }
  },

  /**
   * Update product stock, prices, or status
   */
  async updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, productId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Failed to update product in Firestore:', error);
      throw error;
    }
  },

  /**
   * Seed Firestore initial catalog if empty
   */
  async seedInitialProducts(): Promise<void> {
    try {
      for (const prod of INITIAL_PRODUCTS) {
        const docRef = doc(db, COLLECTION_NAME, prod.id);
        await setDoc(docRef, { ...prod, createdAt: serverTimestamp() }, { merge: true });
      }
    } catch (error) {
      console.warn('Seed initial products warning:', error);
    }
  },
};
