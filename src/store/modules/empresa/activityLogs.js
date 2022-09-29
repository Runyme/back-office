
  
import http from '@/services/http'

export const SET_SUBJECT_TYPE = 'setSubjectType'
export const SET_LISTA_LOGS = 'setListaLogs'
export const SET_MESSAGE_ALERT ='setMessage'
const actions = {
   
      async listar_subject_type(context) {
        await http.get('dashboard/pegartipo')
            .then(response => context.commit(SET_SUBJECT_TYPE, response.data))
            .catch((error) => context.commit(SET_MESSAGE_ALERT, {
                tipo: 'error', message: error.response.data
            }))
    },
    async listar_logs(context, params) {
        await http.post('dashboard/logsForUsers', params)
            .then(response => context.commit(SET_LISTA_LOGS, response.data))
            .catch((error) => context.commit(SET_MESSAGE_ALERT, {
                tipo: 'error', message: error.response.data
            }))
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
      [SET_SUBJECT_TYPE](state, value) {

        state.lista_subsject_types = value
    },
    [SET_LISTA_LOGS](state, value) {

        state.lista_logs = value
    },
    

};
const getters={

}

const state = {
    mensagem_alert:[],
    lista_subsject_types:[],
    lista_logs:[]
};

export default {
    namespaced:true,
    state,
    getters,
    mutations,
    actions,
  };
  

