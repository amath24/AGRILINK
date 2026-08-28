import React from 'react';
import { ProducerNotification } from '../../../types';

interface ProducerNotificationsTabProps {
  notifications: ProducerNotification[];
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
}

export const ProducerNotificationsTab: React.FC<ProducerNotificationsTabProps> = ({
  notifications,
  onMarkAllAsRead,
  onMarkAsRead,
}) => {
  const getIconAndColor = (type: string) => {
    switch (type) {
      case 'order':
        return {
          icon: 'shopping_bag',
          color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        };
      case 'payment':
        return {
          icon: 'savings',
          color: 'bg-[#164525]/10 text-[#164525] border-[#164525]/30',
        };
      case 'crop':
        return {
          icon: 'potted_plant',
          color: 'bg-blue-100 text-blue-900 border-blue-300',
        };
      case 'stock':
        return {
          icon: 'warning',
          color: 'bg-amber-100 text-amber-900 border-amber-300',
        };
      default:
        return {
          icon: 'notifications',
          color: 'bg-gray-100 text-gray-800 border-gray-300',
        };
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white border border-[#c1c9be] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#164525] text-[28px]">
              notifications_active
            </span>
            <h1 className="font-['Montserrat'] text-[22px] font-bold text-[#2b1700]">
              Notifications & Alertes de l'Exploitation
            </h1>
          </div>
          <p className="text-[13px] text-[#717970] mt-1">
            Recevez les alertes de commandes en direct, les versements d'acomptes et les rappels de calendrier cultural.
          </p>
        </div>

        <button
          onClick={onMarkAllAsRead}
          className="text-[#164525] border border-[#164525] text-[13px] font-semibold px-4 py-2 rounded-full hover:bg-[#164525]/10 transition-colors cursor-pointer self-start sm:self-auto"
        >
          Tout marquer comme lu
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-[#c1c9be] rounded-2xl overflow-hidden shadow-sm divide-y divide-[#c1c9be]/40">
        {notifications.map((notif) => {
          const { icon, color } = getIconAndColor(notif.type);

          return (
            <div
              key={notif.id}
              onClick={() => onMarkAsRead(notif.id)}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                !notif.read ? 'bg-[#FAF8F2]' : 'hover:bg-[#FAF8F2]/60'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${color}`}
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {icon}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[14px] text-[#2b1700]">
                      {notif.titre}
                    </h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#164525]"></span>
                    )}
                  </div>
                  <p className="text-[13px] text-[#414941] mt-0.5 leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="text-[11px] text-[#717970] mt-1 block">
                    {notif.date}
                  </span>
                </div>
              </div>

              {!notif.read && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notif.id);
                  }}
                  className="text-[11px] font-semibold text-[#164525] hover:underline shrink-0"
                >
                  Marquer comme lu
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
