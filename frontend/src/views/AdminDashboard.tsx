import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BloodGroup } from '../types';
import { 
  ShieldCheck, 
  Users, 
  Droplet, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Activity, 
  Search, 
  UserX, 
  UserCheck, 
  ShieldAlert,
  BarChart3,
  TrendingUp,
  Hospital,
  Clock
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    users, 
    requests, 
    donorProfiles, 
    reports, 
    toggleUserStatus, 
    verifyUser, 
    resolveReport, 
    updateRequestStatus,
    setSelectedRequestId,
    setActiveView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'users' | 'reports'>('overview');
  const [userSearch, setUserSearch] = useState('');

  // Calculations
  const totalDonors = donorProfiles.length;
  const activeRequests = requests.filter(r => r.status !== 'fulfilled' && r.status !== 'cancelled').length;
  const fulfilledRequests = requests.filter(r => r.status === 'fulfilled').length;
  const cancelledRequests = requests.filter(r => r.status === 'cancelled').length;
  const criticalRequests = requests.filter(r => r.urgency === 'critical').length;
  const pendingReports = reports.filter(r => r.status === 'pending').length;

  // Blood group breakdown
  const bloodGroupCounts: Record<BloodGroup, number> = {
    'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 'AB+': 0, 'AB-': 0, 'O+': 0, 'O-': 0
  };
  donorProfiles.forEach(d => {
    bloodGroupCounts[d.bloodGroup] = (bloodGroupCounts[d.bloodGroup] || 0) + 1;
  });

  const filteredUsers = users.filter(u => {
    if (!userSearch) return true;
    return u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
           u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
           u.phone.includes(userSearch);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400">
              Operations & Medical Governance Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            LifeLink Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Real-time platform oversight, donor verification compliance, emergency triage dispatch, and abuse moderation.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-2xl border border-slate-700 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3 py-2 rounded-xl transition-all ${activeTab === 'requests' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Requests ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-2 rounded-xl transition-all ${activeTab === 'users' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1 ${activeTab === 'reports' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Reports
            {pendingReports > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                {pendingReports}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Donors</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalDonors}</p>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Active pool: 100% verified</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Requests</span>
            <Activity className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-black text-red-600">{activeRequests}</p>
          <span className="text-[10px] text-red-500 font-bold mt-1 block">{criticalRequests} Critical Priority</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fulfilled</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700">{fulfilledRequests}</p>
          <span className="text-[10px] text-slate-400 font-medium mt-1 block">Safe transfusions</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cancelled</span>
            <XCircle className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-black text-slate-600">{cancelledRequests}</p>
          <span className="text-[10px] text-slate-400 font-medium mt-1 block">Resolved off-platform</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Moderation Flags</span>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600">{pendingReports}</p>
          <span className="text-[10px] text-amber-600 font-bold mt-1 block">Requiring review</span>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & BLOOD INVENTORY ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Blood group supply distribution */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-red-600" />
                  Donor Blood Group Distribution & Scarcity Matrix
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live availability of volunteer donors indexed by blood type and Rh factor.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(Object.keys(bloodGroupCounts) as BloodGroup[]).map(group => {
                const count = bloodGroupCounts[group];
                const isUniversal = group === 'O-';
                const isRare = group.includes('-');

                return (
                  <div 
                    key={group}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-9 h-9 rounded-xl bg-red-600 text-white font-extrabold text-sm flex items-center justify-center">
                        {group}
                      </span>
                      {isUniversal && (
                        <span className="text-[9px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded">
                          Univ. Donor
                        </span>
                      )}
                      {isRare && !isUniversal && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                          Rare Group
                        </span>
                      )}
                    </div>
                    <div className="mt-4">
                      <span className="text-2xl font-black text-slate-900">{count}</span>
                      <span className="text-xs text-slate-400 ml-1">donors</span>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="bg-red-600 h-full rounded-full" 
                          style={{ width: `${Math.min(100, (count / 5) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-red-900 text-xs flex items-center justify-between">
              <span className="font-semibold">
                ⚠️ O- (Universal Red Cells) supply alert: Only {bloodGroupCounts['O-']} registered donors in current sector.
              </span>
              <button 
                onClick={() => setActiveView('requests')}
                className="font-bold underline text-red-700 hover:text-red-900"
              >
                Inspect O- Requests &rarr;
              </button>
            </div>
          </div>

          {/* Quick System Health */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Safety & Governance Audit
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600">Privacy Address Masking</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">100% Active</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600">SMS / Voice Gateway</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Operational</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600">Hospital Blood Bank Crosscheck</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Mandatory</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600">Average Critical Response Time</span>
                <span className="font-bold text-slate-900">18.4 Minutes</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REQUEST MANAGEMENT */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">
              Platform Emergency Requests ({requests.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">ID / Patient</th>
                  <th className="py-3 px-3">Blood Group</th>
                  <th className="py-3 px-3">Hospital</th>
                  <th className="py-3 px-3">Urgency</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900">{req.patientName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">#{req.id}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-block px-2 py-0.5 rounded bg-red-100 text-red-800 font-extrabold">
                        {req.bloodGroup} ({req.unitsNeeded}U)
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">
                      {req.hospitalName}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        req.urgency === 'critical' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {req.urgency}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800 uppercase text-[10px]">
                      {req.status}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedRequestId(req.id);
                            setActiveView('request-detail');
                          }}
                          className="text-red-600 font-bold hover:underline"
                        >
                          View
                        </button>
                        {req.status !== 'fulfilled' && (
                          <button
                            onClick={() => updateRequestStatus(req.id, 'fulfilled', 'Admin certified resolution')}
                            className="text-emerald-600 font-bold hover:underline"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: USER MANAGEMENT & SUSPENSION */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base font-extrabold text-slate-900">
              Registered Users & Verification Control ({users.length})
            </h3>
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search user..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">User</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Verification</th>
                  <th className="py-3 px-3">Account Status</th>
                  <th className="py-3 px-3">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <p className="text-[10px] text-slate-400">{u.email}</p>
                    </td>
                    <td className="py-3 px-3 capitalize font-bold text-slate-700">
                      {u.role}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {u.phone}
                    </td>
                    <td className="py-3 px-3">
                      {u.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                          <CheckCircle className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : (
                        <button
                          onClick={() => verifyUser(u.id)}
                          className="text-blue-600 font-bold underline"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`font-bold px-3 py-1 rounded-lg text-[11px] ${
                          u.status === 'active'
                            ? 'text-red-700 bg-red-50 hover:bg-red-100 border border-red-200'
                            : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                      >
                        {u.status === 'active' ? 'Deactivate Account' : 'Reactivate Account'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SAFETY REPORTS */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            Reported User Log & Medical Integrity Reviews
          </h3>

          {reports.length === 0 ? (
            <p className="text-xs text-slate-500">No reports on file.</p>
          ) : (
            <div className="space-y-3">
              {reports.map(rep => (
                <div key={rep.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-slate-900">Reported: {rep.reportedUserName}</span>
                      <span className="text-[10px] text-slate-400 ml-2">Reason: <strong>{rep.reason.toUpperCase()}</strong></span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      rep.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {rep.status}
                    </span>
                  </div>
                  <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200">
                    "{rep.details}"
                  </p>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    {rep.status === 'pending' && (
                      <>
                        <button
                          onClick={() => resolveReport(rep.id, 'dismissed')}
                          className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg font-bold text-xs"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => {
                            resolveReport(rep.id, 'resolved');
                            toggleUserStatus(rep.reportedUserId);
                          }}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg font-bold text-xs"
                        >
                          Suspend User & Resolve
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
