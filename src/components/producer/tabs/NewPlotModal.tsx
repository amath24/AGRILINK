import React, { useState } from 'react';
import { Plot, PlotStatus } from '../../../types';

interface NewPlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlot: (plot: Plot) => void;
}

export const NewPlotModal: React.FC<NewPlotModalProps> = ({
  isOpen,
  onClose,
  onAddPlot,
}) => {
  const [nom, setNom] = useState('');
  const [superficie, setSuperficie] = useState<number>(0.5);
  const [unite, setUnite] = useState<'ha' | 'm²'>('ha');
  const [culture, setCulture] = useState('Tomates');
  const [variete, setVariete] = useState('');
  const [localisation, setLocalisation] = useState('Zone Nord');
  const [dateDebut, setDateDebut] = useState('');
  const [dateEstimeeRecolte, setDateEstimeeRecolte] = useState('');
  const [statut, setStatut] = useState<PlotStatus>('En production');
  const [rendementEstime, setRendementEstime] = useState<number>(500);
  const [uniteRendement, setUniteRendement] = useState('kg');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) {
      setError('Veuillez renseigner le nom de la parcelle.');
      return;
    }
    if (superficie <= 0) {
      setError('La superficie doit être supérieure à 0.');
      return;
    }

    const newPlot: Plot = {
      id: `plot-${Date.now()}`,
      nom: nom.trim(),
      superficie,
      unite,
      culture,
      variete: variete.trim() || undefined,
      localisation: localisation.trim() || 'Zone principale',
      dateDebut: dateDebut || "Aujourd'hui",
      dateEstimeeRecolte: dateEstimeeRecolte || 'Dans 3 mois',
      statut,
      rendementEstime,
      uniteRendement,
      notes: notes.trim() || undefined,
    };

    onAddPlot(newPlot);
    onClose();
    // Reset form
    setNom('');
    setSuperficie(0.5);
    setNotes('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-[#c1c9be] shadow-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#c1c9be]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#164525]/10 text-[#164525] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">grid_view</span>
            </div>
            <div>
              <h2 className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700]">
                Ajouter une Nouvelle Parcelle
              </h2>
              <p className="text-[12px] text-[#717970]">
                Enregistrez une zone de culture pour votre exploitation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#717970] hover:text-[#2b1700] p-1.5 rounded-full hover:bg-[#FAF8F2] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
          <div>
            <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
              Nom de la parcelle *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Parcelle P6 - Extension Ouest"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                Superficie *
              </label>
              <input
                type="number"
                step="0.05"
                min="0.01"
                required
                value={superficie}
                onChange={(e) => setSuperficie(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                Unité
              </label>
              <select
                value={unite}
                onChange={(e) => setUnite(e.target.value as 'ha' | 'm²')}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              >
                <option value="ha">Hectares (ha)</option>
                <option value="m²">Mètres carrés (m²)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                Culture principale *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Tomates, Oignons, Carottes..."
                value={culture}
                onChange={(e) => setCulture(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                Variété (optionnel)
              </label>
              <input
                type="text"
                placeholder="Ex: Mongal F1, Violet de Galmi..."
                value={variete}
                onChange={(e) => setVariete(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                Localisation dans le domaine
              </label>
              <input
                type="text"
                placeholder="Ex: Zone Nord - Puits 3"
                value={localisation}
                onChange={(e) => setLocalisation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                Statut actuel
              </label>
              <select
                value={statut}
                onChange={(e) => setStatut(e.target.value as PlotStatus)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              >
                <option value="Préparation">Préparation du sol</option>
                <option value="En production">En production (Semis / Croissance)</option>
                <option value="Récolte prévue">Récolte prévue imminente</option>
                <option value="Récoltée">Récoltée</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                Date de début
              </label>
              <input
                type="text"
                placeholder="Ex: 15 Septembre 2026"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                Date estimée de récolte
              </label>
              <input
                type="text"
                placeholder="Ex: 30 Novembre 2026"
                value={dateEstimeeRecolte}
                onChange={(e) => setDateEstimeeRecolte(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                Rendement estimé
              </label>
              <input
                type="number"
                min="1"
                value={rendementEstime}
                onChange={(e) =>
                  setRendementEstime(parseInt(e.target.value) || 0)
                }
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                Unité rendement
              </label>
              <input
                type="text"
                value={uniteRendement}
                onChange={(e) => setUniteRendement(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
              Notes & Remarques agronomiques
            </label>
            <textarea
              rows={2}
              placeholder="Type de sol, plan d'irrigation, enrichissement en compost..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#c1c9be]/50 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-[#c1c9be] text-[#717970] font-semibold text-[13px] hover:bg-[#FAF8F2] cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#164525] text-white font-bold text-[13px] hover:bg-[#2f5d3a] transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Enregistrer la parcelle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
