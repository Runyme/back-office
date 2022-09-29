import { $snack } from '@/services/snack'

export default function clientes({ next, store }) {
  return new Promise((resolve, reject) => {
    if(!store.getters.getCliente) {
      $snack.warning('Selecione uma cliente para continuar')
      return reject(next({ name: 'clientes.index' }))
    }
    resolve()
  })
}
