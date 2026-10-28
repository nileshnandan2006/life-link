import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BloodGroup, UrgencyLevel } from '../types';
import { isBloodCompatible, calculateDistanceKm, getCompatibilityLabel } from '../utils/bloodCompatibility';
import { 
  AlertTriangle, 
  X, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Droplet, 
  Building2, 
  Clock, 
  Phone, 
  User, 
  ShieldCheck, 
  Users, 
  Sparkles,
  MapPin
} from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const EmergencyRequestWizard: React.FC = () => {
  const { 
    isEmergencyModalOpen, 
    setIsEmergencyModalOpen, 
    createEmergencyRequest, 
    donorProfiles, 
    hospitals, 
    selectedCity,
    currentUser,
    setSelectedRequestId,
    setActiveView
  } = useApp();

  const [step, setStep] = useState<number>(1);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<number | ''>('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('B+');
  const [unitsNeeded, setUnitsNeeded] = useState<number>(2);
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');
  const [city, setCity] = useState(selectedCity);
  const [area, setArea] = useState('Manhattan Medical District');
  const [urgency, setUrgency] = useState<UrgencyLevel>('critical');
  const [contactNumber, setContactNumber] = useState(currentUser?.phone || '+1 (555) 234-8901');
  const [alternateContact, setAlternateContact] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchAnimationPhase, setSearchAnimationPhase] = useState<'idle' | 'searching' | 'done'>('idle');
  const [matchingDonorsCount, setMatchingDonorsCount] = useState(0);

  if (!isEmergencyModalOpen) return null;

  // Real-time compatible donors calculation
  const compatibleDonors = donorProfiles.filter(donor => {
    return isBloodCompatible(donor.bloodGroup, bloodGroup) && donor.availability !== 'temp_unavailable';
  });

  const handleSelectHospital = (hosp: typeof hospitals[0]) => {
    setHospitalName(hosp.name);
    setHospitalAddress(hosp.address);
    setCity(hosp.city);
    setArea(hosp.area);
  };

  const handleNext = () => {
    if (step === 1 && !patientName.trim()) {
      alert('Please enter patient name or identifier.');
      return;
    }
    if (step === 2 && !hospitalName.trim()) {
      alert('Please enter or select hospital name.');
      return;
    }
    if (step === 3 && !contactNumber.trim()) {
      alert('Please enter an emergency contact number.');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSearchAnimationPhase('searching');

    // Fast search animation for emergency drama & satisfaction
    setTimeout(() => {
      const created = createEmergencyRequest({
        patientName,
        patientAge: patientAge ? Number(patientAge) : undefined,
        bloodGroup,
        unitsNeeded,
        hospitalName: hospitalName || 'Metro General Hospital',
        hospitalAddress: hospitalAddress || 'Medical Center Drive',
        city,
        area,
        urgency,
        contactNumber,
        alternateContact,
        notes
      });

      setMatchingDonorsCount(compatibleDonors.length);
      setSearchAnimationPhase('done');

      setTimeout(() => {
        setIsSubmitting(false);
        setIsEmergencyModalOpen(false);
        setSelectedRequestId(created.id);
        setActiveView('request-detail');
        // Reset form
        setStep(1);
        setSearchAnimationPhase('idle');
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-red-100 overflow-hidden relative">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-6 relative">
          <button 
            onClick={() => setIsEmergencyModalOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
            <span className="text-xs uppercase tracking-widest font-extrabold text-red-200">
              Immediate Medical Priority
            </span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2.5">
            <AlertTriangle className="w-7 h-7 text-yellow-300" />
            Emergency Blood Request
          </h2>
          <p className="text-red-100 text-xs sm:text-sm mt-1 max-w-lg">
            Rapidly connect with nearby verified blood donors. Every second counts.
          </p>

          {/* Stepper Progress */}
          <div className="mt-6 flex items-center justify-between text-xs font-semibold text-red-200">
            {['1. Patient & Group', '2. Hospital & Location', '3. Urgency & Units', '4. Review & Broadcast'].map((title, idx) => {
              const stepNum = idx + 1;
              const isActive = step === stepNum;
              const isPast = step > stepNum;
              return (
                <div key={title} className="flex flex-col items-center flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isActive ? 'bg-white text-red-700 shadow-md ring-4 ring-white/30' : isPast ? 'bg-red-400 text-white' : 'bg-red-800/80 text-red-300'
                  }`}>
                    {isPast ? <Check className="w-4 h-4 stroke-[3]" /> : stepNum}
                  </div>
                  <span className={`text-[10px] mt-1 text-center hidden sm:block ${isActive ? 'text-white font-bold' : 'text-red-200/80'}`}>
                    {title.split('. ')[1]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Searching Animation Overlay */}
        {searchAnimationPhase !== 'idle' && (
          <div className="p-8 text-center bg-white flex flex-col items-center justify-center min-h-[360px]">
            {searchAnimationPhase === 'searching' ? (
              <div className="space-y-4">
                <div className="relative w-24 h-24 mx-auto">
                  <div className="w-24 h-24 rounded-full border-4 border-red-200 border-t-red-600 animate-spin"></div>
                  <Droplet className="w-10 h-10 text-red-600 absolute inset-0 m-auto animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Searching for Donors...</h3>
                <p className="text-sm text-slate-500 max-w-sm">
                  Scanning verified donors within a 10 km radius for compatible blood group <span className="font-bold text-red-600">{bloodGroup}</span>...
                </p>
              </div>
            ) : (
              <div className="space-y-4 animate-scaleUp">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <Sparkles className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  {matchingDonorsCount} Potential Donors Found!
                </h3>
                <p className="text-sm text-slate-600 max-w-sm">
                  Emergency notifications dispatched to compatible local donors within 5 km. Opening request tracker...
                </p>
              </div>
            )}
          </div>
        )}

        {/* Wizard Form Steps */}
        {searchAnimationPhase === 'idle' && (
          <div className="p-6 sm:p-8">
            {/* STEP 1: PATIENT & BLOOD GROUP */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-red-600" />
                    Patient Information & Blood Type
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Specify the patient identity and exact blood group required.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Patient Name / Medical Identifier *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe (ICU Bed 3)"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Age (Optional)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 35"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Blood Group Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Required Blood Group *
                  </label>
                  <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                    {BLOOD_GROUPS.map((group) => {
                      const isSelected = bloodGroup === group;
                      return (
                        <button
                          key={group}
                          type="button"
                          onClick={() => setBloodGroup(group)}
                          className={`py-3.5 px-3 rounded-2xl font-extrabold text-base sm:text-lg transition-all flex flex-col items-center justify-center border-2 ${
                            isSelected
                              ? 'bg-red-600 text-white border-red-700 shadow-md shadow-red-500/25 scale-[1.03]'
                              : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-red-300 hover:bg-red-50/50'
                          }`}
                        >
                          <span>{group}</span>
                          <span className={`text-[10px] font-normal uppercase tracking-wider mt-0.5 ${
                            isSelected ? 'text-red-100' : 'text-slate-400'
                          }`}>
                            {group.includes('+') ? 'Positive' : 'Negative'}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Compatibility Live Hint */}
                  <div className="mt-3 p-3 bg-red-50 rounded-xl border border-red-100 flex items-center justify-between text-xs text-red-800">
                    <div className="flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-red-600 shrink-0" />
                      <span>
                        Can receive from: <span className="font-bold">{bloodGroup === 'AB+' ? 'All Blood Groups (Universal Recipient)' : bloodGroup}</span> compatible donors
                      </span>
                    </div>
                    <span className="font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full text-[11px]">
                      {compatibleDonors.length} nearby donors eligible
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: HOSPITAL & LOCATION */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-red-600" />
                    Hospital & Delivery Location
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select a hospital or type the exact facility where blood is needed.
                  </p>
                </div>

                {/* Quick Hospital Suggestions */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Quick Select Nearby Hospitals
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                    {hospitals.map(h => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => handleSelectHospital(h)}
                        className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                          hospitalName === h.name 
                            ? 'border-red-500 bg-red-50 text-red-900 font-semibold' 
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <p className="font-bold truncate">{h.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{h.address}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Hospital Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Metro General Trauma Center"
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Hospital Street Address
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 520 1st Avenue, Manhattan"
                      value={hospitalAddress}
                      onChange={(e) => setHospitalAddress(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Area / Neighborhood
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Medical District"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: URGENCY & UNITS & CONTACT */}
            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-red-600" />
                    Urgency, Units & Contact
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Help donors prioritize response times based on medical urgency.
                  </p>
                </div>

                {/* Urgency Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Medical Urgency Level *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setUrgency('critical')}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                        urgency === 'critical'
                          ? 'border-red-600 bg-red-50/70 shadow-md ring-2 ring-red-500/20'
                          : 'border-slate-200 hover:border-red-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-red-600 font-bold text-xs uppercase mb-1">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                        Critical
                      </div>
                      <p className="font-extrabold text-sm text-slate-900">Needed Immediately</p>
                      <p className="text-[11px] text-slate-500 mt-1">Within 30–60 mins (Surgery/Trauma)</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setUrgency('urgent')}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                        urgency === 'urgent'
                          ? 'border-amber-500 bg-amber-50/70 shadow-md ring-2 ring-amber-500/20'
                          : 'border-slate-200 hover:border-amber-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-amber-600 font-bold text-xs uppercase mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        Urgent
                      </div>
                      <p className="font-extrabold text-sm text-slate-900">Within a Few Hours</p>
                      <p className="text-[11px] text-slate-500 mt-1">Needed within 2–6 hours</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setUrgency('normal')}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                        urgency === 'normal'
                          ? 'border-blue-600 bg-blue-50/70 shadow-md ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-blue-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase mb-1">
                        <Check className="w-3.5 h-3.5" />
                        Normal
                      </div>
                      <p className="font-extrabold text-sm text-slate-900">Needed Today</p>
                      <p className="text-[11px] text-slate-500 mt-1">Scheduled before end of day</p>
                    </button>
                  </div>
                </div>

                {/* Units Needed */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Blood Units Required (Bags) *
                    </label>
                    <span className="text-xs font-extrabold text-red-600">{unitsNeeded} Unit(s)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4, 5, 6].map(u => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setUnitsNeeded(u)}
                        className={`flex-1 py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${
                          unitsNeeded === u
                            ? 'bg-red-600 text-white border-red-600 shadow'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact numbers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Attendant Contact Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Alternate / Hospital Phone
                    </label>
                    <input
                      type="tel"
                      value={alternateContact}
                      onChange={(e) => setAlternateContact(e.target.value)}
                      placeholder="e.g. Nurse Station / Doctor"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Optional Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Optional Medical Notes / Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Patient is in Room 402, please report directly to 2nd floor blood bank reception with ID."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-xs font-medium"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW & CONFIRM */}
            {step === 4 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    Review Emergency Request Summary
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Please confirm the details before broadcasting emergency alerts.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">Patient</span>
                      <span className="font-extrabold text-sm text-slate-900">{patientName}</span>
                      {patientAge && <span className="text-slate-500 text-xs"> ({patientAge} years old)</span>}
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">Required Blood Group</span>
                      <span className="inline-flex items-center gap-1.5 text-base font-black text-red-600">
                        <Droplet className="w-4 h-4 fill-red-600" />
                        {bloodGroup} ({unitsNeeded} Unit{unitsNeeded > 1 ? 's' : ''})
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">Hospital</span>
                      <span className="font-bold text-slate-800">{hospitalName}</span>
                      <span className="text-slate-500 block text-[11px]">{hospitalAddress}, {city}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">Urgency</span>
                      <span className={`inline-block font-extrabold px-2.5 py-1 rounded-full text-[11px] uppercase tracking-wider ${
                        urgency === 'critical' ? 'bg-red-100 text-red-700' : urgency === 'urgent' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {urgency} Priority
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">Contact</span>
                      <span className="font-bold text-slate-800">{contactNumber}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">Matching Pool</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                        {compatibleDonors.length} Donors nearby
                      </span>
                    </div>
                  </div>
                </div>

                {/* Important Medical Disclaimer Warning Box */}
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong className="font-semibold">Medical Verification Notice:</strong> LifeLink coordinates potential donors. The hospital/blood bank retains full responsibility for donor cross-matching, hemoglobin screening, and final transfusion safety.
                  </p>
                </div>
              </div>
            )}

            {/* Modal Actions Footer */}
            <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(prev => prev - 1)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEmergencyModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-500 font-semibold text-xs hover:text-slate-700"
                >
                  Cancel
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-red-500/20 transition-all"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-7 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <AlertTriangle className="w-4 h-4 fill-white text-red-600" />
                  Confirm & Dispatch Request
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
