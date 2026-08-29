import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { StockItem, StockMovement, StockMovementType } from '../../../types';

interface StockMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockItems: StockItem[];
  onAddMovement: (movement: StockMovement, stockItemId: string) => void;
}

export const StockMovementModal: React.FC<StockMovementModalProps> = ({
  isOpen,
  onClose,
  stockItems,
  onAddMovement,
}) => {
  const [stockItemId, setStockItemId] = useState<string>(stockItems[0]?.id || '');
  const [type, setType] = useState<StockMovementType>('Entrée');
  const [quantite, setQuantite] = useState<number>(50);
  const [motif, setMotif] = useState('Récolte journalière Parcelle P1');
  const [date, setDate] = useState("Aujourd'hui, 08:30");
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const currentItem = stockItems.find((s) => s.id === stockItemId) || stockItems[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem) {
      setError('Veuillez sélectionner un article en stock.');
      return;
    }
    if (quantite <= 0) {
      setError('La quantité doit être supérieure à 0.');
      return;
    }

    const newMovement: StockMovement = {
      id: `mov-${Date.now()}`,
      stockItemId: currentItem.id,
      produitNom: currentItem.produitNom,
      typeMouvement: type,
      quantite,
      unite: currentItem.unite,
      motif: motif.trim() || 'Ajustement de stock manuel',
      date: date || "À l'instant",
      auteur: 'Babacar Sarr',
    };

    onAddMovement(newMovement, currentItem.id);
    onClose();
  };

  return ReactDOM.createPortal(
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div style={{ display: 'flex', width: '100%', minHeight: '100%', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div
          className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 sm:p-8 text-left shadow-2xl border border-[#c1c9be]"
          onClick={(e) => e.stopPropagation()}
        >
        <div className="flex items-center justify-between pb-4 border-b border-[#c1c9be]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#164525]/10 text-[#164525] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">swap_vert</span>
            </div>
            <div>
              <h2 className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700]">
                Mouvement de Stock
              </h2>
              <p className="text-[12px] text-[#717970]">
                Enregistrer une entrée de récolte, sortie ou ajustement
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
              Produit concerné *
            </label>
            <select
              value={stockItemId}
              onChange={(e) => setStockItemId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none cursor-pointer"
            >
              {(stockItems || []).map((item) => {
                const dispo = Math.max(0, (item.stockTotal || 0) - (item.stockReserve || 0));
                return (
                  <option key={item.id} value={item.id}>
                    {item.produitNom} (Total: {item.stockTotal} {item.unite}, Dispo: {dispo} {item.unite})
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
              Type d'opération *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'Entrée', label: 'Entrée (Récolte/Achat)', icon: 'add_circle' },
                { id: 'Sortie', label: 'Sortie (Livraison/Perte)', icon: 'remove_circle' },
                { id: 'Réservation', label: 'Réservation (Commande)', icon: 'lock' },
                { id: 'Libération', label: 'Libération de stock', icon: 'lock_open' },
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setType(t.id as StockMovementType)}
                  className={`p-2 rounded-xl text-[12px] font-semibold border flex items-center gap-1.5 cursor-pointer transition-colors ${
                    type === t.id
                      ? 'bg-[#164525] text-white border-[#164525]'
                      : 'bg-[#FAF8F2] text-[#414941] border-[#c1c9be] hover:bg-[#eae4d5]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {t.icon}
                  </span>
                  <span>{t.id}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                Quantité ({currentItem?.unite || 'kg'}) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantite}
                onChange={(e) => setQuantite(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                Date & Heure
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
              Motif / Justificatif
            </label>
            <input
              type="text"
              placeholder="Ex: Récolte du matin, Conditionnement en caisses..."
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
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
              className="px-6 py-2.5 rounded-full bg-[#164525] text-white font-bold text-[13px] hover:bg-[#2f5d3a] transition-all cursor-pointer shadow-sm"
            >
              Valider le mouvement
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>,
    document.body
  );
};
