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

function safeGetStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (!saved || saved === 'undefined' || saved === 'null') return fallback;
    return JSON.parse(saved);
  } catch {
    return fallback;
  }
}

export default function App() {
  const { user, profile, role } = useAuth();

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

  // Products State (Dynamically updated when producer publishes new offers)
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

  // Persistence / States - Buyer
  const [preorders, setPreorders] = useState<Preorder[]>(() =>
    safeGetStorage('agrilink_preorders', INITIAL_PREORDERS)
  );

  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>(() =>
    safeGetStorage('agrilink_deliveries', INITIAL_DELIVERIES)
  );

  const [payments, setPayments] = useState<PaymentRecord[]>(() =>
    safeGetStorage('agrilink_payments', INITIAL_PAYMENTS)
  );

  const [buyerProfile, setBuyerProfile] = useState<BuyerProfile>(() =>
    safeGetStorage('agrilink_buyer_profile', INITIAL_BUYER_PROFILE)
  );

  const [notifications, setNotifications] = useState<BuyerNotification[]>(() =>
    safeGetStorage('agrilink_notifications', INITIAL_NOTIFICATIONS)
  );

  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>(() =>
    safeGetStorage('agrilink_favorites', ['tomates-cerises-sangalkam', 'mangues-kent-niayes'])
  );

  const [selectedPreorderId, setSelectedPreorderId] = useState<string>('preorder-sample-1');

  // Persistence / States - Producer ERP
  const [farmProfile, setFarmProfile] = useState<FarmProfile>(() =>
    safeGetStorage('agrilink_farm_profile', INITIAL_FARM_PROFILE)
  );

  const [plots, setPlots] = useState<Plot[]>(() =>
    safeGetStorage('agrilink_plots', INITIAL_PLOTS)
  );

  const [productions, setProductions] = useState<CropProduction[]>(() =>
    safeGetStorage('agrilink_productions', INITIAL_PRODUCTIONS)
  );

  const [stockItems, setStockItems] = useState<StockItem[]>(() =>
    safeGetStorage('agrilink_stock_items', INITIAL_STOCK_ITEMS)
  );

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() =>
    safeGetStorage('agrilink_stock_movements', INITIAL_STOCK_MOVEMENTS)
  );

  const [producerOrders, setProducerOrders] = useState<ProducerOrder[]>(() =>
    safeGetStorage('agrilink_producer_orders', INITIAL_PRODUCER_ORDERS)
  );

  const [producerDeliveries, setProducerDeliveries] = useState<ProducerDelivery[]>(() =>
    safeGetStorage('agrilink_producer_deliveries', INITIAL_PRODUCER_DELIVERIES)
  );

  const [traceabilityLots, setTraceabilityLots] = useState<TraceabilityLot[]>(() =>
    safeGetStorage('agrilink_traceability_lots', INITIAL_TRACEABILITY_LOTS)
  );

  const [financeSummary, setFinanceSummary] = useState<ProducerFinanceSummary>(() =>
    safeGetStorage('agrilink_producer_finance', INITIAL_PRODUCER_FINANCE)
  );

  const [producerTransactions, setProducerTransactions] = useState<FinancialTransaction[]>(() =>
    safeGetStorage('agrilink_producer_transactions', INITIAL_PRODUCER_TRANSACTIONS)
  );

  const [producerNotifications, setProducerNotifications] = useState<ProducerNotification[]>(() =>
    safeGetStorage('agrilink_producer_notifications', INITIAL_PRODUCER_NOTIFICATIONS)
  );

  // LocalStorage Sync
  useEffect(() => {
    localStorage.setItem('agrilink_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('agrilink_preorders', JSON.stringify(preorders));
  }, [preorders]);

  useEffect(() => {
    localStorage.setItem('agrilink_deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  useEffect(() => {
    localStorage.setItem('agrilink_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('agrilink_buyer_profile', JSON.stringify(buyerProfile));
  }, [buyerProfile]);

  useEffect(() => {
    localStorage.setItem('agrilink_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('agrilink_favorites', JSON.stringify(favoriteProductIds));
  }, [favoriteProductIds]);

  useEffect(() => {
    localStorage.setItem('agrilink_farm_profile', JSON.stringify(farmProfile));
  }, [farmProfile]);

  useEffect(() => {
    localStorage.setItem('agrilink_plots', JSON.stringify(plots));
  }, [plots]);

  useEffect(() => {
    localStorage.setItem('agrilink_productions', JSON.stringify(productions));
  }, [productions]);

  useEffect(() => {
    localStorage.setItem('agrilink_stock_items', JSON.stringify(stockItems));
  }, [stockItems]);

  useEffect(() => {
    localStorage.setItem('agrilink_stock_movements', JSON.stringify(stockMovements));
  }, [stockMovements]);

  useEffect(() => {
    localStorage.setItem('agrilink_producer_orders', JSON.stringify(producerOrders));
  }, [producerOrders]);

  useEffect(() => {
    localStorage.setItem('agrilink_producer_deliveries', JSON.stringify(producerDeliveries));
  }, [producerDeliveries]);

  useEffect(() => {
    localStorage.setItem('agrilink_traceability_lots', JSON.stringify(traceabilityLots));
  }, [traceabilityLots]);

  useEffect(() => {
    localStorage.setItem('agrilink_producer_finance', JSON.stringify(financeSummary));
  }, [financeSummary]);

  useEffect(() => {
    localStorage.setItem('agrilink_producer_transactions', JSON.stringify(producerTransactions));
  }, [producerTransactions]);

  useEffect(() => {
    localStorage.setItem('agrilink_producer_notifications', JSON.stringify(producerNotifications));
  }, [producerNotifications]);

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
            products={products}
            onUpdateFarmProfile={handleUpdateFarmProfile}
            onAddPlot={handleAddPlot}
            onUpdatePlotStatus={handleUpdatePlotStatus}
            onAddProduction={handleAddProduction}
            onUpdateProductionStatus={handleUpdateProductionStatus}
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
