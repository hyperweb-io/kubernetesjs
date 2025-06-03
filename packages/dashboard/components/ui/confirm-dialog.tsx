'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
  loading?: boolean
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'default',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleConfirm = async () => {
    if (onConfirm) {
      setIsLoading(true)
      try {
        await onConfirm()
        onOpenChange(false)
      } catch (error) {
        console.error('Confirm action failed:', error)
      } finally {
        setIsLoading(false)
      }
    } else {
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  // Handle Enter key for confirmation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (open && event.key === 'Enter' && !event.defaultPrevented) {
        event.preventDefault()
        handleConfirm()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onConfirm])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading || isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={loading || isLoading}
          >
            {loading || isLoading ? 'Loading...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}