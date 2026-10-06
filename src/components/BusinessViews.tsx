import React, { useState } from 'react';
import {
  Search,
  Heart,
  ArrowLeft,
  Star,
  Crown,
  TrendingUp,
  Coins,
  MapPin,
  Wrench,
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ShoppingBag,
  Megaphone,
  Calculator,
  ClipboardCheck,
  Bot,
  Utensils,
  Shirt,
  Globe,
  Sprout,
  Fish,
  Sparkles,
  Pizza,
  Coffee,
  Bird,
  ShieldCheck,
  Flower2,
  Scissors,
  Gift,
  Smartphone,
  Printer,
  Share2,
  Laptop,
  Zap,
  Truck,
  Package,
  Store,
  Home,
  Sun,
  Trees,
  Building2,
  Award,
  Filter,
} from 'lucide-react';
import { BusinessIdeaItem, CategoryItem } from '../data/seedData';

export const CategoryIcon: React.FC<{
  name: string;
  className?: string;
}> = ({ name, className = 'w-5 h-5' }) => {
  const icons: Record<string, React.ReactNode> = {
    Utensils: <Utensils className={className} />,
    Shirt: <Shirt className={className} />,
    Globe: <Globe className={className} />,
    Sprout: <Sprout className={className} />,
    Fish: <Fish className={className} />,
    Sparkles: <Sparkles className={className} />,
    Pizza: <Pizza className={className} />,
    Coffee: <Coffee className={className} />,
    Heart: <Heart className={className} />,
    Bird: <Bird className={className} />,
    ShieldCheck: <ShieldCheck className={className} />,
    Flower2: <Flower2 className={className} />,
    Scissors: <Scissors className={className} />,
    Gift: <Gift className={className} />,
    Smartphone: <Smartphone className={className} />,
    Printer: <Printer className={className} />,
    Share2: <Share2 className={className} />,
    ShoppingBag: <ShoppingBag className={className} />,
    Laptop: <Laptop className={className} />,
    Zap: <Zap className={className} />,
    Wrench: <Wrench className={className} />,
    Truck: <Truck className={className} />,
    Package: <Package className={className} />,
    Store: <Store className={className} />,
    Home: <Home className={className} />,
    Sun: <Sun className={className} />,
    Trees: <Trees className={className} />,
    Building2: <Building2 className={className} />,
    Award: <Award className={className} />,
    GraduationCap: <GraduationCap className={className} />,
  };
  return <>{icons[name] || <Store className={className} />}</>;
};

interface CategoriesScreenProps {
  categories: CategoryItem[];
  ideas: BusinessIdeaItem[];
  onSelectCategory: (categoryNameBn: string) => void;
  onSelectIdea: (idea: BusinessIdeaItem) => void;
}

export const CategoriesScreen: React.FC<CategoriesScreenProps> = ({
  categories,
  ideas,
  onSelectCategory,
  onSelectIdea,
}) => {
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState<
    'all' | 'popular' | 'new' | 'special' | 'existing'
  >('all');

  const enabledCategories = categories.filter((c) => c.enabled);
  const filtered = enabledCategories.filter((c) => {
    const matchesSearch =
      c.nameBn.toLowerCase().includes(search.toLowerCase()) ||
      c.nameEn.toLowerCase().includes(search.toLowerCase());
    const matchesGroup = groupFilter === 'all' || c.group === groupFilter;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="space-y-5 pb-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#042F24] via-[#064E3B] to-[#047857] rounded-3xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#FDE68A] border border-[#D4AF37]/40 mb-1.5">
              ৩০+ ব্যবসার খাত
            </span>
            <h2 className="text-xl font-bold">সকল ব্যবসার ক্যাটাগরি</h2>
            <p className="text-xs text-emerald-100/80 mt-0.5">
              আপনার পছন্দ ও দক্ষতা অনুযায়ী ব্যবসার খাত নির্বাচন করুন
            </p>
          </div>
          <button
            onClick={() => onSelectCategory('ALL')}
            className="px-3.5 py-2 rounded-xl bg-[#D4AF37] text-slate-950 font-bold text-xs shadow hover:brightness-105 cursor-pointer shrink-0"
          >
            সব আইডিয়া ({ideas.length})
          </button>
        </div>

        {/* Search input */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 text-emerald-200 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ক্যাটাগরি খুঁজুন (যেমন: খাবার, অনলাইন, কৃষি, চা)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/12 border border-white/20 text-white placeholder:text-emerald-100/60 text-xs focus:outline-none focus:bg-white/20"
          />
        </div>
      </div>

      {/* Group Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'সব ক্যাটাগরি' },
          { id: 'popular', label: 'জনপ্রিয় খাত' },
          { id: 'special', label: 'বিশেষ (নারী/শিক্ষার্থী/ঘরোয়া)' },
          { id: 'new', label: 'আধুনিক ও ডিজিটাল' },
          { id: 'existing', label: 'প্রচলিত ব্যবসা' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setGroupFilter(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              groupFilter === tab.id
                ? 'bg-[#064E3B] text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200/80 hover:border-emerald-600/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/70">
          <p className="text-sm font-bold text-slate-700">
            কোনো ক্যাটাগরি পাওয়া যায়নি
          </p>
          <p className="text-xs text-slate-500 mt-1">
            অন্য কোনো নাম লিখে খুঁজুন অথবা সব ক্যাটাগরি ট্যাবে ক্লিক করুন।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filtered.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.nameBn)}
              className="bg-white rounded-[20px] p-4 border border-emerald-900/10 shadow-xs hover:shadow-md hover:border-[#059669] transition text-left flex flex-col justify-between group cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/80 border border-emerald-200/70 flex items-center justify-center text-[#064E3B] group-hover:bg-[#064E3B] group-hover:text-[#FBBF24] transition">
                  <CategoryIcon name={cat.iconName} className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70 tabular-nums">
                  {cat.ideaCount}টি আইডিয়া
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#064E3B] line-clamp-1">
                  {cat.nameBn}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {cat.nameEn}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Quick Featured Ideas Preview below Categories */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-slate-900">
            সেরা লাভজনক ব্যবসা গাইডসমূহ
          </h3>
          <button
            onClick={() => onSelectCategory('ALL')}
            className="text-xs font-bold text-[#059669] hover:underline cursor-pointer"
          >
            সব দেখুন →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {ideas.slice(0, 4).map((idea) => (
            <div
              key={idea.id}
              onClick={() => onSelectIdea(idea)}
              className="bg-white rounded-[20px] p-3.5 border border-emerald-900/10 shadow-xs hover:shadow-md transition flex items-center gap-3.5 cursor-pointer"
            >
              <img
                src={idea.imageUrl}
                alt={idea.title}
                className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-slate-100"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-[#064E3B]">
                    {idea.category}
                  </span>
                  {idea.isPremium && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 flex items-center gap-0.5">
                      <Crown className="w-2.5 h-2.5" /> প্রিমিয়াম
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                  {idea.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  পুঁজি:{' '}
                  <span className="font-bold text-[#064E3B]">
                    {idea.requiredInvestment}
                  </span>
                </p>
                <p className="text-[11px] text-amber-700 font-semibold">
                  সম্ভাব্য লাভ: {idea.estimatedProfit}/মাস
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface BusinessIdeasScreenProps {
  ideas: BusinessIdeaItem[];
  categories: CategoryItem[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectIdea: (idea: BusinessIdeaItem) => void;
  favorites: string[];
  onToggleFavorite: (ideaId: string) => void;
  onBackToCategories: () => void;
}

export const BusinessIdeasScreen: React.FC<BusinessIdeasScreenProps> = ({
  ideas,
  categories,
  selectedCategory,
  onSelectCategory,
  onSelectIdea,
  favorites,
  onToggleFavorite,
  onBackToCategories,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [budgetFilter, setBudgetFilter] = useState<
    'all' | 'under15k' | '15kTo30k' | 'above30k'
  >('all');
  const [difficultyFilter, setDifficultyFilter] = useState<
    'all' | 'সহজ' | 'মাঝারি' | 'উন্নত'
  >('all');

  const filteredIdeas = ideas.filter((idea) => {
    const matchesCat =
      selectedCategory === 'ALL' ||
      !selectedCategory ||
      idea.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBudget =
      budgetFilter === 'all' ||
      (budgetFilter === 'under15k' && idea.minInvestmentBdt <= 15000) ||
      (budgetFilter === '15kTo30k' &&
        idea.minInvestmentBdt > 15000 &&
        idea.minInvestmentBdt <= 30000) ||
      (budgetFilter === 'above30k' && idea.minInvestmentBdt > 30000);
    const matchesDiff =
      difficultyFilter === 'all' || idea.difficulty === difficultyFilter;

    return matchesCat && matchesSearch && matchesBudget && matchesDiff;
  });

  return (
    <div className="space-y-4 pb-6">
      {/* Top Bar */}
      <div className="bg-white rounded-3xl p-4 border border-emerald-900/10 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBackToCategories}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {selectedCategory === 'ALL' || !selectedCategory
                  ? 'সকল ব্যবসার আইডিয়া'
                  : `${selectedCategory} — ব্যবসার আইডিয়া`}
              </h2>
              <p className="text-xs text-slate-500">
                মোট {filteredIdeas.length}টি বাস্তবসম্মত বিজনেস গাইড পাওয়া গেছে
              </p>
            </div>
          </div>

          {selectedCategory !== 'ALL' && (
            <button
              onClick={() => onSelectCategory('ALL')}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 text-[#064E3B] text-xs font-bold cursor-pointer"
            >
              সব ক্যাটাগরি দেখুন
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ব্যবসার নাম বা ধরন লিখে খুঁজুন (যেমন: মসলা, চা, পোশাক)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-[#059669] focus:outline-none"
          />
        </div>

        {/* Budget & Difficulty Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> পুঁজি:
          </span>
          {[
            { id: 'all', label: 'সব বাজেট' },
            { id: 'under15k', label: '৳৫,০০০ – ৳১৫,০০০' },
            { id: '15kTo30k', label: '৳১৫,০০০ – ৳৩০,০০০' },
            { id: 'above30k', label: '৳৩০,০০০+' },
          ].map((b) => (
            <button
              key={b.id}
              onClick={() => setBudgetFilter(b.id as any)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                budgetFilter === b.id
                  ? 'bg-[#064E3B] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {b.label}
            </button>
          ))}

          <span className="text-[11px] font-semibold text-slate-500 ml-1">
            ধরন:
          </span>
          {(['all', 'সহজ', 'মাঝারি', 'উন্নত'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                difficultyFilter === diff
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {diff === 'all' ? 'সব' : diff}
            </button>
          ))}
        </div>
      </div>

      {/* Category Horizontal Quick Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => onSelectCategory('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
            selectedCategory === 'ALL'
              ? 'bg-[#064E3B] text-white'
              : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          সবগুলো ({ideas.length})
        </button>
        {categories.slice(0, 12).map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.nameBn)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.nameBn
                ? 'bg-[#064E3B] text-white'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            {cat.nameBn}
          </button>
        ))}
      </div>

      {/* Ideas List */}
      {filteredIdeas.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
          <p className="text-base font-bold text-slate-800">
            এই ফিল্টারে কোনো ব্যবসার আইডিয়া পাওয়া যায়নি
          </p>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            সব ক্যাটাগরি এবং সব বাজেট ফিল্টার রিসেট করে সব আইডিয়া দেখুন।
          </p>
          <button
            onClick={() => {
              onSelectCategory('ALL');
              setBudgetFilter('all');
              setDifficultyFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2.5 rounded-xl bg-[#064E3B] text-white text-xs font-bold cursor-pointer"
          >
            ফিল্টার রিসেট করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIdeas.map((idea) => {
            const isFav = favorites.includes(idea.id);
            return (
              <div
                key={idea.id}
                className="bg-white rounded-[22px] overflow-hidden border border-emerald-900/10 shadow-xs hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={idea.imageUrl}
                      alt={idea.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-[#064E3B]/90 backdrop-blur-xs text-white text-[11px] font-bold">
                        {idea.category}
                      </span>
                      {idea.isPremium && (
                        <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 text-[11px] font-bold flex items-center gap-1 shadow">
                          <Crown className="w-3 h-3" /> প্রিমিয়াম
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(idea.id);
                      }}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFav
                            ? 'fill-rose-500 text-rose-500'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <span className="text-xs font-semibold bg-black/40 px-2.5 py-0.5 rounded-lg backdrop-blur-xs">
                        স্তর: {idea.difficulty}
                      </span>
                      <span className="text-xs font-bold flex items-center gap-1 bg-black/40 px-2.5 py-0.5 rounded-lg">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {idea.rating}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-bold text-slate-900 mb-1.5">
                      {idea.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                      {idea.shortDescription}
                    </p>

                    <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-900/10">
                      <div>
                        <span className="text-[10px] text-slate-500 block">
                          প্রয়োজনীয় পুঁজি
                        </span>
                        <span className="text-xs font-bold text-[#064E3B] tabular-nums">
                          {idea.requiredInvestment}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">
                          মাসিক সম্ভাব্য লাভ
                        </span>
                        <span className="text-xs font-bold text-amber-700 tabular-nums">
                          {idea.estimatedProfit}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-4">
                  <button
                    onClick={() => onSelectIdea(idea)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#064E3B] to-[#059669] text-white text-xs font-bold shadow-sm hover:brightness-105 transition cursor-pointer"
                  >
                    সম্পূর্ণ গাইড ও হিসাব দেখুন →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface BusinessIdeaDetailScreenProps {
  idea: BusinessIdeaItem;
  isFavorite: boolean;
  isUserPremium: boolean;
  onToggleFavorite: (id: string) => void;
  onBack: () => void;
  onOpenCalculator: () => void;
  onOpenChecklist: () => void;
  onAskAiAboutIdea: (promptText: string) => void;
  onUpgradePremium: () => void;
}

export const BusinessIdeaDetailScreen: React.FC<
  BusinessIdeaDetailScreenProps
> = ({
  idea,
  isFavorite,
  isUserPremium,
  onToggleFavorite,
  onBack,
  onOpenCalculator,
  onOpenChecklist,
  onAskAiAboutIdea,
  onUpgradePremium,
}) => {
  return (
    <div className="space-y-5 pb-8">
      {/* Top Hero Image & Action Header */}
      <div className="bg-white rounded-[26px] overflow-hidden border border-emerald-900/10 shadow-sm">
        <div className="relative h-56 sm:h-64">
          <img
            src={idea.imageUrl}
            alt={idea.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#022C22] via-slate-950/40 to-transparent" />

          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <button
              onClick={onBack}
              className="px-3.5 py-2 rounded-xl bg-white/90 backdrop-blur-xs text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> ফিরে যান
            </button>

            <button
              onClick={() => onToggleFavorite(idea.id)}
              className="px-3.5 py-2 rounded-xl bg-white/90 backdrop-blur-xs text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-700'
                }`}
              />
              <span>{isFavorite ? 'সেভ করা হয়েছে' : 'ফেভারিটে রাখুন'}</span>
            </button>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#D4AF37] text-slate-950 text-xs font-bold">
                {idea.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-semibold">
                কঠিনতার মাত্রা: {idea.difficulty}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-amber-300 text-xs font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> {idea.rating}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold leading-snug">
              {idea.title}
            </h1>
          </div>
        </div>

        <div className="p-5">
          <p className="text-sm text-slate-700 leading-relaxed">
            {idea.shortDescription}
          </p>

          {/* Financial Highlights Grid (5 Key Metrics) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200">
              <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold mb-1">
                <Coins className="w-4 h-4 text-[#059669]" /> প্রয়োজনীয় পুঁজি
              </div>
              <div className="text-sm font-bold text-[#064E3B] tabular-nums">
                {idea.requiredInvestment}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200">
              <div className="flex items-center gap-1.5 text-xs text-amber-900 font-semibold mb-1">
                <TrendingUp className="w-4 h-4 text-amber-600" /> মাসিক নিট লাভ
              </div>
              <div className="text-sm font-bold text-amber-800 tabular-nums">
                {idea.estimatedProfit}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-semibold mb-1">
                দৈনিক সম্ভাব্য বিক্রি
              </div>
              <div className="text-sm font-bold text-slate-900 tabular-nums">
                {idea.expectedDailySales}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-semibold mb-1">
                মাসিক সম্ভাব্য আয় ও খরচ
              </div>
              <div className="text-xs font-bold text-slate-900 tabular-nums">
                আয়: {idea.expectedMonthlyRevenue}
              </div>
              <div className="text-[11px] text-slate-500 tabular-nums">
                খরচ: {idea.estimatedExpenses}
              </div>
            </div>
          </div>

          {/* Interactive Tool Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={onOpenCalculator}
              className="py-2.5 px-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Calculator className="w-4 h-4" /> লাভ ও পুঁজি ক্যালকুলেটর
            </button>
            <button
              onClick={onOpenChecklist}
              className="py-2.5 px-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <ClipboardCheck className="w-4 h-4" /> ব্যবসা শুরুর চেকলিস্ট
            </button>
            <button
              onClick={() =>
                onAskAiAboutIdea(
                  `"${idea.title}" ব্যবসাটি আমি ${idea.requiredInvestment} পুঁজিতে শুরু করতে চাই। আমাকে প্রথম ৩০ দিনের অ্যাকশন প্ল্যান ও ঝুঁকি কমানোর উপায় বলুন।`
                )
              }
              className="py-2.5 px-3.5 rounded-xl bg-[#064E3B] text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Bot className="w-4 h-4 text-[#FBBF24]" /> AI পরামর্শকের মতামত নিন
            </button>
          </div>
        </div>
      </div>

      {/* Premium Gate Banner if Idea is Premium and User is Free */}
      {idea.isPremium && !isUserPremium && (
        <div className="bg-gradient-to-r from-[#042F24] via-[#064E3B] to-[#047857] rounded-3xl p-5 text-white border border-[#D4AF37]/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-slate-950 mb-1.5">
              <Crown className="w-3 h-3" /> প্রিমিয়াম বিজনেস ব্লুপ্রিন্ট
            </span>
            <h3 className="text-base font-bold">
              সোর্সিং গোপন সূত্র ও প্রিমিয়াম মেন্টরশিপ আনলক করুন
            </h3>
            <p className="text-xs text-emerald-100/85 mt-0.5">
              মাত্র ৳২৯৯ প্রিমিয়াম মেম্বারশিপে সকল ভিআইপি বিজনেস গাইড ও বোনাস
              পয়েন্ট পান।
            </p>
          </div>
          <button
            onClick={onUpgradePremium}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-bold text-xs shrink-0 shadow cursor-pointer"
          >
            ৳২৯৯ প্রিমিয়াম নিন
          </button>
        </div>
      )}

      {/* Detailed 15-Section Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                প্রয়োজনীয় যন্ত্রপাতি ও উপকরণ
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {idea.requiredEquipment}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                উপযুক্ত স্থান (Required Location)
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {idea.requiredLocation}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                প্রয়োজনীয় দক্ষতা (Required Skills)
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {idea.requiredSkills}
              </p>
            </div>
          </div>
        </div>

        {/* Step-by-Step Startup Guide */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              ধাপে ধাপে ব্যবসা শুরু করার নিয়ম (Step-by-Step Guide)
            </h3>
          </div>
          <div className="space-y-2.5">
            {idea.startupSteps.split('\n').map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 font-medium leading-relaxed"
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        {/* Sourcing & Marketing */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                পাইকারি পণ্য ও কাঁচামাল সোর্সিং গাইড
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {idea.productSourcing}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                মার্কেটিং ও কাস্টমার পাওয়ার কৌশল
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {idea.marketingStrategy}
              </p>
            </div>
          </div>
        </div>

        {/* Risk & Profit Tips */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                সম্ভাব্য ঝুঁকি ও সমাধান
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {idea.risk}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                সফল হওয়ার বিশেষ টিপস
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {idea.tips}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
