<template>
  <div>
    <div class="flex items-center justify-between w-full">
      <Lynx-Title text="Usuários"/>
      <Lynx-Button
        text="Atualizar Lista"
        class="my-2 self-start"
        icon="Reload"
        @click.native="fetchUsers"
        size="small"
        icon-size="3"
      />
    </div>

    <Lynx-OverlaySpinner v-if="loading" :loading="loading"/>

    <div class="flex flex-col items-start" v-else>
      <router-link :to="{ name: 'users.create' }" class="mb-4" tag="div">
        <Lynx-Button text="Adicionar Usuário" icon="Plus"/>
      </router-link>
      <b-table
        :data="users"
        :columns="columns"
        :paginated="true"
        per-page="10"
        hoverables
        class="w-full"
        v-if="users.length"
      >
        <template slot-scope="props">
          <b-table-column field="nome_completo" v-text="props.row.nome_completo"
                          v-bind:class="{'text-error-light':props.row.deleted_at}"/>
          <b-table-column field="roles">
            <span
              v-show="!props.row.deleted_at"
              v-for="(role, key) in props.row.role"
              :key="role.id"
            >
              <span v-if="key !== 0" class="px-2">- </span>
              {{ role }}
            </span>
          </b-table-column>
          <b-table-column>
            <div class="flex text-sm">
              <router-link
                v-show="!props.row.deleted_at"
                class="flex items-center text-primary-700"
                :to="{ name: 'users.show', params: { id: props.row.id }}"
                v-if="hasPermission('editar usuario')"
              >
                <b-icon icon="pencil" size="is-small"></b-icon>
                <span class="pl-1">Editar</span>
              </router-link>

              <a
                v-show="!props.row.deleted_at"
                href="#"
                class="flex items-center text-primary-700 pl-4"
                @click.prevent="handleDelete(props.row.id)"
                v-if="hasPermission('excluir usuario')"
              >
                <b-icon icon="power" size="is-small"></b-icon>
                <span class="pl-1">Desativar</span>
              </a>

              <a
                v-show="props.row.deleted_at"
                href="#"
                class="flex items-center text-primary-700 pl-4"
                @click.prevent="handleRestore(props.row.id)"
                v-if="hasPermission('restaurar usuario')"
              >
                <b-icon icon="undo" size="is-small"></b-icon>
                <span class="pl-1">Retaurar</span>
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

import {usersRequest, usersDeleteRequest, restoreUserRequest} from '@/services/requests/users'
import NotFoundData from '@/components/layouts/NotFoundData'
import {hasPermission} from '@/utils/can';

export default {
  name: 'Users',
  components: {NotFoundData},
  data() {
    return {
      users: [],
      loading: false,
      columns: [
        {
          field: 'nome_completo',
          label: 'Nome',
          searchable: true
        },
        {
          field: 'roles',
          label: 'Funções'
        }
      ]
    }
  },
  methods: {
    hasPermission,
    fetchUsers() {
      this.loading = true
      usersRequest()
        .then(res => this.users = res.data.data)
        .catch(() => {
          this.$snack.error({
            text: 'Ocorreu um erro, tente novamente mais tarde',
            button: 'X'
          })
        })
        .finally(() => this.loading = false)
    },
    deleteRow(id) {
      usersDeleteRequest(id)
        .then(res => {
          this.$snack.success('Usuário excluido com sucesso')
          this.fetchUsers()
        })
        .catch(err => this.$snack.error('Usuário não pode ser excluido'))
    },
    restoreUser(id) {
      restoreUserRequest(id)
        .then(res => {
          this.$snack.success('Usuário restaurado com sucesso')
          this.fetchUsers()
        })
        .catch(err => this.$snack.error('Usuário não pode ser restaurado'))
    },
    handleDelete(id) {
      this.$buefy.dialog.confirm({
        message: 'Deseja realmente excluir o usuário?',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        type: 'is-danger',
        onConfirm: () => this.deleteRow(id)
      })
    },
    handleRestore(id) {
      this.$buefy.dialog.confirm({
        message: 'Deseja realmente restaurar este usuário?',
        confirmText: 'Restaurar',
        cancelText: 'Cancelar',
        type: 'is-danger',
        onConfirm: () => this.restoreUser(id)
      })
    }
  },
  mounted() {
    this.fetchUsers()
  }
}
</script>
