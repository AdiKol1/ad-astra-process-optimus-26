import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

export const useToast = () => {
  return {
    toast: ({ title, description, variant = 'default' }: ToastProps) => {
      sonnerToast[variant === 'destructive' ? 'error' : 'success'](title, {
        description,
      })
    }
  }
}

// Also export a direct toast function for non-hook usage
export const toast = ({ title, description, variant = 'default' }: ToastProps) => {
  sonnerToast[variant === 'destructive' ? 'error' : 'success'](title, {
    description,
  })
}