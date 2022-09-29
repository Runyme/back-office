
import http from '@/services/http'

export const SET_LIST_CARTEIRAS = 'setListCarteiras'
export const SET_MESSAGE_ALERT = 'setMessage'
const actions = {


  async listar_carteiras(context) {
    await http.get('carteiras')
      .then(response => context.commit(SET_LIST_CARTEIRAS, response.data.data))
      .catch((error) => context.commit('SET_MESSAGE_ALERT', {
        tipo: 'error', message: error.response.data
      }))
  },

  async vincular_empresa_carteiras(context, params) {
    let message = await  http.post('empresas/' + params.empresa_id + '/add-carteiras', params)
      .then(response => ({ tipo: 'success', message: response.data }))
      .catch((error) => ({ tipo: 'error', message: error.response.data }))
    context.commit([SET_MESSAGE_ALERT], message)

  }
  // async listar_cobranca(context, value) {
  //     await ApiService.get('cobranca')
  //         .then(response => context.commit(SET_LISTA_COBRANCA, response.data))
  //         .catch((error) => context.commit('SET_MESSAGE_ALERT', {
  //             tipo: 'error', message: error.response.data
  //         }))}

};
const mutations = {
  // [SET_LISTA_COBRANCAS](state, value) {
  //     state.lista_cobrancas = value
  // },
  [SET_MESSAGE_ALERT](state, value) {
    console.log(value)
    let customMessage;
    if (typeof value.message === "object") {

      customMessage = value.message.msg;
    }
    state.mensagem_alert = {
      tipo: value.tipo,
      message: customMessage ? customMessage : value.message,
    };
  },
  [SET_LIST_CARTEIRAS](state, value) {
    console.log(value)
    state.lista_carteiras = value
  },


};
const getters = {

}

const state = {
  mensagem_alert: [],
  lista_carteiras: []
};

export default {
  actions,
  getters,
  mutations,
  state,
  namespaced: true,
};


