<template>
  <div>
    <Lynx-Title text="Pesquise um cliente"/>
    <div class="max-w-md flex w-full flex-col">
      <label class="flex flex-col w-full">
        <Lynx-Label label="Nome ou CPF do cliente"/>
        <Lynx-Input
          placeholder="Digite o nome ou o CPF do cliente"
          icon="Search"
          @input="fetchClientes"
          v-model="cliente_nome_cpf"
        />
      </label>
    </div>
    <div class="w-full flex justify-center pt-8" v-if="loading">
      <Lynx-Spinner size="16" />
    </div>
    <div class="w-full flex mt-8 grid grid-cols-2 gap-8 items-start" v-else-if="clientes.length">
      <Card 
        class="font-body cursor-pointer" 
        color="primary-500"
        v-for="cliente in clientes" :key="cliente.id"
      >
        <div class="w-full" @click="onSelectCliente(cliente.id)">
          <div class="p-6 flex flex-col w-full">
            <div class="flex items-center pb-4">
              <Icon-User class="text-primary-700"/>
              <p class="text-primary-700 pl-2">Nome: <span class="font-light text-neutral-800" v-text="cliente.nome_completo"/></p>
            </div>
            <div class="flex items-center pb-4">
              <Icon-Id class="text-primary-700"/>
              <p class="text-primary-700 pl-2">CPF: <span class="font-light text-neutral-800" v-text="cliente.cpf"/></p>
            </div>
            <div class="flex items-center">
              <Icon-Male class="text-primary-700"/>
              <p class="text-primary-700 pl-2">Idade: <span class="font-light text-neutral-800" v-text="cliente.idade"/></p>
            </div>
          </div>
        </div>
      </Card>
    </div>
    <Not-Found-Data class="mt-8" text="Nenhum cliente foi encontrado" v-else-if="notFoundData"/>
  </div>
</template>

<script>

import { clientesSearchRequest, clientesShowRequest } from '@/services/requests/clientes'
import { mapActions } from 'vuex'
import Card from '@/components/helpers/Card'
import NotFoundData from '@/components/layouts/NotFoundData'
import bus from '@/services/bus'

export default {
  name: 'ClientesIndex',
  components: { Card, NotFoundData },
  data() {
    return {
      cliente_nome_cpf: '',
      clientes: [],
      loading: false,
      loadingButton: false,
      notFoundData: false
    }
  },
  methods: {
    ...mapActions(['setCliente']),
    fetchClientes() {
      if(this.cliente_nome_cpf.length < 5) return
      this.loading = true
      clientesSearchRequest(this.cliente_nome_cpf)
        .then(res => {
          this.clientes = res.data.data
          this.notFoundData = !res.data.data.length
        })
        .finally(() => this.loading = false)
    },
    onSelectCliente(id) {
      bus.globalLoading = true
      clientesShowRequest(id)
        .then(res => {
          this.setCliente(res.data.data)
          this.$router.push({ name: 'clientes.show' })
        })
        .catch(() => this.$snack.error('Ocorreu um erro tente novamente'))
        .finally(() => bus.globalLoading = false)
    }
  }
}
</script>