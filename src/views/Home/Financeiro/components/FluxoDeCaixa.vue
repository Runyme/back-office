<template>
  <div v-if="hasRole('super-admin')" class="bg-white p-5 rounded flex items-center w-full transition hover:shadow-lg">
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

import {fluxoCaixaRequest} from "@/services/requests/charts";
import FluxoDeCaixaChart from "@/views/charts/FluxoDeCaixaChart";
import {hasRole} from '@/utils/can';
export default {
  name: 'FluxoDeCaixa',
  components: {FluxoDeCaixaChart},
  data() {
    return {
      header: {
        title: 'Fluxo de caixa',
        icon: 'Money',
      },
      loading: true,
      values: [],
      label: [],
    }
  },
  methods: {
     hasRole,
    fetchDataSet() {
      fluxoCaixaRequest()
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
