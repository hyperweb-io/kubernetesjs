'use client'

import * as React from 'react'
import { ConfirmDialog, type ConfirmDialogProps } from '@/components/ui/confirm-dialog'

type ConfirmOptions = Omit<ConfirmDialogProps, 'open' | 'onOpenChange' | 'onConfirm' | 'onCancel'>

interface ConfirmContextValue {
  confirm: (options?: ConfirmOptions) => Promise<boolean>
}

const ConfirmContext = React.createContext<ConfirmContextValue | undefined>(undefined)

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [dialogProps, setDialogProps] = React.useState<ConfirmOptions & { open: boolean }>({
    open: false,
  })
  const [promise, setPromise] = React.useState<{
    resolve: (value: boolean) => void
  } | null>(null)

  const confirm = React.useCallback((options?: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setDialogProps({
        open: true,
        ...options,
      })
      setPromise({ resolve })
    })
  }, [])

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setDialogProps((prev) => ({ ...prev, open: false }))
      promise?.resolve(false)
      setPromise(null)
    }
  }

  const handleConfirm = () => {
    promise?.resolve(true)
    setPromise(null)
    setDialogProps((prev) => ({ ...prev, open: false }))
  }

  const handleCancel = () => {
    promise?.resolve(false)
    setPromise(null)
    setDialogProps((prev) => ({ ...prev, open: false }))
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <ConfirmDialog
        {...dialogProps}
        onOpenChange={handleOpenChange}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const context = React.useContext(ConfirmContext)
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider')
  }
  return context
}

// Simple imperative API for one-off confirmations
export function confirmDialog(options?: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const cleanup = () => {
      const root = (window as any).__confirmDialogRoot
      if (root) {
        root.unmount()
        delete (window as any).__confirmDialogRoot
      }
      document.body.removeChild(container)
    }

    const handleConfirm = () => {
      cleanup()
      resolve(true)
    }

    const handleCancel = () => {
      cleanup()
      resolve(false)
    }

    // Use React 18's createRoot API
    import('react-dom/client').then(({ createRoot }) => {
      const root = createRoot(container)
      ;(window as any).__confirmDialogRoot = root
      
      root.render(
        <ConfirmDialog
          {...options}
          open={true}
          onOpenChange={(open) => {
            if (!open) handleCancel()
          }}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )
    })
  })
}