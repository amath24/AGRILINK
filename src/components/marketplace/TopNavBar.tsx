import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRoleType, BuyerTab } from '../../types';

interface TopNavBarProps {
  currentView: 'marketplace' | 'about' | 'detail' | 'tracking' | 'buyer' | 'producer' | 'admin' | 'login' | 'register';
  onNavigate: (view: 'marketplace' | 'about' | 'detail' | 'tracking' | 'buyer' | 'producer' | 'admin' | 'login' | 'register') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  preordersCount: number;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenBuyerSpace: (tab?: BuyerTab) => void;
  onOpenProducerSpace: () => void;
  onOpenAdminSpace?: () => void;
  buyerName?: string;
  currentBuyerTab?: BuyerTab;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  currentView,
  onNavigate,
  searchQuery,
  onSearchChange,
  preordersCount,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenBuyerSpace,
  onOpenProducerSpace,
  onOpenAdminSpace,
  buyerName = 'Moussa Diop',
  currentBuyerTab = 'dashboard',
}) => {
  const { user, profile, role, logout, setDemoUser } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const displayName = profile ? `${profile.firstName} ${profile.lastName}` : (user?.displayName || buyerName);
  const userInitial = displayName ? displayName.charAt(0).toUpperCase() : 'U';

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
    onNavigate('marketplace');
  };

  const handleRoleQuickSwitch = (newRole: UserRoleType) => {
    setIsUserMenuOpen(false);
    setDemoUser(newRole);
    if (newRole === 'BUYER') onOpenBuyerSpace('preorders');
    else if (newRole === 'PRODUCER') onOpenProducerSpace();
    else if (newRole === 'ADMIN' && onOpenAdminSpace) onOpenAdminSpace();
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-[#FAF8F2] border-b border-[#c1c9be] shadow-none">
        <div className="max-w-[1440px] mx-auto px-4 md:px-16 py-3 flex justify-between items-center">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-4 md:gap-8">
            <button
              id="brand-logo-btn"
              onClick={() => onNavigate('marketplace')}
              className="flex items-center gap-1.5 text-left cursor-pointer group"
            >
              <span className="text-[22px] sm:text-[24px] font-['Montserrat'] font-extrabold text-[#164525] group-hover:opacity-90 transition-opacity">
                Agri-Link
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#164525]/10 text-[#164525] text-[10px] font-bold">
                Marché Direct
              </span>
            </button>
            
            <nav className="hidden md:flex items-center gap-2 lg:gap-3 font-['Inter'] text-[14px]">
              <button
                id="nav-marketplace-btn"
                onClick={() => onNavigate('marketplace')}
                className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'marketplace' || currentView === 'detail'
                    ? 'text-[#164525] font-bold border-b-2 border-[#164525] bg-[#164525]/5'
                    : 'text-[#414941] hover:text-[#164525] hover:bg-[#fff1e6]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">storefront</span>
                Offres &amp; Marché
              </button>



              {user && (
                <>
                  {(role === 'BUYER' || role === 'ADMIN') && (
                    <button
                      id="nav-buyer-space-btn"
                      onClick={() => onOpenBuyerSpace('dashboard')}
                      className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                        currentView === 'buyer' && currentBuyerTab !== 'preorders'
                          ? 'text-[#164525] font-bold border-b-2 border-[#164525]'
                          : 'text-[#414941] hover:text-[#164525] hover:bg-[#fff1e6]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[17px]">shopping_basket</span>
                      Espace Acheteur
                    </button>
                  )}

                  {(role === 'PRODUCER' || role === 'ADMIN') && (
                    <button
                      id="nav-producer-space-btn"
                      onClick={onOpenProducerSpace}
                      className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                        currentView === 'producer'
                          ? 'bg-[#164525] text-white font-bold shadow-xs'
                          : 'text-[#164525] font-semibold bg-[#164525]/10 hover:bg-[#164525]/20'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[17px]">agriculture</span>
                      Espace Producteur
                    </button>
                  )}

                  {role === 'ADMIN' && onOpenAdminSpace && (
                    <button
                      id="nav-admin-space-btn"
                      onClick={onOpenAdminSpace}
                      className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                        currentView === 'admin'
                          ? 'bg-[#2b1700] text-white font-bold shadow-xs'
                          : 'text-[#2b1700] font-semibold bg-[#2b1700]/10 hover:bg-[#2b1700]/20'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[17px]">admin_panel_settings</span>
                      Admin
                    </button>
                  )}
                </>
              )}
            </nav>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Integrated Search for Desktop */}
            <div className="relative hidden lg:block w-56 xl:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#717970] text-[18px] pointer-events-none">
                search
              </span>
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Rechercher des produits..."
                className="w-full pl-9 pr-4 py-1.5 bg-[#F3EBDD] border-b-2 border-[#7d4600] focus:border-[#164525] outline-none rounded-t-lg font-['Inter'] text-[13px] text-[#2b1700] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#717970] hover:text-[#2b1700] p-1 cursor-pointer"
                  title="Effacer la recherche"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 relative">
              {user ? (
                <>
                  {/* Notification Bell */}
                  <button
                    id="notifications-header-btn"
                    onClick={onOpenNotifications}
                    className="relative p-2 text-[#414941] hover:text-[#164525] hover:bg-[#fff1e6] rounded-full transition-colors cursor-pointer flex items-center justify-center"
                    title="Notifications"
                  >
                    <span className="material-symbols-outlined text-[22px]">notifications</span>
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute top-1 right-1 bg-[#e63946] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>

                  {/* Preorders / Cart shortcut */}
                  <button
                    id="preorders-cart-btn"
                    onClick={() => onOpenBuyerSpace('preorders')}
                    className={`relative p-2 rounded-full transition-colors cursor-pointer flex items-center justify-center ${
                      currentView === 'buyer' && currentBuyerTab === 'preorders'
                        ? 'text-[#164525] bg-[#bbefc1]/50'
                        : 'text-[#414941] hover:text-[#164525] hover:bg-[#fff1e6]'
                    }`}
                    title="Mes précommandes de récoltes"
                  >
                    <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
                    {preordersCount > 0 && (
                      <span className="absolute top-0.5 right-0.5 bg-[#164525] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-[#FAF8F2]">
                        {preordersCount}
                      </span>
                    )}
                  </button>
                  
                  {/* Account Profile Button with Menu Trigger */}
                  <div className="relative">
                    <button
                      id="account-profile-btn"
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 text-[#2b1700] hover:bg-[#fff1e6] rounded-full transition-colors cursor-pointer border border-[#c1c9be]/60"
                      title="Mon compte et session"
                    >
                      <div className={`w-6 h-6 rounded-full text-white flex items-center justify-center text-[11px] font-bold ${
                        role === 'ADMIN' ? 'bg-[#2b1700]' : role === 'PRODUCER' ? 'bg-[#7d4600]' : 'bg-[#164525]'
                      }`}>
                        {userInitial}
                      </div>
                      <span className="hidden sm:inline text-[13px] font-semibold text-[#164525] truncate max-w-[100px]">
                        {displayName.split(' ')[0]}
                      </span>
                      <span className="material-symbols-outlined text-[16px] text-[#717970]">
                        expand_more
                      </span>
                    </button>

                {/* User Session Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-[#c1c9be]/60 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-[#c1c9be]/40">
                      <p className="text-[13px] font-bold text-[#164525] truncate">
                        {displayName}
                      </p>
                      <p className="text-[11px] text-[#717970] truncate">
                        {profile?.email || user?.email || 'compte@agrilink.sn'}
                      </p>
                      <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#164525]/10 text-[#164525]">
                        <span className="material-symbols-outlined text-[12px]">verified_user</span>
                        {role === 'ADMIN' ? 'Administrateur' : role === 'PRODUCER' ? 'Producteur' : 'Acheteur'}
                      </div>
                    </div>

                    {/* Links */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenBuyerSpace('preorders');
                        }}
                        className="w-full px-4 py-2 text-left text-[13px] text-[#2b1700] hover:bg-[#FAF8F2] flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-[18px] text-[#164525]">receipt_long</span>
                          Mes Précommandes
                        </div>
                        {preordersCount > 0 && (
                          <span className="bg-[#164525] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                            {preordersCount}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenBuyerSpace('dashboard');
                        }}
                        className="w-full px-4 py-2 text-left text-[13px] text-[#2b1700] hover:bg-[#FAF8F2] flex items-center gap-2.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px] text-[#164525]">shopping_basket</span>
                        Mon Espace Acheteur
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenNotifications();
                        }}
                        className="w-full px-4 py-2 text-left text-[13px] text-[#2b1700] hover:bg-[#FAF8F2] flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-[18px] text-[#164525]">notifications</span>
                          Centre de Notifications
                        </div>
                        {unreadNotificationsCount > 0 && (
                          <span className="bg-[#e63946] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                            {unreadNotificationsCount}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenProducerSpace();
                        }}
                        className="w-full px-4 py-2 text-left text-[13px] text-[#2b1700] hover:bg-[#FAF8F2] flex items-center gap-2.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px] text-[#7d4600]">agriculture</span>
                        Mon Espace Producteur
                      </button>

                      {onOpenAdminSpace && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenAdminSpace();
                          }}
                          className="w-full px-4 py-2 text-left text-[13px] text-[#2b1700] hover:bg-[#FAF8F2] flex items-center gap-2.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px] text-[#2b1700]">admin_panel_settings</span>
                          Tableau de bord Admin
                        </button>
                      )}
                    </div>

                    {/* Fast demo role switchers */}
                    <div className="px-4 py-2 border-t border-[#c1c9be]/40 bg-[#FAF8F2]/60">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#717970] mb-1.5">
                        Changer de rôle (Test) :
                      </p>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleRoleQuickSwitch('BUYER')}
                          className="flex-1 py-1 px-1.5 bg-white border border-[#c1c9be]/50 rounded-lg text-[10px] font-bold text-[#164525] hover:bg-[#fff1e6] cursor-pointer"
                        >
                          Acheteur
                        </button>
                        <button
                          onClick={() => handleRoleQuickSwitch('PRODUCER')}
                          className="flex-1 py-1 px-1.5 bg-white border border-[#c1c9be]/50 rounded-lg text-[10px] font-bold text-[#7d4600] hover:bg-[#fff1e6] cursor-pointer"
                        >
                          Producteur
                        </button>
                        <button
                          onClick={() => handleRoleQuickSwitch('ADMIN')}
                          className="flex-1 py-1 px-1.5 bg-white border border-[#c1c9be]/50 rounded-lg text-[10px] font-bold text-[#2b1700] hover:bg-[#fff1e6] cursor-pointer"
                        >
                          Admin
                        </button>
                      </div>
                    </div>

                    {/* Auth Actions */}
                    <div className="pt-1 border-t border-[#c1c9be]/40">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigate('register');
                        }}
                        className="w-full px-4 py-2 text-left text-[13px] text-[#164525] font-medium hover:bg-[#FAF8F2] flex items-center gap-2.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">person_add</span>
                        Créer un nouveau compte
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigate('login');
                        }}
                        className="w-full px-4 py-2 text-left text-[13px] text-[#414941] hover:bg-[#FAF8F2] flex items-center gap-2.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">login</span>
                        Changer de compte / Se connecter
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-[13px] text-[#dc2626] hover:bg-[#fee2e2]/40 flex items-center gap-2.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
              </>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('login')}
                    className="text-[#164525] font-semibold text-[13px] hover:bg-[#164525]/10 px-4 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    Se connecter
                  </button>
                  <button
                    onClick={() => onNavigate('register')}
                    className="bg-[#164525] text-white font-semibold text-[13px] hover:bg-[#2f5d3a] px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-sm hidden sm:block"
                  >
                    S'inscrire
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>


    </>
  );
};


