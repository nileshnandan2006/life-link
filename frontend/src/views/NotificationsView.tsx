import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Check, 
  ArrowRight, 
  Trash2,
  Droplet
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    setSelectedRequestId, 
    setActiveView 
  } = useApp();

  const handleOpenRequest = (notifId: string, reqId?: string) => {
    markNotificationRead(notifId);
    if (reqId) {
      setSelectedRequestId(reqId);
      setActiveView('request-detail');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-5 h-5 text-red-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Emergency Alerts & Notifications
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Real-time notifications of emergency requests, donor pledges, and coordination updates.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            Mark All Read
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800">Inbox is all clear</h3>
          <p className="text-xs text-slate-500 mt-1">
            You will be alerted immediately if a blood emergency needs attention.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(notif => {
            const isEmergency = notif.type === 'emergency_alert' || notif.urgency === 'critical';
            const isFulfillment = notif.type === 'fulfillment';

            return (
              <div
                key={notif.id}
                className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  !notif.read
                    ? isEmergency
                      ? 'bg-red-50/70 border-red-300 shadow-sm'
                      : 'bg-blue-50/40 border-blue-200 shadow-sm'
                    : 'bg-white border-slate-200 opacity-90'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isEmergency
                      ? 'bg-red-600 text-white animate-pulse'
                      : isFulfillment
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-white'
                  }`}>
                    {isEmergency ? (
                      <AlertTriangle className="w-5 h-5 fill-white text-red-600" />
                    ) : isFulfillment ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Droplet className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`font-bold text-sm ${isEmergency ? 'text-red-950 font-extrabold' : 'text-slate-900'}`}>
                        {notif.title}
                      </h3>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-red-600"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {notif.relatedRequestId && (
                    <button
                      onClick={() => handleOpenRequest(notif.id, notif.relatedRequestId)}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-1 shadow-sm"
                    >
                      View &rarr;
                    </button>
                  )}
                  {!notif.read && (
                    <button
                      onClick={() => markNotificationRead(notif.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
