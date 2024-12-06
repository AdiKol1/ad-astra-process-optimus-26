import * as React from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

type Toast = ToastProps & {
  id: string;
  open: boolean;
}

type State = {
  toasts: Toast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

const addToast = (state: State, toast: ToastProps): State => {
  const id = genId()
  
  return {
    ...state,
    toasts: [
      {
        ...toast,
        id,
        open: true,
      },
      ...state.toasts,
    ].slice(0, TOAST_LIMIT),
  }
}

const removeToast = (state: State, id: string): State => ({
  ...state,
  toasts: state.toasts.filter((t) => t.id !== id),
})

function useToast() {
  const [state, setState] = React.useState<State>({ toasts: [] })

  const toast = React.useCallback(
    (props: ToastProps) => {
      setState((state) => addToast(state, props))
    },
    []
  )

  const dismiss = React.useCallback((id: string) => {
    setState((state) => removeToast(state, id))
  }, [])

  return {
    toast,
    dismiss,
    toasts: state.toasts,
  }
}

// Create a singleton instance of the toast hook
const { toast } = useToast()

export { useToast, toast }
export type { ToastProps }