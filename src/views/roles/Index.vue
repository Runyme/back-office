<template>
  <div>
    <Lynx-Title text="Funções"/>
    <Lynx-OverlaySpinner v-if="loading" :loading="loading"/>
    <div class="flex flex-col items-start" v-else>
      <router-link :to="{ name: 'roles.create' }" class="mb-4" tag="div">
        <Lynx-Button text="Adicionar Função" icon="Plus" />
      </router-link>
      <b-table 
        :data="roles"
        :columns="columns"
        :paginated="true"
        per-page="10"
        hoverables
        v-if="roles.length"
      >
        <template slot-scope="props">
          <b-table-column field="name" v-text="props.row.name"/>
          <b-table-column field="permissions">
            <span 
              v-for="(permission, key) in props.row.permissions" 
              :key="permission.id"
            >
              <span v-if="key !== 0" class="px-2">- </span>
              {{permission}}
            </span>
          </b-table-column>
          <b-table-column>
            <div class="flex text-sm">
              <router-link class="flex items-center text-primary-700" :to="{ name: 'roles.show', params: { id: props.row.id }}">
                <Icon-Edit size="3"/>
                <span class="pl-1">Editar</span>
              </router-link>
              <a href="#" class="flex items-center text-primary-700 pl-4" @click.prevent="handleDelete(props.row.id)">
                <Icon-Trash size="3"/>
                <span class="pl-1">Excluir</span>
              </a>
            </div>
          </b-table-column>
        </template>
      </b-table>
      <div class="w-full h-full flex justify-center items-center" v-else>
        <NotFoundData text="Nenhuma função foi encontrada"/>
      </div>
    </div>
  </div>
</template>

<script>

import { rolesRequest, rolesDeleteRequest } from '@/services/requests/roles'
import NotFoundData from '@/components/layouts/NotFoundData'

export default {
  name: 'Roles',
  data() {
    return {
      roles: [],
      loading: false,
      columns: [
        {
          field: 'name',
          label: 'Nome',
          searchable: true
        },
        {
          field: 'permissions',
          label: 'Permissões',
        }
      ]
    }
  },
  components: { NotFoundData },
  methods: {
    fetchRoles() {
      this.loading = true
      rolesRequest()
        .then(res => this.roles = res.data.data)
        .catch(err => this.$snack.error('Ocorreu um erro tente novamente mais tarde'))
        .finally(() => this.loading = false)
    },
    deleteRow(id) {
      rolesDeleteRequest(id)
        .then(res => {
          this.$snack.success('Função excluida com sucesso')
          this.fetchRoles()
        })
        .catch(err => this.$snack.error('Funação não pode ser excluida'))
    },
    handleDelete(id) {
      this.$buefy.dialog.confirm({
        message: 'Deseja realmente excluir a função?',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        type: 'is-danger',
        onConfirm: () => this.deleteRow(id)
      })
    }
  },
  mounted() {
    this.fetchRoles()
  }
}
</script>