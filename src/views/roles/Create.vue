<template>
  <div>
    <div v-if="!loading">
      <Lynx-Title text="Adicionar função"/>
      <form class="flex flex-col" @submit.prevent="onSubmit">
        <label class="flex flex-col w-full pb-6">
          <Lynx-Label
            label="Função"
            :validator="$v.form.name"
            :validations-message="validationsMessage.form.name"
          />
          <Lynx-Input
            placeholder="Insira o nome da função"
            :error="$v.form.name.$error"
            v-model.trim="$v.form.name.$model"
          />
        </label>
        <div class="pb-8">
          <span class="text-lg font-display border-b border-neutral-400 w-full pb-2 flex mb-4">Permissões</span>
          <Lynx-Input 
            class="mb-8 max-w-md" 
            placeholder="Digite a permissão" 
            icon="Search"
            v-model="filter"
          />
          <div class="flex flex-wrap">
            <label class="flex pr-8 pb-4" v-for="permission in filteredPermissions" :key="permission.id">
              <b-checkbox 
                v-model="form.permissions"
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
          <Lynx-Button type="submit" text="Adicionar" icon="Plus" :loading="loadingButton"/>
        </div>
      </form>
    </div>
    <Lynx-OverlaySpinner v-else :loading="loading"/>
  </div>
</template>

<script>

import { permissionsRequest } from '@/services/requests/permissions'
import { rolesCreateRequest } from '@/services/requests/roles'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'RolesCreate',
  data() {
    return {
      form: {
        name: '',
        permissions: []
      },
      loading: false,
      loadingButton: false,
      permissions: [],
      permissionsByRole: [],
      filter: '',
      validationsMessage: {
        form: {
          name: {
            required: 'Digite um nome para a função'
          }
        }
      }
    }
  },
  validations: {
    form: {
      name: { required }
    } 
  },
  methods: {
    fetchPermissions() {
      this.loading = true
      permissionsRequest()
        .then(res => {
          const permissions = res.data
          this.permissions = permissions.map(curr => curr.name)
        })
        .finally(() => this.loading = false)
    },
    onSubmit() {
      if(this.$v.$invalid) {
        this.$snack.error('Preencha corretamente o formulário')
        return
      }
      if(!this.form.permissions.length) {
        this.$snack.error('Selecione no mínimo uma permissão para a função')
        return
      }
      this.loadingButton = true
      rolesCreateRequest(this.form)
        .then(res => {
          this.$snack.success('Função cadastrada com sucesso')
          this.$router.push({ name: 'roles.index' })
        })
        .catch(err => this.$snack.error(err.response.data.message))
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
    this.fetchPermissions()
  }
}
</script>