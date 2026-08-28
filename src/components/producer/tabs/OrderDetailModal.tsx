import React from 'react';
import { ProducerOrder, ProducerOrderStatus } from '../../../types';

interface OrderDetailModalProps {
  order: ProducerOrder | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: ProducerOrderStatus) => void;
  onOpenDeliveryTab?: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
  onOpenDeliveryTab,
}) => {
  if (!order) return null;

  const timelineSteps: { id: ProducerOrderStatus; label: string; icon: string; desc: string }[] = [
    {
      id: 'Précommande',
      label: 'Précommande',
      icon: 'receipt_long',
      desc: 'Réservation enregistrée sur la récolte future',
    },
    {
      id: 'Acompte payé',
      label: 'Acompte payé',
      icon: 'savings',
      desc: '30% sous séquestre sécurisé',
    },
    {
      id: 'Production en cours',
      label: 'Production en cours',
      icon: 'potted_plant',
      desc: 'Floraison & culture en parcelle',
    },
    {
      id: 'Produit disponible',
      label: 'Produit disponible',
      icon: 'check_circle',
      desc: 'Récolte effectuée et contrôlée',
    },
    {
      id: 'Préparation',
      label: 'Préparation',
      icon: 'inventory_2',
      desc: 'Conditionnement & pesée en caisses',
    },
    {
      id: 'En livraison',
      label: 'En livraison',
      icon: 'local_shipping',
      desc: 'Transporteur en route vers le client',
    },
    {
      id: 'Livrée',
      label: 'Livrée',
      icon: 'task_alt',
      desc: 'Réception confirmée et solde débloqué',
    },
  ];

  const currentStepIndex = timelineSteps.findIndex((s) => s.id === order.statut);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#c1c9be] shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#c1c9be]/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-[#164525]/10 text-[#164525]">
                {order.statut}
              </span>
              <h2 className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700]">
                Commande #{order.numeroCommande}
              </h2>
            </div>
            <p className="text-[12px] text-[#717970] mt-0.5">
              Enregistrée le {order.dateCommande} • Disponibilité : {order.datePrevueDisponibilite}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#717970] hover:text-[#2b1700] p-1.5 rounded-full hover:bg-[#FAF8F2] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-6 mt-6">
          {/* Product & Buyer Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#FAF8F2] border border-[#c1c9be]/50">
            <div className="flex items-center gap-3">
              <img
                src={order.produitImage}
                alt={order.produitNom}
                className="w-14 h-14 rounded-xl object-cover border border-[#c1c9be]/60"
              />
              <div>
                <h3 className="font-semibold text-[14px] text-[#2b1700]">
                  {order.produitNom}
                </h3>
                <p className="text-[12px] text-[#164525] font-bold">
                  {order.quantite} {order.unite} à {order.prixUnitaire} FCFA/{order.unite}
                </p>
                <span className="text-[11px] text-[#717970]">
                  Total : {order.montantTotal.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
            </div>

            <div className="border-t sm:border-t-0 sm:border-l border-[#c1c9be]/50 pt-3 sm:pt-0 sm:pl-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#717970] block">
                Acheteur & Contact
              </span>
              <h4 className="font-semibold text-[13px] text-[#2b1700] mt-0.5">
                {order.acheteurNom}
              </h4>
              <p className="text-[12px] text-[#164525] font-medium flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[14px]">call</span>
                {order.acheteurTel}
              </p>
              <p className="text-[11px] text-[#717970] mt-0.5 truncate">
                {order.acheteurAdresse}
              </p>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl border border-[#c1c9be]/60 text-[12px]">
            <div>
              <span className="text-[#717970] block">Montant Total</span>
              <strong className="text-[14px] text-[#2b1700] block mt-0.5">
                {order.montantTotal.toLocaleString('fr-FR')} FCFA
              </strong>
            </div>
            <div>
              <span className="text-[#717970] block">Acompte Payé (30%)</span>
              <strong className="text-[14px] text-[#164525] block mt-0.5">
                {order.acomptePaye.toLocaleString('fr-FR')} FCFA
              </strong>
            </div>
            <div>
              <span className="text-[#717970] block">Solde à percevoir (70%)</span>
              <strong className="text-[14px] text-[#7d4600] block mt-0.5">
                {order.soldeRestant.toLocaleString('fr-FR')} FCFA
              </strong>
            </div>
          </div>

          {/* Interactive Timeline (Suivi de commande) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-['Montserrat'] text-[15px] font-bold text-[#2b1700]">
                Suivi de la Commande (Mise à jour directe)
              </h3>
              <span className="text-[11px] text-[#717970]">
                Visible en direct par l'acheteur
              </span>
            </div>

            <div className="flex flex-col gap-2 relative pl-6 border-l-2 border-[#c1c9be]/60 ml-3">
              {timelineSteps.map((step, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = order.statut === step.id;

                return (
                  <div key={step.id} className="relative pb-4 last:pb-0">
                    {/* Circle marker */}
                    <div
                      className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold transition-all ${
                        isPassed
                          ? 'bg-[#164525] text-white shadow-xs'
                          : 'bg-white border-2 border-[#c1c9be] text-[#717970]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {step.icon}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <h4
                          className={`text-[13px] font-bold ${
                            isCurrent
                              ? 'text-[#164525]'
                              : isPassed
                              ? 'text-[#2b1700]'
                              : 'text-[#717970]'
                          }`}
                        >
                          {step.label}
                        </h4>
                        <p className="text-[11px] text-[#717970]">
                          {step.desc}
                        </p>
                      </div>

                      {/* Button to advance to this status */}
                      {!isCurrent && (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(order.id, step.id)}
                          className="self-start sm:self-auto text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-[#c1c9be] hover:bg-[#164525] hover:text-white hover:border-[#164525] transition-colors cursor-pointer"
                        >
                          Passer à cette étape
                        </button>
                      )}
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-[#164525] bg-[#164525]/10 px-2 py-0.5 rounded">
                          Étape active
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transport Info */}
          {order.transporteurNom && (
            <div className="p-3.5 rounded-xl bg-[#FAF8F2] border border-[#c1c9be]/60 text-[12px] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#164525] text-[20px]">
                  local_shipping
                </span>
                <div>
                  <strong className="text-[#2b1700] block">{order.transporteurNom}</strong>
                  <span className="text-[#717970]">{order.transporteurTel}</span>
                </div>
              </div>
              {onOpenDeliveryTab && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenDeliveryTab();
                  }}
                  className="text-[#164525] font-semibold hover:underline cursor-pointer"
                >
                  Voir dans Livraisons
                </button>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-[#c1c9be]/50">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#164525] text-white font-bold text-[13px] hover:bg-[#2f5d3a] cursor-pointer shadow-sm"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
