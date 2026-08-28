import React from 'react';
import { Preorder } from '../../types';

interface OrderTrackingViewProps {
  preorders: Preorder[];
  selectedPreorderId?: string;
  onSelectPreorder: (id: string) => void;
  onBackToMarketplace: () => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  preorders,
  selectedPreorderId,
  onSelectPreorder,
  onBackToMarketplace,
}) => {
  const currentPreorder =
    preorders.find((p) => p.id === selectedPreorderId) || preorders[0] || null;

  if (!currentPreorder) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-16 py-12 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-[#c1c9be] shadow-sm">
          <div className="w-16 h-16 bg-[#fff1e6] text-[#7d4600] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[32px]">receipt_long</span>
          </div>
          <h2 className="font-['Montserrat'] text-[20px] font-bold text-[#2b1700] mb-2">
            Aucune précommande active
          </h2>
          <p className="text-[14px] text-[#414941] mb-6">
            Vous n'avez pas encore effectué de précommande sur la marketplace.
          </p>
          <button
            onClick={onBackToMarketplace}
            className="w-full bg-[#164525] text-white font-semibold py-3 rounded-full hover:bg-[#2f5d3a] transition-all cursor-pointer"
          >
            Découvrir la marketplace
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    {
      title: 'Acompte Payé & Enregistré',
      date: currentPreorder.dateCommande,
      desc: `Acompte de ${currentPreorder.acompte.toLocaleString('fr-FR')} FCFA validé via ${
        currentPreorder.moyenPaiement === 'wave' ? 'Wave' : 'Orange Money'
      }`,
      completed: true,
      current: false,
    },
    {
      title: 'Culture & Suivi au Champ',
      date: 'En cours',
      desc: `La récolte est soignée par ${currentPreorder.producteur} (${currentPreorder.localisation})`,
      completed: true,
      current: true,
    },
    {
      title: 'Récolte & Contrôle Qualité',
      date: `Prévue vers le ${currentPreorder.datePrevueDisponibilite}`,
      desc: 'Pesée exacte, tri et conditionnement hygiénique conforme aux normes',
      completed: false,
      current: false,
    },
    {
      title: 'Livraison & Règlement du Solde',
      date: currentPreorder.datePrevueDisponibilite,
      desc: `Livraison à ${currentPreorder.lieuLivraison}. Solde de ${currentPreorder.soldeRestant.toLocaleString('fr-FR')} FCFA à la réception`,
      completed: false,
      current: false,
    },
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-16 py-8 flex flex-col gap-8">
      {/* Header with back button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            id="tracking-back-btn"
            onClick={onBackToMarketplace}
            className="flex items-center gap-1 text-[#164525] font-semibold text-[14px] hover:underline mb-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Retour à la Marketplace
          </button>
          <h1 className="font-['Montserrat'] text-[28px] md:text-[32px] font-bold text-[#2b1700]">
            Suivi de Précommande
          </h1>
          <p className="text-[14px] text-[#414941]">
            N° de commande : <span className="font-mono font-bold text-[#164525]">{currentPreorder.numeroCommande}</span>
          </p>
        </div>

        {/* If multiple orders exist, selector dropdown */}
        {preorders.length > 1 && (
          <div className="flex items-center gap-2">
            <label className="text-[13px] text-[#717970] font-medium">Mes commandes :</label>
            <select
              value={currentPreorder.id}
              onChange={(e) => onSelectPreorder(e.target.value)}
              className="p-2 bg-white border border-[#c1c9be] rounded-lg text-[13px] font-semibold text-[#164525] outline-none"
            >
              {preorders.map((po) => (
                <option key={po.id} value={po.id}>
                  {po.numeroCommande} - {po.produitNom}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Grid: Tracking Timeline + Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Timeline Column (2 cols) */}
        <div className="col-span-1 lg:col-span-2 bg-white border border-[#c1c9be] rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="font-['Montserrat'] text-[20px] font-bold text-[#2b1700] mb-6 flex items-center gap-2 border-b border-[#c1c9be]/40 pb-3">
            <span className="material-symbols-outlined text-[#164525]">route</span>
            Étapes d'avancement de votre récolte
          </h2>

          <div className="relative pl-6 sm:pl-8 flex flex-col gap-8 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#bbefc1]">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col gap-1">
                {/* Status Dot */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-0 w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold ${
                    step.completed
                      ? 'bg-[#164525] text-white shadow-sm ring-4 ring-[#FAF8F2]'
                      : 'bg-[#ffead7] border-2 border-[#c1c9be] text-[#717970] ring-4 ring-[#FAF8F2]'
                  }`}
                >
                  {step.completed ? '✓' : idx + 1}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className={`font-['Montserrat'] text-[16px] font-bold ${step.completed ? 'text-[#164525]' : 'text-[#717970]'}`}>
                    {step.title}
                  </h3>
                  <span className="text-[12px] font-semibold text-[#7d4600] bg-[#fff1e6] px-2 py-0.5 rounded-full w-fit">
                    {step.date}
                  </span>
                </div>
                <p className="text-[14px] text-[#414941]">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Guarantee Note */}
          <div className="mt-8 p-4 bg-[#FAF8F2] border border-[#E5DCCB] rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined text-[#164525] text-[28px]">verified_user</span>
            <div className="text-[13px] text-[#414941]">
              <strong className="text-[#164525]">Garantie Acompte Agri-Link :</strong> Votre acompte est sécurisé sur un compte tiers de confiance jusqu'à validation de la récolte et conformité du produit.
            </div>
          </div>
        </div>

        {/* Order Details Card (1 col) */}
        <div className="col-span-1 bg-white border border-[#c1c9be] rounded-2xl p-6 shadow-sm flex flex-col gap-5">
          <div className="flex items-center gap-3 border-b border-[#c1c9be]/40 pb-4">
            <img
              src={currentPreorder.produitImage}
              alt={currentPreorder.produitNom}
              className="w-16 h-16 rounded-xl object-cover border border-[#c1c9be]"
            />
            <div>
              <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#2b1700]">
                {currentPreorder.produitNom}
              </h3>
              <p className="text-[13px] text-[#717970]">{currentPreorder.producteur}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-[#bbefc1] text-[#164525] text-[11px] font-bold rounded-full">
                Précommande Validée
              </span>
            </div>
          </div>

          {/* Details list */}
          <div className="flex flex-col gap-2.5 text-[14px]">
            <div className="flex justify-between">
              <span className="text-[#717970]">Quantité</span>
              <span className="font-bold text-[#2b1700]">
                {currentPreorder.quantite} {currentPreorder.unite}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#717970]">Prix unitaire</span>
              <span className="font-semibold text-[#2b1700]">
                {currentPreorder.prixUnitaire.toLocaleString('fr-FR')} FCFA
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#717970]">Montant total</span>
              <span className="font-bold text-[#2b1700]">
                {currentPreorder.montantTotal.toLocaleString('fr-FR')} FCFA
              </span>
            </div>

            <div className="w-full h-px bg-[#c1c9be]/40 my-1"></div>

            <div className="flex justify-between bg-[#bbefc1]/40 p-2 rounded-lg">
              <span className="text-[#164525] font-semibold">Acompte payé</span>
              <span className="font-bold text-[#164525]">
                {currentPreorder.acompte.toLocaleString('fr-FR')} FCFA (PAYÉ)
              </span>
            </div>

            <div className="flex justify-between p-2">
              <span className="text-[#7d4600] font-semibold">Solde restant</span>
              <span className="font-bold text-[#7d4600]">
                {currentPreorder.soldeRestant.toLocaleString('fr-FR')} FCFA
              </span>
            </div>

            <div className="w-full h-px bg-[#c1c9be]/40 my-1"></div>

            <div className="flex flex-col gap-1 text-[13px]">
              <span className="text-[#717970]">Lieu de livraison prévu :</span>
              <span className="font-medium text-[#2b1700] bg-[#FAF8F2] p-2 rounded-lg border border-[#c1c9be]/40">
                📍 {currentPreorder.lieuLivraison}
              </span>
            </div>

            <div className="flex flex-col gap-1 text-[13px] mt-1">
              <span className="text-[#717970]">Bénéficiaire :</span>
              <span className="font-medium text-[#2b1700]">
                {currentPreorder.nomClient} ({currentPreorder.telephoneClient})
              </span>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={onBackToMarketplace}
            className="w-full bg-[#164525] text-white font-['Montserrat'] text-[15px] font-bold py-3 rounded-full hover:bg-[#2f5d3a] transition-all cursor-pointer text-center"
          >
            Nouvelle précommande
          </button>
        </div>
      </div>
    </div>
  );
};
