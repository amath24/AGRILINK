import React, { useState, useMemo } from 'react';
import { Preorder, OrderStatus } from '../../types';

interface BuyerPreordersTabProps {
  preorders: Preorder[];
  onSelectPreorder: (preorder: Preorder) => void;
  onOpenReceipt: (preorder: Preorder) => void;
  onOpenMarketplace: () => void;
}

export const BuyerPreordersTab: React.FC<BuyerPreordersTabProps> = ({
  preorders,
  onSelectPreorder,
  onOpenReceipt,
  onOpenMarketplace,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filterTabs = [
    { id: 'all', label: 'Toutes les précommandes', count: preorders.length },
    {
      id: 'active',
      label: 'En cours de culture / récolte',
      count: preorders.filter((p) => p.statutCommande === 'En culture' || p.statutCommande === 'En récolte' || p.statutCommande === 'Confirmée').length,
    },
    {
      id: 'ready',
      label: 'Prêtes pour livraison',
      count: preorders.filter((p) => p.statutCommande === 'Prête pour livraison' || p.statutCommande === 'En livraison').length,
    },
    {
      id: 'delivered',
      label: 'Livrées',
      count: preorders.filter((p) => p.statutCommande === 'Livrée').length,
    },
  ];

  const filteredPreorders = useMemo(() => {
    return preorders.filter((po) => {
      // Status Filter
      if (selectedFilter === 'active') {
        if (po.statutCommande !== 'En culture' && po.statutCommande !== 'En récolte' && po.statutCommande !== 'Confirmée') {
          return false;
        }
      } else if (selectedFilter === 'ready') {
        if (po.statutCommande !== 'Prête pour livraison' && po.statutCommande !== 'En livraison') {
          return false;
        }
      } else if (selectedFilter === 'delivered') {
        if (po.statutCommande !== 'Livrée') {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchName = po.produitNom.toLowerCase().includes(q);
        const matchNum = po.numeroCommande.toLowerCase().includes(q);
        const matchProd = po.producteur.toLowerCase().includes(q);
        if (!matchName && !matchNum && !matchProd) return false;
      }

      return true;
    });
  }, [preorders, selectedFilter, searchQuery]);

  const getProgressPercentage = (status: OrderStatus) => {
    switch (status) {
      case 'Confirmée':
        return 20;
      case 'En culture':
        return 45;
      case 'En récolte':
        return 75;
      case 'Prête pour livraison':
      case 'En livraison':
        return 90;
      case 'Livrée':
        return 100;
      default:
        return 10;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Confirmée':
        return 'bg-[#bbefc1] text-[#164525]';
      case 'En culture':
        return 'bg-[#fff1e6] text-[#7d4600]';
      case 'En récolte':
        return 'bg-[#ffead7] text-[#7d4600]';
      case 'Prête pour livraison':
      case 'En livraison':
        return 'bg-[#164525] text-white';
      case 'Livrée':
        return 'bg-[#bbefc1] text-[#164525]';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Tab Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-[#c1c9be] shadow-sm">
        <div>
          <h1 className="font-['Montserrat'] text-[22px] md:text-[24px] font-bold text-[#2b1700]">
            Mes Précommandes de Récoltes
          </h1>
          <p className="text-[13px] text-[#717970] mt-0.5">
            Suivi direct des cultures, règlements d'acomptes et dates de disponibilité
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#717970] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par produit, N°..."
              className="w-full pl-9 pr-4 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-full text-[13px] text-[#2b1700] outline-none focus:border-[#164525]"
            />
          </div>

          <button
            onClick={onOpenMarketplace}
            className="bg-[#164525] text-white text-[13px] font-semibold px-4 py-2 rounded-full hover:bg-[#2f5d3a] transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Nouvelle Précommande
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              selectedFilter === tab.id
                ? 'bg-[#164525] text-white shadow-sm font-semibold'
                : 'bg-white border border-[#c1c9be]/70 text-[#414941] hover:bg-[#FAF8F2]'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[11px] px-2 py-0.2 rounded-full ${
                selectedFilter === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-[#FAF8F2] text-[#717970]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Preorders List */}
      {filteredPreorders.length === 0 ? (
        <div className="bg-white border border-[#c1c9be] rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-[#FAF8F2] text-[#717970] rounded-full flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[32px]">inventory_2</span>
          </div>
          <h3 className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700] mb-1">
            Aucune précommande trouvée
          </h3>
          <p className="text-[13px] text-[#717970] max-w-sm mb-5">
            {searchQuery
              ? 'Aucun résultat ne correspond à votre recherche.'
              : 'Vous n’avez aucune précommande dans cette catégorie pour le moment.'}
          </p>
          <button
            onClick={onOpenMarketplace}
            className="bg-[#164525] text-white px-5 py-2.5 rounded-full text-[13px] font-semibold hover:bg-[#2f5d3a] transition-all cursor-pointer"
          >
            Explorer la Marketplace
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredPreorders.map((po) => {
            const progress = getProgressPercentage(po.statutCommande);

            return (
              <div
                key={po.id}
                className="bg-white border border-[#c1c9be] hover:border-[#164525] rounded-2xl p-5 sm:p-6 shadow-sm transition-all duration-200 flex flex-col gap-4"
              >
                {/* Top Row: Order ID, Date, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#c1c9be]/40 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-[#164525] text-[14px]">
                      {po.numeroCommande}
                    </span>
                    <span className="text-[#717970] text-[12px]">• Passée le {po.dateCommande}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[12px] font-bold px-3 py-0.5 rounded-full ${getStatusColor(po.statutCommande)}`}>
                      {po.statutCommande}
                    </span>
                  </div>
                </div>

                {/* Main Content: Product info + Financials */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  {/* Product Details */}
                  <div className="md:col-span-2 flex gap-4 items-center">
                    <img
                      src={po.produitImage}
                      alt={po.produitNom}
                      className="w-20 h-20 rounded-xl object-cover border border-[#c1c9be] shrink-0"
                    />
                    <div className="flex flex-col gap-0.5">
                      <h3 className="font-['Montserrat'] text-[17px] font-bold text-[#2b1700]">
                        {po.produitNom}
                      </h3>
                      <p className="text-[13px] text-[#414941] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-[#717970]">location_on</span>
                        {po.producteur} ({po.localisation})
                      </p>
                      <div className="text-[13px] text-[#717970] mt-1">
                        Quantité réservée : <strong className="text-[#2b1700]">{po.quantite} {po.unite}</strong> (à {po.prixUnitaire.toLocaleString('fr-FR')} FCFA/{po.unite})
                      </div>
                      <div className="text-[12px] text-[#164525] font-semibold mt-0.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">event_available</span>
                        Disponibilité prévue : {po.datePrevueDisponibilite}
                      </div>
                    </div>
                  </div>

                  {/* Financial & Balances */}
                  <div className="bg-[#FAF8F2] border border-[#E5DCCB] rounded-xl p-4 flex flex-col gap-2 text-[13px]">
                    <div className="flex justify-between">
                      <span className="text-[#717970]">Montant total :</span>
                      <span className="font-bold text-[#2b1700]">{po.montantTotal.toLocaleString('fr-FR')} FCFA</span>
                    </div>

                    <div className="flex justify-between text-[#164525]">
                      <span className="font-semibold">Acompte payé :</span>
                      <span className="font-bold">{po.acompte.toLocaleString('fr-FR')} FCFA</span>
                    </div>

                    <div className="w-full h-px bg-[#c1c9be]/30"></div>

                    <div className="flex justify-between text-[#7d4600]">
                      <span className="font-semibold">Solde restant :</span>
                      <span className="font-bold">{po.soldeRestant.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar of Harvest */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <div className="flex justify-between text-[11px] font-semibold text-[#717970]">
                    <span>Avancement de la récolte</span>
                    <span className="text-[#164525] font-bold">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#E5DCCB] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#164525] rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#c1c9be]/40">
                  <div className="text-[12px] text-[#717970] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#164525]">verified_user</span>
                    <span>Paiement sécurisé via {po.moyenPaiement === 'wave' ? 'Wave' : 'Orange Money'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenReceipt(po)}
                      className="px-4 py-1.5 border border-[#c1c9be] text-[#414941] rounded-full text-[12px] font-semibold hover:bg-[#FAF8F2] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">receipt</span>
                      Reçu d'acompte
                    </button>

                    <button
                      onClick={() => onSelectPreorder(po)}
                      className="px-5 py-1.5 bg-[#164525] text-white rounded-full text-[12px] font-bold hover:bg-[#2f5d3a] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      Voir les détails & Suivi
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
