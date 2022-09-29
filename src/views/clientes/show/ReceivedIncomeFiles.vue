<template>
  <div>
    <b-loading :active.sync="loading"/>
    <div class="w-full flex justify-end">
      <Lynx-Button
        text="Atualizar Lista"
        class="mb-4" icon="Reload"
        @click.native="fetchUploads"
        size="small"
        icon-size="3"
      />
    </div>

    <NotFoundData
      class="mx-auto"
      text="Nenhuma registro por aqui!"
      v-if="!loading && uploads.length === 0"
    />

    <b-table
      v-else
      :data="uploads"
      :columns="columns"
      :paginated="true"
      default-sort-direction="asc"
      default-sort="nome"
      per-page="10"
      hoverables
      class="w-full"
    >
      <template slot-scope="props">
        <b-table-column field="name" v-text="props.row.name"/>
        <b-table-column field="created_at">{{ props.row.created_at | formatEnToBr }}</b-table-column>
        <b-table-column field="acoes">
          <div class="flex text-sm items-center">
            <a href="#" class="mr-4 bg-primary-600 rounded-full p-2" @click.prevent="openModal(props.row)">
              <Icon-Eye class="text-neutral-100" size="4"/>
            </a>
            <a href="#" class="bg-error-base rounded-full p-2" @click.prevent="deleteUpload(props.row)">
              <Icon-Trash class="text-neutral-100" size="4"/>
            </a>
          </div>
        </b-table-column>
      </template>
    </b-table>

    <b-modal v-if="uploadModalOpened" :active.sync="uploadModalOpened" @close="closeCreateModal">
      <div class="bg-neutral-300 p-10 rounded">
        <Lynx-Title text="Holerite"/>

        <div class="w-full flex justify-center" v-if="loadingCreate">
          <Lynx-Spinner size="12"/>
        </div>

        <form @submit.prevent="handleSubmitMoving" class="flex flex-col w-full items-start" v-else>
          <div class="flex flex-row mb-8">
            <label class="flex flex-col">
              <Lynx-Label label="CNPJ"/>
              <Lynx-Input
                placeholder="Informe o CNPJ"
                v-model="selectedUpload.cnpj"
                required
              />
            </label>

            <label class="flex flex-col ml-4">
              <Lynx-Label label="Valor"/>
              <InputMoney required @input="money => selectedUpload.prolabore = money"
                          v-model="selectedUpload.prolabore"/>
            </label>

            <label class="flex flex-col ml-4">
              <Lynx-Label label="INSS"/>
              <InputMoney required @input="money => selectedUpload.inss = money" v-model="selectedUpload.inss"/>
            </label>

            <label class="flex flex-col ml-4">
              <Lynx-Label label="IRRF"/>
              <InputMoney required @input="money => selectedUpload.irrf = money" v-model="selectedUpload.irrf"/>
            </label>
          </div>

          <label class="flex flex-col mb-8">
            <Lynx-Label label="Competência"/>
            <InputCompetenciaDate v-model="selectedUpload.data_competencia" position="is-bottom-right"/>
          </label>

          <div class="flex flex-row mb-8">
            <a class="text-primary-600 font-bold underline" :href="selectedUpload.url"
               target="_blank">{{ selectedUpload.name }}</a>
          </div>

          <div class="flex w-full justify-between">
            <Lynx-Button
              text="Salvar"
              type="submit"
              size="small"
            />
            <Lynx-Button
              text="Cancelar"
              class="ml-8"
              type="button"
              size="small"
              outlined="true"
              @click.native="closeCreateModal"
            />
          </div>
        </form>
      </div>
    </b-modal>
  </div>
</template>

<script>

import moment from 'moment'
import {
  deleteReceitaNaoProcessadaRequest,
  getReceivedHolerites,
  moveUploadToHolerite
} from '@/services/requests/receitas'
import {formatEnToBr} from '@/utils/momentHelpers'
import InputMoney from "@/components/helpers/InputMoney";
import InputCompetenciaDate from "@/components/helpers/InputCompetenciaDate";
import NotFoundData from "@/components/layouts/NotFoundData";

export default {
  name: 'ReceivedIncomeFiles',
  components: {NotFoundData, InputCompetenciaDate, InputMoney},
  props: {customerId: null},
  data() {
    return {
      loading: false,
      loadingCreate: false,
      uploads: [],
      columns: [
        {
          field: 'name',
          label: 'Arquivo',
          sortable: true,
        },
        {
          field: 'created_at',
          label: 'Data Upload',
          sortable: true,
        },
        {
          field: '',
          label: 'Ações',
        },
      ],
      uploadModalOpened: false,
      selectedUpload: null,
    }
  },
  filters: {
    dataCompetencia: val => moment(val).format('MM/Y'),
    formatEnToBr
  },
  mounted() {
    this.fetchUploads()
  },
  methods: {
    fetchUploads() {
      this.loading = true
      getReceivedHolerites('holerite', {customer_id: this.customerId})
        .then(res => this.uploads = res.data.data)
        .catch(() => this.$snack.error('Ocorreu um erro, tente novamente mais tarde'))
        .finally(() => this.loading = false)
    },
    deleteUpload(upload) {
      this.$buefy.dialog.confirm({
        title: 'Excluir Receita',
        message: 'Tem certeza que deseja excluir ' + upload.name + ' ?',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.onDeleteReceita(upload)
      })
    },
    onDeleteReceita(upload) {
      this.loading = true;
      deleteReceitaNaoProcessadaRequest(upload.id)
        .then(() => this.removeUploadFromList(upload))
        .finally(() => this.loading = false)
    },
    removeUploadFromList(upload) {
      this.uploads = this.uploads.filter(item => item !== upload)
    },
    openModal(upload) {
      this.selectedUpload = upload
      this.uploadModalOpened = true
    },
    closeCreateModal() {
      this.selectedUpload = null
      this.uploadModalOpened = false
    },
    handleSubmitMoving() {
      this.loadingCreate = true
      moveUploadToHolerite(this.selectedUpload)
        .then(() => {
          this.$snack.success('Operação realizada com sucesso!')
          this.closeCreateModal()
          this.fetchUploads()
        })
        .catch(() => this.$snack.error('Não foi possível realizar a operação!'))
        .finally(() => this.loadingCreate = false)
    }
  },
}
</script>
