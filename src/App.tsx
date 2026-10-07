import React, { useState, useEffect } from 'react';
import UserApp from './UserApp';
import AdminApp from './AdminApp';

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
    if (h.includes('download') || s.includes('download=')) {
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
    if (h.includes('download-user')) {
      const a = document.createElement('a');
      a.href = '/api/download/user-zip';
      a.download = 'Alpo_Pujir_Bebsha_User_App.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (h.includes('download-admin')) {
      const a = document.createElement('a');
      a.href = '/api/download/admin-zip';
      a.download = 'Alpo_Pujir_Bebsha_Admin_App.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
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

  // 3. Dedicated Direct Download Link Page (#download / #download-user / #download-admin)
  if (previewTarget === 'download') {
    return (
      <div className="min-h-screen bg-[#022C22] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white text-slate-900 rounded-3xl p-6 shadow-2xl border-2 border-[#D4AF37] space-y-4">
          <div>
            <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-100 text-[#064E3B] text-xs font-extrabold">
              📲 অফিসিয়াল ডাউনলোড পোর্টাল
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 mt-1">
              অল্প পুঁজির ব্যবসা — APK ও App ডাউনলোড
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              যেকোনো বাটনে ট্যাপ করলেই সাথে সাথে ডাউনলোড শুরু হবে:
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-2">
            <div className="text-xs font-extrabold text-[#064E3B]">
              ১. User App (গ্রাহক ও উদ্যোক্তাদের অ্যাপ)
            </div>
            <a
              href="/api/download/user-zip"
              download="Alpo_Pujir_Bebsha_User_App.zip"
              className="block w-full py-3 px-4 rounded-xl bg-[#064E3B] text-white text-center text-xs font-extrabold no-underline shadow"
            >
              📥 User App ZIP ডাউনলোড (Alpo_Pujir_Bebsha_User_App.zip)
            </a>
            <a
              href="/api/download/user-app"
              download="Alpo_Pujir_Bebsha_User_App.html"
              className="block w-full py-2.5 px-4 rounded-xl bg-white border border-emerald-400 text-[#064E3B] text-center text-xs font-extrabold no-underline"
            >
              📱 User App সিঙ্গেল ফাইল ডাউনলোড (.html)
            </a>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-2">
            <div className="text-xs font-extrabold text-amber-950">
              ২. Admin Panel App (অ্যাডমিন কন্ট্রোল অ্যাপ)
            </div>
            <a
              href="/api/download/admin-zip"
              download="Alpo_Pujir_Bebsha_Admin_App.zip"
              className="block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 text-center text-xs font-extrabold no-underline shadow"
            >
              📥 Admin App ZIP ডাউনলোড (Alpo_Pujir_Bebsha_Admin_App.zip)
            </a>
            <a
              href="/api/download/admin-app"
              download="Alpo_Pujir_Bebsha_Admin_App.html"
              className="block w-full py-2.5 px-4 rounded-xl bg-white border border-amber-400 text-amber-950 text-center text-xs font-extrabold no-underline"
            >
              🔐 Admin App সিঙ্গেল ফাইল ডাউনলোড (.html)
            </a>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                window.location.hash = '';
                setPreviewTarget('user');
              }}
              className="py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-extrabold cursor-pointer"
            >
              ← User App দেখুন
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.hash = 'admin';
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

  // 4. Clean routing without any top bar on the User App
  if (previewTarget === 'admin') {
    return (
      <AdminApp
        onExitToUserPreview={() => {
          try {
            window.location.hash = '';
          } catch {}
          setPreviewTarget('user');
        }}
      />
    );
  }

  return (
    <UserApp
      onOpenSeparateAdminApp={() => {
        try {
          window.location.hash = 'admin';
        } catch {}
        setPreviewTarget('admin');
      }}
    />
  );
}
