import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  AlertTriangle, 
  PhoneCall, 
  Check, 
  X, 
  HelpCircle, 
  Lock, 
  Heart, 
  FileText,
  AlertCircle
} from 'lucide-react';

export const HelpSafetyView: React.FC = () => {
  const { setIsReportModalOpen } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase">
          <ShieldCheck className="w-4 h-4 text-red-600" />
          Safety, Governance & Clinical Standards
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Help & Donor Safety Guidelines
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Everything you need to know about donor medical pre-requisites, safety policies, patient confidentiality, and emergency hotlines.
        </p>
      </div>

      {/* Emergency Hotlines Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-red-600 text-white shadow-md space-y-1">
          <p className="text-[11px] uppercase font-bold text-red-200">National Emergency Services</p>
          <p className="text-2xl font-black">911 / 112</p>
          <p className="text-xs text-red-100">Immediate Ambulance & Trauma Dispatch</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-md space-y-1">
          <p className="text-[11px] uppercase font-bold text-slate-400">National Blood Helpline</p>
          <p className="text-2xl font-black">1-800-RED-CROSS</p>
          <p className="text-xs text-slate-400">Blood Bank Supply Coordination</p>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-700 text-white shadow-md space-y-1">
          <p className="text-[11px] uppercase font-bold text-emerald-200">LifeLink Safety Desk</p>
          <p className="text-2xl font-black">1-800-LIFELINK</p>
          <p className="text-xs text-emerald-100">Fraud Reporting & Verification</p>
        </div>
      </div>

      {/* Donor Eligibility Checklist */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600" />
            General Donor Medical Eligibility Checklist
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Volunteers must fulfill these clinical criteria before donating at the hospital.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Can Donate */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
            <h3 className="font-extrabold text-sm text-emerald-900 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              Who CAN Donate Blood
            </h3>
            <ul className="text-xs text-slate-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                Age between 18 and 65 years old (subject to national guidelines).
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                Weight at least 50 kg (110 lbs).
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                Hemoglobin count of at least 12.5 g/dL for females and 13.0 g/dL for males.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                At least 3 months (90 days) since previous whole blood donation.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                Well-hydrated and feeling healthy on the day of donation.
              </li>
            </ul>
          </div>

          {/* Cannot Donate */}
          <div className="p-5 rounded-2xl bg-red-50/60 border border-red-200 space-y-3">
            <h3 className="font-extrabold text-sm text-red-900 flex items-center gap-1.5">
              <X className="w-4 h-4 text-red-600 stroke-[3]" />
              Who CANNOT Donate Temporarily / Permanently
            </h3>
            <ul className="text-xs text-slate-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                Current cold, fever, flu, or active infection.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                Recent tattoo or body piercing within the last 6 months.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                Pregnancy or currently breastfeeding within last 6 months.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                History of viral hepatitis (B or C) or HIV.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                Major surgery within the last 6 to 12 months.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Safety, Privacy & Zero Commercialization Policy */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-slate-700" />
          Strict Voluntary Policy & Anti-Commercialization
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          LifeLink strictly enforces voluntary, non-remunerated blood donation principles endorsed by the World Health Organization (WHO). It is illegal to buy or sell human blood. Any user soliciting monetary compensation for blood donation will be permanently banned and reported to regulatory authorities.
        </p>

        <div className="pt-2">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
          >
            <AlertCircle className="w-4 h-4 text-amber-600" />
            Report Suspicious User or False Request
          </button>
        </div>
      </div>
    </div>
  );
};
