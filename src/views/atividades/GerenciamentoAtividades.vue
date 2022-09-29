<template>
  <div>
    <b-loading :active.sync="loading"/>
    <div class="w-full flex justify-between items-start">
      <Lynx-Title text="Modelo de atividades"/>

      <div class="flex space-x-4">
        <Lynx-Button
          class="mb-3"
          icon="Reload"
          text="Atualizar Lista"
          size="small"
          icon-size="3"
          @click.native="fetchAtividades"
        />

        <Lynx-Button
          class="mb-3"
          icon="Plus"
          text="Cadastrar"
          size="small"
          icon-size="3"
          @click.native="modalCreateOpened = true"/>
      </div>
    </div>

    <b-table
      class="w-full"
      :data="atividadesSchedules"
      :columns="columns"
      :paginated="true"
      per-page="10"
      default-sort-direction="asc"
      default-sort="id"
    >
      <template slot-scope="props">

        <b-table-column field="description" v-text="props.row.description"/>

        <b-table-column field="last_execution">
          {{ props.row.last_execution | date }}
        </b-table-column>

        <b-table-column field="acoes">
          <div class="flex text-sm">
            <a href="#" class="flex items-center text-primary-700 pl-4" @click.prevent="executarAtividade(props.row.id)">
              <Icon-Play size="3"/>
              <span class="pl-1">Executar</span>
            </a>

            <a href="#" class="flex items-center text-primary-700 pl-4"
               @click.prevent="openModalEdit(props.row.id)">
              <Icon-Edit size="3"/>
              <span class="pl-1">Editar</span>
            </a>

            <a href="#" class="flex items-center text-primary-700 pl-4" @click.prevent="deleteAtividade(props.row.id)">
              <Icon-Trash size="3"/>
              <span class="pl-1">Excluir</span>
            </a>
          </div>
        </b-table-column>
      </template>
    </b-table>

    <b-modal :active.sync="modalCreateOpened">
      <AtividadeAgendadaCreateModal :modalCreateOpened="modalCreateOpened" @close-modal="closeModalCreate"/>
    </b-modal>

    <b-modal :active.sync="modalEditOpened">
      <AtividadeAgendadaEditModal :activityId="activityId" @updated="activityUpdated()" />
    </b-modal>
  </div>
</template>

<script>
import {hasPermission} from '@/utils/can';
import {
  atividadesSchedulesRequest,
  deleteAtividadeScheduleRequest,
  executeAtividadeScheduleRequest
} from '@/services/requests/atividades'
import AtividadeAgendadaCreateModal from '@/views/atividades/AtividadeAgendadaCreateModal'
import AtividadeAgendadaEditModal from '@/views/atividades/AtividadeAgendadaEditModal'
import moment from "moment";

export default {
  name: "GerenciamentoAtividades",
  components: { AtividadeAgendadaCreateModal, AtividadeAgendadaEditModal },
  data() {
    return {
      loading: false,
      columns: [
        {
          field: 'description',
          label: 'Descrição',
          searchable: true,
          sortable: true,
        },
        {
          field: 'last_execution',
          label: 'Ultima execução',
        },
        {
          field: 'acoes',
          label: 'Ações',
        },
      ],
      atividadesSchedules: [],
      modalCreateOpened: false,
      activityId: null,
      modalEditOpened: false,
    }
  },
  filters: {
    date: (val) => val ? moment(val).format('DD/MM/YYYY') : '',
  },
  mounted() {
    this.fetchAtividades()
  },
  methods: {
    hasPermission,
    fetchAtividades() {
      this.loading = true;
      atividadesSchedulesRequest()
        .then(res =>  this.atividadesSchedules = res.data)
        .catch(() => this.$snack.error('Ocorreu um erro, tente novamente mais tarde'))
        .finally(() => this.loading = false)
    },
    deleteAtividade(id) {
      this.$buefy.dialog.confirm({
        message: 'Deseja realmente excluir a atividade agendada?',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        type: 'is-danger',
        onConfirm: () => this.deleteRow(id)
      })
    },
    deleteRow(id) {
      deleteAtividadeScheduleRequest(id)
        .then(() => {
          this.$snack.success('Atividade Agendada excluída com sucesso');
          this.fetchAtividades();
        })
        .catch(() => {
          this.$snack.error('Atividade Agendada não pode ser excluída');
        })
    },
    closeModalCreate() {
      this.modalCreateOpened = false;
      this.fetchAtividades();
    },
    openModalEdit(id) {
      this.activityId = id;
      this.modalEditOpened = true;
    },
    activityUpdated() {
      this.modalEditOpened = false;
      this.fetchAtividades();
      this.$snack.success('Atividade foi atualizada!');
    },
    executarAtividade(id) {
      this.loading = true;

      executeAtividadeScheduleRequest(id)
        .then(() => {
          this.fetchAtividades();
          this.$snack.success('Atividade executada com sucesso');
        })
        .catch(() => {
          this.$snack.error('Não foi possível executar atividade agendada');
        })
        .finally(() => {
          this.loading = false;
        })
    },
  },
}
</script>
