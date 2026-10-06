import React, { useState } from 'react';
import {
  Users,
  Wallet,
  Crown,
  Share2,
  Package,
  ArrowDownToLine,
  FileBarChart,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Edit3,
  X,
  TrendingUp,
} from 'lucide-react';
import {
  CategoryItem,
  BusinessIdeaItem,
  MarketplaceProductItem,
} from '../data/seedData';
import {
  BuyerOrderRecord,
  MembershipRequestRecord,
} from './MarketplaceAndWalletViews';
import {
  AdminUserRecord,
  WithdrawalRecord,
  WalletAuditRecord,
} from './AdminPanelView';
import { AdminAuditLogEntry } from '../services/adminFirestoreService';

// ============================================================================
// 1. USER DETAILS & WALLET / PROFILE MANAGEMENT MODAL
// ============================================================================
interface AdminUserDetailsModalProps {
  user: AdminUserRecord;
  allUsers: AdminUserRecord[];
  orders: BuyerOrderRecord[];
  withdrawals: WithdrawalRecord[];
  transactions: WalletAuditRecord[];
  memberships: MembershipRequestRecord[];
  auditLogs: AdminAuditLogEntry[];
  onClose: () => void;
  onSaveProfile: (
    uid: string,
    fullName: string,
    phone: string,
    role: AdminUserRecord['role'],
    membershipTier: 'free' | 'premium',
    reason: string
  ) => Promise<void>;
  onAdjustWallet: (
    uid: string,
    amountDelta: number,
    pointsDelta: number,
    reason: string
  ) => Promise<void>;
  onToggleBan: (uid: string, reason: string) => Promise<void>;
}

export const AdminUserDetailsModal: React.FC<AdminUserDetailsModalProps> = ({
  user,
  allUsers,
  orders,
  withdrawals,
  transactions,
  memberships,
  auditLogs,
  onClose,
  onSaveProfile,
  onAdjustWallet,
  onToggleBan,
}) => {
  const [subTab, setSubTab] = useState<
    'overview' | 'wallet' | 'orders' | 'referrals' | 'activity'
  >('overview');

  // Edit profile state
  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone);
  const [role, setRole] = useState<AdminUserRecord['role']>(user.role);
  const [tier, setTier] = useState<'free' | 'premium'>(user.membershipTier);
  const [editReason, setEditReason] = useState('');

  // Wallet adjustment state
  const [amountDelta, setAmountDelta] = useState('0');
  const [pointsDelta, setPointsDelta] = useState('0');
  const [walletReason, setWalletReason] = useState('');
  const [banReason, setBanReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const userOrders = orders.filter((o) => o.buyerId === user.uid);
  const userWithdrawals = withdrawals.filter((w) => w.userId === user.uid);
  const userTx = transactions.filter((t) => t.userId === user.uid);
  const userMem = memberships.filter((m) => m.userId === user.uid);
  const referredUsers = allUsers.filter(
    (u) =>
      u.referredBy &&
      u.referredBy.toUpperCase() === user.referralCode.toUpperCase()
  );
  const userLogs = auditLogs.filter((l) => l.target.includes(user.uid));

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editReason.trim()) {
      setFeedback('প্রোফাইল বা রোল পরিবর্তনের কারণ (Reason) লিখুন।');
      return;
    }
    setBusy(true);
    setFeedback(null);
    try {
      await onSaveProfile(
        user.uid,
        fullName.trim(),
        phone.trim(),
        role,
        tier,
        editReason.trim()
      );
      setEditReason('');
      setFeedback('ইউজার প্রোফাইল ও রোল সফলভাবে আপডেট ও অডিট লগে রেকর্ড হয়েছে!');
    } catch (err: any) {
      setFeedback(err?.message || 'আপডেট ব্যর্থ হয়েছে।');
    } finally {
      setBusy(false);
    }
  };

  const handleWalletSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(amountDelta) || 0;
    const pts = Number(pointsDelta) || 0;
    if (amt === 0 && pts === 0) {
      setFeedback('ব্যালেন্স অথবা পয়েন্টের পরিমাণ লিখুন।');
      return;
    }
    if (!walletReason.trim() || walletReason.trim().length < 3) {
      setFeedback('ব্যালেন্স/পয়েন্ট পরিবর্তনের কারণ (Reason) উল্লেখ করা বাধ্যতামূলক।');
      return;
    }
    setBusy(true);
    setFeedback(null);
    try {
      await onAdjustWallet(user.uid, amt, pts, walletReason.trim());
      setAmountDelta('0');
      setPointsDelta('0');
      setWalletReason('');
      setFeedback('অ্যাটমিক ট্রানজেকশনের মাধ্যমে ওয়ালেট ও পয়েন্টস সমন্বয় সম্পন্ন হয়েছে!');
    } catch (err: any) {
      setFeedback(err?.message || 'ওয়ালেট সমন্বয় ব্যর্থ হয়েছে।');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-emerald-900/15">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#042F24] via-[#064E3B] to-[#047857] p-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold">{user.fullName}</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-slate-950 text-[10px] font-extrabold uppercase">
                {user.role}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  user.status === 'active'
                    ? 'bg-emerald-400/20 text-emerald-200'
                    : 'bg-rose-500 text-white'
                }`}
              >
                {user.status}
              </span>
            </div>
            <p className="text-xs text-emerald-100/80 mt-0.5">
              UID: {user.uid} • ইমেইল: {user.email} • রেজিস্ট্রেশন:{' '}
              {user.createdAtLabel || 'নিবন্ধিত সদস্য'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-navigation */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-100 border-b border-slate-200 overflow-x-auto">
          {[
            { id: 'overview', label: 'প্রোফাইল ও এডিট' },
            { id: 'wallet', label: `ওয়ালেট (৳${user.walletBalance}) ও পয়েন্টস` },
            { id: 'orders', label: `অর্ডার (${userOrders.length}) ও উইথড্রয়াল` },
            { id: 'referrals', label: `রেফারেল (${referredUsers.length})` },
            { id: 'activity', label: `অ্যাক্টিভিটি ও অডিট (${userLogs.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSubTab(t.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                subTab === t.id
                  ? 'bg-[#064E3B] text-white'
                  : 'text-slate-600 hover:bg-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {feedback && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
              {feedback}
            </div>
          )}

          {subTab === 'overview' && (
            <div className="space-y-4">
              <form
                onSubmit={handleProfileSubmit}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
              >
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4 text-[#059669]" /> প্রোফাইল, রোল ও
                  মেম্বারশিপ সম্পাদনা
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      পূর্ণ নাম
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      মোবাইল নম্বর
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      অ্যাক্সেস রোল (Admin/User Role)
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                    >
                      <option value="user">User (সাধারণ উদ্যোক্তা)</option>
                      <option value="seller">Seller (মার্কেটপ্লেস বিক্রেতা)</option>
                      <option value="support">Support (সাপোর্ট টিম)</option>
                      <option value="moderator">Moderator (মডারেটর)</option>
                      <option value="admin">Admin (অ্যাডমিন)</option>
                      <option value="super_admin">Super Admin (সুপার অ্যাডমিন)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      মেম্বারশিপ টিয়ার (৳২৯৯)
                    </label>
                    <select
                      value={tier}
                      onChange={(e) => setTier(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                    >
                      <option value="free">Free (সাধারণ)</option>
                      <option value="premium">Premium (৳২৯৯ প্রিমিয়াম)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    পরিবর্তনের কারণ (Audit Log Reason) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editReason}
                    onChange={(e) => setEditReason(e.target.value)}
                    placeholder="যেমন: ইউজারের অনুরোধে তথ্য ও রোল হালনাগাদ"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="px-4 py-2 rounded-xl bg-[#064E3B] text-white text-xs font-bold cursor-pointer"
                >
                  প্রোফাইল আপডেট সংরক্ষণ করুন
                </button>
              </form>

              {/* Ban / Unban Card */}
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2.5">
                <h4 className="text-xs font-bold text-rose-900">
                  অ্যাকাউন্ট ব্যান / আনব্যান কন্ট্রোল
                </h4>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    placeholder="ব্যান বা আনব্যান করার কারণ লিখুন..."
                    className="flex-1 px-3 py-2 rounded-xl border border-rose-200 bg-white text-xs"
                  />
                  <button
                    type="button"
                    disabled={busy}
                    onClick={async () => {
                      if (!banReason.trim()) {
                        setFeedback('ব্যান/আনব্যান করার কারণ লিখুন।');
                        return;
                      }
                      setBusy(true);
                      await onToggleBan(user.uid, banReason.trim());
                      setBanReason('');
                      setBusy(false);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold text-white cursor-pointer ${
                      user.status === 'active'
                        ? 'bg-rose-600 hover:bg-rose-700'
                        : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    {user.status === 'active'
                      ? 'ইউজার ব্যান (Ban) করুন'
                      : 'ইউজার আনব্যান (Unban) করুন'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {subTab === 'wallet' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-xs text-slate-500 block">
                    বর্তমান ওয়ালেট ব্যালেন্স
                  </span>
                  <span className="text-2xl font-extrabold text-[#064E3B]">
                    ৳{user.walletBalance}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-xs text-slate-500 block">
                    বর্তমান রিওয়ার্ড পয়েন্টস
                  </span>
                  <span className="text-2xl font-extrabold text-amber-800">
                    {user.points} Pts
                  </span>
                </div>
              </div>

              <form
                onSubmit={handleWalletSubmit}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
              >
                <h4 className="text-sm font-bold text-slate-900">
                  ব্যালেন্স ও পয়েন্ট যোগ/কর্তন (Atomic Firestore Transaction)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      টাকা যোগ (+) বা কর্তন (-) [যেমন: 100 বা -50]
                    </label>
                    <input
                      type="number"
                      value={amountDelta}
                      onChange={(e) => setAmountDelta(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      পয়েন্ট যোগ (+) বা কর্তন (-) [যেমন: 50 বা -25]
                    </label>
                    <input
                      type="number"
                      value={pointsDelta}
                      onChange={(e) => setPointsDelta(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    সমন্বয়ের বাধ্যতামূলক কারণ (Mandatory Audit Reason) *
                  </label>
                  <input
                    type="text"
                    required
                    value={walletReason}
                    onChange={(e) => setWalletReason(e.target.value)}
                    placeholder="যেমন: ম্যানুয়াল প্রমোশনাল বোনাস বা রিফান্ড সমন্বয়"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="px-5 py-2.5 rounded-xl bg-[#064E3B] text-white text-xs font-bold cursor-pointer"
                >
                  ওয়ালেট ও পয়েন্টস আপডেট করুন
                </button>
              </form>

              {/* User Wallet Transactions */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-700">
                  ইউজারের ট্রানজেকশন হিস্ট্রি ({userTx.length})
                </h5>
                {userTx.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">
                        {t.reason}
                      </span>
                      <span className="block text-[10px] text-slate-500">
                        {t.createdAt}
                      </span>
                    </div>
                    <span className="font-bold text-[#064E3B]">
                      ৳{t.amountBdt} / {t.pointsDelta} Pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {subTab === 'orders' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-2">
                  মার্কেটপ্লেস অর্ডারসমূহ ({userOrders.length})
                </h4>
                {userOrders.length === 0 ? (
                  <p className="text-xs text-slate-400">কোনো অর্ডার নেই।</p>
                ) : (
                  userOrders.map((o) => (
                    <div
                      key={o.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs mb-2"
                    >
                      <span>
                        <strong>{o.productTitle}</strong> ({o.quantity}টি)
                      </span>
                      <span className="font-bold text-[#064E3B]">
                        ৳{o.totalPriceBdt} • {o.status}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-2">
                  উইথড্রয়াল হিস্ট্রি ({userWithdrawals.length})
                </h4>
                {userWithdrawals.map((w) => (
                  <div
                    key={w.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs mb-2"
                  >
                    <span>
                      {w.method} ({w.accountNumber})
                    </span>
                    <span className="font-bold">
                      ৳{w.amountBdt} • {w.status}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-2">
                  মেম্বারশিপ পেমেন্ট হিস্ট্রি ({userMem.length})
                </h4>
                {userMem.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs mb-2"
                  >
                    <span>
                      {m.paymentMethod} • TrxID: {m.transactionReference}
                    </span>
                    <span className="font-bold">
                      ৳{m.amountBdt} • {m.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {subTab === 'referrals' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                <p>
                  ইউজারের নিজস্ব রেফারেল কোড:{' '}
                  <strong className="font-mono">{user.referralCode}</strong>
                </p>
                <p className="mt-1">
                  কার মাধ্যমে যুক্ত হয়েছেন (Referred By):{' '}
                  <strong>{user.referredBy || 'সরাসরি নিবন্ধিত'}</strong>
                </p>
              </div>
              <h4 className="text-xs font-bold text-slate-700">
                এই ইউজারের রেফার করা সদস্যবৃন্দ ({referredUsers.length})
              </h4>
              {referredUsers.map((ru) => (
                <div
                  key={ru.uid}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <span>
                    {ru.fullName} ({ru.email})
                  </span>
                  <span className="font-bold text-[#064E3B]">
                    {ru.membershipTier}
                  </span>
                </div>
              ))}
            </div>
          )}

          {subTab === 'activity' && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700">
                এই ইউজারের ওপর অ্যাডমিন অডিট লগ ({userLogs.length})
              </h4>
              {userLogs.length === 0 ? (
                <p className="text-xs text-slate-400">কোনো অডিট লগ নেই।</p>
              ) : (
                userLogs.map((l) => (
                  <div
                    key={l.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-[#064E3B]">{l.action}</span>
                      <span className="text-slate-400 text-[10px]">
                        {l.createdAt}
                      </span>
                    </div>
                    <p className="text-slate-600">
                      পূর্বের মান: {l.previousValue} → নতুন মান: {l.newValue}
                    </p>
                    <p className="text-amber-800 font-medium">
                      কারণ: {l.reason} (Admin: {l.adminEmail})
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. REFERRAL MANAGEMENT TAB
// ============================================================================
export const AdminReferralsTab: React.FC<{
  users: AdminUserRecord[];
  transactions: WalletAuditRecord[];
}> = ({ users, transactions }) => {
  const referredUsers = users.filter(
    (u) => u.referredBy && u.referredBy.trim().length > 0
  );
  const referralTransactions = transactions.filter(
    (t) => t.type === 'referral'
  );
  const totalRewardsPaid = referralTransactions.reduce(
    (sum, t) => sum + (Number(t.amountBdt) || 0),
    0
  );

  // Compute top referrers dynamically from Firestore users
  const referrerCounts: Record<string, number> = {};
  referredUsers.forEach((u) => {
    const code = (u.referredBy || '').toUpperCase();
    referrerCounts[code] = (referrerCounts[code] || 0) + 1;
  });

  const topReferrers = users
    .map((u) => ({
      ...u,
      dynamicRefCount:
        referrerCounts[u.referralCode.toUpperCase()] || u.referralCount || 0,
    }))
    .filter((u) => u.dynamicRefCount > 0)
    .sort((a, b) => b.dynamicRefCount - a.dynamicRefCount);

  // Detect suspicious referrals (e.g. self-referral code or invalid code)
  const suspiciousReferrals = referredUsers.filter(
    (u) =>
      u.referredBy?.toUpperCase() === u.referralCode.toUpperCase() ||
      !users.some(
        (ref) =>
          ref.referralCode.toUpperCase() === u.referredBy?.toUpperCase()
      )
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <span className="text-xs text-slate-500">মোট রেফারেল সাইনআপ</span>
          <div className="text-2xl font-extrabold text-[#064E3B] mt-1">
            {referredUsers.length}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <span className="text-xs text-slate-500">সক্রিয় রেফারার</span>
          <div className="text-2xl font-extrabold text-amber-700 mt-1">
            {topReferrers.length}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <span className="text-xs text-slate-500">প্রদত্ত রেফারেল বোনাস</span>
          <div className="text-2xl font-extrabold text-[#059669] mt-1">
            ৳{totalRewardsPaid}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-rose-200">
          <span className="text-xs text-rose-600">সন্দেহজনক রেফারেল</span>
          <div className="text-2xl font-extrabold text-rose-700 mt-1">
            {suspiciousReferrals.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Referrers Leaderboard */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">
            শীর্ষ রেফারার তালিকা (Top Referrers)
          </h3>
          {topReferrers.length === 0 ? (
            <p className="text-xs text-slate-400">এখনো কোনো রেফারার নেই।</p>
          ) : (
            topReferrers.map((r, i) => (
              <div
                key={r.uid}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900">
                    #{i + 1} {r.fullName}
                  </span>
                  <span className="block text-[11px] text-slate-500 font-mono">
                    কোড: {r.referralCode}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#064E3B] font-extrabold">
                  {r.dynamicRefCount} রেফারেল
                </span>
              </div>
            ))
          )}
        </div>

        {/* Suspicious Referrals & History */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> রেফারেল হিস্ট্রি
            ও সন্দেহজনক ফ্ল্যাগ
          </h3>
          {referredUsers.length === 0 ? (
            <p className="text-xs text-slate-400">কোনো রেফারেল রেকর্ড নেই।</p>
          ) : (
            referredUsers.map((u) => {
              const isSuspicious = suspiciousReferrals.some(
                (s) => s.uid === u.uid
              );
              return (
                <div
                  key={u.uid}
                  className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                    isSuspicious
                      ? 'bg-rose-50 border-rose-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <span className="font-bold text-slate-900">
                      {u.fullName} ({u.email})
                    </span>
                    <span className="block text-[11px] text-slate-500">
                      ব্যবহৃত কোড: <strong>{u.referredBy}</strong>
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isSuspicious
                        ? 'bg-rose-200 text-rose-900'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isSuspicious ? 'অবৈধ/সন্দেহজনক কোড' : 'ভেরিফায়েড'}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. MEMBERSHIP MANAGEMENT (৳299) TAB
// ============================================================================
export const AdminMembershipsTab: React.FC<{
  users: AdminUserRecord[];
  memberships: MembershipRequestRecord[];
  onVerifyMembership: (
    membershipId: string,
    decision: 'verified' | 'failed',
    reason: string
  ) => Promise<void>;
}> = ({ users, memberships, onVerifyMembership }) => {
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  const activePremiumUsers = users.filter(
    (u) => u.membershipTier === 'premium'
  );
  const freeOrExpiredUsers = users.filter((u) => u.membershipTier === 'free');
  const verifiedPayments = memberships.filter((m) => m.status === 'verified');
  const totalRevenue =
    verifiedPayments.length * 299 || activePremiumUsers.length * 299;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <span className="text-xs text-slate-500">সক্রিয় প্রিমিয়াম সদস্য</span>
          <div className="text-2xl font-extrabold text-[#064E3B] mt-1">
            {activePremiumUsers.length}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <span className="text-xs text-slate-500">সাধারণ / মেয়াদোত্তীর্ণ</span>
          <div className="text-2xl font-extrabold text-slate-700 mt-1">
            {freeOrExpiredUsers.length}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <span className="text-xs text-slate-500">মোট মেম্বারশিপ রেভিনিউ</span>
          <div className="text-2xl font-extrabold text-amber-700 mt-1">
            ৳{totalRevenue.toLocaleString('bn-BD')}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-amber-200">
          <span className="text-xs text-amber-800">ভেরিফিকেশন পেন্ডিং</span>
          <div className="text-2xl font-extrabold text-amber-700 mt-1">
            {memberships.filter((m) => m.status === 'pending').length}
          </div>
        </div>
      </div>

      {/* Payment Verification Queue & History */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3">
        <h3 className="text-base font-bold text-slate-900">
          ৳২৯৯ মেম্বারশিপ পেমেন্ট ভেরিফিকেশন ও হিস্ট্রি ({memberships.length})
        </h3>
        <p className="text-xs text-slate-500">
          সতর্কতা: বিকাশ/নগদ/ব্যাংক TrxID যাচাই না করে কোনো পেমেন্ট ভেরিফায়েড
          মার্ক করবেন না। ভেরিফাই করলে ইউজার অটোমেটিক প্রিমিয়াম হবে এবং রেফারার
          বোনাস পাবেন।
        </p>

        {memberships.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            এখনো কোনো মেম্বারশিপ পেমেন্ট রিকোয়েস্ট জমা পড়েনি।
          </p>
        ) : (
          <div className="space-y-3">
            {memberships.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {m.userName}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[11px] font-bold">
                      {m.paymentMethod} • ৳{m.amountBdt}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 font-mono">
                    TrxID: <strong>{m.transactionReference}</strong> •{' '}
                    {m.createdAt}
                  </p>
                </div>

                {m.status === 'pending' || m.status === 'initiated' ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={rejectReason[m.id] || ''}
                      onChange={(e) =>
                        setRejectReason((prev) => ({
                          ...prev,
                          [m.id]: e.target.value,
                        }))
                      }
                      placeholder="রিজেক্ট কারণ বা ভেরিফাই নোট..."
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs"
                    />
                    <button
                      disabled={busyId === m.id}
                      onClick={async () => {
                        setBusyId(m.id);
                        await onVerifyMembership(
                          m.id,
                          'verified',
                          rejectReason[m.id] || 'TrxID যাচাইকৃত ও অনুমোদিত'
                        );
                        setBusyId(null);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                    >
                      ভেরিফাই ও প্রিমিয়াম চালু
                    </button>
                    <button
                      disabled={busyId === m.id}
                      onClick={async () => {
                        setBusyId(m.id);
                        await onVerifyMembership(
                          m.id,
                          'failed',
                          rejectReason[m.id] || 'ভুল TrxID'
                        );
                        setBusyId(null);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold cursor-pointer"
                    >
                      বাতিল (Failed)
                    </button>
                  </div>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      m.status === 'verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {m.status === 'verified' ? 'ভেরিফায়েড' : 'বাতিল'}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 4. REAL FIRESTORE REPORTS TAB
// ============================================================================
export const AdminReportsTab: React.FC<{
  users: AdminUserRecord[];
  ideas: BusinessIdeaItem[];
  categories: CategoryItem[];
  products: MarketplaceProductItem[];
  orders: BuyerOrderRecord[];
  withdrawals: WithdrawalRecord[];
  memberships: MembershipRequestRecord[];
}> = ({
  users,
  ideas,
  categories,
  products,
  orders,
  withdrawals,
  memberships,
}) => {
  const premiumUsersCount = users.filter(
    (u) => u.membershipTier === 'premium'
  ).length;
  const verifiedMembershipsCount = memberships.filter(
    (m) => m.status === 'verified'
  ).length;
  const membershipRevenue =
    Math.max(premiumUsersCount, verifiedMembershipsCount) * 299;
  const marketplaceGmv = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (Number(o.totalPriceBdt) || 0), 0);
  const approvedWithdrawalsSum = withdrawals
    .filter((w) => w.status === 'approved')
    .reduce((sum, w) => sum + (Number(w.amountBdt) || 0), 0);

  const exportCsvReport = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Total Users', String(users.length)],
      ['Premium Members', String(premiumUsersCount)],
      ['Membership Revenue (BDT)', String(membershipRevenue)],
      ['Marketplace Orders', String(orders.length)],
      ['Marketplace Order Value (BDT)', String(marketplaceGmv)],
      ['Approved Withdrawals (BDT)', String(approvedWithdrawalsSum)],
      ['Total Categories', String(categories.length)],
      ['Total Business Ideas', String(ideas.length)],
    ];
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `alpo_pujir_bebsha_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-[#059669]" /> রিয়েল-টাইম
            Firestore অ্যানালিটিক্স ও রিপোর্টস
          </h3>
          <p className="text-xs text-slate-500">
            ইউজার, রেভিনিউ, মেম্বারশিপ, উইথড্রয়াল, মার্কেটপ্লেস ও জনপ্রিয়
            ক্যাটাগরির পূর্ণাঙ্গ রিপোর্ট
          </p>
        </div>
        <button
          onClick={exportCsvReport}
          className="px-4 py-2.5 rounded-xl bg-[#064E3B] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-4 h-4" /> CSV রিপোর্ট ডাউনলোড
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Financial & Revenue Report */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3">
          <h4 className="text-sm font-bold text-slate-900">
            ১. রেভিনিউ, মেম্বারশিপ ও উইথড্রয়াল রিপোর্ট
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
              <span>প্রিমিয়াম মেম্বারশিপ রেভিনিউ (৳২৯৯):</span>
              <strong className="text-[#064E3B]">
                ৳{membershipRevenue.toLocaleString('bn-BD')}
              </strong>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
              <span>মার্কেটপ্লেস অর্ডার ভলিউম (GMV):</span>
              <strong className="text-[#064E3B]">
                ৳{marketplaceGmv.toLocaleString('bn-BD')}
              </strong>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
              <span>অনুমোদিত মোট উইথড্রয়াল পেআউট:</span>
              <strong className="text-amber-800">
                ৳{approvedWithdrawalsSum.toLocaleString('bn-BD')}
              </strong>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
              <span>পেন্ডিং উইথড্রয়াল রিকোয়েস্ট:</span>
              <strong>
                {withdrawals.filter((w) => w.status === 'pending').length}টি
              </strong>
            </div>
          </div>
        </div>

        {/* Users & Marketplace Summary */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3">
          <h4 className="text-sm font-bold text-slate-900">
            ২. ইউজার, রেফারেল ও মার্কেটপ্লেস রিপোর্ট
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
              <span>মোট নিবন্ধিত ইউজার:</span>
              <strong>{users.length} জন</strong>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
              <span>সক্রিয় বিক্রেতা (Sellers):</span>
              <strong>
                {users.filter((u) => u.role === 'seller').length} জন
              </strong>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
              <span>মার্কেটপ্লেস মোট পণ্য:</span>
              <strong>{products.length}টি</strong>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
              <span>মোট সম্পন্ন/চলমান অর্ডার:</span>
              <strong>{orders.length}টি</strong>
            </div>
          </div>
        </div>

        {/* Popular Categories Report */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3">
          <h4 className="text-sm font-bold text-slate-900">
            ৩. জনপ্রিয় ক্যাটাগরি রিপোর্ট (Top Categories)
          </h4>
          <div className="space-y-2">
            {[...categories]
              .sort((a, b) => b.ideaCount - a.ideaCount)
              .slice(0, 5)
              .map((c) => (
                <div
                  key={c.id}
                  className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-slate-800">{c.nameBn}</span>
                  <span className="text-[#064E3B] font-bold">
                    {c.ideaCount}টি আইডিয়া
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Popular Business Ideas Report */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3">
          <h4 className="text-sm font-bold text-slate-900">
            ৪. শীর্ষ রেটেড ব্যবসার আইডিয়া (Popular Ideas)
          </h4>
          <div className="space-y-2">
            {[...ideas]
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 5)
              .map((idea) => (
                <div
                  key={idea.id}
                  className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-slate-800 truncate max-w-[220px]">
                    {idea.title}
                  </span>
                  <span className="text-amber-700 font-bold">
                    ★ {idea.rating} ({idea.requiredInvestment})
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
