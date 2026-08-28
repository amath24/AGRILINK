import React, { useState, useEffect } from 'react';
import { BuyerNotification } from '../../types';

interface BuyerNotificationsModalProps {
  notifications: BuyerNotification[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onSelectNotification: (notif: BuyerNotification) => void;
  onToggleReadNotification?: (id: string) => void;
  onDeleteNotification?: (id: string) => void;
  onClearReadNotifications?: () => void;
  onSimulateNotification?: () => void;
}

export const BuyerNotificationsModal: React.FC<BuyerNotificationsModalProps> = ({
  notifications,
  onClose,
  onMarkAllAsRead,
  onSelectNotification,
  onToggleReadNotification,
  onDeleteNotification,
  onClearReadNotifications,
  onSimulateNotification,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'order_harvest' | 'payment' | 'delivery'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = notifications.length - unreadCount;

  // Filter notifications
  const filteredNotifications = notifications.filter((notif) => {
    // Category filter
    if (activeFilter === 'unread' && notif.read) return false;
    if (activeFilter === 'order_harvest' && notif.type !== 'preorder' && notif.type !== 'harvest') return false;
    if (activeFilter === 'payment' && notif.type !== 'payment') return false;
    if (activeFilter === 'delivery' && notif.type !== 'delivery') return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return notif.titre.toLowerCase().includes(q) || notif.message.toLowerCase().includes(q);
    }

    return true;
  });

  const getNotificationDetails = (type: BuyerNotification['type']) => {
    switch (type) {
      case 'payment':
        return {
          icon: 'payments',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          badgeBg: 'bg-emerald-100 text-emerald-900',
          tag: 'Paiement Wave / OM',
          actionText: 'Voir le reçu',
        };
      case 'harvest':
        return {
          icon: 'agriculture',
          bg: 'bg-amber-50 text-amber-900 border-amber-200',
          badgeBg: 'bg-amber-100 text-amber-900',
          tag: 'Évolution Récolte',
          actionText: 'Suivi culture',
        };
      case 'delivery':
        return {
          icon: 'local_shipping',
          bg: 'bg-blue-50 text-blue-900 border-blue-200',
          badgeBg: 'bg-blue-100 text-blue-900',
          tag: 'Livraison & Transport',
          actionText: 'Suivi colis',
        };
      case 'preorder':
        return {
          icon: 'receipt_long',
          bg: 'bg-[#FAF8F2] text-[#164525] border-[#c1c9be]/60',
          badgeBg: 'bg-[#164525]/10 text-[#164525]',
          tag: 'Précommande',
          actionText: 'Détail commande',
        };
      default:
        return {
          icon: 'notifications',
          bg: 'bg-stone-50 text-stone-800 border-stone-200',
          badgeBg: 'bg-stone-100 text-stone-900',
          tag: 'Information',
          actionText: 'Consulter',
        };
    }
  };

  return (
    <div
      id="notifications-drawer-root"
      className="fixed inset-0 z-50 overflow-hidden"
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Background backdrop with blur */}
      <div
        id="notifications-backdrop"
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ease-out"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-16">
        <div
          id="notifications-panel"
          className="w-screen max-w-md md:max-w-lg min-w-[300px] shrink-0 bg-white h-full shadow-2xl flex flex-col border-l border-[#c1c9be]/60 transform transition-transform ease-out duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ========================================================================= */}
          {/* 🔔 DRAWER HEADER                                                          */}
          {/* ========================================================================= */}
          <div className="bg-[#FAF8F2] px-5 sm:px-6 py-4 border-b border-[#c1c9be]/60 shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#164525] text-white flex items-center justify-center shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-[22px]">notifications_active</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2
                      id="slide-over-title"
                      className="font-['Montserrat'] text-[17px] sm:text-[18px] font-bold text-[#2b1700]"
                    >
                      Notifications
                    </h2>
                    {unreadCount > 0 && (
                      <span className="bg-[#e63946] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                        {unreadCount} non {unreadCount > 1 ? 'lues' : 'lue'}
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-[#717970] font-['Inter']">
                    Suivi direct de vos précommandes, récoltes et paiements.
                  </p>
                </div>
              </div>

              <button
                id="close-notifications-btn"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white border border-[#c1c9be]/60 text-[#717970] hover:text-[#2b1700] hover:bg-[#FAF8F2] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Fermer (Échap)"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Quick Bulk Actions */}
            <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-[#c1c9be]/40 text-[12px]">
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="inline-flex items-center gap-1 text-[#164525] font-bold hover:underline cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-[#c1c9be]/60 text-[12px] shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-[15px]">done_all</span>
                    Tout marquer lu
                  </button>
                )}

                {readCount > 0 && onClearReadNotifications && (
                  <button
                    onClick={onClearReadNotifications}
                    className="inline-flex items-center gap-1 text-[#717970] hover:text-[#dc2626] cursor-pointer hover:underline px-2 py-1 text-[12px]"
                    title="Supprimer les notifications déjà lues"
                  >
                    <span className="material-symbols-outlined text-[14px]">cleaning_services</span>
                    Effacer lues
                  </button>
                )}
              </div>

              {onSimulateNotification && (
                <button
                  onClick={onSimulateNotification}
                  className="inline-flex items-center gap-1 text-[11px] text-[#7d4600] font-bold bg-[#fff1e6] hover:bg-[#ffeed9] px-2.5 py-1 rounded-lg transition-colors cursor-pointer border border-[#7d4600]/20"
                  title="Simuler l'arrivée d'une notification"
                >
                  <span className="material-symbols-outlined text-[14px]">add_alert</span>
                  + Test alerte
                </button>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 🔍 SEARCH & CATEGORY FILTER TABS                                          */}
          {/* ========================================================================= */}
          <div className="px-5 py-3 border-b border-[#c1c9be]/40 bg-white space-y-2.5 shrink-0">
            {/* Search Input */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#717970] text-[16px] pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une notification..."
                className="w-full pl-9 pr-8 py-1.5 bg-[#FAF8F2] border border-[#c1c9be]/60 rounded-xl text-[13px] text-[#2b1700] placeholder-[#717970] outline-none focus:border-[#164525]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#717970] hover:text-[#2b1700] p-0.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">cancel</span>
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 text-[11px] font-medium">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-lg shrink-0 transition-colors cursor-pointer flex items-center gap-1 ${
                  activeFilter === 'all'
                    ? 'bg-[#164525] text-white font-bold'
                    : 'bg-[#FAF8F2] text-[#414941] hover:bg-[#fff1e6]'
                }`}
              >
                <span>Toutes</span>
                <span className="opacity-80 text-[10px]">({notifications.length})</span>
              </button>

              <button
                onClick={() => setActiveFilter('unread')}
                className={`px-3 py-1 rounded-lg shrink-0 transition-colors cursor-pointer flex items-center gap-1 ${
                  activeFilter === 'unread'
                    ? 'bg-[#164525] text-white font-bold'
                    : 'bg-[#FAF8F2] text-[#414941] hover:bg-[#fff1e6]'
                }`}
              >
                <span>Non lues</span>
                {unreadCount > 0 && (
                  <span className="bg-[#e63946] text-white px-1.5 py-0.2 rounded-full text-[9px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveFilter('order_harvest')}
                className={`px-3 py-1 rounded-lg shrink-0 transition-colors cursor-pointer flex items-center gap-1 ${
                  activeFilter === 'order_harvest'
                    ? 'bg-[#164525] text-white font-bold'
                    : 'bg-[#FAF8F2] text-[#414941] hover:bg-[#fff1e6]'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">eco</span>
                <span>Récoltes</span>
              </button>

              <button
                onClick={() => setActiveFilter('payment')}
                className={`px-3 py-1 rounded-lg shrink-0 transition-colors cursor-pointer flex items-center gap-1 ${
                  activeFilter === 'payment'
                    ? 'bg-[#164525] text-white font-bold'
                    : 'bg-[#FAF8F2] text-[#414941] hover:bg-[#fff1e6]'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">payments</span>
                <span>Paiements</span>
              </button>

              <button
                onClick={() => setActiveFilter('delivery')}
                className={`px-3 py-1 rounded-lg shrink-0 transition-colors cursor-pointer flex items-center gap-1 ${
                  activeFilter === 'delivery'
                    ? 'bg-[#164525] text-white font-bold'
                    : 'bg-[#FAF8F2] text-[#414941] hover:bg-[#fff1e6]'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">local_shipping</span>
                <span>Livraisons</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 📜 NOTIFICATIONS LIST                                                     */}
          {/* ========================================================================= */}
          <div className="overflow-y-auto flex-grow p-4 space-y-3 bg-[#FAF8F2]/30">
            {filteredNotifications.length === 0 ? (
              <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-[#FAF8F2] text-[#717970] flex items-center justify-center mb-3 border border-[#c1c9be]/40">
                  <span className="material-symbols-outlined text-[28px]">notifications_paused</span>
                </div>
                <h4 className="font-['Montserrat'] text-[15px] font-bold text-[#2b1700] mb-1">
                  {activeFilter === 'unread'
                    ? 'Aucune notification non lue'
                    : searchQuery
                    ? 'Aucun résultat correspondant'
                    : 'Aucune notification'}
                </h4>
                <p className="text-[12px] text-[#717970] max-w-xs leading-relaxed font-['Inter']">
                  {activeFilter === 'unread'
                    ? 'Vous êtes à jour ! Toutes vos alertes ont été consultées.'
                    : 'Vos alertes de commandes, récoltes et paiements apparaîtront ici.'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const details = getNotificationDetails(notif.type);

                return (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-2xl transition-all border ${
                      notif.read
                        ? 'bg-white border-[#c1c9be]/60 hover:border-[#164525]/40 hover:shadow-xs'
                        : 'bg-[#FAF8F2] border-[#164525]/40 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Category Icon */}
                      <div
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${details.bg}`}
                      >
                        <span className="material-symbols-outlined text-[20px]">{details.icon}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${details.badgeBg}`}
                            >
                              {details.tag}
                            </span>
                            {!notif.read && (
                              <span className="inline-block w-2 h-2 rounded-full bg-[#164525]" title="Non lu" />
                            )}
                          </div>
                          <span className="text-[11px] text-[#717970] font-medium font-['Inter'] shrink-0">
                            {notif.date}
                          </span>
                        </div>

                        <h4 className="font-['Montserrat'] text-[13px] sm:text-[14px] font-bold text-[#2b1700] mb-1 leading-snug">
                          {notif.titre}
                        </h4>

                        <p className="font-['Inter'] text-[12px] text-[#414941] leading-relaxed mb-3">
                          {notif.message}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#c1c9be]/30">
                          <button
                            onClick={() => onSelectNotification(notif)}
                            className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#164525] bg-[#164525]/10 hover:bg-[#164525] hover:text-white px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                          >
                            <span>{details.actionText}</span>
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                          </button>

                          <div className="flex items-center gap-1 text-[#717970]">
                            {onToggleReadNotification && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleReadNotification(notif.id);
                                }}
                                className="p-1.5 rounded-lg hover:bg-[#FAF8F2] hover:text-[#164525] transition-colors cursor-pointer"
                                title={notif.read ? 'Marquer comme non lu' : 'Marquer comme lu'}
                              >
                                <span className="material-symbols-outlined text-[17px]">
                                  {notif.read ? 'mark_email_unread' : 'mark_email_read'}
                                </span>
                              </button>
                            )}

                            {onDeleteNotification && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteNotification(notif.id);
                                }}
                                className="p-1.5 rounded-lg hover:bg-rose-50 hover:text-[#dc2626] transition-colors cursor-pointer"
                                title="Supprimer cette notification"
                              >
                                <span className="material-symbols-outlined text-[17px]">delete</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ========================================================================= */}
          {/* ℹ️ DRAWER FOOTER                                                          */}
          {/* ========================================================================= */}
          <div className="px-5 py-3 bg-[#FAF8F2] border-t border-[#c1c9be]/60 flex items-center justify-between text-[11px] text-[#717970] shrink-0">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#164525]">verified_user</span>
              Agri-Link Sénégal
            </span>
            <span>{notifications.length} notification{notifications.length > 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
