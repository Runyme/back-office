<template>
  <div class="bg-neutral-300 p-8 flex items-start flex-col relative">
    <div class="flex items-center justify-between w-full">
      <Lynx-Title text="Historico do Regime tributário"/>
    </div>

    <div class="w-full flex justify-center" v-if="loading">
      <Lynx-Spinner size="12"/>
    </div>

    <div class="flex w-full justify-center items-center" v-if="!history.length && !loading">
      <not-found-data text="Nada pra mostrar aqui!"/>
    </div>
    <div class="relative" v-else>
      <div class="border-r-2 border-neutral-500 absolute h-full top-0" style="left: 15px"></div>
      <ul class="list-none m-0 p-0">
        <li class="mb-2" v-for="item in history" :key="item.id">
          <div class="flex items-center mb-1">
            <div class="bg-neutral-500 rounded-full h-8 w-8"></div>
            <div class="flex flex-1 ml-4 font-semibold">
              {{ moment(item.occurred_at).format('MMM [de] YYYY') }}
              -
              {{ item.old_value === 'SN' ? 'Simples Nacional' : item.old_value }}
              <b-icon class="flex items-center" icon="chevron-right"></b-icon>
              {{ item.new_value === 'SN' ? 'Simples Nacional' : item.new_value }}
            </div>
          </div>
          <div class="ml-12 flex text-neutral-600">
            {{ item.description }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {getHistoryRegimeTributario} from "@/services/requests/empresas";
import moment from 'moment'
import NotFoundData from "@/components/layouts/NotFoundData";

export default {
  name: "RegimeTributarioHistory",
  components: {NotFoundData},
  props: {
    companyId: Number
  },
  data() {
    return {
      loading: true,
      history: []
    }
  },
  mounted() {
    this.fetchHistory()
  },
  methods: {
    moment,
    fetchHistory() {
      getHistoryRegimeTributario(this.companyId)
        .then(response => this.history = response.data)
        .catch(() => this.$snack.error('Erro ao processar solicitação.'))
        .finally(() => this.loading = false)
    }
  }
}
</script>

<style scoped>

</style>
