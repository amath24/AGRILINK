import React, { useState } from 'react';
import { AdminIncident, IncidentStatus } from '../../../types';

interface AdminReportsTabProps {
  incidents: AdminIncident[];
  onUpdateIncidentStatus?: (incidentId: string, status: IncidentStatus) => void;
}

export const AdminReportsTab: React.FC<AdminReportsTabProps> = ({
  incidents = [],
  onUpdateIncidentStatus,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | IncidentStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<AdminIncident | null>(null);

  const safeIncidents = incidents || [];

  const filteredIncidents = safeIncidents.filter((inc) => {
    if (statusFilter !== 'all' && inc.statut !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNum = inc.numeroCommande.toLowerCase().includes(q);
      const matchPlaint = inc.plaignant.toLowerCase().includes(q);
      const matchCible = inc.cible.toLowerCase().includes(q);
      const matchMotif = inc.motif.toLowerCase().includes(q);
      return matchNum || matchPlaint || matchCible || matchMotif;
    }
    return true;
  });

  const countOuverts = safeIncidents.filter((i) => i.statut === 'Ouvert').length;
  const countEnCours = safeIncidents.filter((i) => i.statut === 'En cours').length;
  const countResolus = safeIncidents.filter((i) => i.statut === 'Résolu').length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Statistiques Litiges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Montserrat'] text-[24px] font-bold text-[#2b1700]">
            Signalements & Gestion des Litiges
          </h1>
          <p className="text-[14px] text-[#717970]">
            Médiation des différends qualité, retards de livraison et arbitrage séquestre
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#e76f51]/10 px-3.5 py-1.5 rounded-xl border border-[#e76f51]/30 text-[13px]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e76f51]"></span>
            <span className="font-bold text-[#e76f51]">{countOuverts}</span>
            <span className="text-[#e76f51] font-medium">Ouverts</span>
          </div>
          <div className="flex items-center gap-2 bg-[#3d5a80]/10 px-3.5 py-1.5 rounded-xl border border-[#3d5a80]/30 text-[13px]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3d5a80]"></span>
            <span className="font-bold text-[#3d5a80]">{countEnCours}</span>
            <span className="text-[#3d5a80]">En cours</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-[#c1c9be]/60 text-[13px]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#164525]"></span>
            <span className="font-bold text-[#2b1700]">{countResolus}</span>
            <span className="text-[#717970]">Résolus</span>
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
            placeholder="N° Commande, plaignant, motif..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3.5 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none cursor-pointer"
          >
            <option value="all">Tous les litiges ({safeIncidents.length})</option>
            <option value="Ouvert">Ouverts ({countOuverts})</option>
            <option value="En cours">En cours d'examen ({countEnCours})</option>
            <option value="Résolu">Résolus ({countResolus})</option>
            <option value="Rejeté">Rejetés</option>
          </select>
        </div>
      </div>

      {/* Tableau des Signalements */}
      <div className="bg-white border border-[#c1c9be]/60 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F2] border-b border-[#c1c9be]/60 text-[12px] font-bold text-[#717970] uppercase tracking-wider">
                <th className="py-3.5 px-4">Priorité</th>
                <th className="py-3.5 px-4">Commande</th>
                <th className="py-3.5 px-4">Plaignant</th>
                <th className="py-3.5 px-4">Partie adverse</th>
                <th className="py-3.5 px-4">Motif du litige</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c1c9be]/30 text-[13px]">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#717970]">
                    <span className="material-symbols-outlined text-[36px] mb-2 text-[#717970]/60">task_alt</span>
                    <p>Aucun incident ou litige à signaler.</p>
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                        inc.priorite === 'Urgente' ? 'bg-red-100 text-red-700' :
                        inc.priorite === 'Haute' ? 'bg-[#e76f51]/15 text-[#e76f51]' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {inc.priorite}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#164525]">
                      #{inc.numeroCommande}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#2b1700]">
                      {inc.plaignant}
                    </td>
                    <td className="py-3.5 px-4 text-[#414941]">
                      {inc.cible}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#2b1700] truncate max-w-[200px]">{inc.motif}</div>
                      <div className="text-[11px] text-[#717970] truncate max-w-[200px]">{inc.description}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#717970] text-[12px]">
                      {inc.dateCreation}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        inc.statut === 'Résolu' ? 'bg-[#164525]/10 text-[#164525]' :
                        inc.statut === 'En cours' ? 'bg-[#3d5a80]/15 text-[#3d5a80]' :
                        inc.statut === 'Ouvert' ? 'bg-[#e76f51]/15 text-[#e76f51]' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {inc.statut}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedIncident(inc)}
                          className="px-2.5 py-1 bg-[#FAF8F2] border border-[#c1c9be] text-[#2b1700] hover:bg-[#eae4d5] rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Examiner
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

      {/* Modal Médiation / Examen de litige */}
      {selectedIncident && (
        <div className="modal-backdrop">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#c1c9be] shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#c1c9be]/40">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#e76f51] text-[24px]">gavel</span>
                <div>
                  <h3 className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700]">
                    Litige #{selectedIncident.numeroCommande}
                  </h3>
                  <span className="text-[12px] text-[#717970]">Ouvert le {selectedIncident.dateCreation}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="p-1.5 rounded-lg text-[#717970] hover:bg-[#FAF8F2] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3 text-[13px]">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FAF8F2] rounded-xl">
                  <div className="text-[11px] text-[#717970]">Plaignant</div>
                  <div className="font-bold text-[#2b1700]">{selectedIncident.plaignant}</div>
                </div>
                <div className="p-3 bg-[#FAF8F2] rounded-xl">
                  <div className="text-[11px] text-[#717970]">Partie concernée</div>
                  <div className="font-bold text-[#2b1700]">{selectedIncident.cible}</div>
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F2] rounded-xl">
                <div className="text-[11px] text-[#717970] font-semibold">Motif du signalement</div>
                <div className="font-bold text-[#2b1700] text-[14px]">{selectedIncident.motif}</div>
                <p className="text-[#414941] mt-1 leading-relaxed">{selectedIncident.description}</p>
              </div>

              <div className="p-3.5 bg-[#FAF8F2] rounded-xl border border-[#c1c9be]/60 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#717970]">Statut arbitrage</div>
                  <div className="font-bold text-[#2b1700]">{selectedIncident.statut}</div>
                </div>

                <div className="flex gap-2">
                  {selectedIncident.statut !== 'Résolu' && onUpdateIncidentStatus && (
                    <button
                      onClick={() => {
                        onUpdateIncidentStatus(selectedIncident.id, 'Résolu');
                        setSelectedIncident({ ...selectedIncident, statut: 'Résolu' });
                      }}
                      className="px-3 py-1.5 bg-[#164525] text-white rounded-xl text-[12px] font-bold hover:bg-[#2f5d3a] cursor-pointer"
                    >
                      Clôturer comme Résolu
                    </button>
                  )}
                  {selectedIncident.statut === 'Ouvert' && onUpdateIncidentStatus && (
                    <button
                      onClick={() => {
                        onUpdateIncidentStatus(selectedIncident.id, 'En cours');
                        setSelectedIncident({ ...selectedIncident, statut: 'En cours' });
                      }}
                      className="px-3 py-1.5 bg-[#3d5a80] text-white rounded-xl text-[12px] font-bold hover:bg-[#2c4260] cursor-pointer"
                    >
                      Prendre en charge
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#c1c9be]/40 flex justify-end">
              <button
                onClick={() => setSelectedIncident(null)}
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
