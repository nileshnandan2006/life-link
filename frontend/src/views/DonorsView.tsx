import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BloodGroup, DonorAvailability } from '../types';
import { maskPhoneNumber } from '../utils/bloodCompatibility';
import { 
  User, 
  Droplet, 
  Search, 
  Filter, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  Heart, 
  Award, 
  Clock, 
  AlertTriangle,
  Info,
  CheckCircle2
} from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const DonorsView: React.FC = () => {
  const { donorProfiles, users, selectedCity, showToast, setIsReportModalOpen } = useApp();

  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [maxDistance, setMaxDistance] = useState<number>(50);
  const [searchQuery, setSearchQuery] = useState('');

  // Map donor profile to user data
  const donorsWithUser = donorProfiles.map(profile => {
    const user = users.find(u => u.id === profile.userId);
    return {
      profile,
      user
    };
  });

  const filteredDonors = donorsWithUser.filter(({ profile, user }) => {
    if (selectedGroup !== 'all' && profile.bloodGroup !== selectedGroup) return false;
    if (selectedAvailability !== 'all' && profile.availability !== selectedAvailability) return false;
    if (profile.approxDistanceKm && profile.approxDistanceKm > maxDistance) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = user?.name.toLowerCase().includes(q);
      const matchArea = profile.area.toLowerCase().includes(q);
      if (!matchName && !matchArea) return false;
    }

    return true;
  });

  const handleContactDonor = (donorName: string, phone: string) => {
    showToast({
      type: 'info',
      title: 'Connecting Securely',
      message: `Initiating masked phone connection with ${donorName}. Your numbers remain confidential.`
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
              Verified Volunteer Community
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Find Nearby Blood Donors
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Locate altruistic donors in your area. For safety and privacy, donor distances are approximate and residential addresses are safeguarded.
          </p>
        </div>

        {/* Total counts badge */}
        <div className="flex items-center gap-3 bg-red-50 p-4 rounded-2xl border border-red-100 self-start md:self-auto">
          <Heart className="w-6 h-6 text-red-600 fill-red-600" />
          <div>
            <p className="text-xs text-red-800 font-bold uppercase tracking-wider">Active Pool</p>
            <p className="text-lg font-black text-slate-900">{donorProfiles.length} Registered Donors</p>
          </div>
        </div>
      </div>

      {/* MANDATORY MEDICAL DISCLAIMER CALLOUT */}
      <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-5 text-amber-950 flex items-start gap-3.5 shadow-sm">
        <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-sm text-amber-900">
            Mandatory Medical & Clinical Eligibility Disclaimer
          </p>
          <p className="leading-relaxed text-amber-900/90">
            LifeLink profiles indicate volunteer willingness only. Do <strong>NOT</strong> assume that a donor is clinically eligible solely based on application information. Final suitability (hemoglobin &gt; 12.5 g/dL, negative infectious markers, mandatory cross-matching) must always be independently confirmed by a certified medical blood bank doctor before donation.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by neighborhood or donor name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Availability */}
          <div>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Availability States</option>
              <option value="available">Available Now</option>
              <option value="emergency_only">Available for Emergencies Only</option>
              <option value="temp_unavailable">Temporarily Unavailable</option>
            </select>
          </div>

          {/* Distance Slider */}
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
              Radius: {maxDistance} km
            </span>
            <input
              type="range"
              min="2"
              max="50"
              step="2"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full accent-red-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Blood Group Filter Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Blood Group:
          </span>
          <button
            onClick={() => setSelectedGroup('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedGroup === 'all'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
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
        </div>
      </div>

      {/* Donors Grid */}
      {filteredDonors.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto">
          <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No donors match your search</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try expanding your search radius or clearing the blood group filter.
          </p>
          <button
            onClick={() => { setSelectedGroup('all'); setSelectedAvailability('all'); setMaxDistance(50); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonors.map(({ profile, user }) => {
            const isAvail = profile.availability === 'available';
            const isEmergOnly = profile.availability === 'emergency_only';

            return (
              <div
                key={profile.userId}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-red-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Badge & Status */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      isAvail 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : isEmergOnly 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isAvail ? 'bg-emerald-500' : isEmergOnly ? 'bg-amber-500' : 'bg-slate-400'}`}></span>
                      {isAvail ? 'Available Now' : isEmergOnly ? 'Emergencies Only' : 'Temp. Unavailable'}
                    </span>

                    <span className="text-[11px] font-bold text-slate-400">
                      Approx. {profile.approxDistanceKm} km away
                    </span>
                  </div>

                  {/* Donor Avatar & Blood Group */}
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white flex flex-col items-center justify-center font-black text-xl shadow-md shadow-red-600/20">
                        {profile.bloodGroup}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-base text-slate-900 truncate">
                        {user?.name || 'Verified Donor'}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {profile.age} yrs • {profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {profile.area}, {profile.city}
                      </p>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-2 text-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Donations</span>
                      <span className="text-sm font-extrabold text-slate-900">{profile.totalDonations} times</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Lives Impacted</span>
                      <span className="text-sm font-extrabold text-emerald-700">{profile.livesImpacted}+ lives</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {profile.badges.map((b, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-[10px] font-semibold bg-red-50 text-red-700 px-2 py-0.5 rounded-md border border-red-100">
                        <Award className="w-3 h-3 text-red-500" />
                        {b}
                      </span>
                    ))}
                  </div>

                  {profile.notes && (
                    <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100">
                      "{profile.notes}"
                    </p>
                  )}
                </div>

                {/* Action Footer */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    {profile.privacyShowPhone ? (
                      <span className="font-semibold text-slate-700">{user?.phone}</span>
                    ) : (
                      <span>Phone: {maskPhoneNumber(user?.phone || '')}</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleContactDonor(user?.name || 'Donor', user?.phone || '')}
                    className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Connect
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
