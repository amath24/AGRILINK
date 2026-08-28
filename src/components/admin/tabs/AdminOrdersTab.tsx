import React, { useState } from 'react';
import { ProducerOrder, ProducerOrderStatus } from '../../../types';

interface AdminOrdersTabProps {
  orders: ProducerOrder[];
  onUpdateOrderStatus?: (orderId: string, status: ProducerOrderStatus) => void;
}

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({
  orders = [],
  onUpdateOrderStatus,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<ProducerOrder | null>(null);

  const safeOrders = orders || [];

  const filteredOrders = safeOrders.filter((o) => {
    if (statusFilter !== 'all' && o.statut !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNum = o.numeroCommande.toLowerCase().includes(q);
      const matchClient = o.acheteurNom.toLowerCase().includes(q);
      const matchProd = o.produitNom.toLowerCase().includes(q);
      return matchNum || matchClient || matchProd;
    }
    return true;
  });

  const totalMontant = safeOrders.reduce((acc, o) => acc + (o.montantTotal || 0), 0);
  const totalAcomptes = safeOrders.reduce((acc, o) => acc + (o.acomptePaye || 0), 0);
  const totalSoldes = safeOrders.reduce((acc, o) => acc + (o.soldeRestant || 0), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Statistiques */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Montserrat'] text-[24px] font-bold text-[#2b1700]">
            Suivi Central des Commandes
          </h1>
          <p className="text-[14px] text-[#717970]">
            Supervision de l'exécution des commandes, acomptes 30% et soldes 70%
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white px-3.5 py-1.5 rounded-xl border border-[#c1c9be]/60 text-[13px]">
            <span className="text-[#717970]">Acomptes : </span>
            <span className="font-bold text-[#7d4600]">{totalAcomptes.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div className="bg-white px-3.5 py-1.5 rounded-xl border border-[#c1c9be]/60 text-[13px]">
            <span className="text-[#717970]">Soldes restants : </span>
            <span className="font-bold text-[#164525]">{totalSoldes.toLocaleString('fr-FR')} FCFA</span>
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
            placeholder="Numéro, acheteur, produit..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none cursor-pointer"
          >
            <option value="all">Tous les statuts ({safeOrders.length})</option>
            <option value="Précommande">Précommande</option>
            <option value="Acompte payé">Acompte payé</option>
            <option value="Production en cours">Production en cours</option>
            <option value="Produit disponible">Produit disponible</option>
            <option value="Préparation">Préparation</option>
            <option value="En livraison">En livraison</option>
            <option value="Livrée">Livrée</option>
          </select>
        </div>
      </div>

      {/* Tableau des Commandes */}
      <div className="bg-white border border-[#c1c9be]/60 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F2] border-b border-[#c1c9be]/60 text-[12px] font-bold text-[#717970] uppercase tracking-wider">
                <th className="py-3.5 px-4">Numéro</th>
                <th className="py-3.5 px-4">Acheteur</th>
                <th className="py-3.5 px-4">Produit & Qté</th>
                <th className="py-3.5 px-4 text-right">Montant</th>
                <th className="py-3.5 px-4 text-right">Acompte</th>
                <th className="py-3.5 px-4 text-right">Solde</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c1c9be]/30 text-[13px]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#717970]">
                    <span className="material-symbols-outlined text-[36px] mb-2 text-[#717970]/60">receipt_long</span>
                    <p>Aucune commande enregistrée.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#164525]">
                      #{ord.numeroCommande}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#2b1700]">{ord.acheteurNom}</div>
                      <div className="text-[11px] text-[#717970]">{ord.acheteurTel}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#2b1700]">{ord.produitNom}</div>
                      <div className="text-[11px] text-[#717970]">{ord.quantite} {ord.unite}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#2b1700]">
                      {ord.montantTotal.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#7d4600]">
                      {ord.acomptePaye.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#164525]">
                      {ord.soldeRestant.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        ord.statut === 'Livrée' ? 'bg-[#164525]/10 text-[#164525]' :
                        ord.statut === 'En livraison' ? 'bg-[#3d5a80]/15 text-[#3d5a80]' :
                        ord.statut === 'Production en cours' ? 'bg-[#2e7d32]/10 text-[#2e7d32]' :
                        'bg-[#e07a5f]/15 text-[#b04a30]'
                      }`}>
                        {ord.statut}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#717970] text-[12px]">
                      {ord.dateCommande}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-2.5 py-1 bg-[#FAF8F2] border border-[#c1c9be] text-[#2b1700] hover:bg-[#eae4d5] rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        Consulter
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Détail Commande */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#c1c9be] shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#c1c9be]/40">
              <div>
                <span className="text-[11px] font-mono text-[#717970]">COMMANDE CENTRALE</span>
                <h3 className="font-['Montserrat'] text-[18px] font-bold text-[#164525]">
                  #{selectedOrder.numeroCommande}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-[#717970] hover:bg-[#FAF8F2] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3 text-[13px]">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FAF8F2] rounded-xl">
                  <div className="text-[11px] text-[#717970]">Acheteur</div>
                  <div className="font-bold text-[#2b1700]">{selectedOrder.acheteurNom}</div>
                  <div className="text-[11px] text-[#717970]">{selectedOrder.acheteurTel}</div>
                  <div className="text-[11px] text-[#717970] truncate">{selectedOrder.acheteurAdresse}</div>
                </div>
                <div className="p-3 bg-[#FAF8F2] rounded-xl">
                  <div className="text-[11px] text-[#717970]">Moyen de Paiement</div>
                  <div className="font-bold text-[#2b1700] uppercase">{selectedOrder.moyenPaiement}</div>
                  <div className="text-[11px] text-[#164525] font-semibold mt-1">Acompte : {selectedOrder.statutAcompte}</div>
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F2] rounded-xl">
                <div className="text-[11px] text-[#717970]">Produit & Quantité</div>
                <div className="font-bold text-[#2b1700] text-[15px]">{selectedOrder.produitNom}</div>
                <div className="text-[12px] text-[#414941]">{selectedOrder.quantite} {selectedOrder.unite} à {selectedOrder.prixUnitaire.toLocaleString('fr-FR')} FCFA/{selectedOrder.unite}</div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-[#FAF8F2] rounded-xl">
                  <div className="text-[10px] text-[#717970]">Total</div>
                  <div className="font-bold text-[#2b1700] text-[13px]">{selectedOrder.montantTotal.toLocaleString('fr-FR')} F</div>
                </div>
                <div className="p-3 bg-[#7d4600]/10 rounded-xl">
                  <div className="text-[10px] text-[#7d4600] font-semibold">Acompte 30%</div>
                  <div className="font-bold text-[#7d4600] text-[13px]">{selectedOrder.acomptePaye.toLocaleString('fr-FR')} F</div>
                </div>
                <div className="p-3 bg-[#164525]/10 rounded-xl">
                  <div className="text-[10px] text-[#164525] font-semibold">Solde 70%</div>
                  <div className="font-bold text-[#164525] text-[13px]">{selectedOrder.soldeRestant.toLocaleString('fr-FR')} F</div>
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F2] rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#717970]">Statut opérationnel</div>
                  <div className="font-bold text-[#2b1700]">{selectedOrder.statut}</div>
                </div>
                {onUpdateOrderStatus && selectedOrder.statut !== 'Livrée' && (
                  <button
                    onClick={() => {
                      onUpdateOrderStatus(selectedOrder.id, 'Livrée');
                      setSelectedOrder({ ...selectedOrder, statut: 'Livrée' });
                    }}
                    className="px-3 py-1 bg-[#164525] text-white rounded-lg text-[12px] font-bold hover:bg-[#2f5d3a] cursor-pointer"
                  >
                    Marquer Livrée
                  </button>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[#c1c9be]/40 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
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
