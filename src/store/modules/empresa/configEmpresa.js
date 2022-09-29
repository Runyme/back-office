

import http from '@/services/http'

export const SET_CAMPOS = 'setCampos'
export const SET_MESSAGE_ALERT = 'setMessage'
export const SET_CARTAO_CREDITO = 'setCartaoCredito'
export const SET_ORBOARDING_SEARCH = 'setOrboardingSearch'
export const SET_CARTAO_CREDITO_DELETADO = 'setCartaoCreditoDeletado'
const actions = {
  atualizar(context, value) {

    context.commit(SET_CAMPOS, value)
  },


  async CreateContasReceberPosCadastro(context, value) {
    let message = await http.post('financeiro/inicio', value)
      .then(response => ({ tipo: 'success', message: response.data }))
      .catch((error) => ({ tipo: 'error', message: error.response.data }))
    context.commit(SET_MESSAGE_ALERT, message)
  },

  async create_cartao_credito(context, value) {
    let message = await http.post('cartaoCredito', value)
      .then(response => ({ tipo: 'success', message: response.data }))
      .catch((error) => ({ tipo: 'error', message: error.response.data }))
    context.commit(SET_MESSAGE_ALERT, message)
  },
  async update_cartao_credito(context, value) {
    let message = await http.put('cartaoCredito/' + value.id, value)
      .then(response => ({ tipo: 'success', message: response.data }))
      .catch((error) => ({ tipo: 'error', message: error.response.data }))
    context.commit(SET_MESSAGE_ALERT, message)
  },


  async listar_cartao_credito(context) {
    await http.get('cartaoCredito')
      .then(response => context.commit(SET_CARTAO_CREDITO, response.data))
      .catch((error) => context.commit(SET_MESSAGE_ALERT, {
        tipo: 'error', message: error.response.data
      }))
  },

  async delete_cartao_credito(context, value) {


    let data = await http.delete('cartaoCredito/' + value.id)
      .then(response => ({ tipo: 'success', message: response.data }))
      .catch((error) => ({ tipo: 'error', message: error.response.data }))
    context.commit(SET_MESSAGE_ALERT, data)
    context.commit(SET_CARTAO_CREDITO_DELETADO, value.id)
  },



  onboardingSearch(context, value) {
    context.commit(SET_ORBOARDING_SEARCH, value)
  }



  // async listar_cobranca(context, value) {
  //     await ApiService.get('cobranca')
  //         .then(response => context.commit(SET_LISTA_COBRANCA, response.data))
  //         .catch((error) => context.commit('SET_MESSAGE_ALERT', {
  //             tipo: 'error', message: error.response.data
  //         }))}

};
const mutations = {

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
  [SET_CAMPOS](state, value) {

    state.lista_campos = value
  },
  [SET_CARTAO_CREDITO](state, value) {
    state.lista_cartao_credito = value
  },
  [SET_ORBOARDING_SEARCH](state, value) {
    state.onboarding_search = value
  },
  [SET_CARTAO_CREDITO_DELETADO](state, value) {

    state.lista_cartao_credito = state.lista_cartao_credito.filter(i => i.id !== value);

  },


};
const getters = {

}

const state = {
  mensagem_alert: [],
  lista_campos: '',
  lista_cartao_credito: [],
  onboarding_search: []
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};


