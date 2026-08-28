import React from 'react';
import { Preorder, BuyerProfile } from '../../types';

interface BuyerPreorderDetailModalProps {
  preorder: Preorder | null;
  buyerProfile?: BuyerProfile;
  onClose: () => void;
  onOpenReceipt: (preorder: Preorder) => void;
  onConfirmDelivery?: (preorderId: string) => void;
}

export const BuyerPreorderDetailModal: React.FC<BuyerPreorderDetailModalProps> = ({
  preorder,
  buyerProfile,
  onClose,
  onOpenReceipt,
  onConfirmDelivery,
}) => {
  if (!preorder) return null;

  // Timeline configuration based on status
  const getTimelineSteps = (status: string) => {
    const isCompleted = (targetStatusIndex: number, currentIdx: number) => currentIdx >= targetStatusIndex;
    const isCurrent = (targetStatusIndex: number, currentIdx: number) => currentIdx === targetStatusIndex;

    const statusHierarchy: { [key: string]: number } = {
      'En attente': 0,
      'Confirmée': 1,
      'En culture': 2,
      'En récolte': 3,
      'Prête pour livraison': 4,
      'En livraison': 5,
      'Livrée': 6,
      'Annulée': -1,
    };

    const currentLevel = statusHierarchy[status] ?? 2;

    return [
      {
        id: 1,
        titre: 'Précommande & Acompte Sécurisé',
        date: preorder.dateCommande,
        desc: `Acompte de ${preorder.acompte.toLocaleString('fr-FR')} FCFA réglé par ${
          preorder.moyenPaiement === 'wave' ? 'Wave Mobile' : 'Orange Money'
        } et consigné sous séquestre Agri-Link.`,
        completed: isCompleted(1, currentLevel),
        current: isCurrent(1, currentLevel),
        icon: 'payments',
      },
      {
        id: 2,
        titre: 'Culture & Suivi au Champ',
        date: 'En cours',
        desc: `Semis, irrigation et entretien par ${preorder.producteur} (${preorder.localisation}). Contrôles agronomiques réguliers.`,
        completed: isCompleted(2, currentLevel),
        current: isCurrent(2, currentLevel),
        icon: 'agriculture',
      },
      {
        id: 3,
        titre: 'Récolte, Pesée & Tri Qualité',
        date: `Prévue vers ${preorder.datePrevueDisponibilite}`,
        desc: `Pesée certifiée de ${preorder.quantite} ${preorder.unite}, calibrage et conditionnement hygiénique.`,
        completed: isCompleted(3, currentLevel),
        current: isCurrent(3, currentLevel),
        icon: 'inventory',
      },
      {
        id: 4,
        titre: 'Préparation & Expédition',
        date: preorder.datePrevueDisponibilite,
        desc: `Pris en charge par ${preorder.transporteurNom || 'Agri-Link Express'} pour livraison directe à ${preorder.lieuLivraison}.`,
        completed: isCompleted(5, currentLevel),
        current: isCurrent(4, currentLevel) || isCurrent(5, currentLevel),
        icon: 'local_shipping',
      },
      {
        id: 5,
        titre: 'Livraison & Règlement du Solde',
        date: preorder.datePrevueDisponibilite,
        desc: `Réception des marchandises, vérification de la fraîcheur et versement du solde (${preorder.soldeRestant.toLocaleString(
          'fr-FR'
        )} FCFA).`,
        completed: isCompleted(6, currentLevel),
        current: isCurrent(6, currentLevel),
        icon: 'task_alt',
      },
    ];
  };

  const timeline = getTimelineSteps(preorder.statutCommande);

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'Confirmée':
        return 'bg-[#bbefc1] text-[#164525] border-[#3d692b]/30';
      case 'En culture':
        return 'bg-[#fff1e6] text-[#7d4600] border-[#ffb875]/40';
      case 'En récolte':
        return 'bg-[#ffead7] text-[#7d4600] border-[#7d4600]/30';
      case 'Prête pour livraison':
      case 'En livraison':
        return 'bg-[#164525] text-white border-[#164525]';
      case 'Livrée':
        return 'bg-[#bbefc1] text-[#164525] border-[#3d692b]';
      case 'Annulée':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div
      id="preorder-detail-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="preorder-detail-modal-content"
        className="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full p-5 sm:p-8 shadow-2xl border border-[#c1c9be] relative my-auto max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#c1c9be]/50 pb-4 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-['Montserrat'] text-[22px] font-bold text-[#2b1700]">
                Détail de la Précommande
              </h2>
              <span className={`px-3 py-0.5 text-[12px] font-bold rounded-full border ${getStatusBadge(preorder.statutCommande)}`}>
                {preorder.statutCommande}
              </span>
            </div>
            <p className="text-[13px] text-[#717970] mt-1">
              Numéro de commande : <span className="font-mono font-bold text-[#164525]">{preorder.numeroCommande}</span> • Passée le {preorder.dateCommande}
            </p>
          </div>

          <button
            id="close-preorder-modal-btn"
            onClick={onClose}
            className="text-[#717970] hover:text-[#2b1700] p-1.5 rounded-full hover:bg-[#fff1e6] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Product & Summary Banner */}
        <div className="bg-[#FAF8F2] border border-[#E5DCCB] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img
              src={preorder.produitImage}
              alt={preorder.produitNom}
              className="w-20 h-20 rounded-xl object-cover border border-[#c1c9be] shrink-0"
            />
            <div>
              <h3 className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700]">
                {preorder.produitNom}
              </h3>
              <p className="text-[13px] text-[#414941] flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[16px] text-[#164525]">agriculture</span>
                {preorder.producteur} ({preorder.localisation})
              </p>
              <div className="text-[13px] font-semibold text-[#164525] mt-1">
                Quantité réservée : {preorder.quantite} {preorder.unite}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:items-end w-full sm:w-auto border-t sm:border-t-0 border-[#c1c9be]/40 pt-3 sm:pt-0">
            <div className="text-[12px] text-[#717970]">Montant total engagé</div>
            <div className="font-['Montserrat'] text-[20px] font-bold text-[#164525]">
              {preorder.montantTotal.toLocaleString('fr-FR')} FCFA
            </div>
            <button
              onClick={() => onOpenReceipt(preorder)}
              className="mt-2 text-[12px] font-semibold text-[#164525] hover:underline flex items-center gap-1 cursor-pointer bg-white px-3 py-1 rounded-lg border border-[#c1c9be]"
            >
              <span className="material-symbols-outlined text-[16px]">receipt</span>
              Voir le reçu d'acompte
            </button>
          </div>
        </div>

        {/* Step-by-Step Status Timeline */}
        <div className="mb-8">
          <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#2b1700] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#164525]">timeline</span>
            Avancement de la production et de la récolte
          </h3>

          <div className="relative pl-6 sm:pl-8 flex flex-col gap-6 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#bbefc1]">
            {timeline.map((step) => (
              <div key={step.id} className="relative flex flex-col gap-1">
                {/* Dot */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-0 w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold ${
                    step.completed
                      ? 'bg-[#164525] text-white ring-4 ring-[#FAF8F2]'
                      : step.current
                      ? 'bg-[#ffead7] border-2 border-[#7d4600] text-[#7d4600] ring-4 ring-[#FAF8F2]'
                      : 'bg-[#FAF8F2] border-2 border-[#c1c9be] text-[#717970] ring-4 ring-[#FAF8F2]'
                  }`}
                >
                  {step.completed ? (
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  ) : (
                    step.id
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className={`font-['Montserrat'] text-[15px] font-bold ${step.completed || step.current ? 'text-[#164525]' : 'text-[#717970]'}`}>
                    {step.titre}
                  </h4>
                  <span className="text-[11px] font-semibold text-[#7d4600] bg-[#fff1e6] px-2 py-0.5 rounded-full w-fit">
                    {step.date}
                  </span>
                </div>
                <p className="text-[13px] text-[#414941] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Financial & Delivery Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Financial Breakdown */}
          <div className="bg-white border border-[#c1c9be] rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <h4 className="font-['Montserrat'] text-[14px] font-bold text-[#2b1700] flex items-center gap-1.5 border-b border-[#c1c9be]/40 pb-2">
              <span className="material-symbols-outlined text-[#164525] text-[18px]">account_balance_wallet</span>
              Bilan Financier
            </h4>

            <div className="flex justify-between text-[13px]">
              <span className="text-[#717970]">Prix unitaire :</span>
              <span className="font-semibold text-[#2b1700]">{preorder.prixUnitaire.toLocaleString('fr-FR')} FCFA / {preorder.unite}</span>
            </div>

            <div className="flex justify-between text-[13px]">
              <span className="text-[#717970]">Montant total de la récolte :</span>
              <span className="font-bold text-[#2b1700]">{preorder.montantTotal.toLocaleString('fr-FR')} FCFA</span>
            </div>

            <div className="flex justify-between text-[13px] bg-[#bbefc1]/30 p-2 rounded-lg">
              <span className="text-[#164525] font-semibold">Acompte payé (30%) :</span>
              <span className="font-bold text-[#164525]">
                {preorder.acompte.toLocaleString('fr-FR')} FCFA ({preorder.moyenPaiement === 'wave' ? 'Wave' : 'Orange Money'})
              </span>
            </div>

            <div className="flex justify-between text-[13px] bg-[#ffead7]/40 p-2 rounded-lg">
              <span className="text-[#7d4600] font-semibold">Solde restant à la livraison :</span>
              <span className="font-bold text-[#7d4600]">
                {preorder.soldeRestant.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
          </div>

          {/* Delivery & Logistics */}
          <div className="bg-white border border-[#c1c9be] rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <h4 className="font-['Montserrat'] text-[14px] font-bold text-[#2b1700] flex items-center gap-1.5 border-b border-[#c1c9be]/40 pb-2">
              <span className="material-symbols-outlined text-[#164525] text-[18px]">local_shipping</span>
              Logistique & Réception
            </h4>

            <div className="text-[13px]">
              <span className="text-[#717970] block text-[11px] uppercase font-semibold">Lieu de livraison :</span>
              <span className="font-medium text-[#2b1700]">{preorder.lieuLivraison}</span>
            </div>

            <div className="text-[13px]">
              <span className="text-[#717970] block text-[11px] uppercase font-semibold">Disponibilité estimée :</span>
              <span className="font-semibold text-[#164525]">{preorder.datePrevueDisponibilite}</span>
            </div>

            <div className="text-[13px]">
              <span className="text-[#717970] block text-[11px] uppercase font-semibold">Transporteur assigné :</span>
              <span className="text-[#414941]">
                {preorder.transporteurNom || 'Agri-Link Express Dakar'} {preorder.transporteurTel ? `(${preorder.transporteurTel})` : ''}
              </span>
            </div>

            {preorder.notes && (
              <div className="text-[12px] bg-[#FAF8F2] p-2 rounded border border-[#E5DCCB] text-[#414941]">
                <strong className="text-[#7d4600]">Note : </strong> {preorder.notes}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap gap-3 justify-end pt-4 border-t border-[#c1c9be]/50">
          {preorder.statutCommande === 'Prête pour livraison' || preorder.statutCommande === 'En livraison' ? (
            <button
              onClick={() => {
                if (onConfirmDelivery) onConfirmDelivery(preorder.id);
                onClose();
              }}
              className="bg-[#164525] text-white font-medium text-[14px] px-5 py-2.5 rounded-full hover:bg-[#2f5d3a] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">done_all</span>
              Confirmer la réception de la récolte
            </button>
          ) : null}

          <button
            onClick={() => onOpenReceipt(preorder)}
            className="bg-[#3a6844]/10 text-[#164525] font-medium text-[14px] px-5 py-2.5 rounded-full hover:bg-[#3a6844]/20 transition-all flex items-center gap-1.5 cursor-pointer border border-[#3a6844]/20"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Télécharger le reçu
          </button>

          <button
            onClick={onClose}
            className="border border-[#c1c9be] text-[#414941] font-medium text-[14px] px-5 py-2.5 rounded-full hover:bg-[#fff1e6] transition-all cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
