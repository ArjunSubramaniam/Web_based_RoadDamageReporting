import { BrowserRouter } from 'react-router-dom'
import { ToastViewport } from './components/ToastViewport.jsx'
import { AuthProvider } from './hooks/useAuth.jsx'
import { ToastProvider } from './hooks/useToast.jsx'
import { AppRoutes } from './routes/AppRoutes.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
          <ToastViewport />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
