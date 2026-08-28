import React, { useState } from 'react';
import { Product } from '../../../types';

interface ProductsTabProps {
  products: Product[];
  onOpenNewPreorder: () => void;
  onSelectProduct: (product: Product) => void;
  onToggleProductStatus?: (productId: string) => void;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({
  products,
  onOpenNewPreorder,
  onSelectProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [disabledProductIds, setDisabledProductIds] = useState<string[]>([]);
  const [priceOverrides, setPriceOverrides] = useState<Record<string, number>>({});
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  const toggleDisable = (id: string) => {
    setDisabledProductIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleStartEditPrice = (product: Product) => {
    setEditingPriceId(product.id);
    setTempPrice(priceOverrides[product.id] || product.prix);
  };

  const handleSavePrice = (productId: string) => {
    if (tempPrice > 0) {
      setPriceOverrides((prev) => ({ ...prev, [productId]: tempPrice }));
    }
    setEditingPriceId(null);
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.categorie !== selectedCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      return (
        p.nom.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categorie.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Title & Action */}
      <div className="bg-white border border-[#c1c9be] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#164525] text-[28px]">
              storefront
            </span>
            <h1 className="font-['Montserrat'] text-[22px] font-bold text-[#2b1700]">
              Catalogue & Produits de la Ferme
            </h1>
          </div>
          <p className="text-[13px] text-[#717970] mt-1">
            Gérez vos offres de précommandes actives, ajustez les prix de vente et contrôlez la visibilité sur la Marketplace.
          </p>
        </div>

        <button
          onClick={onOpenNewPreorder}
          className="bg-[#164525] text-white text-[13px] font-semibold px-4 py-2.5 rounded-full hover:bg-[#2f5d3a] transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">publish</span>
          Publier un produit / précommande
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#c1c9be] p-3 rounded-2xl">
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'Légumes', 'Fruits', 'Céréales', 'Transformés'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#164525] text-white shadow-xs'
                  : 'bg-[#FAF8F2] text-[#414941] hover:bg-[#eae4d5]'
              }`}
            >
              {cat === 'all' ? 'Tous les produits' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#717970] text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Filtrer un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#c1c9be] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#FAF8F2] border-b border-[#c1c9be] text-[#717970] font-semibold text-[12px] uppercase">
                <th className="py-3.5 px-4">Produit</th>
                <th className="py-3.5 px-4">Catégorie</th>
                <th className="py-3.5 px-4">Prix de vente</th>
                <th className="py-3.5 px-4">Stock en précommande</th>
                <th className="py-3.5 px-4">Date de récolte</th>
                <th className="py-3.5 px-4">Statut offre</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c1c9be]/40">
              {filteredProducts.map((prod) => {
                const isDisabled = disabledProductIds.includes(prod.id);
                const currentPrice = priceOverrides[prod.id] || prod.prix;
                const isEditingPrice = editingPriceId === prod.id;

                return (
                  <tr
                    key={prod.id}
                    className={`transition-colors ${
                      isDisabled ? 'bg-gray-50/70 opacity-60' : 'hover:bg-[#FAF8F2]/60'
                    }`}
                  >
                    {/* Nom + Image */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt={prod.nom}
                          className="w-12 h-12 rounded-xl object-cover border border-[#c1c9be]/60"
                        />
                        <div>
                          <h3 className="font-semibold text-[14px] text-[#2b1700]">
                            {prod.nom}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            {prod.isBio && (
                              <span className="text-[10px] font-bold text-[#164525] bg-[#164525]/10 px-1.5 py-0.2 rounded">
                                Bio
                              </span>
                            )}
                            {prod.isTracable && (
                              <span className="text-[10px] font-bold text-[#7d4600] bg-[#ffead7] px-1.5 py-0.2 rounded">
                                QR Traçable
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Categorie */}
                    <td className="py-3.5 px-4 text-[#414941]">
                      <span className="px-2.5 py-1 rounded-full bg-[#FAF8F2] border border-[#c1c9be]/60 text-[12px] font-medium">
                        {prod.categorie}
                      </span>
                    </td>

                    {/* Prix */}
                    <td className="py-3.5 px-4">
                      {isEditingPrice ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1 bg-white border border-[#164525] rounded text-[13px] font-bold"
                          />
                          <button
                            onClick={() => handleSavePrice(prod.id)}
                            className="p-1 text-[#164525] hover:bg-[#164525]/10 rounded cursor-pointer"
                            title="Valider"
                          >
                            <span className="material-symbols-outlined text-[18px]">check</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[14px] text-[#164525]">
                            {currentPrice.toLocaleString('fr-FR')} FCFA
                          </span>
                          <span className="text-[11px] text-[#717970]">
                            /{prod.unite}
                          </span>
                          <button
                            onClick={() => handleStartEditPrice(prod)}
                            className="text-[#717970] hover:text-[#164525] p-1 cursor-pointer"
                            title="Modifier le prix"
                          >
                            <span className="material-symbols-outlined text-[14px]">edit</span>
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Quantité dispo */}
                    <td className="py-3.5 px-4 font-semibold text-[#2b1700]">
                      {prod.quantiteDisponible} {prod.unite}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-[12px] text-[#414941]">
                      <span className="font-medium text-[#164525]">
                        {prod.dateDisponibilite}
                      </span>
                    </td>

                    {/* Statut */}
                    <td className="py-3.5 px-4">
                      {isDisabled ? (
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-300">
                          Désactivé
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                          Précommande Ouverte
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onSelectProduct(prod)}
                          className="px-2.5 py-1 rounded-lg text-[12px] font-semibold text-[#164525] bg-[#164525]/10 hover:bg-[#164525]/20 transition-colors cursor-pointer"
                          title="Voir sur la marketplace"
                        >
                          Voir
                        </button>
                        <button
                          onClick={() => toggleDisable(prod.id)}
                          className={`px-2.5 py-1 rounded-lg text-[12px] font-semibold transition-colors cursor-pointer ${
                            isDisabled
                              ? 'text-emerald-800 bg-emerald-100 hover:bg-emerald-200'
                              : 'text-amber-800 bg-amber-100 hover:bg-amber-200'
                          }`}
                        >
                          {isDisabled ? 'Activer' : 'Désactiver'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
