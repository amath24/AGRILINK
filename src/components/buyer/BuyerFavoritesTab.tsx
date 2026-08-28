import React from 'react';
import { Product } from '../../types';

interface BuyerFavoritesTabProps {
  favoriteProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickPreorder: (product: Product) => void;
  onToggleFavorite: (productId: string) => void;
  onOpenMarketplace: () => void;
}

export const BuyerFavoritesTab: React.FC<BuyerFavoritesTabProps> = ({
  favoriteProducts,
  onSelectProduct,
  onQuickPreorder,
  onToggleFavorite,
  onOpenMarketplace,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#c1c9be] shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="font-['Montserrat'] text-[22px] font-bold text-[#2b1700]">
            Mes Produits Favoris
          </h1>
          <p className="text-[13px] text-[#717970] mt-0.5">
            Retrouvez rapidement vos denrées et producteurs préférés pour vos réapprovisionnements
          </p>
        </div>

        <button
          onClick={onOpenMarketplace}
          className="bg-[#164525] text-white text-[13px] font-semibold px-4 py-2 rounded-full hover:bg-[#2f5d3a] transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">storefront</span>
          Explorer la Marketplace
        </button>
      </div>

      {/* Grid of Favorites */}
      {favoriteProducts.length === 0 ? (
        <div className="bg-white border border-[#c1c9be] rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-[#fff1e6] text-[#7d4600] rounded-full flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[32px]">favorite_border</span>
          </div>
          <h3 className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700] mb-1">
            Votre liste de favoris est vide
          </h3>
          <p className="text-[13px] text-[#717970] max-w-sm mb-6">
            Ajoutez des fruits, légumes ou céréales à vos favoris en cliquant sur l'icône cœur sur les fiches produits.
          </p>
          <button
            onClick={onOpenMarketplace}
            className="bg-[#164525] text-white px-6 py-2.5 rounded-full text-[14px] font-semibold hover:bg-[#2f5d3a] transition-all cursor-pointer"
          >
            Découvrir les produits
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProducts.map((product) => {
            const isPreorder = product.typeDisponibilite === 'preorder';

            return (
              <article
                key={product.id}
                className="bg-white rounded-2xl border border-[#c1c9be] overflow-hidden flex flex-col shadow-sm hover:shadow-[0_8px_30px_rgba(47,93,58,0.1)] transition-all relative group"
              >
                {/* Remove from favorites button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(product.id);
                  }}
                  className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#e63946] hover:bg-white shadow-md transition-transform hover:scale-110 cursor-pointer"
                  title="Retirer des favoris"
                >
                  <span className="material-symbols-outlined text-[20px] fill">favorite</span>
                </button>

                {/* Product Image */}
                <div
                  onClick={() => onSelectProduct(product)}
                  className="h-44 w-full overflow-hidden bg-[#ffead7] cursor-pointer relative"
                >
                  <img
                    src={product.image}
                    alt={product.nom}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2">
                    <span className="bg-[#164525]/90 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {product.categorie}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow justify-between gap-3">
                  <div>
                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="font-['Montserrat'] text-[16px] font-bold text-[#2b1700] hover:text-[#164525] transition-colors cursor-pointer"
                    >
                      {product.nom}
                    </h3>
                    <p className="text-[12px] text-[#717970] mt-0.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {product.localisation}
                    </p>
                  </div>

                  <div className="flex justify-between items-end border-t border-[#c1c9be]/40 pt-2">
                    <div>
                      <span className="text-[11px] text-[#717970] block">Prix / {product.unite}</span>
                      <span className="font-['Montserrat'] text-[16px] font-bold text-[#164525]">
                        {product.prix.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-[#717970] block">Disponibilité</span>
                      <span className="text-[12px] font-semibold text-[#2b1700]">
                        {product.dateDisponibilite}
                      </span>
                    </div>
                  </div>

                  {/* Preorder Action */}
                  <button
                    onClick={() => onQuickPreorder(product)}
                    className="w-full bg-[#164525] text-white py-2 rounded-full font-medium text-[13px] hover:bg-[#2f5d3a] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                    {isPreorder ? 'Précommander' : 'Commander'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
