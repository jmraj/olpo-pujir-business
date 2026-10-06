import React, { useState } from 'react';
import UserApp from './UserApp';
import AdminApp from './AdminApp';

export default function App() {
  const buildTarget = import.meta.env.VITE_APP_TARGET as
    | 'user'
    | 'admin'
    | undefined;

  const isUrlAdminRoute = () => {
    if (typeof window === 'undefined') return false;
    const p = window.location.pathname.toLowerCase();
    const s = window.location.search.toLowerCase();
    return (
      p === '/admin' ||
      p.startsWith('/admin/') ||
      p.endsWith('/admin.html') ||
      s.includes('app=admin')
    );
  };

  const [previewTarget, setPreviewTarget] = useState<'user' | 'admin'>(() => {
    if (buildTarget === 'admin') return 'admin';
    if (buildTarget === 'user') return 'user';
    return isUrlAdminRoute() ? 'admin' : 'user';
  });

  // 1. Dedicated User App Production Build (100% Customer/User Panel only)
  if (buildTarget === 'user') {
    return <UserApp />;
  }

  // 2. Dedicated Admin App Production Build (100% Admin Login & Admin Panel only)
  if (buildTarget === 'admin') {
    return <AdminApp />;
  }

  // 3. Multi-entry Workspace Routing (/ renders UserApp; /admin renders AdminApp)
  if (previewTarget === 'admin') {
    return (
      <AdminApp
        onExitToUserPreview={() => {
          try {
            window.history.replaceState({}, '', '/');
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
          window.history.replaceState({}, '', '/admin');
        } catch {}
        setPreviewTarget('admin');
      }}
    />
  );
}
