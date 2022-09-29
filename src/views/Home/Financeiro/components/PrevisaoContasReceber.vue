<template>
  <div class="bg-white p-5 rounded flex items-center w-full transition hover:shadow-lg">
    <div class="flex justify-center w-full" v-if="loading">
      <Lynx-Spinner size="12"/>
    </div>

    <div v-else class="w-full">
      <h2 class="text-lg md:text-base text-neutral-600 transition">{{ header.title }}</h2>
      <div class="pt-2 flex flex-col items-center w-full">
        <FluxoDeCaixaChart :values="values" :label="label"/>
      </div>
    </div>
  </div>
</template>

<script>

import {previsaoFluxoCaixaRequest} from "@/services/requests/charts";
import FluxoDeCaixaChart from "@/views/charts/FluxoDeCaixaChart";

export default {
  name: 'PrevisaoContasReceber',
  components: {FluxoDeCaixaChart},
  data() {
    return {
      header: {
        title: 'Previsão de recebimento',
        icon: 'Money',
      },
      loading: true,
      values: [],
      label: [],
    }
  },
  methods: {
    fetchDataSet() {
      previsaoFluxoCaixaRequest()
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
