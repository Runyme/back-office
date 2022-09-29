<template>
  <div class="h-full w-full">
    <div class="flex items-center truncate px-8 pt-8">
      <div
        class="p-2 bg-primary-500 text-primary-100 mr-8 rounded text-2xl mb-8"
      >{{ empresa.id }}
      </div>
      <Lynx-Title :text="empresa.razao_social || '...'" />
    </div>
    <div class="flex pb-8">
      <div class="px-8 w-full">
        <!-- <span class="text-display text-2xl text-primary-600">Dados Cadastrais</span> -->
        <div class="flex items-center">
          <ul class="flex-grow pr-4">
            <li class="py-3 flex items-center">
              <p class="text-neutral-700 pl-2 font-bold">Nome: <span class="font-normal text-neutral-800">{{empresa.razao_social}}</span></p>
            </li>
            <li class="py-3 flex items-center">
              <p class="text-neutral-700 pl-2 font-bold">CNPJ: <span class="font-normal text-neutral-800">{{empresa.cnpj}}</span></p>
            </li>
          </ul>
          <a href="#" @click.prevent="goToEmpresa(empresa.id)">
            <Icon-ArrowRight class="text-primary-600"/>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { empresasShowRequest } from '@/services/requests/empresas'
import bus from '@/services/bus'
import { mapActions } from 'vuex'

export default {
  name: 'ClienteShowEmpresa',
  props: ['empresa'],
  methods: {
    ...mapActions(['setEmpresa']),
    goToEmpresa(id) {
      bus.globalLoading = true
      empresasShowRequest(id)
        .then(res => {
          this.setEmpresa(res.data.data)
          this.$router.push({ name: 'empresas.show'})
        })
        .finally(() => bus.globalLoading = false)
    }
  }
}
</script>
