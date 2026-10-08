import React, { useState, useEffect } from 'react';
import UserApp from './UserApp';
import AdminApp from './AdminApp';

type RouteMode = 'user' | 'admin';

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

  // 1. Dedicated User App Production Build (100% Customer/User Panel only)
  if (buildTarget === 'user') {
    return <UserApp />;
  }

  // 2. Dedicated Admin App Production Build (100% Admin Login & Admin Panel only)
  if (buildTarget === 'admin') {
    return <AdminApp />;
  }

  // 3. Clean routing without any download page or top bar
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
