import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '@/router/routes'
import store from '@/store/'
import Bus from '@/services/bus'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
  
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('lynx-token')
  if(token) store.dispatch('setToken', token)
  
  if(!to.meta.middleware) return next()
  const middleware = to.meta.middleware

  const context = {
    to,
    from,
    next,
    store,
    Bus
  }

  const runMiddleware = (middleware, index, context) => {
    const actualMiddleware = middleware[index]
    actualMiddleware(context).then(res => {
      const nextMiddleware = middleware[index + 1]
      if(!nextMiddleware) return context.next()
      runMiddleware(middleware, index + 1, context)
    }).catch((err) => console.warn('Você não tem permissão para acessar este endereço', err))
  }

  runMiddleware(middleware, 0, context)
})

router.afterEach((to, from) => {
  Bus.globalLoading = false
  document.title = to.meta.title ? `${to.meta.title} | MedB - Backoffice` : 'MedB - Backoffice'
})

export default router
