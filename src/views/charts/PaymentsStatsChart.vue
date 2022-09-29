<template>
  <div class="flex flex-col w-full">
    <div class="flex justify-center max-w-full w-full">
      <transition name="fade" mode="out-in">
        <NotFoundData text="Dados indisponíveis para exibição." v-if="!chartData.datasets.length"/>
        <PieChart
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
import PieChart from "@/components/Chart/PieChart";

export default {
  name: 'PaymentsStatsChart',
  components: {PieChart, NotFoundData},
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
        tooltips: {
          enabled: false
        },
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
        datasets: [{
          data: this.values,
          backgroundColor: ['rgba(75, 192, 192, 0.5)', twColors.error.light, 'rgba(255, 159, 64, 0.5)'],
          datalabels: {
            formatter: this.formatter,
            backgroundColor: `rgba(0, 0, 0, .5)`,
            borderRadius: 4,
            color: twColors.neutral[100],
            padding: {
              top: 2,
              right: 4,
              bottom: 0,
              left: 4
            },
            font: {
              family: twFonts.body,
              size: 12
            }
          }
        }],
      }
    },
    formatter() {
      // if (this.isValor) return value => value
      return (value, ctx) => {
        let sum = 0;
        let dataArr = ctx.chart.data.datasets[0].data;
        dataArr.map(data => {
          sum += Number(data)
        });
        return (value * 100 / sum).toFixed(2) + "%"
      }
    },
  },
}
</script>
