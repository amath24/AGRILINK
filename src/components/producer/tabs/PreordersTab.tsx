import React, { useState } from 'react';
import { ProducerOrder, ProducerOrderStatus } from '../../../types';

interface PreordersTabProps {
  orders: ProducerOrder[];
  onSelectOrder: (order: ProducerOrder) => void;
  onOpenNewPreorder: () => void;
}

export const PreordersTab: React.FC<PreordersTabProps> = ({
  orders = [],
  onSelectOrder,
  onOpenNewPreorder,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const safeOrders = orders || [];

  const preordersList = safeOrders.filter((o) => {
    if (statusFilter !== 'all' && o.statut !== statusFilter) return false;
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

  const totalReservedKg = safeOrders.reduce((acc, o) => acc + (o.quantite || 0), 0);
  const totalAcompte = safeOrders.reduce((acc, o) => acc + (o.acomptePaye || 0), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white border border-[#c1c9be] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#164525] text-[28px]">
              receipt_long
            </span>
            <h1 className="font-['Montserrat'] text-[22px] font-bold text-[#2b1700]">
              Précommandes Reçues
            </h1>
          </div>
          <p className="text-[13px] text-[#717970] mt-1">
            Suivi des réservations clients avant récolte ({totalReservedKg} kg engagés • {totalAcompte.toLocaleString('fr-FR')} FCFA d'acomptes sécurisés).
          </p>
        </div>

        <button
          onClick={onOpenNewPreorder}
          className="bg-[#164525] text-white text-[13px] font-semibold px-4 py-2.5 rounded-full hover:bg-[#2f5d3a] transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">publish</span>
          Nouvelle offre précommande
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#c1c9be] p-3 rounded-2xl">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'Acompte payé', label: 'Acompte payé' },
            { id: 'Production en cours', label: 'En culture' },
            { id: 'Produit disponible', label: 'Disponible' },
            { id: 'Préparation', label: 'En préparation' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all cursor-pointer ${
                statusFilter === tab.id
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
            placeholder="Rechercher précommande..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
          />
        </div>
      </div>

      {/* Preorders Table */}
      <div className="bg-white border border-[#c1c9be] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#FAF8F2] border-b border-[#c1c9be] text-[#717970] font-semibold text-[12px] uppercase">
                <th className="py-3.5 px-4">Numéro & Date</th>
                <th className="py-3.5 px-4">Acheteur</th>
                <th className="py-3.5 px-4">Produit réservé</th>
                <th className="py-3.5 px-4">Quantité</th>
                <th className="py-3.5 px-4">Montant Total</th>
                <th className="py-3.5 px-4">Acompte (30%)</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c1c9be]/40">
              {preordersList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#717970]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[36px] text-[#c1c9be]">receipt_long</span>
                      <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#2b1700]">Aucune précommande reçue</h3>
                      <p className="text-[13px] text-[#717970] max-w-sm">Publiez des offres de précommandes sur vos récoltes à venir pour recevoir des réservations et acomptes.</p>
                      <button
                        onClick={onOpenNewPreorder}
                        className="mt-2 bg-[#164525] text-white text-[12px] font-bold px-3.5 py-1.5 rounded-full hover:bg-[#2f5d3a] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        Créer une offre de précommande
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                preordersList.map((order) => (
                <tr key={order.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-[#164525]">
                      #{order.numeroCommande}
                    </span>
                    <span className="block text-[11px] text-[#717970]">
                      {order.dateCommande}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-[#2b1700]">
                    {order.acheteurNom}
                    <span className="block text-[11px] text-[#717970] font-normal">
                      {order.acheteurTel}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={order.produitImage}
                        alt={order.produitNom}
                        className="w-8 h-8 rounded-lg object-cover border border-[#c1c9be]/60"
                      />
                      <span className="font-medium text-[#2b1700]">
                        {order.produitNom}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-[#164525]">
                    {order.quantite} {order.unite}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-[#2b1700]">
                    {order.montantTotal.toLocaleString('fr-FR')} FCFA
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#164525] block">
                      {order.acomptePaye.toLocaleString('fr-FR')} FCFA
                    </span>
                    <span className="text-[10px] text-[#717970] uppercase font-semibold">
                      {order.statutAcompte === 'payé' ? 'Séquestre OK' : 'En attente'}
                    </span>
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

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectOrder(order)}
                      className="px-3 py-1.5 rounded-xl text-[12px] font-semibold text-white bg-[#164525] hover:bg-[#2f5d3a] transition-all cursor-pointer shadow-xs"
                    >
                      Détail & Suivi
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
