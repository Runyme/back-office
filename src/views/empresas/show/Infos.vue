<template>
  <div>
    <b-collapse :open="true" aria-id="empresainfo-aria">
      <div class="flex items-center my-2" slot="trigger" aria-controls="empresainfo-aria">
        <Icon-Info class="text-primary-600" size="8"/>
        <p class="pl-4 font-display text-xl font-bold">Geral</p>
      </div>

      <b-tag type="is-warning" v-if="getEmpresa.type != 'normal'">{{ getEmpresa.type }}</b-tag>

      <div class="py-1 flex">
        <div class="flex items-center ">
          <span class="pr-2 font-bold">CNPJ:</span>
        </div>
        <span v-text="getEmpresa.cnpj"/>
        <b-tooltip label="copiado" :active="copiado === getEmpresa.cnpj" always>
          <button class="ml-2" @click="copyText(getEmpresa.cnpj)">
            <b-icon icon="content-copy" size="is-small"></b-icon>
          </button>
        </b-tooltip>
      </div>

      <div class="py-1 flex">
        <div class="flex items-center ">
          <span class="pr-2 font-bold">NIRE:</span>
        </div>
        <span v-text="getEmpresa.nire"/>
      </div>

 

      <div class="flex items-center py-1">
        <div class="flex items-center ">
          <span class="pr-2 font-bold">Data de Início:</span>
        </div>
        <span
          v-text="formatEnToBr(getEmpresa.inicio_atividades)"
          v-if="getEmpresa.inicio_atividades"
        />
      </div>

      <div class="flex items-center py-1">
        <div class="flex items-center ">
          <span class="pr-2 font-bold">R. tributário:</span>
        </div>
        <span v-text="regimeTributario" v-if="getEmpresa.regime_tributario"/>
        <button class="ml-4" @click.prevent="showRegimeHistoryModal = true">
          <Icon-Eye class="text-neutral-700" size="5"/>
        </button>
      </div>

        <div v-if="getEmpresa.codigo_acesso_simples" class="flex items-center py-1">
        <div class="flex items-center ">
          <span class="pr-2 font-bold">Código de Acesso Do Simples Nacional:</span>
        </div>
        <span v-text="getEmpresa.codigo_acesso_simples" v-if="getEmpresa.codigo_acesso_simples"/>
        
               <b-tooltip label="copiado" :active="copiado === getEmpresa.codigo_acesso_simples" always>
       <button class="ml-2"   @click="copyText(getEmpresa.codigo_acesso_simples)">
            <b-icon icon="content-copy" size="is-small"></b-icon>
          </button>

        </b-tooltip>
      
      </div>

      <div class="flex items-center py-1">
        <div class="flex items-center ">
          <span class="pr-2 font-bold">Tipo de empresa:</span>
        </div>
        <span v-text="getEmpresa.type" v-if="getEmpresa.type"/>
      </div>
  
       <!-- <div class="flex items-center py-1">
        <div class="flex items-center ">
          <span class="pr-2 font-bold">Vencimento Bombeiro:</span>
        </div>
        <span v-text="formatEnToBr(getEmpresa.alvara.data_vencimento)" v-if="getEmpresa.alvara.data_vencimento"/>
      </div> -->


    </b-collapse>

    <b-modal :active.sync="editAlvaraModal" v-if="editAlvaraModal" width="500px">
      <Edit-Alvara
        :alvara="alvara"
        :empresa-id="getEmpresa.id"
        @edit-alvara="onEditAlvara"
      />
    </b-modal>
    

    <b-modal :active.sync="showRegimeHistoryModal">
      <RegimeTributarioHistory :company-id="getEmpresa.id"/>
    </b-modal>
  </div>
</template>

<script>

import {mapGetters, mapActions} from 'vuex'
import {formatEnToBr} from '@/utils/momentHelpers'
import moment from 'moment'
import EditAlvara from '@/views/empresas/alvaras/Edit'
import RegimeTributarioHistory from "@/views/empresas/show/RegimeTributarioHistory";

export default {
  name: 'EmpresaShowInfos',
  components: {RegimeTributarioHistory, EditAlvara},
  data() {
    return {
      showRegimeHistoryModal: false,
      copiado: false,
      editAlvaraModal: false,
      alvara: {},
    }
  },
  computed: {
    ...mapGetters(['getEmpresa']),
    regimeTributario() {
      if (!this.getEmpresa.regime_tributario) {
        return null
      }

      if (this.getEmpresa.regime_tributario === 'SN' && this.getEmpresa.data_sn) {
        let date_simples = new Date(this.getEmpresa.data_sn).toLocaleDateString()
        return `Simples N. - ${date_simples}`
      }

      return this.getEmpresa.regime_tributario
    }
  },
  methods: {
    copyText(value) {
      this.$copyText(value)
      this.copiado = value
      setTimeout(() => this.copiado = false, 1500)
    },
    formatEnToBr,
    moment,
    ...mapActions(['setEmpresa']),
    getDateDifferenceFrom(val) {
      const momentDate = moment(val)
      const now = moment()
      return momentDate.diff(now, 'days')
    },
    getDateDifferenceTheme(val) {
      if (val < 0) return 'bg-neutral-900'
      if (val < 30) return 'bg-error-base'
      if (val < 60) return 'bg-warning-base'
      return 'bg-info-base'
    },
   
    onEditAlvara() {
      this.editAlvaraModal = false
      this.$router.push({name: 'empresas.index'})
    }
  }
}
</script>
