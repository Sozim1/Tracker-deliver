const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

function mensagemDoErro(dados, status) {
  if (dados && typeof dados === 'object') {
    if (typeof dados.erro === 'string') return dados.erro

    const mensagensDeCampo = Object.values(dados).filter(
      (mensagem) => typeof mensagem === 'string',
    )
    if (mensagensDeCampo.length > 0) return mensagensDeCampo.join(' ')
  }

  if (status === 401 || status === 403) return 'Sua sessão expirou. Entre novamente para continuar.'
  return 'Não foi possível concluir a operação.'
}

async function requisicao(endpoint, { token, ...opcoes } = {}) {
  const headers = new Headers(opcoes.headers)
  headers.set('Accept', 'application/json')

  if (opcoes.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) headers.set('Authorization', `Bearer ${token}`)

  let resposta
  try {
    resposta = await fetch(`${API_URL}${endpoint}`, { ...opcoes, headers })
  } catch {
    throw new ApiError(
      'Não foi possível conectar à API. Verifique se o backend está rodando em http://localhost:8080.',
      0,
    )
  }

  const texto = await resposta.text()
  let dados = null
  if (texto) {
    try {
      dados = JSON.parse(texto)
    } catch {
      dados = texto
    }
  }

  if (!resposta.ok) {
    throw new ApiError(mensagemDoErro(dados, resposta.status), resposta.status, dados)
  }

  return dados
}

export const authService = {
  entrar: (dados) =>
    requisicao('/auth/login', {
      method: 'POST',
      body: JSON.stringify(dados),
    }),

  cadastrar: (dados) =>
    requisicao('/auth/registrar', {
      method: 'POST',
      body: JSON.stringify(dados),
    }),
}

export const pedidosService = {
  listar: (token) => requisicao('/pedidos', { token }),

  criar: (token, dados) =>
    requisicao('/pedidos', {
      method: 'POST',
      token,
      body: JSON.stringify(dados),
    }),

  atualizarStatus: (token, id, status) =>
    requisicao(`/pedidos/${id}/status`, {
      method: 'PATCH',
      token,
      body: JSON.stringify({ status }),
    }),
}
