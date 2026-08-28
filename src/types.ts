export type ProductCategory = 'Fruits' | 'Légumes' | 'Céréales' | 'Transformés';

export type ProductLocation = 'Dakar' | 'Thiès' | 'Niayes' | 'Fatick' | 'Saint-Louis' | 'Rufisque';

export type AvailabilityType = 'immediate' | 'preorder';

export interface Product {
  id: string;
  nom: string;
  image: string;
  categorie: ProductCategory;
  description: string;
  prix: number; // en FCFA
  unite: string; // "kg", "Sac (50kg)", "Bouteille (1L)", "Carton (5kg)"
  quantiteDisponible: number;
  quantitePrevue: number;
  quantiteMinimale: number;
  dateDisponibilite: string;
  producteur: string;
  localisation: string; // Ex: "Ferme Diop, Niayes" ou "Sangalkam, Région de Rufisque"
  region: 'Dakar' | 'Thiès' | 'Niayes' | 'Fatick';
  statutPrecommande: 'ouverte' | 'immediate' | 'bientôt';
  typeDisponibilite: AvailabilityType;
  acomptePourcentage: number; // Ex: 30 (%)
  isBio?: boolean;
  isTracable?: boolean;
  rating?: number;
  avisCount?: number;
  producteurAvatar?: string;
  producteurDescription?: string;
}

export type OrderStatus =
  | 'En attente'
  | 'Confirmée'
  | 'En culture'
  | 'En récolte'
  | 'Prête pour livraison'
  | 'En livraison'
  | 'Livrée'
  | 'Annulée';

export interface Preorder {
  id: string;
  numeroCommande: string;
  produitId: string;
  produitNom: string;
  produitImage: string;
  producteur: string;
  localisation: string;
  quantite: number;
  unite: string;
  prixUnitaire: number;
  montantTotal: number;
  acompte: number;
  soldeRestant: number;
  acomptePct: number;
  lieuLivraison: string;
  telephoneClient: string;
  nomClient: string;
  moyenPaiement: 'wave' | 'orange_money';
  statutPaiementAcompte: 'payé' | 'en_attente';
  statutCommande: OrderStatus;
  dateCommande: string;
  datePrevueDisponibilite: string;
  transporteurNom?: string;
  transporteurTel?: string;
  notes?: string;
}

export interface BuyerProfile {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  typeAcheteur: 'Particulier' | 'Restaurant / Traiteur' | 'Hôtel' | 'Grossiste / Revendeur' | 'Supermarché';
  nomEntreprise?: string;
  adresseLivraison: string;
  ville: string;
  quartier: string;
  region: string;
  codeClient: string;
  dateInscription: string;
}

export interface BuyerNotification {
  id: string;
  titre: string;
  message: string;
  date: string;
  type: 'preorder' | 'delivery' | 'payment' | 'harvest' | 'system';
  read: boolean;
  orderId?: string;
}

export interface PaymentRecord {
  id: string;
  numeroTransaction: string;
  numeroFacture: string;
  preorderId: string;
  produitNom: string;
  montant: number;
  moyenPaiement: 'wave' | 'orange_money';
  typePaiement: 'acompte' | 'solde' | 'integral';
  statut: 'validé' | 'en_attente';
  datePaiement: string;
}

export interface DeliveryRecord {
  id: string;
  preorderId: string;
  numeroCommande: string;
  produitNom: string;
  produitImage: string;
  quantite: number;
  unite: string;
  producteur: string;
  lieuLivraison: string;
  dateEstimee: string;
  statut: 'en_preparation' | 'en_transit' | 'livree' | 'en_attente';
  transporteurNom: string;
  transporteurTel: string;
  codeSuivi: string;
}

export type BuyerTab =
  | 'dashboard'
  | 'preorders'
  | 'orders'
  | 'deliveries'
  | 'payments'
  | 'favorites'
  | 'notifications'
  | 'profile';

export type ProducerTab =
  | 'dashboard'
  | 'exploitation'
  | 'parcelles'
  | 'productions'
  | 'stocks'
  | 'produits'
  | 'preorders'
  | 'orders'
  | 'deliveries'
  | 'traceability'
  | 'finances'
  | 'reports'
  | 'settings';

export type PlotStatus = 'Préparation' | 'En production' | 'Récolte prévue' | 'Récoltée';

export interface Plot {
  id: string;
  nom: string;
  superficie: number;
  unite: 'ha' | 'm²';
  culture: string;
  variete?: string;
  localisation: string;
  dateDebut: string;
  dateEstimeeRecolte: string;
  statut: PlotStatus;
  rendementEstime: number;
  uniteRendement: string;
  notes?: string;
}

export type ProductionStatus =
  | 'Planifiée'
  | 'En cours'
  | 'Récolte prévue'
  | 'Récoltée'
  | 'Terminée';

export interface CropProduction {
  id: string;
  produitNom: string;
  produitCategorie: ProductCategory;
  parcelleId: string;
  parcelleNom: string;
  quantitePrevue: number;
  quantiteRecoltee: number;
  quantiteReservee: number;
  unite: string;
  dateDebut: string;
  dateEstimeeRecolte: string;
  coutEstime: number;
  intrants: string[];
  statut: ProductionStatus;
  notes?: string;
  isPreorderPublished?: boolean;
  preorderId?: string;
}

export type StockStatus = 'Normal' | 'Stock faible' | 'Rupture';

export interface StockItem {
  id: string;
  produitId: string;
  produitNom: string;
  categorie: ProductCategory;
  image: string;
  stockTotal: number;
  stockReserve: number;
  unite: string;
  seuilAlerte: number;
  prixUnitaire: number;
  statut: StockStatus;
  dernierMouvementDate: string;
}

export type StockMovementType = 'Entrée' | 'Sortie' | 'Réservation' | 'Libération';

export interface StockMovement {
  id: string;
  stockItemId: string;
  produitNom: string;
  typeMouvement: StockMovementType;
  quantite: number;
  unite: string;
  date: string;
  motif: string;
  auteur: string;
}

export interface FarmProfile {
  id: string;
  nomExploitation: string;
  gerant: string;
  description: string;
  localisation: string;
  region: 'Dakar' | 'Thiès' | 'Niayes' | 'Fatick' | 'Saint-Louis';
  superficie: number;
  uniteSuperficie: 'ha' | 'm²';
  typeProduction: 'Biologique certifié' | 'Raisonné / Agroécologique' | 'Conventionnel';
  telephone: string;
  email: string;
  anneeCreation: number;
  certifications: string[];
  informationsComplementaires: string;
  coordonneesGPS?: string;
}

export type ProducerOrderStatus =
  | 'Précommande'
  | 'Acompte payé'
  | 'Production en cours'
  | 'Produit disponible'
  | 'Préparation'
  | 'En livraison'
  | 'Livrée'
  | 'Annulée';

export interface ProducerOrder {
  id: string;
  numeroCommande: string;
  acheteurNom: string;
  acheteurTel: string;
  acheteurAdresse: string;
  produitId: string;
  produitNom: string;
  produitImage: string;
  quantite: number;
  unite: string;
  prixUnitaire: number;
  montantTotal: number;
  acomptePaye: number;
  soldeRestant: number;
  acomptePct: number;
  dateCommande: string;
  datePrevueDisponibilite: string;
  statut: ProducerOrderStatus;
  moyenPaiement: 'wave' | 'orange_money';
  statutAcompte: 'payé' | 'en_attente';
  transporteurNom?: string;
  transporteurTel?: string;
  notes?: string;
}

export type ProducerDeliveryStatus = 'À préparer' | 'Prête' | 'En livraison' | 'Livrée';

export interface ProducerDelivery {
  id: string;
  commandeId: string;
  numeroCommande: string;
  acheteurNom: string;
  acheteurTel: string;
  produitNom: string;
  produitImage: string;
  quantite: number;
  unite: string;
  adresseLivraison: string;
  datePrevue: string;
  statut: ProducerDeliveryStatus;
  transporteurNom: string;
  transporteurTel: string;
  codeSuivi: string;
}

export interface TraceabilityLot {
  id: string;
  numeroLot: string;
  produitNom: string;
  categorie: ProductCategory;
  variete: string;
  dateProduction: string;
  dateRecolte: string;
  dateConditionnement: string;
  dateLivraisonEstimee: string;
  quantiteLot: number;
  unite: string;
  parcelleNom: string;
  producteurNom: string;
  exploitationNom: string;
  localisation: string;
  region: string;
  intrantsBio: string[];
  methodeCulture: string;
  statut: 'en_culture' | 'recolte' | 'conditionne' | 'expedie' | 'livre';
  qrCodeDataString: string;
  certifications: string[];
}

export interface ProducerNotification {
  id: string;
  titre: string;
  message: string;
  date: string;
  type: 'preorder' | 'order' | 'harvest' | 'delivery' | 'stock' | 'payment';
  read: boolean;
  linkTab?: ProducerTab;
}

export interface ProducerFinanceSummary {
  revenusTotaux: number;
  acomptesRecus: number;
  soldesEnAttente: number;
  revenusSecurisesPourcentage: number;
  tauxVenteAvantRecolte: number;
  pertesPostRecoltePourcentage: number;
  panierMoyen: number;
}

export interface FinancialTransaction {
  id: string;
  date: string;
  libelle: string;
  type: 'Acompte' | 'Solde' | 'Remboursement' | 'Paiement comptant';
  montant: number;
  moyenPaiement: 'wave' | 'orange_money' | 'virement';
  statut: 'Crédité (Séquestre)' | 'Débloqué & Versé' | 'En attente' | 'Remboursé';
  reference: string;
}

export interface FilterState {
  categories: ProductCategory[];
  location: string; // "" pour tout ou "Dakar" | "Thiès" | "Niayes"
  availability: AvailabilityType[];
  search: string;
}

// ==========================================
// TYPES POUR L'ESPACE ADMINISTRATEUR
// ==========================================

export type AdminTab =
  | 'vue-ensemble'
  | 'utilisateurs'
  | 'producteurs'
  | 'acheteurs'
  | 'produits'
  | 'precommandes'
  | 'commandes'
  | 'paiements'
  | 'livraisons'
  | 'tracabilite'
  | 'signalements'
  | 'statistiques'
  | 'parametres'
  | 'dashboard'
  | 'users'
  | 'producers'
  | 'buyers'
  | 'products'
  | 'preorders'
  | 'orders'
  | 'payments'
  | 'deliveries'
  | 'traceability'
  | 'reports'
  | 'statistics'
  | 'settings';

export type IncidentStatus = 'Nouveau' | 'En cours' | 'Résolu';
export type ProducerCrop = CropProduction;

export type UserRole = 'Producteur' | 'Acheteur' | 'Administrateur';
export type UserAccountStatus = 'Actif' | 'En attente' | 'Suspendu';

export interface AdminUser {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: UserRole;
  dateInscription: string;
  statut: UserAccountStatus;
  organisation?: string;
  localisation: string;
  commandesCount?: number;
  totalDepenseOuVendu?: number;
}

export type ProducerValidationStatus = 'En attente de validation' | 'Validé' | 'Refusé' | 'Suspendu';

export interface AdminProducer {
  id: string;
  nom: string;
  exploitation: string;
  gerant: string;
  localisation: string;
  region: string;
  telephone: string;
  email: string;
  nombreProduits: number;
  nombreCommandes: number;
  statutValidation: ProducerValidationStatus;
  dateInscription: string;
  superficie: number;
  certifications: string[];
  typeProduction: string;
}

export type BuyerCategoryType = 'Particulier' | 'Restaurant' | 'Hôtel' | 'Supermarché' | 'Professionnel';

export interface AdminBuyer {
  id: string;
  nom: string;
  prenom: string;
  typeAcheteur: BuyerCategoryType;
  email: string;
  telephone: string;
  nombreCommandes: number;
  montantDepense: number;
  statut: 'Actif' | 'Inactif' | 'Suspendu';
  dateInscription: string;
  adresse: string;
  ville: string;
}

export type ProductAdminStatus = 'En attente' | 'Publié' | 'Désactivé' | 'Refusé';

export interface AdminIncident {
  id: string;
  reference: string;
  utilisateurNom: string;
  utilisateurRole: 'Acheteur' | 'Producteur' | 'Transporteur';
  utilisateurTel: string;
  type: 'Problème avec un produit' | 'Problème avec une commande' | 'Problème de livraison' | 'Problème avec un producteur' | 'Autre';
  titre: string;
  description: string;
  date: string;
  statut: 'Nouveau' | 'En cours' | 'Résolu';
  priorite: 'Basse' | 'Moyenne' | 'Haute' | 'Urgente';
  commandeLiee?: string;
  produitLie?: string;
  reponseAdmin?: string;
  dateResolution?: string;
}

export interface PlatformSettings {
  nomPlateforme: string;
  description: string;
  devise: string;
  commissionPourcentage: number;
  acompteParDefautPourcentage: number;
  delaiMaxLivraisonJours: number;
  emailSupport: string;
  telephoneSupport: string;
  adresseSiege: string;
  alertesSmsActives: boolean;
  alertesWhatsAppActives: boolean;
  modeMaintenance: boolean;
  categoriesActives: ProductCategory[];
}

// Canonical Firestore & Authentication Data Types
export type UserRoleType = 'BUYER' | 'PRODUCER' | 'ADMIN';
export type UserStatusType = 'ACTIVE' | 'PENDING' | 'SUSPENDED';
export type ProducerStatusType = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
export type BuyerCategoryCode = 'INDIVIDUAL' | 'RESTAURANT' | 'HOTEL' | 'SUPERMARKET' | 'PROFESSIONAL';

export interface FirestoreUser {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRoleType;
  status: UserStatusType;
  createdAt: string;
  updatedAt?: string;
}

export interface FirestoreProducerProfile {
  uid: string;
  farmName: string;
  description: string;
  location: string;
  phone: string;
  validationStatus: ProducerStatusType;
  createdAt: string;
  updatedAt: string;
  region?: string;
  productionType?: string;
}

export interface FirestoreBuyerProfile {
  uid: string;
  buyerType: BuyerCategoryCode;
  address: string;
  city: string;
  phone: string;
  companyName?: string;
  createdAt: string;
  updatedAt: string;
}
