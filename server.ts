import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SYSTEM_INSTRUCTION = `তুমি "অল্প পুঁজির ব্যবসা (ছোট পুঁজি • বড় সম্ভাবনা)" প্ল্যাটফর্মের প্রধান AI Business Consultant।
তোমার কাজ হলো বাংলাদেশের ক্ষুদ্র ও মাঝারি উদ্যোক্তাদের (SME Entrepreneurs) বাংলা ভাষায় বাস্তবসম্মত, লাভজনক এবং কার্যকরী ব্যবসার পরামর্শ দেওয়া।

উত্তর দেওয়ার নিয়মাবলী:
১. সবসময় স্পষ্ট, উৎসাহব্যঞ্জক এবং পেশাদার বাংলায় উত্তর দেবে।
২. টাকার অংক সবসময় বাংলাদেশী টাকায় (৳) উল্লেখ করবে।
৩. কোনো ব্যবসার আইডিয়া বা পরামর্শ দিলে তার সম্ভাব্য পুঁজি (Investment), কাঁচামাল কোথায় পাওয়া যাবে (যেমন: ঢাকার চকবাজার, ইসলামপুর, কারওয়ান বাজার, চট্টগ্রামের খাতুনগঞ্জ, স্থানীয় বিসিক বা পাইকারি বাজার), দৈনিক ও মাসিক সম্ভাব্য লাভ, মার্কেটিং কৌশল (ফেসবুক পেজ, দারাজ, লোকাল ডেলিভারি) এবং ঝুঁকি সংক্ষেপে পয়েন্ট আকারে তুলে ধরবে।
৪. সংক্ষিপ্ত ও সহজে পড়া যায় এমন বুলেট পয়েন্ট ব্যবহার করবে।`;

function getFallbackAdvice(userPrompt: string): string {
  const q = userPrompt.toLowerCase();
  if (q.includes('৫,০০০') || q.includes('5000') || q.includes('5,000') || q.includes('কম পুঁজি')) {
    return `**৳৫,০০০ – ৳১০,০০০ পুঁজিতে শুরু করার মতো ৩টি সেরা ব্যবসা:**

১. **ঘরে তৈরি খাঁটি মসলা ও আচার প্যাকিং ব্যবসা**
- **প্রাথমিক পুঁজি:** ৳৪,৫০০ – ৳৮,০০০ (কাঁচামাল, জার, স্টিকার ও হিট সিলার)
- **পাইকারি সোর্সিং:** কারওয়ান বাজার, শ্যামবাজার বা স্থানীয় বড় পাইকারি হাট
- **সম্ভাব্য মাসিক আয়:** ৳১২,০০০ – ৳২৫,০০০ (৩০%–৩৫% নিট লাভ)
- **মার্কেটিং:** ফেসবুক পেজ, প্রতিবেশীদের গ্রুপ এবং স্থানীয় মুদি দোকানে সাপ্লাই।

২. **মোবাইল রিচার্জ, বিকাশ/নগদ এজেন্ট ও ডিজিটাল ফর্ম পূরণ সেবা**
- **প্রাথমিক পুঁজি:** ৳৫,০০০ – ৳১০,০০০
- **সম্ভাব্য মাসিক আয়:** ৳১০,০০০ – ৳১৮,০০০

৩. **হোমমেড ফ্রোজেন স্ন্যাকস (সিঙ্গারা, সমুচা, রোল)**
- **প্রাথমিক পুঁজি:** ৳৩,৫০০ – ৳৬,০০০
- **সম্ভাব্য মাসিক আয়:** ৳১৫,০০০ – ৳২৮,০০০`;
  }
  return `**আপনার প্রশ্নের জন্য ব্যবসায়িক পরামর্শ (${userPrompt}):**

১. **বাজার যাচাই ও ছোট শুরু:** শুরুতে পুরো পুঁজি একসাথে বিনিয়োগ না করে ৪০% পুঁজি দিয়ে পরীক্ষামূলকভাবে (Pilot Batch) পণ্য বা সেবা চালু করুন।
২. **পাইকারি সোর্সিং:** ঢাকার চকবাজার (কসমেটিকস, গিফট, প্যাকেজিং), ইসলামপুর (কাপড়), অথবা স্থানীয় উৎপাদকদের কাছ থেকে সরাসরি পণ্য সংগ্রহ করলে ১৫%–২৫% খরচ কমে।
৩. **বিক্রয় ও প্রচারণা:** ফেসবুক পেজে নিয়মিত আসল ছবি ও ভিডিও পোস্ট করুন, কাস্টমার রিভিউ সংগ্রহ করুন এবং কুরিয়ার (Steadfast / Pathao / RedX) ক্যাশ-অন-ডেলিভারি সুবিধা রাখুন।
৪. **হিসাব রক্ষণ:** আমাদের অ্যাপের **হিসাব ও ক্যালকুলেটর** টুল ব্যবহার করে প্রতিদিন ক্রয়মূল্য, পরিবহন খরচ ও নিট লাভের হিসাব লিখে রাখুন।`;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  app.post('/api/ai/chat', async (req, res) => {
    const { messages, modelChoice } = req.body as {
      messages?: Array<{ role: 'user' | 'model'; text: string }>;
      modelChoice?: string;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'অনুগ্রহ করে একটি প্রশ্ন লিখুন।' });
      return;
    }

    const selectedModel =
      modelChoice === 'fast'
        ? 'gemini-3.1-flash-lite'
        : 'gemini-3.8-flash';

    const lastUserMessage = messages[messages.length - 1]?.text || '';
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      res.json({
        reply: getFallbackAdvice(lastUserMessage),
        modelUsed: selectedModel,
      });
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const contents = messages.map((m) => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const text = response.text || getFallbackAdvice(lastUserMessage);
      res.json({
        reply: text,
        modelUsed: selectedModel,
      });
    } catch (error: unknown) {
      console.error('Gemini API error:', error);
      res.json({
        reply: getFallbackAdvice(lastUserMessage),
        modelUsed: selectedModel,
        note: 'সার্ভার ব্যাকআপ পরামর্শ ব্যবহৃত হয়েছে।',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
