import React, { useState } from 'react';
import { BuyerNotification } from '../../types';

interface BuyerNotificationsTabProps {
  notifications: BuyerNotification[];
  onMarkAllAsRead: () => void;
  onSelectNotification: (notif: BuyerNotification) => void;
  onToggleReadNotification?: (id: string) => void;
  onDeleteNotification?: (id: string) => void;
  onClearReadNotifications?: () => void;
  onSimulateNotification?: () => void;
}

export const BuyerNotificationsTab: React.FC<BuyerNotificationsTabProps> = ({
  notifications,
  onMarkAllAsRead,
  onSelectNotification,
  onToggleReadNotification,
  onDeleteNotification,
  onClearReadNotifications,
  onSimulateNotification,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'order_harvest' | 'payment' | 'delivery'>('all');
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="flex flex-col gap-6">
      {/* ========================================================================= */}
      {/* HEADER CARD                                                               */}
      {/* ========================================================================= */}
      <div className="bg-white border border-[#c1c9be] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#164525] text-[28px]">
              notifications_active
            </span>
            <h1 className="font-['Montserrat'] text-[20px] sm:text-[22px] font-bold text-[#2b1700]">
              Notifications & Alertes
            </h1>
            {unreadCount > 0 && (
              <span className="bg-[#e63946] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                {unreadCount} non {unreadCount > 1 ? 'lues' : 'lue'}
              </span>
            )}
          </div>
          <p className="text-[13px] text-[#717970] mt-1 font-['Inter']">
            Suivez les étapes de culture, les avis d'acomptes Wave/Orange Money et les livraisons en cours.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-[#164525] border border-[#164525] hover:bg-[#164525] hover:text-white text-[12px] sm:text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">done_all</span>
              Tout marquer comme lu
            </button>
          )}

          {readCount > 0 && onClearReadNotifications && (
            <button
              onClick={onClearReadNotifications}
              className="text-[#717970] hover:text-[#dc2626] border border-[#c1c9be]/60 hover:border-[#dc2626]/40 text-[12px] sm:text-[13px] font-medium px-3.5 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              title="Supprimer les notifications déjà consultées"
            >
              <span className="material-symbols-outlined text-[16px]">cleaning_services</span>
              Effacer lues
            </button>
          )}

          {onSimulateNotification && (
            <button
              onClick={onSimulateNotification}
              className="text-[#7d4600] bg-[#fff1e6] hover:bg-[#ffeed9] border border-[#7d4600]/30 text-[12px] font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
              title="Générer un exemple d'alerte pour tester l'interface"
            >
              <span className="material-symbols-outlined text-[15px]">add_alert</span>
              + Tester alerte
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SEARCH & FILTERS BAR                                                      */}
      {/* ========================================================================= */}
      <div className="bg-white border border-[#c1c9be] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-grow max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#717970] text-[18px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par mot-clé (produit, paiement, ville)..."
            className="w-full pl-9 pr-8 py-2 bg-[#FAF8F2] border border-[#c1c9be]/60 rounded-xl text-[13px] text-[#2b1700] placeholder-[#717970] outline-none focus:border-[#164525]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#717970] hover:text-[#2b1700] p-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">cancel</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[12px] font-medium">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl shrink-0 transition-colors cursor-pointer flex items-center gap-1 ${
              activeFilter === 'all'
                ? 'bg-[#164525] text-white font-bold shadow-xs'
                : 'bg-[#FAF8F2] text-[#414941] hover:bg-[#fff1e6]'
            }`}
          >
            <span>Toutes</span>
            <span className="opacity-80 text-[11px]">({notifications.length})</span>
          </button>

          <button
            onClick={() => setActiveFilter('unread')}
            className={`px-3 py-1.5 rounded-xl shrink-0 transition-colors cursor-pointer flex items-center gap-1 ${
              activeFilter === 'unread'
                ? 'bg-[#164525] text-white font-bold shadow-xs'
                : 'bg-[#FAF8F2] text-[#414941] hover:bg-[#fff1e6]'
            }`}
          >
            <span>Non lues</span>
            {unreadCount > 0 && (
              <span className="bg-[#e63946] text-white px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveFilter('order_harvest')}
            className={`px-3 py-1.5 rounded-xl shrink-0 transition-colors cursor-pointer flex items-center gap-1 ${
              activeFilter === 'order_harvest'
                ? 'bg-[#164525] text-white font-bold shadow-xs'
                : 'bg-[#FAF8F2] text-[#414941] hover:bg-[#fff1e6]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">eco</span>
            <span>Récoltes</span>
          </button>

          <button
            onClick={() => setActiveFilter('payment')}
            className={`px-3 py-1.5 rounded-xl shrink-0 transition-colors cursor-pointer flex items-center gap-1 ${
              activeFilter === 'payment'
                ? 'bg-[#164525] text-white font-bold shadow-xs'
                : 'bg-[#FAF8F2] text-[#414941] hover:bg-[#fff1e6]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">payments</span>
            <span>Paiements</span>
          </button>

          <button
            onClick={() => setActiveFilter('delivery')}
            className={`px-3 py-1.5 rounded-xl shrink-0 transition-colors cursor-pointer flex items-center gap-1 ${
              activeFilter === 'delivery'
                ? 'bg-[#164525] text-white font-bold shadow-xs'
                : 'bg-[#FAF8F2] text-[#414941] hover:bg-[#fff1e6]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">local_shipping</span>
            <span>Livraisons</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* NOTIFICATIONS LIST                                                        */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white border border-[#c1c9be] rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF8F2] text-[#717970] flex items-center justify-center mb-4 border border-[#c1c9be]/50">
              <span className="material-symbols-outlined text-[32px]">notifications_paused</span>
            </div>
            <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#2b1700] mb-1">
              {activeFilter === 'unread'
                ? 'Aucune notification non lue'
                : searchQuery
                ? 'Aucun résultat trouvé'
                : 'Aucune notification'}
            </h3>
            <p className="text-[13px] text-[#717970] max-w-sm leading-relaxed font-['Inter']">
              {activeFilter === 'unread'
                ? 'Toutes vos notifications sont à jour !'
                : 'Vos alertes relatives aux cultures réservées et aux acomptes apparaîtront ici.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const details = getNotificationDetails(notif.type);

            return (
              <div
                key={notif.id}
                className={`bg-white border rounded-2xl p-4 sm:p-5 transition-all shadow-xs ${
                  notif.read
                    ? 'border-[#c1c9be]/60 hover:border-[#164525]/40'
                    : 'border-[#164525]/40 bg-[#FAF8F2]/60'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Category Icon */}
                  <div
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${details.bg}`}
                  >
                    <span className="material-symbols-outlined text-[22px]">{details.icon}</span>
                  </div>

                  {/* Body */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${details.badgeBg}`}
                        >
                          {details.tag}
                        </span>
                        {!notif.read && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#164525]">
                            <span className="w-2 h-2 rounded-full bg-[#164525]"></span>
                            Nouveau
                          </span>
                        )}
                      </div>
                      <span className="text-[12px] text-[#717970] font-medium font-['Inter']">
                        {notif.date}
                      </span>
                    </div>

                    <h3 className="font-['Montserrat'] text-[15px] font-bold text-[#2b1700] mb-1">
                      {notif.titre}
                    </h3>

                    <p className="font-['Inter'] text-[13px] text-[#414941] leading-relaxed mb-3">
                      {notif.message}
                    </p>

                    {/* Actions bar */}
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#c1c9be]/30 flex-wrap">
                      <button
                        onClick={() => onSelectNotification(notif)}
                        className="inline-flex items-center gap-1.5 text-[12px] sm:text-[13px] font-bold text-[#164525] bg-[#164525]/10 hover:bg-[#164525] hover:text-white px-3.5 py-1.5 rounded-xl transition-all cursor-pointer"
                      >
                        <span>{details.actionText}</span>
                        <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                      </button>

                      <div className="flex items-center gap-2 text-[#717970]">
                        {onToggleReadNotification && (
                          <button
                            onClick={() => onToggleReadNotification(notif.id)}
                            className="inline-flex items-center gap-1 text-[12px] font-medium hover:text-[#164525] p-1.5 rounded-lg hover:bg-[#FAF8F2] transition-colors cursor-pointer"
                            title={notif.read ? 'Marquer comme non lu' : 'Marquer comme lu'}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {notif.read ? 'mark_email_unread' : 'mark_email_read'}
                            </span>
                            <span className="hidden sm:inline">
                              {notif.read ? 'Non lu' : 'Marquer lu'}
                            </span>
                          </button>
                        )}

                        {onDeleteNotification && (
                          <button
                            onClick={() => onDeleteNotification(notif.id)}
                            className="inline-flex items-center gap-1 text-[12px] font-medium hover:text-[#dc2626] p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Supprimer cette notification"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                            <span className="hidden sm:inline">Supprimer</span>
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
    </div>
  );
};
