<template>
  <div class="p-8 bg-neutral-300">
    <div class="flex flex-col">
      <Lynx-Title text="Criar Contratante"/>
      <form class="flex flex-col" @submit.prevent="onSubmit">
        <label class="flex flex-col pb-8">
          <Lynx-Label label="Nome"/>
          <Lynx-Input type="text" v-model="form.nome" required/>
        </label>
        <label class="flex flex-col pb-8">
          <Lynx-Label label="CEP"/>
          <Lynx-Input type="text" mask="#####-###" v-model="form.endereco.cep" @input="fetchCep" required/>
        </label>
        <label class="flex flex-col pb-8">
          <Lynx-Label label="Endereço"/>
          <Lynx-Input type="text" v-model="form.endereco.logradouro" :disabled="true" required/>
        </label>
        <div class="flex pb-8">
          <label class="flex flex-col pr-8 w-1/2">
            <Lynx-Label label="Numero"/>
            <Lynx-Input type="text" v-model="form.endereco.numero" required/>
          </label>
          <label class="flex flex-col pl-8 w-1/2">
            <Lynx-Label label="Complemento"/>
            <Lynx-Input type="text" v-model="form.endereco.complemento"/>
          </label>
        </div>
        <label class="flex flex-col pb-8">
          <Lynx-Label label="Estado"/>
          <Lynx-Input type="text" v-model="form.endereco.uf" :disabled="true" required/>
        </label>
        <label class="flex flex-col pb-8">
          <Lynx-Label label="Cidade"/>
          <Lynx-Input type="text" v-model="form.endereco.cidade" :disabled="true" required/>
        </label>
        <label class="flex flex-col pb-8">
          <Lynx-Label label="Celular"/>
          <Lynx-Input type="text" mask="(##) #####-####" v-model="form.celular" required/>
        </label>
        <label class="flex flex-col pb-8">
          <Lynx-Label label="Email"/>
          <Lynx-Input type="email" v-model="form.email" required/>
        </label>
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

import { storeContratanteRequest } from '@/services/requests/contratantes'
import { viaCepRequest } from '@/services/requests/viaCep'

export default {
  name: 'ContratanteCreate',
  data() {
    return {
      loadingButton: false,
      form: {
        nome: '',
        endereco: {
          cep: '',
          cidade: '',
          ibge: '',
          logradouro: '',
          uf: '',
          numero: '',
          complemento: ''
        },
        celular: '',
        email: ''
      },
      errorMessage: 'Não foi possivel criar o contratante',
    }
  },
  methods: {
    fetchCep() {
      if(this.form.endereco.cep.length != 8) return
      viaCepRequest(this.form.endereco.cep)
        .then(res => {
          if(res.data.erro) return
          this.form.endereco.logradouro = res.data.logradouro
          this.form.endereco.bairro = res.data.bairro
          this.form.endereco.cidade = res.data.localidade
          this.form.endereco.uf = res.data.uf
          this.form.endereco.ibge = res.data.ibge
        })
        .catch(() => this.$snack.error('Não foi possivel encontrar o CEP'))
    },
    onSubmit() {
      this.loadingButton = true
      storeContratanteRequest(this.form)
        .then(() => {
          this.$emit('create-contratante')
          this.$snack.success('Contrante criado com sucesso')
        })
        .catch(err => this.$snack.error(err.response.data.message || this.errorMessage))
        .finally(() => this.loadingButton = false)
    },
  },
}
</script>