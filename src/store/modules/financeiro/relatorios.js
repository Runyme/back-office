
import http from '@/services/http'

export const SET_RELATORIO_FATURAS = 'setRelatorioFaturas'
export const SET_MESSAGE_ALERT = 'setMessage'
const actions = {
  async gerarRelatorioFaturas(context, params) {
    // console.log('oi')
    await http.post('financeiro/faturas/relatorio', params, {
      responseType: "arraybuffer",
      Authorization: `Bearer ${localStorage.getItem('lynx-token')}`,
    })
      .then((response) => {
        let blob = new Blob([response.data], {
          type: response.headers["content-type"],
        }),
          url = window.URL.createObjectURL(blob);
        window.open(url); // Mostly the same, I was just experimenting with different approaches, tried link.click, iframe and other solutions
      });

  },
  async gerarRelatorioCongelados(context) {

    await http.get('relatorio/congeladas', {
      responseType: "arraybuffer",
      Authorization: `Bearer ${localStorage.getItem('lynx-token')}`,
    })
      .then((response) => {
        let blob = new Blob([response.data], {
          type: response.headers["content-type"],
        }),
          url = window.URL.createObjectURL(blob);
        window.open(url); // Mostly the same, I was just experimenting with different approaches, tried link.click, iframe and other solutions
      });

  },
  async gerarRelatorioCancelados(context) {

    await http.get('relatorio/cancelados', {
      responseType: "arraybuffer",
      Authorization: `Bearer ${localStorage.getItem('lynx-token')}`,
    })
      .then((response) => {
        let blob = new Blob([response.data], {
          type: response.headers["content-type"],
        }),
          url = window.URL.createObjectURL(blob);
        window.open(url); // Mostly the same, I was just experimenting with different approaches, tried link.click, iframe and other solutions
      });

  },
  async gerarRelatorioEmpresaSemCrm(context) {

    await http.get('relatorio/semcrm', {
      responseType: "arraybuffer",
      Authorization: `Bearer ${localStorage.getItem('lynx-token')}`,
    })
      .then((response) => {
        let blob = new Blob([response.data], {
          type: response.headers["content-type"],
        }),
          url = window.URL.createObjectURL(blob);
        window.open(url); // Mostly the same, I was just experimenting with different approaches, tried link.click, iframe and other solutions
      });

  },
  async gerarRelatorioEmpresaSemAlvara(context) {

    await http.get('relatorio/semalvara', {
      responseType: "arraybuffer",
      Authorization: `Bearer ${localStorage.getItem('lynx-token')}`,
    })
      .then((response) => {
        let blob = new Blob([response.data], {
          type: response.headers["content-type"],
        }),
          url = window.URL.createObjectURL(blob);
        window.open(url); // Mostly the same, I was just experimenting with different approaches, tried link.click, iframe and other solutions
      });

  },
  async gerarRelatorioEmpresaSemContrato(context) {

    await http.get('relatorio/semcontrato', {
      responseType: "arraybuffer",
      Authorization: `Bearer ${localStorage.getItem('lynx-token')}`,
    })
      .then((response) => {
        let blob = new Blob([response.data], {
          type: response.headers["content-type"],
        }),
          url = window.URL.createObjectURL(blob);
        window.open(url); // Mostly the same, I was just experimenting with different approaches, tried link.click, iframe and other solutions
      });


  },

  async gerarRelatorioClienteXFatura(context) {

    await http.get('relatorio/clientexfatura', {
      responseType: "arraybuffer",
      Authorization: `Bearer ${localStorage.getItem('lynx-token')}`,
    })
      .then((response) => {
        let blob = new Blob([response.data], {
          type: response.headers["content-type"],
        }),
          url = window.URL.createObjectURL(blob);
        window.open(url); // Mostly the same, I was just experimenting with different approaches, tried link.click, iframe and other solutions
      });

  },
  
  async gerarRelatorioClienteXFaturaCartao(context) {

    await http.get('relatorio/clientexfaturaCartao', {
      responseType: "arraybuffer",
      Authorization: `Bearer ${localStorage.getItem('lynx-token')}`,
    })
      .then((response) => {
        let blob = new Blob([response.data], {
          type: response.headers["content-type"],
        }),
          url = window.URL.createObjectURL(blob);
        window.open(url); // Mostly the same, I was just experimenting with different approaches, tried link.click, iframe and other solutions
      });
    },

  async  gerarRelatorioComissao(context,value) {

      await http.post('relatorio/comissoes',value, {
        responseType: "arraybuffer",
        Authorization: `Bearer ${localStorage.getItem('lynx-token')}`,
      })
        .then((response) => {
          let blob = new Blob([response.data], {
            type: response.headers["content-type"],
          }),
            url = window.URL.createObjectURL(blob);
          window.open(url); // Mostly the same, I was just experimenting with different approaches, tried link.click, iframe and other solutions
        });
      },

    async  gerarRelatorioAberturaDays(context,value) {
      await http.post('relatorio/abertura/dias',value, {
        responseType: "arraybuffer",
        Authorization: `Bearer ${localStorage.getItem('lynx-token')}`,
      })
        .then((response) => {
          let blob = new Blob([response.data], {
            type: response.headers["content-type"],
          }),
            url = window.URL.createObjectURL(blob);
          window.open(url); // Mostly the same, I was just experimenting with different approaches, tried link.click, iframe and other solutions
        });
      },

     async gerarRelatorioPoscadastro(context,value) {
        await http.get('/empresas/poscadastro/relatorio',value, {
          responseType: "arraybuffer",
          Authorization: `Bearer ${localStorage.getItem('lynx-token')}`,
        })
        .then((response) => {
          let blob = new Blob([response.data], {
            type: response.headers["content-type"],
          }),
            url = window.URL.createObjectURL(blob);
          window.open(url); // Mostly the same, I was just experimenting with different approaches, tried link.click, iframe and other solutions
        });
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
    [SET_RELATORIO_FATURAS](state, value) {
      console.log(value)
      state.relatorio_faturas = value
    },


  };
  const getters = {

  }

const state = {
    mensagem_alert: [],
    relatorio_faturas: ''
  };

  export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
  };


