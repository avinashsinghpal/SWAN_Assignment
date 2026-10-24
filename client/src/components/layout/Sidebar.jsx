import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Kbd } from '../ui/Kbd.jsx';
import { Tooltip } from '../ui/Tooltip.jsx';
import { Search, PanelLeftClose, PanelLeftOpen, LogOut } from 'lucide-react';
import { cn } from '../../lib/cn.js';

export function Sidebar({ collapsed, onToggleCollapse, onOpenSearch }) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { to: '/dashboard', num: '01', label: 'Dashboard' },
    { to: '/leads', num: '02', label: 'Leads' },
    ...(isAdmin ? [{ to: '/users', num: '03', label: 'Users' }] : []),
    { to: '/settings', num: '04', label: 'Settings' },
  ];

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col justify-between fixed top-0 bottom-0 left-0 bg-[#030303] border-r border-[#222222]/40 z-30 transition-[width] duration-200 select-none font-mono',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* ── Top Area ──────────────────────────────────────────────── */}
      <div className="flex flex-col">
        {/* Wordmark Header */}
        <div className="h-16 px-5 border-b border-[#222222]/40 flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 bg-[#FE6A00] shrink-0" />
              <span className="font-display text-2xl tracking-wider text-[#EEEEEE] leading-none">
                SWAN
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#717171] border-l border-[#222222] pl-2.5">
                LEADS
              </span>
            </div>
          ) : (
            <div className="mx-auto">
              <span className="w-2.5 h-2.5 bg-[#FE6A00] block" />
            </div>
          )}

          <button
            type="button"
            onClick={onToggleCollapse}
            className="text-[#717171] hover:text-[#EEEEEE] p-1.5 border border-transparent hover:border-[#222222] transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
          </button>
        </div>

        {/* Search Trigger */}
        <div className="p-3 border-b border-[#222222]/30">
          {!collapsed ? (
            <button
              type="button"
              onClick={onOpenSearch}
              className="w-full h-10 px-3 bg-[#060606] border border-[#222222] hover:border-[#FE6A00]/60 flex items-center justify-between text-xs text-[#717171] hover:text-[#EEEEEE] transition-colors group"
            >
              <span className="inline-flex items-center gap-2">
                <Search size={14} className="group-hover:text-[#FE6A00] transition-colors" />
                <span className="uppercase tracking-wider text-[11px]">Search</span>
              </span>
              <Kbd>Ctrl K</Kbd>
            </button>
          ) : (
            <Tooltip content="Search (Ctrl K)" side="right">
              <button
                type="button"
                onClick={onOpenSearch}
                className="w-full h-10 flex items-center justify-center bg-[#060606] border border-[#222222] hover:border-[#FE6A00] text-[#717171] hover:text-[#FE6A00] transition-colors"
                aria-label="Search"
              >
                <Search size={15} />
              </button>
            </Tooltip>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            if (collapsed) {
              return (
                <Tooltip key={item.to} content={`${item.num} ${item.label}`} side="right">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        'w-full h-11 flex items-center justify-center relative transition-colors',
                        isActive
                          ? 'bg-[#121212] text-[#FE6A00]'
                          : 'text-[#717171] hover:text-[#EEEEEE] hover:bg-[#060606]'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#FE6A00]" />
                        )}
                        <span
                          className={cn(
                            'w-2 h-2 transition-transform',
                            isActive ? 'bg-[#FE6A00] scale-125' : 'bg-[#717171] hover:bg-[#EEEEEE]'
                          )}
                        />
                      </>
                    )}
                  </NavLink>
                </Tooltip>
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center justify-between px-3.5 py-3 text-[11px] uppercase tracking-widest font-mono transition-colors',
                    isActive
                      ? 'text-[#FE6A00] bg-[#121212]'
                      : 'text-[#717171] hover:text-[#EEEEEE] hover:bg-[#060606]'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Left 1px accent bar when active */}
                    {isActive && (
                      <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#FE6A00]" />
                    )}

                    <span className="flex items-center gap-3">
                      <span className={cn('text-[10px]', isActive ? 'text-[#FE6A00]' : 'text-[#717171]')}>
                        {item.num}
                      </span>
                      <span>{item.label}</span>
                    </span>

                    {/* Small accent square marker when active */}
                    {isActive && <span className="w-1.5 h-1.5 bg-[#FE6A00]" />}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* ── Bottom User Block ─────────────────────────────────────── */}
      <div className="p-3 border-t border-[#222222]/40 bg-[#020202]">
        {!collapsed ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Square initial tile */}
              <div className="w-9 h-9 border border-[#222222] bg-[#060606] flex items-center justify-center font-display text-lg text-[#FE6A00] shrink-0">
                {initial}
              </div>

              <div className="min-w-0">
                <p className="text-xs text-[#EEEEEE] font-medium truncate">
                  {user?.name || 'Operator'}
                </p>
                <p className="text-[10px] text-[#8A8A8A] uppercase tracking-widest">
                  {user?.role || 'SALES'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="text-[10px] uppercase tracking-wider text-[#717171] hover:text-[#F2554F] transition-colors p-1"
              aria-label="Log out"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <Tooltip content={`${user?.name || 'User'} (${user?.role || 'SALES'}) - Log Out`} side="right">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full h-10 border border-[#222222] bg-[#060606] flex items-center justify-center font-display text-lg text-[#FE6A00] hover:border-[#E7000B] hover:text-[#F2554F] transition-colors"
              aria-label="Log out"
            >
              {initial}
            </button>
          </Tooltip>
        )}
      </div>
    </aside>
  );
}
