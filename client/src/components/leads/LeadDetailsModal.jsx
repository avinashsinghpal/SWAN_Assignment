/**
 * LeadDetailsModal component.
 * Displays full lead details, contact actions, status pipeline pills,
 * and complete chronological audit/activity history timeline.
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Mail,
  Phone,
  Building,
  Calendar,
  UserCheck,
  Clock,
  Edit2,
  Trash2,
  CheckCircle2,
  Send,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';
import { Modal, ModalFooter } from '../ui/Modal.jsx';
import { Badge } from '../ui/Badge.jsx';
import { Button } from '../ui/Button.jsx';
import { Textarea } from '../ui/Input.jsx';
import { leadsApi } from '../../api/leads.api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { cn } from '../../lib/cn.js';

const STATUS_PIPELINE = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

export function LeadDetailsModal({
  isOpen,
  onClose,
  lead,
  onEdit,
  onDelete,
}) {
  const [newNote, setNewNote] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const leadId = lead?._id;

  // Fetch activities for this lead
  const { data: activities, isLoading: isActivitiesLoading } = useQuery({
    queryKey: ['leads', leadId, 'activities'],
    queryFn: async () => {
      const res = await leadsApi.getActivities(leadId);
      return res.data.data;
    },
    enabled: Boolean(isOpen && leadId),
  });

  // Status update mutation
  const updateStatusMutation = useMutation({
    mutationFn: (newStatus) => leadsApi.updateStatus(leadId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads', leadId, 'activities'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast({
        title: 'Status Updated',
        message: 'Lead status has been updated successfully.',
        variant: 'success',
      });
    },
    onError: (err) => {
      toast({
        title: 'Update Failed',
        message: err.message || 'Could not update status.',
        variant: 'error',
      });
    },
  });

  // Add note mutation (via lead update API adding to notes or updating)
  const addNoteMutation = useMutation({
    mutationFn: async (noteText) => {
      const currentNotes = lead.notes ? `${lead.notes}\n\n[Note]: ${noteText}` : noteText;
      return leadsApi.update(leadId, { notes: currentNotes });
    },
    onSuccess: () => {
      setNewNote('');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads', leadId, 'activities'] });
      toast({
        title: 'Note Added',
        message: 'Your note was recorded on the lead.',
        variant: 'success',
      });
    },
    onError: (err) => {
      toast({
        title: 'Failed to add note',
        message: err.message || 'Something went wrong.',
        variant: 'error',
      });
    },
  });

  if (!lead) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not set';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lead Overview"
      description={`ID: ${lead._id}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Header Summary Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[var(--color-canvas)] dark:bg-[var(--color-dark-canvas)] border border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-[var(--color-ink)] dark:text-[var(--color-dark-ink)]">
                {lead.name}
              </h2>
              <Badge status={lead.status}>{lead.status}</Badge>
            </div>
            {lead.company && (
              <p className="text-xs text-[var(--color-ink-muted)] dark:text-[var(--color-dark-ink-muted)] flex items-center gap-1.5 mt-1">
                <Building size={13} /> {lead.company}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(lead);
              }}
              className="gap-1.5"
            >
              <Edit2 size={13} /> Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                onClose();
                onDelete(lead);
              }}
              className="gap-1.5"
            >
              <Trash2 size={13} /> Delete
            </Button>
          </div>
        </div>

        {/* Status Pipeline Tracker */}
        <div>
          <p className="text-xs font-semibold text-[var(--color-ink-subtle)] dark:text-[var(--color-dark-ink-subtle)] uppercase tracking-wider mb-2">
            Status Pipeline (Click to Change)
          </p>
          <div className="grid grid-cols-5 gap-1.5 p-1.5 bg-gray-100 dark:bg-gray-800/60 rounded-xl">
            {STATUS_PIPELINE.map((st) => {
              const isActive = lead.status === st;
              return (
                <button
                  key={st}
                  type="button"
                  disabled={updateStatusMutation.isPending}
                  onClick={() => updateStatusMutation.mutate(st)}
                  className={cn(
                    'py-2 text-center text-xs font-medium rounded-lg transition-all duration-150',
                    isActive
                      ? 'bg-teal-700 text-white shadow-xs font-semibold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  {st}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contact & Meta Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-white dark:bg-[var(--color-dark-card)] space-y-3">
            <p className="text-xs font-semibold text-[var(--color-ink-subtle)] dark:text-[var(--color-dark-ink-subtle)] uppercase tracking-wider">
              Contact Information
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-ink-subtle)] flex items-center gap-1.5">
                  <Mail size={13} /> Email:
                </span>
                <a
                  href={`mailto:${lead.email}`}
                  className="text-teal-700 dark:text-teal-400 hover:underline font-medium"
                >
                  {lead.email}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-ink-subtle)] flex items-center gap-1.5">
                  <Phone size={13} /> Phone:
                </span>
                {lead.phone ? (
                  <a
                    href={`tel:${lead.phone}`}
                    className="text-teal-700 dark:text-teal-400 hover:underline font-medium"
                  >
                    {lead.phone}
                  </a>
                ) : (
                  <span className="text-gray-400">None provided</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-ink-subtle)] flex items-center gap-1.5">
                  <Building size={13} /> Company:
                </span>
                <span className="text-[var(--color-ink)] dark:text-[var(--color-dark-ink)]">
                  {lead.company || 'Individual / None'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-white dark:bg-[var(--color-dark-card)] space-y-3">
            <p className="text-xs font-semibold text-[var(--color-ink-subtle)] dark:text-[var(--color-dark-ink-subtle)] uppercase tracking-wider">
              Service & Assignment
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-ink-subtle)]">Service:</span>
                <span className="font-semibold text-teal-800 dark:text-teal-300">
                  {lead.serviceInterested}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-ink-subtle)] flex items-center gap-1.5">
                  <Calendar size={13} /> Follow-Up:
                </span>
                <span className="text-[var(--color-ink)] dark:text-[var(--color-dark-ink)] font-medium">
                  {formatDate(lead.followUpDate)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-ink-subtle)] flex items-center gap-1.5">
                  <UserCheck size={13} /> Assigned To:
                </span>
                <span className="text-[var(--color-ink)] dark:text-[var(--color-dark-ink)]">
                  {lead.assignedTo?.name || 'Unassigned'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        {lead.notes && (
          <div className="p-4 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-white dark:bg-[var(--color-dark-card)] space-y-2">
            <p className="text-xs font-semibold text-[var(--color-ink-subtle)] dark:text-[var(--color-dark-ink-subtle)] uppercase tracking-wider">
              Notes & Brief
            </p>
            <p className="text-xs text-[var(--color-ink-muted)] dark:text-[var(--color-dark-ink-muted)] whitespace-pre-wrap leading-relaxed">
              {lead.notes}
            </p>
          </div>
        )}

        {/* Quick Add Note Form */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-[var(--color-ink-subtle)] dark:text-[var(--color-dark-ink-subtle)] uppercase tracking-wider">
            Add Quick Note
          </p>
          <div className="flex gap-2">
            <div className="flex-1">
              <Textarea
                placeholder="Log a client interaction, meeting takeaway, or phone update..."
                rows={2}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
            </div>
            <Button
              variant="primary"
              size="md"
              disabled={!newNote.trim() || addNoteMutation.isPending}
              isLoading={addNoteMutation.isPending}
              onClick={() => addNoteMutation.mutate(newNote)}
              className="self-end gap-1.5"
            >
              <Send size={14} /> Log
            </Button>
          </div>
        </div>

        {/* Activity & Audit Trail */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-[var(--color-ink-subtle)] dark:text-[var(--color-dark-ink-subtle)] uppercase tracking-wider">
            Activity Timeline & Audit Trail
          </p>

          {isActivitiesLoading ? (
            <div className="py-6 flex justify-center">
              <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : activities?.length === 0 ? (
            <p className="text-xs text-[var(--color-ink-subtle)] py-3">No activity logs recorded yet.</p>
          ) : (
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-700">
              {activities?.map((act) => (
                <div key={act._id} className="relative group">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-teal-600 ring-4 ring-white dark:ring-gray-900" />
                  <div className="text-xs space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[var(--color-ink)] dark:text-[var(--color-dark-ink)]">
                        {act.message}
                      </span>
                      <span className="text-[10px] text-[var(--color-ink-subtle)]">
                        {formatDateTime(act.createdAt)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--color-ink-subtle)]">
                      By: <span className="font-medium">{act.user?.name || 'System'}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}
