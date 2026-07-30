import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [sessao, setSessao] = useState(null)

  function autenticar(resposta) {
    setSessao({
      token: resposta.token,
      nome: resposta.nome,
      email: resposta.email,
    })
  }

  function sair() {
    setSessao(null)
  }

  const valor = useMemo(
    () => ({ sessao, autenticar, sair }),
    [sessao],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) throw new Error('useAuth precisa ser usado dentro de AuthProvider.')
  return contexto
}
