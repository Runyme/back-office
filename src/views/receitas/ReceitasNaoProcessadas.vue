<template>
  <div>
    <b-loading :active.sync="loading"/>
    <div class="w-full flex justify-between items-start">
      <Lynx-Title text="Prolabores não processadas"/>
      <Lynx-Button text="Atualizar Receitas" class="mb-4" icon="Reload" @click.native="fetchReceitas" size="small" icon-size="3"/>
    </div>
    <b-table
      :data="receitas"
      :columns="columns"
      :paginated="true"
      default-sort-direction="asc"
      default-sort="nome"
      per-page="10"
      hoverables
      class="w-full"
    >
      <template slot-scope="props">
        <b-table-column field="nome" v-text="props.row.nome" />
        <b-table-column field="data_competencia">
          {{ props.row.data_competencia | dataCompetencia }}
        </b-table-column>
        <b-table-column field="acoes">
          <div class="flex text-sm items-center">
            <a href="#" class="mr-4 bg-primary-600 rounded-full p-2" @click.prevent="openReceitaDetail(props.row)">
              <Icon-Eye class="text-neutral-100" size="4"/>
            </a>
            <a href="#" class="bg-error-base rounded-full p-2" @click.prevent="deleteReceita(props.row)">
              <Icon-Trash class="text-neutral-100" size="4"/>
            </a>
          </div>
        </b-table-column>
      </template>
    </b-table>
    <b-modal v-if="receitaDetailModal" :active.sync="receitaDetailModal" @close="closeReceitaDetail">
      <ReceitaNaoProcessadaDetail
        :receita="currentReceita"
        @createdReceita="removeReceitaFromList"
        @onClose="closeReceitaDetail"
      />
    </b-modal>
  </div>
</template>

<script>

import moment from 'moment'
import { deleteReceitaNaoProcessadaRequest, receitasNaoProcessadasRequest} from '@/services/requests/receitas'
import ReceitaNaoProcessadaDetail from '@/views/receitas/ReceitaNaoProcessadaDetail'

export default {
  name: 'ReceitasNaoProcessadas',
  components: { ReceitaNaoProcessadaDetail, },
  data() {
    return {
      loading: false,
      receitas: [],
      columns: [
        {
          field: 'nome',
          label: 'Receita',
          searchable: true,
          sortable: true,
        },
        {
          field: 'data_competencia',
          label: 'Data de competência',
          sortable: true,
        },
        {
          field: 'acoes',
          label: 'Ações',
        },
      ],
      receitaDetailModal: false,
      currentReceita: null,
    }
  },
  filters: {
    dataCompetencia: val => moment(val).format('MM/Y'),
  },
  mounted() {
    this.fetchReceitas()
  },
  methods: {
    fetchReceitas() {
      this.loading = true
      receitasNaoProcessadasRequest()
        .then(res => this.receitas = res.data.data)
        .catch(() => this.$snack.error('Ocorreu um erro, tente novamente mais tarde'))
        .finally(() => this.loading = false)
    },
    deleteReceita(receita) {
      this.$buefy.dialog.confirm({
        title: 'Excluir Receita',
        message: 'Tem certeza que deseja excluir a receita ' + receita.nome + ' ?',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.onDeleteReceita(receita)
      })
    },
    onDeleteReceita(receita) {
      this.loading = true;
      deleteReceitaNaoProcessadaRequest(receita.id)
        .then(() => this.removeReceitaFromList(receita))
        .finally(() => this.loading = false)
    },
    removeReceitaFromList(receita) {
      this.receitas = this.receitas.filter(item => item !== receita)
    },
    openReceitaDetail(receita) {
      this.currentReceita = receita
      this.receitaDetailModal = true
    },
    closeReceitaDetail() {
      this.currentReceita = null
      this.receitaDetailModal = false
    },
  },
}
</script>
