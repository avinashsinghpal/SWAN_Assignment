/**
 * DeleteConfirmModal component.
 * Confirmation modal before deleting a lead or item.
 */

import { AlertTriangle } from 'lucide-react';
import { Modal, ModalFooter } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = 'Delete Lead',
  description = 'Are you sure you want to delete this lead? This action cannot be undone and all associated activity records will be removed.',
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex items-start gap-3 py-2">
        <div className="p-2.5 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 shrink-0">
          <AlertTriangle size={20} />
        </div>
        <p className="text-sm text-[var(--color-ink-muted)] dark:text-[var(--color-dark-ink-muted)] leading-relaxed">
          {description}
        </p>
      </div>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          isLoading={isLoading}
        >
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
}
