<template>
  <div class="bg-white p-5 rounded w-full flex items-center">
    <div class="flex justify-center w-full" v-if="loading">
      <Lynx-Spinner size="12"/>
    </div>
    <div v-else class="w-full">
      <h2 class="text-lg md:text-base text-neutral-600">{{ header.title }}</h2>
      <div class="pt-2 flex flex-col items-center w-full">
        <EmpresaCarteiraChart :values="dataSet" :label="label"/>
      </div>
    </div>
  </div>
</template>

<script>

import EmpresaCarteiraChart from "@/views/charts/empresas/EmpresaCarteiraChart";
import {companiesCarteiraRequest} from "@/services/requests/charts";

export default {
  name: 'EmpresaStatus',
  components: {EmpresaCarteiraChart},
  data() {
    return {
      header: {
        title: 'Empresa Por Carteira',
        icon: 'Document'
      },
      loading: true,
      dataSet: [],
      label: [],
    }
  },
  methods: {
    fetchResults() {
      this.loading = true
      companiesCarteiraRequest()
        .then(res => {
            console.log(res.data)
          this.dataSet = res.data.datasets
          this.label = res.data.label
        })
        .finally(() => this.loading = false)
    }
  },
  beforeMount() {
    this.fetchResults()
  },
}
</script>
