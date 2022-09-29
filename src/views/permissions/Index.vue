<template>
  <div>
    <Lynx-Title text="Permissões"/>
    <Lynx-OverlaySpinner v-if="loading" :loading="loading"/>
    <div class="flex flex-col items-start" v-else>
      <router-link :to="{ name: 'permissions.create' }" class="mb-4" tag="div">
        <Lynx-Button text="Adicionar Permissão" icon="Plus" />
      </router-link>
      <b-table 
        :data="permissions"
        :columns="columns"
        :paginated="true"
        per-page="10"
        hoverables
        class="w-full"
        v-if="permissions.length"
      >
        <template slot-scope="props">
          <b-table-column field="name" v-text="props.row.name"/>
          <b-table-column>
            <div class="flex text-sm">
              <a href="#" class="flex items-center text-primary-700 pl-4" @click.prevent="handleDelete(props.row.id)">
                <Icon-Trash size="3"/>
                <span class="pl-1">Excluir</span>
              </a>
            </div>
          </b-table-column>
        </template>
      </b-table>
      <div class="w-full h-full flex justify-center items-center" v-else>
        <NotFoundData text="Nenhuma permissão foi encontrada"/>
      </div>
    </div>
  </div>
</template>

<script>

import { permissionsRequest, permissionsDeleteRequest } from '@/services/requests/permissions'
import NotFoundData from '@/components/layouts/NotFoundData'

export default {
  name: 'Permissions',
  data() {
    return {
      permissions: [],
      loading: false,
      columns: [
        {
          field: 'name',
          label: 'Nome',
          searchable: true
        },
      ]
    }
  },
  components: { NotFoundData },
  methods: {
    fetchPermissions() {
      this.loading = true
      permissionsRequest()
        .then(res => this.permissions = res.data)
        .catch(err => this.$snack.error('Ocorreu um erro tente novamente mais tarde'))
        .finally(() => this.loading = false)
    },
    deleteRow(id) {
      permissionsDeleteRequest(id)
        .then(res => {
          this.$snack.success('Permissão excluida com sucesso')
          this.fetchPermissions()
        })
        .catch(err => this.$snack.error('Permissão não pode ser excluida'))
    },
    handleDelete(id) {
      this.$buefy.dialog.confirm({
        message: 'Deseja realmente excluir a permissão?',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        type: 'is-danger',
        onConfirm: () => this.deleteRow(id)
      })
    }
  },
  mounted() {
    this.fetchPermissions()
  }
}
</script>