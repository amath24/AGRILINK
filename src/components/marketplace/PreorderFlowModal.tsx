import React, { useState } from 'react';
import { Product, Preorder } from '../../types';

interface PreorderFlowModalProps {
  product: Product;
  initialQuantity: number;
  onClose: () => void;
  onOrderConfirmed: (preorder: Preorder) => void;
  onNavigateToTracking: (preorder: Preorder) => void;
}

type FlowStep = 'form' | 'payment' | 'processing' | 'confirmation';

export const PreorderFlowModal: React.FC<PreorderFlowModalProps> = ({
  product,
  initialQuantity,
  onClose,
  onOrderConfirmed,
  onNavigateToTracking,
}) => {
  const [step, setStep] = useState<FlowStep>('form');
  const [quantity, setQuantity] = useState<number>(
    Math.max(initialQuantity, product.quantiteMinimale || 1)
  );
  
  // Delivery & Customer state
  const [deliveryLocation, setDeliveryLocation] = useState<string>('Dakar - Grand Dakar');
  const [customAddress, setCustomAddress] = useState<string>('');
  const [clientName, setClientName] = useState<string>('Moussa Diop');
  const [clientPhone, setClientPhone] = useState<string>('77 845 12 34');

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'wave' | 'orange_money'>('wave');
  const [paymentPhone, setPaymentPhone] = useState<string>('77 845 12 34');

  // Completed preorder object
  const [createdPreorder, setCreatedPreorder] = useState<Preorder | null>(null);

  // Math calculations
  const unitPrice = product.prix;
  const totalPrice = quantity * unitPrice;
  const acomptePct = product.typeDisponibilite === 'preorder' ? product.acomptePourcentage || 30 : 100;
  const acompteAmount = Math.round((totalPrice * acomptePct) / 100);
  const remainingBalance = totalPrice - acompteAmount;

  const handleDecrease = () => {
    if (quantity > (product.quantiteMinimale || 1)) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleExecutePayment = () => {
    setStep('processing');
    
    // Simulate mobile payment process
    setTimeout(() => {
      const newPreorder: Preorder = {
        id: 'order-' + Date.now(),
        numeroCommande: 'CMD-AL-' + Math.floor(100000 + Math.random() * 900000),
        produitId: product.id,
        produitNom: product.nom,
        produitImage: product.image,
        producteur: product.producteur,
        localisation: product.localisation,
        quantite: quantity,
        unite: product.unite,
        prixUnitaire: unitPrice,
        montantTotal: totalPrice,
        acompte: acompteAmount,
        soldeRestant: remainingBalance,
        acomptePct: acomptePct,
        lieuLivraison: customAddress ? `${deliveryLocation} (${customAddress})` : deliveryLocation,
        nomClient: clientName,
        telephoneClient: clientPhone,
        moyenPaiement: paymentMethod,
        statutPaiementAcompte: 'payé',
        statutCommande: 'Confirmée',
        dateCommande: new Date().toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        datePrevueDisponibilite: product.dateDisponibilite,
      };

      setCreatedPreorder(newPreorder);
      onOrderConfirmed(newPreorder);
      setStep('confirmation');
    }, 1200);
  };

  return (
    <div
      id="preorder-flow-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        id="preorder-flow-modal-card"
        className="bg-[#FAF8F2] border border-[#c1c9be] rounded-2xl sm:rounded-3xl w-full max-w-xl min-w-[300px] sm:min-w-[500px] shadow-2xl max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-white border-b border-[#c1c9be]/60 px-5 sm:px-6 py-4 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-[#164525] text-white flex items-center justify-center font-['Montserrat'] font-bold text-[14px] shadow-xs">
              {step === 'form' ? '1' : step === 'confirmation' ? '✓' : '2'}
            </span>
            <div>
              <h2 className="font-['Montserrat'] text-[16px] sm:text-[18px] font-bold text-[#164525]">
                {step === 'form' && 'Formulaire de Précommande'}
                {step === 'payment' && 'Paiement de l\'Acompte (30%)'}
                {step === 'processing' && 'Traitement du Paiement...'}
                {step === 'confirmation' && 'Précommande Validée !'}
              </h2>
              <p className="text-[11px] text-[#717970] font-medium hidden sm:block">
                {step === 'form' && 'Réservez votre récolte avant récolte avec garantie séquestre'}
                {step === 'payment' && 'Règlement sécurisé par Mobile Money'}
                {step === 'confirmation' && 'Reçu & suivi direct enregistrés'}
              </p>
            </div>
          </div>
          
          {step !== 'processing' && (
            <button
              id="close-modal-btn"
              onClick={onClose}
              className="text-[#717970] hover:text-[#2b1700] p-1.5 rounded-full hover:bg-[#fff1e6] transition-colors cursor-pointer"
              title="Fermer"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 flex flex-col gap-4">
          {/* STEP 1: PREORDER FORM */}
          {step === 'form' && (
            <form onSubmit={handleProceedToPayment} className="flex flex-col gap-5">
              {/* Product Header Mini */}
              <div className="flex items-center gap-3 p-3 bg-white border border-[#E5DCCB] rounded-xl">
                <img
                  src={product.image}
                  alt={product.nom}
                  className="w-16 h-16 rounded-lg object-cover border border-[#c1c9be]"
                />
                <div>
                  <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#2b1700]">
                    {product.nom}
                  </h3>
                  <p className="text-[13px] text-[#717970]">{product.producteur}</p>
                  <p className="text-[13px] text-[#164525] font-semibold">
                    {unitPrice.toLocaleString('fr-FR')} FCFA / {product.unite}
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="block text-[14px] font-semibold text-[#2b1700] mb-2 font-['Inter']">
                  Quantité ({product.unite}) <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#c1c9be] rounded-full overflow-hidden bg-white shadow-sm">
                    <button
                      type="button"
                      id="modal-decrease-qty"
                      onClick={handleDecrease}
                      className="px-4 py-2 text-[#414941] hover:bg-[#fff1e6] font-bold text-[18px] cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={product.quantiteMinimale}
                      value={quantity}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        if (!isNaN(v) && v >= 1) setQuantity(v);
                      }}
                      className="w-20 text-center border-none bg-transparent font-['Inter'] text-[16px] font-bold text-[#2b1700] p-0 outline-none"
                    />
                    <button
                      type="button"
                      id="modal-increase-qty"
                      onClick={handleIncrease}
                      className="px-4 py-2 text-[#414941] hover:bg-[#fff1e6] font-bold text-[18px] cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[13px] text-[#717970]">
                    Minimum : {product.quantiteMinimale} {product.unite}
                  </span>
                </div>
              </div>

              {/* Delivery Location */}
              <div>
                <label className="block text-[14px] font-semibold text-[#2b1700] mb-1 font-['Inter']">
                  Lieu de livraison <span className="text-[#ba1a1a]">*</span>
                </label>
                <select
                  id="delivery-location-select"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  className="w-full p-3 bg-white border border-[#c1c9be] rounded-xl font-['Inter'] text-[14px] text-[#2b1700] focus:ring-2 focus:ring-[#164525] outline-none"
                  required
                >
                  <option value="Dakar - Grand Dakar">Dakar - Grand Dakar</option>
                  <option value="Dakar - Plateau / Médina">Dakar - Plateau / Médina</option>
                  <option value="Dakar - Almadies / Ngor / Ouakam">Dakar - Almadies / Ngor / Ouakam</option>
                  <option value="Pikine / Guédiawaye">Pikine / Guédiawaye</option>
                  <option value="Rufisque / Bargny">Rufisque / Bargny</option>
                  <option value="Thiès Ville">Thiès Ville</option>
                  <option value="Mbour / Saly">Mbour / Saly</option>
                  <option value="Autre adresse">Autre zone de livraison...</option>
                </select>

                <input
                  type="text"
                  placeholder="Précisions d'adresse (quartier, rue, repère)..."
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  className="w-full mt-2 p-2.5 bg-[#F3EBDD] border border-[#c1c9be] rounded-lg text-[13px] text-[#2b1700] outline-none"
                />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                    Nom complet <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ex: Moussa Diop"
                    className="w-full p-2.5 bg-white border border-[#c1c9be] rounded-lg text-[14px] text-[#2b1700] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                    Téléphone (Mobile Money) <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Ex: 77 123 45 67"
                    className="w-full p-2.5 bg-white border border-[#c1c9be] rounded-lg text-[14px] text-[#2b1700] outline-none"
                  />
                </div>
              </div>

              {/* Real-time Calculation Breakdown Box */}
              <div className="bg-[#FAF8F2] border-2 border-[#164525]/30 rounded-xl p-4 flex flex-col gap-2 shadow-sm">
                <div className="flex justify-between items-center text-[14px] text-[#414941]">
                  <span>Calcul du total ({quantity} × {unitPrice.toLocaleString('fr-FR')} FCFA)</span>
                  <span className="font-semibold text-[#2b1700]">
                    {totalPrice.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                <div className="w-full h-px bg-[#c1c9be]/50 my-1"></div>
                
                <div className="flex justify-between items-center text-[15px] font-bold text-[#164525]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    Acompte demandé ({acomptePct}%)
                  </span>
                  <span className="text-[17px] bg-[#bbefc1]/50 text-[#164525] px-2 py-0.5 rounded">
                    {acompteAmount.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>

                <div className="flex justify-between items-center text-[13px] text-[#7d4600] font-medium">
                  <span>Solde restant (à la récolte/livraison)</span>
                  <span className="font-bold">{remainingBalance.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                id="submit-preorder-form-btn"
                className="w-full bg-[#164525] text-white font-['Montserrat'] text-[16px] font-bold py-3 rounded-full hover:bg-[#2f5d3a] transition-all shadow-[0_8px_30px_rgba(47,93,58,0.12)] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Continuer vers le paiement ({acompteAmount.toLocaleString('fr-FR')} FCFA)</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </form>
          )}

          {/* STEP 2: SIMULATED PAYMENT (Wave / Orange Money) */}
          {step === 'payment' && (
            <div className="flex flex-col gap-5">
              <div className="text-center">
                <p className="text-[14px] text-[#717970] font-medium">Étape 2 sur 2</p>
                <h3 className="font-['Montserrat'] text-[20px] font-bold text-[#2b1700]">
                  Choisissez votre moyen de paiement
                </h3>
                <p className="text-[13px] text-[#414941] mt-1">
                  Paiement sécurisé de l'acompte pour réserver votre récolte
                </p>
              </div>

              {/* Amount reminder card */}
              <div className="bg-[#164525] text-white p-4 rounded-xl text-center shadow-sm">
                <span className="text-[12px] uppercase tracking-wider text-[#a1d4a8]">
                  Montant de l'acompte à régler
                </span>
                <p className="text-[28px] font-['Montserrat'] font-bold text-white mt-0.5">
                  {acompteAmount.toLocaleString('fr-FR')} FCFA
                </p>
                <span className="text-[12px] text-[#bbefc1]">
                  Solde de {remainingBalance.toLocaleString('fr-FR')} FCFA payable à la livraison
                </span>
              </div>

              {/* Payment Methods Selection */}
              <div className="flex flex-col gap-3">
                {/* Wave Option */}
                <label
                  id="pay-method-wave"
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'wave'
                      ? 'border-[#0080FF] bg-[#0080FF]/5 shadow-sm'
                      : 'border-[#c1c9be] bg-white hover:border-[#717970]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentMethod === 'wave'}
                      onChange={() => setPaymentMethod('wave')}
                      className="w-5 h-5 text-[#0080FF] focus:ring-[#0080FF] accent-[#0080FF]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-['Montserrat'] font-bold text-[16px] text-[#2b1700]">
                          Wave
                        </span>
                        <span className="bg-[#0080FF] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Sans frais
                        </span>
                      </div>
                      <p className="text-[12px] text-[#717970]">
                        Paiement instantané via votre compte Wave
                      </p>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#0080FF]/10 text-[#0080FF] flex items-center justify-center font-bold text-[20px]">
                    🌊
                  </div>
                </label>

                {/* Orange Money Option */}
                <label
                  id="pay-method-om"
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'orange_money'
                      ? 'border-[#FF7900] bg-[#FF7900]/5 shadow-sm'
                      : 'border-[#c1c9be] bg-white hover:border-[#717970]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentMethod === 'orange_money'}
                      onChange={() => setPaymentMethod('orange_money')}
                      className="w-5 h-5 text-[#FF7900] focus:ring-[#FF7900] accent-[#FF7900]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-['Montserrat'] font-bold text-[16px] text-[#2b1700]">
                          Orange Money
                        </span>
                      </div>
                      <p className="text-[12px] text-[#717970]">
                        Validation par notification ou code secret OM
                      </p>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#FF7900]/10 text-[#FF7900] flex items-center justify-center font-bold text-[20px]">
                    🟠
                  </div>
                </label>
              </div>

              {/* Phone number field */}
              <div>
                <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                  Numéro {paymentMethod === 'wave' ? 'Wave' : 'Orange Money'} de débit
                </label>
                <input
                  type="tel"
                  value={paymentPhone}
                  onChange={(e) => setPaymentPhone(e.target.value)}
                  className="w-full p-3 bg-white border border-[#c1c9be] rounded-xl font-['Inter'] text-[15px] text-[#2b1700] outline-none"
                  placeholder="77 000 00 00"
                />
              </div>

              {/* Simulation note */}
              <div className="bg-[#fff1e6] border border-[#ffdcc0] rounded-lg p-3 text-[12px] text-[#7d4600] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">info</span>
                <span>
                  <strong>Mode Démonstration :</strong> Le paiement est simulé automatiquement sans débit réel.
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="w-1/3 py-3 rounded-full border border-[#c1c9be] text-[#414941] font-medium text-[14px] hover:bg-white transition-colors cursor-pointer"
                >
                  Retour
                </button>
                <button
                  type="button"
                  id="pay-deposit-btn"
                  onClick={handleExecutePayment}
                  className="w-2/3 bg-[#164525] text-white font-['Montserrat'] text-[16px] font-bold py-3 rounded-full hover:bg-[#2f5d3a] transition-all shadow-[0_8px_30px_rgba(47,93,58,0.12)] cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                  <span>Payer l'acompte</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2.5: PROCESSING / SPINNER */}
          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 border-4 border-[#bbefc1] border-t-[#164525] rounded-full animate-spin"></div>
              <div>
                <h3 className="font-['Montserrat'] text-[18px] font-bold text-[#164525]">
                  Validation de l'acompte en cours...
                </h3>
                <p className="text-[14px] text-[#717970] mt-1">
                  Connexion sécurisée avec {paymentMethod === 'wave' ? 'Wave' : 'Orange Money'}
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: CONFIRMATION (Étape 7) */}
          {step === 'confirmation' && createdPreorder && (
            <div className="flex flex-col gap-5">
              {/* Success Banner */}
              <div className="bg-[#bbefc1]/40 border border-[#3d692b]/30 p-4 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#164525] text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">check</span>
                </div>
                <div>
                  <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#164525]">
                    Votre précommande a été enregistrée.
                  </h3>
                  <p className="text-[12px] text-[#3d692b] font-medium">
                    Acompte de {createdPreorder.acompte.toLocaleString('fr-FR')} FCFA validé avec succès
                  </p>
                </div>
              </div>

              {/* Order Recap Details Table */}
              <div className="bg-white border border-[#c1c9be] rounded-xl p-5 flex flex-col gap-2.5 text-[14px] shadow-sm">
                <div className="flex justify-between items-center border-b border-[#c1c9be]/40 pb-2">
                  <span className="text-[#717970]">Numéro de commande</span>
                  <span className="font-mono font-bold text-[#164525] text-[15px]">
                    {createdPreorder.numeroCommande}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-[#c1c9be]/40 pb-2">
                  <span className="text-[#717970]">Produit</span>
                  <span className="font-bold text-[#2b1700]">{createdPreorder.produitNom}</span>
                </div>

                <div className="flex justify-between items-center border-b border-[#c1c9be]/40 pb-2">
                  <span className="text-[#717970]">Quantité</span>
                  <span className="font-semibold text-[#2b1700]">
                    {createdPreorder.quantite} {createdPreorder.unite}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-[#c1c9be]/40 pb-2">
                  <span className="text-[#717970]">Montant total</span>
                  <span className="font-bold text-[#2b1700]">
                    {createdPreorder.montantTotal.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-[#c1c9be]/40 pb-2 bg-[#fff1e6] -mx-5 px-5 py-1.5">
                  <span className="text-[#7d4600] font-semibold">Acompte payé ({createdPreorder.acomptePct}%)</span>
                  <span className="font-bold text-[#164525] bg-[#bbefc1] px-2 py-0.5 rounded text-[13px]">
                    {createdPreorder.acompte.toLocaleString('fr-FR')} FCFA (PAYÉ)
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-[#c1c9be]/40 pb-2">
                  <span className="text-[#717970]">Solde restant à la livraison</span>
                  <span className="font-bold text-[#7d4600]">
                    {createdPreorder.soldeRestant.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-[#c1c9be]/40 pb-2">
                  <span className="text-[#717970]">Date prévue de disponibilité</span>
                  <span className="font-semibold text-[#2b1700]">
                    {createdPreorder.datePrevueDisponibilite}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-[#717970]">Lieu de livraison</span>
                  <span className="font-semibold text-[#2b1700] text-right truncate max-w-[220px]">
                    {createdPreorder.lieuLivraison}
                  </span>
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  id="track-order-btn"
                  onClick={() => onNavigateToTracking(createdPreorder)}
                  className="w-full bg-[#164525] text-white font-['Montserrat'] text-[16px] font-bold py-3.5 rounded-full hover:bg-[#2f5d3a] transition-all shadow-[0_8px_30px_rgba(47,93,58,0.15)] cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                  <span>Suivre ma commande</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 text-[#164525] font-semibold text-[14px] hover:underline transition-colors text-center cursor-pointer"
                >
                  Continuer sur la marketplace
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
