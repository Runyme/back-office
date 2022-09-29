<template>
  <div class="flex bg-white p-5 rounded w-full items-center">
    <div class="flex justify-center w-full" v-if="loading">
      <Lynx-Spinner size="12"/>
    </div>
    <div v-else class="w-full transition">
      <h2 class="text-lg md:text-base text-neutral-600">{{ header.title }}</h2>
      <div class="pt-2 flex flex-col items-center w-full">
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
      </div>
    </div>
  </div>
</template>

<script>

import PieChart from '@/components/Chart/PieChart'
import {twColors, twFonts} from '@/services/tailwindConfig'
import NotFoundData from '@/components/layouts/NotFoundData'
import {irpfStatsRequest} from "@/services/requests/charts";

export default {
  name: 'ResumoIRPF',
  components: {PieChart, NotFoundData},
  data() {
    return {
      header: {
        title: 'Resumo IRPF ' + (new Date().getFullYear() - 1),
      },
      loading: true,
      values: {},
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
        labels: [
          'Cancelados',
          'Não responderam',
          'Responderam questionario',
          'Iniciou envio de pendências',
          'Pendências enviadas',
          'Finalizados',
        ],
        datasets: [{
          data: [
            this.values.cancelados,
            this.values.nao_responderam,
            this.values.responderam,
            this.values.iniciou_pendencias,
            this.values.enviou_pendencias,
            this.values.finalizou,
          ],
          backgroundColor: [
            twColors.neutral[400],
            twColors.primary[400],
            twColors.primary[600],
            twColors.warning.base,
            twColors.success.base,
          ],
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
  methods: {
    fetchValues() {
      irpfStatsRequest()
        .then(res => this.values = res.data)
        .finally(() => this.loading = false)
    }
  },
  mounted() {
    this.fetchValues()
  }
}
</script>
