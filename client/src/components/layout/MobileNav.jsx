import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Menu, X, LogOut, Search } from 'lucide-react';
import { cn } from '../../lib/cn.js';

export function MobileNav({ onOpenSearch }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { to: '/dashboard', num: '01', label: 'DASHBOARD' },
    { to: '/leads', num: '02', label: 'LEADS' },
    ...(isAdmin ? [{ to: '/users', num: '03', label: 'TEAM & USERS' }] : []),
    { to: '/settings', num: '04', label: 'SETTINGS' },
  ];

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <>
      {/* 56px Fixed Slim Top Bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#030303] border-b border-[#222222]/60 z-40 px-4 flex items-center justify-between font-mono">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 bg-[#FE6A00]" />
          <span className="font-display text-2xl tracking-wider text-[#EEEEEE] leading-none">
            SWAN
          </span>
          <span className="text-[10px] uppercase tracking-widest text-[#717171] border-l border-[#222222] pl-2">
            LEADS
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-11 h-11 flex items-center justify-center border border-[#222222] text-[#717171] hover:text-[#EEEEEE] hover:border-[#FE6A00]"
            aria-label="Search"
          >
            <Search size={16} />
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-11 h-11 flex items-center justify-center border border-[#222222] text-[#EEEEEE] hover:border-[#FE6A00]"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* Full-Screen Overlay Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#020202] flex flex-col justify-between p-6 animate-in fade-in duration-200 font-mono">
          {/* Top close bar */}
          <div className="flex items-center justify-between border-b border-[#222222]/60 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 bg-[#FE6A00]" />
              <span className="font-display text-2xl tracking-wider text-[#EEEEEE]">
                SWAN
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-11 h-11 flex items-center justify-center border border-[#222222] text-[#717171] hover:text-[#EEEEEE] hover:border-[#FE6A00]"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Staggered large Bebas links */}
          <nav className="my-auto space-y-4 py-8" aria-label="Mobile Navigation">
            {navItems.map((item, idx) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-baseline gap-4 py-3 min-h-[44px] transition-colors',
                    isActive ? 'text-[#FE6A00]' : 'text-[#EEEEEE] hover:text-[#FE6A00]'
                  )
                }
                style={{
                  animation: `slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards ${idx * 0.06}s`,
                }}
              >
                <span className="text-xs text-[#717171] tracking-widest">{item.num}</span>
                <span className="font-display text-4xl sm:text-5xl uppercase tracking-wide">
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>

          {/* Bottom user block + Log out */}
          <div className="border-t border-[#222222]/60 pt-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 border border-[#222222] bg-[#060606] flex items-center justify-center font-display text-xl text-[#FE6A00]">
                {initial}
              </div>
              <div>
                <p className="text-sm text-[#EEEEEE] font-medium">{user?.name}</p>
                <p className="text-[10px] text-[#8A8A8A] uppercase tracking-widest">{user?.role}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="h-11 px-4 border border-[#222222] text-xs uppercase tracking-wider text-[#F2554F] hover:bg-[#E7000B] hover:text-[#020202] transition-colors inline-flex items-center gap-2"
            >
              <LogOut size={14} /> Log out
            </button>
          </div>
        </div>
      )}
    </>
  );
}
