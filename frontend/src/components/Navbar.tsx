import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Heart, 
  AlertTriangle, 
  Bell, 
  Volume2, 
  VolumeX, 
  User, 
  ShieldAlert, 
  Menu, 
  X, 
  Droplet, 
  MapPin, 
  LogOut,
  ChevronDown,
  Activity,
  PhoneCall
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    activeView, 
    setActiveView, 
    switchUserRole, 
    logoutUser, 
    setIsEmergencyModalOpen, 
    setIsAuthModalOpen,
    notifications,
    soundEnabled,
    setSoundEnabled,
    selectedCity,
    setSelectedCity,
    requests
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalRequestsCount = requests.filter(r => r.urgency === 'critical' && (r.status === 'created' || r.status === 'searching')).length;

  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'London', 'Toronto', 'Sydney', 'Mumbai'];

  return (
    <>
      {/* Top Emergency Ticker if there are critical active requests */}
      {criticalRequestsCount > 0 && (
        <div className="bg-red-700 text-white text-xs font-semibold px-4 py-2 flex items-center justify-between border-b border-red-800 shadow-inner">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              <span className="uppercase tracking-wider font-bold">Emergency Alert:</span>
              <span>{criticalRequestsCount} critical blood request{criticalRequestsCount > 1 ? 's' : ''} currently active in {selectedCity}</span>
            </div>
            <button 
              onClick={() => setActiveView('requests')}
              className="underline text-red-100 hover:text-white flex items-center gap-1 font-bold text-xs"
            >
              View Emergency Queue &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveView('landing')}
                className="flex items-center gap-2.5 group focus:outline-none"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
                  <Heart className="w-6 h-6 fill-white text-white animate-pulse" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-red-700 transition-colors">
                      Life<span className="text-red-600">Link</span>
                    </span>
                    <span className="bg-red-100 text-red-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      Emergency
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                    Blood Donation Service
                  </p>
                </div>
              </button>

              {/* City Selector */}
              <div className="hidden lg:flex items-center gap-1.5 ml-4 pl-4 border-l border-slate-200">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-700 hover:text-red-700 cursor-pointer border-none focus:ring-0 focus:outline-none"
                >
                  {cities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setActiveView('landing')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'landing' ? 'text-red-600 bg-red-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveView('requests')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activeView === 'requests' ? 'text-red-600 bg-red-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Droplet className="w-4 h-4 text-red-500" />
                Blood Requests
              </button>
              <button
                onClick={() => setActiveView('donors')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activeView === 'donors' ? 'text-red-600 bg-red-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <User className="w-4 h-4 text-slate-500" />
                Find Donors
              </button>
              <button
                onClick={() => setActiveView('map')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activeView === 'map' ? 'text-red-600 bg-red-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Activity className="w-4 h-4 text-slate-500" />
                Live Map
              </button>
              <button
                onClick={() => setActiveView('safety')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activeView === 'safety' ? 'text-red-600 bg-red-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-slate-500" />
                Safety & Info
              </button>
            </nav>

            {/* Right Side: Emergency CTA, Sound, Notifications, Role Switcher */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* PRIMARY PROMINENT EMERGENCY BUTTON */}
              <button
                onClick={() => setIsEmergencyModalOpen(true)}
                className="pulse-emergency bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-xs sm:text-sm px-3.5 sm:px-5 py-2.5 rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                title="Create an instant emergency blood request"
              >
                <AlertTriangle className="w-4 h-4 fill-white text-red-600 animate-bounce shrink-0" />
                <span className="tracking-wide uppercase font-extrabold text-[11px] sm:text-xs">
                  REQUEST BLOOD NOW
                </span>
              </button>

              {/* Sound Alert Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors hidden sm:flex"
                title={soundEnabled ? "Mute Emergency Chimes" : "Enable Emergency Chimes"}
              >
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-red-600" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {/* Notifications Icon */}
              <button
                onClick={() => setActiveView('notifications')}
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Fast Role Switcher & Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors text-xs font-semibold"
                >
                  <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs overflow-hidden">
                    {currentUser?.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      currentUser?.name.charAt(0) || 'U'
                    )}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-[11px] leading-tight text-slate-500">
                      Role: <span className="text-red-700 font-bold capitalize">{currentUser?.role || 'Guest'}</span>
                    </p>
                    <p className="font-semibold text-xs leading-none truncate max-w-[90px]">
                      {currentUser?.name || 'Sign In'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {roleMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-xl border border-slate-100 p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs text-slate-500">Current User</p>
                      <p className="font-bold text-sm text-slate-900">{currentUser?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                    </div>

                    <div className="py-1">
                      <p className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
                        Switch Demo Role
                      </p>
                      <button
                        onClick={() => { switchUserRole('requester'); setRoleMenuOpen(false); }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between ${
                          currentUser?.role === 'requester' ? 'bg-red-50 text-red-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>Requester (Patient Attendant)</span>
                        {currentUser?.role === 'requester' && <span className="w-2 h-2 rounded-full bg-red-600"></span>}
                      </button>
                      <button
                        onClick={() => { switchUserRole('donor'); setRoleMenuOpen(false); }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between ${
                          currentUser?.role === 'donor' ? 'bg-red-50 text-red-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>Donor (Marcus Vance, O-)</span>
                        {currentUser?.role === 'donor' && <span className="w-2 h-2 rounded-full bg-red-600"></span>}
                      </button>
                      <button
                        onClick={() => { switchUserRole('admin'); setRoleMenuOpen(false); }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between ${
                          currentUser?.role === 'admin' ? 'bg-red-50 text-red-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>Admin (Elena Rostova)</span>
                        {currentUser?.role === 'admin' && <span className="w-2 h-2 rounded-full bg-red-600"></span>}
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1 mt-1">
                      {currentUser?.role === 'donor' && (
                        <button
                          onClick={() => { setActiveView('donor-dashboard'); setRoleMenuOpen(false); }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 font-medium"
                        >
                          Donor Dashboard
                        </button>
                      )}
                      {currentUser?.role === 'requester' && (
                        <button
                          onClick={() => { setActiveView('requester-dashboard'); setRoleMenuOpen(false); }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 font-medium"
                        >
                          Requester Dashboard
                        </button>
                      )}
                      {currentUser?.role === 'admin' && (
                        <button
                          onClick={() => { setActiveView('admin'); setRoleMenuOpen(false); }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 font-medium"
                        >
                          Admin Console
                        </button>
                      )}
                      <button
                        onClick={() => { setIsAuthModalOpen(true); setRoleMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        Sign Up / Login Modal
                      </button>
                      <button
                        onClick={() => { logoutUser(); setRoleMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-red-600 hover:bg-red-50 font-medium flex items-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 md:hidden"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
            <button
              onClick={() => { setActiveView('landing'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold ${activeView === 'landing' ? 'bg-red-50 text-red-600' : 'text-slate-700'}`}
            >
              Home
            </button>
            <button
              onClick={() => { setActiveView('requests'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold ${activeView === 'requests' ? 'bg-red-50 text-red-600' : 'text-slate-700'}`}
            >
              Blood Requests
            </button>
            <button
              onClick={() => { setActiveView('donors'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold ${activeView === 'donors' ? 'bg-red-50 text-red-600' : 'text-slate-700'}`}
            >
              Find Donors
            </button>
            <button
              onClick={() => { setActiveView('map'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold ${activeView === 'map' ? 'bg-red-50 text-red-600' : 'text-slate-700'}`}
            >
              Live Map
            </button>
            <button
              onClick={() => { setActiveView('safety'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold ${activeView === 'safety' ? 'bg-red-50 text-red-600' : 'text-slate-700'}`}
            >
              Safety & Eligibility
            </button>
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => { setIsEmergencyModalOpen(true); setMobileMenuOpen(false); }}
                className="w-full bg-red-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm"
              >
                <AlertTriangle className="w-4 h-4 fill-white" />
                REQUEST BLOOD NOW
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
