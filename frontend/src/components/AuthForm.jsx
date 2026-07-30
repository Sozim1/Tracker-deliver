import { useState } from 'react'
import { authService, ApiError } from '../services/api'

const FORMULARIO_INICIAL = { nome: '', email: '', senha: '' }

export function AuthForm({ aoAutenticar }) {
  const [modo, setModo] = useState('entrar')
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const isCadastro = modo === 'cadastrar'

  function trocarModo(novoModo) {
    setModo(novoModo)
    setFormulario(FORMULARIO_INICIAL)
    setErro('')
  }

  function handleChange(event) {
    const { name, value } = event.target
    setFormulario((atual) => ({ ...atual, [name]: value }))
    if (erro) setErro('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')

    if (isCadastro && !formulario.nome.trim()) {
      setErro('Informe seu nome para criar a conta.')
      return
    }

    setCarregando(true)
    try {
      const dados = isCadastro
        ? {
            nome: formulario.nome.trim(),
            email: formulario.email.trim(),
            senha: formulario.senha,
          }
        : { email: formulario.email.trim(), senha: formulario.senha }

      const resposta = isCadastro
        ? await authService.cadastrar(dados)
        : await authService.entrar(dados)

      aoAutenticar(resposta)
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        setErro('E-mail ou senha inválidos.')
      } else {
        setErro(error.message || 'Não foi possível realizar a autenticação.')
      }
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="auth-shell">
      <section className="auth-intro">
        <div className="brand-mark" aria-hidden="true">T</div>
        <p className="eyebrow">Trackr Delivery</p>
        <h1>Acompanhe cada pedido com clareza.</h1>
        <p className="auth-intro-text">
          Um painel direto para organizar o fluxo da sua entrega, do recebimento à chegada.
        </p>
        <div className="intro-decoration" aria-hidden="true">
          <span className="decoration-line" />
          <span className="decoration-dot" />
          <span className="decoration-line decoration-line-short" />
        </div>
      </section>

      <section className="auth-card" aria-label={isCadastro ? 'Cadastro' : 'Login'}>
        <div className="mobile-brand">
          <div className="brand-mark" aria-hidden="true">T</div>
          <span>Trackr Delivery</span>
        </div>
        <div className="auth-heading">
          <p className="eyebrow">Área de acesso</p>
          <h2>{isCadastro ? 'Crie sua conta' : 'Bem-vindo de volta'}</h2>
          <p>
            {isCadastro
              ? 'Cadastre-se para começar a acompanhar seus pedidos.'
              : 'Entre para visualizar e atualizar seus pedidos.'}
          </p>
        </div>

        <div className="auth-toggle" role="tablist" aria-label="Tipo de acesso">
          <button
            type="button"
            className={modo === 'entrar' ? 'active' : ''}
            onClick={() => trocarModo('entrar')}
            role="tab"
            aria-selected={modo === 'entrar'}
          >
            Entrar
          </button>
          <button
            type="button"
            className={modo === 'cadastrar' ? 'active' : ''}
            onClick={() => trocarModo('cadastrar')}
            role="tab"
            aria-selected={modo === 'cadastrar'}
          >
            Cadastrar
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {isCadastro && (
            <label className="field-label">
              Nome
              <input
                name="nome"
                type="text"
                value={formulario.nome}
                onChange={handleChange}
                placeholder="Como podemos te chamar?"
                autoComplete="name"
                required
              />
            </label>
          )}

          <label className="field-label">
            E-mail
            <input
              name="email"
              type="email"
              value={formulario.email}
              onChange={handleChange}
              placeholder="voce@exemplo.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="field-label">
            Senha
            <input
              name="senha"
              type="password"
              value={formulario.senha}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete={isCadastro ? 'new-password' : 'current-password'}
              minLength="6"
              required
            />
          </label>

          {erro && <p className="form-error" role="alert">{erro}</p>}

          <button className="primary-button full-width" type="submit" disabled={carregando}>
            {carregando ? 'Aguarde...' : isCadastro ? 'Criar minha conta' : 'Entrar no painel'}
          </button>
        </form>
      </section>
    </div>
  )
}
