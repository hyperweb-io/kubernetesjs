
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

interface CreateBackupDialogProps {
  backups: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (method?: string) => Promise<void>
}

export function CreateBackupDialog({backups, open, onOpenChange, onSubmit }: CreateBackupDialogProps) {
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [methodChoice, setMethodChoice] = useState<'auto'|'barmanObjectStore'|'volumeSnapshot'>('auto');
  const handleCancel = () => {
    setError(null)
    onOpenChange(false)
  }

  const handleSubmit = async (methodParam?: string) => {
    setError(null)
    setIsSubmitting(true)
    try {
      await onSubmit(methodParam)
      onOpenChange(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create backup')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl flex flex-col">
        <DialogHeader>
          <DialogTitle>Create Backup</DialogTitle>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="pt-2">
          <div className="flex items-center gap-2">
            <select
              className="border rounded px-2 py-1 text-sm"
              value={methodChoice}
              onChange={(e) => setMethodChoice(e.target.value as any)}
            >
              <option value="auto">Auto</option>
              <option value="barmanObjectStore" disabled={backups.isFetched && backups.data?.methodConfigured !== 'barmanObjectStore'}>
                barmanObjectStore
              </option>
              <option value="volumeSnapshot" disabled={backups.isFetched && !backups.data?.snapshotSupported}>
                volumeSnapshot
              </option>
            </select>
            
          </div>
        </div>
       
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
              className="px-3 py-1 rounded bg-primary text-white disabled:opacity-50"
              disabled={
                isSubmitting ||
                (backups.isFetched && (
                  (methodChoice === 'auto' && !(backups.data?.configured || backups.data?.snapshotSupported)) ||
                  (methodChoice === 'barmanObjectStore' && backups.data?.methodConfigured !== 'barmanObjectStore') ||
                  (methodChoice === 'volumeSnapshot' && !backups.data?.snapshotSupported)
                ))
              }
              onClick={() => {
                const methodParam = methodChoice === 'auto' ? undefined : methodChoice;
                handleSubmit(methodParam)
              }}
              title={(() => {
                if (!backups.isFetched) return 'Create on-demand backup';
                if (methodChoice === 'auto' && !(backups.data?.configured || backups.data?.snapshotSupported)) return 'Configure backups (barman) or install VolumeSnapshot CRDs';
                if (methodChoice === 'barmanObjectStore' && backups.data?.methodConfigured !== 'barmanObjectStore') return 'Cluster is not configured for barman backups';
                if (methodChoice === 'volumeSnapshot' && !backups.data?.snapshotSupported) return 'VolumeSnapshot CRDs/CSI not available';
                return 'Create on-demand backup';
              })()}
            >
              {isSubmitting ? 'Creating…' : 'Create Backup'}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}