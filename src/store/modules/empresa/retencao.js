

import http from '@/services/http'

export const SET_LIST_RETENCOES = 'setListRetencoes'
export const SET_RETENCAO = 'setCliLinker'
export const SET_FATURAMENTO = 'setCliFaturamento'
export const SET_RETENCAO_NEW = 'setAtividadeNew'
export const SET_RETENCAO_REMOCAO = 'setRetencaoRemocao'
export const SET_RETENCAO_ATUALIZACAO = 'setRetencaoAtualizacao'

export const SET_MESSAGE_ALERT = 'setMessage'
const actions = {


    async listar_retencoes(context) {
        await http.get('retencao')
            .then(response => context.commit(SET_LIST_RETENCOES, response.data))
            .catch((error) => context.commit(SET_MESSAGE_ALERT, {
                tipo: 'error', message: error.response.data
            }))
    },
    async listar_retencao(context, params) {
        await http.get('retencao/' + params)
            .then(response => context.commit(SET_RETENCAO, response.data))
            .catch((error) => context.commit(SET_MESSAGE_ALERT, {
                tipo: 'error', message: error.response.data
            }))
    },

    async create_retencao(context, value) {
        let message = await http.post('retencao', value)
            .then(response => ({ tipo: 'success', message: response.data }))
            .catch((error) => ({ tipo: 'error', message: error.response.data }))
        context.commit(SET_MESSAGE_ALERT, message)
        context.commit(SET_RETENCAO_NEW, message.message.conteudo)

    },
    
    async update_retencao(context, value) {
        let data = await http.put('retencao/' + value.id, value)
        .then(response => ({ tipo: 'success', message: response.data }))
        .catch((error) => ({ tipo: 'error', message: error.response.data }))

    context.commit(SET_MESSAGE_ALERT, data)
    // context.commit(SET_RETENCAO_ATUALIZACAO, value)
    },

    async delete_retencao(context, id) {
        let data = await http.delete('retencao/'+id)
        .then(response => ({ tipo: 'success', message: response.data }))
        .catch((error) => ({ tipo: 'error', message: error.response.data }))
    context.commit(SET_MESSAGE_ALERT, data)
    context.commit(SET_RETENCAO_REMOCAO, id)
    },
     set_retencao(context,value){
        context.commit(SET_RETENCAO, value)

     }
};
const mutations = {
    [SET_MESSAGE_ALERT](state, value) {
        // console.log(value)
        let customMessage;
        if (typeof value.message === "object") {

            customMessage = value.message.msg;
        }
        state.mensagem_alert = {
            tipo: value.tipo,
            message: customMessage ? customMessage : value.message,
        };
    },
    [SET_LIST_RETENCOES](state, value) {
        state.lista_retencoes = value
    },
    [SET_RETENCAO](state, value) {
        state.retencao = value
    },
    [SET_RETENCAO_NEW](state, value) {
        state.lista_retencoes.push(value)
    },
    [SET_FATURAMENTO](state, value) {
        state.faturamento = value
    },
    // [SET_RETENCAO_ATUALIZACAO](state, value) {
    //      state.lista_retencoes.filter(i => i.id === value.id).map(o => Object.assign(o,value ))
    // },
    [SET_RETENCAO_REMOCAO](state, value) {
        state.lista_retencoes = state.lista_retencoes.filter(i => i.id !== value);
    },
};
const getters = {

}

const state = {
    mensagem_alert: [],
    lista_retencoes: [],
    retencao: {},
    faturamento: 0
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};


