import React from 'react';
import { Preorder, PaymentRecord, BuyerProfile } from '../../types';

interface BuyerReceiptModalProps {
  receiptData?: {
    preorder?: Preorder;
    payment?: PaymentRecord;
  } | null;
  preorder?: Preorder;
  payment?: PaymentRecord;
  buyerProfile?: BuyerProfile;
  onClose: () => void;
}

export const BuyerReceiptModal: React.FC<BuyerReceiptModalProps> = ({
  receiptData,
  preorder: directPreorder,
  payment: directPayment,
  buyerProfile,
  onClose,
}) => {
  const preorder = directPreorder || receiptData?.preorder;
  const payment = directPayment || receiptData?.payment;

  if (!preorder && !payment && !receiptData) return null;

  const safeBuyerProfile: BuyerProfile = buyerProfile || {
    id: 'buyer-default',
    nom: 'Diop',
    prenom: 'Moussa',
    email: 'moussa.diop@exemple.sn',
    telephone: '77 845 12 34',
    typeAcheteur: 'Particulier',
    adresseLivraisonParDefaut: 'Dakar - Grand Dakar',
    ville: 'Dakar',
    quartier: 'Grand Dakar',
    codeClient: 'ACH-DKR-4402',
    dateInscription: '15 Jan 2025',
    notificationsActives: true,
  };

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = payment?.numeroFacture || `FAC-${preorder?.numeroCommande.replace('CMD-AL-', '') || '2025-0991'}`;
  const transactionNumber = payment?.numeroTransaction || `TXN-WAV-${Date.now().toString().slice(-8)}`;
  const datePaiement = payment?.datePaiement || preorder?.dateCommande || new Date().toLocaleDateString('fr-FR');
  const moyen = payment?.moyenPaiement || preorder?.moyenPaiement || 'wave';
  const productName = payment?.produitNom || preorder?.produitNom || 'Produit Agricole';
  const amount = payment?.montant || preorder?.acompte || 12000;
  const isAcompte = payment?.typePaiement === 'acompte' || (preorder && preorder.soldeRestant > 0);

  return (
    <div
      id="receipt-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="receipt-modal-content"
        className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-8 shadow-2xl border border-[#c1c9be] relative my-auto max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          id="close-receipt-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#717970] hover:text-[#2b1700] p-1 rounded-full hover:bg-[#fff1e6] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>

        {/* Receipt Header */}
        <div className="flex items-start justify-between border-b border-[#c1c9be]/50 pb-5 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Montserrat'] text-[22px] font-bold text-[#164525]">
                Agri-Link
              </span>
              <span className="bg-[#bbefc1] text-[#164525] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Reçu Officiel
              </span>
            </div>
            <p className="text-[12px] text-[#717970] mt-0.5">
              Plateforme Agricole de Vente Directe & Précommandes
            </p>
            <p className="text-[11px] text-[#717970]">Dakar, Sénégal • support@agrilink.sn</p>
          </div>

          <div className="text-right">
            <div className="font-mono text-[13px] font-bold text-[#164525]">
              {invoiceNumber}
            </div>
            <div className="text-[11px] text-[#717970]">{datePaiement}</div>
          </div>
        </div>

        {/* Customer & Transaction Info */}
        <div className="grid grid-cols-2 gap-4 bg-[#FAF8F2] p-4 rounded-xl border border-[#E5DCCB] mb-5 text-[13px]">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#717970] font-semibold block mb-0.5">
              Acheteur / Client
            </span>
            <div className="font-bold text-[#2b1700]">
              {safeBuyerProfile.prenom} {safeBuyerProfile.nom}
            </div>
            {safeBuyerProfile.nomEntreprise && (
              <div className="text-[12px] text-[#164525] font-medium">
                {safeBuyerProfile.nomEntreprise}
              </div>
            )}
            <div className="text-[#414941] text-[12px]">{safeBuyerProfile.telephone}</div>
            <div className="text-[#717970] text-[11px]">{safeBuyerProfile.ville} - {safeBuyerProfile.quartier}</div>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#717970] font-semibold block mb-0.5">
              Détails Transaction
            </span>
            <div className="font-mono text-[12px] font-semibold text-[#2b1700]">
              {transactionNumber}
            </div>
            <div className="mt-1 flex items-center gap-1">
              <span className="text-[12px] text-[#414941]">Moyen :</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                moyen === 'wave' ? 'bg-[#1e90ff]/15 text-[#0066cc]' : 'bg-[#ff6600]/15 text-[#cc5200]'
              }`}>
                {moyen === 'wave' ? 'Wave Mobile Money' : 'Orange Money'}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <span className="text-[12px] text-[#414941]">Statut :</span>
              <span className="text-[#164525] font-bold text-[12px] flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                Validé & Garanti
              </span>
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="border border-[#c1c9be]/50 rounded-xl overflow-hidden mb-5">
          <div className="bg-[#fff1e6] px-4 py-2 text-[12px] font-bold text-[#7d4600] flex justify-between">
            <span>Désignation</span>
            <span>Montant</span>
          </div>

          <div className="p-4 flex flex-col gap-2.5 text-[13px]">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-[#2b1700]">{productName}</div>
                {preorder && (
                  <div className="text-[12px] text-[#717970]">
                    Quantité : {preorder.quantite} {preorder.unite} • {preorder.producteur}
                  </div>
                )}
                {isAcompte && (
                  <span className="text-[11px] font-semibold text-[#7d4600] bg-[#ffead7] px-1.5 py-0.5 rounded inline-block mt-0.5">
                    Acompte de réservation (30%)
                  </span>
                )}
              </div>
              <span className="font-bold text-[#164525]">
                {amount.toLocaleString('fr-FR')} FCFA
              </span>
            </div>

            {preorder && preorder.soldeRestant > 0 && (
              <>
                <div className="w-full h-px bg-[#c1c9be]/30 my-1"></div>
                <div className="flex justify-between text-[12px] text-[#717970]">
                  <span>Valeur totale de la récolte :</span>
                  <span>{preorder.montantTotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between text-[12px] text-[#7d4600] font-medium">
                  <span>Solde restant à régler à la livraison :</span>
                  <span>{preorder.soldeRestant.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </>
            )}
          </div>

          <div className="bg-[#FAF8F2] px-4 py-3 border-t border-[#c1c9be]/40 flex justify-between items-center">
            <span className="font-['Montserrat'] font-bold text-[#2b1700] text-[14px]">
              Total Réglé (Acompte)
            </span>
            <span className="font-['Montserrat'] font-bold text-[#164525] text-[18px]">
              {amount.toLocaleString('fr-FR')} FCFA
            </span>
          </div>
        </div>

        {/* Security & Authenticity Seal */}
        <div className="flex items-center justify-between p-3 bg-[#FAF8F2] rounded-xl border border-[#c1c9be]/40 mb-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#164525] text-[24px]">verified</span>
            <div className="text-[11px] text-[#414941]">
              <strong className="text-[#164525]">Garantie Séquestre Agri-Link</strong>
              <p>Fonds bloqués jusqu'à livraison et conformité certifiée.</p>
            </div>
          </div>
          <div className="w-12 h-12 bg-white border border-[#c1c9be] rounded flex items-center justify-center text-[#164525]">
            <span className="material-symbols-outlined text-[28px]">qr_code_2</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            id="print-receipt-btn"
            onClick={handlePrint}
            className="flex-1 bg-[#164525] text-white py-2.5 rounded-full font-medium text-[14px] hover:bg-[#2f5d3a] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            Imprimer / PDF
          </button>

          <button
            id="close-receipt-btn"
            onClick={onClose}
            className="px-6 py-2.5 border border-[#c1c9be] text-[#414941] rounded-full font-medium text-[14px] hover:bg-[#fff1e6] transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
