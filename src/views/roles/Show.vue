<template>
  <div>
    <div v-if="!loading">
      <Lynx-Title :text="role.name" v-if="role.name" v-once/>
      <form class="flex flex-col" @submit.prevent="onSubmit">
        <div class="pb-8">
          <Lynx-Input
            class="mb-8 max-w-md"
            placeholder="Digite a permissão"
            icon="Search"
            v-model="filter"
          />
          <span class="text-lg font-display border-b border-neutral-400 w-full pb-2 flex mb-4">Permissões</span>
          <div class="flex flex-wrap grid grid-cols-3">
            <label class="flex pr-8 pb-4" v-for="permission in filteredPermissions" :key="permission.id">
              <b-checkbox
                v-model="permissionsByRole"
                :native-value="permission"
              />
              <span class="pl-1" v-text="permission"></span>
            </label>
          </div>
        </div>
        <div class="flex justify-between">
          <router-link :to="{ name: 'roles.index' }">
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

import { rolesShowRequest, rolesUpdateRequest } from '@/services/requests/roles'
import { permissionsRequest, } from '@/services/requests/permissions'

export default {
  name: 'RolesShow',
  data() {
    return {
      role: {},
      loading: false,
      loadingButton: false,
      permissions: [],
      permissionsByRole: [],
      filter: ''
    }
  },
  methods: {
    fetchRole() {
      this.loading = true
      const roleId = this.$route.params.id
      rolesShowRequest(roleId)
        .then(res => {
          this.role = res.data
          const permissions = this.role.permissions
          this.permissionsByRole = permissions.map(curr => curr.name)
        })
        .finally(() => this.loading = false)
    },
    fetchPermissions() {
      permissionsRequest()
        .then(res => {
          const permissions = res.data
          this.permissions = permissions.map(curr => curr.name)
        })
    },
    onSubmit() {
      this.loadingButton = true
      if(!this.permissionsByRole.length) {
        this.$snack.error('Selecione no mínimo uma permissão para enviar')
        this.loadingButton = false
        return
      }
      const form = {
        ...this.role,
        permissions: this.permissionsByRole
      }
      rolesUpdateRequest(form)
        .then(res => {
          this.$snack.success('Função alterada com sucesso')
          this.$router.push({ name: 'roles.index' })
        })
        .catch(err => this.$snack.error('Ocorreu um erro, tente novamente mais tarde'))
        .finally(() => this.loadingButton = false)
    }
  },
  computed: {
    filteredPermissions() {
      return this.permissions.filter(curr => {
        const permission = curr.toLowerCase()
        const search = this.filter.toLowerCase()
        return permission.match(search)
      })
    }
  },
  mounted() {
    this.fetchRole()
    this.fetchPermissions()
  }
}
</script>
