import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BloodGroup } from '../types';
import { 
  RECIPIENT_CAN_RECEIVE_FROM, 
  DONOR_CAN_GIVE_TO, 
  getUrgencyBadge 
} from '../utils/bloodCompatibility';
import { 
  Heart, 
  AlertTriangle, 
  Droplet, 
  ShieldCheck, 
  Clock, 
  Users, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  PhoneCall, 
  Sparkles,
  Search,
  Lock,
  HeartHandshake
} from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const LandingPage: React.FC = () => {
  const { 
    setIsEmergencyModalOpen, 
    setIsAuthModalOpen, 
    setActiveView, 
    requests, 
    donorProfiles, 
    setSelectedRequestId 
  } = useApp();

  const [compatSelectedGroup, setCompatSelectedGroup] = useState<BloodGroup>('O-');

  const activeEmergencies = requests.filter(r => r.urgency === 'critical' && r.status !== 'fulfilled' && r.status !== 'cancelled').slice(0, 3);

  return (
    <div className="space-y-16 py-6 animate-fadeIn">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-red-50/50 via-white to-slate-50 pt-12 pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/80 border border-red-200 text-red-800 text-xs font-extrabold tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                Emergency Healthcare Network
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Find Blood. <br className="hidden sm:inline" />
                Find Hope. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
                  Save a Life.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Connect with eligible blood donors near you during medical emergencies. Reducing discovery time from hours to minutes when every heartbeat matters.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                {/* PRIMARY CTA */}
                <button
                  onClick={() => setIsEmergencyModalOpen(true)}
                  className="pulse-emergency w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-extrabold text-sm sm:text-base px-8 py-4 rounded-2xl shadow-xl shadow-red-600/30 flex items-center justify-center gap-2.5 transition-transform hover:scale-105 active:scale-95"
                >
                  <AlertTriangle className="w-5 h-5 fill-white text-red-600 animate-bounce" />
                  REQUEST BLOOD NOW
                </button>

                {/* SECONDARY CTA */}
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm sm:text-base px-7 py-4 rounded-2xl border-2 border-slate-200 shadow-sm flex items-center justify-center gap-2 hover:border-red-300 transition-all"
                >
                  <Heart className="w-5 h-5 text-red-600 fill-red-50" />
                  Become a Donor
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Certified Blood Bank Compliant
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-slate-400" />
                  100% Privacy-Protected Addresses
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-red-600" />
                  Sub-30 Minute Emergency Response
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Emergency Triage Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xl space-y-6 relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                      <Droplet className="w-5 h-5 fill-red-600" />
                    </div>
                    <div>
                      <h2 className="font-extrabold text-sm text-slate-900">Live Medical Queue</h2>
                      <p className="text-[11px] text-slate-400">Immediate hospital requirements</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase text-red-600 bg-red-50 px-2 py-0.5 rounded-full animate-pulse">
                    LIVE DISPATCH
                  </span>
                </div>

                {/* Feed of active emergency items */}
                <div className="space-y-3">
                  {activeEmergencies.map(req => (
                    <div
                      key={req.id}
                      onClick={() => {
                        setSelectedRequestId(req.id);
                        setActiveView('request-detail');
                      }}
                      className="p-3.5 rounded-2xl bg-slate-50 hover:bg-red-50/50 border border-slate-200/80 hover:border-red-300 transition-all cursor-pointer group flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                          {req.bloodGroup}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-slate-900 group-hover:text-red-700 transition-colors">
                            {req.patientName} ({req.unitsNeeded} Units)
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {req.hospitalName} • {req.area}
                          </p>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>

                {/* Instant Quick Trigger */}
                <div className="pt-2">
                  <button
                    onClick={() => setActiveView('requests')}
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    Explore All Active Requests &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM STATISTICS SECTION (Required by Prompt) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Impact That Saves Lives Every Day
          </h2>
          <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">
            Verified LifeLink Platform Metrics (Demo Data Preview)
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-2 hover:border-red-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-3xl sm:text-4xl font-black text-slate-900">4,820+</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Donors</p>
            <p className="text-[11px] text-slate-400">Ready on call 24/7</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-2 hover:border-red-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 fill-emerald-500" />
            </div>
            <p className="text-3xl sm:text-4xl font-black text-emerald-700">1,290+</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lives Supported</p>
            <p className="text-[11px] text-slate-400">Through quick cross-matches</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-2 hover:border-red-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-3xl sm:text-4xl font-black text-blue-700">3,640+</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Requests Fulfilled</p>
            <p className="text-[11px] text-slate-400">98.4% Emergency fulfillment</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-2 hover:border-red-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <MapPin className="w-6 h-6" />
            </div>
            <p className="text-3xl sm:text-4xl font-black text-amber-700">28 Cities</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Metropolitan Coverage</p>
            <p className="text-[11px] text-slate-400">Hospital coordination hubs</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS RAPID EMERGENCY WORKFLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-xl space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-red-400">
              Emergency Coordination Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              From Request to Transfusion in 3 Steps
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Designed for high-stress medical emergencies with minimal cognitive load.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-black text-sm flex items-center justify-center">
                01
              </div>
              <h3 className="text-base font-extrabold text-white">1. Instant Emergency Broadcast</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Requester clicks "Request Blood Now", picks patient blood group, hospital and urgency. Automated geolocation broadcasts to nearby matching donors.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-black text-sm flex items-center justify-center">
                02
              </div>
              <h3 className="text-base font-extrabold text-white">2. Proximity & Compatibility Match</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Eligible nearby donors receive sound and SMS alerts. Donors accept with estimated arrival time (ETA) and direct masked contact coordination.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
                03
              </div>
              <h3 className="text-base font-extrabold text-white">3. Blood Bank Verification & Donation</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Donation takes place under certified hospital blood bank supervision with standard clinical cross-matching. Once complete, request is marked fulfilled.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE BLOOD COMPATIBILITY CHART */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Droplet className="w-4 h-4 text-red-600 fill-red-600" />
                <span className="text-xs uppercase font-extrabold tracking-wider text-red-700">
                  Medical Knowledge Base
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Interactive Blood Compatibility Matrix
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                Click any blood type to instantly see who can donate to whom during emergencies.
              </p>
            </div>

            {/* Selector buttons */}
            <div className="flex flex-wrap gap-1.5">
              {BLOOD_GROUPS.map(bg => (
                <button
                  key={bg}
                  onClick={() => setCompatSelectedGroup(bg)}
                  className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all ${
                    compatSelectedGroup === bg
                      ? 'bg-red-600 text-white shadow-md scale-105'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Compatibility Display Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box 1: Can give blood to */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-slate-400">Donor Role</span>
                <span className="text-xs font-black text-red-700">Group {compatSelectedGroup}</span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                Can safely donate whole red cells to:
              </h3>
              <div className="flex flex-wrap gap-2">
                {DONOR_CAN_GIVE_TO[compatSelectedGroup].map(g => (
                  <span
                    key={g}
                    className="px-3.5 py-1.5 rounded-xl bg-red-600 text-white font-black text-xs shadow-sm"
                  >
                    {g}
                  </span>
                ))}
              </div>
              {compatSelectedGroup === 'O-' && (
                <p className="text-xs text-red-700 font-bold bg-red-100/60 p-2.5 rounded-xl">
                  ⭐ O- is the Universal Red Cell Donor. Can be transfused to any patient in extreme trauma.
                </p>
              )}
            </div>

            {/* Box 2: Can receive blood from */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-slate-400">Recipient Role</span>
                <span className="text-xs font-black text-red-700">Patient {compatSelectedGroup}</span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                Can safely receive red cells from:
              </h3>
              <div className="flex flex-wrap gap-2">
                {RECIPIENT_CAN_RECEIVE_FROM[compatSelectedGroup].map(g => (
                  <span
                    key={g}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-sm"
                  >
                    {g}
                  </span>
                ))}
              </div>
              {compatSelectedGroup === 'AB+' && (
                <p className="text-xs text-emerald-800 font-bold bg-emerald-100/60 p-2.5 rounded-xl">
                  ⭐ AB+ is the Universal Recipient. Can safely receive red blood cells from any blood type.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SAFETY, PRIVACY & MEDICAL DISCLAIMER CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/80 border-2 border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start gap-5 shadow-sm">
          <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0 mt-1" />
          <div className="space-y-2">
            <h3 className="font-black text-base text-slate-900">
              Crucial Healthcare Notice & Medical Limitations
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              LifeLink is an emergency voluntary communication coordination bridge. It does not provide medical advice, diagnosis, or clinical blood screening. All blood compatibility, infectious marker tests, donor safety evaluations, and transfusion procedures must be carried out exclusively by accredited medical professionals and licensed hospital blood banks.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-slate-800">
              <span>National Emergency Hotline: 911 / 112</span>
              <span>•</span>
              <span>Blood Bank Helpline: 1-800-RED-CROSS</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
