<template>
  <div class="bg-neutral-300 shadow p-8 flex flex-col">
    <Lynx-Title text="Buscar Cliente" />

    <div class="w-full flex justify-center" v-if="loading">
      <Lynx-Spinner size="12"/>
    </div>

    <form class="flex items-center mb-4" @submit.prevent="fetchClientes" v-else>
      <Lynx-Input
        class="w-full mr-4"
        placeholder="Digite o nome ou CPF do cliente"
        v-model="cliente_nome_cpf"
      />

      <Lynx-Button type="submit" text="Buscar" icon="Search" size="small" :loading="loading" :disable="loading"/>
    </form>

    <b-table
      v-if="clientes.length"
      :data="clientes"
      :columns="columns"
      :loading="loading"
      narrowed
      hoverable
      class="my-4"
      :selected.sync="selected">
    </b-table>

    <Not-Found-Data class="my-4" text="Nenhum cliente foi encontrado" v-else />

    <div class="self-end mt-4 flex">
      <Lynx-Button
        type="submit"
        text="Criar Cliente"
        class="mr-4"
        @click.native.prevent="addCliente"
      />

      <Lynx-Button
        type="submit"
        text="Selecionar Cliente"
        class=""
        :disabled="selected == null"
        @click.native.prevent="selectCliente"
      />
    </div>

    <b-modal :can-cancel="modalCanCancel" :active.sync="clienteCreateModalOpened">
      <ClienteCreateForm @created="onClienteCreated" class="p-8" />
    </b-modal>
  </div>
</template>

<script>

import { clientesSearchRequest } from '@/services/requests/clientes'
import NotFoundData from '@/components/layouts/NotFoundData'
import ClienteCreateForm from '@/views/clientes/CreateForm'

export default {
  name: 'ClientesSearchModal',
  components: { ClienteCreateForm, NotFoundData },
  data() {
    return {
      loading: false,
      clienteCreateModalOpened: false,
      modalCanCancel: ['x'],
      cliente_nome_cpf: '',
      clientes: [],
      selected: null,
      columns: [
        {
          field: 'nome_completo',
          label: 'Nome',
        },
        {
          field: 'cpf',
          label: 'CPF',
        },
      ],
    }
  },
  methods: {
    fetchClientes() {
      if (this.cliente_nome_cpf.length < 5) return
      this.loading = true
      clientesSearchRequest(this.cliente_nome_cpf)
        .then(res => {
          this.clientes = res.data.data
        })
        .finally(() => this.loading = false)
    },
    selectCliente() {
      if (this.selected == null) return
      this.$emit('selected', this.selected)
    },
    addCliente() {
      this.clienteCreateModalOpened = true
    },
    onClienteCreated(cliente) {
      this.clienteCreateModalOpened = false
      this.$emit('selected', cliente)
    }
  },
}
</script>
