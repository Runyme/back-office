<template>
  <div class="flex flex-col w-full sticky">
    <div class="flex justify-center max-w-full w-full h-100">
      <transition name="fade" mode="out-in">
        <NotFoundData text="Sem dados disponíveis!" v-if="!chartData.datasets.length"/>
        <PieChart
          :chart-data="chartData"
          :options="chartOptions"
          v-else
        />
      </transition>
    </div>
    <div class="flex absolute right-0">
      <p class="pr-3">%</p>
      <b-switch v-model="isValor" outlined>
        Qtd
      </b-switch>
    </div>
  </div>
</template>

<script>

import PieChart from '@/components/Chart/PieChart'
import {twColors, twFonts} from '@/services/tailwindConfig'
import NotFoundData from '@/components/layouts/NotFoundData'

export default {
  name: 'ResumoGeralEmpresas',
  components: {PieChart, NotFoundData},
  props: {
    values: Object,
  },
  data() {
    return {
      loadingChart: true,
      notFoundData: false,
      isValor: true,
      notFoundMessage: '',
      chartOptions: {
        cutoutPercentage: 60,
        circumference: Math.PI,
        rotation: Math.PI,
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
        labels: ['Ativa', 'Em Abertura', 'Congelada', 'Saíram'],
        datasets: [{
          data: [this.values.ativa, this.values.em_abertura, this.values.congelada, this.values.inativa],
          backgroundColor: [twColors.primary[600], twColors.primary[400], twColors.info.light, twColors.error.light,],
          type: 'pie',
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
        }]
      }
    },
    formatter() {
      if (this.isValor) return value => value
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
