import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  DonorProfile, 
  BloodRequest, 
  Hospital, 
  NotificationItem, 
  DonationHistoryItem,
  ReportedUser,
  BloodGroup,
  UrgencyLevel,
  DonorAvailability,
  RequestStatus,
  UserRole
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_HOSPITALS, 
  INITIAL_DONOR_PROFILES, 
  INITIAL_REQUESTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_DONATION_HISTORY,
  INITIAL_REPORTS
} from '../data/seedData';
import { playEmergencyAlertSound, isBloodCompatible, calculateDistanceKm } from '../utils/bloodCompatibility';
import { logoutFromFirebase, onFirebaseAuthStateChanged } from '../services/firebase';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'emergency';
  title: string;
  message: string;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  donorProfiles: DonorProfile[];
  requests: BloodRequest[];
  hospitals: Hospital[];
  notifications: NotificationItem[];
  donationHistory: DonationHistoryItem[];
  reports: ReportedUser[];
  selectedCity: string;
  soundEnabled: boolean;
  toasts: ToastMessage[];
  currentDonorProfile: DonorProfile | null;
  
  // Navigation & Modal triggers
  activeView: string;
  setActiveView: (view: string) => void;
  selectedRequestId: string | null;
  setSelectedRequestId: (id: string | null) => void;
  isEmergencyModalOpen: boolean;
  setIsEmergencyModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;

  // Actions
  switchUserRole: (role: UserRole) => void;
  loginUser: (userId: string) => void;
  logoutUser: () => void;
  registerUser: (data: { name: string; email: string; phone: string; role: UserRole; city: string; area: string; bloodGroup?: BloodGroup; age?: number; gender?: 'male' | 'female' | 'other'; id?: string; avatar?: string }) => void;
  setSelectedCity: (city: string) => void;
  setSoundEnabled: (enabled: boolean) => void;
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Request actions
  createEmergencyRequest: (requestData: {
    patientName: string;
    patientAge?: number;
    bloodGroup: BloodGroup;
    unitsNeeded: number;
    hospitalName: string;
    hospitalAddress: string;
    city: string;
    area: string;
    urgency: UrgencyLevel;
    contactNumber: string;
    alternateContact?: string;
    notes?: string;
  }) => BloodRequest;
  updateRequestStatus: (requestId: string, status: RequestStatus, note?: string) => void;
  respondToRequest: (requestId: string, etaMinutes: number, message?: string) => void;
  acceptDonorResponse: (requestId: string, responseId: string) => void;
  markRequestFulfilled: (requestId: string) => void;
  cancelRequest: (requestId: string, reason?: string) => void;

  // Donor actions
  updateDonorAvailability: (availability: DonorAvailability) => void;
  updateDonorProfile: (data: Partial<DonorProfile>) => void;

  // Notification actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => void;

  // Admin actions
  toggleUserStatus: (userId: string) => void;
  verifyUser: (userId: string) => void;
  resolveReport: (reportId: string, action: 'resolved' | 'dismissed') => void;
  fileReport: (reportedUserId: string, reportedUserName: string, reason: ReportedUser['reason'], details: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence state keys
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('lifelink_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* pass */ }
    }
    return INITIAL_USERS[0]; // Default: Dr. Sarah Chen (Requester)
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('lifelink_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [donorProfiles, setDonorProfiles] = useState<DonorProfile[]>(() => {
    const saved = localStorage.getItem('lifelink_donors');
    return saved ? JSON.parse(saved) : INITIAL_DONOR_PROFILES;
  });

  const [requests, setRequests] = useState<BloodRequest[]>(() => {
    const saved = localStorage.getItem('lifelink_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [hospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('lifelink_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [donationHistory, setDonationHistory] = useState<DonationHistoryItem[]>(() => {
    const saved = localStorage.getItem('lifelink_history');
    return saved ? JSON.parse(saved) : INITIAL_DONATION_HISTORY;
  });

  const [reports, setReports] = useState<ReportedUser[]>(() => {
    const saved = localStorage.getItem('lifelink_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [selectedCity, setSelectedCity] = useState<string>('New York');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeView, setActiveView] = useState<string>('landing');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('lifelink_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onFirebaseAuthStateChanged((fbUser) => {
      if (fbUser) {
        // Check if user exists in our users list by email or id
        setUsers(prev => {
          const existing = prev.find(u => u.email === fbUser.email || u.id === fbUser.uid);
          if (existing) {
            setCurrentUser(existing);
            return prev;
          } else {
            const newUser: User = {
              id: fbUser.uid,
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'LifeLink User',
              email: fbUser.email || '',
              phone: fbUser.phoneNumber || '+1 (555) 000-0000',
              role: 'donor',
              city: 'New York',
              area: 'Metro Area',
              avatar: fbUser.photoURL || undefined,
              isVerified: true,
              status: 'active',
              createdAt: new Date().toISOString()
            };
            setCurrentUser(newUser);
            return [newUser, ...prev];
          }
        });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('lifelink_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('lifelink_donors', JSON.stringify(donorProfiles));
  }, [donorProfiles]);

  useEffect(() => {
    localStorage.setItem('lifelink_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('lifelink_reports', JSON.stringify(reports));
  }, [reports]);

  // Toast Helpers
  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Find donor profile of current user
  const currentDonorProfile = currentUser 
    ? donorProfiles.find(d => d.userId === currentUser.id) || null 
    : null;

  // Switch Role
  const switchUserRole = (role: UserRole) => {
    const targetUser = users.find(u => u.role === role) || users[0];
    setCurrentUser(targetUser);
    showToast({
      type: 'info',
      title: `Switched Role to ${role.toUpperCase()}`,
      message: `You are now interacting as ${targetUser.name} (${role}).`
    });
    if (role === 'admin') setActiveView('admin');
    else if (role === 'donor') setActiveView('donor-dashboard');
    else if (role === 'requester') setActiveView('requester-dashboard');
  };

  const loginUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      showToast({
        type: 'success',
        title: 'Logged in successfully',
        message: `Welcome back, ${user.name}!`
      });
      if (user.role === 'admin') setActiveView('admin');
      else if (user.role === 'donor') setActiveView('donor-dashboard');
      else setActiveView('requester-dashboard');
    }
  };

  const logoutUser = () => {
    logoutFromFirebase().catch(() => {});
    setCurrentUser(null);
    showToast({
      type: 'info',
      title: 'Logged out',
      message: 'You have been signed out safely.'
    });
    setActiveView('landing');
  };

  const registerUser = (data: {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    city: string;
    area: string;
    bloodGroup?: BloodGroup;
    age?: number;
    gender?: 'male' | 'female' | 'other';
    id?: string;
    avatar?: string;
  }) => {
    const newUserId = data.id || `user-${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      city: data.city || 'New York',
      area: data.area || 'Metro Area',
      avatar: data.avatar,
      isVerified: true,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [newUser, ...prev]);

    if (data.role === 'donor' && data.bloodGroup) {
      const newDonorProfile: DonorProfile = {
        userId: newUserId,
        bloodGroup: data.bloodGroup,
        age: data.age || 25,
        gender: data.gender || 'other',
        availability: 'available',
        city: data.city || 'New York',
        area: data.area || 'Metro Area',
        approxDistanceKm: 2.5,
        latitude: 40.7306 + (Math.random() - 0.5) * 0.05,
        longitude: -73.9352 + (Math.random() - 0.5) * 0.05,
        totalDonations: 0,
        livesImpacted: 0,
        isMedicalPrecheckPassed: true,
        badges: ['New LifeLink Donor'],
        notes: 'Ready to assist in emergencies.',
        privacyShowPhone: true
      };
      setDonorProfiles(prev => [newDonorProfile, ...prev]);
    }

    setCurrentUser(newUser);
    showToast({
      type: 'success',
      title: 'Account Registered',
      message: `Welcome to LifeLink, ${data.name}! Your account is active.`
    });

    if (data.role === 'donor') setActiveView('donor-dashboard');
    else setActiveView('requester-dashboard');
  };

  // Notification helper
  const addNotification = (notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
    if (soundEnabled && notif.urgency === 'critical') {
      playEmergencyAlertSound();
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast({ type: 'info', title: 'Notifications Cleared', message: 'All notifications marked as read.' });
  };

  // Create Emergency Request
  const createEmergencyRequest = (reqData: {
    patientName: string;
    patientAge?: number;
    bloodGroup: BloodGroup;
    unitsNeeded: number;
    hospitalName: string;
    hospitalAddress: string;
    city: string;
    area: string;
    urgency: UrgencyLevel;
    contactNumber: string;
    alternateContact?: string;
    notes?: string;
  }): BloodRequest => {
    // Generate realistic coordinates around hospital or city
    const hosp = hospitals.find(h => h.name.toLowerCase().includes(reqData.hospitalName.toLowerCase())) || hospitals[0];
    const newReqId = `req-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const newRequest: BloodRequest = {
      id: newReqId,
      requesterId: currentUser?.id || 'guest-requester',
      requesterName: currentUser?.name || 'Emergency Attendant',
      patientName: reqData.patientName,
      patientAge: reqData.patientAge,
      bloodGroup: reqData.bloodGroup,
      unitsNeeded: reqData.unitsNeeded,
      hospitalName: reqData.hospitalName,
      hospitalAddress: reqData.hospitalAddress,
      city: reqData.city,
      area: reqData.area,
      latitude: hosp ? hosp.latitude + (Math.random() - 0.5) * 0.005 : 40.7420,
      longitude: hosp ? hosp.longitude + (Math.random() - 0.5) * 0.005 : -73.9740,
      urgency: reqData.urgency,
      contactNumber: reqData.contactNumber,
      alternateContact: reqData.alternateContact,
      notes: reqData.notes,
      status: 'searching',
      createdAt: timestamp,
      updatedAt: timestamp,
      timeline: [
        {
          status: 'created',
          title: 'Emergency Request Created',
          description: `Requested ${reqData.unitsNeeded} unit(s) of ${reqData.bloodGroup} at ${reqData.hospitalName}.`,
          timestamp
        },
        {
          status: 'searching',
          title: 'Searching Nearby Compatible Donors',
          description: 'LifeLink matching engine broadcasting notifications to eligible donors.',
          timestamp
        }
      ],
      donorResponses: []
    };

    setRequests(prev => [newRequest, ...prev]);

    // Count compatible donors
    const compatibleCount = donorProfiles.filter(d => 
      isBloodCompatible(d.bloodGroup, reqData.bloodGroup) && d.availability !== 'temp_unavailable'
    ).length;

    // Trigger Emergency Sound if critical & sound is on
    if (reqData.urgency === 'critical' && soundEnabled) {
      playEmergencyAlertSound();
    }

    // Add broadcast notification
    addNotification({
      roleTarget: 'donor',
      title: `EMERGENCY ALERT: ${reqData.bloodGroup} Needed (${reqData.urgency.toUpperCase()})`,
      message: `${reqData.unitsNeeded} units needed for ${reqData.patientName} at ${reqData.hospitalName}.`,
      type: 'emergency_alert',
      urgency: reqData.urgency,
      relatedRequestId: newReqId
    });

    showToast({
      type: reqData.urgency === 'critical' ? 'emergency' : 'success',
      title: 'Emergency Request Published',
      message: `Alert dispatched! Found ${compatibleCount} potential donors in vicinity.`
    });

    return newRequest;
  };

  const updateRequestStatus = (requestId: string, status: RequestStatus, note?: string) => {
    const timestamp = new Date().toISOString();
    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;
      return {
        ...req,
        status,
        updatedAt: timestamp,
        timeline: [
          ...req.timeline,
          {
            status,
            title: status.replace('_', ' ').toUpperCase(),
            description: note || `Status updated to ${status}.`,
            timestamp
          }
        ]
      };
    }));

    showToast({
      type: 'info',
      title: 'Request Status Updated',
      message: `Request ${requestId} is now ${status}.`
    });
  };

  const respondToRequest = (requestId: string, etaMinutes: number, message?: string) => {
    if (!currentUser) return;
    const donorProfile = currentDonorProfile;
    const req = requests.find(r => r.id === requestId);
    if (!req) return;

    const donorDistance = donorProfile?.approxDistanceKm || 2.4;
    const newResponse = {
      id: `resp-${Date.now()}`,
      requestId,
      donorId: currentUser.id,
      donorName: currentUser.name,
      donorBloodGroup: donorProfile?.bloodGroup || 'O+',
      donorPhone: currentUser.phone,
      donorDistanceKm: donorDistance,
      etaMinutes,
      message: message || `I am ready to donate. Can reach ${req.hospitalName} in approx ${etaMinutes} minutes.`,
      status: 'responded' as const,
      createdAt: new Date().toISOString()
    };

    setRequests(prev => prev.map(r => {
      if (r.id !== requestId) return r;
      const isFirst = r.donorResponses.length === 0;
      const newStatus = isFirst && r.status === 'searching' ? 'donor_responded' : r.status;
      return {
        ...r,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        timeline: [
          ...r.timeline,
          {
            status: newStatus,
            title: 'Donor Responded',
            description: `${currentUser.name} (${donorProfile?.bloodGroup || 'Donor'}) pledged assistance (ETA: ${etaMinutes}m).`,
            timestamp: new Date().toISOString()
          }
        ],
        donorResponses: [...r.donorResponses, newResponse]
      };
    }));

    addNotification({
      roleTarget: 'requester',
      title: 'Donor Responded to Request!',
      message: `${currentUser.name} responded to help with request #${requestId}. ETA: ${etaMinutes} mins.`,
      type: 'donor_response',
      urgency: req.urgency,
      relatedRequestId: requestId
    });

    showToast({
      type: 'success',
      title: 'Response Sent',
      message: `Thank you, ${currentUser.name}! The patient's attendant has been notified.`
    });
  };

  const acceptDonorResponse = (requestId: string, responseId: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;
      return {
        ...req,
        status: 'coordinated',
        updatedAt: new Date().toISOString(),
        timeline: [
          ...req.timeline,
          {
            status: 'coordinated',
            title: 'Donation Coordinated',
            description: 'Requester accepted donor response. Meeting coordinated at hospital blood bank.',
            timestamp: new Date().toISOString()
          }
        ],
        donorResponses: req.donorResponses.map(r => 
          r.id === responseId ? { ...r, status: 'accepted' as const } : r
        )
      };
    }));

    showToast({
      type: 'success',
      title: 'Donor Confirmed',
      message: 'Donation coordinated! Please contact the donor to confirm blood bank counter.'
    });
  };

  const markRequestFulfilled = (requestId: string) => {
    const req = requests.find(r => r.id === requestId);
    if (!req) return;

    setRequests(prev => prev.map(r => {
      if (r.id !== requestId) return r;
      return {
        ...r,
        status: 'fulfilled',
        updatedAt: new Date().toISOString(),
        timeline: [
          ...r.timeline,
          {
            status: 'fulfilled',
            title: 'Request Fulfilled',
            description: 'Blood units secured and transfused safely. Request closed with gratitude.',
            timestamp: new Date().toISOString()
          }
        ]
      };
    }));

    // Record donation history for responding donor
    if (req.donorResponses.length > 0) {
      const acceptedDonor = req.donorResponses.find(d => d.status === 'accepted') || req.donorResponses[0];
      const newHistoryItem: DonationHistoryItem = {
        id: `hist-${Date.now()}`,
        donorId: acceptedDonor.donorId,
        requestId: req.id,
        patientIdentifier: req.patientName,
        hospitalName: req.hospitalName,
        bloodGroup: req.bloodGroup,
        unitsDonated: req.unitsNeeded,
        date: new Date().toISOString().split('T')[0],
        verifiedByHospital: true,
        certificateId: `LL-CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        feedback: 'Emergency transfusion successful.'
      };
      setDonationHistory(prev => [newHistoryItem, ...prev]);

      // Update donor's life saved counter
      setDonorProfiles(prev => prev.map(d => {
        if (d.userId !== acceptedDonor.donorId) return d;
        return {
          ...d,
          totalDonations: d.totalDonations + 1,
          livesImpacted: d.livesImpacted + req.unitsNeeded * 3,
          lastDonationDate: new Date().toISOString().split('T')[0]
        };
      }));
    }

    addNotification({
      roleTarget: 'donor',
      title: 'Blood Request Fulfilled!',
      message: `The emergency request for ${req.patientName} at ${req.hospitalName} has been fulfilled. Lives saved!`,
      type: 'fulfillment',
      relatedRequestId: requestId
    });

    showToast({
      type: 'success',
      title: 'Request Fulfilled!',
      message: 'Thank you for updating. The community expresses heartfelt gratitude.'
    });
  };

  const cancelRequest = (requestId: string, reason?: string) => {
    setRequests(prev => prev.map(r => {
      if (r.id !== requestId) return r;
      return {
        ...r,
        status: 'cancelled',
        updatedAt: new Date().toISOString(),
        timeline: [
          ...r.timeline,
          {
            status: 'cancelled',
            title: 'Request Cancelled',
            description: reason || 'Request was cancelled by patient attendant.',
            timestamp: new Date().toISOString()
          }
        ]
      };
    }));

    showToast({
      type: 'warning',
      title: 'Request Cancelled',
      message: 'The emergency blood request has been closed.'
    });
  };

  const updateDonorAvailability = (availability: DonorAvailability) => {
    if (!currentUser) return;
    setDonorProfiles(prev => prev.map(d => {
      if (d.userId !== currentUser.id) return d;
      return { ...d, availability };
    }));

    showToast({
      type: 'info',
      title: 'Availability Status Updated',
      message: `Your status is now: ${availability === 'available' ? 'Available to Donate' : availability === 'emergency_only' ? 'Emergencies Only' : 'Temporarily Unavailable'}.`
    });
  };

  const updateDonorProfile = (data: Partial<DonorProfile>) => {
    if (!currentUser) return;
    setDonorProfiles(prev => prev.map(d => {
      if (d.userId !== currentUser.id) return d;
      return { ...d, ...data };
    }));
    showToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your donor profile and preferences have been updated.'
    });
  };

  // Admin controls
  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== userId) return u;
      const nextStatus = u.status === 'active' ? 'suspended' : 'active';
      return { ...u, status: nextStatus };
    }));
    showToast({
      type: 'warning',
      title: 'Account Status Toggled',
      message: 'User account status updated.'
    });
  };

  const verifyUser = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== userId) return u;
      return { ...u, isVerified: true };
    }));
    showToast({
      type: 'success',
      title: 'User Verified',
      message: 'User identity and medical pre-check badge approved.'
    });
  };

  const resolveReport = (reportId: string, action: 'resolved' | 'dismissed') => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: action } : r));
    showToast({
      type: 'info',
      title: `Report ${action.toUpperCase()}`,
      message: `Moderation report #${reportId} has been updated.`
    });
  };

  const fileReport = (reportedUserId: string, reportedUserName: string, reason: ReportedUser['reason'], details: string) => {
    const newReport: ReportedUser = {
      id: `rep-${Date.now()}`,
      reportedByUserId: currentUser?.id || 'guest',
      reportedUserId,
      reportedUserName,
      reason,
      details,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setReports(prev => [newReport, ...prev]);
    showToast({
      type: 'warning',
      title: 'Report Submitted',
      message: 'Our safety and medical integrity team will review this case immediately.'
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        donorProfiles,
        requests,
        hospitals,
        notifications,
        donationHistory,
        reports,
        selectedCity,
        soundEnabled,
        toasts,
        currentDonorProfile,
        activeView,
        setActiveView,
        selectedRequestId,
        setSelectedRequestId,
        isEmergencyModalOpen,
        setIsEmergencyModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isReportModalOpen,
        setIsReportModalOpen,
        switchUserRole,
        loginUser,
        logoutUser,
        registerUser,
        setSelectedCity,
        setSoundEnabled,
        showToast,
        removeToast,
        createEmergencyRequest,
        updateRequestStatus,
        respondToRequest,
        acceptDonorResponse,
        markRequestFulfilled,
        cancelRequest,
        updateDonorAvailability,
        updateDonorProfile,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        toggleUserStatus,
        verifyUser,
        resolveReport,
        fileReport
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
