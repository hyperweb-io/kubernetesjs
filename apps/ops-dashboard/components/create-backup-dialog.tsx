
import { AlertCircle, Brain, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AgentProvider } from "agentic-kit";

interface CreateBackupDialogProps {
  backups: any
  open: boolean
  databaseStatus: any
  onOpenChange: (open: boolean) => void
  onSubmit: (method?: string) => Promise<void>
}

export function CreateBackupDialog({backups, open, onOpenChange, onSubmit ,databaseStatus}: CreateBackupDialogProps) {
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
      // Only close dialog on successful submission
      onOpenChange(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create backup')
      // Don't close dialog on error - let user see the error message
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

        <div className="p-4 space-y-3">
          <h2 className="text-lg font-semibold">Protection</h2>
          <div>
            <div className="text-gray-500 text-sm">Continuous Backup</div>
            <div className="font-medium text-sm">{databaseStatus?.backups?.configured ? `Scheduled: ${databaseStatus?.backups?.scheduledCount}, last: ${databaseStatus?.backups?.lastBackupTime || 'n/a'}` : 'Not configured'}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Streaming Replication</div>
            <div className="font-medium text-sm">{databaseStatus?.streaming?.configured ? `${databaseStatus?.streaming?.replicas} replica(s)` : 'Not configured'}</div>
          </div>
          <div className="w-48">
            <Select
              value={methodChoice}
              onValueChange={(value) => setMethodChoice(value as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">
                Auto
                </SelectItem>
                <SelectItem value="barmanObjectStore" disabled={backups.isFetched && backups.data?.methodConfigured !== 'barmanObjectStore'}>
                BarmanObjectStore
                </SelectItem>
                <SelectItem value="volumeSnapshot" disabled={backups.isFetched && !backups.data?.snapshotSupported}>
                VolumeSnapshot
                </SelectItem>
              </SelectContent>
            </Select>
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