<template>
  <div>
    <Lynx-Title text="Junta Comercial"/>

    <Lynx-Button @click.native.prevent="openCreateModal()" class="mb-6" text="Adicionar" />

    <b-table
      class="w-full"
      :data="juntaComercials"
      :loading="loading"
      hoverable
      per-page="30"
    >
      <template slot-scope="props">
        <b-table-column field="estado_nome" label="Estado">
          {{ props.row.estado.nome }}
        </b-table-column>

        <b-table-column field="taxa_alteracao" label="Taxa Alteração">
          R$ {{ props.row.taxa_alteracao }}
        </b-table-column>

        <b-table-column field="taxa_alteracao_extra" label="Taxa Alteração Extra">
          R$ {{ props.row.taxa_alteracao_extra ? props.row.taxa_alteracao_extra : '0.00' }}
        </b-table-column>

        <b-table-column class="flex justify-between" field="actions" label="" width="120">
          <b-tooltip label="Editar" position="is-bottom">
            <button class="flex items-center justify-center" @click.prevent="openEditModal(props.row.id)">
              <b-icon icon="circle-edit-outline"></b-icon>
            </button>
          </b-tooltip>

          <b-tooltip label="Excluir" position="is-bottom" type="is-danger">
            <button class="flex items-center justify-center" @click.prevent="deleteJuntaComercial(props.row.id)">
              <b-icon icon="delete-forever"></b-icon>
            </button>
          </b-tooltip>
        </b-table-column>
      </template>

      <template slot="empty">
        <Not-Found-Data class="mt-8" text="Nenhuma junta comercial foi encontrada" />
      </template>
    </b-table>

    <b-modal :active.sync="juntaComercialCreateModalOpened">
      <JuntaComercialCreateModal @created="juntaComercialCreated()" />
    </b-modal>

    <b-modal :active.sync="juntaComercialEditModalOpened">
      <JuntaComercialEditModal :juntaComercialId="juntaComercialIdOnEdit" @updated="juntaComercialUpdated()" />
    </b-modal>
  </div>
</template>

<script>

import { JuntaComercialIndex, JuntaComercialDelete } from '@/services/requests/juntaComercial'
import NotFoundData from '@/components/layouts/NotFoundData'
import JuntaComercialCreateModal from '@/views/junta-comercial/CreateModal'
import JuntaComercialEditModal from '@/views/junta-comercial/EditModal'

export default {
  name: 'JuntaComercialIndex',
  components: { NotFoundData, JuntaComercialCreateModal, JuntaComercialEditModal },
  data() {
    return {
      juntaComercials: [],
      juntaComercialIdOnEdit: null,
      loading: false,
      juntaComercialCreateModalOpened: false,
      juntaComercialEditModalOpened: false,
    }
  },
  mounted() {
    this.fetchJuntaComercials()
  },
  methods: {
    openCreateModal() {
      this.juntaComercialCreateModalOpened = true
    },
    juntaComercialCreated() {
      this.juntaComercialCreateModalOpened = false
      this.fetchJuntaComercials()
      this.$snack.success('Junta Comercial foi adicionada!')
    },
    openEditModal(juntaComercialId) {
      this.juntaComercialIdOnEdit = juntaComercialId
      this.juntaComercialEditModalOpened = true
    },
    juntaComercialUpdated() {
      this.juntaComercialEditModalOpened = false
      this.fetchJuntaComercials()
      this.$snack.success('Junta Comercial foi editada!')
    },
    deleteJuntaComercial(juntaComercialId) {
      this.$buefy.dialog.confirm({
        title: 'Excluindo Junta Comercial',
        message: 'Isso irá excluir essa junta comercial, deseja realmente continuar?',
        confirmText: 'Excluir',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => {
          this.loading = true
          JuntaComercialDelete(juntaComercialId)
            .then(() => {
              this.$snack.success('A junta comercial foi excluída!');
            })
            .finally(() => {
              this.fetchJuntaComercials()
              this.loading = false
            })
        }
      })
    },
    fetchJuntaComercials() {
      this.loading = true
      JuntaComercialIndex()
        .then(res => {
          this.juntaComercials = res.data.data
        })
        .finally(() => this.loading = false)
    },
  }
}
</script>
