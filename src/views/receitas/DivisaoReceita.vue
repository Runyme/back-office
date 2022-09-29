<template>
  <div>
    <b-loading :active.sync="loading"/>
    <div class="w-full flex justify-between items-start">
      <Lynx-Title text="Divisão de Receita"/>
      <Lynx-Button text="Atualizar" class="mb-4" icon="Reload" @click.native="fetchData" size="small" icon-size="3"/>
    </div>
    <b-table
      :data="data"
      :columns="columns"
      :paginated="true"
      default-sort-direction="asc"
      default-sort="id"
      per-page="10"
      hoverables
      class="w-full"
    >
      <template slot-scope="props">
        <b-table-column field="id" v-text="props.row.id" />
        <b-table-column field="nome" v-text="props.row.nome" />
        <b-table-column field="acoes">
          <div class="flex text-sm items-center">
            <a href="#" class="mr-4 bg-primary-600 rounded-full p-2" @click.prevent="openEditModal(props.row)">
              <Icon-Edit class="text-neutral-100" size="4"/>
            </a>
          </div>
        </b-table-column>
      </template>
    </b-table>
    <b-modal @close="closeEditModal" v-if="editModal" :active.sync="editModal">
      <DivisaoReceitaEdit :empresa="currentEmpresa"/>
    </b-modal>
  </div>
</template>

<script>

import { allEmpresasRequest } from '@/services/requests/empresas'
import DivisaoReceitaEdit from '@/views/receitas/DivisaoReceitaEdit'

export default {
  name: 'DivisaoReceita',
  components: { DivisaoReceitaEdit, },
  data() {
    return {
      loading: false,
      editModal: false,
      columns: [
        {
          field: 'id',
          label: 'Número da empresa',
          searchable: true,
          sortable: true,
        },
        {
          field: 'nome',
          label: 'Nome da empresa',
          searchable: true,
          sortable: true,
        },
        {
          field: 'acoes',
          label: 'Ações',
        },
      ],
      data: [],
      currentEmpresa: null,
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      allEmpresasRequest()
        .then(res => this.data = res.data.data)
        .catch(() => this.$snack.error('Ocorreu um erro, tente novamente mais tarde'))
        .finally(() => this.loading = false);
    },
    openEditModal(empresa) {
      this.currentEmpresa = empresa
      this.editModal = true
    },
    closeEditModal() {
      this.currentEmpresa = null
      this.editModal = false
    }
  },
}
</script>

