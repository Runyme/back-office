<template>
  <div class="flex flex-col w-full pt-8">
    <div class="flex justify-center max-w-full w-full">
      <transition name="fade" mode="out-in">
        <NotFoundData text="Dados indisponíveis!" v-if="!chartData.datasets.length"/>
        <!--          <PieChart :chart-data="chartData" :options="chartOptions" v-else/>-->
        <div class="text-center">
            <span class="text-4xl text-info-base font-display font-semibold">
              {{ contratosAssinados }}
            </span>
          <span class="text-2xl text-neutral-500 font-display font-semibold">
               de {{ contratosSemAssinatura }}
            </span>
          <p class="pt-3 text-neutral-600 font-display font-semibold">
            Contratos Assinados
          </p>
        </div>
      </transition>
    </div>

    <div class="flex pt-12 self-center text-neutral-500 ">
      <p class="pr-3">
        Percentual
      </p>
      <b-switch v-model="isValor" outlined>
        <span class="text-neutral-500">Qtd</span>
      </b-switch>
    </div>
  </div>
</template>

<script>

import {twColors, twFonts} from '@/services/tailwindConfig'
import NotFoundData from '@/components/layouts/NotFoundData'

export default {
  name: 'EmpresaContratosChart',
  components: {NotFoundData},
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
    contratosAssinados() {
      if (!this.isValor) {
        return (this.values.assinado * 100 / this.contratosSemAssinatura).toFixed(2) + "%"
      }
      return this.values.assinado
    },
    contratosSemAssinatura() {
      return Number(this.values.assinado) + Number(this.values.aguardando_assinatura) + Number(this.values.nao_enviado);
    },
    chartData() {
      return {
        labels: ['Assinados', 'Aguardando Assinatura', 'Não Enviados'],
        datasets: [{
          data: [this.values.assinado, this.values.aguardando_assinatura, this.values.nao_enviado],
          backgroundColor: [twColors.primary[600], twColors.info.light, twColors.error.light],
          datalabels: {
            formatter: this.formatter,
            backgroundColor: `rgba(0, 0, 0, .5)`,
            borderRadius: 4,
            color: twColors.neutral[100],
            display: 'auto',
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
        let percentage = (value * 100 / sum).toFixed(2) + "%";
        return percentage
      }
    },
  },
}
</script>
