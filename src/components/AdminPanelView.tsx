import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Wallet,
  ArrowDownToLine,
  Share2,
  Store,
  Crown,
  Bell,
  Briefcase,
  FileBarChart,
  ShieldCheck,
  Search,
  Plus,
  Check,
  X,
  Ban,
  Code2,
  Download,
  ArrowLeft,
} from 'lucide-react';
import {
  BusinessIdeaItem,
  CategoryItem,
  MarketplaceProductItem,
  ANDROID_KOTLIN_FILES,
  USER_ANDROID_KOTLIN_FILES,
  ADMIN_ANDROID_KOTLIN_FILES,
  ASSETS,
  getPaymentGatewayAccounts,
  savePaymentGatewayAccounts,
} from '../data/seedData';

export interface AdminUserRecord {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'user' | 'seller' | 'support' | 'moderator' | 'admin' | 'super_admin';
  status: 'active' | 'banned';
  membershipTier: 'free' | 'premium';
  walletBalance: number;
  points: number;
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  registeredAt?: string;
  joinedAt?: string;
  createdAtLabel?: string;
}

export interface WithdrawalRecord {
  id: string;
  userId: string;
  userName: string;
  amountBdt: number;
  method: 'bKash' | 'Nagad' | 'Bank';
  accountNumber: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  rejectionReason?: string;
  createdAt: string;
}

export interface WalletAuditRecord {
  id: string;
  userId: string;
  userName: string;
  type: 'membership' | 'referral' | 'reward' | 'withdrawal' | 'adjustment';
  amountBdt: number;
  pointsDelta: number;
  reason: string;
  adminId: string;
  createdAt: string;
}

export interface AdminAuditLogRecord {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  target?: string;
  targetId?: string;
  previousValue?: string;
  newValue?: string;
  reason: string;
  createdAt: string;
}

export interface AdminMembershipRecord {
  id: string;
  userId: string;
  userName: string;
  planName?: string;
  amountBdt: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Bank';
  transactionReference: string;
  status: 'initiated' | 'pending' | 'verified' | 'failed' | 'active' | 'expired';
  createdAt: string;
}

export interface AdminOrderRecord {
  id: string;
  productId: string;
  productTitle: string;
  sellerId?: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  deliveryAddress: string;
  quantity: number;
  totalPriceBdt: number;
  status: 'placed' | 'confirmed' | 'shipped' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface NoticeRecord {
  id: string;
  title: string;
  message: string;
  targetAudience: 'all' | 'premium' | 'selected';
  published: boolean;
  createdAt: string;
}

interface AdminPanelViewProps {
  currentAdminEmail: string;
  currentAdminRole: string;
  users: AdminUserRecord[];
  onToggleBanUser: (uid: string, reason: string) => void;
  onChangeUserRole: (uid: string, role: AdminUserRecord['role']) => void;
  onToggleUserPremium: (uid: string) => void;
  onEditUserProfile: (uid: string, fullName: string, phone: string) => void;
  onAdjustWallet: (
    uid: string,
    amountDelta: number,
    pointsDelta: number,
    reason: string
  ) => void;
  withdrawals: WithdrawalRecord[];
  onProcessWithdrawal: (
    id: string,
    status: 'approved' | 'rejected',
    reason?: string
  ) => void;
  memberships: AdminMembershipRecord[];
  onVerifyMembership: (
    id: string,
    status: 'verified' | 'failed' | 'active' | 'expired',
    reason: string
  ) => void;
  orders: AdminOrderRecord[];
  onUpdateOrderStatus: (
    orderId: string,
    status: AdminOrderRecord['status']
  ) => void;
  ideas: BusinessIdeaItem[];
  onAddIdea: (idea: BusinessIdeaItem) => void;
  onEditIdea: (idea: BusinessIdeaItem) => void;
  onToggleIdeaFeatured: (id: string) => void;
  onDeleteIdea: (id: string) => void;
  categories: CategoryItem[];
  onAddCategory: (cat: CategoryItem) => void;
  onToggleCategory: (id: string) => void;
  products: MarketplaceProductItem[];
  onModerateProduct: (id: string, status: 'approved' | 'rejected') => void;
  notices: NoticeRecord[];
  onAddNotice: (notice: Omit<NoticeRecord, 'id' | 'createdAt'>) => void;
  onDeleteNotice: (id: string) => void;
  auditLogs: WalletAuditRecord[];
  adminSecurityLogs?: AdminAuditLogRecord[];
  investments?: Array<{
    id: string;
    userId: string;
    userName: string;
    userPhone: string;
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
  }>;
  onManageInvestment?: (
    id: string,
    action: 'approve' | 'reject' | 'pay_profit'
  ) => void;
  onExitAdmin: () => void;
  onLogoutAdmin: () => void;
}

type AdminSection =
  | 'dashboard'
  | 'users'
  | 'wallet'
  | 'withdrawals'
  | 'referrals'
  | 'memberships'
  | 'marketplace'
  | 'content'
  | 'notices'
  | 'reports'
  | 'roles'
  | 'android_apk';

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  currentAdminEmail,
  currentAdminRole,
  users,
  onToggleBanUser,
  onChangeUserRole,
  onToggleUserPremium,
  onEditUserProfile,
  onAdjustWallet,
  withdrawals,
  onProcessWithdrawal,
  memberships,
  onVerifyMembership,
  orders,
  onUpdateOrderStatus,
  ideas,
  onAddIdea,
  onEditIdea,
  onToggleIdeaFeatured,
  onDeleteIdea,
  categories,
  onAddCategory,
  onToggleCategory,
  products,
  onModerateProduct,
  notices,
  onAddNotice,
  onDeleteNotice,
  auditLogs,
  adminSecurityLogs = [],
  investments = [],
  onManageInvestment,
  onExitAdmin,
  onLogoutAdmin,
}) => {
  const [section, setSection] = useState<AdminSection>('dashboard');
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | 'all'>('7d');
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'active' | 'banned' | 'premium'>('all');

  // Selected User Details & Edit Permitted Profile State
  const [selectedDetailUid, setSelectedDetailUid] = useState<string | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [profileEditMsg, setProfileEditMsg] = useState<string | null>(null);

  // Wallet adjustment form state
  const [selectedUserUid, setSelectedUserUid] = useState(users[0]?.uid || '');
  const [adjAmount, setAdjAmount] = useState('500');
  const [adjPoints, setAdjPoints] = useState('50');
  const [adjType, setAdjType] = useState<'add' | 'deduct'>('add');
  const [adjReason, setAdjReason] = useState('রেফারেল ও সক্রিয় উদ্যোক্তা বোনাস');
  const [walletFeedback, setWalletFeedback] = useState<string | null>(null);

  // Withdrawal tab & rejection modal
  const [wTab, setWTab] = useState<'pending' | 'approved' | 'rejected' | 'cancelled'>('pending');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Membership management tab
  const [mTab, setMTab] = useState<'all' | 'pending' | 'verified' | 'failed'>('all');

  // Content CRUD form state
  const [editingIdeaId, setEditingIdeaId] = useState<string | null>(null);
  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [newIdeaCategory, setNewIdeaCategory] = useState('ঘরে বসে ব্যবসা');
  const [newIdeaInvestment, setNewIdeaInvestment] = useState('৳৫,০০০ – ৳১২,০০০');
  const [newIdeaProfit, setNewIdeaProfit] = useState('৳১০,০০০ – ৳২০,০০০');
  const [newIdeaDesc, setNewIdeaDesc] = useState('');
  const [newCatBn, setNewCatBn] = useState('');
  const [newCatEn, setNewCatEn] = useState('');
  const [newCatImageUrl, setNewCatImageUrl] = useState('');
  const [newCatGroup, setNewCatGroup] = useState<
    'investment' | 'popular' | 'new' | 'special' | 'existing'
  >('investment');
  const [newCatRoi, setNewCatRoi] = useState('মাসিক ১৫%–২০% হালাল মুনাফা');
  const [newCatMinInvest, setNewCatMinInvest] = useState<number>(5000);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [payAccounts, setPayAccounts] = useState(() =>
    getPaymentGatewayAccounts()
  );
  const [paySavedMsg, setPaySavedMsg] = useState<string | null>(null);

  // Notice form state
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeMsg, setNoticeMsg] = useState('');
  const [noticeTarget, setNoticeTarget] = useState<'all' | 'premium' | 'selected'>('all');

  // Android Kotlin source viewer state
  const [selectedKotlinFile, setSelectedKotlinFile] = useState<string>(
    'user-app/build.gradle.kts'
  );

  // Confirmation modal for dangerous user actions
  const [confirmBanUid, setConfirmBanUid] = useState<string | null>(null);
  const [banReason, setBanReason] = useState('প্ল্যাটফর্ম নীতিমালা লঙ্ঘন');

  // Real Firestore Computed Metrics
  const totalUsersCount = users.length;
  const activeUsersCount = users.filter((u) => u.status === 'active').length;
  const bannedUsersCount = users.filter((u) => u.status === 'banned').length;
  const premiumMembersCount = users.filter((u) => u.membershipTier === 'premium').length;
  const pendingWithdrawalsCount = withdrawals.filter((w) => w.status === 'pending').length;
  const totalProductsCount = products.length;
  const uniqueSellersCount = new Set([
    ...products.map((p) => p.sellerId),
    ...users.filter((u) => u.role === 'seller').map((u) => u.uid),
  ]).size;
  const totalOrdersCount = orders.length;
  const totalReferralsCount = users.reduce(
    (sum, u) => sum + (u.referralCount || (u.referredBy ? 1 : 0)),
    0
  );
  const verifiedMembershipCount = Math.max(
    premiumMembersCount,
    memberships.filter((m) => m.status === 'verified').length
  );
  const membershipRevenueBdt = verifiedMembershipCount * 299;
  const ordersRevenueBdt = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (Number(o.totalPriceBdt) || 0), 0);
  const totalRevenueBdt = membershipRevenueBdt + ordersRevenueBdt;

  const filteredUsers = users.filter((u) => {
    const matchesQuery =
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.phone.includes(userSearch) ||
      u.referralCode.toLowerCase().includes(userSearch.toLowerCase());
    if (!matchesQuery) return false;
    if (userFilter === 'active') return u.status === 'active';
    if (userFilter === 'banned') return u.status === 'banned';
    if (userFilter === 'premium') return u.membershipTier === 'premium';
    return true;
  });

  const selectedDetailUser = users.find((u) => u.uid === selectedDetailUid) || null;

  const openUserDetail = (u: AdminUserRecord) => {
    setSelectedDetailUid(u.uid);
    setEditFullName(u.fullName);
    setEditPhone(u.phone);
    setProfileEditMsg(null);
  };

  const handleSaveUserProfileEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDetailUser || !editFullName.trim()) return;
    onEditUserProfile(selectedDetailUser.uid, editFullName.trim(), editPhone.trim());
    setProfileEditMsg('ব্যবহারকারীর প্রোফাইল তথ্য Firestore-এ আপডেট হয়েছে।');
    setTimeout(() => setProfileEditMsg(null), 3000);
  };

  const handleWalletSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUid = selectedUserUid || users[0]?.uid;
    if (!targetUid || !adjReason.trim()) return;
    const sign = adjType === 'add' ? 1 : -1;
    const amt = (Number(adjAmount) || 0) * sign;
    const pts = (Number(adjPoints) || 0) * sign;
    onAdjustWallet(targetUid, amt, pts, adjReason.trim());
    setWalletFeedback('ব্যালেন্স ও পয়েন্ট সফলভাবে আপডেট এবং অডিট লগে সংরক্ষিত হয়েছে।');
    setTimeout(() => setWalletFeedback(null), 3500);
  };

  const handleAddIdeaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdeaTitle.trim()) return;
    if (editingIdeaId) {
      const existing = ideas.find((i) => i.id === editingIdeaId);
      if (existing) {
        onEditIdea({
          ...existing,
          title: newIdeaTitle.trim(),
          category: newIdeaCategory,
          requiredInvestment: newIdeaInvestment,
          estimatedProfit: newIdeaProfit,
          shortDescription:
            newIdeaDesc.trim() || existing.shortDescription,
        });
      }
      setEditingIdeaId(null);
    } else {
      const created: BusinessIdeaItem = {
        id: `idea-${Date.now()}`,
        title: newIdeaTitle.trim(),
        category: newIdeaCategory,
        imageUrl: ASSETS.spiceIdeaImg,
        shortDescription:
          newIdeaDesc.trim() ||
          'অল্প পুঁজিতে শুরু করার মতো পরীক্ষিত এবং লাভজনক স্থানীয় ব্যবসার পরিকল্পনা।',
        requiredInvestment: newIdeaInvestment,
        minInvestmentBdt: 5000,
        expectedDailySales: '৳১,৫০০ – ৳৩,০০০',
        expectedMonthlyRevenue: '৳৪৫,০০০ – ৳৯০,০০০',
        estimatedExpenses: '৳৩০,০০০ – ৳৬০,০০০',
        estimatedProfit: newIdeaProfit,
        difficulty: 'সহজ',
        requiredEquipment: 'প্রাথমিক সরঞ্জাম ও প্যাকেজিং কিট',
        requiredLocation: 'বাসা বা ছোট দোকান',
        requiredSkills: 'প্রাথমিক ব্যবস্থাপনা ও মার্কেটিং',
        startupSteps: '১. বাজার যাচাই\n২. কাঁচামাল সংগ্রহ\n৩. প্যাকিং ও প্রচারণা',
        productSourcing: 'চকবাজার বা স্থানীয় পাইকারি বাজার',
        marketingStrategy: 'ফেসবুক পেজ ও লোকাল ডেলিভারি',
        risk: 'কম ঝুঁকি',
        tips: 'গুণগত মান বজায় রাখুন।',
        isPremium: false,
        isFeatured: true,
        rating: 4.8,
      };
      onAddIdea(created);
    }
    setNewIdeaTitle('');
    setNewIdeaDesc('');
  };

  const downloadProjectFiles = (
    filesMap: Record<string, string>,
    filename: string
  ) => {
    const content = Object.entries(filesMap)
      .map(
        ([filePath, code]) =>
          `// ==========================================\n// FILE: ${filePath}\n// ==========================================\n\n${code}\n\n`
      )
      .join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [downloadingApp, setDownloadingApp] = useState<'user' | 'admin' | null>(
    null
  );

  const downloadStandaloneZipApp = async (target: 'user' | 'admin') => {
    if (downloadingApp) return;
    setDownloadingApp(target);
    try {
      const endpoint =
        target === 'user'
          ? '/api/download/user-zip'
          : '/api/download/admin-zip';
      const filename =
        target === 'user'
          ? 'Alpo_Pujir_Bebsha_User_App.zip'
          : 'Alpo_Pujir_Bebsha_Admin_App.zip';
      const res = await fetch(endpoint, {
        method: 'GET',
        credentials: 'include',
      });
      const buf = await res.arrayBuffer();
      const blob = new Blob([buf], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 15000);
    } catch {
      downloadProjectFiles(
        target === 'user' ? USER_ANDROID_KOTLIN_FILES : ADMIN_ANDROID_KOTLIN_FILES,
        target === 'user'
          ? 'alpo-pujir-bebsha-USER-APP-playstore-aab-project.txt'
          : 'alpo-pujir-bebsha-ADMIN-APP-private-apk-project.txt'
      );
    } finally {
      setDownloadingApp(null);
    }
  };

  const handleDownloadAndroidBundle = () => {
    downloadProjectFiles(
      ANDROID_KOTLIN_FILES,
      'alpo-pujir-bebsha-dual-app-android-project.txt'
    );
  };

  const handleDownloadUserAppBundle = () => {
    downloadStandaloneZipApp('user');
  };

  const handleDownloadAdminAppBundle = () => {
    downloadStandaloneZipApp('admin');
  };

  const navItems: { id: AdminSection; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'users', label: 'ব্যবহারকারী (Users)', icon: <Users className="w-4 h-4" /> },
    { id: 'wallet', label: 'ওয়ালেট / পয়েন্ট', icon: <Wallet className="w-4 h-4" /> },
    { id: 'withdrawals', label: 'উইথড্রয়াল', icon: <ArrowDownToLine className="w-4 h-4" /> },
    { id: 'referrals', label: 'রেফারেল', icon: <Share2 className="w-4 h-4" /> },
    { id: 'memberships', label: 'মেম্বারশিপ (৳২৯৯)', icon: <Crown className="w-4 h-4" /> },
    { id: 'marketplace', label: 'মার্কেটপ্লেস ও অর্ডার', icon: <Store className="w-4 h-4" /> },
    { id: 'content', label: 'বিজনেস আইডিয়া ও ক্যাটাগরি', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'notices', label: 'নোটিশ / নোটিফিকেশন', icon: <Bell className="w-4 h-4" /> },
    { id: 'reports', label: 'রিপোর্টস ও অডিট লগ', icon: <FileBarChart className="w-4 h-4" /> },
    { id: 'roles', label: 'রোলস ও সিকিউরিটি', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'android_apk', label: 'Android Studio / APK', icon: <Code2 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F3] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-[#032B1E] text-white shrink-0 flex flex-col justify-between border-r border-emerald-900">
        <div>
          <div className="p-4 border-b border-emerald-900/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-emerald-950 flex items-center justify-center font-bold">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-amber-400 leading-tight">
                  Admin Panel
                </h1>
                <p className="text-[11px] text-emerald-200">
                  শুধুমাত্র অনুমোদিত অ্যাডমিন
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 lg:hidden">
              <button
                type="button"
                onClick={onExitAdmin}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-800 text-xs font-semibold cursor-pointer"
              >
                ইউজার ভিউ
              </button>
              <button
                type="button"
                onClick={onLogoutAdmin}
                className="px-2.5 py-1.5 rounded-lg bg-red-600/90 text-xs font-semibold cursor-pointer"
              >
                লগআউট
              </button>
            </div>
          </div>

          <nav className="p-3 flex lg:flex-col gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  section === item.id
                    ? 'bg-emerald-700/90 text-amber-300 shadow-xs'
                    : 'text-emerald-100/80 hover:bg-emerald-900/60 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="hidden lg:block p-4 border-t border-emerald-900/80 space-y-2">
          <div className="text-xs text-emerald-200 truncate">{currentAdminEmail}</div>
          <div className="text-[11px] text-amber-400 font-semibold uppercase">
            Role: {currentAdminRole}
          </div>
          <button
            type="button"
            onClick={onExitAdmin}
            className="w-full py-2 px-3 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ইউজার প্যানেলে ফিরুন</span>
          </button>
          <button
            type="button"
            onClick={onLogoutAdmin}
            className="w-full py-2 px-3 rounded-xl bg-red-600/90 hover:bg-red-600 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>অ্যাডমিন লগআউট</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 space-y-6 max-w-6xl">
        {/* Top Header */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              অল্প পুঁজির ব্যবসা — সেন্ট্রাল অ্যাডমিন কন্ট্রোল
            </h2>
            <p className="text-xs text-slate-500">
              রোল-ভিত্তিক নিরাপত্তা ও রিয়েল-টাইম Firestore প্ল্যাটফর্ম ব্যবস্থাপনা
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadUserAppBundle}
              className="px-3.5 py-2 rounded-xl bg-[#044E36] hover:bg-[#033d2a] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#FBBF24]" />
              <span>ইউজার অ্যাপ ZIP (.zip)</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadAdminAppBundle}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>অ্যাডমিন অ্যাপ ZIP (.zip)</span>
            </button>
            {(['7d', '30d', 'all'] as const).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeFilter(tf)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  timeFilter === tf
                    ? 'bg-[#044E36] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tf === '7d'
                  ? '৭ দিন (7 Days)'
                  : tf === '30d'
                  ? '৩০ দিন (30 Days)'
                  : 'সব সময় (All Time)'}
              </button>
            ))}
          </div>
        </div>

        {/* Confirm Ban Modal */}
        {confirmBanUid && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-3">
            <div className="text-xs text-red-900">
              <strong>সতর্কবার্তা:</strong> আপনি কি নিশ্চিতভাবে এই ব্যবহারকারীর অ্যাকাউন্ট স্ট্যাটাস পরিবর্তন (Ban/Unban) করতে চান? অডিট লগের জন্য কারণ উল্লেখ করুন:
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="কারণ লিখুন..."
                className="flex-1 min-w-[220px] h-9 px-3 rounded-xl border border-red-200 bg-white text-xs"
              />
              <button
                type="button"
                onClick={() => setConfirmBanUid(null)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => {
                  onToggleBanUser(confirmBanUid, banReason.trim() || 'অ্যাডমিন সিদ্ধান্ত');
                  setConfirmBanUid(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold cursor-pointer"
              >
                নিশ্চিত করুন
              </button>
            </div>
          </div>
        )}

        {/* SECTION: DASHBOARD */}
        {section === 'dashboard' && (
          <div className="space-y-6">
            {/* 10 Real Firestore KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs text-slate-500">মোট ব্যবহারকারী (Total Users)</span>
                <p className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
                  {totalUsersCount.toLocaleString('bn-BD')}
                </p>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  Firestore নিবন্ধিত
                </span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs text-slate-500">সক্রিয় ব্যবহারকারী (Active)</span>
                <p className="text-2xl font-bold text-emerald-700 tabular-nums mt-1">
                  {activeUsersCount.toLocaleString('bn-BD')}
                </p>
                <span className="text-[11px] text-emerald-700 font-semibold">সচল অ্যাকাউন্ট</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs text-slate-500">ব্যান ব্যবহারকারী (Banned)</span>
                <p className="text-2xl font-bold text-red-600 tabular-nums mt-1">
                  {bannedUsersCount.toLocaleString('bn-BD')}
                </p>
                <span className="text-[11px] text-slate-500">নিরাপত্তা ফিল্টার</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs text-slate-500">প্রিমিয়াম মেম্বার (৳২৯৯)</span>
                <p className="text-2xl font-bold text-amber-600 tabular-nums mt-1">
                  {premiumMembersCount.toLocaleString('bn-BD')}
                </p>
                <span className="text-[11px] text-amber-700 font-semibold">PRO সাবস্ক্রাইবার</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs text-slate-500">মোট রেভিনিউ (Total Revenue)</span>
                <p className="text-2xl font-bold text-[#044E36] tabular-nums mt-1">
                  ৳{totalRevenueBdt.toLocaleString('bn-BD')}
                </p>
                <span className="text-[11px] text-emerald-700 font-semibold">মেম্বারশিপ + অর্ডার</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs text-slate-500">পেন্ডিং উইথড্রয়াল</span>
                <p className="text-2xl font-bold text-amber-700 tabular-nums mt-1">
                  {pendingWithdrawalsCount.toLocaleString('bn-BD')}
                </p>
                <span className="text-[11px] text-slate-500">অনুমোদনের অপেক্ষায়</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs text-slate-500">মোট পণ্য (Total Products)</span>
                <p className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
                  {totalProductsCount.toLocaleString('bn-BD')}
                </p>
                <span className="text-[11px] text-emerald-700 font-semibold">মার্কেটপ্লেস লিস্টিং</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs text-slate-500">মোট সেলার (Sellers)</span>
                <p className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
                  {uniqueSellersCount.toLocaleString('bn-BD')}
                </p>
                <span className="text-[11px] text-slate-500">সক্রিয় বিক্রেতা</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs text-slate-500">মোট অর্ডার (Orders)</span>
                <p className="text-2xl font-bold text-emerald-800 tabular-nums mt-1">
                  {totalOrdersCount.toLocaleString('bn-BD')}
                </p>
                <span className="text-[11px] text-emerald-700 font-semibold">মার্কেটপ্লেস অর্ডার</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs text-slate-500">মোট রেফারেল (Referrals)</span>
                <p className="text-2xl font-bold text-amber-600 tabular-nums mt-1">
                  {totalReferralsCount.toLocaleString('bn-BD')}
                </p>
                <span className="text-[11px] text-slate-500">ভেরিফায়েড রেফারেল</span>
              </div>
            </div>

            {/* Charts Row matching visual design */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    ব্যবহারকারী ও অর্ডার প্রবৃদ্ধি ({timeFilter === '7d' ? 'গত ৭ দিন' : timeFilter === '30d' ? 'গত ৩০ দিন' : 'সব সময়'})
                  </h3>
                  <span className="text-xs text-emerald-700 font-semibold tabular-nums">
                    {totalUsersCount} নিবন্ধিত উদ্যোক্তা
                  </span>
                </div>
                <svg viewBox="0 0 360 130" className="w-full h-36 overflow-visible">
                  <defs>
                    <linearGradient id="emeraldArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#059669" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={
                      timeFilter === '7d'
                        ? 'M10,105 L65,88 L120,92 L175,65 L230,70 L285,42 L345,24 L345,115 L10,115 Z'
                        : timeFilter === '30d'
                        ? 'M10,110 L65,95 L120,80 L175,72 L230,52 L285,38 L345,18 L345,115 L10,115 Z'
                        : 'M10,112 L65,100 L120,85 L175,60 L230,45 L285,28 L345,15 L345,115 L10,115 Z'
                    }
                    fill="url(#emeraldArea)"
                  />
                  <polyline
                    fill="none"
                    stroke="#047857"
                    strokeWidth="3"
                    points={
                      timeFilter === '7d'
                        ? '10,105 65,88 120,92 175,65 230,70 285,42 345,24'
                        : timeFilter === '30d'
                        ? '10,110 65,95 120,80 175,72 230,52 285,38 345,18'
                        : '10,112 65,100 120,85 175,60 230,45 285,28 345,15'
                    }
                  />
                  {[
                    [10, 105],
                    [65, 88],
                    [120, 92],
                    [175, 65],
                    [230, 70],
                    [285, 42],
                    [345, 24],
                  ].map(([cx, cy], idx) => (
                    <circle
                      key={idx}
                      cx={cx}
                      cy={cy}
                      r="4.5"
                      fill="#ffffff"
                      stroke="#047857"
                      strokeWidth="2.5"
                    />
                  ))}
                </svg>
                <div className="flex justify-between text-[11px] text-slate-400 tabular-nums">
                  <span>পর্ব ১</span>
                  <span>পর্ব ২</span>
                  <span>পর্ব ৩</span>
                  <span>পর্ব ৪</span>
                  <span>পর্ব ৫</span>
                  <span>পর্ব ৬</span>
                  <span>আজ</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500">মোট প্ল্যাটফর্ম রেভিনিউ (মেম্বারশিপ ও মার্কেটপ্লেস)</span>
                    <h3 className="text-2xl font-bold text-[#044E36] tabular-nums mt-0.5">
                      ৳ {totalRevenueBdt.toLocaleString('bn-BD')}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700">
                    মেম্বারশিপ: ৳{membershipRevenueBdt.toLocaleString('bn-BD')}
                  </span>
                </div>
                <div className="flex items-end gap-3 h-28 pt-4">
                  {[38, 52, 46, 65, 74, 86, 100].map((pct, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-[#044E36] to-emerald-500"
                        style={{ height: `${pct}%` }}
                      />
                      <span className="text-[10px] text-slate-400 tabular-nums">D{i + 1}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-500">পেন্ডিং উইথড্রয়াল:</span>{' '}
                    <strong className="tabular-nums">{pendingWithdrawalsCount}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">মার্কেটপ্লেস পণ্য:</span>{' '}
                    <strong className="tabular-nums">{products.length}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">অর্ডার সংখ্যা:</span>{' '}
                    <strong className="tabular-nums">{orders.length}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  সাম্প্রতিক প্ল্যাটফর্ম অ্যাক্টিভিটি (Recent Activity)
                </h3>
                <button
                  type="button"
                  onClick={() => setSection('reports')}
                  className="text-xs font-bold text-[#059669] hover:underline cursor-pointer"
                >
                  সব অডিট লগ দেখুন →
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {auditLogs.slice(0, 4).map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-2"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{log.userName}</span>
                      <p className="text-slate-500 mt-0.5">{log.reason}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={`font-bold tabular-nums ${
                          log.amountBdt >= 0 ? 'text-emerald-700' : 'text-red-600'
                        }`}
                      >
                        {log.amountBdt >= 0 ? `+৳${log.amountBdt}` : `-৳${Math.abs(log.amountBdt)}`}
                      </span>
                      <span className="block text-[10px] text-slate-400">{log.createdAt}</span>
                    </div>
                  </div>
                ))}
                {withdrawals.slice(0, 2).map((w) => (
                  <div
                    key={w.id}
                    className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/70 flex items-center justify-between gap-2"
                  >
                    <div>
                      <span className="font-bold text-slate-900">
                        উইথড্রয়াল রিকোয়েস্ট: {w.userName}
                      </span>
                      <p className="text-slate-500 mt-0.5">
                        {w.method} ({w.accountNumber}) • স্ট্যাটাস: {w.status}
                      </p>
                    </div>
                    <span className="font-bold text-amber-800 tabular-nums">৳{w.amountBdt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION: USER MANAGEMENT & USER DETAILS */}
        {section === 'users' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    ব্যবহারকারী ব্যবস্থাপনা (Users Management — {filteredUsers.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    যেকোনো ব্যবহারকারীর পূর্ণাঙ্গ প্রোফাইল, অর্ডার, রেফারেল, ওয়ালেট, উইথড্রয়াল ও লেনদেন ইতিহাস দেখতে "বিস্তারিত" বাটনে ক্লিক করুন
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {(['all', 'active', 'banned', 'premium'] as const).map((uf) => (
                    <button
                      key={uf}
                      type="button"
                      onClick={() => setUserFilter(uf)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        userFilter === uf
                          ? 'bg-[#044E36] text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {uf === 'all'
                        ? 'সকল'
                        : uf === 'active'
                        ? 'সক্রিয়'
                        : uf === 'banned'
                        ? 'ব্যান'
                        : 'প্রিমিয়াম'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="নাম, ইমেইল, মোবাইল নম্বর বা রেফারেল কোড দিয়ে খুঁজুন..."
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2.5 px-2">নাম ও ইমেইল</th>
                      <th className="py-2.5 px-2">মোবাইল ও নিবন্ধন</th>
                      <th className="py-2.5 px-2">স্ট্যাটাস</th>
                      <th className="py-2.5 px-2">মেম্বারশিপ</th>
                      <th className="py-2.5 px-2">ওয়ালেট / পয়েন্ট</th>
                      <th className="py-2.5 px-2">রেফারেল / অর্ডার</th>
                      <th className="py-2.5 px-2">রোল</th>
                      <th className="py-2.5 px-2 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u) => {
                      const uOrdersCount = orders.filter((o) => o.buyerId === u.uid).length;
                      return (
                        <tr key={u.uid} className="hover:bg-slate-50/80">
                          <td className="py-3 px-2">
                            <div className="font-semibold text-slate-900">{u.fullName}</div>
                            <div className="text-[11px] text-slate-500">{u.email}</div>
                          </td>
                          <td className="py-3 px-2 tabular-nums">
                            <div>{u.phone || 'N/A'}</div>
                            <div className="text-[10px] text-slate-400">
                              নিবন্ধন: {u.registeredAt || 'সক্রিয় সদস্য'}
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <span
                              className={`font-semibold ${
                                u.status === 'active' ? 'text-emerald-700' : 'text-red-600'
                              }`}
                            >
                              {u.status === 'active' ? 'সক্রিয়' : 'নিষিদ্ধ (Banned)'}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <button
                              type="button"
                              onClick={() => onToggleUserPremium(u.uid)}
                              className="text-xs font-semibold text-amber-700 hover:underline cursor-pointer"
                            >
                              {u.membershipTier === 'premium' ? 'প্রিমিয়াম (পরিবর্তন)' : 'ফ্রি (আপগ্রেড)'}
                            </button>
                          </td>
                          <td className="py-3 px-2 tabular-nums">
                            <div className="font-bold text-emerald-800">৳{u.walletBalance}</div>
                            <div className="text-[11px] text-slate-500">{u.points} pts</div>
                          </td>
                          <td className="py-3 px-2 tabular-nums">
                            <div>রেফারেল: {u.referralCount}</div>
                            <div className="text-[11px] text-slate-500">অর্ডার: {uOrdersCount}টি</div>
                          </td>
                          <td className="py-3 px-2">
                            <select
                              aria-label={`${u.fullName} এর রোল নির্বাচন`}
                              value={u.role}
                              onChange={(e) =>
                                onChangeUserRole(
                                  u.uid,
                                  e.target.value as AdminUserRecord['role']
                                )
                              }
                              className="px-2 py-1 rounded-lg border border-slate-200 text-xs bg-white"
                            >
                              <option value="user">User</option>
                              <option value="seller">Seller</option>
                              <option value="support">Support</option>
                              <option value="moderator">Moderator</option>
                              <option value="admin">Admin</option>
                              <option value="super_admin">Super Admin</option>
                            </select>
                          </td>
                          <td className="py-3 px-2 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => openUserDetail(u)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#044E36] hover:bg-emerald-100 text-xs font-bold cursor-pointer"
                            >
                              বিস্তারিত
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmBanUid(u.uid)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1 cursor-pointer ${
                                u.status === 'active'
                                  ? 'bg-red-50 text-red-700 hover:bg-red-100'
                                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              }`}
                            >
                              <Ban className="w-3.5 h-3.5" />
                              <span>{u.status === 'active' ? 'Ban' : 'Unban'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* USER DETAILS PANEL */}
            {selectedDetailUser && (
              <div className="bg-white rounded-2xl border-2 border-[#044E36]/30 p-5 space-y-5 shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#044E36]">
                      USER DETAILS • UID: {selectedDetailUser.uid}
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 mt-1">
                      {selectedDetailUser.fullName} ({selectedDetailUser.email})
                    </h4>
                    <p className="text-xs text-slate-500">
                      রেজিস্ট্রেশন তারিখ: {selectedDetailUser.registeredAt || 'সক্রিয় সদস্য'} • রেফারেল কোড: <strong>{selectedDetailUser.referralCode}</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedDetailUid(null)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    বন্ধ করুন ✕
                  </button>
                </div>

                {/* Summary Cards: Profile, Wallet, Points, Membership */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <span className="text-slate-500">ওয়ালেট ব্যালেন্স (Wallet)</span>
                    <p className="text-lg font-extrabold text-[#044E36] tabular-nums mt-0.5">
                      ৳{selectedDetailUser.walletBalance}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                    <span className="text-slate-500">পয়েন্ট (Points)</span>
                    <p className="text-lg font-extrabold text-amber-800 tabular-nums mt-0.5">
                      {selectedDetailUser.points} Pts
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500">মেম্বারশিপ (Membership)</span>
                    <p className="text-sm font-extrabold text-slate-900 uppercase mt-1">
                      {selectedDetailUser.membershipTier === 'premium'
                        ? '৳২৯৯ প্রিমিয়াম মেম্বার'
                        : 'ফ্রি মেম্বার'}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500">অ্যাকাউন্ট স্ট্যাটাস ও রোল</span>
                    <p className="text-sm font-extrabold text-slate-900 uppercase mt-1">
                      {selectedDetailUser.status} • {selectedDetailUser.role}
                    </p>
                  </div>
                </div>

                {/* Edit Permitted Profile Information */}
                <form
                  onSubmit={handleSaveUserProfileEdit}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-slate-900">
                      অনুমোদিত প্রোফাইল তথ্য সম্পাদনা (Edit Permitted Profile Info)
                    </h5>
                    {profileEditMsg && (
                      <span className="text-emerald-700 font-bold">{profileEditMsg}</span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">পূর্ণ নাম</label>
                      <input
                        type="text"
                        required
                        value={editFullName}
                        onChange={(e) => setEditFullName(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">মোবাইল নম্বর</label>
                      <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full h-9 rounded-lg bg-[#044E36] text-white font-bold cursor-pointer"
                      >
                        প্রোফাইল আপডেট সংরক্ষণ করুন
                      </button>
                    </div>
                  </div>
                </form>

                {/* Histories Grid: Referral history, Orders, Transactions, Withdrawal history, Activity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Orders & Referral History */}
                  <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                    <h5 className="font-bold text-slate-900">
                      মার্কেটপ্লেস অর্ডার ও রেফারেল ইতিহাস (Orders & Referrals)
                    </h5>
                    <p className="text-slate-600">
                      মোট সফল রেফারেল: <strong>{selectedDetailUser.referralCount} জন</strong> • রেফারেল কোড ব্যবহৃত: <strong>{selectedDetailUser.referredBy || 'নেই'}</strong>
                    </p>
                    <div className="space-y-1.5 pt-1 max-h-40 overflow-y-auto">
                      {orders.filter((o) => o.buyerId === selectedDetailUser.uid).length === 0 ? (
                        <p className="text-slate-400">কোনো অর্ডার পাওয়া যায়নি।</p>
                      ) : (
                        orders
                          .filter((o) => o.buyerId === selectedDetailUser.uid)
                          .map((o) => (
                            <div
                              key={o.id}
                              className="p-2 rounded-lg bg-slate-50 flex justify-between"
                            >
                              <span>
                                {o.productTitle} (x{o.quantity})
                              </span>
                              <span className="font-bold text-emerald-700">
                                ৳{o.totalPriceBdt} • {o.status}
                              </span>
                            </div>
                          ))
                      )}
                    </div>
                  </div>

                  {/* Transactions, Withdrawals & Activity */}
                  <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                    <h5 className="font-bold text-slate-900">
                      লেনদেন, উইথড্রয়াল ও অ্যাক্টিভিটি (Transactions & Withdrawals)
                    </h5>
                    <div className="space-y-1.5 max-h-44 overflow-y-auto">
                      {withdrawals
                        .filter((w) => w.userId === selectedDetailUser.uid)
                        .map((w) => (
                          <div
                            key={w.id}
                            className="p-2 rounded-lg bg-amber-50/70 border border-amber-200/60 flex justify-between"
                          >
                            <span>
                              উইথড্রয়াল ({w.method}: {w.accountNumber})
                            </span>
                            <span className="font-bold text-amber-800">
                              ৳{w.amountBdt} • {w.status}
                            </span>
                          </div>
                        ))}
                      {auditLogs
                        .filter((l) => l.userId === selectedDetailUser.uid)
                        .map((l) => (
                          <div
                            key={l.id}
                            className="p-2 rounded-lg bg-slate-50 flex justify-between"
                          >
                            <span>{l.reason}</span>
                            <span className="font-bold text-emerald-700">
                              {l.amountBdt >= 0 ? `+৳${l.amountBdt}` : `-৳${Math.abs(l.amountBdt)}`} ({l.pointsDelta} pts)
                            </span>
                          </div>
                        ))}
                      {withdrawals.filter((w) => w.userId === selectedDetailUser.uid).length === 0 &&
                        auditLogs.filter((l) => l.userId === selectedDetailUser.uid).length === 0 && (
                          <p className="text-slate-400">কোনো লেনদেন বা উইথড্রয়াল রেকর্ড নেই।</p>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION: WALLET MANAGEMENT */}
        {section === 'wallet' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form
              onSubmit={handleWalletSubmit}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4"
            >
              <h3 className="text-base font-bold text-slate-900">
                অ্যাডমিন ওয়ালেট ও পয়েন্ট সমন্বয় (Audit Logged)
              </h3>
              {walletFeedback && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium">
                  {walletFeedback}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ব্যবহারকারী নির্বাচন করুন
                </label>
                <select
                  value={selectedUserUid}
                  onChange={(e) => setSelectedUserUid(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  {users.map((u) => (
                    <option key={u.uid} value={u.uid}>
                      {u.fullName} ({u.phone}) — বর্তমান: ৳{u.walletBalance}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAdjType('add')}
                  className={`py-2 rounded-xl text-xs font-semibold border ${
                    adjType === 'add'
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  + ব্যালেন্স/পয়েন্ট যোগ করুন
                </button>
                <button
                  type="button"
                  onClick={() => setAdjType('deduct')}
                  className={`py-2 rounded-xl text-xs font-semibold border ${
                    adjType === 'deduct'
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  - ব্যালেন্স/পয়েন্ট কর্তন করুন
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    টাকার পরিমাণ (৳)
                  </label>
                  <input
                    type="number"
                    value={adjAmount}
                    onChange={(e) => setAdjAmount(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    পয়েন্ট সংখ্যা
                  </label>
                  <input
                    type="number"
                    value={adjPoints}
                    onChange={(e) => setAdjPoints(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs tabular-nums"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  সমন্বয়ের কারণ (অডিট লগের জন্য বাধ্যতামূলক)
                </label>
                <input
                  type="text"
                  required
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-[#044E36] hover:bg-[#033d2a] text-white text-xs font-semibold"
              >
                সমন্বয় নিশ্চিত করুন ও অডিট লগে সংরক্ষণ করুন
              </button>
            </form>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3">
              <h3 className="text-base font-bold text-slate-900">
                সাম্প্রতিক ওয়ালেট অডিট লগ (Audit Trail)
              </h3>
              <div className="space-y-2.5 max-h-80 overflow-y-auto">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1"
                  >
                    <div className="flex justify-between font-semibold">
                      <span>{log.userName}</span>
                      <span
                        className={`tabular-nums ${
                          log.amountBdt >= 0 ? 'text-emerald-700' : 'text-red-600'
                        }`}
                      >
                        {log.amountBdt >= 0 ? `+৳${log.amountBdt}` : `-৳${Math.abs(log.amountBdt)}`} ({log.pointsDelta >= 0 ? `+${log.pointsDelta}` : log.pointsDelta} pts)
                      </span>
                    </div>
                    <p className="text-slate-600">কারণ: {log.reason}</p>
                    <p className="text-[11px] text-slate-400 tabular-nums">
                      Admin: {log.adminId} · {log.createdAt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION: WITHDRAWALS */}
        {section === 'withdrawals' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-bold text-slate-900">উইথড্রয়াল রিকোয়েস্ট ব্যবস্থাপনা</h3>
              <div className="flex gap-1.5">
                {(['pending', 'approved', 'rejected', 'cancelled'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setWTab(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${
                      wTab === st
                        ? 'bg-[#044E36] text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {rejectingId && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-3">
                <h4 className="text-xs font-bold text-red-900">
                  উইথড্রয়াল বাতিলের কারণ উল্লেখ করুন (বাধ্যতামূলক)
                </h4>
                <input
                  type="text"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="যেমন: বিকাশ পার্সোনাল নম্বর সঠিক নয়..."
                  className="w-full h-10 px-3 rounded-xl border border-red-200 bg-white text-xs"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRejectingId(null);
                      setRejectionReason('');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold"
                  >
                    বাতিল
                  </button>
                  <button
                    type="button"
                    disabled={rejectionReason.trim().length < 3}
                    onClick={() => {
                      onProcessWithdrawal(rejectingId, 'rejected', rejectionReason.trim());
                      setRejectingId(null);
                      setRejectionReason('');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold disabled:opacity-50"
                  >
                    প্রত্যাখ্যান নিশ্চিত করুন
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2.5">
              {withdrawals.filter((w) => w.status === wTab).length === 0 ? (
                <p className="text-xs text-slate-500 py-4">এই ট্যাবে কোনো উইথড্রয়াল রিকোয়েস্ট নেই।</p>
              ) : (
                withdrawals
                  .filter((w) => w.status === wTab)
                  .map((w) => (
                    <div
                      key={w.id}
                      className="p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900">
                          {w.userName} — <span className="text-emerald-700 tabular-nums">৳{w.amountBdt}</span>
                        </p>
                        <p className="text-slate-600 tabular-nums">
                          মাধ্যম: {w.method} · অ্যাকাউন্ট: {w.accountNumber} · {w.createdAt}
                        </p>
                        {w.rejectionReason && (
                          <p className="text-red-600">প্রত্যাখ্যানের কারণ: {w.rejectionReason}</p>
                        )}
                      </div>
                      {w.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onProcessWithdrawal(w.id, 'approved')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-semibold flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectingId(w.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 font-semibold flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* SECTION: REFERRALS */}
        {section === 'referrals' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
                <span className="text-slate-500">মোট সফল রেফারেল (Referral Count)</span>
                <p className="text-2xl font-bold text-[#044E36] tabular-nums mt-1">
                  {totalReferralsCount}
                </p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
                <span className="text-slate-500">মোট রেফারেল রিওয়ার্ড (Rewards)</span>
                <p className="text-2xl font-bold text-amber-700 tabular-nums mt-1">
                  ৳{(totalReferralsCount * 50).toLocaleString('bn-BD')}
                </p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
                <span className="text-slate-500">সক্রিয় রেফারার (Top Referrers)</span>
                <p className="text-2xl font-bold text-emerald-700 tabular-nums mt-1">
                  {users.filter((u) => u.referralCount > 0).length} জন
                </p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
                <span className="text-slate-500">সন্দেহজনক রেফারেল (Suspicious)</span>
                <p className="text-2xl font-bold text-red-600 tabular-nums mt-1">
                  {
                    users.filter(
                      (u) =>
                        (u.status === 'banned' && u.referralCount > 0) ||
                        (u.referredBy && u.referredBy === u.referralCode)
                    ).length
                  }
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3">
                <h3 className="text-base font-bold text-slate-900">
                  টপ রেফারার তালিকা (Top Referrers & Rewards)
                </h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {[...users]
                    .sort((a, b) => b.referralCount - a.referralCount)
                    .map((u, idx) => (
                      <div
                        key={u.uid}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-900">
                            #{idx + 1} {u.fullName}
                          </p>
                          <p className="text-slate-500 tabular-nums">
                            রেফারেল কোড: <strong>{u.referralCode}</strong> · রোল: {u.role}
                          </p>
                        </div>
                        <div className="text-right tabular-nums">
                          <p className="font-bold text-emerald-700">
                            {u.referralCount} সফল রেফারেল
                          </p>
                          <p className="text-amber-700 font-semibold">
                            রিওয়ার্ড: ৳{u.referralCount * 50} + {u.referralCount * 25} Pts
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3">
                <h3 className="text-base font-bold text-slate-900">
                  রেফারেল ইতিহাস ও অ্যান্টি-ফ্রড মনিটরিং (Referral History & Suspicious)
                </h3>
                <p className="text-xs text-slate-600">
                  সেলফ-রেফারেল, ডুপ্লিকেট অ্যাকাউন্ট এবং ব্যানকৃত ইউজারের রেফারেল স্বয়ংক্রিয়ভাবে চিহ্নিত করা হয়।
                </p>
                <div className="space-y-2 max-h-72 overflow-y-auto text-xs">
                  {users
                    .filter((u) => u.referredBy || u.status === 'banned')
                    .map((u) => {
                      const isSuspicious =
                        u.status === 'banned' || u.referredBy === u.referralCode;
                      return (
                        <div
                          key={u.uid}
                          className={`p-3 rounded-xl border flex items-center justify-between ${
                            isSuspicious
                              ? 'bg-red-50/70 border-red-200'
                              : 'bg-emerald-50/50 border-emerald-200/70'
                          }`}
                        >
                          <div>
                            <p className="font-bold text-slate-900">{u.fullName}</p>
                            <p className="text-slate-500">
                              রেফারেল বাই: <strong>{u.referredBy || 'সরাসরি নিবন্ধন'}</strong>
                            </p>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              isSuspicious
                                ? 'bg-red-100 text-red-700'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isSuspicious ? 'সন্দেহজনক (Suspicious)' : 'ভেরিফায়েড'}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: MEMBERSHIP MANAGEMENT (299 BDT) */}
        {section === 'memberships' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
                <span className="text-slate-500">সক্রিয় প্রিমিয়াম মেম্বার (Active)</span>
                <p className="text-2xl font-bold text-emerald-700 tabular-nums mt-1">
                  {premiumMembersCount} জন
                </p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
                <span className="text-slate-500">মেয়াদোত্তীর্ণ / ফ্রি মেম্বার (Expired/Free)</span>
                <p className="text-2xl font-bold text-slate-700 tabular-nums mt-1">
                  {Math.max(0, totalUsersCount - premiumMembersCount)} জন
                </p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
                <span className="text-slate-500">মোট মেম্বারশিপ রেভিনিউ (৳২৯৯)</span>
                <p className="text-2xl font-bold text-amber-700 tabular-nums mt-1">
                  ৳{membershipRevenueBdt.toLocaleString('bn-BD')}
                </p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
                <span className="text-slate-500">যাচাইয়ের অপেক্ষায় পেমেন্ট (Pending)</span>
                <p className="text-2xl font-bold text-amber-600 tabular-nums mt-1">
                  {memberships.filter((m) => m.status === 'pending' || m.status === 'initiated').length}টি
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    ৳২৯৯ প্রিমিয়াম মেম্বারশিপ পেমেন্ট যাচাই ও হিস্ট্রি (Payment Verification)
                  </h3>
                  <p className="text-xs text-slate-500">
                    কোনো পেমেন্ট ট্রানজেকশন আইডি যাচাই ছাড়া স্বয়ংক্রিয়ভাবে সফল (Verified) করা হয় না
                  </p>
                </div>
                <div className="flex gap-1.5">
                  {(['all', 'pending', 'verified', 'failed'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setMTab(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer ${
                        mTab === tab
                          ? 'bg-[#044E36] text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                {memberships.filter((m) => mTab === 'all' || m.status === mTab).length === 0 ? (
                  <p className="text-slate-500 py-4">এই ফিল্টারে কোনো মেম্বারশিপ পেমেন্ট রেকর্ড নেই।</p>
                ) : (
                  memberships
                    .filter((m) => mTab === 'all' || m.status === mTab)
                    .map((m) => (
                      <div
                        key={m.id}
                        className="p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900">
                            {m.userName} — <span className="text-amber-700 font-extrabold">৳{m.amountBdt}</span>
                          </p>
                          <p className="text-slate-600 tabular-nums">
                            মাধ্যম: <strong>{m.paymentMethod}</strong> · TrxID: <strong>{m.transactionReference}</strong> · সময়: {m.createdAt}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                              m.status === 'verified'
                                ? 'bg-emerald-100 text-emerald-800'
                                : m.status === 'failed'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {m.status}
                          </span>
                          {(m.status === 'pending' || m.status === 'initiated') && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  onVerifyMembership(
                                    m.id,
                                    'verified',
                                    `TrxID ${m.transactionReference} যাচাইকৃত`
                                  )
                                }
                                className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Verify & Activate</span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  onVerifyMembership(
                                    m.id,
                                    'failed',
                                    `TrxID ${m.transactionReference} সঠিক নয়`
                                  )
                                }
                                className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECTION: MARKETPLACE & ORDERS MODERATION */}
        {section === 'marketplace' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                মার্কেটপ্লেস পণ্য অনুমোদন ও সেলার মডারেশন ({products.length}টি পণ্য)
              </h3>
              <div className="space-y-3">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{p.title}</p>
                      <p className="text-slate-500 tabular-nums">
                        সেলার: {p.sellerName} ({p.sellerPhone}) · মূল্য: ৳{p.priceBdt} · স্টক: {p.stock} · স্ট্যাটাস:{' '}
                        <strong className="uppercase">{p.status}</strong>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onModerateProduct(p.id, 'approved')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-semibold cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => onModerateProduct(p.id, 'rejected')}
                        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 font-semibold cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                মার্কেটপ্লেস অর্ডার ব্যবস্থাপনা ({orders.length}টি অর্ডার)
              </h3>
              {orders.length === 0 ? (
                <p className="text-xs text-slate-500">এখনো কোনো অর্ডার রেকর্ড নেই।</p>
              ) : (
                <div className="space-y-2.5 text-xs">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-bold text-slate-900">
                          {o.productTitle} (পরিমাণ: {o.quantity}) — <span className="text-emerald-700">৳{o.totalPriceBdt}</span>
                        </p>
                        <p className="text-slate-500">
                          ক্রেতা: {o.buyerName} ({o.buyerPhone}) · ঠিকানা: {o.deliveryAddress}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          aria-label={`Order ${o.id} status`}
                          value={o.status}
                          onChange={(e) =>
                            onUpdateOrderStatus(
                              o.id,
                              e.target.value as AdminOrderRecord['status']
                            )
                          }
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold capitalize"
                        >
                          <option value="placed">Placed</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION: CONTENT MANAGEMENT (IDEAS & CATEGORIES CRUD) */}
        {section === 'content' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  {editingIdeaId ? 'বিজনেস আইডিয়া সম্পাদনা করুন' : 'নতুন বিজনেস আইডিয়া যুক্ত করুন'}
                </h3>
                {editingIdeaId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingIdeaId(null);
                      setNewIdeaTitle('');
                      setNewIdeaDesc('');
                    }}
                    className="text-xs text-slate-500 hover:underline cursor-pointer"
                  >
                    বাতিল
                  </button>
                )}
              </div>
              <form onSubmit={handleAddIdeaSubmit} className="space-y-3 text-xs">
                <input
                  type="text"
                  required
                  value={newIdeaTitle}
                  onChange={(e) => setNewIdeaTitle(e.target.value)}
                  placeholder="ব্যবসার শিরোনাম (যেমন: মাশরুম চাষ ও প্রসেসিং)"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200"
                />
                <input
                  type="text"
                  value={newIdeaCategory}
                  onChange={(e) => setNewIdeaCategory(e.target.value)}
                  placeholder="ক্যাটাগরি"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newIdeaInvestment}
                    onChange={(e) => setNewIdeaInvestment(e.target.value)}
                    placeholder="প্রয়োজনীয় পুঁজি"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200"
                  />
                  <input
                    type="text"
                    value={newIdeaProfit}
                    onChange={(e) => setNewIdeaProfit(e.target.value)}
                    placeholder="সম্ভাব্য মাসিক লাভ"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200"
                  />
                </div>
                <textarea
                  rows={2}
                  value={newIdeaDesc}
                  onChange={(e) => setNewIdeaDesc(e.target.value)}
                  placeholder="সংক্ষিপ্ত বিবরণ..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
                <button
                  type="submit"
                  className="w-full h-10 rounded-xl bg-[#044E36] text-white font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{editingIdeaId ? 'পরিবর্তন সংরক্ষণ করুন' : 'আইডিয়া প্রকাশ করুন'}</span>
                </button>
              </form>

              <div className="pt-3 border-t border-slate-100 space-y-2 max-h-64 overflow-y-auto">
                {ideas.map((idea) => (
                  <div
                    key={idea.id}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 text-xs"
                  >
                    <div className="min-w-0">
                      <span className="font-semibold text-slate-800 block truncate">
                        {idea.title}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {idea.category} • {idea.isFeatured ? '★ Featured' : 'Standard'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onToggleIdeaFeatured(idea.id)}
                        className="text-amber-700 font-semibold hover:underline cursor-pointer"
                      >
                        {idea.isFeatured ? 'Unfeature' : 'Feature'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingIdeaId(idea.id);
                          setNewIdeaTitle(idea.title);
                          setNewIdeaCategory(idea.category);
                          setNewIdeaInvestment(idea.requiredInvestment);
                          setNewIdeaProfit(idea.estimatedProfit);
                          setNewIdeaDesc(idea.shortDescription);
                        }}
                        className="text-emerald-700 font-semibold hover:underline cursor-pointer"
                      >
                        সম্পাদনা
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteIdea(idea.id)}
                        className="text-red-600 hover:underline cursor-pointer"
                      >
                        মুছে ফেলুন
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    ক্যাটাগরি ও ইনভেস্টমেন্ট খাত ব্যবস্থাপনা ({categories.length}টি ক্যাটাগরি)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    ৩টি ইনভেস্টমেন্ট ব্যবসা ক্যাটাগরিসহ সকল ক্যাটাগরির ছবি, মুনাফার হার ও স্ট্যাটাস নিয়ন্ত্রণ করুন
                  </p>
                </div>
                {editingCatId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCatId(null);
                      setNewCatBn('');
                      setNewCatEn('');
                      setNewCatImageUrl('');
                    }}
                    className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                  >
                    সম্পাদনা বাতিল
                  </button>
                )}
              </div>

              {/* Dedicated 3 Investment Categories Admin Control Box */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#022C22] via-[#064E3B] to-[#042F24] text-white border border-[#D4AF37]/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#FDE68A] flex items-center gap-1.5">
                    💰 অ্যাডমিন ইনভেস্টমেন্ট ব্যবসা ক্যাটাগরি ({categories.filter((c) => c.group === 'investment').length}টি)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37] text-slate-950 font-extrabold">
                    অ্যাডমিন নিয়ন্ত্রিত
                  </span>
                </div>
                <div className="space-y-2">
                  {categories
                    .filter((c) => c.group === 'investment')
                    .map((invCat) => (
                      <div
                        key={invCat.id}
                        className="p-2.5 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between gap-2.5 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={invCat.imageUrl}
                            alt={invCat.nameBn}
                            onError={(e) => {
                              const t = e.currentTarget;
                              if (
                                invCat.fallbackImageUrl &&
                                t.src !== invCat.fallbackImageUrl
                              ) {
                                t.src = invCat.fallbackImageUrl;
                              }
                            }}
                            className="w-11 h-11 rounded-xl object-cover shrink-0 border border-[#D4AF37]/50"
                          />
                          <div className="min-w-0">
                            <div className="font-extrabold text-white truncate">
                              {invCat.nameBn}
                            </div>
                            <div className="text-[10px] text-[#FDE68A] truncate">
                              {invCat.expectedRoi || 'মাসিক ১২%–২০% মুনাফা'} • সর্বনিম্ন ৳
                              {(invCat.minInvestBdt || 3000).toLocaleString('bn-BD')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCatId(invCat.id);
                              setNewCatBn(invCat.nameBn);
                              setNewCatEn(invCat.nameEn);
                              setNewCatImageUrl(invCat.imageUrl || '');
                              setNewCatGroup(invCat.group);
                              setNewCatRoi(invCat.expectedRoi || 'মাসিক ১৫%–২০% মুনাফা');
                              setNewCatMinInvest(invCat.minInvestBdt || 5000);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#D4AF37] text-slate-950 text-[11px] font-extrabold cursor-pointer"
                          >
                            সম্পাদনা
                          </button>
                          <button
                            type="button"
                            onClick={() => onToggleCategory(invCat.id)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                              invCat.enabled
                                ? 'bg-emerald-400 text-slate-950'
                                : 'bg-rose-500 text-white'
                            }`}
                          >
                            {invCat.enabled ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* User Purchased Packages & Investments Verification & Profit Payout */}
              <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-950">
                    🛒 ইউজারদের কেনা প্যাকেজ/ইউনিট ও ইনভেস্টমেন্ট রিকোয়েস্ট ({investments.length}টি)
                  </span>
                  <span className="text-[10px] font-bold text-amber-800">
                    ১-ক্লিকে আসল + লাভ ওয়ালেটে পাঠান
                  </span>
                </div>

                {investments.length === 0 ? (
                  <p className="text-[11px] text-amber-900/80 py-2">
                    এখনো কোনো ইউজার প্যাকেজ বা ইনভেস্টমেন্ট অর্ডার জমা দেননি। ইউজার অ্যাপ থেকে কিনলেই এখানে দেখা যাবে।
                  </p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {investments.map((inv) => (
                      <div
                        key={inv.id}
                        className="p-2.5 rounded-xl bg-white border border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 truncate">
                            {inv.projectTitle}
                          </div>
                          <div className="text-[11px] text-slate-600">
                            ইউজার: <strong>{inv.userName}</strong> ({inv.userPhone}) • মাধ্যম: <strong>{inv.paymentMethod}</strong> (TrxID: {inv.transactionId})
                          </div>
                          <div className="text-[11px] font-extrabold text-[#064E3B] mt-0.5">
                            ক্রয়মূল্য: ৳{inv.amountBdt.toLocaleString('bn-BD')} • ইউজারের লাভ: +৳{inv.expectedMonthlyProfitBdt.toLocaleString('bn-BD')} • মোট প্রদেয়: ৳{(inv.amountBdt + inv.expectedMonthlyProfitBdt).toLocaleString('bn-BD')}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {inv.status === 'pending' && onManageInvestment && (
                            <>
                              <button
                                type="button"
                                onClick={() => onManageInvestment(inv.id, 'approve')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-[11px] font-bold cursor-pointer"
                              >
                                ✅ অনুমোদন
                              </button>
                              <button
                                type="button"
                                onClick={() => onManageInvestment(inv.id, 'reject')}
                                className="px-2 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-bold cursor-pointer"
                              >
                                বাতিল
                              </button>
                            </>
                          )}
                          {(inv.status === 'pending' || inv.status === 'active') &&
                            onManageInvestment && (
                              <button
                                type="button"
                                onClick={() => onManageInvestment(inv.id, 'pay_profit')}
                                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 text-[11px] font-extrabold shadow cursor-pointer"
                              >
                                💸 আসল+লাভ ওয়ালেটে দিন (৳{(inv.amountBdt + inv.expectedMonthlyProfitBdt).toLocaleString('bn-BD')})
                              </button>
                            )}
                          {inv.status === 'completed' && (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                              ✓ মুনাফা পরিশোধিত
                            </span>
                          )}
                          {inv.status === 'rejected' && (
                            <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold">
                              বাতিলকৃত
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Admin Investment & Package Payment Numbers Configuration */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-300 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-extrabold text-[#064E3B] block">
                      📲 ইনভেস্টমেন্ট ও প্যাকেজ পেমেন্ট নম্বর সেটিংস (যেখানে ইউজার টাকা পাঠাবে)
                    </span>
                    <span className="text-[10px] text-slate-600">
                      এখানে আপনার বিকাশ, নগদ, রকেট ও ব্যাংক অ্যাকাউন্ট নম্বর পরিবর্তন করলে ইউজার অ্যাপে তাৎক্ষণিক আপডেট হবে
                    </span>
                  </div>
                  {paySavedMsg && (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-[10px] font-bold">
                      ✓ {paySavedMsg}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-pink-700 block mb-0.5">
                      বিকাশ নম্বর (bKash Send Money)
                    </label>
                    <input
                      type="text"
                      value={payAccounts.bkashNumber}
                      onChange={(e) =>
                        setPayAccounts((prev) => ({
                          ...prev,
                          bkashNumber: e.target.value,
                        }))
                      }
                      className="w-full h-8 px-2.5 rounded-lg border border-pink-200 bg-white text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-amber-800 block mb-0.5">
                      নগদ নম্বর (Nagad Send Money)
                    </label>
                    <input
                      type="text"
                      value={payAccounts.nagadNumber}
                      onChange={(e) =>
                        setPayAccounts((prev) => ({
                          ...prev,
                          nagadNumber: e.target.value,
                        }))
                      }
                      className="w-full h-8 px-2.5 rounded-lg border border-amber-200 bg-white text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-purple-700 block mb-0.5">
                      রকেট নম্বর (Rocket Personal)
                    </label>
                    <input
                      type="text"
                      value={payAccounts.rocketNumber}
                      onChange={(e) =>
                        setPayAccounts((prev) => ({
                          ...prev,
                          rocketNumber: e.target.value,
                        }))
                      }
                      className="w-full h-8 px-2.5 rounded-lg border border-purple-200 bg-white text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={payAccounts.bankDetails}
                    onChange={(e) =>
                      setPayAccounts((prev) => ({
                        ...prev,
                        bankDetails: e.target.value,
                      }))
                    }
                    placeholder="ব্যাংক অ্যাকাউন্ট তথ্য"
                    className="flex-1 h-8 px-2.5 rounded-lg border border-emerald-200 bg-white text-xs text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      savePaymentGatewayAccounts(payAccounts);
                      setPaySavedMsg('পেমেন্ট নম্বর সংরক্ষিত হয়েছে!');
                      setTimeout(() => setPaySavedMsg(null), 3000);
                    }}
                    className="px-4 h-8 rounded-lg bg-[#064E3B] text-white text-xs font-extrabold cursor-pointer shrink-0"
                  >
                    পেমেন্ট নম্বর সেভ করুন
                  </button>
                </div>
              </div>

              {/* Add / Edit Category Form with Image & Investment Options */}
              <div className="space-y-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="text-xs font-bold text-slate-800">
                  {editingCatId
                    ? 'ক্যাটাগরি ও ছবি সম্পাদনা করুন'
                    : 'নতুন ক্যাটাগরি / ইনভেস্টমেন্ট খাত যোগ করুন'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newCatBn}
                    onChange={(e) => setNewCatBn(e.target.value)}
                    placeholder="বাংলা নাম (যেমন: হালাল প্রফিট শেয়ারিং)"
                    className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs"
                  />
                  <input
                    type="text"
                    value={newCatEn}
                    onChange={(e) => setNewCatEn(e.target.value)}
                    placeholder="English Name"
                    className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newCatImageUrl}
                    onChange={(e) => setNewCatImageUrl(e.target.value)}
                    placeholder="ক্যাটাগরি ছবির লিংক (Image URL - ঐচ্ছিক)"
                    className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs"
                  />
                  <select
                    value={newCatGroup}
                    onChange={(e) => setNewCatGroup(e.target.value as any)}
                    className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800"
                  >
                    <option value="investment">💰 ইনভেস্টমেন্ট করে ব্যবসা (Investment)</option>
                    <option value="popular">জনপ্রিয় খাত (Popular)</option>
                    <option value="new">আধুনিক ও ডিজিটাল (New)</option>
                    <option value="special">বিশেষ খাত (Special)</option>
                    <option value="existing">প্রচলিত ব্যবসা (Existing)</option>
                  </select>
                </div>
                {newCatGroup === 'investment' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newCatRoi}
                      onChange={(e) => setNewCatRoi(e.target.value)}
                      placeholder="সম্ভাব্য মুনাফা (যেমন: মাসিক ১৫%–২০% মুনাফা)"
                      className="h-9 px-3 rounded-xl border border-amber-300 bg-amber-50/50 text-xs"
                    />
                    <input
                      type="number"
                      value={newCatMinInvest}
                      onChange={(e) => setNewCatMinInvest(Number(e.target.value) || 3000)}
                      placeholder="সর্বনিম্ন বিনিয়োগ (৳)"
                      className="h-9 px-3 rounded-xl border border-amber-300 bg-amber-50/50 text-xs"
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (!newCatBn.trim()) return;
                    const existingCat = editingCatId
                      ? categories.find((c) => c.id === editingCatId)
                      : undefined;
                    const fallbackImg =
                      existingCat?.fallbackImageUrl || ASSETS.spiceIdeaImg;
                    const finalImg =
                      newCatImageUrl.trim() ||
                      existingCat?.imageUrl ||
                      ASSETS.spiceIdeaImg;
                    onAddCategory({
                      id: existingCat ? existingCat.id : `cat-${Date.now()}`,
                      nameBn: newCatBn.trim(),
                      nameEn: newCatEn.trim() || 'Business & Investment',
                      iconName:
                        existingCat?.iconName ||
                        (newCatGroup === 'investment' ? 'Award' : 'Store'),
                      imageUrl: finalImg,
                      fallbackImageUrl: fallbackImg,
                      group: newCatGroup,
                      ideaCount: existingCat?.ideaCount || 6,
                      enabled: existingCat ? existingCat.enabled : true,
                      order: existingCat
                        ? existingCat.order
                        : categories.length + 1,
                      ...(newCatGroup === 'investment'
                        ? {
                            expectedRoi: newCatRoi.trim() || 'মাসিক ১৫%–২০% মুনাফা',
                            minInvestBdt: Number(newCatMinInvest) || 5000,
                            shortDesc:
                              existingCat?.shortDesc ||
                              `${newCatBn.trim()} খাতে সরাসরি বিনিয়োগ করে মাসিক হালাল প্রফিট শেয়ারিং।`,
                          }
                        : {}),
                    });
                    setEditingCatId(null);
                    setNewCatBn('');
                    setNewCatEn('');
                    setNewCatImageUrl('');
                  }}
                  className="w-full h-9 rounded-xl bg-[#044E36] text-white text-xs font-bold cursor-pointer"
                >
                  {editingCatId
                    ? 'ক্যাটাগরি পরিবর্তন সংরক্ষণ করুন'
                    : '+ নতুন ক্যাটাগরি যোগ করুন'}
                </button>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`flex items-center justify-between gap-2.5 p-2.5 rounded-xl border text-xs ${
                      cat.group === 'investment'
                        ? 'bg-amber-50/70 border-amber-300'
                        : 'bg-slate-50 border-slate-200/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={cat.imageUrl || ASSETS.spiceIdeaImg}
                        alt={cat.nameBn}
                        onError={(e) => {
                          const t = e.currentTarget;
                          if (
                            cat.fallbackImageUrl &&
                            t.src !== cat.fallbackImageUrl
                          ) {
                            t.src = cat.fallbackImageUrl;
                          }
                        }}
                        className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 truncate">
                            {cat.nameBn}
                          </span>
                          {cat.group === 'investment' && (
                            <span className="px-1.5 py-0.5 rounded bg-[#D4AF37] text-slate-950 text-[9px] font-extrabold shrink-0">
                              ইনভেস্টমেন্ট
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {cat.nameEn} • {cat.ideaCount}টি আইডিয়া
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCatId(cat.id);
                          setNewCatBn(cat.nameBn);
                          setNewCatEn(cat.nameEn);
                          setNewCatImageUrl(cat.imageUrl || '');
                          setNewCatGroup(cat.group);
                          setNewCatRoi(cat.expectedRoi || 'মাসিক ১৫%–২০% মুনাফা');
                          setNewCatMinInvest(cat.minInvestBdt || 5000);
                        }}
                        className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-emerald-800 font-bold text-[11px] hover:bg-emerald-50 cursor-pointer"
                      >
                        সম্পাদনা
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleCategory(cat.id)}
                        className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer ${
                          cat.enabled
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {cat.enabled ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION: NOTICES */}
        {section === 'notices' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              নোটিশ ও পুশ অ্যানাউন্সমেন্ট সিস্টেম
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <input
                type="text"
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                placeholder="নোটিশের শিরোনাম"
                className="h-10 px-3 rounded-xl border border-slate-200"
              />
              <input
                type="text"
                value={noticeMsg}
                onChange={(e) => setNoticeMsg(e.target.value)}
                placeholder="বিস্তারিত বার্তা..."
                className="h-10 px-3 rounded-xl border border-slate-200"
              />
              <div className="flex gap-2">
                <select
                  value={noticeTarget}
                  onChange={(e) =>
                    setNoticeTarget(e.target.value as 'all' | 'premium' | 'selected')
                  }
                  className="h-10 px-3 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="all">সকল ব্যবহারকারী</option>
                  <option value="premium">প্রিমিয়াম মেম্বার</option>
                  <option value="selected">নির্বাচিত উদ্যোক্তা</option>
                </select>
                <button
                  type="button"
                  onClick={() => {
                    if (!noticeTitle.trim() || !noticeMsg.trim()) return;
                    onAddNotice({
                      title: noticeTitle.trim(),
                      message: noticeMsg.trim(),
                      targetAudience: noticeTarget,
                      published: true,
                    });
                    setNoticeTitle('');
                    setNoticeMsg('');
                  }}
                  className="px-4 h-10 rounded-xl bg-[#044E36] text-white font-semibold cursor-pointer"
                >
                  প্রকাশ করুন
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {notices.map((n) => (
                <div
                  key={n.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900">
                      {n.title} <span className="text-emerald-700">({n.targetAudience})</span>
                    </p>
                    <p className="text-slate-600">{n.message}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteNotice(n.id)}
                    className="text-red-600 hover:underline cursor-pointer"
                  >
                    মুছে ফেলুন
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: REPORTS, AUDIT LOGS & ROLES */}
        {(section === 'reports' || section === 'roles') && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                রোল-ভিত্তিক অ্যাক্সেস কন্ট্রোল (RBAC) ও অ্যাডমিন সিকিউরিটি ম্যাট্রিক্স
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <p className="font-bold text-emerald-950">Super Admin</p>
                  <p className="text-emerald-800 mt-1">
                    পূর্ণ নিয়ন্ত্রণ: ওয়ালেট, রোল পরিবর্তন, ডাটাবেস রুলস এবং সকল মডিউল।
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="font-bold text-slate-900">Admin</p>
                  <p className="text-slate-600 mt-1">
                    ব্যবহারকারী, বিজনেস আইডিয়া, মার্কেটপ্লেস ও উইথড্রয়াল অনুমোদন।
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="font-bold text-slate-900">Moderator</p>
                  <p className="text-slate-600 mt-1">
                    কনটেন্ট যাচাই, সেলার পণ্য অনুমোদন ও রিপোর্ট রিভিউ।
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="font-bold text-slate-900">Support</p>
                  <p className="text-slate-600 mt-1">
                    উদ্যোক্তা সহায়তা ও টিকিট সমাধান।
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3">
              <h3 className="text-base font-bold text-slate-900">
                অপরিবর্তনীয় অ্যাডমিন অডিট লগ (Immutable Firestore Audit Logs)
              </h3>
              {adminSecurityLogs.length === 0 ? (
                <p className="text-xs text-slate-500">এখনো কোনো সিস্টেম অডিট লগ তৈরি হয়নি।</p>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto text-xs">
                  {adminSecurityLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2"
                    >
                      <div>
                        <p className="font-bold text-slate-900">
                          {log.action} — <span className="text-[#044E36]">{log.target}</span>
                        </p>
                        <p className="text-slate-600">
                          পরিবর্তন: {log.previousValue} → <strong>{log.newValue}</strong> · কারণ: {log.reason}
                        </p>
                      </div>
                      <div className="text-right text-[11px] text-slate-400">
                        <div>{log.adminEmail}</div>
                        <div>{log.createdAt}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION: ANDROID STUDIO KOTLIN PROJECT & SEPARATE APK/AAB BUILD SYSTEM */}
        {section === 'android_apk' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. USER APP BUILD CARD */}
              <div className="bg-white rounded-2xl border border-emerald-200 p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-[#044E36] text-[11px] font-extrabold">
                    1. USER APPLICATION (PLAY STORE READY)
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    alpo.pujir.bebsha
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  অল্প পুঁজির ব্যবসা (User App)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  শুধুমাত্র সাধারণ গ্রাহক ও উদ্যোক্তাদের জন্য। এতে শুধু User Panel ফিচার রয়েছে — কোনো Admin Panel বা অ্যাডমিন রাউট যুক্ত নেই।
                </p>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700 space-y-1">
                  <div>• Web Build: npm run build:user (dist/user)</div>
                  <div>• Play Store AAB: ./gradlew :user-app:bundleRelease</div>
                  <div>• Production APK: ./gradlew :user-app:assembleRelease</div>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadUserAppBundle}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#044E36] hover:bg-[#033d2a] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>ইউজার অ্যাপ ZIP ফাইল ডাউনলোড (Alpo_Pujir_Bebsha_User_App.zip)</span>
                </button>
              </div>

              {/* 2. ADMIN APP BUILD CARD */}
              <div className="bg-white rounded-2xl border border-amber-300 p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-extrabold">
                    2. ADMIN APPLICATION (PRIVATE BUILD)
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    alpo.pujir.bebsha.admin
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  অল্প পুঁজির ব্যবসা Admin (Admin App)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  শুধুমাত্র অনুমোদিত অ্যাডমিনদের জন্য সম্পূর্ণ আলাদা অ্যাপ। Firebase Auth + Firestore রোল ভেরিফিকেশন ছাড়া কেউ প্রবেশ করতে পারবে না।
                </p>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700 space-y-1">
                  <div>• Web Build: npm run build:admin (dist/admin)</div>
                  <div>• Private Admin APK: ./gradlew :admin-app:assembleRelease</div>
                  <div>• Private Admin AAB: ./gradlew :admin-app:bundleRelease</div>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadAdminAppBundle}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>অ্যাডমিন অ্যাপ ZIP ফাইল ডাউনলোড (Alpo_Pujir_Bebsha_Admin_App.zip)</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Dual-App Gradle & Kotlin Source Inspector (`:user-app` & `:admin-app`)
                  </h3>
                  <p className="text-xs text-slate-500">
                    দুইটি আলাদা অ্যাপ্লিকেশনের Gradle বিল্ড ফাইল, Manifest এবং Firebase সিকিউরিটি গার্ড কোড
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadAndroidBundle}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Combined Multi-Module Bundle</span>
                </button>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {Object.keys(ANDROID_KOTLIN_FILES).map((fileKey) => (
                  <button
                    key={fileKey}
                    type="button"
                    onClick={() => setSelectedKotlinFile(fileKey)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap cursor-pointer ${
                      selectedKotlinFile === fileKey
                        ? 'bg-emerald-900 text-amber-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {fileKey}
                  </button>
                ))}
              </div>

              <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-300 text-xs font-mono overflow-x-auto max-h-96 leading-relaxed">
                {ANDROID_KOTLIN_FILES[selectedKotlinFile]}
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
