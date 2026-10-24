import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { formatDate } from '../lib/formatters.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';
import { StatCard } from '../components/dashboard/StatCard.jsx';
import { ConversionKpi } from '../components/dashboard/ConversionKpi.jsx';
import { StatusChart } from '../components/dashboard/StatusChart.jsx';
import { TrendChart } from '../components/dashboard/TrendChart.jsx';
import { ServiceChart } from '../components/dashboard/ServiceChart.jsx';
import { FollowUpsPanel } from '../components/dashboard/FollowUpsPanel.jsx';
import { RecentLeads } from '../components/dashboard/RecentLeads.jsx';
import { LeadFormDrawer } from '../components/leads/LeadFormDrawer.jsx';
import { Plus } from 'lucide-react';

export function DashboardPage() {
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const todayStr = useMemo(() => formatDate(new Date()), []);

  // 1. Stats query
  const {
    data: statsData,
    isLoading: statsLoading,
    isError: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const res = await dashboardApi.getStats();
      return res.data?.data;
    },
  });

  // 2. Trends query
  const {
    data: trendsData,
    isLoading: trendsLoading,
    isError: trendsError,
    refetch: refetchTrends,
  } = useQuery({
    queryKey: ['dashboard', 'trends'],
    queryFn: async () => {
      const res = await dashboardApi.getTrends();
      return res.data?.data || [];
    },
  });

  // 3. Services query
  const {
    data: servicesData,
    isLoading: servicesLoading,
    isError: servicesError,
    refetch: refetchServices,
  } = useQuery({
    queryKey: ['dashboard', 'services'],
    queryFn: async () => {
      const res = await dashboardApi.getServices();
      return res.data?.data || [];
    },
  });

  // 4. Follow-ups query
  const {
    data: followUpsData,
    isLoading: followUpsLoading,
    isError: followUpsError,
    refetch: refetchFollowUps,
  } = useQuery({
    queryKey: ['dashboard', 'follow-ups'],
    queryFn: async () => {
      const res = await dashboardApi.getFollowUps();
      return res.data?.data || { overdue: [], today: [], upcoming: [] };
    },
  });

  // 5. Recent leads query
  const {
    data: recentLeadsData,
    isLoading: recentLeadsLoading,
    isError: recentLeadsError,
    refetch: refetchRecentLeads,
  } = useQuery({
    queryKey: ['dashboard', 'recent-leads'],
    queryFn: async () => {
      const res = await dashboardApi.getRecentLeads();
      return res.data?.data || [];
    },
  });

  const total = statsData?.total ?? 0;
  const statusStats = statsData?.statuses ?? [];
  const conversionRate = statsData?.conversionRate ?? 0;

  return (
    <div className="space-y-8 font-mono">
      {/* ── Page Header ────────────────────────────────────────── */}
      <SectionHeader
        eyebrow="01 / Overview"
        title="DASHBOARD"
        subtitle={`Welcome back, ${user?.name || 'Operator'}. Today is ${todayStr}.`}
        actions={
          <Button
            variant="solid"
            size="md"
            onClick={() => setDrawerOpen(true)}
          >
            <span className="inline-flex items-center gap-2">
              <Plus size={15} /> New Lead
            </span>
          </Button>
        }
      />

      {/* ── Stat Cards Grid ────────────────────────────────────── */}
      <section aria-label="Pipeline Statistics">
        {statsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            <Skeleton className="h-40 xl:col-span-2" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        ) : statsError ? (
          <ErrorState
            title="FAILED TO LOAD METRICS"
            message="Could not retrieve pipeline statistics from the database."
            onRetry={refetchStats}
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Total Leads (Spans 2 on XL) */}
            <StatCard
              label="TOTAL LEADS"
              count={total}
              isTotal={true}
              index={1}
            />

            {/* Individual Statuses */}
            {statusStats.map((item, idx) => (
              <StatCard
                key={item.status}
                label={item.status}
                count={item.count}
                percentage={item.percentage}
                status={item.status}
                index={idx + 2}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Conversion KPI & Status Chart Side-by-Side ─────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6" aria-label="Conversion and Status">
        {statsLoading ? (
          <>
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </>
        ) : (
          <>
            <ConversionKpi rate={conversionRate} />
            <StatusChart data={statusStats} />
          </>
        )}
      </section>

      {/* ── 30-Day Trend (Full Width) ─────────────────────────── */}
      <section aria-label="30-Day Velocity Trend">
        {trendsLoading ? (
          <Skeleton className="h-80 w-full" />
        ) : trendsError ? (
          <ErrorState
            title="FAILED TO LOAD TRENDS"
            message="Unable to plot 30-day lead velocity curve."
            onRetry={refetchTrends}
          />
        ) : (
          <TrendChart data={trendsData} />
        )}
      </section>

      {/* ── Services Chart & Follow-ups Side-by-Side ────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6" aria-label="Services and Follow-ups">
        {servicesLoading ? (
          <Skeleton className="h-80" />
        ) : servicesError ? (
          <ErrorState
            title="FAILED TO LOAD SERVICES"
            message="Could not load service demand breakdown."
            onRetry={refetchServices}
          />
        ) : (
          <ServiceChart data={servicesData} />
        )}

        {followUpsLoading ? (
          <Skeleton className="h-80" />
        ) : followUpsError ? (
          <ErrorState
            title="FAILED TO LOAD FOLLOW-UPS"
            message="Could not retrieve upcoming follow-up appointments."
            onRetry={refetchFollowUps}
          />
        ) : (
          <FollowUpsPanel data={followUpsData} />
        )}
      </section>

      {/* ── Recent Leads Table ─────────────────────────────────── */}
      <section aria-label="Recent Pipeline Inquiries">
        {recentLeadsLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : recentLeadsError ? (
          <ErrorState
            title="FAILED TO LOAD RECENT LEADS"
            message="Unable to list latest pipeline items."
            onRetry={refetchRecentLeads}
          />
        ) : (
          <RecentLeads leads={recentLeadsData} />
        )}
      </section>

      {/* ── Lead Creation Drawer ───────────────────────────────── */}
      <LeadFormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onSuccess={() => {
          refetchStats();
          refetchTrends();
          refetchRecentLeads();
        }}
      />
    </div>
  );
}

export default DashboardPage;
