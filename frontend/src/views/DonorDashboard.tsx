import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DonorAvailability, BloodGroup } from '../types';
import { isBloodCompatible, getUrgencyBadge } from '../utils/bloodCompatibility';
import { 
  Heart, 
  Award, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Edit3, 
  Eye, 
  Droplet,
  FileCheck2,
  ChevronRight,
  Phone
} from 'lucide-react';

export const DonorDashboard: React.FC = () => {
  const { 
    currentUser, 
    currentDonorProfile, 
    requests, 
    donationHistory, 
    updateDonorAvailability, 
    updateDonorProfile,
    setSelectedRequestId, 
    setActiveView,
    setIsEmergencyModalOpen
  } = useApp();

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [donorNotes, setDonorNotes] = useState(currentDonorProfile?.notes || '');
  const [availabilityState, setAvailabilityState] = useState<DonorAvailability>(
    currentDonorProfile?.availability || 'available'
  );

  const handleAvailabilityChange = (status: DonorAvailability) => {
    setAvailabilityState(status);
    updateDonorAvailability(status);
  };

  const handleSaveNotes = () => {
    updateDonorProfile({ notes: donorNotes });
    setIsEditingNotes(false);
  };

  // Find requests compatible with this donor's blood group
  const compatibleRequests = requests.filter(r => {
    if (r.status === 'fulfilled' || r.status === 'cancelled') return false;
    if (!currentDonorProfile) return true;
    return isBloodCompatible(currentDonorProfile.bloodGroup, r.bloodGroup);
  });

  const myDonationHistory = donationHistory.filter(h => h.donorId === currentUser?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Welcome Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white flex flex-col items-center justify-center font-black text-2xl shadow-lg shadow-red-600/20 shrink-0">
            {currentDonorProfile?.bloodGroup || 'O-'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {currentUser?.name}!
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                Verified Donor
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Registered Blood Group: <strong className="text-red-700">{currentDonorProfile?.bloodGroup}</strong> • Area: {currentDonorProfile?.area || 'New York'} • Phone: {currentUser?.phone}
            </p>
          </div>
        </div>

        {/* Real-time Availability Switcher */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 self-start md:self-auto">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 tracking-wider">
            Your Live Availability Status
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => handleAvailabilityChange('available')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                availabilityState === 'available'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white"></span>
              Available
            </button>
            <button
              onClick={() => handleAvailabilityChange('emergency_only')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                availabilityState === 'emergency_only'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Clock className="w-3 h-3" />
              Emergencies Only
            </button>
            <button
              onClick={() => handleAvailabilityChange('temp_unavailable')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                availabilityState === 'temp_unavailable'
                  ? 'bg-slate-700 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Unavailable
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Medical Disclaimer Banner */}
      <div className="bg-amber-50 rounded-2xl p-4 sm:p-5 border-2 border-amber-300 text-amber-950 flex items-start gap-3 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-slate-900">
            Medical Eligibility & Health Self-Check
          </p>
          <p className="leading-relaxed text-amber-900/90">
            LifeLink profile status does <strong>NOT</strong> automatically guarantee medical donation eligibility. Final suitability must always be confirmed on-site by certified blood bank professionals via standard medical screening (hemoglobin test, vital signs, and safety interview).
          </p>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <Droplet className="w-6 h-6 fill-red-600" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Total Donations</p>
            <p className="text-xl font-extrabold text-slate-900">{currentDonorProfile?.totalDonations || 0} Times</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Heart className="w-6 h-6 fill-emerald-600" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Lives Impacted</p>
            <p className="text-xl font-extrabold text-slate-900">{currentDonorProfile?.livesImpacted || 0}+ Patients</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Last Donated</p>
            <p className="text-sm font-extrabold text-slate-900">{currentDonorProfile?.lastDonationDate || 'Not recorded'}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Honors</p>
            <p className="text-sm font-extrabold text-slate-900">{currentDonorProfile?.badges[0] || 'Life Hero'}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Urgent Matching Requests vs Donor History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Urgent Requests Feed for this Donor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Urgent Blood Requests Compatible With Your Group
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing patients who can safely receive your <strong>{currentDonorProfile?.bloodGroup || 'blood'}</strong>
              </p>
            </div>
            <button
              onClick={() => setActiveView('requests')}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              View All &rarr;
            </button>
          </div>

          {compatibleRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">No urgent requests waiting right now</p>
              <p className="text-xs text-slate-500 mt-1">
                You will receive instant emergency sound alerts as soon as an urgent transfusion matches your blood group.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {compatibleRequests.map(req => {
                const urgency = getUrgencyBadge(req.urgency);
                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-red-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-red-600 text-white font-black text-lg flex items-center justify-center shrink-0">
                        {req.bloodGroup}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${urgency.lightBg}`}>
                            {urgency.shortLabel} Priority
                          </span>
                          <span className="text-xs font-bold text-slate-900">{req.unitsNeeded} Unit(s)</span>
                        </div>
                        <p className="text-sm font-extrabold text-slate-900 mt-1">
                          {req.patientName} • {req.hospitalName}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {req.area}, {req.city}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedRequestId(req.id);
                        setActiveView('request-detail');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm self-end sm:self-center"
                    >
                      Pledge Help &rarr;
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Donation History & Badges */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-600" />
              Verified Donation Certificates
            </h3>
            <p className="text-xs text-slate-500">
              Official records validated by hospital blood banks.
            </p>

            <div className="space-y-3">
              {myDonationHistory.map(hist => (
                <div 
                  key={hist.id} 
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900">{hist.hospitalName}</span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {hist.certificateId}
                    </span>
                  </div>
                  <p className="text-slate-600">
                    Donated: <strong>{hist.unitsDonated} unit ({hist.bloodGroup})</strong> on {hist.date}
                  </p>
                  <p className="text-[11px] text-slate-500 italic">
                    "{hist.feedback}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Donor Profile Notes Edit */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">Your Emergency Notes</h4>
              <button
                onClick={() => setIsEditingNotes(!isEditingNotes)}
                className="text-xs text-red-600 font-bold hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                {isEditingNotes ? 'Close' : 'Edit'}
              </button>
            </div>
            {isEditingNotes ? (
              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={donorNotes}
                  onChange={(e) => setDonorNotes(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300"
                />
                <button
                  onClick={handleSaveNotes}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold"
                >
                  Save Notes
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                "{currentDonorProfile?.notes || 'No notes added.'}"
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
