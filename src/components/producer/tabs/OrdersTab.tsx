import React, { useState } from 'react';
import { ProducerOrder, ProducerOrderStatus } from '../../../types';

interface OrdersTabProps {
  orders: ProducerOrder[];
  onSelectOrder: (order: ProducerOrder) => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  onSelectOrder,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredOrders = orders.filter((o) => {
    if (selectedStatus !== 'all' && o.statut !== selectedStatus) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      return (
        o.numeroCommande.toLowerCase().includes(q) ||
        o.acheteurNom.toLowerCase().includes(q) ||
        o.produitNom.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (statut: ProducerOrderStatus) => {
    switch (statut) {
      case 'Précommande':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Acompte payé':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Production en cours':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Produit disponible':
        return 'bg-teal-100 text-teal-900 border-teal-300';
      case 'Préparation':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300';
      case 'En livraison':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Livrée':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white border border-[#c1c9be] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#164525] text-[28px]">
              inventory_2
            </span>
            <h1 className="font-['Montserrat'] text-[22px] font-bold text-[#2b1700]">
              Gestion des Commandes Clients
            </h1>
          </div>
          <p className="text-[13px] text-[#717970] mt-1">
            Visualisez tous les ordres d'achat, suivez les acomptes reçus et faites progresser les étapes de récolte et livraison.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#c1c9be] p-3 rounded-2xl">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'Toutes les commandes' },
            { id: 'Acompte payé', label: 'Acompte payé' },
            { id: 'Production en cours', label: 'En culture' },
            { id: 'Produit disponible', label: 'Produit disponible' },
            { id: 'Préparation', label: 'Préparation' },
            { id: 'En livraison', label: 'En livraison' },
            { id: 'Livrée', label: 'Livrées' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all cursor-pointer ${
                selectedStatus === tab.id
                  ? 'bg-[#164525] text-white shadow-xs'
                  : 'bg-[#FAF8F2] text-[#414941] hover:bg-[#eae4d5]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#717970] text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Filtrer commande..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#c1c9be] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#FAF8F2] border-b border-[#c1c9be] text-[#717970] font-semibold text-[12px] uppercase">
                <th className="py-3.5 px-4">Numéro</th>
                <th className="py-3.5 px-4">Acheteur</th>
                <th className="py-3.5 px-4">Produit</th>
                <th className="py-3.5 px-4">Quantité</th>
                <th className="py-3.5 px-4">Montant Total</th>
                <th className="py-3.5 px-4">Acompte</th>
                <th className="py-3.5 px-4">Solde</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c1c9be]/40">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-[#717970]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[36px] text-[#c1c9be]">shopping_bag</span>
                      <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#2b1700]">Aucune commande trouvée</h3>
                      <p className="text-[13px] text-[#717970] max-w-sm">Les commandes et réservations passées par vos acheteurs apparaîtront ici.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#164525]">
                    #{order.numeroCommande}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#2b1700]">
                    {order.acheteurNom}
                  </td>
                  <td className="py-3.5 px-4 text-[#414941]">
                    {order.produitNom}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#164525]">
                    {order.quantite} {order.unite}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#2b1700]">
                    {order.montantTotal.toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="py-3.5 px-4 text-[#164525] font-semibold">
                    {order.acomptePaye.toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="py-3.5 px-4 text-[#7d4600] font-semibold">
                    {order.soldeRestant.toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadge(
                        order.statut
                      )}`}
                    >
                      {order.statut}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[12px] text-[#717970]">
                    {order.dateCommande}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectOrder(order)}
                      className="px-3 py-1.5 rounded-xl text-[12px] font-semibold text-white bg-[#164525] hover:bg-[#2f5d3a] transition-all cursor-pointer shadow-xs"
                    >
                      Détail
                    </button>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
