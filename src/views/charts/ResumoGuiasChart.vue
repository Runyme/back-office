<template>
  <div class="flex flex-col w-full py-4">
    <div class="flex justify-center max-w-full w-full h-48">
      <NotFoundData text="Dados indisponíveis no momento!" v-if="!chartData.datasets.length"/>
      <PieChart
        :chart-data="chartData"
        :options="chartOptions"
        v-else
      />
    </div>
  </div>
</template>

<script>

import PieChart from '@/components/Chart/PieChart'
import {twColors, twFonts} from '@/services/tailwindConfig'
import NotFoundData from '@/components/layouts/NotFoundData'
import moment from 'moment'
import {monthNames} from '@/utils/utils'

export default {
  name: 'ResumoGuiasChart',
  components: {PieChart, NotFoundData},
  props: {
    values: Object
  },
  data() {
    return {
      monthNames,
      loadingChart: true,
      notFoundData: false,
      notFoundMessage: 'Não há dados suficiente para exibir o resumo',
      dataCompetencia: new Date(),
      chartOptions: {
        cutoutPercentage: 50,
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
        labels: ['Enviadas', 'Pendentes', 'Sem Guias'],
        datasets: [{
          data: [this.enviado, this.aguardando, this.sem_guia],
          backgroundColor: ['rgba(75,192,192,0.5)', 'rgba(255, 159, 64, 0.5)'],
          datalabels: {
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
    enviado() {
      return this.values.enviado || 0
    },
    aguardando() {
      return this.values.aguardando || 0
    },
    sem_guia() {
      return this.values.sem_guia || 0
    },
  },
  methods: {
    setDefaultDataCompetencia() {
      const dataCompetencia = moment().subtract('1', 'months').set('date', 1)
      this.dataCompetencia = new Date(dataCompetencia)
    },
  },
  beforeMount() {
    this.setDefaultDataCompetencia()
  },
}
</script>
