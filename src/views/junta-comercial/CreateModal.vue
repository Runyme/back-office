<template>
  <div class="bg-neutral-300 shadow p-8 flex flex-wrap justify-end rounded">
    <Lynx-Title text="Junta Comercial" class="w-full"/>

    <Lynx-OverlaySpinner v-if="loading" :loading="loading"/>

    <form @submit.prevent="submitForm" class="w-full flex flex-wrap justify-end">
      <label class="block w-1/3 px-2">
        <Lynx-Label
          label="Estado"
        />

        <b-select
          placeholder="Escolha um Estado"
          v-model="form.estado_id"
        >
          <option v-for="(estado, index) in estados" :key="index" :value="estado.id">{{ estado.nome }}</option>
        </b-select>
      </label>

      <label class="flex flex-col w-1/3 px-2">
        <Lynx-Label
          label="Taxa Alteração"
        />

        <InputMoney
          placeholder="Insira a taxa"
          v-model="form.taxa_alteracao"
        />
      </label>

      <label class="flex flex-col w-1/3 px-2">
        <Lynx-Label
          label="Taxa Alteração Extra"
        />

        <InputMoney
          placeholder="Insira a taxa extra"
          v-model="form.taxa_alteracao_extra"
        />
      </label>

      <Lynx-Button type="submit" class="" text="Adicionar" />
    </form>
  </div>
</template>

<script>

import { JuntaComercialStore } from '@/services/requests/juntaComercial'
import { indexEstadosRequest } from '@/services/requests/estados'
import InputMoney from '@/components/helpers/InputMoney'

export default {
  name: 'JuntaComercialCreate',
  components: { InputMoney },
  data() {
    return {
      estados: [],
      form: {
        estado_id: null,
        taxa_alteracao: null,
        taxa_alteracao_extra: null,
      },
      loading: false,
    }
  },
  mounted() {
    this.fetchEstados()
  },
  methods: {
    fetchEstados() {
      this.loading = true
      indexEstadosRequest()
        .then(res => {
          this.estados = res.data
        })
        .finally(() => this.loading = false)
    },
    submitForm() {
      this.loading = true
      JuntaComercialStore(this.form)
        .then(() => {
          this.$emit('created')
        })
        .finally(() => this.loading = false)
    },
  }
}
</script>
