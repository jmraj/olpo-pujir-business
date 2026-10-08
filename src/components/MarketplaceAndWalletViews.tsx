import React, { useState } from 'react';
import {
  Store,
  Search,
  Plus,
  MapPin,
  Phone,
  Star,
  CheckCircle2,
  Package,
  Crown,
  Wallet,
  Coins,
  Copy,
  Check,
  ArrowDownToLine,
  RefreshCw,
  ShieldCheck,
  LogOut,
  User as UserIcon,
  ArrowLeft,
  Bell,
  Settings,
  Share2,
  Heart,
  ChevronRight,
  Lock,
  AlertCircle,
  AlertTriangle,
  Loader2,
  XCircle,
  Sparkles,
} from 'lucide-react';
import {
  MarketplaceProductItem,
  BuyAndEarnPackageItem,
  INITIAL_BUY_AND_EARN_PACKAGES,
  ASSETS,
  getPremiumMembershipConfig,
  PremiumMembershipConfig,
} from '../data/seedData';
import { AuthSessionUser } from './AuthViews';
import {
  WithdrawalRecord,
  WalletAuditRecord,
  NoticeRecord,
} from './AdminPanelView';

export interface BuyerOrderRecord {
  id: string;
  productId: string;
  productTitle: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  deliveryAddress: string;
  quantity: number;
  totalPriceBdt: number;
  status: 'placed' | 'confirmed' | 'shipped' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface MembershipRequestRecord {
  id: string;
  userId: string;
  userName: string;
  amountBdt: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Bank';
  transactionReference: string;
  status: 'initiated' | 'pending' | 'verified' | 'failed';
  createdAt: string;
}

// ============================================================================
// 4. MARKETPLACE SCREEN
// ============================================================================
interface MarketplaceScreenProps {
  products: MarketplaceProductItem[];
  currentUser: AuthSessionUser;
  ordersCount: number;
  onSelectProduct: (product: MarketplaceProductItem) => void;
  onSelectSeller: (sellerId: string, sellerName: string, sellerPhone: string, location: string) => void;
  onOpenMyOrders: () => void;
  onSelectBuyPackage?: (pkg: BuyAndEarnPackageItem) => void;
  onAddSellerProduct: (
    prod: Omit<
      MarketplaceProductItem,
      'id' | 'sellerId' | 'sellerName' | 'status' | 'rating'
    >
  ) => Promise<void>;
}

export const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({
  products,
  currentUser,
  ordersCount,
  onSelectProduct,
  onSelectSeller,
  onOpenMyOrders,
  onSelectBuyPackage,
  onAddSellerProduct,
}) => {
  const [mode, setMode] = useState<'buyer' | 'buy_and_earn' | 'seller'>('buyer');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Seller form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('ই-কমার্স সাপ্লাই');
  const [priceBdt, setPriceBdt] = useState('1200');
  const [stock, setStock] = useState('25');
  const [location, setLocation] = useState('ঢাকা');
  const [sellerPhone, setSellerPhone] = useState(
    currentUser.phone || '01711-000000'
  );
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sellerNotice, setSellerNotice] = useState<string | null>(null);

  const categories = [
    'ALL',
    'ই-কমার্স সাপ্লাই',
    'খাবার ও পানীয়',
    'চা/কফি',
    'পোশাক ও ফ্যাশন',
    'মেশিনারি ও যন্ত্রপাতি',
  ];

  const visibleProducts = products.filter((p) => {
    const allowed = p.status === 'approved' || p.sellerId === currentUser.uid;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      categoryFilter === 'ALL' || p.category === categoryFilter;
    return allowed && matchesSearch && matchesCat;
  });

  const handleSellerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setSubmitting(true);
    setSellerNotice(null);
    try {
      await onAddSellerProduct({
        title: title.trim(),
        category,
        priceBdt: Math.max(10, Number(priceBdt) || 500),
        stock: Math.max(1, Number(stock) || 10),
        location: location.trim() || 'ঢাকা',
        sellerPhone: sellerPhone.trim() || '01700-000000',
        description: description.trim(),
        imageUrl: ASSETS.packagingKitImg,
      });
      setTitle('');
      setDescription('');
      setSellerNotice(
        'আপনার পণ্যটি সফলভাবে Firestore ডাটাবেসে সংরক্ষিত হয়েছে!'
      );
      setMode('buyer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#042F24] via-[#064E3B] to-[#047857] rounded-3xl p-5 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#FDE68A] border border-[#D4AF37]/40 mb-1">
              উদ্যোক্তা পাইকারি ও খুচরা বাজার
            </span>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Store className="w-5 h-5 text-[#FBBF24]" /> বিজনেস মার্কেটপ্লেস
            </h2>
            <p className="text-xs text-emerald-100/80 mt-0.5">
              প্যাকেজিং কিট ও কাঁচামাল কিনুন, পণ্য কিনে অটো-রিসেল লাভ নিন অথবা নিজের পণ্য বিক্রি করুন
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-black/25 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setMode('buyer')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                mode === 'buyer'
                  ? 'bg-[#D4AF37] text-slate-950'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              পণ্যসমূহ
            </button>
            <button
              onClick={() => setMode('buy_and_earn')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                mode === 'buy_and_earn'
                  ? 'bg-[#D4AF37] text-slate-950'
                  : 'text-[#FDE68A] hover:text-white'
              }`}
            >
              🛒 কিনে লাভ করুন
            </button>
            <button
              onClick={() => setMode('seller')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                mode === 'seller'
                  ? 'bg-[#D4AF37] text-slate-950'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              + পণ্য বিক্রি করুন
            </button>
            <button
              onClick={onOpenMyOrders}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-100 hover:bg-white/10 transition cursor-pointer"
            >
              আমার অর্ডার ({ordersCount})
            </button>
          </div>
        </div>
      </div>

      {sellerNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {sellerNotice}
          </span>
          <button
            onClick={() => setSellerNotice(null)}
            className="text-emerald-700 underline ml-2 cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      )}

      {mode === 'buy_and_earn' ? (
        <div className="bg-white rounded-3xl p-5 border-2 border-[#059669]/30 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-extrabold">
                🛒 পাইকারি পণ্য ও খামার ইউনিট কিনে অটো-রিসেল লাভ
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                টাকা দিয়ে পণ্য/ইউনিট কিনুন — বিক্রির পর আসল + মুনাফা নিন
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                চাইলে অ্যাপেই অটো-রিসেল করে ওয়ালেটে আসল + লাভ নিতে পারবেন, অথবা নিজের ঠিকানায় পাইকারি ডেলিভারি নিতে পারবেন।
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INITIAL_BUY_AND_EARN_PACKAGES.map((pkg) => {
              const totalReturn = pkg.unitPriceBdt + pkg.userProfitBdt;
              return (
                <div
                  key={pkg.id}
                  className="rounded-2xl overflow-hidden border border-emerald-900/15 bg-gradient-to-b from-white to-emerald-50/30 shadow-xs flex flex-col justify-between"
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
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg bg-[#D4AF37] text-slate-950 text-[10px] font-extrabold">
                        {pkg.modelBadge}
                      </span>
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-emerald-700/95 text-white text-[10px] font-bold">
                        মেয়াদ: {pkg.durationLabel}
                      </span>
                      <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white">
                        <span className="text-xs font-extrabold text-[#FDE68A]">
                          ক্রয়মূল্য: ৳{pkg.unitPriceBdt.toLocaleString('bn-BD')}
                        </span>
                        <span className="text-[10px] font-extrabold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md">
                          লাভ: +৳{pkg.userProfitBdt.toLocaleString('bn-BD')} ({pkg.userProfitPercent}%)
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5">
                      <h4 className="text-sm font-extrabold text-slate-900">
                        {pkg.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
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
                  <div className="px-3.5 pb-3.5">
                    <button
                      type="button"
                      onClick={() => onSelectBuyPackage && onSelectBuyPackage(pkg)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#064E3B] to-[#059669] text-white text-xs font-extrabold shadow hover:brightness-105 transition cursor-pointer"
                    >
                      🛒 কিনুন ও লাভ করুন (+৳{pkg.userProfitBdt.toLocaleString('bn-BD')})
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : mode === 'buyer' ? (
        <>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="প্যাকেজিং কিট, মসলা, মাটির কাপ বা বিক্রেতার নাম খুঁজুন..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-emerald-900/10 text-xs sm:text-sm shadow-2xs focus:border-[#059669] focus:outline-none"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-[#064E3B] text-white'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'সব পণ্য' : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-[22px] overflow-hidden border border-emerald-900/10 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div
                    onClick={() => onSelectProduct(prod)}
                    className="relative h-44 cursor-pointer"
                  >
                    <img
                      src={prod.imageUrl}
                      alt={prod.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#064E3B]/90 text-white text-[11px] font-bold">
                      {prod.category}
                    </span>
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 text-slate-900 text-xs font-extrabold shadow tabular-nums">
                      ৳{prod.priceBdt.toLocaleString('bn-BD')}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#059669]" />{' '}
                        {prod.location}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />{' '}
                        {prod.rating}
                      </span>
                    </div>
                    <h3
                      onClick={() => onSelectProduct(prod)}
                      className="text-base font-bold text-slate-900 mb-1 hover:text-[#064E3B] cursor-pointer"
                    >
                      {prod.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                      {prod.description}
                    </p>
                    <div className="flex items-center justify-between text-xs bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                      <button
                        type="button"
                        onClick={() =>
                          onSelectSeller(
                            prod.sellerId,
                            prod.sellerName,
                            prod.sellerPhone,
                            prod.location
                          )
                        }
                        className="text-slate-700 hover:text-[#059669] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-[#059669]" />
                        <span>
                          বিক্রেতা: <strong className="underline">{prod.sellerName}</strong>
                        </span>
                      </button>
                      <span className="text-emerald-700 font-bold">
                        স্টক: {prod.stock}টি
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4 flex items-center gap-2">
                  <button
                    onClick={() => onSelectProduct(prod)}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#064E3B] to-[#059669] text-white text-xs font-bold shadow-xs hover:brightness-105 cursor-pointer"
                  >
                    বিস্তারিত ও অর্ডার করুন →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#059669]" /> নতুন পাইকারি বা
              উদ্যোক্তা পণ্য যুক্ত করুন
            </h3>
            <button
              onClick={() => setMode('buyer')}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              বাতিল
            </button>
          </div>
          <form onSubmit={handleSellerSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                পণ্যের নাম (Product Title) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="যেমন: ১০০ পিস স্ট্যান্ড-আপ পাউচ ও সিলার কম্বো"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ক্যাটাগরি
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
                >
                  <option value="ই-কমার্স সাপ্লাই">ই-কমার্স সাপ্লাই</option>
                  <option value="খাবার ও পানীয়">খাবার ও পানীয়</option>
                  <option value="চা/কফি">চা/কফি</option>
                  <option value="পোশাক ও ফ্যাশন">পোশাক ও ফ্যাশন</option>
                  <option value="মেশিনারি ও যন্ত্রপাতি">
                    মেশিনারি ও যন্ত্রপাতি
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মূল্য (৳ BDT) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={priceBdt}
                  onChange={(e) => setPriceBdt(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মজুদ সংখ্যা (Stock) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  লোকেশন / জেলা
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বিক্রেতার মোবাইল নম্বর
                </label>
                <input
                  type="text"
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                পণ্যের বিস্তারিত বিবরণ *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="পণ্যের মান, পাইকারি শর্ত ও ডেলিভারি পদ্ধতি লিখুন..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#064E3B] to-[#059669] text-white font-bold text-xs shadow cursor-pointer disabled:opacity-60"
            >
              {submitting
                ? 'সংরক্ষণ হচ্ছে...'
                : 'পণ্যটি মার্কেটপ্লেসে প্রকাশ করুন'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 5. PRODUCT DETAILS SCREEN
// ============================================================================
interface ProductDetailScreenProps {
  product: MarketplaceProductItem;
  currentUser: AuthSessionUser;
  onBack: () => void;
  onOpenSellerProfile: (
    sellerId: string,
    sellerName: string,
    sellerPhone: string,
    location: string
  ) => void;
  onPlaceOrder: (order: {
    productId: string;
    productTitle: string;
    quantity: number;
    totalPriceBdt: number;
    deliveryAddress: string;
    buyerPhone: string;
  }) => Promise<void>;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  currentUser,
  onBack,
  onOpenSellerProfile,
  onPlaceOrder,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [buyerPhone, setBuyerPhone] = useState(currentUser.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const totalPrice = product.priceBdt * quantity;

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!buyerPhone.trim() || buyerPhone.trim().length < 6) {
      setErrorMsg('অনুগ্রহ করে সঠিক মোবাইল নম্বর লিখুন।');
      return;
    }
    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 3) {
      setErrorMsg('অনুগ্রহ করে আপনার সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন।');
      return;
    }
    setSubmitting(true);
    try {
      await onPlaceOrder({
        productId: product.id,
        productTitle: product.title,
        quantity,
        totalPriceBdt: totalPrice,
        deliveryAddress: deliveryAddress.trim(),
        buyerPhone: buyerPhone.trim(),
      });
    } catch (err: any) {
      setErrorMsg(err?.message || 'অর্ডার সম্পন্ন করা যায়নি।');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 pb-8">
      <div className="bg-white rounded-[26px] overflow-hidden border border-emerald-900/10 shadow-xs">
        <div className="relative h-60 sm:h-72">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
          <button
            onClick={onBack}
            className="absolute top-4 left-4 px-3.5 py-2 rounded-xl bg-white/90 text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> মার্কেটপ্লেসে ফিরুন
          </button>
          <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between gap-3">
            <div>
              <span className="px-2.5 py-1 rounded-full bg-[#D4AF37] text-slate-950 text-xs font-bold">
                {product.category}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold mt-2">
                {product.title}
              </h1>
            </div>
            <div className="bg-white text-slate-950 px-4 py-2 rounded-2xl font-extrabold text-lg shadow tabular-nums shrink-0">
              ৳{product.priceBdt.toLocaleString('bn-BD')}
            </div>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Seller & Stock Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-900/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#064E3B] text-[#FDE68A] flex items-center justify-center font-bold text-base">
                {product.sellerName.charAt(0)}
              </div>
              <div>
                <p className="text-xs text-slate-500">ভেরিফায়েড বিক্রেতা</p>
                <h4 className="text-sm font-bold text-slate-900">
                  {product.sellerName}
                </h4>
                <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#059669]" />{' '}
                  {product.location}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  onOpenSellerProfile(
                    product.sellerId,
                    product.sellerName,
                    product.sellerPhone,
                    product.location
                  )
                }
                className="px-3.5 py-2 rounded-xl bg-white border border-emerald-300 text-[#064E3B] text-xs font-bold hover:bg-emerald-50 cursor-pointer"
              >
                বিক্রেতার প্রোফাইল দেখুন
              </button>
              <a
                href={`tel:${product.sellerPhone}`}
                className="px-3.5 py-2 rounded-xl bg-[#064E3B] text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" /> কল করুন
              </a>
            </div>
          </div>

          {/* Product Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">
              পণ্যের বিস্তারিত বিবরণ
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {product.description}
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-600">
              <span>
                মজুদ আছে: <strong className="text-emerald-700">{product.stock}টি</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                রেটিং:{' '}
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <strong>{product.rating}</strong>
              </span>
            </div>
          </div>

          {/* Direct Order Checkout Form */}
          <form
            onSubmit={handleOrder}
            className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-4"
          >
            <h3 className="text-base font-bold text-slate-900">
              ক্যাশ অন ডেলিভারিতে অর্ডার করুন
            </h3>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  পরিমাণ (Quantity)
                </label>
                <input
                  type="number"
                  min={1}
                  max={Math.max(1, product.stock)}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  আপনার মোবাইল নম্বর *
                </label>
                <input
                  type="tel"
                  required
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                পূর্ণ ডেলিভারি ঠিকানা (জেলা, থানা ও বিস্তারিত) *
              </label>
              <textarea
                rows={2}
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="বাসা/দোকান নম্বর, রোড, থানা ও জেলা লিখুন..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
              <div>
                <span className="text-xs text-slate-500 block">
                  সর্বমোট প্রদেয় বিল
                </span>
                <span className="text-xl font-extrabold text-[#064E3B] tabular-nums">
                  ৳{totalPrice.toLocaleString('bn-BD')}
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#064E3B] to-[#059669] text-white font-bold text-xs sm:text-sm shadow cursor-pointer disabled:opacity-60"
              >
                {submitting
                  ? 'অর্ডার নিশ্চিত হচ্ছে...'
                  : 'অর্ডার কনফার্ম করুন →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 6. SELLER PROFILE SCREEN
// ============================================================================
interface SellerProfileScreenProps {
  seller: {
    sellerId: string;
    sellerName: string;
    sellerPhone: string;
    location: string;
  };
  products: MarketplaceProductItem[];
  onBack: () => void;
  onSelectProduct: (product: MarketplaceProductItem) => void;
}

export const SellerProfileScreen: React.FC<SellerProfileScreenProps> = ({
  seller,
  products,
  onBack,
  onSelectProduct,
}) => {
  const sellerProducts = products.filter(
    (p) =>
      p.sellerId === seller.sellerId || p.sellerName === seller.sellerName
  );

  return (
    <div className="space-y-5 pb-8">
      <div className="bg-gradient-to-r from-[#042F24] via-[#064E3B] to-[#047857] rounded-3xl p-6 text-white shadow-lg">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl bg-white/15 text-white text-xs font-bold inline-flex items-center gap-1.5 mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> মার্কেটপ্লেসে ফিরুন
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/15 border-2 border-[#D4AF37] flex items-center justify-center text-2xl font-extrabold text-[#FDE68A]">
              {seller.sellerName.charAt(0)}
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-slate-950 text-[10px] font-extrabold">
                ভেরিফায়েড পাইকারি বিক্রেতা
              </span>
              <h2 className="text-xl font-bold mt-1">{seller.sellerName}</h2>
              <p className="text-xs text-emerald-100/85 flex items-center gap-2 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#FBBF24]" />{' '}
                {seller.location} • ফোন: {seller.sellerPhone}
              </p>
            </div>
          </div>

          <a
            href={`tel:${seller.sellerPhone}`}
            className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-slate-950 font-extrabold text-xs flex items-center gap-1.5 self-start sm:self-center shadow"
          >
            <Phone className="w-4 h-4" /> সরাসরি কল করুন
          </a>
        </div>
      </div>

      <h3 className="text-base font-bold text-slate-900">
        এই বিক্রেতার সকল পণ্য ({sellerProducts.length})
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sellerProducts.map((prod) => (
          <div
            key={prod.id}
            onClick={() => onSelectProduct(prod)}
            className="bg-white rounded-3xl p-4 border border-emerald-900/10 shadow-xs hover:shadow-md transition flex items-center gap-4 cursor-pointer"
          >
            <img
              src={prod.imageUrl}
              alt={prod.title}
              className="w-24 h-24 rounded-2xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-[#064E3B]">
                {prod.category}
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-1 truncate">
                {prod.title}
              </h4>
              <p className="text-sm font-extrabold text-[#064E3B] mt-1 tabular-nums">
                ৳{prod.priceBdt.toLocaleString('bn-BD')}
              </p>
              <span className="text-xs font-bold text-amber-700 mt-1 inline-block">
                বিস্তারিত ও অর্ডার →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 7. MY ORDERS SCREEN
// ============================================================================
interface MyOrdersScreenProps {
  orders: BuyerOrderRecord[];
  onCancelOrder: (orderId: string) => Promise<void>;
  onBrowseMarketplace: () => void;
  onBack: () => void;
}

export const MyOrdersScreen: React.FC<MyOrdersScreenProps> = ({
  orders,
  onCancelOrder,
  onBrowseMarketplace,
  onBack,
}) => {
  return (
    <div className="space-y-5 pb-8">
      <div className="bg-gradient-to-r from-[#042F24] via-[#064E3B] to-[#047857] rounded-3xl p-5 text-white shadow-lg flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-xl bg-white/15 text-white text-xs font-bold inline-flex items-center gap-1.5 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> ফিরে যান
          </button>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Package className="w-5 h-5 text-[#FBBF24]" /> আমার অর্ডারসমূহ (
            {orders.length})
          </h2>
          <p className="text-xs text-emerald-100/80 mt-0.5">
            মার্কেটপ্লেস থেকে আপনার অর্ডার করা পণ্যের তালিকা ও বর্তমান অবস্থা
          </p>
        </div>

        <button
          onClick={onBrowseMarketplace}
          className="px-3.5 py-2 rounded-xl bg-[#D4AF37] text-slate-950 font-bold text-xs cursor-pointer shrink-0"
        >
          + নতুন অর্ডার
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
          <p className="text-base font-bold text-slate-800">
            আপনি এখনো কোনো পণ্য অর্ডার করেননি
          </p>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            মার্কেটপ্লেস থেকে ব্যবসার কাঁচামাল বা স্টার্টার কিট অর্ডার করুন।
          </p>
          <button
            onClick={onBrowseMarketplace}
            className="px-5 py-2.5 rounded-xl bg-[#064E3B] text-white text-xs font-bold cursor-pointer"
          >
            মার্কেটপ্লেসে যান
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono text-slate-400">
                    #{ord.id}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    • {ord.createdAt}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {ord.productTitle}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  পরিমাণ: <strong>{ord.quantity}টি</strong> • মোট বিল:{' '}
                  <strong className="text-[#064E3B]">
                    ৳{ord.totalPriceBdt.toLocaleString('bn-BD')}
                  </strong>
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  ঠিকানা: {ord.deliveryAddress} ({ord.buyerPhone})
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    ord.status === 'cancelled'
                      ? 'bg-rose-100 text-rose-800'
                      : ord.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {ord.status === 'placed'
                    ? 'অর্ডার প্লেসড'
                    : ord.status === 'confirmed'
                    ? 'কনফার্মড'
                    : ord.status === 'cancelled'
                    ? 'বাতিলকৃত'
                    : ord.status}
                </span>

                {ord.status === 'placed' && (
                  <button
                    onClick={() => onCancelOrder(ord.id)}
                    className="px-3 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold cursor-pointer"
                  >
                    বাতিল করুন
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 9. PREMIUM MEMBERSHIP — ADMIN CONFIGURABLE & CUSTOM POSTS SCREEN
// ============================================================================
interface MembershipScreenProps {
  user: AuthSessionUser;
  requests: MembershipRequestRecord[];
  membershipConfig?: PremiumMembershipConfig;
  onSubmitMembership: (
    method: 'bKash' | 'Nagad' | 'Bank',
    trxId: string,
    amountBdt?: number,
    planName?: string
  ) => Promise<void>;
  onBack: () => void;
}

export const MembershipScreen: React.FC<MembershipScreenProps> = ({
  user,
  requests,
  membershipConfig,
  onSubmitMembership,
  onBack,
}) => {
  const cfg = membershipConfig || getPremiumMembershipConfig();
  const [selectedPlanTitle, setSelectedPlanTitle] = useState<string>(
    cfg.headline
  );
  const [selectedPlanFee, setSelectedPlanFee] = useState<number>(
    cfg.mainFeeBdt || 299
  );
  const [payMethod, setPayMethod] = useState<'bKash' | 'Nagad' | 'Bank'>(
    'bKash'
  );
  const [trxId, setTrxId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [copiedNum, setCopiedNum] = useState<string | null>(null);

  const handleCopyNumber = (num: string) => {
    try {
      navigator.clipboard.writeText(num);
      setCopiedNum(num);
      setTimeout(() => setCopiedNum(null), 2000);
    } catch {}
  };

  const isFakeOrInvalidTrxId = (raw: string): boolean => {
    const cleaned = raw.trim().toUpperCase();
    if (cleaned.length < 8 || cleaned.length > 20) return true;
    if (/^(.)\1{4,}$/.test(cleaned)) return true;
    if (
      /123456|654321|000000|111111|222222|333333|444444|555555|666666|777777|888888|999999|ABCDEF|QWERTY|ASDFGH|FAKE|TEST|DEMO|ADMIN|TRXID|01700000|01711111|01811111|01911111/.test(
        cleaned
      )
    ) {
      return true;
    }
    const hasLetter = /[A-Z]/.test(cleaned);
    const hasDigit = /[0-9]/.test(cleaned);
    if (!hasLetter || !hasDigit) return true;
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg(null);
    setMsg(null);
    if (isFakeOrInvalidTrxId(trxId)) {
      setErrMsg(
        '❌ ভুল বা ভুয়া ট্রানজেকশন আইডি (Fake TrxID)! অনুগ্রহ করে টাকা পাঠানোর পর মেসেজে পাওয়া আসল ৮–১০ অক্ষরের (ইংরেজি বড় হাতের অক্ষর ও সংখ্যার সমন্বয়ে গঠিত, যেমন: BKA94827X) সঠিক TrxID দিন।'
      );
      return;
    }
    setSubmitting(true);
    try {
      await onSubmitMembership(
        payMethod,
        trxId.trim().toUpperCase(),
        selectedPlanFee,
        selectedPlanTitle
      );
      setTrxId('');
      setMsg(
        `⏳ আপনার "${selectedPlanTitle}" (৳${selectedPlanFee.toLocaleString('bn-BD')}) পেমেন্ট TrxID জমা হয়েছে! অ্যাডমিন যাচাই করে অনুমোদন (Approve) করলেই মেম্বারশিপ আনলক হবে।`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 pb-8">
      <div className="bg-gradient-to-br from-[#042F24] via-[#064E3B] to-[#047857] rounded-3xl p-6 text-white shadow-lg border border-[#D4AF37]/40 space-y-2">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl bg-white/15 text-white text-xs font-bold inline-flex items-center gap-1.5 mb-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> প্রোফাইলে ফিরুন
        </button>
        <div className="flex items-center gap-2">
          <Crown className="w-6 h-6 text-[#FBBF24]" />
          <h2 className="text-xl sm:text-2xl font-extrabold">
            {cfg.headline}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-emerald-100/90">
          {cfg.subHeadline}
        </p>
        {cfg.announcementPost && (
          <div className="mt-2 p-3 rounded-2xl bg-amber-400/20 border border-amber-300/50 text-xs font-bold text-[#FDE68A]">
            {cfg.announcementPost}
          </div>
        )}
      </div>

      {/* Admin Published Custom Membership Posts / Offers */}
      {cfg.customPosts && cfg.customPosts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              👑 অ্যাডমিন প্রকাশিত প্রিমিয়াম মেম্বারশিপ পোস্ট ও প্ল্যানসমূহ
            </h3>
            <span className="text-[11px] font-bold text-[#064E3B]">
              যেকোনো প্ল্যান সিলেক্ট করে জয়েন করুন
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {cfg.customPosts.map((post) => {
              const isSelected =
                selectedPlanTitle === post.title &&
                selectedPlanFee === post.feeBdt;
              return (
                <div
                  key={post.id}
                  className={`rounded-3xl p-4 border-2 transition space-y-2.5 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-50/90 border-[#D4AF37] shadow-md'
                      : 'bg-white border-emerald-900/15 shadow-xs'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#064E3B] text-[#FDE68A] text-[10px] font-extrabold">
                        {post.badge || 'প্রিমিয়াম মেম্বারশিপ পোস্ট'}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">
                        {post.publishedAt}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-slate-900">
                      {post.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {post.subtitle}
                    </p>
                    <div className="grid grid-cols-3 gap-1.5 text-center pt-1">
                      <div className="p-2 rounded-xl bg-white border border-slate-200">
                        <span className="text-[9px] text-slate-500 block">
                          মেম্বারশিপ ফি
                        </span>
                        <span className="text-xs font-black text-slate-900">
                          ৳{post.feeBdt.toLocaleString('bn-BD')}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                        <span className="text-[9px] text-emerald-700 block">
                          বোনাস সুবিধা
                        </span>
                        <span className="text-xs font-black text-emerald-800">
                          +৳{post.bonusBdt.toLocaleString('bn-BD')}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-amber-50 border border-amber-300">
                        <span className="text-[9px] text-amber-900 block">
                          সম্ভাব্য দৈনিক আয়
                        </span>
                        <span className="text-xs font-black text-[#064E3B]">
                          ৳{post.dailyIncomeEstimateBdt.toLocaleString('bn-BD')}
                        </span>
                      </div>
                    </div>
                    {Array.isArray(post.benefits) && post.benefits.length > 0 && (
                      <div className="space-y-1 pt-1">
                        {post.benefits.map((b, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-1.5 text-[11px] text-slate-700"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlanTitle(post.title);
                      setSelectedPlanFee(post.feeBdt);
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-extrabold cursor-pointer transition ${
                      isSelected
                        ? 'bg-[#064E3B] text-white'
                        : 'bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950'
                    }`}
                  >
                    {isSelected
                      ? `✓ নির্বাচিত প্ল্যান (৳${post.feeBdt.toLocaleString('bn-BD')})`
                      : `এই মেম্বারশিপ প্ল্যানটি নিন (৳${post.feeBdt.toLocaleString('bn-BD')})`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {errMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 text-xs font-extrabold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errMsg}</span>
        </div>
      )}

      {msg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Benefits Card */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs space-y-3">
          <h3 className="text-base font-bold text-slate-900">
            প্রিমিয়াম মেম্বারশিপ সুবিধাসমূহ
          </h3>
          {cfg.mainBenefits.map((b, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
              <span>{b}</span>
            </div>
          ))}
        </div>

        {/* Payment Submission Form */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            {user.membershipTier === 'premium'
              ? 'আপনি ইতিমধ্যে একজন প্রিমিয়াম সদস্য!'
              : `${selectedPlanTitle} — ৳${selectedPlanFee.toLocaleString('bn-BD')} পেমেন্ট ভেরিফিকেশন ফর্ম`}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            নিচের পার্সোনাল নম্বরে <strong>৳{selectedPlanFee.toLocaleString('bn-BD')} Send Money (সেন্ড মানি)</strong> করে আপনার Transaction ID (TrxID) জমা দিন:
          </p>

          <div className="space-y-2">
            <div className="p-3 rounded-2xl bg-pink-50/70 border border-pink-200 flex items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold text-pink-700 block">
                  বিকাশ পার্সোনাল (bKash Personal - Send Money)
                </span>
                <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                  01906971148
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyNumber('01906971148')}
                className="px-3 py-1.5 rounded-xl bg-white border border-pink-200 text-pink-700 text-xs font-bold hover:bg-pink-100 cursor-pointer"
              >
                {copiedNum === '01906971148' ? 'কপি হয়েছে ✓' : 'কপি করুন'}
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold text-amber-800 block">
                  নগদ পার্সোনাল (Nagad Personal - Send Money)
                </span>
                <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                  01942807392
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyNumber('01942807392')}
                className="px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-amber-800 text-xs font-bold hover:bg-amber-100 cursor-pointer"
              >
                {copiedNum === '01942807392' ? 'কপি হয়েছে ✓' : 'কপি করুন'}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                পেমেন্ট মাধ্যম নির্বাচন করুন
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['bKash', 'Nagad', 'Bank'] as const).map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => setPayMethod(m)}
                    className={`py-2.5 rounded-xl text-xs font-bold border cursor-pointer ${
                      payMethod === m
                        ? 'bg-[#064E3B] text-white border-[#064E3B]'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Transaction ID (TrxID) *
              </label>
              <input
                type="text"
                required
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                placeholder="যেমন: BKA98234X"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm uppercase"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-extrabold text-xs shadow cursor-pointer disabled:opacity-60"
            >
              {submitting
                ? 'যাচাইয়ের জন্য পাঠানো হচ্ছে...'
                : `৳${selectedPlanFee.toLocaleString('bn-BD')} পেমেন্ট জমা দিন`}
            </button>
          </form>
        </div>
      </div>

      {/* Membership Requests History */}
      {requests.length > 0 && (
        <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs space-y-2.5">
          <h3 className="text-sm font-bold text-slate-900">
            আপনার মেম্বারশিপ পেমেন্ট রেকর্ড
          </h3>
          {requests.map((r) => (
            <div
              key={r.id}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-900">
                  ৳{r.amountBdt} • {r.paymentMethod} (TrxID:{' '}
                  {r.transactionReference})
                </span>
                <span className="block text-[11px] text-slate-500">
                  {r.createdAt}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px]">
                {r.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 10. REFERRAL SCREEN
// ============================================================================
interface ReferralScreenProps {
  user: AuthSessionUser;
  onBack: () => void;
}

export const ReferralScreen: React.FC<ReferralScreenProps> = ({
  user,
  onBack,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const inviteText = `অল্প পুঁজির ব্যবসা অ্যাপে যুক্ত হয়ে লাভজনক ব্যবসার আইডিয়া ও ক্যালকুলেটর ব্যবহার করুন! রেজিস্ট্রেশনের সময় আমার রেফারেল কোড ব্যবহার করুন: ${user.referralCode}`;

  return (
    <div className="space-y-5 pb-8">
      <div className="bg-gradient-to-r from-[#042F24] via-[#064E3B] to-[#047857] rounded-3xl p-6 text-white shadow-lg">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl bg-white/15 text-white text-xs font-bold inline-flex items-center gap-1.5 mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> ফিরে যান
        </button>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Share2 className="w-5 h-5 text-[#FBBF24]" /> রেফার করুন ও আয় করুন
        </h2>
        <p className="text-xs text-emerald-100/85 mt-1">
          বন্ধুদের আমন্ত্রণ জানান এবং প্রতিটি প্রিমিয়াম সক্রিয়করণে পান নগদ ৳৫০
          ওয়ালেট বোনাস ও +৩০ পয়েন্ট
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs space-y-4">
        <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-500 block">
              আপনার ইউনিক রেফারেল কোড
            </span>
            <span className="text-2xl font-extrabold text-[#064E3B] font-mono tracking-wider">
              {user.referralCode}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(user.referralCode);
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 2000);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#064E3B] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {copiedCode ? (
                <>
                  <Check className="w-4 h-4" /> কপি হয়েছে
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> কোড কপি করুন
                </>
              )}
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(inviteText);
                setCopiedInvite(true);
                setTimeout(() => setCopiedInvite(false), 2000);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {copiedInvite ? 'মেসেজ কপি হয়েছে!' : 'আমন্ত্রণ বার্তা কপি'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-[#064E3B] block mb-1">
              ধাপ ১: কোড শেয়ার
            </span>
            <p className="text-xs text-slate-600">
              আপনার বন্ধুদের কাছে রেফারেল কোডটি শেয়ার করুন।
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-[#064E3B] block mb-1">
              ধাপ ২: রেজিস্ট্রেশন
            </span>
            <p className="text-xs text-slate-600">
              রেজিস্ট্রেশনের সময় কোড দিলে নতুন সদস্য পাবেন +৫০ ওয়েলকাম পয়েন্ট।
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-[#064E3B] block mb-1">
              ধাপ ৩: ৳৫০ ক্যাশব্যাক
            </span>
            <p className="text-xs text-slate-600">
              বন্ধু ৳২৯৯ প্রিমিয়াম নিলেই আপনার ওয়ালেটে যুক্ত হবে ৳৫০ ও +৩০
              পয়েন্ট।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 11. WALLET SCREEN
// ============================================================================
interface WalletScreenProps {
  user: AuthSessionUser;
  transactions: WalletAuditRecord[];
  investments?: Array<{
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
  }>;
  onOpenWithdrawal: () => void;
  onOpenReferral: () => void;
  onOpenMembership: () => void;
  onBack: () => void;
}

export const WalletScreen: React.FC<WalletScreenProps> = ({
  user,
  transactions,
  investments = [],
  onOpenWithdrawal,
  onOpenReferral,
  onOpenMembership,
  onBack,
}) => {
  const validInvestments = investments.filter((i) => i.status !== 'rejected');
  const totalInvested = validInvestments.reduce(
    (sum, i) => sum + (Number(i.amountBdt) || 0),
    0
  );
  const totalExpectedProfit = validInvestments.reduce(
    (sum, i) =>
      sum +
      (Number(i.expectedMonthlyProfitBdt) || 0) *
        Math.max(1, Number(i.durationMonths) || 1),
    0
  );
  const totalReceivable = totalInvested + totalExpectedProfit;
  const totalPaidProfit = validInvestments.reduce(
    (sum, i) => sum + (Number(i.totalProfitPaidBdt) || 0),
    0
  );
  const totalRemaining = Math.max(0, totalReceivable - totalPaidProfit);

  return (
    <div className="space-y-5 pb-8">
      <div className="bg-gradient-to-br from-[#042F24] via-[#064E3B] to-[#047857] rounded-3xl p-6 text-white shadow-lg">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl bg-white/15 text-white text-xs font-bold inline-flex items-center gap-1.5 mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> প্রোফাইলে ফিরুন
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-black/25 border border-white/10">
            <span className="text-xs text-emerald-200 flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-[#FBBF24]" /> মোট ওয়ালেট ব্যালেন্স
            </span>
            <div className="text-3xl font-extrabold text-white mt-1 tabular-nums">
              ৳{user.walletBalance.toLocaleString('bn-BD')}
            </div>
            <p className="text-[11px] text-emerald-200/80 mt-1">
              সর্বনিম্ন ৳১০০ হলেই বিকাশ/নগদে উত্তোলনযোগ্য
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/25 border border-white/10">
            <span className="text-xs text-emerald-200 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-[#FBBF24]" /> অর্জিত রিওয়ার্ড
              পয়েন্টস
            </span>
            <div className="text-3xl font-extrabold text-[#FDE68A] mt-1 tabular-nums">
              {user.points} Pts
            </div>
            <p className="text-[11px] text-emerald-200/80 mt-1">
              রেজিস্ট্রেশন, রেফারেল ও প্রিমিয়াম মেম্বারশিপ রিওয়ার্ড
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 mt-4">
          <button
            onClick={onOpenWithdrawal}
            className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-slate-950 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowDownToLine className="w-4 h-4" /> টাকা উত্তোলন করুন
          </button>
          <button
            onClick={onOpenReferral}
            className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-4 h-4" /> রেফার করে আয় করুন
          </button>
          <button
            onClick={onOpenMembership}
            className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Crown className="w-4 h-4 text-[#FBBF24]" /> ৳২৯৯ প্রিমিয়াম
          </button>
        </div>
      </div>

      {/* User Investment & Package Financial Statement inside Wallet */}
      <div className="bg-white rounded-3xl p-5 border-2 border-[#059669]/30 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#064E3B] text-[10px] font-extrabold">
              📊 ইনভেস্টমেন্ট ও প্যাকেজ প্রাপ্য হিসাব
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mt-1">
              আমার বিনিয়োগ, লাভ ও মোট প্রাপ্য টাকার পূর্ণাঙ্গ বিবরণী
            </h3>
          </div>
          <span className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold">
            মোট অর্ডার/বিনিয়োগ: {investments.length}টি
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold block">
              মোট জমাকৃত আসল
            </span>
            <span className="text-base font-extrabold text-slate-900 tabular-nums">
              ৳{totalInvested.toLocaleString('bn-BD')}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] text-emerald-800 font-bold block">
              নির্ধারিত মোট লাভ
            </span>
            <span className="text-base font-extrabold text-[#059669] tabular-nums">
              +৳{totalExpectedProfit.toLocaleString('bn-BD')}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300">
            <span className="text-[10px] text-amber-900 font-bold block">
              সর্বমোট প্রাপ্য (আসল+লাভ)
            </span>
            <span className="text-base font-extrabold text-amber-800 tabular-nums">
              ৳{totalReceivable.toLocaleString('bn-BD')}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-950 text-white border border-emerald-800">
            <span className="text-[10px] text-emerald-200 font-bold block">
              বাকি প্রাপ্য (প্রাপ্ত: ৳{totalPaidProfit.toLocaleString('bn-BD')})
            </span>
            <span className="text-base font-extrabold text-[#FDE68A] tabular-nums">
              ৳{totalRemaining.toLocaleString('bn-BD')}
            </span>
          </div>
        </div>

        {investments.length > 0 && (
          <div className="space-y-2.5 pt-1">
            {investments.map((inv) => {
              const months = Math.max(1, Number(inv.durationMonths) || 1);
              const totalProfit =
                (Number(inv.expectedMonthlyProfitBdt) || 0) * months;
              const totalDue = (Number(inv.amountBdt) || 0) + totalProfit;
              const paid = Number(inv.totalProfitPaidBdt) || 0;
              const rem = Math.max(0, totalDue - paid);
              return (
                <div
                  key={inv.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-extrabold text-slate-900 block">
                        {inv.projectTitle}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        মাধ্যম: {inv.paymentMethod} • TrxID: {inv.transactionId} • মেয়াদ: {months} মাস
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        inv.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : inv.status === 'completed'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : inv.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-yellow-100 text-yellow-900 border border-yellow-300'
                      }`}
                    >
                      {inv.status === 'active'
                        ? '✅ অনুমোদিত ও সক্রিয়'
                        : inv.status === 'completed'
                        ? '🎉 আসল+লাভ পরিশোধিত'
                        : inv.status === 'rejected'
                        ? '❌ বাতিল (ভুয়া TrxID)'
                        : '⏳ অ্যাডমিন যাচাই চলছে (লকড)'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/80 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">জমাকৃত আসল:</span>
                      <strong className="text-slate-900">
                        ৳{inv.amountBdt.toLocaleString('bn-BD')}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">মোট লাভ ({months} মাস):</span>
                      <strong className="text-[#059669]">
                        +৳{totalProfit.toLocaleString('bn-BD')}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">সর্বমোট পাবেন (আসল+লাভ):</span>
                      <strong className="text-amber-700">
                        ৳{totalDue.toLocaleString('bn-BD')}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">বাকি প্রাপ্য:</span>
                      <strong className="text-[#064E3B]">
                        ৳{rem.toLocaleString('bn-BD')} (প্রাপ্ত: ৳{paid.toLocaleString('bn-BD')})
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Wallet Transactions List */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs space-y-3">
        <h3 className="text-base font-bold text-slate-900">
          ওয়ালেট ও পয়েন্ট লেনদেন বিবরণী
        </h3>
        {transactions.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">
            এখনো কোনো ওয়ালেট ট্রানজেকশন রেকর্ড নেই।
          </p>
        ) : (
          <div className="space-y-2.5">
            {transactions.map((t) => (
              <div
                key={t.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 block">
                    {t.reason}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {t.createdAt}
                  </span>
                </div>
                <div className="text-right font-bold tabular-nums">
                  {t.amountBdt !== 0 && (
                    <span className="text-[#064E3B] block">
                      {t.amountBdt > 0 ? `+৳${t.amountBdt}` : `৳${t.amountBdt}`}
                    </span>
                  )}
                  {t.pointsDelta !== 0 && (
                    <span className="text-amber-700 block">
                      {t.pointsDelta > 0
                        ? `+${t.pointsDelta} Pts`
                        : `${t.pointsDelta} Pts`}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 12. WITHDRAWAL SCREEN
// ============================================================================
interface WithdrawalScreenProps {
  user: AuthSessionUser;
  withdrawals: WithdrawalRecord[];
  onRequestWithdrawal: (
    amountBdt: number,
    method: 'bKash' | 'Nagad' | 'Bank',
    accountNumber: string
  ) => Promise<void>;
  onCancelWithdrawal: (withdrawalId: string) => Promise<void>;
  onBack: () => void;
}

export const WithdrawalScreen: React.FC<WithdrawalScreenProps> = ({
  user,
  withdrawals,
  onRequestWithdrawal,
  onCancelWithdrawal,
  onBack,
}) => {
  const [amount, setAmount] = useState('200');
  const [method, setMethod] = useState<'bKash' | 'Nagad' | 'Bank'>('bKash');
  const [accountNumber, setAccountNumber] = useState(user.phone || '');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    const numAmt = Number(amount) || 0;
    if (numAmt < 100) {
      setErrorMsg('সর্বনিম্ন ৳১০০ টাকা উত্তোলনের রিকোয়েস্ট করা যাবে।');
      return;
    }
    if (accountNumber.trim().length < 5) {
      setErrorMsg('অনুগ্রহ করে সঠিক বিকাশ/নগদ বা ব্যাংক অ্যাকাউন্ট নম্বর দিন।');
      return;
    }
    setSubmitting(true);
    try {
      await onRequestWithdrawal(numAmt, method, accountNumber.trim());
      setSuccessMsg(
        `৳${numAmt} (${method}) উত্তোলনের রিকোয়েস্ট সফলভাবে Firestore-এ জমা হয়েছে!`
      );
    } catch (err: any) {
      setErrorMsg(err?.message || 'রিকোয়েস্ট পাঠানো যায়নি।');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 pb-8">
      <div className="bg-gradient-to-r from-[#042F24] via-[#064E3B] to-[#047857] rounded-3xl p-5 text-white shadow-lg">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl bg-white/15 text-white text-xs font-bold inline-flex items-center gap-1.5 mb-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> ওয়ালেটে ফিরুন
        </button>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ArrowDownToLine className="w-5 h-5 text-[#FBBF24]" /> টাকা উত্তোলন
          (Withdrawal)
        </h2>
        <p className="text-xs text-emerald-100/85 mt-0.5">
          বর্তমান ওয়ালেট ব্যালেন্স: <strong>৳{user.walletBalance}</strong> •
          সর্বনিম্ন উত্তোলন: ৳১০০
        </p>
      </div>

      <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          নতুন উত্তোলন রিকোয়েস্ট ফর্ম
        </h3>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                উত্তোলনের মাধ্যম (Method)
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-semibold"
              >
                <option value="bKash">বিকাশ (bKash Personal)</option>
                <option value="Nagad">নগদ (Nagad Personal)</option>
                <option value="Bank">ব্যাংক অ্যাকাউন্ট</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                টাকার পরিমাণ (৳ BDT) *
              </label>
              <input
                type="number"
                min={100}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              বিকাশ/নগদ নম্বর অথবা ব্যাংক হিসাব নম্বর *
            </label>
            <input
              type="text"
              required
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="017XXXXXXXX"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 rounded-xl bg-[#064E3B] text-white font-bold text-xs shadow cursor-pointer disabled:opacity-60"
          >
            {submitting
              ? 'রিকোয়েস্ট জমা হচ্ছে...'
              : 'উত্তোলন রিকোয়েস্ট সাবমিট করুন'}
          </button>
        </form>
      </div>

      {/* Withdrawal History */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs space-y-3">
        <h3 className="text-base font-bold text-slate-900">
          আপনার উত্তোলন হিস্ট্রি ({withdrawals.length})
        </h3>
        {withdrawals.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            এখনো কোনো উত্তোলন রিকোয়েস্ট করা হয়নি।
          </p>
        ) : (
          <div className="space-y-2.5">
            {withdrawals.map((w) => (
              <div
                key={w.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900">
                    ৳{w.amountBdt} • {w.method} ({w.accountNumber})
                  </span>
                  <span className="block text-[11px] text-slate-500">
                    {w.createdAt}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                      w.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : w.status === 'rejected' || w.status === 'cancelled'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {w.status}
                  </span>
                  {w.status === 'pending' && (
                    <button
                      onClick={() => onCancelWithdrawal(w.id)}
                      className="text-rose-600 hover:underline font-bold cursor-pointer"
                    >
                      বাতিল
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 13. NOTIFICATIONS SCREEN
// ============================================================================
interface NotificationsScreenProps {
  notices: NoticeRecord[];
  onBack: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  notices,
  onBack,
}) => {
  return (
    <div className="space-y-5 pb-8">
      <div className="bg-gradient-to-r from-[#042F24] via-[#064E3B] to-[#047857] rounded-3xl p-5 text-white shadow-lg">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl bg-white/15 text-white text-xs font-bold inline-flex items-center gap-1.5 mb-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> ফিরে যান
        </button>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#FBBF24]" /> নোটিফিকেশন ও অফিসিয়াল
          নোটিশ ({notices.length})
        </h2>
        <p className="text-xs text-emerald-100/85 mt-0.5">
          নতুন ব্যবসার আইডিয়া, মেম্বারশিপ অফার ও প্ল্যাটফর্মের গুরুত্বপূর্ণ
          আপডেটসমূহ
        </p>
      </div>

      <div className="space-y-3">
        {notices.map((n) => (
          <div
            key={n.id}
            className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#064E3B] text-[11px] font-bold">
                অফিসিয়াল ঘোষণা
              </span>
              <span className="text-xs text-slate-400">{n.createdAt}</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              {n.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {n.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 14. PROFILE HUB SCREEN
// ============================================================================
interface ProfileScreenProps {
  user: AuthSessionUser;
  ordersCount: number;
  favoritesCount: number;
  onNavigate: (
    screen:
      | 'membership'
      | 'wallet'
      | 'withdrawal'
      | 'referral'
      | 'my_orders'
      | 'favorites'
      | 'notifications'
      | 'settings'
      | 'admin'
  ) => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  ordersCount,
  favoritesCount,
  onNavigate,
  onLogout,
}) => {
  return (
    <div className="space-y-5 pb-8">
      {/* User Header Card */}
      <div className="bg-gradient-to-br from-[#042F24] via-[#064E3B] to-[#047857] rounded-3xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/15 border-2 border-[#D4AF37] flex items-center justify-center text-2xl font-extrabold text-[#FDE68A]">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold">{user.fullName}</h2>
                {user.membershipTier === 'premium' ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 text-[11px] font-extrabold flex items-center gap-1">
                    <Crown className="w-3 h-3" /> প্রিমিয়াম সদস্য
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-emerald-100 text-[11px] font-semibold">
                    সাধারণ সদস্য
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                {user.email} {user.phone ? `• ${user.phone}` : ''}
              </p>
              <p className="text-[11px] text-[#FDE68A] font-mono mt-1">
                রেফারেল কোড: {user.referralCode}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('settings')}
            className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
          >
            <Settings className="w-4 h-4" /> প্রোফাইল ও সেটিংস
          </button>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-white/15">
          <div
            onClick={() => onNavigate('wallet')}
            className="bg-black/25 rounded-2xl p-3 border border-white/10 cursor-pointer hover:bg-black/35"
          >
            <span className="text-[11px] text-emerald-200 block">ওয়ালেট</span>
            <span className="text-lg font-extrabold text-white tabular-nums">
              ৳{user.walletBalance}
            </span>
          </div>
          <div
            onClick={() => onNavigate('wallet')}
            className="bg-black/25 rounded-2xl p-3 border border-white/10 cursor-pointer hover:bg-black/35"
          >
            <span className="text-[11px] text-emerald-200 block">পয়েন্টস</span>
            <span className="text-lg font-extrabold text-[#FDE68A] tabular-nums">
              {user.points} Pts
            </span>
          </div>
          <div
            onClick={() => onNavigate('my_orders')}
            className="bg-black/25 rounded-2xl p-3 border border-white/10 cursor-pointer hover:bg-black/35"
          >
            <span className="text-[11px] text-emerald-200 block">
              আমার অর্ডার
            </span>
            <span className="text-lg font-extrabold text-white tabular-nums">
              {ordersCount}টি
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Menu Grid for All User Panel Screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          {
            id: 'membership',
            title: 'প্রিমিয়াম মেম্বারশিপ — ৳২৯৯',
            sub:
              user.membershipTier === 'premium'
                ? 'সক্রিয় আছে (Active)'
                : 'ভিআইপি গাইড ও বোনাস আনলক করুন',
            icon: <Crown className="w-5 h-5 text-amber-600" />,
            badge: '৳২৯৯',
          },
          {
            id: 'wallet',
            title: 'আমার ওয়ালেট ও পয়েন্টস',
            sub: `ব্যালেন্স: ৳${user.walletBalance} • পয়েন্ট: ${user.points} Pts`,
            icon: <Wallet className="w-5 h-5 text-[#064E3B]" />,
          },
          {
            id: 'withdrawal',
            title: 'টাকা উত্তোলন (Withdrawal)',
            sub: 'বিকাশ, নগদ বা ব্যাংকে টাকা তুলুন',
            icon: <ArrowDownToLine className="w-5 h-5 text-[#059669]" />,
          },
          {
            id: 'referral',
            title: 'রেফারেল প্রোগ্রাম',
            sub: `কোড: ${user.referralCode} (+৳৫০ বোনাস)`,
            icon: <Share2 className="w-5 h-5 text-amber-700" />,
          },
          {
            id: 'my_orders',
            title: 'আমার অর্ডারসমূহ (My Orders)',
            sub: `মার্কেটপ্লেস অর্ডার (${ordersCount}টি)`,
            icon: <Package className="w-5 h-5 text-[#064E3B]" />,
          },
          {
            id: 'favorites',
            title: 'পছন্দের ব্যবসার তালিকা (Favorites)',
            sub: `সেভ করা আইডিয়া (${favoritesCount}টি)`,
            icon: <Heart className="w-5 h-5 text-rose-500" />,
          },
          {
            id: 'notifications',
            title: 'নোটিফিকেশন ও নোটিশ বোর্ড',
            sub: 'অফিসিয়াল ঘোষণা ও আপডেট দেখুন',
            icon: <Bell className="w-5 h-5 text-[#059669]" />,
          },
          {
            id: 'settings',
            title: 'অ্যাকাউন্ট সেটিংস (Settings)',
            sub: 'নাম, মোবাইল নম্বর ও পাসওয়ার্ড পরিবর্তন',
            icon: <Settings className="w-5 h-5 text-slate-700" />,
          },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as any)}
            className="bg-white rounded-2xl p-4 border border-emerald-900/10 shadow-2xs hover:shadow-md hover:border-[#059669] transition flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50/80 border border-emerald-100 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    {item.title}
                  </h4>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{item.sub}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>
        ))}
      </div>

      {/* In standalone User App build (VITE_APP_TARGET === 'user'), Admin is 100% excluded.
          In web preview, only verified Firestore Super Admins see the Admin Panel & App Download card inside Profile. */}
      {import.meta.env.VITE_APP_TARGET !== 'user' && user.isAuthorizedAdmin && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-emerald-50 border-2 border-[#D4AF37] space-y-3 shadow-xs">
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className="w-full flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#064E3B] text-[#FBBF24] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-extrabold text-slate-900">
                    অল্প পুঁজির ব্যবসা Admin (অ্যাডমিন প্যানেলে যান)
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-900 text-[#FDE68A] text-[10px] font-bold">
                    শুধুমাত্র অ্যাডমিন দৃশ্যমান
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  সাধারণ ইউজাররা এই অপশন বা অ্যাডমিন সাইড কখনোই দেখতে পাবে না
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#064E3B]" />
          </button>
        </div>
      )}

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="w-full py-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
      >
        <LogOut className="w-4 h-4" /> অ্যাকাউন্ট থেকে লগআউট করুন
      </button>
    </div>
  );
};

// ============================================================================
// 15. SETTINGS SCREEN
// ============================================================================
interface SettingsScreenProps {
  user: AuthSessionUser;
  onUpdateProfile: (fullName: string, phone: string) => Promise<void>;
  onSendPasswordReset: () => Promise<void>;
  onLogout: () => void;
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  user,
  onUpdateProfile,
  onSendPasswordReset,
  onLogout,
  onBack,
}) => {
  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    setErrorMsg(null);
    if (fullName.trim().length < 2) {
      setErrorMsg('অনুগ্রহ করে সঠিক নাম লিখুন।');
      return;
    }
    setSaving(true);
    try {
      await onUpdateProfile(fullName.trim(), phone.trim());
      setStatusMsg(
        'আপনার প্রোফাইল তথ্য সফলভাবে Firestore ডাটাবেসে আপডেট হয়েছে!'
      );
    } catch (err: any) {
      setErrorMsg(err?.message || 'প্রোফাইল আপডেট করা যায়নি।');
    } finally {
      setSaving(false);
    }
  };

  const handleResetPass = async () => {
    setStatusMsg(null);
    setErrorMsg(null);
    try {
      await onSendPasswordReset();
      setStatusMsg(
        `পাসওয়ার্ড পরিবর্তনের লিংক আপনার ইমেইলে (${user.email}) পাঠানো হয়েছে।`
      );
    } catch (err: any) {
      setErrorMsg(err?.message || 'পাসওয়ার্ড রিসেট ইমেইল পাঠানো যায়নি।');
    }
  };

  return (
    <div className="space-y-5 pb-8">
      <div className="bg-gradient-to-r from-[#042F24] via-[#064E3B] to-[#047857] rounded-3xl p-5 text-white shadow-lg">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl bg-white/15 text-white text-xs font-bold inline-flex items-center gap-1.5 mb-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> প্রোফাইলে ফিরুন
        </button>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#FBBF24]" /> অ্যাকাউন্ট ও প্রোফাইল
          সেটিংস
        </h2>
        <p className="text-xs text-emerald-100/85 mt-0.5">
          আপনার ব্যক্তিগত তথ্য আপডেট ও নিরাপত্তা সেটিংস পরিচালনা করুন
        </p>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          প্রোফাইল তথ্য পরিবর্তন করুন
        </h3>
        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              পূর্ণ নাম (Full Name) *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              মোবাইল নম্বর (Mobile Number)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              ইমেইল অ্যাড্রেস (পরিবর্তনযোগ্য নয়)
            </label>
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-[#064E3B] text-white font-bold text-xs shadow cursor-pointer disabled:opacity-60"
          >
            {saving ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}
          </button>
        </form>
      </div>

      {/* Password & Security Section */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs space-y-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#059669]" /> পাসওয়ার্ড ও সিকিউরিটি
        </h3>
        <p className="text-xs text-slate-600">
          আপনার অ্যাকাউন্টের পাসওয়ার্ড পরিবর্তন করতে নিচের বাটনে ক্লিক করলে
          আপনার ইমেইলে Firebase পাসওয়ার্ড রিসেট লিংক পাঠানো হবে।
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleResetPass}
            className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] border border-emerald-200 text-xs font-bold cursor-pointer"
          >
            পাসওয়ার্ড রিসেট ইমেইল পাঠান
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold cursor-pointer"
          >
            লগআউট করুন
          </button>
        </div>
      </div>
    </div>
  );
};
