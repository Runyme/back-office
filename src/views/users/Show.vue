<template>
  <div class="pb-8">
    <div v-if="!loading">
      <Lynx-Title :text="form.nome_completo" v-if="form.nome_completo" v-once/>
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
        <div class="pb-8">
          <span class="text-lg font-display border-b border-neutral-400 w-full pb-2 flex mb-4">Funções</span>
          <div class="flex flex-wrap grid grid-cols-3">
            <label class="flex pr-8 pb-4" v-for="role in roles" :key="role.id">
              <b-checkbox
                v-model="form.role"
                :native-value="role.name"
                :disabled="disableRole(role.name)"
                @input="updatePermissions(role.name)"
              />
              <span class="pl-1" v-text="role.name"></span>
            </label>
          </div>
        </div>
        <div class="pb-8">
          <span class="text-lg font-display border-b border-neutral-400 w-full pb-2 flex mb-4">Permissões</span>

          <Lynx-Input
            class="mb-8 max-w-md"
            placeholder="Digite a permissão"
            icon="Search"
            v-model="searchPermission"
          />

          <div class="flex flex-wrap  grid grid-cols-3">
            <label class="flex pr-8 pb-4" v-for="permission in filteredPermissions" :key="permission.id">
              <b-checkbox
                v-model="form.permissions"
                :native-value="permission.name"
                :disabled="assignedPermissionsByRoles.includes(permission.name)"
              />
              <span class="pl-1" v-text="permission.name"></span>
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

import {usersShowRequest, usersUpdateRequest} from '@/services/requests/users'
import {rolesRequest} from '@/services/requests/roles'
import {permissionsRequest} from '@/services/requests/permissions'

import {required, email} from 'vuelidate/lib/validators'

export default {
  name: 'UsersShow',
  data() {
    return {
      form: {},
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
        }
      },
      roles: [],
      permissions: [],
      searchPermission: '',
    }
  },
  validations: {
    form: {
      nome_completo: {required},
      usuario: {required},
      email: {email},
    }
  },
  methods: {
    fetchUser() {
      this.loading = true
      const userId = this.$route.params.id
      usersShowRequest(userId)
        .then(res => this.form = res.data.data)
        .catch(() => {
          this.$router.push({name: 'users.index'})
          this.$snack.error('Usuário não encontrado')
        })
        .finally(() => this.loading = false)
    },
    fetchRoles() {
      rolesRequest()
        .then(res => this.roles = res.data.data)
    },
    fetchPermissions() {
      permissionsRequest()
        .then(res => this.permissions = res.data)
    },
    disableRole(name) {
      return this.form.role.length < 2 && this.form.role.includes(name)
    },
    updatePermissions(name) {
      this.form.permissions = this.assignedPermissionsByRoles
    },
    onSubmit() {
      const permissions = this.form.permissions.filter(curr => !this.assignedPermissionsByRoles.includes(curr))
      const form = {
        ...this.form,
        permissions
      }
      this.loadingButton = true
      usersUpdateRequest(form)
        .then((res) => {
          this.$snack.success('Usuario alterado com sucesso')
          this.$router.push({name: 'users.index'})
        })
        .catch(err => this.$snack.error('Erro ao atualizar usuário'))
        .finally(() => this.loadingButton = false)
    }
  },
  computed: {
    filteredPermissions() {
      return this.permissions.filter(curr => {
        const permission = curr.name.toLowerCase()
        const search = this.searchPermission.toLowerCase()
        return permission.match(search)
      })
    },
    assignedRoles() {
      const userRoles = this.form.role
      const rolesObject = this.roles
      const roles = rolesObject.map(curr => curr.name)

      return roles.filter(curr => userRoles.includes(curr))
    },
    assignedRolesObjects() {
      return this.roles.filter((curr) => this.assignedRoles.includes(curr.name))
    },
    assignedPermissionsByRoles() {
      const assignedPermissionsByRolesArray = this.assignedRolesObjects.map(curr => curr.permissions)
      const assignedPermissionsByRoles = assignedPermissionsByRolesArray.reduce((acc, actual) => acc.concat(actual), [])
      return assignedPermissionsByRoles.filter((curr, i) => assignedPermissionsByRoles.indexOf(curr) === i)
    },
  },
  mounted() {
    this.fetchUser()
    this.fetchRoles()
    this.fetchPermissions()
  }
}
</script>
