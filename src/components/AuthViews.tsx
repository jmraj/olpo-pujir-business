import React, { useState } from 'react';
import {
  TrendingUp,
  Coins,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  Gift,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import {
  googleSignIn,
  loginWithEmail,
  registerWithEmail,
  resetPassword,
  logoutFirebase,
  verifyAndSyncUserProfile,
  getBengaliAuthError,
  isGoogleSignInAvailable,
  FirestoreUserProfile,
} from '../firebase';

export type AuthSessionUser = FirestoreUserProfile;

interface AuthViewsProps {
  authStep: 'splash' | 'login' | 'register' | 'admin_login';
  onChangeStep: (
    step: 'splash' | 'login' | 'register' | 'admin_login'
  ) => void;
  onAuthenticated: (user: AuthSessionUser, openAdminPanel?: boolean) => void;
  appTarget?: 'user' | 'admin';
}

export const BrandLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({
  size = 'md',
}) => {
  const dims =
    size === 'lg'
      ? 'w-24 h-24 rounded-[26px]'
      : size === 'sm'
      ? 'w-11 h-11 rounded-2xl'
      : 'w-16 h-16 rounded-[20px]';

  return (
    <div
      className={`${dims} p-[2px] bg-gradient-to-b from-[#FDE047] via-[#EAB308] to-[#B45309] shadow-lg shadow-emerald-950/40 inline-flex items-center justify-center relative shrink-0`}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full rounded-[inherit] overflow-hidden"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="apbBg" cx="50%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#057A28" />
            <stop offset="65%" stopColor="#024D18" />
            <stop offset="100%" stopColor="#012B0D" />
          </radialGradient>
          <linearGradient id="apbGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="45%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="apbBagSide" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="apbBar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
        </defs>

        {/* Rich Emerald Background */}
        <rect width="200" height="200" rx="38" fill="url(#apbBg)" />

        {/* Golden Shopping Bag */}
        <path
          d="M66 44 C66 24, 96 24, 96 44"
          fill="none"
          stroke="url(#apbGold)"
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        <path
          d="M78 44 C78 28, 104 28, 104 44"
          fill="none"
          stroke="#D97706"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <polygon points="104,42 115,46 118,92 106,96" fill="url(#apbBagSide)" />
        <polygon points="50,42 104,42 108,96 44,94" fill="url(#apbGold)" />
        <circle cx="66" cy="48" r="3.5" fill="#024D18" />
        <circle cx="92" cy="48" r="3.5" fill="#024D18" />

        {/* Green Leaves on Bag */}
        <path
          d="M76 86 C64 82, 58 70, 62 60 C72 64, 78 74, 76 86 Z"
          fill="#047857"
        />
        <path
          d="M78 86 C78 70, 88 56, 102 52 C100 68, 92 80, 78 86 Z"
          fill="#059669"
        />

        {/* Rising Green Bars */}
        <rect x="94" y="84" width="9" height="16" rx="2" fill="url(#apbBar)" />
        <rect x="106" y="74" width="10" height="26" rx="2" fill="url(#apbBar)" />
        <rect x="120" y="64" width="10" height="36" rx="2" fill="url(#apbBar)" />
        <rect x="134" y="52" width="11" height="48" rx="2" fill="url(#apbBar)" />
        <rect x="148" y="42" width="11" height="58" rx="2" fill="url(#apbBar)" />

        {/* Sweeping Golden Upward Arrow */}
        <path
          d="M36 68 C42 105, 82 108, 114 96 C90 100, 56 96, 46 72 Z"
          fill="url(#apbGold)"
        />
        <path
          d="M88 76 L146 32"
          stroke="url(#apbGold)"
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        <polygon points="158,22 138,28 148,42" fill="#FEF08A" />

        {/* Golden Taka Coin & Coin Stack */}
        <ellipse cx="144" cy="96" rx="13" ry="4" fill="#D97706" />
        <rect x="131" y="78" width="26" height="18" rx="3" fill="url(#apbGold)" />
        <ellipse cx="144" cy="78" rx="13" ry="4" fill="#FEF08A" />
        <circle
          cx="124"
          cy="90"
          r="15"
          fill="url(#apbGold)"
          stroke="#B45309"
          strokeWidth="2"
        />
        <text
          x="124"
          y="96"
          textAnchor="middle"
          fill="#78350F"
          fontSize="19"
          fontWeight="900"
          fontFamily="sans-serif"
        >
          ৳
        </text>

        {/* Bengali Title: অল্প পুঁজির ব্যবসা */}
        <text
          x="100"
          y="134"
          textAnchor="middle"
          fill="#FFFFFF"
          stroke="#012B0D"
          strokeWidth="3"
          paintOrder="stroke"
          fontSize="30"
          fontWeight="900"
          fontFamily="'Hind Siliguri', sans-serif"
        >
          অল্প পুঁজির
        </text>
        <line
          x1="24"
          y1="158"
          x2="44"
          y2="158"
          stroke="#FACC15"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="156"
          y1="158"
          x2="176"
          y2="158"
          stroke="#FACC15"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <text
          x="100"
          y="170"
          textAnchor="middle"
          fill="url(#apbGold)"
          stroke="#012B0D"
          strokeWidth="3.5"
          paintOrder="stroke"
          fontSize="36"
          fontWeight="900"
          fontFamily="'Hind Siliguri', sans-serif"
        >
          ব্যবসা
        </text>
      </svg>
    </div>
  );
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BD_PHONE_REGEX = /^(?:\+?88)?01[3-9]\d{8}$/;

export const AuthViews: React.FC<AuthViewsProps> = ({
  authStep,
  onChangeStep,
  onAuthenticated,
  appTarget = 'user',
}) => {
  const isAdminMode = appTarget === 'admin' || authStep === 'admin_login';
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCodeInput, setReferralCodeInput] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Feedback state
  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDuplicateEmailError, setIsDuplicateEmailError] = useState(false);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  // Forgot Password Modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  // Splash Screen
  if (authStep === 'splash') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#042F24] via-[#064E3B] to-[#022C22] text-white flex flex-col items-center justify-between p-6 relative overflow-hidden">
        <div className="w-full max-w-md flex justify-end pt-2">
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 border border-[#D4AF37]/30 text-[#FDE68A]">
            v1.0 • Firebase Secured
          </span>
        </div>

        <div className="my-auto flex flex-col items-center text-center max-w-sm z-10">
          <div className="mb-6 relative">
            <div className="absolute -inset-4 rounded-full bg-[#D4AF37]/20 blur-xl animate-pulse" />
            <BrandLogo size="lg" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
            অল্প পুঁজির ব্যবসা
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#FDE68A] text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-[#FBBF24]" />
            <span>ছোট পুঁজি • বড় সম্ভাবনা</span>
          </div>

          <p className="text-emerald-100/85 text-sm leading-relaxed mb-8">
            বাংলাদেশের নতুন ও ক্ষুদ্র উদ্যোক্তাদের জন্য লাভজনক ব্যবসার আইডিয়া,
            পুঁজি ও লাভ ক্যালকুলেটর, পাইকারি মার্কেটপ্লেস এবং এআই বিজনেস
            কনসালট্যান্ট।
          </p>

          <div className="w-full space-y-3">
            <button
              onClick={() => {
                setErrorMsg(null);
                setInfoMsg(null);
                onChangeStep('login');
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#D97706] text-slate-950 font-bold text-base shadow-lg shadow-amber-500/25 hover:brightness-105 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>লগইন করে শুরু করুন</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                setErrorMsg(null);
                setInfoMsg(null);
                onChangeStep('register');
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition cursor-pointer"
            >
              নতুন অ্যাকাউন্ট তৈরি করুন
            </button>
          </div>
        </div>

        <div className="w-full max-w-md text-center pb-2 z-10">
          <div className="flex items-center justify-center gap-4 text-xs text-emerald-200/75">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#FBBF24]" /> ভেরিফায়েড গাইড
            </span>
            <span>•</span>
            <span>৩০+ ক্যাটাগরি</span>
            <span>•</span>
            <span>সিকিউর ওয়ালেট</span>
          </div>
        </div>
      </div>
    );
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);
    setIsDuplicateEmailError(false);

    const trimmedEmail = loginEmail.trim();
    if (!trimmedEmail) {
      setErrorMsg('অনুগ্রহ করে আপনার ইমেইল ঠিকানা লিখুন।');
      return;
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setErrorMsg(
        'প্রদত্ত ইমেইল ঠিকানাটি সঠিক নয়। অনুগ্রহ করে সঠিক ইমেইল লিখুন (যেমন: name@example.com)।'
      );
      return;
    }
    if (!loginPassword) {
      setErrorMsg('অনুগ্রহ করে আপনার পাসওয়ার্ড লিখুন।');
      return;
    }

    setLoading(true);
    setLoadingLabel('লগইন যাচাই করা হচ্ছে...');
    try {
      const fbUser = await loginWithEmail(trimmedEmail, loginPassword);
      setLoadingLabel('প্রোফাইল লোড হচ্ছে...');
      const profile = await verifyAndSyncUserProfile(fbUser);

      if (profile.status === 'banned') {
        try {
          await logoutFirebase();
        } catch {}
        setErrorMsg(
          'আপনার অ্যাকাউন্টটি অ্যাডমিন কর্তৃক স্থগিত (Banned) করা হয়েছে।'
        );
        return;
      }

      if (isAdminMode && !profile.isAuthorizedAdmin) {
        try {
          await logoutFirebase();
        } catch {}
        setErrorMsg(
          'প্রবেশাধিকার সংরক্ষিত: এই অ্যাকাউন্টে অ্যাডমিন প্যানেল অ্যাক্সেস নেই (Unauthorized Normal User)। শুধুমাত্র অনুমোদিত অ্যাডমিন লগইন করতে পারবেন।'
        );
        return;
      }

      if (isAdminMode && profile.isAuthorizedAdmin) {
        try {
          localStorage.setItem('alpo_admin_session_active', 'true');
        } catch {}
      }

      onAuthenticated(profile, isAdminMode);
    } catch (err: unknown) {
      setErrorMsg(getBengaliAuthError(err));
    } finally {
      setLoading(false);
      setLoadingLabel('');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);
    setIsDuplicateEmailError(false);

    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim().replace(/[\s-]/g, '');
    const trimmedEmail = email.trim();
    const trimmedReferral = referralCodeInput.trim().toUpperCase();

    // 1. Registration Validation
    if (trimmedName.length < 2) {
      setErrorMsg('অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন (কমপক্ষে ২ অক্ষর)।');
      return;
    }
    if (!BD_PHONE_REGEX.test(trimmedPhone)) {
      setErrorMsg(
        'অনুগ্রহ করে ১১ ডিজিটের সঠিক বাংলাদেশি মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)।'
      );
      return;
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setErrorMsg(
        'অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা লিখুন (যেমন: name@example.com)।'
      );
      return;
    }
    if (password.length < 6) {
      setErrorMsg('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }
    // 2. Password Confirmation Validation
    if (password !== confirmPassword) {
      setErrorMsg(
        'পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না। অনুগ্রহ করে দুটি ঘরেই একই পাসওয়ার্ড লিখুন।'
      );
      return;
    }

    setLoading(true);
    setLoadingLabel('Firebase অ্যাকাউন্ট তৈরি হচ্ছে...');
    try {
      const fbUser = await registerWithEmail(
        trimmedName,
        trimmedEmail,
        password
      );
      setLoadingLabel('Firestore ডাটাবেসে প্রোফাইল সংরক্ষণ হচ্ছে...');
      const profile = await verifyAndSyncUserProfile(fbUser, {
        fullName: trimmedName,
        phone: trimmedPhone,
        referredBy: trimmedReferral,
      });

      onAuthenticated(profile);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || '';
      if (code === 'auth/email-already-in-use') {
        setIsDuplicateEmailError(true);
      }
      setErrorMsg(getBengaliAuthError(err));
    } finally {
      setLoading(false);
      setLoadingLabel('');
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setInfoMsg(null);
    setIsDuplicateEmailError(false);
    setLoading(true);
    setLoadingLabel('Google সাইন-ইন যাচাই হচ্ছে...');
    try {
      const res = await googleSignIn();
      if (res?.user) {
        setLoadingLabel('প্রোফাইল সিঙ্ক করা হচ্ছে...');
        const profile = await verifyAndSyncUserProfile(res.user);
        if (profile.status === 'banned') {
          try {
            await logoutFirebase();
          } catch {}
          setErrorMsg(
            'আপনার অ্যাকাউন্টটি অ্যাডমিন কর্তৃক স্থগিত (Banned) করা হয়েছে।'
          );
          return;
        }
        if (isAdminMode && !profile.isAuthorizedAdmin) {
          try {
            await logoutFirebase();
          } catch {}
          setErrorMsg(
            'প্রবেশাধিকার সংরক্ষিত: এই অ্যাকাউন্টে অ্যাডমিন প্যানেল অ্যাক্সেস নেই (Unauthorized Normal User)।'
          );
          return;
        }
        if (isAdminMode && profile.isAuthorizedAdmin) {
          try {
            localStorage.setItem('alpo_admin_session_active', 'true');
          } catch {}
        }
        onAuthenticated(profile, isAdminMode);
      }
    } catch (err: unknown) {
      setErrorMsg(getBengaliAuthError(err));
    } finally {
      setLoading(false);
      setLoadingLabel('');
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    const trimmed = resetEmail.trim();
    if (!EMAIL_REGEX.test(trimmed)) {
      setResetError('অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা লিখুন।');
      return;
    }

    setResetLoading(true);
    try {
      await resetPassword(trimmed);
      setInfoMsg(
        `পাসওয়ার্ড রিসেট লিংক ${trimmed} ঠিকানায় পাঠানো হয়েছে। অনুগ্রহ করে আপনার ইমেইল ইনবক্স এবং Spam ফোল্ডার চেক করুন।`
      );
      setShowForgotModal(false);
      setResetEmail('');
    } catch (err: unknown) {
      setResetError(getBengaliAuthError(err));
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col justify-between">
      {/* Emerald Header Banner */}
      <div className="bg-gradient-to-br from-[#042F24] via-[#064E3B] to-[#047857] text-white pt-8 pb-14 px-6 rounded-b-[36px] shadow-xl relative overflow-hidden">
        <div className="max-w-md mx-auto flex flex-col items-center text-center relative z-10">
          <BrandLogo size="md" />
          <h1 className="text-2xl font-bold mt-3">
            {isAdminMode ? 'অল্প পুঁজির ব্যবসা Admin' : 'অল্প পুঁজির ব্যবসা'}
          </h1>
          <p className="text-xs text-[#FDE68A] font-medium mt-0.5">
            {isAdminMode
              ? 'সিকিউর অ্যাডমিনিস্ট্রেটর অ্যাপ • alpo.pujir.bebsha.admin'
              : 'ছোট পুঁজি • বড় সম্ভাবনা'}
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="max-w-md w-full mx-auto px-4 -mt-8 pb-10 flex-1">
        <div className="bg-white rounded-[24px] shadow-xl shadow-emerald-950/5 border border-emerald-900/10 p-6">
          {/* Tab Switcher */}
          {isAdminMode ? (
            <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-[#042F24] to-[#064E3B] text-white border border-[#D4AF37]/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#FBBF24]" />
                <div>
                  <h3 className="text-xs font-extrabold text-[#FDE68A]">
                    অল্প পুঁজির ব্যবসা Admin — অথেনটিকেশন
                  </h3>
                  <p className="text-[11px] text-emerald-100/80">
                    শুধুমাত্র অনুমোদিত অ্যাডমিন ও মডারেটরদের জন্য (Firebase Role Verified)
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-2xl mb-6">
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setErrorMsg(null);
                  setInfoMsg(null);
                  setIsDuplicateEmailError(false);
                  onChangeStep('login');
                }}
                className={`py-2.5 text-sm font-bold rounded-xl transition cursor-pointer ${
                  authStep === 'login'
                    ? 'bg-[#064E3B] text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                লগইন (Login)
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setErrorMsg(null);
                  setInfoMsg(null);
                  setIsDuplicateEmailError(false);
                  onChangeStep('register');
                }}
                className={`py-2.5 text-sm font-bold rounded-xl transition cursor-pointer ${
                  authStep === 'register'
                    ? 'bg-[#064E3B] text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                রেজিস্ট্রেশন (Sign Up)
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs space-y-2">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span className="leading-relaxed font-medium">{errorMsg}</span>
              </div>
              {isDuplicateEmailError && (
                <div className="pt-1 pl-6">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail(email.trim());
                      setErrorMsg(null);
                      setIsDuplicateEmailError(false);
                      onChangeStep('login');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#064E3B] text-white text-xs font-bold cursor-pointer"
                  >
                    এই ইমেইল দিয়ে লগইন করুন →
                  </button>
                </div>
              )}
            </div>
          )}

          {infoMsg && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span className="leading-relaxed font-medium">{infoMsg}</span>
            </div>
          )}

          {authStep === 'login' || isAdminMode ? (
            <form onSubmit={handleEmailLogin} className="space-y-4" noValidate>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ইমেইল অ্যাড্রেস (Email) *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    disabled={loading}
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="email@example.com"
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/70 text-sm focus:bg-white focus:border-[#059669] focus:outline-none disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    পাসওয়ার্ড (Password) *
                  </label>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setResetEmail(loginEmail);
                      setResetError(null);
                      setShowForgotModal(true);
                    }}
                    className="text-xs font-semibold text-[#059669] hover:underline cursor-pointer"
                  >
                    পাসওয়ার্ড ভুলে গেছেন?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    disabled={loading}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50/70 text-sm focus:bg-white focus:border-[#059669] focus:outline-none disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#064E3B] to-[#059669] text-white font-bold text-sm shadow-md shadow-emerald-900/15 hover:brightness-105 transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{loadingLabel || 'লগইন হচ্ছে...'}</span>
                  </>
                ) : (
                  <span>লগইন করুন</span>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5" noValidate>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  পূর্ণ নাম (Full Name) *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    disabled={loading}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="আপনার পূর্ণ নাম লিখুন"
                    autoComplete="name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-sm focus:bg-white focus:border-[#059669] focus:outline-none disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  মোবাইল নম্বর (Mobile Number) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    disabled={loading}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    autoComplete="tel"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-sm focus:bg-white focus:border-[#059669] focus:outline-none disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ইমেইল অ্যাড্রেস (Email) *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-sm focus:bg-white focus:border-[#059669] focus:outline-none disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর) *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      disabled={loading}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="কমপক্ষে ৬ অক্ষর"
                      autoComplete="new-password"
                      className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-sm focus:bg-white focus:border-[#059669] focus:outline-none disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
                    >
                      {showRegPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    পাসওয়ার্ড নিশ্চিত করুন *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      disabled={loading}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="পুনরায় লিখুন"
                      autoComplete="new-password"
                      className={`w-full pl-9 pr-8 py-2.5 rounded-xl border bg-slate-50/70 text-sm focus:bg-white focus:outline-none disabled:opacity-60 ${
                        confirmPassword && confirmPassword !== password
                          ? 'border-red-400 focus:border-red-500'
                          : confirmPassword && confirmPassword === password
                          ? 'border-emerald-500 focus:border-emerald-600'
                          : 'border-slate-200 focus:border-[#059669]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {confirmPassword && confirmPassword !== password && (
                <p className="text-[11px] text-red-600 font-medium">
                  * পাসওয়ার্ড দুটি এখনো মেলেনি।
                </p>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  রেফারেল কোড (ঐচ্ছিক • বোনাস পয়েন্ট পেতে)
                </label>
                <div className="relative">
                  <Gift className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    disabled={loading}
                    value={referralCodeInput}
                    onChange={(e) =>
                      setReferralCodeInput(e.target.value.toUpperCase())
                    }
                    placeholder="যেমন: APB-XXXXXX"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50/40 text-sm focus:bg-white focus:border-amber-500 focus:outline-none uppercase disabled:opacity-60"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#064E3B] to-[#059669] text-white font-bold text-sm shadow-md shadow-emerald-900/15 hover:brightness-105 transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{loadingLabel || 'অ্যাকাউন্ট তৈরি হচ্ছে...'}</span>
                  </>
                ) : (
                  <span>রেজিস্ট্রেশন সম্পন্ন করুন (+২৫ পয়েন্ট)</span>
                )}
              </button>
            </form>
          )}

          {/* Google Sign-In only if Firebase configuration is properly available */}
          {isGoogleSignInAvailable && (
            <>
              <div className="my-5 flex items-center gap-3">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-xs text-slate-400 font-medium">
                  অথবা
                </span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold text-sm flex items-center justify-center gap-2.5 transition cursor-pointer disabled:opacity-60"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.8C3.5 21.4 7.4 24 12 24z"
                  />
                </svg>
                <span>Google দিয়ে চালিয়ে যান</span>
              </button>
            </>
          )}

          {/* Security badge footer — User App never exposes Admin Login */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
              <span>
                {isAdminMode
                  ? 'Firebase Authentication + Firestore Role Guard দ্বারা সুরক্ষিত'
                  : 'অল্প পুঁজির ব্যবসা • Firebase Authentication দ্বারা সুরক্ষিত'}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              পাসওয়ার্ড রিসেট করুন
            </h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              আপনার নিবন্ধিত ইমেইল ঠিকানা দিন। Firebase Authentication থেকে
              পাসওয়ার্ড পরিবর্তনের লিংক পাঠানো হবে।
            </p>
            {resetError && (
              <div className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {resetError}
              </div>
            )}
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
              <input
                type="email"
                required
                disabled={resetLoading}
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="আপনার ইমেইল লিখুন (name@example.com)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#059669] focus:outline-none"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={resetLoading}
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#064E3B] text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {resetLoading && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  <span>রিসেট লিংক পাঠান</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
