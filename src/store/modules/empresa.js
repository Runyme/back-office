const state = {
  empresa: null,
}

const getters = {
  getEmpresa(state) {
    return state.empresa
  },
}

const mutations = {
  SET_EMPRESA(state, payload) {
    state.empresa = payload
  },
}

const actions = {
  setEmpresa({commit}, payload) {
    commit('SET_EMPRESA', payload)
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}