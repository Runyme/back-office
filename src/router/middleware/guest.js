export default function guest({ next, store }) {
  return new Promise((resolve, reject) => {
    if(store.getters.getIsLogged) {
      return reject(next({ name: 'dashboard' }))
    }
    resolve()
  })
}
