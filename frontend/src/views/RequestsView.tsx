import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BloodGroup, UrgencyLevel, RequestStatus } from '../types';
import { getUrgencyBadge, isBloodCompatible, getCompatibilityLabel } from '../utils/bloodCompatibility';
import { 
  Droplet, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  Building2, 
  Users, 
  CheckCircle,
  Plus
} from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const RequestsView: React.FC = () => {
  const { 
    requests, 
    setSelectedRequestId, 
    setActiveView, 
    setIsEmergencyModalOpen, 
    currentUser, 
    currentDonorProfile,
    selectedCity 
  } = useApp();

  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCompatibleOnly, setFilterCompatibleOnly] = useState(false);

  // Filter logic
  const filteredRequests = requests.filter(req => {
    // City filter (or matches)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchHospital = req.hospitalName.toLowerCase().includes(q);
      const matchPatient = req.patientName.toLowerCase().includes(q);
      const matchArea = req.area.toLowerCase().includes(q);
      if (!matchHospital && !matchPatient && !matchArea) return false;
    }

    if (selectedGroup !== 'all' && req.bloodGroup !== selectedGroup) return false;
    if (selectedUrgency !== 'all' && req.urgency !== selectedUrgency) return false;

    if (selectedStatus === 'active') {
      if (req.status === 'fulfilled' || req.status === 'cancelled') return false;
    } else if (selectedStatus !== 'all') {
      if (req.status !== selectedStatus) return false;
    }

    if (filterCompatibleOnly && currentDonorProfile) {
      if (!isBloodCompatible(currentDonorProfile.bloodGroup, req.bloodGroup)) return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
            <span className="text-xs font-extrabold uppercase tracking-wider text-red-600">
              Live Medical Coordination Queue
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Emergency Blood Requests
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Real-time feed of patients needing urgent blood units. Filter by blood group compatibility or distance.
          </p>
        </div>

        <button
          onClick={() => setIsEmergencyModalOpen(true)}
          className="pulse-emergency bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-2xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 self-start md:self-center transition-all"
        >
          <AlertTriangle className="w-4 h-4 fill-white text-red-600" />
          REQUEST BLOOD NOW
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search text */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by hospital, neighborhood, or patient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Urgency Filter */}
          <div>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Urgency Levels</option>
              <option value="critical">Critical (Immediate)</option>
              <option value="urgent">Urgent (Within hours)</option>
              <option value="normal">Normal (Today)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-red-500"
            >
              <option value="active">Active Requests Only</option>
              <option value="all">All Statuses</option>
              <option value="searching">Searching Donors</option>
              <option value="donor_responded">Donor Responded</option>
              <option value="coordinated">Coordinated</option>
              <option value="fulfilled">Fulfilled</option>
            </select>
          </div>
        </div>

        {/* Blood Group Filter Pill Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Group:
          </span>
          <button
            onClick={() => setSelectedGroup('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedGroup === 'all'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Groups
          </button>
          {BLOOD_GROUPS.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGroup(g)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedGroup === g
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-700'
              }`}
            >
              {g}
            </button>
          ))}

          {currentUser?.role === 'donor' && currentDonorProfile && (
            <button
              onClick={() => setFilterCompatibleOnly(!filterCompatibleOnly)}
              className={`ml-auto px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filterCompatibleOnly 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Only Compatible with my {currentDonorProfile.bloodGroup}
            </button>
          )}
        </div>
      </div>

      {/* Requests Feed Grid */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto">
          <Droplet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No requests match your criteria</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your blood group filter or search keywords.
          </p>
          <button
            onClick={() => { setSelectedGroup('all'); setSelectedUrgency('all'); setSelectedStatus('all'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map(req => {
            const urgencyMeta = getUrgencyBadge(req.urgency);
            const isFulfilled = req.status === 'fulfilled';
            const isCancelled = req.status === 'cancelled';
            const isCompat = currentDonorProfile ? isBloodCompatible(currentDonorProfile.bloodGroup, req.bloodGroup) : true;

            return (
              <div
                key={req.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-red-300 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top tags */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${urgencyMeta.lightBg}`}>
                      {urgencyMeta.pulse && <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>}
                      {urgencyMeta.shortLabel} Priority
                    </span>

                    <span className="text-[11px] font-bold text-slate-400">
                      {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Blood Group and Patient */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white flex flex-col items-center justify-center font-black text-xl shadow-md shadow-red-600/20 shrink-0 group-hover:scale-105 transition-transform">
                      {req.bloodGroup}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 group-hover:text-red-700 transition-colors">
                        {req.unitsNeeded} Unit{req.unitsNeeded > 1 ? 's' : ''} Needed
                      </h3>
                      <p className="text-xs font-semibold text-slate-700 mt-0.5">
                        Patient: {req.patientName}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Requested by: {req.requesterName}
                      </p>
                    </div>
                  </div>

                  {/* Hospital & Area */}
                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="flex items-center gap-2 font-bold text-slate-800 truncate">
                      <Building2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      {req.hospitalName}
                    </p>
                    <p className="flex items-center gap-2 text-slate-500 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {req.area}, {req.city}
                    </p>
                  </div>

                  {/* Status & Responses count */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-semibold text-slate-500 capitalize flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Status: <strong className="text-slate-800">{req.status.replace('_', ' ')}</strong>
                    </span>
                    <span className="font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full text-[11px]">
                      {req.donorResponses.length} Pledges
                    </span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Verified Emergency
                  </span>

                  <button
                    onClick={() => {
                      setSelectedRequestId(req.id);
                      setActiveView('request-detail');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-red-600 hover:text-red-800 group-hover:translate-x-0.5 transition-transform"
                  >
                    View & Respond
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
