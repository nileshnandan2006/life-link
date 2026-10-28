import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RequestStatusTimeline } from '../components/RequestStatusTimeline';
import { 
  getUrgencyBadge, 
  maskPhoneNumber, 
  isBloodCompatible, 
  getCompatibilityLabel 
} from '../utils/bloodCompatibility';
import { 
  Droplet, 
  MapPin, 
  Clock, 
  Phone, 
  Building2, 
  User, 
  ShieldCheck, 
  Share2, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  MessageSquare, 
  Send,
  AlertTriangle,
  HeartHandshake,
  AlertCircle
} from 'lucide-react';

export const RequestDetailView: React.FC = () => {
  const { 
    selectedRequestId, 
    requests, 
    setActiveView, 
    currentUser, 
    currentDonorProfile,
    donorProfiles,
    respondToRequest,
    acceptDonorResponse,
    markRequestFulfilled,
    cancelRequest,
    showToast,
    setIsReportModalOpen
  } = useApp();

  const [etaInput, setEtaInput] = useState<number>(25);
  const [responseMsg, setResponseMsg] = useState('');
  const [showResponseModal, setShowResponseModal] = useState(false);

  const request = requests.find(r => r.id === selectedRequestId) || requests[0];

  if (!request) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <p className="text-slate-500">Request not found.</p>
        <button 
          onClick={() => setActiveView('requests')}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold"
        >
          Back to Requests
        </button>
      </div>
    );
  }

  const urgencyMeta = getUrgencyBadge(request.urgency);
  const isRequester = currentUser?.id === request.requesterId || currentUser?.role === 'requester';
  const isDonor = currentUser?.role === 'donor';
  const hasDonorResponded = request.donorResponses.some(r => r.donorId === currentUser?.id);

  // Compatible nearby donors
  const matchingDonors = donorProfiles.filter(d => 
    isBloodCompatible(d.bloodGroup, request.bloodGroup) && d.availability !== 'temp_unavailable'
  );

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `🚨 EMERGENCY BLOOD NEEDED: ${request.unitsNeeded} units of ${request.bloodGroup} at ${request.hospitalName}, ${request.city}. Patient: ${request.patientName}. Contact: ${request.contactNumber}`
      );
      showToast({
        type: 'info',
        title: 'Emergency Details Copied',
        message: 'Shareable emergency blood alert text copied to clipboard.'
      });
    }
  };

  const handleSendDonorResponse = () => {
    respondToRequest(request.id, etaInput, responseMsg);
    setShowResponseModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fadeIn">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => setActiveView('requests')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Requests
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50"
          >
            <Share2 className="w-4 h-4 text-red-600" />
            Share Emergency Call
          </button>

          {isRequester && request.status !== 'fulfilled' && request.status !== 'cancelled' && (
            <>
              <button
                onClick={() => markRequestFulfilled(request.id)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 rounded-xl shadow-sm"
              >
                <CheckCircle className="w-4 h-4" />
                Mark Fulfilled
              </button>
              <button
                onClick={() => cancelRequest(request.id)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl"
              >
                <XCircle className="w-4 h-4" />
                Cancel Request
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Request Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${urgencyMeta.lightBg}`}>
                {urgencyMeta.pulse && <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>}
                {urgencyMeta.label}
              </span>
              <span className="text-xs font-medium text-slate-400">
                Created {new Date(request.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({new Date(request.createdAt).toLocaleDateString()})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Emergency Need: {request.unitsNeeded} Unit{request.unitsNeeded > 1 ? 's' : ''} of Blood
            </h1>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                <User className="w-4 h-4 text-slate-400" />
                Patient: {request.patientName} {request.patientAge ? `(${request.patientAge}y)` : ''}
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-red-500" />
                {request.hospitalName}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {request.area}, {request.city}
              </span>
            </div>
          </div>

          {/* Blood Group Display Box */}
          <div className="flex items-center gap-4 bg-red-50/70 p-4 rounded-2xl border border-red-100 self-start">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white flex flex-col items-center justify-center font-black text-2xl shadow-lg shadow-red-600/20">
              <span>{request.bloodGroup}</span>
            </div>
            <div>
              <p className="text-xs uppercase font-extrabold text-red-800 tracking-wider">Required Group</p>
              <p className="text-sm font-bold text-slate-900">{request.unitsNeeded} Unit(s) needed</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Compatible with: O-, {request.bloodGroup}</p>
            </div>
          </div>
        </div>

        {/* Contact & Notes Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Emergency Attendant Contact
            </span>
            <div className="mt-1 flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-600" />
              <a 
                href={`tel:${request.contactNumber}`} 
                className="text-sm font-bold text-slate-900 hover:text-red-700 underline"
              >
                {request.contactNumber}
              </a>
            </div>
            {request.alternateContact && (
              <p className="text-xs text-slate-500 mt-1">
                Alt: {request.alternateContact}
              </p>
            )}
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Hospital Address & Desk
            </span>
            <p className="text-xs font-semibold text-slate-800 mt-1">
              {request.hospitalAddress}
            </p>
            <p className="text-[11px] text-slate-500">
              Report to Blood Bank / ICU Reception
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Medical Notes / Instructions
            </span>
            <p className="text-xs text-slate-700 mt-1 italic">
              "{request.notes || 'No additional instructions provided. Immediate donor presence requested.'}"
            </p>
          </div>
        </div>

        {/* Donor CTA Banner if viewing as donor and request is active */}
        {isDonor && request.status !== 'fulfilled' && request.status !== 'cancelled' && (
          <div className="my-6 p-5 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-red-600/20">
            <div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-yellow-300" />
                <h3 className="font-extrabold text-base">You can save this life right now!</h3>
              </div>
              <p className="text-xs text-red-100 mt-1">
                Your profile matches blood requirements for {request.patientName}. Let the hospital attendant know you are coming.
              </p>
            </div>

            {hasDonorResponded ? (
              <span className="px-5 py-2.5 rounded-xl bg-white/20 text-white font-bold text-xs flex items-center gap-2 border border-white/30">
                <CheckCircle className="w-4 h-4 text-emerald-300" />
                You have already pledged assistance!
              </span>
            ) : (
              <button
                onClick={() => setShowResponseModal(true)}
                className="px-6 py-3 rounded-xl bg-white text-red-700 hover:bg-red-50 font-extrabold text-xs uppercase tracking-wider shadow-md shrink-0 transition-transform active:scale-95"
              >
                I Can Donate (Pledge Now)
              </button>
            )}
          </div>
        )}

        {/* Live Timeline Component */}
        <div className="mt-6">
          <RequestStatusTimeline request={request} />
        </div>
      </div>

      {/* Donor Responses Received Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-red-600" />
              Donor Responses Received ({request.donorResponses.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified donors who have responded and are coordinating donation.
            </p>
          </div>
        </div>

        {request.donorResponses.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2 animate-pulse" />
            <p className="text-sm font-semibold text-slate-700">Waiting for first donor response</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Alerts have been sent to {matchingDonors.length} nearby donors. Responses typically arrive within 10–25 minutes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {request.donorResponses.map(resp => (
              <div 
                key={resp.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-red-200 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-extrabold flex items-center justify-center text-sm shadow">
                      {resp.donorBloodGroup}
                    </div>
                    <div>
                      <p className="font-extrabold text-sm text-slate-900">{resp.donorName}</p>
                      <p className="text-xs text-slate-500">
                        Approx. {resp.donorDistanceKm} km away • ETA {resp.etaMinutes} mins
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    resp.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {resp.status}
                  </span>
                </div>

                {resp.message && (
                  <p className="text-xs text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-100">
                    "{resp.message}"
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <a
                    href={`tel:${resp.donorPhone}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 hover:text-red-800"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call Donor ({resp.donorPhone})
                  </a>

                  {isRequester && resp.status !== 'accepted' && (
                    <button
                      onClick={() => acceptDonorResponse(request.id, resp.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                    >
                      Confirm / Coordinate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Potential Donors Directory in Proximity */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-red-600" />
            Nearby Compatible Donors In Vicinity ({matchingDonors.length})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Privacy Protected: Exact residential addresses are hidden. Distances are approximate.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {matchingDonors.map(donor => {
            const compat = getCompatibilityLabel(donor.bloodGroup, request.bloodGroup);
            return (
              <div 
                key={donor.userId}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-red-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-9 h-9 rounded-xl bg-red-100 text-red-800 font-extrabold text-sm flex items-center justify-center">
                      {donor.bloodGroup}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      {compat.badgeText}
                    </span>
                  </div>

                  <p className="font-bold text-sm text-slate-900">
                    Donor #{donor.userId.slice(-4).toUpperCase()}
                  </p>
                  <p className="text-xs text-slate-500">
                    Approx. {donor.approxDistanceKm} km away • {donor.area}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {donor.badges.map((b, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Verified Donor</span>
                  <button
                    onClick={() => {
                      showToast({
                        type: 'info',
                        title: 'Emergency Ping Sent',
                        message: `LifeLink alerted Donor #${donor.userId.slice(-4).toUpperCase()} via emergency SMS.`
                      });
                    }}
                    className="text-red-600 font-bold hover:underline"
                  >
                    Ping Donor &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Medical Safety Disclaimer Callout */}
      <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 text-slate-600 text-xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-slate-800">Hospital Medical Verification Policy</p>
          <p className="mt-0.5 leading-relaxed">
            LifeLink does not certify medical donor eligibility. Before blood collection, hospital staff must perform mandatory blood grouping, antibody screening, cross-matching, hemoglobin check, and infectious disease markers according to national blood safety protocols.
          </p>
        </div>
      </div>

      {/* Donor Response Modal */}
      {showResponseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-red-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-red-600" />
                Pledge Blood Donation
              </h3>
              <button 
                onClick={() => setShowResponseModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              You are responding to donate for <strong>{request.patientName}</strong> at <strong>{request.hospitalName}</strong>.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Estimated Arrival Time (ETA)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[15, 30, 45, 60].map(mins => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setEtaInput(mins)}
                    className={`py-2 rounded-xl text-xs font-bold border ${
                      etaInput === mins ? 'bg-red-600 text-white border-red-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {mins} mins
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Message to Patient Attendant (Optional)
              </label>
              <textarea
                rows={3}
                value={responseMsg}
                onChange={(e) => setResponseMsg(e.target.value)}
                placeholder="e.g. I am in Manhattan and can arrive by 4:00 PM. Please wait for me at the blood bank."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
              ⚠️ Please ensure you have had adequate water, food, and are feeling well prior to donation.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResponseModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSendDonorResponse}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md"
              >
                Submit Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
