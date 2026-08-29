import React, { useState } from 'react';
import {
  FarmProfile,
  Plot,
  CropProduction,
  StockItem,
  StockMovement,
  ProducerOrder,
  ProducerDelivery,
  TraceabilityLot,
  ProducerFinanceSummary,
  FinancialTransaction,
  ProducerNotification,
  Product,
  PlotStatus,
  ProductionStatus,
  ProducerOrderStatus,
} from '../../types';

import { ProducerOverviewTab } from './tabs/ProducerOverviewTab';
import { FarmProfileTab } from './tabs/FarmProfileTab';
import { PlotsTab } from './tabs/PlotsTab';
import { ProductionsTab } from './tabs/ProductionsTab';
import { StocksTab } from './tabs/StocksTab';
import { ProductsTab } from './tabs/ProductsTab';
import { PreordersTab } from './tabs/PreordersTab';
import { OrdersTab } from './tabs/OrdersTab';
import { DeliveriesTab } from './tabs/DeliveriesTab';
import { TraceabilityTab } from './tabs/TraceabilityTab';
import { FinancesTab } from './tabs/FinancesTab';
import { ReportsTab } from './tabs/ReportsTab';
import { ProducerNotificationsTab } from './tabs/ProducerNotificationsTab';

import { NewPlotModal } from './tabs/NewPlotModal';
import { NewProductionModal } from './tabs/NewProductionModal';
import { UpdateProductionModal } from './tabs/UpdateProductionModal';
import { NewPreorderModal } from './tabs/NewPreorderModal';
import { StockMovementModal } from './tabs/StockMovementModal';
import { OrderDetailModal } from './tabs/OrderDetailModal';

export type ProducerTabId =
  | 'overview'
  | 'farm'
  | 'plots'
  | 'productions'
  | 'stocks'
  | 'products'
  | 'preorders'
  | 'orders'
  | 'deliveries'
  | 'traceability'
  | 'finances'
  | 'reports'
  | 'notifications';

interface ProducerDashboardLayoutProps {
  // State
  farmProfile: FarmProfile;
  plots: Plot[];
  productions: CropProduction[];
  stockItems: StockItem[];
  stockMovements: StockMovement[];
  producerOrders: ProducerOrder[];
  producerDeliveries: ProducerDelivery[];
  traceabilityLots: TraceabilityLot[];
  financeSummary: ProducerFinanceSummary;
  transactions: FinancialTransaction[];
  notifications: ProducerNotification[];
  products: Product[];

  // Mutators
  onUpdateFarmProfile: (profile: FarmProfile) => void;
  onAddPlot: (plot: Plot) => void;
  onUpdatePlotStatus: (plotId: string, status: PlotStatus) => void;
  onAddProduction: (prod: CropProduction) => void;
  onUpdateProductionStatus: (prodId: string, status: ProductionStatus) => void;
  onUpdateProduction?: (updatedProd: CropProduction) => void;
  onAddProductAsPreorder: (product: Product, productionId?: string) => void;
  onAddStockMovement: (mov: StockMovement, stockItemId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: ProducerOrderStatus) => void;
  onUpdateDeliveryStatus: (
    deliveryId: string,
    status: ProducerOrderStatus,
    dateLivree?: string
  ) => void;
  onMarkNotificationAsRead: (notifId: string) => void;
  onMarkAllNotificationsAsRead: () => void;

  // Global app switches
  onSwitchToBuyer: () => void;
  onSelectProductToView: (product: Product) => void;
}

export const ProducerDashboardLayout: React.FC<ProducerDashboardLayoutProps> = ({
  farmProfile,
  plots,
  productions,
  stockItems,
  stockMovements,
  producerOrders,
  producerDeliveries,
  traceabilityLots,
  financeSummary,
  transactions,
  notifications,
  products,
  onUpdateFarmProfile,
  onAddPlot,
  onUpdatePlotStatus,
  onAddProduction,
  onUpdateProductionStatus,
  onUpdateProduction,
  onAddProductAsPreorder,
  onAddStockMovement,
  onUpdateOrderStatus,
  onUpdateDeliveryStatus,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  onSwitchToBuyer,
  onSelectProductToView,
}) => {
  const [activeTab, setActiveTab] = useState<ProducerTabId>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals state
  const [isNewPlotModalOpen, setIsNewPlotModalOpen] = useState(false);
  const [isNewProductionModalOpen, setIsNewProductionModalOpen] = useState(false);
  const [selectedProductionForUpdate, setSelectedProductionForUpdate] =
    useState<CropProduction | null>(null);
  const [isNewPreorderModalOpen, setIsNewPreorderModalOpen] = useState(false);
  const [preselectedProductionForPreorder, setPreselectedProductionForPreorder] =
    useState<CropProduction | null>(null);
  const [isStockMovementModalOpen, setIsStockMovementModalOpen] = useState(false);
  const [selectedOrderForDetail, setSelectedOrderForDetail] =
    useState<ProducerOrder | null>(null);

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const handleOpenPreorderFromProd = (prod: CropProduction) => {
    setPreselectedProductionForPreorder(prod);
    setIsNewPreorderModalOpen(true);
  };

  const navItems: { id: ProducerTabId; label: string; icon: string; badge?: number }[] = [
    { id: 'overview', label: "Vue d'ensemble", icon: 'dashboard' },
    { id: 'farm', label: 'Mon Exploitation', icon: 'agriculture' },
    { id: 'plots', label: 'Parcelles', icon: 'grid_view' },
    { id: 'productions', label: 'Productions', icon: 'potted_plant' },
    { id: 'stocks', label: 'Stocks & Entrepôt', icon: 'warehouse' },
    { id: 'products', label: 'Mes Produits', icon: 'storefront' },
    {
      id: 'preorders',
      label: 'Précommandes reçues',
      icon: 'receipt_long',
      badge: producerOrders.length,
    },
    { id: 'orders', label: 'Commandes', icon: 'inventory_2' },
    { id: 'deliveries', label: 'Livraisons', icon: 'local_shipping' },
    { id: 'traceability', label: 'Traçabilité (QR)', icon: 'qr_code_2' },
    { id: 'finances', label: 'Finances & Revenus', icon: 'account_balance_wallet' },
    { id: 'reports', label: 'Rapports & Stats', icon: 'analytics' },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'notifications',
      badge: unreadNotifsCount,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F2] flex flex-col">
      {/* Top Banner / Switch to Buyer */}
      <div className="bg-[#164525] text-white px-4 py-2.5 flex items-center justify-between text-[12px] border-b border-[#2f5d3a]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold">
            ESPACE PRODUCTEUR • {farmProfile.nom}
          </span>
          <span className="hidden sm:inline text-white/70">
            | {farmProfile.region} ({farmProfile.superficieTotale} {farmProfile.uniteSuperficie})
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSwitchToBuyer}
            className="bg-white/10 hover:bg-white/20 text-white text-[12px] font-semibold px-3 py-1 rounded-full border border-white/20 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              storefront
            </span>
            <span className="hidden sm:inline">Passer en mode Acheteur (Marketplace)</span>
            <span className="sm:hidden">Marketplace</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 relative">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#c1c9be] p-4 flex flex-col justify-between transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static ${
            isMobileMenuOpen ? 'translate-x-0 top-10' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col gap-4">
            {/* Logo / Brand header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#c1c9be]/50">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#164525] text-white flex items-center justify-center font-bold text-[18px]">
                  🌾
                </div>
                <div>
                  <h2 className="font-['Montserrat'] text-[15px] font-bold text-[#164525]">
                    Agri-Link ERP
                  </h2>
                  <span className="text-[10px] text-[#717970] font-medium block">
                    Vendre avant de produire
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="md:hidden text-[#717970] p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Quick Action: New Preorder */}
            <button
              onClick={() => {
                setPreselectedProductionForPreorder(null);
                setIsNewPreorderModalOpen(true);
              }}
              className="w-full bg-[#164525] text-white font-bold text-[12px] py-2.5 px-3 rounded-xl hover:bg-[#2f5d3a] transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">publish</span>
              Publier une précommande
            </button>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#164525] text-white shadow-xs'
                        : 'text-[#414941] hover:bg-[#FAF8F2] hover:text-[#2b1700]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[18px]">
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[#164525]/10 text-[#164525]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Producer Profile footer */}
          <div className="pt-3 border-t border-[#c1c9be]/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#164525]/10 text-[#164525] flex items-center justify-center font-bold text-[14px]">
              FN
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[13px] font-bold text-[#2b1700] block truncate">
                {farmProfile.responsable}
              </span>
              <span className="text-[11px] text-[#717970] block truncate">
                {farmProfile.nom}
              </span>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
          ></div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center justify-between pb-4 mb-4 border-b border-[#c1c9be]">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex items-center gap-2 bg-white border border-[#c1c9be] px-3 py-1.5 rounded-xl text-[13px] font-bold text-[#164525]"
            >
              <span className="material-symbols-outlined text-[20px]">menu</span>
              Menu ERP
            </button>
            <span className="text-[13px] font-bold text-[#2b1700]">
              {navItems.find((n) => n.id === activeTab)?.label}
            </span>
          </div>

          {/* Render Active Sub Tab */}
          {activeTab === 'overview' && (
            <ProducerOverviewTab
              farmProfile={farmProfile}
              plots={plots}
              productions={productions}
              stockItems={stockItems}
              orders={producerOrders}
              deliveries={producerDeliveries}
              financeSummary={financeSummary}
              onNavigateTab={(tab) => setActiveTab(tab as ProducerTabId)}
              onOpenNewProduction={() => setIsNewProductionModalOpen(true)}
              onOpenNewPreorder={() => {
                setPreselectedProductionForPreorder(null);
                setIsNewPreorderModalOpen(true);
              }}
              onOpenStockMovement={() => setIsStockMovementModalOpen(true)}
              onSelectOrder={(order) => setSelectedOrderForDetail(order)}
            />
          )}

          {activeTab === 'farm' && (
            <FarmProfileTab
              farmProfile={farmProfile}
              plots={plots}
              onUpdateProfile={onUpdateFarmProfile}
            />
          )}

          {activeTab === 'plots' && (
            <PlotsTab
              plots={plots}
              onOpenNewPlot={() => setIsNewPlotModalOpen(true)}
              onUpdatePlotStatus={onUpdatePlotStatus}
            />
          )}

          {activeTab === 'productions' && (
            <ProductionsTab
              productions={productions}
              onOpenNewProduction={() => setIsNewProductionModalOpen(true)}
              onOpenUpdateProduction={(prod) => setSelectedProductionForUpdate(prod)}
              onUpdateProductionStatus={onUpdateProductionStatus}
              onPublishPreorderFromProduction={handleOpenPreorderFromProd}
            />
          )}

          {activeTab === 'stocks' && (
            <StocksTab
              stockItems={stockItems}
              movements={stockMovements}
              onOpenNewMovement={() => setIsStockMovementModalOpen(true)}
            />
          )}

          {activeTab === 'products' && (
            <ProductsTab
              products={products}
              onOpenNewPreorder={() => {
                setPreselectedProductionForPreorder(null);
                setIsNewPreorderModalOpen(true);
              }}
              onSelectProduct={onSelectProductToView}
            />
          )}

          {activeTab === 'preorders' && (
            <PreordersTab
              orders={producerOrders}
              onSelectOrder={(order) => setSelectedOrderForDetail(order)}
              onOpenNewPreorder={() => {
                setPreselectedProductionForPreorder(null);
                setIsNewPreorderModalOpen(true);
              }}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersTab
              orders={producerOrders}
              onSelectOrder={(order) => setSelectedOrderForDetail(order)}
            />
          )}

          {activeTab === 'deliveries' && (
            <DeliveriesTab
              deliveries={producerDeliveries}
              onUpdateDeliveryStatus={onUpdateDeliveryStatus}
            />
          )}

          {activeTab === 'traceability' && (
            <TraceabilityTab lots={traceabilityLots} />
          )}

          {activeTab === 'finances' && (
            <FinancesTab
              financeSummary={financeSummary}
              transactions={transactions}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsTab
              plots={plots}
              productions={productions}
              orders={producerOrders}
            />
          )}

          {activeTab === 'notifications' && (
            <ProducerNotificationsTab
              notifications={notifications}
              onMarkAllAsRead={onMarkAllNotificationsAsRead}
              onMarkAsRead={onMarkNotificationAsRead}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <NewPlotModal
        isOpen={isNewPlotModalOpen}
        onClose={() => setIsNewPlotModalOpen(false)}
        onAddPlot={onAddPlot}
      />

      <NewProductionModal
        isOpen={isNewProductionModalOpen}
        onClose={() => setIsNewProductionModalOpen(false)}
        plots={plots}
        onAddProduction={onAddProduction}
      />

      <UpdateProductionModal
        isOpen={!!selectedProductionForUpdate}
        onClose={() => setSelectedProductionForUpdate(null)}
        production={selectedProductionForUpdate}
        plots={plots}
        onUpdateProduction={(updated) => {
          if (onUpdateProduction) {
            onUpdateProduction(updated);
          } else {
            onUpdateProductionStatus(updated.id, updated.statut);
          }
        }}
        onPublishPreorder={(prod) => {
          handleOpenPreorderFromProd(prod);
        }}
      />

      <NewPreorderModal
        isOpen={isNewPreorderModalOpen}
        onClose={() => {
          setIsNewPreorderModalOpen(false);
          setPreselectedProductionForPreorder(null);
        }}
        productions={productions}
        preselectedProduction={preselectedProductionForPreorder}
        onPublishPreorder={onAddProductAsPreorder}
      />

      <StockMovementModal
        isOpen={isStockMovementModalOpen}
        onClose={() => setIsStockMovementModalOpen(false)}
        stockItems={stockItems}
        onAddMovement={onAddStockMovement}
      />

      <OrderDetailModal
        order={selectedOrderForDetail}
        onClose={() => setSelectedOrderForDetail(null)}
        onUpdateStatus={onUpdateOrderStatus}
        onOpenDeliveryTab={() => setActiveTab('deliveries')}
      />
    </div>
  );
};
