<template>
  <div class="rounded p-4">
    <div class="w-full flex justify-center" v-if="loading">
      <Lynx-Spinner size="12"/>
    </div>

    <div class="w-full flex justify-center" v-else>
      <div class="rounded p-2 w-full">
        <table class="table-auto w-full" v-if="simulation != null">
          <thead>
          <tr>
            <th class="px-4 py-2"></th>
            <th class="px-4 py-2">Renda Anual</th>
            <th class="px-4 py-2">Retido</th>
            <th class="px-4 py-2">INSS</th>
            <th class="px-4 py-2">Devido</th>
            <th class="px-4 py-2">A Pagar</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td class="px-4 py-2">Sem PGBL</td>
            <td class="border border-neutral-400 px-4 py-2">{{ simulation.sem_pgbl.renda_anual }}</td>
            <td class="border border-neutral-400 px-4 py-2">{{ simulation.sem_pgbl.retido }}</td>
            <td class="border border-neutral-400 px-4 py-2">{{ simulation.sem_pgbl.inss }}</td>
            <td class="border border-neutral-400 px-4 py-2">{{ simulation.sem_pgbl.devido }}</td>
            <td class="border border-neutral-400 px-4 py-2">{{ simulation.sem_pgbl.pagar }}</td>
          </tr>

          <tr>
            <td class="px-4 py-2">Com PGBL</td>
            <td class="border border-neutral-400 px-4 py-2">{{ simulation.com_pgbl.renda_anual }}</td>
            <td class="border border-neutral-400 px-4 py-2">{{ simulation.com_pgbl.retido }}</td>
            <td class="border border-neutral-400 px-4 py-2">{{ simulation.com_pgbl.inss }}</td>
            <td class="border border-neutral-400 px-4 py-2">{{ simulation.com_pgbl.devido }}</td>
            <td class="border border-neutral-400 px-4 py-2">{{ simulation.com_pgbl.pagar }}</td>
          </tr>

          <tr>
            <td class="px-4 py-2">Aplicação</td>
            <td class="border border-neutral-400 px-4 py-2">{{ simulation.resumo.valor_aplicado }}</td>
            <td class="border border-neutral-400 px-4 py-2"></td>
            <td class="border border-neutral-400 px-4 py-2"></td>
            <td class="border border-neutral-400 px-4 py-2"></td>
            <td class="border border-neutral-400 px-4 py-2">- {{ simulation.resumo.economia }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {getPgblSimulation} from "@/services/requests/simulator";

export default {
  name: "SimuladorPgbl",
  props: {
    customerId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      simulation: null,
      loading: false
    }
  },
  mounted() {
    this.fetchSimulacao()
  },
  methods: {
    fetchSimulacao() {
      this.loading = true
      getPgblSimulation(this.customerId)
        .then(response => this.simulation = response.data.data)
        .catch(error => this.$snack.error(error.response.data.message || 'Não foi possível simular.'))
        .finally(() => this.loading = false)
    }
  }
}
</script>

<style scoped>

</style>
