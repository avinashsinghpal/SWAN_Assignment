/**
 * AppLayout - the main authenticated app shell.
 * Desktop: fixed sidebar + content area with topbar.
 * Mobile: topbar + slide-in sidebar.
 *
 * Uses useLocation to derive the page title automatically.
 */

import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { TopBar } from './TopBar.jsx';

const TITLES = {
  '/dashboard': 'Dashboard',
  '/leads': 'Leads',
  '/settings': 'Settings',
  '/users': 'Users',
};

function getTitle(pathname) {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith('/leads/')) return 'Lead Detail';
  return 'Swan LMS';
}

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const title = getTitle(pathname);

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] dark:bg-[var(--color-dark-canvas)]">
      {/* Desktop sidebar */}
      <Sidebar
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="lg:pl-[240px] flex flex-col min-h-screen">
        <TopBar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
