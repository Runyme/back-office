<template>
  <div>
    <div class="flex items-center justify-between w-full">
      <div class="flex flex-row flex-end w-full flex-row-reverse">
        <Lynx-Button
          class="mb-2 mr-1"
          text="Adicionar Receita"
          icon="Plus"
          icon-size="3"
          size="small"
          outlined="true"
          @click.native="isAdding = true"
        />
      </div>
    </div>

    <form
      @submit.prevent="onSubmitReceita"
      class="flex flex-col w-full items-start bg-neutral-100  p-4 rounded border-4 border-neutral-300"
      v-show="isAdding"
    >
      <div class="w-full flex justify-center" v-if="loadingCreateRequest">
        <Lynx-Spinner size="12"/>
      </div>

      <div v-else>
        <div class="flex flex-row mb-8">
          <label class="flex flex-col">
            <Lynx-Label label="CNPJ"/>
            <Lynx-Input
              placeholder="Informe o CNPJ"
              v-model="form.cnpj"
              required
            />
          </label>

          <label class="flex flex-col ml-4">
            <Lynx-Label label="Valor"/>
            <InputMoney required @input="money => form.prolabore = money" v-model="form.prolabore"></InputMoney>
          </label>

          <label class="flex flex-col ml-4">
            <Lynx-Label label="INSS"/>
            <InputMoney required @input="money => form.inss = money" v-model="form.inss"></InputMoney>
          </label>

          <label class="flex flex-col ml-4">
            <Lynx-Label label="IRRF"/>
            <InputMoney required @input="money => form.irrf = money" v-model="form.irrf"></InputMoney>
          </label>
        </div>

        <div class="flex flex-row mb-8">
          <label class="flex flex-col">
            <Lynx-Label label="Competência"/>
            <InputCompetenciaDate v-model="form.data_competencia" position="is-bottom-right"/>
          </label>

          <label class="flex flex-col justify-end ml-4">
            <Attachment @remove-anexo="handleDeletedAttachment" is-deletabled :anexo="form.arquivo"
                        v-if="form.arquivo != null"/>
            <InputFile text="Adicionar Arquivo" @input="base64 => form.file = base64" v-else/>
          </label>
        </div>

        <div class="flex">
          <Lynx-Button
            text="Enviar"
            type="submit"
            size="small"
          />
          <Lynx-Button
            text="Cancelar"
            class="ml-8"
            type="button"
            size="small"
            outlined="true"
            @click.native="cancelCreating"
          />
        </div>
      </div>
    </form>

    <div class="w-full flex justify-center" v-if="loading">
      <Lynx-Spinner size="12"/>
    </div>

    <NotFoundData class="mx-auto" text="Nenhuma receita cadastrada"
                  v-else-if="!loading && receitas.length === 0"/>

    <div class="w-full rounded bg-white" v-else>
      <b-collapse
        class="p-1 border-b border-neutral-300 border-4"
        animation="slide"
        v-for="(mes, index) of receitas"
        :key="index"
        :open="isOpen === index"
        @open="isOpen = index">
        <div slot="trigger" slot-scope="props" class="card-header shadow-none" role="button">
          <p class="card-header-title text-neutral-700">
            {{ index | toPortugueseDate }}
          </p>
          <a class="card-header-icon">
            <b-icon :icon="props.open ? 'menu-down' : 'menu-right'"></b-icon>
          </a>
        </div>
        <div class="card-content">
          <div class="content">
            <b-notification type="is-default" :closable="false" role="alert" v-if="!mes.length">
              Nenhuma receita registrada para este mes
            </b-notification>
            <b-table v-else :data="mes" :columns="columnsReceita">
              <template slot-scope="props">
                <b-table-column field="prolabore" v-text="props.row.prolabore"/>
                <b-table-column field="cnpj" v-text="props.row.cnpj"/>
                <b-table-column field="inss" v-text="props.row.inss"/>
                <b-table-column field="irrf" v-text="props.row.irrf"/>
                <b-table-column field="action">
                  <div class="flex items-center justify-end">
                    <a href="#" class="cursor-pointer mr-4" @click.prevent="editReceita(props.row)">
                      <b-icon icon="pencil" size="is-small" class="text-primary-500"/>
                    </a>
                    <a href="#" class="cursor-pointer" @click.prevent="deleteReceita(props.row, props.index)">
                      <Icon-Trash class="text-error-base" size="4"/>
                    </a>
                  </div>
                </b-table-column>
              </template>
            </b-table>
          </div>
        </div>
      </b-collapse>
    </div>

    <b-modal :active.sync="isEditing" :on-cancel="cancelEditing">
      <div class="bg-neutral-300 p-10 rounded" v-if="editing">
        <Lynx-Title text="Receita"/>

        <div class="w-full flex justify-center" v-if="loadingChange">
          <Lynx-Spinner size="12"/>
        </div>

        <form @submit.prevent="handleSubmitChange" class="flex flex-col w-full items-start" v-else>
          <div class="flex flex-row mb-8">
            <label class="flex flex-col">
              <Lynx-Label label="CNPJ"/>
              <Lynx-Input
                placeholder="Informe o CNPJ"
                v-model="editing.cnpj"
                required
              />
            </label>

            <label class="flex flex-col ml-4">
              <Lynx-Label label="Valor"/>
              <InputMoney required @input="money => editing.prolabore = money" v-model="editing.prolabore"></InputMoney>
            </label>

            <label class="flex flex-col ml-4">
              <Lynx-Label label="INSS"/>
              <InputMoney required @input="money => editing.inss = money" v-model="editing.inss"></InputMoney>
            </label>

            <label class="flex flex-col ml-4">
              <Lynx-Label label="IRRF"/>
              <InputMoney required @input="money => editing.irrf = money" v-model="editing.irrf"></InputMoney>
            </label>
          </div>

          <div class="flex flex-row mb-8">
            <label class="flex flex-col justify-end">
              <Attachment @remove-anexo="handleDeletedAttachment" is-deletabled :anexo="editing.arquivo"
                          v-if="editing.arquivo != null"/>
              <InputFile text="Adicionar Arquivo" @input="base64 => form.file = base64" v-else/>
            </label>
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
              @click.native="cancelEditing"
            />
          </div>
        </form>
      </div>
    </b-modal>
  </div>
</template>
<script>
import Attachment from "@/components/shared/Attachment"
import InputCompetenciaDate from "@/components/helpers/InputCompetenciaDate"
import InputFile from '@/components/helpers/InputFile'
import InputMoney from "@/components/helpers/InputMoney"
import NotFoundData from '@/components/layouts/NotFoundData'
import {
  createHoleriteRequest,
  deleteReceitaRequest,
  editHoleriteRequest,
  getYearlyByCustomer
} from "@/services/requests/receitas";
import moment from "moment";
import {mapGetters} from "vuex";
import {momentIntance} from "@/utils/momentHelpers";

export default {
  name: 'Incomes',
  components: {Attachment, InputCompetenciaDate, InputFile, InputMoney, NotFoundData},
  props: {
    customerId: null,
  },
  data() {
    return {
      columnsReceita: [
        {field: 'prolabore', label: 'Receita',},
        {field: 'cnpj', label: 'CNPJ',},
        {field: 'inss', label: 'INSS',},
        {field: 'irrf', label: 'IRRF',},
        {field: 'actions', label: '',}
      ],
      isOpen: null,
      isAdding: false,
      loadingCreateRequest: false,
      receitas: [],
      form: {
        cliente_id: this.customerId,
        file: {}
      },
      editing: null,
      loading: false,
      loadingChange: false,
    }
  },
  filters: {
    toPortugueseDate(val) {
      return momentIntance(val).format('MM/YYYY')
    }
  },
  computed: {
    ...mapGetters(['getToken', 'getCliente']),
    isEditing() {
      return !!(this.editing != null && this.editing.id)
    },
  },
  methods: {
    deleteReceita(receita, index) {
      if (!confirm('Certeza que quer deletar este registro?')) return

      deleteReceitaRequest(receita.id)
        .then(() => this.receitas[receita.data_competencia].splice(index, 1))
        .catch(error => this.$snack.error(error.response.data.message || 'Erro ao excluir'))
    },
    editReceita(receita) {
      console.log(receita)
      let obj = {}
      Object.assign(obj, receita)
      this.editing = obj
    },
    moment,
    cancelEditing() {
      this.editing = null
    },
    fetchReceitas() {
      this.loading = true
      getYearlyByCustomer(this.customerId)
        .then(res => this.receitas = res.data)
        .finally(() => this.loading = false)
    },
    onSubmitReceita() {
      this.loadingCreateRequest = true
      createHoleriteRequest(this.form)
        .then(response => {
          this.receitas[this.form.data_competencia].push(response.data)
          this.resetForm()
        })
        .catch(error => this.$snack.error(error.response.data.message))
        .finally(() => this.loadingCreateRequest = false)
    },
    handleSubmitChange() {
      this.loadingChange = true
      let data = {
        ...this.editing,
        file: this.form.file
      }
      editHoleriteRequest(this.editing.id, data)
        .then(response => {
          this.receitas[data.data_competencia].forEach((item, key) => {
            if (item.id === this.editing.id)
              this.receitas[data.data_competencia][key] = response.data
          })
          this.editing = null
        })
        .catch(error => this.$snack.error(error.response.data.message))
        .finally(() => this.loadingChange = false)
    },
    handleDeletedAttachment() {
      this.editing.arquivo = null
    },
    resetForm() {
      this.form = {
        file: {},
        cliente_id: this.customerId
      }
    },
    cancelCreating() {
      this.resetForm()
      this.isAdding = false
    },
  },
  beforeMount() {
    this.fetchReceitas()
  }
}
</script>
