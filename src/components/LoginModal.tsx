'use client'

import { AuthForm } from './AuthForm'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  defaultMode?: 'login' | 'register'
}

export function LoginModal({
  open,
  onOpenChange,
  onSuccess,
  defaultMode = 'login',
}: LoginModalProps) {
  const handleSuccess = () => {
    onOpenChange(false)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-8 rounded-3xl border-border shadow-2xl">
        <AuthForm onSuccess={handleSuccess} defaultMode={defaultMode} />
      </DialogContent>
    </Dialog>
  )
}
