import React, { useState, useMemo } from 'react';
import { Preorder, Product } from '../../types';

interface BuyerOrdersTabProps {
  preorders: Preorder[];
  onSelectPreorder: (preorder: Preorder) => void;
  onOpenReceipt: (preorder: Preorder) => void;
  onReorderProduct?: (productId: string) => void;
}

export const BuyerOrdersTab: React.FC<BuyerOrdersTabProps> = ({
  preorders,
  onSelectPreorder,
  onOpenReceipt,
  onReorderProduct,
}) => {
  const [filter, setFilter] = useState<'all' | 'ongoing' | 'delivered' | 'cancelled'>('all');
  const [search, setSearch] = useState('');

  const filteredOrders = useMemo(() => {
    return preorders.filter((po) => {
      if (filter === 'ongoing') {
        if (po.statutCommande === 'Livrée' || po.statutCommande === 'Annulée') return false;
      } else if (filter === 'delivered') {
        if (po.statutCommande !== 'Livrée') return false;
      } else if (filter === 'cancelled') {
        if (po.statutCommande !== 'Annulée') return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchName = po.produitNom.toLowerCase().includes(q);
        const matchNum = po.numeroCommande.toLowerCase().includes(q);
        const matchProd = po.producteur.toLowerCase().includes(q);
        if (!matchName && !matchNum && !matchProd) return false;
      }

      return true;
    });
  }, [preorders, filter, search]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-[#c1c9be] shadow-sm">
        <div>
          <h1 className="font-['Montserrat'] text-[22px] md:text-[24px] font-bold text-[#2b1700]">
            Historique de mes Commandes
          </h1>
          <p className="text-[13px] text-[#717970] mt-0.5">
            Toutes vos commandes directes, précommandes et achats livrés
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#717970] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une commande..."
            className="w-full pl-9 pr-4 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-full text-[13px] text-[#2b1700] outline-none focus:border-[#164525]"
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 border-b border-[#c1c9be]/50 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-[#164525] text-white font-semibold'
              : 'text-[#414941] hover:bg-[#FAF8F2]'
          }`}
        >
          Toutes ({preorders.length})
        </button>
        <button
          onClick={() => setFilter('ongoing')}
          className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
            filter === 'ongoing'
              ? 'bg-[#164525] text-white font-semibold'
              : 'text-[#414941] hover:bg-[#FAF8F2]'
          }`}
        >
          En cours ({preorders.filter((p) => p.statutCommande !== 'Livrée' && p.statutCommande !== 'Annulée').length})
        </button>
        <button
          onClick={() => setFilter('delivered')}
          className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
            filter === 'delivered'
              ? 'bg-[#164525] text-white font-semibold'
              : 'text-[#414941] hover:bg-[#FAF8F2]'
          }`}
        >
          Livrées ({preorders.filter((p) => p.statutCommande === 'Livrée').length})
        </button>
      </div>

      {/* Orders Table / Cards */}
      <div className="bg-white rounded-2xl border border-[#c1c9be] overflow-hidden shadow-sm">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-[#717970]">
            <span className="material-symbols-outlined text-[40px] text-[#717970] mb-2">
              receipt_long
            </span>
            <p className="text-[14px]">Aucune commande trouvée.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#c1c9be]/40">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#FAF8F2] transition-colors"
              >
                {/* Left: Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={order.produitImage}
                    alt={order.produitNom}
                    className="w-16 h-16 rounded-xl object-cover border border-[#c1c9be] shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[13px] font-bold text-[#164525]">
                        {order.numeroCommande}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        order.statutCommande === 'Livrée'
                          ? 'bg-[#bbefc1] text-[#164525]'
                          : order.statutCommande === 'Prête pour livraison'
                          ? 'bg-[#164525] text-white'
                          : 'bg-[#fff1e6] text-[#7d4600]'
                      }`}>
                        {order.statutCommande}
                      </span>
                    </div>
                    <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#2b1700] mt-0.5">
                      {order.produitNom}
                    </h3>
                    <p className="text-[12px] text-[#717970]">
                      {order.quantite} {order.unite} • {order.producteur} • Commandée le {order.dateCommande}
                    </p>
                  </div>
                </div>

                {/* Right: Amounts & Actions */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 border-[#c1c9be]/40 pt-3 md:pt-0 gap-2">
                  <div className="text-left md:text-right">
                    <span className="text-[12px] text-[#717970] block">Montant Total</span>
                    <span className="font-['Montserrat'] text-[16px] font-bold text-[#164525]">
                      {order.montantTotal.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenReceipt(order)}
                      className="text-[#164525] text-[12px] font-semibold hover:underline px-2 py-1 bg-white rounded border border-[#c1c9be] flex items-center gap-1 cursor-pointer"
                      title="Facture / Reçu"
                    >
                      <span className="material-symbols-outlined text-[15px]">receipt</span>
                      Reçu
                    </button>

                    <button
                      onClick={() => onSelectPreorder(order)}
                      className="bg-[#164525] text-white text-[12px] font-semibold px-3 py-1 rounded-full hover:bg-[#2f5d3a] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      Détails
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
