<template>
  <div class="p-8 bg-neutral-300">
    <div class="w-full flex items-center justify-center" v-if="loading">
      <Lynx-Spinner size="16" />
    </div>
    <div class="flex flex-col" v-else>
      <div class="flex justify-between items-center">
        <Lynx-Title :text="contratante.nome"/>
        <Lynx-Button class="mb-8" @click.native="onCancelEdit" text="Cancelar" size="small" :outlined="true" v-if="isEditting"/>
        <Lynx-Button 
          class="mb-8" 
          @click.native="onEdit" 
          text="Editar" 
          icon="Edit" 
          size="small" 
          icon-size="4" 
        />
      </div>
      <form class="flex flex-col" @submit.prevent="onSubmit">
        <label class="flex flex-col pb-8">
          <Lynx-Label class="font-bold" label="Nome"/>
          <Lynx-Input type="text" v-model="form.nome" v-if="isEditting" required/>
          <span v-text="contratante.nome" v-else />
        </label>
        <label class="flex flex-col pb-8">
          <Lynx-Label class="font-bold" label="CEP"/>
          <Lynx-Input type="text" mask="#####-###" @input="fetchCep" v-model="form.endereco.cep" v-if="isEditting" required/>
          <span v-text="contratante.endereco.cep" v-else />
        </label>
        <label class="flex flex-col pb-8">
          <Lynx-Label class="font-bold" label="Endereço"/>
          <Lynx-Input type="text" v-model="form.endereco.logradouro" v-if="isEditting" :disabled="true"/>
          <span v-text="contratante.endereco.logradouro" v-else />
        </label>
        <div class="flex pb-8">
          <label class="flex flex-col w-1/2 pr-4">
            <Lynx-Label class="font-bold" label="Número"/>
            <Lynx-Input type="text" v-model="form.endereco.numero" v-if="isEditting" required/>
            <span v-text="contratante.endereco.numero" v-else />
          </label>
          <label class="flex flex-col w-1/2 pl-4">
            <Lynx-Label class="font-bold" label="Complemento"/>
            <Lynx-Input type="text" v-model="form.endereco.complemento" v-if="isEditting"/>
            <span v-text="contratante.endereco.complemento" v-else />
          </label>
        </div>
        <label class="flex flex-col pb-8">
          <Lynx-Label class="font-bold" label="Estado"/>
          <Lynx-Input type="text" v-model="form.endereco.uf" v-if="isEditting"/>
          <span v-text="contratante.endereco.uf" :disabled="true" v-else />
        </label>
        <label class="flex flex-col pb-8">
          <Lynx-Label class="font-bold" label="Cidade"/>
          <Lynx-Input type="text" v-model="form.endereco.cidade" v-if="isEditting"/>
          <span v-text="contratante.endereco.cidade" :disabled="true" v-else />
        </label>
        <label class="flex flex-col pb-8">
          <Lynx-Label class="font-bold" label="Celular"/>
          <Lynx-Input type="text" mask="(##) #####-####" v-model="form.celular" v-if="isEditting" required/>
          <span v-text="contratante.celular" v-else />
        </label>
        <label class="flex flex-col pb-8">
          <Lynx-Label class="font-bold" label="Email"/>
          <Lynx-Input type="email" v-model="form.email" v-if="isEditting" required/>
          <span v-text="contratante.email" :disabled="true" v-else />
        </label>
        <Lynx-Button 
          type="submit" 
          class="self-end" 
          text="Enviar" 
          icon="Check" 
          v-if="isEditting"
          :loading="loadingButton"
        />
      </form>
    </div>
  </div>
</template>

<script>

import { showContratanteRequest, updateContratanteRequest } from '@/services/requests/contratantes'
import { viaCepRequest } from '@/services/requests/viaCep'

export default {
  name: 'ContratantesView',
  props: {
    contratanteId: {
      required: true,
      type: Number,
    }
  },
  data() {
    return {
      loading: false,
      loadingButton: false,
      contratante: {},
      isEditting: false,
      form: {},
      errorMessage: 'Não foi possivel editar o contrante',
    }
  },
  methods: {
    fetchContratante() {
      this.loading = true
      showContratanteRequest(this.contratanteId)
        .then(res => this.contratante = res.data.data)
        .finally(() => this.loading = false)
    },
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
    onEdit() {
      this.form = { ...this.contratante }
      this.isEditting = true
    },
    onCancelEdit() {
      this.form = {}
      this.isEditting = false
    },
    onSubmit() {
      this.loadingButton = true
      updateContratanteRequest(this.contratante.id, this.form)
        .then(() => {
          this.$emit('edit-contratante')
          this.$snack.success('Contratante atualizado com sucesso')
        })
        .catch(err => this.$snack.error(err.response.data.message || this.errorMessage))
        .finally(() => this.loadingButton = false)
    },
  },
  beforeMount() {
    this.fetchContratante()
  }
}
</script>