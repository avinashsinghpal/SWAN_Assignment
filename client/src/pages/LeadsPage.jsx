import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { leadsApi } from '../api/leads.api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLeadFilters } from '../hooks/useLeadFilters.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Button } from '../components/ui/Button.jsx';
import { TableRowSkeleton } from '../components/ui/Skeleton.jsx';
import { Table, TableHeader, TableBody } from '../components/ui/Table.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';
import { Pagination } from '../components/ui/Pagination.jsx';
import { LeadsToolbar } from '../components/leads/LeadsToolbar.jsx';
import { FilterSheet } from '../components/leads/FilterSheet.jsx';
import { LeadsTable } from '../components/leads/LeadsTable.jsx';
import { LeadCard } from '../components/leads/LeadCard.jsx';
import { LeadFormDrawer } from '../components/leads/LeadFormDrawer.jsx';
import { DeleteLeadDialog } from '../components/leads/DeleteLeadDialog.jsx';
import { toast } from '../components/ui/Toaster.jsx';
import { Plus, Download } from 'lucide-react';

export function LeadsPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [urlParams] = useSearchParams();

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(urlParams.get('drawer') === 'new');
  const [editingLead, setEditingLead] = useState(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);

  // Mobile filters drawer
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filters hook
  const filters = useLeadFilters();

  // Query leads
  const {
    data: responseData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['leads', filters.queryParams],
    queryFn: async () => {
      const res = await leadsApi.list(filters.queryParams);
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  const leads = responseData?.data || [];
  const meta = responseData?.meta || {};
  const totalItems = meta.total || 0;
  const totalPages = meta.totalPages || 1;

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => leadsApi.delete(id),
    onSuccess: () => {
      toast.success('Lead permanently removed');
      setDeleteModalOpen(false);
      setLeadToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete lead');
    },
  });

  const handleDeleteConfirm = () => {
    if (!leadToDelete) return;
    deleteMutation.mutate(leadToDelete._id || leadToDelete.id);
  };

  // CSV Export handler
  const handleExportCsv = async () => {
    try {
      const res = await leadsApi.export(filters.queryParams);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('CSV export generated successfully');
    } catch {
      toast.error('Failed to export CSV');
    }
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setDrawerOpen(true);
  };

  const handleDeleteClick = (lead) => {
    setLeadToDelete(lead);
    setDeleteModalOpen(true);
  };

  const handleCreateNew = () => {
    setEditingLead(null);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* ── Page Header ────────────────────────────────────────── */}
      <SectionHeader
        eyebrow="02 / Leads"
        title={isAdmin ? 'ALL LEADS' : 'MY LEADS'}
        subtitle={
          isAdmin
            ? 'Organizational pipeline across all sales operators.'
            : 'Leads created by or assigned to your sales account.'
        }
        actions={
          <>
            <Button
              variant="outline"
              size="md"
              onClick={handleExportCsv}
            >
              <span className="inline-flex items-center gap-2">
                <Download size={14} /> Export CSV
              </span>
            </Button>

            <Button
              variant="solid"
              size="md"
              onClick={handleCreateNew}
            >
              <span className="inline-flex items-center gap-2">
                <Plus size={15} /> New Lead
              </span>
            </Button>
          </>
        }
      />

      {/* ── Toolbar (Search, Chips, Sort) ───────────────────────── */}
      <LeadsToolbar
        search={filters.search}
        onSearchChange={filters.setSearch}
        selectedStatuses={filters.selectedStatuses}
        onToggleStatus={filters.toggleStatus}
        datePreset={filters.datePreset}
        onDatePresetChange={filters.setDatePreset}
        dateFrom={filters.dateFrom}
        dateTo={filters.dateTo}
        onCustomDateChange={filters.setCustomDateRange}
        sort={filters.sort}
        onSortChange={filters.setSort}
        totalResults={totalItems}
        hasActiveFilters={filters.hasActiveFilters}
        onClearFilters={filters.clearFilters}
        onOpenMobileFilters={() => setMobileFiltersOpen(true)}
      />

      {/* ── Content View (Desktop Table + Mobile Cards) ─────────── */}
      {isError ? (
        <ErrorState
          title="FAILED TO FETCH LEADS"
          message="Could not load lead records from the server."
          onRetry={refetch}
        />
      ) : isLoading ? (
        <>
          <div className="hidden md:block">
            <Table isFetching={true}>
              <TableHeader>
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Lead</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Follow-up</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={8} />
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-44 bg-[#060606] border border-[#222222] animate-pulse" />
            ))}
          </div>
        </>
      ) : leads.length === 0 ? (
        <EmptyState
          title="NO LEADS FOUND"
          description={
            filters.hasActiveFilters
              ? 'No leads matched your search and filter parameters.'
              : 'Your pipeline is currently empty. Add your first prospect to begin.'
          }
          actionLabel={filters.hasActiveFilters ? 'CLEAR ALL FILTERS' : 'ADD FIRST LEAD'}
          onAction={filters.hasActiveFilters ? filters.clearFilters : handleCreateNew}
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <LeadsTable
              leads={leads}
              page={filters.page}
              pageSize={filters.pageSize}
              isFetching={isFetching}
              sort={filters.sort}
              onSort={filters.setSort}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          </div>

          {/* Mobile Card Stack */}
          <div className="md:hidden space-y-4">
            {leads.map((lead, idx) => (
              <LeadCard
                key={lead._id || lead.id}
                lead={lead}
                index={(filters.page - 1) * filters.pageSize + idx + 1}
                onView={() => navigate(`/leads/${lead._id || lead.id}`)}
                onEdit={() => handleEdit(lead)}
                onDelete={() => handleDeleteClick(lead)}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={filters.pageSize}
            onPageChange={filters.setPage}
            onPageSizeChange={filters.setPageSize}
          />
        </>
      )}

      {/* ── Mobile Filter Bottom Sheet ─────────────────────────── */}
      <FilterSheet
        open={mobileFiltersOpen}
        onOpenChange={setMobileFiltersOpen}
        selectedStatuses={filters.selectedStatuses}
        onToggleStatus={filters.toggleStatus}
        datePreset={filters.datePreset}
        onDatePresetChange={filters.setDatePreset}
        dateFrom={filters.dateFrom}
        dateTo={filters.dateTo}
        onCustomDateChange={filters.setCustomDateRange}
        sort={filters.sort}
        onSortChange={filters.setSort}
        onClearFilters={() => {
          filters.clearFilters();
          setMobileFiltersOpen(false);
        }}
      />

      {/* ── Lead Create / Edit Drawer ──────────────────────────── */}
      <LeadFormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        initialData={editingLead}
        onSuccess={() => {
          refetch();
          setEditingLead(null);
        }}
      />

      {/* ── Delete Confirmation Dialog ─────────────────────────── */}
      <DeleteLeadDialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        lead={leadToDelete}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}

export default LeadsPage;
