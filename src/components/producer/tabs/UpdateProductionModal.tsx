import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CropProduction, Plot, ProductionStatus } from '../../../types';

interface UpdateProductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  production: CropProduction | null;
  plots: Plot[];
  onUpdateProduction: (updatedProd: CropProduction) => void;
  onPublishPreorder?: (production: CropProduction) => void;
}

export const UpdateProductionModal: React.FC<UpdateProductionModalProps> = ({
  isOpen,
  onClose,
  production,
  plots,
  onUpdateProduction,
  onPublishPreorder,
}) => {
  const [statut, setStatut] = useState<ProductionStatus>('En cours');
  const [quantitePrevue, setQuantitePrevue] = useState<number>(0);
  const [quantiteRecoltee, setQuantiteRecoltee] = useState<number>(0);
  const [parcelleId, setParcelleId] = useState<string>('');
  const [dateDebut, setDateDebut] = useState<string>('');
  const [dateEstimeeRecolte, setDateEstimeeRecolte] = useState<string>('');
  const [coutEstime, setCoutEstime] = useState<number>(0);
  const [intrantsText, setIntrantsText] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (production) {
      setStatut(production.statut);
      setQuantitePrevue(production.quantitePrevue || 0);
      setQuantiteRecoltee(production.quantiteRecoltee || 0);
      setParcelleId(production.parcelleId || '');
      setDateDebut(production.dateDebut || '');
      setDateEstimeeRecolte(production.dateEstimeeRecolte || '');
      setCoutEstime(production.coutEstime || 0);
      setIntrantsText((production.intrants || []).join(', '));
      setNotes(production.notes || '');
      setError('');
    }
  }, [production, isOpen]);

  // Lock background scroll and listen for Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !production) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantitePrevue <= 0) {
      setError('La quantité prévue doit être supérieure à 0.');
      return;
    }
    if (quantiteRecoltee < 0) {
      setError('La quantité récoltée ne peut pas être négative.');
      return;
    }

    const selectedPlot = plots.find((p) => p.id === parcelleId);
    const intrantsArray = intrantsText
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    const updated: CropProduction = {
      ...production,
      statut,
      parcelleId: parcelleId || production.parcelleId,
      parcelleNom: selectedPlot ? selectedPlot.nom : production.parcelleNom,
      quantitePrevue,
      quantiteRecoltee,
      dateDebut: dateDebut || production.dateDebut,
      dateEstimeeRecolte: dateEstimeeRecolte || production.dateEstimeeRecolte,
      coutEstime,
      intrants: intrantsArray.length > 0 ? intrantsArray : production.intrants,
      notes: notes.trim() || undefined,
    };

    onUpdateProduction(updated);
    onClose();
  };

  const modalContent = (
    <div
      id="update-production-modal-backdrop"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="update-production-title"
    >
      <div
        id="update-production-modal-card"
        className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto my-auto border border-[#c1c9be] shadow-2xl p-5 sm:p-8 animate-in fade-in zoom-in-95 duration-150 relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#c1c9be]/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#164525]/10 text-[#164525] flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px]">edit_note</span>
            </div>
            <div>
              <h2
                id="update-production-title"
                className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700]"
              >
                Mettre à jour le cycle de production
              </h2>
              <p className="text-[12px] text-[#717970]">
                {production.produitNom} • {production.parcelleNom}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#717970] hover:text-[#2b1700] p-1.5 rounded-full hover:bg-[#FAF8F2] transition-colors cursor-pointer"
            aria-label="Fermer"
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-5">
          {/* Status selection */}
          <div>
            <label className="block text-[13px] font-semibold text-[#2b1700] mb-1.5">
              Statut du cycle cultural *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(
                [
                  'Planifiée',
                  'En cours',
                  'Récolte prévue',
                  'Récoltée',
                  'Terminée',
                ] as ProductionStatus[]
              ).map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setStatut(s)}
                  className={`py-2 px-2.5 rounded-xl text-[12px] font-semibold border transition-all cursor-pointer text-center ${
                    statut === s
                      ? 'bg-[#164525] text-white border-[#164525] shadow-xs'
                      : 'bg-[#FAF8F2] text-[#414941] border-[#c1c9be]/60 hover:border-[#164525]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                Quantité prévue ({production.unite}) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantitePrevue}
                onChange={(e) => setQuantitePrevue(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                Quantité récoltée réelle ({production.unite})
              </label>
              <input
                type="number"
                min="0"
                value={quantiteRecoltee}
                onChange={(e) => setQuantiteRecoltee(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>
          </div>

          {/* Parcelle & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                Parcelle
              </label>
              <select
                value={parcelleId}
                onChange={(e) => setParcelleId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none cursor-pointer"
              >
                {plots.map((plot) => (
                  <option key={plot.id} value={plot.id}>
                    {plot.nom} ({plot.superficie} {plot.unite})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                Date estimée / réelle de récolte
              </label>
              <input
                type="text"
                value={dateEstimeeRecolte}
                placeholder="Ex: 15 Octobre 2026"
                onChange={(e) => setDateEstimeeRecolte(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>
          </div>

          {/* Intrants & Coûts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                Intrants / Traitements bio
              </label>
              <input
                type="text"
                placeholder="Compost, purin de neem..."
                value={intrantsText}
                onChange={(e) => setIntrantsText(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                Coût de production estimé (FCFA)
              </label>
              <input
                type="number"
                min="0"
                value={coutEstime}
                onChange={(e) => setCoutEstime(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
              Observations agronomiques / Notes
            </label>
            <textarea
              rows={2}
              placeholder="État sanitaire, floraison, irrigation, météo..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none resize-none"
            />
          </div>

          {/* Summary / Preorder Status */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-[12px]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#164525] text-[20px]">
                receipt_long
              </span>
              <div>
                <span className="font-bold text-[#164525]">Précommande Marketplace : </span>
                <span className="text-[#2b1700]">
                  {production.isPreorderPublished
                    ? `Active (${production.quantiteReservee} ${production.unite} réservés)`
                    : 'Non publiée'}
                </span>
              </div>
            </div>

            {!production.isPreorderPublished && onPublishPreorder && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onPublishPreorder(production);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#164525] text-white font-bold text-[11px] hover:bg-[#2f5d3a] transition-all cursor-pointer"
              >
                Vendre en précommande
              </button>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#c1c9be]/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full border border-[#c1c9be] text-[#414941] text-[13px] font-semibold hover:bg-[#FAF8F2] transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#164525] text-white text-[13px] font-bold hover:bg-[#2f5d3a] transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};
