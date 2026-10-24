/**
 * DashboardPage component.
 * High-performance analytics overview using Recharts:
 * - KPI Metric Cards with conversion indicators
 * - 30-Day Lead Trend Area Chart
 * - Status Pipeline Donut Chart
 * - Services Demand Horizontal Bar Chart
 * - Follow-up Action Queue (Overdue, Today, Upcoming)
 * - Recent Inquiries List
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Target,
  CheckCircle,
  AlertCircle,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { dashboardApi } from '../api/dashboard.api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { StatCardSkeleton, ChartSkeleton } from '../components/ui/Skeleton.jsx';
import { LeadDetailsModal } from '../components/leads/LeadDetailsModal.jsx';
import { LeadFormDrawer } from '../components/leads/LeadFormDrawer.jsx';

const STATUS_COLORS = {
  New: '#3b82f6',
  Contacted: '#f59e0b',
  Qualified: '#8b5cf6',
  Converted: '#10b981',
  Lost: '#ef4444',
};

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedLead, setSelectedLead] = useState(null);
  const [editingLead, setEditingLead] = useState(null);

  // Queries
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const res = await dashboardApi.getStats();
      return res.data.data;
    },
  });

  const { data: trends, isLoading: isTrendsLoading } = useQuery({
    queryKey: ['dashboard', 'trends'],
    queryFn: async () => {
      const res = await dashboardApi.getTrends();
      return res.data.data;
    },
  });

  const { data: services, isLoading: isServicesLoading } = useQuery({
    queryKey: ['dashboard', 'services'],
    queryFn: async () => {
      const res = await dashboardApi.getServices();
      return res.data.data;
    },
  });

  const { data: followUps, isLoading: isFollowUpsLoading } = useQuery({
    queryKey: ['dashboard', 'follow-ups'],
    queryFn: async () => {
      const res = await dashboardApi.getFollowUps();
      return res.data.data;
    },
  });

  const { data: recentLeads, isLoading: isRecentLoading } = useQuery({
    queryKey: ['dashboard', 'recent-leads'],
    queryFn: async () => {
      const res = await dashboardApi.getRecentLeads();
      return res.data.data;
    },
  });

  const pieData =
    stats?.statuses?.filter((s) => s.count > 0).map((s) => ({
      name: s.status,
      value: s.count,
      percentage: s.percentage,
      color: STATUS_COLORS[s.status] || '#64748b',
    })) || [];

  const totalFollowUps =
    (followUps?.overdue?.length || 0) +
    (followUps?.today?.length || 0) +
    (followUps?.upcoming?.length || 0);

  return (
    <div className="space-y-6 pb-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 text-white shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/15 backdrop-blur-xs text-white uppercase tracking-wider">
              {user?.role === 'ADMIN' ? 'Executive Control' : 'Sales Workspace'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/80 max-w-xl">
            Here is your live pipeline snapshot, performance indicators, and action queue for Swan Digital Solutions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/leads')}
            className="bg-white text-teal-900 hover:bg-teal-50 border-transparent shadow-xs"
          >
            Manage All Leads <ArrowUpRight size={15} />
          </Button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isStatsLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[var(--color-ink-subtle)] dark:text-[var(--color-dark-ink-subtle)]">
                    Total Inquiries
                  </p>
                  <p className="text-2xl font-bold text-[var(--color-ink)] dark:text-[var(--color-dark-ink)] mt-1">
                    {stats?.total ?? 0}
                  </p>
                  <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium mt-1 flex items-center gap-1">
                    <TrendingUp size={12} /> Active in system
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300">
                  <Users size={22} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[var(--color-ink-subtle)] dark:text-[var(--color-dark-ink-subtle)]">
                    Conversion Rate
                  </p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    {stats?.conversionRate ?? 0}%
                  </p>
                  <p className="text-[11px] text-[var(--color-ink-subtle)] mt-1">
                    {stats?.statuses?.find((s) => s.status === 'Converted')?.count || 0} deals closed
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300">
                  <Target size={22} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[var(--color-ink-subtle)] dark:text-[var(--color-dark-ink-subtle)]">
                    Qualified In Pipeline
                  </p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                    {stats?.statuses?.find((s) => s.status === 'Qualified')?.count || 0}
                  </p>
                  <p className="text-[11px] text-[var(--color-ink-subtle)] mt-1">
                    Ready for proposal
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300">
                  <Layers size={22} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[var(--color-ink-subtle)] dark:text-[var(--color-dark-ink-subtle)]">
                    Pending Follow-Ups
                  </p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                    {totalFollowUps}
                  </p>
                  <p className="text-[11px] text-rose-500 font-semibold mt-1">
                    {followUps?.overdue?.length || 0} overdue
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300">
                  <Clock size={22} />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 30-Day Trend Area Chart (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={16} className="text-teal-600" />
              Lead Volume Trend (Past 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isTrendsLoading ? (
              <ChartSkeleton />
            ) : trends?.length ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="leadTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0f766e" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(d) => {
                        const parts = d.split('-');
                        return `${parts[1]}/${parts[2]}`;
                      }}
                      stroke="#888888"
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis allowDecimals={false} stroke="#888888" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        borderColor: '#334155',
                        borderRadius: '8px',
                        color: '#f8fafc',
                        fontSize: '12px',
                      }}
                      labelFormatter={(label) => `Date: ${label}`}
                      formatter={(val) => [`${val} leads`, 'Count']}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#0f766e"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#leadTrend)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-xs text-[var(--color-ink-subtle)]">
                No trend data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pipeline Status Donut (1 col) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles size={16} className="text-teal-600" />
              Pipeline Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isStatsLoading ? (
              <ChartSkeleton />
            ) : pieData.length ? (
              <div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          borderColor: '#334155',
                          borderRadius: '8px',
                          color: '#f8fafc',
                          fontSize: '12px',
                        }}
                        formatter={(val, name) => [`${val} (${val}%)`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-1.5 mt-2">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-[var(--color-ink)] dark:text-[var(--color-dark-ink)]">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-semibold text-[var(--color-ink)] dark:text-[var(--color-dark-ink)]">
                        {item.value} ({item.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-xs text-[var(--color-ink-subtle)]">
                No leads recorded
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Services Demand & Follow-up Action Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Demand Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Inquiries by Service</CardTitle>
          </CardHeader>
          <CardContent>
            {isServicesLoading ? (
              <ChartSkeleton />
            ) : services?.length ? (
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={services}
                    margin={{ top: 5, right: 15, left: 35, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#88888820" />
                    <XAxis type="number" stroke="#888888" fontSize={11} allowDecimals={false} />
                    <YAxis
                      dataKey="service"
                      type="category"
                      stroke="#888888"
                      fontSize={11}
                      width={120}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        borderColor: '#334155',
                        borderRadius: '8px',
                        color: '#f8fafc',
                        fontSize: '12px',
                      }}
                      formatter={(val) => [`${val} requests`, 'Volume']}
                    />
                    <Bar dataKey="count" fill="#0d9488" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-60 flex items-center justify-center text-xs text-[var(--color-ink-subtle)]">
                No service inquiries logged
              </div>
            )}
          </CardContent>
        </Card>

        {/* Follow-up Action Queue */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock size={16} className="text-amber-500" /> Follow-Up Priority Queue
              </CardTitle>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
                {totalFollowUps} Actionable
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {isFollowUpsLoading ? (
              <div className="space-y-3">
                <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
                <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
                <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
              </div>
            ) : totalFollowUps === 0 ? (
              <div className="h-60 flex flex-col items-center justify-center text-center p-4">
                <CheckCircle size={32} className="text-emerald-500 mb-2" />
                <p className="text-sm font-semibold text-[var(--color-ink)] dark:text-[var(--color-dark-ink)]">
                  All caught up!
                </p>
                <p className="text-xs text-[var(--color-ink-subtle)] mt-1">
                  No overdue or scheduled follow-ups for the next 7 days.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {/* Overdue */}
                {followUps?.overdue?.map((lead) => (
                  <div
                    key={lead._id}
                    onClick={() => setSelectedLead(lead)}
                    className="p-3 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 hover:bg-red-50 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-red-700 dark:text-red-400">
                          OVERDUE
                        </span>
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">
                          {lead.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        {lead.company || lead.email}
                      </p>
                    </div>
                    <Badge status={lead.status}>{lead.status}</Badge>
                  </div>
                ))}

                {/* Today */}
                {followUps?.today?.map((lead) => (
                  <div
                    key={lead._id}
                    onClick={() => setSelectedLead(lead)}
                    className="p-3 rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-50 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                          TODAY
                        </span>
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">
                          {lead.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        {lead.company || lead.email}
                      </p>
                    </div>
                    <Badge status={lead.status}>{lead.status}</Badge>
                  </div>
                ))}

                {/* Upcoming */}
                {followUps?.upcoming?.map((lead) => (
                  <div
                    key={lead._id}
                    onClick={() => setSelectedLead(lead)}
                    className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">
                        {lead.name}
                      </span>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        {lead.company || lead.email}
                      </p>
                    </div>
                    <span className="text-[11px] text-gray-500">
                      {new Date(lead.followUpDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Inquiries List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Inquiries</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/leads')}
              className="text-xs text-teal-700 dark:text-teal-400"
            >
              View All Leads &rarr;
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isRecentLoading ? (
            <div className="space-y-3">
              <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          ) : recentLeads?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--color-border)] dark:border-[var(--color-dark-border)] text-[var(--color-ink-subtle)] font-semibold uppercase tracking-wider">
                    <th className="pb-2.5">Lead Name</th>
                    <th className="pb-2.5">Service</th>
                    <th className="pb-2.5">Status</th>
                    <th className="pb-2.5">Assigned Specialist</th>
                    <th className="pb-2.5 text-right">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)] dark:divide-[var(--color-dark-border)]">
                  {recentLeads.map((lead) => (
                    <tr
                      key={lead._id}
                      onClick={() => setSelectedLead(lead)}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3 font-semibold text-[var(--color-ink)] dark:text-[var(--color-dark-ink)]">
                        {lead.name}
                        {lead.company && (
                          <span className="block text-[11px] font-normal text-gray-400">
                            {lead.company}
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-teal-700 dark:text-teal-400 font-medium">
                        {lead.serviceInterested}
                      </td>
                      <td className="py-3">
                        <Badge status={lead.status}>{lead.status}</Badge>
                      </td>
                      <td className="py-3 text-[var(--color-ink-muted)]">
                        {lead.assignedTo?.name || 'Unassigned'}
                      </td>
                      <td className="py-3 text-right text-[var(--color-ink-subtle)]">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-[var(--color-ink-subtle)] py-4 text-center">
              No recent leads available.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Deep Lead Overview Modal */}
      {selectedLead && (
        <LeadDetailsModal
          isOpen={Boolean(selectedLead)}
          onClose={() => setSelectedLead(null)}
          lead={selectedLead}
          onEdit={(l) => {
            setSelectedLead(null);
            setEditingLead(l);
          }}
          onDelete={() => {
            setSelectedLead(null);
            navigate('/leads');
          }}
        />
      )}

      {/* Edit Drawer */}
      {editingLead && (
        <LeadFormDrawer
          isOpen={Boolean(editingLead)}
          onClose={() => setEditingLead(null)}
          initialData={editingLead}
          onSubmit={async (payload) => {
            await dashboardApi.update?.(editingLead._id, payload);
            setEditingLead(null);
          }}
        />
      )}
    </div>
  );
}
