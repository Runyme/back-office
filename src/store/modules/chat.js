import store from '@/store/'

const getDefaultState = () => {
  return {
    socketConnection: null,
    isConnected: false,
    loadingAttendances: false,
    attendances: [],
    currentAttendance: {},
    currentMessages: [],
  }
}

const state = getDefaultState()

const getters = {
  getChatSocketConnection(state) {
    return state.socketConnection
  },
  getChatLoadingAttendances(state) {
    return state.loadingAttendances
  },
  getChatAttendances(state) {
    return state.attendances
  },
  getIsConnected(state) {
    return state.isConnected
  },
  getChatCurrentAttendance(state) {
    return state.currentAttendance
  },
  getChatCurrentMessages(state) {
    return state.currentMessages
  },
}

const mutations = {
  resetState(state) {
    Object.assign(state, getDefaultState())
  },
  SET_CHAT_SOCKET_CONNECTION(state, payload) {
    state.socketConnection = payload
  },
  CHAT_SOCKET_CONNECT(state) {
    state.isConnected = true
  },
  CHAT_SOCKET_DISCONNECT(state) {
    state.isConnected = false
  },
  SET_CHAT_LOADING_ATTENDANCES(state, payload) {
    state.loadingAttendances = payload
  },
  SET_CHAT_ATTENDANCES(state, payload) {
    state.attendances = payload
  },
  SET_CHAT_CURRENT_ATTENDANCES(state, payload) {
    state.currentAttendance = payload
  },
  SET_CHAT_CURRENT_MESSAGES(state, payload) {
    state.currentMessages = payload
  },
  SET_CHAT_CURRENTS(state, payload) {
    const connection = state.socketConnection
    store.dispatch('setChatCurrentAttendance', payload)
    connection.emit('getPreviousMessages', {attendance: payload})
  },
  CHAT_ADD_MESSAGE(state, payload) {
    const attendanceId = payload.attendanceId
    if (attendanceId === state.currentAttendance.id) state.currentMessages.push(payload)
  },
  SET_CHAT_LAST_MESSAGE(state, payload) {
    state.attendances.forEach(curr => {
      if (curr.id === payload.attendanceId) curr.lastMessage = payload
    })
  }
}

const actions = {
  resetCartState({commit}) {
    commit('resetState')
  },
  setChatSocketConnection({commit}, payload) {
    commit('SET_CHAT_SOCKET_CONNECTION', payload)
  },
  chatSocketConnect({commit}) {
    commit('CHAT_SOCKET_CONNECT')
  },
  chatSocketDisconnect({commit}) {
    commit('CHAT_SOCKET_DISCONNECT')
  },
  setChatLoadingAttendances({commit}, payload) {
    commit('SET_CHAT_LOADING_ATTENDANCES', payload)
  },
  setChatAttendances({commit}, payload) {
    commit('SET_CHAT_ATTENDANCES', payload)
  },
  setChatCurrentAttendance({commit}, payload) {
    commit('SET_CHAT_CURRENT_ATTENDANCES', payload)
  },
  setChatCurrentMessages({commit}, payload) {
    commit('SET_CHAT_CURRENT_MESSAGES', payload)
  },
  setChatCurrents({commit}, payload) {
    commit('SET_CHAT_CURRENTS', payload)
  },
  chatAddMessage({commit}, payload) {
    commit('CHAT_ADD_MESSAGE', payload)
  },
  setChatLastMessage({commit}, payload) {
    commit('SET_CHAT_LAST_MESSAGE', payload)
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
};
