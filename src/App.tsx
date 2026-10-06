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
  Lock,
} from 'lucide-react';
import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  runTransaction,
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
import {
  AdminPanelView,
  AdminUserRecord,
  AdminOrderRecord,
  AdminMembershipRecord,
  WithdrawalRecord,
  WalletAuditRecord,
  AdminAuditLogRecord,
  NoticeRecord,
} from './components/AdminPanelView';

type ActiveScreen =
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
  | 'stories'
  | 'admin';

export default function App() {
  // Authentication & Session State
  const [authInitializing, setAuthInitializing] = useState<boolean>(true);
  const [authStep, setAuthStep] = useState<
    'splash' | 'login' | 'register' | 'admin_login'
  >('splash');
  const [currentUser, setCurrentUser] = useState<AuthSessionUser | null>(null);

  // Navigation State
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
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

  // Firestore-backed Domain Data State
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

  // Admin Panel Real Firestore Collections State
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>([]);
  const [adminOrders, setAdminOrders] = useState<AdminOrderRecord[]>([]);
  const [adminWithdrawals, setAdminWithdrawals] = useState<WithdrawalRecord[]>(
    []
  );
  const [adminMemberships, setAdminMemberships] = useState<
    AdminMembershipRecord[]
  >([]);
  const [adminSecurityLogs, setAdminSecurityLogs] = useState<
    AdminAuditLogRecord[]
  >([]);

  const writeAdminAuditLog = async (
    action: string,
    targetId: string,
    reason: string
  ) => {
    if (!currentUser) return;
    const logId = 'log_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
    const newEntry: AdminAuditLogRecord = {
      id: logId,
      adminId: currentUser.uid,
      adminEmail: currentUser.email,
      action,
      targetId,
      reason,
      createdAt: new Date().toLocaleString('bn-BD'),
    };
    setAdminSecurityLogs((prev) => [newEntry, ...prev]);
    try {
      await setDoc(doc(db, 'auditLogs', logId), {
        id: logId,
        adminId: currentUser.uid,
        adminEmail: currentUser.email,
        action,
        targetId,
        reason,
        createdAt: serverTimestamp(),
      });
    } catch {}
  };

  // 1. Persistent Firebase Auth Listener
  const authStepRef = useRef(authStep);
  useEffect(() => {
    authStepRef.current = authStep;
  }, [authStep]);
  const initialAuthCheckedRef = useRef(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      async (fbUser) => {
        // If initial session check already completed and the user is actively submitting
        // Register or Admin Login in AuthViews.tsx, let AuthViews.tsx finish its
        // profile extras sync / role verification before calling onAuthenticated.
        if (
          initialAuthCheckedRef.current &&
          (authStepRef.current === 'register' ||
            authStepRef.current === 'admin_login')
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
          try {
            if (
              profile.isAuthorizedAdmin &&
              localStorage.getItem('alpo_admin_session_active') === 'true'
            ) {
              setActiveScreen('admin');
            }
          } catch {}
        } catch (err) {
          console.error('Error syncing user profile:', err);
        } finally {
          initialAuthCheckedRef.current = true;
          setAuthInitializing(false);
        }
      },
      () => {
        initialAuthCheckedRef.current = true;
        setCurrentUser(null);
        setAuthInitializing(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // 2. Load User & Platform Collections from Cloud Firestore when logged in
  useEffect(() => {
    if (!currentUser) return;

    const loadFirestoreData = async () => {
      // Categories
      try {
        const catSnap = await getDocs(
          currentUser.isAuthorizedAdmin
            ? collection(db, 'categories')
            : query(collection(db, 'categories'), where('enabled', '==', true))
        );
        if (!catSnap.empty) {
          const loadedCats = catSnap.docs.map(
            (d) => d.data() as CategoryItem
          );
          setCategories(loadedCats.sort((a, b) => a.order - b.order));
        }
      } catch {}

      // Business Ideas
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
          setIdeas(loadedIdeas);
        }
      } catch {}

      // Marketplace Products (Admin sees all statuses; normal user sees approved)
      try {
        const prodSnap = await getDocs(
          currentUser.isAuthorizedAdmin
            ? collection(db, 'products')
            : query(collection(db, 'products'), where('status', '==', 'approved'))
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

      // Notices
      try {
        const nSnap = await getDocs(
          currentUser.isAuthorizedAdmin
            ? collection(db, 'notices')
            : query(collection(db, 'notices'), where('published', '==', true))
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

      // 3. Load Admin-Only Real Firestore Collections if Authorized Admin
      if (currentUser.isAuthorizedAdmin) {
        // All Users
        try {
          const uSnap = await getDocs(collection(db, 'users'));
          const loadedUsers: AdminUserRecord[] = uSnap.docs.map((d) => {
            const data = d.data();
            let regDate = '২০২৫';
            if (data.createdAt && typeof data.createdAt.toDate === 'function') {
              regDate = data.createdAt.toDate().toLocaleDateString('bn-BD');
            }
            return {
              uid: data.uid || d.id,
              fullName: data.fullName || 'উদ্যোক্তা',
              email: data.email || '',
              phone: data.phone || '01700000000',
              role: data.role || 'user',
              status: data.status || 'active',
              membershipTier: data.membershipTier || 'free',
              walletBalance: Number(data.walletBalance) || 0,
              points: Number(data.points) || 0,
              referralCode: data.referralCode || 'ALPO2025',
              referredBy: data.referredBy || '',
              referralCount: Number(data.referralCount) || 0,
              joinedAt: regDate,
            };
          });
          if (!loadedUsers.some((u) => u.uid === currentUser.uid)) {
            loadedUsers.unshift({
              uid: currentUser.uid,
              fullName: currentUser.fullName,
              email: currentUser.email,
              phone: currentUser.phone,
              role: currentUser.role,
              status: currentUser.status,
              membershipTier: currentUser.membershipTier,
              walletBalance: currentUser.walletBalance,
              points: currentUser.points,
              referralCode: currentUser.referralCode,
              referredBy: currentUser.referredBy,
              referralCount: (currentUser as any).referralCount || 0,
              joinedAt: 'আজ',
            });
          }
          setAdminUsers(loadedUsers);
        } catch {}

        // All Orders
        try {
          const allOrdSnap = await getDocs(collection(db, 'orders'));
          const loadedAdminOrders: AdminOrderRecord[] = allOrdSnap.docs.map(
            (d) => {
              const data = d.data();
              return {
                id: data.id || d.id,
                productId: data.productId || '',
                productTitle: data.productTitle || 'পণ্য',
                sellerId: data.sellerId || '',
                buyerId: data.buyerId || '',
                buyerName: data.buyerName || 'ক্রেতা',
                buyerPhone: data.buyerPhone || '',
                deliveryAddress: data.deliveryAddress || '',
                quantity: Number(data.quantity) || 1,
                totalPriceBdt: Number(data.totalPriceBdt) || 0,
                status: data.status || 'placed',
                createdAt: 'Firestore অর্ডার',
              };
            }
          );
          setAdminOrders(loadedAdminOrders);
        } catch {}

        // All Withdrawals
        try {
          const allWSnap = await getDocs(collection(db, 'withdrawals'));
          const loadedAdminW: WithdrawalRecord[] = allWSnap.docs.map((d) => {
            const data = d.data();
            return {
              id: data.id || d.id,
              userId: data.userId || '',
              userName: data.userName || 'উদ্যোক্তা',
              amountBdt: Number(data.amountBdt) || 0,
              method: data.method || 'bKash',
              accountNumber: data.accountNumber || '',
              status: data.status || 'pending',
              rejectionReason: data.rejectionReason,
              createdAt: 'Firestore রিকোয়েস্ট',
            };
          });
          setAdminWithdrawals(loadedAdminW);
        } catch {}

        // All Memberships
        try {
          const allMSnap = await getDocs(collection(db, 'memberships'));
          const loadedAdminM: AdminMembershipRecord[] = allMSnap.docs.map(
            (d) => {
              const data = d.data();
              return {
                id: data.id || d.id,
                userId: data.userId || '',
                userName: data.userName || 'উদ্যোক্তা',
                planName: data.planName || 'প্রিমিয়াম উদ্যোক্তা মেম্বারশিপ',
                amountBdt: Number(data.amountBdt) || 299,
                paymentMethod: data.paymentMethod || 'bKash',
                transactionReference: data.transactionReference || '',
                status: data.status || 'pending',
                createdAt: 'Firestore পেমেন্ট',
              };
            }
          );
          setAdminMemberships(loadedAdminM);
        } catch {}

        // All Wallet Transactions
        try {
          const txSnap = await getDocs(collection(db, 'transactions'));
          const loadedTx: WalletAuditRecord[] = txSnap.docs.map((d) => {
            const data = d.data();
            return {
              id: data.id || d.id,
              userId: data.userId || '',
              userName: data.userName || 'উদ্যোক্তা',
              type: 'adjustment',
              amountBdt: Number(data.amountBdt) || 0,
              pointsDelta: Number(data.pointsDelta) || 0,
              reason: data.reason || '',
              adminId: data.adminId || '',
              createdAt: 'Firestore লেনদেন',
            };
          });
          setAuditLogs(loadedTx);
        } catch {}

        // All Admin Security Audit Logs
        try {
          const logSnap = await getDocs(collection(db, 'auditLogs'));
          const loadedLogs: AdminAuditLogRecord[] = logSnap.docs.map((d) => {
            const data = d.data();
            return {
              id: data.id || d.id,
              adminId: data.adminId || '',
              adminEmail: data.adminEmail || '',
              action: data.action || '',
              targetId: data.targetId || '',
              reason: data.reason || '',
              createdAt: 'Firestore লগ',
            };
          });
          setAdminSecurityLogs(loadedLogs);
        } catch {}
      }
    };

    loadFirestoreData();
  }, [currentUser?.uid, currentUser?.isAuthorizedAdmin]);

  const handleAuthenticated = (
    user: AuthSessionUser,
    openAdminPanel?: boolean | 'home' | 'admin'
  ) => {
    setCurrentUser(user);
    if (openAdminPanel === true || openAdminPanel === 'admin') {
      try {
        localStorage.setItem('alpo_admin_session_active', 'true');
      } catch {}
      setActiveScreen('admin');
    } else {
      try {
        localStorage.removeItem('alpo_admin_session_active');
      } catch {}
      setActiveScreen('home');
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('alpo_admin_session_active');
      await logoutFirebase();
    } catch {}
    setCurrentUser(null);
    setAuthStep('login');
    setActiveScreen('home');
  };

  const handleAdminLogout = async () => {
    try {
      localStorage.removeItem('alpo_admin_session_active');
      await logoutFirebase();
    } catch {}
    setCurrentUser(null);
    setAuthStep('admin_login');
    setActiveScreen('home');
  };

  // Sync Favorites to Firestore `/users/{uid}`
  const handleToggleFavorite = async (ideaId: string) => {
    const updatedFavs = favorites.includes(ideaId)
      ? favorites.filter((id) => id !== ideaId)
      : [...favorites, ideaId].slice(0, 100);
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

  // Sync Checklist Progress to Firestore `/users/{uid}`
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

  // Loading Screen during initial Firebase Auth Session check
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

  // Protected Route Guard: Unauthenticated users MUST authenticate first
  if (!currentUser) {
    return (
      <AuthViews
        authStep={authStep}
        onChangeStep={setAuthStep}
        onAuthenticated={handleAuthenticated}
      />
    );
  }

  // Protected Admin Route Guard: Unauthorized users must NOT access Admin Panel
  if (activeScreen === 'admin') {
    if (!currentUser.isAuthorizedAdmin) {
      return (
        <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-red-200 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              অ্যাডমিন প্যানেলে প্রবেশাধিকার সংরক্ষিত (Access Denied)
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              দুঃখিত, শুধুমাত্র অনুমোদিত অ্যাডমিন অ্যাকাউন্ট থেকে এই প্যানেলে
              প্রবেশ করা যাবে। আপনার অ্যাকাউন্টের বর্তমান রোল:{' '}
              <strong>{currentUser.role}</strong>।
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setActiveScreen('home')}
                className="px-4 py-2.5 rounded-xl bg-[#064E3B] text-white text-xs font-bold cursor-pointer"
              >
                হোম স্ক্রিনে ফিরে যান
              </button>
              <button
                onClick={handleAdminLogout}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
              >
                অ্যাডমিন লগইন করুন
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <AdminPanelView
        currentAdminEmail={currentUser.email}
        currentAdminRole={currentUser.role}
        users={adminUsers}
        onToggleBanUser={async (uid, reason) => {
          const target = adminUsers.find((u) => u.uid === uid);
          const nextStatus = target?.status === 'active' ? 'banned' : 'active';
          setAdminUsers((prev) =>
            prev.map((u) =>
              u.uid === uid ? { ...u, status: nextStatus } : u
            )
          );
          try {
            await updateDoc(doc(db, 'users', uid), {
              status: nextStatus,
              updatedAt: serverTimestamp(),
            });
          } catch {}
          await writeAdminAuditLog(
            nextStatus === 'banned' ? 'BAN_USER' : 'UNBAN_USER',
            uid,
            reason || `ইউজার স্ট্যাটাস পরিবর্তন: ${nextStatus}`
          );
        }}
        onChangeUserRole={async (uid, role) => {
          setAdminUsers((prev) =>
            prev.map((u) => (u.uid === uid ? { ...u, role } : u))
          );
          try {
            await updateDoc(doc(db, 'users', uid), {
              role,
              updatedAt: serverTimestamp(),
            });
          } catch {}
          await writeAdminAuditLog(
            'CHANGE_USER_ROLE',
            uid,
            `ইউজার রোল পরিবর্তন করে ${role} করা হয়েছে`
          );
        }}
        onToggleUserPremium={async (uid) => {
          const target = adminUsers.find((u) => u.uid === uid);
          const nextTier =
            target?.membershipTier === 'premium' ? 'free' : 'premium';
          setAdminUsers((prev) =>
            prev.map((u) =>
              u.uid === uid ? { ...u, membershipTier: nextTier } : u
            )
          );
          try {
            await updateDoc(doc(db, 'users', uid), {
              membershipTier: nextTier,
              updatedAt: serverTimestamp(),
            });
          } catch {}
          await writeAdminAuditLog(
            'TOGGLE_MEMBERSHIP_TIER',
            uid,
            `মেম্বারশিপ টিয়ার পরিবর্তন: ${nextTier}`
          );
        }}
        onEditUserProfile={async (uid, fullName, phone) => {
          setAdminUsers((prev) =>
            prev.map((u) =>
              u.uid === uid ? { ...u, fullName, phone } : u
            )
          );
          try {
            await updateDoc(doc(db, 'users', uid), {
              fullName,
              phone,
              updatedAt: serverTimestamp(),
            });
          } catch {}
          await writeAdminAuditLog(
            'EDIT_USER_PROFILE',
            uid,
            `প্রোফাইল আপডেট: ${fullName} (${phone})`
          );
        }}
        onAdjustWallet={async (uid, amountDelta, pointsDelta, reason) => {
          const targetUser = adminUsers.find((u) => u.uid === uid);
          const txId = 'tx_' + Date.now();
          try {
            await runTransaction(db, async (transaction) => {
              const userRef = doc(db, 'users', uid);
              const userSnap = await transaction.get(userRef);
              if (userSnap.exists()) {
                const data = userSnap.data();
                const currentBal = Number(data.walletBalance) || 0;
                const currentPts = Number(data.points) || 0;
                const nextBal = Math.max(0, currentBal + amountDelta);
                const nextPts = Math.max(0, currentPts + pointsDelta);
                transaction.update(userRef, {
                  walletBalance: nextBal,
                  points: nextPts,
                  updatedAt: serverTimestamp(),
                });
              }
              const txRef = doc(db, 'transactions', txId);
              transaction.set(txRef, {
                id: txId,
                userId: uid,
                userName: targetUser?.fullName || 'উদ্যোক্তা',
                type: 'admin_adjustment',
                amountBdt: amountDelta,
                pointsDelta,
                reason,
                adminId: currentUser.email,
                createdAt: serverTimestamp(),
              });
            });
          } catch {}

          setAdminUsers((prev) =>
            prev.map((u) =>
              u.uid === uid
                ? {
                    ...u,
                    walletBalance: Math.max(0, u.walletBalance + amountDelta),
                    points: Math.max(0, u.points + pointsDelta),
                  }
                : u
            )
          );
          if (uid === currentUser.uid) {
            setCurrentUser((prev) =>
              prev
                ? {
                    ...prev,
                    walletBalance: Math.max(0, prev.walletBalance + amountDelta),
                    points: Math.max(0, prev.points + pointsDelta),
                  }
                : null
            );
          }
          setAuditLogs((prev) => [
            {
              id: txId,
              userId: uid,
              userName: targetUser?.fullName || 'উদ্যোক্তা',
              type: 'adjustment',
              amountBdt: amountDelta,
              pointsDelta,
              reason,
              adminId: currentUser.email,
              createdAt: 'এইমাত্র',
            },
            ...prev,
          ]);
          await writeAdminAuditLog(
            'WALLET_ADJUSTMENT',
            uid,
            `৳${amountDelta} / ${pointsDelta} Pts সমন্বয় — কারণ: ${reason}`
          );
        }}
        withdrawals={adminWithdrawals.length > 0 ? adminWithdrawals : withdrawals}
        onProcessWithdrawal={async (id, status, reason) => {
          const targetW =
            adminWithdrawals.find((w) => w.id === id) ||
            withdrawals.find((w) => w.id === id);
          if (!targetW || targetW.status !== 'pending') return;

          try {
            await runTransaction(db, async (transaction) => {
              const wRef = doc(db, 'withdrawals', id);
              const wSnap = await transaction.get(wRef);
              if (!wSnap.exists()) return;
              const wData = wSnap.data();
              if (wData.status !== 'pending') {
                throw new Error('Already processed');
              }

              if (status === 'approved') {
                const userRef = doc(db, 'users', wData.userId);
                const uSnap = await transaction.get(userRef);
                if (uSnap.exists()) {
                  const uData = uSnap.data();
                  const curBal = Number(uData.walletBalance) || 0;
                  const nextBal = Math.max(
                    0,
                    curBal - (Number(wData.amountBdt) || 0)
                  );
                  transaction.update(userRef, {
                    walletBalance: nextBal,
                    updatedAt: serverTimestamp(),
                  });
                }
              }

              transaction.update(wRef, {
                status,
                rejectionReason: reason || '',
                processedBy: currentUser.email,
                updatedAt: serverTimestamp(),
              });
            });
          } catch {}

          setAdminWithdrawals((prev) =>
            prev.map((w) =>
              w.id === id ? { ...w, status, rejectionReason: reason } : w
            )
          );
          setWithdrawals((prev) =>
            prev.map((w) =>
              w.id === id ? { ...w, status, rejectionReason: reason } : w
            )
          );
          if (status === 'approved') {
            setAdminUsers((prev) =>
              prev.map((u) =>
                u.uid === targetW.userId
                  ? {
                      ...u,
                      walletBalance: Math.max(
                        0,
                        u.walletBalance - targetW.amountBdt
                      ),
                    }
                  : u
              )
            );
          }
          await writeAdminAuditLog(
            status === 'approved' ? 'WITHDRAWAL_APPROVE' : 'WITHDRAWAL_REJECT',
            id,
            reason || `উইথড্রয়াল (৳${targetW.amountBdt}) ${status}`
          );
        }}
        memberships={adminMemberships}
        onVerifyMembership={async (id, status, reason) => {
          const targetM = adminMemberships.find((m) => m.id === id);
          if (!targetM) return;
          const isApproved = status === 'verified' || status === 'active';

          try {
            await runTransaction(db, async (transaction) => {
              const mRef = doc(db, 'memberships', id);
              const mSnap = await transaction.get(mRef);
              if (mSnap.exists()) {
                transaction.update(mRef, {
                  status,
                  verifiedBy: currentUser.email,
                  updatedAt: serverTimestamp(),
                });
              }
              if (isApproved) {
                const uRef = doc(db, 'users', targetM.userId);
                const uSnap = await transaction.get(uRef);
                if (uSnap.exists()) {
                  const uData = uSnap.data();
                  transaction.update(uRef, {
                    membershipTier: 'premium',
                    points: (Number(uData.points) || 0) + 50,
                    updatedAt: serverTimestamp(),
                  });
                }
              }
            });
          } catch {}

          setAdminMemberships((prev) =>
            prev.map((m) => (m.id === id ? { ...m, status } : m))
          );
          if (isApproved) {
            setAdminUsers((prev) =>
              prev.map((u) =>
                u.uid === targetM.userId
                  ? { ...u, membershipTier: 'premium', points: u.points + 50 }
                  : u
              )
            );
          }
          await writeAdminAuditLog(
            isApproved ? 'MEMBERSHIP_APPROVE' : 'MEMBERSHIP_UPDATE',
            id,
            reason ||
              `মেম্বারশিপ ভেরিফিকেশন (${targetM.transactionReference}): ${status}`
          );
        }}
        orders={adminOrders}
        onUpdateOrderStatus={async (id, status) => {
          setAdminOrders((prev) =>
            prev.map((o) => (o.id === id ? { ...o, status } : o))
          );
          setOrders((prev) =>
            prev.map((o) => (o.id === id ? { ...o, status } : o))
          );
          try {
            await updateDoc(doc(db, 'orders', id), {
              status,
              updatedAt: serverTimestamp(),
            });
          } catch {}
          await writeAdminAuditLog(
            'ORDER_STATUS_UPDATE',
            id,
            `অর্ডার স্ট্যাটাস পরিবর্তন: ${status}`
          );
        }}
        ideas={ideas}
        onAddIdea={async (newIdea) => {
          setIdeas((prev) => [newIdea, ...prev]);
          try {
            await setDoc(doc(db, 'businessIdeas', newIdea.id), {
              ...newIdea,
              createdAt: serverTimestamp(),
            });
          } catch {}
          await writeAdminAuditLog(
            'CREATE_BUSINESS_IDEA',
            newIdea.id,
            `নতুন ব্যবসার আইডিয়া যুক্ত: ${newIdea.title}`
          );
        }}
        onEditIdea={async (updatedIdea) => {
          setIdeas((prev) =>
            prev.map((item) =>
              item.id === updatedIdea.id ? updatedIdea : item
            )
          );
          try {
            await setDoc(
              doc(db, 'businessIdeas', updatedIdea.id),
              {
                ...updatedIdea,
                updatedAt: serverTimestamp(),
              },
              { merge: true }
            );
          } catch {}
          await writeAdminAuditLog(
            'EDIT_BUSINESS_IDEA',
            updatedIdea.id,
            `ব্যবসার আইডিয়া সম্পাদনা: ${updatedIdea.title}`
          );
        }}
        onToggleIdeaFeatured={async (id) => {
          const target = ideas.find((i) => i.id === id);
          if (!target) return;
          const nextFeat = !target.isFeatured;
          setIdeas((prev) =>
            prev.map((i) =>
              i.id === id ? { ...i, isFeatured: nextFeat } : i
            )
          );
          try {
            await updateDoc(doc(db, 'businessIdeas', id), {
              isFeatured: nextFeat,
            });
          } catch {}
          await writeAdminAuditLog(
            'TOGGLE_FEATURED_IDEA',
            id,
            `${target.title} Featured=${nextFeat}`
          );
        }}
        onDeleteIdea={async (id) => {
          setIdeas((prev) => prev.filter((item) => item.id !== id));
          try {
            await deleteDoc(doc(db, 'businessIdeas', id));
          } catch {}
          await writeAdminAuditLog(
            'DELETE_BUSINESS_IDEA',
            id,
            'ব্যবসার আইডিয়া মুছে ফেলা হয়েছে'
          );
        }}
        categories={categories}
        onAddCategory={async (cat) => {
          setCategories((prev) => [...prev, cat]);
          try {
            await setDoc(doc(db, 'categories', cat.id), cat);
          } catch {}
          await writeAdminAuditLog(
            'CREATE_CATEGORY',
            cat.id,
            `নতুন ক্যাটাগরি তৈরি: ${cat.nameBn}`
          );
        }}
        onToggleCategory={async (id) => {
          const target = categories.find((c) => c.id === id);
          const nextEnabled = target ? !target.enabled : true;
          setCategories((prev) =>
            prev.map((c) =>
              c.id === id ? { ...c, enabled: nextEnabled } : c
            )
          );
          try {
            await updateDoc(doc(db, 'categories', id), {
              enabled: nextEnabled,
            });
          } catch {}
          await writeAdminAuditLog(
            'TOGGLE_CATEGORY',
            id,
            `ক্যাটাগরি স্ট্যাটাস পরিবর্তন: ${nextEnabled ? ' সক্রিয়' : 'নিষ্ক্রিয়'}`
          );
        }}
        products={products}
        onModerateProduct={async (id, status) => {
          setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, status } : p))
          );
          try {
            await updateDoc(doc(db, 'products', id), {
              status,
              updatedAt: serverTimestamp(),
            });
          } catch {}
          await writeAdminAuditLog(
            'MODERATE_PRODUCT',
            id,
            `মার্কেটপ্লেস পণ্য মডারেশন: ${status}`
          );
        }}
        notices={notices}
        onAddNotice={async (n) => {
          const noticeId = 'not_' + Date.now();
          const newNotice: NoticeRecord = {
            ...n,
            id: noticeId,
            createdAt: 'এইমাত্র',
          };
          setNotices((prev) => [newNotice, ...prev]);
          try {
            await setDoc(doc(db, 'notices', noticeId), {
              ...n,
              id: noticeId,
              createdAt: serverTimestamp(),
            });
          } catch {}
          await writeAdminAuditLog(
            'PUBLISH_NOTICE',
            noticeId,
            `নোটিশ প্রকাশ: ${n.title} (${n.targetAudience})`
          );
        }}
        onDeleteNotice={async (id) => {
          setNotices((prev) => prev.filter((n) => n.id !== id));
          try {
            await deleteDoc(doc(db, 'notices', id));
          } catch {}
          await writeAdminAuditLog(
            'DELETE_NOTICE',
            id,
            'নোটিশ মুছে ফেলা হয়েছে'
          );
        }}
        auditLogs={auditLogs}
        adminSecurityLogs={adminSecurityLogs}
        onExitAdmin={() => setActiveScreen('home')}
        onLogoutAdmin={handleAdminLogout}
      />
    );
  }

  const featuredIdeas = ideas.filter((i) => i.isFeatured);
  const lowInvestmentIdeas = ideas.filter((i) => i.minInvestmentBdt <= 15000);
  const favoriteIdeaItems = ideas.filter((i) => favorites.includes(i.id));

  return (
    <div className="min-h-screen bg-[#F4F7F5] text-slate-900 flex flex-col">
      {/* Top App Bar */}
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

            {/* Admin Panel Button strictly shown only for authorized admins */}
            {currentUser.isAuthorizedAdmin && (
              <button
                onClick={() => setActiveScreen('admin')}
                className="px-2.5 py-1.5 rounded-xl bg-[#D4AF37] hover:brightness-105 text-slate-950 text-xs font-extrabold flex items-center gap-1 shadow cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden md:inline">অ্যাডমিন প্যানেল</span>
              </button>
            )}

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
        {/* HOME SCREEN (Kept intact with existing premium design) */}
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
                    onClick={() => setActiveScreen(tool.id as ActiveScreen)}
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

            {/* Business Categories Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    ব্যবসার ক্যাটাগরিসমূহ
                  </h3>
                  <p className="text-xs text-slate-500">
                    ৩০টি লাভজনক খাত থেকে আপনার পছন্দের ক্যাটাগরি বেছে নিন
                  </p>
                </div>
                <button
                  onClick={() => setActiveScreen('categories')}
                  className="text-xs font-bold text-[#059669] hover:underline cursor-pointer"
                >
                  সব দেখুন (৩০) →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                {categories
                  .filter((c) => c.enabled)
                  .slice(0, 10)
                  .map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.nameBn);
                        setActiveScreen('ideas');
                      }}
                      className="bg-white rounded-2xl p-3 border border-emerald-900/10 shadow-2xs hover:shadow-md hover:border-[#059669] transition flex items-center gap-2.5 text-left cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center shrink-0">
                        <CategoryIcon
                          name={cat.iconName}
                          className="w-4 h-4"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {cat.nameBn}
                        </h4>
                        <span className="text-[10px] text-slate-500 block">
                          {cat.ideaCount}টি আইডিয়া
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
                  সবগুলো →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lowInvestmentIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    onClick={() => {
                      setSelectedIdea(idea);
                      setActiveScreen('idea_detail');
                    }}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 transition flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-[#059669]">
                        {idea.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                        {idea.title}
                      </h4>
                      <span className="text-[11px] text-slate-600 mt-1 block">
                        পুঁজি: <strong>{idea.requiredInvestment}</strong> • লাভ:{' '}
                        <strong className="text-amber-700">
                          {idea.estimatedProfit}
                        </strong>
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#064E3B] shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* ৳299 Premium Membership Promo Card -> Navigates directly to Membership Screen */}
            <div className="bg-gradient-to-r from-[#042F24] via-[#064E3B] to-[#047857] rounded-3xl p-5 text-white border border-[#D4AF37]/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#D4AF37] text-slate-950 text-[11px] font-extrabold mb-2">
                  <Crown className="w-3.5 h-3.5" /> প্রিমিয়াম মেম্বারশিপ • মাত্র
                  ৳২৯৯
                </div>
                <h3 className="text-lg font-bold">
                  ভেরিফায়েড পাইকারি সাপ্লায়ার লিস্ট, ভিআইপি গাইড ও রেফারেল আয়
                </h3>
                <p className="text-xs text-emerald-100/85 mt-1">
                  প্রিমিয়াম সদস্য হয়ে আনলক করুন সকল এক্সক্লুসিভ বিজনেস প্ল্যান
                  এবং প্রতি রেফারে পান নগদ ৳৫০ ওয়ালেট বোনাস।
                </p>
              </div>
              <button
                onClick={() => setActiveScreen('membership')}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-extrabold text-xs shrink-0 shadow cursor-pointer"
              >
                ৳২৯৯ প্রিমিয়াম মেম্বারশিপ দেখুন
              </button>
            </div>
          </div>
        )}

        {/* 1. CATEGORIES SCREEN */}
        {activeScreen === 'categories' && (
          <CategoriesScreen
            categories={categories}
            ideas={ideas}
            onSelectCategory={(catName) => {
              setSelectedCategory(catName);
              setActiveScreen('ideas');
            }}
            onSelectIdea={(idea) => {
              setSelectedIdea(idea);
              setActiveScreen('idea_detail');
            }}
          />
        )}

        {/* 2. BUSINESS IDEAS SCREEN */}
        {activeScreen === 'ideas' && (
          <BusinessIdeasScreen
            ideas={ideas}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectIdea={(idea) => {
              setSelectedIdea(idea);
              setActiveScreen('idea_detail');
            }}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onBackToCategories={() => setActiveScreen('categories')}
          />
        )}

        {/* 3. BUSINESS DETAILS SCREEN */}
        {activeScreen === 'idea_detail' && selectedIdea && (
          <BusinessIdeaDetailScreen
            idea={selectedIdea}
            isFavorite={favorites.includes(selectedIdea.id)}
            isUserPremium={currentUser.membershipTier === 'premium'}
            onToggleFavorite={handleToggleFavorite}
            onBack={() => setActiveScreen('ideas')}
            onOpenCalculator={() => setActiveScreen('calculators')}
            onOpenChecklist={() => setActiveScreen('checklists')}
            onAskAiAboutIdea={(promptText) => {
              setAiInitialPrompt(promptText);
              setActiveScreen('ai_consultant');
            }}
            onUpgradePremium={() => setActiveScreen('membership')}
          />
        )}

        {/* 4. MARKETPLACE SCREEN */}
        {activeScreen === 'marketplace' && (
          <MarketplaceScreen
            products={products}
            currentUser={currentUser}
            ordersCount={orders.length}
            onSelectProduct={(prod) => {
              setSelectedProduct(prod);
              setActiveScreen('product_detail');
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
                status: 'pending',
                rating: 5.0,
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

        {/* 5. PRODUCT DETAILS SCREEN */}
        {activeScreen === 'product_detail' && selectedProduct && (
          <ProductDetailScreen
            product={selectedProduct}
            currentUser={currentUser}
            onBack={() => setActiveScreen('marketplace')}
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
            onPlaceOrder={async (ordInput) => {
              const ordId = 'ord_' + Date.now();
              const newOrder: BuyerOrderRecord = {
                id: ordId,
                productId: ordInput.productId,
                productTitle: ordInput.productTitle,
                buyerId: currentUser.uid,
                buyerName: currentUser.fullName,
                buyerPhone: ordInput.buyerPhone,
                deliveryAddress: ordInput.deliveryAddress,
                quantity: ordInput.quantity,
                totalPriceBdt: ordInput.totalPriceBdt,
                status: 'placed',
                createdAt: 'এইমাত্র',
              };
              setOrders((prev) => [newOrder, ...prev]);

              try {
                await setDoc(doc(db, 'orders', ordId), {
                  id: ordId,
                  productId: ordInput.productId,
                  productTitle: ordInput.productTitle,
                  buyerId: currentUser.uid,
                  buyerName: currentUser.fullName,
                  buyerPhone: ordInput.buyerPhone,
                  deliveryAddress: ordInput.deliveryAddress,
                  quantity: ordInput.quantity,
                  totalPriceBdt: ordInput.totalPriceBdt,
                  status: 'placed',
                  createdAt: serverTimestamp(),
                });
              } catch {}

              setActiveScreen('my_orders');
            }}
          />
        )}

        {/* 6. SELLER PROFILE SCREEN */}
        {activeScreen === 'seller_profile' && selectedSeller && (
          <SellerProfileScreen
            seller={selectedSeller}
            products={products}
            onBack={() => setActiveScreen('marketplace')}
            onSelectProduct={(prod) => {
              setSelectedProduct(prod);
              setActiveScreen('product_detail');
            }}
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
          <div className="space-y-4 pb-8">
            <div className="bg-gradient-to-r from-[#042F24] via-[#064E3B] to-[#047857] rounded-3xl p-5 text-white shadow-lg">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-400 fill-rose-400" /> আমার
                পছন্দের ব্যবসার তালিকা ({favoriteIdeaItems.length})
              </h2>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                আপনার সেভ করা ব্যবসার আইডিয়াগুলো যেকোনো সময় এখান থেকে তুলনা ও
                পড়তে পারবেন
              </p>
            </div>

            {favoriteIdeaItems.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
                <p className="text-base font-bold text-slate-800">
                  এখনো কোনো ব্যবসার আইডিয়া ফেভারিটে রাখা হয়নি
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setActiveScreen('ideas');
                  }}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-[#064E3B] text-white text-xs font-bold cursor-pointer"
                >
                  ব্যবসার আইডিয়া ব্রাউজ করুন
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoriteIdeaItems.map((idea) => (
                  <div
                    key={idea.id}
                    className="bg-white rounded-3xl p-4 border border-emerald-900/10 shadow-xs flex items-center gap-4"
                  >
                    <img
                      src={idea.imageUrl}
                      alt={idea.title}
                      className="w-24 h-24 rounded-2xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-[#064E3B]">
                        {idea.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1 truncate">
                        {idea.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        পুঁজি: <strong>{idea.requiredInvestment}</strong>
                      </p>
                      <div className="flex items-center gap-2 mt-2.5">
                        <button
                          onClick={() => {
                            setSelectedIdea(idea);
                            setActiveScreen('idea_detail');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#064E3B] text-white text-xs font-bold cursor-pointer"
                        >
                          বিস্তারিত দেখুন
                        </button>
                        <button
                          onClick={() => handleToggleFavorite(idea.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold cursor-pointer"
                        >
                          মুছে ফেলুন
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 9. PREMIUM MEMBERSHIP — ৳299 SCREEN */}
        {activeScreen === 'membership' && (
          <MembershipScreen
            user={currentUser}
            requests={membershipRequests}
            onSubmitMembership={async (method, trxId) => {
              const memId = 'mem_' + Date.now();
              const newReq: MembershipRequestRecord = {
                id: memId,
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
                await setDoc(doc(db, 'memberships', memId), {
                  id: memId,
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
            onNavigate={(screen) => setActiveScreen(screen)}
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
                onClick={() => setActiveScreen(nav.id as ActiveScreen)}
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
