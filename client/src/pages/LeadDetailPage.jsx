import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '../api/leads.api.js';
import { usersApi } from '../api/dashboard.api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { formatDate, formatShortId, isOverdue } from '../lib/formatters.js';
import { LEAD_STATUSES } from '../lib/constants.js';
import { Button } from '../components/ui/Button.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';
import { StatusTag } from '../components/ui/StatusTag.jsx';
import { SegmentedControl } from '../components/ui/SegmentedControl.jsx';
import { Select } from '../components/ui/Select.jsx';
import { LeadFormDrawer } from '../components/leads/LeadFormDrawer.jsx';
import { DeleteLeadDialog } from '../components/leads/DeleteLeadDialog.jsx';
import { ActivityTimeline } from '../components/leads/ActivityTimeline.jsx';
import { toast } from '../components/ui/Toaster.jsx';
import { Edit3, Trash2, ArrowLeft } from 'lucide-react';

export function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // 1. Fetch Lead Details
  const {
    data: lead,
    isLoading: leadLoading,
    isError: leadError,
    error: leadErrObj,
    refetch: refetchLead,
  } = useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      const res = await leadsApi.get(id);
      return res.data?.data;
    },
    retry: 1,
  });

  // 2. Fetch Activity Timeline
  const {
    data: activities = [],
    isLoading: activitiesLoading,
    refetch: refetchActivities,
  } = useQuery({
    queryKey: ['leadActivities', id],
    queryFn: async () => {
      const res = await leadsApi.getActivities(id);
      return res.data?.data || [];
    },
    enabled: Boolean(lead),
  });

  // 3. Fetch Users for Admin reassignment
  const { data: usersData = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await usersApi.list();
      return res.data?.data || [];
    },
    enabled: Boolean(isAdmin && lead),
    staleTime: 60 * 1000,
  });

  // Status Change Mutation with Optimistic Update
  const statusMutation = useMutation({
    mutationFn: (newStatus) => leadsApi.updateStatus(id, newStatus),
    onMutate: async (newStatus) => {
      await queryClient.cancelQueries({ queryKey: ['lead', id] });
      const previousLead = queryClient.getQueryData(['lead', id]);

      queryClient.setQueryData(['lead', id], (old) => {
        if (!old) return old;
        return { ...old, status: newStatus };
      });

      return { previousLead };
    },
    onSuccess: (_, newStatus) => {
      toast.success(`Status updated to ${newStatus}`);
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      queryClient.invalidateQueries({ queryKey: ['leadActivities', id] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (err, _, context) => {
      if (context?.previousLead) {
        queryClient.setQueryData(['lead', id], context.previousLead);
      }
      toast.error(err.message || 'Failed to update status');
    },
  });

  // Admin Reassign Mutation
  const reassignMutation = useMutation({
    mutationFn: (assignedTo) =>
      leadsApi.update(id, {
        name: lead.name,
        email: lead.email,
        serviceInterested: lead.serviceInterested,
        status: lead.status,
        assignedTo: assignedTo || null,
      }),
    onSuccess: () => {
      toast.success('Lead reassigned successfully');
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      queryClient.invalidateQueries({ queryKey: ['leadActivities', id] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to reassign lead');
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: () => leadsApi.delete(id),
    onSuccess: () => {
      toast.success('Lead deleted');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      navigate('/leads', { replace: true });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete lead');
    },
  });

  // Loading skeleton
  if (leadLoading) {
    return (
      <div className="space-y-8 font-mono">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-24 w-3/4" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <Skeleton className="lg:col-span-3 h-96" />
          <Skeleton className="lg:col-span-2 h-96" />
        </div>
      </div>
    );
  }

  // 404 or Error State
  if (leadError || !lead) {
    if (leadErrObj?.status === 404) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center font-mono space-y-4 p-8">
          <h2 className="font-display text-5xl uppercase text-[#F2554F]">
            LEAD NOT FOUND
          </h2>
          <p className="text-xs text-[#717171] max-w-sm">
            The requested lead ID does not exist or has been removed from the pipeline.
          </p>
          <Link
            to="/leads"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#FE6A00] hover:underline pt-2"
          >
            <ArrowLeft size={14} /> Back to all leads
          </Link>
        </div>
      );
    }

    return (
      <ErrorState
        title="FAILED TO LOAD LEAD"
        message={leadErrObj?.message || 'Could not fetch lead details from server.'}
        onRetry={refetchLead}
      />
    );
  }

  const shortId = formatShortId(lead._id);
  const leadOverdue = lead.followUpDate ? isOverdue(lead.followUpDate) : false;

  return (
    <div className="space-y-8 font-mono">
      {/* ── Breadcrumb ─────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="text-[10px] uppercase tracking-widest text-[#717171]">
        <Link to="/leads" className="text-[#8A8A8A] hover:text-[#FE6A00] transition-colors">
          Leads
        </Link>{' '}
        / <span className="text-[#EEEEEE]">{lead.name}</span>
      </nav>

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#222222]/60">
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#FE6A00]">
            Lead / {shortId}
          </p>
          <h1 className="font-display text-5xl md:text-8xl tracking-tight uppercase text-[#EEEEEE] leading-none m-0">
            {lead.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#717171] pt-1">
            <span>{lead.company || 'Individual Client'}</span>
            <span>•</span>
            <span>{lead.serviceInterested}</span>
            <span>•</span>
            <StatusTag status={lead.status} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="md"
            onClick={() => setDrawerOpen(true)}
          >
            <span className="inline-flex items-center gap-2">
              <Edit3 size={14} /> Edit
            </span>
          </Button>

          <Button
            variant="destructive"
            size="md"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <span className="inline-flex items-center gap-2">
              <Trash2 size={14} /> Delete
            </span>
          </Button>
        </div>
      </header>

      {/* ── Quick Status Changer ───────────────────────────────── */}
      <section className="space-y-2" aria-label="Quick Status Transition">
        <p className="text-[10px] uppercase tracking-widest text-[#717171]">
          Pipeline Stage
        </p>
        <SegmentedControl
          value={lead.status}
          onChange={(newStatus) => statusMutation.mutate(newStatus)}
          options={LEAD_STATUSES.map((s) => ({ value: s, label: s, status: s }))}
          disabled={statusMutation.isPending}
        />
      </section>

      {/* ── 2-Column Content Layout (Details 3/5, Activity 2/5) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left: Details Block (3/5) */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-6">
            <h3 className="font-display text-2xl uppercase tracking-wide text-[#EEEEEE] pb-3 border-b border-[#222222]/40 mb-4">
              Prospect Specification
            </h3>

            <dl className="divide-y divide-[#222222]/30 text-xs">
              <div className="py-3 flex items-center justify-between">
                <dt className="text-[10px] uppercase tracking-widest text-[#717171]">Email</dt>
                <dd>
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-[#EEEEEE] hover:text-[#FE6A00] underline underline-offset-2"
                  >
                    {lead.email}
                  </a>
                </dd>
              </div>

              <div className="py-3 flex items-center justify-between">
                <dt className="text-[10px] uppercase tracking-widest text-[#717171]">Phone</dt>
                <dd>
                  {lead.phone ? (
                    <a
                      href={`tel:${lead.phone}`}
                      className="text-[#EEEEEE] hover:text-[#FE6A00] underline underline-offset-2"
                    >
                      {lead.phone}
                    </a>
                  ) : (
                    <span className="text-[#333333]">—</span>
                  )}
                </dd>
              </div>

              <div className="py-3 flex items-center justify-between">
                <dt className="text-[10px] uppercase tracking-widest text-[#717171]">Company</dt>
                <dd className="text-[#EEEEEE]">{lead.company || '—'}</dd>
              </div>

              <div className="py-3 flex items-center justify-between">
                <dt className="text-[10px] uppercase tracking-widest text-[#717171]">Service Interested</dt>
                <dd className="text-[#EEEEEE] font-medium">{lead.serviceInterested}</dd>
              </div>

              <div className="py-3 flex items-center justify-between">
                <dt className="text-[10px] uppercase tracking-widest text-[#717171]">Current Status</dt>
                <dd>
                  <StatusTag status={lead.status} />
                </dd>
              </div>

              <div className="py-3 flex items-center justify-between">
                <dt className="text-[10px] uppercase tracking-widest text-[#717171]">Follow-Up Date</dt>
                <dd className="flex items-center gap-2">
                  <span className={leadOverdue ? 'text-[#FE6A00] font-bold' : 'text-[#EEEEEE]'}>
                    {lead.followUpDate ? formatDate(lead.followUpDate) : 'Not scheduled'}
                  </span>
                  {leadOverdue && (
                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-[#FE6A00] text-[#FE6A00]">
                      OVERDUE
                    </span>
                  )}
                </dd>
              </div>

              <div className="py-3 flex items-center justify-between">
                <dt className="text-[10px] uppercase tracking-widest text-[#717171]">Created Date</dt>
                <dd className="text-[#8A8A8A]">{formatDate(lead.createdAt)}</dd>
              </div>

              <div className="py-3 flex items-center justify-between">
                <dt className="text-[10px] uppercase tracking-widest text-[#717171]">Last Updated</dt>
                <dd className="text-[#8A8A8A]">{formatDate(lead.updatedAt)}</dd>
              </div>

              <div className="py-3 flex items-center justify-between">
                <dt className="text-[10px] uppercase tracking-widest text-[#717171]">Created By</dt>
                <dd className="text-[#EEEEEE]">{lead.createdBy?.name || lead.createdBy?.email || 'System'}</dd>
              </div>

              {/* Assigned To: Admin can reassign directly */}
              <div className="py-3 flex items-center justify-between gap-4">
                <dt className="text-[10px] uppercase tracking-widest text-[#717171]">Assigned To</dt>
                <dd className="min-w-[200px]">
                  {isAdmin ? (
                    <Select
                      value={lead.assignedTo?._id || lead.assignedTo || ''}
                      onValueChange={(val) => reassignMutation.mutate(val)}
                      disabled={reassignMutation.isPending}
                      options={[
                        { value: '', label: 'Unassigned' },
                        ...usersData.map((u) => ({
                          value: u._id,
                          label: `${u.name} (${u.role})`,
                        })),
                      ]}
                    />
                  ) : (
                    <span className="text-[#EEEEEE]">
                      {lead.assignedTo?.name || lead.assignedTo?.email || 'Unassigned'}
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </Card>

          {/* Notes Block */}
          <Card className="p-6">
            <h4 className="text-[10px] uppercase tracking-widest text-[#717171] mb-3">
              Internal Notes & Context
            </h4>
            <div className="p-4 border border-[#222222] bg-[#020202] text-xs text-[#EEEEEE] whitespace-pre-wrap leading-relaxed font-mono">
              {lead.notes || 'No briefing notes recorded for this prospect.'}
            </div>
          </Card>
        </div>

        {/* Right: Activity Timeline (2/5) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#222222]/40 mb-6">
              <h3 className="font-display text-2xl uppercase tracking-wide text-[#EEEEEE]">
                Audit Timeline
              </h3>
              <span className="text-[10px] uppercase tracking-widest text-[#717171]">
                {activities.length} Records
              </span>
            </div>

            {activitiesLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
            ) : (
              <ActivityTimeline activities={activities} />
            )}
          </Card>
        </div>
      </div>

      {/* Edit Drawer */}
      <LeadFormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        initialData={lead}
        onSuccess={() => {
          refetchLead();
          refetchActivities();
        }}
      />

      {/* Delete Dialog */}
      <DeleteLeadDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        lead={lead}
        onConfirm={() => deleteMutation.mutate()}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}

export default LeadDetailPage;
