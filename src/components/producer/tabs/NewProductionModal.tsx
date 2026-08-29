import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { CropProduction, Plot, ProductCategory, ProductionStatus } from '../../../types';

interface NewProductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  plots: Plot[];
  onAddProduction: (prod: CropProduction) => void;
}

export const NewProductionModal: React.FC<NewProductionModalProps> = ({
  isOpen,
  onClose,
  plots,
  onAddProduction,
}) => {
  const [produitNom, setProduitNom] = useState('Tomates fraîches des Niayes');
  const [produitCategorie, setProduitCategorie] = useState<ProductCategory>('Légumes');
  const [parcelleId, setParcelleId] = useState(plots[0]?.id || 'plot-1');
  const [quantitePrevue, setQuantitePrevue] = useState<number>(500);
  const [unite, setUnite] = useState('kg');
  const [dateDebut, setDateDebut] = useState('');
  const [dateEstimeeRecolte, setDateEstimeeRecolte] = useState('');
  const [coutEstime, setCoutEstime] = useState<number>(85000);
  const [intrantsText, setIntrantsText] = useState('Compost végétal biologique, Purin de neem, Bio-fertilisant');
  const [statut, setStatut] = useState<ProductionStatus>('Planifiée');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!produitNom.trim()) {
      setError('Veuillez spécifier le nom du produit.');
      return;
    }
    if (quantitePrevue <= 0) {
      setError('La quantité prévue doit être positive.');
      return;
    }

    const selectedPlot = plots.find((p) => p.id === parcelleId);
    const intrantsArray = intrantsText
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    const newProd: CropProduction = {
      id: `prod-${Date.now()}`,
      produitNom: produitNom.trim(),
      produitCategorie,
      parcelleId,
      parcelleNom: selectedPlot ? selectedPlot.nom : 'Parcelle principale',
      quantitePrevue,
      quantiteRecoltee: 0,
      quantiteReservee: 0,
      unite,
      dateDebut: dateDebut || "Aujourd'hui",
      dateEstimeeRecolte: dateEstimeeRecolte || 'Dans 2 mois',
      coutEstime,
      intrants: intrantsArray.length > 0 ? intrantsArray : ['Fertilisant organique local'],
      statut,
      notes: notes.trim() || undefined,
      isPreorderPublished: false,
    };

    onAddProduction(newProd);
    onClose();
    setError('');
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-[#c1c9be] shadow-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#c1c9be]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#164525]/10 text-[#164525] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">potted_plant</span>
            </div>
            <div>
              <h2 className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700]">
                Enregistrer une Nouvelle Production
              </h2>
              <p className="text-[12px] text-[#717970]">
                Planifiez un cycle de culture pour vendre en précommande avant récolte
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                Produit / Variété *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Tomates Roma, Oignons..."
                value={produitNom}
                onChange={(e) => setProduitNom(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                Catégorie *
              </label>
              <select
                value={produitCategorie}
                onChange={(e) =>
                  setProduitCategorie(e.target.value as ProductCategory)
                }
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none cursor-pointer"
              >
                <option value="Légumes">Légumes maraîchers</option>
                <option value="Fruits">Fruits & Vergers</option>
                <option value="Céréales">Céréales & Légumineuses</option>
                <option value="Transformés">Produits Transformés / Séchés</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
              Parcelle attribuée *
            </label>
            <select
              value={parcelleId}
              onChange={(e) => setParcelleId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none cursor-pointer"
            >
              {plots.map((plot) => (
                <option key={plot.id} value={plot.id}>
                  {plot.nom} ({plot.superficie} {plot.unite} - {plot.culture})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                Quantité prévue *
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantitePrevue}
                onChange={(e) =>
                  setQuantitePrevue(parseInt(e.target.value) || 0)
                }
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                Unité de récolte
              </label>
              <select
                value={unite}
                onChange={(e) => setUnite(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              >
                <option value="kg">Kilogrammes (kg)</option>
                <option value="tonnes">Tonnes</option>
                <option value="Sac (50kg)">Sacs de 50 kg</option>
                <option value="Carton (5kg)">Cartons de 5 kg</option>
                <option value="Bouteille (1L)">Bouteilles (1L)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                Date de début du cycle
              </label>
              <input
                type="text"
                placeholder="Ex: 01 Septembre 2026"
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
                placeholder="Ex: 25 Novembre 2026"
                value={dateEstimeeRecolte}
                onChange={(e) => setDateEstimeeRecolte(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                Coût de revient estimé (FCFA)
              </label>
              <input
                type="number"
                min="0"
                value={coutEstime}
                onChange={(e) =>
                  setCoutEstime(parseInt(e.target.value) || 0)
                }
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                Statut initial
              </label>
              <select
                value={statut}
                onChange={(e) =>
                  setStatut(e.target.value as ProductionStatus)
                }
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              >
                <option value="Planifiée">Planifiée</option>
                <option value="En cours">En cours de culture</option>
                <option value="Récolte prévue">Récolte prévue</option>
                <option value="Récoltée">Récoltée</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
              Intrants & fertilisants (séparés par virgule)
            </label>
            <input
              type="text"
              value={intrantsText}
              onChange={(e) => setIntrantsText(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
              Notes de suivi & objectifs
            </label>
            <textarea
              rows={2}
              placeholder="Précisions sur le débouché ciblé, conditionnement spécifique..."
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
              <span className="material-symbols-outlined text-[18px]">add_task</span>
              Enregistrer la production
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
