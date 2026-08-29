import React, { useState, useMemo, useEffect } from 'react';
import {
  Product,
  FilterState,
  Preorder,
  BuyerTab,
  BuyerProfile,
  DeliveryRecord,
  PaymentRecord,
  BuyerNotification,
  FarmProfile,
  Plot,
  CropProduction,
  StockItem,
  StockMovement,
  ProducerOrder,
  ProducerDelivery,
  TraceabilityLot,
  ProducerFinanceSummary,
  FinancialTransaction,
  ProducerNotification,
  PlotStatus,
  ProductionStatus,
  ProducerOrderStatus,
  AdminTab,
  AdminUser,
  AdminProducer,
  AdminBuyer,
  AdminIncident,
  PlatformSettings,
  UserAccountStatus,
  ProducerDeliveryStatus,
  IncidentStatus,
} from './types';
import { INITIAL_PRODUCTS } from './data/products';
import {
  INITIAL_BUYER_PROFILE,
  INITIAL_PREORDERS,
  INITIAL_DELIVERIES,
  INITIAL_PAYMENTS,
  INITIAL_NOTIFICATIONS,
} from './data/buyerData';
import {
  INITIAL_FARM_PROFILE,
  INITIAL_PLOTS,
  INITIAL_PRODUCTIONS,
  INITIAL_STOCK_ITEMS,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_PRODUCER_ORDERS,
  INITIAL_PRODUCER_DELIVERIES,
  INITIAL_TRACEABILITY_LOTS,
  INITIAL_PRODUCER_FINANCE,
  INITIAL_PRODUCER_TRANSACTIONS,
  INITIAL_PRODUCER_NOTIFICATIONS,
} from './data/producerData';
import {
  INITIAL_ADMIN_USERS,
  INITIAL_ADMIN_PRODUCERS,
  INITIAL_ADMIN_BUYERS,
  INITIAL_ADMIN_INCIDENTS,
  INITIAL_PLATFORM_SETTINGS,
} from './data/adminData';

import { TopNavBar } from './components/marketplace/TopNavBar';
import { FilterSidebar } from './components/marketplace/FilterSidebar';
import { ProductCard } from './components/marketplace/ProductCard';
import { ProductDetailView } from './components/marketplace/ProductDetailView';
import { PreorderFlowModal } from './components/marketplace/PreorderFlowModal';
import { OrderTrackingView } from './components/marketplace/OrderTrackingView';
import { TraceabilityModal } from './components/marketplace/TraceabilityModal';
import { AboutView } from './components/marketplace/AboutView';
import { Footer } from './components/marketplace/Footer';

// Buyer Components
import { BuyerDashboardLayout } from './components/buyer/BuyerDashboardLayout';
import { BuyerPreorderDetailModal } from './components/buyer/BuyerPreorderDetailModal';
import { BuyerReceiptModal } from './components/buyer/BuyerReceiptModal';
import { BuyerNotificationsModal } from './components/buyer/BuyerNotificationsModal';

// Producer ERP Components
import { ProducerDashboardLayout } from './components/producer/ProducerDashboardLayout';

// Admin Components
import { AdminDashboardLayout } from './components/admin/AdminDashboardLayout';

// Auth Components
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { useAuth } from './context/AuthContext';
import { UserRoleType } from './types';

const EMPTY_PRODUCER_FINANCE: ProducerFinanceSummary = {
  revenusTotaux: 0,
  acomptesRecus: 0,
  soldesEnAttente: 0,
  revenusSecurisesPourcentage: 0,
  tauxVenteAvantRecolte: 0,
  pertesPostRecoltePourcentage: 0,
  panierMoyen: 0,
};

function safeGetStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (!saved || saved === 'undefined' || saved === 'null') return fallback;
    return JSON.parse(saved);
  } catch {
    return fallback;
  }
}

function getUserDataKey(uid: string | undefined, key: string): string {
  if (!uid || uid === 'demo-producer-modou' || uid === 'demo-buyer-cheikh' || uid === 'demo-admin-fatou') {
    return `agrilink_demo_${key}`;
  }
  return `agrilink_user_${uid}_${key}`;
}

export default function App() {
  const { user, profile, role, producerProfile, buyerProfile: authBuyerProfile } = useAuth();

  const isDemoProducer = profile?.uid === 'demo-producer-modou';
  const isDemoBuyer = profile?.uid === 'demo-buyer-cheikh';

  // Navigation State
  const [currentView, setCurrentView] = useState<
    'marketplace' | 'about' | 'detail' | 'tracking' | 'buyer' | 'producer' | 'admin' | 'login' | 'register'
  >('marketplace');
  const [currentBuyerTab, setCurrentBuyerTab] = useState<BuyerTab>('dashboard');
  const [currentAdminTab, setCurrentAdminTab] = useState<AdminTab>('vue-ensemble');

  // Persistence / States - Admin
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() =>
    safeGetStorage('agrilink_admin_users', INITIAL_ADMIN_USERS)
  );

  const [adminProducers, setAdminProducers] = useState<AdminProducer[]>(() =>
    safeGetStorage('agrilink_admin_producers', INITIAL_ADMIN_PRODUCERS)
  );

  const [adminBuyers, setAdminBuyers] = useState<AdminBuyer[]>(() =>
    safeGetStorage('agrilink_admin_buyers', INITIAL_ADMIN_BUYERS)
  );

  const [adminIncidents, setAdminIncidents] = useState<AdminIncident[]>(() =>
    safeGetStorage('agrilink_admin_incidents', INITIAL_ADMIN_INCIDENTS)
  );

  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(() =>
    safeGetStorage('agrilink_platform_settings', INITIAL_PLATFORM_SETTINGS)
  );

  // Products State (Marketplace catalog)
  const [products, setProducts] = useState<Product[]>(() =>
    safeGetStorage('agrilink_products', INITIAL_PRODUCTS)
  );

  // Selected items for modal or detail view
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [preorderModalProduct, setPreorderModalProduct] = useState<Product | null>(null);
  const [preorderInitialQty, setPreorderInitialQty] = useState<number>(1);
  const [traceabilityProduct, setTraceabilityProduct] = useState<Product | null>(null);

  // Buyer Specific Modal States
  const [selectedPreorderForModal, setSelectedPreorderForModal] = useState<Preorder | null>(null);
  const [selectedReceiptData, setSelectedReceiptData] = useState<{ preorder?: Preorder; payment?: PaymentRecord } | null>(null);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState<boolean>(false);

  // Persistence / States - Buyer (Scoped per user)
  const [preorders, setPreorders] = useState<Preorder[]>(() => {
    const isDemo = !profile?.uid || profile.uid === 'demo-buyer-cheikh';
    const key = getUserDataKey(profile?.uid, 'preorders');
    return safeGetStorage(key, isDemo ? INITIAL_PREORDERS : []);
  });

  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>(() => {
    const isDemo = !profile?.uid || profile.uid === 'demo-buyer-cheikh';
    const key = getUserDataKey(profile?.uid, 'deliveries');
    return safeGetStorage(key, isDemo ? INITIAL_DELIVERIES : []);
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const isDemo = !profile?.uid || profile.uid === 'demo-buyer-cheikh';
    const key = getUserDataKey(profile?.uid, 'payments');
    return safeGetStorage(key, isDemo ? INITIAL_PAYMENTS : []);
  });

  const [buyerProfile, setBuyerProfile] = useState<BuyerProfile>(() => {
    const isDemo = !profile?.uid || profile.uid === 'demo-buyer-cheikh';
    const key = getUserDataKey(profile?.uid, 'buyer_profile');
    return safeGetStorage(key, isDemo ? INITIAL_BUYER_PROFILE : {
      id: profile?.uid || 'buyer-new',
      nom: profile?.lastName || 'Utilisateur',
      prenom: profile?.firstName || '',
      email: profile?.email || '',
      telephone: profile?.phone || '',
      typeAcheteur: (authBuyerProfile?.buyerType === 'RESTAURANT' ? 'Restaurant / Traiteur' : authBuyerProfile?.buyerType === 'HOTEL' ? 'Hôtel' : authBuyerProfile?.buyerType === 'SUPERMARKET' ? 'Supermarché' : authBuyerProfile?.buyerType === 'PROFESSIONAL' ? 'Grossiste / Exportateur' : 'Particulier') as any,
      nomEntreprise: authBuyerProfile?.companyName || `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim(),
      adresseLivraison: authBuyerProfile?.address || '',
      ville: authBuyerProfile?.city || 'Dakar',
      quartier: authBuyerProfile?.city || 'Dakar',
      region: 'Dakar',
      codeClient: `CL-${(profile?.uid || 'SN').slice(-6).toUpperCase()}`,
      dateInscription: new Date().toLocaleDateString('fr-FR'),
    });
  });

  const [notifications, setNotifications] = useState<BuyerNotification[]>(() => {
    const isDemo = !profile?.uid || profile.uid === 'demo-buyer-cheikh';
    const key = getUserDataKey(profile?.uid, 'notifications');
    return safeGetStorage(key, isDemo ? INITIAL_NOTIFICATIONS : []);
  });

  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>(() => {
    const isDemo = !profile?.uid || profile.uid === 'demo-buyer-cheikh';
    const key = getUserDataKey(profile?.uid, 'favorites');
    return safeGetStorage(key, isDemo ? ['tomates-cerises-sangalkam', 'mangues-kent-niayes'] : []);
  });

  const [selectedPreorderId, setSelectedPreorderId] = useState<string>('preorder-sample-1');

  // Persistence / States - Producer ERP (Scoped per user)
  const [farmProfile, setFarmProfile] = useState<FarmProfile>(() => {
    const isDemo = profile?.uid === 'demo-producer-modou';
    const key = getUserDataKey(profile?.uid, 'farm_profile');
    return safeGetStorage(key, isDemo ? INITIAL_FARM_PROFILE : {
      id: profile?.uid || 'farm-new',
      nomExploitation: producerProfile?.farmName || `Ferme ${profile?.firstName || ''}`,
      gerant: `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || 'Producteur',
      description: producerProfile?.description || 'Nouvelle exploitation agricole partenaire Agri-Link.',
      localisation: producerProfile?.location || 'Sénégal',
      region: (producerProfile?.region as any) || 'Niayes',
      superficie: 1.0,
      uniteSuperficie: 'ha',
      typeProduction: 'Raisonné / Agroécologique',
      telephone: profile?.phone || '',
      email: profile?.email || '',
      anneeCreation: new Date().getFullYear(),
      certifications: ['En cours de certification'],
      informationsComplementaires: 'Nouvelle exploitation inscrite.',
    });
  });

  const [plots, setPlots] = useState<Plot[]>(() => {
    const isDemo = profile?.uid === 'demo-producer-modou';
    const key = getUserDataKey(profile?.uid, 'plots');
    return safeGetStorage(key, isDemo ? INITIAL_PLOTS : []);
  });

  const [productions, setProductions] = useState<CropProduction[]>(() => {
    const isDemo = profile?.uid === 'demo-producer-modou';
    const key = getUserDataKey(profile?.uid, 'productions');
    return safeGetStorage(key, isDemo ? INITIAL_PRODUCTIONS : []);
  });

  const [stockItems, setStockItems] = useState<StockItem[]>(() => {
    const isDemo = profile?.uid === 'demo-producer-modou';
    const key = getUserDataKey(profile?.uid, 'stock_items');
    return safeGetStorage(key, isDemo ? INITIAL_STOCK_ITEMS : []);
  });

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    const isDemo = profile?.uid === 'demo-producer-modou';
    const key = getUserDataKey(profile?.uid, 'stock_movements');
    return safeGetStorage(key, isDemo ? INITIAL_STOCK_MOVEMENTS : []);
  });

  const [producerOrders, setProducerOrders] = useState<ProducerOrder[]>(() => {
    const isDemo = profile?.uid === 'demo-producer-modou';
    const key = getUserDataKey(profile?.uid, 'producer_orders');
    return safeGetStorage(key, isDemo ? INITIAL_PRODUCER_ORDERS : []);
  });

  const [producerDeliveries, setProducerDeliveries] = useState<ProducerDelivery[]>(() => {
    const isDemo = profile?.uid === 'demo-producer-modou';
    const key = getUserDataKey(profile?.uid, 'producer_deliveries');
    return safeGetStorage(key, isDemo ? INITIAL_PRODUCER_DELIVERIES : []);
  });

  const [traceabilityLots, setTraceabilityLots] = useState<TraceabilityLot[]>(() => {
    const isDemo = profile?.uid === 'demo-producer-modou';
    const key = getUserDataKey(profile?.uid, 'traceability_lots');
    return safeGetStorage(key, isDemo ? INITIAL_TRACEABILITY_LOTS : []);
  });

  const [financeSummary, setFinanceSummary] = useState<ProducerFinanceSummary>(() => {
    const isDemo = profile?.uid === 'demo-producer-modou';
    const key = getUserDataKey(profile?.uid, 'producer_finance');
    return safeGetStorage(key, isDemo ? INITIAL_PRODUCER_FINANCE : EMPTY_PRODUCER_FINANCE);
  });

  const [producerTransactions, setProducerTransactions] = useState<FinancialTransaction[]>(() => {
    const isDemo = profile?.uid === 'demo-producer-modou';
    const key = getUserDataKey(profile?.uid, 'producer_transactions');
    return safeGetStorage(key, isDemo ? INITIAL_PRODUCER_TRANSACTIONS : []);
  });

  const [producerNotifications, setProducerNotifications] = useState<ProducerNotification[]>(() => {
    const isDemo = profile?.uid === 'demo-producer-modou';
    const key = getUserDataKey(profile?.uid, 'producer_notifications');
    return safeGetStorage(key, isDemo ? INITIAL_PRODUCER_NOTIFICATIONS : []);
  });

  // Dynamic user data switch when user logs in, registers, or changes account
  useEffect(() => {
    const uid = profile?.uid;
    const isDemoProd = uid === 'demo-producer-modou';
    const isDemoBuy = uid === 'demo-buyer-cheikh';

    if (profile?.role === 'PRODUCER') {
      const pKey = (k: string) => getUserDataKey(uid, k);
      setPlots(safeGetStorage(pKey('plots'), isDemoProd ? INITIAL_PLOTS : []));
      setProductions(safeGetStorage(pKey('productions'), isDemoProd ? INITIAL_PRODUCTIONS : []));
      setStockItems(safeGetStorage(pKey('stock_items'), isDemoProd ? INITIAL_STOCK_ITEMS : []));
      setStockMovements(safeGetStorage(pKey('stock_movements'), isDemoProd ? INITIAL_STOCK_MOVEMENTS : []));
      setProducerOrders(safeGetStorage(pKey('producer_orders'), isDemoProd ? INITIAL_PRODUCER_ORDERS : []));
      setProducerDeliveries(safeGetStorage(pKey('producer_deliveries'), isDemoProd ? INITIAL_PRODUCER_DELIVERIES : []));
      setTraceabilityLots(safeGetStorage(pKey('traceability_lots'), isDemoProd ? INITIAL_TRACEABILITY_LOTS : []));
      setFinanceSummary(safeGetStorage(pKey('producer_finance'), isDemoProd ? INITIAL_PRODUCER_FINANCE : EMPTY_PRODUCER_FINANCE));
      setProducerTransactions(safeGetStorage(pKey('producer_transactions'), isDemoProd ? INITIAL_PRODUCER_TRANSACTIONS : []));
      setProducerNotifications(safeGetStorage(pKey('producer_notifications'), isDemoProd ? INITIAL_PRODUCER_NOTIFICATIONS : []));

      const defaultFarm: FarmProfile = isDemoProd ? INITIAL_FARM_PROFILE : {
        id: uid || 'farm-new',
        nomExploitation: producerProfile?.farmName || `Ferme de ${profile.firstName}`,
        gerant: `${profile.firstName} ${profile.lastName}`.trim(),
        description: producerProfile?.description || 'Nouvelle exploitation agricole partenaire Agri-Link.',
        localisation: producerProfile?.location || 'Sénégal',
        region: (producerProfile?.region as any) || 'Niayes',
        superficie: 1.0,
        uniteSuperficie: 'ha',
        typeProduction: 'Raisonné / Agroécologique',
        telephone: profile.phone || '',
        email: profile.email,
        anneeCreation: new Date().getFullYear(),
        certifications: ['En cours de certification'],
        informationsComplementaires: 'Exploitation nouvellement inscrite.',
      };
      setFarmProfile(safeGetStorage(pKey('farm_profile'), defaultFarm));
    } else if (profile?.role === 'BUYER') {
      const bKey = (k: string) => getUserDataKey(uid, k);
      setPreorders(safeGetStorage(bKey('preorders'), isDemoBuy ? INITIAL_PREORDERS : []));
      setDeliveries(safeGetStorage(bKey('deliveries'), isDemoBuy ? INITIAL_DELIVERIES : []));
      setPayments(safeGetStorage(bKey('payments'), isDemoBuy ? INITIAL_PAYMENTS : []));
      setNotifications(safeGetStorage(bKey('notifications'), isDemoBuy ? INITIAL_NOTIFICATIONS : []));
      setFavoriteProductIds(safeGetStorage(bKey('favorites'), isDemoBuy ? ['tomates-cerises-sangalkam', 'mangues-kent-niayes'] : []));

      const defaultBuyer: BuyerProfile = isDemoBuy ? INITIAL_BUYER_PROFILE : {
        id: uid || 'buyer-new',
        nom: profile.lastName,
        prenom: profile.firstName,
        email: profile.email,
        telephone: profile.phone || '',
        typeAcheteur: (authBuyerProfile?.buyerType === 'RESTAURANT' ? 'Restaurant / Traiteur' : authBuyerProfile?.buyerType === 'HOTEL' ? 'Hôtel' : authBuyerProfile?.buyerType === 'SUPERMARKET' ? 'Supermarché' : authBuyerProfile?.buyerType === 'PROFESSIONAL' ? 'Grossiste / Exportateur' : 'Particulier') as any,
        nomEntreprise: authBuyerProfile?.companyName || `${profile.firstName} ${profile.lastName}`.trim(),
        adresseLivraison: authBuyerProfile?.address || '',
        ville: authBuyerProfile?.city || 'Dakar',
        quartier: authBuyerProfile?.city || 'Dakar',
        region: 'Dakar',
        codeClient: `CL-${(uid || 'SN').slice(-6).toUpperCase()}`,
        dateInscription: new Date().toLocaleDateString('fr-FR'),
      };
      setBuyerProfile(safeGetStorage(bKey('buyer_profile'), defaultBuyer));
    }
  }, [profile?.uid, profile?.role]);

  // Save changes under user-specific storage keys
  useEffect(() => {
    localStorage.setItem('agrilink_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    const key = getUserDataKey(profile?.uid, 'preorders');
    localStorage.setItem(key, JSON.stringify(preorders));
  }, [preorders, profile?.uid]);

  useEffect(() => {
    const key = getUserDataKey(profile?.uid, 'deliveries');
    localStorage.setItem(key, JSON.stringify(deliveries));
  }, [deliveries, profile?.uid]);

  useEffect(() => {
    const key = getUserDataKey(profile?.uid, 'payments');
    localStorage.setItem(key, JSON.stringify(payments));
  }, [payments, profile?.uid]);

  useEffect(() => {
    const key = getUserDataKey(profile?.uid, 'buyer_profile');
    localStorage.setItem(key, JSON.stringify(buyerProfile));
  }, [buyerProfile, profile?.uid]);

  useEffect(() => {
    const key = getUserDataKey(profile?.uid, 'notifications');
    localStorage.setItem(key, JSON.stringify(notifications));
  }, [notifications, profile?.uid]);

  useEffect(() => {
    const key = getUserDataKey(profile?.uid, 'favorites');
    localStorage.setItem(key, JSON.stringify(favoriteProductIds));
  }, [favoriteProductIds, profile?.uid]);

  useEffect(() => {
    const key = getUserDataKey(profile?.uid, 'farm_profile');
    localStorage.setItem(key, JSON.stringify(farmProfile));
  }, [farmProfile, profile?.uid]);

  useEffect(() => {
    const key = getUserDataKey(profile?.uid, 'plots');
    localStorage.setItem(key, JSON.stringify(plots));
  }, [plots, profile?.uid]);

  useEffect(() => {
    const key = getUserDataKey(profile?.uid, 'productions');
    localStorage.setItem(key, JSON.stringify(productions));
  }, [productions, profile?.uid]);

  useEffect(() => {
    const key = getUserDataKey(profile?.uid, 'stock_items');
    localStorage.setItem(key, JSON.stringify(stockItems));
  }, [stockItems, profile?.uid]);

  useEffect(() => {
    const key = getUserDataKey(profile?.uid, 'stock_movements');
    localStorage.setItem(key, JSON.stringify(stockMovements));
  }, [stockMovements, profile?.uid]);

  useEffect(() => {
    const key = getUserDataKey(profile?.uid, 'producer_orders');
    localStorage.setItem(key, JSON.stringify(producerOrders));
  }, [producerOrders, profile?.uid]);

  useEffect(() => {
    const key = getUserDataKey(profile?.uid, 'producer_deliveries');
    localStorage.setItem(key, JSON.stringify(producerDeliveries));
  }, [producerDeliveries, profile?.uid]);

  useEffect(() => {
    const key = getUserDataKey(profile?.uid, 'traceability_lots');
    localStorage.setItem(key, JSON.stringify(traceabilityLots));
  }, [traceabilityLots, profile?.uid]);

  useEffect(() => {
    const key = getUserDataKey(profile?.uid, 'producer_finance');
    localStorage.setItem(key, JSON.stringify(financeSummary));
  }, [financeSummary, profile?.uid]);

  useEffect(() => {
    const key = getUserDataKey(profile?.uid, 'producer_transactions');
    localStorage.setItem(key, JSON.stringify(producerTransactions));
  }, [producerTransactions, profile?.uid]);

  useEffect(() => {
    const key = getUserDataKey(profile?.uid, 'producer_notifications');
    localStorage.setItem(key, JSON.stringify(producerNotifications));
  }, [producerNotifications, profile?.uid]);

  // Synchronize authenticated profile with local application state when user registers or changes
  useEffect(() => {
    if (!profile) return;

    const fullName = `${profile.firstName} ${profile.lastName}`.trim() || 'Utilisateur';

    // 1. Sync Farm Profile if Producer
    if (profile.role === 'PRODUCER') {
      setFarmProfile((prev) => ({
        ...prev,
        nomExploitation: producerProfile?.farmName || prev.nomExploitation || 'Ferme Agro-Écologique',
        nomProducteur: fullName,
        email: profile.email,
        telephone: profile.phone || prev.telephone,
        localisation: producerProfile?.location || prev.localisation || 'Sangalkam, Niayes',
      }));

      // Also ensure producer is in adminProducers list
      setAdminProducers((prev) => {
        const exists = prev.some((p) => p.email.toLowerCase() === profile.email.toLowerCase() || p.id === profile.uid);
        if (exists) return prev;
        const newProducer: AdminProducer = {
          id: profile.uid || `prod-${Date.now()}`,
          nom: producerProfile?.farmName || `Ferme de ${profile.firstName}`,
          exploitation: producerProfile?.farmName || `Ferme de ${profile.firstName}`,
          gerant: fullName,
          localisation: producerProfile?.location || 'Sangalkam, Rufisque',
          region: producerProfile?.region || 'Dakar / Niayes',
          telephone: profile.phone,
          email: profile.email,
          nombreProduits: 0,
          nombreCommandes: 0,
          statutValidation: 'En attente de validation',
          dateInscription: new Date().toISOString().split('T')[0],
          superficie: 3.5,
          certifications: ['Origine Locale Contrôlée'],
          typeProduction: producerProfile?.description || 'Maraîchage diversifié',
        };
        return [newProducer, ...prev];
      });
    }

    // 2. Sync Buyer Profile if Buyer
    if (profile.role === 'BUYER') {
      setBuyerProfile((prev) => ({
        ...prev,
        nom: fullName,
        email: profile.email,
        telephone: profile.phone || prev.telephone,
        adresse: authBuyerProfile?.address || prev.adresse,
        ville: authBuyerProfile?.city || prev.ville,
        categorie: (authBuyerProfile?.buyerType === 'RESTAURANT' ? 'Restaurant' : authBuyerProfile?.buyerType === 'HOTEL' ? 'Hôtel' : authBuyerProfile?.buyerType === 'SUPERMARKET' ? 'Supermarché' : authBuyerProfile?.buyerType === 'PROFESSIONAL' ? 'Grossiste' : 'Particulier') as any,
        nomEtablissement: authBuyerProfile?.companyName || prev.nomEtablissement,
      }));

      // Also ensure buyer is in adminBuyers list
      setAdminBuyers((prev) => {
        const exists = prev.some((b) => b.email.toLowerCase() === profile.email.toLowerCase() || b.id === profile.uid);
        if (exists) return prev;
        const newBuyer: AdminBuyer = {
          id: profile.uid || `buy-${Date.now()}`,
          nom: profile.lastName,
          prenom: profile.firstName,
          typeAcheteur: authBuyerProfile?.buyerType === 'RESTAURANT' ? 'Restaurant' : authBuyerProfile?.buyerType === 'HOTEL' ? 'Hôtel' : authBuyerProfile?.buyerType === 'SUPERMARKET' ? 'Supermarché' : authBuyerProfile?.buyerType === 'PROFESSIONAL' ? 'Professionnel' : 'Particulier',
          email: profile.email,
          telephone: profile.phone,
          nombreCommandes: 0,
          montantDepense: 0,
          statut: 'Actif',
          dateInscription: new Date().toISOString().split('T')[0],
          adresse: authBuyerProfile?.address || 'Dakar',
          ville: authBuyerProfile?.city || 'Dakar',
        };
        return [newBuyer, ...prev];
      });
    }

    // 3. Ensure user is in adminUsers list
    setAdminUsers((prev) => {
      const exists = prev.some((u) => u.email.toLowerCase() === profile.email.toLowerCase() || u.id === profile.uid);
      if (exists) return prev;
      const newUser: AdminUser = {
        id: profile.uid || `usr-${Date.now()}`,
        nom: profile.lastName,
        prenom: profile.firstName,
        email: profile.email,
        telephone: profile.phone,
        role: profile.role === 'ADMIN' ? 'Administrateur' : profile.role === 'PRODUCER' ? 'Producteur' : 'Acheteur',
        dateInscription: new Date().toISOString().split('T')[0],
        statut: 'Actif',
        organisation: profile.role === 'PRODUCER' ? producerProfile?.farmName : authBuyerProfile?.companyName,
        localisation: producerProfile?.location || authBuyerProfile?.city || 'Sénégal',
        commandesCount: 0,
        totalDepenseOuVendu: 0,
      };
      return [newUser, ...prev];
    });
  }, [profile, producerProfile, authBuyerProfile]);

  // Favorite Products list
  const favoriteProducts = useMemo(() => {
    return products.filter((p) => favoriteProductIds.includes(p.id));
  }, [favoriteProductIds, products]);

  const handleToggleFavorite = (productId: string) => {
    setFavoriteProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    location: '',
    availability: [],
    search: '',
  });

  // Filtered Products Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search term filter
      if (filters.search.trim() !== '') {
        const query = filters.search.toLowerCase().trim();
        const matchName = product.nom.toLowerCase().includes(query);
        const matchDesc = product.description.toLowerCase().includes(query);
        const matchProd = product.producteur.toLowerCase().includes(query);
        const matchLoc = product.localisation.toLowerCase().includes(query);
        const matchCat = product.categorie.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchProd && !matchLoc && !matchCat) {
          return false;
        }
      }

      // Categories filter
      if (filters.categories.length > 0) {
        if (!filters.categories.includes(product.categorie)) {
          return false;
        }
      }

      // Location filter
      if (filters.location !== '') {
        const locLower = filters.location.toLowerCase();
        const matchRegion = product.region.toLowerCase() === locLower;
        const matchLocString = product.localisation.toLowerCase().includes(locLower);
        if (!matchRegion && !matchLocString) {
          return false;
        }
      }

      // Availability filter
      if (filters.availability.length > 0) {
        if (!filters.availability.includes(product.typeDisponibilite)) {
          return false;
        }
      }

      return true;
    });
  }, [filters, products]);

  // Producer filtered products for ERP
  const producerVisibleProducts = useMemo(() => {
    if (isDemoProducer) {
      return products;
    }
    return products.filter(
      (p) =>
        p.producteur === farmProfile.nomExploitation ||
        p.producteur === farmProfile.gerant ||
        (profile?.uid && (p as any).producteurId === profile.uid)
    );
  }, [products, isDemoProducer, farmProfile, profile?.uid]);

  // Navigation Handlers
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickPreorder = (product: Product) => {
    if (!user) {
      setCurrentView('login');
      return;
    }
    setPreorderModalProduct(product);
    setPreorderInitialQty(product.quantiteMinimale || 1);
  };

  const handleStartPreorderFromDetail = (product: Product, quantity: number) => {
    if (!user) {
      setCurrentView('login');
      return;
    }
    setPreorderModalProduct(product);
    setPreorderInitialQty(quantity);
  };

  // Buyer Preorder Confirmation Handlers (Also updates Producer ERP pipeline!)
  const handleOrderConfirmed = (newPreorder: Preorder) => {
    // 1. Add Preorder for Buyer
    setPreorders((prev) => [newPreorder, ...prev]);
    setSelectedPreorderId(newPreorder.id);

    // 2. Generate Payment record for deposit
    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      preorderId: newPreorder.id,
      numeroFacture: `FAC-${Date.now().toString().slice(-6)}`,
      numeroTransaction: `TX-${newPreorder.moyenPaiement.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
      produitNom: newPreorder.produitNom,
      montant: newPreorder.acompte,
      moyenPaiement: newPreorder.moyenPaiement,
      typePaiement: 'acompte',
      statut: 'validé',
      datePaiement: "Aujourd'hui",
    };
    setPayments((prev) => [newPayment, ...prev]);

    // 3. Generate Delivery Tracking record for buyer
    const newDelivery: DeliveryRecord = {
      id: `deliv-${Date.now()}`,
      preorderId: newPreorder.id,
      numeroCommande: newPreorder.numeroCommande,
      codeSuivi: `TRK-SN-${Math.floor(100000 + Math.random() * 900000)}`,
      produitNom: newPreorder.produitNom,
      produitImage: newPreorder.produitImage,
      quantite: newPreorder.quantite,
      unite: newPreorder.unite,
      producteur: newPreorder.producteur,
      statut: 'en_preparation',
      dateEstimee: newPreorder.datePrevueDisponibilite,
      lieuLivraison: newPreorder.lieuLivraison,
      transporteurNom: 'Diallo Logistique Teranga',
      transporteurTel: '+221 77 412 88 99',
    };
    setDeliveries((prev) => [newDelivery, ...prev]);

    // 4. Add Notification for Buyer
    const newNotif: BuyerNotification = {
      id: `notif-${Date.now()}`,
      titre: 'Acompte Validé & Précommande Confirmée',
      message: `Votre précommande ${newPreorder.numeroCommande} pour ${newPreorder.produitNom} (${newPreorder.quantite} ${newPreorder.unite}) a bien été réservée.`,
      date: "À l'instant",
      type: 'payment',
      read: false,
      orderId: newPreorder.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // 5. SYNCHRONIZE WITH PRODUCER ERP PIPELINE:
    // A) Create Producer Order
    const newProducerOrder: ProducerOrder = {
      id: `prod-order-${Date.now()}`,
      numeroCommande: newPreorder.numeroCommande,
      produitId: newPreorder.produitId,
      produitNom: newPreorder.produitNom,
      produitImage: newPreorder.produitImage,
      acheteurNom: `${buyerProfile.prenom} ${buyerProfile.nom}`,
      acheteurTel: buyerProfile.telephone,
      acheteurAdresse: newPreorder.lieuLivraison,
      quantite: newPreorder.quantite,
      unite: newPreorder.unite,
      prixUnitaire: newPreorder.prixUnitaire,
      montantTotal: newPreorder.montantTotal,
      acomptePaye: newPreorder.acompte,
      soldeRestant: newPreorder.soldeRestant,
      acomptePct: newPreorder.acomptePct || 30,
      statutAcompte: 'payé',
      statut: 'Acompte payé',
      dateCommande: "Aujourd'hui",
      datePrevueDisponibilite: newPreorder.datePrevueDisponibilite,
      moyenPaiement: newPreorder.moyenPaiement,
      transporteurNom: 'Diallo Logistique Teranga',
      transporteurTel: '+221 77 412 88 99',
    };
    setProducerOrders((prev) => [newProducerOrder, ...prev]);

    // B) Create Producer Delivery Record
    const newProdDelivery: ProducerDelivery = {
      id: `p-deliv-${Date.now()}`,
      commandeId: newProducerOrder.id,
      numeroCommande: newPreorder.numeroCommande,
      acheteurNom: `${buyerProfile.prenom} ${buyerProfile.nom}`,
      acheteurTel: buyerProfile.telephone,
      adresseLivraison: newPreorder.lieuLivraison,
      produitNom: newPreorder.produitNom,
      produitImage: newPreorder.produitImage,
      quantite: newPreorder.quantite,
      unite: newPreorder.unite,
      transporteurNom: 'Diallo Logistique Teranga',
      transporteurTel: '+221 77 412 88 99',
      statut: 'À préparer',
      datePrevue: newPreorder.datePrevueDisponibilite,
      codeSuivi: `TRK-SN-${Math.floor(100000 + Math.random() * 900000)}`,
    };
    setProducerDeliveries((prev) => [newProdDelivery, ...prev]);

    // C) Reserve stock & update items
    setStockItems((prev) =>
      prev.map((item) => {
        if (
          item.produitNom.toLowerCase().includes(newPreorder.produitNom.toLowerCase().slice(0, 5))
        ) {
          const newReserve = item.stockReserve + newPreorder.quantite;
          return {
            ...item,
            stockReserve: newReserve,
          };
        }
        return item;
      })
    );

    // D) Log Stock Movement
    const newStockMov: StockMovement = {
      id: `mov-res-${Date.now()}`,
      stockItemId: 'stock-1',
      produitNom: newPreorder.produitNom,
      typeMouvement: 'Réservation',
      quantite: newPreorder.quantite,
      unite: newPreorder.unite,
      motif: `Réservation Précommande #${newPreorder.numeroCommande}`,
      date: "À l'instant",
      auteur: `${buyerProfile.prenom} ${buyerProfile.nom}`,
    };
    setStockMovements((prev) => [newStockMov, ...prev]);

    // E) Producer Transaction (Acompte reçu)
    const newProdTx: FinancialTransaction = {
      id: `tx-prod-${Date.now()}`,
      date: "Aujourd'hui",
      libelle: `Acompte 30% #${newPreorder.numeroCommande} - ${newPreorder.produitNom}`,
      type: 'Acompte',
      montant: newPreorder.acompte,
      moyenPaiement: newPreorder.moyenPaiement,
      statut: 'Crédité (Séquestre)',
      reference: `SEQ-${newPreorder.numeroCommande}`,
    };
    setProducerTransactions((prev) => [newProdTx, ...prev]);

    // F) Update Finance Summary
    setFinanceSummary((prev) => ({
      ...prev,
      acomptesRecus: prev.acomptesRecus + newPreorder.acompte,
      soldesEnAttente: prev.soldesEnAttente + newPreorder.soldeRestant,
    }));

    // G) Add Producer Notification
    const newProdNotif: ProducerNotification = {
      id: `pnotif-${Date.now()}`,
      titre: `Nouvelle précommande reçue #${newPreorder.numeroCommande}`,
      message: `${buyerProfile.prenom} ${buyerProfile.nom} a réservé ${newPreorder.quantite} ${newPreorder.unite} de ${newPreorder.produitNom}. Acompte de ${newPreorder.acompte.toLocaleString('fr-FR')} FCFA validé.`,
      date: "À l'instant",
      type: 'order',
      read: false,
    };
    setProducerNotifications((prev) => [newProdNotif, ...prev]);
  };

  const handleNavigateToTracking = (preorder: Preorder) => {
    setPreorderModalProduct(null);
    setSelectedPreorderId(preorder.id);
    setCurrentView('buyer');
    setCurrentBuyerTab('preorders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmDeliveryFromBuyer = (preorderId: string) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.preorderId === preorderId ? { ...d, statut: 'livree' } : d))
    );
    setPreorders((prev) =>
      prev.map((p) =>
        p.id === preorderId
          ? { ...p, statutCommande: 'Livrée', statutPaiementAcompte: 'payé' }
          : p
      )
    );

    // Update Producer Deliveries & Orders
    setProducerDeliveries((prev) =>
      prev.map((pd) => (pd.id === preorderId ? { ...pd, statut: 'Livrée' } : pd))
    );
    setProducerOrders((prev) =>
      prev.map((po) => (po.id === preorderId ? { ...po, statut: 'Livrée' } : po))
    );

    // Add Buyer notif
    const newNotif: BuyerNotification = {
      id: `notif-deliv-${Date.now()}`,
      titre: 'Livraison Validée',
      message: `Vous avez confirmé la bonne réception de votre commande. Merci de votre confiance !`,
      date: "À l'instant",
      type: 'delivery',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Producer ERP Mutators
  const handleUpdateFarmProfile = (updatedProfile: FarmProfile) => {
    setFarmProfile(updatedProfile);
  };

  const handleAddPlot = (newPlot: Plot) => {
    setPlots((prev) => [newPlot, ...prev]);
    // Notification
    const notif: ProducerNotification = {
      id: `notif-plot-${Date.now()}`,
      titre: 'Nouvelle Parcelle Enregistrée',
      message: `La parcelle "${newPlot.nom}" (${newPlot.superficie} ${newPlot.unite}) a été ajoutée à l'exploitation.`,
      date: "À l'instant",
      type: 'harvest',
      read: false,
    };
    setProducerNotifications((prev) => [notif, ...prev]);
  };

  const handleUpdatePlotStatus = (plotId: string, status: PlotStatus) => {
    setPlots((prev) =>
      prev.map((p) => (p.id === plotId ? { ...p, statut: status } : p))
    );
  };

  const handleAddProduction = (newProd: CropProduction) => {
    setProductions((prev) => [newProd, ...prev]);
    // Notification
    const notif: ProducerNotification = {
      id: `notif-prod-${Date.now()}`,
      titre: 'Nouveau Cycle de Production Planifié',
      message: `Cycle de ${newProd.produitNom} (${newProd.quantitePrevue} ${newProd.unite}) planifié sur ${newProd.parcelleNom}.`,
      date: "À l'instant",
      type: 'harvest',
      read: false,
    };
    setProducerNotifications((prev) => [notif, ...prev]);
  };

  const handleUpdateProductionStatus = (
    prodId: string,
    status: ProductionStatus
  ) => {
    setProductions((prev) =>
      prev.map((p) => (p.id === prodId ? { ...p, statut: status } : p))
    );
  };

  const handleUpdateProduction = (updatedProd: CropProduction) => {
    setProductions((prev) =>
      prev.map((p) => (p.id === updatedProd.id ? updatedProd : p))
    );
    const notif: ProducerNotification = {
      id: `notif-prod-up-${Date.now()}`,
      titre: 'Cycle de Production Mis à Jour',
      message: `Mise à jour effectuée pour ${updatedProd.produitNom} (Statut: ${updatedProd.statut}, Récolté: ${updatedProd.quantiteRecoltee} ${updatedProd.unite}).`,
      date: "À l'instant",
      type: 'harvest',
      read: false,
    };
    setProducerNotifications((prev) => [notif, ...prev]);
  };

  const handleAddProductAsPreorder = (
    newProduct: Product,
    productionId?: string
  ) => {
    // 1. Add to Marketplace catalog
    setProducts((prev) => [newProduct, ...prev]);

    // 2. If tied to a production, mark it as published
    if (productionId) {
      setProductions((prev) =>
        prev.map((p) =>
          p.id === productionId ? { ...p, isPreorderPublished: true } : p
        )
      );
    }

    // 3. Create or update a StockItem entry
    const newStockItem: StockItem = {
      id: `stock-${Date.now()}`,
      produitId: newProduct.id,
      produitNom: newProduct.nom,
      categorie: newProduct.categorie,
      image: newProduct.image,
      stockTotal: newProduct.quantitePrevue,
      stockReserve: 0,
      unite: newProduct.unite,
      seuilAlerte: Math.round(newProduct.quantitePrevue * 0.15),
      prixUnitaire: newProduct.prix,
      statut: 'Normal',
      dernierMouvementDate: "Aujourd'hui",
    };
    setStockItems((prev) => [newStockItem, ...prev]);

    // 4. Create Traceability Lot
    const newLot: TraceabilityLot = {
      id: `lot-${Date.now()}`,
      numeroLot: `LOT-${Date.now().toString().slice(-6)}`,
      produitNom: newProduct.nom,
      categorie: newProduct.categorie,
      variete: 'Sahel Bio F1',
      dateProduction: "Aujourd'hui",
      dateRecolte: newProduct.dateDisponibilite,
      dateConditionnement: newProduct.dateDisponibilite,
      dateLivraisonEstimee: newProduct.dateDisponibilite,
      quantiteLot: newProduct.quantitePrevue,
      unite: newProduct.unite,
      parcelleNom: 'Parcelle P1 - Zone Nord',
      producteurNom: farmProfile.gerant,
      exploitationNom: farmProfile.nomExploitation,
      localisation: farmProfile.localisation,
      region: farmProfile.region,
      intrantsBio: ['Compost organique végétal', 'Purin de neem bio'],
      methodeCulture: farmProfile.typeProduction,
      statut: 'en_culture',
      qrCodeDataString: `https://agrilink.sn/traceability/LOT-${Date.now()}`,
      certifications: ['Bio Sénégal', 'Agri-Link Garanti'],
    };
    setTraceabilityLots((prev) => [newLot, ...prev]);

    // 5. Notification
    const notif: ProducerNotification = {
      id: `notif-preorder-${Date.now()}`,
      titre: 'Offre de Précommande Publiée !',
      message: `Votre produit "${newProduct.nom}" (${newProduct.quantiteDisponible} ${newProduct.unite} à ${newProduct.prix} FCFA/${newProduct.unite}) est désormais en ligne sur la Marketplace.`,
      date: "À l'instant",
      type: 'preorder',
      read: false,
    };
    setProducerNotifications((prev) => [notif, ...prev]);
  };

  const handleAddStockMovement = (
    newMovement: StockMovement,
    stockItemId: string
  ) => {
    setStockMovements((prev) => [newMovement, ...prev]);
    setStockItems((prev) =>
      prev.map((item) => {
        if (item.id === stockItemId) {
          let updatedTotal = item.stockTotal;
          let updatedReserve = item.stockReserve;

          if (newMovement.typeMouvement === 'Entrée') {
            updatedTotal += newMovement.quantite;
          } else if (newMovement.typeMouvement === 'Sortie') {
            updatedTotal = Math.max(0, updatedTotal - newMovement.quantite);
          } else if (newMovement.typeMouvement === 'Réservation') {
            updatedReserve += newMovement.quantite;
          } else if (newMovement.typeMouvement === 'Libération') {
            updatedReserve = Math.max(0, updatedReserve - newMovement.quantite);
          }

          const updatedDispo = Math.max(0, updatedTotal - updatedReserve);

          return {
            ...item,
            stockTotal: updatedTotal,
            stockReserve: updatedReserve,
            statut: (updatedDispo <= item.seuilAlerte ? 'Stock faible' : 'Normal') as any,
            dernierMouvementDate: "Aujourd'hui",
          };
        }
        return item;
      })
    );
  };

  const handleUpdateProducerOrderStatus = (
    orderId: string,
    status: ProducerOrderStatus
  ) => {
    setProducerOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, statut: status } : o))
    );

    // Also sync with Deliveries & Buyer side
    setProducerDeliveries((prev) =>
      prev.map((d) =>
        d.orderId === orderId ? { ...d, statut: status } : d
      )
    );

    if (status === 'Livrée') {
      // Free remaining balance into revenue
      const order = producerOrders.find((o) => o.id === orderId);
      if (order) {
        setFinanceSummary((prev) => ({
          ...prev,
          revenusTotaux: prev.revenusTotaux + order.soldeRestant,
          soldesEnAttente: Math.max(0, prev.soldesEnAttente - order.soldeRestant),
        }));

        const finalTx: FinancialTransaction = {
          id: `tx-solde-${Date.now()}`,
          date: "Aujourd'hui",
          libelle: `Solde 70% #${order.numeroCommande} - ${order.produitNom}`,
          type: 'Solde',
          montant: order.soldeRestant,
          moyenPaiement: order.moyenPaiement,
          statut: 'Débloqué & Versé',
          reference: `SOL-${order.numeroCommande}`,
        };
        setProducerTransactions((prev) => [finalTx, ...prev]);
      }
    }
  };

  const handleUpdateProducerDeliveryStatus = (
    deliveryId: string,
    status: ProducerOrderStatus,
    dateLivree?: string
  ) => {
    setProducerDeliveries((prev) =>
      prev.map((d) =>
        d.id === deliveryId
          ? { ...d, statut: status, dateLivree: dateLivree || d.dateLivree }
          : d
      )
    );

    const delivery = producerDeliveries.find((d) => d.id === deliveryId);
    if (delivery) {
      handleUpdateProducerOrderStatus(delivery.orderId, status);
    }
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearReadNotifications = () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
  };

  const handleSimulateNotification = () => {
    const types: Array<{ type: BuyerNotification['type']; titre: string; message: string }> = [
      {
        type: 'harvest',
        titre: 'Récolte confirmée : Mangues Kent',
        message: 'Les Vergers du Baobab ont démarré la cueillette des mangues sélectionnées à Thiès.',
      },
      {
        type: 'payment',
        titre: 'Acompte Sécurisé Wave reçu',
        message: 'Votre transaction de 18 500 FCFA a été placée sous séquestre garanti Agri-Link.',
      },
      {
        type: 'delivery',
        titre: 'Chauffeur en route vers Dakar',
        message: 'Le transporteur Babacar Ndiaye a chargé votre commande de légumes frais.',
      },
    ];
    const picked = types[Math.floor(Math.random() * types.length)];
    const newNotif: BuyerNotification = {
      id: `notif-sim-${Date.now()}`,
      titre: picked.titre,
      message: picked.message,
      date: "À l'instant",
      type: picked.type,
      read: false,
      orderId: 'preorder-sample-1',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleSelectNotification = (notif: BuyerNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    setIsNotificationsModalOpen(false);
    if (notif.orderId) {
      const match = preorders.find((p) => p.id === notif.orderId);
      if (match) {
        setSelectedPreorderForModal(match);
      }
    }
    setCurrentView('buyer');
  };

  // Admin Mutations & Operations
  const handleUpdateUserStatus = (userId: string, status: UserAccountStatus) => {
    setAdminUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, statut: status } : u))
    );
  };

  const handleValidateProducer = (producerId: string) => {
    setAdminProducers((prev) =>
      prev.map((p) =>
        p.id === producerId ? { ...p, statutValidation: 'Validé' } : p
      )
    );
  };

  const handleRejectProducer = (producerId: string) => {
    setAdminProducers((prev) =>
      prev.map((p) =>
        p.id === producerId ? { ...p, statutValidation: 'Rejeté' } : p
      )
    );
  };

  const handleSuspendProducer = (producerId: string) => {
    setAdminProducers((prev) =>
      prev.map((p) =>
        p.id === producerId ? { ...p, statutValidation: 'Suspendu' } : p
      )
    );
  };

  const handleUpdateAdminDeliveryStatus = (
    deliveryId: string,
    status: ProducerDeliveryStatus
  ) => {
    setProducerDeliveries((prev) =>
      prev.map((d) => (d.id === deliveryId ? { ...d, statut: status } : d))
    );
  };

  const handleAuthSuccess = (targetRole: UserRoleType) => {
    if (targetRole === 'ADMIN') {
      setCurrentView('admin');
    } else if (targetRole === 'PRODUCER') {
      setCurrentView('producer');
    } else {
      setCurrentView('buyer');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f4] text-[#2b1700]">
      {/* Shared Top Navigation Bar (Hidden when inside full Producer ERP or Auth screens for dedicated focus) */}
      {currentView !== 'producer' && currentView !== 'login' && currentView !== 'register' && (
        <TopNavBar
          currentView={currentView}
          onNavigate={(view) => {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          searchQuery={filters.search}
          onSearchChange={(query) => {
            setFilters((prev) => ({ ...prev, search: query }));
            if (currentView !== 'marketplace') {
              setCurrentView('marketplace');
            }
          }}
          preordersCount={preorders.length}
          unreadNotificationsCount={unreadNotificationsCount}
          onOpenNotifications={() => setIsNotificationsModalOpen(true)}
          onOpenBuyerSpace={(tab = 'preorders') => {
            setCurrentView('buyer');
            setCurrentBuyerTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenProducerSpace={() => {
            setCurrentView('producer');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAdminSpace={() => {
            setCurrentView('admin');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          buyerName={profile ? `${profile.firstName} ${profile.lastName}` : `${buyerProfile.prenom} ${buyerProfile.nom}`}
          currentBuyerTab={currentBuyerTab}
        />
      )}

      {/* Main Content Area */}
      <main className={currentView !== 'producer' && currentView !== 'login' && currentView !== 'register' ? 'flex-grow pt-20' : 'flex-grow'}>
        {/* AUTH: LOGIN */}
        {currentView === 'login' && (
          <LoginPage
            onNavigate={(v) => {
              setCurrentView(v);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToRegister={() => setCurrentView('register')}
            onNavigateToMarketplace={() => setCurrentView('marketplace')}
            onLoginSuccess={handleAuthSuccess}
          />
        )}

        {/* AUTH: REGISTER */}
        {currentView === 'register' && (
          <RegisterPage
            onNavigate={(v) => {
              setCurrentView(v);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToLogin={() => setCurrentView('login')}
            onNavigateToMarketplace={() => setCurrentView('marketplace')}
            onRegisterSuccess={handleAuthSuccess}
          />
        )}

        {/* VIEW 1: À PROPOS (MISSION & IMPACT) */}
        {currentView === 'about' && (
          <AboutView
            onNavigateToMarketplace={(category) => {
              if (category) {
                setFilters({
                  categories: [category],
                  location: '',
                  availability: [],
                  search: '',
                });
              }
              setCurrentView('marketplace');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToRegister={() => {
              setCurrentView('register');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToTracking={() => {
              setCurrentView('tracking');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* VIEW 2: MARKETPLACE CATALOG (MAIN HOME VIEW) */}
        {currentView === 'marketplace' && (
          <div className="w-full">
            <div className="max-w-[1440px] w-full mx-auto px-3.5 sm:px-6 md:px-16 py-4 sm:py-6 flex flex-col md:flex-row gap-3 md:gap-8">
              {/* Sidebar with interactive filters */}
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                totalResults={filteredProducts.length}
              />

              {/* Product Grid Area */}
              <section className="flex-grow">
                {filteredProducts.length === 0 ? (
                  <div className="bg-white border border-[#c1c9be] rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined text-[48px] text-[#717970] mb-3">
                      search_off
                    </span>
                    <h3 className="font-['Montserrat'] text-[18px] sm:text-[20px] font-bold text-[#2b1700] mb-1">
                      Aucun produit ne correspond à votre recherche
                    </h3>
                    <p className="text-[13px] sm:text-[14px] text-[#414941] max-w-md mb-6">
                      Essayez de modifier vos filtres ou d'effectuer une recherche avec un autre terme.
                    </p>
                    <button
                      onClick={() =>
                        setFilters({
                          categories: [],
                          location: '',
                          availability: [],
                          search: '',
                        })
                      }
                      className="bg-[#164525] text-white px-6 py-2.5 rounded-full font-medium text-[14px] hover:bg-[#2f5d3a] transition-all cursor-pointer"
                    >
                      Effacer tous les filtres
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelectProduct={handleSelectProduct}
                        onQuickPreorder={handleQuickPreorder}
                        isFavorite={favoriteProductIds.includes(product.id)}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        )}

        {/* VIEW 3: PRODUCT DETAIL */}
        {currentView === 'detail' && selectedProduct && (
          <ProductDetailView
            product={selectedProduct}
            onBack={() => {
              setCurrentView('marketplace');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onStartPreorder={handleStartPreorderFromDetail}
            onOpenTraceabilityModal={(p) => setTraceabilityProduct(p)}
            isFavorite={favoriteProductIds.includes(selectedProduct.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {/* VIEW 4: ORDER TRACKING (LEGACY SHORTCUT) */}
        {currentView === 'tracking' && (
          <OrderTrackingView
            preorders={preorders}
            selectedPreorderId={selectedPreorderId}
            onSelectPreorder={setSelectedPreorderId}
            onBackToMarketplace={() => {
              setCurrentView('marketplace');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* VIEW 5: BUYER SPACE (ESPACE ACHETEUR COMPLET) */}
        {currentView === 'buyer' && (
          <BuyerDashboardLayout
            activeTab={currentBuyerTab}
            onTabChange={setCurrentBuyerTab}
            preorders={preorders}
            deliveries={deliveries}
            payments={payments}
            favoriteProducts={favoriteProducts}
            notifications={notifications}
            buyerProfile={{
              id: profile?.uid || buyerProfile?.id || 'unknown',
              prenom: profile?.firstName || buyerProfile?.prenom || 'Acheteur',
              nom: profile?.lastName || buyerProfile?.nom || '',
              email: profile?.email || buyerProfile?.email || '',
              telephone: profile?.phone || buyerProfile?.telephone || '',
              typeAcheteur: (buyerProfile as any)?.buyerType || buyerProfile?.typeAcheteur || 'INDIVIDUAL',
              nomEntreprise: (buyerProfile as any)?.companyName || buyerProfile?.nomEntreprise || '',
              ninea: buyerProfile?.ninea || '',
              adresse: (buyerProfile as any)?.address || buyerProfile?.adresse || '',
              ville: (buyerProfile as any)?.city || buyerProfile?.ville || '',
              region: buyerProfile?.region || 'Dakar',
              preferencesCommunication: buyerProfile?.preferencesCommunication || { email: true, sms: false, whatsapp: false },
              dateInscription: profile?.createdAt || buyerProfile?.dateInscription || new Date().toISOString(),
              statutCompte: profile?.status === 'ACTIVE' ? 'actif' : 'en_attente',
              codeClient: buyerProfile?.codeClient || `CL-${(profile?.uid || '1234').substring(0, 4).toUpperCase()}`,
            }}
            onUpdateProfile={setBuyerProfile}
            onSelectPreorder={(po) => setSelectedPreorderForModal(po)}
            onOpenReceipt={(data) => setSelectedReceiptData(data)}
            onConfirmDelivery={handleConfirmDeliveryFromBuyer}
            onSelectProduct={handleSelectProduct}
            onQuickPreorder={handleQuickPreorder}
            onToggleFavorite={handleToggleFavorite}
            onOpenMarketplace={() => {
              setCurrentView('marketplace');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
            onSelectNotification={handleSelectNotification}
            onToggleReadNotification={handleToggleNotificationRead}
            onDeleteNotification={handleDeleteNotification}
            onClearReadNotifications={handleClearReadNotifications}
            onSimulateNotification={handleSimulateNotification}
          />
        )}

        {/* VIEW 6: PRODUCER ERP SPACE (ESPACE PRODUCTEUR COMPLET) */}
        {currentView === 'producer' && (
          <ProducerDashboardLayout
            farmProfile={farmProfile}
            plots={plots}
            productions={productions}
            stockItems={stockItems}
            stockMovements={stockMovements}
            producerOrders={producerOrders}
            producerDeliveries={producerDeliveries}
            traceabilityLots={traceabilityLots}
            financeSummary={financeSummary}
            transactions={producerTransactions}
            notifications={producerNotifications}
            products={producerVisibleProducts}
            onUpdateFarmProfile={handleUpdateFarmProfile}
            onAddPlot={handleAddPlot}
            onUpdatePlotStatus={handleUpdatePlotStatus}
            onAddProduction={handleAddProduction}
            onUpdateProductionStatus={handleUpdateProductionStatus}
            onUpdateProduction={handleUpdateProduction}
            onAddProductAsPreorder={handleAddProductAsPreorder}
            onAddStockMovement={handleAddStockMovement}
            onUpdateOrderStatus={handleUpdateProducerOrderStatus}
            onUpdateDeliveryStatus={handleUpdateProducerDeliveryStatus}
            onMarkNotificationAsRead={(id) =>
              setProducerNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
              )
            }
            onMarkAllNotificationsAsRead={() =>
              setProducerNotifications((prev) =>
                prev.map((n) => ({ ...n, read: true }))
              )
            }
            onSwitchToBuyer={() => {
              setCurrentView('marketplace');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectProductToView={handleSelectProduct}
          />
        )}

        {/* VIEW 7: ADMIN DASHBOARD (ESPACE ADMINISTRATION ET SUPERVISION) */}
        {currentView === 'admin' && (
          <AdminDashboardLayout
            currentTab={currentAdminTab}
            onTabChange={setCurrentAdminTab}
            onNavigateHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateMarketplace={() => {
              setCurrentView('marketplace');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSwitchRole={(newRole) => {
              if (newRole === 'Acheteur') setCurrentView('buyer');
              else if (newRole === 'Producteur') setCurrentView('producer');
              else setCurrentView('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            users={adminUsers}
            producers={adminProducers}
            buyers={adminBuyers}
            products={products}
            preorders={preorders}
            orders={producerOrders}
            payments={payments}
            deliveries={producerDeliveries}
            crops={[]}
            incidents={adminIncidents}
            settings={platformSettings}
            onUpdateUserStatus={handleUpdateUserStatus}
            onValidateProducer={handleValidateProducer}
            onRejectProducer={handleRejectProducer}
            onSuspendProducer={handleSuspendProducer}
            onUpdateDeliveryStatus={handleUpdateAdminDeliveryStatus}
            onCreateIncident={(newInc) => {
              const created: AdminIncident = {
                ...newInc,
                id: `inc-${Date.now()}`,
                dateCreation: new Date().toISOString().split('T')[0],
              };
              setAdminIncidents((prev) => [created, ...prev]);
            }}
            onResolveIncident={(incId, notes) => {
              setAdminIncidents((prev) =>
                prev.map((inc) =>
                  inc.id === incId
                    ? {
                      ...inc,
                      statut: 'Résolu',
                      dateResolution: new Date().toISOString().split('T')[0],
                      notesResolution: notes,
                    }
                    : inc
                )
              );
            }}
            onUpdateSettings={(newSet) => setPlatformSettings(newSet)}
          />
        )}
      </main>

      {/* Preorder & Payment Flow Modal */}
      {preorderModalProduct && (
        <PreorderFlowModal
          product={preorderModalProduct}
          initialQuantity={preorderInitialQty}
          onClose={() => setPreorderModalProduct(null)}
          onOrderConfirmed={handleOrderConfirmed}
          onNavigateToTracking={handleNavigateToTracking}
        />
      )}

      {/* Traceability Modal */}
      {traceabilityProduct && (
        <TraceabilityModal
          product={traceabilityProduct}
          onClose={() => setTraceabilityProduct(null)}
        />
      )}

      {/* Preorder Detail Modal */}
      {selectedPreorderForModal && (
        <BuyerPreorderDetailModal
          preorder={selectedPreorderForModal}
          onClose={() => setSelectedPreorderForModal(null)}
          onOpenReceipt={(po) => {
            setSelectedPreorderForModal(null);
            setSelectedReceiptData({ preorder: po });
          }}
          onConfirmDelivery={(id) => {
            handleConfirmDeliveryFromBuyer(id);
            setSelectedPreorderForModal(null);
          }}
        />
      )}

      {/* Payment / Invoice Receipt Modal */}
      {selectedReceiptData && (
        <BuyerReceiptModal
          preorder={selectedReceiptData.preorder}
          payment={selectedReceiptData.payment}
          onClose={() => setSelectedReceiptData(null)}
        />
      )}

      {/* Notifications Modal */}
      {isNotificationsModalOpen && (
        <BuyerNotificationsModal
          notifications={notifications}
          onClose={() => setIsNotificationsModalOpen(false)}
          onMarkAllAsRead={handleMarkAllNotificationsAsRead}
          onSelectNotification={handleSelectNotification}
          onToggleReadNotification={handleToggleNotificationRead}
          onDeleteNotification={handleDeleteNotification}
          onClearReadNotifications={handleClearReadNotifications}
          onSimulateNotification={handleSimulateNotification}
        />
      )}

      {/* Global Footer */}
      {currentView !== 'producer' && (
        <Footer
          onNavigate={(v) => {
            setCurrentView(v);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </div>
  );
}
