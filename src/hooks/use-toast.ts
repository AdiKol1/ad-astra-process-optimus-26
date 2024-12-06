import * as React from "react"
import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  const toast = React.useCallback(
    ({ title, description, variant = 'default' }: ToastProps) => {
      sonnerToast[variant === 'destructive' ? 'error' : 'success'](title, {
        description,
      })
    },
    []
  )

  return { toast }
}

// Export a singleton instance for direct usage
export const toast = ({ title, description, variant = 'default' }: ToastProps) => {
  sonnerToast[variant === 'destructive' ? 'error' : 'success'](title, {
    description,
  })
}