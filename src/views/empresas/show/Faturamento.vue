<template>
  <div class="">
    <b-collapse :open="false" @open="showChart = true" aria-id="faturamento-aria">
      <div class="flex items-center my-2" slot="trigger" aria-controls="faturamento-aria">
        <Icon-Money class="text-primary-600" size="8"/>
        <p class="pl-4 font-display text-xl font-bold">Faturamento</p>
      </div>
      <div class="w-full">
        <div class="flex-col">
          <FaturamentoImpostosChart v-if="showChart"/>
          <Lynx-Button
            class="mt-4 self-start"
            text="Ver Detalhes"
            icon="Eye"
            size="small"
            icon-size="4"
            @click.native="setModalOpened(true)"
          />
          <Lynx-Button
            v-if="getEmpresa.regime_tributario === 'SN'"
            class="mt-4 self-start"
            text="Relatório Mensal"
            icon="Document"
            size="small"
            :disabled="downloadRelatorioMensalDisable"
            :loading="downloadRelatorioMensalDisable"
            icon-size="4"
            @click.native="downloadRelatorioMensal(getEmpresa.id, competencia)"
          />
        </div>
      </div>
    </b-collapse>

    <b-modal :active.sync="modalOpened">
      <Details :socios="socios"/>
    </b-modal>
  </div>
</template>

<script>

  import FaturamentoImpostosChart from '@/views/charts/empresas/FaturamentoImpostosChart'
  import Details from '@/views/empresas/show/FaturamentoDetails'
  import { mapGetters } from 'vuex'
  import { getRelatorioMensal } from '@/services/requests/relatorio'
  import moment from 'moment'


  export default {
    name: 'EmpresaShowFaturamento',
    components: {FaturamentoImpostosChart, Details},
    props: {
      socios: {
        type: Array,
        required: true,
      }
    },
    data() {
      return {
        downloadRelatorioMensalDisable: false,
        loading: false,
        modalOpened: false,
        showChart: false,
      }
    },
    methods: {
      setModalOpened(val) {
        this.modalOpened = val
      },
      async downloadRelatorioMensal(empresas_id, competencia) {
        this.downloadRelatorioMensalDisable = true
        getRelatorioMensal(empresas_id, competencia).then((response) => {
          if (!response) return
          const linkSource = `data:application/pdf;base64,${response.data}`
          const downloadLink = document.createElement('a')
          const fileName = `${empresas_id}-relatorio-mensal-${competencia}.pdf`
          downloadLink.href = linkSource
          downloadLink.download = fileName
          downloadLink.click()
        }).finally(() => {
          this.downloadRelatorioMensalDisable = false
        })
      }
    },
    computed: {
      ...mapGetters(['getEmpresa']),
      competencia() {
        if (moment().format("YYYY-MM-DD") == moment().endOf('month').format('YYYY-MM-DD')) {
          return moment().format("YYYY-MM-01")
        }
       return moment().add(-1,'months').format("YYYY-MM-01")
      }
    }
  }
</script>
