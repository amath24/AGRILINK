import React, { useState } from 'react';
import { ProducerDelivery, ProducerDeliveryStatus } from '../../../types';

interface AdminDeliveriesTabProps {
  deliveries: ProducerDelivery[];
  onUpdateDeliveryStatus?: (deliveryId: string, status: ProducerDeliveryStatus) => void;
}

export const AdminDeliveriesTab: React.FC<AdminDeliveriesTabProps> = ({
  deliveries = [],
  onUpdateDeliveryStatus,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | ProducerDeliveryStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState<ProducerDelivery | null>(null);

  const safeDeliveries = deliveries || [];

  const filteredDeliveries = safeDeliveries.filter((d) => {
    if (statusFilter !== 'all' && d.statut !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNum = d.numeroCommande.toLowerCase().includes(q);
      const matchClient = d.acheteurNom.toLowerCase().includes(q);
      const matchProd = d.produitNom.toLowerCase().includes(q);
      const matchSuivi = d.codeSuivi.toLowerCase().includes(q);
      return matchNum || matchClient || matchProd || matchSuivi;
    }
    return true;
  });

  const countLivrees = safeDeliveries.filter((d) => d.statut === 'Livrée').length;
  const countEnCours = safeDeliveries.filter((d) => d.statut === 'En livraison').length;
  const countPrepa = safeDeliveries.filter((d) => d.statut === 'À préparer' || d.statut === 'Prête').length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Statistiques Rapides */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Montserrat'] text-[24px] font-bold text-[#2b1700]">
            Supervision Logistique & Livraisons
          </h1>
          <p className="text-[14px] text-[#717970]">
            Suivi en temps réel des tournées de livraison et des transporteurs partenaires
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-3.5 py-1.5 rounded-xl border border-[#c1c9be]/60 text-[13px]">
            <span className="font-bold text-[#164525]">{countLivrees}</span>
            <span className="text-[#717970]"> livrées</span>
          </div>
          <div className="bg-white px-3.5 py-1.5 rounded-xl border border-[#c1c9be]/60 text-[13px]">
            <span className="font-bold text-[#3d5a80]">{countEnCours}</span>
            <span className="text-[#717970]"> en transit</span>
          </div>
          <div className="bg-white px-3.5 py-1.5 rounded-xl border border-[#c1c9be]/60 text-[13px]">
            <span className="font-bold text-[#e07a5f]">{countPrepa}</span>
            <span className="text-[#717970]"> en préparation</span>
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
            placeholder="N° Commande, acheteur, code suivi..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3.5 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none cursor-pointer"
          >
            <option value="all">Tous les statuts ({safeDeliveries.length})</option>
            <option value="À préparer">À préparer</option>
            <option value="Prête">Prête</option>
            <option value="En livraison">En livraison</option>
            <option value="Livrée">Livrée</option>
          </select>
        </div>
      </div>

      {/* Tableau des Livraisons */}
      <div className="bg-white border border-[#c1c9be]/60 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F2] border-b border-[#c1c9be]/60 text-[12px] font-bold text-[#717970] uppercase tracking-wider">
                <th className="py-3.5 px-4">Commande & Suivi</th>
                <th className="py-3.5 px-4">Acheteur & Téléphone</th>
                <th className="py-3.5 px-4">Produit & Volume</th>
                <th className="py-3.5 px-4">Adresse de livraison</th>
                <th className="py-3.5 px-4">Date Prévue</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c1c9be]/30 text-[13px]">
              {filteredDeliveries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#717970]">
                    <span className="material-symbols-outlined text-[36px] mb-2 text-[#717970]/60">local_shipping</span>
                    <p>Aucune livraison trouvée.</p>
                  </td>
                </tr>
              ) : (
                filteredDeliveries.map((del) => (
                  <tr key={del.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-[#164525]">#{del.numeroCommande}</div>
                      <div className="text-[11px] font-mono text-[#717970]">{del.codeSuivi}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#2b1700]">{del.acheteurNom}</div>
                      <div className="text-[11px] text-[#717970]">{del.acheteurTel}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#2b1700]">{del.produitNom}</div>
                      <div className="text-[11px] text-[#717970]">{del.quantite} {del.unite}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#414941]">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-[#717970]">location_on</span>
                        <span className="truncate max-w-[180px]">{del.adresseLivraison}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#414941] text-[12px]">{del.datePrevue}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        del.statut === 'Livrée' ? 'bg-[#164525]/10 text-[#164525]' :
                        del.statut === 'En livraison' ? 'bg-[#3d5a80]/15 text-[#3d5a80]' :
                        'bg-[#e07a5f]/15 text-[#b04a30]'
                      }`}>
                        {del.statut}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedDelivery(del)}
                        className="px-2.5 py-1 bg-[#FAF8F2] border border-[#c1c9be] text-[#2b1700] hover:bg-[#eae4d5] rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        Détails
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Détail Livraison */}
      {selectedDelivery && (
        <div className="modal-backdrop">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#c1c9be] shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#c1c9be]/40">
              <div>
                <span className="text-[11px] font-mono text-[#717970]">BON D'EXPÉDITION</span>
                <h3 className="font-['Montserrat'] text-[18px] font-bold text-[#164525]">
                  Suivi #{selectedDelivery.codeSuivi}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDelivery(null)}
                className="p-1.5 rounded-lg text-[#717970] hover:bg-[#FAF8F2] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3 text-[13px]">
              <div className="p-3 bg-[#FAF8F2] rounded-xl">
                <div className="text-[11px] text-[#717970]">Destinataire & Contact</div>
                <div className="font-bold text-[#2b1700]">{selectedDelivery.acheteurNom}</div>
                <div className="text-[12px] text-[#414941]">{selectedDelivery.acheteurTel}</div>
                <div className="text-[12px] text-[#414941] mt-1">{selectedDelivery.adresseLivraison}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FAF8F2] rounded-xl">
                  <div className="text-[11px] text-[#717970]">Produit & Quantité</div>
                  <div className="font-bold text-[#2b1700]">{selectedDelivery.produitNom}</div>
                  <div className="text-[12px] text-[#164525] font-semibold">{selectedDelivery.quantite} {selectedDelivery.unite}</div>
                </div>
                <div className="p-3 bg-[#FAF8F2] rounded-xl">
                  <div className="text-[11px] text-[#717970]">Transporteur assigné</div>
                  <div className="font-bold text-[#2b1700]">{selectedDelivery.transporteurNom}</div>
                  <div className="text-[11px] text-[#717970]">{selectedDelivery.transporteurTel}</div>
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F2] rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#717970]">Statut de livraison</div>
                  <div className="font-bold text-[#2b1700]">{selectedDelivery.statut}</div>
                </div>

                {onUpdateDeliveryStatus && selectedDelivery.statut !== 'Livrée' && (
                  <button
                    onClick={() => {
                      onUpdateDeliveryStatus(selectedDelivery.id, 'Livrée');
                      setSelectedDelivery({ ...selectedDelivery, statut: 'Livrée' });
                    }}
                    className="px-3.5 py-1.5 bg-[#164525] text-white rounded-xl text-[12px] font-bold hover:bg-[#2f5d3a] cursor-pointer"
                  >
                    Valider la livraison
                  </button>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[#c1c9be]/40 flex justify-end">
              <button
                onClick={() => setSelectedDelivery(null)}
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
