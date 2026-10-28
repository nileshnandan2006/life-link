import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { EmergencyRequestWizard } from './components/EmergencyRequestWizard';
import { AuthModal } from './components/AuthModal';
import { ReportModal } from './components/ReportModal';

// Views
import { LandingPage } from './views/LandingPage';
import { RequestsView } from './views/RequestsView';
import { RequestDetailView } from './views/RequestDetailView';
import { DonorsView } from './views/DonorsView';
import { MapView } from './views/MapView';
import { DonorDashboard } from './views/DonorDashboard';
import { RequesterDashboard } from './views/RequesterDashboard';
import { AdminDashboard } from './views/AdminDashboard';
import { HelpSafetyView } from './views/HelpSafetyView';
import { NotificationsView } from './views/NotificationsView';

// Mobile bottom navigation icons
import { Home, Droplet, User, MapPin, Bell } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { activeView, setActiveView, notifications } = useApp();
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const renderCurrentView = () => {
    switch (activeView) {
      case 'landing':
        return <LandingPage />;
      case 'requests':
        return <RequestsView />;
      case 'request-detail':
        return <RequestDetailView />;
      case 'donors':
        return <DonorsView />;
      case 'map':
        return <MapView />;
      case 'donor-dashboard':
        return <DonorDashboard />;
      case 'requester-dashboard':
        return <RequesterDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'safety':
        return <HelpSafetyView />;
      case 'notifications':
        return <NotificationsView />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-16 md:pb-0">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Dynamic View */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Alerts */}
      <EmergencyRequestWizard />
      <AuthModal />
      <ReportModal />
      <ToastContainer />

      {/* Mobile Bottom Navigation Bar (Thumb Friendly) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveView('landing')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeView === 'landing' ? 'text-red-600' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveView('requests')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeView === 'requests' ? 'text-red-600' : 'text-slate-500'
          }`}
        >
          <Droplet className="w-5 h-5" />
          <span>Requests</span>
        </button>

        <button
          onClick={() => setActiveView('donors')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeView === 'donors' ? 'text-red-600' : 'text-slate-500'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Donors</span>
        </button>

        <button
          onClick={() => setActiveView('map')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeView === 'map' ? 'text-red-600' : 'text-slate-500'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span>Map</span>
        </button>

        <button
          onClick={() => setActiveView('notifications')}
          className={`relative flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            activeView === 'notifications' ? 'text-red-600' : 'text-slate-500'
          }`}
        >
          <Bell className="w-5 h-5" />
          <span>Alerts</span>
          {unreadNotifs > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-600 text-white text-[8px] flex items-center justify-center font-bold">
              {unreadNotifs}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
