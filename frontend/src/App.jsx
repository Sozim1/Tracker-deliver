import { AuthPage } from './pages/AuthPage'
import { OrdersPage } from './pages/OrdersPage'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { sessao } = useAuth()
  return sessao ? <OrdersPage /> : <AuthPage />
}
