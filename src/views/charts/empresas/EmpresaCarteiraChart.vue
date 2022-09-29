<template>
  <div class="flex flex-col w-full">
    <div class="flex justify-center max-w-full w-full h-100">
      <transition name="fade" mode="out-in">
        <NotFoundData text="Dados insuficientes para exibir o gráfico!" v-if="!chartData.datasets.length"/>
        <BarChart :chart-data="chartData" :options="chartOptions" v-else/>
      </transition>
    </div>
  </div>
</template>

<script>

import {twColors, twFonts} from '@/services/tailwindConfig'
import NotFoundData from '@/components/layouts/NotFoundData'
import BarChart from "@/components/Chart/BarChart";

export default {
  name: 'EmpresaStatusChart',
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
      maxDataValue: 10,
    }
  },
  computed: {
    chartData() {
      return {
        labels: this.label,
        datasets: this.values
      }
    },
    chartOptions() {
      return {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              suggestedMax: this.maxDataValue,
            }
          }]
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
          position: 'right',
          labels: {
            fontSize: 0,
            fontColor: twColors.neutral[700],
            fontFamily: twFonts.body[0],
            padding: 20,
          }
        },
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'top',
            formatter: Math.round,
            font: {
              weight: 'bold'
            }
          }
        },
      }
    }
  },
  methods: {
    updateMaxDataValue() {
      let maxDataValue = this.values.map(item => Math.max(...item.data))
      maxDataValue = Math.max(...maxDataValue)
      this.maxDataValue = maxDataValue + 10
    },
  },
  beforeMount() {
    this.updateMaxDataValue()
  }
}
</script>
