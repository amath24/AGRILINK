import React, { useState } from 'react';
import { StockItem, StockMovement } from '../../../types';

interface StocksTabProps {
  stockItems: StockItem[];
  movements: StockMovement[];
  onOpenNewMovement: () => void;
}

export const StocksTab: React.FC<StocksTabProps> = ({
  stockItems = [],
  movements = [],
  onOpenNewMovement,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'inventory' | 'history'>('inventory');

  const safeStockItems = stockItems || [];
  const safeMovements = movements || [];

  const totalStockKg = safeStockItems.reduce((acc, s) => acc + (s.stockTotal || 0), 0);
  const totalReservedKg = safeStockItems.reduce((acc, s) => acc + (s.stockReserve || 0), 0);
  const totalAvailableKg = safeStockItems.reduce((acc, s) => acc + Math.max(0, (s.stockTotal || 0) - (s.stockReserve || 0)), 0);
  const lowStockCount = safeStockItems.filter((s) => {
    const dispo = (s.stockTotal || 0) - (s.stockReserve || 0);
    return dispo <= (s.seuilAlerte || 0) || s.statut === 'Stock faible' || s.statut === 'Rupture';
  }).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white border border-[#c1c9be] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#164525] text-[28px]">
              warehouse
            </span>
            <h1 className="font-['Montserrat'] text-[22px] font-bold text-[#2b1700]">
              Gestion des Stocks & Entrepôts
            </h1>
          </div>
          <p className="text-[13px] text-[#717970] mt-1">
            Visualisation en temps réel des quantités physiques récoltées, des quotas réservés et du stock disponible.
          </p>
        </div>

        <button
          onClick={onOpenNewMovement}
          className="bg-[#164525] text-white text-[13px] font-semibold px-4 py-2.5 rounded-full hover:bg-[#2f5d3a] transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">swap_vert</span>
          Nouveau mouvement de stock
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#c1c9be] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#164525]/10 text-[#164525] flex items-center justify-center">
            <span className="material-symbols-outlined text-[26px]">inventory</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#717970]">
              Stock Total Récolté
            </span>
            <div className="font-['Montserrat'] text-[20px] font-bold text-[#2b1700]">
              {totalStockKg.toLocaleString('fr-FR')} kg
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#c1c9be] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#7d4600] flex items-center justify-center">
            <span className="material-symbols-outlined text-[26px]">lock_clock</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#717970]">
              Stock Réservé (Précommandes)
            </span>
            <div className="font-['Montserrat'] text-[20px] font-bold text-[#7d4600]">
              {totalReservedKg.toLocaleString('fr-FR')} kg
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#c1c9be] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-[26px]">check_box</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#717970]">
              Stock Libre Immédiat
            </span>
            <div className="font-['Montserrat'] text-[20px] font-bold text-[#164525]">
              {totalAvailableKg.toLocaleString('fr-FR')} kg
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#c1c9be] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-[26px]">notification_important</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#717970]">
              Alertes de Stock
            </span>
            <div className="font-['Montserrat'] text-[20px] font-bold text-[#2b1700]">
              {lowStockCount} alerte{lowStockCount > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Sub tabs: Inventaire vs Historique */}
      <div className="flex items-center gap-2 border-b border-[#c1c9be]/60 pb-1">
        <button
          onClick={() => setActiveSubTab('inventory')}
          className={`px-4 py-2 text-[13px] font-bold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'inventory'
              ? 'border-[#164525] text-[#164525]'
              : 'border-transparent text-[#717970] hover:text-[#2b1700]'
          }`}
        >
          État de l'Inventaire ({stockItems.length})
        </button>
        <button
          onClick={() => setActiveSubTab('history')}
          className={`px-4 py-2 text-[13px] font-bold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'history'
              ? 'border-[#164525] text-[#164525]'
              : 'border-transparent text-[#717970] hover:text-[#2b1700]'
          }`}
        >
          Historique des Mouvements ({movements.length})
        </button>
      </div>

      {activeSubTab === 'inventory' ? (
        /* Inventory Table */
        <div className="bg-white border border-[#c1c9be] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="bg-[#FAF8F2] border-b border-[#c1c9be] text-[#717970] font-semibold text-[12px] uppercase">
                  <th className="py-3.5 px-4">Produit</th>
                  <th className="py-3.5 px-4">Emplacement Entrepôt</th>
                  <th className="py-3.5 px-4">Stock Total</th>
                  <th className="py-3.5 px-4">Stock Réservé</th>
                  <th className="py-3.5 px-4">Stock Libre / Dispo</th>
                  <th className="py-3.5 px-4">Seuil d'alerte</th>
                  <th className="py-3.5 px-4">Statut Stock</th>
                  <th className="py-3.5 px-4 text-right">Dernière MàJ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c1c9be]/40">
                {safeStockItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[#717970]">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[36px] text-[#c1c9be]">warehouse</span>
                        <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#2b1700]">Aucun article en stock</h3>
                        <p className="text-[13px] text-[#717970] max-w-sm">Vos stocks se mettront à jour automatiquement après déclaration de vos récoltes ou enregistrement d'entrées.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  safeStockItems.map((item) => {
                  const dispo = Math.max(0, (item.stockTotal || 0) - (item.stockReserve || 0));
                  const isLow = dispo <= (item.seuilAlerte || 0);

                  return (
                    <tr key={item.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[#2b1700]">
                        {item.produitNom}
                      </td>
                      <td className="py-3.5 px-4 text-[#414941]">
                        <span className="flex items-center gap-1 text-[12px]">
                          <span className="material-symbols-outlined text-[15px] text-[#717970]">
                            location_on
                          </span>
                          {(item as any).emplacement || 'Hangar Principal Sangalkam'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#2b1700]">
                        {item.stockTotal} {item.unite}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#7d4600]">
                        {item.stockReserve} {item.unite}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#164525]">
                        {dispo} {item.unite}
                      </td>
                      <td className="py-3.5 px-4 text-[#717970]">
                        {item.seuilAlerte} {item.unite}
                      </td>
                      <td className="py-3.5 px-4">
                        {isLow ? (
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                            Seuil atteint
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                            Stock optimal
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right text-[12px] text-[#717970]">
                        {item.dernierMouvementDate || (item as any).derniereMiseAJour || "Aujourd'hui"}
                      </td>
                    </tr>
                  );
                })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Movement History Table */
        <div className="bg-white border border-[#c1c9be] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="bg-[#FAF8F2] border-b border-[#c1c9be] text-[#717970] font-semibold text-[12px] uppercase">
                  <th className="py-3.5 px-4">Date & Heure</th>
                  <th className="py-3.5 px-4">Produit</th>
                  <th className="py-3.5 px-4">Type de Mouvement</th>
                  <th className="py-3.5 px-4">Quantité</th>
                  <th className="py-3.5 px-4">Motif / Contexte</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c1c9be]/40">
                {safeMovements.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#717970]">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[36px] text-[#c1c9be]">swap_vert</span>
                        <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#2b1700]">Aucun mouvement enregistré</h3>
                        <p className="text-[13px] text-[#717970] max-w-sm">Effectuez un mouvement d'entrée ou de sortie pour tracer les flux de stocks.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  safeMovements.map((mov) => {
                  const isEntry = mov.type === 'Entrée';
                  const isExit = mov.type === 'Sortie';

                  return (
                    <tr key={mov.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                      <td className="py-3.5 px-4 text-[#717970] text-[12px]">
                        {mov.date}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#2b1700]">
                        {mov.produitNom}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                            isEntry
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : isExit
                              ? 'bg-red-100 text-red-900 border-red-300'
                              : 'bg-blue-100 text-blue-900 border-blue-300'
                          }`}
                        >
                          {mov.type}
                        </span>
                      </td>
                      <td
                        className={`py-3.5 px-4 font-bold ${
                          isEntry ? 'text-[#164525]' : isExit ? 'text-red-700' : 'text-[#7d4600]'
                        }`}
                      >
                        {isEntry ? '+' : isExit ? '-' : ''}
                        {mov.quantite} {mov.unite}
                      </td>
                      <td className="py-3.5 px-4 text-[#414941]">
                        {mov.motif}
                      </td>
                    </tr>
                  );
                })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
