<template>
  <div>

    <Lynx-OverlaySpinner v-if="loading" :loading="loading"/>

    <div class="w-full flex justify-between items-start">
      <Lynx-Title text="Gerenciamento de Cobranças"/>

      <b-button class="mb-4" icon-right="reload" @click="loading++ || fetchFaturas()"/>
    </div>

    <b-table
      :data="[]"
      :columns="columns"
      :paginated="true"
      default-sort-direction="asc"
      default-sort="id"
      per-page="10"
      hoverables
      class="w-full"
    >
      <template slot-scope="props">
        <b-table-column field="id" v-text="props.row.id"/>

        <b-table-column field="payer_name" v-text="props.row.payer_name" />

        <b-table-column field="subtotal" v-text="props.row.subtotal"/>

        <b-table-column field="data_vencimento" v-text="props.row.data_vencimento | dataEnvio "/>

        <b-table-column field="status">
          <b-tag class="default-margin" :type="props.row | statusType" rounded>{{ props.row | dataEnvio }}</b-tag>
        </b-table-column>

        <b-table-column field="acoes">
          <div class="flex text-sm">
            <b-button class="default-margin" icon-right="eye" @click="openFaturaModal(props.row)"/>
          </div>
        </b-table-column>

      </template>
    </b-table>

    <Modal v-if="faturaModal" :opened="faturaModal" @close-modal="closeFaturaModal">
      <template v-slot:target>
        <h2 class="modal-title">{{ currentFatura.payer_id + ' - ' + currentFatura.payer_name }}</h2>
        <div class="modal-content">
          <div class="modal-row" >
            <a class="modal-link" target="_blank" :href="currentFatura.fatura_url">Ver Fatura</a>
          </div>

          <div class="modal-row">
            <b-button class="default-margin">Cancelar Fatura</b-button>
            <b-button class="default-margin">Estornar Fatura</b-button>
          </div>

          <div class="modal-row" >
            <p><strong>Valor Mensalidade de contrato:</strong> {{currentFatura.contrato.teto_cobranca}}</p>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import { faturasRequest } from "@/services/requests/faturas";
  import Modal from '@/components/helpers/Modal';
  import { formatEnToBr, formatBrToEn, momentIntance } from "@/utils/momentHelpers";
  import { monthNames } from '@/utils/utils';

  export default {
    name: 'GerenciamentoGuias',
    components: {
      Modal,
    },
    data: () => ({
      monthNames,
      dataCompetencia: null,
      loading: false,
      columns: [
        {
          field: 'id',
          label: 'Nº fatura',
          sortable : true,
        },
        {
          field: 'payer_name',
          label: 'Pagador',
          searchable: true,
          sortable : true,
        },
        {
          field: 'subtotal',
          label: 'Valor',
        },
        {
          field: 'data_vencimento',
          label: 'Vencimento',
        },
        {
          field: 'status',
          label: 'Status',
        },
        {
          field: 'acoes',
          label: 'Ações',
        },
      ],
      faturas: [],
      currentFatura: null,
      faturaModal: false,
    }),

    computed: {
      ...mapGetters(['getCompetenciaDate']),
    },

    filters: {
      vencimento: val => formatEnToBr(val),

      liberado: val => (val && val.length > 0) ? val[0].liberado : false,

      dataEnvio: val => {

        if (val.data_vencimento < momentIntance().format('YYYY-MM-DD') && val.status === 'pendente') {
          return 'Atrasado'
        }

        if (val.status === 'pago') {
          let data_pagamento = formatEnToBr(val.data_recebimento);
          return `Pago ${data_pagamento}`
        }

        return 'Pendente';
      },

      statusType: val => {

        if(val.status === 'pago'){
          return "is-success"
        }

        if (val.data_vencimento > momentIntance().format('YYYY-MM-DD') && val.status === 'pendente') {
          return 'is-danger'
        }

        return 'default';
      },
    },
    mounted() {
      this.loading = true;
      this.fetchFaturas();
    },
    methods: {
      fetchFaturas() {
        const dataCompetencia = this.dataCompetencia ? formatBrToEn(this.dataCompetencia) : this.getCompetenciaDate;

        faturasRequest(dataCompetencia)
          .then(res => this.faturas = res.data.data)
          .catch(() => this.$snack.error('Ocorreu um erro, tente novamente mais tarde'))
          .finally(() => this.loading = false);
      },

      openFaturaModal(fatura) {
        this.faturaModal = true;
        this.currentFatura = fatura;
      },

      closeFaturaModal() {
        this.faturaModal = false;
        this.currentFatura = null;
      },

    },
    watch: {
      dataCompetencia() {
        this.loading = true;
        this.fetchFaturas();
      }
    }
  }
</script>

<style scoped>
  .default-margin {
    margin: 0 3px;
  }
  .modal-title {
    margin: 29px 0 29px 20px;
    font-size: 1.1rem;
    font-weight: bold;
  }
  .modal-content {
    padding: 20px;
    display: flex;
    flex-direction: column;
  }
  .modal-row {
    padding: 5px 0;
    display: flex;
    align-items: center;
  }
  .modal-link {
    color: #667eea;
    text-decoration: underline;
    font-weight: bold;
    margin-left: 10px;
  }
</style>
