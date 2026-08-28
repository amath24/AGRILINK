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

export const userService = {
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
    }
  ): Promise<FirestoreUser> {
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

    // 1. Write users/{uid}
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...userDocData,
      _serverTimestamp: serverTimestamp(),
    });

    // 2. Write role-specific profile
    if (userBasic.role === 'PRODUCER') {
      const producerProfileRef = doc(db, 'producerProfiles', uid);
      const producerData: FirestoreProducerProfile = {
        uid,
        farmName: extraProfile?.farmName || `${userBasic.firstName} ${userBasic.lastName} Ferme`,
        description: extraProfile?.description || 'Producteur local partenaire Agri-Link',
        location: extraProfile?.location || 'Région des Niayes, Sénégal',
        phone: userBasic.phone,
        validationStatus: 'PENDING',
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(producerProfileRef, {
        ...producerData,
        _serverTimestamp: serverTimestamp(),
      });
    } else if (userBasic.role === 'BUYER') {
      const buyerProfileRef = doc(db, 'buyerProfiles', uid);
      const buyerData: FirestoreBuyerProfile = {
        uid,
        buyerType: extraProfile?.buyerType || 'INDIVIDUAL',
        address: extraProfile?.address || 'Dakar Plateau',
        city: extraProfile?.city || 'Dakar',
        phone: userBasic.phone,
        companyName: extraProfile?.companyName,
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(buyerProfileRef, {
        ...buyerData,
        _serverTimestamp: serverTimestamp(),
      });
    }

    return userDocData;
  },

  // Get User Profile by UID
  async getUserProfile(uid: string): Promise<FirestoreUser | null> {
    try {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        return snap.data() as FirestoreUser;
      }
      return null;
    } catch (error) {
      console.warn('Error fetching user profile from Firestore:', error);
      return null;
    }
  },

  // Get Producer Profile
  async getProducerProfile(uid: string): Promise<FirestoreProducerProfile | null> {
    try {
      const docRef = doc(db, 'producerProfiles', uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as FirestoreProducerProfile;
      }
      return null;
    } catch (error) {
      console.warn('Error fetching producer profile:', error);
      return null;
    }
  },

  // Get Buyer Profile
  async getBuyerProfile(uid: string): Promise<FirestoreBuyerProfile | null> {
    try {
      const docRef = doc(db, 'buyerProfiles', uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as FirestoreBuyerProfile;
      }
      return null;
    } catch (error) {
      console.warn('Error fetching buyer profile:', error);
      return null;
    }
  },

  // Update Producer validation status (Admin action)
  async updateProducerValidation(producerId: string, validationStatus: ProducerStatusType): Promise<void> {
    const producerRef = doc(db, 'producerProfiles', producerId);
    const userRef = doc(db, 'users', producerId);
    const now = new Date().toISOString();

    await updateDoc(producerRef, {
      validationStatus,
      updatedAt: now,
    });

    // Also update main user status if approved / suspended
    const userStatus: UserStatusType = validationStatus === 'APPROVED' ? 'ACTIVE' : validationStatus === 'SUSPENDED' ? 'SUSPENDED' : 'PENDING';
    await updateDoc(userRef, {
      status: userStatus,
      updatedAt: now,
    });
  },

  // Fetch all users for Admin
  async getAllUsers(): Promise<FirestoreUser[]> {
    try {
      const snap = await getDocs(collection(db, 'users'));
      return snap.docs.map(d => d.data() as FirestoreUser);
    } catch (error) {
      console.warn('Error fetching all users from Firestore:', error);
      return [];
    }
  }
};
