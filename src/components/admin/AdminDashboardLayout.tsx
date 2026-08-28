import React, { useState } from 'react';
import {
  AdminTab,
  AdminUser,
  AdminProducer,
  AdminBuyer,
  AdminIncident,
  PlatformSettings,
  ProducerOrder,
  Preorder,
  Product,
  ProducerDelivery,
  ProducerCrop,
  PaymentRecord,
  UserAccountStatus,
  ProducerValidationStatus,
  ProducerDeliveryStatus,
  IncidentStatus,
} from '../../types';

import { AdminOverviewTab } from './tabs/AdminOverviewTab';
import { AdminUsersTab } from './tabs/AdminUsersTab';
import { AdminProducersTab } from './tabs/AdminProducersTab';
import { AdminBuyersTab } from './tabs/AdminBuyersTab';
import { AdminProductsTab } from './tabs/AdminProductsTab';
import { AdminPreordersTab } from './tabs/AdminPreordersTab';
import { AdminOrdersTab } from './tabs/AdminOrdersTab';
import { AdminPaymentsTab } from './tabs/AdminPaymentsTab';
import { AdminDeliveriesTab } from './tabs/AdminDeliveriesTab';
import { AdminTraceabilityTab } from './tabs/AdminTraceabilityTab';
import { AdminReportsTab } from './tabs/AdminReportsTab';
import { AdminStatisticsTab } from './tabs/AdminStatisticsTab';
import { AdminSettingsTab } from './tabs/AdminSettingsTab';

interface AdminDashboardLayoutProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onNavigateHome: () => void;
  onNavigateMarketplace: () => void;
  onSwitchRole: (role: 'Acheteur' | 'Producteur' | 'Administrateur') => void;
  
  // Data props
  users: AdminUser[];
  producers: AdminProducer[];
  buyers: AdminBuyer[];
  products: Product[];
  preorders: Preorder[];
  orders: ProducerOrder[];
  payments: PaymentRecord[];
  deliveries: ProducerDelivery[];
  crops: ProducerCrop[];
  incidents: AdminIncident[];
  settings: PlatformSettings;
  
  // Mutations
  onUpdateUserStatus: (userId: string, status: UserAccountStatus) => void;
  onValidateProducer: (producerId: string) => void;
  onRejectProducer: (producerId: string) => void;
  onSuspendProducer: (producerId: string) => void;
  onUpdateDeliveryStatus: (deliveryId: string, status: ProducerDeliveryStatus) => void;
  onUpdateIncidentStatus: (incidentId: string, status: IncidentStatus) => void;
  onSaveSettings: (settings: PlatformSettings) => void;
  onSelectProductToView?: (product: Product) => void;
}

export const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({
  currentTab,
  onTabChange,
  onNavigateHome,
  onNavigateMarketplace,
  onSwitchRole,
  users = [],
  producers = [],
  buyers = [],
  products = [],
  preorders = [],
  orders = [],
  payments = [],
  deliveries = [],
  crops = [],
  incidents = [],
  settings,
  onUpdateUserStatus,
  onValidateProducer,
  onRejectProducer,
  onSuspendProducer,
  onUpdateDeliveryStatus,
  onUpdateIncidentStatus,
  onSaveSettings,
  onSelectProductToView,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingProducersCount = (producers || []).filter((p) => p.statutValidation === 'En attente de validation').length;
  const openIncidentsCount = (incidents || []).filter((i) => i.statut === 'Ouvert').length;

  const navItems: { tab: AdminTab; label: string; icon: string; badge?: number }[] = [
    { tab: 'vue-ensemble', label: "Vue d'ensemble", icon: 'dashboard' },
    { tab: 'utilisateurs', label: 'Utilisateurs', icon: 'group' },
    {
      tab: 'producteurs',
      label: 'Producteurs',
      icon: 'agriculture',
      badge: pendingProducersCount > 0 ? pendingProducersCount : undefined,
    },
    { tab: 'acheteurs', label: 'Acheteurs & Clients', icon: 'shopping_bag' },
    { tab: 'produits', label: 'Produits Publiés', icon: 'inventory_2' },
    { tab: 'precommandes', label: 'Précommandes', icon: 'event_note' },
    { tab: 'commandes', label: 'Commandes', icon: 'receipt_long' },
    { tab: 'paiements', label: 'Paiements & Séquestre', icon: 'payments' },
    { tab: 'livraisons', label: 'Livraisons Logistique', icon: 'local_shipping' },
    { tab: 'tracabilite', label: 'Traçabilité & Lots', icon: 'qr_code_2' },
    {
      tab: 'signalements',
      label: 'Signalements & Litiges',
      icon: 'report_problem',
      badge: openIncidentsCount > 0 ? openIncidentsCount : undefined,
    },
    { tab: 'statistiques', label: 'Statistiques & Rapports', icon: 'analytics' },
    { tab: 'parametres', label: 'Paramètres Plateforme', icon: 'settings' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F2] flex flex-col">
      {/* Top Bar Admin */}
      <header className="sticky top-0 z-40 bg-[#164525] text-white px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          <div
            onClick={onNavigateHome}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <span className="font-['Montserrat'] font-extrabold text-[20px] tracking-tight text-[#FAF8F2]">
              AGRI-LINK
            </span>
            <span className="bg-[#FAF8F2]/20 text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
              ADMIN
            </span>
          </div>
        </div>

        {/* Liens rapides & Profil Admin */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateMarketplace}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[12px] font-semibold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">storefront</span>
            Marketplace
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-white/20">
            <div className="w-8 h-8 rounded-full bg-[#FAF8F2] text-[#164525] flex items-center justify-center font-bold text-[12px]">
              AD
            </div>
            <div className="hidden md:block text-left text-[12px]">
              <div className="font-bold leading-tight">Admin Principal</div>
              <div className="text-white/70 text-[10px]">Super Administrateur</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Bureau */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-[#c1c9be]/60 pt-20 pb-6 flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 lg:pt-6 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="px-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#717970]">
              Menu d'Administration
            </div>

            {navItems.map((item) => {
              const isActive = currentTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => {
                    onTabChange(item.tab);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#164525] text-white font-bold shadow-xs'
                      : 'text-[#414941] hover:bg-[#FAF8F2] hover:text-[#164525]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-[#e76f51] text-white'
                          : 'bg-[#e76f51]/15 text-[#e76f51]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Switch Rôle & Déconnexion */}
          <div className="px-4 pt-4 border-t border-[#c1c9be]/40 space-y-2">
            <div className="text-[11px] font-bold uppercase text-[#717970] px-3">
              Changer d'espace
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSwitchRole('Producteur')}
                className="px-2.5 py-1.5 rounded-lg bg-[#FAF8F2] border border-[#c1c9be] text-[#2b1700] text-[11px] font-medium hover:bg-[#eae4d5] transition-colors cursor-pointer text-center"
              >
                Espace Producteur
              </button>
              <button
                onClick={() => onSwitchRole('Acheteur')}
                className="px-2.5 py-1.5 rounded-lg bg-[#FAF8F2] border border-[#c1c9be] text-[#2b1700] text-[11px] font-medium hover:bg-[#eae4d5] transition-colors cursor-pointer text-center"
              >
                Espace Acheteur
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay mobile */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          />
        )}

        {/* Contenu principal de l'onglet actif */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full">
          {currentTab === 'vue-ensemble' && (
            <AdminOverviewTab
              users={users}
              producers={producers}
              products={products}
              preorders={preorders}
              orders={orders}
              payments={payments}
              incidents={incidents}
              onNavigateTab={(tab) => onTabChange(tab as AdminTab)}
              onValidateProducer={onValidateProducer}
              onResolveIncident={(id) => onUpdateIncidentStatus(id, 'Résolu')}
            />
          )}

          {currentTab === 'utilisateurs' && (
            <AdminUsersTab
              users={users}
              onUpdateUserStatus={onUpdateUserStatus}
            />
          )}

          {currentTab === 'producteurs' && (
            <AdminProducersTab
              producers={producers}
              onValidateProducer={onValidateProducer}
              onRejectProducer={onRejectProducer}
              onSuspendProducer={onSuspendProducer}
            />
          )}

          {currentTab === 'acheteurs' && (
            <AdminBuyersTab buyers={buyers} />
          )}

          {currentTab === 'produits' && (
            <AdminProductsTab
              products={products}
              onSelectProductToView={onSelectProductToView}
            />
          )}

          {currentTab === 'precommandes' && (
            <AdminPreordersTab preorders={preorders} />
          )}

          {currentTab === 'commandes' && (
            <AdminOrdersTab orders={orders} />
          )}

          {currentTab === 'paiements' && (
            <AdminPaymentsTab payments={payments} />
          )}

          {currentTab === 'livraisons' && (
            <AdminDeliveriesTab
              deliveries={deliveries}
              onUpdateDeliveryStatus={onUpdateDeliveryStatus}
            />
          )}

          {currentTab === 'tracabilite' && (
            <AdminTraceabilityTab crops={crops} />
          )}

          {currentTab === 'signalements' && (
            <AdminReportsTab
              incidents={incidents}
              onUpdateIncidentStatus={onUpdateIncidentStatus}
            />
          )}

          {currentTab === 'statistiques' && <AdminStatisticsTab />}

          {currentTab === 'parametres' && (
            <AdminSettingsTab
              settings={settings}
              onSaveSettings={onSaveSettings}
            />
          )}
        </main>
      </div>
    </div>
  );
};
