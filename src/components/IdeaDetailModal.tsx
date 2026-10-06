import React, { useState } from 'react';
import {
  X,
  Heart,
  Share2,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  MapPin,
  Wrench,
  TrendingUp,
} from 'lucide-react';
import { BusinessIdeaItem } from '../data/seedData';

interface IdeaDetailModalProps {
  idea: BusinessIdeaItem | null;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
  onOpenCalculator: () => void;
  onAskAiAboutIdea: (ideaTitle: string) => void;
}

export const IdeaDetailModal: React.FC<IdeaDetailModalProps> = ({
  idea,
  isFavorite,
  onToggleFavorite,
  onClose,
  onOpenCalculator,
  onAskAiAboutIdea,
}) => {
  const [copiedMsg, setCopiedMsg] = useState(false);

  if (!idea) return null;

  const handleShare = () => {
    const shareText = `${idea.title} — প্রয়োজনীয় পুঁজি: ${idea.requiredInvestment}, সম্ভাব্য মাসিক লাভ: ${idea.estimatedProfit}। (অল্প পুঁজির ব্যবসা অ্যাপ)`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-5"
      role="dialog"
      aria-modal="true"
      aria-label={idea.title}
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Hero Image Header */}
        <div className="relative h-52 md:h-64 w-full bg-emerald-950 overflow-hidden">
          <img
            src={idea.imageUrl}
            alt={idea.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleFavorite(idea.id)}
              aria-label="ফেভারিট করুন"
              className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                isFavorite
                  ? 'bg-red-500 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              type="button"
              onClick={handleShare}
              aria-label="শেয়ার করুন"
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="বন্ধ করুন"
              className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute bottom-4 left-5 right-5 text-white">
            <div className="text-xs text-amber-300 font-semibold">
              {idea.category} · কঠিনতার মাত্রা: {idea.difficulty} · ★ {idea.rating}
            </div>
            <h2 className="text-xl md:text-2xl font-bold mt-1 leading-snug">
              {idea.title}
            </h2>
          </div>
        </div>

        <div className="p-5 md:p-6 space-y-5">
          {copiedMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium">
              ব্যবসার তথ্য ক্লিপবোর্ডে কপি করা হয়েছে!
            </div>
          )}

          <p className="text-sm text-slate-700 leading-relaxed">
            {idea.shortDescription}
          </p>

          {/* Financial Highlights Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80">
              <span className="text-[11px] text-emerald-800">প্রয়োজনীয় পুঁজি</span>
              <p className="text-sm font-bold text-emerald-950 tabular-nums mt-0.5">
                {idea.requiredInvestment}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80">
              <span className="text-[11px] text-amber-900">সম্ভাব্য মাসিক লাভ</span>
              <p className="text-sm font-bold text-amber-950 tabular-nums mt-0.5">
                {idea.estimatedProfit}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500">দৈনিক সম্ভাব্য বিক্রি</span>
              <p className="text-sm font-bold text-slate-900 tabular-nums mt-0.5">
                {idea.expectedDailySales}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500">মাসিক সম্ভাব্য রেভিনিউ</span>
              <p className="text-sm font-bold text-slate-900 tabular-nums mt-0.5">
                {idea.expectedMonthlyRevenue}
              </p>
            </div>
          </div>

          {/* Detailed Sections */}
          <div className="space-y-4 text-xs md:text-sm text-slate-700">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>ব্যবসা শুরুর ধাপসমূহ (Startup Steps)</span>
              </h3>
              <p className="whitespace-pre-line leading-relaxed">{idea.startupSteps}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-emerald-700" />
                  <span>প্রয়োজনীয় যন্ত্রপাতি ও দক্ষতা</span>
                </h4>
                <p className="text-xs leading-relaxed">{idea.requiredEquipment}</p>
                <p className="text-xs text-slate-500 pt-1">
                  <strong>দক্ষতা:</strong> {idea.requiredSkills}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>কাঁচামাল সোর্সিং ও স্থান</span>
                </h4>
                <p className="text-xs leading-relaxed">{idea.productSourcing}</p>
                <p className="text-xs text-slate-500 pt-1">
                  <strong>উপযুক্ত স্থান:</strong> {idea.requiredLocation}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 space-y-1">
              <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                <span>মার্কেটিং কৌশল ও বিশেষ টিপস</span>
              </h4>
              <p className="text-xs leading-relaxed text-emerald-950">
                {idea.marketingStrategy}
              </p>
              <p className="text-xs text-emerald-800 pt-1">
                <strong>টিপস:</strong> {idea.tips}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
              <h4 className="font-bold text-amber-950 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>সম্ভাব্য ঝুঁকি ও সমাধান</span>
              </h4>
              <p className="text-xs leading-relaxed text-amber-900">{idea.risk}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCalculator();
              }}
              className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#044E36] hover:bg-[#033d2a] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Calculator className="w-4 h-4" />
              <span>লাভ ও পুঁজি হিসাব করুন</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onAskAiAboutIdea(idea.title);
              }}
              className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI কনসালট্যান্টের পরামর্শ নিন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
