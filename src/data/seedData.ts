export const makeSvgDataUri = (
  title: string,
  subtitle: string,
  accent = '#D4AF37',
  themeBg1 = '#042F24',
  themeBg2 = '#065F46'
) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${themeBg1}"/>
          <stop offset="55%" stop-color="#064E3B"/>
          <stop offset="100%" stop-color="${themeBg2}"/>
        </linearGradient>
        <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FEF08A"/>
          <stop offset="50%" stop-color="#FACC15"/>
          <stop offset="100%" stop-color="#D97706"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#bg)"/>
      <circle cx="690" cy="110" r="165" fill="${accent}" opacity="0.18"/>
      <circle cx="110" cy="410" r="190" fill="#10B981" opacity="0.16"/>
      <g opacity="0.24" transform="translate(530, 140)">
        <rect x="0" y="130" width="32" height="90" rx="6" fill="url(#gold)"/>
        <rect x="46" y="95" width="32" height="125" rx="6" fill="url(#gold)"/>
        <rect x="92" y="55" width="32" height="165" rx="6" fill="url(#gold)"/>
        <rect x="138" y="15" width="32" height="205" rx="6" fill="url(#gold)"/>
        <circle cx="185" cy="175" r="38" fill="url(#gold)"/>
        <text x="185" y="188" text-anchor="middle" fill="#042F24" font-family="sans-serif" font-size="38" font-weight="bold">৳</text>
      </g>
      <rect x="38" y="38" width="724" height="424" rx="28" fill="none" stroke="${accent}" stroke-width="2.5" stroke-opacity="0.45"/>
      <rect x="68" y="72" width="190" height="36" rx="18" fill="${accent}" opacity="0.22"/>
      <text x="163" y="96" text-anchor="middle" fill="#FDE68A" font-family="sans-serif" font-size="16" font-weight="bold">অল্প পুঁজির ব্যবসা</text>
      <text x="68" y="215" fill="#FFFFFF" font-family="sans-serif" font-size="40" font-weight="bold">${title}</text>
      <text x="68" y="270" fill="#FDE68A" font-family="sans-serif" font-size="24" font-weight="bold">${subtitle}</text>
      <text x="68" y="405" fill="#A7F3D0" font-family="sans-serif" font-size="18" font-weight="bold">ভেরিফায়েড বিজনেস ও হালাল ইনভেস্টমেন্ট প্ল্যাটফর্ম</text>
    </svg>`
  )}`;

const heroBannerImg =
  'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1000&q=80';
const spiceIdeaImg =
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80';
const teaIdeaImg =
  'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80';
const packagingKitImg =
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80';
const entrepreneurAvatarImg =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80';

export const ASSETS = {
  heroBannerImg,
  spiceIdeaImg,
  teaIdeaImg,
  packagingKitImg,
  entrepreneurAvatarImg,
  fallbackBannerSvg: makeSvgDataUri('অল্প পুঁজির ব্যবসা', 'ছোট পুঁজি • বড় সম্ভাবনা'),
};

export interface CategoryItem {
  id: string;
  nameBn: string;
  nameEn: string;
  iconName: string;
  imageUrl?: string;
  fallbackImageUrl?: string;
  group: 'investment' | 'existing' | 'new' | 'popular' | 'special';
  ideaCount: number;
  enabled: boolean;
  order: number;
  roiHighlight?: string;
  minInvestHighlight?: string;
  expectedRoi?: string;
  minInvestBdt?: number;
  shortDesc?: string;
}

export interface BusinessIdeaItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  shortDescription: string;
  requiredInvestment: string;
  minInvestmentBdt: number;
  expectedDailySales: string;
  expectedMonthlyRevenue: string;
  estimatedExpenses: string;
  estimatedProfit: string;
  difficulty: 'সহজ' | 'মাঝারি' | 'উন্নত';
  requiredEquipment: string;
  requiredLocation: string;
  requiredSkills: string;
  startupSteps: string;
  productSourcing: string;
  marketingStrategy: string;
  risk: string;
  tips: string;
  isPremium: boolean;
  isFeatured: boolean;
  rating: number;
  isInvestmentProject?: boolean;
  roiPercent?: string;
  durationMonths?: string;
  targetCapitalBdt?: number;
  raisedCapitalBdt?: number;
}

export interface UserInvestmentRecord {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  projectId: string;
  projectTitle: string;
  categoryNameBn: string;
  amountBdt: number;
  expectedReturnPercent: number;
  expectedProfitBdt: number;
  durationMonths: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Wallet';
  transactionId: string;
  status: 'pending' | 'active' | 'completed' | 'rejected';
  createdAt: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  category: string;
  tasks: { id: string; text: string; tip: string }[];
}

export interface AdviceArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  content: string[];
  author: string;
}

export interface MarketplaceProductItem {
  id: string;
  title: string;
  category: string;
  priceBdt: number;
  stock: number;
  description: string;
  location: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  imageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  rating: number;
}

export interface SuccessStoryItem {
  id: string;
  entrepreneurName: string;
  businessTitle: string;
  category: string;
  location: string;
  initialInvestment: string;
  monthlyIncome: string;
  growthSummary: string;
  quote: string;
  lessons: string[];
  rating: number;
  avatarUrl: string;
}

export interface ResourceSiteItem {
  id: string;
  name: string;
  category: string;
  descriptionBn: string;
  url: string;
  badge: string;
}

export function getCategoryFallbackImage(nameBn: string, nameEn = ''): string {
  return makeSvgDataUri(nameBn, nameEn || 'অল্প পুঁজির ব্যবসা ক্যাটাগরি', '#FACC15');
}

const RAW_INITIAL_CATEGORIES: CategoryItem[] = [
  // নতুন ৳১৯৯ স্পেশাল ওয়ার্ক ও ইনকাম প্যাকেজ ক্যাটাগরি (User 199 BDT Entry & Admin Controlled)
  {
    id: 'inv-cat-199',
    nameBn: '৳১৯৯ স্পেশাল ওয়ার্ক ও ইনকাম প্যাকেজ',
    nameEn: '199 BDT VIP Work & Profit Package',
    iconName: 'Award',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=700&q=80',
    group: 'investment',
    ideaCount: 5,
    enabled: true,
    order: 0,
    roiHighlight: 'দৈনিক কাজ ও ৳৭৫০+ মাসিক আয়',
    minInvestHighlight: 'প্রবেশ ফি ৳১৯৯',
    expectedRoi: 'দৈনিক ৳২৫–৳৫০ আয় (মাসে ৳৭৫০+)',
    minInvestBdt: 199,
    shortDesc: 'মাত্র ৳১৯৯ দিয়ে প্যাকেজের ভেতর প্রবেশ করে প্রতিদিন প্রোডাক্ট প্রমোশন, অর্ডার ভেরিফিকেশন ও রিসেলিং কাজ করে নিশ্চিত আয় করুন।',
  },
  // ৩টি বিশেষ ইনভেস্টমেন্ট করে ব্যবসা করার ক্যাটাগরি (Admin & User Investment Categories)
  {
    id: 'inv-cat-1',
    nameBn: 'কৃষি ও অ্যাগ্রো ইনভেস্টমেন্ট',
    nameEn: 'Agro & Fisheries Investment',
    iconName: 'Sprout',
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=700&q=80',
    group: 'investment',
    ideaCount: 8,
    enabled: true,
    order: 1,
    roiHighlight: '১৮% – ২২% মুনাফা',
    minInvestHighlight: 'সর্বনিম্ন ৳২,০০০',
    expectedRoi: '১৮% – ২২% হালাল মুনাফা',
    minInvestBdt: 2000,
    shortDesc: 'শরীয়াহ সম্মত মুদারাবা পদ্ধতিতে অ্যাগ্রো, ডেইরি ও মৎস্য খামারে নিরাপদ বিনিয়োগ।',
  },
  {
    id: 'inv-cat-2',
    nameBn: 'ক্ষুদ্র শিল্প ও ফ্যাক্টরি ইনভেস্টমেন্ট',
    nameEn: 'SME & Factory Investment',
    iconName: 'Building2',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=700&q=80',
    group: 'investment',
    ideaCount: 7,
    enabled: true,
    order: 2,
    roiHighlight: '২০% – ২৫% মুনাফা',
    minInvestHighlight: 'সর্বনিম্ন ৳৫,০০০',
    expectedRoi: '২০% – ২৫% প্রফিট শেয়ার',
    minInvestBdt: 5000,
    shortDesc: 'বিএসটিআই অনুমোদিত মসলা, ফুড প্রসেসিং ও ক্ষুদ্র কারখানায় ওয়ার্কিং ক্যাপিটাল বিনিয়োগ।',
  },
  {
    id: 'inv-cat-3',
    nameBn: 'ই-কমার্স ও রিটেইল চেইন ইনভেস্টমেন্ট',
    nameEn: 'E-Commerce & Retail Investment',
    iconName: 'Store',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=700&q=80',
    group: 'investment',
    ideaCount: 9,
    enabled: true,
    order: 3,
    roiHighlight: '১৬% – ২১% মুনাফা',
    minInvestHighlight: 'সর্বনিম্ন ৳৩,০০০',
    expectedRoi: '১৬% – ২১% মাসিক/ত্রৈমাসিক লাভ',
    minInvestBdt: 3000,
    shortDesc: 'হট-সেলিং ই-কমার্স ইমপোর্ট ব্যাচ ও সুপারশপ রিটেইল চেইনের ইনভেন্টরিতে বিনিয়োগ।',
  },

  // ৩০টি ব্যবসার ক্যাটাগরি (প্রতিটির সাথে বাস্তবসম্মত ছবি যুক্ত)
  { id: 'cat-1', nameBn: 'খাবার ও পানীয়', nameEn: 'Food & Beverage', iconName: 'Utensils', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80', group: 'existing', ideaCount: 18, enabled: true, order: 4 },
  { id: 'cat-2', nameBn: 'পোশাক ও ফ্যাশন', nameEn: 'Apparel & Fashion', iconName: 'Shirt', imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80', group: 'existing', ideaCount: 15, enabled: true, order: 5 },
  { id: 'cat-3', nameBn: 'অনলাইন ব্যবসা', nameEn: 'Online Business', iconName: 'Globe', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80', group: 'existing', ideaCount: 22, enabled: true, order: 6 },
  { id: 'cat-4', nameBn: 'কৃষি', nameEn: 'Agriculture', iconName: 'Sprout', imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80', group: 'existing', ideaCount: 14, enabled: true, order: 7 },
  { id: 'cat-5', nameBn: 'মাছ চাষ', nameEn: 'Fisheries', iconName: 'Fish', imageUrl: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=600&q=80', group: 'existing', ideaCount: 9, enabled: true, order: 8 },
  { id: 'cat-6', nameBn: 'বিউটি ও পার্লার', nameEn: 'Beauty & Parlor', iconName: 'Sparkles', imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80', group: 'existing', ideaCount: 11, enabled: true, order: 9 },
  { id: 'cat-7', nameBn: 'ফাস্ট ফুড', nameEn: 'Fast Food', iconName: 'Pizza', imageUrl: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=600&q=80', group: 'popular', ideaCount: 16, enabled: true, order: 10 },
  { id: 'cat-8', nameBn: 'চা/কফি', nameEn: 'Tea & Coffee', iconName: 'Coffee', imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80', group: 'popular', ideaCount: 12, enabled: true, order: 11 },
  { id: 'cat-9', nameBn: 'কসমেটিকস', nameEn: 'Cosmetics', iconName: 'Heart', imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80', group: 'popular', ideaCount: 13, enabled: true, order: 12 },
  { id: 'cat-10', nameBn: 'হাঁস-মুরগি', nameEn: 'Poultry Farming', iconName: 'Bird', imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=600&q=80', group: 'existing', ideaCount: 10, enabled: true, order: 13 },
  { id: 'cat-11', nameBn: 'গবাদিপশু', nameEn: 'Livestock', iconName: 'ShieldCheck', imageUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80', group: 'existing', ideaCount: 8, enabled: true, order: 14 },
  { id: 'cat-12', nameBn: 'ফুল ও নার্সারি', nameEn: 'Nursery & Flowers', iconName: 'Flower2', imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=600&q=80', group: 'new', ideaCount: 9, enabled: true, order: 15 },
  { id: 'cat-13', nameBn: 'হস্তশিল্প', nameEn: 'Handicrafts', iconName: 'Scissors', imageUrl: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=600&q=80', group: 'new', ideaCount: 14, enabled: true, order: 16 },
  { id: 'cat-14', nameBn: 'গিফট ব্যবসা', nameEn: 'Gift & Custom Box', iconName: 'Gift', imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', group: 'new', ideaCount: 11, enabled: true, order: 17 },
  { id: 'cat-15', nameBn: 'মোবাইল ও ইলেকট্রনিক্স', nameEn: 'Mobile & Electronics', iconName: 'Smartphone', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80', group: 'new', ideaCount: 17, enabled: true, order: 18 },
  { id: 'cat-16', nameBn: 'কম্পিউটার ও প্রিন্টিং', nameEn: 'Computer & Printing', iconName: 'Printer', imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80', group: 'new', ideaCount: 12, enabled: true, order: 19 },
  { id: 'cat-17', nameBn: 'ফেসবুক ব্যবসা', nameEn: 'F-Commerce', iconName: 'Share2', imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80', group: 'popular', ideaCount: 25, enabled: true, order: 20 },
  { id: 'cat-18', nameBn: 'ই-কমার্স', nameEn: 'E-Commerce', iconName: 'ShoppingBag', imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80', group: 'popular', ideaCount: 19, enabled: true, order: 21 },
  { id: 'cat-19', nameBn: 'ফ্রিল্যান্সিং', nameEn: 'Freelancing', iconName: 'Laptop', imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80', group: 'new', ideaCount: 15, enabled: true, order: 22 },
  { id: 'cat-20', nameBn: 'ডিজিটাল সার্ভিস', nameEn: 'Digital Services', iconName: 'Zap', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80', group: 'new', ideaCount: 13, enabled: true, order: 23 },
  { id: 'cat-21', nameBn: 'হোম সার্ভিস', nameEn: 'Home Services', iconName: 'Wrench', imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80', group: 'new', ideaCount: 10, enabled: true, order: 24 },
  { id: 'cat-22', nameBn: 'ডেলিভারি', nameEn: 'Local Delivery', iconName: 'Truck', imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80', group: 'new', ideaCount: 8, enabled: true, order: 25 },
  { id: 'cat-23', nameBn: 'কুরিয়ার', nameEn: 'Courier Agency', iconName: 'Package', imageUrl: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=80', group: 'new', ideaCount: 7, enabled: true, order: 26 },
  { id: 'cat-24', nameBn: 'দোকানভিত্তিক ব্যবসা', nameEn: 'Retail Shop', iconName: 'Store', imageUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=600&q=80', group: 'existing', ideaCount: 20, enabled: true, order: 27 },
  { id: 'cat-25', nameBn: 'ঘরে বসে ব্যবসা', nameEn: 'Home-based Business', iconName: 'Home', imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80', group: 'special', ideaCount: 24, enabled: true, order: 28 },
  { id: 'cat-26', nameBn: 'মৌসুমি ব্যবসা', nameEn: 'Seasonal Business', iconName: 'Sun', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80', group: 'special', ideaCount: 11, enabled: true, order: 29 },
  { id: 'cat-27', nameBn: 'গ্রামভিত্তিক ব্যবসা', nameEn: 'Rural Business', iconName: 'Trees', imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80', group: 'special', ideaCount: 16, enabled: true, order: 30 },
  { id: 'cat-28', nameBn: 'শহরভিত্তিক ব্যবসা', nameEn: 'Urban Business', iconName: 'Building2', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80', group: 'special', ideaCount: 18, enabled: true, order: 31 },
  { id: 'cat-29', nameBn: 'নারীদের জন্য ব্যবসা', nameEn: 'Women Entrepreneurs', iconName: 'Award', imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80', group: 'special', ideaCount: 21, enabled: true, order: 32 },
  { id: 'cat-30', nameBn: 'শিক্ষার্থীদের জন্য ব্যবসা', nameEn: 'Student Business', iconName: 'GraduationCap', imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80', group: 'special', ideaCount: 17, enabled: true, order: 33 },
];

export const INITIAL_CATEGORIES: CategoryItem[] = RAW_INITIAL_CATEGORIES.map(
  (c) => ({
    ...c,
    imageUrl: c.imageUrl || getCategoryFallbackImage(c.nameBn, c.nameEn),
    fallbackImageUrl:
      c.fallbackImageUrl || getCategoryFallbackImage(c.nameBn, c.nameEn),
  })
);

export const INITIAL_BUSINESS_IDEAS: BusinessIdeaItem[] = [
  {
    id: 'inv-idea-199',
    title: '৳১৯৯ ভিআইপি ওয়ার্ক ও ডেইলি ইনকাম প্যাকেজ (প্যাকেজ রুম অ্যাক্সেস)',
    category: '৳১৯৯ স্পেশাল ওয়ার্ক ও ইনকাম প্যাকেজ',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'মাত্র ৳১৯৯ দিয়ে এই স্পেশাল প্যাকেজটি কিনে ভেতরে প্রবেশ করুন এবং প্রতিদিন ৩টি বাস্তব প্রোডাক্ট প্রমোশন, রিসেল শেয়ার ও মার্কেট রিভিউ টাস্ক সম্পন্ন করে দৈনিক নিশ্চিত আয় সরাসরি ওয়ালেটে নিন।',
    requiredInvestment: '৳১৯৯ (প্যাকেজ অ্যাক্টিভেশন ফি)',
    minInvestmentBdt: 199,
    expectedDailySales: 'দৈনিক ৳২৫ – ৳১৫০+ আয়',
    expectedMonthlyRevenue: '৳৭৫০ – ৳৩,৫০০+ মাসিক আয়',
    estimatedExpenses: 'এককালীন মাত্র ৳১৯৯ প্রবেশ ফি',
    estimatedProfit: 'প্রতিদিন টাস্ক বোনাস + প্রতি রিসেল অর্ডারে ৳১৫০ কমিশন',
    difficulty: 'সহজ',
    requiredEquipment: 'শুধুমাত্র আপনার হাতের স্মার্টফোন ও ইন্টারনেট সংযোগ।',
    requiredLocation: 'ঘরে বসে অ্যাপের ভেতর প্যাকেজ রুমে প্রবেশ করে প্রতিদিন ১০ মিনিট কাজ।',
    requiredSkills: 'কোনো পূর্ব অভিজ্ঞতার প্রয়োজন নেই; প্যাকেজের ভেতরে সব কাজ তৈরি দেওয়া আছে।',
    startupSteps: '১. ৳১৯৯ দিয়ে প্যাকেজটি আনলক করুন\n২. প্যাকেজের ভেতরে প্রবেশ করে দৈনিক ৩টি কাজের টাস্ক সম্পূর্ণ করুন\n৩. সাথে সাথে আপনার ওয়ালেটে আয়ের টাকা জমা হয়ে যাবে এবং বিকাশ/নগদে উত্তোলন করতে পারবেন।',
    productSourcing: 'অ্যাপের নিজস্ব ভেরিফায়েড পাইকারি পণ্য ও স্পন্সরড ব্র্যান্ড প্রমোশন।',
    marketingStrategy: '১-ক্লিকে প্রোডাক্ট কপি ও শেয়ার করে অতিরিক্ত রিসেলার কমিশন আয়।',
    risk: 'কোনো ঝুঁকি নেই; জয়েন করলেই থাকছে ওয়েলকাম বোনাস ও ডেইলি আর্নিং টাস্ক।',
    tips: 'প্রতিদিন নিয়মিত ৩টি টাস্ক সম্পন্ন করলে মাস শেষে অতিরিক্ত পারফরম্যান্স বোনাস যোগ হয়।',
    isPremium: false,
    isFeatured: true,
    rating: 5.0,
    isInvestmentProject: true,
    roiPercent: '৩০০%+',
    durationMonths: '১ মাস (রিনিউযোগ্য)',
    targetCapitalBdt: 199000,
    raisedCapitalBdt: 168500,
  },
  {
    id: 'inv-idea-1',
    title: 'স্মার্ট ডেইরি ও গরু মোটাতাজাকরণ অ্যাগ্রো ইনভেস্টমেন্ট প্রজেক্ট',
    category: 'কৃষি ও অ্যাগ্রো ইনভেস্টমেন্ট',
    imageUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'শরীয়াহ সম্মত মুদারাবা পদ্ধতিতে আধুনিক খামারে গরু মোটাতাজাকরণ ও দুগ্ধ প্রকল্পে বিনিয়োগ করে প্রতি ৬ মাসে ১৮%–২২% হালাল মুনাফা অর্জন।',
    requiredInvestment: '৳২,০০০ – ৳৫০,০০০ (শেয়ার ইনভেস্টমেন্ট)',
    minInvestmentBdt: 2000,
    expectedDailySales: '৳১৫,০০০ – ৳২৫,০০০ (খামার আয়)',
    expectedMonthlyRevenue: '১৮% – ২২% নিট মুনাফা (৬ মাসে)',
    estimatedExpenses: 'খামার পরিচালনা ও ভেটেরিনারি বীমা অন্তর্ভুক্ত',
    estimatedProfit: 'প্রতি ৳১০,০০০ বিনিয়োগে ৳১,৮০০ – ৳২,২০০ মুনাফা',
    difficulty: 'সহজ',
    requiredEquipment: 'নিজে কোনো যন্ত্রপাতি কিনতে হবে না; নিবন্ধিত অ্যাগ্রো খামার সরাসরি পরিচালনা করবে।',
    requiredLocation: 'সিরাজগঞ্জ ও বগুড়ার নিজস্ব ভেরিফায়েড অ্যাগ্রো ফার্ম (অ্যাপ থেকে লাইভ ট্র্যাকিং)।',
    requiredSkills: 'কোনো পূর্ব অভিজ্ঞতার প্রয়োজন নেই; অ্যাপের ড্যাশবোর্ডে বিনিয়োগ ও মুনাফা সরাসরি যুক্ত হবে।',
    startupSteps: '১. প্রজেক্ট ও বিনিয়োগের পরিমাণ (সর্বনিম্ন ৳২,০০০) নির্বাচন করুন\n২. বিকাশ/নগদ বা ওয়ালেট থেকে ইনভেস্টমেন্ট কনফার্ম করুন\n৩. অ্যাডমিন ভেরিফিকেশনের পর ডিজিটাল ইনভেস্টমেন্ট সার্টিফিকেট গ্রহণ\n৪. মেয়াদ শেষে আসল ও মুনাফা সরাসরি ওয়ালেটে বা বিকাশে উত্তোলন।',
    productSourcing: 'উন্নত জাতের দেশি ও শাহীওয়াল গরু এবং নিজস্ব ঘাস ও দানাদার খাদ্য উৎপাদন।',
    marketingStrategy: 'কোরবানি হাট, সুপারশপ মিট সাপ্লাই এবং পাইকারি মাংস ব্যবসায়ীদের কাছে সরাসরি বিক্রয়।',
    risk: 'পশুচিকিৎসক তত্ত্বাবধান ও লাইভস্টক ইন্স্যুরেন্স থাকায় মূলধন ঝুঁকি অত্যন্ত সীমিত।',
    tips: 'একসাথে বড় অংক বিনিয়োগ না করে ৩টি ভিন্ন ইনভেস্টমেন্ট ক্যাটাগরিতে ভাগ করে বিনিয়োগ করা সবচেয়ে বুদ্ধিমানের কাজ।',
    isPremium: false,
    isFeatured: true,
    rating: 4.9,
    isInvestmentProject: true,
    roiPercent: '২০%',
    durationMonths: '৬ মাস',
    targetCapitalBdt: 500000,
    raisedCapitalBdt: 345000,
  },
  {
    id: 'inv-idea-2',
    title: 'অটোমেটিক মসলা ও ফুড প্যাকেজিং ফ্যাক্টরি ইনভেস্টমেন্ট',
    category: 'ক্ষুদ্র শিল্প ও ফ্যাক্টরি ইনভেস্টমেন্ট',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'বিএসটিআই অনুমোদিত গুঁড়া মসলা, সরিষার তেল ও কনজিউমার ফুড প্রসেসিং কারখানার ওয়ার্কিং ক্যাপিটালে বিনিয়োগ করে প্রতি মাসে লভ্যাংশ আয়।',
    requiredInvestment: '৳৫,০০০ – ৳১,০০,০০০ (ফ্যাক্টরি শেয়ার)',
    minInvestmentBdt: 5000,
    expectedDailySales: '৳৪০,০০০ – ৳৭৫,০০০ (ফ্যাক্টরি ডিস্ট্রিবিউশন)',
    expectedMonthlyRevenue: '২০% – ২৫% মুনাফা (৬ মাসে)',
    estimatedExpenses: 'কাঁচামাল ক্রয়, ফ্যাক্টরি প্যাকিং ও ডিলার সাপ্লাই খরচ অন্তর্ভুক্ত',
    estimatedProfit: 'প্রতি ৳১০,০০০ বিনিয়োগে ৳২,০০০ – ৳২,৫০০ মুনাফা',
    difficulty: 'সহজ',
    requiredEquipment: 'কারখানার অটোমেটিক পালভারাইজার, অয়েল এক্সপেলার ও পাউচ প্যাকিং মেশিন দ্বারা পরিচালিত।',
    requiredLocation: 'নারায়ণগঞ্জ ও গাজীপুর বিসিক শিল্প নগরী প্রজেক্ট।',
    requiredSkills: 'উদ্যোক্তা ইনভেস্টর হিসেবে শুধু ক্যাপিটাল সাপোর্ট প্রদান।',
    startupSteps: '১. ক্ষুদ্র শিল্প ক্যাটাগরিতে আপনার পছন্দের অংক (সর্বনিম্ন ৳৫,০০০) ইনভেস্ট করুন\n২. ট্রানজেকশন আইডি দিয়ে রিকোয়েস্ট সাবমিট করুন\n৩. প্রতি মাসের বিক্রি থেকে অর্জিত লভ্যাংশ সরাসরি অ্যাপ ওয়ালেটে গ্রহণ করুন।',
    productSourcing: 'বগুড়ার মরিচ, পাবনার সরিষা ও দিনাজপুরের সুগন্ধি চাল সরাসরি কৃষক পর্যায় থেকে সংগ্রহ।',
    marketingStrategy: 'সারাদেশে ৪৫০+ মুদি দোকান ও ডিলার নেটওয়ার্কে নিয়মিত পাইকারি সরবরাহ।',
    risk: 'নিত্যপ্রয়োজনীয় ভোগ্যপণ্য হওয়ায় সারা বছরই স্থিতিশীল চাহিদা ও নিশ্চিত ক্যাশ-ফ্লো থাকে।',
    tips: '৬ মাসের মেয়াদে বিনিয়োগ করলে বোনাস পয়েন্ট ও অগ্রাধিকার লভ্যাংশ পাওয়া যায়।',
    isPremium: false,
    isFeatured: true,
    rating: 4.9,
    isInvestmentProject: true,
    roiPercent: '২২%',
    durationMonths: '৬ মাস',
    targetCapitalBdt: 800000,
    raisedCapitalBdt: 610000,
  },
  {
    id: 'inv-idea-3',
    title: 'ই-কমার্স ইমপোর্ট ব্যাচ ও সুপারশপ চেইন ইনভেস্টমেন্ট',
    category: 'ই-কমার্স ও রিটেইল চেইন ইনভেস্টমেন্ট',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'চায়না ও স্থানীয় গার্মেন্টস থেকে হট-সেলিং পণ্য বাল্ক ইমপোর্ট এবং সুপারশপ চেইনের ইনভেন্টরিতে বিনিয়োগ করে ৩ মাসে দ্রুত রিটার্ন।',
    requiredInvestment: '৳৩,০০০ – ৳৭৫,০০০ (ইনভেন্টরি শেয়ার)',
    minInvestmentBdt: 3000,
    expectedDailySales: '৳৩০,০০০ – ৳৬০,০০০ (অনলাইন ও শোরুম সেল)',
    expectedMonthlyRevenue: '১৬% – ২১% মুনাফা (৩–৬ মাসে)',
    estimatedExpenses: 'কাস্টমস, ওয়্যারহাউস ও কুরিয়ার লজিস্টিকস খরচ অন্তর্ভুক্ত',
    estimatedProfit: 'প্রতি ৳১০,০০০ বিনিয়োগে ৳১,৬০০ – ৳২,১০০ মুনাফা',
    difficulty: 'সহজ',
    requiredEquipment: 'কেন্দ্রীয় ওয়্যারহাউস, পস সফটওয়্যার ও ডেডিকেটেড সেলস টিম।',
    requiredLocation: 'ঢাকা (উত্তরা ও মিরপুর হাব) এবং চট্টগ্রাম রিটেইল চেইন।',
    requiredSkills: 'অ্যাপের মাধ্যমে ইনভেস্টমেন্ট পোর্টফোলিও পর্যবেক্ষণ।',
    startupSteps: '১. ই-কমার্স ও রিটেইল চেইন ক্যাটাগরি নির্বাচন করুন\n২. ন্যূনতম ৳৩,০০০ থেকে যেকোনো অংক ইনভেস্ট করুন\n৩. ৩ মাস পর মূলধনসহ লভ্যাংশ ওয়ালেট থেকে বিকাশ/নগদে উত্তোলন করুন।',
    productSourcing: 'সরাসরি ফ্যাক্টরি ও আলীবাবা ভেরিফায়েড সাপ্লায়ার থেকে বাল্ক লট সংগ্রহ।',
    marketingStrategy: 'দারাজ মল, ফেসবুক অ্যাড ক্যাম্পেইন ও ৬টি আউটলেটে সরাসরি খুচরা বিক্রি।',
    risk: 'ফাস্ট-মুভিং পণ্য হওয়ায় স্টক আটকে থাকার ঝুঁকি নেই।',
    tips: 'স্বল্প মেয়াদে (৩ মাসে) দ্রুত রিটার্ন পেতে এই ক্যাটাগরিটি সবচেয়ে উপযোগী।',
    isPremium: false,
    isFeatured: true,
    rating: 4.8,
    isInvestmentProject: true,
    roiPercent: '১৮%',
    durationMonths: '৩ মাস',
    targetCapitalBdt: 600000,
    raisedCapitalBdt: 475000,
  },
  {
    id: 'idea-1',
    title: 'ঘরে বসে খাঁটি মসলা ও গুঁড়া মসলার ব্যবসা',
    category: 'ঘরে বসে ব্যবসা',
    imageUrl: spiceIdeaImg,
    shortDescription: 'ভেজালমুক্ত হলুদ, মরিচ, ধনিয়া ও গরম মসলা প্রসেসিং এবং ফুড-গ্রেড জারে প্যাকিং করে অনলাইন ও লোকাল দোকানে বিক্রি।',
    requiredInvestment: '৳৫,০০০ – ৳১৫,০০০',
    minInvestmentBdt: 5000,
    expectedDailySales: '৳১,২০০ – ৳২,৫০০',
    expectedMonthlyRevenue: '৳৩৬,০০০ – ৳৭৫,০০০',
    estimatedExpenses: '৳২৫,০০০ – ৳৪৮,০০০',
    estimatedProfit: '৳১০,০০০ – ৳২৫,০০০',
    difficulty: 'সহজ',
    requiredEquipment: 'হেভি-ডিউটি ব্লেন্ডার বা স্থানীয় মিলিং, ডিজিটাল ওয়েট স্কেল, হিট সিলার মেশিন, ফুড গ্রেড পাউচ ও জার, ব্র্যান্ড স্টিকার।',
    requiredLocation: 'নিজ বাসার একটি পরিষ্কার ও শুষ্ক কক্ষ (১০০ বর্গফুট যথেষ্ট)।',
    requiredSkills: 'খাঁটি কাঁচামাল চেনা, স্বাস্থ্যসম্মত প্যাকিং এবং ফেসবুক পেজ পরিচালনা।',
    startupSteps: '১. পাইকারি বাজার থেকে শুকনো মরিচ, হলুদ ও জিরা সংগ্রহ\n২. রোদে শুকিয়ে পরিষ্কার মিলে ভাঙানো\n৩. ১০০ গ্রাম ও ২৫০ গ্রাম স্ট্যান্ড-আপ পাউচে সিল করা\n৪. ফেসবুক পেজ ও স্থানীয় মুদি দোকানে স্যাম্পল দেওয়া।',
    productSourcing: 'ঢাকার শ্যামবাজার, কারওয়ান বাজার, বগুড়া বা ফরিদপুরের স্থানীয় পাইকারি হাট; জার ও পাউচ চকবাজার থেকে।',
    marketingStrategy: 'মসলা ভাঙানোর লাইভ ভিডিও ফেসবুক রিলসে আপলোড করুন। প্রথম ৫০ জন কাস্টমারকে ১০% ছাড় ও ফ্রি হোম ডেলিভারি অফার দিন।',
    risk: 'বর্ষাকালে আর্দ্রতার কারণে মসলা দলা বেঁধে যাওয়া। সমাধান: এয়ারটাইট জিপার পাউচ ও সিলিকা জেল ব্যবহার।',
    tips: 'হলুদ ও মরিচের পাশাপাশি স্পেশাল বিরিয়ানি ও মেজবানি মসলা মিক্স তৈরি করলে দ্বিগুণ লাভ পাওয়া যায়।',
    isPremium: false,
    isFeatured: true,
    rating: 4.9,
  },
  {
    id: 'idea-2',
    title: 'আধুনিক মাটির কাপের তন্দুরি ও মালাই চা স্টল',
    category: 'চা/কফি',
    imageUrl: teaIdeaImg,
    shortDescription: 'কলেজ, বিশ্ববিদ্যালয় বা অফিস মোড়ে নান্দনিক কার্টে মালাই চা, তন্দুরি চা, মাসালা চা ও কফি বিক্রির লাভজনক ব্যবসা।',
    requiredInvestment: '৳১০,০০০ – ৳৩০,০০০',
    minInvestmentBdt: 10000,
    expectedDailySales: '৳২,০০০ – ৳৪,৫০০',
    expectedMonthlyRevenue: '৳৬০,০০০ – ৳১,২০,০০০',
    estimatedExpenses: '৳৩৫,০০০ – ৳৭০,০০০',
    estimatedProfit: '৳২২,০০০ – ৳৪৫,০০০',
    difficulty: 'সহজ',
    requiredEquipment: 'কাস্টমাইজড ফুড কার্ট/স্টল, গ্যাস স্টোভ ও সিলিন্ডার, পিতলের কেটলি, মাটির কাপ (ওয়ান টাইম), ফ্লাস্ক ও লাইটিং।',
    requiredLocation: 'বিশ্ববিদ্যালয় গেট, কোচিং সেন্টার এলাকা, বাজারের মোড় বা বাস স্ট্যান্ড (৪০–৬০ বর্গফুট)।',
    requiredSkills: 'সুস্বাদু চায়ের রেসিপি এবং দ্রুত কাস্টমার সার্ভিস।',
    startupSteps: '১. জনসমাগমপূর্ণ জায়গা নির্বাচন\n২. আকর্ষণীয় ব্যানার ও কার্ট তৈরি\n৩. শ্রীমঙ্গলের সেরা চা পাতা ও খাঁটি দুধের সাপ্লাই নিশ্চিত করা\n৪. সন্ধ্যায় ওয়ার্ম লাইটিংসহ স্টল চালু করা।',
    productSourcing: 'শ্রীমঙ্গল বা চট্টগ্রামের অকশন ব্রোকার থেকে চা পাতা; মাটির কাপ সাভার বা স্থানীয় কুমারপাড়া থেকে পাইকারি ক্রয়।',
    marketingStrategy: 'চায়ের স্বাদ ও পরিবেশন স্টাইল ভিডিও করে লোকাল ফুড ব্লগারদের আমন্ত্রণ জানান। "৫ কাপের সাথে ১ কাপ ফ্রি" লয়্যালটি কার্ড দিন।',
    risk: 'বৃষ্টির দিনে কাস্টমার কমে যাওয়া। সমাধান: কার্টের উপরে বড় ছাতা বা ক্যানোপি রাখা এবং অনলাইন/অফিস ফ্লাস্ক ডেলিভারি চালু রাখা।',
    tips: 'চায়ের পাশাপাশি বিস্কুট, ব্রাউনি বা ওয়াফেল রাখলে প্রতি কাস্টমারের বিল ৪০% বৃদ্ধি পায়।',
    isPremium: false,
    isFeatured: true,
    rating: 4.8,
  },
  {
    id: 'idea-3',
    title: 'ফেসবুক ও অনলাইন বুটিক পোশাক ব্যবসা (F-Commerce)',
    category: 'ফেসবুক ব্যবসা',
    imageUrl: heroBannerImg,
    shortDescription: 'হাতের কাজের থ্রি-পিস, কুর্তি, পাঞ্জাবি ও বেবি ড্রেস পাইকারি কিনে বা কাস্টম ডিজাইন করে ফেসবুক পেজের মাধ্যমে সারাদেশে ডেলিভারি।',
    requiredInvestment: '৳১৫,০০০ – ৳৫০,০০০',
    minInvestmentBdt: 15000,
    expectedDailySales: '৳৩,০০০ – ৳৮,০০০',
    expectedMonthlyRevenue: '৳৯০,০০০ – ৳২,৪০,০০০',
    estimatedExpenses: '৳৬০,০০০ – ৳১,৭০,০০০',
    estimatedProfit: '৳২৫,০০০ – ৳৬৫,০০০',
    difficulty: 'মাঝারি',
    requiredEquipment: 'স্মার্টফোন (ভালো ক্যামেরা), রিং লাইট, স্টিম আয়রন, কুরিয়ার পলি ব্যাগ ও প্রিন্টেড ইনভয়েস।',
    requiredLocation: 'বাসা থেকেই পরিচালনা করা সম্ভব।',
    requiredSkills: 'ফেসবুক লাইভ/ভিডিও প্রেজেন্টেশন, কাপড়ের মান বোঝা এবং মেসেঞ্জার কাস্টমার কেয়ার।',
    startupSteps: '১. নির্দিষ্ট নিশ (যেমন: সুতি অফিস কুর্তি বা বাচ্চাদের পোশাক) নির্বাচন\n২. ইসলামপুর বা বাবুরহাট থেকে ১৫-২০ পিস স্যাম্পল লট কেনা\n৩. দিনের আলোয় পরিষ্কার ছবি ও শর্ট ভিডিও ধারণ\n৪. Steadfast বা Pathao কুরিয়ারে মার্চেন্ট অ্যাকাউন্ট খোলা।',
    productSourcing: 'ঢাকার ইসলামপুর, নারায়ণগঞ্জের ভুলতা গাউছিয়া, নরসিংদীর বাবুরহাট এবং যশোরের নকশিকাঁথা কারিগর।',
    marketingStrategy: 'সপ্তাহে ৩ দিন নির্দিষ্ট সময়ে ফেসবুক লাইভ করুন এবং কাস্টমারদের রিভিউ স্ক্রিনশট পেজে পিন করে রাখুন।',
    risk: 'ক্যাশ অন ডেলিভারিতে পার্সেল রিটার্ন হওয়া। সমাধান: অর্ডার কনফার্মের সময় ফোনে সাইজ যাচাই করা অথবা ডেলিভারি চার্জ অগ্রিম নেওয়া।',
    tips: 'ঈদ, পূজা ও পহেলা বৈশাখের অন্তত ৪৫ দিন আগে নতুন কালেকশন স্টক করলে সর্বোচ্চ মুনাফা পাওয়া যায়।',
    isPremium: false,
    isFeatured: false,
    rating: 4.7,
  },
  {
    id: 'idea-4',
    title: 'ইকো-ফ্রেন্ডলি প্যাকেজিং ও কুরিয়ার সাপ্লাই হাব',
    category: 'ই-কমার্স',
    imageUrl: packagingKitImg,
    shortDescription: 'হাজারো অনলাইন উদ্যোক্তাদের জন্য কুরিয়ার পলি, বাবল র‍্যাপ, স্ট্যান্ড-আপ পাউচ, কার্টন বক্স ও স্কচটেপ পাইকারি ও খুচরা সরবরাহ।',
    requiredInvestment: '৳২০,০০০ – ৳৬০,০০০',
    minInvestmentBdt: 20000,
    expectedDailySales: '৳৩,৫০০ – ৳৭,০০০',
    expectedMonthlyRevenue: '৳১,০৫,০০০ – ৳২,১০,০০০',
    estimatedExpenses: '৳৭৫,০০০ – ৳১,৫০,০০০',
    estimatedProfit: '৳২৮,০০০ – ৳৫৫,০০০',
    difficulty: 'সহজ',
    requiredEquipment: 'স্টোরেজ র‍্যাক, ওজন মাপার মেশিন, স্ক্রিন প্রিন্টিং ফ্রেম (লোগো প্রিন্টের জন্য)।',
    requiredLocation: 'বাসার নিচতলা বা ছোট গোডাউন (১২০ বর্গফুট)।',
    requiredSkills: 'বিটুবি (B2B) নেটওয়ার্কিং এবং উদ্যোক্তা কমিউনিটিতে যোগাযোগ।',
    startupSteps: '১. চকবাজার ও আরমানিটোলা থেকে ফ্যাক্টরি রেটে পলি ও পাউচ সংগ্রহ\n২. ৫০ পিস বা ১০০ পিসের "স্টার্টার কম্বো প্যাক" তৈরি\n৩. নারী ও তরুণ উদ্যোক্তা ফেসবুক গ্রুপগুলোতে পোস্ট করা।',
    productSourcing: 'পুরান ঢাকার চকবাজার, লালবাগ প্লাস্টিক জোন এবং মিটফোর্ড।',
    marketingStrategy: 'নতুন উদ্যোক্তাদের জন্য "৳৯৯৯ স্টার্টার প্যাকেজিং কিট" অফার দিন। একবার সন্তুষ্ট হলে প্রতি মাসে রিপিট অর্ডার পাবেন।',
    risk: 'নষ্ট হওয়ার কোনো ঝুঁকি নেই (Non-perishable পণ্য)।',
    tips: 'প্যাকেটের গায়ে ১ কালার লোগো প্রিন্ট করে দেওয়ার সুবিধা রাখলে প্রতি পিসে অতিরিক্ত ২-৩ টাকা লাভ থাকে।',
    isPremium: true,
    isFeatured: true,
    rating: 4.9,
  },
  {
    id: 'idea-5',
    title: 'বায়োফ্লক ও আধুনিক পুকুরে দেশি মাছ চাষ',
    category: 'মাছ চাষ',
    imageUrl: heroBannerImg,
    shortDescription: 'অল্প জায়গায় ট্যাংক বা ছোট পুকুরে শিং, মাগুর, পাবদা ও গুলশা মাছের বৈজ্ঞানিক পদ্ধতিতে চাষ ও স্থানীয় বাজারে সরবরাহ।',
    requiredInvestment: '৳২৫,০০০ – ৳৮০,০০০',
    minInvestmentBdt: 25000,
    expectedDailySales: '৳২,৫০০ – ৳৫,০০০ (গড়)',
    expectedMonthlyRevenue: '৳৭০,০০০ – ৳১,৫০,০০০',
    estimatedExpenses: '৳৪৫,০০০ – ৳৯৫,০০০',
    estimatedProfit: '৳২৫,০০০ – ৳৫৫,০০০',
    difficulty: 'উন্নত',
    requiredEquipment: 'তারপলিন ট্যাংক বা পুকুর, এয়ার পাম্প, টিডিএস ও পিএইচ মিটার, উন্নত মানের ভাসমান ফিড।',
    requiredLocation: 'গ্রামের বাড়ির উঠান বা ছোট পুকুর পাড়।',
    requiredSkills: 'পানির অ্যামোনিয়া ও পিএইচ নিয়ন্ত্রণ এবং নিয়মিত খাবার ব্যবস্থাপনা।',
    startupSteps: '১. উপজেলা মৎস্য অফিস থেকে সংক্ষিপ্ত প্রশিক্ষণ গ্রহণ\n২. ট্যাংক বা পুকুর প্রস্তুত ও প্রোবায়োটিক প্রয়োগ\n৩. ময়মনসিংহের বিশ্বস্ত হ্যাচারি থেকে সুস্থ পোনা সংগ্রহ\n৪. ৪ মাসে বাজারজাতকরণ।',
    productSourcing: 'ময়মনসিংহ ত্রিশাল হ্যাচারি (পোনা), মেগা/নারিশ ফিশ ফিড।',
    marketingStrategy: 'জীবন্ত দেশি মাছ স্থানীয় আড়ত এবং শহরের সুপারশপে সরাসরি সরবরাহ করুন।',
    risk: 'বিদ্যুৎ বিভ্রাট বা পানির গুণাগুণ নষ্ট হওয়া। সমাধান: আইপিএস/ব্যাটারি ব্যাকআপ রাখা এবং প্রতিদিন পিএইচ টেস্ট করা।',
    tips: 'দেশি শিং ও পাবদা মাছ জীবন্ত অবস্থায় বাজারে নিলে কেজিপ্রতি ৮০-১০০ টাকা বেশি দাম পাওয়া যায়।',
    isPremium: true,
    isFeatured: false,
    rating: 4.6,
  },
  {
    id: 'idea-6',
    title: 'কম্পিউটার কম্পোজ, ছবি প্রিন্ট ও অনলাইন আবেদন সেবা',
    category: 'কম্পিউটার ও প্রিন্টিং',
    imageUrl: packagingKitImg,
    shortDescription: 'স্কুল-কলেজ বা ইউনিয়ন পরিষদের পাশে চাকরির আবেদন, পাসপোর্ট/ভিসা ফর্ম, সিভি তৈরি ও কালার প্রিন্টিং সার্ভিস।',
    requiredInvestment: '৳২৫,০০০ – ৳৫৫,০০০',
    minInvestmentBdt: 25000,
    expectedDailySales: '৳১,৫০০ – ৳৩,৫০০',
    expectedMonthlyRevenue: '৳৪৫,০০০ – ৳৯০,০০০',
    estimatedExpenses: '৳১৫,০০০ – ৳৩০,০০০',
    estimatedProfit: '৳৩০,০০০ – ৳৬০,০০০',
    difficulty: 'সহজ',
    requiredEquipment: 'ডেস্কটপ পিসি বা ল্যাপটপ, ইপসন কালার ইনক-ট্যাংক প্রিন্টার, স্ক্যানার ও লেমিনেটিং মেশিন।',
    requiredLocation: 'স্কুল, কলেজ বা সরকারি অফিসের সামনে ছোট দোকান।',
    requiredSkills: 'বাংলা-ইংরেজি টাইপিং, ফটোশপ বেসিক ও সরকারি পোর্টালে ফর্ম পূরণ।',
    startupSteps: '১. লোকেশন ও দোকান ভাড়া\n২. কম্পিউটার ও ইনক-ট্যাংক প্রিন্টার সেটআপ\n৩. চাকরির সার্কুলার চার্ট বোর্ডে টানিয়ে রাখা\n৪. বিকাশ/নগদ পেমেন্ট চালু করা।',
    productSourcing: 'ঢাকার মাল্টিপ্ল্যান সেন্টার (এলিফ্যান্ট রোড) বা বিসিএস কম্পিউটার সিটি; কাগজ নয়াবাজার থেকে।',
    marketingStrategy: 'শিক্ষার্থীদের জন্য "সিভি + ৪ কপি ছবি মাত্র ৳১০০" প্যাকেজ দিন।',
    risk: 'খুবই কম ঝুঁকি; কাগজের অপচয় রোধ করলেই ৮০% মার্জিন থাকে।',
    tips: 'দোকানে স্টেশনারি আইটেম (কলম, ফাইল, খাম) রাখলে বাড়তি আয় নিশ্চিত হয়।',
    isPremium: false,
    isFeatured: false,
    rating: 4.8,
  },
];

export const INITIAL_CHECKLISTS: ChecklistItem[] = [
  {
    id: 'chk-startup',
    title: 'ব্যবসা শুরুর পূর্ণাঙ্গ চেকলিস্ট (Startup Checklist)',
    category: 'প্রাথমিক প্রস্তুতি',
    tasks: [
      { id: 't1', text: 'আপনার পুঁজি ও মাসিক খরচের বাজেট চূড়ান্ত করুন', tip: 'মোট পুঁজির অন্তত ২০% জরুরি তহবিল হিসেবে আলাদা রাখুন।' },
      { id: 't2', text: 'স্থানীয় বাজারে চাহিদা ও প্রতিযোগী বিশ্লেষণ করুন', tip: 'অন্তত ৫ জন সম্ভাব্য কাস্টমারের সাথে কথা বলুন।' },
      { id: 't3', text: 'ব্যবসার একটি সুন্দর ও সহজে মনে রাখার মতো নাম নির্বাচন করুন', tip: 'ফেসবুক পেজ ও ডোমেইন খালি আছে কিনা দেখে নিন।' },
      { id: 't4', text: 'পাইকারি সাপ্লায়ার (৩ জন বিকল্পসহ) তালিকাভুক্ত করুন', tip: 'একজন সাপ্লায়ারের ওপর নির্ভর করবেন না।' },
      { id: 't5', text: 'ট্রেড লাইসেন্স ও বিকাশ/নগদ মার্চেন্ট অ্যাকাউন্ট খুলুন', tip: 'ইউনিয়ন পরিষদ, পৌরসভা বা সিটি কর্পোরেশন থেকে ট্রেড লাইসেন্স নিন।' },
      { id: 't6', text: 'প্রাথমিক স্যাম্পল বা প্রথম ব্যাচ পণ্য প্রস্তুত করুন', tip: 'ছোট ব্যাচে শুরু করে কাস্টমার ফিডব্যাক নিন।' },
    ],
  },
  {
    id: 'chk-sourcing',
    title: 'পণ্য সোর্সিং ও পাইকারি ক্রয় চেকলিস্ট',
    category: 'সোর্সিং',
    tasks: [
      { id: 's1', text: 'কমপক্ষে ৩টি পাইকারি মার্কেটের দাম তুলনা করুন', tip: 'চকবাজার, ইসলামপুর বা স্থানীয় মোকামের দর যাচাই করুন।' },
      { id: 's2', text: 'পণ্যের গুণগত মান (Quality Sample) নিজে পরীক্ষা করুন', tip: 'বড় লট কেনার আগে স্যাম্পল চেক করুন।' },
      { id: 's3', text: 'পরিবহন ও কুরিয়ার খরচ প্রতি ইউনিটে যোগ করে কেনা দাম হিসাব করুন', tip: 'অ্যাপের লাভ ক্যালকুলেটর ব্যবহার করুন।' },
      { id: 's4', text: 'ডিফেক্টিভ বা নষ্ট পণ্য রিটার্ন পলিসি সাপ্লায়ারের সাথে কথা বলে নিন', tip: 'লিখিত মেমো বা ক্যাশ ভাউচার সংরক্ষণ করুন।' },
    ],
  },
  {
    id: 'chk-marketing',
    title: 'ফেসবুক ও অনলাইন মার্কেটিং চেকলিস্ট',
    category: 'মার্কেটিং',
    tasks: [
      { id: 'm1', text: 'প্রফেশনাল লোগো ও কভার ব্যানারসহ ফেসবুক পেজ খুলুন', tip: 'পেজের বায়োতে স্পষ্ট মোবাইল নম্বর ও ডেলিভারি তথ্য দিন।' },
      { id: 'm2', text: 'দিনের প্রাকৃতিক আলোতে পণ্যের আসল ছবি ও রিলস ভিডিও তুলুন', tip: 'ইন্টারনেট থেকে ডাউনলোড করা ছবির চেয়ে আসল ছবিতে বিশ্বাস ৩ গুণ বেশি।' },
      { id: 'm3', text: 'কুরিয়ার সার্ভিসে (Steadfast / Pathao / RedX) মার্চেন্ট অ্যাকাউন্ট খুলুন', tip: 'ক্যাশ অন ডেলিভারি সুবিধা সচল করুন।' },
      { id: 'm4', text: 'প্রথম ১০ জন ক্রেতার রিভিউ ও ছবি সংগ্রহ করে পেজে পোস্ট করুন', tip: 'কাস্টমার রিভিউ নতুন ক্রেতা আনতে সবচেয়ে কার্যকর।' },
    ],
  },
  {
    id: 'chk-shop',
    title: 'দোকান সেটআপ ও ডেকোরেশন চেকলিস্ট',
    category: 'দোকান ব্যবসা',
    tasks: [
      { id: 'sh1', text: 'দোকান ভাড়ার লিখিত চুক্তিপত্র (অ্যাডভান্স ও মাসিক ভাড়া) সম্পন্ন করুন', tip: 'কমপক্ষে ২–৩ বছরের চুক্তি করা নিরাপদ।' },
      { id: 'sh2', text: 'চোখে পড়ার মতো পরিষ্কার বাংলা সাইনবোর্ড ও পর্যাপ্ত এলইডি লাইট লাগান', tip: 'আলোকিত দোকানে ক্রেতা বেশি প্রবেশ করে।' },
      { id: 'sh3', text: 'দৈনিক বিক্রি ও বাকি হিসাবের খাতা বা ডিজিটাল ক্যাশবুক চালু করুন', tip: 'শুরুর ৩ মাস বাকিতে বিক্রি এড়িয়ে চলুন।' },
    ],
  },
];

export const INITIAL_ADVICE_ARTICLES: AdviceArticle[] = [
  {
    id: 'adv-1',
    title: 'অল্প পুঁজিতে ব্যবসা শুরু করে প্রথম ৩০ দিনে বিক্রি দ্বিগুণ করার ৭টি কৌশল',
    category: 'Sales',
    readTime: '৪ মিনিট পড়া',
    summary: 'নতুন উদ্যোক্তারা কীভাবে বিজ্ঞাপনের বড় খরচ ছাড়াই স্থানীয় ও অনলাইন ক্রেতাদের আস্থা অর্জন করবেন তার বাস্তব গাইড।',
    author: 'মাহমুদুল হাসান, এসএমই পরামর্শক',
    content: [
      '১. ছোট ব্যাচে সর্বোচ্চ মান নিশ্চিত করুন: শুরুতে অনেকগুলো আইটেম না রেখে ২–৩টি সেরা পণ্যে ফোকাস করুন।',
      '২. কম্বো ও ট্রায়াল প্যাক তৈরি করুন: যেমন ৳৫০০ টাকার বড় প্যাকের বদলে ৳১৫০ টাকার ট্রায়াল প্যাক রাখলে নতুন ক্রেতারা সহজে কিনতে আগ্রহী হন।',
      '৩. দ্রুত রেসপন্স টাইম: ফেসবুক পেজ বা হোয়াটসঅ্যাপে ক্রেতা মেসেজ দেওয়ার ৫ মিনিটের মধ্যে উত্তর দিলে অর্ডার কনফার্ম হওয়ার সম্ভাবনা ৭০% বেড়ে যায়।',
      '৪. পুরাতন ক্রেতাদের ফলো-আপ: পণ্য ডেলিভারির ৩ দিন পর ফোন বা মেসেজে খোঁজ নিন এবং পরবর্তী অর্ডারে ছোট উপহার বা ছাড় দিন।',
    ],
  },
  {
    id: 'adv-2',
    title: 'ফেসবুক পেজে অর্গানিক রিলস ও লাইভ করে প্রতিদিন অর্ডার পাওয়ার নিয়ম',
    category: 'Facebook selling',
    readTime: '৫ মিনিট পড়া',
    summary: 'বুস্টিং ছাড়াই কীভাবে পণ্যের প্যাকেজিং, প্রস্তুত প্রণালী ও কাস্টমার রিভিউ ভিডিও দিয়ে হাজারো ক্রেতার কাছে পৌঁছাবেন।',
    author: 'সাদিয়া রহমান, এফ-কমার্স ট্রেইনার',
    content: [
      '১. পণ্যের পেছনের গল্প দেখান (Behind the Scenes): আপনি কীভাবে মশলা বাছাই করছেন বা পণ্য প্যাক করছেন তার ৩০ সেকেন্ডের ভিডিও রিলস হিসেবে দিন।',
      '২. প্রথম ৩ সেকেন্ডে হুক (Hook) রাখুন: ভিডিওর শুরুতে সমস্যার সমাধান বা পণ্যের বিশেষত্ব বলুন।',
      '৩. দাম লুকিয়ে রাখবেন না: পোস্টের ক্যাপশনে বা ছবিতে স্পষ্টভাবে দাম ও ডেলিভারি চার্জ উল্লেখ করলে সিরিয়াস ক্রেতারা সরাসরি অর্ডার করেন।',
    ],
  },
  {
    id: 'adv-3',
    title: 'পণ্যের সঠিক মূল্য নির্ধারণ (Pricing Strategy): লাভ রেখে প্রতিযোগিতায় টিকে থাকার সূত্র',
    category: 'Pricing',
    readTime: '৩ মিনিট পড়া',
    summary: 'অনেক নতুন উদ্যোক্তা শুধু কেনা দাম ও বিক্রয়মূল্য হিসাব করেন, কিন্তু লুকানো খরচ বাদ পড়ায় মাস শেষে লোকসান হয়।',
    author: 'তানভীর আহমেদ, ফিন্যান্সিয়াল অ্যানালিস্ট',
    content: [
      '১. ল্যান্ডেড কস্ট (Landed Cost) বের করুন: পণ্যের ক্রয়মূল্যের সাথে পরিবহন, প্যাকেজিং, স্টিকার, ঘাটতি (২%) এবং মার্কেটিং খরচ যোগ করুন।',
      '২. পাইকারি ও খুচরা মার্জিন আলাদা রাখুন: খুচরা বিক্রিতে অন্তত ২৫%–৩৫% এবং পাইকারি বিক্রিতে ১০%–১৫% নিট মার্জিন লক্ষ্য রাখুন।',
      '৩. সাইকোলজিক্যাল প্রাইসিং: ৳৫০০ এর বদলে ৳৪৮০ বা ৳২৯০ নির্ধারণ করলে ক্রেতার কাছে সাশ্রয়ী মনে হয়।',
    ],
  },
  {
    id: 'adv-4',
    title: 'ছোট ব্যবসায়ীদের ৫টি সাধারণ ভুল এবং সেগুলো এড়িয়ে চলার উপায়',
    category: 'Small business mistakes',
    readTime: '৪ মিনিট পড়া',
    summary: 'বাকিতে পণ্য বিক্রি, ব্যক্তিগত ও ব্যবসার টাকা এক করে ফেলা এবং অতিরিক্ত স্টক করার ঝুঁকি থেকে বাঁচার উপায়।',
    author: 'রফিকুল ইসলাম, উদ্যোক্তা মেন্টর',
    content: [
      '১. ব্যবসার ক্যাশ ও সংসারের খরচ আলাদা রাখুন: নিজের জন্য নির্দিষ্ট মাসিক সম্মানী নির্ধারণ করুন, ক্যাশবাক্স থেকে ইচ্ছেমতো খরচ করবেন না।',
      '২. অতিরিক্ত বাকিতে বিক্রি বন্ধ করুন: ছোট পুঁজির ব্যবসা অচল হওয়ার প্রধান কারণ বাকির টাকা আদায় না হওয়া।',
      '৩. একসাথে সব পুঁজি স্টকে আটকাবেন না: যে পণ্য দ্রুত বিক্রি হয় (Fast-moving), কেবল সেটিই পুনরায় স্টক করুন।',
    ],
  },
];

export const INITIAL_PRODUCTS: MarketplaceProductItem[] = [
  {
    id: 'prod-1',
    title: 'উদ্যোক্তা প্যাকেজিং স্টার্টার কিট (হিট সিলার + ডিজিটাল স্কেল + ১০০ পাউচ)',
    category: 'ই-কমার্স সাপ্লাই',
    priceBdt: 1850,
    stock: 35,
    description: 'ঘরে বসে মসলা, চা পাতা, ড্রাই ফুড বা কসমেটিকস ব্যবসা শুরু করার জন্য সম্পূর্ণ প্যাকেজিং কম্বো। এতে রয়েছে ৮ ইঞ্চি হিট সিলার, ১০ কেজি ডিজিটাল স্কেল এবং ১০০ পিস ফুড-গ্রেড স্ট্যান্ড-আপ জিপার পাউচ।',
    location: 'চকবাজার, ঢাকা (সারাদেশে কুরিয়ার)',
    sellerId: 'seller-demo-1',
    sellerName: 'ঢাকা প্যাক অ্যান্ড সাপ্লাই',
    sellerPhone: '01711-223344',
    imageUrl: packagingKitImg,
    status: 'approved',
    rating: 4.9,
  },
  {
    id: 'prod-2',
    title: 'পাইকারি প্রিমিয়াম অর্গানিক মসলা কম্বো (৫ কেজি বাল্ক প্যাক)',
    category: 'খাবার ও পানীয়',
    priceBdt: 2450,
    stock: 20,
    description: 'নিজস্ব ব্র্যান্ডে রিপ্যাকিং করে বিক্রির জন্য ১০০% খাঁটি ও ল্যাব টেস্টেড হলুদ, মরিচ, ধনিয়া ও জিরা গুঁড়ার পাইকারি বাল্ক প্যাক।',
    location: 'বগুড়া সদর (কুরিয়ার ডেলিভারি)',
    sellerId: 'seller-demo-2',
    sellerName: 'গ্রামীণ অ্যাগ্রো ফুডস',
    sellerPhone: '01819-556677',
    imageUrl: spiceIdeaImg,
    status: 'approved',
    rating: 4.8,
  },
  {
    id: 'prod-3',
    title: 'তন্দুরি ও মালাই চায়ের মাটির কাপ (৫০০ পিস পাইকারি বক্স)',
    category: 'চা/কফি',
    priceBdt: 1200,
    stock: 50,
    description: 'চা ও কফি শপের জন্য উন্নত পোড়ামাটির তৈরি স্বাস্থ্যসম্মত ওয়ান-টাইম কাপ। ব্রেক-প্রুফ কার্টন প্যাকিংয়ে ডেলিভারি।',
    location: 'সাভার, ঢাকা',
    sellerId: 'seller-demo-3',
    sellerName: 'মৃৎশিল্প ক্রাফট বিডি',
    sellerPhone: '01912-889900',
    imageUrl: teaIdeaImg,
    status: 'approved',
    rating: 4.7,
  },
];

export const INITIAL_SUCCESS_STORIES: SuccessStoryItem[] = [
  {
    id: 'story-1',
    entrepreneurName: 'রাকিবুল ইসলাম',
    businessTitle: 'অর্গানিক মসলা ও হোমমেড ফুড ব্র্যান্ড',
    category: 'অনলাইন ব্যবসা',
    location: 'রাজশাহী',
    initialInvestment: '৳১০,০০০',
    monthlyIncome: '৳৫০,০০০+',
    growthSummary: 'মাত্র ১০ হাজার টাকায় ঘরোয়া মসলা প্যাকিং শুরু করে এখন ৪ জন কর্মীসহ মাসে দেড় লাখ টাকার পণ্য বিক্রি করছেন।',
    quote: '“আমি মাত্র ১০ হাজার টাকা বিনিয়োগ করে খাঁটি মসলার ব্যবসা শুরু করি। আজ আমার পেজে ১২,০০০ নিয়মিত ক্রেতা এবং মাসে ৫০ হাজার টাকার বেশি নিট আয় হচ্ছে।”',
    lessons: [
      'পণ্যের মানে কখনো আপস না করা',
      'প্রতিটি প্যাকেটে পরিষ্কার লেবেল ও মেয়াদের তারিখ দেওয়া',
      'কাস্টমার রিভিউ নিয়মিত শেয়ার করা',
    ],
    rating: 4.9,
    avatarUrl: entrepreneurAvatarImg,
  },
  {
    id: 'story-2',
    entrepreneurName: 'সাবিনা আক্তার',
    businessTitle: 'ঘরোয়া পিঠা, ফ্রোজেন স্ন্যাকস ও আচার',
    category: 'ঘরে বসে ব্যবসা',
    location: 'উত্তরা, ঢাকা',
    initialInvestment: '৳৫,০০০',
    monthlyIncome: '৳৩২,০০০+',
    growthSummary: 'সংসারের পাশাপাশি নিজের রান্নাঘর থেকেই ফ্রোজেন সিঙ্গারা, সমুচা ও রসুনের আচার তৈরি করে স্বাবলম্বী হয়েছেন।',
    quote: '“ঘরে বসে পিঠা ও ফ্রোজেন খাবার তৈরি করে প্রথমে প্রতিবেশীদের দিতাম। এখন ঢাকার বিভিন্ন এলাকায় ডেলিভারি যায় এবং মাসে ৩০ হাজার টাকার ওপর আয় করছি।”',
    lessons: [
      'হাইজিন ও স্বাদ সবসময় একই রাখা',
      'অফিসজীবী পরিবারের জন্য রেডি-টু-কুক ফ্যামিলি প্যাক তৈরি করা',
    ],
    rating: 4.8,
    avatarUrl: spiceIdeaImg,
  },
];

export const INITIAL_RESOURCES: ResourceSiteItem[] = [
  {
    id: 'res-1',
    name: 'Daraz Seller Center',
    category: 'ই-কমার্স মার্কেটপ্লেস',
    descriptionBn: 'বাংলাদেশের সবচেয়ে বড় ই-কমার্স প্ল্যাটফর্মে বিনামূল্যে সেলার অ্যাকাউন্ট খুলে সারাদেশে পণ্য বিক্রি করুন।',
    url: 'https://sellercenter.daraz.com.bd',
    badge: 'জনপ্রিয়',
  },
  {
    id: 'res-2',
    name: 'SME Foundation Bangladesh',
    category: 'সরকারি সহায়তা ও লোন',
    descriptionBn: 'ক্ষুদ্র ও মাঝারি উদ্যোক্তাদের জন্য স্বল্প সুদে ঋণ, প্রশিক্ষণ ও মেলায় অংশগ্রহণের সরকারি পোর্টাল।',
    url: 'https://smef.gov.bd',
    badge: 'সরকারি',
  },
  {
    id: 'res-3',
    name: 'Steadfast Courier Merchant',
    category: 'কুরিয়ার ও ডেলিভারি',
    descriptionBn: 'অনলাইন ব্যবসার জন্য সারা বাংলাদেশে ক্যাশ-অন-ডেলিভারি (COD) পার্সেল পাঠানোর নির্ভরযোগ্য কুরিয়ার।',
    url: 'https://steadfast.com.bd',
    badge: 'লজিস্টিকস',
  },
  {
    id: 'res-4',
    name: 'Alibaba Wholesale',
    category: 'পাইকারি সোর্সিং',
    descriptionBn: 'মেশিনারি, প্যাকেজিং ও ইউনিক গ্যাজেট সরাসরি কারখানা থেকে পাইকারি দরে সোর্সিং করার গ্লোবাল প্ল্যাটফর্ম।',
    url: 'https://www.alibaba.com',
    badge: 'সোর্সিং',
  },
  {
    id: 'res-5',
    name: 'Fiverr & Upwork',
    category: 'ফ্রিল্যান্সিং ও ডিজিটাল সার্ভিস',
    descriptionBn: 'গ্রাফিক ডিজাইন, ভিডিও এডিটিং ও ডিজিটাল মার্কেটিং সেবা দিয়ে বৈদেশিক মুদ্রা আয়ের মার্কেটপ্লেস।',
    url: 'https://www.fiverr.com',
    badge: 'গ্লোবাল',
  },
];

export const USER_ANDROID_KOTLIN_FILES: Record<string, string> = {
  'user-app/build.gradle.kts': `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
    id("com.google.gms.google-services")
}

android {
    namespace = "alpo.pujir.bebsha"
    compileSdk = 35

    defaultConfig {
        applicationId = "alpo.pujir.bebsha"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
        resValue("string", "app_name", "অল্প পুঁজির ব্যবসা")
        buildConfigField("String", "APP_TARGET", "\\"user\\"")
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }

    bundle {
        language { enableSplit = true }
        density { enableSplit = true }
        abi { enableSplit = true }
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }
}

dependencies {
    implementation(platform("androidx.compose:compose-bom:2025.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.navigation:navigation-compose:2.8.7")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
    implementation(platform("com.google.firebase:firebase-bom:33.9.0"))
    implementation("com.google.firebase:firebase-auth-ktx")
    implementation("com.google.firebase:firebase-firestore-ktx")
    implementation("com.google.firebase:firebase-storage-ktx")
    implementation("com.google.firebase:firebase-messaging-ktx")
    implementation("com.google.firebase:firebase-appcheck-playintegrity")
}`,
  'user-app/src/main/AndroidManifest.xml': `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="alpo.pujir.bebsha">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:allowBackup="true"
        android:label="অল্প পুঁজির ব্যবসা"
        android:supportsRtl="true"
        android:theme="@style/Theme.AlpoPujirBebsha">
        <activity
            android:name=".UserMainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
  'user-app/src/main/java/alpo/pujir/bebsha/UserMainActivity.kt': `package alpo.pujir.bebsha

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.*
import com.google.firebase.FirebaseApp
import com.google.firebase.appcheck.FirebaseAppCheck
import com.google.firebase.appcheck.playintegrity.PlayIntegrityAppCheckProviderFactory
import alpo.pujir.bebsha.ui.theme.AlpoPujirBebshaTheme
import alpo.pujir.bebsha.ui.navigation.UserOnlyNavigation

/**
 * USER APP ENTRY POINT (alpo.pujir.bebsha)
 * Includes ONLY User Panel features. Admin Panel routes and modules are completely excluded.
 */
class UserMainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        FirebaseApp.initializeApp(this)
        FirebaseAppCheck.getInstance().installAppCheckProviderFactory(
            PlayIntegrityAppCheckProviderFactory.getInstance()
        )
        setContent {
            AlpoPujirBebshaTheme {
                Surface(color = MaterialTheme.colorScheme.background) {
                    UserOnlyNavigation()
                }
            }
        }
    }
}`,
  'user-app/src/main/java/alpo/pujir/bebsha/data/UserFirestoreRepository.kt': `package alpo.pujir.bebsha.data

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.tasks.await

class UserFirestoreRepository(
    private val auth: FirebaseAuth = FirebaseAuth.getInstance(),
    private val db: FirebaseFirestore = FirebaseFirestore.getInstance()
) {
    suspend fun registerUserProfile(
        fullName: String,
        phone: String,
        email: String,
        referredByCode: String?
    ) {
        val uid = auth.currentUser?.uid ?: throw IllegalStateException("Not authenticated")
        val referralCode = "APB-" + uid.take(6).uppercase()
        val profile = hashMapOf(
            "uid" to uid,
            "fullName" to fullName,
            "phone" to phone,
            "email" to email,
            "role" to "user",
            "status" to "active",
            "membershipTier" to "free",
            "walletBalance" to 0,
            "points" to 25,
            "referralCode" to referralCode,
            "referredBy" to (referredByCode ?: ""),
            "favorites" to emptyList<String>(),
            "createdAt" to FieldValue.serverTimestamp(),
            "updatedAt" to FieldValue.serverTimestamp()
        )
        db.collection("users").document(uid).set(profile).await()
    }
}`,
  'USER_APP_PLAY_STORE_AAB_GUIDE.md': `# অল্প পুঁজির ব্যবসা (USER APP) — Play Store AAB & APK Build Guide

- **App Name:** অল্প পুঁজির ব্যবসা
- **Application ID:** \`alpo.pujir.bebsha\`
- **Target Audience:** সাধারণ গ্রাহক ও উদ্যোক্তা (User Panel Only — No Admin Panel Included)

## ১. Play Store Release AAB ও APK জেনারেট করার কমান্ড
\`\`\`bash
# Play Store-ready Android App Bundle (.aab)
./gradlew :user-app:bundleRelease

# Production User APK (.apk)
./gradlew :user-app:assembleRelease
\`\`\`
আউটপুট ফাইল:
- AAB: \`user-app/build/outputs/bundle/release/user-app-release.aab\`
- APK: \`user-app/build/outputs/apk/release/user-app-release.apk\`
`,
};

export const ADMIN_ANDROID_KOTLIN_FILES: Record<string, string> = {
  'admin-app/build.gradle.kts': `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
    id("com.google.gms.google-services")
}

android {
    namespace = "alpo.pujir.bebsha.admin"
    compileSdk = 35

    defaultConfig {
        applicationId = "alpo.pujir.bebsha.admin"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0-admin"
        resValue("string", "app_name", "অল্প পুঁজির ব্যবসা Admin")
        buildConfigField("String", "APP_TARGET", "\\"admin\\"")
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }
}

dependencies {
    implementation(platform("androidx.compose:compose-bom:2025.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.navigation:navigation-compose:2.8.7")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
    implementation(platform("com.google.firebase:firebase-bom:33.9.0"))
    implementation("com.google.firebase:firebase-auth-ktx")
    implementation("com.google.firebase:firebase-firestore-ktx")
    implementation("com.google.firebase:firebase-appcheck-playintegrity")
}`,
  'admin-app/src/main/AndroidManifest.xml': `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="alpo.pujir.bebsha.admin">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:allowBackup="false"
        android:label="অল্প পুঁজির ব্যবসা Admin"
        android:supportsRtl="true"
        android:theme="@style/Theme.AlpoPujirBebshaAdmin">
        <activity
            android:name=".AdminMainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
  'admin-app/src/main/java/alpo/pujir/bebsha/admin/AdminMainActivity.kt': `package alpo.pujir.bebsha.admin

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.*
import com.google.firebase.FirebaseApp
import com.google.firebase.appcheck.FirebaseAppCheck
import com.google.firebase.appcheck.playintegrity.PlayIntegrityAppCheckProviderFactory
import alpo.pujir.bebsha.admin.ui.AdminAuthGateScreen

/**
 * SEPARATE ADMIN APP ENTRY POINT (alpo.pujir.bebsha.admin)
 * Privately distributed to authorized administrators only.
 * Enforces Firebase Authentication + Firestore /admins/{uid} & role verification.
 */
class AdminMainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        FirebaseApp.initializeApp(this)
        FirebaseAppCheck.getInstance().installAppCheckProviderFactory(
            PlayIntegrityAppCheckProviderFactory.getInstance()
        )
        setContent {
            MaterialTheme {
                Surface(color = MaterialTheme.colorScheme.background) {
                    AdminAuthGateScreen()
                }
            }
        }
    }
}`,
  'admin-app/src/main/java/alpo/pujir/bebsha/admin/data/AdminAuthGuardRepository.kt': `package alpo.pujir.bebsha.admin.data

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.tasks.await

class AdminAuthGuardRepository(
    private val auth: FirebaseAuth = FirebaseAuth.getInstance(),
    private val db: FirebaseFirestore = FirebaseFirestore.getInstance()
) {
    suspend fun verifyAuthorizedAdminOrSignOut(): Boolean {
        val user = auth.currentUser ?: return false
        val adminSnap = db.collection("admins").document(user.uid).get().await()
        val userSnap = db.collection("users").document(user.uid).get().await()
        val role = userSnap.getString("role") ?: "user"
        val status = userSnap.getString("status") ?: "active"
        val isAuthorized = status == "active" && (
            adminSnap.exists() ||
            role in listOf("super_admin", "admin", "moderator", "support")
        )
        if (!isAuthorized) {
            auth.signOut()
        }
        return isAuthorized
    }
}`,
  'ADMIN_APP_PRIVATE_BUILD_GUIDE.md': `# অল্প পুঁজির ব্যবসা Admin (ADMIN APP) — Private APK & AAB Build Guide

- **App Name:** অল্প পুঁজির ব্যবসা Admin
- **Application ID:** \`alpo.pujir.bebsha.admin\`
- **Distribution:** শুধুমাত্র অনুমোদিত অ্যাডমিনদের জন্য প্রাইভেট ডিস্ট্রিবিউশন (Not exposed in User App)

## ১. Private Admin APK ও AAB জেনারেট করার কমান্ড
\`\`\`bash
# Private Admin Release APK (.apk)
./gradlew :admin-app:assembleRelease

# Private Admin Release Bundle (.aab)
./gradlew :admin-app:bundleRelease
\`\`\`
আউটপুট ফাইল:
- APK: \`admin-app/build/outputs/apk/release/admin-app-release.apk\`
- AAB: \`admin-app/build/outputs/bundle/release/admin-app-release.aab\`
`,
};

export const ANDROID_KOTLIN_FILES: Record<string, string> = {
  ...USER_ANDROID_KOTLIN_FILES,
  ...ADMIN_ANDROID_KOTLIN_FILES,
};

export interface BuyAndEarnPackageItem {
  id: string;
  title: string;
  categoryName: string;
  modelType: 'auto_resell' | 'digital_farm' | 'starter_kit';
  modelBadge: string;
  imageUrl: string;
  fallbackImageUrl: string;
  unitPriceBdt: number;
  userProfitBdt: number;
  userProfitPercent: number;
  appFeePercent: number;
  durationDays: number;
  durationLabel: string;
  availableUnits: number;
  shortDesc: string;
}

export const INITIAL_BUY_AND_EARN_PACKAGES: BuyAndEarnPackageItem[] = [
  {
    id: 'pkg-honey-1',
    title: '১০ কেজি সুন্দরবনের খাঁটি মধু ও কালোজিরা বান্ডেল',
    categoryName: 'ই-কমার্স ও রিটেইল চেইন ইনভেস্টমেন্ট',
    modelType: 'auto_resell',
    modelBadge: 'পাইকারি ক্রয় ও অটো-রিসেল',
    imageUrl: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=700&q=80',
    fallbackImageUrl: getCategoryFallbackImage('মধু ও কালোজিরা বান্ডেল', 'অটো-রিসেল প্রফিট প্যাক'),
    unitPriceBdt: 1500,
    userProfitBdt: 225,
    userProfitPercent: 15,
    appFeePercent: 5,
    durationDays: 15,
    durationLabel: '১৫ দিন',
    availableUnits: 45,
    shortDesc: 'বান্ডেলটি কিনে অ্যাপের ওয়্যারহাউসে রাখলে ১৫ দিনে খুচরা বিক্রি হয়ে আপনার ওয়ালেটে আসল ৳১,৫০০ + লাভ ৳২২৫ = মোট ৳১,৭২৫ জমা হবে। চাইলে নিজেও ডেলিভারি নিতে পারবেন।',
  },
  {
    id: 'pkg-poultry-2',
    title: '১০০টি সোনালী মুরগির ফ্লক শেয়ার ইউনিট (ডিজিটাল খামার)',
    categoryName: 'কৃষি ও অ্যাগ্রো ইনভেস্টমেন্ট',
    modelType: 'digital_farm',
    modelBadge: 'ডিজিটাল খামার ইউনিট',
    imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=700&q=80',
    fallbackImageUrl: getCategoryFallbackImage('সোনালী মুরগি খামার ইউনিট', 'ডিজিটাল খামার শেয়ার'),
    unitPriceBdt: 2000,
    userProfitBdt: 400,
    userProfitPercent: 20,
    appFeePercent: 6,
    durationDays: 30,
    durationLabel: '৩০ দিন (১ মাস)',
    availableUnits: 60,
    shortDesc: 'ভেরিফায়েড পোল্ট্রি খামারের ফ্লক ইউনিট কিনুন। ৩০ দিন পর খামার থেকে পাইকারি বিক্রির পর আসল ৳২,০০০ + হালাল লভ্যাংশ ৳৪০০ = মোট ৳২,৪০০ সরাসরি ওয়ালেটে পাবেন।',
  },
  {
    id: 'pkg-spice-3',
    title: '৫০ কেজি বিএসটিআই গুঁড়া মসলা ফ্যাক্টরি ব্যাচ',
    categoryName: 'ক্ষুদ্র শিল্প ও ফ্যাক্টরি ইনভেস্টমেন্ট',
    modelType: 'auto_resell',
    modelBadge: 'ফ্যাক্টরি অটো-সেল ব্যাচ',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=700&q=80',
    fallbackImageUrl: getCategoryFallbackImage('গুঁড়া মসলা ফ্যাক্টরি ব্যাচ', 'অটো-সেল লভ্যাংশ'),
    unitPriceBdt: 2500,
    userProfitBdt: 450,
    userProfitPercent: 18,
    appFeePercent: 5,
    durationDays: 20,
    durationLabel: '২০ দিন',
    availableUnits: 38,
    shortDesc: 'হলুদ, মরিচ ও ধনিয়া গুঁড়ার ফ্যাক্টরি ব্যাচ কিনুন। আমাদের ডিলার নেটওয়ার্কে ২০ দিনে বিক্রির পর আসল ৳২,৫০০ + লাভ ৳৪৫০ = মোট ৳২,৯৫০ ওয়ালেটে যুক্ত হবে।',
  },
  {
    id: 'pkg-boutique-4',
    title: '১৫ পিস প্রিমিয়াম সুতি থ্রি-পিস পাইকারি রিসেল লট',
    categoryName: 'ই-কমার্স ও রিটেইল চেইন ইনভেস্টমেন্ট',
    modelType: 'auto_resell',
    modelBadge: 'গার্মেন্টস লট অটো-রিসেল',
    imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=700&q=80',
    fallbackImageUrl: getCategoryFallbackImage('সুতি থ্রি-পিস পাইকারি লট', 'রিসেল প্রফিট প্যাক'),
    unitPriceBdt: 3000,
    userProfitBdt: 600,
    userProfitPercent: 20,
    appFeePercent: 5,
    durationDays: 25,
    durationLabel: '২৫ দিন',
    availableUnits: 30,
    shortDesc: 'ইসলামপুর ও বাবুরহাটের সরাসরি কারখানা রেটে থ্রি-পিস লট কিনুন। অ্যাপের এফ-কমার্স পেজে বিক্রি হয়ে ২৫ দিনে আসল ৳৩,০০০ + লাভ ৳৬০০ = মোট ৳৩,৬০০ পাবেন।',
  },
  {
    id: 'pkg-goat-5',
    title: '১টি উন্নত জাতের ব্ল্যাক বেঙ্গল ছাগল পালন ইউনিট',
    categoryName: 'কৃষি ও অ্যাগ্রো ইনভেস্টমেন্ট',
    modelType: 'digital_farm',
    modelBadge: 'লাইভস্টক খামার শেয়ার',
    imageUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=700&q=80',
    fallbackImageUrl: getCategoryFallbackImage('ব্ল্যাক বেঙ্গল ছাগল ইউনিট', 'অ্যাগ্রো খামার শেয়ার'),
    unitPriceBdt: 4000,
    userProfitBdt: 900,
    userProfitPercent: 22.5,
    appFeePercent: 6,
    durationDays: 45,
    durationLabel: '৪৫ দিন',
    availableUnits: 25,
    shortDesc: 'ভেটেরিনারি বীমাকৃত খামারে ছাগল মোটাতাজাকরণ ইউনিট কিনুন। ৪৫ দিন পর বিক্রয় শেষে আসল ৳৪,০০০ + মুনাফা ৳৯০০ = মোট ৳৪,৯০০ ওয়ালেটে উত্তোলন করুন।',
  },
  {
    id: 'pkg-gadget-6',
    title: 'স্মার্ট ওয়াচ ও ভাইরাল ই-কমার্স গ্যাজেট ইমপোর্ট শেয়ার',
    categoryName: 'ই-কমার্স ও রিটেইল চেইন ইনভেস্টমেন্ট',
    modelType: 'starter_kit',
    modelBadge: 'গ্রুপ ইমপোর্ট ব্যাচ',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80',
    fallbackImageUrl: getCategoryFallbackImage('স্মার্ট গ্যাজেট ইমপোর্ট শেয়ার', 'দ্রুত রিসেল প্রফিট'),
    unitPriceBdt: 1000,
    userProfitBdt: 140,
    userProfitPercent: 14,
    appFeePercent: 4,
    durationDays: 10,
    durationLabel: '১০ দিন',
    availableUnits: 80,
    shortDesc: 'মাত্র ৳১,০০০ দিয়ে চায়না ইমপোর্ট গ্যাজেট ব্যাচের ১টি শেয়ার কিনুন। দারাজ ও অনলাইনে ১০ দিনে স্টক ক্লিয়ারেন্সের পর আসল ৳১,০০০ + লাভ ৳১৪০ = মোট ৳১,১৪০ ফেরত পান।',
  },
];

export interface PaymentGatewayAccounts {
  bkashNumber: string;
  bkashType: string;
  nagadNumber: string;
  nagadType: string;
  rocketNumber: string;
  rocketType: string;
  bankDetails: string;
}

export const DEFAULT_PAYMENT_ACCOUNTS: PaymentGatewayAccounts = {
  bkashNumber: '01906971148',
  bkashType: 'বিকাশ পার্সোনাল (Send Money)',
  nagadNumber: '01942807392',
  nagadType: 'নগদ পার্সোনাল (Send Money)',
  rocketNumber: '01906971148',
  rocketType: 'রকেট পার্সোনাল (Send Money)',
  bankDetails:
    'ইসলামী ব্যাংক বাংলাদেশ পিএলসি • A/C: 20502130201894512 (অল্প পুঁজির ব্যবসা ফান্ড)',
};

const PAYMENT_ACCOUNTS_STORAGE_KEY = 'alpo_pujir_payment_accounts_v1';

export function getPaymentGatewayAccounts(): PaymentGatewayAccounts {
  try {
    const raw = localStorage.getItem(PAYMENT_ACCOUNTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_PAYMENT_ACCOUNTS,
        ...parsed,
      };
    }
  } catch {}
  return DEFAULT_PAYMENT_ACCOUNTS;
}

export function savePaymentGatewayAccounts(
  accounts: PaymentGatewayAccounts
): void {
  try {
    localStorage.setItem(
      PAYMENT_ACCOUNTS_STORAGE_KEY,
      JSON.stringify(accounts)
    );
  } catch {}
}

export interface SpecialPackageTaskItem {
  id: string;
  title: string;
  description: string;
  rewardBdt: number;
  actionLabel: string;
}

export interface SpecialEntryPackageConfig {
  id: string;
  packageName: string;
  categoryName: string;
  badgeText: string;
  entryFeeBdt: number;
  dailyEarningBdt: number;
  welcomeBonusBdt: number;
  resellCommissionBdt: number;
  durationDays: number;
  shortDescription: string;
  enabled: boolean;
  tasks: SpecialPackageTaskItem[];
}

export const DEFAULT_SPECIAL_PACKAGE_199: SpecialEntryPackageConfig = {
  id: 'pkg-vip-199',
  packageName: '৳১৯৯ স্পেশাল ওয়ার্ক ও ডেইলি ইনকাম প্যাকেজ',
  categoryName: '৳১৯৯ স্পেশাল ওয়ার্ক ও ইনকাম প্যাকেজ',
  badgeText: '🔥 নতুন ক্যাটাগরি প্যাকেজ • ১-ক্লিকে প্রবেশ করুন',
  entryFeeBdt: 199,
  dailyEarningBdt: 25,
  welcomeBonusBdt: 30,
  resellCommissionBdt: 150,
  durationDays: 30,
  shortDescription:
    'মাত্র ৳১৯৯ দিয়ে এই প্যাকেজটি কিনে ভেতরে প্রবেশ করুন! প্যাকেজের ভেতর প্রতিদিন ৩টি বাস্তব কাজ (প্রোডাক্ট প্রমোশন, অর্ডার চেক ও রিসেল শেয়ার) করে দৈনিক নিশ্চিত টাকা আয় করে সরাসরি ওয়ালেটে নিন।',
  enabled: true,
  tasks: [
    {
      id: 'task-199-1',
      title: 'টাস্ক ১: ডেইলি প্রোডাক্ট প্রমোশন ও ব্র্যান্ড ভিজিট',
      description:
        'আমাদের ভেরিফায়েড পাইকারি পণ্যের ক্যাটালগ রিভিউ ও প্রমোশন সম্পন্ন করুন।',
      rewardBdt: 10,
      actionLabel: 'কাজ সম্পন্ন করুন (+৳১০)',
    },
    {
      id: 'task-199-2',
      title: 'টাস্ক ২: পাইকারি পণ্যের রিসেল লিংক শেয়ার ও ভেরিফাই',
      description:
        'আজকের হট-সেলিং পণ্যের রিসেল পোস্ট কপি ও ভেরিফাই করে ডেইলি বোনাস নিন।',
      rewardBdt: 10,
      actionLabel: 'শেয়ার ও ভেরিফাই করুন (+৳১০)',
    },
    {
      id: 'task-199-3',
      title: 'টাস্ক ৩: ডেইলি মার্কেট সার্ভে ও অ্যাক্টিভ চেক-ইন',
      description:
        'আজকের উদ্যোক্তা মার্কেট রেটিং ও অ্যাক্টিভ সদস্য হাজিরা সম্পন্ন করুন।',
      rewardBdt: 5,
      actionLabel: 'হাজিরা দিন (+৳৫)',
    },
  ],
};

const SPECIAL_PKG_199_STORAGE_KEY = 'alpo_pujir_special_pkg_199_v1';

export function getSpecialPackage199Config(): SpecialEntryPackageConfig {
  try {
    const raw = localStorage.getItem(SPECIAL_PKG_199_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_SPECIAL_PACKAGE_199,
        ...parsed,
        tasks:
          Array.isArray(parsed.tasks) && parsed.tasks.length > 0
            ? parsed.tasks
            : DEFAULT_SPECIAL_PACKAGE_199.tasks,
      };
    }
  } catch {}
  return DEFAULT_SPECIAL_PACKAGE_199;
}

export function saveSpecialPackage199Config(
  cfg: SpecialEntryPackageConfig
): void {
  try {
    localStorage.setItem(SPECIAL_PKG_199_STORAGE_KEY, JSON.stringify(cfg));
  } catch {}
}

export type ProfitModuleType =
  | 'micro_task'
  | 'dropship_resell'
  | 'telecom_drive'
  | 'vip_package'
  | 'skill_course'
  | 'seller_boost';

export interface ProfitableWorkItem {
  id: string;
  moduleType: ProfitModuleType;
  moduleTitleBn: string;
  title: string;
  description: string;
  actionInstructions: string;
  /** ইউজার কাজ/অর্ডার করলে অ্যাডমিনের মূল অ্যাকাউন্টে মোট কত টাকা জমা হবে */
  totalRevenueToAdminBdt: number;
  /** অ্যাডমিন অ্যাকাউন্ট থেকে ইউজারকে কত টাকা পারিশ্রমিক/কমিশন দেওয়া হবে */
  userPayoutBdt: number;
  /** অ্যাডমিনের নিট লাভ (totalRevenueToAdminBdt - userPayoutBdt) */
  adminNetProfitBdt: number;
  proofPlaceholder: string;
  badge: string;
}

export interface UserWorkSubmissionRecord {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  taskId: string;
  moduleType: ProfitModuleType;
  moduleTitleBn: string;
  taskTitle: string;
  proofText: string;
  /** অ্যাডমিনের মূল অ্যাকাউন্টে জমা হওয়া মোট টাকা */
  adminGrossRevenueBdt: number;
  /** ইউজারের প্রাপ্য টাকা (অ্যাডমিন অনুমোদন করলে ইউজারের ওয়ালেটে যাবে) */
  userPayableBdt: number;
  /** অ্যাডমিন অ্যাকাউন্টে থেকে যাওয়া নিট লাভ */
  adminNetProfitBdt: number;
  /** ইতিমধ্যে অ্যাডমিন ইউজারকে কত টাকা দিয়েছেন */
  paidToUserBdt: number;
  status: 'pending_admin_payout' | 'paid_to_user' | 'rejected';
  createdAtLabel?: string;
}

export const INITIAL_PROFITABLE_WORK_ITEMS: ProfitableWorkItem[] = [
  // ১. মাইক্রো-টাস্ক ও স্পন্সরড অ্যাড প্রমোশন জোন
  {
    id: 'work-micro-1',
    moduleType: 'micro_task',
    moduleTitleBn: '১. মাইক্রো-টাস্ক ও অ্যাড প্রমোশন',
    title: 'ভেরিফায়েড ই-কমার্স পেজ ফলো, শেয়ার ও রিভিউ কাজ',
    description:
      'স্পন্সরড মার্চেন্ট পেজ ভিজিট করুন, ৫-স্টার রিভিউ দিন এবং আপনার ফেসবুক/হোয়াটসঅ্যাপে শেয়ার করে প্রুফ জমা দিন।',
    actionInstructions:
      'কাজটি সম্পন্ন করে আপনার ফেসবুক আইডির নাম বা শেয়ার লিংক নিচে লিখে জমা দিন। কাজ জমা দিলেই অ্যাডমিন অ্যাকাউন্টে ৳৩০ স্পন্সর রেভিনিউ জমা হবে এবং অ্যাডমিন সেখান থেকে আপনাকে ৳১৫ আপনার ওয়ালেটে পাঠাবেন।',
    totalRevenueToAdminBdt: 30,
    userPayoutBdt: 15,
    adminNetProfitBdt: 15,
    proofPlaceholder: 'আপনার ফেসবুক নাম / পেজ রিভিউ রেফারেন্স লিখুন...',
    badge: 'ইউজার পাবেন +৳১৫ • অ্যাডমিন লাভ +৳১৫',
  },
  {
    id: 'work-micro-2',
    moduleType: 'micro_task',
    moduleTitleBn: '১. মাইক্রো-টাস্ক ও অ্যাড প্রমোশন',
    title: 'ইউটিউব বিজনেস চ্যানেল সাবস্ক্রাইব ও ভিডিও ওয়াচ টাস্ক',
    description:
      'উদ্যোক্তা ব্র্যান্ডের প্রমোশনাল ভিডিও ৩ মিনিট দেখুন, লাইক ও কমেন্ট করে কাজের রিপোর্ট জমা দিন।',
    actionInstructions:
      'কমেন্ট করার পর আপনার ইউটিউব হ্যান্ডেল বা নাম লিখে সাবমিট করুন। অ্যাডমিন অ্যাকাউন্টে ৳২৫ জমা হবে এবং আপনি পাবেন ৳১২।',
    totalRevenueToAdminBdt: 25,
    userPayoutBdt: 12,
    adminNetProfitBdt: 13,
    proofPlaceholder: 'আপনার ইউটিউব চ্যানেল নাম বা কমেন্ট লিখুন...',
    badge: 'ইউজার পাবেন +৳১২ • অ্যাডমিন লাভ +৳১৩',
  },

  // ২. জিরো-ইনভেস্টমেন্ট ড্রপশিপিং ও রিসেলিং হাব
  {
    id: 'work-resell-1',
    moduleType: 'dropship_resell',
    moduleTitleBn: '২. ড্রপশিপিং ও রিসেলিং হাব',
    title: 'সুন্দরবনের খাঁটি প্রাকৃতিক মধু (১ কেজি জার) রিসেল অর্ডার',
    description:
      'পাইকারি মূল্য ৳৪০০, খুচরা বিক্রয়মূল্য ৳৬৫০। পুঁজি ছাড়াই অর্ডার সংগ্রহ করে কাস্টমারের নাম-ঠিকানা জমা দিন।',
    actionInstructions:
      'কাস্টমারের নাম, মোবাইল নম্বর ও ডেলিভারি ঠিকানা নিচে লিখুন। ডেলিভারি হতেই অ্যাডমিন অ্যাকাউন্টে মোট লাভ ৳২৫০ জমা হবে, সেখান থেকে অ্যাডমিন আপনাকে ৳১৫০ রিসেলার কমিশন ওয়ালেটে পাঠিয়ে দেবেন (অ্যাডমিন লাভ ৳১০০)।',
    totalRevenueToAdminBdt: 250,
    userPayoutBdt: 150,
    adminNetProfitBdt: 100,
    proofPlaceholder: 'কাস্টমারের নাম, মোবাইল নম্বর ও ঠিকানা লিখুন...',
    badge: 'ইউজার কমিশন +৳১৫০ • অ্যাডমিন লাভ +৳১০০',
  },
  {
    id: 'work-resell-2',
    moduleType: 'dropship_resell',
    moduleTitleBn: '২. ড্রপশিপিং ও রিসেলিং হাব',
    title: 'প্রিমিয়াম স্মার্ট ওয়াচ ও ওয়্যারলেস ইয়ারবাড কম্বো রিসেল',
    description:
      'পাইকারি মূল্য ৳৫৫০, খুচরা বিক্রয়মূল্য ৳৮৫০। ফেসবুক মার্কেটপ্লেসে পোস্ট করে অর্ডার কনফার্ম করুন।',
    actionInstructions:
      'কাস্টমারের অর্ডার তথ্য জমা দিন। অর্ডার ভেরিফাই হলে অ্যাডমিন অ্যাকাউন্টে ৳৩০০ মার্জিন জমা হবে এবং সেখান থেকে আপনি পাবেন ৳১৮০ কমিশন (অ্যাডমিন লাভ ৳১২০)।',
    totalRevenueToAdminBdt: 300,
    userPayoutBdt: 180,
    adminNetProfitBdt: 120,
    proofPlaceholder: 'কাস্টমারের নাম, মোবাইল ও অর্ডার নোট লিখুন...',
    badge: 'ইউজার কমিশন +৳১৮০ • অ্যাডমিন লাভ +৳১২০',
  },

  // ৩. মোবাইল রিচার্জ ও টেলিকম ড্রাইভ প্যাক জোন
  {
    id: 'work-telecom-1',
    moduleType: 'telecom_drive',
    moduleTitleBn: '৩. টেলিকম ড্রাইভ প্যাক ও রিচার্জ',
    title: 'গ্রামীণফোন ও রবি ৫০ জিবি + ৫০০ মিনিট স্পেশাল ড্রাইভ প্যাক সেল',
    description:
      'বাজারমূল্য ৳৫৯৯, আমাদের ড্রাইভ রেট ৳৪৯০। নিজের বা কাস্টমারের নম্বরে ড্রাইভ প্যাক অর্ডার করে কমিশন আয় করুন।',
    actionInstructions:
      'যে মোবাইল নম্বরে ড্রাইভ প্যাক যাবে এবং পেমেন্ট রেফারেন্স লিখুন। প্রতিটি ড্রাইভ সেলে অ্যাডমিন অ্যাকাউন্টে ৳৬০ কমিশন জমা হবে এবং ইউজার পাবেন ৳৩৫ ক্যাশব্যাক (অ্যাডমিন লাভ ৳২৫)।',
    totalRevenueToAdminBdt: 60,
    userPayoutBdt: 35,
    adminNetProfitBdt: 25,
    proofPlaceholder: 'ড্রাইভ নম্বর (017/018...) ও ট্রানজেকশন নোট লিখুন...',
    badge: 'ইউজার ক্যাশব্যাক +৳৩৫ • অ্যাডমিন লাভ +৳২৫',
  },

  // ৪. ভিআইপি লেভেল ও এজেন্সি টিম আর্নিং
  {
    id: 'work-vip-1',
    moduleType: 'vip_package',
    moduleTitleBn: '৪. ভিআইপি লেভেল ও টিম কমিশন',
    title: 'ভিআইপি টিম লিডার ও অ্যাক্টিভ মেম্বার রেফারেল টাস্ক',
    description:
      'নতুন উদ্যোক্তাকে প্ল্যাটফর্মে যুক্ত করে ভিআইপি প্যাকেজ অ্যাক্টিভেশন সম্পন্ন করান।',
    actionInstructions:
      'নতুন সদস্যের মোবাইল নম্বর বা রেফারেল কোড নিচে জমা দিন। প্রতিটি ভিআইপি অ্যাক্টিভেশনে অ্যাডমিন অ্যাকাউন্টে ৳২০০ জমা হবে এবং আপনি পাবেন ৳৮০ ইনস্ট্যান্ট লিডার বোনাস (অ্যাডমিন লাভ ৳১২০)।',
    totalRevenueToAdminBdt: 200,
    userPayoutBdt: 80,
    adminNetProfitBdt: 120,
    proofPlaceholder: 'রেফারকৃত সদস্যের নাম ও মোবাইল নম্বর লিখুন...',
    badge: 'ইউজার বোনাস +৳৮০ • অ্যাডমিন লাভ +৳১২০',
  },

  // ৫. পেইড বিজনেস কোর্স ও লাইভ ট্রেনিং অ্যাসাইনমেন্ট
  {
    id: 'work-skill-1',
    moduleType: 'skill_course',
    moduleTitleBn: '৫. বিজনেস কোর্স ও স্কিল রুম',
    title: 'ফেসবুক বুস্টিং ও দারাজ সেলার প্র্যাকটিক্যাল অ্যাসাইনমেন্ট কাজ',
    description:
      'আমাদের ক্লায়েন্টদের ফেসবুক পেজ সেটআপ বা দারাজ শপের প্রোডাক্ট লিস্টিং করে প্রতি প্রজেক্টে আয় করুন।',
    actionInstructions:
      'কাজটি সম্পন্ন করে পেজ লিংক বা কাজের বিবরণ জমা দিন। ক্লায়েন্ট পেমেন্ট ৳১৫০ সরাসরি অ্যাডমিন অ্যাকাউন্টে জমা হবে এবং অ্যাডমিন সেখান থেকে আপনাকে ৳৯০ পারিশ্রমিক দেবেন (অ্যাডমিন লাভ ৳৬০)।',
    totalRevenueToAdminBdt: 150,
    userPayoutBdt: 90,
    adminNetProfitBdt: 60,
    proofPlaceholder: 'সম্পন্ন করা কাজের লিংক বা বিবরণ লিখুন...',
    badge: 'ইউজার পারিশ্রমিক +৳৯০ • অ্যাডমিন লাভ +৳৬০',
  },

  // ৬. প্রিমিয়াম লিস্টিং ও সেলার বুস্ট ফিচার
  {
    id: 'work-boost-1',
    moduleType: 'seller_boost',
    moduleTitleBn: '৬. মার্কেটপ্লেস সেলার বুস্ট ও এস্ক্রো',
    title: 'মার্কেটপ্লেস সেলার প্রোডাক্ট প্রমোশন ও স্পন্সরড বুস্ট কাজ',
    description:
      'মার্কেটপ্লেসের ফিচারড সেলারদের পণ্য ৫টি গ্রুপে শেয়ার ও কাস্টমার ইনকোয়ারি এনে দিন।',
    actionInstructions:
      'পণ্যের নাম এবং শেয়ারকৃত গ্রুপের নাম লিখে জমা দিন। সেলারের বুস্ট ফি থেকে ৳৮০ অ্যাডমিন অ্যাকাউন্টে জমা হবে এবং আপনি পাবেন ৳৪০ প্রমোশন ফি (অ্যাডমিন লাভ ৳৪০)।',
    totalRevenueToAdminBdt: 80,
    userPayoutBdt: 40,
    adminNetProfitBdt: 40,
    proofPlaceholder: 'প্রমোশনকৃত পণ্যের নাম ও প্রুফ বিবরণ লিখুন...',
    badge: 'ইউজার প্রমোশন আয় +৳৪০ • অ্যাডমিন লাভ +৳৪০',
  },
];

export interface PremiumMembershipPostItem {
  id: string;
  title: string;
  subtitle: string;
  feeBdt: number;
  bonusBdt: number;
  dailyIncomeEstimateBdt: number;
  benefits: string[];
  badge: string;
  publishedAt: string;
}

export interface PremiumMembershipConfig {
  headline: string;
  subHeadline: string;
  mainFeeBdt: number;
  referralBonusBdt: number;
  rewardPointsBonus: number;
  mainBenefits: string[];
  announcementPost: string;
  customPosts: PremiumMembershipPostItem[];
}

export const DEFAULT_PREMIUM_MEMBERSHIP_CONFIG: PremiumMembershipConfig = {
  headline: 'প্রিমিয়াম উদ্যোক্তা মেম্বারশিপ — ৳২৯৯',
  subHeadline:
    'এককালীন মাত্র ৳২৯৯ পেমেন্টে সকল ভিআইপি ব্যবসার গাইড, পাইকারি সাপ্লায়ার ডিরেক্টরি, ভিআইপি আর্নিং কাজ এবং রেফারেল বোনাস সুবিধা।',
  mainFeeBdt: 299,
  referralBonusBdt: 50,
  rewardPointsBonus: 50,
  mainBenefits: [
    'সকল প্রিমিয়াম ও এক্সক্লুসিভ বিজনেস আইডিয়া আনলক',
    'ঢাকা ও সারাদেশের ভেরিফায়েড পাইকারি সাপ্লায়ার গাইড',
    'তাৎক্ষণিক +৫০ রিওয়ার্ড পয়েন্ট বোনাস',
    'প্রতিটি সফল প্রিমিয়াম রেফারেলে +৳৫০ ওয়ালেট বোনাস ও +৩০ পয়েন্ট',
    'ভিআইপি ওয়ার্ক জোন ও ৭টি ক্যালকুলেটরে অগ্রাধিকার সুবিধা',
  ],
  announcementPost:
    '🔥 বিশেষ অফার: প্রিমিয়াম মেম্বারশিপ সক্রিয় করলেই পাচ্ছেন ভেরিফায়েড সাপ্লায়ার লিস্ট, ভিআইপি রিসেলিং পণ্য এবং প্রতি রেফারে নগদ ৳৫০ বোনাস!',
  customPosts: [
    {
      id: 'prem-post-1',
      title: '👑 প্রিমিয়াম উদ্যোক্তা PRO প্যাক (আজকের বিশেষ অফার)',
      subtitle:
        'একবার মেম্বারশিপ নিলেই আজীবন সকল ভিআইপি বিজনেস গাইড, পাইকারি সোর্সিং নম্বর এবং ডেইলি প্রিমিয়াম কাজের সুবিধা পাবেন।',
      feeBdt: 299,
      bonusBdt: 50,
      dailyIncomeEstimateBdt: 100,
      benefits: [
        'সকল প্রিমিয়াম বিজনেস প্ল্যান ও লাভের হিসাব আনলক',
        'সরাসরি কারখানা ও পাইকারি সাপ্লায়ারদের মোবাইল নম্বর',
        'প্রতিটি রেফারে নগদ +৳৫০ ওয়ালেট বোনাস',
      ],
      badge: 'সবচেয়ে জনপ্রিয় PRO প্ল্যান',
      publishedAt: 'অফিসিয়াল মেম্বারশিপ পোস্ট',
    },
  ],
};

const PREMIUM_MEM_CFG_KEY = 'alpo_pujir_premium_membership_cfg_v1';

export function getPremiumMembershipConfig(): PremiumMembershipConfig {
  try {
    const raw = localStorage.getItem(PREMIUM_MEM_CFG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_PREMIUM_MEMBERSHIP_CONFIG,
        ...parsed,
        mainBenefits:
          Array.isArray(parsed.mainBenefits) && parsed.mainBenefits.length > 0
            ? parsed.mainBenefits
            : DEFAULT_PREMIUM_MEMBERSHIP_CONFIG.mainBenefits,
        customPosts: Array.isArray(parsed.customPosts)
          ? parsed.customPosts
          : DEFAULT_PREMIUM_MEMBERSHIP_CONFIG.customPosts,
      };
    }
  } catch {}
  return DEFAULT_PREMIUM_MEMBERSHIP_CONFIG;
}

export function savePremiumMembershipConfig(
  cfg: PremiumMembershipConfig
): void {
  try {
    localStorage.setItem(PREMIUM_MEM_CFG_KEY, JSON.stringify(cfg));
  } catch {}
}





