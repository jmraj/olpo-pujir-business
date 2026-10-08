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
  'user-zip': {
    endpoint: '/api/download/user-zip',
    filename: 'Alpo_Pujir_Bebsha_User_App.zip',
    mimeType: 'application/zip',
    labelBn: 'User App ZIP (Alpo_Pujir_Bebsha_User_App.zip)',
  },
  'admin-zip': {
    endpoint: '/api/download/admin-zip',
    filename: 'Alpo_Pujir_Bebsha_Admin_App.zip',
    mimeType: 'application/zip',
    labelBn: 'Admin App ZIP (Alpo_Pujir_Bebsha_Admin_App.zip)',
  },
  'user-html': {
    endpoint: '/api/download/user-app',
    filename: 'Alpo_Pujir_Bebsha_User_App.html',
    mimeType: 'text/html',
    labelBn: 'User App HTML (Alpo_Pujir_Bebsha_User_App.html)',
  },
  'admin-html': {
    endpoint: '/api/download/admin-app',
    filename: 'Alpo_Pujir_Bebsha_Admin_App.html',
    mimeType: 'text/html',
    labelBn: 'Admin App HTML (Alpo_Pujir_Bebsha_Admin_App.html)',
  },
};

// Pre-loaded File & Blob URL cache so clicks are 100% synchronous (never loses user gesture!)
const preloadedFiles: Partial<Record<DownloadTarget, File>> = {};
const preloadedBlobUrls: Partial<Record<DownloadTarget, string>> = {};
let preloadStarted = false;

export function preloadAllDownloadBundles(onReady?: () => void): void {
  if (typeof window === 'undefined' || preloadStarted) return;
  preloadStarted = true;

  const targets: DownloadTarget[] = [
    'user-zip',
    'admin-zip',
    'user-html',
    'admin-html',
  ];

  Promise.all(
    targets.map(async (t) => {
      try {
        const info = TARGET_INFO[t];
        const res = await fetch(info.endpoint, { credentials: 'include' });
        if (!res.ok) return;
        const buf = await res.arrayBuffer();
        const blob = new Blob([buf], { type: info.mimeType });
        preloadedBlobUrls[t] = URL.createObjectURL(blob);
        preloadedFiles[t] = new File([buf], info.filename, {
          type: info.mimeType,
        });
      } catch {}
    })
  ).then(() => {
    if (onReady) onReady();
  });
}

export function getPreloadedBlobUrl(target: DownloadTarget): string | undefined {
  return preloadedBlobUrls[target];
}

/**
 * Synchronously triggers download or native Android share without losing user activation!
 */
export function triggerReliableDownload(
  target: DownloadTarget,
  options?: {
    preferShare?: boolean;
    onStatus?: (msg: string) => void;
  }
): void {
  const info = TARGET_INFO[target];
  const notify = options?.onStatus || (() => {});

  // 1. Synchronous Native Android Share / Save to Phone (must run BEFORE any await!)
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

  // 2. Synchronous Preloaded Blob URL click (0ms delay = keeps 100% user gesture)
  const readyBlobUrl = preloadedBlobUrls[target];
  if (readyBlobUrl) {
    const a = document.createElement('a');
    a.href = readyBlobUrl;
    a.download = info.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // 3. Synchronous Direct HTTP Attachment Anchor + Hidden Iframe (for Android DownloadManager)
  try {
    const iframeId = `__dl_frame_${target}`;
    const existing = document.getElementById(iframeId);
    if (existing) existing.remove();
    const iframe = document.createElement('iframe');
    iframe.id = iframeId;
    iframe.style.display = 'none';
    iframe.src = `${info.endpoint}?dl=1&t=${Date.now()}`;
    document.body.appendChild(iframe);
  } catch {}

  if (!readyBlobUrl) {
    const a = document.createElement('a');
    a.href = `${info.endpoint}?dl=1`;
    a.download = info.filename;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  notify(`✅ ${info.filename} ডাউনলোড শুরু হয়েছে!`);
}

export function getChromeIntentUrl(path = '/#download'): string {
  if (typeof window === 'undefined') return path;
  const host = window.location.host;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `intent://${host}${cleanPath}#Intent;scheme=https;package=com.android.chrome;end`;
}
