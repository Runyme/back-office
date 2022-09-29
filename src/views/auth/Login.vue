<template>
  <Layout-Outside>
    <template #content>
      <Lynx-Title text="Login"/>
      <form
        class="flex items-start flex-col"
        @submit.prevent="handleSubmit"
      >
        <label class="flex flex-col w-full pb-6">
          <Lynx-Label
            label="Usuário"
            :validator="$v.usuario"
            :validations-message="validationsMessage.usuario"
          />
          <Lynx-Input
            placeholder="Insira seu usuário"
            :error="$v.usuario.$error"
            v-model.trim="$v.usuario.$model"
          />
        </label>
        <label class="flex flex-col w-full pb-8">
          <Lynx-Label
            label="Senha"
            :validator="$v.senha"
            :validations-message="validationsMessage.senha"
          />
          <Lynx-Input
            type="password"
            placeholder="Digite a senha"
            v-model.trim="$v.senha.$model"
            :error="$v.senha.$error"
          />
        </label>
        <button type="submit">
          <Lynx-Button
            text="Entrar"
            class="tese"
            icon="ArrowRight"
            :loading="loading"
            :disabled="loading"
          />
        </button>
      </form>
    </template>
    <template #SVG>
      <SVG-Auth class="w-full h-full max-w-lg"/>
    </template>
  </Layout-Outside>
</template>

<script>

import LayoutOutside from '@/templates/Outside'
import {mapActions} from 'vuex'
import {required} from 'vuelidate/lib/validators'
import SVGAuth from '@/components/svgs/Auth'

export default {
  name: 'AuthLoginForm',
  components: {SVGAuth, LayoutOutside},
  data() {
    return {
      usuario: '',
      senha: '',
      loading: false,
      validationsMessage: {
        usuario: {
          required: "Informe um usuário",
        },
        senha: {
          required: "Informe sua senha",
        }
      },
    }
  },
  validations: {
    usuario: {required},
    senha: {required}
  },
  methods: {
    ...mapActions(['login']),
    handleSubmit() {
      if (this.$v.$invalid) {
        this.$snack.error('Preencha corretamente o formulário')
        return
      }
      this.loading = true
      this
        .login({
          usuario: this.usuario,
          senha: this.senha
        })
        .catch(err => err.response && this.$snack.error(err.response.data.message))
        .finally(() => this.loading = false)
    },
  },
}
</script>
