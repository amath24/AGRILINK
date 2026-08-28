import React from 'react';
import { Preorder, DeliveryRecord, BuyerProfile, BuyerTab } from '../../types';

interface BuyerOverviewTabProps {
  preorders: Preorder[];
  deliveries: DeliveryRecord[];
  buyerProfile: BuyerProfile;
  onNavigateTab: (tab: BuyerTab) => void;
  onSelectPreorder: (preorder: Preorder) => void;
  onOpenMarketplace: () => void;
  favoritesCount: number;
}

export const BuyerOverviewTab: React.FC<BuyerOverviewTabProps> = ({
  preorders = [],
  deliveries = [],
  buyerProfile,
  onNavigateTab,
  onSelectPreorder,
  onOpenMarketplace,
  favoritesCount = 0,
}) => {
  const safePreorders = preorders || [];
  const safeDeliveries = deliveries || [];

  // Statistics calculations
  const activePreorders = safePreorders.filter(
    (p) => p.statutCommande !== 'Livrée' && p.statutCommande !== 'Annulée'
  );
  const deliveredOrders = safePreorders.filter((p) => p.statutCommande === 'Livrée');
  const totalSpentAcompte = safePreorders.reduce((acc, curr) => acc + (curr.acompte || 0), 0);
  const upcomingDeliveries = safeDeliveries.filter((d) => d.statut !== 'livree');

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#164525] to-[#2f5d3a] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-[0_8px_30px_rgba(47,93,58,0.12)]">
        {/* Subtle Decorative Elements */}
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-6 pointer-events-none">
          <span className="material-symbols-outlined text-[180px]">agriculture</span>
        </div>

        <div className="relative z-10 max-w-2xl">
          <span className="bg-[#bbefc1]/20 text-[#bbefc1] text-[12px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3 border border-[#bbefc1]/30">
            Espace Acheteur Certifié
          </span>
          <h1 className="font-['Montserrat'] text-[24px] sm:text-[30px] font-bold mb-2">
            Bonjour, {buyerProfile.prenom} {buyerProfile.nom} 👋
          </h1>
          <p className="text-[#FAF8F2]/90 text-[14px] sm:text-[15px] font-['Inter'] leading-relaxed mb-6">
            Bienvenue sur votre tableau de bord Agri-Link. Suivez en temps réel vos récoltes précommandées, gérez vos livraisons directes des terroirs sénégalais et accédez à vos justificatifs.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              id="dash-explore-btn"
              onClick={onOpenMarketplace}
              className="bg-white text-[#164525] font-['Montserrat'] font-bold text-[14px] px-5 py-2.5 rounded-full hover:bg-[#FAF8F2] hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              Parcourir la Marketplace
            </button>
            <button
              id="dash-preorders-btn"
              onClick={() => onNavigateTab('preorders')}
              className="bg-[#164525]/80 border border-white/30 text-white font-['Montserrat'] font-medium text-[14px] px-5 py-2.5 rounded-full hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              Mes {activePreorders.length} précommandes en cours
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Précommandes en cours */}
        <div
          onClick={() => onNavigateTab('preorders')}
          className="bg-white border border-[#c1c9be] rounded-xl p-5 shadow-sm hover:shadow-[0_8px_30px_rgba(47,93,58,0.1)] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-semibold text-[#717970]">Précommandes Actives</span>
            <div className="w-10 h-10 rounded-lg bg-[#fff1e6] text-[#7d4600] flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">pending_actions</span>
            </div>
          </div>
          <div>
            <div className="font-['Montserrat'] text-[28px] font-bold text-[#2b1700]">
              {activePreorders.length}
            </div>
            <div className="text-[12px] text-[#7d4600] font-medium flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px]">eco</span>
              En cours de culture / récolte
            </div>
          </div>
        </div>

        {/* Card 2: Commandes livrées */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-white border border-[#c1c9be] rounded-xl p-5 shadow-sm hover:shadow-[0_8px_30px_rgba(47,93,58,0.1)] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-semibold text-[#717970]">Commandes Livrées</span>
            <div className="w-10 h-10 rounded-lg bg-[#bbefc1]/50 text-[#164525] flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">task_alt</span>
            </div>
          </div>
          <div>
            <div className="font-['Montserrat'] text-[28px] font-bold text-[#2b1700]">
              {deliveredOrders.length}
            </div>
            <div className="text-[12px] text-[#164525] font-medium flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              Conformité 100% validée
            </div>
          </div>
        </div>

        {/* Card 3: Total engagé */}
        <div
          onClick={() => onNavigateTab('payments')}
          className="bg-white border border-[#c1c9be] rounded-xl p-5 shadow-sm hover:shadow-[0_8px_30px_rgba(47,93,58,0.1)] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-semibold text-[#717970]">Acomptes Réglés</span>
            <div className="w-10 h-10 rounded-lg bg-[#FAF8F2] text-[#164525] border border-[#E5DCCB] flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
            </div>
          </div>
          <div>
            <div className="font-['Montserrat'] text-[22px] sm:text-[24px] font-bold text-[#164525]">
              {totalSpentAcompte.toLocaleString('fr-FR')} FCFA
            </div>
            <div className="text-[12px] text-[#717970] font-medium flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              Sécurisés sous séquestre
            </div>
          </div>
        </div>

        {/* Card 4: Prochaines livraisons */}
        <div
          onClick={() => onNavigateTab('deliveries')}
          className="bg-white border border-[#c1c9be] rounded-xl p-5 shadow-sm hover:shadow-[0_8px_30px_rgba(47,93,58,0.1)] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-semibold text-[#717970]">Prochaines Livraisons</span>
            <div className="w-10 h-10 rounded-lg bg-[#fff1e6] text-[#7d4600] flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">local_shipping</span>
            </div>
          </div>
          <div>
            <div className="font-['Montserrat'] text-[28px] font-bold text-[#7d4600]">
              {upcomingDeliveries.length}
            </div>
            <div className="text-[12px] text-[#717970] font-medium flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              Estimée dès le 28 Fév
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Preorders + Upcoming Deliveries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Column 1 & 2: Mes précommandes récentes */}
        <div className="lg:col-span-2 bg-white border border-[#c1c9be] rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#c1c9be]/50">
            <div>
              <h2 className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#164525]">receipt_long</span>
                Mes précommandes récentes
              </h2>
              <p className="text-[13px] text-[#717970]">
                Suivi direct de l'avancement de vos commandes auprès des producteurs
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('preorders')}
              className="text-[#164525] font-semibold text-[13px] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Voir tout ({preorders.length})</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {preorders.length === 0 ? (
            <div className="text-center py-10 text-[#717970]">
              <p>Aucune précommande enregistrée pour le moment.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {preorders.slice(0, 3).map((po) => (
                <div
                  key={po.id}
                  onClick={() => onSelectPreorder(po)}
                  className="border border-[#c1c9be]/60 hover:border-[#164525] bg-[#FAF8F2] hover:bg-white rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={po.produitImage}
                      alt={po.produitNom}
                      className="w-14 h-14 rounded-lg object-cover border border-[#c1c9be] shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-['Montserrat'] text-[15px] font-bold text-[#2b1700] group-hover:text-[#164525] transition-colors">
                          {po.produitNom}
                        </h3>
                      </div>
                      <p className="text-[12px] text-[#717970] mt-0.5">
                        {po.quantite} {po.unite} • {po.producteur}
                      </p>
                      <span className="text-[11px] font-mono text-[#164525] font-semibold">
                        {po.numeroCommande}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 border-[#c1c9be]/40 pt-2 sm:pt-0">
                    <span className="font-['Montserrat'] font-bold text-[#164525] text-[15px]">
                      {po.montantTotal.toLocaleString('fr-FR')} FCFA
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full mt-1 ${
                      po.statutCommande === 'Livrée'
                        ? 'bg-[#bbefc1] text-[#164525]'
                        : po.statutCommande === 'Prête pour livraison'
                        ? 'bg-[#164525] text-white'
                        : 'bg-[#fff1e6] text-[#7d4600]'
                    }`}>
                      {po.statutCommande}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 3: Prochaines Livraisons & Quick Actions */}
        <div className="col-span-1 flex flex-col gap-6">
          {/* Prochaines livraisons Card */}
          <div className="bg-white border border-[#c1c9be] rounded-2xl p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#c1c9be]/50">
              <h2 className="font-['Montserrat'] text-[16px] font-bold text-[#2b1700] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#164525]">local_shipping</span>
                Prochaines livraisons
              </h2>
              <button
                onClick={() => onNavigateTab('deliveries')}
                className="text-[#164525] text-[12px] font-semibold hover:underline cursor-pointer"
              >
                Gérer
              </button>
            </div>

            {upcomingDeliveries.length === 0 ? (
              <p className="text-[13px] text-[#717970] py-4 text-center">
                Aucune livraison en attente.
              </p>
            ) : (
              <div className="flex flex-col gap-3.5">
                {upcomingDeliveries.slice(0, 2).map((del) => (
                  <div key={del.id} className="p-3 bg-[#FAF8F2] rounded-xl border border-[#E5DCCB] flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="font-bold text-[#2b1700] truncate max-w-[160px]">
                        {del.produitNom}
                      </span>
                      <span className="bg-[#fff1e6] text-[#7d4600] font-bold px-2 py-0.5 rounded text-[10px]">
                        {del.statut === 'en_transit' ? 'En transit' : 'Préparation'}
                      </span>
                    </div>
                    <div className="text-[12px] text-[#414941]">
                      📍 {del.lieuLivraison}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#717970] pt-1 border-t border-[#c1c9be]/30">
                      <span>Estimée : <strong>{del.dateEstimee}</strong></span>
                      <span className="text-[#164525] font-semibold">{del.transporteurNom}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links & Shortcuts */}
          <div className="bg-[#FAF8F2] border border-[#E5DCCB] rounded-2xl p-5 flex flex-col gap-3">
            <h3 className="font-['Montserrat'] text-[14px] font-bold text-[#2b1700] uppercase tracking-wider text-[11px]">
              Raccourcis rapides
            </h3>

            <button
              onClick={() => onNavigateTab('favorites')}
              className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-[#c1c9be]/60 hover:border-[#164525] text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#7d4600] text-[20px]">favorite</span>
                <span className="text-[13px] font-medium text-[#2b1700]">Mes produits favoris</span>
              </div>
              <span className="bg-[#ffead7] text-[#7d4600] text-[11px] font-bold px-2 py-0.5 rounded-full">
                {favoritesCount}
              </span>
            </button>

            <button
              onClick={() => onNavigateTab('payments')}
              className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-[#c1c9be]/60 hover:border-[#164525] text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#164525] text-[20px]">receipt</span>
                <span className="text-[13px] font-medium text-[#2b1700]">Historique des paiements</span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-[#717970] group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </button>

            <button
              onClick={() => onNavigateTab('profile')}
              className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-[#c1c9be]/60 hover:border-[#164525] text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#164525] text-[20px]">manage_accounts</span>
                <span className="text-[13px] font-medium text-[#2b1700]">Paramètres du profil</span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-[#717970] group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
