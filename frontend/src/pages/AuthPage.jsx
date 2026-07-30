import { AuthForm } from '../components/AuthForm'
import { useAuth } from '../context/AuthContext'

export function AuthPage() {
  const { autenticar } = useAuth()
  return <AuthForm aoAutenticar={autenticar} />
}
