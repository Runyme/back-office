<template>
  <div>

    <b-loading :active="loading" />

    <div class="w-full flex justify-between items-start">
      <Lynx-Title text="Notas fiscais"/>

      <b-button class="mb-4" icon-right="reload" @click="fetchNfse()"/>
    </div>


    <div class="w-full flex justify-start">
      <label class="pb-4">
        <Lynx-Label label="Competência"/>
        <InputCompetenciaDate
          placeholder="Selecione o mês"
          v-model="filterMonth"
          @input="fetchNfse"
        />
      </label>

      <b-field label="Status" class="ml-4">
        <b-select placeholder="Selecione um status" v-model="filter_status">
          <option
            v-for="item in statusNfse"
            :value="item"
            :key="item">
            {{ item.toLowerCase() }}
          </option>
        </b-select>
      </b-field>

      <div class="w-full flex flex-row-reverse items-end mb-4">
        <div class="control ml-4">
          <b-taglist attached>
            <b-tag type="is-primary" size="is-medium">Processando:</b-tag>
            <b-tag type="is-warning" size="is-medium">{{ processingNfses }}</b-tag>
          </b-taglist>
        </div>
        <div class="control">
          <b-taglist attached>
            <b-tag type="is-primary" size="is-medium">Erros:</b-tag>
            <b-tag type="is-danger" size="is-medium">{{ rejectedNfses }}</b-tag>
          </b-taglist>
        </div>
      </div>
    </div>

    <b-table
      :data="nfseFiltered"
      :paginated="true"
      default-sort-direction="asc"
      default-sort="id"
      per-page="10"
      hoverables
      class="w-full"
      :loading="!!loading"
    >
      <template #empty>
        <not-found-data text="Nenhum registro encontrato!"/>
      </template>
      <template slot-scope="props">
        <b-table-column field="id" label="#" v-text="props.row.id"/>
        <b-table-column field="valor_nota" label="Valor">
          {{ props.row.valor_nota | money }}
        </b-table-column>
        <b-table-column field="tomador" v-text="props.row.tomador" label="Tomador"/>
        <b-table-column field="status" label="Status">
          <b-tag :type="colorStatus(props.row.status)">
            {{ props.row.status }}
          </b-tag>
        </b-table-column>
        <b-table-column field="data_emissao" label="Emissão">
          {{ props.row.data_emissao | dateFormat }}
        </b-table-column>
        <b-table-column field="arquivo" label="">
          <div class="flex text-sm items-center" v-if="props.row.arquivo && props.row.arquivo.id">
            <a href="#" class="mr-4 bg-primary-600 rounded-full p-2" @click.prevent="$openFile(props.row.arquivo.id)">
              <Icon-Eye class="text-neutral-100" size="4"/>
            </a>
          </div>
          <div class="flex text-sm items-center" v-if="props.row.status === 'REJEITADO'">
            <a href="#" class="mr-4 bg-error-base rounded-full p-2" @click.prevent="openErrorModal(props.row)">
              <Icon-Eye class="text-neutral-100" size="4"/>
            </a>
          </div>
          <div class="flex text-sm items-center" v-if="props.row.status === 'PROCESSANDO'">
            <a href="#" class="mr-4 bg-info-base rounded-full p-2" @click.prevent="refreshNfseStatus(props.row.id_integracao)">
              <Icon-Reload class="text-neutral-100" size="4"/>
            </a>
          </div>
        </b-table-column>
      </template>
    </b-table>
    <b-modal :active.sync="showErrorModal" @close="closeErrorModal">
      <div class="bg-white p-8" v-if="errorModalObject && errorModalObject.mensagem_retorno">
        <b-notification type="is-danger">
          <strong>Erro ao emitir a Nota fiscal!</strong>
          <p class="mt-4">{{ errorModalObject.mensagem_retorno }}</p>
        </b-notification>

        <p><span class="font-semibold text-neutral-800">Nota emitida para o cnpj/cpf:</span> {{
            errorModalObject.tomador
          }}</p>
        <p><span class="font-semibold text-neutral-800">Data de emissão:</span>
          {{ errorModalObject.created_at | dateFormat }}</p>

        <b-button
          :disabled="!errorModalObject.fatura_id"
          class="mt-4"
          type="is-primary"
          icon-right="reload"
          @click="emitNfse"
        >Reenviar
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import {emitirNfse, getNfse, refreshStatus} from "@/services/requests/nfse";
import NotFoundData from "@/components/layouts/NotFoundData";
import {formatEnToBr, momentIntance} from "@/utils/momentHelpers";
import InputCompetenciaDate from "@/components/helpers/InputCompetenciaDate";
import Eye from "@/components/icons/Eye";

export default {
  name: "Nfse",
  components: {Eye, InputCompetenciaDate, NotFoundData},
  data() {
    return {
      loading: false,
      componentError: null,
      nfse: [],
      filter_status: 'TODAS',
      statusNfse: [
        'REJEITADO',
        'CONCLUIDO',
        'PROCESSANDO',
        'TODAS',
      ],
      filterMonth: momentIntance().format('YYYY-MM-DD'),
      errorModalObject: null,
      showErrorModal: null,
    }
  },
  computed: {
    rejectedNfses() {
      return this.nfse.filter(({status}) => status === 'REJEITADO').length
    },
    processingNfses() {
      return this.nfse.filter(({status}) => status === 'PROCESSANDO').length
    },
    nfseFiltered() {
      if (this.filter_status === 'TODAS') return this.nfse
      return this.nfse.filter(({status}) => status === this.filter_status)
    }
  },
  mounted() {
    this.fetchNfse()
  },
  methods: {
    refreshNfseStatus(idIntegracao) {
      this.loading = true
      refreshStatus(idIntegracao)
        .then(({data: res}) => {
          this.$snack.success(res.message)
          this.fetchNfse()
        })
        .catch(() => this.$snack.error('Erro ao atualizar informações. Tente novamente em alguns instantes'))
      .finally(() => this.loading = false)
    },
    emitNfse() {
      this.loading = true
      emitirNfse(this.errorModalObject.fatura_id)
        .then(({data: res}) => {
          this.$snack.success(res.message)
          this.closeErrorModal()
        })
        .catch(() => this.$snack.error('Erro ao solicitar emissão, revise os dados e tente novamente.'))
      .finally(() => this.loading = false)
    },
    fetchNfse() {
      this.loading = true
      getNfse({params: {date: this.filterMonth}})
        .then(({data: resData}) => this.nfse = resData.data)
        .catch(({response}) => this.componentError = response.data.message)
        .finally(() => this.loading = false)
    },
    colorStatus(status) {
      if (status === 'CONCLUIDO') {
        return "is-success"
      }
      if (status === 'CANCELADO') {
        return "is-dark"
      }
      if (status === 'REJEITADO') {
        return 'is-danger'
      }
      if (status === 'PROCESSANDO') {
        return 'is-warning'
      }
      return 'default';
    },
    openErrorModal(nfse) {
      this.errorModalObject = nfse
      this.showErrorModal = true
    },
    closeErrorModal() {
      this.errorModalObject = null
      this.showErrorModal = null
    }
  },
  filters: {
    money: value => {
      let val = (value / 1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    dateFormat: val => {
      if (val === null) return '--'
      return formatEnToBr(val)
    },
  }

}
</script>

<style scoped>

</style>
