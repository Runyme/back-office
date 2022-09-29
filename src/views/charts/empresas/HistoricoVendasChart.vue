<template>
  <div class="flex flex-col w-full">
    <div class="flex justify-center max-w-full w-full">
      <transition name="fade" mode="out-in">
        <NotFoundData text="Dados indisponíveis para exibição." v-if="!chartData.datasets.length"/>
        <BarChart
          :chart-data="chartData"
          :options="chartOptions"
          v-else
        />
      </transition>
    </div>
  </div>
</template>

<script>

import {twColors, twFonts} from '@/services/tailwindConfig'
import NotFoundData from '@/components/layouts/NotFoundData'
import BarChart from "@/components/Chart/BarChart";

export default {
  name: 'PreCadastroUserChart',
  components: {BarChart, NotFoundData},
  props: {
    values: Array,
    label: Array,
  },
  data() {
    return {
      loadingChart: true,
      notFoundData: false,
      isValor: true,
      notFoundMessage: '',
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: 'right',
          labels: {
            fontSize: 16,
            fontColor: twColors.neutral[700],
            fontFamily: twFonts.body[0],
            padding: 20,
          }
        },
      }
    }
  },
  computed: {
    chartData() {
      return {
        labels: this.label,
        datasets: this.values
      }
    },
  },
}
</script>
