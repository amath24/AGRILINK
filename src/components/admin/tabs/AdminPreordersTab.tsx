import React, { useState } from 'react';
import { Preorder, OrderStatus } from '../../../types';

interface AdminPreordersTabProps {
  preorders: Preorder[];
  onUpdatePreorderStatus?: (preorderId: string, status: OrderStatus) => void;
}

export const AdminPreordersTab: React.FC<AdminPreordersTabProps> = ({
  preorders = [],
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPreorder, setSelectedPreorder] = useState<Preorder | null>(null);

  const safePreorders = preorders || [];

  const filteredPreorders = safePreorders.filter((po) => {
    if (statusFilter !== 'all' && po.statutCommande !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNum = po.numeroCommande.toLowerCase().includes(q);
      const matchClient = po.nomClient.toLowerCase().includes(q);
      const matchProd = po.produitNom.toLowerCase().includes(q);
      const matchProducteur = po.producteur.toLowerCase().includes(q);
      return matchNum || matchClient || matchProd || matchProducteur;
    }
    return true;
  });

  const totalVolumeKg = safePreorders.reduce((acc, po) => acc + (po.quantite || 0), 0);
  const totalAcomptes = safePreorders.reduce((acc, po) => acc + (po.acompte || 0), 0);
  const totalMontant = safePreorders.reduce((acc, po) => acc + (po.montantTotal || 0), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Statistiques */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Montserrat'] text-[24px] font-bold text-[#2b1700]">
            Gestion des Précommandes
          </h1>
          <p className="text-[14px] text-[#717970]">
            Supervision des contrats de vente anticipée et des acomptes bloqués sous séquestre
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-3.5 py-1.5 rounded-xl border border-[#c1c9be]/60 text-[13px]">
            <span className="text-[#717970]">Acomptes 30% : </span>
            <span className="font-bold text-[#7d4600]">{totalAcomptes.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div className="bg-white px-3.5 py-1.5 rounded-xl border border-[#c1c9be]/60 text-[13px]">
            <span className="text-[#717970]">Total brut : </span>
            <span className="font-bold text-[#164525]">{totalMontant.toLocaleString('fr-FR')} FCFA</span>
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
            placeholder="N° Commande, acheteur, produit..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none cursor-pointer"
          >
            <option value="all">Tous les statuts ({safePreorders.length})</option>
            <option value="En attente">En attente</option>
            <option value="Confirmée">Confirmée</option>
            <option value="En culture">En culture</option>
            <option value="En récolte">En récolte</option>
            <option value="Prête pour livraison">Prête pour livraison</option>
            <option value="En livraison">En livraison</option>
            <option value="Livrée">Livrée</option>
          </select>
        </div>
      </div>

      {/* Tableau des Précommandes */}
      <div className="bg-white border border-[#c1c9be]/60 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F2] border-b border-[#c1c9be]/60 text-[12px] font-bold text-[#717970] uppercase tracking-wider">
                <th className="py-3.5 px-4">N° Commande</th>
                <th className="py-3.5 px-4">Acheteur</th>
                <th className="py-3.5 px-4">Producteur</th>
                <th className="py-3.5 px-4">Produit & Qté</th>
                <th className="py-3.5 px-4 text-right">Montant Total</th>
                <th className="py-3.5 px-4 text-right">Acompte (30%)</th>
                <th className="py-3.5 px-4">Date Prévue</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c1c9be]/30 text-[13px]">
              {filteredPreorders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#717970]">
                    <span className="material-symbols-outlined text-[36px] mb-2 text-[#717970]/60">event_busy</span>
                    <p>Aucune précommande trouvée.</p>
                  </td>
                </tr>
              ) : (
                filteredPreorders.map((po) => (
                  <tr key={po.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#164525]">
                      #{po.numeroCommande}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#2b1700]">{po.nomClient}</div>
                      <div className="text-[11px] text-[#717970]">{po.telephoneClient}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#2b1700]">{po.producteur}</div>
                      <div className="text-[11px] text-[#717970]">{po.localisation}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#2b1700]">{po.produitNom}</div>
                      <div className="text-[11px] text-[#717970]">{po.quantite} {po.unite}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#2b1700]">
                      {po.montantTotal.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#7d4600]">
                      {po.acompte.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="py-3.5 px-4 text-[#414941] text-[12px]">
                      {po.datePrevueDisponibilite}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        po.statutCommande === 'Livrée' ? 'bg-[#164525]/10 text-[#164525]' :
                        po.statutCommande === 'En livraison' ? 'bg-[#3d5a80]/15 text-[#3d5a80]' :
                        po.statutCommande === 'En culture' || po.statutCommande === 'En récolte' ? 'bg-[#2e7d32]/10 text-[#2e7d32]' :
                        'bg-[#e07a5f]/15 text-[#b04a30]'
                      }`}>
                        {po.statutCommande}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedPreorder(po)}
                        className="px-2.5 py-1 bg-[#FAF8F2] border border-[#c1c9be] text-[#2b1700] hover:bg-[#eae4d5] rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
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

      {/* Modal Détail Précommande */}
      {selectedPreorder && (
        <div className="modal-backdrop">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#c1c9be] shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#c1c9be]/40">
              <div>
                <span className="text-[11px] font-mono text-[#717970]">CONTRAT DE PRÉCOMMANDE</span>
                <h3 className="font-['Montserrat'] text-[18px] font-bold text-[#164525]">
                  #{selectedPreorder.numeroCommande}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPreorder(null)}
                className="p-1.5 rounded-lg text-[#717970] hover:bg-[#FAF8F2] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3 text-[13px]">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FAF8F2] rounded-xl">
                  <div className="text-[11px] text-[#717970]">Acheteur</div>
                  <div className="font-bold text-[#2b1700]">{selectedPreorder.nomClient}</div>
                  <div className="text-[11px] text-[#717970]">{selectedPreorder.telephoneClient}</div>
                </div>
                <div className="p-3 bg-[#FAF8F2] rounded-xl">
                  <div className="text-[11px] text-[#717970]">Producteur</div>
                  <div className="font-bold text-[#2b1700]">{selectedPreorder.producteur}</div>
                  <div className="text-[11px] text-[#717970]">{selectedPreorder.localisation}</div>
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F2] rounded-xl">
                <div className="text-[11px] text-[#717970]">Produit réservé</div>
                <div className="font-bold text-[#2b1700] text-[15px]">{selectedPreorder.produitNom}</div>
                <div className="text-[12px] text-[#414941]">Quantité : {selectedPreorder.quantite} {selectedPreorder.unite} @ {selectedPreorder.prixUnitaire.toLocaleString('fr-FR')} FCFA</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FAF8F2] rounded-xl">
                  <div className="text-[11px] text-[#717970]">Montant Total</div>
                  <div className="font-bold text-[#2b1700] text-[16px]">{selectedPreorder.montantTotal.toLocaleString('fr-FR')} FCFA</div>
                </div>
                <div className="p-3 bg-[#164525]/10 rounded-xl">
                  <div className="text-[11px] text-[#164525] font-semibold">Acompte Séquestré (30%)</div>
                  <div className="font-bold text-[#164525] text-[16px]">{selectedPreorder.acompte.toLocaleString('fr-FR')} FCFA</div>
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F2] rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#717970]">Statut de la commande</div>
                  <div className="font-bold text-[#2b1700]">{selectedPreorder.statutCommande}</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#717970]">Date estimée</div>
                  <div className="font-semibold text-[#164525]">{selectedPreorder.datePrevueDisponibilite}</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#c1c9be]/40 flex justify-end">
              <button
                onClick={() => setSelectedPreorder(null)}
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
