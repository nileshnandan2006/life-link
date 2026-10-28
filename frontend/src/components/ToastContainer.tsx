import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, CheckCircle, Info, XCircle, AlertCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4">
      {toasts.map(toast => {
        const isEmergency = toast.type === 'emergency';
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        let icon = <Info className="w-5 h-5 text-blue-500 shrink-0" />;
        let borderClass = 'border-slate-200 bg-white';

        if (isEmergency) {
          icon = <AlertTriangle className="w-5 h-5 text-white animate-bounce shrink-0" />;
          borderClass = 'border-red-600 bg-red-600 text-white shadow-xl shadow-red-500/30';
        } else if (isSuccess) {
          icon = <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />;
          borderClass = 'border-emerald-200 bg-emerald-50 text-emerald-900';
        } else if (isWarning) {
          icon = <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />;
          borderClass = 'border-amber-200 bg-amber-50 text-amber-900';
        } else if (isError) {
          icon = <XCircle className="w-5 h-5 text-red-500 shrink-0" />;
          borderClass = 'border-red-200 bg-red-50 text-red-900';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl p-4 shadow-lg border transition-all duration-300 flex items-start justify-between gap-3 ${borderClass}`}
          >
            <div className="flex items-start gap-3">
              {icon}
              <div>
                <p className={`font-semibold text-sm ${isEmergency ? 'text-white' : ''}`}>
                  {toast.title}
                </p>
                <p className={`text-xs mt-0.5 leading-relaxed ${isEmergency ? 'text-red-100' : 'text-slate-600'}`}>
                  {toast.message}
                </p>
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className={`p-1 rounded-lg hover:opacity-75 transition-opacity ${isEmergency ? 'text-white' : 'text-slate-400'}`}
              title="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
