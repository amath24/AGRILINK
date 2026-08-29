import React, { useState } from 'react';
import { DeliveryRecord } from '../../types';

interface BuyerDeliveriesTabProps {
  deliveries: DeliveryRecord[];
  onConfirmDelivery: (preorderId: string) => void;
  onOpenPreorderDetail: (preorderId: string) => void;
}

export const BuyerDeliveriesTab: React.FC<BuyerDeliveriesTabProps> = ({
  deliveries,
  onConfirmDelivery,
  onOpenPreorderDetail,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'in_transit' | 'delivered'>('all');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const filteredDeliveries = deliveries.filter((d) => {
    if (activeTab === 'in_transit') return d.statut === 'en_transit' || d.statut === 'en_preparation';
    if (activeTab === 'delivered') return d.statut === 'livree';
    return true;
  });

  const handleConfirm = (id: string, preorderId: string, name: string) => {
    onConfirmDelivery(preorderId);
    setSuccessToast(`Réception confirmée avec succès pour "${name}". Le paiement du solde a été débloqué.`);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  const getStatusBadge = (status: DeliveryRecord['statut']) => {
    switch (status) {
      case 'en_transit':
        return {
          label: 'En transit (Sur la route)',
          className: 'bg-[#164525] text-white',
          icon: 'local_shipping',
        };
      case 'en_preparation':
        return {
          label: 'En préparation au conditionnement',
          className: 'bg-[#fff1e6] text-[#7d4600]',
          icon: 'inventory',
        };
      case 'livree':
        return {
          label: 'Livrée & Réceptionnée',
          className: 'bg-[#bbefc1] text-[#164525]',
          icon: 'task_alt',
        };
      default:
        return {
          label: 'En attente de récolte',
          className: 'bg-gray-100 text-gray-700',
          icon: 'hourglass_empty',
        };
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toast */}
      {successToast && (
        <div className="bg-[#bbefc1] border border-[#164525] text-[#164525] p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in">
          <span className="material-symbols-outlined text-[24px]">verified</span>
          <span className="text-[14px] font-medium">{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#c1c9be] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-['Montserrat'] text-[22px] md:text-[24px] font-bold text-[#2b1700]">
            Suivi des Livraisons Directes
          </h1>
          <p className="text-[13px] text-[#717970] mt-0.5">
            Suivez l'expédition depuis les exploitations agricoles partenaires jusqu'à votre adresse
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
              activeTab === 'all' ? 'bg-[#164525] text-white font-semibold' : 'text-[#414941] hover:bg-[#FAF8F2]'
            }`}
          >
            Toutes ({deliveries.length})
          </button>
          <button
            onClick={() => setActiveTab('in_transit')}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
              activeTab === 'in_transit' ? 'bg-[#164525] text-white font-semibold' : 'text-[#414941] hover:bg-[#FAF8F2]'
            }`}
          >
            En cours ({deliveries.filter((d) => d.statut !== 'livree').length})
          </button>
          <button
            onClick={() => setActiveTab('delivered')}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
              activeTab === 'delivered' ? 'bg-[#164525] text-white font-semibold' : 'text-[#414941] hover:bg-[#FAF8F2]'
            }`}
          >
            Livrées ({deliveries.filter((d) => d.statut === 'livree').length})
          </button>
        </div>
      </div>

      {/* Deliveries List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredDeliveries.length === 0 ? (
          <div className="bg-white border border-[#c1c9be] rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-[#FAF8F2] text-[#717970] rounded-full flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[32px]">local_shipping</span>
            </div>
            <h3 className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700] mb-1">
              Aucune livraison en cours
            </h3>
            <p className="text-[13px] text-[#717970] max-w-sm">
              Dès qu'une de vos commandes ou précommandes sera expédiée par le producteur, les coordonnées du chauffeur et le suivi apparaîtront ici.
            </p>
          </div>
        ) : (
          filteredDeliveries.map((delivery) => {
          const badge = getStatusBadge(delivery.statut);

          return (
            <div
              key={delivery.id}
              className="bg-white border border-[#c1c9be] rounded-2xl p-6 shadow-sm flex flex-col gap-5 hover:border-[#164525] transition-all"
            >
              {/* Top info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c1c9be]/40 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FAF8F2] flex items-center justify-center text-[#164525] border border-[#c1c9be]">
                    <span className="material-symbols-outlined text-[22px]">{badge.icon}</span>
                  </div>
                  <div>
                    <span className="text-[12px] text-[#717970] block">Code de suivi transport :</span>
                    <span className="font-mono font-bold text-[#164525] text-[14px]">
                      {delivery.codeSuivi}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[12px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${badge.className}`}>
                    <span className="material-symbols-outlined text-[15px]">{badge.icon}</span>
                    {badge.label}
                  </span>
                </div>
              </div>

              {/* Delivery body */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                {/* Product details */}
                <div className="flex gap-4 items-center col-span-1">
                  <img
                    src={delivery.produitImage}
                    alt={delivery.produitNom}
                    className="w-20 h-20 rounded-xl object-cover border border-[#c1c9be] shrink-0"
                  />
                  <div>
                    <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#2b1700]">
                      {delivery.produitNom}
                    </h3>
                    <p className="text-[13px] text-[#414941] mt-0.5">
                      {delivery.quantite} {delivery.unite}
                    </p>
                    <p className="text-[12px] text-[#717970] mt-0.5">
                      Provenance : {delivery.producteur}
                    </p>
                  </div>
                </div>

                {/* Logistics details */}
                <div className="col-span-1 bg-[#FAF8F2] p-4 rounded-xl border border-[#E5DCCB] text-[13px] flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#164525] shrink-0 mt-0.5">
                      pin_drop
                    </span>
                    <div>
                      <span className="text-[#717970] text-[11px] uppercase font-bold block">Adresse de livraison</span>
                      <span className="font-medium text-[#2b1700]">{delivery.lieuLivraison}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-[#c1c9be]/30">
                    <span className="material-symbols-outlined text-[18px] text-[#7d4600] shrink-0">
                      calendar_today
                    </span>
                    <div>
                      <span className="text-[#717970] text-[11px]">Date estimée : </span>
                      <strong className="text-[#2b1700]">{delivery.dateEstimee}</strong>
                    </div>
                  </div>
                </div>

                {/* Driver / Carrier details & action */}
                <div className="col-span-1 flex flex-col gap-3">
                  <div className="p-3 bg-white border border-[#c1c9be] rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#164525]/10 text-[#164525] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">person</span>
                      </div>
                      <div className="text-[12px]">
                        <span className="text-[#717970] block">Chauffeur / Transporteur</span>
                        <strong className="text-[#2b1700]">{delivery.transporteurNom}</strong>
                      </div>
                    </div>

                    <a
                      href={`tel:${delivery.transporteurTel.replace(/\s/g, '')}`}
                      className="p-2 bg-[#bbefc1] text-[#164525] rounded-full hover:bg-[#3d692b] hover:text-white transition-colors"
                      title="Appeler le chauffeur"
                    >
                      <span className="material-symbols-outlined text-[18px]">call</span>
                    </a>
                  </div>

                  {delivery.statut !== 'livree' ? (
                    <button
                      onClick={() => handleConfirm(delivery.id, delivery.preorderId, delivery.produitNom)}
                      className="w-full bg-[#164525] text-white font-['Montserrat'] text-[13px] font-bold py-2.5 rounded-full hover:bg-[#2f5d3a] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[18px]">done_all</span>
                      Confirmer la réception
                    </button>
                  ) : (
                    <div className="text-center text-[12px] font-semibold text-[#164525] bg-[#bbefc1]/40 py-2 rounded-full flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      Réception validée et conforme
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })
        )}
      </div>
    </div>
  );
};
