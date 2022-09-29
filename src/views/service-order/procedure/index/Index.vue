<template>
  <div>
    <b-loading :active.sync="isLoading" />
    <div id="requests">
      <div class="flex justify-between items-center">
        <Lynx-Title text="Ordem de serviço base"/>
        <Lynx-Button class="mb-8" text="Cadastrar" icon="Plus" @click.native="goToOrderServiceBaseCreate"/>
      </div>
      <b-table :data="data">
        <template slot-scope="props">
          <b-table-column field="nome" label="Nome" v-text="props.row.nome"/>
          <b-table-column field="tipo_usuario_id" label="Setor" v-text="props.row.tipo_usuario_id"/>
          <b-table-column field="preco" label="Preço" v-text="props.row.preco"/>
          <b-table-column>
            <div class="flex text-sm items-center">
              <a href="#" class="bg-error-base rounded-full p-2" @click.prevent="deleteServiceOrderBaseOnConfirm(props.row)">
                <Icon-Trash class="text-neutral-100" size="4"/>
              </a>
            </div>
          </b-table-column>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>

import { fetchOsBasesRequest, deleteServiceOrderBaseRequest } from '@/services/requests/service-order-base'

export default {
  name: 'Index',
  data() {
    return {
      isLoading: false,
      data: [
        {},
      ],
    }
  },
  beforeMount() {
    this.searchServiceBaseOrder()
  },
  methods: {
    searchServiceBaseOrder() {
      this.isLoading = true
      fetchOsBasesRequest()
        .then(({data}) => this.data = data)
        .finally(() => this.isLoading = false)
    },
    goToOrderServiceBaseCreate() {
      this.$router.push( {name: 'procedure.create'} )
    },
    deleteServiceOrderBaseOnConfirm(item) {
      this.$buefy.dialog.confirm({
        title: 'Excluir Procedimento',
        message: 'Deseja realmente <b>eliminar</b> este procedimento?',
        confirmText: 'Excluir Procedimento',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.deleteServiceOrderBase(item.id)
      })
    },
    deleteServiceOrderBase(id) {
      this.isLoading = true
      deleteServiceOrderBaseRequest(id)
        .then(() => {
          this.$snack.success('Procedimento excluído com sucesso')
          this.searchServiceBaseOrder()
        })
        .finally(() => this.isLoading = false)
    }
  }
}
</script>
