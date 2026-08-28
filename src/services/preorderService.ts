import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { Preorder, PaymentRecord, DeliveryRecord } from '../types';
import { INITIAL_PREORDERS, INITIAL_PAYMENTS, INITIAL_DELIVERIES } from '../data/buyerData';

const PREORDERS_COLLECTION = 'preorders';
const PAYMENTS_COLLECTION = 'payments';
const DELIVERIES_COLLECTION = 'deliveries';

export const preorderService = {
  /**
   * Fetch buyer preorders
   */
  async getPreordersForBuyer(buyerId?: string): Promise<Preorder[]> {
    try {
      let q = collection(db, PREORDERS_COLLECTION);
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return INITIAL_PREORDERS;
      }

      const preorders: Preorder[] = [];
      querySnapshot.forEach((docSnap) => {
        preorders.push({ id: docSnap.id, ...(docSnap.data() as Omit<Preorder, 'id'>) });
      });
      return preorders;
    } catch (error) {
      console.warn('Firestore fetch preorders failed, fallback to local data:', error);
      return INITIAL_PREORDERS;
    }
  },

  /**
   * Create a new Preorder with escrow deposit
   */
  async createPreorder(preorder: Preorder): Promise<void> {
    try {
      const docRef = doc(db, PREORDERS_COLLECTION, preorder.id);
      await setDoc(docRef, {
        ...preorder,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Record deposit payment
      const paymentRef = doc(db, PAYMENTS_COLLECTION, `pay-${preorder.id}-acompte`);
      const paymentData: PaymentRecord = {
        id: `pay-${preorder.id}-acompte`,
        numeroTransaction: `TRX-${Date.now()}`,
        numeroFacture: `FAC-${preorder.numeroCommande}`,
        preorderId: preorder.id,
        produitNom: preorder.produitNom,
        montant: preorder.acompte,
        moyenPaiement: preorder.moyenPaiement,
        typePaiement: 'acompte',
        statut: 'validé',
        datePaiement: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      };
      await setDoc(paymentRef, { ...paymentData, createdAt: serverTimestamp() });
    } catch (error) {
      console.error('Failed to create preorder in Firestore:', error);
    }
  },

  /**
   * Update preorder status (e.g. In Transit, Confirmed, Delivered)
   */
  async updatePreorderStatus(preorderId: string, updates: Partial<Preorder>): Promise<void> {
    try {
      const docRef = doc(db, PREORDERS_COLLECTION, preorderId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Failed to update preorder status:', error);
    }
  },

  /**
   * Fetch payment records
   */
  async getPayments(): Promise<PaymentRecord[]> {
    try {
      const q = collection(db, PAYMENTS_COLLECTION);
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return INITIAL_PAYMENTS;
      const payments: PaymentRecord[] = [];
      querySnapshot.forEach((d) => payments.push({ id: d.id, ...(d.data() as Omit<PaymentRecord, 'id'>) }));
      return payments;
    } catch (error) {
      return INITIAL_PAYMENTS;
    }
  },

  /**
   * Fetch delivery records
   */
  async getDeliveries(): Promise<DeliveryRecord[]> {
    try {
      const q = collection(db, DELIVERIES_COLLECTION);
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return INITIAL_DELIVERIES;
      const deliveries: DeliveryRecord[] = [];
      querySnapshot.forEach((d) => deliveries.push({ id: d.id, ...(d.data() as Omit<DeliveryRecord, 'id'>) }));
      return deliveries;
    } catch (error) {
      return INITIAL_DELIVERIES;
    }
  }
};
