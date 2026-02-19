import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface DeleteConfirmDialogProps {
  /** The trigger element (usually a delete button) */
  trigger: React.ReactNode
  /** Name of the item being deleted, shown in the dialog */
  itemName: string
  /** Called when the user confirms deletion */
  onConfirm: () => void | Promise<void>
  /** Whether the delete action is in progress */
  loading?: boolean
}

/**
 * Reusable delete-confirmation dialog that replaces window.confirm().
 * Wrap any trigger element and provide an onConfirm callback.
 */
export function DeleteConfirmDialog({
  trigger,
  itemName,
  onConfirm,
  loading,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={trigger as React.ReactElement} />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete "{itemName}"?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The item will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting…' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
