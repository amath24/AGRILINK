import React, { useState } from 'react';
import { AdminBuyer, BuyerCategoryType } from '../../../types';

interface AdminBuyersTabProps {
  buyers: AdminBuyer[];
  onUpdateBuyerStatus?: (buyerId: string, status: 'Actif' | 'Inactif' | 'Suspendu') => void;
}

export const AdminBuyersTab: React.FC<AdminBuyersTabProps> = ({
  buyers = [],
  onUpdateBuyerStatus,
}) => {
  const [typeFilter, setTypeFilter] = useState<'all' | BuyerCategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBuyer, setSelectedBuyer] = useState<AdminBuyer | null>(null);

  const safeBuyers = buyers || [];

  const filteredBuyers = safeBuyers.filter((b) => {
    if (typeFilter !== 'all' && b.typeAcheteur !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = `${b.prenom} ${b.nom}`.toLowerCase().includes(q);
      const matchEmail = b.email.toLowerCase().includes(q);
      const matchTel = b.telephone.includes(q);
      const matchVille = b.ville.toLowerCase().includes(q);
      return matchName || matchEmail || matchTel || matchVille;
    }
    return true;
  });

  const totalDepenses = safeBuyers.reduce((acc, b) => acc + (b.montantDepense || 0), 0);
  const totalCommandes = safeBuyers.reduce((acc, b) => acc + (b.nombreCommandes || 0), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Statistiques Rapides */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Montserrat'] text-[24px] font-bold text-[#2b1700]">
            Gestion des Acheteurs & Clients B2B
          </h1>
          <p className="text-[14px] text-[#717970]">
            Suivi des restaurants, hôtels, supermarchés et particuliers enregistrés
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-3.5 py-1.5 rounded-xl border border-[#c1c9be]/60 text-[13px]">
            <span className="text-[#717970]">Volume total d'achat : </span>
            <span className="font-bold text-[#164525]">{totalDepenses.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div className="bg-white px-3.5 py-1.5 rounded-xl border border-[#c1c9be]/60 text-[13px]">
            <span className="font-bold text-[#2b1700]">{totalCommandes}</span>
            <span className="text-[#717970]"> commandes passées</span>
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
            placeholder="Rechercher un acheteur, email, ville..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3.5 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none cursor-pointer"
          >
            <option value="all">Tous les types ({safeBuyers.length})</option>
            <option value="Particulier">Particuliers</option>
            <option value="Restaurant">Restaurants</option>
            <option value="Hôtel">Hôtels</option>
            <option value="Supermarché">Supermarchés</option>
            <option value="Professionnel">Professionnels & Traiteurs</option>
          </select>
        </div>
      </div>

      {/* Tableau des Acheteurs */}
      <div className="bg-white border border-[#c1c9be]/60 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F2] border-b border-[#c1c9be]/60 text-[12px] font-bold text-[#717970] uppercase tracking-wider">
                <th className="py-3.5 px-4">Acheteur & Type</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Localisation</th>
                <th className="py-3.5 px-4 text-center">Commandes</th>
                <th className="py-3.5 px-4 text-right">Total Dépensé</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c1c9be]/30 text-[13px]">
              {filteredBuyers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#717970]">
                    <span className="material-symbols-outlined text-[36px] mb-2 text-[#717970]/60">person_search</span>
                    <p>Aucun acheteur ne correspond à cette recherche.</p>
                  </td>
                </tr>
              ) : (
                filteredBuyers.map((buyer) => (
                  <tr key={buyer.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#e07a5f]/20 text-[#b04a30] flex items-center justify-center font-bold text-[12px]">
                          {buyer.prenom.charAt(0)}{buyer.nom.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-[#2b1700]">{buyer.prenom} {buyer.nom}</div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#164525]">
                            <span className="material-symbols-outlined text-[13px]">store</span>
                            {buyer.typeAcheteur}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-[#2b1700] font-mono text-[12px]">{buyer.telephone}</div>
                      <div className="text-[11px] text-[#717970]">{buyer.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#414941]">
                      <div>{buyer.ville}</div>
                      <div className="text-[11px] text-[#717970] truncate max-w-[150px]">{buyer.adresse}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#2b1700]">
                      {buyer.nombreCommandes}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#164525]">
                      {buyer.montantDepense.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#164525]/10 text-[#164525]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#164525]"></span>
                        {buyer.statut}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedBuyer(buyer)}
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

      {/* Modal Détail Acheteur */}
      {selectedBuyer && (
        <div className="modal-backdrop">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#c1c9be] shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#c1c9be]/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e07a5f]/20 text-[#b04a30] flex items-center justify-center font-bold text-[14px]">
                  {selectedBuyer.prenom.charAt(0)}{selectedBuyer.nom.charAt(0)}
                </div>
                <div>
                  <h3 className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700]">
                    {selectedBuyer.prenom} {selectedBuyer.nom}
                  </h3>
                  <span className="text-[12px] text-[#717970]">{selectedBuyer.typeAcheteur} • Inscrit le {selectedBuyer.dateInscription}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedBuyer(null)}
                className="p-1.5 rounded-lg text-[#717970] hover:bg-[#FAF8F2] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3 text-[13px]">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FAF8F2] rounded-xl">
                  <div className="text-[11px] text-[#717970]">Email</div>
                  <div className="font-semibold text-[#2b1700] break-all">{selectedBuyer.email}</div>
                </div>
                <div className="p-3 bg-[#FAF8F2] rounded-xl">
                  <div className="text-[11px] text-[#717970]">Téléphone</div>
                  <div className="font-semibold text-[#2b1700]">{selectedBuyer.telephone}</div>
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F2] rounded-xl">
                <div className="text-[11px] text-[#717970]">Adresse de livraison</div>
                <div className="font-semibold text-[#2b1700]">{selectedBuyer.adresse}, {selectedBuyer.ville}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FAF8F2] rounded-xl">
                  <div className="text-[11px] text-[#717970]">Nombre total de commandes</div>
                  <div className="font-bold text-[#2b1700] text-[16px]">{selectedBuyer.nombreCommandes}</div>
                </div>
                <div className="p-3 bg-[#FAF8F2] rounded-xl">
                  <div className="text-[11px] text-[#717970]">Total des achats réalisés</div>
                  <div className="font-bold text-[#164525] text-[16px]">{selectedBuyer.montantDepense.toLocaleString('fr-FR')} FCFA</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#c1c9be]/40 flex justify-end">
              <button
                onClick={() => setSelectedBuyer(null)}
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
