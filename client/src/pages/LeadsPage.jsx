/**
 * LeadsPage component.
 * Complete Lead Management interface featuring:
 * - Table View and Kanban Board View switcher
 * - Dynamic filtering (search with debouncing, status, service, sort)
 * - CSV Export respecting current active filters and role scoping
 * - Lead creation and editing via slide-over Drawer
 * - Deep Lead Overview & Audit history modal
 * - Safe Delete Confirmation modal
 * - Pagination with customizable page sizes (10, 25, 50)
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  LayoutList,
  Kanban,
  Download,
  Plus,
  Filter,
  FileSpreadsheet,
} from 'lucide-react';
import { leadsApi } from '../api/leads.api.js';
import { Button } from '../components/ui/Button.jsx';
import { Pagination } from '../components/ui/Pagination.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { TableRowSkeleton, LeadCardSkeleton } from '../components/ui/Skeleton.jsx';
import { LeadFilters } from '../components/leads/LeadFilters.jsx';
import { LeadRow } from '../components/leads/LeadRow.jsx';
import { LeadKanbanBoard } from '../components/leads/LeadKanbanBoard.jsx';
import { LeadFormDrawer } from '../components/leads/LeadFormDrawer.jsx';
import { LeadDetailsModal } from '../components/leads/LeadDetailsModal.jsx';
import { DeleteConfirmModal } from '../components/leads/DeleteConfirmModal.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { cn } from '../lib/cn.js';

export function LeadsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // View state: 'table' | 'kanban'
  const [viewMode, setViewMode] = useState('table');

  // Query filter state
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    status: '',
    serviceInterested: '',
    sort: '-createdAt',
  });

  // Modal / Drawer states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [viewingLead, setViewingLead] = useState(null);
  const [deletingLead, setDeletingLead] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch leads with active filters
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['leads', filters],
    queryFn: async () => {
      // Clean empty string query params before sending
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      );
      // If in Kanban mode, fetch a larger limit to populate board columns
      if (viewMode === 'kanban') {
        params.limit = 100;
      }
      const res = await leadsApi.list(params);
      return res.data;
    },
  });

  const leads = data?.data || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newLead) => leadsApi.create(newLead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setDrawerOpen(false);
      toast({
        title: 'Lead Created',
        message: 'New lead has been added to the system.',
        variant: 'success',
      });
    },
    onError: (err) => {
      toast({
        title: 'Failed to create lead',
        message: err.message || 'Please review your input.',
        variant: 'error',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => leadsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setEditingLead(null);
      setDrawerOpen(false);
      toast({
        title: 'Lead Updated',
        message: 'Lead details have been saved.',
        variant: 'success',
      });
    },
    onError: (err) => {
      toast({
        title: 'Update failed',
        message: err.message || 'Could not update lead.',
        variant: 'error',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => leadsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setDeletingLead(null);
      if (viewingLead?._id === deletingLead?._id) {
        setViewingLead(null);
      }
      toast({
        title: 'Lead Deleted',
        message: 'The lead and its activities have been permanently deleted.',
        variant: 'success',
      });
    },
    onError: (err) => {
      toast({
        title: 'Deletion failed',
        message: err.message || 'Could not delete lead.',
        variant: 'error',
      });
    },
  });

  // Export CSV handler
  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const params = Object.fromEntries(
        Object.entries(filters).filter(([k, v]) => k !== 'page' && k !== 'limit' && v !== '')
      );
      const res = await leadsApi.export(params);

      // Create download blob
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `swan-leads-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Export Complete',
        message: 'CSV file downloaded successfully.',
        variant: 'success',
      });
    } catch (err) {
      toast({
        title: 'Export Failed',
        message: err.message || 'Could not generate CSV file.',
        variant: 'error',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFormSubmit = (formData) => {
    if (editingLead) {
      updateMutation.mutate({ id: editingLead._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: '',
      status: '',
      serviceInterested: '',
      sort: '-createdAt',
    });
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-[var(--color-ink)] dark:text-[var(--color-dark-ink)]">
              Leads Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300">
              {pagination.total} Total
            </span>
          </div>
          <p className="text-xs text-[var(--color-ink-subtle)] dark:text-[var(--color-dark-ink-subtle)] mt-0.5">
            Track inquiries, update sales pipeline stages, and manage client follow-ups.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View Switcher: Table / Kanban */}
          <div className="flex items-center p-1 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all',
                viewMode === 'table'
                  ? 'bg-white dark:bg-gray-900 text-teal-700 dark:text-teal-400 shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              )}
            >
              <LayoutList size={14} /> Table
            </button>
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all',
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-gray-900 text-teal-700 dark:text-teal-400 shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              )}
            >
              <Kanban size={14} /> Board
            </button>
          </div>

          {/* Export CSV */}
          <Button
            variant="outline"
            size="md"
            onClick={handleExportCSV}
            isLoading={isExporting}
            className="gap-1.5"
          >
            <Download size={14} /> Export CSV
          </Button>

          {/* Create Lead Button */}
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setEditingLead(null);
              setDrawerOpen(true);
            }}
            className="gap-1.5"
          >
            <Plus size={16} /> New Lead
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <LeadFilters
        filters={filters}
        onChange={(newFilters) => setFilters(newFilters)}
        onReset={handleResetFilters}
        totalCount={pagination.total}
      />

      {/* Content Area */}
      {viewMode === 'table' ? (
        <div className="bg-white dark:bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-gray-800/40 border-b border-[var(--color-border)] dark:border-[var(--color-dark-border)] text-xs font-semibold text-[var(--color-ink-subtle)] uppercase tracking-wider">
                  <th className="px-4 py-3">Lead & Company</th>
                  <th className="px-4 py-3">Contact Details</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Follow-Up</th>
                  <th className="px-4 py-3">Assigned Specialist</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] dark:divide-[var(--color-dark-border)]">
                {isLoading ? (
                  <>
                    <TableRowSkeleton cols={7} />
                    <TableRowSkeleton cols={7} />
                    <TableRowSkeleton cols={7} />
                    <TableRowSkeleton cols={7} />
                    <TableRowSkeleton cols={7} />
                  </>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center">
                      <EmptyState
                        title="No leads found"
                        description={
                          filters.search || filters.status || filters.serviceInterested
                            ? 'No inquiries match your current filter parameters.'
                            : 'Get started by creating your first lead in the system.'
                        }
                        actionLabel="Add New Lead"
                        onAction={() => {
                          setEditingLead(null);
                          setDrawerOpen(true);
                        }}
                      />
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <LeadRow
                      key={lead._id}
                      lead={lead}
                      onView={(l) => setViewingLead(l)}
                      onEdit={(l) => {
                        setEditingLead(l);
                        setDrawerOpen(true);
                      }}
                      onDelete={(l) => setDeletingLead(l)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          {!isLoading && pagination.total > 0 && (
            <div className="p-4 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
              <Pagination
                page={pagination.page}
                limit={pagination.limit}
                total={pagination.total}
                totalPages={pagination.totalPages}
                onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
                onLimitChange={(lim) => setFilters((prev) => ({ ...prev, limit: lim, page: 1 }))}
              />
            </div>
          )}
        </div>
      ) : (
        /* Kanban Board View */
        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <LeadCardSkeleton />
              <LeadCardSkeleton />
              <LeadCardSkeleton />
              <LeadCardSkeleton />
              <LeadCardSkeleton />
            </div>
          ) : (
            <LeadKanbanBoard
              leads={leads}
              onView={(l) => setViewingLead(l)}
              onEdit={(l) => {
                setEditingLead(l);
                setDrawerOpen(true);
              }}
              onDelete={(l) => setDeletingLead(l)}
              onAddNew={() => {
                setEditingLead(null);
                setDrawerOpen(true);
              }}
            />
          )}
        </div>
      )}

      {/* Slide-over Create / Edit Lead Drawer */}
      <LeadFormDrawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditingLead(null);
        }}
        initialData={editingLead}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Deep Lead Overview Modal with Activity Audit Trail */}
      {viewingLead && (
        <LeadDetailsModal
          isOpen={Boolean(viewingLead)}
          onClose={() => setViewingLead(null)}
          lead={viewingLead}
          onEdit={(l) => {
            setViewingLead(null);
            setEditingLead(l);
            setDrawerOpen(true);
          }}
          onDelete={(l) => {
            setViewingLead(null);
            setDeletingLead(l);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingLead && (
        <DeleteConfirmModal
          isOpen={Boolean(deletingLead)}
          onClose={() => setDeletingLead(null)}
          onConfirm={() => deleteMutation.mutate(deletingLead._id)}
          isLoading={deleteMutation.isPending}
          title="Delete Lead Record"
          description={`Are you sure you want to delete "${deletingLead.name}"? This will permanently remove the lead along with all historical activity and audit logs.`}
        />
      )}
    </div>
  );
}
