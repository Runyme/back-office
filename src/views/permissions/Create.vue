<template>
  <div>
    <Lynx-Title text="Adicionar Permissão" />
    <form @submit.prevent="onSubmit">
      <label class="flex flex-col w-full pb-8">
        <Lynx-Label
          label="Nome da permissão"
          :validator="$v.name"
          :validations-message="validationsMessage.name"
        />
        <Lynx-Input
          placeholder="Digite a permissão"
          v-model.trim="$v.name.$model"
          :error="$v.name.$error"
        />
      </label>
      <div class="w-full flex justify-between">
        <router-link :to="{ name: 'permissions.index' }" tag="div">
          <Lynx-Button text="Voltar" icon="ArrowLeft" type="button" :outlined="true"/>
        </router-link>
        <Lynx-Button text="Adicionar" icon="Plus" type="submit" :loading="loadingButton"/>
      </div>
    </form>
  </div>
</template>

<script>

import { permissionsCreateRequest } from '@/services/requests/permissions'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'PermissionsCreate',
  data() {
    return {
      name: '',
      loadingButton: false,
      validationsMessage: {
        name: {
          required: 'Insira um nome para a permissão'
        }
      }
    }
  },
  validations: {
    name: { required }
  },
  methods: {
    onSubmit() {
      if(this.$v.$invalid) {
        this.$snack.error('Preencha corretamente o formulário')
        return
      }
      this.loadingButton = true
      permissionsCreateRequest({name: this.name})
        .then(res => {
          this.$snack.success('Permissão adicionada com sucesso')
          this.$router.push({ name: 'permissions.index' })
        })
        .catch(err => this.$snack.error('Ocorreu um erro, tente novamente mais tarde'))
        .finally(() => this.loadingButton = false)
    }
  }
}
</script>

<style>

</style>