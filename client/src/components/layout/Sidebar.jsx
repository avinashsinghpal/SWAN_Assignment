/**
 * Sidebar navigation component.
 * Desktop: fixed left column. Mobile: slide-in drawer.
 */

import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users2,
  Settings,
  LogOut,
  ChevronRight,
  BarChart3,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { cn } from '../../lib/cn.js';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/leads', label: 'Leads', icon: BarChart3 },
];

const ADMIN_NAV_ITEMS = [
  { to: '/users', label: 'Users', icon: Users2 },
];

const BOTTOM_NAV_ITEMS = [
  { to: '/settings', label: 'Settings', icon: Settings },
];

/**
 * @param {object} props
 * @param {boolean} [props.mobileOpen]
 * @param {function} [props.onMobileClose]
 */
export function Sidebar({ mobileOpen = false, onMobileClose }) {
  const { user, isAdmin, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast({ title: 'Signed out', message: 'You have been signed out.', variant: 'info' });
    navigate('/login');
  };

  const content = (
    <div className="h-full flex flex-col bg-white dark:bg-[var(--color-dark-card)] border-r border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
      {/* Logo */}
      <div className="flex items-center justify-between h-14 px-5 border-b border-[var(--color-border)] dark:border-[var(--color-dark-border)] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-teal-700 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 10 C2 6, 5 2, 7 2 C9 2, 12 6, 12 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <path d="M7 2 L7 10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-semibold text-sm text-[var(--color-ink)] dark:text-[var(--color-dark-ink)] tracking-tight">
            Swan LMS
          </span>
        </div>
        {/* Mobile close button */}
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="lg:hidden text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)] p-1 rounded"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <SidebarLink key={item.to} {...item} onClick={onMobileClose} />
        ))}

        {isAdmin && ADMIN_NAV_ITEMS.length > 0 && (
          <>
            <div className="pt-4 pb-1 px-2">
              <p className="text-xs font-medium text-[var(--color-ink-subtle)] dark:text-[var(--color-dark-ink-subtle)] uppercase tracking-wider">
                Admin
              </p>
            </div>
            {ADMIN_NAV_ITEMS.map((item) => (
              <SidebarLink key={item.to} {...item} onClick={onMobileClose} />
            ))}
          </>
        )}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-3 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)] space-y-0.5">
        {BOTTOM_NAV_ITEMS.map((item) => (
          <SidebarLink key={item.to} {...item} onClick={onMobileClose} />
        ))}

        {/* User menu */}
        <div className="flex items-center gap-3 px-3 py-2 mt-1">
          <div className="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[var(--color-ink)] dark:text-[var(--color-dark-ink)] truncate">
              {user?.name}
            </p>
            <p className="text-xs text-[var(--color-ink-subtle)] dark:text-[var(--color-dark-ink-subtle)] truncate">
              {user?.role}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-[var(--color-ink-subtle)] hover:text-red-500 transition-colors p-1 rounded"
            aria-label="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:block fixed left-0 top-0 bottom-0 w-[240px] z-30"
        aria-label="Sidebar"
      >
        {content}
      </aside>

      {/* Mobile overlay + drawer */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 z-40 transition-opacity duration-200',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onMobileClose}
          aria-hidden="true"
        />
        <aside
          className={cn(
            'absolute left-0 top-0 bottom-0 w-64 transition-transform duration-200',
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {content}
        </aside>
      </div>
    </>
  );
}

function SidebarLink({ to, label, icon: Icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
          isActive
            ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400'
            : 'text-[var(--color-ink-muted)] dark:text-[var(--color-dark-ink-muted)] hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-dark-border)] hover:text-[var(--color-ink)] dark:hover:text-[var(--color-dark-ink)]'
        )
      }
    >
      <Icon size={16} strokeWidth={1.75} />
      <span className="flex-1">{label}</span>
    </NavLink>
  );
}
