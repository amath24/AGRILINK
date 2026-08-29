import { 
  db, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  query, 
  where,
  serverTimestamp 
} from '../firebase/firestore';
import { 
  FirestoreUser, 
  FirestoreProducerProfile, 
  FirestoreBuyerProfile, 
  UserRoleType, 
  UserStatusType,
  ProducerStatusType,
  BuyerCategoryCode 
} from '../types';

export interface PersistentRegisteredAccount {
  uid: string;
  email: string;
  password?: string;
  role: UserRoleType;
  profile: FirestoreUser;
  producerProfile?: FirestoreProducerProfile;
  buyerProfile?: FirestoreBuyerProfile;
  savedAt: string;
}

const REGISTRY_STORAGE_KEY = 'agrilink_registered_accounts_db';

export const userService = {
  // Helper to persist accounts locally as well as in Firestore
  saveAccountToLocalRegistry(account: PersistentRegisteredAccount): void {
    try {
      const existingStr = localStorage.getItem(REGISTRY_STORAGE_KEY);
      const map: Record<string, PersistentRegisteredAccount> = existingStr ? JSON.parse(existingStr) : {};
      map[account.email.toLowerCase().trim()] = account;
      localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(map));
    } catch (e) {
      console.warn('Could not update local accounts registry:', e);
    }
  },

  getAccountFromLocalRegistry(email: string): PersistentRegisteredAccount | null {
    try {
      const existingStr = localStorage.getItem(REGISTRY_STORAGE_KEY);
      if (!existingStr) return null;
      const map: Record<string, PersistentRegisteredAccount> = JSON.parse(existingStr);
      return map[email.toLowerCase().trim()] || null;
    } catch {
      return null;
    }
  },

  getAllLocalRegistryAccounts(): PersistentRegisteredAccount[] {
    try {
      const existingStr = localStorage.getItem(REGISTRY_STORAGE_KEY);
      if (!existingStr) return [];
      const map: Record<string, PersistentRegisteredAccount> = JSON.parse(existingStr);
      return Object.values(map);
    } catch {
      return [];
    }
  },

  // Create / initialize User & Role Profile in Firestore
  async createUserProfile(
    uid: string, 
    userBasic: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      role: UserRoleType;
      status?: UserStatusType;
    },
    extraProfile?: {
      farmName?: string;
      description?: string;
      location?: string;
      buyerType?: BuyerCategoryCode;
      address?: string;
      city?: string;
      companyName?: string;
    },
    passwordPlain?: string
  ): Promise<{ profile: FirestoreUser; producerProfile?: FirestoreProducerProfile; buyerProfile?: FirestoreBuyerProfile }> {
    const now = new Date().toISOString();
    const status: UserStatusType = userBasic.status || (userBasic.role === 'PRODUCER' ? 'PENDING' : 'ACTIVE');

    const userDocData: FirestoreUser = {
      uid,
      firstName: userBasic.firstName,
      lastName: userBasic.lastName,
      email: userBasic.email,
      phone: userBasic.phone,
      role: userBasic.role,
      status,
      createdAt: now,
    };

    let producerData: FirestoreProducerProfile | undefined;
    let buyerData: FirestoreBuyerProfile | undefined;

    // 1. Write users/{uid} in Firestore
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        ...userDocData,
        _serverTimestamp: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Firestore write users failed (may be offline or sandbox):', e);
    }

    // 2. Write role-specific profile
    if (userBasic.role === 'PRODUCER') {
      producerData = {
        uid,
        farmName: extraProfile?.farmName || `${userBasic.firstName} ${userBasic.lastName} Ferme`,
        description: extraProfile?.description || 'Producteur local partenaire Agri-Link',
        location: extraProfile?.location || 'Région des Niayes, Sénégal',
        phone: userBasic.phone,
        validationStatus: 'PENDING',
        createdAt: now,
        updatedAt: now,
      };
      try {
        const producerProfileRef = doc(db, 'producerProfiles', uid);
        await setDoc(producerProfileRef, {
          ...producerData,
          _serverTimestamp: serverTimestamp(),
        });
      } catch (e) {
        console.warn('Firestore write producerProfile failed:', e);
      }
    } else if (userBasic.role === 'BUYER') {
      buyerData = {
        uid,
        buyerType: extraProfile?.buyerType || 'INDIVIDUAL',
        address: extraProfile?.address || 'Dakar Plateau',
        city: extraProfile?.city || 'Dakar',
        phone: userBasic.phone,
        companyName: extraProfile?.companyName,
        createdAt: now,
        updatedAt: now,
      };
      try {
        const buyerProfileRef = doc(db, 'buyerProfiles', uid);
        await setDoc(buyerProfileRef, {
          ...buyerData,
          _serverTimestamp: serverTimestamp(),
        });
      } catch (e) {
        console.warn('Firestore write buyerProfile failed:', e);
      }
    }

    // 3. Save into persistent accounts database registry so subsequent logins ALWAYS find this account
    this.saveAccountToLocalRegistry({
      uid,
      email: userBasic.email,
      password: passwordPlain,
      role: userBasic.role,
      profile: userDocData,
      producerProfile: producerData,
      buyerProfile: buyerData,
      savedAt: now,
    });

    return { profile: userDocData, producerProfile: producerData, buyerProfile: buyerData };
  },

  // Get User Profile by UID
  async getUserProfile(uid: string): Promise<FirestoreUser | null> {
    try {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        return snap.data() as FirestoreUser;
      }
    } catch (error) {
      console.warn('Error fetching user profile from Firestore:', error);
    }

    // Fallback from registry
    const all = this.getAllLocalRegistryAccounts();
    const found = all.find(a => a.uid === uid);
    return found ? found.profile : null;
  },

  // Get User by Email
  async getUserByEmail(email: string): Promise<FirestoreUser | null> {
    const cleanEmail = email.toLowerCase().trim();
    try {
      const q = query(collection(db, 'users'), where('email', '==', cleanEmail));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs[0].data() as FirestoreUser;
      }
    } catch (error) {
      console.warn('Error searching user by email in Firestore:', error);
    }

    const reg = this.getAccountFromLocalRegistry(cleanEmail);
    return reg ? reg.profile : null;
  },

  // Get Producer Profile
  async getProducerProfile(uid: string): Promise<FirestoreProducerProfile | null> {
    try {
      const docRef = doc(db, 'producerProfiles', uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as FirestoreProducerProfile;
      }
    } catch (error) {
      console.warn('Error fetching producer profile from Firestore:', error);
    }

    const all = this.getAllLocalRegistryAccounts();
    const found = all.find(a => a.uid === uid);
    return found?.producerProfile || null;
  },

  // Get Buyer Profile
  async getBuyerProfile(uid: string): Promise<FirestoreBuyerProfile | null> {
    try {
      const docRef = doc(db, 'buyerProfiles', uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as FirestoreBuyerProfile;
      }
    } catch (error) {
      console.warn('Error fetching buyer profile from Firestore:', error);
    }

    const all = this.getAllLocalRegistryAccounts();
    const found = all.find(a => a.uid === uid);
    return found?.buyerProfile || null;
  },

  // Update Producer validation status (Admin action)
  async updateProducerValidation(producerId: string, validationStatus: ProducerStatusType): Promise<void> {
    const now = new Date().toISOString();
    try {
      const producerRef = doc(db, 'producerProfiles', producerId);
      const userRef = doc(db, 'users', producerId);

      await updateDoc(producerRef, {
        validationStatus,
        updatedAt: now,
      });

      const userStatus: UserStatusType = validationStatus === 'APPROVED' ? 'ACTIVE' : validationStatus === 'SUSPENDED' ? 'SUSPENDED' : 'PENDING';
      await updateDoc(userRef, {
        status: userStatus,
        updatedAt: now,
      });
    } catch (e) {
      console.warn('Firestore update producer validation failed:', e);
    }

    // Update in local registry
    const all = this.getAllLocalRegistryAccounts();
    const target = all.find(a => a.uid === producerId);
    if (target) {
      if (target.producerProfile) {
        target.producerProfile.validationStatus = validationStatus;
        target.producerProfile.updatedAt = now;
      }
      target.profile.status = validationStatus === 'APPROVED' ? 'ACTIVE' : validationStatus === 'SUSPENDED' ? 'SUSPENDED' : 'PENDING';
      this.saveAccountToLocalRegistry(target);
    }
  },

  // Fetch all users for Admin
  async getAllUsers(): Promise<FirestoreUser[]> {
    try {
      const snap = await getDocs(collection(db, 'users'));
      if (!snap.empty) {
        return snap.docs.map(d => d.data() as FirestoreUser);
      }
    } catch (error) {
      console.warn('Error fetching all users from Firestore:', error);
    }

    const localList = this.getAllLocalRegistryAccounts().map(a => a.profile);
    return localList;
  }
};
