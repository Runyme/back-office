<template>
  <div>
    <b-loading :active.sync="loading"/>
    <div class="w-full flex justify-between items-start">
      <Lynx-Title text="Atividades"/>

      <div class="flex space-x-4">
        <Lynx-Button
          class="mb-3"
          icon="Reload"
          text="Atualizar Lista"
          size="small"
          icon-size="3"
          @click.native="fetchAtividades"
        />
      </div>
    </div>

    <div class="w-full flex mb-4">
      <b-field label="Carteira">
        <b-select placeholder="Selecione uma carteira" v-model="carteira_filter">
          <option
            label="Todas"
            value="todas"
          />
          <option
            label="Sem carteira"
            value="sem_carteira"
          />
          <option
            v-for="item in carteiras"
            v-text="item.nome"
            :value="item.id"
            :key="item.id"
          />
        </b-select>
      </b-field>
    </div>

    <b-table
      :data="atividadesFiltradas"
      :columns="columns"
      :paginated="true"
      per-page="10"
      default-sort-direction="asc"
      default-sort="empresa_id"
      class="w-full"
    >
      <template slot-scope="props">

        <b-table-column field="empresa_id" v-text="props.row.empresa_id"/>

        <b-table-column field="description" v-text="props.row.description"/>

        <b-table-column field="wallet">
          {{ props.row.empresa.carteiras | carteira }}
        </b-table-column>

        <b-table-column field="executed">
          <b-switch :value="props.row.executed === 1" @input="updateRow(props.row)"/>
        </b-table-column>

        <b-table-column field="goal">
          {{ props.row.goal | date }}
        </b-table-column>

        <b-table-column field="deadline">
          {{ props.row.deadline | date }}
        </b-table-column>

        <b-table-column field="acoes">
          <div class="flex text-sm">
            <a href="#" class="flex items-center text-primary-700 pl-4" @click.prevent="deleteAtividade(props.row.id)">
              <Icon-Trash size="3"/>
            </a>
          </div>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
import {hasPermission} from '@/utils/can';
import {
  atividadesRequest,
  deleteAtividadeRequest,
  updateAtividadeRequest
} from '@/services/requests/atividades'
import moment from "moment";
import {carteirasRequest} from "../../services/requests/carteiras";

export default {
  name: "GerenciamentoAtividadesDo",
  data() {
    return {
      loading: false,
      carteiras: [],
      carteira_filter: 'todas',
      columns: [
        {
          field: 'empresa_id',
          label: 'Empresa',
          searchable: true,
          sortable: true,
        },
        {
          field: 'description',
          label: 'Descrição',
          searchable: true,
          sortable: true,
        },
        {
          field: 'wallet',
          label: 'Carteiras',
        },
        {
          field: 'executed',
          label: 'Executada',
        },
        {
          field: 'goal',
          label: 'Meta',
        },
        {
          field: 'deadline',
          label: 'Data Limite',
        },
        {
          field: 'acoes',
          label: 'Ações',
        },
      ],
      atividades: [],
    }
  },
  computed: {
    atividadesFiltradas() {
      const { carteira_filter } = this;

      if (!this.atividades) {
        return this.atividades
      }

      return this.atividades.filter(atividade => {
        if (carteira_filter === 'todas') return true
        if (carteira_filter === 'sem_carteira') return !atividade.empresa || !atividade.empresa.carteiras || !atividade.empresa.carteiras.length

        return atividade.empresa && atividade.empresa.carteiras ? atividade.empresa.carteiras.some(carteira => carteira.id === carteira_filter) : false
      });
    },
  },
  mounted() {
    this.fetchCarteiras()
    this.fetchAtividades()
  },
  filters: {
    carteira: (val) => val ? val.map(carteira => carteira.nome).join(', ') : 'Sem carteira',
    date: (val) => val ? moment(val).format('DD/MM/YYYY') : '',
  },
  methods: {
    hasPermission,
    fetchCarteiras() {
      carteirasRequest()
        .then(response => {
          this.carteiras = response.data.data
        })
        .catch(error => this.$snack.error(error.response.data.message))
    },
    fetchAtividades() {
      this.loading = true;
      atividadesRequest()
        .then(res => this.atividades = res.data)
        .catch(() => this.$snack.error('Ocorreu um erro, tente novamente mais tarde'))
        .finally(() => this.loading = false)
    },
    deleteAtividade(id) {
      this.$buefy.dialog.confirm({
        message: 'Deseja realmente excluir a atividade?',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        type: 'is-danger',
        onConfirm: () => this.deleteRow(id)
      })
    },
    deleteRow(id) {
      deleteAtividadeRequest(id)
        .then(() => {
          this.$snack.success('Atividade Agendada excluída com sucesso');
          this.fetchAtividades();
        })
        .catch(() => {
          this.$snack.error('Atividade não pode ser excluída');
        })
    },
    updateRow(atividade) {
      updateAtividadeRequest({ executed: !atividade.executed }, atividade.id)
        .then(() => {
          this.$snack.success('Atividade atualizada com sucesso');
        })
        .catch(() => {
          this.$snack.error('Atividade não pode ser atualizada');
        })
    },
  },
}
</script>
