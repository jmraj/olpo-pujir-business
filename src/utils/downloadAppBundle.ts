export type DownloadTarget = 'user-zip' | 'admin-zip' | 'user-html' | 'admin-html';

const TARGET_INFO: Record<
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

/**
 * Triggers a multi-strategy download that works across:
 * 1. Desktop browsers (Blob download + direct anchor)
 * 2. Android Chrome / Mobile browsers (Direct HTTP Content-Disposition attachment via hidden iframe & anchor)
 * 3. Android WebView / Sandboxed Iframes (Web Share API Level 2 native file save/share fallback)
 */
export async function triggerReliableDownload(
  target: DownloadTarget,
  options?: {
    preferShare?: boolean;
    onStatus?: (msg: string) => void;
  }
): Promise<void> {
  const info = TARGET_INFO[target];
  const notify = options?.onStatus || (() => {});

  notify(`⏳ ${info.labelBn} প্রস্তুত হচ্ছে...`);

  // If user explicitly tapped "Save/Share to Phone" (native Android sheet)
  if (options?.preferShare) {
    try {
      const res = await fetch(`${info.endpoint}?t=${Date.now()}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Download fetch failed');
      const buf = await res.arrayBuffer();
      const file = new File([buf], info.filename, { type: info.mimeType });
      const nav = navigator as Navigator & {
        canShare?: (data?: ShareData) => boolean;
      };
      if (nav.share && (!nav.canShare || nav.canShare({ files: [file] }))) {
        await nav.share({
          title: info.filename,
          text: info.labelBn,
          files: [file],
        });
        notify(`✅ ${info.filename} সফলভাবে শেয়ার/সেভ মেনুতে ওপেন হয়েছে!`);
        return;
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        notify('শেয়ার মেনু বন্ধ করা হয়েছে।');
        return;
      }
    }
  }

  // Strategy 1: Hidden iframe with direct HTTP attachment URL (triggers Android native DownloadManager without leaving page)
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

  // Strategy 2: Fetch Blob + ObjectURL anchor click (reliable on desktop and modern mobile browsers with allow-downloads)
  try {
    const res = await fetch(`${info.endpoint}?t=${Date.now()}`, {
      credentials: 'include',
    });
    if (res.ok) {
      const buf = await res.arrayBuffer();
      const blob = new Blob([buf], { type: info.mimeType });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = info.filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
      notify(
        `✅ ${info.filename} ডাউনলোড শুরু হয়েছে! (ডাউনলোড না হলে পাশের "📲 ফোনে সেভ/শেয়ার" বাটনে চাপুন)`
      );
      return;
    }
  } catch {}

  // Strategy 3: Direct anchor fallback
  const a = document.createElement('a');
  a.href = `${info.endpoint}?dl=1&t=${Date.now()}`;
  a.download = info.filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  notify(`✅ ${info.filename} ডাউনলোড শুরু হয়েছে!`);
}

export function getChromeIntentUrl(path = '/download'): string {
  if (typeof window === 'undefined') return path;
  const host = window.location.host;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `intent://${host}${cleanPath}#Intent;scheme=https;package=com.android.chrome;end`;
}
