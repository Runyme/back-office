<template>
  <div class="bg-white p-5 rounded w-full flex items-center justify-around hover:shadow-lg transition relative">
    <span
      class=" text-sm absolute whitespace-no-wrap text-neutral-500 bg-white bottom-0 m-3 left-0"
      style="">
        {{ moment().locale('pt-br').format('MMM [de] YYYY') }}
    </span>
    <div>
      <span class="text-2xl text-neutral-700">Emissão de CNPJ</span>
    </div>
    <div class="text-center">
      <div class="font-light text-neutral-600">Semana</div>
      <div class="font-bold text-primary-600 text-4xl">{{ dataSet.in_week ? dataSet.in_week : '--' }}</div>
    </div>

    <div class="border-r border-neutral-400 h-16 relative"></div>

    <div class="text-center">
      <div class="font-light text-neutral-600">Mês</div>
      <div class="font-bold text-primary-600 text-4xl">{{ dataSet.in_month ? dataSet.in_month : '--' }}</div>
    </div>
  </div>
</template>

<script>
import {quantityCnpjRequest} from "@/services/requests/charts";
import moment from "moment";

export default {
  name: "CnpjCountStats",
  data() {
    return {
      dataSet: {}
    }
  },
  mounted() {
    this.fetchData()
  },
    computed:{
    onboarding_search(){
      return this.$store.state.configEmpresa.onboarding_search
    }
  },
  watch:{
onboarding_search(){
  this.fetchData()
}
  },
  methods: {
    moment,
    fetchData() {
      quantityCnpjRequest(this.onboarding_search).then(response => this.dataSet = response.data)
    }
  }
}
</script>

<style scoped>

</style>
