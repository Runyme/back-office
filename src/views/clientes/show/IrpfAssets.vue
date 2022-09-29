<template>
  <div class="p-8 bg-neutral-300">
    <Lynx-Title text="Bens da declaração"/>

    <div class="w-full flex justify-center py-4" v-if="loading">
      <Lynx-Spinner size="16"/>
    </div>

    <div class="flex w-full" v-else>
      <b-table :data="assets"
               hoverables
               class="w-full"
      >
        <template slot-scope="{row,index}">
          <b-table-column field="codigo" label="Código">
            <div
              class="bg-primary-200 rounded-full h-8 w-8 mr-2 font-bold text-xs inline-flex items-center justify-center">
              {{ row.code }}
            </div>
          </b-table-column>
          <b-table-column field="description" label="Item">
            <div class="flex flex-wrap">
              <div class="w-full">{{ row.description.substr(3) }}</div>
              <div class="font-semibold">R$ {{ row.value }}</div>
            </div>
          </b-table-column>
          <b-table-column field="" label="Confirmação">
            <b-field>
              <b-radio-button
                @input="val => changeConfirmation(val, index)"
                v-model="assets[index].next_confirmed"
                :native-value="false"
                type="is-danger">
                <b-icon icon="close" class="pl-2"></b-icon>
              </b-radio-button>

              <b-radio-button
                @input="val => changeConfirmation(val, index)"
                v-model="assets[index].next_confirmed"
                :native-value="true">
                <b-icon icon="check" class="pl-2"></b-icon>
              </b-radio-button>
            </b-field>
          </b-table-column>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import {getIrpfAssets, updateIrpfAssets} from "@/services/requests/irpf";

export default {
  name: "IrpfAssets",
  props: {
    clienteId: Number
  },
  data() {
    return {
      assets: [],
      loading: false
    }
  },
  mounted() {
    this.fetchIrpfAssets()
  },
  methods: {
    fetchIrpfAssets() {
      this.loading = true
      getIrpfAssets(this.clienteId)
        .then(response => this.setAssets(response.data))
        .catch(() => this.$snack.error('Erro ao consultar itens.'))
        .finally(() => this.loading = false)
    },
    setAssets(data) {
      data.forEach(item => this.assets.push({
        ...item,
        next_confirmed: item.next_confirmed !== null ? !!item.next_confirmed : null
      }))
    },
    changeConfirmation(val, index) {
      updateIrpfAssets(this.assets[index].id, {next_confirmed: val})
    }
  }
}
</script>

<style scoped>

</style>
