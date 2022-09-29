<template>
  <div>
    <Lynx-Title text="Pesquise uma empresa"/>
    <div class="max-w-md flex w-full flex-col">
      <form class="flex items-end w-full mb-8" @submit.prevent="onSearchEmpresaById">
        <label class="flex flex-col w-full">
          <Lynx-Label
            label="Número da Empresa"
          />
          <Lynx-Input
            v-model="empresa_id"
            placeholder="Digite o número da empresa"
            type="number"
            required
          />
        </label>
        <Lynx-Button
          class="ml-6"
          size="small"
          type="submit"
          text="Confirmar"
          icon="ArrowRight"
        />
      </form>
      <label class="flex flex-col w-full">
        <Lynx-Label label="Nome ou CNPJ da empresa"/>
        <Lynx-Input
          placeholder="Digite o nome ou o CNPJ da empresa"
          icon="Search"
          @input="fetchEmpresas"
          v-model="empresa_nome_cnpj"
        />
      </label>
      <router-link class="pt-8" :to="{ name: 'empresas.all' }">
        <Lynx-Button text="Ver todas" outlined="true"/>
      </router-link>
    </div>
    <div class="w-full flex justify-center pt-8" v-if="loading">
      <Lynx-Spinner size="16" />
    </div>
    <div class="w-full flex mt-8 grid grid-cols-2 gap-8 items-start" v-else-if="empresas.length">
      <Card
        class="font-body cursor-pointer"
        color="primary-500"
        v-for="empresa in empresas"
        :key="empresa.id"
      >
        <div @click="goToEmpresa(empresa.id)">
          <div class="p-6 flex items-start">
            <span class="font-bold text-lg py-1 px-2 text-neutral-100 bg-neutral-700 mr-4" v-text="empresa.id"></span>
            <div class="flex flex-col ml-4">
              <p class="font-semibold pb-4 text-primary-800">Nome: <span class="text-neutral-800 font-normal text-neutral-700">{{empresa.razao_social}}</span></p>
              <p class="font-semibold text-primary-800">CNPJ: <span class="text-neutral-800 font-normal text-neutral-700">{{empresa.cnpj}}</span></p>
            </div>
          </div>
        </div>
      </Card>
    </div>
    <Not-Found-Data class="mt-8" text="Nenhuma empresa foi encontrada" v-else-if="notFoundData"/>
  </div>
</template>

<script>

import { searchEmpresasRequest, empresasShowRequest } from '@/services/requests/empresas'
import { mapActions } from 'vuex'
import Card from '@/components/helpers/Card'
import NotFoundData from '@/components/layouts/NotFoundData'
import bus from '@/services/bus'

export default {
  name: 'EmpresasIndex',
  components: { Card, NotFoundData },
  data() {
    return {
      empresa_id: '',
      empresa_nome_cnpj: '',
      empresas: [],
      loading: false,
      loadingButton: false,
      notFoundData: false
    }
  },
  methods: {
    ...mapActions(['setEmpresa']),
    goToEmpresa(id) {
      bus.globalLoading = true
      empresasShowRequest(id)
        .then(res => {
          this.setEmpresa(res.data.data)
          this.$router.push({ name: 'empresas.show' })
        })
        .catch(() => this.$snack.error('Empresa não encontrada'))
        .finally(() => bus.globalLoading = false)
    },
    onSearchEmpresaById() {
      if(!this.empresa_id) {
        this.$snack.error('Digite o número da empresa')
        return
      }
      this.goToEmpresa(this.empresa_id)
    },
    fetchEmpresas() {
      if(this.empresa_nome_cnpj.length < 5) return
      this.loading = true
      searchEmpresasRequest(this.empresa_nome_cnpj)
        .then(res => {
          this.empresas = res.data.data
          this.notFoundData = !res.data.data.length
        })
        .finally(() => this.loading = false)
    },
  }
}
</script>
