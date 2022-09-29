
import http from '@/services/http'

export const SET_RELATORIO_EMPRESAS = 'setRelatorioFaturas'
export const SET_MESSAGE_ALERT = 'setMessage'
const actions = {
  async gerarRelatorioEmpresa(context, params) {
    // console.log('oi')
    await http.post('empresas/status/relatorio', params, {
      responseType: "arraybuffer",
      Authorization: `Bearer ${localStorage.getItem('lynx-token')}`,
    })
      .then((response) => {
        console.log(response);

        let blob = new Blob([response.data], {
          type: response.headers["content-type"],
        }),
          url = window.URL.createObjectURL(blob);

        window.open(url); // Mostly the same, I was just experimenting with different approaches, tried link.click, iframe and other solutions
      });
  },
  async gerarRelatorioAlvara(context, params) {
    // console.log('oi')
    await http.post('empresas/alvaras/relatorio', params, {
      responseType: "arraybuffer",
      Authorization: `Bearer ${localStorage.getItem('lynx-token')}`,
    })
      .then((response) => {
        console.log(response);

        let blob = new Blob([response.data], {
          type: response.headers["content-type"],
        }),
          url = window.URL.createObjectURL(blob);

        window.open(url); // Mostly the same, I was just experimenting with different approaches, tried link.click, iframe and other solutions
      });

  },

  async gerarRelatorioIndicacao(context, params) {
    // console.log('oi')
    await http.post('invites/relatorio', params, {
      responseType: "arraybuffer",
      Authorization: `Bearer ${localStorage.getItem('lynx-token')}`,
    })
      .then((response) => {
        console.log(response);

        let blob = new Blob([response.data], {
          type: response.headers["content-type"],
        }),
          url = window.URL.createObjectURL(blob);

        window.open(url); // Mostly the same, I was just experimenting with different approaches, tried link.click, iframe and other solutions
      });

  },

  async  empresa_status_ativa(context, value) {
    let message = await http.post('empresas/empresa-status-ativar', value)
      .then(response => ({ tipo: 'success', message: response.data }))
      .catch((error) => ({ tipo: 'error', message: error.response.data }))
    context.commit(SET_MESSAGE_ALERT, message)
  },
  
  async  resetSenha(context, value) {
    let message = await http.put('clientes/'+value.cliente_id+'/reset-senha' )
      .then(response => ({ tipo: 'success', message: response.data }))
      .catch((error) => ({ tipo: 'error', message: error.response.data }))
    context.commit(SET_MESSAGE_ALERT, message)
  },

  async exclusaoIrpf(context, value) {
    let message = await http.put('irpf/exclusao/'+value.id )
      .then(response => ({ tipo: 'success', message: response.data }))
      .catch((error) => ({ tipo: 'error', message: error.response.data }))
    context.commit(SET_MESSAGE_ALERT, message)
  },

  


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
  [SET_RELATORIO_EMPRESAS](state, value) {
    console.log(value)
    state.relatorio_empresas = value
  },


};
const getters = {

}

const state = {
  mensagem_alert: [],
  relatorio_empresas: ''
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};


