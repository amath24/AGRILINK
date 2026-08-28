import React, { useState } from 'react';
import { Plot, PlotStatus } from '../../../types';

interface PlotsTabProps {
  plots: Plot[];
  onOpenNewPlot: () => void;
  onUpdatePlotStatus: (plotId: string, status: PlotStatus) => void;
}

export const PlotsTab: React.FC<PlotsTabProps> = ({
  plots = [],
  onOpenNewPlot,
  onUpdatePlotStatus,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const safePlots = plots || [];

  const filteredPlots = safePlots.filter((p) => {
    if (selectedFilter === 'all') return true;
    return p.statut === selectedFilter;
  });

  const getStatusBadge = (statut: PlotStatus) => {
    switch (statut) {
      case 'Préparation':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'En production':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Récolte prévue':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Récoltée':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const totalHa = safePlots
    .filter((p) => p.unite === 'ha')
    .reduce((acc, p) => acc + (p.superficie || 0), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Title & Action */}
      <div className="bg-white border border-[#c1c9be] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#164525] text-[28px]">
              grid_view
            </span>
            <h1 className="font-['Montserrat'] text-[22px] font-bold text-[#2b1700]">
              Gestion des Parcelles
            </h1>
          </div>
          <p className="text-[13px] text-[#717970] mt-1">
            Suivi agronomique de vos zones de culture, superficies ({totalHa.toFixed(1)} ha au total) et dates de récolte estimées.
          </p>
        </div>

        <button
          onClick={onOpenNewPlot}
          className="bg-[#164525] text-white text-[13px] font-semibold px-4 py-2.5 rounded-full hover:bg-[#2f5d3a] transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          Ajouter une parcelle
        </button>
      </div>

      {/* Filter Tabs & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#c1c9be] p-3 rounded-2xl">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'Toutes les parcelles', count: plots.length },
            {
              id: 'En production',
              label: 'En production',
              count: plots.filter((p) => p.statut === 'En production').length,
            },
            {
              id: 'Récolte prévue',
              label: 'Récolte prévue',
              count: plots.filter((p) => p.statut === 'Récolte prévue').length,
            },
            {
              id: 'Préparation',
              label: 'Préparation',
              count: plots.filter((p) => p.statut === 'Préparation').length,
            },
            {
              id: 'Récoltée',
              label: 'Récoltée',
              count: plots.filter((p) => p.statut === 'Récoltée').length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedFilter === tab.id
                  ? 'bg-[#164525] text-white shadow-xs'
                  : 'bg-[#FAF8F2] text-[#414941] hover:bg-[#eae4d5]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedFilter === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-[#c1c9be]/50 text-[#414941]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 self-end sm:self-auto border border-[#c1c9be] p-1 rounded-xl bg-[#FAF8F2]">
          <button
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white text-[#164525] shadow-xs'
                : 'text-[#717970] hover:text-[#2b1700]'
            }`}
            title="Vue Cartes"
          >
            <span className="material-symbols-outlined text-[18px]">grid_view</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-[#164525] shadow-xs'
                : 'text-[#717970] hover:text-[#2b1700]'
            }`}
            title="Vue Tableau"
          >
            <span className="material-symbols-outlined text-[18px]">table_rows</span>
          </button>
        </div>
      </div>

      {/* Plots Display: Cards or Table */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlots.map((plot) => (
            <div
              key={plot.id}
              className="bg-white border border-[#c1c9be] rounded-2xl p-5 shadow-sm hover:border-[#164525] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#164525]"></span>
                    <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#2b1700]">
                      {plot.nom}
                    </h3>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadge(
                      plot.statut
                    )}`}
                  >
                    {plot.statut}
                  </span>
                </div>

                <div className="bg-[#FAF8F2] p-3 rounded-xl border border-[#c1c9be]/50 mb-4 text-[13px] flex flex-col gap-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#717970]">Culture :</span>
                    <strong className="text-[#2b1700]">
                      {plot.culture} {plot.variete ? `(${plot.variete})` : ''}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#717970]">Superficie :</span>
                    <span className="font-semibold text-[#164525]">
                      {plot.superficie} {plot.unite}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#717970]">Localisation :</span>
                    <span className="text-[#414941]">{plot.localisation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#717970]">Rendement estimé :</span>
                    <span className="font-semibold text-[#7d4600]">
                      {plot.rendementEstime} {plot.uniteRendement}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[12px] text-[#717970] mb-3">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-[#717970]">
                      Semis / Début
                    </span>
                    <span>{plot.dateDebut}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] uppercase font-bold text-[#717970]">
                      Récolte prévue
                    </span>
                    <span className="font-semibold text-[#164525]">
                      {plot.dateEstimeeRecolte}
                    </span>
                  </div>
                </div>

                {plot.notes && (
                  <p className="text-[12px] text-[#414941] italic bg-white p-2 rounded-lg border border-[#c1c9be]/40 mb-3">
                    « {plot.notes} »
                  </p>
                )}
              </div>

              {/* Status Update Dropdown */}
              <div className="pt-3 border-t border-[#c1c9be]/40 flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-[#717970]">
                  Changer statut :
                </span>
                <select
                  value={plot.statut}
                  onChange={(e) =>
                    onUpdatePlotStatus(plot.id, e.target.value as PlotStatus)
                  }
                  className="text-[12px] font-semibold bg-[#FAF8F2] border border-[#c1c9be] rounded-lg px-2 py-1 text-[#2b1700] focus:outline-none focus:border-[#164525] cursor-pointer"
                >
                  <option value="Préparation">Préparation</option>
                  <option value="En production">En production</option>
                  <option value="Récolte prévue">Récolte prévue</option>
                  <option value="Récoltée">Récoltée</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white border border-[#c1c9be] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="bg-[#FAF8F2] border-b border-[#c1c9be] text-[#717970] font-semibold text-[12px] uppercase">
                  <th className="py-3 px-4">Nom de la parcelle</th>
                  <th className="py-3 px-4">Superficie</th>
                  <th className="py-3 px-4">Culture</th>
                  <th className="py-3 px-4">Date de début</th>
                  <th className="py-3 px-4">Récolte estimée</th>
                  <th className="py-3 px-4">Rendement</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c1c9be]/40">
                {filteredPlots.map((plot) => (
                  <tr key={plot.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#2b1700]">
                      {plot.nom}
                      <span className="block text-[11px] font-normal text-[#717970]">
                        {plot.localisation}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#164525] font-semibold">
                      {plot.superficie} {plot.unite}
                    </td>
                    <td className="py-3.5 px-4">
                      <strong className="text-[#2b1700]">{plot.culture}</strong>
                      {plot.variete && (
                        <span className="text-[11px] text-[#717970] block">
                          {plot.variete}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#717970]">{plot.dateDebut}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#164525]">
                      {plot.dateEstimeeRecolte}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#7d4600]">
                      {plot.rendementEstime} {plot.uniteRendement}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadge(
                          plot.statut
                        )}`}
                      >
                        {plot.statut}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={plot.statut}
                        onChange={(e) =>
                          onUpdatePlotStatus(plot.id, e.target.value as PlotStatus)
                        }
                        className="text-[11px] font-semibold bg-[#FAF8F2] border border-[#c1c9be] rounded-lg px-2 py-1 text-[#2b1700] focus:outline-none focus:border-[#164525] cursor-pointer"
                      >
                        <option value="Préparation">Préparation</option>
                        <option value="En production">En production</option>
                        <option value="Récolte prévue">Récolte prévue</option>
                        <option value="Récoltée">Récoltée</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
