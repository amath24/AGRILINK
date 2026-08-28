import React from 'react';
import {
  AdminUser,
  AdminProducer,
  AdminBuyer,
  Product,
  Preorder,
  ProducerOrder,
  ProducerDelivery,
  AdminIncident,
  AdminTab,
} from '../../../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface AdminOverviewTabProps {
  users: AdminUser[];
  producers: AdminProducer[];
  buyers: AdminBuyer[];
  products: Product[];
  preorders: Preorder[];
  orders: ProducerOrder[];
  deliveries: ProducerDelivery[];
  incidents: AdminIncident[];
  onNavigateTab: (tab: AdminTab) => void;
  onValidateProducer: (id: string) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  users = [],
  producers = [],
  buyers = [],
  products = [],
  preorders = [],
  orders = [],
  deliveries = [],
  incidents = [],
  onNavigateTab,
  onValidateProducer,
}) => {
  // Calcul des métriques globales
  const totalUsersCount = users.length;
  const activeProducersCount = producers.filter((p) => p.statutValidation === 'Validé').length;
  const pendingProducersCount = producers.filter((p) => p.statutValidation === 'En attente de validation').length;
  const activeBuyersCount = buyers.filter((b) => b.statut === 'Actif').length;
  const publishedProductsCount = products.length;
  const preordersCount = preorders.length;
  const totalOrdersCount = orders.length;
  const deliveredOrdersCount = deliveries.filter((d) => d.statut === 'Livrée').length;

  // Calcul du volume d'affaires et commission plateforme (5%)
  const totalVolumeAffaires = orders.reduce((acc, o) => acc + (o.montantTotal || 0), 0);
  const totalAcomptesSecurises = orders.reduce((acc, o) => acc + (o.acomptePaye || 0), 0);
  const platformCommissions = Math.round(totalVolumeAffaires * 0.05);

  const pendingIncidentsCount = incidents.filter((i) => i.statut !== 'Résolu').length;

  // Données de simulation d'évolution des ventes & commandes
  const salesHistory = [
    { mois: 'Mars', ventes: 850000, commandes: 6, commissions: 42500 },
    { mois: 'Avril', ventes: 1200000, commandes: 11, commissions: 60000 },
    { mois: 'Mai', ventes: 1650000, commandes: 15, commissions: 82500 },
    { mois: 'Juin', ventes: 2100000, commandes: 22, commissions: 105000 },
    { mois: 'Juil', ventes: 2750000, commandes: 28, commissions: 137500 },
    { mois: 'Août', ventes: 3450000, commandes: 39, commissions: 172500 },
  ];

  // Répartition des utilisateurs par type
  const userRoleData = [
    { name: 'Producteurs', value: producers.length, color: '#164525' },
    { name: 'Acheteurs Pros / Restos', value: buyers.filter(b => b.typeAcheteur !== 'Particulier').length, color: '#e07a5f' },
    { name: 'Particuliers', value: buyers.filter(b => b.typeAcheteur === 'Particulier').length, color: '#3d5a80' },
    { name: 'Admins', value: users.filter(u => u.role === 'Administrateur').length, color: '#717970' },
  ];

  // Top produits commandés
  const topProducts = [
    { nom: 'Tomates cerises Bio', volume: '1 250 kg', montant: '1 875 000 FCFA', pct: 85 },
    { nom: 'Oignons violets de Galmi', volume: '2 400 kg', montant: '1 200 000 FCFA', pct: 72 },
    { nom: 'Mangues Kent de Thiès', volume: '950 kg', montant: '712 500 FCFA', pct: 64 },
    { nom: 'Bissap rouge bio du Sine', volume: '400 kg', montant: '480 000 FCFA', pct: 45 },
  ];

  // Activité récente consolidée
  const recentActivities = [
    {
      id: 'act-1',
      type: 'producer_pending',
      titre: 'Nouveau producteur en attente de validation',
      desc: 'Teranga Fruits (Vergers de Pout) a soumis son dossier d’exploitation.',
      time: 'Il y a 10 min',
      actionable: true,
      producerId: 'prod-adm-3',
    },
    {
      id: 'act-2',
      type: 'order_paid',
      titre: 'Acompte 30% reçu (Séquestre)',
      desc: 'Restaurant Le Teranga a versé 18 000 FCFA par Wave pour #CMD-84920.',
      time: 'Il y a 45 min',
    },
    {
      id: 'act-3',
      type: 'delivery_success',
      titre: 'Livraison confirmée & Solde débloqué',
      desc: 'Commande #CMD-19842 livrée à Dakar Market. 98 000 FCFA versés au producteur.',
      time: 'Il y a 2 heures',
    },
    {
      id: 'act-4',
      type: 'product_new',
      titre: 'Nouvelle offre de précommande publiée',
      desc: 'Ferme des Niayes a mis en vente 500 kg de Pommes de terre locales.',
      time: 'Il y a 3 heures',
    },
    {
      id: 'act-5',
      type: 'incident',
      titre: 'Signalement en cours de traitement',
      desc: 'Retard de livraison sur axe Rufisque pris en charge par l’assistance logistique.',
      time: 'Il y a 5 heures',
    },
  ];

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {/* Banner Titre & Statut Global */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#164525] via-[#1f5732] to-[#12381e] p-6 sm:p-8 text-white shadow-xs">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-[#bbefc1] text-[12px] font-semibold mb-3">
            <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
            Console d’Administration Centrale Agri-Link Sénégal
          </div>
          <h1 className="font-['Montserrat'] text-[24px] sm:text-[30px] font-bold tracking-tight mb-2">
            Vue d'Ensemble de la Plateforme
          </h1>
          <p className="text-white/80 text-[14px] sm:text-[15px] leading-relaxed">
            Supervision globale de l’écosystème : utilisateurs, producteurs certifiés, précommandes garanties et flux financiers sous séquestre.
          </p>
        </div>

        {/* Quick action buttons in header banner */}
        <div className="relative z-10 flex flex-wrap gap-3 mt-6">
          <button
            onClick={() => onNavigateTab('producers')}
            className="flex items-center gap-2 px-4 py-2 bg-white text-[#164525] rounded-xl text-[13px] font-bold hover:bg-[#FAF8F2] transition-colors cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            Producteurs à valider ({pendingProducersCount})
          </button>
          <button
            onClick={() => onNavigateTab('reports')}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[13px] font-medium transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">report_problem</span>
            Signalements actifs ({pendingIncidentsCount})
          </button>
          <button
            onClick={() => onNavigateTab('statistics')}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[13px] font-medium transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">query_stats</span>
            Rapports & Statistiques
          </button>
        </div>
      </div>

      {/* Grid des 8 Métriques Clés */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Utilisateurs */}
        <div
          onClick={() => onNavigateTab('users')}
          className="bg-white border border-[#c1c9be]/60 rounded-2xl p-5 hover:border-[#164525] transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-semibold text-[#717970] uppercase tracking-wider">
              Utilisateurs
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#164525]/10 text-[#164525] flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">group</span>
            </div>
          </div>
          <div className="font-['Montserrat'] text-[24px] sm:text-[28px] font-bold text-[#2b1700]">
            {totalUsersCount}
          </div>
          <p className="text-[12px] text-[#717970] mt-1">
            <span className="text-[#164525] font-semibold">+{activeBuyersCount}</span> acheteurs actifs
          </p>
        </div>

        {/* Card 2: Producteurs Actifs */}
        <div
          onClick={() => onNavigateTab('producers')}
          className="bg-white border border-[#c1c9be]/60 rounded-2xl p-5 hover:border-[#164525] transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-semibold text-[#717970] uppercase tracking-wider">
              Producteurs
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#2e7d32]/10 text-[#2e7d32] flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">agriculture</span>
            </div>
          </div>
          <div className="font-['Montserrat'] text-[24px] sm:text-[28px] font-bold text-[#2b1700]">
            {activeProducersCount}
          </div>
          <p className="text-[12px] text-[#717970] mt-1">
            {pendingProducersCount > 0 ? (
              <span className="text-[#e76f51] font-bold">{pendingProducersCount} en attente</span>
            ) : (
              <span className="text-[#2e7d32] font-semibold">100% validés</span>
            )}
          </p>
        </div>

        {/* Card 3: Produits Publiés */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white border border-[#c1c9be]/60 rounded-2xl p-5 hover:border-[#164525] transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-semibold text-[#717970] uppercase tracking-wider">
              Produits en Ligne
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#e07a5f]/10 text-[#e07a5f] flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">storefront</span>
            </div>
          </div>
          <div className="font-['Montserrat'] text-[24px] sm:text-[28px] font-bold text-[#2b1700]">
            {publishedProductsCount}
          </div>
          <p className="text-[12px] text-[#717970] mt-1">
            4 catégories d'aliments
          </p>
        </div>

        {/* Card 4: Précommandes & Commandes */}
        <div
          onClick={() => onNavigateTab('preorders')}
          className="bg-white border border-[#c1c9be]/60 rounded-2xl p-5 hover:border-[#164525] transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-semibold text-[#717970] uppercase tracking-wider">
              Précommandes
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#3d5a80]/10 text-[#3d5a80] flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">event_available</span>
            </div>
          </div>
          <div className="font-['Montserrat'] text-[24px] sm:text-[28px] font-bold text-[#2b1700]">
            {preordersCount}
          </div>
          <p className="text-[12px] text-[#717970] mt-1">
            <span className="text-[#164525] font-semibold">{totalOrdersCount}</span> commandes créées
          </p>
        </div>

        {/* Card 5: Commandes Livrées */}
        <div
          onClick={() => onNavigateTab('deliveries')}
          className="bg-white border border-[#c1c9be]/60 rounded-2xl p-5 hover:border-[#164525] transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-semibold text-[#717970] uppercase tracking-wider">
              Livrées avec Succès
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#164525]/10 text-[#164525] flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            </div>
          </div>
          <div className="font-['Montserrat'] text-[24px] sm:text-[28px] font-bold text-[#2b1700]">
            {deliveredOrdersCount} / {deliveries.length}
          </div>
          <p className="text-[12px] text-[#717970] mt-1">
            Taux de succès 100%
          </p>
        </div>

        {/* Card 6: Acomptes Sécurisés */}
        <div
          onClick={() => onNavigateTab('payments')}
          className="bg-white border border-[#c1c9be]/60 rounded-2xl p-5 hover:border-[#164525] transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-semibold text-[#717970] uppercase tracking-wider">
              Acomptes Séquestre
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#7d4600]/10 text-[#7d4600] flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">lock</span>
            </div>
          </div>
          <div className="font-['Montserrat'] text-[20px] sm:text-[24px] font-bold text-[#7d4600]">
            {totalAcomptesSecurises.toLocaleString('fr-FR')} <span className="text-[13px] font-normal">FCFA</span>
          </div>
          <p className="text-[12px] text-[#717970] mt-1">
            Garantie Wave & Orange Money
          </p>
        </div>

        {/* Card 7: Volume d'Affaires Global */}
        <div
          onClick={() => onNavigateTab('payments')}
          className="bg-white border border-[#c1c9be]/60 rounded-2xl p-5 hover:border-[#164525] transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-semibold text-[#717970] uppercase tracking-wider">
              Volume d'Affaires
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#2e7d32]/10 text-[#2e7d32] flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </div>
          </div>
          <div className="font-['Montserrat'] text-[20px] sm:text-[24px] font-bold text-[#2b1700]">
            {totalVolumeAffaires.toLocaleString('fr-FR')} <span className="text-[13px] font-normal">FCFA</span>
          </div>
          <p className="text-[12px] text-[#717970] mt-1">
            Total des commandes brutes
          </p>
        </div>

        {/* Card 8: Revenus Plateforme (5%) */}
        <div
          onClick={() => onNavigateTab('statistics')}
          className="bg-white border-2 border-[#164525]/30 bg-[#164525]/5 rounded-2xl p-5 hover:border-[#164525] transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-bold text-[#164525] uppercase tracking-wider">
              Revenus Agri-Link (5%)
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#164525] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">trending_up</span>
            </div>
          </div>
          <div className="font-['Montserrat'] text-[20px] sm:text-[24px] font-bold text-[#164525]">
            {platformCommissions.toLocaleString('fr-FR')} <span className="text-[13px] font-normal">FCFA</span>
          </div>
          <p className="text-[12px] text-[#164525]/80 font-medium mt-1">
            Commission précommandes
          </p>
        </div>
      </div>

      {/* Section Graphiques : Évolution des Ventes & Commandes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique Ventes & Commissions (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-[#c1c9be]/60 rounded-2xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700]">
                Évolution des Ventes & Commissions (FCFA)
              </h2>
              <p className="text-[13px] text-[#717970]">
                Croissance mensuelle du volume d'affaires et des revenus de service
              </p>
            </div>
            <div className="flex items-center gap-4 text-[12px]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#164525]"></span>
                <span className="text-[#414941]">Ventes totales</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#e07a5f]"></span>
                <span className="text-[#414941]">Commission (5%)</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesHistory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVentes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#164525" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#164525" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e9e2" />
                <XAxis dataKey="mois" tick={{ fill: '#717970', fontSize: 12 }} />
                <YAxis tick={{ fill: '#717970', fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip
                  formatter={(val: any) => [`${Number(val).toLocaleString('fr-FR')} FCFA`]}
                  contentStyle={{ backgroundColor: '#FAF8F2', borderRadius: '12px', border: '1px solid #c1c9be' }}
                />
                <Area type="monotone" dataKey="ventes" stroke="#164525" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVentes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Répartition des Utilisateurs (1 col) */}
        <div className="bg-white border border-[#c1c9be]/60 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700] mb-1">
              Structure des Utilisateurs
            </h2>
            <p className="text-[13px] text-[#717970] mb-4">
              Répartition des acteurs inscrits
            </p>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userRoleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {userRoleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#c1c9be]/40">
            {userRoleData.map((role) => (
              <div key={role.name} className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: role.color }}></span>
                  <span className="text-[#414941]">{role.name}</span>
                </div>
                <span className="font-bold text-[#2b1700]">{role.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Deuxième Rangée : Top Produits & Activité Récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Produits Commandés */}
        <div className="bg-white border border-[#c1c9be]/60 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700]">
                Produits les Plus Commandés
              </h2>
              <p className="text-[13px] text-[#717970]">
                Volume total réservé en précommande
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-[#164525] text-[13px] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              Voir tout
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          <div className="space-y-4">
            {topProducts.map((p, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#FAF8F2] border border-[#c1c9be]/40">
                <div className="flex items-center justify-between text-[14px] mb-1.5">
                  <span className="font-bold text-[#2b1700]">{p.nom}</span>
                  <span className="font-bold text-[#164525]">{p.montant}</span>
                </div>
                <div className="flex items-center justify-between text-[12px] text-[#717970] mb-2">
                  <span>Volume réservé : {p.volume}</span>
                  <span>{p.pct}% de la récolte</span>
                </div>
                <div className="w-full bg-[#e5e9e2] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#164525] h-2 rounded-full transition-all"
                    style={{ width: `${p.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activité Récente de la Plateforme */}
        <div className="bg-white border border-[#c1c9be]/60 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700]">
                Activité Récente
              </h2>
              <p className="text-[13px] text-[#717970]">
                Événements et flux d'actions en temps réel
              </p>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#164525]/10 text-[#164525] text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#164525] animate-pulse"></span>
              En direct
            </span>
          </div>

          <div className="divide-y divide-[#c1c9be]/30">
            {recentActivities.map((act) => (
              <div key={act.id} className="py-3.5 flex items-start gap-3.5">
                <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center ${
                  act.type === 'producer_pending' ? 'bg-[#e76f51]/15 text-[#e76f51]' :
                  act.type === 'order_paid' ? 'bg-[#164525]/15 text-[#164525]' :
                  act.type === 'delivery_success' ? 'bg-[#2e7d32]/15 text-[#2e7d32]' :
                  act.type === 'product_new' ? 'bg-[#3d5a80]/15 text-[#3d5a80]' :
                  'bg-[#7d4600]/15 text-[#7d4600]'
                }`}>
                  <span className="material-symbols-outlined text-[20px]">
                    {act.type === 'producer_pending' ? 'how_to_reg' :
                     act.type === 'order_paid' ? 'lock' :
                     act.type === 'delivery_success' ? 'verified' :
                     act.type === 'product_new' ? 'store' : 'warning'}
                  </span>
                </div>

                <div className="flex-grow">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-[14px] font-bold text-[#2b1700]">{act.titre}</h4>
                    <span className="text-[11px] text-[#717970] whitespace-nowrap">{act.time}</span>
                  </div>
                  <p className="text-[13px] text-[#414941] mt-0.5">{act.desc}</p>
                  
                  {act.actionable && act.producerId && (
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => {
                          onValidateProducer(act.producerId!);
                        }}
                        className="px-3 py-1 bg-[#164525] text-white rounded-lg text-[12px] font-bold hover:bg-[#2f5d3a] transition-colors cursor-pointer"
                      >
                        Valider immédiatement
                      </button>
                      <button
                        onClick={() => onNavigateTab('producers')}
                        className="px-3 py-1 bg-[#FAF8F2] border border-[#c1c9be] text-[#2b1700] rounded-lg text-[12px] font-medium hover:bg-[#eae4d5] transition-colors cursor-pointer"
                      >
                        Voir dossier
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
