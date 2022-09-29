

import http from '@/services/http'

export const SET_LIST_ATIVIDADES = 'setListLinkerClientes'
export const SET_ATIVIDADES = 'setCliLinker'
export const SET_FATURAMENTO = 'setCliFaturamento'
export const SET_ATIVIDADES_NEW = 'setAtividadeNew'

export const SET_MESSAGE_ALERT = 'setMessage'
const actions = {


    async listar_atividades(context, params) {
        await http.get('atividades')
            .then(response => context.commit(SET_LIST_ATIVIDADES, response.data))
            .catch((error) => context.commit(SET_MESSAGE_ALERT, {
                tipo: 'error', message: error.response.data
            }))
    },
    async listar_atividade(context, params) {
        await http.get('atividades/' + params)
            .then(response => context.commit(SET_ATIVIDADES, response.data))
            .catch((error) => context.commit(SET_MESSAGE_ALERT, {
                tipo: 'error', message: error.response.data
            }))
    },

    async create_atividades(context, value) {
        let message = await http.post('atividades', value)
            .then(response => ({ tipo: 'success', message: response.data }))
            .catch((error) => ({ tipo: 'error', message: error.response.data }))
        context.commit(SET_MESSAGE_ALERT, message)
        context.commit(SET_ATIVIDADES_NEW, message.message.conteudo)



    },
    async update_atividades(context, value) {
        let data = await http.put('atividades/' + value.id, value)
            .then(response => ({ tipo: 'success', message: response.data }))
            .catch((error) => ({ tipo: 'error', message: error.response.data }))
        context.commit(SET_MESSAGE_ALERT, data)


    },
 

    
     set_atividade(context,value){
        context.commit(SET_ATIVIDADES, value)

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
    [SET_LIST_ATIVIDADES](state, value) {
        state.lista_atividades = value
    },
    [SET_ATIVIDADES](state, value) {
        state.atividade = value
    },
    [SET_ATIVIDADES_NEW](state, value) {
        state.lista_atividades.push(value)
    },

    [SET_FATURAMENTO](state, value) {
        state.faturamento = value
    },


};
const getters = {

}

const state = {
    mensagem_alert: [],
    lista_atividades: [],
    atividade: {},
    faturamento: 0
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};


