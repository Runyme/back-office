<template>
  <div>
    <b-loading :active.sync="loading"/>
    <div class="w-full flex justify-between items-start">
      <Lynx-Title text="Contratantes"/>
      <Lynx-Button 
        text="Adicionar Contratante" 
        class="mb-4" 
        icon="Plus" 
        @click.native="openCreateModal" 
        size="small" 
        icon-size="3"
      />
    </div>
    <b-table
      v-if="contratantes.length"
      :data="contratantes"
      hoverables
      class="w-full pb-8"
    >
      <template slot-scope="props">
        <b-table-column label="Nome" field="nome" v-text="props.row.nome" sortable searchable/>
        <b-table-column label="Endereço" field="endereco" v-text="props.row.endereco.logradouro" sortable searchable/>
        <b-table-column label="Email" v-text="props.row.email" />
        <b-table-column label="Celular" v-text="props.row.celular" />
        <b-table-column label="Ações">
          <div class="flex text-sm items-center">
            <a 
              href="#" 
              class="mr-4 bg-primary-600 rounded-full p-2"
              @click.prevent="openViewModal(props.row.id)"
            >
              <Icon-Eye class="text-neutral-100" size="4"/>
            </a>
            <a 
              href="#" 
              class="bg-error-base rounded-full p-2" 
              @click.prevent="deleteContratante(props.row.id)"
            >
              <Icon-Trash class="text-neutral-100" size="4"/>
            </a>
          </div>
        </b-table-column>
      </template>
    </b-table>
    <Not-Found-Data v-else-if="!loading" text="Nenhum contratante registrado" />
    <b-modal :active.sync="viewModal" v-if="viewModal" width="600px">
      <View-Contratante
        :contratante-id="currentContratanteId"
        @edit-contratante="onEditContratante"
      />
    </b-modal>
    <b-modal :active.sync="createModal" v-if="createModal" width="600px">
      <Create-Contratante @create-contratante="onCreateContratante" />
    </b-modal>
  </div>
</template>

<script>

import { indexContratanteRequest, destroyContratanteRequest } from '@/services/requests/contratantes'
import ViewContratante from '@/views/contratantes/View'
import CreateContratante from '@/views/contratantes/Create'
import NotFoundData from '@/components/layouts/NotFoundData'

export default {
  name: 'ContratantesIndex',
  components: { ViewContratante, CreateContratante, NotFoundData },
  data() {
    return {
      loading: false,
      createModal: false,
      viewModal: false,
      contratantes: [],
      currentContratanteId: null,
    }
  },
  methods: {
    fetchContratantes() {
      this.loading = true
      indexContratanteRequest()
        .then(res => this.contratantes = res.data.data)
        .finally(() => this.loading = false)
    },
    openCreateModal() {
      this.createModal = true
    },
    openViewModal(currentContratanteId) {
      this.currentContratanteId = currentContratanteId
      this.viewModal = true
    },
    onEditContratante() {
      this.fetchContratantes()
      this.viewModal = false
    },
    onCreateContratante() {
      this.fetchContratantes()
      this.createModal = false
    },
    deleteContratante(id) {
      this.$buefy.dialog.confirm({
        message: 'Deseja realmente excluir este contratante?',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        type: 'is-danger',
        onConfirm: () => this.onDeleteContratante(id)
      })
    },
    onDeleteContratante(id) {
      destroyContratanteRequest(id)
        .then(() => {
          this.$snack.success('Contratante excluida com sucesso')
          this.fetchContratantes()
        })
        .catch(() => this.$snack.error('Não foi possivel excluir o contratante'))
    }
  },
  beforeMount() {
    this.fetchContratantes()
  }
}
</script>