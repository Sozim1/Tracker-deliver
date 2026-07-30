import { STATUS_PEDIDO } from '../constants/status'
import { StatusBadge } from './StatusBadge'

export function PedidoCard({ pedido, atualizandoId, aoAtualizarStatus, formatarData }) {
  const atualizando = atualizandoId === pedido.id

  return (
    <article className="pedido-card">
      <div className="pedido-card-top">
        <div>
          <span className="pedido-label">Pedido</span>
          <h3>#{pedido.id}</h3>
        </div>
        <StatusBadge status={pedido.status} />
      </div>

      <div className="pedido-info-grid">
        <div className="pedido-info">
          <span>Cliente</span>
          <strong>{pedido.cliente}</strong>
        </div>
        <div className="pedido-info">
          <span>Criado em</span>
          <strong>{formatarData(pedido.criadoEm)}</strong>
        </div>
        <div className="pedido-info pedido-info-wide">
          <span>Itens</span>
          <strong>{pedido.itens?.join(', ') || 'Nenhum item informado'}</strong>
        </div>
        <div className="pedido-info pedido-info-wide">
          <span>Endereço de entrega</span>
          <strong>{pedido.enderecoEntrega}</strong>
        </div>
      </div>

      <div className="pedido-card-footer">
        <label className="status-control">
          <span>Atualizar status</span>
          <select
            value={pedido.status}
            onChange={(event) => aoAtualizarStatus(pedido.id, event.target.value)}
            disabled={atualizando}
            aria-label={`Atualizar status do pedido ${pedido.id}`}
          >
            {STATUS_PEDIDO.map((status) => (
              <option key={status.valor} value={status.valor}>
                {status.rotulo}
              </option>
            ))}
          </select>
        </label>
        {atualizando && <span className="inline-loading">Atualizando...</span>}
      </div>
    </article>
  )
}
