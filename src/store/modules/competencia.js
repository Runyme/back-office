import moment from 'moment'

const state = {
  date: null
}

const getters = {
  getCompetenciaDate(state) {
    const date = state.date || localStorage.getItem('lynx-competencia-date')
    return date || moment().subtract(1, 'months').format('YYYY-MM-01')
  }
}

const mutations = {
  SET_COMPETENCIA_DATE(state, payload) {
    localStorage.setItem('lynx-competencia-date', payload)
    state.date = payload
  }
}

const actions = {
  setCompetenciaDate({commit}, payload) {
    commit('SET_COMPETENCIA_DATE', payload)
  }
}

export default {
  state,
  getters,
  mutations,
  actions,
};
