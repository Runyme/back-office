import Vue from 'vue'
import Vuex from 'vuex'

//Modules
import auth from '@/store/modules/auth'
import user from '@/store/modules/user'
import competencia from '@/store/modules/competencia'
import empresa from '@/store/modules/empresa'
import cliente from '@/store/modules/cliente'
import chat from '@/store/modules/chat'
import finanRelatorio from '@/store/modules/financeiro/relatorios'
import carteira from '@/store/modules/carteira'
import empresas from '@/store/modules/empresa/empresas'
import simulador from './modules/financeiro/simulador'
import configEmpresa from './modules/empresa/configEmpresa'
import financeiro from './modules/financeiro/financeiro';
import linker from './modules/empresa/linker'
import activityLogs from './modules/empresa/activityLogs'
import atividades from './modules/empresa/atividades'
import etapas from './modules/empresa/etapas'
import motivoRetencao from './modules/empresa/motivoRetencao'
import retencao from './modules/empresa/retencao'



import etapasEmpresa from './modules/empresa/etapasEmpresa'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth,
    user,
    competencia,
    empresa,
    cliente,
    chat,
    finanRelatorio,
    carteira,
    empresas,
    simulador,
    configEmpresa,
    financeiro,
    linker,
    activityLogs,
    atividades,
    etapas,
    etapasEmpresa,
    retencao,
    motivoRetencao

  }
})

export default store