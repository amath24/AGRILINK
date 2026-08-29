import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, onAuthStateChanged, type FirebaseUser } from '../firebase/auth';
import { authService, RegisterParams } from '../services/authService';
import { userService } from '../services/userService';
import { 
  FirestoreUser, 
  FirestoreProducerProfile, 
  FirestoreBuyerProfile, 
  UserRoleType 
} from '../types';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: FirestoreUser | null;
  producerProfile: FirestoreProducerProfile | null;
  buyerProfile: FirestoreBuyerProfile | null;
  role: UserRoleType | null;
  loading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (params: RegisterParams) => Promise<boolean>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  setDemoUser: (role: UserRoleType) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default demo fallback users when testing locally without prior registration
const DEMO_PROFILES: Record<UserRoleType, {
  profile: FirestoreUser;
  producerProfile?: FirestoreProducerProfile;
  buyerProfile?: FirestoreBuyerProfile;
}> = {
  BUYER: {
    profile: {
      uid: 'demo-buyer-moussa',
      firstName: 'Moussa',
      lastName: 'Diop',
      email: 'moussa.diop@terangarestaurant.sn',
      phone: '+221 77 456 78 90',
      role: 'BUYER',
      status: 'ACTIVE',
      createdAt: '2025-01-15T10:00:00.000Z',
    },
    buyerProfile: {
      uid: 'demo-buyer-moussa',
      buyerType: 'RESTAURANT',
      address: 'Route des Almadies, Dakar',
      city: 'Dakar',
      phone: '+221 77 456 78 90',
      companyName: 'Restaurant Teranga Almadies',
      createdAt: '2025-01-15T10:00:00.000Z',
      updatedAt: '2025-01-15T10:00:00.000Z',
    }
  },
  PRODUCER: {
    profile: {
      uid: 'demo-producer-modou',
      firstName: 'Modou',
      lastName: 'Fall',
      email: 'modou.fall@fermediop.sn',
      phone: '+221 77 123 45 67',
      role: 'PRODUCER',
      status: 'ACTIVE',
      createdAt: '2024-11-20T08:30:00.000Z',
    },
    producerProfile: {
      uid: 'demo-producer-modou',
      farmName: 'Ferme des Niayes & Maraîchage Bio',
      description: 'Production maraîchère éco-responsable certifiée sans pesticides chimiques.',
      location: 'Sangalkam, Région de Rufisque',
      phone: '+221 77 123 45 67',
      validationStatus: 'APPROVED',
      region: 'Rufisque',
      productionType: 'Maraîchage Biologique & Fruits',
      createdAt: '2024-11-20T08:30:00.000Z',
      updatedAt: '2025-02-10T14:20:00.000Z',
    }
  },
  ADMIN: {
    profile: {
      uid: 'demo-admin-fatou',
      firstName: 'Fatou',
      lastName: 'Ndiaye',
      email: 'admin@agrilink.sn',
      phone: '+221 78 999 00 11',
      role: 'ADMIN',
      status: 'ACTIVE',
      createdAt: '2024-01-01T00:00:00.000Z',
    }
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<FirestoreUser | null>(() => {
    // Initial fallback to demo buyer if no session exists yet
    const saved = localStorage.getItem('agrilink_current_profile');
    return saved ? JSON.parse(saved) : DEMO_PROFILES.BUYER.profile;
  });
  const [producerProfile, setProducerProfile] = useState<FirestoreProducerProfile | null>(() => {
    const saved = localStorage.getItem('agrilink_producer_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [buyerProfile, setBuyerProfile] = useState<FirestoreBuyerProfile | null>(() => {
    const saved = localStorage.getItem('agrilink_buyer_profile');
    return saved ? JSON.parse(saved) : DEMO_PROFILES.BUYER.buyerProfile || null;
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sync state with Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          // Fetch Firestore user doc
          const userProf = await userService.getUserProfile(firebaseUser.uid);
          if (userProf) {
            setProfile(userProf);
            localStorage.setItem('agrilink_current_profile', JSON.stringify(userProf));

            if (userProf.role === 'PRODUCER') {
              const pProf = await userService.getProducerProfile(firebaseUser.uid);
              setProducerProfile(pProf);
              if (pProf) localStorage.setItem('agrilink_producer_profile', JSON.stringify(pProf));
            } else if (userProf.role === 'BUYER') {
              const bProf = await userService.getBuyerProfile(firebaseUser.uid);
              setBuyerProfile(bProf);
              if (bProf) localStorage.setItem('agrilink_buyer_profile', JSON.stringify(bProf));
            }
          } else {
            // Profile fallback
            const fallbackProf: FirestoreUser = {
              uid: firebaseUser.uid,
              firstName: firebaseUser.displayName?.split(' ')[0] || 'Utilisateur',
              lastName: firebaseUser.displayName?.split(' ')[1] || '',
              email: firebaseUser.email || '',
              phone: firebaseUser.phoneNumber || '',
              role: 'BUYER',
              status: 'ACTIVE',
              createdAt: new Date().toISOString(),
            };
            setProfile(fallbackProf);
          }
        } catch (err) {
          console.warn('Error loading user profile from Firestore:', err);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setAuthError(null);
    setLoading(true);
    try {
      const { user: loggedUser, profile: loggedProfile, producerProfile: pProf, buyerProfile: bProf } = await authService.login(email, password);
      setUser(loggedUser);
      if (loggedProfile) {
        setProfile(loggedProfile);
        localStorage.setItem('agrilink_current_profile', JSON.stringify(loggedProfile));
        
        if (loggedProfile.role === 'PRODUCER') {
          const p = pProf || await userService.getProducerProfile(loggedUser.uid);
          setProducerProfile(p);
          if (p) localStorage.setItem('agrilink_producer_profile', JSON.stringify(p));
        } else if (loggedProfile.role === 'BUYER') {
          const b = bProf || await userService.getBuyerProfile(loggedUser.uid);
          setBuyerProfile(b);
          if (b) localStorage.setItem('agrilink_buyer_profile', JSON.stringify(b));
        }
      }
      setLoading(false);
      return true;
    } catch (err: any) {
      console.warn('Login error:', err);
      const msg = authService.formatAuthError(err.message || err.code || '');
      setAuthError(msg);
      setLoading(false);
      return false;
    }
  };

  const register = async (params: RegisterParams): Promise<boolean> => {
    setAuthError(null);
    setLoading(true);
    try {
      const { user: registeredUser, profile: newProfile, producerProfile: pProf, buyerProfile: bProf } = await authService.register(params);
      setUser(registeredUser);
      setProfile(newProfile);
      localStorage.setItem('agrilink_current_profile', JSON.stringify(newProfile));

      if (params.role === 'PRODUCER') {
        const p = pProf || await userService.getProducerProfile(registeredUser.uid);
        setProducerProfile(p || null);
        if (p) localStorage.setItem('agrilink_producer_profile', JSON.stringify(p));
      } else if (params.role === 'BUYER') {
        const b = bProf || await userService.getBuyerProfile(registeredUser.uid);
        setBuyerProfile(b || null);
        if (b) localStorage.setItem('agrilink_buyer_profile', JSON.stringify(b));
      }

      setLoading(false);
      return true;
    } catch (err: any) {
      console.error('Registration failed:', err);
      const msg = authService.formatAuthError(err.message || err.code || '');
      setAuthError(msg);
      setLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (e) {
      console.warn('Logout warning:', e);
    }
    setUser(null);
    setProfile(null);
    setProducerProfile(null);
    setBuyerProfile(null);
    localStorage.removeItem('agrilink_current_profile');
    localStorage.removeItem('agrilink_producer_profile');
    localStorage.removeItem('agrilink_buyer_profile');
  };

  const sendPasswordReset = async (email: string): Promise<boolean> => {
    setAuthError(null);
    try {
      await authService.sendPasswordReset(email);
      return true;
    } catch (err: any) {
      const msg = authService.formatAuthError(err.code || '');
      setAuthError(msg);
      return false;
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    try {
      const p = await userService.getUserProfile(user.uid);
      if (p) {
        setProfile(p);
        localStorage.setItem('agrilink_current_profile', JSON.stringify(p));
      }
    } catch (e) {
      console.warn('Error refreshing profile:', e);
    }
  };

  const setDemoUser = (role: UserRoleType) => {
    const demo = DEMO_PROFILES[role];
    setProfile(demo.profile);
    setProducerProfile(demo.producerProfile || null);
    setBuyerProfile(demo.buyerProfile || null);
    localStorage.setItem('agrilink_current_profile', JSON.stringify(demo.profile));
    if (demo.producerProfile) {
      localStorage.setItem('agrilink_producer_profile', JSON.stringify(demo.producerProfile));
    }
    if (demo.buyerProfile) {
      localStorage.setItem('agrilink_buyer_profile', JSON.stringify(demo.buyerProfile));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        producerProfile,
        buyerProfile,
        role: profile?.role || null,
        loading,
        authError,
        login,
        register,
        logout,
        sendPasswordReset,
        refreshProfile,
        setDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
