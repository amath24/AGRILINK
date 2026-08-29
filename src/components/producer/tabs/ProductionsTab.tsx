import React, { useState } from 'react';
import { CropProduction, ProductionStatus } from '../../../types';

interface ProductionsTabProps {
  productions: CropProduction[];
  onOpenNewProduction: () => void;
  onOpenUpdateProduction?: (prod: CropProduction) => void;
  onUpdateProductionStatus: (prodId: string, status: ProductionStatus) => void;
  onPublishPreorderFromProduction: (prod: CropProduction) => void;
}

export const ProductionsTab: React.FC<ProductionsTabProps> = ({
  productions,
  onOpenNewProduction,
  onOpenUpdateProduction,
  onUpdateProductionStatus,
  onPublishPreorderFromProduction,
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  const filteredProductions = productions.filter((p) => {
    if (selectedStatusFilter === 'all') return true;
    return p.statut === selectedStatusFilter;
  });

  const getStatusBadge = (statut: ProductionStatus) => {
    switch (statut) {
      case 'Planifiée':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'En cours':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Récolte prévue':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Récoltée':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Terminée':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Title & Action */}
      <div className="bg-white border border-[#c1c9be] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#164525] text-[28px]">
              potted_plant
            </span>
            <h1 className="font-['Montserrat'] text-[22px] font-bold text-[#2b1700]">
              Gestion des Cycles de Production
            </h1>
          </div>
          <p className="text-[13px] text-[#717970] mt-1">
            Pilotez vos cultures en temps réel et transformez chaque récolte future en offre de précommande sécurisée.
          </p>
        </div>

        <button
          onClick={onOpenNewProduction}
          className="bg-[#164525] text-white text-[13px] font-semibold px-4 py-2.5 rounded-full hover:bg-[#2f5d3a] transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          Nouvelle production
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 bg-white border border-[#c1c9be] p-3 rounded-2xl">
        {[
          { id: 'all', label: 'Toutes les productions', count: productions.length },
          {
            id: 'En cours',
            label: 'En cours',
            count: productions.filter((p) => p.statut === 'En cours').length,
          },
          {
            id: 'Récolte prévue',
            label: 'Récolte prévue',
            count: productions.filter((p) => p.statut === 'Récolte prévue').length,
          },
          {
            id: 'Planifiée',
            label: 'Planifiée',
            count: productions.filter((p) => p.statut === 'Planifiée').length,
          },
          {
            id: 'Récoltée',
            label: 'Récoltée',
            count: productions.filter((p) => p.statut === 'Récoltée').length,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedStatusFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedStatusFilter === tab.id
                ? 'bg-[#164525] text-white shadow-xs'
                : 'bg-[#FAF8F2] text-[#414941] hover:bg-[#eae4d5]'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedStatusFilter === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-[#c1c9be]/50 text-[#414941]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Productions Table */}
      <div className="bg-white border border-[#c1c9be] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#FAF8F2] border-b border-[#c1c9be] text-[#717970] font-semibold text-[12px] uppercase">
                <th className="py-3.5 px-4">Produit & Catégorie</th>
                <th className="py-3.5 px-4">Parcelle</th>
                <th className="py-3.5 px-4">Quantité prévue / Récoltée</th>
                <th className="py-3.5 px-4">Réservé (Précommandes)</th>
                <th className="py-3.5 px-4">Période du cycle</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c1c9be]/40">
              {filteredProductions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#717970]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[36px] text-[#c1c9be]">potted_plant</span>
                      <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#2b1700]">Aucune production en cours</h3>
                      <p className="text-[13px] text-[#717970] max-w-sm">Lancez une nouvelle campagne de production liée à vos parcelles pour proposer vos récoltes aux acheteurs.</p>
                      <button
                        onClick={onOpenNewProduction}
                        className="mt-2 bg-[#164525] text-white text-[12px] font-semibold px-4 py-2 rounded-full hover:bg-[#2f5d3a] transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">add_circle</span>
                        Planifier une production
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProductions.map((prod) => {
                const reservationRate = Math.min(
                  100,
                  Math.round((prod.quantiteReservee / prod.quantitePrevue) * 100)
                );

                return (
                  <tr key={prod.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                    {/* Produit */}
                    <td className="py-4 px-4 font-semibold text-[#2b1700]">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#164525]"></span>
                        <span>{prod.produitNom}</span>
                      </div>
                      <span className="text-[11px] font-normal text-[#717970] block ml-4.5">
                        Catégorie : {prod.produitCategorie}
                      </span>
                    </td>

                    {/* Parcelle */}
                    <td className="py-4 px-4 text-[#414941]">
                      <span className="font-medium text-[#2b1700]">{prod.parcelleNom}</span>
                    </td>

                    {/* Quantité Prévue / Récoltée */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-[#164525]">
                        {prod.quantitePrevue} {prod.unite}
                      </div>
                      <span className="text-[11px] text-[#717970]">
                        Récolté : {prod.quantiteRecoltee} {prod.unite}
                      </span>
                    </td>

                    {/* Réservé Précommandes */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#7d4600]">
                          {prod.quantiteReservee} {prod.unite}
                        </span>
                        <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-[#ffead7] text-[#7d4600] font-semibold">
                          {reservationRate}%
                        </span>
                      </div>
                      <div className="w-28 bg-[#e3ded4] h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          style={{ width: `${reservationRate}%` }}
                          className="bg-[#164525] h-full rounded-full"
                        ></div>
                      </div>
                    </td>

                    {/* Période */}
                    <td className="py-4 px-4 text-[12px]">
                      <span className="text-[#717970] block">
                        Semis : {prod.dateDebut}
                      </span>
                      <span className="font-semibold text-[#164525] block">
                        Récolte : {prod.dateEstimeeRecolte}
                      </span>
                    </td>

                    {/* Statut */}
                    <td className="py-4 px-4">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadge(
                          prod.statut
                        )}`}
                      >
                        {prod.statut}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!prod.isPreorderPublished ? (
                          <button
                            onClick={() => onPublishPreorderFromProduction(prod)}
                            className="bg-[#164525] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-[#2f5d3a] transition-all flex items-center gap-1 cursor-pointer"
                            title="Publier en précommande sur la marketplace"
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              publish
                            </span>
                            Vendre en précommande
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#164525] bg-[#164525]/10 px-2.5 py-1 rounded-lg">
                            <span className="material-symbols-outlined text-[14px]">
                              check_circle
                            </span>
                            Précommande active
                          </span>
                        )}

                        {onOpenUpdateProduction && (
                          <button
                            type="button"
                            onClick={() => onOpenUpdateProduction(prod)}
                            className="p-1.5 rounded-lg border border-[#c1c9be] text-[#2b1700] hover:bg-[#FAF8F2] hover:border-[#164525] transition-colors cursor-pointer"
                            title="Modifier / Enregistrer la récolte"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              edit
                            </span>
                          </button>
                        )}

                        <select
                          value={prod.statut}
                          onChange={(e) =>
                            onUpdateProductionStatus(
                              prod.id,
                              e.target.value as ProductionStatus
                            )
                          }
                          className="text-[11px] font-semibold bg-[#FAF8F2] border border-[#c1c9be] rounded-lg px-2 py-1 text-[#2b1700] focus:outline-none focus:border-[#164525] cursor-pointer"
                        >
                          <option value="Planifiée">Planifiée</option>
                          <option value="En cours">En cours</option>
                          <option value="Récolte prévue">Récolte prévue</option>
                          <option value="Récoltée">Récoltée</option>
                          <option value="Terminée">Terminée</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
