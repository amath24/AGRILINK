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
  async register(params: RegisterParams): Promise<{ user: FirebaseUser; profile: FirestoreUser }> {
    const cred = await createUserWithEmailAndPassword(auth, params.email, params.password);
    const firebaseUser = cred.user;

    // Update Firebase Auth displayName
    await updateProfile(firebaseUser, {
      displayName: `${params.firstName} ${params.lastName}`.trim(),
    });

    // Create profile in Firestore
    const profile = await userService.createUserProfile(
      firebaseUser.uid,
      {
        firstName: params.firstName,
        lastName: params.lastName,
        email: params.email,
        phone: params.phone,
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
      }
    );

    return { user: firebaseUser, profile };
  },

  // Login with Email & Password
  async login(email: string, password: string): Promise<{ user: FirebaseUser; profile: FirestoreUser | null }> {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const profile = await userService.getUserProfile(cred.user.uid);
    return { user: cred.user, profile };
  },

  // Sign out
  async logout(): Promise<void> {
    await signOut(auth);
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
