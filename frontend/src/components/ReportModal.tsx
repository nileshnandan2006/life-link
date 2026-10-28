import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ReportedUser } from '../types';
import { AlertCircle, X, ShieldAlert } from 'lucide-react';

export const ReportModal: React.FC = () => {
  const { isReportModalOpen, setIsReportModalOpen, fileReport, users } = useApp();
  const [targetUserId, setTargetUserId] = useState(users[1]?.id || 'user-donor-1');
  const [reason, setReason] = useState<ReportedUser['reason']>('inappropriate');
  const [details, setDetails] = useState('');

  if (!isReportModalOpen) return null;

  const targetUser = users.find(u => u.id === targetUserId) || users[1];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) {
      alert('Please describe the issue.');
      return;
    }
    fileReport(targetUserId, targetUser?.name || 'User', reason, details);
    setIsReportModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden relative animate-fadeIn">
        <div className="bg-amber-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-yellow-300" />
            <h3 className="font-extrabold text-base">Report User or Abuse</h3>
          </div>
          <button 
            onClick={() => setIsReportModalOpen(false)}
            className="p-1 rounded-full bg-white/20 text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Select User to Report
            </label>
            <select
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role}) - {u.phone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Reason for Report *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
            >
              <option value="false_request">False / Hoax Blood Request</option>
              <option value="inappropriate">Commercialization (Selling Blood)</option>
              <option value="unreachable">Unreachable during scheduled emergency</option>
              <option value="fraud">Fraudulent / Phishing attempt</option>
              <option value="other">Other Violation</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Details & Evidence *
            </label>
            <textarea
              rows={3}
              required
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe the incident so our compliance team can review..."
              className="w-full p-2.5 rounded-xl border border-slate-300"
            />
          </div>

          <div className="p-3 bg-red-50 text-red-900 rounded-xl border border-red-200 text-[11px]">
            ⚠️ Commercial blood selling is strictly illegal under national law. Accounts engaging in monetary demands will be permanently suspended and forwarded to law enforcement.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(false)}
              className="px-4 py-2 text-slate-600 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-md"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
