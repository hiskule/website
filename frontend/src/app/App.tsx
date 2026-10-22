import { BrowserRouter } from 'react-router-dom'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { AppRoutes } from './routes/AppRoutes'
import { AuthProvider } from '../context/AuthContext'
import { ErrorBoundary } from '../components/common/ErrorBoundary'

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  )
}
