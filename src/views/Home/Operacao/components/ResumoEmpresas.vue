<template>
  <div class="flex bg-white p-5 rounded w-full items-center">
    <div class="flex justify-center w-full" v-if="loading">
      <Lynx-Spinner size="12"/>
    </div>
    <div v-else class="w-full transition">
      <h2 class="text-lg md:text-base text-neutral-600">{{ header.title }}</h2>
      <div class="pt-2 flex flex-col items-center w-full">
        <ResumoGeralEmpresas :values="dataSet"/>
      </div>
    </div>
  </div>
</template>
<script>

import ResumoGeralEmpresas from '@/views/charts/empresas/ResumoGeralEmpresas'
import {companiesQuantityStatsRequest} from "@/services/requests/charts";

export default {
  name: 'ResumoEmpresas',
  components: {ResumoGeralEmpresas},
  data() {
    return {
      header: {
        title: 'Resumo Geral de Empresas',
        icon: 'Company'
      },
      loading: true,
      dataSet: {},
    }
  },
  methods: {
    fetchDataSet() {
      companiesQuantityStatsRequest()
        .then(res => this.dataSet = res.data)
        .finally(() => this.loading = false)
    }
  },
  mounted() {
    this.fetchDataSet()
  }
}
</script>
