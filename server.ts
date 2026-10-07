import express from 'express';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import esbuild from 'esbuild';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getTargetBuildDir(target: 'user' | 'admin'): string {
  const persistentDir = path.join(__dirname, 'build_output', target);
  if (fs.existsSync(path.join(persistentDir, 'assets'))) {
    return persistentDir;
  }
  const distDir = path.join(__dirname, 'dist', target);
  if (fs.existsSync(path.join(distDir, 'assets'))) {
    return distDir;
  }
  try {
    const cfgFile =
      target === 'user' ? 'vite.user.config.ts' : 'vite.admin.config.ts';
    execSync(`npx vite build --config ${cfgFile}`, {
      cwd: __dirname,
      stdio: 'ignore',
    });
  } catch (err) {
    console.error(`Auto-build failed for ${target}:`, err);
  }
  return persistentDir;
}

const ANDROID_FILE_VIEWER_POLYFILL = `<script>
(function() {
  try {
    var testKey = '__apb_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
  } catch (e) {
    var mem = {};
    var fakeStorage = {
      getItem: function(k) { return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
      setItem: function(k, v) { mem[k] = String(v); },
      removeItem: function(k) { delete mem[k]; },
      clear: function() { mem = {}; },
      key: function(i) { return Object.keys(mem)[i] || null; },
      get length() { return Object.keys(mem).length; }
    };
    try {
      Object.defineProperty(window, 'localStorage', { value: fakeStorage, configurable: true });
      Object.defineProperty(window, 'sessionStorage', { value: fakeStorage, configurable: true });
    } catch (err) {}
  }
})();
</script>`;

const cachedBundles: Record<string, string> = {};
const cachedZips: Record<string, Buffer> = {};

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createZipArchive(files: Array<{ name: string; data: Buffer }>): Buffer {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;

  for (const file of files) {
    const nameBuf = Buffer.from(file.name, 'utf-8');
    const dataBuf = file.data;
    const crc = crc32(dataBuf);

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0); // Local file header signature
    localHeader.writeUInt16LE(20, 4); // Version needed
    localHeader.writeUInt16LE(0, 6); // Flags
    localHeader.writeUInt16LE(0, 8); // Compression method (0 = Store)
    localHeader.writeUInt16LE(0, 10); // Mod time
    localHeader.writeUInt16LE(0, 12); // Mod date
    localHeader.writeUInt32LE(crc, 14); // CRC-32
    localHeader.writeUInt32LE(dataBuf.length, 18); // Compressed size
    localHeader.writeUInt32LE(dataBuf.length, 22); // Uncompressed size
    localHeader.writeUInt16LE(nameBuf.length, 26); // Filename length
    localHeader.writeUInt16LE(0, 28); // Extra field length

    localParts.push(localHeader, nameBuf, dataBuf);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0); // Central directory signature
    centralHeader.writeUInt16LE(20, 4); // Version made by
    centralHeader.writeUInt16LE(20, 6); // Version needed
    centralHeader.writeUInt16LE(0, 8); // Flags
    centralHeader.writeUInt16LE(0, 10); // Compression method (0 = Store)
    centralHeader.writeUInt16LE(0, 12); // Mod time
    centralHeader.writeUInt16LE(0, 14); // Mod date
    centralHeader.writeUInt32LE(crc, 16); // CRC-32
    centralHeader.writeUInt32LE(dataBuf.length, 20); // Compressed size
    centralHeader.writeUInt32LE(dataBuf.length, 24); // Uncompressed size
    centralHeader.writeUInt16LE(nameBuf.length, 28); // Filename length
    centralHeader.writeUInt16LE(0, 30); // Extra field length
    centralHeader.writeUInt16LE(0, 32); // File comment length
    centralHeader.writeUInt16LE(0, 34); // Disk number
    centralHeader.writeUInt16LE(0, 36); // Internal attributes
    centralHeader.writeUInt32LE(0, 38); // External attributes
    centralHeader.writeUInt32LE(offset, 42); // Relative offset

    centralParts.push(centralHeader, nameBuf);
    offset += localHeader.length + nameBuf.length + dataBuf.length;
  }

  const centralDirBuf = Buffer.concat(centralParts);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // End of central directory signature
  eocd.writeUInt16LE(0, 4); // Number of this disk
  eocd.writeUInt16LE(0, 6); // Disk where central directory starts
  eocd.writeUInt16LE(files.length, 8); // Number of central directory records on this disk
  eocd.writeUInt16LE(files.length, 10); // Total number of central directory records
  eocd.writeUInt32LE(centralDirBuf.length, 12); // Size of central directory
  eocd.writeUInt32LE(offset, 16); // Offset of start of central directory
  eocd.writeUInt16LE(0, 20); // Comment length

  return Buffer.concat([...localParts, centralDirBuf, eocd]);
}

function buildSelfContainedZip(target: 'user' | 'admin'): Buffer | null {
  if (cachedZips[target]) return cachedZips[target];
  const dir = getTargetBuildDir(target);
  const assetsDir = path.join(dir, 'assets');
  if (!fs.existsSync(assetsDir)) return null;

  const files = fs.readdirSync(assetsDir);
  const cssFile = files.find((f) => f.endsWith('.css'));
  const jsFile = files.find((f) => f.endsWith('.js'));

  const cssContent = cssFile
    ? fs.readFileSync(path.join(assetsDir, cssFile), 'utf-8')
    : '';
  let jsContent = jsFile
    ? fs.readFileSync(path.join(assetsDir, jsFile), 'utf-8')
    : '';

  if (jsContent) {
    try {
      const transformed = esbuild.transformSync(jsContent, {
        format: 'iife',
        target: 'es2019',
        minify: true,
      });
      jsContent = transformed.code;
    } catch (e) {
      console.warn('esbuild transform fallback:', e);
    }
  }

  const appTitle =
    target === 'admin'
      ? 'অল্প পুঁজির ব্যবসা Admin'
      : 'অল্প পুঁজির ব্যবসা - ছোট পুঁজি • বড় সম্ভাবনা';

  const cleanHtml = `<!doctype html>
<html lang="bn">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>${appTitle}</title>
    ${ANDROID_FILE_VIEWER_POLYFILL}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="app.css" />
  </head>
  <body class="bg-[#F4F8F6] text-slate-900 antialiased selection:bg-emerald-700 selection:text-white">
    <div id="root"></div>
    <script defer src="app.js"></script>
  </body>
</html>`;

  const manifest = JSON.stringify(
    {
      name:
        target === 'admin'
          ? 'অল্প পুঁজির ব্যবসা Admin'
          : 'অল্প পুঁজির ব্যবসা',
      short_name:
        target === 'admin' ? 'ব্যবসা Admin' : 'অল্প পুঁজির ব্যবসা',
      start_url: 'index.html',
      display: 'standalone',
      background_color: '#042F24',
      theme_color: '#064E3B',
    },
    null,
    2
  );

  const zipBuf = createZipArchive([
    { name: 'index.html', data: Buffer.from(cleanHtml, 'utf-8') },
    { name: 'app.css', data: Buffer.from(cssContent, 'utf-8') },
    { name: 'app.js', data: Buffer.from(jsContent, 'utf-8') },
    { name: 'manifest.json', data: Buffer.from(manifest, 'utf-8') },
  ]);
  cachedZips[target] = zipBuf;
  return zipBuf;
}

function buildSelfContainedHtml(target: 'user' | 'admin'): string | null {
  if (cachedBundles[target]) return cachedBundles[target];
  const dir = getTargetBuildDir(target);
  const htmlFile = path.join(dir, target === 'user' ? 'user.html' : 'admin.html');
  if (!fs.existsSync(htmlFile)) return null;

  let html = fs.readFileSync(htmlFile, 'utf-8');
  const assetsDir = path.join(dir, 'assets');
  if (!fs.existsSync(assetsDir)) return html;

  const files = fs.readdirSync(assetsDir);
  const cssFile = files.find((f) => f.endsWith('.css'));
  const jsFile = files.find((f) => f.endsWith('.js'));

  const cssContent = cssFile
    ? fs.readFileSync(path.join(assetsDir, cssFile), 'utf-8')
    : '';
  let jsContent = jsFile
    ? fs.readFileSync(path.join(assetsDir, jsFile), 'utf-8')
    : '';

  if (jsContent) {
    try {
      const transformed = esbuild.transformSync(jsContent, {
        format: 'iife',
        target: 'es2019',
        minify: true,
      });
      jsContent = transformed.code;
    } catch (e) {
      console.warn('esbuild transform fallback:', e);
    }
  }

  // Remove external script/link tags pointing to /assets/*
  html = html.replace(
    /<script[^>]*src="\/assets\/[^"]+"[^>]*><\/script>/g,
    ''
  );
  html = html.replace(/<link[^>]*href="\/assets\/[^"]+"[^>]*>/g, '');

  const cssBase64 = Buffer.from(cssContent, 'utf-8').toString('base64');
  const jsBase64 = Buffer.from(jsContent, 'utf-8').toString('base64');

  html = html.replace(
    '</head>',
    () =>
      `${ANDROID_FILE_VIEWER_POLYFILL}\n<link rel="stylesheet" href="data:text/css;base64,${cssBase64}" />\n</head>`
  );

  if (jsContent) {
    html = html.replace(
      '</body>',
      () => `<script defer src="data:text/javascript;base64,${jsBase64}"></script>\n</body>`
    );
  }

  cachedBundles[target] = html;
  return html;
}

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

function renderDownloadPortalHtml(autoTarget?: 'user' | 'admin' | 'user-html' | 'admin-html'): string {
  const autoDownloadUrl =
    autoTarget === 'user'
      ? '/api/download/user-zip'
      : autoTarget === 'admin'
      ? '/api/download/admin-zip'
      : autoTarget === 'user-html'
      ? '/api/download/user-app'
      : autoTarget === 'admin-html'
      ? '/api/download/admin-app'
      : '';

  return `<!doctype html>
<html lang="bn">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>অল্প পুঁজির ব্যবসা — অ্যাপ ডাউনলোড সেন্টার</title>
  <style>
    * { box-sizing: border-box; font-family: system-ui, -apple-system, sans-serif; }
    body { margin: 0; background: #022C22; color: #0F172A; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 16px; }
    .card { max-width: 460px; width: 100%; background: #ffffff; border-radius: 24px; padding: 22px; border: 3px solid #D4AF37; box-shadow: 0 20px 50px rgba(0,0,0,0.45); }
    .badge { display: inline-block; background: #D1FAE5; color: #065F46; font-size: 12px; font-weight: 800; padding: 4px 12px; border-radius: 999px; }
    h1 { font-size: 20px; margin: 10px 0 4px; color: #064E3B; }
    p.sub { font-size: 13px; color: #475569; margin: 0 0 16px; line-height: 1.5; }
    .box-user { background: #ECFDF5; border: 2px solid #34D399; border-radius: 18px; padding: 14px; margin-bottom: 14px; }
    .box-admin { background: #FFFBEB; border: 2px solid #FBBF24; border-radius: 18px; padding: 14px; margin-bottom: 14px; }
    .box-title { font-size: 14px; font-weight: 800; margin-bottom: 10px; }
    .btn { display: block; width: 100%; text-align: center; text-decoration: none; font-size: 13px; font-weight: 800; padding: 13px 14px; border-radius: 12px; margin-bottom: 8px; cursor: pointer; border: none; }
    .btn:last-child { margin-bottom: 0; }
    .btn-green { background: #064E3B; color: #ffffff; }
    .btn-green-outline { background: #ffffff; color: #064E3B; border: 2px solid #059669; }
    .btn-gold { background: linear-gradient(90deg, #D4AF37, #F59E0B); color: #0F172A; }
    .btn-gold-outline { background: #ffffff; color: #92400E; border: 2px solid #D97706; }
    .status { display: none; padding: 10px 12px; border-radius: 12px; background: #DCFCE7; color: #166534; font-size: 12px; font-weight: 700; margin-bottom: 14px; text-align: center; }
    .nav-row { display: flex; gap: 8px; margin-top: 12px; }
    .nav-btn { flex: 1; text-align: center; text-decoration: none; padding: 10px; border-radius: 10px; font-size: 12px; font-weight: 800; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">📲 অফিসিয়াল ডাউনলোড সার্ভার</span>
    <h1>অল্প পুঁজির ব্যবসা — APK ও App ডাউনলোড</h1>
    <p class="sub">যেকোনো বাটনে ১ বার চাপ দিলেই সরাসরি আপনার ফোনে ফাইল ডাউনলোড হয়ে যাবে:</p>
    <div id="dl-status" class="status">✅ ডাউনলোড শুরু হয়েছে! আপনার ব্রাউজারের Downloads ফোল্ডার দেখুন।</div>

    <div class="box-user">
      <div class="box-title" style="color:#064E3B;">১. User App (গ্রাহক ও উদ্যোক্তাদের অ্যাপ)</div>
      <a class="btn btn-green" href="/api/download/user-zip" download="Alpo_Pujir_Bebsha_User_App.zip" onclick="showStatus('User App ZIP ডাউনলোড হচ্ছে...')">
        📦 User App ZIP ডাউনলোড (APK / WebView ফাইল)
      </a>
      <a class="btn btn-green-outline" href="/api/download/user-app" download="Alpo_Pujir_Bebsha_User_App.html" onclick="showStatus('User App (.html) ডাউনলোড হচ্ছে...')">
        📱 User App ডাউনলোড (মোবাইলে সরাসরি ওপেন হবে)
      </a>
    </div>

    <div class="box-admin">
      <div class="box-title" style="color:#92400E;">২. Admin Panel App (অ্যাডমিন কন্ট্রোল অ্যাপ)</div>
      <a class="btn btn-gold" href="/api/download/admin-zip" download="Alpo_Pujir_Bebsha_Admin_App.zip" onclick="showStatus('Admin App ZIP ডাউনলোড হচ্ছে...')">
        📦 Admin App ZIP ডাউনলোড (APK / WebView ফাইল)
      </a>
      <a class="btn btn-gold-outline" href="/api/download/admin-app" download="Alpo_Pujir_Bebsha_Admin_App.html" onclick="showStatus('Admin App (.html) ডাউনলোড হচ্ছে...')">
        🔐 Admin App ডাউনলোড (মোবাইলে সরাসরি ওপেন হবে)
      </a>
    </div>

    <div class="nav-row">
      <a class="nav-btn" style="background:#F1F5F9;color:#1E293B;" href="/">← User App ওপেন করুন</a>
      <a class="nav-btn" style="background:#0F172A;color:#FDE68A;" href="/?app=admin">Admin Panel ওপেন করুন →</a>
    </div>
  </div>
  <script>
    function showStatus(msg) {
      var el = document.getElementById('dl-status');
      if (el) {
        el.style.display = 'block';
        el.textContent = '✅ ' + msg;
      }
    }
    var autoUrl = ${JSON.stringify(autoDownloadUrl)};
    if (autoUrl) {
      showStatus('স্বয়ংক্রিয়ভাবে ডাউনলোড শুরু হচ্ছে... শুরু না হলে নিচের বাটনে চাপুন।');
      setTimeout(function() {
        window.location.href = autoUrl;
      }, 400);
    }
  </script>
</body>
</html>`;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  app.get('/download', (req, res) => {
    const t = String(req.query.target || '').toLowerCase();
    const autoTarget =
      t === 'user' || t === 'admin' || t === 'user-html' || t === 'admin-html'
        ? (t as 'user' | 'admin' | 'user-html' | 'admin-html')
        : undefined;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(renderDownloadPortalHtml(autoTarget));
  });

  app.get('/download/user', (_req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(renderDownloadPortalHtml('user'));
  });

  app.get('/download/admin', (_req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(renderDownloadPortalHtml('admin'));
  });

  app.get('/api/download/user-app', (_req, res) => {
    const bundled = buildSelfContainedHtml('user');
    if (!bundled) {
      res.status(404).send('User App build not found.');
      return;
    }
    const buf = Buffer.from(bundled, 'utf-8');
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', String(buf.length));
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="Alpo_Pujir_Bebsha_User_App.html"'
    );
    res.send(buf);
  });

  app.get('/api/download/admin-app', (_req, res) => {
    const bundled = buildSelfContainedHtml('admin');
    if (!bundled) {
      res.status(404).send('Admin App build not found.');
      return;
    }
    const buf = Buffer.from(bundled, 'utf-8');
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', String(buf.length));
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="Alpo_Pujir_Bebsha_Admin_App.html"'
    );
    res.send(buf);
  });

  app.get('/api/download/user-zip', (_req, res) => {
    const zipBuf = buildSelfContainedZip('user');
    if (!zipBuf) {
      res.status(404).send('User App ZIP not found.');
      return;
    }
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Length', String(zipBuf.length));
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="Alpo_Pujir_Bebsha_User_App.zip"'
    );
    res.send(zipBuf);
  });

  app.get('/api/download/admin-zip', (_req, res) => {
    const zipBuf = buildSelfContainedZip('admin');
    if (!zipBuf) {
      res.status(404).send('Admin App ZIP not found.');
      return;
    }
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Length', String(zipBuf.length));
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="Alpo_Pujir_Bebsha_Admin_App.zip"'
    );
    res.send(zipBuf);
  });

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
    setTimeout(() => {
      try {
        buildSelfContainedZip('user');
        buildSelfContainedZip('admin');
        buildSelfContainedHtml('user');
        buildSelfContainedHtml('admin');
      } catch (e) {
        console.warn('Pre-warm warning:', e);
      }
    }, 50);
  });
}

startServer();
