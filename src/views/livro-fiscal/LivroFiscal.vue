<template>
  <div>
    <b-loading :active.sync="loading"/>
    <div class="w-full flex justify-between items-start">
      <Lynx-Title text="Livro fiscal"/>

      <div class="flex flex-row-reverse items-end mb-4">
        <b-button
          class="is-primary ml-4"
          icon-right="refresh"
          @click.native="fetchPendencies"
        >
          Atualizar Lista
        </b-button>
      </div>
    </div>

    <div class="w-full flex justify-start">
      <b-field label="Pesquisar">
        <b-input placeholder="Pesquise algo" v-model="searchInput"/>
      </b-field>

      <b-field label="Ano" class="ml-4">
        <b-select placeholder="Selecione um ano" v-model="selectedYear">
          <option
            v-for="item in yearInterval"
            :value="item"
            :key="item">
            {{ item }}
          </option>
        </b-select>
      </b-field>

      <b-field label="Status" class="ml-4">
        <b-select placeholder="Selecione um status" v-model="filter_status" @input="fetchPendencies">
          <option
            v-for="item in ['pendente', 'entregue', 'justificado']"
            :value="item"
            :key="item">
            {{ item }}
          </option>
        </b-select>
      </b-field>

      <b-field label="Carteira" class="ml-4">
        <b-select placeholder="Selecione uma carteira" v-model="selectedCarteira">
          <option value="">Todas</option>
          <option
            v-for="item in carteiras"
            :value="item.id"
            :key="item.id">
            {{ item.nome }}
          </option>
        </b-select>
      </b-field>
    </div>

    <b-table :data="filteredPendencies" per-page="10" paginated>
      <template slot-scope="props">
        <b-table-column label="Empresa" field="id" v-text="props.row.empresa_id" sortable/>
        <b-table-column label="Razão social" field="empresa" v-text="props.row.empresa.razao_social" sortable/>
        <b-table-column label="Ano" field="ano" v-text="props.row.ano" sortable/>
        <b-table-column label="Status" field="status">
          <b-tag :type="props.row.status | statusLabel">
            {{ props.row.status }}
          </b-tag>
        </b-table-column>
        <b-table-column>
          <div class="flex text-sm items-center">
            <a href="#" class="mr-4 bg-primary-600 rounded-full p-2" @click.prevent="openModal(props.row)">
              <Icon-Eye class="text-neutral-100" size="4"/>
            </a>
            <a v-if="$hasRole('Super Contador')" href="#" class="bg-error-base rounded-full p-2"
               @click.prevent="deletePending(props)">
              <Icon-Trash class="text-neutral-100" size="4"/>
            </a>
          </div>
        </b-table-column>
      </template>
      <template v-slot:empty>
        <NotFoundData text="Nenhuma pendência encontrada"/>
      </template>
    </b-table>

    <b-modal :active.sync="modalOpened" @close="closeModal">
      <show :data="selectedItem" @updated="itemModalUpdated"/>
    </b-modal>
  </div>
</template>

<script>
import NotFoundData from "@/components/layouts/NotFoundData";
import {deleteLivroFiscalRequest, getLivroFiscalRequest} from "@/services/requests/livroFiscal";
import Show from "@/views/livro-fiscal/Show";
import {carteirasRequest} from "@/services/requests/carteiras";

export default {
  name: "LivroFiscal",
  components: {Show, NotFoundData},
  data() {
    return {
      loading: false,
      pendencies: [],
      selectedItem: {},
      modalOpened: false,
      filter_status: 'pendente',
      selectedYear: null,
      searchInput: null,
      selectedCarteira: null,
      carteiras: [],
    }
  },
  filters: {
    statusLabel(value) {
      if (value === 'justificado') return ''
      if (value === 'pendente') return 'is-warning'
      if (value === 'entregue') return 'is-success'
    }
  },
  mounted() {
    this.fetchPendencies()
    this.fetchCarteiras()
  },
  computed: {
    filteredPendencies() {
      return this.pendencies
        .filter(item => this.selectedYear ? item.ano === this.selectedYear : true)
        .filter(item => this.searchInput ? this.searchFilter(item) : true)
        .filter(item => this.selectedCarteira && item.empresa.carteiras ? this.filterCarteira(item) : true)
    },
    yearInterval() {
      let currentYear = new Date().getFullYear()
      let years = []
      let startYear = new Date().getFullYear() - 15
      while (startYear <= currentYear) {
        years.push(startYear++);
      }
      return years;
    }
  },
  methods: {
    fetchCarteiras() {
      return carteirasRequest()
        .then(res => this.carteiras = res.data.data)
        .catch(() => this.$snack.error('Ocorreu um erro, tente novamente mais tarde.'))
    },
    filterCarteira(item) {
      return item.empresa.carteiras.filter(carteira => carteira.id === this.selectedCarteira).length
    },
    searchFilter(item) {
      let serializedFields = JSON.stringify({
        id: item.empresa_id,
        razao_social: item.empresa.razao_social
      });
      return serializedFields.toLowerCase().indexOf(this.searchInput.toLowerCase()) !== -1
    },
    itemModalUpdated() {
      this.closeModal()
      this.fetchPendencies();
    },
    closeModal() {
      this.modalOpened = false
      this.selectedItem = {}
    },
    fetchPendencies() {
      this.loading = true
      getLivroFiscalRequest({status: this.filter_status})
        .then(response => this.pendencies = response.data)
        .catch(() => this.$snack.error('Não foi possível realizar a consulta.'))
        .finally(() => this.loading = false)
    },
    openModal(item) {
      this.selectedItem = item
      this.modalOpened = true
    },
    deletePending(item) {
      if (!confirm('Tem certeza que deseja remover este registro?')) return false
      this.loading = true
      deleteLivroFiscalRequest(item.row.id)
        .then(() => this.pendencies.splice(item.index, 1))
        .catch(() => this.$snack.error('Erro ao remover registro.'))
        .finally(() => this.loading = false)
    },
  }
}
</script>

<style scoped>

</style>
