<template>
  <div>
    <div v-if="!loading">
      <Lynx-Title text="Adicionar usuário"/>
      <form class="flex flex-col" @submit.prevent="onSubmit">
        <label class="flex flex-col w-full pb-8">
          <Lynx-Label
            label="Nome"
            :validator="$v.form.nome_completo"
            :validations-message="validationsMessage.form.nome_completo"
          />
          <Lynx-Input
            placeholder="Insira seu nome"
            :error="$v.form.nome_completo.$error"
            v-model.trim="$v.form.nome_completo.$model"
          />
        </label>
        <label class="flex flex-col w-full pb-8">
          <Lynx-Label
            label="Usuário"
            :validator="$v.form.usuario"
            :validations-message="validationsMessage.form.usuario"
          />
          <Lynx-Input
            placeholder="Insira seu usuario"
            :error="$v.form.usuario.$error"
            v-model.trim="$v.form.usuario.$model"
          />
        </label>
        <label class="flex flex-col w-full pb-8">
          <Lynx-Label
            label="Email"
            :validator="$v.form.email"
            :validations-message="validationsMessage.form.email"
          />
          <Lynx-Input
            placeholder="Insira seu email"
            :error="$v.form.email.$error"
            v-model.trim="$v.form.email.$model"
          />
        </label>
        <label class="flex flex-col w-full pb-8">
          <Lynx-Label label="Celular"/>
          <Lynx-Input
            placeholder="Insira seu celular"
            v-model="form.telefone_celular"
            mask="(##) # ####-####"
          />
        </label>
        <label class="flex flex-col w-full pb-8">
          <Lynx-Label
            label="Senha"
            :validator="$v.form.senha"
            :validations-message="validationsMessage.form.senha"
          />
          <Lynx-Input
            placeholder="Insira sua Senha"
            type="password"
            :error="$v.form.senha.$error"
            v-model.trim="$v.form.senha.$model"
          />
        </label>
        <label class="flex flex-col w-full pb-8">
          <Lynx-Label
            label="Confirme sua senha"
            type="password"
            :validator="$v.form.senha_confirmacao"
            :validations-message="validationsMessage.form.senha_confirmacao"
          />
          <Lynx-Input
            placeholder="Confirme sua senha"
            :error="$v.form.senha_confirmacao.$error"
            v-model.trim="$v.form.senha_confirmacao.$model"
          />
        </label>
        <div class="pb-8">
          <span class="text-lg font-display border-b border-neutral-400 w-full pb-2 flex mb-4">Funções</span>
          <div class="flex flex-wrap">
            <label class="flex pr-8 pb-4" v-for="role in roles" :key="role.id">
              <b-checkbox 
                v-model="form.roles" 
                :native-value="role"
              />
              <span class="pl-1" v-text="role"></span>
            </label>
          </div>
        </div>
        <div class="flex justify-between">
          <router-link :to="{ name: 'users.index' }">
            <Lynx-Button type="button" text="Voltar" icon="ArrowLeft" outlined="true"/>
          </router-link>
          <Lynx-Button type="submit" text="Enviar" icon="Check" :loading="loadingButton"/>
        </div>
      </form>
    </div>
    <Lynx-OverlaySpinner v-else :loading="loading"/>
  </div>
</template>

<script>

import { rolesRequest } from '@/services/requests/roles'
import { usersCreateRequest  } from '@/services/requests/users'

import { required, email, sameAs } from 'vuelidate/lib/validators'

export default {
  name: 'UsersShow',
  data() {
    return {
      form: {
        nome_completo: '',
        usuario: '',
        email: '',
        usuario: '',
        telefone_celular: '',
        senha: '',
        senha_confirmacao: '',
        roles: [],
      },
      loading: false,
      loadingButton: false,
      validationsMessage: {
        form: {
          nome_completo: {
            required: 'Insira seu nome completo'
          },
          usuario: {
            required: 'Insira um usuário'
          },
          email: {
            email: 'Insira um email válido'
          },
          senha: {
            required: 'Insira uma senha'
          },
          senha_confirmacao: { 
            sameAs: 'As senhas devem ser identicas'
          }
        }
      },
      roles: [],
    }
  },
  validations() {
    return {
      form: {
        nome_completo: { required },
        usuario: { required },
        email: { email },
        senha: { required },
        senha_confirmacao: {
          sameAs: sameAs('senha')
        }
      }
    }
  },
  methods: {
    fetchRoles() {
      rolesRequest()
        .then(res => {
          const roles = res.data.data
          this.roles = roles.map(curr => curr.name)
        })
    },
    onSubmit() {
      if(this.$v.$invalid) {
        this.$snack.error('Preencha corretamente o formulário')
        return
      }
      if(!this.form.roles.length) {
        this.$snack.error('Selecione no mínimo uma função para o usuário')
        return
      }
      this.loadingButton = true
      usersCreateRequest(this.form)
        .then(res => {
          this.$snack.success('Usuário cadastrado com sucesso')
          this.$router.push({ name: 'users.index' })
        })
        .catch(err => this.$snack.error(err.response.data.message))
        .finally(() => this.loadingButton = false)
    }
  },
  mounted() {
    this.fetchRoles()
  }
}
</script>