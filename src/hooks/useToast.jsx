import { createContext, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const value = useMemo(
    () => ({
      toasts,
      push: (message, type = 'success') => {
        const id = crypto.randomUUID()
        setToasts((list) => [...list, { id, message, type }])
        setTimeout(() => {
          setToasts((list) => list.filter((item) => item.id !== id))
        }, 3200)
      },
      dismiss: (id) => setToasts((list) => list.filter((item) => item.id !== id)),
    }),
    [toasts],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
