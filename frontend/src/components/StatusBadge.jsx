import { detalhesDoStatus } from '../constants/status'

export function StatusBadge({ status }) {
  const detalhes = detalhesDoStatus(status)

  return <span className={`status-badge status-${detalhes.classe}`}>{detalhes.rotulo}</span>
}
