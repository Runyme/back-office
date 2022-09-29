<template>
  <div>
    <div class="flex justify-between items-center">
      <Lynx-Title text="Todas as Empresas"/>
      <router-link class="mb-8" :to="{ name: 'empresas.index' }">
        <Lynx-Button text="Voltar" icon="ArrowLeft" outlined="true"/>
      </router-link>
    </div>

    <div class="w-full flex justify-between items-end pb-6">
      <div class="flex flex-col">
      <b-field label="Status" >
        <b-select placeholder="Selecione um status" v-model="selectedStatus">
          <option
            v-for="(item, key) in status_empresas"
            :value="item.name"
            :key="key">
            {{ item.description }}
          </option>
        </b-select>
      </b-field>
      </div>
     <div class="flex flex-col">
         <Lynx-Button
        color="neutral-800"
        text="Relatorio Empresas"
        icon="Search"
        icon-size="4"
        size="small"
        @click.native="gerarRelatorio"
      />
         </div>
    </div>

    <div class="flex justify-center" v-if="loading">
      <Lynx-Spinner size="16"/>
    </div>
    <b-table
      :data="filteredEmpresas"
      :columns="columns"
      :paginated="true"
      default-sort-direction="asc"
      default-sort="id"
      per-page="10"
      class="w-full"
      v-else
    >
      <template slot-scope="props">
        <b-table-column field="id" v-text="props.row.id"/>
        <b-table-column field="razao_social" v-text="props.row.razao_social"/>
        <b-table-column>
          <b-tag v-if="props.row.status === 'desativada'" type="is-danger">Desativada</b-tag>
          <b-tag v-if="props.row.status === 'desativacao_agendada'" type="is-warning">Desativação Agendada</b-tag>
          <b-tag v-if="props.row.status === 'congelada'" type="is-warning">Congelada</b-tag>
          <b-tag v-if="props.row.status === 'abertura'" type="is-primary">Em Abertura</b-tag>
          <b-tag v-if="props.row.status === 'normal'" type="is-default">Normal</b-tag>
          <b-tag v-if="props.row.status === 'residencia'" type="is-info">Residência</b-tag>

        </b-table-column>
        <b-table-column field="acoes">
          <div class="flex text-sm items-center">
            <Tooltip content="Detalhes">
              <a href="#" class="bg-primary-600 rounded-full p-2" @click.prevent="openDetailsModal(props.row.id)">
                <Icon-Document class="text-neutral-100" size="4"/>
              </a>
            </Tooltip>
          </div>
        </b-table-column>
      </template>
    </b-table>
    <b-modal :active.sync="detailsModal">
      <Detalhes :empresa-id="currentEmpresaId" @close-modal="onCloseDetailsModal"/>
    </b-modal>
  </div>
</template>

<script>

import {allEmpresasRequest} from '@/services/requests/empresas'
import Tooltip from '@/components/globals/Tooltip'
import Detalhes from '@/views/empresas/all/Detalhes'

export default {
  name: 'EmpresasAll',
  components: {Tooltip, Detalhes},
  data() {
    return {
      empresas: [],
      loading: false,
      detailsModal: false,
      currentEmpresaId: null,
      selectedStatus: null,
      status_empresas: [
        {
          name: null,
          description: 'Todas'
        },
        {
          name: 'desativada',
          description: 'Desativada'
        },
        {
          name: 'normal',
          description: 'Normal'
        },
        {
          name: 'abertura',
          description: 'Em Abertura'
        },
        {
          name: 'congelada',
          description: 'Congelada'
        },
           {
          name: 'residencia',
          description: 'Residência'
        },
      ],
      columns: [
        {
          field: 'id',
          label: 'ID',
          searchable: true,
          sortable: true,
        },
        {
          field: 'razao_social',
          label: 'Razão Social',
          searchable: true,
          sortable: true,
        },
        {},
        {
          field: 'acoes',
          label: 'Ações',
        },
      ],
    }
  },
  computed: {
    filteredEmpresas: function () {
      return this.empresas.filter(item => {
        if (!this.selectedStatus) return true
        return item.status === this.selectedStatus
      })
    }
  },
  methods: {
    fetchAllEmpresas() {
      this.loading = true
      allEmpresasRequest()
        .then(res => this.empresas = res.data.data)
        .finally(() => this.loading = false)
    },
    openDetailsModal(id) {
      this.currentEmpresaId = id
      this.detailsModal = true
    },
    onCloseDetailsModal() {
      this.detailsModal = false
      this.currentEmpresaId = null
    },
      async gerarRelatorio() {
      // this.loading = true;
      let params = {status:null};
      params.status = this.selectedStatus;

      await this.$store.dispatch("empresas/gerarRelatorioEmpresa", params);
      // this.loading = false;
    },
  },
  beforeMount() {
    this.fetchAllEmpresas()
  },
 
}
</script>
