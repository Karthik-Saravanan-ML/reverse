import { } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  isDestructive = false,
  isLoading = false,
}: ConfirmationDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className={`p-3 rounded-full ${isDestructive ? 'bg-red-100' : 'bg-amber-100'}`}>
          <AlertTriangle className={`w-6 h-6 ${isDestructive ? 'text-status-danger' : 'text-status-warning'}`} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <div className="flex gap-3 w-full pt-2">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant={isDestructive ? 'danger' : 'primary'}
            className="flex-1"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
