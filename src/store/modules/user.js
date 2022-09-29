const state = {
  user: null
}

const getters = {
  getUser(state) {
    return state.user
  },
  getUserFirstName(state) {
    return state.user.nome_completo.split(' ')[0]
  }
}

const mutations = {
  SET_USER(state, payload) {
    state.user = payload
  },
}

const actions = {
  setUser({commit}, payload) {
    commit('SET_USER', payload)
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
};