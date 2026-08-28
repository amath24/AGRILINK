import React, { useState } from 'react';
import { Product } from '../../types';

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onStartPreorder: (product: Product, quantity: number) => void;
  onOpenTraceabilityModal?: (product: Product) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onBack,
  onStartPreorder,
  onOpenTraceabilityModal,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const [quantity, setQuantity] = useState<number>(product.quantiteMinimale || 1);

  const isPreorder = product.typeDisponibilite === 'preorder';
  const totalPrice = quantity * product.prix;
  const acompteRate = (product.acomptePourcentage || 30) / 100;
  const acompteAmount = isPreorder ? Math.round(totalPrice * acompteRate) : totalPrice;
  const acomptePerUnit = Math.round(product.prix * acompteRate);

  const handleDecrease = () => {
    if (quantity > product.quantiteMinimale) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1) {
      setQuantity(val);
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-16 py-8 flex flex-col gap-10">
      {/* Breadcrumbs / Back button */}
      <div className="flex items-center gap-2 text-[14px] text-[#414941]">
        <button
          id="back-to-marketplace-btn"
          onClick={onBack}
          className="flex items-center gap-1 text-[#164525] font-semibold hover:underline cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Retour à la Marketplace
        </button>
        <span className="text-[#c1c9be]">/</span>
        <span className="text-[#717970]">{product.categorie}</span>
        <span className="text-[#c1c9be]">/</span>
        <span className="text-[#2b1700] font-medium truncate">{product.nom}</span>
      </div>

      {/* Main Product Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Left Column: Image */}
        <div className="w-full rounded-2xl overflow-hidden bg-[#ffead7] shadow-sm relative group border border-[#E5DCCB]">
          <div className="w-full aspect-[4/3] md:aspect-square min-h-[380px] max-h-[500px]">
            <img
              src={product.image}
              alt={product.nom}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          
          {product.isBio && (
            <div className="absolute top-4 left-4 bg-[#3d692b] text-white px-3 py-1 rounded-full text-[12px] font-semibold flex items-center gap-1 shadow-sm">
              <span className="material-symbols-outlined text-[16px] fill">eco</span>
              Bio
            </div>
          )}

          {product.isTracable && (
            <div className="absolute top-4 right-4 bg-[#3a6844] text-white px-3 py-1 rounded-full text-[12px] font-semibold flex items-center gap-1 shadow-sm">
              <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
              Traçable
            </div>
          )}
        </div>

        {/* Right Column: Details & Order CTA */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-['Montserrat'] text-[28px] md:text-[36px] font-bold text-[#2b1700] mb-2 leading-tight">
                {product.nom}
              </h1>

              {onToggleFavorite && (
                <button
                  id={`detail-fav-btn-${product.id}`}
                  onClick={() => onToggleFavorite(product.id)}
                  className={`p-2.5 rounded-full border border-[#c1c9be] transition-all cursor-pointer ${
                    isFavorite
                      ? 'bg-[#fff1e6] text-[#e63946] border-[#e63946]/40'
                      : 'bg-white text-[#717970] hover:text-[#e63946] hover:bg-[#fff1e6]'
                  }`}
                  title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  <span className={`material-symbols-outlined text-[22px] ${isFavorite ? 'fill' : ''}`}>
                    favorite
                  </span>
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-[#414941] mb-4">
              <span className="font-['Inter'] text-[16px] font-medium text-[#164525]">
                {product.producteur}
              </span>
              <div className="flex items-center text-[#7d4600] gap-1 bg-[#fff1e6] px-2.5 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-[18px] text-[#ffb875] fill">
                  star
                </span>
                <span className="font-['Inter'] text-[14px] font-semibold">
                  {product.rating || 4.8} ({product.avisCount || 120} avis)
                </span>
              </div>
            </div>

            <div className="font-['Montserrat'] text-[32px] text-[#164525] font-bold">
              {product.prix.toLocaleString('fr-FR')} FCFA{' '}
              <span className="font-['Inter'] text-[18px] font-normal text-[#414941]">
                / {product.unite}
              </span>
            </div>
          </div>

          <p className="font-['Inter'] text-[15px] text-[#414941] leading-relaxed">
            {product.description}
          </p>

          {/* Pricing & Availability Box */}
          <div className="bg-[#ffffff] border border-[#c1c9be] rounded-xl p-5 flex flex-col gap-3 shadow-sm">
            <div className="flex justify-between items-center border-b border-[#c1c9be]/50 pb-3">
              <span className="text-[#414941] font-['Inter'] text-[14px]">
                Disponibilité estimée
              </span>
              <span className="font-['Inter'] text-[15px] text-[#2b1700] font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#3d692b]">
                  calendar_today
                </span>
                {product.dateDisponibilite}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-[#c1c9be]/50 pb-3">
              <span className="text-[#414941] font-['Inter'] text-[14px]">
                Commande minimum
              </span>
              <span className="font-['Inter'] text-[15px] text-[#2b1700] font-semibold">
                {product.quantiteMinimale} {product.unite}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-[#c1c9be]/50 pb-3">
              <span className="text-[#414941] font-['Inter'] text-[14px]">
                Quantité prévue (Récolte)
              </span>
              <span className="font-['Inter'] text-[15px] text-[#2b1700] font-semibold">
                {product.quantitePrevue.toLocaleString('fr-FR')} {product.unite}
              </span>
            </div>

            {isPreorder && (
              <div className="flex justify-between items-center pt-1">
                <span className="text-[#414941] font-['Inter'] text-[14px]">
                  Acompte requis ({product.acomptePourcentage}%)
                </span>
                <span className="font-['Inter'] text-[15px] text-[#7d4600] font-bold">
                  {acomptePerUnit.toLocaleString('fr-FR')} FCFA / {product.unite}
                </span>
              </div>
            )}
          </div>

          {/* Quantity Selector & Main Action */}
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex items-center gap-4">
              <label className="font-['Inter'] text-[14px] font-medium text-[#414941]">
                Quantité ({product.unite}) :
              </label>
              
              <div className="flex items-center border border-[#c1c9be] rounded-full overflow-hidden bg-white shadow-sm">
                <button
                  id="decrease-qty-btn"
                  onClick={handleDecrease}
                  className="px-4 py-2 text-[#414941] hover:bg-[#fff1e6] transition-colors font-bold text-[18px] cursor-pointer"
                  disabled={quantity <= product.quantiteMinimale}
                >
                  -
                </button>
                <input
                  id="quantity-input"
                  type="number"
                  min={product.quantiteMinimale}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 text-center border-none bg-transparent font-['Inter'] text-[16px] font-semibold text-[#2b1700] focus:ring-0 p-0 outline-none"
                />
                <button
                  id="increase-qty-btn"
                  onClick={handleIncrease}
                  className="px-4 py-2 text-[#414941] hover:bg-[#fff1e6] transition-colors font-bold text-[18px] cursor-pointer"
                >
                  +
                </button>
              </div>

              <div className="text-[13px] text-[#717970] ml-2">
                Total : <span className="font-bold text-[#2b1700]">{totalPrice.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>

            {/* Main Preorder Button */}
            <button
              id="main-preorder-cta-btn"
              onClick={() => onStartPreorder(product, quantity)}
              className="w-full bg-[#164525] text-white font-['Montserrat'] text-[17px] font-bold py-3.5 rounded-full hover:bg-[#2f5d3a] hover:-translate-y-0.5 transition-all duration-300 shadow-[0_8px_30px_rgba(47,93,58,0.12)] hover:shadow-[0_12px_40px_rgba(47,93,58,0.2)] flex justify-center items-center gap-2 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
              {isPreorder
                ? `Précommander (${acompteAmount.toLocaleString('fr-FR')} FCFA Acompte)`
                : `Commander (${totalPrice.toLocaleString('fr-FR')} FCFA)`}
            </button>
          </div>

          {/* Secure Payment Note */}
          <div className="flex items-center gap-2 text-[#414941] text-[13px]">
            <span className="material-symbols-outlined text-[18px] text-[#164525]">lock</span>
            <span>Paiement sécurisé par Mobile Money (Wave, Orange Money)</span>
          </div>
        </div>
      </section>

      {/* Traceability & Producer Section (Bento Grid) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* Traceability Card */}
        <div className="col-span-1 bg-[#ffffff] border border-[#c1c9be] rounded-xl p-6 flex flex-col items-center text-center justify-between gap-4 shadow-sm hover:shadow-[0_8px_30px_rgba(47,93,58,0.08)] transition-shadow">
          <div className="w-28 h-28 bg-[#ffead7] p-2 rounded-lg flex items-center justify-center border border-[#ffdcc0]">
            {/* Styled QR Graphic */}
            <div className="flex flex-col items-center justify-center text-[#164525]">
              <span className="material-symbols-outlined text-[54px]">qr_code_2</span>
              <span className="text-[10px] font-bold uppercase tracking-wider -mt-1">Agri-Link QR</span>
            </div>
          </div>
          
          <div>
            <h3 className="font-['Montserrat'] text-[18px] font-semibold text-[#2b1700] mb-1">
              Traçabilité Garantie
            </h3>
            <p className="font-['Inter'] text-[13px] text-[#414941]">
              Scannez ou vérifiez pour voir le parcours de ce produit, de la graine à la récolte.
            </p>
          </div>

          <button
            id="check-traceability-btn"
            onClick={() => onOpenTraceabilityModal && onOpenTraceabilityModal(product)}
            className="border border-[#164525] text-[#164525] font-['Inter'] text-[14px] font-medium px-4 py-2 rounded-full hover:bg-[#fff1e6] transition-colors flex items-center gap-1.5 w-full justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
            Vérifier la traçabilité
          </button>
        </div>

        {/* About Producer Card */}
        <div className="col-span-1 md:col-span-2 bg-[#ffffff] border border-[#c1c9be] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-['Montserrat'] text-[20px] font-semibold text-[#2b1700] border-b border-[#c1c9be]/50 pb-3 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#164525]">agriculture</span>
              À propos du Producteur
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-[#ffead7] overflow-hidden shrink-0 border-2 border-[#bbefc1]">
                <img
                  src={product.producteurAvatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ93NxJaYZRWGhrvVCGxqPAZRap9c-VY_OZz_Yee3sJbjSRGx5bkhVPJOkWmEw66Z78JGOWoyRY2xFSdEEMmklksH6o3WdwwRST9FNC7rL2CMR2LMY0pDRfKpsAobAVo00pnK3AzAlzB8FR3RmR4fF3Kh-sCLQYUgR3lUXv3MI18SLmIGVxsE2heUpfEUlWJ_VxE8WymphWT1JMW9ZiymV7zMm0GkVgY6KiWNPBJO_JNCAq9OKmYolvQ'}
                  alt={product.producteur}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-['Montserrat'] text-[18px] font-semibold text-[#2b1700]">
                  {product.producteur}
                </h4>
                <p className="font-['Inter'] text-[14px] text-[#414941] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#717970]">
                    location_on
                  </span>
                  {product.localisation}
                </p>
              </div>
            </div>

            <p className="font-['Inter'] text-[14px] text-[#414941] leading-relaxed">
              {product.producteurDescription ||
                "Producteur certifié partenaire d'Agri-Link engagé dans les bonnes pratiques agricoles et la fourniture de denrées saines et fraîches."}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-[#c1c9be]/50 flex justify-between items-center">
            <button
              onClick={onBack}
              className="font-['Inter'] text-[14px] text-[#164525] font-medium hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Voir les autres produits du catalogue</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
