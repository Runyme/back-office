import { loginRequest } from '@/services/requests/auth'
import store from '@/store/'
import { $snack } from '@/services/snack'
import router from '@/router/'

const state = {
  token: localStorage.getItem('lynx-token')
}

const getters = {
  getIsLogged(state) {
    return !!state.token
  },
  getToken(state){
    return state.token
  }
}

const mutations = {
  SET_TOKEN(state, payload) {
    state.token = payload
  },
  LOGIN(state, payload) {
    store.dispatch('setUser', payload.usuario)
    localStorage.setItem('lynx-token', payload.token)
    state.token = payload.token
    $snack.success('Login feito com sucesso')
    router.push({ name: 'dashboard' })
  },
  LOGOUT(state) {
    localStorage.clear()
    state.token = null
    router.push({ name: 'auth.login' }).catch(err => {})
    store.dispatch('setUser', null)
  },
}

const actions = {
  setToken({commit}, payload) {
    commit('SET_TOKEN', payload)
  },
  login({commit}, payload) {
    return new Promise((resolve, reject) => {
      loginRequest(payload)
        .then(res => {
          commit('LOGIN', res.data)
          resolve()
        })
        .catch(err => reject(err))
    })
  },
  logout({commit}) {
    commit('LOGOUT')
  }
}

export default {
  state,
  getters,
  mutations,
  actions,
};
