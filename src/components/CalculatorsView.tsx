import React, { useState } from 'react';
import {
  Calculator,
  TrendingUp,
  Percent,
  Landmark,
  Tag,
  Receipt,
  Coins,
  ArrowLeft,
} from 'lucide-react';

interface CalculatorsViewProps {
  onBack?: () => void;
}

type CalcTab =
  | 'profit'
  | 'investment'
  | 'margin'
  | 'emi'
  | 'discount'
  | 'vat'
  | 'zakat';

export const CalculatorsView: React.FC<CalculatorsViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<CalcTab>('profit');

  // 1. Profit Calculator state
  const [purchaseCost, setPurchaseCost] = useState<string>('120');
  const [sellingPrice, setSellingPrice] = useState<string>('180');
  const [quantity, setQuantity] = useState<string>('100');
  const [otherExpenses, setOtherExpenses] = useState<string>('1200');

  // 2. Investment Calculator state
  const [equipmentCost, setEquipmentCost] = useState<string>('4500');
  const [rawMaterialCost, setRawMaterialCost] = useState<string>('6000');
  const [packagingCost, setPackagingCost] = useState<string>('1500');
  const [marketingBudget, setMarketingBudget] = useState<string>('1000');
  const [emergencyReserve, setEmergencyReserve] = useState<string>('2000');

  // 3. Margin Calculator state
  const [marginCost, setMarginCost] = useState<string>('250');
  const [marginSell, setMarginSell] = useState<string>('350');

  // 4. Loan / EMI Calculator state
  const [loanAmount, setLoanAmount] = useState<string>('50000');
  const [interestRate, setInterestRate] = useState<string>('9');
  const [loanMonths, setLoanMonths] = useState<string>('12');

  // 5. Discount Calculator state
  const [originalPrice, setOriginalPrice] = useState<string>('1500');
  const [discountPercent, setDiscountPercent] = useState<string>('15');

  // 6. VAT Calculator state
  const [vatBaseAmount, setVatBaseAmount] = useState<string>('2000');
  const [vatRate, setVatRate] = useState<string>('15');
  const [vatInclusive, setVatInclusive] = useState<boolean>(false);

  // 7. Zakat Calculator state
  const [cashInHand, setCashInHand] = useState<string>('80000');
  const [businessStockValue, setBusinessStockValue] = useState<string>('120000');
  const [receivables, setReceivables] = useState<string>('15000');
  const [businessDebts, setBusinessDebts] = useState<string>('20000');

  // Calculations
  const pCost = Number(purchaseCost) || 0;
  const sPrice = Number(sellingPrice) || 0;
  const qty = Number(quantity) || 0;
  const oExp = Number(otherExpenses) || 0;
  const totalCost = pCost * qty + oExp;
  const totalRevenue = sPrice * qty;
  const netProfit = totalRevenue - totalCost;
  const profitPercent = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

  const totalStartupInvestment =
    (Number(equipmentCost) || 0) +
    (Number(rawMaterialCost) || 0) +
    (Number(packagingCost) || 0) +
    (Number(marketingBudget) || 0) +
    (Number(emergencyReserve) || 0);

  const mCost = Number(marginCost) || 0;
  const mSell = Number(marginSell) || 0;
  const unitProfit = mSell - mCost;
  const grossMarginPct = mSell > 0 ? (unitProfit / mSell) * 100 : 0;
  const markupPct = mCost > 0 ? (unitProfit / mCost) * 100 : 0;

  const principal = Number(loanAmount) || 0;
  const annualRate = Number(interestRate) || 0;
  const months = Math.max(1, Number(loanMonths) || 1);
  const monthlyRate = annualRate / 12 / 100;
  const emi =
    monthlyRate > 0
      ? (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
      : principal / months;
  const totalLoanPayable = emi * months;
  const totalInterest = totalLoanPayable - principal;

  const origP = Number(originalPrice) || 0;
  const discPct = Number(discountPercent) || 0;
  const discountSaved = (origP * discPct) / 100;
  const finalDiscountedPrice = origP - discountSaved;

  const vBase = Number(vatBaseAmount) || 0;
  const vRate = Number(vatRate) || 0;
  const vatAmount = vatInclusive
    ? vBase - vBase / (1 + vRate / 100)
    : (vBase * vRate) / 100;
  const vatTotal = vatInclusive ? vBase : vBase + vatAmount;
  const vatNet = vatInclusive ? vBase - vatAmount : vBase;

  const netZakatableWealth = Math.max(
    0,
    (Number(cashInHand) || 0) +
      (Number(businessStockValue) || 0) +
      (Number(receivables) || 0) -
      (Number(businessDebts) || 0)
  );
  const zakatPayable = netZakatableWealth * 0.025;

  const tabs: { id: CalcTab; label: string; icon: React.ReactNode }[] = [
    { id: 'profit', label: 'লাভ হিসাব', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'investment', label: 'পুঁজি হিসাব', icon: <Calculator className="w-4 h-4" /> },
    { id: 'margin', label: 'মার্জিন', icon: <Percent className="w-4 h-4" /> },
    { id: 'emi', label: 'লোন ও EMI', icon: <Landmark className="w-4 h-4" /> },
    { id: 'discount', label: 'ডিসকাউন্ট', icon: <Tag className="w-4 h-4" /> },
    { id: 'vat', label: 'VAT হিসাব', icon: <Receipt className="w-4 h-4" /> },
    { id: 'zakat', label: 'যাকাত ২.৫%', icon: <Coins className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#044E36] to-[#065F46] rounded-2xl p-5 text-white shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="পিছনে যান"
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 className="text-xl font-bold tracking-tight">ব্যবসায়িক হিসাব ও ক্যালকুলেটর</h2>
            <p className="text-xs text-emerald-100 mt-0.5">
              সঠিক হিসাব, সঠিক সিদ্ধান্ত — আপনার ব্যবসার সহায়ক ৭টি টুলস
            </p>
          </div>
        </div>
      </div>

      {/* Segmented Calculator Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors min-h-[44px] ${
              activeTab === tab.id
                ? 'bg-[#044E36] text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50/50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Active Calculator Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        {activeTab === 'profit' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                লাভ ও লোকসান ক্যালকুলেটর (Profit Calculator)
              </h3>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  প্রতি পিস ক্রয়মূল্য (৳)
                </label>
                <input
                  type="number"
                  value={purchaseCost}
                  onChange={(e) => setPurchaseCost(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm tabular-nums focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  প্রতি পিস বিক্রয়মূল্য (৳)
                </label>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm tabular-nums focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  মোট পণ্যের পরিমাণ (Quantity)
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm tabular-nums focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  অন্যান্য খরচ — পরিবহন, প্যাকিং, মার্কেটিং (৳)
                </label>
                <input
                  type="number"
                  value={otherExpenses}
                  onChange={(e) => setOtherExpenses(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm tabular-nums focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="bg-emerald-950 text-white rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs text-emerald-300 font-medium">হিসাবের ফলাফল</span>
                <h4 className="text-2xl font-bold text-amber-400 tabular-nums mt-1">
                  নিট লাভ: ৳{netProfit.toLocaleString('bn-BD')}
                </h4>
                <p className="text-xs text-emerald-200 mt-1 tabular-nums">
                  লাভের হার: {profitPercent.toFixed(1)}%
                </p>
              </div>
              <div className="space-y-2.5 pt-4 border-t border-emerald-800/80 text-sm">
                <div className="flex justify-between">
                  <span className="text-emerald-200">মোট খরচ (Total Cost):</span>
                  <span className="font-semibold tabular-nums">৳{totalCost.toLocaleString('bn-BD')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-200">মোট বিক্রয় (Total Revenue):</span>
                  <span className="font-semibold tabular-nums">৳{totalRevenue.toLocaleString('bn-BD')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-200">প্রতি ইউনিটে নিট লাভ:</span>
                  <span className="font-semibold text-amber-300 tabular-nums">
                    ৳{qty > 0 ? (netProfit / qty).toFixed(1) : '0'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'investment' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3.5">
              <h3 className="text-base font-bold text-slate-900">
                প্রাথমিক পুঁজি ক্যালকুলেটর (Startup Investment)
              </h3>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  যন্ত্রপাতি ও সরঞ্জাম খরচ (৳)
                </label>
                <input
                  type="number"
                  value={equipmentCost}
                  onChange={(e) => setEquipmentCost(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  প্রথম ব্যাচ কাঁচামাল বা পণ্য ক্রয় (৳)
                </label>
                <input
                  type="number"
                  value={rawMaterialCost}
                  onChange={(e) => setRawMaterialCost(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  প্যাকেজিং, স্টিকার ও ব্র্যান্ডিং (৳)
                </label>
                <input
                  type="number"
                  value={packagingCost}
                  onChange={(e) => setPackagingCost(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  মার্কেটিং ও প্রচারণা বাজেট (৳)
                </label>
                <input
                  type="number"
                  value={marketingBudget}
                  onChange={(e) => setMarketingBudget(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  জরুরি ক্যাশ রিজার্ভ (৳)
                </label>
                <input
                  type="number"
                  value={emergencyReserve}
                  onChange={(e) => setEmergencyReserve(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm tabular-nums"
                />
              </div>
            </div>
            <div className="bg-emerald-950 text-white rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-xs text-emerald-300">প্রয়োজনীয় মোট প্রারম্ভিক পুঁজি</span>
                <h4 className="text-3xl font-bold text-amber-400 tabular-nums mt-1">
                  ৳{totalStartupInvestment.toLocaleString('bn-BD')}
                </h4>
                <p className="text-xs text-emerald-200 mt-2">
                  পরামর্শ: মোট পুঁজির অন্তত ১৫%–২০% জরুরি তহবিল হিসেবে হাতে রাখলে ব্যবসা ঝুঁকিমুক্ত থাকে।
                </p>
              </div>
              <div className="space-y-2 pt-4 border-t border-emerald-800/80 text-sm">
                <div className="flex justify-between">
                  <span className="text-emerald-200">স্থায়ী সরঞ্জাম অনুপাত:</span>
                  <span className="tabular-nums font-semibold">
                    {totalStartupInvestment > 0
                      ? (((Number(equipmentCost) || 0) / totalStartupInvestment) * 100).toFixed(0)
                      : 0}
                    %
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-200">চলতি মূলধন (Working Capital):</span>
                  <span className="tabular-nums font-semibold text-amber-300">
                    ৳{(totalStartupInvestment - (Number(equipmentCost) || 0)).toLocaleString('bn-BD')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'margin' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                প্রফিট মার্জিন ক্যালকুলেটর (Margin Calculator)
              </h3>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  পণ্যের মোট উৎপাদন/ক্রয় খরচ (৳)
                </label>
                <input
                  type="number"
                  value={marginCost}
                  onChange={(e) => setMarginCost(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  নির্ধারিত বিক্রয়মূল্য (৳)
                </label>
                <input
                  type="number"
                  value={marginSell}
                  onChange={(e) => setMarginSell(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm tabular-nums"
                />
              </div>
            </div>
            <div className="bg-emerald-950 text-white rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-xs text-emerald-300">গ্রস প্রফিট মার্জিন</span>
                <h4 className="text-3xl font-bold text-amber-400 tabular-nums mt-1">
                  {grossMarginPct.toFixed(2)}%
                </h4>
              </div>
              <div className="space-y-2 pt-4 border-t border-emerald-800/80 text-sm">
                <div className="flex justify-between">
                  <span className="text-emerald-200">মার্কআপ হার (Markup %):</span>
                  <span className="font-semibold tabular-nums">{markupPct.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-200">প্রতি পিসে মুনাফা:</span>
                  <span className="font-semibold text-amber-300 tabular-nums">
                    ৳{unitProfit.toLocaleString('bn-BD')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'emi' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                এসএমই লোন ও কিস্তি ক্যালকুলেটর (Loan / EMI)
              </h3>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ঋণের পরিমাণ (Loan Amount ৳)
                </label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  বার্ষিক সুদের হার / মুনাফা (% Interest)
                </label>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  মেয়াদ (মাস - Duration in Months)
                </label>
                <input
                  type="number"
                  value={loanMonths}
                  onChange={(e) => setLoanMonths(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm tabular-nums"
                />
              </div>
            </div>
            <div className="bg-emerald-950 text-white rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-xs text-emerald-300">মাসিক কিস্তি (Monthly EMI)</span>
                <h4 className="text-3xl font-bold text-amber-400 tabular-nums mt-1">
                  ৳{Math.round(emi).toLocaleString('bn-BD')} / মাস
                </h4>
              </div>
              <div className="space-y-2 pt-4 border-t border-emerald-800/80 text-sm">
                <div className="flex justify-between">
                  <span className="text-emerald-200">মোট আসল (Principal):</span>
                  <span className="font-semibold tabular-nums">৳{principal.toLocaleString('bn-BD')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-200">মোট সুদ/চার্জ:</span>
                  <span className="font-semibold tabular-nums">
                    ৳{Math.round(totalInterest).toLocaleString('bn-BD')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-200">সর্বমোট পরিশোধযোগ্য:</span>
                  <span className="font-semibold text-amber-300 tabular-nums">
                    ৳{Math.round(totalLoanPayable).toLocaleString('bn-BD')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'discount' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                ডিসকাউন্ট ও অফার ক্যালকুলেটর
              </h3>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  পণ্যের নির্ধারিত মূল্য (৳)
                </label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ছাড়ের শতকরা হার (Discount %)
                </label>
                <input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm tabular-nums"
                />
              </div>
            </div>
            <div className="bg-emerald-950 text-white rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-xs text-emerald-300">ছাড়ের পর বিক্রয়মূল্য</span>
                <h4 className="text-3xl font-bold text-amber-400 tabular-nums mt-1">
                  ৳{finalDiscountedPrice.toLocaleString('bn-BD')}
                </h4>
              </div>
              <div className="space-y-2 pt-4 border-t border-emerald-800/80 text-sm">
                <div className="flex justify-between">
                  <span className="text-emerald-200">ক্রেতার সাশ্রয় (Savings):</span>
                  <span className="font-semibold text-amber-300 tabular-nums">
                    ৳{discountSaved.toLocaleString('bn-BD')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vat' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">ভ্যাট (VAT) ক্যালকুলেটর</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  টাকার পরিমাণ (৳)
                </label>
                <input
                  type="number"
                  value={vatBaseAmount}
                  onChange={(e) => setVatBaseAmount(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ভ্যাটের হার (VAT %)
                </label>
                <input
                  type="number"
                  value={vatRate}
                  onChange={(e) => setVatRate(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm tabular-nums"
                />
              </div>
              <div className="flex items-center gap-3 pt-1">
                <input
                  id="vat-inc"
                  type="checkbox"
                  checked={vatInclusive}
                  onChange={(e) => setVatInclusive(e.target.checked)}
                  className="w-4 h-4 accent-emerald-700"
                />
                <label htmlFor="vat-inc" className="text-xs font-medium text-slate-700">
                  মূল্যের ভেতরে ভ্যাট অন্তর্ভুক্ত আছে (VAT Inclusive)
                </label>
              </div>
            </div>
            <div className="bg-emerald-950 text-white rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-xs text-emerald-300">ভ্যাটসহ মোট মূল্য</span>
                <h4 className="text-3xl font-bold text-amber-400 tabular-nums mt-1">
                  ৳{vatTotal.toFixed(2)}
                </h4>
              </div>
              <div className="space-y-2 pt-4 border-t border-emerald-800/80 text-sm">
                <div className="flex justify-between">
                  <span className="text-emerald-200">ভ্যাট ছাড়া মূল দাম:</span>
                  <span className="font-semibold tabular-nums">৳{vatNet.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-200">ভ্যাটের পরিমাণ ({vatRate}%):</span>
                  <span className="font-semibold text-amber-300 tabular-nums">
                    ৳{vatAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'zakat' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3.5">
              <h3 className="text-base font-bold text-slate-900">
                ব্যবসায়িক যাকাত ২.৫% ক্যালকুলেটর (Zakat Calculator)
              </h3>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  হাতে ও ব্যাংকে জমা নগদ টাকা (৳)
                </label>
                <input
                  type="number"
                  value={cashInHand}
                  onChange={(e) => setCashInHand(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  বিক্রয়যোগ্য ব্যবসায়িক পণ্যের বর্তমান বাজারমূল্য (৳)
                </label>
                <input
                  type="number"
                  value={businessStockValue}
                  onChange={(e) => setBusinessStockValue(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  নিশ্চিত পাওনা বা বকেয়া আদায়যোগ্য টাকা (৳)
                </label>
                <input
                  type="number"
                  value={receivables}
                  onChange={(e) => setReceivables(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ব্যবসায়িক ঋণ বা প্রদেয় বকেয়া (বাদ যাবে ৳)
                </label>
                <input
                  type="number"
                  value={businessDebts}
                  onChange={(e) => setBusinessDebts(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm tabular-nums"
                />
              </div>
            </div>
            <div className="bg-emerald-950 text-white rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-xs text-emerald-300">প্রদেয় যাকাত (২.৫% হারে)</span>
                <h4 className="text-3xl font-bold text-amber-400 tabular-nums mt-1">
                  ৳{Math.round(zakatPayable).toLocaleString('bn-BD')}
                </h4>
                <p className="text-xs text-emerald-200 mt-1">
                  নিসাব পরিমাণ সম্পদ পূর্ণ ১ বছর স্থায়ী হলে ২.৫% যাকাত প্রযোজ্য।
                </p>
              </div>
              <div className="space-y-2 pt-4 border-t border-emerald-800/80 text-sm">
                <div className="flex justify-between">
                  <span className="text-emerald-200">যাকাতযোগ্য নিট সম্পদ:</span>
                  <span className="font-semibold tabular-nums">
                    ৳{netZakatableWealth.toLocaleString('bn-BD')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
