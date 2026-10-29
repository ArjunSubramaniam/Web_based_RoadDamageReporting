import { useToast } from '../hooks/useToast.jsx'

export function ToastViewport() {
  const { toasts, dismiss } = useToast()
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[70] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => dismiss(toast.id)}
          className={`toast-enter pointer-events-auto rounded-xl border px-4 py-3 text-left text-sm shadow-lg ${
            toast.type === 'error'
              ? 'border-red-200 bg-white text-red-800'
              : toast.type === 'info'
                ? 'border-sky-200 bg-white text-sky-900'
                : 'border-emerald-200 bg-white text-emerald-800'
          }`}
        >
          {toast.message}
        </button>
      ))}
    </div>
  )
}
