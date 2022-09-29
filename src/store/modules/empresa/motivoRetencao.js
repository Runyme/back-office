

import http from '@/services/http'

export const SET_LIST_MOTIVO_RETENCOES = 'setListMotivoRetencaoClientes'
export const SET_MOTIVO_RETENCAO_ATUALIZACAO = 'setMotivoRetencaoUp'
export const SET_MOTIVO_RETENCAO = 'setMotivoRetencao'
export const SET_MOTIVO_RETENCAO_NEW = 'setMotivoRetencaoNew'
export const SET_MOTIVO_RETENCAO_REMOCAO = 'setMotivoRetencaoRemocao'

export const SET_MESSAGE_ALERT = 'setMessage'
const actions = {


    async listar_motivo_retencoes(context, params) {
        await http.get('motivo_retencao')
            .then(response => context.commit(SET_LIST_MOTIVO_RETENCOES, response.data))
            .catch((error) => context.commit(SET_MESSAGE_ALERT, {
                tipo: 'error', message: error.response.data
            }))
    },
    async listar_motivo_retencao(context, params) {
        await http.get('motivo_retencao/' + params)
            .then(response => context.commit(SET_MOTIVO_RETENCAO, response.data))
            .catch((error) => context.commit(SET_MESSAGE_ALERT, {
                tipo: 'error', message: error.response.data
            }))
    },

    async create_motivo_retencao(context, value) {
        let message = await http.post('motivo_retencao', value)
            .then(response => ({ tipo: 'success', message: response.data }))
            .catch((error) => ({ tipo: 'error', message: error.response.data }))
        context.commit(SET_MESSAGE_ALERT, message)
        context.commit(SET_MOTIVO_RETENCAO_NEW, message.message.conteudo)




    },
    async update_motivo_retencao(context, value) {
        let message = await http.put('motivo_retencao/' + value.id, value)
            .then(response => ({ tipo: 'success', message: response.data }))
            .catch((error) => ({ tipo: 'error', message: error.response.data }))
        context.commit(SET_MESSAGE_ALERT, message)
        context.commit(SET_MOTIVO_RETENCAO_ATUALIZACAO, value)

    },
    
    async delete_motivo_retencao(context, value) {
        let data = await http.delete('motivo_retencao/' + value)
            .then(response => ({ tipo: 'success', message: response.data }))
            .catch((error) => ({ tipo: 'error', message: error.response.data }))
        context.commit(SET_MESSAGE_ALERT, data)
        context.commit(SET_MOTIVO_RETENCAO_REMOCAO, value)

    },
 
     set_motivo_retencao(context,value){
        context.commit(SET_MOTIVO_RETENCAO, value)

     }


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
    [SET_LIST_MOTIVO_RETENCOES](state, value) {
        state.lista_motivo_retencoes = value
    },
    [SET_MOTIVO_RETENCAO](state, value) {
        state.motivo_retencao = value
    },
    [SET_MOTIVO_RETENCAO_NEW](state, value) {
        state.lista_motivo_retencoes.push(value)
    },
    [SET_MOTIVO_RETENCAO_ATUALIZACAO](state, value) {
        state.lista_motivo_retencoes = state.lista_motivo_retencoes.filter(i => i.id === value.id).map(o => Object.assign(o,value ))
    },
    [SET_MOTIVO_RETENCAO_REMOCAO](state, value) {
      
        state.lista_motivo_retencoes = state.lista_motivo_retencoes.filter(i => i.id !== value);

    },




};
const getters = {

}

const state = {
    mensagem_alert: [],
    lista_motivo_retencoes: [],
    motivo_retencao: {},
    faturamento: 0
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};


