<template>
  <div>
    <b-loading :active.sync="loading"/>
    <div class="w-full flex justify-between items-start">
      <Lynx-Title text="Credenciamentos"/>
    </div>

    <b-table
      :data="credenciamentos"
      :columns="columns"
      :paginated="true"
      default-sort-direction="asc"
      default-sort="id"
      per-page="10"
      class="w-full"
    >
      <template slot-scope="props">
        <b-table-column field="id" v-text="props.row.id"/>
        <b-table-column field="razao_social" v-text="props.row.razao_social"/>
        <b-table-column field="status" v-text="props.row.status"/>
        <b-table-column field="acao" class="flex text-sm items-center">
          <b-tooltip label="Editar" position="is-bottom">
            <button class="flex items-center justify-center" @click.prevent="openEditModal(props.row)">
              <b-icon icon="circle-edit-outline"></b-icon>
            </button>
          </b-tooltip>
          <b-tooltip label="Excluir" position="is-bottom" type="is-danger">
            <button class="flex items-center justify-center" @click.prevent="deleteCredenciamento(props.row.id)">
              <b-icon icon="delete-forever"></b-icon>
            </button>
          </b-tooltip>
        </b-table-column>
      </template>
    </b-table>

    <b-modal :active.sync="EditModalOpened" :on-cancel="fetchCredenciamentos">
      <ProcessModal :empresa="selectedEmpresa" @edited="credenciamentoEdited" />
    </b-modal>
  </div>

</template>

<script>
import ProcessModal from "@/views/credenciamento/ProcessModal";
let examples = [
  {
    id: 1,
    razao_social: 'Lorem Ipsum Sit',
    status: 'Análise de edital'
  },
  {
    id: 2,
    razao_social: 'Ipsum Sit Lorem',
    status: 'Aguardando CRM'
  },
]
export default {
  name: "Credenciamento",
  components: {ProcessModal},
  data() {
    return {
      loading: false,
      credenciamentos: examples,
      columns: [
        {
          field: 'id',
          label: 'Empresa',
          sortable: true,
        },
        {
          field: 'razao_social',
          label: 'Razão Social',
          sortable: true,
        },
        {
          field: 'status',
          label: 'Status',
        },
        {}
      ],
      selectedEmpresa: {},
      EditModalOpened: false,
    }
  },
  methods: {
    fetchCredenciamentos() {
      // todo
    },
    credenciamentoEdited() {
      this.fetchCredenciamentos()
      this.selectedEmpresa = null
      this.EditModalOpened = false
    },
    openEditModal(empresa) {
      this.selectedEmpresa = empresa
      this.EditModalOpened = true
    }
  }
}
</script>
