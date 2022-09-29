<template>
  <div class="flex flex-wrap justify-between items-center">
    <Lynx-Title text="Alteração de Empresa"/>

    <Lynx-Button @click.native.prevent="openCreateModal()" class="mb-6" text="Solicitar Alteração" />

    <b-table
      class="w-full"
      :data="empresaAlteracoes"
      :loading="loading"
      hoverable
      per-page="10"
    >
      <template slot-scope="props">
        <b-table-column field="empresa_id" label="#" width="40">
          {{ props.row.empresa && props.row.empresa.id || '' }}
        </b-table-column>

        <b-table-column field="razao_social" label="Razão Social">
          {{ (props.row.empresa) ? props.row.empresa.razao_social || props.row.empresa.nome_empresa : '' }}
        </b-table-column>

        <b-table-column field="status" label="Status">
          {{ props.row.status_label }}
        </b-table-column>

        <b-table-column class="flex justify-between" field="actions" label="" width="120">
          <b-tooltip v-if="props.row.status_id == 1" label="Confirmar Pagamento" position="is-bottom" type="is-success">
            <button class="flex items-center justify-center" @click.prevent="confirmPayment(props.row.id)">
              <b-icon icon="currency-usd"></b-icon>
            </button>
          </b-tooltip>

          <b-tooltip v-if="props.row.status_id == 2" label="Editar" position="is-bottom">
            <button class="flex items-center justify-center" @click.prevent="openEditModal(props.row)">
              <b-icon icon="circle-edit-outline"></b-icon>
            </button>
          </b-tooltip>

          <b-tooltip label="Excluir" position="is-bottom" type="is-danger">
            <button class="flex items-center justify-center" @click.prevent="deleteEmpresaAlteracao(props.row.id)">
              <b-icon icon="delete-forever"></b-icon>
            </button>
          </b-tooltip>
        </b-table-column>
      </template>

      <template slot="empty">
        <Not-Found-Data class="mt-8" text="Nenhuma solicitação de alteração foi encontrada" />
      </template>
    </b-table>

    <b-modal :active.sync="empresaAlteracaoCreateModalOpened">
      <EmpresaAlteracaoCreateModal @created="alteracaoCreated()" />
    </b-modal>

    <b-modal :active.sync="empresaAlteracaoEditModalOpened" :on-cancel="fetchEmpresaAlteracoes">
      <EmpresaAlteracaoEditModal :empresaAlteracao="selectedEmpresaAlteracao" @edited="alteracaoEdited()" />
    </b-modal>
  </div>
</template>

<script>

import { EmpresaAlteracaoIndex, EmpresaAlteracaoDelete, EmpresaAlteracaoUpdate } from '@/services/requests/empresaAlteracao'
import NotFoundData from '@/components/layouts/NotFoundData'
import EmpresaAlteracaoCreateModal from '@/views/empresas/alteracao/CreateModal'
import EmpresaAlteracaoEditModal from '@/views/empresas/alteracao/EditModal'

export default {
  name: 'EmpresaAlteracaoIndex',
  components: {  NotFoundData, EmpresaAlteracaoCreateModal, EmpresaAlteracaoEditModal },
  data() {
    return {
      empresaAlteracaoCreateModalOpened: false,
      empresaAlteracaoEditModalOpened: false,
      selectedEmpresaAlteracao: null,
      empresaAlteracoes: [],
      loading: false,
    }
  },
  mounted() {
    this.fetchEmpresaAlteracoes()
  },
  methods: {
    alteracaoCreated() {
      this.empresaAlteracaoCreateModalOpened = false
      this.fetchEmpresaAlteracoes()
    },
    alteracaoEdited() {
      this.empresaAlteracaoEditModalOpened = false
      this.fetchEmpresaAlteracoes()
    },
    openCreateModal() {
      this.empresaAlteracaoCreateModalOpened = true
    },
    fetchEmpresaAlteracoes() {
      this.loading = true
      EmpresaAlteracaoIndex()
        .then(res => {
          this.empresaAlteracoes = res.data.data
        })
        .finally(() => this.loading = false)
    },
    deleteEmpresaAlteracao(EmpresaAlteracaoId) {
      this.$buefy.dialog.confirm({
        title: 'Excluindo Solicitação de Alteração',
        message: 'Isso irá excluir essa solicitação de alteração, deseja realmente continuar?',
        confirmText: 'Excluir',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => {
          this.loading = true
          EmpresaAlteracaoDelete(EmpresaAlteracaoId)
            .then(() => {
              this.$snack.success('Solicitação de alteração excluída com sucesso!')
            })
            .finally(() => {
              this.loading = false
              this.fetchEmpresaAlteracoes()
            })
        }
      })
    },
    confirmPayment(EmpresaAlteracaoId) {
      this.$buefy.dialog.confirm({
        title: 'Confirmação de Pagamento',
        message: 'Confirma o pagamento da solicitação de alteração?',
        confirmText: 'Confirmar',
        type: 'is-success',
        hasIcon: true,
        onConfirm: () => {
          this.loading = true
          EmpresaAlteracaoUpdate(EmpresaAlteracaoId, [])
            .then(() => {
              this.$snack.success('Pagamento confirmado com sucesso!')
            })
            .finally(() => {
              this.loading = false
              this.fetchEmpresaAlteracoes()
            })
        }
      })
    },
    openEditModal(empresaAlteracao) {
      this.selectedEmpresaAlteracao = empresaAlteracao
      this.empresaAlteracaoEditModalOpened = true
    },
  }
}
</script>
