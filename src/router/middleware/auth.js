import { usersInfoRequest } from '@/services/requests/users'
import { $snack } from '@/services/snack'

export default function auth({ next, store, Bus }) {
  return new Promise((resolve, reject) => {
    if(!store.getters.getIsLogged) {
      reject(next({ name: 'auth.login' }))
    }
    if(store.getters.getIsLogged && !store.getters.getUser) {
      Bus.globalLoading = true
      return usersInfoRequest()
        .then((res) => {
          store.dispatch('setUser', res.data.data)
          resolve()
        })
        .catch(() => {
          store.dispatch('logout')
          $snack.error('Faça seu login novamente')
          reject(next({ name: 'auth.login' }))
        })
    }
    resolve()
  })
}
