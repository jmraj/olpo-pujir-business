import React, { useState, useEffect, useRef } from 'react';
import {
  CheckSquare,
  Square,
  BookOpen,
  Bot,
  Send,
  Sparkles,
  Award,
  ExternalLink,
  ArrowLeft,
  Star,
  Clock,
  UserCheck,
  RotateCcw,
  Copy,
  Check,
} from 'lucide-react';
import {
  ChecklistItem,
  AdviceArticle,
  SuccessStoryItem,
  ResourceSiteItem,
  INITIAL_BUSINESS_IDEAS,
  BusinessIdeaItem,
} from '../data/seedData';

interface ChecklistsScreenProps {
  checklists: ChecklistItem[];
  completedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
  onResetTasks: () => void;
  onBack: () => void;
}

export const ChecklistsScreen: React.FC<ChecklistsScreenProps> = ({
  checklists,
  completedTaskIds,
  onToggleTask,
  onResetTasks,
  onBack,
}) => {
  const [activeChecklistId, setActiveChecklistId] = useState<string>(
    checklists[0]?.id || 'chk-startup'
  );

  const totalTasks = checklists.reduce((acc, c) => acc + c.tasks.length, 0);
  const doneCount = completedTaskIds.length;
  const overallPercent =
    totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

  const activeList =
    checklists.find((c) => c.id === activeChecklistId) || checklists[0];

  return (
    <div className="space-y-5 pb-8">
      <div className="bg-gradient-to-r from-[#042F24] via-[#064E3B] to-[#047857] rounded-3xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-xl bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> হোম-এ ফিরুন
          </button>
          <button
            onClick={onResetTasks}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> রিসেট
          </button>
        </div>

        <h2 className="text-xl font-bold">ইন্টারেক্টিভ ব্যবসা চেকলিস্ট</h2>
        <p className="text-xs text-emerald-100/85 mt-0.5">
          ব্যবসা শুরুর প্রতিটি ধাপ সম্পন্ন করে টিক চিহ্ন দিন। আপনার অগ্রগতি
          স্বয়ংক্রিয়ভাবে সংরক্ষিত থাকবে।
        </p>

        {/* Progress Bar */}
        <div className="mt-4 bg-black/25 rounded-2xl p-3.5 border border-white/10">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-[#FDE68A]">
              মোট অগ্রগতি ({doneCount}/{totalTasks} ধাপ সম্পন্ন)
            </span>
            <span className="tabular-nums text-white">{overallPercent}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-white/15 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#10B981] transition-all duration-300"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {checklists.map((chk) => {
          const chkDone = chk.tasks.filter((t) =>
            completedTaskIds.includes(t.id)
          ).length;
          return (
            <button
              key={chk.id}
              onClick={() => setActiveChecklistId(chk.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                activeList?.id === chk.id
                  ? 'bg-[#064E3B] text-white shadow'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              {chk.category} ({chkDone}/{chk.tasks.length})
            </button>
          );
        })}
      </div>

      {/* Active Checklist Tasks */}
      {activeList && (
        <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs space-y-3">
          <h3 className="text-base font-bold text-slate-900 mb-2">
            {activeList.title}
          </h3>
          {activeList.tasks.map((task) => {
            const checked = completedTaskIds.includes(task.id);
            return (
              <div
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className={`p-4 rounded-2xl border transition flex items-start gap-3 cursor-pointer ${
                  checked
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-slate-50/60 border-slate-200 hover:border-emerald-400'
                }`}
              >
                <button type="button" className="mt-0.5 text-[#059669]">
                  {checked ? (
                    <CheckSquare className="w-5 h-5 fill-emerald-600 text-white" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                <div className="flex-1">
                  <p
                    className={`text-sm font-bold ${
                      checked
                        ? 'line-through text-slate-500'
                        : 'text-slate-900'
                    }`}
                  >
                    {task.text}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    💡 পরামর্শ: {task.tip}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface AdviceHubScreenProps {
  articles: AdviceArticle[];
  onBack: () => void;
  onOpenAiConsultant?: (prompt?: string) => void;
}

export const AdviceHubScreen: React.FC<AdviceHubScreenProps> = ({
  articles,
  onBack,
  onOpenAiConsultant,
}) => {
  const [selectedArticle, setSelectedArticle] =
    useState<AdviceArticle | null>(null);
  const [selectedCat, setSelectedCat] = useState<string>('ALL');
  const [quickQuestion, setQuickQuestion] = useState('');

  const categories = [
    { id: 'ALL', label: 'সবগুলো গাইড' },
    { id: 'Sales', label: 'বিক্রি বৃদ্ধি (Sales)' },
    { id: 'Facebook selling', label: 'ফেসবুক সেলিং' },
    { id: 'Pricing', label: 'মূল্য ও লাভ নির্ধারণ' },
    { id: 'Small business mistakes', label: 'ব্যবসার ভুল ও সমাধান' },
  ];

  const filtered =
    selectedCat === 'ALL'
      ? articles
      : articles.filter((a) => a.category === selectedCat);

  return (
    <div className="space-y-5 pb-8">
      <div className="bg-gradient-to-r from-[#042F24] via-[#064E3B] to-[#047857] rounded-3xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-xl bg-white/15 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> ফিরে যান
          </button>
          {onOpenAiConsultant && (
            <button
              type="button"
              onClick={() => onOpenAiConsultant()}
              className="px-3.5 py-1.5 rounded-xl bg-[#D4AF37] text-slate-950 text-xs font-extrabold inline-flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Bot className="w-4 h-4" /> লাইভ AI পরামর্শক →
            </button>
          )}
        </div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#FBBF24]" /> ব্যবসা পরামর্শ ও গাইড
          হাব
        </h2>
        <p className="text-xs text-emerald-100/85 mt-1">
          বিক্রি বৃদ্ধি, মূল্য নির্ধারণ, ফেসবুক মার্কেটিং এবং আর্থিক শৃঙ্খলা
          বিষয়ে অভিজ্ঞ মেন্টরদের গাইডলাইন ও লাইভ AI পরামর্শ।
        </p>

        {onOpenAiConsultant && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!quickQuestion.trim()) {
                onOpenAiConsultant();
                return;
              }
              onOpenAiConsultant(quickQuestion.trim());
            }}
            className="mt-4 flex flex-col sm:flex-row gap-2 bg-black/25 p-2.5 rounded-2xl border border-white/15"
          >
            <input
              type="text"
              value={quickQuestion}
              onChange={(e) => setQuickQuestion(e.target.value)}
              placeholder="যেকোনো ব্যবসার প্রশ্ন লিখুন (যেমন: ১০ হাজার টাকায় কী ব্যবসা করব?)..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-semibold focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" /> AI পরামর্শ নিন
            </button>
          </form>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
              selectedCat === cat.id
                ? 'bg-[#064E3B] text-white'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {selectedArticle ? (
        <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm space-y-4">
          <button
            onClick={() => setSelectedArticle(null)}
            className="text-xs font-bold text-[#059669] flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> সকল আর্টিকেলে ফিরে যান
          </button>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#064E3B] text-xs font-bold">
              {selectedArticle.category}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {selectedArticle.readTime}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            {selectedArticle.title}
          </h3>
          <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4" /> লেখক: {selectedArticle.author}
          </p>
          <p className="text-sm text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            {selectedArticle.summary}
          </p>
          <div className="space-y-3 pt-2">
            {selectedArticle.content.map((para, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-900/10 text-sm text-slate-800 leading-relaxed"
              >
                {para}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((art) => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs hover:shadow-md transition flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-[#064E3B] text-[11px] font-bold">
                    {art.category}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {art.readTime}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {art.summary}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">{art.author}</span>
                <span className="font-bold text-[#059669]">পড়ুন →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

interface AiConsultantScreenProps {
  initialPrompt?: string;
  onBack: () => void;
}

function buildSmartLocalAdvice(
  userPrompt: string,
  allIdeas: BusinessIdeaItem[]
): string {
  const q = userPrompt.trim().toLowerCase();

  // 1. Check if the user is asking about a specific business idea from our catalog
  const matchedIdea = allIdeas.find(
    (idea) =>
      q.includes(idea.title.toLowerCase()) ||
      (idea.title.length > 6 &&
        idea.title
          .split(' ')
          .filter((w) => w.length >= 4)
          .some((word) => q.includes(word.toLowerCase())))
  );

  if (matchedIdea) {
    return `**"${matchedIdea.title}" ব্যবসার সম্পূর্ণ এআই গাইড ও রোডম্যাপ:**

📌 **ক্যাটাগরি:** ${matchedIdea.category} (${matchedIdea.difficulty})
💰 **প্রয়োজনীয় পুঁজি:** ${matchedIdea.requiredInvestment}
📈 **সম্ভাব্য মাসিক নিট লাভ:** ${matchedIdea.estimatedProfit}
💵 **দৈনিক সম্ভাব্য বিক্রি:** ${matchedIdea.expectedDailySales}

১. **প্রয়োজনীয় যন্ত্রপাতি ও প্রস্তুতি:**
- ${matchedIdea.requiredEquipment}
- **উপযুক্ত স্থান:** ${matchedIdea.requiredLocation}

২. **পাইকারি পণ্য ও কাঁচামাল কোথায় পাবেন (Sourcing):**
- ${matchedIdea.productSourcing}

৩. **ধাপে ধাপে শুরু করার নিয়ম (প্রথম ৩০ দিনের প্ল্যান):**
${matchedIdea.startupSteps}

৪. **মার্কেটিং ও দ্রুত কাস্টমার পাওয়ার কৌশল:**
- ${matchedIdea.marketingStrategy}

৫. **ঝুঁকি ও সফল হওয়ার বিশেষ টিপস:**
- ⚠️ **সতর্কতা:** ${matchedIdea.risk}
- 💡 **টিপস:** ${matchedIdea.tips}`;
  }

  // 2. Budget-specific queries (5k / 10k / 15k / 20k / 30k / 50k)
  if (
    q.includes('১০ হাজার') ||
    q.includes('১০,০০০') ||
    q.includes('10000') ||
    q.includes('10,000') ||
    q.includes('৫ হাজার') ||
    q.includes('৫,০০০') ||
    q.includes('5000') ||
    q.includes('কম পুঁজি')
  ) {
    return `**৳৫,০০০ – ৳১০,০০০ পুঁজিতে শুরু করার মতো ৪টি পরীক্ষিত ও সবচেয়ে লাভজনক ব্যবসা:**

১. **ঘরে তৈরি খাঁটি মসলা ও আচার প্যাকিং ব্যবসা**
- **প্রাথমিক পুঁজি:** ৳৪,৫০০ – ৳৮,০০০ (হলুদ, মরিচ, ধনিয়া, জিরা, স্ট্যান্ড-আপ পাউচ ও হিট সিলার মেশিন)
- **পাইকারি সোর্সিং:** ঢাকার কারওয়ান বাজার, শ্যামবাজার, চকবাজার (প্যাকেজিং পাউচ) অথবা স্থানীয় বড় পাইকারি হাট
- **দৈনিক ও মাসিক লাভ:** দৈনিক ৳৫০০ – ৳৯০০ | মাসিক **৳১৫,০০০ – ৳২৫,০০০** (৩০%–৩৫% নিট মুনাফা)
- **মার্কেটিং:** নিজের ব্র্যান্ড স্টিকার লাগিয়ে স্থানীয় মুদি দোকান, পাশের ফ্ল্যাট এবং ফেসবুক পেজে হোম ডেলিভারি।

২. **স্পেশাল মালাই চা, কফি ও ভ্রাম্যমাণ স্ট্রিট ফুড কার্ট**
- **প্রাথমিক পুঁজি:** ৳৬,০০০ – ৳১০,০০০ (বার্নার, ফ্লাস্ক, মাটির কাপ ও কাঁচামাল)
- **দৈনিক ও মাসিক লাভ:** দৈনিক ৳৭০০ – ৳১,২০০ | মাসিক **৳১৮,০০০ – ৳৩২,০০০** (৪৫%+ লাভ)
- **লোকেশন:** বাজারের মোড়, কলেজ/কোচিং সেন্টারের সামনে বা বাসস্ট্যান্ড।

৩. **হোমমেড ফ্রোজেন স্ন্যাকস (সিঙ্গারা, সমুচা, চিকেন রোল, নাগেটস)**
- **প্রাথমিক পুঁজি:** ৳৩,৫০০ – ৳৭,০০০
- **সম্ভাব্য মাসিক আয়:** **৳১৪,০০০ – ৳২৬,০০০**
- **কৌশল:** শহরের ব্যস্ত পরিবার ও ব্যাচেলরদের টার্গেট করে সাপ্তাহিক প্যাক ডেলিভারি।

৪. **মোবাইল রিচার্জ, বিকাশ/নগদ ও ড্রাইভ প্যাক এজেন্ট সেবা**
- **প্রাথমিক পুঁজি:** ৳৫,০০০ – ৳১০,০০০ রানিং ব্যালেন্স
- **সম্ভাব্য মাসিক আয়:** **৳১২,০০০ – ৳২০,০০০** (সিম অফার ও বিল পেমেন্ট কমিশনসহ)`;
  }

  if (
    q.includes('২০ হাজার') ||
    q.includes('২০,০০০') ||
    q.includes('20000') ||
    q.includes('৩০ হাজার') ||
    q.includes('৩০,০০০') ||
    q.includes('30000') ||
    q.includes('৫০ হাজার') ||
    q.includes('50000')
  ) {
    return `**৳২০,০০০ – ৳৫০,০০০ পুঁজিতে শুরু করার মতো ৪টি সেরা মাঝারি ব্যবসা:**

১. **মিনি গার্মেন্টস ও টি-শার্ট/পাঞ্জাবি প্রিন্টিং ও পাইকারি সাপ্লাই**
- **পুঁজি:** ৳২০,০০০ – ৳৩৫,০০০ | **মাসিক নিট লাভ:** ৳২৫,০০০ – ৳৪৫,০০০
- **সোর্সিং:** নারায়ণগঞ্জ, ইসলামপুর ও মিরপুর ঝুট পল্লী।

২. **ব্রয়লার/সোনালী মুরগি ও কোয়েল পাখির খামার (দ্রুত রিটার্ন)**
- **পুঁজি:** ৳১৫,০০০ – ৳৩০,০০০ | **মাসিক নিট লাভ:** ৳১৮,০০০ – ৳৩৫,০০০
- মাত্র ৩৫–৪৫ দিনে ব্যাচ বিক্রি করে সরাসরি নগদ মুনাফা।

৩. **মোবাইল এক্সেসরিজ, সার্ভিসিং ও কম্পিউটার প্রিন্টিং শপ**
- **পুঁজি:** ৳২৫,০০০ – ৳৪৫,০০০ | **মাসিক নিট লাভ:** ৳২২,০০০ – ৳৪০,০০০
- **সোর্সিং:** ঢাকার মোতালেব প্লাজা ও সুন্দরবন স্কয়ার মার্কেট (চার্জার, কেবল, গ্লাস প্রোটেক্টর ও ইয়ারফোনে ১০০%+ লাভ)।

৪. **কসমেটিকস, পারফিউম ও গিফট শপ (অনলাইন + অফলাইন)**
- **পুঁজি:** ৳২০,০০০ – ৳৪০,০০০ | **মাসিক নিট লাভ:** ৳২০,০০০ – ৳৩৮,০০০
- **সোর্সিং:** ঢাকার চকবাজার পাইকারি মার্কেট।`;
  }

  if (q.includes('ঝুঁকি') || q.includes('নিরাপদ') || q.includes('লস')) {
    return `**সবচেয়ে কম ঝুঁকির (Low-Risk) ৫টি নিরাপদ ব্যবসা ও লস এড়ানোর কৌশল:**

১. **প্রি-অর্ডার ও ড্রপশিপিং রিসেলিং (জিরো স্টক ঝুঁকি):**
- আগে কাস্টমারের অর্ডার নিবেন, তারপর পাইকারি সাপ্লায়ার থেকে পণ্য ডেলিভারি করবেন। অবিক্রিত পণ্যের কোনো লস নেই।

২. **নিত্যপ্রয়োজনীয় ভোগ্যপণ্য (চাল, ডাল, তেল, ডিম, মসলা):**
- মানুষের প্রতিদিনের খাবার কখনো অবিক্রিত থাকে না। ১৫%–২৫% নিশ্চিত মুনাফা থাকে।

৩. **সার্ভিস ভিত্তিক কাজ (কম্পিউটার কম্পোজ, অনলাইন আবেদন, ফটোকপি, বিকাশ):**
- এতে কাঁচামাল নষ্ট হওয়ার কোনো ভয় নেই, পুরোটাই সার্ভিস চার্জ ও কমিশন।

৪. **ঝুঁকি কমানোর ৩টি গোল্ডেন রুল:**
- **৪০-৩০-৩০ সূত্র:** শুরুতে মোট পুঁজির মাত্র ৪০% পণ্য কেনায়, ৩০% মার্কেটিংয়ে এবং ৩০% জরুরি ব্যাকআপ হিসেবে হাতে রাখুন।
- **বাকি বিক্রি বন্ধ:** শুরুতে বাকিতে পণ্য বিক্রি সম্পূর্ণ বন্ধ রাখুন।
- **ছোট ব্যাচে টেস্ট:** একসাথে অনেক মাল না তুলে ১০–২০ পিস এনে কাস্টমারের চাহিদা পরীক্ষা করুন।`;
  }

  if (q.includes('গ্রাম') || q.includes('ইউনিয়ন') || q.includes('মফস্বল') || q.includes('হাট')) {
    return `**গ্রামে বা মফস্বলে অল্প পুঁজিতে সবচেয়ে ভালো চলে এমন ৫টি ব্যবসা:**

১. **কৃষি উপকরণ, বীজ, সার ও কীটনাশক খুচরা স্টোর**
- **পুঁজি:** ৳১০,০০০ – ৳২৫,০০০ | **মাসিক লাভ:** ৳১৫,০০০ – ৳৩০,০০০
- গ্রামে সারা বছর কৃষকদের বীজ, ভিটামিন ও জৈব সারের চাহিদা থাকে।

২. **দেশি মুরগি, হাঁস ও কোয়েল পাখি পালন**
- **পুঁজি:** ৳৫,০০০ – ৳১৫,০০০ | **মাসিক লাভ:** ৳১২,০০০ – ৳২৫,০০০
- মাত্র ৪৫–৬০ দিনে ডিম ও মাংস বিক্রি শুরু হয়।

৩. **পল্লী মোবাইল ব্যাংকিং (বিকাশ/নগদ), বিদ্যুৎ বিল পেমেন্ট ও ফটোকপি পয়েন্ট**
- **পুঁজি:** ৳৮,০০০ – ৳২০,০০০ | **মাসিক লাভ:** ৳১৪,০০০ – ৳২২,০০০

৪. **গ্রামের খাঁটি পণ্য শহরে কুরিয়ার সাপ্লাই (সরিষার তেল, ঘি, খেজুরের গুড়, দেশি ডিম)**
- **পুঁজি:** ৳৫,০০০ – ৳১২,০০০ | **মাসিক লাভ:** ৳১৮,০০০ – ৳৩৫,০০০
- ফেসবুক পেজের মাধ্যমে ঢাকায় ও শহরে Steadfast/Sundarban কুরিয়ারে ক্যাশ-অন-ডেলিভারিতে প্রচুর বিক্রি হয়।`;
  }

  if (q.includes('মেয়ে') || q.includes('নারী') || q.includes('গৃহিণী') || q.includes('ঘরে বসে')) {
    return `**ঘরে বসে মেয়েদের ও গৃহিণীদের করার মতো ৫টি সেরা লাভজনক ব্যবসা:**

১. **হোমমেড ক্যাটারিং, ফ্রোজেন পিঠা ও বার্থডে কেক বেকিং**
- **পুঁজি:** ৳৩,০০০ – ৳৮,০০০ | **মাসিক লাভ:** ৳১২,০০০ – ৳২৮,০০০
- ঘরোয়া অনুষ্ঠান, জন্মদিন ও অফিস লাঞ্চ বক্সে প্রচুর চাহিদা।

২. **লেডিস থ্রি-পিস, হিজাব, বোরকা ও কাস্টমাইজড কুর্তি বুটিক**
- **পুঁজি:** ৳৫,০০০ – ৳১৫,০০০ | **মাসিক লাভ:** ৳১৫,০০০ – ৳৩৫,০০০
- **সোর্সিং:** ঢাকার ইসলামপুর, বাবুরহাট (নরসিংদী) বা ভুলতা গাউছিয়া থেকে পাইকারি এনে বাসায় ও ফেসবুক লাইভে বিক্রি।

৩. **অর্গানিক হেয়ার অয়েল, হারবাল স্কিনকেয়ার ও মেহেদি প্যাক তৈরি**
- **পুঁজি:** ৳২,৫০০ – ৳৬,০০০ | **মাসিক লাভ:** ৳১০,০০০ – ৳২২,০০০ (৫০%+ প্রফিট মার্জিন)

৪. **হ্যান্ডমেড জুয়েলারি, রেজিন আর্ট ও গিফট হ্যাম্পার বক্স**
- **পুঁজি:** ৳৩,০০০ – ৳৭,০০০ | **মাসিক লাভ:** ৳১০,০০০ – ৳২০,০০০

৫. **জিরো-পুঁজি অনলাইন রিসেলিং (আমাদের অ্যাপের ড্রপশিপিং হাব):**
- কোনো পণ্য না কিনেই শুধু ছবি ফেসবুকে পোস্ট করে অর্ডার নিলে প্রতি অর্ডারে ৳১০০–৳৩০০ সরাসরি কমিশন।`;
  }

  if (q.includes('অনলাইন') || q.includes('ফেসবুক') || q.includes('ড্রপশিপ') || q.includes('বিক্রি')) {
    return `**অনলাইনে ও ফেসবুকে সবচেয়ে বেশি বিক্রি হয় এমন হট-সেলিং পণ্য ও কৌশল:**

১. **সবচেয়ে বেশি চলে এমন ৪টি ক্যাটাগরি:**
- **গ্যাজেট ও স্মার্ট এক্সেসরিজ:** মিনি ট্রিমার, নেকব্যান্ড, পাওয়ার ব্যাংক, কিচেন গ্যাজেট (চকবাজার/মোতালেব প্লাজা থেকে সোর্সিং, ৩০%–৪০% লাভ)।
- **অর্গানিক ফুড:** সুন্দরবনের মধু, ঘানি ভাঙা সরিষার তেল, চিয়া সিড, মিক্সড ড্রাই ফ্রুটস/নাটস (৪০% লাভ)।
- **ফ্যাশন ও লাইফস্টাইল:** প্রিমিয়াম টি-শার্ট, পাঞ্জাবি, থ্রি-পিস, প্রিমিয়াম ঘড়ি ও সানগ্লাস।
- **বেবি অ্যান্ড মম কেয়ার:** বাচ্চাদের শিক্ষণীয় খেলনা (Educational Toys) ও কটন ড্রেস।

২. **দ্রুত সেল বাড়ানোর ৩টি পরীক্ষিত কৌশল:**
- ক্যাটালগ ছবির বদলে মোবাইল দিয়ে তোলা **আসল আনবক্সিং ভিডিও (Reels)** পোস্ট করুন।
- **ক্যাশ অন ডেলিভারি (COD):** ১ টাকাও অগ্রিম না নিয়ে Steadfast বা Pathao কুরিয়ারে পণ্য হাতে পেয়ে টাকা দেওয়ার সুবিধা দিন।
- প্রথম ২০ জন কাস্টমারের রিভিউ স্ক্রিনশট পেজে পিন করে রাখুন।`;
  }

  if (q.includes('লাভ কেমন') || q.includes('হিসাব') || q.includes('কত লাভ')) {
    return `**অল্প পুঁজির ব্যবসায় লাভের বাস্তবসম্মত হিসাব (Profit Breakdown):**

১. **খাবার, চা-কফি, বেকারি ও মসলা প্যাকিং:**
- **নিট লাভের হার:** ৩৫% – ৫০%
- **উদাহরণ:** ৳১০,০০০ পুঁজি খাটিয়ে দিনে ৳১,৫০০ বিক্রি করলে দৈনিক নিট লাভ থাকে **৳৫০০–৳৭০০** (মাসে **৳১৫,০০০ – ৳২১,০০০**)।

২. **পোশাক, থ্রি-পিস, টি-শার্ট ও কসমেটিকস ব্যবসা:**
- **নিট লাভের হার:** ২৫% – ৪০%
- **উদাহরণ:** পাইকারি ৳৩৫০ টাকায় কেনা থ্রি-পিস খুচরা ৳৫০০–৳৫৫০ টাকায় বিক্রি হয় (প্রতি পিসে **৳১৫০–৳২০০** লাভ)।

৩. **অ্যাগ্রো, মুরগি/কোয়েল পালন ও মাছ চাষ:**
- **নিট লাভের হার:** ২০% – ৩৫% (প্রতি সাইকেলে)

৪. **আমাদের অ্যাপের ভেরিফায়েড ইনভেস্টমেন্ট ও রিসেলিং হাব:**
- সরাসরি ইনভেস্টমেন্ট প্রজেক্টে মাসিক **১৬% প্রফিট শেয়ারিং** এবং প্রতিদিনের মাইক্রো-টাস্ক ও ড্রপশিপিং অর্ডারে তাৎক্ষণিক নগদ কমিশন।`;
  }

  return `**আপনার প্রশ্নের জন্য পূর্ণাঙ্গ ব্যবসায়িক রোডম্যাপ ও পরামর্শ ("${userPrompt}"):**

১. **প্রয়োজনীয় পুঁজি ও বাজেট বণ্টন (৪০-৩০-৩০ নিয়ম):**
- আপনার মোট পুঁজির **৪০%** মূল পণ্য বা কাঁচামালে, **৩০%** প্যাকেজিং ও প্রচারণায় এবং বাকি **৩০%** জরুরি রানিং ক্যাপিটাল হিসেবে হাতে রাখুন।

২. **পাইকারি কাঁচামাল ও পণ্য সোর্সিং (Wholesale Markets):**
- **ঢাকায়:** চকবাজার (কসমেটিকস, গিফট, জার ও প্যাকেজিং), ইসলামপুর ও সদরঘাট (কাপড় ও গার্মেন্টস), কারওয়ান বাজার ও শ্যামবাজার (মসলা ও কৃষিপণ্য), নবাবপুর ও মোতালেব প্লাজা (ইলেকট্রনিক্স ও গ্যাজেট)।
- **ঢাকার বাইরে:** নরসিংদীর বাবুরহাট/গাউছিয়া, চট্টগ্রামের খাতুনগঞ্জ, অথবা স্থানীয় বিসিক ও পাইকারি মোকাম থেকে সরাসরি নিলে **২০%–৩৫% কম দামে** পাবেন।

৩. **দৈনিক ও মাসিক সম্ভাব্য লাভের হিসাব:**
- ক্ষুদ্র ও মাঝারি ব্যবসায় খুচরা বিক্রিতে গড়ে **২৫% থেকে ৪০% নিট লাভ** থাকে। দৈনিক মাত্র ৳১,৫০০–৳২,৫০০ টাকার পণ্য বিক্রি করতে পারলে মাসে **৳১৫,০০০ – ৳৩০,০০০+** নিট মুনাফা করা সম্ভব।

৪. **প্রথম ৩০ দিনের অ্যাকশন প্ল্যান:**
- **দিন ১–৭:** বাজার যাচাই, ৩ জন পাইকারি সাপ্লায়ারের দরদাম তুলনা এবং ছোট স্যাম্পল ব্যাচ সংগ্রহ।
- **দিন ৮–১৫:** ফেসবুক পেজ ও লোকাল হোয়াটসঅ্যাপ গ্রুপ খোলা, পণ্যের আসল ছবি/ভিডিও তোলা এবং পরিচিত মহলে প্রথম ১০টি অর্ডার ডেলিভারি।
- **দিন ১৬–৩০:** কাস্টমার রিভিউ সংগ্রহ, কুরিয়ার ক্যাশ-অন-ডেলিভারি (Steadfast/Pathao) চালু করা এবং লাভের টাকা পুনরায় ব্যবসায় বিনিয়োগ করা।`;
}

export const AiConsultantScreen: React.FC<AiConsultantScreenProps> = ({
  initialPrompt,
  onBack,
}) => {
  const defaultGreeting: ChatMessage = {
    role: 'assistant',
    text: 'আসসালামু আলাইকুম! আমি আপনার “অল্প পুঁজির ব্যবসা” লাইভ AI পরামর্শক। আপনার পুঁজি, এলাকা ও আগ্রহ অনুযায়ী কোন ব্যবসাটি সবচেয়ে লাভজনক হবে তা জানতে নিচের যেকোনো প্রশ্নে ট্যাপ করুন, ১-ক্লিক প্ল্যান জেনারেটর ব্যবহার করুন অথবা নিজের যেকোনো প্রশ্ন লিখুন।',
  };

  const [messages, setMessages] = useState<ChatMessage[]>([defaultGreeting]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Interactive 1-Click Smart Business Plan Generator state
  const [selectedBudget, setSelectedBudget] = useState('৳১০,০০০');
  const [selectedArea, setSelectedArea] = useState('গ্রাম বা মফস্বল');
  const [selectedSector, setSelectedSector] = useState('খাবার ও মসলা প্যাকিং');

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const autoSentInitialRef = useRef<string | null>(null);

  const presetPrompts = [
    '১০ হাজার টাকায় কী ব্যবসা করা যায়?',
    '৫ হাজার টাকায় কম ঝুঁকির ব্যবসা কী?',
    'গ্রামে কী ব্যবসা ভালো চলবে?',
    'ঘরে বসে মেয়েদের জন্য সেরা ব্যবসা কী?',
    'অনলাইনে ও ফেসবুকে কী পণ্য বিক্রি করব?',
    '২০ হাজার টাকায় শহরে কী ব্যবসা করব?',
    'পাইকারি মাল কোথায় সবচেয়ে সস্তায় পাব?',
    'এই ব্যবসার লাভ কেমন ও লস এড়াব কীভাবে?',
  ];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const updatedHistory: ChatMessage[] = [
      ...messages,
      { role: 'user', text: trimmed },
    ];
    setMessages(updatedHistory);
    setInput('');
    setLoading(true);

    // Format messages for server: exclude initial greeting so first message is always 'user'
    const apiMessages = updatedHistory
      .filter((m, idx) => !(idx === 0 && m.role === 'assistant'))
      .slice(-8)
      .map((m) => ({
        role: m.role === 'assistant' ? ('model' as const) : ('user' as const),
        text: m.text,
      }));

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          message: trimmed,
          history: updatedHistory.slice(-6),
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const replyText =
        typeof data?.reply === 'string' && data.reply.trim().length > 0
          ? data.reply.trim()
          : buildSmartLocalAdvice(trimmed, INITIAL_BUSINESS_IDEAS);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: replyText,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: buildSmartLocalAdvice(trimmed, INITIAL_BUSINESS_IDEAS),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      initialPrompt &&
      initialPrompt.trim() &&
      autoSentInitialRef.current !== initialPrompt.trim()
    ) {
      autoSentInitialRef.current = initialPrompt.trim();
      sendMessage(initialPrompt.trim());
    }
  }, [initialPrompt]);

  const handleGenerateCustomPlan = () => {
    const customPrompt = `আমার পুঁজি ${selectedBudget}, আমার অবস্থান ${selectedArea}, এবং আমি "${selectedSector}" খাতে ব্যবসা শুরু করতে চাই। আমাকে পুঁজির খাতওয়ারী হিসাব, পাইকারি সোর্সিং বাজার, দৈনিক ও মাসিক সম্ভাব্য লাভ এবং প্রথম ৩০ দিনের ধাপে ধাপে অ্যাকশন প্ল্যান দিন।`;
    sendMessage(customPrompt);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#042F24] via-[#064E3B] to-[#047857] rounded-3xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-xl bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> ফিরে যান
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setMessages([defaultGreeting]);
                setInput('');
              }}
              className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> নতুন চ্যাট
            </button>
            <span className="px-2.5 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#FDE68A] text-[11px] font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> লাইভ AI কনসালট্যান্ট
            </span>
          </div>
        </div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Bot className="w-6 h-6 text-[#FBBF24]" /> এআই বিজনেস কনসালট্যান্ট ও প্ল্যান জেনারেটর
        </h2>
        <p className="text-xs text-emerald-100/85 mt-0.5">
          পুঁজি, পাইকারি বাজার, মার্কেটিং ও লাভের হিসাব নিয়ে যেকোনো প্রশ্ন বাংলায় জিজ্ঞেস করুন
        </p>
      </div>

      {/* 1-Click Smart AI Business Plan Generator */}
      <div className="bg-white rounded-3xl p-4 border-2 border-[#D4AF37]/70 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#064E3B] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" /> ১-ক্লিক কাস্টম বিজনেস প্ল্যান জেনারেটর
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#064E3B]">
            তাৎক্ষণিক রোডম্যাপ
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-600 block mb-1">
              ১. আপনার পুঁজি (বাজেট)
            </label>
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="w-full h-9 px-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-900 focus:outline-none focus:border-[#064E3B]"
            >
              <option value="৳৫,০০০">৳৫,০০০ (অতি ক্ষুদ্র পুঁজি)</option>
              <option value="৳১০,০০০">৳১০,০০০ (প্রাথমিক পুঁজি)</option>
              <option value="৳১৫,০০০">৳১৫,০০০ (স্মার্ট স্টার্টআপ)</option>
              <option value="৳২০,০০০">৳২০,০০০ (মাঝারি শুরু)</option>
              <option value="৳৩০,০০০">৳৩০,০০০ (দোকান বা খামার)</option>
              <option value="৳৫০,০০০+">৳৫০,০০০+ (পূর্ণাঙ্গ ব্যবসা)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-600 block mb-1">
              ২. আপনার এলাকা বা মাধ্যম
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full h-9 px-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-900 focus:outline-none focus:border-[#064E3B]"
            >
              <option value="গ্রাম বা মফস্বল">গ্রাম বা ইউনিয়ন বাজার</option>
              <option value="উপজেলা বা জেলা শহর">উপজেলা বা জেলা শহর</option>
              <option value="ঢাকা বা বিভাগীয় শহর">ঢাকা বা বিভাগীয় শহর</option>
              <option value="ঘরে বসে অনলাইনে">ঘরে বসে / ফেসবুক অনলাইনে</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-600 block mb-1">
              ৩. পছন্দের ব্যবসার খাত
            </label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full h-9 px-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-900 focus:outline-none focus:border-[#064E3B]"
            >
              <option value="খাবার ও মসলা প্যাকিং">খাবার, চা-কফি ও মসলা প্যাকিং</option>
              <option value="পোশাক, থ্রি-পিস ও বুটিক">পোশাক, থ্রি-পিস ও বুটিক</option>
              <option value="কৃষি, মুরগি ও খামার">কৃষি, দেশি মুরগি ও খামার</option>
              <option value="অনলাইন গ্যাজেট ও রিসেলিং">অনলাইন গ্যাজেট ও ড্রপশিপিং</option>
              <option value="মোবাইল রিচার্জ ও ডিজিটাল সার্ভিস">মোবাইল ব্যাংকিং ও ডিজিটাল সার্ভিস</option>
              <option value="কসমেটিকস ও অর্গানিক পণ্য">কসমেটিকস ও অর্গানিক স্কিনকেয়ার</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={handleGenerateCustomPlan}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#D97706] text-slate-950 font-extrabold text-xs shadow hover:brightness-105 transition cursor-pointer disabled:opacity-50"
        >
          ✨ আমার বাজেট ও এলাকা অনুযায়ী সেরা ব্যবসার প্ল্যান তৈরি করুন
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {presetPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            disabled={loading}
            onClick={() => sendMessage(prompt)}
            className="px-3.5 py-2 rounded-2xl bg-white hover:bg-emerald-50 text-[#064E3B] border border-emerald-900/15 text-xs font-bold whitespace-nowrap shadow-2xs transition cursor-pointer disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Thread */}
      <div className="bg-white rounded-3xl border border-emerald-900/10 shadow-xs p-4 flex flex-col h-[460px]">
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto space-y-3 pr-1"
        >
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                m.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                  m.role === 'user'
                    ? 'bg-[#064E3B] text-white rounded-br-xs'
                    : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/70'
                }`}
              >
                {m.text}
              </div>
              {m.role === 'assistant' && idx > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    try {
                      navigator.clipboard.writeText(m.text);
                      setCopiedIdx(idx);
                      setTimeout(() => setCopiedIdx(null), 2000);
                    } catch {}
                  }}
                  className="mt-1 ml-1 inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-[#064E3B] cursor-pointer"
                >
                  {copiedIdx === idx ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" /> কপি হয়েছে
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> পরামর্শটি কপি করুন
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-emerald-50 border border-emerald-200 text-[#064E3B] rounded-2xl px-4 py-3 text-xs font-bold animate-pulse flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#059669]" />
                <span>AI পরামর্শক আপনার ব্যবসার পরিকল্পনা ও লাভের হিসাব তৈরি করছেন...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="আপনার পুঁজি বা ব্যবসার যেকোনো প্রশ্ন এখানে লিখুন..."
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:border-[#059669] focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-[#064E3B] to-[#059669] text-white font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> পাঠান
          </button>
        </form>
      </div>
    </div>
  );
};

interface SuccessAndResourcesScreenProps {
  stories: SuccessStoryItem[];
  resources: ResourceSiteItem[];
  onBack: () => void;
}

export const SuccessAndResourcesScreen: React.FC<
  SuccessAndResourcesScreenProps
> = ({ stories, resources, onBack }) => {
  return (
    <div className="space-y-6 pb-8">
      <div className="bg-gradient-to-r from-[#042F24] via-[#064E3B] to-[#047857] rounded-3xl p-5 text-white shadow-lg">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl bg-white/15 text-white text-xs font-bold inline-flex items-center gap-1.5 mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> ফিরে যান
        </button>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Award className="w-6 h-6 text-[#FBBF24]" /> সফল উদ্যোক্তাদের গল্প ও
          প্রিমিয়াম রিসোর্স
        </h2>
        <p className="text-xs text-emerald-100/85 mt-1">
          অল্প পুঁজি দিয়ে শুরু করে যারা আজ স্বাবলম্বী এবং ব্যবসার দরকারি ওয়েবসাইট
          তালিকা
        </p>
      </div>

      {/* Success Stories */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          বাস্তব সাফল্যের গল্প (Success Stories)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stories.map((st) => (
            <div
              key={st.id}
              className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs space-y-3.5"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={st.avatarUrl}
                  alt={st.entrepreneurName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#D4AF37]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900">
                      {st.entrepreneurName}
                    </h4>
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />{' '}
                      {st.rating}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#059669]">
                    {st.businessTitle} • {st.location}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-900/10">
                <div>
                  <span className="text-[10px] text-slate-500 block">
                    শুরুর পুঁজি
                  </span>
                  <span className="text-sm font-bold text-[#064E3B]">
                    {st.initialInvestment}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">
                    বর্তমান মাসিক আয়
                  </span>
                  <span className="text-sm font-bold text-amber-700">
                    {st.monthlyIncome}
                  </span>
                </div>
              </div>

              <blockquote className="text-xs italic text-slate-700 bg-amber-50/60 p-3.5 rounded-2xl border-l-4 border-[#D4AF37]">
                {st.quote}
              </blockquote>

              <div>
                <p className="text-xs font-bold text-slate-800 mb-1.5">
                  মূল শিক্ষণীয় বিষয় (Key Lessons):
                </p>
                <ul className="space-y-1">
                  {st.lessons.map((les, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-600 flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                      {les}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Useful Business Websites & Resources */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-bold text-slate-900">
          ব্যবসার দরকারি ওয়েবসাইট ও রিসোর্স ডিরেক্টরি
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {resources.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-2xl p-4 border border-emerald-900/10 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-[#064E3B]">
                    {res.category}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    {res.badge}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{res.name}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {res.descriptionBn}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 truncate max-w-[180px]">
                  {res.url}
                </span>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#059669] hover:underline flex items-center gap-1"
                >
                  ভিজিট করুন <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
