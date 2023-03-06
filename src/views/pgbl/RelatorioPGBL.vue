<template>
  <div>
    <b-loading :active.sync="loading" />
    <div class="w-full flex justify-between items-start">
      <Lynx-Title text="Relatório de PGBL" />

      <div class="flex flex-row-reverse items-end mb-4">
        <b-button class="is-primary ml-4" icon-right="download" @click.native="
          () => {
            exportRelatorioPorAno();
          }
        ">Exportar Relatório
        </b-button>
        <b-button class="is-primary ml-4" icon-right="refresh" @click.native="
          () => {
            fetchRelatorioPorAno();
          }
        ">Atualizar Lista
        </b-button>
      </div>
    </div>
    <div class="w-full flex justify-between">
      <div class="flex justify-start w-2/3">
        <label class="pb-4">
          <Lynx-Label label="Ano de Competência" />
          <b-datepicker type="month" placeholder="Data de competência" icon="calendar-today" :month-names="monthNames"
            v-model="dataCompetencia" @input="fetchRelatorioPorAno" :icon-right="dataCompetencia ? 'close-circle' : ''"
            icon-right-clickable @icon-right-click="clearDataCompetencia" trap-focus />
        </label>
      </div>


    </div>

    <b-table :data="relatorio" :paginated="true" height="480" default-sort-direction="asc" default-sort="id"
      per-page="10" class="w-full" sticky-header>
      <template slot-scope="props">
        <b-table-column field="empresas_id" searchable sortable label="Cód. Empresa" v-text="props.row.empresas_id" />
        <b-table-column field="clientes_id" searchable sortable label="Cód. Cliente" v-text="props.row.clientes_id" />
        <b-table-column field="nome_completo" searchable sortable label="Nome">
          {{ props.row.nome_completo }}
          / {{ props.row.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') }}
        </b-table-column>

        <b-table-column field="de" sortable label="Período Extraído">
          {{ props.row.de != undefined ? new Date(props.row.de).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : ''
          }} -
          {{ props.row.ate != undefined ? new Date(props.row.ate).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : ''
          }}
        </b-table-column>
        <b-table-column field="renumeracao" numeric label="Renumeração" sortable>{{ toMoeda(props.row.renumeracao)
        }}</b-table-column>
        <b-table-column field="aporte" numeric label="Aporte" sortable>{{ toMoeda(props.row.aporte)
        }}</b-table-column>

        <b-table-column label="Ações" field="acoes">
          <div class="flex text-sm items-center">
            <button title="Mostrar Relatório De Importação para o cliente" class="bg-primary-600 rounded-full p-1 ml-2"
              @click.prevent="opendetailsModal(props.row)">
              <b-icon class="text-white" icon="view-list" size="is-default" />
            </button>
          </div>
        </b-table-column>

      </template>
    </b-table>
    <b-modal :active.sync="detailsModal" @close="closedetailsModal" v-if="detailsModal">
      <PgblDetails :extrato="extrato" :cpf="cpfCorrente" :clientes-id="clienteCorrente" :nome-completo="nomeCompletoCorrente" />
    </b-modal>
  </div>
</template>

<script>
import { moeda } from '@/utils/helpers'
import { mapGetters } from "vuex";
import { getExtratoPrevidenciario, getRelatorioPorAno, getRelatorioDetalhadoCliente, } from "@/services/requests/pgbl";
import { formatBrToEn } from "@/utils/momentHelpers";
import { monthNames } from "@/utils/utils";
import PgblDetails from "@/views/pgbl/PgblDetails";
import { hasPermission } from "@/utils/can";

export default {
  name: "RelatorioPgbl",
  components: { PgblDetails },
  data() {
    return {
      monthNames,
      dataCompetencia: null,
      dataEnvio: null,
      loading: false,
      carteiras: [],
      relatorio: [],
      extrato: [],
      cpfCorrente: '',
      clienteCorrente: '',
      nomeCompletoCorrente: '',
      detailsModal: false,
      filter_status: null,
      uploadReport: {},
      uploadReportInterval: null,
    };
  },
  computed: {
    ...mapGetters(["getCompetenciaDate"]),
    dataCompetenciaComputed() {
      return this.dataCompetencia
        ? formatBrToEn(this.dataCompetencia)
        : this.getCompetenciaDate;
    },
  },

  mounted() {
    this.fetchRelatorioPorAno();
  },

  methods: {
    hasPermission,

    toMoeda(value) {
      return moeda(value);
    },

    clearDataCompetencia() {
      this.dataCompetencia = null;
    },

    async baixarArquivo(clientes_id, nome) {
      this.loading = true;
      getExtratoPrevidenciario(clientes_id).then((response) => {
        if (!response) return
        const linkSource = `data:application/pdf;base64,${response.data}`
        const downloadLink = document.createElement('a')
        const fileName = nome
        downloadLink.href = linkSource
        downloadLink.download = fileName
        downloadLink.click()
      }).finally(() => {
        this.loading = false;
      })
    },

    fetchRelatorioPorAno() {
      this.loading = true;
      const ano = this.dataCompetenciaComputed.split('-')[0];
      getRelatorioPorAno(ano)
        .then((response) => (this.relatorio = response.data.data))
        .catch(() => this.$snack.error("Erro ao calcular Uploads pendentes."))
        .finally(() => {
          this.loading = false;
        });
    },

    exportRelatorioPorAno() {
      const ano = this.dataCompetenciaComputed.split('-')[0];
      window.open(
        `${process.env.VUE_APP_API_URL}/pgbl/relatorio-por-ano-excel/${ano}?token=${this.$store.getters.getToken}`,
        "_blank"
      );
    },

    alertCustomError(message) {
      this.$buefy.dialog.alert({
        title: 'Erro',
        message: message,
        type: 'is-danger',
        hasIcon: true,
        icon: 'times-circle',
        iconPack: 'fa',
        ariaRole: 'alertdialog',
        ariaModal: true
      })
    },

    opendetailsModal(row) {
      this.loading = true;
      this.extrato = [];
      getRelatorioDetalhadoCliente(row.clientes_id)
        .then((response) => {
          this.extrato = response.data.data;
          this.cpfCorrente = row.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
          this.clienteCorrente = row.clientes_id;
          this.nomeCompletoCorrente = row.nome_completo;
          this.detailsModal = true;
        })
        .catch(() => this.$snack.error("Erro ao calcular Uploads pendentes."))
        .finally(() => {
          this.loading = false;
        });
    },

    closedetailsModal() {
      this.detailsModal = false;
      this.extrato = {};
    },

  },
};
</script>
<style scoped>
.bg-disabled {
  background-color: lightgray;
  cursor: default !important;
}
</style>
