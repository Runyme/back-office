<template>
  <div class="h-full">
    <Card
      :header="{
        title: 'Empresas',
        icon: 'Company'
      }"
    >
      <div class="px-4 w-full">
        <div class="w-full flex justify-center py-4" v-if="loading">
          <Lynx-Spinner size="16"/>
        </div>
        <div class="flex-col pt-6" v-else>
          <a
            href="#"
            class="mb-6 flex items-center max-w-full"
            v-for="empresa in empresas"
            :key="empresa.id"
          >
            <ul class="flex-grow max-w-full pr-12">
              <li class="flex items-center pb-4">
                <Icon-Company class="text-primary-700 flex-shrink-0"/>
                <p class="text-primary-700 pl-2 truncate">Nome: <span class="font-light text-neutral-800" v-text="empresa.razao_social"/></p>
              </li>
              <li class="flex items-center">
                <Icon-Id class="text-primary-700 flex-shrink-0"/>
                <p class="text-primary-700 pl-2 truncate">CNPJ: <span class="font-light text-neutral-800">{{empresa.cnpj}}</span></p>
              </li>
            </ul>
            <Icon-ArrowRight class="text-primary-700 flex-shrink-0"/>
          </a>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import Card from '@/components/helpers/Card'
import { clientesEmpresasRequest } from '@/services/requests/clientes'

export default {
  name: 'ClientesShowEmpresas',
  components: { Card },
  data() {
    return {
      empresas: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters(['getCliente'])
  },
  methods: {
    fetchEmpresas() {
      this.loading = true
      clientesEmpresasRequest(this.getCliente.id)
        .then(res => this.empresas = res.data.data)
        .finally(() => this.loading = false)
    }
  },
  mounted() {
    this.fetchEmpresas()
  }
}
</script>
