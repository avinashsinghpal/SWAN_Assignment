/**
 * SettingsPage component.
 * Allows users to inspect their profile, switch themes, and check system status.
 */

import { Moon, Sun, Monitor, User, Shield, CheckCircle, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { cn } from '../lib/cn.js';

export function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-4xl space-y-6 pb-8">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[var(--color-ink)] dark:text-[var(--color-dark-ink)]">
          System & Account Settings
        </h1>
        <p className="text-xs text-[var(--color-ink-subtle)] dark:text-[var(--color-dark-ink-subtle)] mt-0.5">
          Manage your personal workspace preferences and view system specifications.
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={16} className="text-teal-600" /> User Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-xl font-bold text-teal-700 dark:text-teal-300">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-ink)] dark:text-[var(--color-dark-ink)]">
                {user?.name}
              </p>
              <p className="text-xs text-[var(--color-ink-subtle)]">{user?.email}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                {user?.role === 'ADMIN' ? 'Full Administrator' : 'Sales Representative'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Preference */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance & Theme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-[var(--color-ink-subtle)]">
            Choose your preferred color theme for Swan LMS.
          </p>

          <div className="grid grid-cols-3 gap-3 max-w-md">
            {[
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'system', label: 'System', icon: Monitor },
            ].map(({ id, label, icon: Icon }) => {
              const isSelected = theme === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTheme(id)}
                  className={cn(
                    'p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-medium transition-all',
                    isSelected
                      ? 'border-teal-600 bg-teal-50/70 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 font-semibold ring-1 ring-teal-600'
                      : 'border-[var(--color-border)] dark:border-[var(--color-dark-border)] hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  )}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Status / Assignment Specs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database size={16} className="text-teal-600" /> Platform Specifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/40 border border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
              <span className="text-[var(--color-ink-subtle)]">Frontend Stack:</span>
              <p className="font-semibold text-[var(--color-ink)] dark:text-[var(--color-dark-ink)] mt-0.5">
                React 19 + Vite + Tailwind CSS v4 + TanStack Query + Zod
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/40 border border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
              <span className="text-[var(--color-ink-subtle)]">Backend API:</span>
              <p className="font-semibold text-[var(--color-ink)] dark:text-[var(--color-dark-ink)] mt-0.5">
                Node.js + Express (ESM) + MongoDB Atlas + JWT (HTTP-Only Cookie)
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/40 border border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
              <span className="text-[var(--color-ink-subtle)]">Role Authorization:</span>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                <CheckCircle size={13} /> Active (ADMIN / SALES Scoping)
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/40 border border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
              <span className="text-[var(--color-ink-subtle)]">Audit Logging:</span>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                <CheckCircle size={13} /> Unbounded Separate Collection (LeadActivity)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
