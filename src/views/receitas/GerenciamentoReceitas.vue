<template>
  <div>
    <b-loading :active.sync="loading"/>
    <div class="w-full flex justify-between items-start">
      <Lynx-Title text="Gerenciamento de Prolabores"/>
      <Lynx-Button text="Atualizar Receitas" class="mb-4" icon="Reload" @click.native="fetchReceitas" size="small"
                   icon-size="3"/>
    </div>
    <div class="w-full flex justify-between items-center">
      <div class="pb-4 flex">
        <div>
          <Lynx-Label label="Filtrar por Data de competência"/>
          <b-datepicker
            type="month"
            placeholder="Selecione a data de competência"
            icon="calendar-today"
            :month-names="monthNames"
            v-model="dataCompetencia"
          />
        </div>

        <div class="ml-2">
          <Lynx-Label label="Carteira"/>
          <b-select @change.native="fetchReceitas" placeholder="Selecione uma carteira" v-model="selectedCarteira">
            <option value="">Todas</option>
            <option
              v-for="item in carteiras"
              :value="item.id"
              :key="item.id">
              {{ item.nome }}
            </option>
          </b-select>
        </div>
      </div>

      <div class="flex flex-row">
        <Lynx-Button class="mr-2" text="Criar Receita" icon="Plus" @click.native="openCreateModal"/>
        <Lynx-Button text="Gerar relatório" icon="Pdf" @click.native="openReportModal"/>
      </div>
    </div>
    <b-table
      v-if="receitas.length"
      :data="receitas"
      :paginated="true"
      default-sort-direction="asc"
      default-sort="empresa"
      per-page="10"
      hoverables
      class="w-full"
    >
      <template slot-scope="props">
        <b-table-column field="empresa_id" label="Empresa" sortable searchable>
          <span v-if="props.row.empresa_id !== null">{{props.row.empresa_id}}</span>
          <b-tag v-else>externo</b-tag>
        </b-table-column>
        <b-table-column field="cliente_nome" label="Sócio" v-text="props.row.cliente_nome" sortable searchable/>
        <b-table-column field="fator_r" label="Fator R" v-text="props.row.fator_r" sortable searchable/>
        <b-table-column
          field="prolabore_anterior"
          :label="props.row.competencia_anterior | labelDate"
          sortable
        >
          {{ props.row.prolabore_anterior | money }}
        </b-table-column>
        <b-table-column
          field="prolabore_atual"
          :label="props.row.competencia_atual | labelDate"
          sortable
        >
          {{ props.row.prolabore_atual | money }}
        </b-table-column>
        <b-table-column field="lancado" label="Lançado" sortable>
          <b-switch :value="props.row.lancado" v-model="props.row.lancado" @input="changeLancamento(props.row)"/>
        </b-table-column>
        <b-table-column field="acoes" label="Ações">
          <div class="flex text-sm items-center">
            <a href="#" class="mr-4 bg-primary-600 rounded-full p-2" @click.prevent="openEditModal(props.row)">
              <Icon-Eye class="text-neutral-100" size="4"/>
            </a>
            <a href="#" class="bg-error-base rounded-full p-2" @click.prevent="deleteReceita(props.row)">
              <Icon-Trash class="text-neutral-100" size="4"/>
            </a>
          </div>
        </b-table-column>
      </template>
    </b-table>
    <Not-Found-Data v-else-if="!loading" text="Nenhuma receita foi encontrada"/>
    <b-modal :active.sync="editModal" v-if="editModal" @close="closeEditModal">
      <EditReceita
        :receita="currentReceita"
        :receitaAnterior="currentReceita.anterior"
      />
    </b-modal>
    <b-modal v-if="createModal" :active.sync="createModal" @close="closeCreateModal">
      <CreateReceita @createdReceita="fetchReceitas" @onClose="closeCreateModal"/>
    </b-modal>
    <b-modal v-if="reportModal" :active.sync="reportModal" @close="closeReportModal">
      <div class="bg-neutral-300 p-8">
        <Lynx-Title text="Gerar relatório"/>
        <b-checkbox class="mb-5" v-model="filterLancados">Filtrar Lançados</b-checkbox>
        <Lynx-Button text="Gerar relatório" icon="Pdf" :loading="loadingRelatorioButton"
                     @click.native="generateReport"/>
      </div>
    </b-modal>
  </div>
</template>

<script>

import {mapGetters} from 'vuex'
import moment from 'moment'
import {monthNames} from '@/utils/utils'
import {formatBrToEn} from '@/utils/momentHelpers'
import {
  deleteReceitaRequest,
  generateReportReceitaRequest,
  receitasRequest,
  lancamentoReceitaRequest
} from '@/services/requests/receitas'
import EditReceita from '@/views/receitas/EditReceita'
import CreateReceita from "@/views/receitas/CreateReceita";
import NotFoundData from '@/components/layouts/NotFoundData'
import {carteirasRequest} from "@/services/requests/carteiras";

export default {
  name: 'GerenciamentoReceitas',
  components: {
    CreateReceita,
    EditReceita,
    NotFoundData,
  },
  data() {
    return {
      monthNames,
      dataCompetencia: null,
      loading: false,
      loadingRelatorioButton: false,
      receitas: [],
      editModal: false,
      createModal: false,
      reportModal: false,
      currentReceita: null,
      listAllEmpresas: false,
      filterLancados: false,
      selectedCarteira: null,
      carteiras: [],
    }
  },
  computed: {
    ...mapGetters(['getCompetenciaDate', 'getUser']),
  },
  filters: {
    labelDate: val => moment(val).format('MM/YYYY'),
    money: val => val ? 'R$ ' + val.replace('.', ',') : 'R$ 0,00',
  },
  mounted() {
    let fetchCarteiras = this.fetchCarteiras().then(() => {
      let logado = this.carteiras.filter(item => item.responsavel_id == this.getUser.id)
      if (logado.length > 0) {
        this.selectedCarteira = logado[0].id
      }
    })

    Promise.resolve(fetchCarteiras).then(() => this.fetchReceitas())
  },
  methods: {
    fetchCarteiras() {
      return carteirasRequest()
        .then(res => this.carteiras = res.data.data)
        .catch(() => this.$snack.error('Ocorreu um erro, tente novamente mais tarde.'))
    },
    fetchReceitas() {
      this.loading = true
      const dataCompetencia = this.dataCompetencia ? formatBrToEn(this.dataCompetencia) : this.getCompetenciaDate
      receitasRequest({dataCompetencia, carteira: this.selectedCarteira})
        .then(res => this.receitas = res.data.data)
        .catch(() => this.$snack.error('Ocorreu um erro, tente novamente mais tarde'))
        .finally(() => this.loading = false);
    },
    deleteReceita(receita) {
      this.$buefy.dialog.confirm({
        title: 'Excluir Receita',
        message: 'Tem certeza que deseja excluir a receita ' + receita.arquivo_nome + ' ?',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.onDeleteReceita(receita)
      })
    },
    onDeleteReceita(receita) {
      this.loading = true
      deleteReceitaRequest(receita.id)
        .then(() => this.receitas = this.receitas.filter(item => item !== receita))
        .finally(() => this.loading = false)
    },
    openEditModal(receita) {
      this.currentReceita = receita
      this.editModal = true
    },
    closeEditModal() {
      this.currentReceita = null
      this.editModal = false
    },
    generateReport() {
      this.loadingRelatorioButton = true
      const dataCompetencia = this.dataCompetencia ? formatBrToEn(this.dataCompetencia) : this.getCompetenciaDate
      // const filterByOperadorRh = this.$hasRole('Operador RH') && !this.listAllEmpresas ? 1 : 0
      const filterLancados = this.filterLancados ? 1 : 0
      generateReportReceitaRequest({dataCompetencia, carteira: this.selectedCarteira, filterLancados})
        .then(res => this.downloadReport(res))
        .finally(() => this.loadingRelatorioButton = false)
    },
    downloadReport(response) {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'receitas.pdf')
      document.body.appendChild(link)
      link.click()
    },
    openCreateModal() {
      this.createModal = true
    },
    closeCreateModal() {
      this.createModal = false
    },
    openReportModal() {
      this.reportModal = true
    },
    closeReportModal() {
      this.reportModal = false
    },
    changeLancamento(receita) {
      lancamentoReceitaRequest({lancado: receita.lancado}, receita.id)
        .catch(error => {
          this.$snack.error(error.response.data.message)
        })
    },
  },
  watch: {
    dataCompetencia() {
      this.receitas = []
      this.fetchReceitas()
    },
    listAllEmpresas() {
      this.fetchReceitas()
    }
  }
}
</script>
