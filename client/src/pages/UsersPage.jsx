/**
 * UsersPage component (Admin only).
 * Displays team members, roles, and account statuses.
 */

import { useQuery } from '@tanstack/react-query';
import { Users, Shield, UserCheck, Mail, Calendar } from 'lucide-react';
import { usersApi } from '../api/dashboard.api.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { TableRowSkeleton } from '../components/ui/Skeleton.jsx';

export function UsersPage() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await usersApi.list();
      return res.data.data;
    },
  });

  const usersList = users || [];
  const adminCount = usersList.filter((u) => u.role === 'ADMIN').length;
  const salesCount = usersList.filter((u) => u.role === 'SALES').length;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[var(--color-ink)] dark:text-[var(--color-dark-ink)]">
          Team Management
        </h1>
        <p className="text-xs text-[var(--color-ink-subtle)] dark:text-[var(--color-dark-ink-subtle)] mt-0.5">
          View all registered team members and administrative access roles.
        </p>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-ink-subtle)]">Total Accounts</p>
              <p className="text-xl font-bold text-[var(--color-ink)] dark:text-[var(--color-dark-ink)] mt-1">
                {usersList.length}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300">
              <Users size={20} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-ink-subtle)]">Administrators</p>
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                {adminCount}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300">
              <Shield size={20} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-ink-subtle)]">Sales Specialists</p>
              <p className="text-xl font-bold text-teal-600 dark:text-teal-400 mt-1">
                {salesCount}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-300">
              <UserCheck size={20} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--color-border)] dark:border-[var(--color-dark-border)] text-[var(--color-ink-subtle)] font-semibold uppercase tracking-wider">
                  <th className="pb-3 px-3">User</th>
                  <th className="pb-3 px-3">Email Address</th>
                  <th className="pb-3 px-3">Role</th>
                  <th className="pb-3 px-3">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] dark:divide-[var(--color-dark-border)]">
                {isLoading ? (
                  <>
                    <TableRowSkeleton cols={4} />
                    <TableRowSkeleton cols={4} />
                    <TableRowSkeleton cols={4} />
                  </>
                ) : usersList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-[var(--color-ink-subtle)]">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  usersList.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-xs font-semibold text-teal-800 dark:text-teal-300">
                            {u.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <span className="font-semibold text-[var(--color-ink)] dark:text-[var(--color-dark-ink)]">
                            {u.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                          <Mail size={12} className="text-gray-400" /> {u.email}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            u.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
                              : 'bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                          }`}
                        >
                          {u.role === 'ADMIN' ? 'Administrator' : 'Sales Representative'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[var(--color-ink-subtle)]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
