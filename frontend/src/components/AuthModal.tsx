import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BloodGroup, UserRole } from '../types';
import { 
  X, 
  User, 
  Heart, 
  Lock, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle, 
  Sparkles,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { 
  loginWithFirebase, 
  registerWithFirebase, 
  loginWithGoogleFirebase, 
  resetFirebasePassword, 
  formatFirebaseError 
} from '../services/firebase';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    registerUser, 
    loginUser, 
    showToast,
    setActiveView
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [role, setRole] = useState<UserRole>('donor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  // Handle Firebase Email/Password Login
  const handleFirebaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const fbUser = await loginWithFirebase(email, password);
      showToast({
        type: 'success',
        title: 'Signed in with Firebase',
        message: `Welcome back, ${fbUser.displayName || fbUser.email}!`
      });
      setIsAuthModalOpen(false);
      setActiveView('requests');
    } catch (err: any) {
      setErrorMessage(formatFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Firebase Email/Password Registration
  const handleFirebaseRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMessage('Please fill in name, email, and password.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const fbUser = await registerWithFirebase(name, email, password);
      // Store user & donor profile in local app context
      registerUser({
        id: fbUser.uid,
        name,
        email,
        phone: phone || '+1 (555) 000-0000',
        role,
        city: 'New York',
        area: 'Manhattan Medical District',
        bloodGroup: role === 'donor' ? bloodGroup : undefined,
        age: role === 'donor' ? age : undefined,
        gender: role === 'donor' ? gender : undefined
      });

      showToast({
        type: 'success',
        title: 'Account Created in Firebase',
        message: `Welcome to LifeLink, ${name}!`
      });
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setErrorMessage(formatFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Firebase Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const fbUser = await loginWithGoogleFirebase();
      registerUser({
        id: fbUser.uid,
        name: fbUser.displayName || 'Google User',
        email: fbUser.email || '',
        phone: fbUser.phoneNumber || '+1 (555) 000-0000',
        role: 'donor',
        city: 'New York',
        area: 'Manhattan Medical District',
        avatar: fbUser.photoURL || undefined,
        bloodGroup: 'O+'
      });

      showToast({
        type: 'success',
        title: 'Signed in with Google',
        message: `Authenticated via Firebase as ${fbUser.displayName}!`
      });
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setErrorMessage(formatFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Password Reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await resetFirebasePassword(email);
      showToast({
        type: 'success',
        title: 'Password Reset Sent',
        message: `Firebase password reset link dispatched to ${email}.`
      });
      setMode('login');
    } catch (err: any) {
      setErrorMessage(formatFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (userId: string) => {
    loginUser(userId);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden relative animate-fadeIn">
        {/* Header with Firebase Badge */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-6 relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-red-200">
              Firebase Auth (series-942f9)
            </span>
          </div>

          <h3 className="text-2xl font-black">
            {mode === 'login' ? 'Sign In to LifeLink' : mode === 'register' ? 'Register with Firebase' : 'Reset Firebase Password'}
          </h3>
          <p className="text-xs text-red-100 mt-1">
            Real-time emergency blood donation network with secure Firebase cloud authentication.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Error Message Box */}
          {errorMessage && (
            <div className="p-3.5 bg-red-50 rounded-2xl border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Authentication Notice</p>
                <p className="leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-2xl border-2 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-3 shadow-sm transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 absolute">
              Or with Email
            </span>
          </div>

          {/* Quick 1-Click Demo Login Bar */}
          <div className="bg-red-50/70 p-3.5 rounded-2xl border border-red-100 space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-800 block">
              Fast Demo Switcher
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('user-requester-1')}
                className="p-2 bg-white rounded-xl border border-red-200 hover:border-red-400 text-left text-xs font-bold text-slate-800 shadow-sm"
              >
                <p className="text-red-700 text-[10px] uppercase">Requester</p>
                <p className="truncate text-xs">Dr. Sarah</p>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('user-donor-1')}
                className="p-2 bg-white rounded-xl border border-red-200 hover:border-red-400 text-left text-xs font-bold text-slate-800 shadow-sm"
              >
                <p className="text-emerald-700 text-[10px] uppercase">Donor (O-)</p>
                <p className="truncate text-xs">Marcus V.</p>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('user-admin-1')}
                className="p-2 bg-white rounded-xl border border-red-200 hover:border-red-400 text-left text-xs font-bold text-slate-800 shadow-sm"
              >
                <p className="text-blue-700 text-[10px] uppercase">Admin</p>
                <p className="truncate text-xs">Elena R.</p>
              </button>
            </div>
          </div>

          {/* FIREBASE LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleFirebaseLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Firebase Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-1.5 text-slate-600">
                  <input type="checkbox" defaultChecked className="rounded accent-red-600" />
                  Remember session
                </label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-red-600 font-bold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Sign In With Firebase
              </button>
            </form>
          )}

          {/* FIREBASE REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleFirebaseRegister} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select User Role *
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRole('donor')}
                    className={`p-3 rounded-2xl border-2 text-left transition-all ${
                      role === 'donor'
                        ? 'border-red-600 bg-red-50 text-red-900 font-extrabold'
                        : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <Heart className="w-4 h-4 text-red-600 mb-1" />
                    <p className="text-xs font-bold">Blood Donor</p>
                    <p className="text-[10px] text-slate-500">I want to pledge & save lives</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('requester')}
                    className={`p-3 rounded-2xl border-2 text-left transition-all ${
                      role === 'requester'
                        ? 'border-red-600 bg-red-50 text-red-900 font-extrabold'
                        : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <User className="w-4 h-4 text-red-600 mb-1" />
                    <p className="text-xs font-bold">Blood Requester</p>
                    <p className="text-[10px] text-slate-500">Patient / Family attendant</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Firebase Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Emergency Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-red-500"
                />
              </div>

              {role === 'donor' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <span className="text-[10px] font-extrabold uppercase text-slate-500 block">
                    Donor Profile Specifications
                  </span>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Blood Group *
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {BLOOD_GROUPS.map(bg => (
                        <button
                          key={bg}
                          type="button"
                          onClick={() => setBloodGroup(bg)}
                          className={`py-1.5 rounded-lg text-xs font-bold border ${
                            bloodGroup === bg ? 'bg-red-600 text-white border-red-600 shadow' : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          {bg}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Age</label>
                      <input
                        type="number"
                        min="18"
                        max="65"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as any)}
                        className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Register Account with Firebase
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <p className="text-xs text-slate-600">
                Enter your registered Firebase email address. Firebase Authentication will send an official password reset link.
              </p>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-red-600 text-white font-extrabold text-xs uppercase rounded-xl flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Send Firebase Reset Email
              </button>
            </form>
          )}

          {/* Footer toggle */}
          <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => { setMode('register'); setErrorMessage(null); }}
                  className="text-red-600 font-bold hover:underline"
                >
                  Create Firebase Account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => { setMode('login'); setErrorMessage(null); }}
                  className="text-red-600 font-bold hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
