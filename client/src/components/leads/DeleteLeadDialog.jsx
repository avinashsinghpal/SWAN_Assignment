import { Dialog } from '../ui/Dialog.jsx';
import { Button } from '../ui/Button.jsx';

export function DeleteLeadDialog({
  open,
  onOpenChange,
  lead,
  onConfirm,
  isDeleting = false,
}) {
  if (!lead) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="DELETE LEAD?"
      description={`Are you sure you want to permanently remove "${lead.name}"? This action will remove the lead record and all of its associated activity timeline logs from the database.`}
    >
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222222]/40 font-mono">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onOpenChange(false)}
          disabled={isDeleting}
        >
          Cancel
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={onConfirm}
          pending={isDeleting}
          pendingLabel="DELETING"
        >
          Delete
        </Button>
      </div>
    </Dialog>
  );
}
