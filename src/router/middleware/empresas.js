import { $snack } from '@/services/snack'

export default function empresas({ next, store }) {
  return new Promise((resolve, reject) => {
    if(!store.getters.getEmpresa) {
      $snack.warning('Selecione uma empresa para continuar')
      return reject(next({ name: 'empresas.index' }))
    }
    resolve()
  })
}
