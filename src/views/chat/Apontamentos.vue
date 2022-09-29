<template>
  <div>
    <b-loading :active.sync="loading"/>
    <div class="w-full flex justify-between items-start">
      <Lynx-Title text="Apontamentos"/>
      <Lynx-Button
        text="Adicionar Apontamentos"
        class="mb-4"
        icon="Plus"
        @click.native="openCreateModal"
        size="small"
        icon-size="3"
      />
    </div>
    <b-table
      v-if="apontamentos.length"
      :data="apontamentos"
      hoverables
      class="w-full pb-8"
      paginated
      :per-page="perPage"
    >
      <template slot-scope="props">
        <b-table-column label="ID" field="id" v-text="props.row.id" sortable searchable/>
        <b-table-column label="Nome" field="nome" v-text="props.row.nome" sortable searchable/>
        <b-table-column label="SLA Minutos" field="sla" v-text="props.row.sla" sortable searchable/>
        <b-table-column label="Ações">
          <div class="flex text-sm items-center">
            <a
              href="#"
              class="bg-primary-500 rounded-full p-2 mr-4"
              @click.prevent="openEditModal(props.row)"
            >
              <Icon-Edit class="text-neutral-100" size="4"/>
            </a>
            <a
              href="#"
              class="bg-error-base rounded-full p-2"
              @click.prevent="deleteApontamento(props.row.id)"
            >
              <Icon-Trash class="text-neutral-100" size="4"/>
            </a>
          </div>
        </b-table-column>
      </template>
    </b-table>
    <Not-Found-Data v-else-if="!loading" text="Nenhum apontamento registrado" />
    <b-modal :active.sync="createModal" v-if="createModal" width="600px">
      <Create-Apontamentos @create-apontamento="onCreateApontamento" />
    </b-modal>
    <b-modal :active.sync="editModal" v-if="editModal" width="600px">
      <Edit-Apontamentos :apontamento="currentApontamento" @edit-apontamento="onEditApontamento" />
    </b-modal>
  </div>
</template>

<script>

import { getApontamentosRequest, destroyApontamentosRequest } from '@/services/requests/apontamentos'
import CreateApontamentos from '@/views/chat/CreateApontamentos'
import EditApontamentos from '@/views/chat/EditApontamentos'
import NotFoundData from '@/components/layouts/NotFoundData'

export default {
  name: 'Apontamentos',
  components: { CreateApontamentos, EditApontamentos, NotFoundData },
  data() {
    return {
      loading: false,
      createModal: false,
      editModal: false,
      apontamentos: [],
      currentApontamento: null,
      perPage: 10,
    }
  },
  computed: {
    apontamentosFiltered() {
      return ''
    }
  },
  methods: {
    fetchApontamentos() {
      this.loading = true
      getApontamentosRequest()
        .then(res => this.apontamentos = res.data.data)
        .finally(() => this.loading = false)
    },
    openCreateModal() {
      this.createModal = true
    },
    openEditModal(id) {
      this.currentApontamento = id
      this.editModal = true
    },
    onCreateApontamento() {
      this.fetchApontamentos()
      this.createModal = false
    },
    onEditApontamento() {
      this.fetchApontamentos()
      this.editModal = false
    },
    deleteApontamento(id) {
      this.$buefy.dialog.confirm({
        message: 'Deseja realmente excluir este apontamento?',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        type: 'is-danger',
        onConfirm: () => this.onDeleteApontamento(id)
      })
    },
    onDeleteApontamento(id) {
      destroyApontamentosRequest(id)
        .then(() => {
          this.$snack.success('Apontamento excluido com sucesso')
          this.fetchApontamentos()
        })
        .catch(() => this.$snack.error('Não foi possivel excluir o apontamento'))
    }
  },
  beforeMount() {
    this.fetchApontamentos()
  }
}
</script>
