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
        loading: false,
        modalOpened: false,
        showChart: false,
      }
    },
    methods: {
      setModalOpened(val) {
        this.modalOpened = val
      }
    }
  }
</script>
