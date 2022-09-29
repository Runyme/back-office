<template>
  <div class="bg-neutral-300 p-8 flex items-start flex-col">
    <div class="flex items-center justify-between w-full">
      <Lynx-Title text="Receitas"/>
    </div>

    <div class="block w-full">
      <b-tabs position="is-centered" class="block" destroy-on-hide :animated="false">
        <b-tab-item label="Registros">
          <Incomes :customer-id="customerId"/>
        </b-tab-item>

        <b-tab-item label="Recebidos">
          <ReceivedIncomeFiles :customer-id="customerId"/>
        </b-tab-item>

        <b-tab-item label="Simulador PGBL">
          <SimuladorPgbl :customer-id="customerId" class="bg-white"/>
        </b-tab-item>
      </b-tabs>
    </div>
  </div>
</template>

<script>

import SimuladorPgbl from "@/views/clientes/show/SimuladorPgbl";
import Incomes from "@/views/clientes/show/Incomes";
import ReceivedIncomeFiles from "@/views/clientes/show/ReceivedIncomeFiles";

export default {
  name: 'Receitas',
  components: {ReceivedIncomeFiles, Incomes, SimuladorPgbl},
  props: {
    customerId: {
      type: Number,
      required: true,
    },
  },
}
</script>
