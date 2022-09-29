<template>
  <div class="bg-neutral-300 p-8 flex items-start flex-col">
    <div class="flex items-center justify-between w-full">
      <Lynx-Title text="Guias"/>

      <Lynx-Button
        class="mb-8"
        text="Configuração"
        icon="Setting" icon-size="3"
        size="small"
        outlined="true"
        @click.native="openConfig"
      />
    </div>

    <div class="flex justify-between w-full">
      <label class="flex flex-col pb-4 items-start inline-flex self-end">
        <span>Competência</span>
        <InputCompetenciaDate
          v-model="dataCompetencia"
          @input="fetchGuias"
        />
      </label>

      <Lynx-Button
        class="my-4 self-end"
        text="Enviar"
        icon="Mail"
        size="small"
        icon-size="4"
        @click.native="onSendGuia"
        type="button"
        :disabled="!guiaLiberacao || !(guiaLiberacao.guias)"
      />
    </div>

    <div class="w-full flex flex-col">
      <b-table :loading="loading" :data="guiaLiberacao && guiaLiberacao.guias ? guiaLiberacao.guias  : []" hoverables>
        <template slot-scope="{row}">
          <b-table-column field="tipo" label="Guia">
            <span class="font-bold pr-2" v-text="row.tipo"/>
          </b-table-column>

          <b-table-column field="data_vencimento" label="Vencimento">
            <span>{{ moment(row.data_vencimento).format('DD/MM/YYYY') }}</span>
          </b-table-column>

          <b-table-column>
            <div class="flex items-center justify-end">
              <a href="#" class="cursor-pointer mr-4" @click.prevent="onPreviewGuia(row)">
                <Icon-Eye class="text-primary-500"/>
              </a>
              <a href="#" class="cursor-pointer mr-4" @click.prevent="onDownloadGuia(row)">
                <Icon-Download class="text-primary-500" size="4"/>
              </a>
            </div>
          </b-table-column>
        </template>
        <template #empty>
          <Not-Found-Data text="Nenhum registro foi encontrado"/>
        </template>
      </b-table>
    </div>

    <b-modal :active.sync="configModalOpened">
      <div class="w-full flex justify-center py-4" v-if="loadingConfig">
        <Lynx-Spinner size="16"/>
      </div>
      <div class="bg-neutral-300 shadow p-8" v-else>
        <Lynx-Title text="Configuração de liberação"/>

        <label class="flex mb-1 mt-5">Tributação trimestral?</label>
        <b-radio v-model="isTributacaoTrimestral" name="trimestral" :native-value="true">
          Sim
        </b-radio>
        <b-radio v-model="isTributacaoTrimestral" name="trimestral" :native-value="false">
          Não
        </b-radio>

        <label class="flex mb-1 mt-5">Guias obrigatórias para a liberação: </label>
        <b-checkbox
          v-for="item in available"
          :key="item.id"
          v-model="required"
          :native-value="item.id"
          size="is-medium"
        >
          {{ item.name }}
        </b-checkbox>

        <Lynx-Button
          class="my-4 self-start"
          text="Salvar"
          type="button"
          @click.native="saveRequireds"
        />
      </div>
    </b-modal>
  </div>
</template>

<script>

import {
  showGuiaLiberacaoRequest,
  sendGuiaRequest,
  getRequiredGuidesByCompanyId,
  getRequiredGuidesList, saveRequiredGuidesByCompanyId, changeTributacaoFrequency, getTributacaoFrequency
} from '@/services/requests/guias'
import {mapGetters} from 'vuex'
import moment from 'moment'
import NotFoundData from '@/components/layouts/NotFoundData'
import {monthNames} from '@/utils/utils'
import InputCompetenciaDate from "@/components/helpers/InputCompetenciaDate";

export default {
  name: 'Guias',
  components: {InputCompetenciaDate, NotFoundData},
  data() {
    return {
      monthNames,
      loading: false,
      guiaLiberacao: {},
      dataCompetencia: null,
      configModalOpened: false,
      required: [],
      available: [],
      loadingConfig: false,
      isTributacaoTrimestral: false
    }
  },
  computed: {
    ...mapGetters(['getEmpresa', 'getToken'])
  },
  methods: {
    moment,
    fetchGuias() {
      if (!this.dataCompetencia) {
        this.dataCompetencia = moment().subtract(1, 'month').format('YYYY-MM-01')
      }
      const dataCompetencia = moment(this.dataCompetencia).format('YYYY-MM-01')

      this.loading = true
      showGuiaLiberacaoRequest(this.getEmpresa.id, dataCompetencia)
        .then(res => this.guiaLiberacao = res.data.data)
        .finally(() => this.loading = false)
    },
    onPreviewGuia(guia) {
      window.open(`${process.env.VUE_APP_API_URL}/arquivos/${guia.arquivo_id}/open?token=${this.getToken}`)
    },
    onDownloadGuia(guia) {
      window.open(`${process.env.VUE_APP_API_URL}/arquivos/${guia.arquivo_id}/download?token=${this.getToken}`)
    },
    onSendGuia() {
      this.$buefy.dialog.confirm({
        title: 'Estornar Guia',
        message: 'Tem certeza que deseja enviar este email agora?',
        confirmText: 'Enviar',
        cancelText: 'Cancelar',
        type: 'is-primary',
        hasIcon: true,
        onConfirm: () => this.sendGuia()
      })
    },
    sendGuia() {
      this.loading = true
      const data = {
        competencia: this.guiaLiberacao.competencia,
        guiaLiberacaoId: this.guiaLiberacao.id,
      }
      sendGuiaRequest(data)
        .then(res => {
          this.$snack.success(res.data.message)
          this.fetchEmpresasWithGuias()
        })
        .catch(err => this.$snack.error(err.response.data.message || err.message))
        .finally(() => this.loading = false)
    },
    openConfig() {
      this.loadingConfig = true
      this.configModalOpened = true

      let fetchRequired = getRequiredGuidesByCompanyId(this.getEmpresa.id)
        .then(response => this.required = response.data.map(item => item.id))
        .catch(error => this.$snack.error(error.response.data.message))

      let fetchAvailables = getRequiredGuidesList()
        .then(response => this.available = response.data)
        .catch(error => this.$snack.error(error.response.data.message))

      let fetchTributacaoFrequency = getTributacaoFrequency(this.getEmpresa.id)
        .then(response => this.isTributacaoTrimestral = !!response.data.trimestral)
        .catch(error => alert(error.response.data.message || 'Erro ao verificar se a tributação é trimestral!'))

      Promise.all([fetchRequired, fetchAvailables, fetchTributacaoFrequency])
        .finally(() => this.loadingConfig = false)
    },
    saveRequireds() {
      this.loadingConfig = true
      let data = this.required.map(item => ({id: item}))

      let saveRequired = saveRequiredGuidesByCompanyId(this.getEmpresa.id, data)
        .then(response => this.$snack.success(response.data.message || 'Atualizado com sucesso!'))
        .catch(error => this.$snack.error(error.response.data.message || 'Falha ao processar a solicitação!'))

      let saveTributacaoFrequency = changeTributacaoFrequency(this.getEmpresa.id, {trimestral: this.isTributacaoTrimestral})
        .catch(error => alert(error.response.data.message || 'Não foi possivel alterar a frequencia da tributação.'))

      Promise.all([saveRequired, saveTributacaoFrequency])
        .finally(() => {
          this.loadingConfig = false
          this.configModalOpened = false
        })
    }
  },
  beforeMount() {
    this.fetchGuias()
  }
}
</script>
