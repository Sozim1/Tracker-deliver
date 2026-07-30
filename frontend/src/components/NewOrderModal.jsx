import { useState } from 'react'

const FORMULARIO_INICIAL = { cliente: '', enderecoEntrega: '' }

export function NewOrderModal({ aberto, aoFechar, aoCriar }) {
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL)
  const [itemAtual, setItemAtual] = useState('')
  const [itens, setItens] = useState([])
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  if (!aberto) return null

  function handleChange(event) {
    const { name, value } = event.target
    setFormulario((atual) => ({ ...atual, [name]: value }))
  }

  function adicionarItem(event) {
    event?.preventDefault()
    const item = itemAtual.trim()
    if (!item) return
    setItens((atuais) => [...atuais, item])
    setItemAtual('')
    setErro('')
  }

  function removerItem(indice) {
    setItens((atuais) => atuais.filter((_, index) => index !== indice))
  }

  function limparEFechar(opcoes = {}) {
    if (salvando && !opcoes.ignorarSalvando) return
    setFormulario(FORMULARIO_INICIAL)
    setItemAtual('')
    setItens([])
    setErro('')
    aoFechar()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')

    if (!formulario.cliente.trim() || !formulario.enderecoEntrega.trim()) {
      setErro('Preencha o cliente e o endereço de entrega.')
      return
    }

    if (itens.length === 0) {
      setErro('Adicione pelo menos um item ao pedido.')
      return
    }

    setSalvando(true)
    try {
      await aoCriar({
        cliente: formulario.cliente.trim(),
        itens,
        enderecoEntrega: formulario.enderecoEntrega.trim(),
      })
      limparEFechar({ ignorarSalvando: true })
    } catch (error) {
      setErro(error.message || 'Não foi possível criar o pedido.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={limparEFechar}>
      <section
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="novo-pedido-titulo"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">Novo registro</p>
            <h2 id="novo-pedido-titulo">Criar novo pedido</h2>
          </div>
          <button className="icon-button" type="button" onClick={limparEFechar} aria-label="Fechar">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="order-form">
          <label className="field-label">
            Cliente
            <input
              name="cliente"
              type="text"
              value={formulario.cliente}
              onChange={handleChange}
              placeholder="Nome do cliente"
              autoFocus
              required
            />
          </label>

          <div className="field-label">
            Itens do pedido
            <div className="item-entry">
              <input
                type="text"
                value={itemAtual}
                onChange={(event) => setItemAtual(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') adicionarItem(event)
                }}
                placeholder="Ex.: 1 hambúrguer"
                aria-label="Novo item"
              />
              <button className="secondary-button" type="button" onClick={adicionarItem}>
                Adicionar
              </button>
            </div>
            {itens.length > 0 && (
              <ul className="item-list">
                {itens.map((item, indice) => (
                  <li key={`${item}-${indice}`}>
                    <span>{item}</span>
                    <button type="button" onClick={() => removerItem(indice)} aria-label={`Remover ${item}`}>
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <label className="field-label">
            Endereço de entrega
            <textarea
              name="enderecoEntrega"
              value={formulario.enderecoEntrega}
              onChange={handleChange}
              placeholder="Rua, número, complemento e bairro"
              rows="3"
              required
            />
          </label>

          {erro && <p className="form-error" role="alert">{erro}</p>}

          <div className="modal-actions">
            <button className="secondary-button" type="button" onClick={limparEFechar} disabled={salvando}>
              Cancelar
            </button>
            <button className="primary-button" type="submit" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Criar pedido'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
