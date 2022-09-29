<template>
  <div>
    <b-loading :active.sync="loading"/>
    <div class="w-full flex justify-between items-start">
      <Lynx-Title text="Holerites recebidos"/>

      <div class="flex flex-row-reverse items-end mb-4">
        <b-button
          class="is-primary ml-4"
          icon-right="refresh"
          @click.native="fetchUploads"
        >
          Atualizar Lista
        </b-button>
      </div>
    </div>

    <b-table :data="uploads" paginated per-page="10">
      <template slot-scope="props">
        <b-table-column label="#">
          C-{{ props.row[0].causer_id }}
        </b-table-column>
        <b-table-column label="Cliente">
          {{ props.row[0].causer.name }}
        </b-table-column>
        <b-table-column label="Arquivos">
          {{ props.row.length }}
        </b-table-column>
        <b-table-column>
          <div class="flex text-sm items-center">
            <Lynx-Button
              class="rounded-full py-2 mr-2"
              size="small"
              @click.native="openModal(props)"
              icon="Eye"
              icon-size="4"
            />
          </div>
        </b-table-column>
      </template>
      <template v-slot:empty>
        <NotFoundData text="Nenhum arquivo por aqui!"/>
      </template>
    </b-table>

    <b-modal :active.sync="modalOpened">
      <Receitas :customer-id="selectedCustomer"/>
    </b-modal>
  </div>
</template>

<script>

import NotFoundData from "@/components/layouts/NotFoundData";
import {deleteUploadRequest, getUploadsByType} from "@/services/requests/uploads";
import {formatEnToBr} from "@/utils/momentHelpers";
import Receitas from "@/views/clientes/show/Receitas";

export default {
  name: "Holerites",
  components: {Receitas, NotFoundData},
  data() {
    return {
      loading: false,
      uploads: [],
      selectedCustomer: null,
      modalOpened: false,
    }
  },
  filters: {
    formatEnToBr
  },
  computed: {},
  mounted() {
    this.fetchUploads()
  },
  methods: {
    fetchUploads() {
      this.loading = true
      getUploadsByType('holerite', {withCauser: true})
        .then(response => {
          let result = []
          for (let {causer_id, ...fields} of response.data.data) {
            if (!result[causer_id]) result[causer_id] = [];
            result[causer_id].push({...fields, causer_id});
          }
          this.uploads = result
        })
        .catch(() => this.$snack.error('Erro ao consultar uploads!'))
        .finally(() => this.loading = false)
    },
    deleteUpload(props) {
      if (!confirm('Certeza?')) return false
      this.loading = true
      deleteUploadRequest(props.row.id)
        .then(() => this.uploads.splice(props.index, 1))
        .catch(() => this.$snack.error('Nao foi possivel deletar!'))
        .finally(() => this.loading = false)
    },
    openModal(props) {
      this.modalOpened = true
      this.selectedCustomer = props.row[0].causer_id
    }
  }
}
</script>

<style scoped>

</style>
