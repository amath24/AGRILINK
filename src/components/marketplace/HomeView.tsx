import React, { useState } from 'react';
import { Product, ProductCategory } from '../../types';
import { ProductCard } from './ProductCard';

interface HomeViewProps {
  onExploreMarketplace: (category?: ProductCategory) => void;
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
  onQuickPreorder?: (product: Product) => void;
  favoriteProductIds?: string[];
  onToggleFavorite?: (productId: string) => void;
  onNavigateToRegister?: () => void;
}

const CATEGORY_ITEMS: { label: ProductCategory; icon: string; desc: string; color: string }[] = [
  { label: 'Fruits', icon: '🥭', desc: 'Mangues, agrumes, papayes...', color: 'bg-[#ffeed9] text-[#7d4600]' },
  { label: 'Légumes', icon: '🥬', desc: 'Oignons, tomates, carottes...', color: 'bg-[#e8f5e9] text-[#164525]' },
  { label: 'Céréales', icon: '🌾', desc: 'Riz de la vallée, maïs, mil...', color: 'bg-[#fef9c3] text-[#854d0e]' },
  { label: 'Transformés', icon: '🍯', desc: 'Huiles, confitures, poudres...', color: 'bg-[#fae8ff] text-[#86198f]' },
];

export const HomeView: React.FC<HomeViewProps> = ({
  onExploreMarketplace,
  products = [],
  onSelectProduct = () => {},
  onQuickPreorder = () => {},
  favoriteProductIds = [],
  onToggleFavorite = () => {},
  onNavigateToRegister = () => {},
}) => {
  const [selectedHomeCat, setSelectedHomeCat] = useState<ProductCategory | 'ALL'>('ALL');

  // Filter top products to display on home view
  const displayedProducts = (
    selectedHomeCat === 'ALL'
      ? products
      : products.filter((p) => p.categorie === selectedHomeCat)
  ).slice(0, 6);

  return (
    <div className="flex-grow flex flex-col bg-[#FAF8F2]">
      {/* ========================================================================= */}
      {/* 🚀 HERO SECTION (Ultra-compact on Mobile so products appear on top)       */}
      {/* ========================================================================= */}
      <section className="relative w-full max-w-[1440px] mx-auto px-3.5 sm:px-6 lg:px-16 pt-3 sm:pt-10 pb-4 sm:pb-10 overflow-hidden flex flex-col lg:flex-row items-center gap-4 sm:gap-10">
        
        {/* Left Column: Compact Text & Instant CTA */}
        <div className="w-full lg:w-1/2 z-10 space-y-2.5 sm:space-y-5 text-left">
          
          <div className="inline-flex items-center gap-1.5 bg-[#bdf1a4] text-[#164525] px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[12px] font-bold">
            <span className="material-symbols-outlined text-[13px] sm:text-[15px]">eco</span>
            <span className="sm:hidden">Sénégal • Vente Directe</span>
            <span className="hidden sm:inline">Réseau Agricole Direct du Sénégal</span>
          </div>

          <h1 className="font-['Montserrat'] text-[20px] sm:text-[34px] lg:text-[44px] font-extrabold text-[#2b1700] leading-snug tracking-tight">
            Récoltes du Sénégal <span className="text-[#164525]">en direct</span> des fermes.
          </h1>

          {/* Short punchy description on mobile, detailed on desktop */}
          <p className="font-['Inter'] text-[12px] sm:text-[15px] text-[#414941] max-w-xl leading-snug sm:leading-relaxed">
            <span className="sm:hidden">
              Achetez ou réservez au prix de gros et demi-gros sans intermédiaires. <strong>Acompte 30% sécurisé</strong>.
            </span>
            <span className="hidden sm:inline">
              Connectez-vous directement aux producteurs du Sénégal. Réservez vos récoltes avec un <strong>acompte sécurisé de 30%</strong> et profitez de prix transparents sans intermédiaires.
            </span>
          </p>

          {/* Quick Action Buttons (2 cols on mobile for minimal height) */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 pt-0.5 sm:pt-1">
            <button
              id="hero-explore-marketplace-btn"
              onClick={() => onExploreMarketplace()}
              className="bg-[#164525] text-white px-3 sm:px-7 py-2.5 sm:py-3 rounded-xl text-[12px] sm:text-[14px] font-bold hover:bg-[#2f5d3a] transition-all shadow-[0_4px_14px_rgba(22,69,37,0.2)] flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 text-center min-h-[42px]"
            >
              <span>Voir le Marché</span>
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">storefront</span>
            </button>

            <button
              id="hero-become-producer-btn"
              onClick={onNavigateToRegister}
              className="bg-[#7d4600]/10 text-[#7d4600] border border-[#7d4600]/30 px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl text-[12px] sm:text-[14px] font-bold hover:bg-[#7d4600]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center min-h-[42px]"
            >
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">agriculture</span>
              <span>Producteurs</span>
            </button>
          </div>

          {/* Key Proof Points */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[#414941] text-[11px] sm:text-[13px] font-semibold pt-0.5">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[#164525] text-[14px] sm:text-[16px]">verified</span>
              Direct Fermes
            </span>
            <span className="text-[#c1c9be]">•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[#164525] text-[14px] sm:text-[16px]">lock</span>
              Séquestre 30%
            </span>
            <span className="text-[#c1c9be]">•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[#164525] text-[14px] sm:text-[16px]">qr_code_2</span>
              Traçabilité
            </span>
          </div>
        </div>

        {/* Right Visual Image (Hidden on Mobile screens to ensure products appear immediately!) */}
        <div className="hidden sm:block w-full lg:w-1/2 relative min-h-[260px] lg:min-h-[380px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg bg-[#ffead7] border border-[#E5DCCB]">
          <img
            className="absolute inset-0 w-full h-full object-cover"
            alt="Producteur agricole sénégalais et récoltes fraîches de qualité"
            src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80"
          />

          {/* Floating Trust Card */}
          <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#c1c9be] shadow-lg flex items-center gap-3">
            <div className="bg-[#164525] p-2 rounded-xl text-white">
              <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#555d50]">Livraison sécurisée</p>
              <p className="font-['Montserrat'] text-[14px] sm:text-[16px] font-bold text-[#2b1700]">Dakar &amp; Régions</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🧺 PRODUITS EN PREMIER : RÉCOLTES & PRODUITS PHARES DIRECTEMENT VISIBLES  */}
      {/* ========================================================================= */}
      <section className="w-full max-w-[1440px] mx-auto px-3.5 sm:px-6 lg:px-16 pt-2 pb-6 sm:py-10">
        
        {/* Section Header with Category Quick-Pills */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 border-b border-[#c1c9be]/50 pb-3 sm:pb-4">
          <div>
            <div className="inline-flex items-center gap-1 text-[#164525] text-[11px] sm:text-[12px] font-bold uppercase tracking-wider mb-0.5">
              <span className="material-symbols-outlined text-[15px] sm:text-[16px]">storefront</span>
              Récoltes en Direct
            </div>
            <h2 className="font-['Montserrat'] text-[18px] sm:text-[26px] font-extrabold text-[#2b1700]">
              Produits du moment au Sénégal
            </h2>
            <p className="text-[12px] sm:text-[13px] text-[#555d50] font-['Inter'] mt-0.5">
              Disponibilité immédiate ou précommandes avec acompte 30%
            </p>
          </div>

          {/* Quick Category Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
            <button
              type="button"
              onClick={() => setSelectedHomeCat('ALL')}
              className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all shrink-0 cursor-pointer ${
                selectedHomeCat === 'ALL'
                  ? 'bg-[#164525] text-white shadow-xs'
                  : 'bg-white text-[#414941] border border-[#c1c9be]/60 hover:bg-[#F3EBDD]'
              }`}
            >
              🌱 Tous ({products.length})
            </button>
            {CATEGORY_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setSelectedHomeCat(item.label)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all shrink-0 cursor-pointer ${
                  selectedHomeCat === item.label
                    ? 'bg-[#164525] text-white shadow-xs'
                    : 'bg-white text-[#414941] border border-[#c1c9be]/60 hover:bg-[#F3EBDD]'
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-6">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onQuickPreorder={onQuickPreorder}
                isFavorite={favoriteProductIds.includes(product.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#c1c9be]">
            <p className="text-[14px] text-[#555d50]">Aucun produit trouvé dans cette catégorie.</p>
          </div>
        )}

        {/* See Full Catalog CTA */}
        <div className="mt-6 sm:mt-8 text-center">
          <button
            type="button"
            id="home-view-all-products-btn"
            onClick={() => onExploreMarketplace(selectedHomeCat === 'ALL' ? undefined : selectedHomeCat)}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-white text-[#164525] border-2 border-[#164525] px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-['Montserrat'] font-bold text-[13px] sm:text-[14px] hover:bg-[#164525] hover:text-white transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <span>Voir tout le catalogue ({products.length} produits)</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🏷️ CATEGORY DISCOVERY TILES                                               */}
      {/* ========================================================================= */}
      <section className="w-full max-w-[1440px] mx-auto px-3.5 sm:px-6 lg:px-16 py-4 sm:py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {CATEGORY_ITEMS.map((cat) => (
            <div
              key={cat.label}
              onClick={() => onExploreMarketplace(cat.label)}
              className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#c1c9be]/60 hover:border-[#164525] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-[22px] sm:text-[28px] group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
                <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#717970] group-hover:text-[#164525] group-hover:translate-x-1 transition-all">
                  arrow_forward
                </span>
              </div>
              <div>
                <h3 className="font-['Montserrat'] font-bold text-[13px] sm:text-[15px] text-[#2b1700] group-hover:text-[#164525] transition-colors">
                  {cat.label}
                </h3>
                <p className="text-[10px] sm:text-[12px] text-[#555d50] mt-0.5 line-clamp-1">
                  {cat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🛡️ BENTO GRID: POURQUOI AGRI-LINK ? (Explications et Garanties)           */}
      {/* ========================================================================= */}
      <section className="bg-[#fff1e6] py-8 sm:py-16 border-t border-[#c1c9be]/40 mt-4 sm:mt-6">
        <div className="max-w-[1440px] mx-auto px-3.5 sm:px-6 lg:px-16">
          <div className="text-center mb-6 sm:mb-12">
            <h2 className="font-['Montserrat'] text-[18px] sm:text-[30px] font-extrabold text-[#2b1700] mb-1 sm:mb-2">
              Comment fonctionne Agri-Link ?
            </h2>
            <p className="font-['Inter'] text-[12px] sm:text-[15px] text-[#414941] max-w-2xl mx-auto">
              Une chaîne de valeur agricole directe et sécurisée pour les producteurs et acheteurs du Sénégal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {/* Card 1 */}
            <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-[#E5DCCB] shadow-xs">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#ffdad6] text-[#93000a] rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3">
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">trending_down</span>
              </div>
              <h3 className="font-['Montserrat'] text-[14px] sm:text-[16px] font-bold text-[#2b1700] mb-1">
                Moins de Pertes
              </h3>
              <p className="font-['Inter'] text-[12px] sm:text-[13px] text-[#414941] leading-relaxed">
                Les cultures sont précommandées avant récolte, garantissant zéro surproduction et zéro invendu.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-[#E5DCCB] shadow-xs">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#bdf1a4] text-[#436f31] rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3">
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">lock</span>
              </div>
              <h3 className="font-['Montserrat'] text-[14px] sm:text-[16px] font-bold text-[#2b1700] mb-1">
                Acompte 30% Garanti
              </h3>
              <p className="font-['Inter'] text-[12px] sm:text-[13px] text-[#414941] leading-relaxed">
                Fonds sous séquestre sécurisé. Le solde est débloqué après vérification de conformité.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-[#E5DCCB] shadow-xs">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#2f5d3a] text-[#a1d4a8] rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3">
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">qr_code_2</span>
              </div>
              <h3 className="font-['Montserrat'] text-[14px] sm:text-[16px] font-bold text-[#2b1700] mb-1">
                Traçabilité &amp; QR
              </h3>
              <p className="font-['Inter'] text-[12px] sm:text-[13px] text-[#414941] leading-relaxed">
                Origine vérifiée, nom du producteur, parcelle et méthode de culture certifiée.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-[#E5DCCB] shadow-xs">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#7d4600] text-[#ffba79] rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3">
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">payments</span>
              </div>
              <h3 className="font-['Montserrat'] text-[14px] sm:text-[16px] font-bold text-[#2b1700] mb-1">
                Paiements Wave &amp; OM
              </h3>
              <p className="font-['Inter'] text-[12px] sm:text-[13px] text-[#414941] leading-relaxed">
                Paiement instantané et sécurisé avec reçus électroniques automatiques.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
