<template>
  <div>
    <b-loading :active.sync="loading" />
    <div class="w-full flex justify-between items-start">
      <Lynx-Title text="Gerenciamento de PGBL" />

      <div class="flex flex-row-reverse items-end mb-4">
        <b-button class="is-primary ml-4" icon-right="refresh" @click.native="
          () => {
            fetchUploadReport();
            fetchStatusList();
          }
        ">Atualizar Lista
        </b-button>
      </div>
    </div>
    <div class="w-full flex justify-between">
      <div class="flex justify-start w-2/3">
        <!--label class="pb-4">
          <Lynx-Label label="Competência" />
          <b-datepicker type="month" placeholder="Data de competência" icon="calendar-today" :month-names="monthNames"
            v-model="dataCompetencia" @input="fetchStatusList" :icon-right="dataCompetencia ? 'close-circle' : ''"
            icon-right-clickable @icon-right-click="clearDataCompetencia" trap-focus />
        </label>
        <label class="pb-4 ml-4">
          <Lynx-Label label="Data de Envio" />
          <b-datepicker placeholder="Data de envio" icon="calendar-today" :month-names="monthNames" v-model="dataEnvio"
            @input="fetchStatusList" :icon-right="dataEnvio ? 'close-circle' : ''" icon-right-clickable
            @icon-right-click="clearDataEnvio" trap-focus />
        </label-->
      </div>

      <div class="flex flex-row-reverse items-end mb-4 w-1/3">
        <div class="control ml-4">
          <b-taglist attached>
            <b-tag type="is-primary" size="is-medium">Processando:</b-tag>
            <b-tag type="is-warning" size="is-medium">{{
                uploadReport.total || "..."
            }}</b-tag>
          </b-taglist>
        </div>
        <div class="control">
          <b-taglist attached>
            <b-tag type="is-primary" size="is-medium">Erros:</b-tag>
            <b-tag type="is-danger" size="is-medium">{{
                uploadReport.withError || "..."
            }}</b-tag>
          </b-taglist>
        </div>
      </div>
    </div>

    <b-table :data="statusList" :paginated="true" height="480" default-sort-direction="asc" default-sort="id"
      per-page="10" class="w-full" sticky-header>
      <template slot-scope="props">
        <b-table-column field="empresas_id" searchable sortable label="Cód. Empresa" v-text="props.row.empresas_id" />
        <b-table-column field="clientes_id" searchable sortable label="Cód. Cliente" v-text="props.row.clientes_id" />
        <b-table-column field="nome_completo" searchable sortable label="Nome">
          {{ props.row.nome_completo }}
          / {{ props.row.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') }}
        </b-table-column>

        <b-table-column field="status" sortable label="Situação / Data">
          <a v-if="props.row.status == 9" @click.prevent="alertCustomError(props.row.error_message)">
            <b-tag :type="statusColor(props.row.status)">{{ statusText(props.row.status) }}
            </b-tag>
            {{ props.row.status_date != undefined ? new Date(props.row.status_date).toLocaleString('pt-BR', {
                timeZone:
                  'UTC'
              })
                : ''
            }}
          </a>
          <a v-else-if="props.row.status == undefined" @click.prevent="gotoUploadFile()">
            <b-tag :type="statusColor(props.row.status)">{{ statusText(props.row.status) }}
            </b-tag>
          </a>
          <div v-else>
            <b-tag :type="statusColor(props.row.status)">{{ statusText(props.row.status) }}
            </b-tag>
            {{ props.row.status_date != undefined ? new Date(props.row.status_date).toLocaleString('pt-BR', {
                timeZone:
                  'UTC'
              })
                : ''
            }}
          </div>
        </b-table-column>

        <b-table-column field="job_date" sortable label="Data de Envio">
          {{ props.row.job_date != undefined ? new Date(props.row.job_date).toLocaleString('pt-BR', { timeZone: 'UTC' })
              : '-'
          }}
        </b-table-column>
        <b-table-column field="nome_original" sortable label="Arquivo">
          <a @click.prevent="baixarArquivo(props.row.clientes_id, props.row.nome_original)"><b-icon
              v-if="props.row.nome_original != undefined" icon="file-download" />{{ props.row.nome_original
              }} </a>
        </b-table-column>
        <b-table-column field="de" sortable label="Período Extraído">
          {{ props.row.de != undefined ? new Date(props.row.de).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : ''
          }} -
          {{ props.row.ate != undefined ? new Date(props.row.ate).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : ''
          }}
        </b-table-column>


        <b-table-column label="Ações" field="acoes">
          <div class="flex text-sm items-center">

            <button v-if="props.row.status != 0" title="Fazer Upload de Arquivo"
              class="bg-primary-600 rounded-full p-1 ml-2" @click.prevent="gotoUploadFile()">
              <b-icon class="text-white" icon="file-upload" size="is-default" />
            </button>

            <button v-else disabled class="bg-disabled rounded-full p-1 ml-2">
              <b-icon class="text-white" icon="file-upload" size="is-default" />
            </button>


            <button v-if="props.row.status == 1" title="Mostrar Relatório De Importação para o cliente"
              class="bg-primary-600 rounded-full p-1 ml-2" @click.prevent="opendetailsModal(props.row)">
              <b-icon class="text-white" icon="view-list" size="is-default" />
            </button>

            <button v-else disabled class="bg-disabled rounded-full p-1 ml-2">
              <b-icon class="text-white" icon="view-list" size="is-default" />
            </button>

            <button v-if="props.row.status == 0" title="Forçar Processamento Imediato"
              class="bg-primary-600 rounded-full p-1 ml-2" @click.prevent="forceProcess(props)">
              <b-icon class="text-white" icon="fast-forward" size="is-default" />
            </button>

            <button v-else disabled class="bg-disabled rounded-full p-1 ml-2">
              <b-icon class="text-white" icon="fast-forward" size="is-default" />
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
import { mapGetters } from "vuex";
import { getUploadReport, getJobsStatus, getExtratoPrevidenciario, processJob, getRelatorioDetalhadoCliente, } from "@/services/requests/pgbl";
import { formatBrToEn } from "@/utils/momentHelpers";
import { monthNames } from "@/utils/utils";
import PgblDetails from "@/views/pgbl/PgblDetails";
import { hasPermission } from "@/utils/can";

export default {
  name: "GerenciamentoPgbl",
  components: { PgblDetails },
  data() {
    return {
      monthNames,
      dataCompetencia: null,
      dataEnvio: null,
      loading: false,
      carteiras: [],
      statusList: [],
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
    this.fetchStatusList();
    this.fetchUploadReport();
    this.uploadReportInterval = setInterval(
      () => this.fetchUploadReport(),
      15000
    );
  },

  destroyed() {
    clearInterval(this.uploadReportInterval);
  },

  methods: {
    hasPermission,

    clearDataCompetencia() {
      this.dataCompetencia = null;
    },

    clearDataEnvio() {
      this.dataEnvio = null;
    },

    gotoUploadFile() {
      this.$router.push({ path: `/upload-pgbl` });
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

    statusColor(status) {

      if (status == undefined || status == null)
        return "is-default";

      // status: 0=Pendente, 1=Processado, 2=Arquivado, 8=Cancelado, 9=Erro
      switch (status) {
        case 0:
          return "is-warning";
        case 1:
          return "is-success";
        case 9:
          return "is-danger";
        default:
          return "is-light";
      }
    },
    statusText(status) {

      if (status == undefined || status == null)
        return "Upload Pendente";

      // status: 0=Pendente, 1=Processado, 2=Arquivado, 8=Cancelado, 9=Erro
      switch (status) {
        case 0:
          return "Processamento Pendente";
        case 1:
          return "Processado";
        case 2:
          return "Arquivado";
        case 8:
          return "Cancelado";
        case 9:
          return "Erro";
        default:
          return "Indefinido";
      }
    },

    fetchUploadReport() {
      getUploadReport()
        .then((response) => (this.uploadReport = response.data))
        .catch(() => this.$snack.error("Erro ao calcular Uploads pendentes."));
    },

    forceProcess(row) {
      this.loading = true;
      processJob(row.row.job_id)
        .then(() => {
          this.fetchUploadReport();
          this.fetchStatusList();
        })
        .catch(() => this.$snack.error("Erro forçar processamento de upload."))
        .finally(() => {
          this.loading = false;
        });
    },

    fetchStatusList() {
      this.loading = true;
      getJobsStatus()
        .then((response) => (this.statusList = response.data.data))
        .catch(() => this.$snack.error("Erro ao calcular Uploads pendentes."))
        .finally(() => {
          this.loading = false;
        });
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
