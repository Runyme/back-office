<template>
  <div class="bg-white p-5 rounded w-full flex items-center justify-around hover:shadow-lg transition relative">
    <span
      class=" text-sm absolute whitespace-no-wrap text-neutral-500 bg-white bottom-0 m-3 left-0"
      style="">
        {{ moment().locale('pt-br').format('MMM [de] YYYY') }}
    </span>
    <div class="text-center">
      <div class="text-xl text-neutral-600">Novas empresas</div>
      <div class="font-bold text-primary-600 text-4xl">{{ dataSet.new ? dataSet.new : '--' }}</div>
    </div>

    <div class="border-r border-neutral-400 h-16"></div>

    <div class="text-center">
      <div class="text-xl text-neutral-600">Empresas finalizadas</div>
      <div class="font-bold text-primary-600 text-4xl">{{ dataSet.finished ? dataSet.finished : '--' }}</div>
    </div>
  </div>
</template>

<script>
import {quantityNewCompaniesRequest} from "@/services/requests/charts";
import moment from "moment";

export default {
  name: "NewCompaniesCountStats",
  data() {
    return {
      dataSet: {}
    }
  },
  mounted() {

    this.fetchData()
  },
  methods: {
    moment,
    fetchData() {
      quantityNewCompaniesRequest().then(response => this.dataSet = response.data)
    }
  }
}
</script>

<style scoped>

</style>
