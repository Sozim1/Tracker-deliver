export const STATUS_PEDIDO = [
  { valor: 'RECEBIDO', rotulo: 'Recebido', classe: 'recebido' },
  { valor: 'EM_PREPARO', rotulo: 'Em preparo', classe: 'em-preparo' },
  { valor: 'SAIU_PARA_ENTREGA', rotulo: 'Saiu para entrega', classe: 'saiu-para-entrega' },
  { valor: 'ENTREGUE', rotulo: 'Entregue', classe: 'entregue' },
  { valor: 'CANCELADO', rotulo: 'Cancelado', classe: 'cancelado' },
]

export function detalhesDoStatus(status) {
  return STATUS_PEDIDO.find((item) => item.valor === status) || {
    valor: status,
    rotulo: status || 'Sem status',
    classe: 'desconhecido',
  }
}
