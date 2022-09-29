

import http from '@/services/http'

export const SET_LIST_CLIENTES_LINKER = 'setListLinkerClientes'
export const SET_CLIENTE_LINKER = 'setCliLinker'
export const SET_CLIENTE_FATURAMENTO = 'setCliFaturamento'

export const SET_MESSAGE_ALERT = 'setMessage'
const actions = {


    async listar_clientes_linker(context, params) {
        await http.get('api/linker')
            .then(response => context.commit(SET_LIST_CLIENTES_LINKER, response.data))
            .catch((error) => context.commit(SET_MESSAGE_ALERT, {
                tipo: 'error', message: error.response.data
            }))
    },
    async listar_cliente_linker(context, params) {
        await http.get('api/linker/'+params)
            .then(response => context.commit(SET_CLIENTE_LINKER, response.data))
            .catch((error) => context.commit(SET_MESSAGE_ALERT, {
                tipo: 'error', message: error.response.data
            }))
    },
    async get_faturamento(context, params) {
        await http.post('api/linker/faturamento', params)
            .then(response => context.commit(SET_CLIENTE_FATURAMENTO, response.data))
            .catch((error) => context.commit(SET_MESSAGE_ALERT, {
                tipo: 'error', message: error.response.data
            }))
    },

    async create_cliente_linker(context, value) {
        let message = await http.post('api/linker', value)
            .then(response => ({ tipo: 'success', message: response.data }))
            .catch((error) => ({ tipo: 'error', message: error.response.data }))
        context.commit(SET_MESSAGE_ALERT, message)
    },
    async update_cliente_linker(context, value) {
        let data = await http.put('api/linker/' + value.id, value)
            .then(response => ({ tipo: 'success', message: response.data }))
            .catch((error) => ({ tipo: 'error', message: error.response.data }))
        context.commit(SET_MESSAGE_ALERT, data)


    },
    async permissao_pagamentos_cliente_linker(context, value) {
        let data = await http.put('api/linker/requestTokenPayments/' + value.id, value)
            .then(response => ({ tipo: 'success', message: response.data }))
            .catch((error) => ({ tipo: 'error', message: error.response.data }))
        context.commit(SET_MESSAGE_ALERT, data)
    },
    async permissao_extrato_cliente_linker(context, value) {
        let data = await http.put('api/linker/requestTokenExtrato/' + value.id, value)
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

            customMessage = value.message.message;
        }
        state.mensagem_alert = {
            tipo: value.tipo,
            message: customMessage ? customMessage : value.message,
        };
    },
    [SET_LIST_CLIENTES_LINKER](state, value) {
        state.lista_clientes_linker = value
    },
    [SET_CLIENTE_LINKER](state, value) {
        state.cliente_linker = value
    },
    
    [SET_CLIENTE_FATURAMENTO](state, value) {
        state.faturamento = value
    },


};
const getters = {

}

const state = {
    mensagem_alert: [],
    lista_clientes_linker: '',
    cliente_linker:{},
    faturamento: 0
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};


