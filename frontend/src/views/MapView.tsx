import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BloodGroup, UrgencyLevel } from '../types';
import { getUrgencyBadge, maskPhoneNumber } from '../utils/bloodCompatibility';
import { 
  MapPin, 
  Building2, 
  User, 
  Droplet, 
  AlertTriangle, 
  Layers, 
  Compass, 
  Phone, 
  ShieldCheck, 
  CheckCircle,
  Eye,
  Filter,
  Navigation
} from 'lucide-react';

export const MapView: React.FC = () => {
  const { 
    requests, 
    donorProfiles, 
    hospitals, 
    selectedCity, 
    setSelectedRequestId, 
    setActiveView,
    setIsEmergencyModalOpen 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'requests' | 'donors' | 'hospitals'>('all');
  const [selectedPin, setSelectedPin] = useState<{
    type: 'request' | 'donor' | 'hospital';
    id: string;
    data: any;
  } | null>(null);

  // Filter items
  const activeRequests = requests.filter(r => r.status !== 'fulfilled' && r.status !== 'cancelled');
  const activeDonors = donorProfiles.filter(d => d.availability !== 'temp_unavailable');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
            <span className="text-xs font-extrabold uppercase tracking-wider text-red-600">
              Live GIS Radar & Proximity Grid
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Emergency Proximity Map – {selectedCity}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Real-time visualization of trauma centers, urgent blood requests, and nearby available donors. Donor coordinates are generalized within approximate 2 km radius buffers to protect privacy.
          </p>
        </div>

        {/* View toggles & Quick Action */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="pulse-emergency bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 fill-white text-red-600" />
            Request Blood Now
          </button>
        </div>
      </div>

      {/* Main Map + Side Info Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: The Interactive Canvas Radar Map */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden min-h-[520px] flex flex-col justify-between">
          {/* Background Map Grid & Coordinate Rings */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
          </div>

          {/* Map Controls Overlay */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 bg-slate-800/80 backdrop-blur-md p-2 rounded-2xl border border-slate-700/80 text-xs">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${activeTab === 'all' ? 'bg-red-600 text-white shadow' : 'text-slate-300 hover:text-white'}`}
              >
                All Entities
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${activeTab === 'requests' ? 'bg-red-600 text-white shadow' : 'text-slate-300 hover:text-white'}`}
              >
                🚨 Requests ({activeRequests.length})
              </button>
              <button
                onClick={() => setActiveTab('donors')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${activeTab === 'donors' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:text-white'}`}
              >
                🩸 Donors ({activeDonors.length})
              </button>
              <button
                onClick={() => setActiveTab('hospitals')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${activeTab === 'hospitals' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'}`}
              >
                🏥 Hospitals ({hospitals.length})
              </button>
            </div>

            <span className="text-[11px] text-slate-400 font-medium px-2 hidden sm:inline">
              Center: {selectedCity} Metro (Radius: 15 km)
            </span>
          </div>

          {/* Interactive Proximity Simulation Stage */}
          <div className="relative z-10 flex-1 my-6 flex items-center justify-center min-h-[360px]">
            {/* Concentric Distance Rings */}
            <div className="absolute w-[440px] h-[440px] rounded-full border border-slate-700/50 pointer-events-none flex items-center justify-center">
              <span className="absolute top-2 text-[10px] text-slate-600 font-mono">10 km Radius Ring</span>
            </div>
            <div className="absolute w-[280px] h-[280px] rounded-full border border-slate-700/60 pointer-events-none flex items-center justify-center">
              <span className="absolute top-2 text-[10px] text-slate-600 font-mono">5 km Radius Ring</span>
            </div>
            <div className="absolute w-[140px] h-[140px] rounded-full border border-red-500/20 bg-red-950/10 pointer-events-none flex items-center justify-center">
              <span className="absolute top-2 text-[10px] text-red-400/80 font-mono">2 km Zone</span>
            </div>

            {/* Radar Center Hub: Metro Central Base */}
            <div className="relative z-20 flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-red-500 ring-8 ring-red-500/20 shadow-lg shadow-red-500/50 animate-pulse"></div>
              <span className="text-[10px] font-extrabold text-white bg-slate-900/90 px-2 py-0.5 rounded-full border border-slate-700 mt-1">
                Central Trauma Hub
              </span>
            </div>

            {/* PIN: Requests (Red with Warning Icon) */}
            {(activeTab === 'all' || activeTab === 'requests') && activeRequests.map((req, i) => {
              // Position strategically around the map
              const angles = [45, 140, 230, 310];
              const distances = [90, 130, 160, 110];
              const angle = angles[i % angles.length] * (Math.PI / 180);
              const dist = distances[i % distances.length];
              const left = `calc(50% + ${Math.cos(angle) * dist}px)`;
              const top = `calc(50% + ${Math.sin(angle) * dist}px)`;

              return (
                <div
                  key={req.id}
                  style={{ left, top }}
                  onClick={() => setSelectedPin({ type: 'request', id: req.id, data: req })}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group"
                >
                  <div className="relative">
                    <span className="w-7 h-7 rounded-full bg-red-600/40 animate-ping absolute inset-0 m-auto"></span>
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 border-2 border-white shadow-xl flex items-center justify-center text-white font-black text-xs group-hover:scale-125 transition-transform">
                      {req.bloodGroup}
                    </div>
                  </div>
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg border border-red-500/50 whitespace-nowrap opacity-90 group-hover:opacity-100 shadow">
                    {req.patientName.split(' ')[0]} ({req.unitsNeeded}U)
                  </div>
                </div>
              );
            })}

            {/* PIN: Hospitals (Blue Building Icon) */}
            {(activeTab === 'all' || activeTab === 'hospitals') && hospitals.slice(0, 4).map((hosp, i) => {
              const angles = [95, 200, 275, 15];
              const distances = [140, 100, 150, 170];
              const angle = angles[i % angles.length] * (Math.PI / 180);
              const dist = distances[i % distances.length];
              const left = `calc(50% + ${Math.cos(angle) * dist}px)`;
              const top = `calc(50% + ${Math.sin(angle) * dist}px)`;

              return (
                <div
                  key={hosp.id}
                  style={{ left, top }}
                  onClick={() => setSelectedPin({ type: 'hospital', id: hosp.id, data: hosp })}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-25 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-600 border border-blue-400 shadow-md flex items-center justify-center text-white group-hover:scale-125 transition-transform">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="absolute top-9 left-1/2 -translate-x-1/2 bg-slate-950 text-blue-300 text-[10px] font-semibold px-2 py-0.5 rounded-lg border border-blue-500/40 whitespace-nowrap opacity-80 group-hover:opacity-100">
                    {hosp.name.split(' ')[0]}
                  </div>
                </div>
              );
            })}

            {/* PIN: Donors (Emerald Blood Drop / Privacy circle) */}
            {(activeTab === 'all' || activeTab === 'donors') && activeDonors.map((donor, i) => {
              const angles = [30, 80, 165, 250, 320];
              const distances = [60, 150, 80, 130, 140];
              const angle = angles[i % angles.length] * (Math.PI / 180);
              const dist = distances[i % distances.length];
              const left = `calc(50% + ${Math.cos(angle) * dist}px)`;
              const top = `calc(50% + ${Math.sin(angle) * dist}px)`;

              return (
                <div
                  key={donor.userId}
                  style={{ left, top }}
                  onClick={() => setSelectedPin({ type: 'donor', id: donor.userId, data: donor })}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                >
                  {/* Privacy Fuzzing Circle Buffer */}
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center group-hover:bg-emerald-500/20 transition-all">
                    <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-extrabold text-[10px] flex items-center justify-center shadow">
                      {donor.bloodGroup}
                    </div>
                  </div>
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900 text-emerald-400 text-[9px] font-mono px-1.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                    ~{donor.approxDistanceKm} km (Privacy Protected)
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom Legend */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-red-600"></span>
                Emergency Request
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-600"></span>
                Nearby Donor (Buffered Area)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-blue-600"></span>
                Hospital Blood Bank
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Privacy Shield Active: Exact GPS obfuscated
            </div>
          </div>
        </div>

        {/* Right Col: Selected Entity Detail Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Compass className="w-4 h-4 text-red-600" />
              Proximity Details Panel
            </h3>

            {selectedPin ? (
              <div className="space-y-4 animate-fadeIn">
                {selectedPin.type === 'request' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-red-100 text-red-800">
                        {selectedPin.data.urgency.toUpperCase()} EMERGENCY
                      </span>
                      <span className="text-xs font-extrabold text-red-600">
                        {selectedPin.data.bloodGroup} Needed
                      </span>
                    </div>

                    <h4 className="font-extrabold text-base text-slate-900">
                      {selectedPin.data.patientName}
                    </h4>

                    <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                      <p className="font-semibold text-slate-900">
                        🏥 {selectedPin.data.hospitalName}
                      </p>
                      <p>📍 {selectedPin.data.area}, {selectedPin.data.city}</p>
                      <p>🩸 Units: {selectedPin.data.unitsNeeded} Bag(s)</p>
                      <p>📞 Contact: {selectedPin.data.contactNumber}</p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedRequestId(selectedPin.data.id);
                        setActiveView('request-detail');
                      }}
                      className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all"
                    >
                      Open Request Tracker &rarr;
                    </button>
                  </div>
                )}

                {selectedPin.type === 'donor' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        AVAILABLE DONOR
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        Blood: {selectedPin.data.bloodGroup}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-base text-slate-900">
                      Donor #{selectedPin.data.userId.slice(-4).toUpperCase()}
                    </h4>

                    <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                      <p>📍 Approx: {selectedPin.data.approxDistanceKm} km from hospital center</p>
                      <p>🛡️ Area: {selectedPin.data.area}</p>
                      <p>❤️ Total Donations: {selectedPin.data.totalDonations} times</p>
                      <p className="text-[11px] text-slate-500 italic">
                        "{selectedPin.data.notes || 'Ready to assist in medical emergency.'}"
                      </p>
                    </div>

                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                      🔒 Donor exact residential location is protected under LifeLink Privacy Guidelines.
                    </div>
                  </div>
                )}

                {selectedPin.type === 'hospital' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                        TRAUMA FACILITY
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        Open 24/7
                      </span>
                    </div>

                    <h4 className="font-extrabold text-base text-slate-900">
                      {selectedPin.data.name}
                    </h4>

                    <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                      <p>📍 Address: {selectedPin.data.address}</p>
                      <p>🚨 Hotline: {selectedPin.data.emergencyHotline}</p>
                      <p>🩸 Blood Bank On-Site: {selectedPin.data.bloodBankAvailable ? 'Yes (Verified)' : 'Coordination Needed'}</p>
                    </div>

                    <a
                      href={`tel:${selectedPin.data.phone}`}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call Emergency Desk
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <MapPin className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs font-semibold text-slate-600">Select any marker on the radar</p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Click on an emergency request, donor bubble, or hospital pin to inspect distances and actions.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500">
            Emergency Dispatch System • Response sync interval: 15 seconds
          </div>
        </div>
      </div>
    </div>
  );
};
