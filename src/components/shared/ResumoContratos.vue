<template>
  <div class="bg-white p-5 rounded w-full flex items-center">
    <div class="flex justify-center w-full" v-if="loadingChart">
      <Lynx-Spinner size="12"/>
    </div>
    <div class="w-full" v-else>
      <h2 class="text-lg md:text-base text-neutral-600">Contratos</h2>
      <div class="flex w-full">
        <EmpresaContratosChart :values="dataSet"/>
      </div>
    </div>
  </div>
</template>

<script>

import EmpresaContratosChart from '@/views/charts/empresas/EmpresaContratosChart'
import {companiesContractStatsRequest} from "@/services/requests/charts";

export default {
  name: 'EmpresasContrados',
  components: {EmpresaContratosChart},
  data() {
    return {
      header: {
        title: 'Status dos Contratos',
        icon: 'Document'
      },
      dataSet: {},
      loadingChart: true,
    }
  },
  beforeMount() {
    companiesContractStatsRequest()
      .then(res => this.dataSet = res.data)
      .finally(() => this.loadingChart = false)
  },
}
</script>
