import { useCallback, useEffect, useState } from 'react'
import { NewOrderModal } from '../components/NewOrderModal'
import { PedidoCard } from '../components/PedidoCard'
import { useAuth } from '../context/AuthContext'
import { ApiError, pedidosService } from '../services/api'

function formatarData(data) {
  if (!data) return '—'
  const dataConvertida = new Date(data)
  if (Number.isNaN(dataConvertida.getTime())) return data

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(dataConvertida)
}

export function OrdersPage() {
  const { sessao, sair } = useAuth()
  const [pedidos, setPedidos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [erroStatus, setErroStatus] = useState('')
  const [aviso, setAviso] = useState('')
  const [atualizandoId, setAtualizandoId] = useState(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [idBusca, setIdBusca] = useState('')
  const [pedidoBuscado, setPedidoBuscado] = useState(null)
  const [buscando, setBuscando] = useState(false)
  const [erroBusca, setErroBusca] = useState('')
  const [buscaRealizada, setBuscaRealizada] = useState(false)

  const carregarPedidos = useCallback(async () => {
    setCarregando(true)
    setErro('')
    try {
      const resposta = await pedidosService.listar(sessao.token)
      setPedidos(Array.isArray(resposta) ? resposta : [])
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        sair()
        return
      }
      setErro(error.message || 'Não foi possível carregar os pedidos.')
    } finally {
      setCarregando(false)
    }
  }, [sair, sessao.token])

  useEffect(() => {
    carregarPedidos()
  }, [carregarPedidos])

  async function buscarPedido(event) {
    event.preventDefault()
    const id = idBusca.trim()

    setErroBusca('')
    setPedidoBuscado(null)

    if (!id) {
      setBuscaRealizada(false)
      setErroBusca('Informe o ID do pedido para realizar a busca.')
      return
    }

    setBuscando(true)
    setBuscaRealizada(true)
    try {
      const pedido = await pedidosService.buscarPorId(sessao.token, id)
      setPedidoBuscado(pedido)
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        sair()
        return
      }

      if (error instanceof ApiError && error.status === 404) {
        setErroBusca(`Nenhum pedido encontrado com o ID ${id}.`)
      } else {
        setErroBusca(error.message || 'Não foi possível buscar o pedido.')
      }
    } finally {
      setBuscando(false)
    }
  }

  function limparBusca() {
    setIdBusca('')
    setPedidoBuscado(null)
    setErroBusca('')
    setBuscaRealizada(false)
  }

  async function atualizarStatus(id, status) {
    setAtualizandoId(id)
    setErroStatus('')
    setAviso('')
    try {
      const pedidoAtualizado = await pedidosService.atualizarStatus(sessao.token, id, status)
      setPedidos((atuais) =>
        atuais.map((pedido) => (pedido.id === id ? pedidoAtualizado : pedido)),
      )
      setPedidoBuscado((atual) => (atual?.id === id ? pedidoAtualizado : atual))
      setAviso(`Status do pedido #${id} atualizado.`)
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        sair()
        return
      }
      setErroStatus(error.message || 'Não foi possível atualizar o status.')
    } finally {
      setAtualizandoId(null)
    }
  }

  async function criarPedido(dados) {
    setAviso('')
    try {
      const pedidoCriado = await pedidosService.criar(sessao.token, dados)
      setPedidos((atuais) => [pedidoCriado, ...atuais])
      setAviso('Pedido criado com sucesso.')
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        sair()
      }
      throw error
    }
  }

  const primeiroNome = sessao.nome?.split(' ')[0] || 'Olá'

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand-lockup">
            <div className="brand-mark" aria-hidden="true">T</div>
            <div>
              <strong>Trackr</strong>
              <span>Delivery</span>
            </div>
          </div>
          <div className="user-actions">
            <div className="user-greeting">
              <span>Olá, {primeiroNome}</span>
              <small>{sessao.email}</small>
            </div>
            <button className="logout-button" type="button" onClick={sair}>
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Operação</p>
            <h1>Seus pedidos</h1>
            <p className="page-subtitle">Acompanhe e mantenha o status das entregas atualizado.</p>
          </div>
          <button className="primary-button" type="button" onClick={() => setModalAberto(true)}>
            <span aria-hidden="true">+</span> Novo pedido
          </button>
        </div>

        {aviso && <p className="feedback feedback-success" role="status">{aviso}</p>}
        {erroStatus && <p className="feedback feedback-error" role="alert">{erroStatus}</p>}

        <section className="orders-section search-section" aria-labelledby="buscar-pedido-titulo">
          <div className="section-heading">
            <div>
              <h2 id="buscar-pedido-titulo">Buscar pedido por ID</h2>
              <span>Consulte os detalhes e o status de um pedido específico.</span>
            </div>
          </div>

          <form className="search-form" onSubmit={buscarPedido}>
            <label className="field-label search-field">
              ID do pedido
              <input
                type="text"
                value={idBusca}
                onChange={(event) => {
                  setIdBusca(event.target.value)
                  if (erroBusca) setErroBusca('')
                }}
                placeholder="Ex.: 42"
                inputMode="numeric"
                aria-label="ID do pedido"
              />
            </label>
            <div className="search-actions">
              <button className="primary-button" type="submit" disabled={buscando}>
                {buscando ? 'Buscando...' : 'Buscar'}
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={limparBusca}
                disabled={buscando || (!idBusca && !pedidoBuscado && !buscaRealizada && !erroBusca)}
              >
                Limpar
              </button>
            </div>
          </form>

          {buscando && (
            <div className="state-card search-state" role="status">
              <span className="spinner" aria-hidden="true" />
              <p>Buscando pedido...</p>
            </div>
          )}

          {!buscando && erroBusca && (
            <p className="feedback-error search-feedback" role="alert">{erroBusca}</p>
          )}

          {!buscando && pedidoBuscado && (
            <div className="pedidos-lista search-result">
              <PedidoCard
                pedido={pedidoBuscado}
                atualizandoId={atualizandoId}
                aoAtualizarStatus={atualizarStatus}
                formatarData={formatarData}
              />
            </div>
          )}
        </section>

        <section className="orders-section" aria-labelledby="lista-pedidos-titulo">
          <div className="section-heading">
            <div>
              <h2 id="lista-pedidos-titulo">Lista de pedidos</h2>
              {!carregando && <span>{pedidos.length} {pedidos.length === 1 ? 'pedido' : 'pedidos'}</span>}
            </div>
            <button className="refresh-button" type="button" onClick={carregarPedidos} disabled={carregando}>
              <span aria-hidden="true">↻</span> Atualizar
            </button>
          </div>

          {carregando && (
            <div className="state-card" role="status">
              <span className="spinner" aria-hidden="true" />
              <p>Carregando seus pedidos...</p>
            </div>
          )}

          {!carregando && erro && (
            <div className="state-card state-error" role="alert">
              <div className="state-icon" aria-hidden="true">!</div>
              <h3>Não foi possível carregar os pedidos</h3>
              <p>{erro}</p>
              <button className="secondary-button" type="button" onClick={carregarPedidos}>
                Tentar novamente
              </button>
            </div>
          )}

          {!carregando && !erro && pedidos.length === 0 && (
            <div className="state-card">
              <div className="state-icon state-icon-soft" aria-hidden="true">＋</div>
              <h3>Você ainda não tem pedidos</h3>
              <p>Crie o primeiro pedido para começar a acompanhar sua operação.</p>
              <button className="primary-button" type="button" onClick={() => setModalAberto(true)}>
                Criar primeiro pedido
              </button>
            </div>
          )}

          {!carregando && !erro && pedidos.length > 0 && (
            <div className="pedidos-lista">
              {pedidos.map((pedido) => (
                <PedidoCard
                  key={pedido.id}
                  pedido={pedido}
                  atualizandoId={atualizandoId}
                  aoAtualizarStatus={atualizarStatus}
                  formatarData={formatarData}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <NewOrderModal
        aberto={modalAberto}
        aoFechar={() => setModalAberto(false)}
        aoCriar={criarPedido}
      />
    </div>
  )
}
