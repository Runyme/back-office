<template>
  <div>
    <b-loading :active.sync="loading"/>
    <div class="w-full flex justify-between items-start">
      <Lynx-Title text="Guias não processadas"/>
      <Lynx-Button text="Atualizar Guias" class="mb-4" icon="Reload" @click.native="fetchGuias" size="small" icon-size="3"/>
    </div>
    <b-table
      :data="guias"
      :columns="columns"
      :paginated="true"
      default-sort-direction="asc"
      default-sort="nome"
      per-page="10"
      hoverables
      class="w-full"
    >
      <template slot-scope="props">
        <b-table-column field="guia" v-text="props.row.nome" />
        <b-table-column field="data_competencia">
          {{ props.row.data_competencia | dataCompetencia }}
        </b-table-column>
        <b-table-column field="acoes">
          <div class="flex text-sm items-center">
            <a href="#" class="mr-4 bg-primary-600 rounded-full p-2" @click.prevent="openGuiaDetail(props.row)">
              <Icon-Edit class="text-neutral-100" size="4"/>
            </a>
            <a href="#" class="bg-error-base rounded-full p-2" @click.prevent="deleteGuia(props.row)">
              <Icon-Trash class="text-neutral-100" size="4"/>
            </a>
          </div>
        </b-table-column>
      </template>
    </b-table>
    <b-modal :active.sync="guiaDetailModal" v-if="guiaDetailModal" width="700px">
      <GuiaNaoProcessadaDetail
        :guia="currentGuia"
        @onClose="closeGuiaDetail"
        @createdGuia="removeGuiaFromList"
      />
    </b-modal>
  </div>
</template>

<script>
import moment from 'moment'
import { guiasNaoProcessadasRequest, deleteGuiaNaoProcessadaRequest } from '@/services/requests/guias'
import GuiaNaoProcessadaDetail from '@/views/guias/GuiaNaoProcessadaDetail'

export default {
  name: 'GuiasNaoProcessadas',
  components: { GuiaNaoProcessadaDetail },
  data() {
    return {
      loading: false,
      columns: [
        {
          field: 'nome',
          label: 'Guia',
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
      guias: [],
      guiaDetailModal: false,
      currentGuia: null,
    }
  },
  filters: {
    dataCompetencia: val => moment(val).format('MM/Y'),
  },
  mounted() {
    this.fetchGuias()
  },
  methods: {
    fetchGuias() {
      this.loading = true
      guiasNaoProcessadasRequest()
        .then(res => this.guias = res.data.data)
        .catch(() => this.$snack.error('Ocorreu um erro, tente novamente mais tarde'))
        .finally(() => this.loading = false)
    },
    deleteGuia(guia) {
      this.$buefy.dialog.confirm({
        title: 'Excluir Guia',
        message: 'Tem certeza que deseja excluir a guia ' + guia.nome + ' ?',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.onDeleteGuia(guia)
      })
    },
    onDeleteGuia(guia) {
      this.loading = true
      deleteGuiaNaoProcessadaRequest(guia.id)
        .then(() => this.removeGuiaFromList(guia))
        .finally(() => this.loading = false)
    },
    openGuiaDetail(guia) {
      this.currentGuia = guia
      this.guiaDetailModal = true
    },
    closeGuiaDetail() {
      this.guiaDetailModal = false
      this.currentGuia = null
    },
    removeGuiaFromList(guia) {
      this.guias = this.guias.filter(item => item !== guia)
    }
  },
}
</script>
