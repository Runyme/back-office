
import http from '@/services/http'
// import { startsWith } from 'core-js/core/string';

export const SET_EXPORT_SIMULACAO = 'setRelatorioFaturas'
export const SET_MESSAGE_ALERT = 'setMessage'
export const SET_SIMULACAO = 'setSimulacao'
const actions = {
    async exportaSimulacao(context, params) {
        // console.log('oi')
        await http.post('api/simulator/export', params, {
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
    async simulation(context, value) {
        await http.post('api/simulator/calculate', value)
            .then(response => context.commit(SET_SIMULACAO, response.data))
            .catch((error) => context.commit(SET_MESSAGE_ALERT, {
                tipo: 'error', message: error.response.data
            }))
    },
    async satisfacao_create(context, value) {
            let message =   await http.post('/satisfacao', value)
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
    [SET_EXPORT_SIMULACAO](state, value) {
        console.log(value)
        state.relatorio_faturas = value
    },
    [SET_SIMULACAO](state,value){
        state.simulacao = value
    }


};
const getters = {

}

const state = {
    mensagem_alert: [],
    relatorio_faturas: '',
    simulacao:[]
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};


