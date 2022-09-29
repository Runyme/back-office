<template>
  <div class="w-full" v-if="hasRole('super-admin')">
    <div class="flex mt-8 w-full" style="min-height: 200px">
      <FluxoDeCaixa class="w-full"/>
    </div>

    <div class="flex mt-8 w-full grid grid-cols-2 gap-4" style="min-height: 200px">
      <PaymentsMonthlyStats class="w-full"/>

      <PrevisaoContasReceber />
    </div>

    <div class="flex mt-8 w-full" style="min-height: 200px">
      <PaymentDefaulters class="w-full"/>
    </div>
  </div>
</template>

<script>

import FluxoDeCaixa from "./components/FluxoDeCaixa";
import PaymentsMonthlyStats from "@/views/Home/Financeiro/components/PaymentsMonthlyStats";
import PaymentDefaulters from "@/views/Home/Financeiro/components/PaymentDefaulters";
import PrevisaoContasReceber from "@/views/Home/Financeiro/components/PrevisaoContasReceber";
import {hasRole} from '@/utils/can';

export default {
  name: "Financeiro",
  components: {PrevisaoContasReceber, PaymentDefaulters, PaymentsMonthlyStats, FluxoDeCaixa},
  methods: {hasRole,}
}
</script>

<style scoped>

</style>
