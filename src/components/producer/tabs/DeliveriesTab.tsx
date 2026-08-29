import React, { useState } from 'react';
import { ProducerDelivery, ProducerOrderStatus } from '../../../types';

interface DeliveriesTabProps {
  deliveries: ProducerDelivery[];
  onUpdateDeliveryStatus: (
    deliveryId: string,
    status: ProducerOrderStatus,
    dateLivree?: string
  ) => void;
}

export const DeliveriesTab: React.FC<DeliveriesTabProps> = ({
  deliveries,
  onUpdateDeliveryStatus,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedDeliveryForTracking, setSelectedDeliveryForTracking] =
    useState<ProducerDelivery | null>(null);

  const filteredDeliveries = deliveries.filter((d) => {
    if (filterStatus === 'all') return true;
    return d.statut === filterStatus;
  });

  const getStatusBadge = (statut: ProducerOrderStatus) => {
    switch (statut) {
      case 'Préparation':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'En livraison':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Livrée':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white border border-[#c1c9be] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#164525] text-[28px]">
              local_shipping
            </span>
            <h1 className="font-['Montserrat'] text-[22px] font-bold text-[#2b1700]">
              Expéditions & Livraisons
            </h1>
          </div>
          <p className="text-[13px] text-[#717970] mt-1">
            Suivi des expéditions de récoltes, affectation des transporteurs partenaires et validation des réceptions acheteurs.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-1.5 bg-white border border-[#c1c9be] p-3 rounded-2xl">
        {[
          { id: 'all', label: 'Toutes les livraisons' },
          { id: 'Préparation', label: 'À préparer / En caisse' },
          { id: 'En livraison', label: 'En cours de route' },
          { id: 'Livrée', label: 'Livrées avec succès' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all cursor-pointer ${
              filterStatus === tab.id
                ? 'bg-[#164525] text-white shadow-xs'
                : 'bg-[#FAF8F2] text-[#414941] hover:bg-[#eae4d5]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Deliveries Table */}
      <div className="bg-white border border-[#c1c9be] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#FAF8F2] border-b border-[#c1c9be] text-[#717970] font-semibold text-[12px] uppercase">
                <th className="py-3.5 px-4">Commande</th>
                <th className="py-3.5 px-4">Destinataire & Adresse</th>
                <th className="py-3.5 px-4">Produits</th>
                <th className="py-3.5 px-4">Transporteur</th>
                <th className="py-3.5 px-4">Date Prévue</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c1c9be]/40">
              {filteredDeliveries.map((del) => (
                <tr key={del.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#164525]">
                    #{del.orderNumero}
                  </td>
                  <td className="py-3.5 px-4">
                    <strong className="text-[#2b1700] block">{del.acheteurNom}</strong>
                    <span className="text-[11px] text-[#717970] block truncate max-w-xs">
                      {del.adresseLivraison}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-[#2b1700]">
                      {del.produitNom}
                    </span>
                    <span className="text-[11px] text-[#164525] font-bold block">
                      {del.quantite} {del.unite}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[12px]">
                    <span className="font-medium text-[#2b1700] block">
                      {del.transporteurNom}
                    </span>
                    <span className="text-[#717970] text-[11px]">
                      {del.transporteurTel}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[12px] text-[#414941]">
                    {del.datePrevue}
                    {del.dateLivree && (
                      <span className="block text-[10px] text-[#164525] font-semibold">
                        Reçu le {del.dateLivree}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadge(
                        del.statut
                      )}`}
                    >
                      {del.statut}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {del.statut === 'Préparation' && (
                        <button
                          onClick={() =>
                            onUpdateDeliveryStatus(del.id, 'En livraison')
                          }
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-white bg-purple-700 hover:bg-purple-800 transition-colors cursor-pointer"
                        >
                          Expédier
                        </button>
                      )}
                      {del.statut === 'En livraison' && (
                        <button
                          onClick={() =>
                            onUpdateDeliveryStatus(
                              del.id,
                              'Livrée',
                              'Aujourd\'hui, 14:00'
                            )
                          }
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-white bg-[#164525] hover:bg-[#2f5d3a] transition-colors cursor-pointer"
                        >
                          Confirmer livrée
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedDeliveryForTracking(del)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#164525] bg-[#164525]/10 hover:bg-[#164525]/20 transition-colors cursor-pointer"
                      >
                        Suivi GPS
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulated Tracking Map / Modal */}
      {selectedDeliveryForTracking && (
        <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 border border-[#c1c9be] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#c1c9be]/50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#164525]">
                  share_location
                </span>
                <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#2b1700]">
                  Suivi Expédition #{selectedDeliveryForTracking.orderNumero}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDeliveryForTracking(null)}
                className="text-[#717970] hover:text-[#2b1700] p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <div className="bg-[#FAF8F2] p-4 rounded-xl border border-[#c1c9be]/50 text-[13px] flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-[#717970]">Transporteur :</span>
                  <strong className="text-[#2b1700]">
                    {selectedDeliveryForTracking.transporteurNom}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#717970]">Destination :</span>
                  <span className="text-[#2b1700] text-right">
                    {selectedDeliveryForTracking.adresseLivraison}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#717970]">Statut du trajet :</span>
                  <span className="font-bold text-[#164525]">
                    {selectedDeliveryForTracking.statut}
                  </span>
                </div>
              </div>

              {/* Graphical Route Illustration */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-[12px]">
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined text-[#164525]">
                    agriculture
                  </span>
                  <span className="font-semibold text-[#164525] mt-1">Ferme Niayes</span>
                </div>
                <div className="flex-1 mx-3 border-t-2 border-dashed border-[#164525]/60 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#7d4600] animate-pulse">
                    local_shipping
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined text-[#2b1700]">
                    store
                  </span>
                  <span className="font-semibold text-[#2b1700] mt-1">Client</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 mt-2 border-t border-[#c1c9be]/50">
              <button
                onClick={() => setSelectedDeliveryForTracking(null)}
                className="px-5 py-2 rounded-full bg-[#164525] text-white font-bold text-[13px] hover:bg-[#2f5d3a] cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
