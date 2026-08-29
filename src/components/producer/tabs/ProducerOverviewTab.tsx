import React from 'react';
import {
  Plot,
  CropProduction,
  StockItem,
  ProducerOrder,
  ProducerDelivery,
  ProducerTab,
  FarmProfile,
  ProducerFinanceSummary,
} from '../../../types';

interface ProducerOverviewTabProps {
  farmName?: string;
  farmProfile?: FarmProfile;
  plots?: Plot[];
  productions?: CropProduction[];
  stocks?: StockItem[];
  stockItems?: StockItem[];
  orders?: ProducerOrder[];
  deliveries?: ProducerDelivery[];
  financeSummary?: ProducerFinanceSummary;
  onNavigateTab: (tab: ProducerTab) => void;
  onOpenNewProduction: () => void;
  onOpenNewPreorder: () => void;
  onOpenStockMovement?: () => void;
  onSelectOrder?: (order: ProducerOrder) => void;
}

export const ProducerOverviewTab: React.FC<ProducerOverviewTabProps> = ({
  farmName,
  farmProfile,
  plots = [],
  productions = [],
  stocks,
  stockItems,
  orders = [],
  deliveries = [],
  onNavigateTab,
  onOpenNewProduction,
  onOpenNewPreorder,
  onOpenStockMovement,
  onSelectOrder,
}) => {
  const currentStocks = stockItems || stocks || [];
  const currentFarmName = farmName || farmProfile?.nomExploitation || 'Ferme des Niayes';

  // Calculations
  const activeProductions = (productions || []).filter(
    (p) => p.statut === 'En cours' || p.statut === 'Récolte prévue'
  );
  const plannedProductions = (productions || []).filter((p) => p.statut === 'Planifiée');

  const totalStockAvailable = currentStocks.reduce(
    (acc, s) => acc + (s.stockTotal - s.stockReserve),
    0
  );
  const totalStockReserved = currentStocks.reduce((acc, s) => acc + s.stockReserve, 0);

  const publishedProductsCount = currentStocks.length;

  const preordersCount = (orders || []).filter(
    (o) => o.statut === 'Précommande' || o.statut === 'Acompte payé' || o.statut === 'Production en cours'
  ).length;

  const totalOrdersCount = (orders || []).length;

  const totalRevenues = (orders || []).reduce((acc, o) => acc + (o.montantTotal || 0), 0);
  const totalAcomptesRecus = (orders || []).reduce((acc, o) => acc + (o.acomptePaye || 0), 0);
  const totalSoldesRestants = (orders || []).reduce((acc, o) => acc + (o.soldeRestant || 0), 0);

  const pendingDeliveries = (deliveries || []).filter((d) => d.statut !== 'Livrée').length;

  // Monthly revenue data for chart
  const salesHistory = totalOrdersCount > 0 ? [
    { month: 'Avr', ca: Math.round(totalRevenues * 0.15), volume: Math.round(totalOrdersCount * 0.2) },
    { month: 'Mai', ca: Math.round(totalRevenues * 0.25), volume: Math.round(totalOrdersCount * 0.3) },
    { month: 'Juin', ca: Math.round(totalRevenues * 0.4), volume: Math.round(totalOrdersCount * 0.5) },
    { month: 'Juil', ca: Math.round(totalRevenues * 0.6), volume: Math.round(totalOrdersCount * 0.7) },
    { month: 'Août', ca: Math.round(totalRevenues * 0.8), volume: Math.round(totalOrdersCount * 0.9) },
    { month: 'Actuel', ca: totalRevenues, volume: totalOrdersCount },
  ] : [
    { month: 'Avr', ca: 0, volume: 0 },
    { month: 'Mai', ca: 0, volume: 0 },
    { month: 'Juin', ca: 0, volume: 0 },
    { month: 'Juil', ca: 0, volume: 0 },
    { month: 'Août', ca: 0, volume: 0 },
    { month: 'Actuel', ca: 0, volume: 0 },
  ];

  const maxCa = Math.max(1, ...salesHistory.map((s) => s.ca));

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner with "Vendre avant de produire" Tagline */}
      <div className="bg-[#164525] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <span className="material-symbols-outlined text-[160px]">agriculture</span>
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-[#bbefc1] text-[12px] font-semibold mb-3">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            ERP Agricole Agri-Link • {currentFarmName}
          </div>
          <h1 className="font-['Montserrat'] text-[24px] sm:text-[30px] font-bold tracking-tight mb-2">
            Tableau de Bord Producteur
          </h1>
          <p className="text-[14px] text-white/85 leading-relaxed mb-6 font-['Inter']">
            Principe central : <strong className="text-white">« Vendre avant de produire »</strong>. 
            Sécurisez vos débouchés, percevez des acomptes à la réservation et gérez vos parcelles de la semence à la livraison.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenNewPreorder}
              className="bg-white text-[#164525] font-bold text-[13px] px-4 py-2.5 rounded-full hover:bg-[#FAF8F2] transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">publish</span>
              Publier une précommande
            </button>
            <button
              onClick={onOpenNewProduction}
              className="bg-white/20 text-white hover:bg-white/30 font-semibold text-[13px] px-4 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer border border-white/20"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Nouvelle production
            </button>
            <button
              onClick={onOpenStockMovement}
              className="bg-white/20 text-white hover:bg-white/30 font-semibold text-[13px] px-4 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer border border-white/20"
            >
              <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
              Mouvement de stock
            </button>
          </div>
        </div>
      </div>

      {/* 7 Key Indicators Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* 1. Productions en cours */}
        <div
          onClick={() => onNavigateTab('productions')}
          className="bg-white border border-[#c1c9be] rounded-2xl p-4 sm:p-5 hover:border-[#164525] transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-semibold text-[#717970]">Prod. en cours</span>
            <div className="w-8 h-8 rounded-full bg-[#164525]/10 text-[#164525] flex items-center justify-center group-hover:bg-[#164525] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[18px]">potted_plant</span>
            </div>
          </div>
          <div className="font-['Montserrat'] text-[24px] font-bold text-[#2b1700]">
            {activeProductions.length}
          </div>
          <p className="text-[11px] text-[#717970] mt-1">
            {plots.length} parcelles cultivées
          </p>
        </div>

        {/* 2. Productions prévues */}
        <div
          onClick={() => onNavigateTab('productions')}
          className="bg-white border border-[#c1c9be] rounded-2xl p-4 sm:p-5 hover:border-[#164525] transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-semibold text-[#717970]">Prod. prévues</span>
            <div className="w-8 h-8 rounded-full bg-[#7d4600]/10 text-[#7d4600] flex items-center justify-center group-hover:bg-[#7d4600] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            </div>
          </div>
          <div className="font-['Montserrat'] text-[24px] font-bold text-[#2b1700]">
            {plannedProductions.length}
          </div>
          <p className="text-[11px] text-[#717970] mt-1">
            Cycles à venir
          </p>
        </div>

        {/* 3. Stock disponible */}
        <div
          onClick={() => onNavigateTab('stocks')}
          className="bg-white border border-[#c1c9be] rounded-2xl p-4 sm:p-5 hover:border-[#164525] transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-semibold text-[#717970]">Stock disponible</span>
            <div className="w-8 h-8 rounded-full bg-[#2f5d3a]/10 text-[#2f5d3a] flex items-center justify-center group-hover:bg-[#2f5d3a] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            </div>
          </div>
          <div className="font-['Montserrat'] text-[24px] font-bold text-[#164525]">
            {totalStockAvailable.toLocaleString('fr-FR')} <span className="text-[14px] font-normal">kg</span>
          </div>
          <p className="text-[11px] text-[#717970] mt-1">
            Réservé : {totalStockReserved} kg
          </p>
        </div>

        {/* 4. Produits publiés */}
        <div
          onClick={() => onNavigateTab('produits')}
          className="bg-white border border-[#c1c9be] rounded-2xl p-4 sm:p-5 hover:border-[#164525] transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-semibold text-[#717970]">Produits publiés</span>
            <div className="w-8 h-8 rounded-full bg-[#164525]/10 text-[#164525] flex items-center justify-center group-hover:bg-[#164525] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[18px]">storefront</span>
            </div>
          </div>
          <div className="font-['Montserrat'] text-[24px] font-bold text-[#2b1700]">
            {publishedProductsCount}
          </div>
          <p className="text-[11px] text-[#164525] font-medium mt-1">
            Visibles sur le marché
          </p>
        </div>

        {/* 5. Précommandes */}
        <div
          onClick={() => onNavigateTab('preorders')}
          className="bg-white border border-[#c1c9be] rounded-2xl p-4 sm:p-5 hover:border-[#164525] transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-semibold text-[#717970]">Précommandes</span>
            <div className="w-8 h-8 rounded-full bg-[#ffead7] text-[#7d4600] flex items-center justify-center group-hover:bg-[#7d4600] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            </div>
          </div>
          <div className="font-['Montserrat'] text-[24px] font-bold text-[#7d4600]">
            {preordersCount}
          </div>
          <p className="text-[11px] text-[#717970] mt-1">
            En récolte ou culture
          </p>
        </div>

        {/* 6. Commandes totales & Livraisons */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-white border border-[#c1c9be] rounded-2xl p-4 sm:p-5 hover:border-[#164525] transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-semibold text-[#717970]">Commandes</span>
            <div className="w-8 h-8 rounded-full bg-[#164525]/10 text-[#164525] flex items-center justify-center group-hover:bg-[#164525] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            </div>
          </div>
          <div className="font-['Montserrat'] text-[24px] font-bold text-[#2b1700]">
            {totalOrdersCount}
          </div>
          <p className="text-[11px] text-[#717970] mt-1">
            {pendingDeliveries} livraisons à traiter
          </p>
        </div>

        {/* 7. Revenus & Acomptes */}
        <div
          onClick={() => onNavigateTab('finances')}
          className="col-span-2 sm:col-span-3 lg:col-span-2 bg-[#FAF8F2] border-2 border-[#164525] rounded-2xl p-4 sm:p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-bold text-[#164525] uppercase tracking-wider">
              Chiffre d'Affaires & Trésorerie
            </span>
            <span className="text-[11px] bg-[#164525] text-white px-2.5 py-0.5 rounded-full font-semibold">
              Séquestre Garanti
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-['Montserrat'] text-[26px] font-bold text-[#2b1700]">
              {totalRevenues.toLocaleString('fr-FR')} FCFA
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#c1c9be]/60 text-[12px]">
            <div>
              <span className="text-[#717970] block">Acomptes perçus (30%) :</span>
              <strong className="text-[#164525] font-semibold">
                {totalAcomptesRecus.toLocaleString('fr-FR')} FCFA
              </strong>
            </div>
            <div>
              <span className="text-[#717970] block">Soldes à la livraison :</span>
              <strong className="text-[#7d4600] font-semibold">
                {totalSoldesRestants.toLocaleString('fr-FR')} FCFA
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Sales & Production Evolution */}
        <div className="lg:col-span-2 bg-white border border-[#c1c9be] rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700]">
                Évolution des Ventes & Précommandes
              </h2>
              <p className="text-[12px] text-[#717970]">
                Montants en FCFA et volumes réservés par les acheteurs (Dakar, Thiès, Saly)
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#164525] bg-[#FAF8F2] px-3 py-1 rounded-full border border-[#c1c9be]/60 self-start">
              <span className="w-2 h-2 rounded-full bg-[#164525]"></span>
              Croissance continue +38%
            </span>
          </div>

          {/* Simple Visual Chart Bar */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-[#c1c9be]/50">
            {salesHistory.map((item, idx) => {
              const heightPct = Math.round((item.ca / maxCa) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] font-mono text-[#717970] opacity-0 group-hover:opacity-100 transition-opacity">
                    {(item.ca / 1000).toFixed(0)}k
                  </div>
                  <div className="w-full max-w-[48px] bg-[#FAF8F2] rounded-t-lg h-36 flex items-end p-1 relative">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t transition-all duration-500 ${
                        idx === salesHistory.length - 1
                          ? 'bg-[#7d4600] border border-dashed border-[#7d4600]'
                          : 'bg-[#164525]'
                      }`}
                    ></div>
                  </div>
                  <span className="text-[11px] font-medium text-[#414941] text-center truncate max-w-full">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-4 text-[12px] text-[#717970]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#164525]"></span> Ventes réalisées
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#7d4600]"></span> Précommandes futures
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-[#164525] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              Voir rapports complets
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Right 1 Col: Top Sold Products */}
        <div className="bg-white border border-[#c1c9be] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700] mb-1">
              Produits les plus vendus
            </h2>
            <p className="text-[12px] text-[#717970] mb-4">
              Classement par volume de précommande
            </p>

            <div className="flex flex-col gap-3">
              {currentStocks.length === 0 ? (
                <div className="py-8 text-center text-[#717970] text-[13px]">
                  <span className="material-symbols-outlined text-[28px] text-[#c1c9be] mb-1 block">inventory_2</span>
                  Aucun stock enregistré pour le moment.
                </div>
              ) : (
                currentStocks.slice(0, 4).map((stock, i) => {
                const totalPct = Math.min(
                  100,
                  Math.round((stock.stockReserve / stock.stockTotal) * 100)
                );
                return (
                  <div key={stock.id} className="p-2.5 rounded-xl bg-[#FAF8F2] border border-[#c1c9be]/50">
                    <div className="flex items-center justify-between text-[13px] font-semibold text-[#2b1700] mb-1">
                      <span className="truncate pr-2">{i + 1}. {stock.produitNom}</span>
                      <span className="text-[#164525] whitespace-nowrap">{stock.stockReserve} {stock.unite}</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-[#e3ded4] h-1.5 rounded-full overflow-hidden mb-1">
                      <div
                        style={{ width: `${totalPct}%` }}
                        className="bg-[#164525] h-full rounded-full"
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-[#717970]">
                      <span>{totalPct}% réservé à l'avance</span>
                      <span>Total récolte : {stock.stockTotal} {stock.unite}</span>
                    </div>
                  </div>
                );
              })
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('stocks')}
            className="w-full mt-4 py-2 text-center text-[13px] font-semibold text-[#164525] bg-[#164525]/10 hover:bg-[#164525]/20 rounded-xl transition-colors cursor-pointer"
          >
            Gérer les stocks & seuils
          </button>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white border border-[#c1c9be] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700]">
              Activité Récente de l'Exploitation
            </h2>
            <p className="text-[12px] text-[#717970]">
              Dernières réservations, paiements reçus, jalons de récolte et expéditions
            </p>
          </div>
          <span className="text-[12px] font-mono text-[#717970] bg-[#FAF8F2] px-2.5 py-1 rounded-lg border border-[#c1c9be]/50">
            En direct
          </span>
        </div>

        <div className="divide-y divide-[#c1c9be]/40">
          {(orders || []).length === 0 ? (
            <div className="py-10 text-center text-[#717970] text-[13px]">
              <span className="material-symbols-outlined text-[32px] text-[#c1c9be] mb-2 block">receipt_long</span>
              Aucune activité récente. Vos futures commandes apparaîtront ici.
            </div>
          ) : (
            (orders || []).slice(0, 4).map((order) => (
            <div
              key={order.id}
              onClick={() => onSelectOrder(order)}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF8F2] px-2 rounded-xl transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <img
                  src={order.produitImage}
                  alt={order.produitNom}
                  className="w-11 h-11 rounded-lg object-cover border border-[#c1c9be]/60"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-[14px] text-[#2b1700]">
                      {order.produitNom}
                    </h4>
                    <span className="text-[11px] font-mono text-[#717970]">
                      #{order.numeroCommande}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#414941]">
                    {order.acheteurNom} • {order.quantite} {order.unite} ({order.montantTotal.toLocaleString('fr-FR')} FCFA)
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#164525]/10 text-[#164525]">
                  {order.statut}
                </span>
                <span className="text-[12px] text-[#717970]">
                  {order.dateCommande}
                </span>
                <span className="material-symbols-outlined text-[18px] text-[#717970]">
                  chevron_right
                </span>
              </div>
            </div>
          ))
          )}
        </div>
      </div>
    </div>
  );
};
