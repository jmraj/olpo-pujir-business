import React, { useState } from 'react';
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
} from 'lucide-react';
import {
  ChecklistItem,
  AdviceArticle,
  SuccessStoryItem,
  ResourceSiteItem,
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
}

export const AdviceHubScreen: React.FC<AdviceHubScreenProps> = ({
  articles,
  onBack,
}) => {
  const [selectedArticle, setSelectedArticle] =
    useState<AdviceArticle | null>(null);
  const [selectedCat, setSelectedCat] = useState<string>('ALL');

  const categories = [
    'ALL',
    'Sales',
    'Facebook selling',
    'Pricing',
    'Small business mistakes',
  ];

  const filtered =
    selectedCat === 'ALL'
      ? articles
      : articles.filter((a) => a.category === selectedCat);

  return (
    <div className="space-y-5 pb-8">
      <div className="bg-gradient-to-r from-[#042F24] via-[#064E3B] to-[#047857] rounded-3xl p-5 text-white shadow-lg">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl bg-white/15 text-white text-xs font-bold inline-flex items-center gap-1.5 mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> ফিরে যান
        </button>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#FBBF24]" /> ব্যবসা পরামর্শ ও গাইড
          হাব
        </h2>
        <p className="text-xs text-emerald-100/85 mt-1">
          বিক্রি বৃদ্ধি, মূল্য নির্ধারণ, ফেসবুক মার্কেটিং এবং আর্থিক শৃঙ্খলা
          বিষয়ে অভিজ্ঞ মেন্টরদের গাইডলাইন।
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
              selectedCat === cat
                ? 'bg-[#064E3B] text-white'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            {cat === 'ALL' ? 'সবগুলো আর্টিকেল' : cat}
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

export const AiConsultantScreen: React.FC<AiConsultantScreenProps> = ({
  initialPrompt,
  onBack,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: 'আসসালামু আলাইকুম! আমি আপনার “অল্প পুঁজির ব্যবসা” AI পরামর্শক। আপনার পুঁজি, এলাকা ও আগ্রহ অনুযায়ী কোন ব্যবসাটি সবচেয়ে লাভজনক হবে তা জানতে নিচের যেকোনো প্রশ্নে ট্যাপ করুন অথবা নিজের প্রশ্ন লিখুন।',
    },
  ]);
  const [input, setInput] = useState(initialPrompt || '');
  const [loading, setLoading] = useState(false);

  const presetPrompts = [
    '১০ হাজার টাকায় কী ব্যবসা করা যায়?',
    'কম ঝুঁকির ব্যবসা কী?',
    'গ্রামে কী ব্যবসা ভালো চলবে?',
    'ঘরে বসে মেয়েদের জন্য ব্যবসা কী?',
    'অনলাইনে কী পণ্য বিক্রি করব?',
    'এই ব্যবসার লাভ কেমন?',
  ];

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

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: updatedHistory.slice(-6),
        }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text:
            data.reply ||
            'আপনার প্রশ্নের জন্য ধন্যবাদ। অল্প পুঁজিতে শুরু করার জন্য স্থানীয় চাহিদাসম্পন্ন নিত্যপ্রয়োজনীয় পণ্য (যেমন খাঁটি মসলা, মালাই চা স্টল বা হোমমেড ফুড) সবচেয়ে নিরাপদ।',
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'পরামর্শ: ১০–২০ হাজার টাকা পুঁজিতে ঘরে বসে অর্গানিক মসলা প্যাকিং, আচার/ফ্রোজেন ফুড অথবা অনলাইন বুটিক ব্যবসা শুরু করতে পারেন। এতে ঝুঁকি কম এবং মাসিক ৩০%–৪০% পর্যন্ত মুনাফা করা সম্ভব।',
        },
      ]);
    } finally {
      setLoading(false);
    }
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
          <span className="px-2.5 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#FDE68A] text-[11px] font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> লাইভ AI কনসালট্যান্ট
          </span>
        </div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Bot className="w-6 h-6 text-[#FBBF24]" /> এআই বিজনেস কনসালট্যান্ট
        </h2>
        <p className="text-xs text-emerald-100/85 mt-0.5">
          পুঁজি, সোর্সিং, মার্কেটিং ও লাভের হিসাব নিয়ে যেকোনো প্রশ্ন বাংলায়
          জিজ্ঞেস করুন
        </p>
      </div>

      {/* Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {presetPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => sendMessage(prompt)}
            className="px-3.5 py-2 rounded-2xl bg-white hover:bg-emerald-50 text-[#064E3B] border border-emerald-900/15 text-xs font-bold whitespace-nowrap shadow-2xs transition cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Thread */}
      <div className="bg-white rounded-3xl border border-emerald-900/10 shadow-xs p-4 flex flex-col h-[420px]">
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                  m.role === 'user'
                    ? 'bg-[#064E3B] text-white rounded-br-xs'
                    : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/70'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-emerald-50 text-[#064E3B] rounded-2xl px-4 py-2.5 text-xs font-semibold animate-pulse">
                AI পরামর্শক আপনার ব্যবসার পরিকল্পনা বিশ্লেষণ করছেন...
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
            placeholder="আপনার পুঁজি বা ব্যবসার প্রশ্নটি এখানে লিখুন..."
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
