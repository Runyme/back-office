<template>
  <div class="p-8 bg-neutral-300">
    <div class="flex flex-col">
      <Lynx-Title text="Criar Apontamento"/>
      <form class="flex flex-col" @submit.prevent="onSubmit">
        <div class="flex flex-col pb-8">
          <label class="flex flex-col">
            <Lynx-Label class="pr-8 font-bold" label="Nome"/>
            <Lynx-Input type="text" v-model="form.nome"/>
          </label>
        </div>
        <div class="flex flex-col pb-8">
          <label class="flex flex-col">
            <Lynx-Label class="pr-8 font-bold" label="SLA Minutos"/>
            <Lynx-Input type="number" v-model="form.sla" :min="1"/>
          </label>
        </div>
        <Lynx-Button 
          type="submit" 
          class="self-end" 
          text="Enviar" 
          icon="Check" 
          :loading="loadingButton"
        />
      </form>
    </div>
  </div>
</template>

<script>

import { storeApontamentosRequest } from '@/services/requests/apontamentos'

export default {
  name: 'CreateApontamentos',
  data() {
    return {
      loadingButton: false,
      form: {
        nome: '',
        sla: 1,
      },
      errorMessage: 'Não foi possivel criar o apontamento',
    }
  },
  methods: {
    onSubmit() {
      this.loadingButton = true
      storeApontamentosRequest(this.form)
        .then(() => {
          this.$emit('create-apontamento')
          this.$snack.success('Apontamento criado com sucesso')
        })
        .catch(err => this.$snack.error(err.response.data.message || this.errorMessage))
        .finally(() => this.loadingButton = false)
    },
  },
}
</script>