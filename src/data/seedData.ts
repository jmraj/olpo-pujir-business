const makeSvgDataUri = (title: string, subtitle: string, accent = '#D4AF37') =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#042F24"/>
          <stop offset="55%" stop-color="#064E3B"/>
          <stop offset="100%" stop-color="#047857"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#bg)"/>
      <circle cx="680" cy="110" r="140" fill="${accent}" opacity="0.14"/>
      <circle cx="120" cy="400" r="180" fill="#10B981" opacity="0.12"/>
      <rect x="48" y="48" width="704" height="404" rx="28" fill="none" stroke="${accent}" stroke-width="2" stroke-opacity="0.35"/>
      <text x="80" y="230" fill="#FDE68A" font-family="sans-serif" font-size="38" font-weight="bold">${title}</text>
      <text x="80" y="285" fill="#D1FAE5" font-family="sans-serif" font-size="22">${subtitle}</text>
      <text x="80" y="395" fill="#A7F3D0" font-family="sans-serif" font-size="16" font-weight="bold">অল্প পুঁজির ব্যবসা • ছোট পুঁজি • বড় সম্ভাবনা</text>
    </svg>`
  )}`;

const heroBannerImg = makeSvgDataUri('অল্প পুঁজির ব্যবসা', 'ছোট পুঁজি • বড় সম্ভাবনা');
const spiceIdeaImg = makeSvgDataUri('মসলা গুঁড়া ও প্যাকেজিং', 'খাঁটি মসলা প্রস্তুত ও বাজারজাতকরণ');
const teaIdeaImg = makeSvgDataUri('প্রিমিয়াম চা ও কফি স্টল', 'তন্দুরি ও মালাই চা স্টার্টআপ');
const packagingKitImg = makeSvgDataUri('ফুড গ্রেড প্যাকেজিং কিট', 'ইমপোর্টেড স্ট্যান্ড-আপ পাউচ ও সিলার');
const entrepreneurAvatarImg = makeSvgDataUri('সফল উদ্যোক্তা', 'অল্প পুঁজির ব্যবসা কমিউনিটি');

export const ASSETS = {
  heroBannerImg,
  spiceIdeaImg,
  teaIdeaImg,
  packagingKitImg,
  entrepreneurAvatarImg,
};

export interface CategoryItem {
  id: string;
  nameBn: string;
  nameEn: string;
  iconName: string;
  group: 'existing' | 'new' | 'popular' | 'special';
  ideaCount: number;
  enabled: boolean;
  order: number;
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

export const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: 'cat-1', nameBn: 'খাবার ও পানীয়', nameEn: 'Food & Beverage', iconName: 'Utensils', group: 'existing', ideaCount: 18, enabled: true, order: 1 },
  { id: 'cat-2', nameBn: 'পোশাক ও ফ্যাশন', nameEn: 'Apparel & Fashion', iconName: 'Shirt', group: 'existing', ideaCount: 15, enabled: true, order: 2 },
  { id: 'cat-3', nameBn: 'অনলাইন ব্যবসা', nameEn: 'Online Business', iconName: 'Globe', group: 'existing', ideaCount: 22, enabled: true, order: 3 },
  { id: 'cat-4', nameBn: 'কৃষি', nameEn: 'Agriculture', iconName: 'Sprout', group: 'existing', ideaCount: 14, enabled: true, order: 4 },
  { id: 'cat-5', nameBn: 'মাছ চাষ', nameEn: 'Fisheries', iconName: 'Fish', group: 'existing', ideaCount: 9, enabled: true, order: 5 },
  { id: 'cat-6', nameBn: 'বিউটি ও পার্লার', nameEn: 'Beauty & Parlor', iconName: 'Sparkles', group: 'existing', ideaCount: 11, enabled: true, order: 6 },
  { id: 'cat-7', nameBn: 'ফাস্ট ফুড', nameEn: 'Fast Food', iconName: 'Pizza', group: 'popular', ideaCount: 16, enabled: true, order: 7 },
  { id: 'cat-8', nameBn: 'চা/কফি', nameEn: 'Tea & Coffee', iconName: 'Coffee', group: 'popular', ideaCount: 12, enabled: true, order: 8 },
  { id: 'cat-9', nameBn: 'কসমেটিকস', nameEn: 'Cosmetics', iconName: 'Heart', group: 'popular', ideaCount: 13, enabled: true, order: 9 },
  { id: 'cat-10', nameBn: 'হাঁস-মুরগি', nameEn: 'Poultry Farming', iconName: 'Bird', group: 'existing', ideaCount: 10, enabled: true, order: 10 },
  { id: 'cat-11', nameBn: 'গবাদিপশু', nameEn: 'Livestock', iconName: 'ShieldCheck', group: 'existing', ideaCount: 8, enabled: true, order: 11 },
  { id: 'cat-12', nameBn: 'ফুল ও নার্সারি', nameEn: 'Nursery & Flowers', iconName: 'Flower2', group: 'new', ideaCount: 9, enabled: true, order: 12 },
  { id: 'cat-13', nameBn: 'হস্তশিল্প', nameEn: 'Handicrafts', iconName: 'Scissors', group: 'new', ideaCount: 14, enabled: true, order: 13 },
  { id: 'cat-14', nameBn: 'গিফট ব্যবসা', nameEn: 'Gift & Custom Box', iconName: 'Gift', group: 'new', ideaCount: 11, enabled: true, order: 14 },
  { id: 'cat-15', nameBn: 'মোবাইল ও ইলেকট্রনিক্স', nameEn: 'Mobile & Electronics', iconName: 'Smartphone', group: 'new', ideaCount: 17, enabled: true, order: 15 },
  { id: 'cat-16', nameBn: 'কম্পিউটার ও প্রিন্টিং', nameEn: 'Computer & Printing', iconName: 'Printer', group: 'new', ideaCount: 12, enabled: true, order: 16 },
  { id: 'cat-17', nameBn: 'ফেসবুক ব্যবসা', nameEn: 'F-Commerce', iconName: 'Share2', group: 'popular', ideaCount: 25, enabled: true, order: 17 },
  { id: 'cat-18', nameBn: 'ই-কমার্স', nameEn: 'E-Commerce', iconName: 'ShoppingBag', group: 'popular', ideaCount: 19, enabled: true, order: 18 },
  { id: 'cat-19', nameBn: 'ফ্রিল্যান্সিং', nameEn: 'Freelancing', iconName: 'Laptop', group: 'new', ideaCount: 15, enabled: true, order: 19 },
  { id: 'cat-20', nameBn: 'ডিজিটাল সার্ভিস', nameEn: 'Digital Services', iconName: 'Zap', group: 'new', ideaCount: 13, enabled: true, order: 20 },
  { id: 'cat-21', nameBn: 'হোম সার্ভিস', nameEn: 'Home Services', iconName: 'Wrench', group: 'new', ideaCount: 10, enabled: true, order: 21 },
  { id: 'cat-22', nameBn: 'ডেলিভারি', nameEn: 'Local Delivery', iconName: 'Truck', group: 'new', ideaCount: 8, enabled: true, order: 22 },
  { id: 'cat-23', nameBn: 'কুরিয়ার', nameEn: 'Courier Agency', iconName: 'Package', group: 'new', ideaCount: 7, enabled: true, order: 23 },
  { id: 'cat-24', nameBn: 'দোকানভিত্তিক ব্যবসা', nameEn: 'Retail Shop', iconName: 'Store', group: 'existing', ideaCount: 20, enabled: true, order: 24 },
  { id: 'cat-25', nameBn: 'ঘরে বসে ব্যবসা', nameEn: 'Home-based Business', iconName: 'Home', group: 'special', ideaCount: 24, enabled: true, order: 25 },
  { id: 'cat-26', nameBn: 'মৌসুমি ব্যবসা', nameEn: 'Seasonal Business', iconName: 'Sun', group: 'special', ideaCount: 11, enabled: true, order: 26 },
  { id: 'cat-27', nameBn: 'গ্রামভিত্তিক ব্যবসা', nameEn: 'Rural Business', iconName: 'Trees', group: 'special', ideaCount: 16, enabled: true, order: 27 },
  { id: 'cat-28', nameBn: 'শহরভিত্তিক ব্যবসা', nameEn: 'Urban Business', iconName: 'Building2', group: 'special', ideaCount: 18, enabled: true, order: 28 },
  { id: 'cat-29', nameBn: 'নারীদের জন্য ব্যবসা', nameEn: 'Women Entrepreneurs', iconName: 'Award', group: 'special', ideaCount: 21, enabled: true, order: 29 },
  { id: 'cat-30', nameBn: 'শিক্ষার্থীদের জন্য ব্যবসা', nameEn: 'Student Business', iconName: 'GraduationCap', group: 'special', ideaCount: 17, enabled: true, order: 30 },
];

export const INITIAL_BUSINESS_IDEAS: BusinessIdeaItem[] = [
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

export const ANDROID_KOTLIN_FILES: Record<string, string> = {
  'app/build.gradle.kts': `plugins {
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
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
    buildFeatures {
        compose = true
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
  'app/src/main/AndroidManifest.xml': `<?xml version="1.0" encoding="utf-8"?>
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
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
  'app/src/main/java/alpo/pujir/bebsha/MainActivity.kt': `package alpo.pujir.bebsha

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.*
import androidx.compose.runtime.*
import com.google.firebase.FirebaseApp
import com.google.firebase.appcheck.FirebaseAppCheck
import com.google.firebase.appcheck.playintegrity.PlayIntegrityAppCheckProviderFactory
import alpo.pujir.bebsha.ui.theme.AlpoPujirBebshaTheme
import alpo.pujir.bebsha.ui.navigation.AppNavigation

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        FirebaseApp.initializeApp(this)
        FirebaseAppCheck.getInstance().installAppCheckProviderFactory(
            PlayIntegrityAppCheckProviderFactory.getInstance()
        )
        setContent {
            AlpoPujirBebshaTheme {
                Surface(color = MaterialTheme.colorScheme.background) {
                    AppNavigation()
                }
            }
        }
    }
}`,
  'app/src/main/java/alpo/pujir/bebsha/data/FirestoreRepository.kt': `package alpo.pujir.bebsha.data

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.tasks.await

class FirestoreRepository(
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
  'SETUP_AND_APK_BUILD_GUIDE.md': `# অল্প পুঁজির ব্যবসা (alpo.pujir.bebsha) — Android Studio & Firebase Setup Guide

## ১. Firebase কনফিগারেশন
১. [Firebase Console](https://console.firebase.google.com/)-এ গিয়ে আপনার প্রজেক্ট **gen-lang-client-0377680929** ওপেন করুন।
২. Android অ্যাপ যুক্ত করুন: Package Name দিন \`alpo.pujir.bebsha\` এবং আপনার SHA-1 / SHA-256 সার্টিফিকেট যুক্ত করুন।
৩. \`google-services.json\` ডাউনলোড করে \`app/google-services.json\` পাথে রাখুন।
৪. Authentication -> Sign-in method থেকে **Email/Password** এবং **Google Sign-In** সক্রিয় করুন।
৫. এই প্রজেক্টের \`firestore.rules\` ফাইলটি ইতিমধ্যে আপনার ক্লাউড ডাটাবেসে ডিপ্লয় করা হয়েছে।

## ২. AI Consultant (Cloud Functions / Backend)
- অ্যাপের ভেতরে কোনো গোপন API Key রাখা হয়নি। \`server.ts\` অথবা Firebase Cloud Functions-এ \`GEMINI_API_KEY\` এনভায়রনমেন্ট ভ্যারিয়েবল হিসেবে সেট করুন।

## ৩. APK ও AAB বিল্ড কমান্ড
Android Studio টার্মিনালে নিচের কমান্ডগুলো রান করুন:
- Debug APK: \`./gradlew assembleDebug\`
- Release AAB (Play Store): \`./gradlew bundleRelease\`
`,
};
