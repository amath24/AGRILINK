import React, { useState } from 'react';
import { AdminProducer, ProducerValidationStatus } from '../../../types';

interface AdminProducersTabProps {
  producers: AdminProducer[];
  onValidateProducer: (id: string) => void;
  onRejectProducer: (id: string) => void;
  onSuspendProducer: (id: string) => void;
}

export const AdminProducersTab: React.FC<AdminProducersTabProps> = ({
  producers = [],
  onValidateProducer,
  onRejectProducer,
  onSuspendProducer,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | ProducerValidationStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducer, setSelectedProducer] = useState<AdminProducer | null>(null);

  const safeProducers = producers || [];

  const filteredProducers = safeProducers.filter((p) => {
    if (statusFilter !== 'all' && p.statutValidation !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.nom.toLowerCase().includes(q);
      const matchExp = p.exploitation.toLowerCase().includes(q);
      const matchGerant = p.gerant.toLowerCase().includes(q);
      const matchLoc = p.localisation.toLowerCase().includes(q);
      return matchName || matchExp || matchGerant || matchLoc;
    }
    return true;
  });

  const pendingCount = safeProducers.filter((p) => p.statutValidation === 'En attente de validation').length;
  const validatedCount = safeProducers.filter((p) => p.statutValidation === 'Validé').length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header et Message d'alerte sur les validations en attente */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Montserrat'] text-[24px] font-bold text-[#2b1700]">
            Gestion & Validation des Producteurs
          </h1>
          <p className="text-[14px] text-[#717970]">
            Contrôle qualité des exploitations agricoles avant autorisation de publication de récoltes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-[#c1c9be]/60 text-[13px]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#164525]"></span>
            <span className="font-bold text-[#2b1700]">{validatedCount}</span>
            <span className="text-[#717970]">Validés</span>
          </div>
          <div className="flex items-center gap-2 bg-[#e76f51]/10 px-3.5 py-1.5 rounded-xl border border-[#e76f51]/30 text-[13px]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e76f51]"></span>
            <span className="font-bold text-[#e76f51]">{pendingCount}</span>
            <span className="text-[#e76f51] font-medium">À valider</span>
          </div>
        </div>
      </div>

      {/* Alerte si des dossiers attendent */}
      {pendingCount > 0 && (
        <div className="bg-[#e76f51]/10 border border-[#e76f51]/30 rounded-2xl p-4.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e76f51] text-white flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">pending_actions</span>
            </div>
            <div>
              <h3 className="font-bold text-[14px] text-[#2b1700]">
                {pendingCount} producteur(s) en attente d'agrément
              </h3>
              <p className="text-[13px] text-[#414941]">
                Vérifiez les pièces justificatives d'exploitation pour leur permettre de publier leurs précommandes sur la marketplace.
              </p>
            </div>
          </div>
          <button
            onClick={() => setStatusFilter('En attente de validation')}
            className="px-3.5 py-1.5 bg-[#e76f51] text-white rounded-xl text-[12px] font-bold hover:bg-[#d65f42] transition-colors cursor-pointer whitespace-nowrap"
          >
            Filtrer les demandes
          </button>
        </div>
      )}

      {/* Filtres & Recherche */}
      <div className="bg-white border border-[#c1c9be]/60 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#717970] text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom, exploitation, gérant..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3.5 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none cursor-pointer"
          >
            <option value="all">Tous les statuts ({safeProducers.length})</option>
            <option value="En attente de validation">En attente de validation ({pendingCount})</option>
            <option value="Validé">Validés ({validatedCount})</option>
            <option value="Refusé">Refusés</option>
            <option value="Suspendu">Suspendus</option>
          </select>
        </div>
      </div>

      {/* Tableau des Producteurs */}
      <div className="bg-white border border-[#c1c9be]/60 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F2] border-b border-[#c1c9be]/60 text-[12px] font-bold text-[#717970] uppercase tracking-wider">
                <th className="py-3.5 px-4">Exploitation & Gérant</th>
                <th className="py-3.5 px-4">Localisation</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4 text-center">Produits</th>
                <th className="py-3.5 px-4 text-center">Commandes</th>
                <th className="py-3.5 px-4">Statut Validation</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c1c9be]/30 text-[13px]">
              {filteredProducers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#717970]">
                    <span className="material-symbols-outlined text-[36px] mb-2 text-[#717970]/60">agriculture</span>
                    <p>Aucun producteur trouvé pour cette sélection.</p>
                  </td>
                </tr>
              ) : (
                filteredProducers.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#164525]/10 text-[#164525] flex items-center justify-center font-bold text-[13px] flex-shrink-0">
                          <span className="material-symbols-outlined text-[20px]">agriculture</span>
                        </div>
                        <div>
                          <div className="font-bold text-[#2b1700]">{prod.nom}</div>
                          <div className="text-[11px] text-[#717970]">{prod.gerant} • {prod.superficie} ha</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-[#414941]">
                        <span className="material-symbols-outlined text-[16px] text-[#717970]">location_on</span>
                        <span>{prod.localisation}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-[#2b1700] font-mono text-[12px]">{prod.telephone}</div>
                      <div className="text-[11px] text-[#717970]">{prod.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#2b1700]">
                      {prod.nombreProduits}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#164525]">
                      {prod.nombreCommandes}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        prod.statutValidation === 'Validé' ? 'bg-[#164525]/10 text-[#164525]' :
                        prod.statutValidation === 'En attente de validation' ? 'bg-[#e76f51]/15 text-[#e76f51]' :
                        prod.statutValidation === 'Refusé' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          prod.statutValidation === 'Validé' ? 'bg-[#164525]' :
                          prod.statutValidation === 'En attente de validation' ? 'bg-[#e76f51] animate-ping' :
                          prod.statutValidation === 'Refusé' ? 'bg-red-600' :
                          'bg-gray-500'
                        }`}></span>
                        {prod.statutValidation}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {prod.statutValidation === 'En attente de validation' ? (
                          <button
                            onClick={() => onValidateProducer(prod.id)}
                            className="px-3 py-1 bg-[#164525] text-white rounded-lg text-[12px] font-bold hover:bg-[#2f5d3a] transition-colors cursor-pointer flex items-center gap-1"
                            title="Valider et activer le producteur"
                          >
                            <span className="material-symbols-outlined text-[15px]">check_circle</span>
                            Valider
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedProducer(prod)}
                            className="p-1.5 text-[#414941] hover:text-[#164525] hover:bg-[#FAF8F2] rounded-lg transition-colors cursor-pointer"
                            title="Consulter la fiche"
                          >
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedProducer(prod)}
                          className="px-2.5 py-1 bg-[#FAF8F2] border border-[#c1c9be] text-[#2b1700] hover:bg-[#eae4d5] rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Détails
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

      {/* Modal Fiche Complète Producteur */}
      {selectedProducer && (
        <div className="modal-backdrop">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 border border-[#c1c9be] shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#c1c9be]/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#164525] text-white flex items-center justify-center font-bold text-[14px]">
                  <span className="material-symbols-outlined text-[24px]">agriculture</span>
                </div>
                <div>
                  <h3 className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700]">
                    {selectedProducer.nom}
                  </h3>
                  <span className="text-[12px] text-[#717970]">{selectedProducer.gerant} (Gérant)</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedProducer(null)}
                className="p-1.5 rounded-lg text-[#717970] hover:bg-[#FAF8F2] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="py-4 space-y-4 text-[13px]">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FAF8F2] rounded-xl">
                  <div className="text-[11px] text-[#717970]">Nom d'exploitation</div>
                  <div className="font-bold text-[#2b1700]">{selectedProducer.exploitation}</div>
                </div>
                <div className="p-3 bg-[#FAF8F2] rounded-xl">
                  <div className="text-[11px] text-[#717970]">Superficie cultivable</div>
                  <div className="font-bold text-[#2b1700]">{selectedProducer.superficie} Hectares</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FAF8F2] rounded-xl">
                  <div className="text-[11px] text-[#717970]">Localisation géographique</div>
                  <div className="font-semibold text-[#2b1700]">{selectedProducer.localisation}</div>
                </div>
                <div className="p-3 bg-[#FAF8F2] rounded-xl">
                  <div className="text-[11px] text-[#717970]">Téléphone officiel</div>
                  <div className="font-semibold text-[#2b1700]">{selectedProducer.telephone}</div>
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F2] rounded-xl">
                <div className="text-[11px] text-[#717970] mb-1">Type de production & Certifications</div>
                <div className="font-semibold text-[#2b1700] mb-2">{selectedProducer.typeProduction}</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProducer.certifications.map((cert, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-full bg-[#164525]/10 text-[#164525] text-[11px] font-bold">
                      ✓ {cert}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-[#FAF8F2] rounded-xl flex items-center justify-between border border-[#c1c9be]/60">
                <div>
                  <div className="text-[11px] text-[#717970]">Statut de conformité</div>
                  <div className="font-bold text-[#2b1700] text-[14px]">{selectedProducer.statutValidation}</div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedProducer.statutValidation !== 'Validé' && (
                    <button
                      onClick={() => {
                        onValidateProducer(selectedProducer.id);
                        setSelectedProducer({ ...selectedProducer, statutValidation: 'Validé' });
                      }}
                      className="px-3.5 py-1.5 bg-[#164525] text-white rounded-xl text-[12px] font-bold hover:bg-[#2f5d3a] cursor-pointer"
                    >
                      Valider le producteur
                    </button>
                  )}
                  {selectedProducer.statutValidation !== 'Suspendu' && (
                    <button
                      onClick={() => {
                        onSuspendProducer(selectedProducer.id);
                        setSelectedProducer({ ...selectedProducer, statutValidation: 'Suspendu' });
                      }}
                      className="px-3 py-1.5 bg-[#FAF8F2] border border-[#c1c9be] text-[#717970] hover:text-[#b04a30] rounded-xl text-[12px] font-medium cursor-pointer"
                    >
                      Suspendre
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#c1c9be]/40 flex justify-end">
              <button
                onClick={() => setSelectedProducer(null)}
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
