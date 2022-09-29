<template>
  <div class="bg-white p-5 rounded flex items-center w-full transition hover:shadow-lg ">
    <div class="flex justify-center w-full" v-if="loading">
      <Lynx-Spinner size="12"/>
    </div>

    <div v-else class="w-full sticky">
      <h2 class="text-lg md:text-base text-neutral-600 transition">{{ header.title }}</h2>
      <div class="pt-2 flex flex-col items-center w-full ">
        <InputCompetenciaDate
          v-model="competencia"
          position="is-bottom-right"
          @input="fetchDataSet"
          class="absolute w-32"
          style="right: 0; top: 0"
        />
        <PaymentsStatsChart :values="values" :label="label"/>
      </div>
    </div>
  </div>
</template>

<script>

import {monthlyPaymentsStats} from "@/services/requests/charts";
import PaymentsStatsChart from "@/views/charts/PaymentsStatsChart";
import InputCompetenciaDate from "@/components/helpers/InputCompetenciaDate";

export default {
  name: 'PaymentsMonthlyStats',
  components: {InputCompetenciaDate, PaymentsStatsChart},
  data() {
    return {
      header: {
        title: 'Resumo de pagamentos',
        icon: 'Money',
      },
      loading: true,
      competencia: null,
      values: [],
      label: [],
    }
  },
  methods: {
    fetchDataSet() {
      monthlyPaymentsStats({competencia: this.competencia})
        .then(res => {
          this.values = res.data.data
          this.label = res.data.labels
        })
        .finally(() => this.loading = false)
    }
  },
  mounted() {
    this.fetchDataSet()
  }
}
</script>
