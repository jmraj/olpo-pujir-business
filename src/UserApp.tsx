import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  Grid,
  Store,
  Heart,
  User as UserIcon,
  Bell,
  Search,
  Sparkles,
  Crown,
  Calculator,
  ClipboardCheck,
  Bot,
  BookOpen,
  Award,
  Coins,
  ArrowRight,
  Star,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import {
  doc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import {
  db,
  initAuth,
  logoutFirebase,
  verifyAndSyncUserProfile,
  resetPassword,
} from './firebase';
import {
  ASSETS,
  INITIAL_CATEGORIES,
  INITIAL_BUSINESS_IDEAS,
  INITIAL_CHECKLISTS,
  INITIAL_ADVICE_ARTICLES,
  INITIAL_PRODUCTS,
  INITIAL_SUCCESS_STORIES,
  INITIAL_RESOURCES,
  CategoryItem,
  BusinessIdeaItem,
  MarketplaceProductItem,
  INITIAL_BUY_AND_EARN_PACKAGES,
  BuyAndEarnPackageItem,
  getPaymentGatewayAccounts,
} from './data/seedData';
import {
  AuthViews,
  AuthSessionUser,
  BrandLogo,
} from './components/AuthViews';
import {
  CategoriesScreen,
  BusinessIdeasScreen,
  BusinessIdeaDetailScreen,
  CategoryIcon,
} from './components/BusinessViews';
import { CalculatorsView } from './components/CalculatorsView';
import {
  ChecklistsScreen,
  AdviceHubScreen,
  AiConsultantScreen,
  SuccessAndResourcesScreen,
} from './components/HubViews';
import {
  MarketplaceScreen,
  ProductDetailScreen,
  SellerProfileScreen,
  MyOrdersScreen,
  MembershipScreen,
  ReferralScreen,
  WalletScreen,
  WithdrawalScreen,
  NotificationsScreen,
  ProfileScreen,
  SettingsScreen,
  BuyerOrderRecord,
  MembershipRequestRecord,
} from './components/MarketplaceAndWalletViews';
import type {
  WithdrawalRecord,
  WalletAuditRecord,
  NoticeRecord,
} from './components/AdminPanelView';

export type UserActiveScreen =
  | 'home'
  | 'categories'
  | 'ideas'
  | 'idea_detail'
  | 'marketplace'
  | 'product_detail'
  | 'seller_profile'
  | 'my_orders'
  | 'favorites'
  | 'membership'
  | 'referral'
  | 'wallet'
  | 'withdrawal'
  | 'notifications'
  | 'profile'
  | 'settings'
  | 'calculators'
  | 'checklists'
  | 'advice'
  | 'ai_consultant'
  | 'stories';

interface UserAppProps {
  /** Only used in multi-app web preview for verified Super Admin to jump to separate Admin App */
  onOpenSeparateAdminApp?: () => void;
}

export default function UserApp({ onOpenSeparateAdminApp }: UserAppProps) {
  // Authentication & Session State (User App strictly uses 'splash' | 'login' | 'register')
  const [authInitializing, setAuthInitializing] = useState<boolean>(true);
  const [authStep, setAuthStep] = useState<
    'splash' | 'login' | 'register' | 'admin_login'
  >('splash');
  const [currentUser, setCurrentUser] = useState<AuthSessionUser | null>(null);

  // Navigation State — strictly User Panel screens only (no Admin Panel route in User App)
  const [activeScreen, setActiveScreen] = useState<UserActiveScreen>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedIdea, setSelectedIdea] = useState<BusinessIdeaItem | null>(
    null
  );
  const [selectedProduct, setSelectedProduct] =
    useState<MarketplaceProductItem | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<{
    sellerId: string;
    sellerName: string;
    sellerPhone: string;
    location: string;
  } | null>(null);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string>('');
  const [homeSearch, setHomeSearch] = useState<string>('');

  // Firestore-backed User Domain Data State
  const [categories, setCategories] =
    useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [ideas, setIdeas] = useState<BusinessIdeaItem[]>(
    INITIAL_BUSINESS_IDEAS
  );
  const [products, setProducts] =
    useState<MarketplaceProductItem[]>(INITIAL_PRODUCTS);
  const [favorites, setFavorites] = useState<string[]>(['idea-1', 'idea-2']);
  const [completedTasks, setCompletedTasks] = useState<string[]>(['t1', 't2']);
  const [orders, setOrders] = useState<BuyerOrderRecord[]>([]);
  const [membershipRequests, setMembershipRequests] = useState<
    MembershipRequestRecord[]
  >([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<WalletAuditRecord[]>([]);
  const [userInvestments, setUserInvestments] = useState<
    Array<{
      id: string;
      projectId: string;
      projectTitle: string;
      categoryName: string;
      amountBdt: number;
      expectedMonthlyProfitBdt: number;
      profitSharePercent: string;
      durationMonths: number;
      paymentMethod: string;
      transactionId: string;
      status: 'pending' | 'active' | 'completed' | 'rejected';
      totalProfitPaidBdt: number;
      createdAt: string;
    }>
  >([]);
  const [investModalIdea, setInvestModalIdea] =
    useState<BusinessIdeaItem | null>(null);
  const [investAmount, setInvestAmount] = useState<number>(5000);
  const [investDuration, setInvestDuration] = useState<number>(6);
  const [investPaymentMethod, setInvestPaymentMethod] = useState<
    'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Wallet'
  >('bKash');
  const [investTrxId, setInvestTrxId] = useState<string>('');
  const [investSubmitting, setInvestSubmitting] = useState<boolean>(false);
  const [investSuccessMsg, setInvestSuccessMsg] = useState<string | null>(null);
  const [buyPackages] = useState<BuyAndEarnPackageItem[]>(
    INITIAL_BUY_AND_EARN_PACKAGES
  );
  const [selectedBuyPkg, setSelectedBuyPkg] =
    useState<BuyAndEarnPackageItem | null>(null);
  const [buyQty, setBuyQty] = useState<number>(1);
  const [buyFulfillmentMode, setBuyFulfillmentMode] = useState<
    'auto_resell' | 'home_delivery'
  >('auto_resell');
  const [copiedPayNum, setCopiedPayNum] = useState<string | null>(null);
  const [selectedReceiptInv, setSelectedReceiptInv] = useState<
    (typeof userInvestments)[number] | null
  >(null);
  const [dailyCheckedIn, setDailyCheckedIn] = useState<boolean>(() => {
    try {
      const todayKey = new Date().toISOString().slice(0, 10);
      return localStorage.getItem('apb_daily_checkin_' + todayKey) === '1';
    } catch {
      return false;
    }
  });
  const [resellCopiedId, setResellCopiedId] = useState<string | null>(null);
  const paymentAccounts = getPaymentGatewayAccounts();

  const handleCopyPayNumber = (num: string) => {
    try {
      navigator.clipboard.writeText(num);
      setCopiedPayNum(num);
      setTimeout(() => setCopiedPayNum(null), 2000);
    } catch {}
  };

  const handleDailyCheckIn = async () => {
    if (dailyCheckedIn || !currentUser) return;
    const todayKey = new Date().toISOString().slice(0, 10);
    try {
      localStorage.setItem('apb_daily_checkin_' + todayKey, '1');
    } catch {}
    setDailyCheckedIn(true);
    const nextPoints = (currentUser.points || 0) + 10;
    setCurrentUser((prev) => (prev ? { ...prev, points: nextPoints } : null));
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        points: nextPoints,
        updatedAt: serverTimestamp(),
      });
    } catch {}
  };
  const [notices, setNotices] = useState<NoticeRecord[]>([
    {
      id: 'not-1',
      title: 'নতুন ৩০টি ক্যাটাগরি ও ৭টি বিজনেস ক্যালকুলেটর যুক্ত হয়েছে!',
      message:
        'আপনার পুঁজি অনুযায়ী সঠিক ব্যবসা খুঁজে পেতে আমাদের নতুন লাভ ক্যালকুলেটর ও এআই বিজনেস কনসালট্যান্ট ব্যবহার করুন।',
      targetAudience: 'all',
      published: true,
      createdAt: 'আজ',
    },
    {
      id: 'not-2',
      title: '৳২৯৯ প্রিমিয়াম মেম্বারশিপে ৫০ বোনাস পয়েন্ট ও রেফারেল ক্যাশব্যাক!',
      message:
        'বন্ধুকে রেফার করে প্রিমিয়াম মেম্বারশিপ সক্রিয় করলেই পাচ্ছেন নগদ ৳৫০ ওয়ালেট বোনাস।',
      targetAudience: 'all',
      published: true,
      createdAt: 'গতকাল',
    },
  ]);

  // 1. Persistent Firebase Auth Listener
  const authStepRef = useRef(authStep);
  useEffect(() => {
    authStepRef.current = authStep;
  }, [authStep]);
  const initialAuthCheckedRef = useRef(false);

  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setAuthInitializing(false);
    }, 1500);
    const unsubscribe = initAuth(
      async (fbUser) => {
        clearTimeout(safetyTimer);
        if (
          initialAuthCheckedRef.current &&
          authStepRef.current === 'register'
        ) {
          return;
        }
        try {
          const profile = await verifyAndSyncUserProfile(fbUser);
          if (profile.status === 'banned') {
            try {
              await logoutFirebase();
            } catch {}
            setCurrentUser(null);
            return;
          }
          setCurrentUser(profile);
          if (profile.favorites && profile.favorites.length > 0) {
            setFavorites(profile.favorites);
          }
          if (profile.checklistProgress) {
            try {
              const parsed = JSON.parse(profile.checklistProgress);
              if (Array.isArray(parsed)) setCompletedTasks(parsed);
            } catch {}
          }
        } catch (err) {
          console.error('Error syncing user profile:', err);
        } finally {
          initialAuthCheckedRef.current = true;
          setAuthInitializing(false);
        }
      },
      () => {
        clearTimeout(safetyTimer);
        initialAuthCheckedRef.current = true;
        setCurrentUser(null);
        setAuthInitializing(false);
      }
    );
    return () => {
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, []);

  // 2. Load User & Platform Collections from Cloud Firestore when logged in
  useEffect(() => {
    if (!currentUser) return;

    const loadFirestoreData = async () => {
      // Categories (enabled only for User App, merged with seed categories and photos)
      try {
        const catSnap = await getDocs(
          query(collection(db, 'categories'), where('enabled', '==', true))
        );
        if (!catSnap.empty) {
          const loadedCats = catSnap.docs.map(
            (d) => d.data() as CategoryItem
          );
          const mergedCats: CategoryItem[] = loadedCats.map((cat) => {
            const seedMatch = INITIAL_CATEGORIES.find(
              (sc) => sc.id === cat.id || sc.nameBn === cat.nameBn
            );
            return {
              ...seedMatch,
              ...cat,
              imageUrl: cat.imageUrl || seedMatch?.imageUrl || '',
              fallbackImageUrl:
                cat.fallbackImageUrl || seedMatch?.fallbackImageUrl || '',
              expectedRoi: cat.expectedRoi || seedMatch?.expectedRoi,
              minInvestBdt: cat.minInvestBdt || seedMatch?.minInvestBdt,
              shortDesc: cat.shortDesc || seedMatch?.shortDesc,
            };
          });
          INITIAL_CATEGORIES.forEach((seedCat) => {
            if (
              seedCat.enabled &&
              !mergedCats.some(
                (c) => c.id === seedCat.id || c.nameBn === seedCat.nameBn
              )
            ) {
              mergedCats.push(seedCat);
            }
          });
          setCategories(mergedCats.sort((a, b) => a.order - b.order));
        }
      } catch {}

      // Business Ideas (merged with seed ideas including 3 investment categories)
      try {
        const ideaSnap = await getDocs(
          query(
            collection(db, 'businessIdeas'),
            where('minInvestmentBdt', '>=', 0)
          )
        );
        if (!ideaSnap.empty) {
          const loadedIdeas = ideaSnap.docs.map(
            (d) => d.data() as BusinessIdeaItem
          );
          const mergedIdeas = [...loadedIdeas];
          INITIAL_BUSINESS_IDEAS.forEach((seedIdea) => {
            if (!mergedIdeas.some((i) => i.id === seedIdea.id)) {
              mergedIdeas.push(seedIdea);
            }
          });
          setIdeas(mergedIdeas);
        }
      } catch {}

      // Current User's Investments
      try {
        const invSnap = await getDocs(
          query(
            collection(db, 'investments'),
            where('userId', '==', currentUser.uid)
          )
        );
        const loadedInv = invSnap.docs.map((d) => {
          const data = d.data();
          return {
            id: data.id,
            projectId: data.projectId,
            projectTitle: data.projectTitle,
            categoryName: data.categoryName,
            amountBdt: Number(data.amountBdt) || 0,
            expectedMonthlyProfitBdt: Number(data.expectedMonthlyProfitBdt) || 0,
            profitSharePercent: data.profitSharePercent || '১৫% / মাস',
            durationMonths: Number(data.durationMonths) || 6,
            paymentMethod: data.paymentMethod || 'bKash',
            transactionId: data.transactionId || '',
            status: (data.status || 'pending') as
              | 'pending'
              | 'active'
              | 'completed'
              | 'rejected',
            totalProfitPaidBdt: Number(data.totalProfitPaidBdt) || 0,
            createdAt: 'Firestore সংরক্ষিত',
          };
        });
        setUserInvestments(loadedInv);
      } catch {}

      // Marketplace Products (approved only for User App)
      try {
        const prodSnap = await getDocs(
          query(collection(db, 'products'), where('status', '==', 'approved'))
        );
        if (!prodSnap.empty) {
          const loadedProds = prodSnap.docs.map(
            (d) => d.data() as MarketplaceProductItem
          );
          const merged = [...loadedProds];
          INITIAL_PRODUCTS.forEach((seedProd) => {
            if (!merged.some((p) => p.id === seedProd.id)) {
              merged.push(seedProd);
            }
          });
          setProducts(merged);
        }
      } catch {}

      // Current User's Orders
      try {
        const ordSnap = await getDocs(
          query(
            collection(db, 'orders'),
            where('buyerId', '==', currentUser.uid)
          )
        );
        const loadedOrders: BuyerOrderRecord[] = ordSnap.docs.map((d) => {
          const data = d.data();
          return {
            id: data.id,
            productId: data.productId,
            productTitle: data.productTitle,
            buyerId: data.buyerId,
            buyerName: data.buyerName,
            buyerPhone: data.buyerPhone,
            deliveryAddress: data.deliveryAddress,
            quantity: Number(data.quantity) || 1,
            totalPriceBdt: Number(data.totalPriceBdt) || 0,
            status: data.status || 'placed',
            createdAt: 'Firestore সংরক্ষিত',
          };
        });
        setOrders(loadedOrders);
      } catch {}

      // Current User's Withdrawals
      try {
        const wSnap = await getDocs(
          query(
            collection(db, 'withdrawals'),
            where('userId', '==', currentUser.uid)
          )
        );
        const loadedW: WithdrawalRecord[] = wSnap.docs.map((d) => {
          const data = d.data();
          return {
            id: data.id,
            userId: data.userId,
            userName: data.userName,
            amountBdt: Number(data.amountBdt) || 0,
            method: data.method || 'bKash',
            accountNumber: data.accountNumber || '',
            status: data.status || 'pending',
            rejectionReason: data.rejectionReason,
            createdAt: 'Firestore সংরক্ষিত',
          };
        });
        setWithdrawals(loadedW);
      } catch {}

      // Current User's Membership Requests
      try {
        const mSnap = await getDocs(
          query(
            collection(db, 'memberships'),
            where('userId', '==', currentUser.uid)
          )
        );
        const loadedM: MembershipRequestRecord[] = mSnap.docs.map((d) => {
          const data = d.data();
          return {
            id: data.id,
            userId: data.userId,
            userName: data.userName,
            amountBdt: Number(data.amountBdt) || 299,
            paymentMethod: data.paymentMethod || 'bKash',
            transactionReference: data.transactionReference || '',
            status: data.status || 'pending',
            createdAt: 'Firestore সংরক্ষিত',
          };
        });
        setMembershipRequests(loadedM);
      } catch {}

      // Current User's Wallet Transactions
      try {
        const txSnap = await getDocs(
          query(
            collection(db, 'transactions'),
            where('userId', '==', currentUser.uid)
          )
        );
        const loadedTx: WalletAuditRecord[] = txSnap.docs.map((d) => {
          const data = d.data();
          return {
            id: data.id,
            userId: data.userId,
            userName: data.userName || currentUser.fullName,
            type: data.type || 'reward',
            amountBdt: Number(data.amountBdt) || 0,
            pointsDelta: Number(data.pointsDelta) || 0,
            reason: data.reason || '',
            adminId: data.adminId,
            createdAt: 'Firestore সংরক্ষিত',
          };
        });
        setAuditLogs(loadedTx);
      } catch {}

      // Published Notices
      try {
        const nSnap = await getDocs(
          query(collection(db, 'notices'), where('published', '==', true))
        );
        if (!nSnap.empty) {
          const loadedN: NoticeRecord[] = nSnap.docs.map((d) => {
            const data = d.data();
            return {
              id: data.id,
              title: data.title,
              message: data.message,
              targetAudience: data.targetAudience || 'all',
              published: Boolean(data.published),
              createdAt: 'অফিসিয়াল নোটিশ',
            };
          });
          setNotices(loadedN);
        }
      } catch {}
    };

    loadFirestoreData();
  }, [currentUser]);

  const handleAuthenticated = (user: AuthSessionUser) => {
    setCurrentUser(user);
    setActiveScreen('home');
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('alpo_admin_session_active');
    } catch {}
    await logoutFirebase();
    setCurrentUser(null);
    setAuthStep('login');
    setActiveScreen('home');
  };

  const handleToggleFavorite = async (ideaId: string) => {
    const updatedFavs = favorites.includes(ideaId)
      ? favorites.filter((id) => id !== ideaId)
      : [...favorites, ideaId];
    setFavorites(updatedFavs);

    if (currentUser) {
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          favorites: updatedFavs,
          updatedAt: serverTimestamp(),
        });
      } catch {}
    }
  };

  const handleToggleTask = async (taskId: string) => {
    const updated = completedTasks.includes(taskId)
      ? completedTasks.filter((id) => id !== taskId)
      : [...completedTasks, taskId];
    setCompletedTasks(updated);

    if (currentUser) {
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          checklistProgress: JSON.stringify(updated),
          updatedAt: serverTimestamp(),
        });
      } catch {}
    }
  };

  if (authInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#042F24] via-[#064E3B] to-[#022C22] text-white flex flex-col items-center justify-center p-6">
        <BrandLogo size="lg" />
        <h2 className="text-xl font-bold mt-4">অল্প পুঁজির ব্যবসা</h2>
        <div className="flex items-center gap-2 text-xs text-[#FDE68A] mt-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Firebase সেশন যাচাই করা হচ্ছে...</span>
        </div>
      </div>
    );
  }

  // Unauthenticated User App Login/Register (strictly appTarget="user" — no Admin Login exposed)
  if (!currentUser) {
    return (
      <AuthViews
        authStep={authStep === 'admin_login' ? 'login' : authStep}
        onChangeStep={setAuthStep}
        onAuthenticated={handleAuthenticated}
        appTarget="user"
      />
    );
  }

  const featuredIdeas = ideas.filter((i) => i.isFeatured);
  const lowInvestmentIdeas = ideas.filter((i) => i.minInvestmentBdt <= 15000);
  const favoriteIdeaItems = ideas.filter((i) => favorites.includes(i.id));

  return (
    <div className="min-h-screen bg-[#F4F7F5] text-slate-900 flex flex-col">
      {/* Top App Bar — Pure User App Header (No Admin Panel exposed to normal users) */}
      <header className="sticky top-0 z-30 bg-gradient-to-r from-[#042F24] via-[#064E3B] to-[#047857] text-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div
            onClick={() => setActiveScreen('home')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <BrandLogo size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight leading-none">
                  অল্প পুঁজির ব্যবসা
                </h1>
                {currentUser.membershipTier === 'premium' && (
                  <span className="px-2 py-0.5 rounded-full bg-[#D4AF37] text-slate-950 text-[10px] font-extrabold flex items-center gap-0.5">
                    <Crown className="w-2.5 h-2.5" /> PRO
                  </span>
                )}
              </div>
              <p className="text-[11px] text-emerald-100/85 mt-0.5">
                স্বাগতম, {currentUser.fullName.split(' ')[0]}! • ছোট পুঁজি • বড়
                সম্ভাবনা
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Wallet & Points Pill -> Navigates to Wallet Screen */}
            <button
              onClick={() => setActiveScreen('wallet')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/25 hover:bg-black/35 border border-[#D4AF37]/40 text-xs font-bold cursor-pointer"
            >
              <span className="text-[#FDE68A] tabular-nums">
                ৳{currentUser.walletBalance}
              </span>
              <span className="text-white/40">|</span>
              <span className="text-emerald-200 tabular-nums">
                {currentUser.points} Pts
              </span>
            </button>

            {/* Notifications Bell -> Navigates to dedicated Notifications Screen */}
            <button
              onClick={() => setActiveScreen('notifications')}
              className="relative w-9 h-9 rounded-xl bg-white/12 hover:bg-white/20 flex items-center justify-center border border-white/15 cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-white" />
              {notices.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#FBBF24] absolute top-1.5 right-1.5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pt-4 pb-24">
        {/* HOME SCREEN */}
        {activeScreen === 'home' && (
          <div className="space-y-6">
            {/* Search & Quick Filter Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSelectedCategory('ALL');
                setActiveScreen('ideas');
              }}
              className="relative"
            >
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={homeSearch}
                onChange={(e) => setHomeSearch(e.target.value)}
                placeholder="ব্যবসার আইডিয়া খুঁজুন (যেমন: মসলা, মালাই চা, বুটিক, মাছ চাষ)..."
                className="w-full pl-11 pr-24 py-3.5 rounded-2xl bg-white border border-emerald-900/10 shadow-xs text-xs sm:text-sm focus:border-[#059669] focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3.5 py-2 rounded-xl bg-[#064E3B] text-white text-xs font-bold cursor-pointer"
              >
                খুঁজুন
              </button>
            </form>

            {/* Hero Banner ("অল্প পুঁজিতে বড় সম্ভাবনা") */}
            <div className="relative rounded-[26px] overflow-hidden shadow-xl border border-[#D4AF37]/30 bg-[#042F24]">
              <img
                src={ASSETS.heroBannerImg}
                alt="অল্প পুঁজির ব্যবসা"
                className="w-full h-56 sm:h-64 object-cover opacity-45"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#022C22] via-[#064E3B]/90 to-transparent p-6 flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/25 border border-[#D4AF37]/50 text-[#FDE68A] text-xs font-bold mb-2.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" /> ভেরিফায়েড
                    ক্ষুদ্র ও মাঝারি ব্যবসা গাইড
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight max-w-lg">
                    অল্প পুঁজিতে বড় সম্ভাবনা
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-100/90 mt-1.5 max-w-md leading-relaxed">
                    মাত্র ৳৫,০০০ থেকে ৳৫০,০০০ পুঁজিতে ঘরে বসে, অনলাইনে কিংবা
                    দোকানে শুরু করার মতো পরীক্ষিত ও লাভজনক ব্যবসার পূর্ণাঙ্গ
                    রোডম্যাপ।
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  <button
                    onClick={() => {
                      setSelectedCategory('ALL');
                      setActiveScreen('ideas');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#D97706] text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg flex items-center gap-1.5 hover:brightness-105 cursor-pointer"
                  >
                    <span>ব্যবসার আইডিয়া দেখুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveScreen('ai_consultant')}
                    className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-xs text-white font-bold text-xs sm:text-sm border border-white/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Bot className="w-4 h-4 text-[#FBBF24]" />
                    <span>AI পরামর্শক</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Tools Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900">
                  উদ্যোক্তা স্মার্ট টুলস (Quick Tools)
                </h3>
                <span className="text-xs text-[#059669] font-semibold">
                  ১০০% কার্যকরী টুলস
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {[
                  {
                    id: 'calculators',
                    title: 'লাভ ও পুঁজি ক্যালকুলেটর',
                    sub: '৭টি হিসাব টুল',
                    icon: <Calculator className="w-5 h-5 text-[#064E3B]" />,
                    bg: 'from-emerald-50 to-emerald-100/70 border-emerald-200',
                  },
                  {
                    id: 'checklists',
                    title: 'স্টার্টআপ চেকলিস্ট',
                    sub: 'ধাপে ধাপে প্রস্তুতি',
                    icon: <ClipboardCheck className="w-5 h-5 text-amber-700" />,
                    bg: 'from-amber-50 to-amber-100/70 border-amber-200',
                  },
                  {
                    id: 'ai_consultant',
                    title: 'AI কনসালট্যান্ট',
                    sub: 'তাৎক্ষণিক পরামর্শ',
                    icon: <Bot className="w-5 h-5 text-[#064E3B]" />,
                    bg: 'from-emerald-50 to-teal-100/70 border-teal-200',
                  },
                  {
                    id: 'advice',
                    title: 'পরামর্শ হাব',
                    sub: 'বিক্রি ও মার্কেটিং',
                    icon: <BookOpen className="w-5 h-5 text-emerald-800" />,
                    bg: 'from-slate-50 to-emerald-50 border-slate-200',
                  },
                  {
                    id: 'marketplace',
                    title: 'মার্কেটপ্লেস',
                    sub: 'পাইকারি ও কিট',
                    icon: <Store className="w-5 h-5 text-amber-800" />,
                    bg: 'from-amber-50/70 to-orange-50 border-amber-200',
                  },
                  {
                    id: 'stories',
                    title: 'সফলতার গল্প',
                    sub: 'ও রিসোর্স লিংক',
                    icon: <Award className="w-5 h-5 text-[#064E3B]" />,
                    bg: 'from-emerald-50 to-amber-50/60 border-emerald-200',
                  },
                ].map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveScreen(tool.id as UserActiveScreen)}
                    className={`p-3.5 rounded-2xl bg-gradient-to-br ${tool.bg} border shadow-2xs hover:shadow-md transition flex flex-col items-center text-center cursor-pointer`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white shadow-2xs flex items-center justify-center mb-2">
                      {tool.icon}
                    </div>
                    <span className="text-xs font-bold text-slate-900 line-clamp-1">
                      {tool.title}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                      {tool.sub}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3 Investment Business Categories Section */}
            <div className="bg-gradient-to-br from-[#022C22] via-[#064E3B] to-[#042F24] rounded-3xl p-5 border border-[#D4AF37]/40 shadow-xl text-white">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#D4AF37] text-slate-950 text-[11px] font-extrabold">
                    <Sparkles className="w-3.5 h-3.5" /> ইনভেস্টমেন্ট করে ব্যবসা (৩টি ভেরিফায়েড ক্যাটাগরি)
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white mt-1.5">
                    সরাসরি প্রজেক্টে ইনভেস্ট করুন ও মাসিক মুনাফা পান
                  </h3>
                  <p className="text-xs text-emerald-100/85 mt-0.5">
                    মুদারাবা হালাল প্রফিট শেয়ারিং, অ্যাগ্রো খামার এবং ই-কমার্স রিসেলার খাতে নিরাপদে বিনিয়োগ করুন
                  </p>
                </div>
                <button
                  onClick={() => setActiveScreen('categories')}
                  className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-[#FDE68A] text-xs font-bold border border-white/20 cursor-pointer"
                >
                  সব ইনভেস্টমেন্ট খাত →
                </button>
              </div>

              {investSuccessMsg && (
                <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-300/40 text-emerald-100 text-xs font-semibold flex items-center justify-between">
                  <span>✅ {investSuccessMsg}</span>
                  <button
                    onClick={() => setInvestSuccessMsg(null)}
                    className="text-xs underline ml-2 cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {categories
                  .filter((c) => c.enabled && c.group === 'investment')
                  .map((invCat) => {
                    const catProject = ideas.find(
                      (i) => i.category === invCat.nameBn
                    );
                    return (
                      <div
                        key={invCat.id}
                        className="bg-white/10 hover:bg-white/15 backdrop-blur-xs rounded-2xl overflow-hidden border border-[#D4AF37]/40 transition flex flex-col justify-between group"
                      >
                        <div
                          onClick={() => {
                            setSelectedCategory(invCat.nameBn);
                            setActiveScreen('ideas');
                          }}
                          className="relative h-36 w-full overflow-hidden bg-emerald-950 cursor-pointer"
                        >
                          <img
                            src={invCat.imageUrl}
                            alt={invCat.nameBn}
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (
                                invCat.fallbackImageUrl &&
                                target.src !== invCat.fallbackImageUrl
                              ) {
                                target.src = invCat.fallbackImageUrl;
                              }
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-[#D4AF37] text-slate-950 text-[10px] font-extrabold shadow">
                            {invCat.expectedRoi || 'মাসিক ১২%–২০% মুনাফা'}
                          </span>
                          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                            <span className="text-xs font-extrabold text-[#FDE68A]">
                              সর্বনিম্ন: ৳{(invCat.minInvestBdt || 3000).toLocaleString('bn-BD')}
                            </span>
                            <span className="text-[10px] font-bold bg-emerald-600/90 px-2 py-0.5 rounded-md">
                              {invCat.ideaCount}টি প্রজেক্ট
                            </span>
                          </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h4
                              onClick={() => {
                                setSelectedCategory(invCat.nameBn);
                                setActiveScreen('ideas');
                              }}
                              className="text-sm font-extrabold text-white hover:text-[#FDE68A] cursor-pointer"
                            >
                              {invCat.nameBn}
                            </h4>
                            <p className="text-[11px] text-emerald-100/80 mt-1 line-clamp-2 leading-relaxed">
                              {invCat.shortDesc || invCat.nameEn}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-white/10">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCategory(invCat.nameBn);
                                setActiveScreen('ideas');
                              }}
                              className="py-2 px-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold transition cursor-pointer"
                            >
                              প্রজেক্ট দেখুন
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (catProject) {
                                  setInvestModalIdea(catProject);
                                  setInvestAmount(catProject.minInvestmentBdt || 5000);
                                } else {
                                  setSelectedCategory(invCat.nameBn);
                                  setActiveScreen('ideas');
                                }
                              }}
                              className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 text-[11px] font-extrabold shadow hover:brightness-105 transition cursor-pointer"
                            >
                              💰 ইনভেস্ট করুন
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* User Active/Pending Investment Portfolio Summary */}
              {userInvestments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/15">
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-xs font-extrabold text-[#FDE68A]">
                      📊 আমার ইনভেস্টমেন্ট পোর্টফোলিও ({userInvestments.length}টি বিনিয়োগ)
                    </h4>
                    <span className="text-[11px] text-emerald-200">
                      মোট বিনিয়োগ: ৳
                      {userInvestments
                        .reduce((acc, i) => acc + i.amountBdt, 0)
                        .toLocaleString('bn-BD')}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {userInvestments.slice(0, 4).map((inv) => (
                      <div
                        key={inv.id}
                        className="p-3 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-white truncate">
                            {inv.projectTitle}
                          </div>
                          <div className="text-[11px] text-emerald-200/85">
                            বিনিয়োগ: ৳{inv.amountBdt.toLocaleString('bn-BD')} • সম্ভাব্য লাভ: ৳
                            {inv.expectedMonthlyProfitBdt.toLocaleString('bn-BD')}/মাস
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setSelectedReceiptInv(inv)}
                            className="px-2 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-[#FDE68A] text-[10px] font-bold cursor-pointer"
                          >
                            📄 রিসিট
                          </button>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold shrink-0 ${
                              inv.status === 'active'
                                ? 'bg-emerald-400 text-slate-950'
                                : inv.status === 'completed'
                                ? 'bg-[#D4AF37] text-slate-950'
                                : inv.status === 'rejected'
                                ? 'bg-rose-500 text-white'
                                : 'bg-amber-300 text-slate-950'
                            }`}
                          >
                            {inv.status === 'active'
                              ? 'সক্রিয় (Active)'
                              : inv.status === 'completed'
                              ? 'মুনাফা পরিশোধিত'
                              : inv.status === 'rejected'
                              ? 'বাতিল'
                              : 'যাচাই চলছে'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 🛒 Buy & Auto-Sell Profit Packages Section (পণ্য ও ইউনিট কিনে নিশ্চিত লাভ) */}
            <div className="bg-white rounded-3xl p-5 border-2 border-[#059669]/30 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-extrabold">
                    🛒 নতুন ফিচার • পণ্য/ইউনিট কিনুন ও নিশ্চিত মুনাফা নিন
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                    পাইকারি পণ্য ও খামার ইউনিট কিনে অটো-রিসেল লাভ
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    টাকা দিয়ে পণ্য বা খামার ইউনিট কিনুন—অ্যাপের মাধ্যমে অটো-সেল হয়ে নির্দিষ্ট দিন পর আসল + মুনাফা সরাসরি ওয়ালেটে জমা হবে!
                  </p>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-[#064E3B] text-xs font-extrabold border border-emerald-200">
                  ১০০% হালাল ট্রেডিং মডেল
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {buyPackages.map((pkg) => {
                  const totalReturn = pkg.unitPriceBdt + pkg.userProfitBdt;
                  return (
                    <div
                      key={pkg.id}
                      className="rounded-2xl overflow-hidden border border-emerald-900/15 bg-gradient-to-b from-white to-emerald-50/30 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
                    >
                      <div>
                        <div className="relative h-36 w-full bg-emerald-950 overflow-hidden">
                          <img
                            src={pkg.imageUrl}
                            alt={pkg.title}
                            onError={(e) => {
                              const t = e.currentTarget;
                              if (
                                pkg.fallbackImageUrl &&
                                t.src !== pkg.fallbackImageUrl
                              ) {
                                t.src = pkg.fallbackImageUrl;
                              }
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg bg-[#D4AF37] text-slate-950 text-[10px] font-extrabold shadow">
                            {pkg.modelBadge}
                          </span>
                          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-emerald-700/95 text-white text-[10px] font-bold">
                            মেয়াদ: {pkg.durationLabel}
                          </span>
                          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white">
                            <span className="text-xs font-extrabold text-[#FDE68A]">
                              ইউনিট মূল্য: ৳{pkg.unitPriceBdt.toLocaleString('bn-BD')}
                            </span>
                            <span className="text-[10px] font-extrabold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md">
                              লাভ: +৳{pkg.userProfitBdt.toLocaleString('bn-BD')} ({pkg.userProfitPercent}%)
                            </span>
                          </div>
                        </div>

                        <div className="p-3.5">
                          <h4 className="text-sm font-extrabold text-slate-900 line-clamp-1">
                            {pkg.title}
                          </h4>
                          <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                            {pkg.shortDesc}
                          </p>

                          <div className="grid grid-cols-3 gap-1.5 mt-3 p-2.5 rounded-xl bg-white border border-emerald-200/80 text-center">
                            <div>
                              <span className="text-[9px] text-slate-500 block">ক্রয়মূল্য</span>
                              <span className="text-xs font-extrabold text-slate-900">
                                ৳{pkg.unitPriceBdt.toLocaleString('bn-BD')}
                              </span>
                            </div>
                            <div className="border-x border-slate-100">
                              <span className="text-[9px] text-slate-500 block">আপনার লাভ</span>
                              <span className="text-xs font-extrabold text-[#059669]">
                                +৳{pkg.userProfitBdt.toLocaleString('bn-BD')}
                              </span>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-500 block">মোট পাবেন</span>
                              <span className="text-xs font-extrabold text-amber-700">
                                ৳{totalReturn.toLocaleString('bn-BD')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="px-3.5 pb-3.5 space-y-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBuyPkg(pkg);
                            setBuyQty(1);
                            setBuyFulfillmentMode('auto_resell');
                          }}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#064E3B] to-[#059669] text-white text-xs font-extrabold shadow hover:brightness-105 transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>🛒 কিনুন ও লাভ করুন (+৳{pkg.userProfitBdt.toLocaleString('bn-BD')})</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            try {
                              const shareText = `${pkg.title} — পাইকারি মূল্য: ৳${pkg.unitPriceBdt} | অর্ডার করতে যোগাযোগ করুন (রিসেলার কোড: ${currentUser.referralCode})`;
                              navigator.clipboard.writeText(shareText);
                              setResellCopiedId(pkg.id);
                              setTimeout(() => setResellCopiedId(null), 2000);
                            } catch {}
                          }}
                          className="w-full py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold transition cursor-pointer"
                        >
                          {resellCopiedId === pkg.id
                            ? '✓ রিসেলার পোস্ট কপি হয়েছে (কমিশন +৳১৫০)'
                            : '📢 বিনা পুঁজিতে রিসেল পোস্ট কপি করুন (+৳১৫০ কমিশন)'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Daily Check-In Bonus & Helpline Bar */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <span className="font-bold text-[#064E3B]">
                    🎁 ডেইলি উদ্যোক্তা চেক-ইন বোনাস:
                  </span>
                  <span className="text-slate-500">
                    প্রতিদিন অ্যাপে চেক-ইন করে +১০ রিওয়ার্ড পয়েন্ট সংগ্রহ করুন
                  </span>
                </div>
                <button
                  type="button"
                  disabled={dailyCheckedIn}
                  onClick={handleDailyCheckIn}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition ${
                    dailyCheckedIn
                      ? 'bg-emerald-100 text-emerald-800 cursor-default'
                      : 'bg-[#D4AF37] text-slate-950 shadow hover:brightness-105'
                  }`}
                >
                  {dailyCheckedIn
                    ? '✓ আজকের +১০ পয়েন্ট নেওয়া হয়েছে'
                    : '🎁 আজকের +১০ পয়েন্ট নিন'}
                </button>
              </div>
            </div>

            {/* Business Categories Section with Category Photos */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    ব্যবসার ক্যাটাগরিসমূহ (ছবিসহ)
                  </h3>
                  <p className="text-xs text-slate-500">
                    {categories.filter((c) => c.enabled).length}টি লাভজনক খাত থেকে আপনার পছন্দের ক্যাটাগরি বেছে নিন
                  </p>
                </div>
                <button
                  onClick={() => setActiveScreen('categories')}
                  className="text-xs font-bold text-[#059669] hover:underline cursor-pointer"
                >
                  সব দেখুন ({categories.filter((c) => c.enabled).length}) →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {categories
                  .filter((c) => c.enabled)
                  .slice(0, 12)
                  .map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.nameBn);
                        setActiveScreen('ideas');
                      }}
                      className="bg-white rounded-2xl overflow-hidden border border-emerald-900/10 shadow-2xs hover:shadow-md hover:border-[#059669] transition flex flex-col text-left cursor-pointer group"
                    >
                      <div className="relative h-24 w-full bg-emerald-950 overflow-hidden">
                        <img
                          src={cat.imageUrl}
                          alt={cat.nameBn}
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (
                              cat.fallbackImageUrl &&
                              target.src !== cat.fallbackImageUrl
                            ) {
                              target.src = cat.fallbackImageUrl;
                            }
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                        <div className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-white/95 text-[#064E3B] flex items-center justify-center shadow">
                          <CategoryIcon
                            name={cat.iconName}
                            className="w-3.5 h-3.5"
                          />
                        </div>
                        <span className="absolute bottom-1.5 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/55 text-[#FDE68A]">
                          {cat.ideaCount}টি আইডিয়া
                        </span>
                      </div>
                      <div className="p-2.5">
                        <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-[#064E3B]">
                          {cat.nameBn}
                        </h4>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {cat.shortDesc || cat.nameEn}
                        </span>
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Featured Business Ideas Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    নির্বাচিত ও জনপ্রিয় ব্যবসার আইডিয়া
                  </h3>
                  <p className="text-xs text-slate-500">
                    কম ঝুঁকিতে দ্রুত শুরু করার মতো পরীক্ষিত বিজনেস মডেল
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setActiveScreen('ideas');
                  }}
                  className="text-xs font-bold text-[#059669] hover:underline cursor-pointer"
                >
                  সব আইডিয়া →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featuredIdeas.map((idea) => {
                  const isFav = favorites.includes(idea.id);
                  return (
                    <div
                      key={idea.id}
                      className="bg-white rounded-[22px] overflow-hidden border border-emerald-900/10 shadow-xs hover:shadow-lg transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-40">
                          <img
                            src={idea.imageUrl}
                            alt={idea.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#064E3B]/90 text-white text-[10px] font-bold">
                            {idea.category}
                          </span>
                          <button
                            onClick={() => handleToggleFavorite(idea.id)}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow cursor-pointer"
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                isFav
                                  ? 'fill-rose-500 text-rose-500'
                                  : 'text-slate-600'
                              }`}
                            />
                          </button>
                          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                            <span className="font-bold bg-black/40 px-2 py-0.5 rounded-md">
                              স্তর: {idea.difficulty}
                            </span>
                            <span className="font-bold flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{' '}
                              {idea.rating}
                            </span>
                          </div>
                        </div>

                        <div className="p-4">
                          <h4 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">
                            {idea.title}
                          </h4>
                          <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                            {idea.shortDescription}
                          </p>
                          <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-900/10">
                            <div>
                              <span className="text-[10px] text-slate-500 block">
                                পুঁজি
                              </span>
                              <span className="font-bold text-[#064E3B]">
                                {idea.requiredInvestment}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-500 block">
                                মাসিক লাভ
                              </span>
                              <span className="font-bold text-amber-700">
                                {idea.estimatedProfit}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 pb-4">
                        <button
                          onClick={() => {
                            setSelectedIdea(idea);
                            setActiveScreen('idea_detail');
                          }}
                          className="w-full py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold transition cursor-pointer"
                        >
                          বিস্তারিত গাইড দেখুন
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Low-Investment Ideas Banner & List */}
            <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      মাত্র ৳৫,০০০ – ৳১৫,০০০ পুঁজির ব্যবসা
                    </h3>
                    <p className="text-xs text-slate-500">
                      শিক্ষার্থী, গৃহিণী ও নতুন উদ্যোক্তাদের জন্য সেরা সূচনা
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setActiveScreen('ideas');
                  }}
                  className="text-xs font-bold text-[#059669] hover:underline cursor-pointer"
                >
                  সব দেখুন →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lowInvestmentIdeas.slice(0, 4).map((idea) => (
                  <div
                    key={idea.id}
                    onClick={() => {
                      setSelectedIdea(idea);
                      setActiveScreen('idea_detail');
                    }}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-[#059669] transition flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={idea.imageUrl}
                        alt={idea.title}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-[#059669]">
                          {idea.category}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {idea.title}
                        </h4>
                        <p className="text-[11px] text-slate-600">
                          পুঁজি: <strong>{idea.requiredInvestment}</strong> •
                          লাভ: <strong>{idea.estimatedProfit}</strong>
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Membership Promo Card */}
            {currentUser.membershipTier !== 'premium' && (
              <div className="bg-gradient-to-r from-[#042F24] via-[#064E3B] to-[#047857] rounded-3xl p-5 text-white border border-[#D4AF37]/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-slate-950 text-[10px] font-extrabold">
                    <Crown className="w-3 h-3" /> প্রিমিয়াম মেম্বারশিপ — মাত্র
                    ৳২৯৯
                  </span>
                  <h3 className="text-base sm:text-lg font-bold">
                    সকল ভিআইপি বিজনেস গাইড, পাইকারি সাপ্লায়ার ও রেফারেল বোনাস
                    আনলক করুন!
                  </h3>
                  <p className="text-xs text-emerald-100/85">
                    সক্রিয় করলেই পাচ্ছেন +৫০ পয়েন্ট এবং প্রতি প্রিমিয়াম রেফারেলে
                    নগদ +৳৫০ ওয়ালেট বোনাস।
                  </p>
                </div>
                <button
                  onClick={() => setActiveScreen('membership')}
                  className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:brightness-105 text-slate-950 font-extrabold text-xs shrink-0 cursor-pointer"
                >
                  ৳২৯৯ মেম্বারশিপ নিন
                </button>
              </div>
            )}
          </div>
        )}

        {/* 2. CATEGORIES SCREEN */}
        {activeScreen === 'categories' && (
          <CategoriesScreen
            categories={categories}
            ideas={ideas}
            onSelectCategory={(categoryNameBn) => {
              setSelectedCategory(categoryNameBn);
              setActiveScreen('ideas');
            }}
            onSelectIdea={(idea) => {
              setSelectedIdea(idea);
              setActiveScreen('idea_detail');
            }}
          />
        )}

        {/* 3. BUSINESS IDEAS LIST SCREEN */}
        {activeScreen === 'ideas' && (
          <BusinessIdeasScreen
            ideas={ideas}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectIdea={(idea) => {
              setSelectedIdea(idea);
              setActiveScreen('idea_detail');
            }}
            onBackToCategories={() => setActiveScreen('categories')}
          />
        )}

        {/* 4. BUSINESS IDEA DETAILS SCREEN */}
        {activeScreen === 'idea_detail' && selectedIdea && (
          <BusinessIdeaDetailScreen
            idea={selectedIdea}
            isFavorite={favorites.includes(selectedIdea.id)}
            onToggleFavorite={handleToggleFavorite}
            isUserPremium={currentUser.membershipTier === 'premium'}
            onUpgradePremium={() => setActiveScreen('membership')}
            onOpenCalculator={() => setActiveScreen('calculators')}
            onOpenChecklist={() => setActiveScreen('checklists')}
            onAskAiAboutIdea={(promptText) => {
              setAiInitialPrompt(promptText);
              setActiveScreen('ai_consultant');
            }}
            onInvestInIdea={(idea) => {
              setInvestModalIdea(idea);
              setInvestAmount(idea.minInvestmentBdt || 5000);
            }}
            onBack={() => setActiveScreen('ideas')}
          />
        )}

        {/* 5. MARKETPLACE SCREEN */}
        {activeScreen === 'marketplace' && (
          <MarketplaceScreen
            products={products}
            currentUser={currentUser}
            ordersCount={orders.length}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              setActiveScreen('product_detail');
            }}
            onSelectBuyPackage={(pkg) => {
              setSelectedBuyPkg(pkg);
              setBuyQty(1);
              setBuyFulfillmentMode('auto_resell');
            }}
            onSelectSeller={(sellerId, sellerName, sellerPhone, location) => {
              setSelectedSeller({
                sellerId,
                sellerName,
                sellerPhone,
                location,
              });
              setActiveScreen('seller_profile');
            }}
            onOpenMyOrders={() => setActiveScreen('my_orders')}
            onAddSellerProduct={async (newProd) => {
              const prodId = 'prod_' + Date.now();
              const item: MarketplaceProductItem = {
                ...newProd,
                id: prodId,
                sellerId: currentUser.uid,
                sellerName: currentUser.fullName,
                sellerPhone:
                  newProd.sellerPhone || currentUser.phone || '01700000000',
                imageUrl: newProd.imageUrl || ASSETS.packagingKitImg,
                status: 'approved',
                rating: 4.8,
              };
              setProducts((prev) => [item, ...prev]);
              try {
                await setDoc(doc(db, 'products', prodId), {
                  ...item,
                  createdAt: serverTimestamp(),
                });
              } catch {}
            }}
          />
        )}

        {/* 6. PRODUCT DETAIL SCREEN */}
        {activeScreen === 'product_detail' && selectedProduct && (
          <ProductDetailScreen
            product={selectedProduct}
            currentUser={currentUser}
            onPlaceOrder={async (orderPayload) => {
              const orderId = 'ord_' + Date.now();
              const newOrder: BuyerOrderRecord = {
                id: orderId,
                productId: orderPayload.productId,
                productTitle: orderPayload.productTitle,
                buyerId: currentUser.uid,
                buyerName: currentUser.fullName,
                buyerPhone: orderPayload.buyerPhone,
                deliveryAddress: orderPayload.deliveryAddress,
                quantity: orderPayload.quantity,
                totalPriceBdt: orderPayload.totalPriceBdt,
                status: 'placed',
                createdAt: 'এইমাত্র',
              };
              setOrders((prev) => [newOrder, ...prev]);
              try {
                await setDoc(doc(db, 'orders', orderId), {
                  id: orderId,
                  productId: orderPayload.productId,
                  productTitle: orderPayload.productTitle,
                  buyerId: currentUser.uid,
                  buyerName: currentUser.fullName,
                  buyerPhone: orderPayload.buyerPhone,
                  deliveryAddress: orderPayload.deliveryAddress,
                  quantity: orderPayload.quantity,
                  totalPriceBdt: orderPayload.totalPriceBdt,
                  status: 'placed',
                  createdAt: serverTimestamp(),
                });
              } catch {}
            }}
            onOpenSellerProfile={(
              sellerId,
              sellerName,
              sellerPhone,
              location
            ) => {
              setSelectedSeller({
                sellerId,
                sellerName,
                sellerPhone,
                location,
              });
              setActiveScreen('seller_profile');
            }}
            onBack={() => setActiveScreen('marketplace')}
          />
        )}

        {/* 6B. SELLER PROFILE SCREEN */}
        {activeScreen === 'seller_profile' && selectedSeller && (
          <SellerProfileScreen
            seller={selectedSeller}
            products={products}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              setActiveScreen('product_detail');
            }}
            onBack={() => setActiveScreen('marketplace')}
          />
        )}

        {/* 7. MY ORDERS SCREEN */}
        {activeScreen === 'my_orders' && (
          <MyOrdersScreen
            orders={orders}
            onCancelOrder={async (orderId) => {
              setOrders((prev) =>
                prev.map((o) =>
                  o.id === orderId ? { ...o, status: 'cancelled' } : o
                )
              );
              try {
                await updateDoc(doc(db, 'orders', orderId), {
                  status: 'cancelled',
                });
              } catch {}
            }}
            onBrowseMarketplace={() => setActiveScreen('marketplace')}
            onBack={() => setActiveScreen('marketplace')}
          />
        )}

        {/* 8. FAVORITES SCREEN */}
        {activeScreen === 'favorites' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-[#042F24] via-[#064E3B] to-[#047857] rounded-3xl p-5 text-white shadow-lg">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-400 fill-rose-400" /> আমার
                পছন্দের ব্যবসার তালিকা ({favoriteIdeaItems.length})
              </h2>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                আপনার সংরক্ষিত ব্যবসায়িক আইডিয়াগুলো যেকোনো সময় তুলনা ও পর্যালোচনা
                করুন
              </p>
            </div>

            {favoriteIdeaItems.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
                <p className="text-base font-bold text-slate-800">
                  আপনার ফেভারিট তালিকায় এখনো কোনো আইডিয়া নেই
                </p>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  যেকোনো ব্যবসার কার্ডে হার্ট (♥) আইকনে ট্যাপ করে সেভ করে রাখুন।
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setActiveScreen('ideas');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#064E3B] text-white text-xs font-bold cursor-pointer"
                >
                  ব্যবসার আইডিয়া দেখুন
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoriteIdeaItems.map((idea) => (
                  <div
                    key={idea.id}
                    className="bg-white rounded-3xl p-4 border border-emerald-900/10 shadow-xs flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={idea.imageUrl}
                        alt={idea.title}
                        className="w-16 h-16 rounded-2xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-[#059669]">
                          {idea.category}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 truncate">
                          {idea.title}
                        </h3>
                        <p className="text-xs text-slate-600">
                          পুঁজি: <strong>{idea.requiredInvestment}</strong>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setSelectedIdea(idea);
                          setActiveScreen('idea_detail');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-[#064E3B] text-white text-xs font-bold cursor-pointer"
                      >
                        বিস্তারিত
                      </button>
                      <button
                        onClick={() => handleToggleFavorite(idea.id)}
                        className="p-2 rounded-xl bg-rose-50 text-rose-600 cursor-pointer"
                      >
                        <Heart className="w-4 h-4 fill-rose-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 9. MEMBERSHIP SCREEN (৳299) */}
        {activeScreen === 'membership' && (
          <MembershipScreen
            user={currentUser}
            requests={membershipRequests}
            onSubmitMembership={async (method, trxId) => {
              const reqId = 'mem_' + Date.now();
              const newReq: MembershipRequestRecord = {
                id: reqId,
                userId: currentUser.uid,
                userName: currentUser.fullName,
                amountBdt: 299,
                paymentMethod: method,
                transactionReference: trxId,
                status: 'pending',
                createdAt: 'এইমাত্র',
              };
              setMembershipRequests((prev) => [newReq, ...prev]);
              try {
                await setDoc(doc(db, 'memberships', reqId), {
                  id: reqId,
                  userId: currentUser.uid,
                  userName: currentUser.fullName,
                  amountBdt: 299,
                  paymentMethod: method,
                  transactionReference: trxId,
                  status: 'pending',
                  createdAt: serverTimestamp(),
                  updatedAt: serverTimestamp(),
                });
              } catch {}
            }}
            onBack={() => setActiveScreen('profile')}
          />
        )}

        {/* 10. REFERRAL SCREEN */}
        {activeScreen === 'referral' && (
          <ReferralScreen
            user={currentUser}
            onBack={() => setActiveScreen('profile')}
          />
        )}

        {/* 11. WALLET SCREEN */}
        {activeScreen === 'wallet' && (
          <WalletScreen
            user={currentUser}
            transactions={auditLogs.filter((t) => t.userId === currentUser.uid)}
            onOpenWithdrawal={() => setActiveScreen('withdrawal')}
            onOpenReferral={() => setActiveScreen('referral')}
            onOpenMembership={() => setActiveScreen('membership')}
            onBack={() => setActiveScreen('profile')}
          />
        )}

        {/* 12. WITHDRAWAL SCREEN */}
        {activeScreen === 'withdrawal' && (
          <WithdrawalScreen
            user={currentUser}
            withdrawals={withdrawals}
            onRequestWithdrawal={async (amountBdt, method, accountNumber) => {
              const wId = 'w_' + Date.now();
              const newW: WithdrawalRecord = {
                id: wId,
                userId: currentUser.uid,
                userName: currentUser.fullName,
                amountBdt,
                method,
                accountNumber,
                status: 'pending',
                createdAt: 'এইমাত্র',
              };
              setWithdrawals((prev) => [newW, ...prev]);
              try {
                await setDoc(doc(db, 'withdrawals', wId), {
                  id: wId,
                  userId: currentUser.uid,
                  userName: currentUser.fullName,
                  amountBdt,
                  method,
                  accountNumber,
                  status: 'pending',
                  createdAt: serverTimestamp(),
                  updatedAt: serverTimestamp(),
                });
              } catch {}
            }}
            onCancelWithdrawal={async (withdrawalId) => {
              setWithdrawals((prev) =>
                prev.map((w) =>
                  w.id === withdrawalId ? { ...w, status: 'cancelled' } : w
                )
              );
              try {
                await updateDoc(doc(db, 'withdrawals', withdrawalId), {
                  status: 'cancelled',
                  updatedAt: serverTimestamp(),
                });
              } catch {}
            }}
            onBack={() => setActiveScreen('wallet')}
          />
        )}

        {/* 13. NOTIFICATIONS SCREEN */}
        {activeScreen === 'notifications' && (
          <NotificationsScreen
            notices={notices}
            onBack={() => setActiveScreen('home')}
          />
        )}

        {/* 14. PROFILE SCREEN */}
        {activeScreen === 'profile' && (
          <ProfileScreen
            user={currentUser}
            ordersCount={orders.length}
            favoritesCount={favorites.length}
            onNavigate={(screen) => {
              if (screen === 'admin') {
                if (onOpenSeparateAdminApp) onOpenSeparateAdminApp();
                return;
              }
              setActiveScreen(screen);
            }}
            onLogout={handleLogout}
          />
        )}

        {/* 15. SETTINGS SCREEN */}
        {activeScreen === 'settings' && (
          <SettingsScreen
            user={currentUser}
            onUpdateProfile={async (fullName, phone) => {
              await updateDoc(doc(db, 'users', currentUser.uid), {
                fullName,
                phone,
                updatedAt: serverTimestamp(),
              });
              setCurrentUser((prev) =>
                prev ? { ...prev, fullName, phone } : null
              );
            }}
            onSendPasswordReset={async () => {
              await resetPassword(currentUser.email);
            }}
            onLogout={handleLogout}
            onBack={() => setActiveScreen('profile')}
          />
        )}

        {/* QUICK TOOLS SCREENS */}
        {activeScreen === 'calculators' && (
          <CalculatorsView onBack={() => setActiveScreen('home')} />
        )}

        {activeScreen === 'checklists' && (
          <ChecklistsScreen
            checklists={INITIAL_CHECKLISTS}
            completedTaskIds={completedTasks}
            onToggleTask={handleToggleTask}
            onResetTasks={() => setCompletedTasks([])}
            onBack={() => setActiveScreen('home')}
          />
        )}

        {activeScreen === 'advice' && (
          <AdviceHubScreen
            articles={INITIAL_ADVICE_ARTICLES}
            onBack={() => setActiveScreen('home')}
          />
        )}

        {activeScreen === 'ai_consultant' && (
          <AiConsultantScreen
            initialPrompt={aiInitialPrompt}
            onBack={() => setActiveScreen('home')}
          />
        )}

        {activeScreen === 'stories' && (
          <SuccessAndResourcesScreen
            stories={INITIAL_SUCCESS_STORIES}
            resources={INITIAL_RESOURCES}
            onBack={() => setActiveScreen('home')}
          />
        )}
      </main>

      {/* Interactive Investment Application Modal */}
      {investModalIdea && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-emerald-900/10 my-auto">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/25 text-amber-900 text-[10px] font-extrabold">
                  💰 ভেরিফায়েড প্রফিট-শেয়ারিং ইনভেস্টমেন্ট
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                  {investModalIdea.title}
                </h3>
                <p className="text-xs text-[#059669] font-semibold">
                  ক্যাটাগরি: {investModalIdea.category}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInvestModalIdea(null)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200 mb-4 grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-[10px] text-slate-500 block">বিনিয়োগের পরিমাণ</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#064E3B]">
                  ৳{investAmount.toLocaleString('bn-BD')}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">সম্ভাব্য মাসিক লাভ</span>
                <span className="text-xs sm:text-sm font-extrabold text-amber-700">
                  ৳{Math.round(investAmount * 0.16).toLocaleString('bn-BD')}/মাস
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">মেয়াদে মোট মুনাফা</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#059669]">
                  ৳{Math.round(investAmount * 0.16 * investDuration).toLocaleString('bn-BD')}
                </span>
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (investAmount < 500) return;
                const trxToUse =
                  investPaymentMethod === 'Wallet'
                    ? 'WALLET-' + Date.now()
                    : investTrxId.trim() || 'TRX-' + Date.now();
                setInvestSubmitting(true);
                const invId = 'inv_' + Date.now();
                const expectedMonthly = Math.round(investAmount * 0.16);
                const newRecord = {
                  id: invId,
                  userId: currentUser.uid,
                  userName: currentUser.fullName,
                  userPhone: currentUser.phone || '01700000000',
                  projectId: investModalIdea.id,
                  projectTitle: investModalIdea.title,
                  categoryName: investModalIdea.category,
                  amountBdt: Number(investAmount),
                  expectedMonthlyProfitBdt: expectedMonthly,
                  profitSharePercent: '১৬% / মাস (হালাল মুদারাবা)',
                  durationMonths: Number(investDuration),
                  paymentMethod: investPaymentMethod,
                  transactionId: trxToUse,
                  status: 'pending' as const,
                  totalProfitPaidBdt: 0,
                  createdAt: 'এইমাত্র',
                };
                setUserInvestments((prev) => [newRecord, ...prev]);
                try {
                  await setDoc(doc(db, 'investments', invId), {
                    ...newRecord,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                  });
                } catch {}
                setInvestSubmitting(false);
                setInvestModalIdea(null);
                setInvestTrxId('');
                setInvestSuccessMsg(
                  `"${investModalIdea.title}" প্রজেক্টে আপনার ৳${investAmount.toLocaleString('bn-BD')} ইনভেস্টমেন্ট রিকোয়েস্ট সফলভাবে জমা হয়েছে! অ্যাডমিন প্যানেল থেকে ভেরিফাই হলেই মাসিক মুনাফা যুক্ত হবে।`
                );
                setActiveScreen('home');
              }}
              className="space-y-3.5"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ইনভেস্টমেন্ট পরিমাণ নির্বাচন করুন (সর্বনিম্ন ৳১,০০০) *
                </label>
                <input
                  type="number"
                  min={1000}
                  step={500}
                  required
                  value={investAmount}
                  onChange={(e) => setInvestAmount(Math.max(500, Number(e.target.value) || 0))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:border-[#059669] focus:outline-none"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[3000, 5000, 10000, 25000, 50000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setInvestAmount(amt)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                        investAmount === amt
                          ? 'bg-[#064E3B] text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      ৳{amt.toLocaleString('bn-BD')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    চুক্তির মেয়াদ (মাস)
                  </label>
                  <select
                    value={investDuration}
                    onChange={(e) => setInvestDuration(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                  >
                    <option value={3}>৩ মাস</option>
                    <option value={6}>৬ মাস</option>
                    <option value={12}>১২ মাস (১ বছর)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    পেমেন্ট মাধ্যম
                  </label>
                  <select
                    value={investPaymentMethod}
                    onChange={(e) =>
                      setInvestPaymentMethod(
                        e.target.value as 'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Wallet'
                      )
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                  >
                    <option value="bKash">বিকাশ (bKash)</option>
                    <option value="Nagad">নগদ (Nagad)</option>
                    <option value="Rocket">রকেট (Rocket)</option>
                    <option value="Bank">ব্যাংক ট্রান্সফার</option>
                    <option value="Wallet">অ্যাপ ওয়ালেট ব্যালেন্স</option>
                  </select>
                </div>
              </div>

              {investPaymentMethod !== 'Wallet' ? (
                <div className="space-y-3">
                  {/* Payment Destination Box inside Investment Modal */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300 space-y-2">
                    <div className="text-xs font-extrabold text-amber-950">
                      📲 যেখানে টাকা পাঠাবেন (অফিসিয়াল পেমেন্ট নম্বর):
                    </div>
                    <p className="text-[11px] text-amber-900 leading-relaxed">
                      নিচের নম্বরে <strong>৳{investAmount.toLocaleString('bn-BD')} Send Money (সেন্ড মানি)</strong> করে নিচের বক্সে Transaction ID (TrxID) লিখুন:
                    </p>

                    <div className="space-y-1.5">
                      <div className="p-2.5 rounded-xl bg-white border border-pink-200 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-pink-700 block">
                            {paymentAccounts.bkashType}
                          </span>
                          <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                            {paymentAccounts.bkashNumber}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyPayNumber(paymentAccounts.bkashNumber)}
                          className="px-2.5 py-1 rounded-lg bg-pink-50 border border-pink-200 text-pink-700 text-[11px] font-extrabold cursor-pointer"
                        >
                          {copiedPayNum === paymentAccounts.bkashNumber
                            ? 'কপি হয়েছে ✓'
                            : 'নম্বর কপি করুন'}
                        </button>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-amber-200 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-amber-800 block">
                            {paymentAccounts.nagadType}
                          </span>
                          <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                            {paymentAccounts.nagadNumber}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyPayNumber(paymentAccounts.nagadNumber)}
                          className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-extrabold cursor-pointer"
                        >
                          {copiedPayNum === paymentAccounts.nagadNumber
                            ? 'কপি হয়েছে ✓'
                            : 'নম্বর কপি করুন'}
                        </button>
                      </div>

                      {investPaymentMethod === 'Rocket' && (
                        <div className="p-2.5 rounded-xl bg-white border border-purple-200 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-purple-700 block">
                              {paymentAccounts.rocketType}
                            </span>
                            <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                              {paymentAccounts.rocketNumber}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyPayNumber(paymentAccounts.rocketNumber)}
                            className="px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 text-[11px] font-extrabold cursor-pointer"
                          >
                            {copiedPayNum === paymentAccounts.rocketNumber
                              ? 'কপি হয়েছে ✓'
                              : 'নম্বর কপি করুন'}
                          </button>
                        </div>
                      )}

                      {investPaymentMethod === 'Bank' && (
                        <div className="p-2.5 rounded-xl bg-white border border-emerald-200 text-xs text-slate-800">
                          <span className="text-[10px] font-bold text-emerald-800 block">
                            অফিসিয়াল ব্যাংক অ্যাকাউন্ট:
                          </span>
                          <span className="font-bold">{paymentAccounts.bankDetails}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      টাকা পাঠানোর পর ট্রানজেকশন আইডি (TrxID) অথবা প্রেরক নম্বর দিন *
                    </label>
                    <input
                      type="text"
                      required
                      value={investTrxId}
                      onChange={(e) => setInvestTrxId(e.target.value)}
                      placeholder="যেমন: BKA8923XYZ অথবা যে নম্বর থেকে পাঠিয়েছেন"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#059669] focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-[#064E3B] font-semibold">
                  আপনার বর্তমান অ্যাপ ওয়ালেট ব্যালেন্স: <strong>৳{currentUser.walletBalance.toLocaleString('bn-BD')}</strong>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInvestModalIdea(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={investSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#064E3B] to-[#059669] text-white text-xs font-extrabold shadow-md hover:brightness-105 cursor-pointer disabled:opacity-60"
                >
                  {investSubmitting ? 'জমা হচ্ছে...' : 'ইনভেস্টমেন্ট নিশ্চিত করুন →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Buy & Auto-Sell Package Purchase Modal */}
      {selectedBuyPkg && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-emerald-900/10 my-auto">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold">
                  🛒 {selectedBuyPkg.modelBadge} • মেয়াদ: {selectedBuyPkg.durationLabel}
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                  {selectedBuyPkg.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBuyPkg(null)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200 mb-4 grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-[10px] text-slate-500 block">মোট ক্রয়মূল্য ({buyQty} ইউনিট)</span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                  ৳{(selectedBuyPkg.unitPriceBdt * buyQty).toLocaleString('bn-BD')}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">আপনার নিট লাভ ({selectedBuyPkg.userProfitPercent}%)</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#059669]">
                  +৳{(selectedBuyPkg.userProfitBdt * buyQty).toLocaleString('bn-BD')}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">{selectedBuyPkg.durationLabel} পর পাবেন</span>
                <span className="text-xs sm:text-sm font-extrabold text-amber-700">
                  ৳{((selectedBuyPkg.unitPriceBdt + selectedBuyPkg.userProfitBdt) * buyQty).toLocaleString('bn-BD')}
                </span>
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const totalAmount = selectedBuyPkg.unitPriceBdt * buyQty;
                const totalProfit = selectedBuyPkg.userProfitBdt * buyQty;
                const trxToUse =
                  investPaymentMethod === 'Wallet'
                    ? 'WALLET-' + Date.now()
                    : investTrxId.trim() || 'PKG-' + Date.now();
                setInvestSubmitting(true);
                const invId = 'pkgbuy_' + Date.now();
                const modeLabel =
                  buyFulfillmentMode === 'auto_resell'
                    ? 'অটো-রিসেল ওয়ালেট প্রফিট'
                    : 'পাইকারি হোম ডেলিভারি';
                const newRecord = {
                  id: invId,
                  userId: currentUser.uid,
                  userName: currentUser.fullName,
                  userPhone: currentUser.phone || '01700000000',
                  projectId: selectedBuyPkg.id,
                  projectTitle: `${selectedBuyPkg.title} (${buyQty} ইউনিট - ${modeLabel})`,
                  categoryName: selectedBuyPkg.categoryName,
                  amountBdt: totalAmount,
                  expectedMonthlyProfitBdt: totalProfit,
                  profitSharePercent: `${selectedBuyPkg.userProfitPercent}% (${selectedBuyPkg.durationLabel})`,
                  durationMonths: 1,
                  paymentMethod: investPaymentMethod,
                  transactionId: trxToUse,
                  status: 'pending' as const,
                  totalProfitPaidBdt: 0,
                  createdAt: 'এইমাত্র',
                };
                setUserInvestments((prev) => [newRecord, ...prev]);
                try {
                  await setDoc(doc(db, 'investments', invId), {
                    ...newRecord,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                  });
                } catch {}
                setInvestSubmitting(false);
                setSelectedBuyPkg(null);
                setInvestTrxId('');
                setInvestSuccessMsg(
                  `"${selectedBuyPkg.title}" (${buyQty} ইউনিট) ক্রয় রিকোয়েস্ট সফলভাবে জমা হয়েছে! অ্যাডমিন ভেরিফিকেশনের পর ${selectedBuyPkg.durationLabel} মেয়াদে আপনার ওয়ালেটে আসল + লাভ মোট ৳${(totalAmount + totalProfit).toLocaleString('bn-BD')} যুক্ত হবে।`
                );
              }}
              className="space-y-3.5"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  কত ইউনিট কিনতে চান?
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 5, 10].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setBuyQty(q)}
                      className={`flex-1 py-2 rounded-xl text-xs font-extrabold border cursor-pointer ${
                        buyQty === q
                          ? 'bg-[#064E3B] text-white border-[#064E3B]'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {q}টি
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  বিক্রয় ও লাভ গ্রহণের মাধ্যম নির্বাচন করুন
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => setBuyFulfillmentMode('auto_resell')}
                    className={`p-2.5 rounded-xl border text-left text-xs cursor-pointer ${
                      buyFulfillmentMode === 'auto_resell'
                        ? 'bg-emerald-50 border-[#059669] text-[#064E3B] font-bold'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    ✅ <strong>অ্যাপেই অটো-রিসেল করুন (সুপারিশকৃত):</strong> অ্যাপ পণ্যটি বিক্রি করে {selectedBuyPkg.durationLabel} পর আপনার ওয়ালেটে আসল + লাভ (৳{((selectedBuyPkg.unitPriceBdt + selectedBuyPkg.userProfitBdt) * buyQty).toLocaleString('bn-BD')}) জমা করবে।
                  </button>
                  <button
                    type="button"
                    onClick={() => setBuyFulfillmentMode('home_delivery')}
                    className={`p-2.5 rounded-xl border text-left text-xs cursor-pointer ${
                      buyFulfillmentMode === 'home_delivery'
                        ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    📦 <strong>নিজের ঠিকানায় পাইকারি ডেলিভারি নিন:</strong> পণ্যটি সরাসরি বাসায় নিয়ে নিজে বিক্রি করে লাভ করুন।
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    পেমেন্ট মাধ্যম
                  </label>
                  <select
                    value={investPaymentMethod}
                    onChange={(e) =>
                      setInvestPaymentMethod(
                        e.target.value as 'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Wallet'
                      )
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                  >
                    <option value="bKash">বিকাশ (bKash)</option>
                    <option value="Nagad">নগদ (Nagad)</option>
                    <option value="Rocket">রকেট (Rocket)</option>
                    <option value="Bank">ব্যাংক ট্রান্সফার</option>
                    <option value="Wallet">অ্যাপ ওয়ালেট ব্যালেন্স</option>
                  </select>
                </div>
                {investPaymentMethod !== 'Wallet' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      TrxID / প্রেরক নম্বর *
                    </label>
                    <input
                      type="text"
                      required
                      value={investTrxId}
                      onChange={(e) => setInvestTrxId(e.target.value)}
                      placeholder="TrxID বা নম্বর"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#059669] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {investPaymentMethod !== 'Wallet' ? (
                <div className="p-3 rounded-2xl bg-amber-50/90 border border-amber-300 space-y-2">
                  <div className="text-[11px] font-extrabold text-amber-950">
                    📲 যেখানে টাকা পাঠাবেন (৳{(selectedBuyPkg.unitPriceBdt * buyQty).toLocaleString('bn-BD')} Send Money করুন):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="p-2 rounded-xl bg-white border border-pink-200 flex items-center justify-between gap-1.5">
                      <div>
                        <span className="text-[10px] font-bold text-pink-700 block">
                          বিকাশ পার্সোনাল
                        </span>
                        <span className="text-xs font-extrabold text-slate-900 tabular-nums">
                          {paymentAccounts.bkashNumber}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyPayNumber(paymentAccounts.bkashNumber)}
                        className="px-2 py-1 rounded-lg bg-pink-50 border border-pink-200 text-pink-700 text-[10px] font-extrabold cursor-pointer"
                      >
                        {copiedPayNum === paymentAccounts.bkashNumber ? 'কপি ✓' : 'কপি'}
                      </button>
                    </div>

                    <div className="p-2 rounded-xl bg-white border border-amber-200 flex items-center justify-between gap-1.5">
                      <div>
                        <span className="text-[10px] font-bold text-amber-800 block">
                          নগদ পার্সোনাল
                        </span>
                        <span className="text-xs font-extrabold text-slate-900 tabular-nums">
                          {paymentAccounts.nagadNumber}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyPayNumber(paymentAccounts.nagadNumber)}
                        className="px-2 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-extrabold cursor-pointer"
                      >
                        {copiedPayNum === paymentAccounts.nagadNumber ? 'কপি ✓' : 'কপি'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-[#064E3B] font-semibold">
                  আপনার বর্তমান ওয়ালেট ব্যালেন্স: <strong>৳{currentUser.walletBalance.toLocaleString('bn-BD')}</strong>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBuyPkg(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={investSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#064E3B] to-[#059669] text-white text-xs font-extrabold shadow-md hover:brightness-105 cursor-pointer disabled:opacity-60"
                >
                  {investSubmitting
                    ? 'প্রসেস হচ্ছে...'
                    : `৳${(selectedBuyPkg.unitPriceBdt * buyQty).toLocaleString('bn-BD')} পেমেন্ট ও অর্ডার নিশ্চিত করুন →`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Digital Investment & Package Money Receipt Modal */}
      {selectedReceiptInv && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border-2 border-[#D4AF37] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#064E3B]">
                  অফিসিয়াল ডিজিটাল মানি রিসিট
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  অল্প পুঁজির ব্যবসা — ইনভেস্টমেন্ট ভাউচার
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceiptInv(null)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">রিসিট আইডি:</span>
                <span className="font-mono font-bold text-slate-900">
                  #{selectedReceiptInv.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">উদ্যোক্তার নাম:</span>
                <span className="font-bold text-slate-900">
                  {currentUser.fullName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">প্রজেক্ট / প্যাকেজ:</span>
                <span className="font-bold text-[#064E3B] text-right max-w-[60%]">
                  {selectedReceiptInv.projectTitle}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">জমাকৃত আসল টাকা:</span>
                <span className="font-extrabold text-slate-900">
                  ৳{selectedReceiptInv.amountBdt.toLocaleString('bn-BD')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">নির্ধারিত লাভ:</span>
                <span className="font-extrabold text-[#059669]">
                  +৳{selectedReceiptInv.expectedMonthlyProfitBdt.toLocaleString('bn-BD')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">মোট প্রাপ্য (আসল + লাভ):</span>
                <span className="font-extrabold text-amber-700">
                  ৳{(selectedReceiptInv.amountBdt + selectedReceiptInv.expectedMonthlyProfitBdt).toLocaleString('bn-BD')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">পেমেন্ট মাধ্যম ও TrxID:</span>
                <span className="font-bold text-slate-800">
                  {selectedReceiptInv.paymentMethod} ({selectedReceiptInv.transactionId})
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                <span className="text-slate-500">বর্তমান অবস্থা:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#064E3B] font-extrabold text-[11px]">
                  {selectedReceiptInv.status === 'active'
                    ? '✓ অনুমোদিত ও সক্রিয়'
                    : selectedReceiptInv.status === 'completed'
                    ? '✓ মুনাফা ওয়ালেটে পরিশোধিত'
                    : selectedReceiptInv.status === 'rejected'
                    ? 'বাতিলকৃত'
                    : 'অ্যাডমিন ভেরিফিকেশন চলমান'}
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedReceiptInv(null)}
                className="w-full py-2.5 rounded-xl bg-[#064E3B] text-white text-xs font-extrabold cursor-pointer"
              >
                ঠিক আছে
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar (5 Primary Tabs: Home, Categories, Marketplace, Favorites, Profile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-emerald-900/10 shadow-lg">
        <div className="max-w-xl mx-auto px-2 py-1.5 grid grid-cols-5 gap-1">
          {[
            {
              id: 'home',
              label: 'হোম',
              icon: <Home className="w-5 h-5" />,
              match: [
                'home',
                'calculators',
                'checklists',
                'advice',
                'ai_consultant',
                'stories',
                'notifications',
              ],
            },
            {
              id: 'categories',
              label: 'ক্যাটাগরি',
              icon: <Grid className="w-5 h-5" />,
              match: ['categories', 'ideas', 'idea_detail'],
            },
            {
              id: 'marketplace',
              label: 'মার্কেটপ্লেস',
              icon: <Store className="w-5 h-5" />,
              match: [
                'marketplace',
                'product_detail',
                'seller_profile',
                'my_orders',
              ],
            },
            {
              id: 'favorites',
              label: 'ফেভারিট',
              icon: <Heart className="w-5 h-5" />,
              match: ['favorites'],
            },
            {
              id: 'profile',
              label: 'প্রোফাইল',
              icon: <UserIcon className="w-5 h-5" />,
              match: [
                'profile',
                'membership',
                'referral',
                'wallet',
                'withdrawal',
                'settings',
              ],
            },
          ].map((nav) => {
            const isActive = nav.match.includes(activeScreen);
            return (
              <button
                key={nav.id}
                onClick={() => setActiveScreen(nav.id as UserActiveScreen)}
                className={`py-1.5 rounded-2xl flex flex-col items-center justify-center transition cursor-pointer ${
                  isActive
                    ? 'text-[#064E3B] font-extrabold bg-emerald-50/90'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
              >
                <div className={isActive ? 'text-[#059669]' : ''}>
                  {nav.icon}
                </div>
                <span className="text-[11px] mt-0.5">{nav.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
