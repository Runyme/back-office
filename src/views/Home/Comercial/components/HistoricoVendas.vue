<template>
  <div class="bg-white p-5 rounded flex items-center w-full">
    <div class="flex justify-center w-full" v-if="loading">
      <Lynx-Spinner size="12"/>
    </div>

    <div v-else class="w-full">
      <h2 class="text-lg md:text-base text-neutral-600 transition">{{ header.title }}</h2>
      <div class="pt-2 flex flex-col items-center w-full">
        <HistoricoVendasChart :values="values" :label="label"/>
      </div>
    </div>
  </div>
</template>

<script>

import HistoricoVendasChart from "@/views/charts/empresas/HistoricoVendasChart";
import {salesQuantityByMonthRequest} from "@/services/requests/charts";

export default {
  name: 'HistoricoVendas',
  components: {HistoricoVendasChart},
  data() {
    return {
      header: {
        title: 'Vendas efetivadas',
        icon: 'Document',
      },
      loading: true,
      values: [],
      label: [],
    }
  },
  methods: {
    fetchDataSet() {
      salesQuantityByMonthRequest()
        .then(res => {
          this.values = res.data.data
          this.label = res.data.label
        })
        .finally(() => this.loading = false)
    }
  },
  mounted() {
    this.fetchDataSet()
  }
}
</script>
