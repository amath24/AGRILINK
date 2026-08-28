import React from 'react';
import { BuyerTab, BuyerProfile, Preorder, DeliveryRecord, PaymentRecord, Product, BuyerNotification } from '../../types';
import { BuyerOverviewTab } from './BuyerOverviewTab';
import { BuyerPreordersTab } from './BuyerPreordersTab';
import { BuyerOrdersTab } from './BuyerOrdersTab';
import { BuyerDeliveriesTab } from './BuyerDeliveriesTab';
import { BuyerPaymentsTab } from './BuyerPaymentsTab';
import { BuyerFavoritesTab } from './BuyerFavoritesTab';
import { BuyerNotificationsTab } from './BuyerNotificationsTab';
import { BuyerProfileTab } from './BuyerProfileTab';

interface BuyerDashboardLayoutProps {
  activeTab: BuyerTab;
  onTabChange: (tab: BuyerTab) => void;
  preorders: Preorder[];
  deliveries: DeliveryRecord[];
  payments: PaymentRecord[];
  favoriteProducts: Product[];
  notifications: BuyerNotification[];
  buyerProfile: BuyerProfile;
  onUpdateProfile: (profile: BuyerProfile) => void;
  onSelectPreorder: (preorder: Preorder) => void;
  onOpenReceipt: (data: { preorder?: Preorder; payment?: PaymentRecord }) => void;
  onConfirmDelivery: (preorderId: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickPreorder: (product: Product) => void;
  onToggleFavorite: (productId: string) => void;
  onOpenMarketplace: () => void;
  onMarkAllNotificationsAsRead: () => void;
  onSelectNotification: (notif: BuyerNotification) => void;
  onToggleReadNotification?: (id: string) => void;
  onDeleteNotification?: (id: string) => void;
  onClearReadNotifications?: () => void;
  onSimulateNotification?: () => void;
}

export const BuyerDashboardLayout: React.FC<BuyerDashboardLayoutProps> = ({
  activeTab,
  onTabChange,
  preorders,
  deliveries,
  payments,
  favoriteProducts,
  notifications,
  buyerProfile,
  onUpdateProfile,
  onSelectPreorder,
  onOpenReceipt,
  onConfirmDelivery,
  onSelectProduct,
  onQuickPreorder,
  onToggleFavorite,
  onOpenMarketplace,
  onMarkAllNotificationsAsRead,
  onSelectNotification,
  onToggleReadNotification,
  onDeleteNotification,
  onClearReadNotifications,
  onSimulateNotification,
}) => {
  const activePreordersCount = preorders.filter(
    (p) => p.statutCommande !== 'Livrée' && p.statutCommande !== 'Annulée'
  ).length;

  const inTransitDeliveriesCount = deliveries.filter((d) => d.statut !== 'livree').length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const navItems: { id: BuyerTab; label: string; icon: string; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Vue d’ensemble', icon: 'dashboard' },
    { id: 'preorders', label: 'Mes Précommandes', icon: 'receipt_long', badge: activePreordersCount },
    { id: 'orders', label: 'Mes Commandes', icon: 'inventory_2' },
    { id: 'deliveries', label: 'Livraisons', icon: 'local_shipping', badge: inTransitDeliveriesCount },
    { id: 'notifications', label: 'Notifications', icon: 'notifications', badge: unreadNotificationsCount, badgeColor: 'bg-[#e63946] text-white' },
    { id: 'favorites', label: 'Favoris', icon: 'favorite', badge: favoriteProducts.length },
    { id: 'payments', label: 'Paiements & Factures', icon: 'payments' },
    { id: 'profile', label: 'Profil Acheteur', icon: 'person' },
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-16 py-8">
      {/* Header bar / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 text-[14px] text-[#414941]">
          <button
            onClick={onOpenMarketplace}
            className="flex items-center gap-1 text-[#164525] font-semibold hover:underline cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            Marketplace
          </button>
          <span className="text-[#c1c9be]">/</span>
          <span className="text-[#2b1700] font-bold">Espace Acheteur</span>
          <span className="text-[#c1c9be]">/</span>
          <span className="text-[#717970] capitalize">
            {navItems.find((n) => n.id === activeTab)?.label || 'Tableau de bord'}
          </span>
        </div>

        <button
          onClick={onOpenMarketplace}
          className="bg-[#164525] text-white text-[13px] font-semibold px-4 py-2 rounded-full hover:bg-[#2f5d3a] transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
          Commander de nouvelles récoltes
        </button>
      </div>

      {/* Main Container with Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar (1 col) */}
        <aside className="lg:col-span-1 bg-white border border-[#c1c9be] rounded-2xl p-4 lg:p-5 shadow-sm flex flex-col gap-4 lg:gap-6 lg:sticky lg:top-24">
          {/* User Profile Mini Badge */}
          <div className="flex items-center gap-3 pb-5 border-b border-[#c1c9be]/50">
            <div className="w-12 h-12 rounded-full bg-[#164525] text-white flex items-center justify-center font-['Montserrat'] font-bold text-[18px]">
              {buyerProfile.prenom.charAt(0)}{buyerProfile.nom.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <h3 className="font-['Montserrat'] text-[15px] font-bold text-[#2b1700] truncate">
                {buyerProfile.prenom} {buyerProfile.nom}
              </h3>
              <p className="text-[12px] text-[#164525] font-medium truncate">
                {buyerProfile.nomEntreprise || buyerProfile.typeAcheteur}
              </p>
              <span className="text-[10px] font-mono text-[#717970]">
                {buyerProfile.codeClient}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide -mx-2 px-2 lg:mx-0 lg:px-0">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`buyer-tab-${item.id}`}
                  onClick={() => onTabChange(item.id)}
                  className={`flex-shrink-0 lg:w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14px] font-medium transition-all cursor-pointer text-left whitespace-nowrap gap-4 ${
                    isActive
                      ? 'bg-[#164525] text-white font-semibold shadow-sm'
                      : 'text-[#414941] hover:bg-[#FAF8F2] hover:text-[#164525]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        isActive ? 'text-white' : 'text-[#717970]'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor || 'bg-[#ffead7] text-[#7d4600]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Guarantee Note */}
          <div className="hidden lg:flex mt-auto pt-4 border-t border-[#c1c9be]/50 bg-[#FAF8F2] -mx-5 -mb-5 p-4 rounded-b-2xl items-center gap-2.5">
            <span className="material-symbols-outlined text-[#164525] text-[22px]">security</span>
            <div className="text-[11px] text-[#414941]">
              <strong className="text-[#164525] block">Sécurité Séquestre</strong>
              Acomptes protégés jusqu'à conformité de la récolte.
            </div>
          </div>
        </aside>

        {/* Content Area (3 cols) */}
        <main className="lg:col-span-3">
          {activeTab === 'dashboard' && (
            <BuyerOverviewTab
              preorders={preorders}
              deliveries={deliveries}
              buyerProfile={buyerProfile}
              onNavigateTab={onTabChange}
              onSelectPreorder={onSelectPreorder}
              onOpenMarketplace={onOpenMarketplace}
              favoritesCount={favoriteProducts.length}
            />
          )}

          {activeTab === 'preorders' && (
            <BuyerPreordersTab
              preorders={preorders}
              onSelectPreorder={onSelectPreorder}
              onOpenReceipt={(po) => onOpenReceipt({ preorder: po })}
              onOpenMarketplace={onOpenMarketplace}
            />
          )}

          {activeTab === 'orders' && (
            <BuyerOrdersTab
              preorders={preorders}
              onSelectPreorder={onSelectPreorder}
              onOpenReceipt={(po) => onOpenReceipt({ preorder: po })}
            />
          )}

          {activeTab === 'deliveries' && (
            <BuyerDeliveriesTab
              deliveries={deliveries}
              onConfirmDelivery={onConfirmDelivery}
              onOpenPreorderDetail={(id) => {
                const po = preorders.find((p) => p.id === id);
                if (po) onSelectPreorder(po);
              }}
            />
          )}

          {activeTab === 'notifications' && (
            <BuyerNotificationsTab
              notifications={notifications}
              onMarkAllAsRead={onMarkAllNotificationsAsRead}
              onSelectNotification={onSelectNotification}
              onToggleReadNotification={onToggleReadNotification}
              onDeleteNotification={onDeleteNotification}
              onClearReadNotifications={onClearReadNotifications}
              onSimulateNotification={onSimulateNotification}
            />
          )}

          {activeTab === 'payments' && (
            <BuyerPaymentsTab
              payments={payments}
              preorders={preorders}
              onOpenReceipt={(pay) => onOpenReceipt({ payment: pay })}
            />
          )}

          {activeTab === 'favorites' && (
            <BuyerFavoritesTab
              favoriteProducts={favoriteProducts}
              onSelectProduct={onSelectProduct}
              onQuickPreorder={onQuickPreorder}
              onToggleFavorite={onToggleFavorite}
              onOpenMarketplace={onOpenMarketplace}
            />
          )}

          {activeTab === 'profile' && (
            <BuyerProfileTab
              buyerProfile={buyerProfile}
              onUpdateProfile={onUpdateProfile}
            />
          )}
        </main>
      </div>
    </div>
  );
};
