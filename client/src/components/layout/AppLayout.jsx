import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { MobileNav } from './MobileNav.jsx';
import { CommandPalette } from './CommandPalette.jsx';
import { cn } from '../../lib/cn.js';

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('swan_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('swan_sidebar_collapsed', String(next));
      } catch {
        // ignore local storage error
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#020202] text-[#EEEEEE] font-mono relative selection:bg-[#FE6A00] selection:text-[#020202]">
      {/* Fixed grid background & noise */}
      <div className="app-grid-bg" aria-hidden="true" />
      <div className="app-noise-overlay" aria-hidden="true" />

      {/* Desktop fixed sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
        onOpenSearch={() => setCommandPaletteOpen(true)}
      />

      {/* Mobile slim topbar and menu */}
      <MobileNav onOpenSearch={() => setCommandPaletteOpen(true)} />

      {/* Global Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          'min-h-screen flex flex-col transition-[margin-left] duration-200 relative z-10 pt-14 md:pt-0',
          collapsed ? 'md:ml-20' : 'md:ml-64'
        )}
      >
        <main className="flex-1 px-6 md:px-10 py-10 max-w-[1400px] w-full">
          <Outlet context={{ openCommandPalette: () => setCommandPaletteOpen(true) }} />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
