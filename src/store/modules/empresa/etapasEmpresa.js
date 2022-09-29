

import http from '@/services/http'

export const SET_LIST_ETAPAS_EMPRESAS = 'setListLinkerClientes'
export const SET_ETAPAS_EMPRESA = 'setCliLinker'
export const SET_FATURAMENTO = 'setCliFaturamento'
export const SET_ETAPAS_EMPRESA_NEW = 'setAtividadeNew'

export const SET_MESSAGE_ALERT = 'setMessage'
const actions = {


    async listar_etapas_empresas(context, params) {
        await http.post('etapas_empresas/listagem', params)
            .then(response => context.commit(SET_LIST_ETAPAS_EMPRESAS, response.data))
            .catch((error) => context.commit(SET_MESSAGE_ALERT, {
                tipo: 'error', message: error.response.data
            }))
    },
    async listar_etapa(context, params) {
        await http.get('etapas_empresas/' + params)
            .then(response => context.commit(SET_ETAPAS_EMPRESA, response.data))
            .catch((error) => context.commit(SET_MESSAGE_ALERT, {
                tipo: 'error', message: error.response.data
            }))
    },

    async liberar_etapas(context, value) {

        await http.post('etapas_empresas', value)
            .then(response => context.commit(SET_LIST_ETAPAS_EMPRESAS, response.data))
            .catch((error) => context.commit(SET_MESSAGE_ALERT, {
                tipo: 'error', message: error.response.data
            }))

    },
    async update_etapas_empresa(context, value) {
        await http.put('etapas_empresas/' + value.id, value)
            .then(response => context.commit(SET_LIST_ETAPAS_EMPRESAS, response.data))
            .catch((error) => context.commit(SET_MESSAGE_ALERT, {
                tipo: 'error', message: error.response.data
            }))


    },

    async comentar_etapa_empresa(context, value) {

        let message = await http.post('etapas_empresas/comentar', value)
            .then(response => ({ tipo: 'success', message: response.data }))
            .catch((error) => ({ tipo: 'error', message: error.response.data }))
        context.commit(SET_MESSAGE_ALERT, message)
    },
    async comentarios_etapa_empresa(context, value) {
        let message = await http.put('etapas_empresas/comentarios/' + value.id)
            .then(response => ({ tipo: 'success', message: response.data }))
            .catch((error) => ({ tipo: 'error', message: error.response.data }))
        context.commit(SET_MESSAGE_ALERT, message)



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
    [SET_LIST_ETAPAS_EMPRESAS](state, value) {
        state.lista_etapas_empresas = value
    },
    [SET_ETAPAS_EMPRESA](state, value) {
        state.etapa = value
    },
    [SET_ETAPAS_EMPRESA_NEW](state, value) {
        state.etapa.push(value)
    },


};
const getters = {

}

const state = {
    mensagem_alert: [],
    lista_etapas_empresas: [],
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


