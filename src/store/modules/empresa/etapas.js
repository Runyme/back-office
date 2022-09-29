

import http from '@/services/http'

export const SET_LIST_ETAPAS = 'setListLinkerClientes'
export const SET_ETAPAS = 'setCliLinker'
export const SET_FATURAMENTO = 'setCliFaturamento'
export const SET_ETAPAS_NEW = 'setAtividadeNew'

export const SET_MESSAGE_ALERT = 'setMessage'
const actions = {


    async listar_etapas(context, params) {
        await http.get('etapas')
            .then(response => context.commit(SET_LIST_ETAPAS, response.data))
            .catch((error) => context.commit(SET_MESSAGE_ALERT, {
                tipo: 'error', message: error.response.data
            }))
    },
    async listar_etapa(context, params) {
        await http.get('etapas/' + params)
            .then(response => context.commit(SET_ETAPAS, response.data))
            .catch((error) => context.commit(SET_MESSAGE_ALERT, {
                tipo: 'error', message: error.response.data
            }))
    },

    async create_etapas(context, value) {
        let message = await http.post('etapas', value)
            .then(response => ({ tipo: 'success', message: response.data }))
            .catch((error) => ({ tipo: 'error', message: error.response.data }))
        context.commit(SET_MESSAGE_ALERT, message)
        context.commit(SET_ETAPAS_NEW, message.message.conteudo)



    },
    async update_etapas(context, value) {
        let data = await http.put('etapas/' + value.id, value)
            .then(response => ({ tipo: 'success', message: response.data }))
            .catch((error) => ({ tipo: 'error', message: error.response.data }))
        context.commit(SET_MESSAGE_ALERT, data)


    },
 

    




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
    [SET_LIST_ETAPAS](state, value) {
        state.lista_etapas = value
    },
    [SET_ETAPAS](state, value) {
        state.etapa = value
    },
    [SET_ETAPAS_NEW](state, value) {
        state.etapa.push(value)
    },


};
const getters = {

}

const state = {
    mensagem_alert: [],
    lista_etapas: [],
    etapa: [],
    faturamento: 0
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};


