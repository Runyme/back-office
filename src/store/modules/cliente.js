const state = {
  cliente: null
}

const getters = {
  getCliente(state) {
    return state.cliente
  }
}

const mutations = {
  SET_CLIENTE(state, payload) {
    state.cliente = payload
  },
}

const actions = {
  setCliente({commit}, payload) {
    commit('SET_CLIENTE', payload)
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}