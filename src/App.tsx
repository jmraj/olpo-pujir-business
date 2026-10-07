import React, { useState, useEffect } from 'react';
import UserApp from './UserApp';
import AdminApp from './AdminApp';
import {
  triggerReliableDownload,
  getChromeIntentUrl,
} from './utils/downloadAppBundle';

type RouteMode = 'user' | 'admin' | 'download';

export default function App() {
  const buildTarget = import.meta.env.VITE_APP_TARGET as
    | 'user'
    | 'admin'
    | undefined;

  const getRouteMode = (): RouteMode => {
    if (typeof window === 'undefined') return 'user';
    const p = window.location.pathname.toLowerCase();
    const s = window.location.search.toLowerCase();
    const h = window.location.hash.toLowerCase();
    if (
      p === '/download' ||
      p.startsWith('/download/') ||
      h.includes('download') ||
      s.includes('download=')
    ) {
      return 'download';
    }
    if (
      p === '/admin' ||
      p.startsWith('/admin/') ||
      p.endsWith('/admin.html') ||
      s.includes('app=admin') ||
      h.includes('admin')
    ) {
      return 'admin';
    }
    return 'user';
  };

  const [previewTarget, setPreviewTarget] = useState<RouteMode>(() => {
    if (buildTarget === 'admin') return 'admin';
    if (buildTarget === 'user') return 'user';
    return getRouteMode();
  });

  const [dlStatus, setDlStatus] = useState<string | null>(null);

  useEffect(() => {
    const onHashChange = () => {
      if (!buildTarget) {
        setPreviewTarget(getRouteMode());
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [buildTarget]);

  useEffect(() => {
    if (previewTarget !== 'download') return;
    const h = window.location.hash.toLowerCase();
    const p = window.location.pathname.toLowerCase();
    const s = window.location.search.toLowerCase();
    if (
      h.includes('download-user') ||
      p.endsWith('/download/user') ||
      s.includes('download=user')
    ) {
      triggerReliableDownload('user-zip', { onStatus: setDlStatus });
    } else if (
      h.includes('download-admin') ||
      p.endsWith('/download/admin') ||
      s.includes('download=admin')
    ) {
      triggerReliableDownload('admin-zip', { onStatus: setDlStatus });
    }
  }, [previewTarget]);

  // 1. Dedicated User App Production Build (100% Customer/User Panel only)
  if (buildTarget === 'user') {
    return <UserApp />;
  }

  // 2. Dedicated Admin App Production Build (100% Admin Login & Admin Panel only)
  if (buildTarget === 'admin') {
    return <AdminApp />;
  }

  // 3. Dedicated Direct Download Link Page (#download / /download / ?download=1)
  if (previewTarget === 'download') {
    return (
      <div className="min-h-screen bg-[#022C22] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white text-slate-900 rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-[#D4AF37] space-y-4">
          <div>
            <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-100 text-[#064E3B] text-xs font-extrabold">
              📲 অফিসিয়াল ডাউনলোড পোর্টাল (Updated Build)
            </span>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
              অল্প পুঁজির ব্যবসা — User ও Admin ফাইল ডাউনলোড
            </h1>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              নিচের যেকোনো বাটনে ট্যাপ করলেই ডাউনলোড হবে। ফোনে সরাসরি ব্রাউজার ডাউনলোড ব্লক থাকলে{' '}
              <strong>&ldquo;📲 ফোনে সেভ / শেয়ার&rdquo;</strong> বা{' '}
              <strong>&ldquo;🌐 Chrome-এ ওপেন&rdquo;</strong> বাটনে চাপুন:
            </p>
          </div>

          {dlStatus && (
            <div className="p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-[#064E3B] text-xs font-extrabold text-center">
              {dlStatus}
            </div>
          )}

          {/* 1. USER APP SECTION */}
          <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-2">
            <div className="text-xs font-extrabold text-[#064E3B]">
              ১. User App (গ্রাহক ও উদ্যোক্তাদের আপডেটেড ফাইল)
            </div>
            <button
              type="button"
              onClick={() =>
                triggerReliableDownload('user-zip', { onStatus: setDlStatus })
              }
              className="block w-full py-3 px-4 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-center text-xs font-extrabold shadow cursor-pointer"
            >
              📥 User App ZIP ডাউনলোড (Alpo_Pujir_Bebsha_User_App.zip)
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  triggerReliableDownload('user-zip', {
                    preferShare: true,
                    onStatus: setDlStatus,
                  })
                }
                className="py-2.5 px-3 rounded-xl bg-emerald-700 text-white text-center text-[11px] font-extrabold cursor-pointer"
              >
                📲 ফোনে সেভ / শেয়ার (.zip)
              </button>
              <button
                type="button"
                onClick={() =>
                  triggerReliableDownload('user-html', {
                    onStatus: setDlStatus,
                  })
                }
                className="py-2.5 px-3 rounded-xl bg-white border border-emerald-400 text-[#064E3B] text-center text-[11px] font-extrabold cursor-pointer"
              >
                📱 সিঙ্গেল ফাইল (.html)
              </button>
            </div>
          </div>

          {/* 2. ADMIN APP SECTION */}
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-2">
            <div className="text-xs font-extrabold text-amber-950">
              ২. Admin Panel App (অ্যাডমিন কন্ট্রোল আপডেটেড ফাইল)
            </div>
            <button
              type="button"
              onClick={() =>
                triggerReliableDownload('admin-zip', { onStatus: setDlStatus })
              }
              className="block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 text-center text-xs font-extrabold shadow cursor-pointer"
            >
              📥 Admin App ZIP ডাউনলোড (Alpo_Pujir_Bebsha_Admin_App.zip)
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  triggerReliableDownload('admin-zip', {
                    preferShare: true,
                    onStatus: setDlStatus,
                  })
                }
                className="py-2.5 px-3 rounded-xl bg-amber-700 text-white text-center text-[11px] font-extrabold cursor-pointer"
              >
                📲 ফোনে সেভ / শেয়ার (.zip)
              </button>
              <button
                type="button"
                onClick={() =>
                  triggerReliableDownload('admin-html', {
                    onStatus: setDlStatus,
                  })
                }
                className="py-2.5 px-3 rounded-xl bg-white border border-amber-400 text-amber-950 text-center text-[11px] font-extrabold cursor-pointer"
              >
                🔐 সিঙ্গেল ফাইল (.html)
              </button>
            </div>
          </div>

          {/* External Chrome Breakout for Android WebView */}
          <a
            href={getChromeIntentUrl('/download')}
            className="block w-full py-2.5 px-4 rounded-xl bg-blue-600 text-white text-center text-xs font-extrabold no-underline shadow"
          >
            🌐 সরাসরি Google Chrome ব্রাউজারে ওপেন করে ডাউনলোড করুন
          </a>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                try {
                  window.location.hash = '';
                } catch {}
                setPreviewTarget('user');
              }}
              className="py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-extrabold cursor-pointer"
            >
              ← User App দেখুন
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  window.location.hash = 'admin';
                } catch {}
                setPreviewTarget('admin');
              }}
              className="py-2.5 rounded-xl bg-slate-900 text-[#FDE68A] text-xs font-extrabold cursor-pointer"
            >
              Admin Panel →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Preview Quick-Download Bar (ONLY in AI Studio Workspace Preview, 100% excluded from built User/Admin apps)
  const previewDownloadBanner = (
    <div className="bg-[#022C22] border-b border-[#D4AF37]/60 px-3 py-2 text-white flex flex-wrap items-center justify-between gap-2 z-50">
      <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#FDE68A]">
        <span>📲 আপডেটেড ফাইল ডাউনলোড:</span>
        {dlStatus && (
          <span className="text-emerald-300 font-bold">({dlStatus})</span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() =>
            triggerReliableDownload('user-zip', { onStatus: setDlStatus })
          }
          className="px-2.5 py-1 rounded-lg bg-[#059669] hover:bg-emerald-500 text-white text-[11px] font-extrabold cursor-pointer shadow-2xs"
        >
          📥 User ZIP
        </button>
        <button
          type="button"
          onClick={() =>
            triggerReliableDownload('admin-zip', { onStatus: setDlStatus })
          }
          className="px-2.5 py-1 rounded-lg bg-[#D4AF37] hover:bg-amber-400 text-slate-950 text-[11px] font-extrabold cursor-pointer shadow-2xs"
        >
          📥 Admin ZIP
        </button>
        <button
          type="button"
          onClick={() => {
            try {
              window.location.hash = 'download';
            } catch {}
            setPreviewTarget('download');
          }}
          className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-extrabold cursor-pointer"
        >
          📲 সব ডাউনলোড অপশন
        </button>
      </div>
    </div>
  );

  if (previewTarget === 'admin') {
    return (
      <>
        {previewDownloadBanner}
        <AdminApp
          onExitToUserPreview={() => {
            try {
              window.location.hash = '';
            } catch {}
            setPreviewTarget('user');
          }}
        />
      </>
    );
  }

  return (
    <>
      {previewDownloadBanner}
      <UserApp
        onOpenSeparateAdminApp={() => {
          try {
            window.location.hash = 'admin';
          } catch {}
          setPreviewTarget('admin');
        }}
      />
    </>
  );
}
