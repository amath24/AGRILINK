import React, { useState } from 'react';
import { Product, ProductCategory } from '../../../types';

interface AdminProductsTabProps {
  products: Product[];
  onToggleProductStatus?: (productId: string) => void;
  onSelectProductToView?: (product: Product) => void;
}

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  products = [],
  onSelectProductToView,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'all' | ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const safeProducts = products || [];

  const filteredProducts = safeProducts.filter((p) => {
    if (categoryFilter !== 'all' && p.categorie !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.nom.toLowerCase().includes(q);
      const matchProd = p.producteur.toLowerCase().includes(q);
      const matchLoc = p.localisation.toLowerCase().includes(q);
      return matchName || matchProd || matchLoc;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Montserrat'] text-[24px] font-bold text-[#2b1700]">
            Catalogue & Produits Publiés
          </h1>
          <p className="text-[14px] text-[#717970]">
            Supervision des récoltes et produits agricoles disponibles en précommande
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-3.5 py-1.5 rounded-xl border border-[#c1c9be]/60 text-[13px]">
            <span className="font-bold text-[#164525]">{safeProducts.length}</span>
            <span className="text-[#717970]"> produits actifs sur la plateforme</span>
          </div>
        </div>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="bg-white border border-[#c1c9be]/60 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#717970] text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un produit, producteur..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="px-3.5 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none cursor-pointer"
          >
            <option value="all">Toutes les catégories ({safeProducts.length})</option>
            <option value="Légumes">Légumes</option>
            <option value="Fruits">Fruits</option>
            <option value="Céréales">Céréales</option>
            <option value="Transformés">Transformés</option>
          </select>
        </div>
      </div>

      {/* Tableau des Produits */}
      <div className="bg-white border border-[#c1c9be]/60 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F2] border-b border-[#c1c9be]/60 text-[12px] font-bold text-[#717970] uppercase tracking-wider">
                <th className="py-3.5 px-4">Produit</th>
                <th className="py-3.5 px-4">Producteur & Localisation</th>
                <th className="py-3.5 px-4">Catégorie</th>
                <th className="py-3.5 px-4 text-right">Prix Unitaire</th>
                <th className="py-3.5 px-4 text-center">Quantité Récolte</th>
                <th className="py-3.5 px-4">Disponibilité</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c1c9be]/30 text-[13px]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#717970]">
                    <span className="material-symbols-outlined text-[36px] mb-2 text-[#717970]/60">inventory_2</span>
                    <p>Aucun produit ne correspond à ces critères.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt={prod.nom}
                          className="w-10 h-10 rounded-xl object-cover border border-[#c1c9be]/60 flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-bold text-[#2b1700]">{prod.nom}</div>
                          {prod.isBio && (
                            <span className="text-[10px] font-bold text-[#164525] bg-[#164525]/10 px-1.5 py-0.5 rounded">
                              Bio certifié
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#2b1700]">{prod.producteur}</div>
                      <div className="text-[11px] text-[#717970]">{prod.localisation}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FAF8F2] border border-[#c1c9be] text-[#414941]">
                        {prod.categorie}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#164525]">
                      {prod.prix.toLocaleString('fr-FR')} FCFA <span className="text-[11px] font-normal text-[#717970]">/{prod.unite}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#2b1700]">
                      {prod.quantitePrevue || prod.quantiteDisponible} {prod.unite}
                    </td>
                    <td className="py-3.5 px-4 text-[#414941] text-[12px]">
                      {prod.dateDisponibilite}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#164525]/10 text-[#164525]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#164525]"></span>
                        Publié
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            if (onSelectProductToView) {
                              onSelectProductToView(prod);
                            } else {
                              setSelectedProduct(prod);
                            }
                          }}
                          className="p-1.5 text-[#414941] hover:text-[#164525] hover:bg-[#FAF8F2] rounded-lg transition-colors cursor-pointer"
                          title="Voir le produit"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                        <button
                          onClick={() => setSelectedProduct(prod)}
                          className="px-2.5 py-1 bg-[#FAF8F2] border border-[#c1c9be] text-[#2b1700] hover:bg-[#eae4d5] rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Fiche
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Fiche Produit Admin */}
      {selectedProduct && (
        <div className="modal-backdrop">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#c1c9be] shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#c1c9be]/40">
              <div className="flex items-center gap-3">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.nom}
                  className="w-12 h-12 rounded-xl object-cover border border-[#c1c9be]"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700]">
                    {selectedProduct.nom}
                  </h3>
                  <span className="text-[12px] text-[#717970]">{selectedProduct.categorie} • {selectedProduct.producteur}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 rounded-lg text-[#717970] hover:bg-[#FAF8F2] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3 text-[13px]">
              <div className="p-3 bg-[#FAF8F2] rounded-xl text-[#414941] leading-relaxed">
                {selectedProduct.description}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FAF8F2] rounded-xl">
                  <div className="text-[11px] text-[#717970]">Prix de vente</div>
                  <div className="font-bold text-[#164525] text-[15px]">{selectedProduct.prix.toLocaleString('fr-FR')} FCFA / {selectedProduct.unite}</div>
                </div>
                <div className="p-3 bg-[#FAF8F2] rounded-xl">
                  <div className="text-[11px] text-[#717970]">Acompte requis (30%)</div>
                  <div className="font-bold text-[#7d4600] text-[15px]">{Math.round(selectedProduct.prix * 0.3).toLocaleString('fr-FR')} FCFA</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FAF8F2] rounded-xl">
                  <div className="text-[11px] text-[#717970]">Volume prévisionnel</div>
                  <div className="font-semibold text-[#2b1700]">{selectedProduct.quantitePrevue || selectedProduct.quantiteDisponible} {selectedProduct.unite}</div>
                </div>
                <div className="p-3 bg-[#FAF8F2] rounded-xl">
                  <div className="text-[11px] text-[#717970]">Date de récolte / dispo</div>
                  <div className="font-semibold text-[#2b1700]">{selectedProduct.dateDisponibilite}</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#c1c9be]/40 flex justify-end">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 bg-[#FAF8F2] border border-[#c1c9be] text-[#2b1700] rounded-xl text-[13px] font-medium hover:bg-[#eae4d5] cursor-pointer"
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
