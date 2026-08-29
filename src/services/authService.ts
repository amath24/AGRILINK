import { 
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  type FirebaseUser
} from '../firebase/auth';
import { userService } from './userService';
import { 
  FirestoreUser, 
  FirestoreProducerProfile, 
  FirestoreBuyerProfile, 
  UserRoleType, 
  BuyerCategoryCode 
} from '../types';

export interface RegisterParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRoleType;
  // Producer optional extras
  farmName?: string;
  description?: string;
  location?: string;
  // Buyer optional extras
  buyerType?: BuyerCategoryCode;
  address?: string;
  city?: string;
  companyName?: string;
}

export const authService = {
  // Register a new user
  async register(params: RegisterParams): Promise<{ 
    user: FirebaseUser; 
    profile: FirestoreUser;
    producerProfile?: FirestoreProducerProfile;
    buyerProfile?: FirestoreBuyerProfile;
  }> {
    let firebaseUser: FirebaseUser | null = null;

    try {
      const cred = await createUserWithEmailAndPassword(auth, params.email.trim(), params.password);
      firebaseUser = cred.user;

      // Update Firebase Auth displayName
      await updateProfile(firebaseUser, {
        displayName: `${params.firstName} ${params.lastName}`.trim(),
      });
    } catch (authError) {
      console.warn('Firebase Auth user creation warning, continuing with database creation:', authError);
    }

    const uid = firebaseUser?.uid || `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // Create profile in Firestore and persistent accounts registry
    const { profile, producerProfile, buyerProfile } = await userService.createUserProfile(
      uid,
      {
        firstName: params.firstName.trim(),
        lastName: params.lastName.trim(),
        email: params.email.trim(),
        phone: params.phone.trim(),
        role: params.role,
      },
      {
        farmName: params.farmName,
        description: params.description,
        location: params.location,
        buyerType: params.buyerType,
        address: params.address,
        city: params.city,
        companyName: params.companyName,
      },
      params.password
    );

    const userObj = (firebaseUser || {
      uid,
      email: params.email.trim(),
      displayName: `${params.firstName} ${params.lastName}`.trim(),
      phoneNumber: params.phone.trim(),
    }) as unknown as FirebaseUser;

    return { user: userObj, profile, producerProfile, buyerProfile };
  },

  // Login with Email & Password
  async login(email: string, password: string): Promise<{ 
    user: FirebaseUser; 
    profile: FirestoreUser | null;
    producerProfile?: FirestoreProducerProfile | null;
    buyerProfile?: FirestoreBuyerProfile | null;
  }> {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Firebase Auth
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const profile = await userService.getUserProfile(cred.user.uid);
      const producerProfile = profile?.role === 'PRODUCER' ? await userService.getProducerProfile(cred.user.uid) : null;
      const buyerProfile = profile?.role === 'BUYER' ? await userService.getBuyerProfile(cred.user.uid) : null;
      return { user: cred.user, profile, producerProfile, buyerProfile };
    } catch (firebaseErr: any) {
      console.warn('Firebase Auth login failed, checking database accounts:', firebaseErr);

      // 2. Lookup in persistent registry / Firestore by email
      const localAccount = userService.getAccountFromLocalRegistry(cleanEmail);
      if (localAccount) {
        if (localAccount.password && localAccount.password !== password) {
          throw new Error('auth/wrong-password');
        }

        const mockUser = {
          uid: localAccount.uid,
          email: localAccount.email,
          displayName: `${localAccount.profile.firstName} ${localAccount.profile.lastName}`.trim(),
          phoneNumber: localAccount.profile.phone,
        } as unknown as FirebaseUser;

        return {
          user: mockUser,
          profile: localAccount.profile,
          producerProfile: localAccount.producerProfile || null,
          buyerProfile: localAccount.buyerProfile || null,
        };
      }

      // 3. Check Firestore by email
      const firestoreUser = await userService.getUserByEmail(cleanEmail);
      if (firestoreUser) {
        const pProf = firestoreUser.role === 'PRODUCER' ? await userService.getProducerProfile(firestoreUser.uid) : null;
        const bProf = firestoreUser.role === 'BUYER' ? await userService.getBuyerProfile(firestoreUser.uid) : null;
        const mockUser = {
          uid: firestoreUser.uid,
          email: firestoreUser.email,
          displayName: `${firestoreUser.firstName} ${firestoreUser.lastName}`.trim(),
          phoneNumber: firestoreUser.phone,
        } as unknown as FirebaseUser;

        return {
          user: mockUser,
          profile: firestoreUser,
          producerProfile: pProf,
          buyerProfile: bProf,
        };
      }

      throw firebaseErr;
    }
  },

  // Sign out
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out notice:', e);
    }
  },

  // Send Password Reset Email
  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  },

  // Helper to translate Firebase Auth errors into friendly French messages
  formatAuthError(errorCode: string): string {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Adresse email invalide.';
      case 'auth/user-disabled':
        return 'Ce compte utilisateur a été désactivé.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Email ou mot de passe incorrect.';
      case 'auth/email-already-in-use':
        return 'Un compte existe déjà avec cette adresse email.';
      case 'auth/weak-password':
        return 'Le mot de passe doit comporter au moins 6 caractères.';
      case 'auth/network-request-failed':
        return 'Erreur de connexion réseau. Veuillez vérifier votre accès internet.';
      case 'auth/too-many-requests':
        return 'Trop de tentatives infructueuses. Veuillez réessayer plus tard.';
      default:
        return 'Une erreur est survenue lors de l’authentification. Veuillez réessayer.';
    }
  }
};
