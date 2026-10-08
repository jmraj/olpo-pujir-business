import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

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

function syncTarget(target, androidModuleDir, titleBn, bgClass) {
  const buildDir = path.join(rootDir, 'build_output', target);
  const assetsDir = path.join(buildDir, 'assets');
  if (!fs.existsSync(assetsDir)) {
    console.warn(`[sync-android-assets] Missing ${assetsDir}`);
    return;
  }

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
    const transformed = esbuild.transformSync(jsContent, {
      format: 'iife',
      target: 'es2019',
      minify: true,
    });
    jsContent = transformed.code;
  }

  // 1. Update Android module assets (app/src/main/assets or admin-app/src/main/assets)
  const androidAssetsDir = path.join(rootDir, androidModuleDir, 'src', 'main', 'assets');
  fs.mkdirSync(androidAssetsDir, { recursive: true });

  const androidIndexHtml = `<!doctype html>
<html lang="bn">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>${titleBn}</title>
    ${ANDROID_FILE_VIEWER_POLYFILL}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/app.css?v=2.0.0" />
  </head>
  <body class="${bgClass} text-slate-900 antialiased selection:bg-emerald-700 selection:text-white">
    <div id="root"></div>
    <script defer src="/app.js?v=2.0.0"></script>
  </body>
</html>
`;

  fs.writeFileSync(path.join(androidAssetsDir, 'index.html'), androidIndexHtml, 'utf-8');
  fs.writeFileSync(path.join(androidAssetsDir, 'app.css'), cssContent, 'utf-8');
  fs.writeFileSync(path.join(androidAssetsDir, 'app.js'), jsContent, 'utf-8');

  // 2. Also write pre-bundled HopWeb single-file index.html in build_output/{target}/hopweb_index.html
  const safeCss = cssContent.replace(/<\/style/gi, '<\\/style');
  const safeJs = jsContent.replace(/<\/script/gi, '<\\/script');

  const hopwebHtml = `<!doctype html>
<html lang="bn">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>${titleBn}</title>
    ${ANDROID_FILE_VIEWER_POLYFILL}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />
    <style>${safeCss}</style>
  </head>
  <body class="${bgClass} text-slate-900 antialiased selection:bg-emerald-700 selection:text-white">
    <div id="root"></div>
    <script>${safeJs}</script>
  </body>
</html>`;

  fs.writeFileSync(path.join(buildDir, 'hopweb_index.html'), hopwebHtml, 'utf-8');

  console.log(
    `[sync-android-assets] Synced ${target} -> ${androidModuleDir}/src/main/assets (JS: ${jsContent.length} bytes, CSS: ${cssContent.length} bytes, HopWeb HTML: ${hopwebHtml.length} bytes)`
  );
}

syncTarget(
  'user',
  'app',
  'অল্প পুঁজির ব্যবসা - ছোট পুঁজি • বড় সম্ভাবনা',
  'bg-[#F4F8F6]'
);
syncTarget(
  'admin',
  'admin-app',
  'অল্প পুঁজির ব্যবসা Admin',
  'bg-[#F1F5F3]'
);
