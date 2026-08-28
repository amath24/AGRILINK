import React from 'react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onQuickPreorder: (product: Product) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onQuickPreorder,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const isPreorder = product.typeDisponibilite === 'preorder';

  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-FR') + ' FCFA';
  };

  return (
    <article
      id={`product-card-${product.id}`}
      className="bg-[#ffffff] rounded-xl border border-[#E5DCCB] overflow-hidden flex flex-col group hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(47,93,58,0.12)] transition-all duration-300 cursor-pointer relative"
      onClick={() => onSelectProduct(product)}
    >
      {/* Image Container with Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-[#ffead7]">
        <img
          src={product.image}
          alt={product.nom}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Favorite Heart Button */}
        {onToggleFavorite && (
          <button
            id={`fav-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product.id);
            }}
            className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer ${
              isFavorite
                ? 'bg-white text-[#e63946] shadow-md scale-105'
                : 'bg-black/30 text-white hover:bg-white hover:text-[#e63946]'
            }`}
            title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <span className={`material-symbols-outlined text-[18px] ${isFavorite ? 'fill' : ''}`}>
              favorite
            </span>
          </button>
        )}
        
        {/* Traçable Badge */}
        {product.isTracable && (
          <div className="absolute top-2 right-12 flex gap-1">
            <span className="bg-[#3a6844]/90 text-white px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 shadow-sm backdrop-blur-sm">
              <span className="material-symbols-outlined text-[13px]">qr_code_scanner</span>
              Traçable
            </span>
          </div>
        )}

        {/* Status Badge (Précommande / Immédiate) */}
        <div className="absolute top-2 left-2">
          {isPreorder ? (
            <span className="bg-[#7d4600]/90 text-[#ffba79] px-2 py-1 rounded text-[12px] font-semibold shadow-sm backdrop-blur-sm">
              Précommande
            </span>
          ) : (
            <span className="bg-[#164525]/90 text-[#bbefc1] px-2 py-1 rounded text-[12px] font-semibold shadow-sm backdrop-blur-sm">
              Disponible
            </span>
          )}
        </div>

        {product.isBio && (
          <div className="absolute bottom-2 left-2">
            <span className="bg-[#3d692b]/90 text-white px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1 backdrop-blur-sm">
              <span className="material-symbols-outlined text-[12px] fill">eco</span>
              Bio
            </span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title */}
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-['Montserrat'] text-[18px] font-semibold text-[#2b1700] leading-tight group-hover:text-[#164525] transition-colors">
            {product.nom}
          </h3>
        </div>

        {/* Location & Producer */}
        <p className="font-['Inter'] text-[#414941] text-[14px] mb-4 flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px] text-[#717970]">location_on</span>
          <span className="truncate">{product.localisation}</span>
        </p>

        {/* Price & Availability */}
        <div className="mt-auto flex flex-col gap-3">
          <div className="flex justify-between items-end">
            <div>
              <span className="font-['Inter'] text-[12px] font-medium text-[#717970]">
                Prix / {product.unite}
              </span>
              <p className="font-['Inter'] text-[18px] font-bold text-[#164525]">
                {formatPrice(product.prix)}
              </p>
            </div>
            
            <div className="text-right">
              <span className="font-['Inter'] text-[12px] font-medium text-[#717970]">
                Dispo.
              </span>
              <p
                className={`font-['Inter'] text-[14px] ${
                  isPreorder
                    ? 'text-[#2b1700] font-medium'
                    : 'text-[#3a6844] font-bold'
                }`}
              >
                {product.dateDisponibilite}
              </p>
            </div>
          </div>

          {/* Action Button */}
          {isPreorder ? (
            <button
              id={`preorder-btn-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onQuickPreorder(product);
              }}
              className="w-full bg-[#3a6844] text-white py-2 rounded-full font-['Inter'] text-[14px] font-medium hover:bg-[#164525] transition-colors flex justify-center items-center gap-2 cursor-pointer shadow-sm active:scale-95"
            >
              Précommander
            </button>
          ) : (
            <button
              id={`buy-btn-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onQuickPreorder(product);
              }}
              className="w-full bg-[#3d692b]/10 text-[#164525] py-2 rounded-full font-['Inter'] text-[14px] font-medium hover:bg-[#3d692b]/20 transition-colors flex justify-center items-center gap-2 cursor-pointer active:scale-95 border border-[#3d692b]/20"
            >
              Ajouter au panier
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
