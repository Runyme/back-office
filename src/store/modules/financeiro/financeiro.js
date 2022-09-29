

import http from '@/services/http'

export const SET_LIST_ADICIONAIS = 'setListAdicionais'
export const SET_MESSAGE_ALERT = 'setMessage'
export const SET_VALUE_FOR_STATUS = 'setValueForStatus'
export const SET_LIST_TIPO_COBRANCA = 'setTipoCobranca'
export const SET_LIST_FATURA_MOTIVO_CANCELAMENTO = 'setFaturaMotivoCancelamento'
export const SET_LIST_FATURAMENTOS = 'setListFaturamentos'
const actions = {


    async listar_adicionais(context, params) {
        await http.get('financeiro/adicionais/' + params.payer_id + '/' + params.payer_type)
            .then(response => context.commit(SET_LIST_ADICIONAIS, response.data))
            .catch((error) => context.commit(SET_MESSAGE_ALERT, {
                tipo: 'error', message: error.response.data
            }))
    },

    set_campo(context, params) {
        context.commit(SET_LIST_ADICIONAIS, '')
    },

    async update_fatura_status(context, value) {
        let message = await http.put('financeiro/fatura/status', value)
            .then(response => ({ tipo: 'success', message: response.data }))
            .catch((error) => ({ tipo: 'error', message: error.response.data }))
        context.commit(SET_MESSAGE_ALERT, message)
    },

    async get_value_for_status(context, value) {
        await http.post('financeiro/value/status', value)
            .then(response => context.commit(SET_VALUE_FOR_STATUS, response.data))
            .catch((error) => context.commit(SET_MESSAGE_ALERT, {
                tipo: 'error', message: error.response.data
            }))
    },


    async listar_tipo_cobrancas(context, params) {
        await http.get('tipoCobranca')
            .then(response => context.commit(SET_LIST_TIPO_COBRANCA, response.data))
            .catch((error) => context.commit(SET_MESSAGE_ALERT, {
                tipo: 'error', message: error.response.data
            }))
    },
    async listar_tipo_cobrancas2(context, params) {
        await http.get('tipoCobranca/lista')
            .then(response => context.commit(SET_LIST_TIPO_COBRANCA, response.data))
            .catch((error) => context.commit(SET_MESSAGE_ALERT, {
                tipo: 'error', message: error.response.data
            }))
    },

    async create_tipo_cobranca(context, value) {
        let message = await http.post('tipoCobranca', value)
            .then(response => ({ tipo: 'success', message: response.data }))
            .catch((error) => ({ tipo: 'error', message: error.response.data }))
        context.commit(SET_MESSAGE_ALERT, message)
    },
    async update_tipo_conbranca(context, value) {
        let data = await http.put('tipoCobranca/' + value.id, value)
            .then(response => ({ tipo: 'success', message: response.data }))
            .catch((error) => ({ tipo: 'error', message: error.response.data }))
        context.commit(SET_MESSAGE_ALERT, data)

    },
    async delete_tipo_conbranca(context, value) {
        let data = await http.delete('tipoCobranca/' + value.id)
            .then(response => ({ tipo: 'success', message: response.data }))
            .catch((error) => ({ tipo: 'error', message: error.response.data }))
        context.commit(SET_MESSAGE_ALERT, data)

    },

    // motivo cancelamento fatura 
    async listar_fatura_motivo_cancelamento(context, params) {
        await http.get('fatura_motivo_cancelamento')
            .then(response => context.commit(SET_LIST_FATURA_MOTIVO_CANCELAMENTO, response.data))
            .catch((error) => context.commit(SET_MESSAGE_ALERT, {
                tipo: 'error', message: error.response.data
            }))
    },

    async create_fatura_motivo_cancelamento(context, value) {
        let message = await http.post('fatura_motivo_cancelamento', value)
            .then(response => ({ tipo: 'success', message: response.data }))
            .catch((error) => ({ tipo: 'error', message: error.response.data }))
        context.commit(SET_MESSAGE_ALERT, message)
    },
    async update_fatura_motivo_cancelamento(context, value) {
        let data = await http.put('fatura_motivo_cancelamento/' + value.id, value)
            .then(response => ({ tipo: 'success', message: response.data }))
            .catch((error) => ({ tipo: 'error', message: error.response.data }))
        context.commit(SET_MESSAGE_ALERT, data)

    },
    async delete_fatura_motivo_cancelamento(context, value) {
        let data = await http.delete('fatura_motivo_cancelamento/' + value.id)
            .then(response => ({ tipo: 'success', message: response.data }))
            .catch((error) => ({ tipo: 'error', message: error.response.data }))
        context.commit(SET_MESSAGE_ALERT, data)

    },

    async set_fatura_motivo_cancelamento(context, value) {
        let message = await http.put('faturas/cancelar', value)
            .then(response => ({ tipo: 'success', message: response.data }))
            .catch((error) => ({ tipo: 'error', message: error.response.data }))
        context.commit(SET_MESSAGE_ALERT, message)
    },

    //faturamentos subir 
    async listar_faturamentos(context, params) {
        await http.get('financeiro/listar_faturamentos')
            .then(response => context.commit(SET_LIST_FATURAMENTOS, response.data))
            .catch((error) => context.commit(SET_MESSAGE_ALERT, {
                tipo: 'error', message: error.response.data
            }))
    },
    async create_up_fatures(context, value) {
        let message = await http.post('financeiro/upload/faturamento', value)
            .then(response => ({ tipo: 'success', message: response.data }))
            .catch((error) => ({ tipo: 'error', message: error.response.data }))
        context.commit(SET_MESSAGE_ALERT, message)
    },


};
const mutations = {

    [SET_MESSAGE_ALERT](state, value) {
        console.log(value.message)
        let customMessage;
        if (typeof value.message === "object") {

            customMessage = value.message.msg;
        }
        state.mensagem_alert = {
            tipo: value.tipo,
            message: customMessage ? customMessage : value.message,
        };
    },
    [SET_LIST_ADICIONAIS](state, value) {
        state.lista_adicionais = value
    },
    [SET_VALUE_FOR_STATUS](state, value) {
        state.value_for_status = value
    },
    [SET_LIST_TIPO_COBRANCA](state, value) {
        state.lista_tipo_cobrancas = value
    },
    [SET_LIST_FATURA_MOTIVO_CANCELAMENTO](state, value) {
        state.lista_fatura_motivo_cancelamento = value
    },
[SET_LIST_FATURAMENTOS](state,value){
    state.lista_faturamentos = value
}



};
const getters = {

}

const state = {
    mensagem_alert: [],
    lista_adicionais: '',
    value_for_status: [],
    lista_tipo_cobrancas: [],
    lista_fatura_motivo_cancelamento:[],
    lista_faturamentos:[]
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};


