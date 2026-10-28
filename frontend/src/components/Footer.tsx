import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, ShieldCheck, AlertTriangle, Phone, Droplet } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, setIsEmergencyModalOpen, setIsAuthModalOpen } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Life<span className="text-red-500">Link</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Emergency blood donation coordination platform connecting patients with local eligible volunteer donors during critical medical procedures.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsEmergencyModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-red-600/20"
              >
                <AlertTriangle className="w-4 h-4 fill-white text-red-600" />
                Request Blood Now
              </button>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="font-extrabold text-white uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveView('landing')} className="hover:text-white transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('requests')} className="hover:text-white transition-colors">
                  Emergency Blood Requests
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('donors')} className="hover:text-white transition-colors">
                  Nearby Donors Directory
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('map')} className="hover:text-white transition-colors">
                  Live Proximity Radar Map
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('safety')} className="hover:text-white transition-colors">
                  Donor Eligibility & Safety
                </button>
              </li>
            </ul>
          </div>

          {/* User Portals */}
          <div>
            <h4 className="font-extrabold text-white uppercase tracking-wider mb-3">Portals</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveView('requester-dashboard')} className="hover:text-white transition-colors">
                  Requester / Attendant Portal
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('donor-dashboard')} className="hover:text-white transition-colors">
                  Donor Dashboard & Certificates
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('admin')} className="hover:text-white transition-colors">
                  Admin Command Console
                </button>
              </li>
              <li>
                <button onClick={() => setIsAuthModalOpen(true)} className="hover:text-white transition-colors">
                  Sign In / Register
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency Hotlines */}
          <div>
            <h4 className="font-extrabold text-white uppercase tracking-wider mb-3">Emergency Response</h4>
            <div className="space-y-2.5 text-slate-300">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                Emergency EMS: <strong className="text-white">911 / 112</strong>
              </p>
              <p className="flex items-center gap-2">
                <Droplet className="w-3.5 h-3.5 text-red-500" />
                Blood Center: <strong className="text-white">1-800-RED-CROSS</strong>
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                For life-threatening hemorrhaging or trauma, immediately call local emergency services before seeking voluntary donors.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="border-t border-slate-900 pt-6 space-y-3 text-[11px] text-slate-500">
          <p className="leading-relaxed">
            <strong className="text-slate-400">Important Medical Disclaimer:</strong> LifeLink is a volunteer communication and coordination software tool. LifeLink does not perform medical diagnosis, laboratory compatibility screening, clinical testing, or blood collection. All actual blood donations, serological disease screening, ABO/Rh cross-matching, and transfusions must be executed and approved exclusively by licensed hospital blood banks and medical practitioners.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500">
            <p>© {new Date().getFullYear()} LifeLink Emergency Blood Donation Service. All rights reserved.</p>
            <p className="flex items-center gap-3">
              <span>Zero-Commercialization Verified</span>
              <span>•</span>
              <span>Voluntary Non-Remunerated Donation</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
