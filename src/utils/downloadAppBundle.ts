export type DownloadTarget = 'user-zip' | 'admin-zip' | 'user-html' | 'admin-html';

export const TARGET_INFO: Record<
  DownloadTarget,
  {
    endpoint: string;
    filename: string;
    mimeType: string;
    labelBn: string;
  }
> = {
  'user-html': {
    endpoint: '/api/download/user-app',
    filename: 'User_HopWeb_Updated_index.html',
    mimeType: 'text/html;charset=utf-8',
    labelBn: 'Users Panel HopWeb HTML (User_HopWeb_Updated_index.html)',
  },
  'admin-html': {
    endpoint: '/api/download/admin-app',
    filename: 'Admin_HopWeb_Updated_index.html',
    mimeType: 'text/html;charset=utf-8',
    labelBn: 'Admin Panel HopWeb HTML (Admin_HopWeb_Updated_index.html)',
  },
  'user-zip': {
    endpoint: '/api/download/user-zip',
    filename: 'Alpo_Pujir_Bebsha_User_Updated.zip',
    mimeType: 'application/zip',
    labelBn: 'Users Panel Updated ZIP (Alpo_Pujir_Bebsha_User_Updated.zip)',
  },
  'admin-zip': {
    endpoint: '/api/download/admin-zip',
    filename: 'Alpo_Pujir_Bebsha_Admin_Updated.zip',
    mimeType: 'application/zip',
    labelBn: 'Admin Panel Updated ZIP (Alpo_Pujir_Bebsha_Admin_Updated.zip)',
  },
};

const preloadedFiles: Partial<Record<DownloadTarget, File>> = {};
const preloadedBlobUrls: Partial<Record<DownloadTarget, string>> = {};
const preloadedHtmlText: Partial<Record<'user-html' | 'admin-html', string>> = {};
let preloadStarted = false;
const readyListeners: Array<() => void> = [];

export function preloadAllDownloadBundles(onReady?: () => void): void {
  if (typeof window === 'undefined') return;
  if (onReady) {
    readyListeners.push(onReady);
  }
  if (preloadStarted) {
    if (Object.keys(preloadedBlobUrls).length > 0 && onReady) {
      onReady();
    }
    return;
  }
  preloadStarted = true;

  const targets: DownloadTarget[] = [
    'user-html',
    'admin-html',
    'user-zip',
    'admin-zip',
  ];

  const cacheBuster = Date.now();

  Promise.all(
    targets.map(async (t) => {
      try {
        const info = TARGET_INFO[t];
        const res = await fetch(`${info.endpoint}?v=${cacheBuster}`, {
          credentials: 'include',
          cache: 'no-store',
        });
        if (!res.ok) return;
        const buf = await res.arrayBuffer();
        if (t === 'user-html' || t === 'admin-html') {
          try {
            preloadedHtmlText[t] = new TextDecoder('utf-8').decode(buf);
          } catch {}
        }
        // Use application/octet-stream for blob URL so mobile browsers always download instead of previewing
        const dlBlob = new Blob([buf], { type: 'application/octet-stream' });
        preloadedBlobUrls[t] = URL.createObjectURL(dlBlob);
        preloadedFiles[t] = new File([buf], info.filename, {
          type: info.mimeType,
        });
        readyListeners.forEach((cb) => {
          try {
            cb();
          } catch {}
        });
      } catch {}
    })
  );
}

export function getPreloadedBlobUrl(target: DownloadTarget): string | undefined {
  return preloadedBlobUrls[target];
}

export async function copyHopWebHtmlCode(
  target: 'user-html' | 'admin-html',
  onStatus?: (msg: string) => void
): Promise<boolean> {
  const notify = onStatus || (() => {});
  try {
    let text = preloadedHtmlText[target];
    if (!text) {
      const res = await fetch(`${TARGET_INFO[target].endpoint}?v=${Date.now()}`, {
        credentials: 'include',
        cache: 'no-store',
      });
      text = await res.text();
      preloadedHtmlText[target] = text;
    }
    await navigator.clipboard.writeText(text);
    notify(
      `✅ ${target === 'user-html' ? 'Users Panel' : 'Admin Panel'} এর সম্পূর্ণ HopWeb HTML কোড কপি হয়েছে! এখন HopWeb অ্যাপের index.html এ Paste করুন।`
    );
    return true;
  } catch {
    notify('⚠️ কপি করতে সমস্যা হয়েছে, সরাসরি ডাউনলোড বাটনে চাপুন।');
    return false;
  }
}

export function triggerReliableDownload(
  target: DownloadTarget,
  options?: {
    preferShare?: boolean;
    onStatus?: (msg: string) => void;
  }
): void {
  const info = TARGET_INFO[target];
  const notify = options?.onStatus || (() => {});
  const ts = Date.now();

  // 1. Synchronous Native Android Share / Save to Phone (0ms delay so user gesture is preserved)
  if (options?.preferShare) {
    const readyFile = preloadedFiles[target];
    const nav = navigator as Navigator & {
      canShare?: (data?: ShareData) => boolean;
    };
    if (
      readyFile &&
      nav.share &&
      (!nav.canShare || nav.canShare({ files: [readyFile] }))
    ) {
      nav
        .share({
          title: info.filename,
          text: info.labelBn,
          files: [readyFile],
        })
        .then(() => {
          notify(`✅ ${info.filename} সেভ/শেয়ার মেনুতে ওপেন হয়েছে!`);
        })
        .catch(() => {});
      return;
    }
  }

  // 2. Synchronous Preloaded Blob URL click (exactly how earlier working downloads succeeded)
  const readyBlobUrl = preloadedBlobUrls[target];
  if (readyBlobUrl) {
    const a = document.createElement('a');
    a.href = readyBlobUrl;
    a.download = info.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    notify(`✅ আপডেটেড ${info.filename} ডাউনলোড শুরু হয়েছে!`);
    return;
  }

  // 3. Fallback if clicked before preload finishes: fetch blob and trigger download
  notify(`⏳ ${info.filename} প্রস্তুত হচ্ছে...`);
  fetch(`${info.endpoint}?dl=1&v=${ts}`, {
    credentials: 'include',
    cache: 'no-store',
  })
    .then((res) => res.arrayBuffer())
    .then((buf) => {
      const dlBlob = new Blob([buf], { type: 'application/octet-stream' });
      const blobUrl = URL.createObjectURL(dlBlob);
      preloadedBlobUrls[target] = blobUrl;
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = info.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      notify(`✅ আপডেটেড ${info.filename} ডাউনলোড সম্পন্ন!`);
    })
    .catch(() => {
      window.location.href = `${info.endpoint}?dl=1&v=${ts}`;
    });
}

export function getChromeIntentUrl(path = '/download'): string {
  if (typeof window === 'undefined') return path;
  const host = window.location.host;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `intent://${host}${cleanPath}#Intent;scheme=https;package=com.android.chrome;end`;
}
