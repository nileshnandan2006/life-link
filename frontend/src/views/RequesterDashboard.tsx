import React from 'react';
import { useApp } from '../context/AppContext';
import { getUrgencyBadge } from '../utils/bloodCompatibility';
import { 
  AlertTriangle, 
  Plus, 
  Droplet, 
  Clock, 
  Building2, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Users, 
  Share2,
  PhoneCall,
  Activity
} from 'lucide-react';

export const RequesterDashboard: React.FC = () => {
  const { 
    currentUser, 
    requests, 
    setIsEmergencyModalOpen, 
    setSelectedRequestId, 
    setActiveView,
    markRequestFulfilled,
    cancelRequest,
    showToast
  } = useApp();

  // Requests created by this requester or general active requests
  const myRequests = requests.filter(r => r.requesterId === currentUser?.id || currentUser?.role === 'requester');

  const activeRequests = myRequests.filter(r => r.status !== 'fulfilled' && r.status !== 'cancelled');
  const pastRequests = myRequests.filter(r => r.status === 'fulfilled' || r.status === 'cancelled');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Hero Card with Prominent Action */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
            <span className="text-xs uppercase font-extrabold tracking-wider text-red-200">
              Patient Attendant Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Emergency Blood Requester Desk
          </h1>
          <p className="text-xs sm:text-sm text-red-100 max-w-xl">
            Logged in as <strong>{currentUser?.name || 'Dr. Sarah Chen'}</strong>. Manage active transfusions, monitor donor responses, and trigger emergency broadcasts in seconds.
          </p>
        </div>

        {/* Big Prominent Emergency Button */}
        <button
          onClick={() => setIsEmergencyModalOpen(true)}
          className="pulse-emergency bg-white text-red-700 hover:bg-red-50 font-black text-sm uppercase tracking-wider px-6 py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 shrink-0 transition-transform active:scale-95"
        >
          <AlertTriangle className="w-5 h-5 fill-red-600 text-white animate-bounce" />
          CREATE EMERGENCY REQUEST
        </button>
      </div>

      {/* Active Requests List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-600" />
              Active Emergency Requests ({activeRequests.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live tracking status and inbound donor pledges.
            </p>
          </div>
        </div>

        {activeRequests.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
            <Droplet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No active requests</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You do not have any pending emergency blood requests right now.
            </p>
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="mt-4 px-5 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold shadow-md"
            >
              Request Blood Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {activeRequests.map(req => {
              const urgencyMeta = getUrgencyBadge(req.urgency);
              return (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl p-6 border-2 border-red-200/80 shadow-md hover:border-red-400 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-red-600 text-white font-black text-lg flex items-center justify-center shadow">
                        {req.bloodGroup}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${urgencyMeta.lightBg}`}>
                            {urgencyMeta.shortLabel} Priority
                          </span>
                          <span className="text-xs font-bold text-slate-400">
                            ID: #{req.id}
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                          {req.patientName} • {req.unitsNeeded} Unit(s) Needed
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => markRequestFulfilled(req.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                      >
                        Mark Fulfilled
                      </button>
                      <button
                        onClick={() => cancelRequest(req.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  {/* Summary & Donor responses */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Hospital Facility</span>
                      <p className="font-bold text-slate-900 mt-0.5">{req.hospitalName}</p>
                      <p className="text-[11px] text-slate-500">{req.hospitalAddress}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Status</span>
                      <p className="font-extrabold text-red-700 uppercase mt-0.5">
                        {req.status.replace('_', ' ')}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {req.donorResponses.length} donor response(s) logged
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Contact Desk</span>
                      <p className="font-bold text-slate-900 mt-0.5">{req.contactNumber}</p>
                      <p className="text-[11px] text-slate-500">Report desk: Blood bank reception</p>
                    </div>
                  </div>

                  {/* Action Link to Full Tracker */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-400">
                      Last updated {new Date(req.updatedAt).toLocaleTimeString()}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedRequestId(req.id);
                        setActiveView('request-detail');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-red-600 hover:text-red-800"
                    >
                      Open Live Request Tracker & Responses &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past Closed Requests */}
      {pastRequests.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-slate-200">
          <h3 className="text-base font-bold text-slate-700">
            Past Completed / Closed Requests ({pastRequests.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastRequests.map(req => (
              <div 
                key={req.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900">{req.patientName} ({req.bloodGroup})</p>
                  <p className="text-slate-500">{req.hospitalName} • {new Date(req.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                  req.status === 'fulfilled' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
