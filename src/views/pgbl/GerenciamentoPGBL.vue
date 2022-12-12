<template>
  <div>
    <b-loading :active.sync="loading" />
    <div class="w-full flex justify-between items-start">
      <Lynx-Title text="Gerenciamento de PGBL" />

      <div class="flex flex-row-reverse items-end mb-4">
        <b-button
          class="is-primary ml-4"
          icon-right="refresh"
          @click.native="
            () => {
              fetchEmpresasWithGuias();
              fetchUploadReport();
            }
          "
          >Atualizar Lista
        </b-button>
      </div>
    </div>

    <div class="w-full flex justify-between">
      <div class="flex justify-start w-2/3">
        <label class="pb-4">
          <Lynx-Label label="Competência" />
          <b-datepicker
            type="month"
            placeholder="Selecione a data de competência"
            icon="calendar-today"
            :month-names="monthNames"
            v-model="dataCompetencia"
            @input="fetchEmpresasWithGuias"
          />
        </label>

        <label class="pb-4 ml-4">
          <Lynx-Label label="Data de Envio" />
          <b-datepicker
            placeholder="Selecione a data de envio"
            icon="calendar-today"
            :month-names="monthNames"
            v-model="dataEnvio"
            @input="fetchEmpresasWithGuias"
          />
        </label>
      </div>
    </div>

    <b-table
      :data="empresas"
      :columns="columns"
      :paginated="true"
      default-sort-direction="asc"
      default-sort="id"
      per-page="10"
      class="w-full"
    >
      <template slot-scope="props">
        <b-table-column field="id" v-text="props.row.id" />
        <b-table-column field="clientes_id" v-text="props.row.clientes_id" />
        <b-table-column field="data_competencia" v-text="props.row.data_competencia" />
        <b-table-column field="renumeracao" v-text="props.row.renumeracao" />
        <b-table-column field="indicadores" v-text="props.row.indicadores" />
        <b-table-column field="tipo" v-text="props.row.tipo" />
        <b-table-column field="cnpj_contratante" v-text="props.row.cnpj_contratante" />
        <b-table-column field="acoes">
          <div class="flex text-sm items-center">
            <a
              href="#"
              class="bg-primary-600 rounded-full p-2"
              @click.prevent="validateGUias(props.row)"
            >
              <Icon-Check class="text-neutral-100" size="4" />
            </a>
            <a
              href="#"
              class="ml-4 bg-primary-600 rounded-full p-2"
              @click.prevent="openGuiasModal(props.row)"
            >
              <Icon-Eye class="text-neutral-100" size="4" />
            </a>
          </div>
        </b-table-column>
      </template>
    </b-table>
    <b-modal
      :active.sync="guiasModal"
      @close="closeGuiasModal"
      v-if="guiasModal"
    >
      <GerenciamentoGuiasDetails
        :current-empresa="currentEmpresa"
        @estornar="fetchEmpresasWithGuias"
      />
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  chageLiberacaoRequest,
  empresasWithGuiasRequest,
  getUploadReport,
  liberaGuiasRequest,
  sendGuiaRequest,
  sendGuiasRequest,
  validateGuias,
} from "@/services/requests/guias";
import { formatBrToEn, formatDateTimeToBr } from "@/utils/momentHelpers";
import data from "./json"
import { monthNames } from "@/utils/utils";
import GerenciamentoGuiasDetails from "@/views/guias/GerenciamentoGuiasDetails";
import { hasPermission } from "@/utils/can";
import { carteirasRequest } from "../../services/requests/carteiras";

export default {
  name: "GerenciamentoGuias",
  components: { GerenciamentoGuiasDetails },
  data() {
    return {
      monthNames,
      dataCompetencia: null,
      dataEnvio: null,
      loading: false,
      carteiras: [],
      carteira_filter: "todas",
      columns: [
        {
          field: "id",
          label: "Empresa",
          searchable: true,
          sortable: true,
        },
        {
          field: "clientes_id",
          label: "Clientes",
          sortable: true,
        },
        {
          field: "data_competencia",
          label: "Competencia.",
        },
        {
          field: "renumeracao",
          label: "Remuneraćão",
        },
        {
          field: "indicadores",
          label: "indicadores.",
        },
        {
          field: "tipo",
          label: "tipo",
        },
        {
          field: "cnpj_contratante",
          label: "cnpj contratante",
        },
        {
          field: "acoes",
          label: "Ações",
        },
      ],
      empresas: [],
      currentEmpresa: {},
      guiasModal: false,
      filter_status: null,
      uploadReport: {},
      uploadReportInterval: null,
      status_guias: [
        { id: 0, status: "Todas" },
        { id: 1, status: "Enviado" },
        { id: 6, status: "Não enviado" },
        { id: 2, status: "Com Erro" },
        { id: 3, status: "Pendente Financeiro" },
        { id: 4, status: "Pendente RH" },
        { id: 5, status: "Pendente Contabilidade" },
      ],
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
    this.fetchCarteiras();
  },
  destroyed() {
    clearInterval(this.uploadReportInterval);
  },
  methods: {
    hasPermission,
    fetchCarteiras() {
      this.empresas = data
    },
    fetchUploadReport() {
      getUploadReport()
        .then((response) => (this.uploadReport = response.data))
        .catch(() => this.$snack.error("Erro ao calcular Uploads pendentes."));
    },
    changeLiberacao(empresa, departamento) {
      let guiaLiberacao = empresa.guia_liberacao;
      if (
        !(
          guiaLiberacao &&
          guiaLiberacao.length &&
          guiaLiberacao[0][departamento]
        )
      ) {
        this.liberaEnvio(empresa, departamento);
        return;
      }
      this.removeLiberacaoEnvio(empresa, departamento);
    },
    isGuiaLiberadoParaEnvio(guiaLiberacao) {
      return (
        guiaLiberacao &&
        guiaLiberacao.length > 0 &&
        guiaLiberacao[0].rh_departamento_liberacao &&
        guiaLiberacao[0].contabilidade_departamento_liberacao
      );
    },
    liberaEnvio(empresa, departamento) {
      this.chageLiberacaoRequest(true, empresa, departamento);
    },
    removeLiberacaoEnvio(empresa, departamento) {
      this.chageLiberacaoRequest(false, empresa, departamento);
    },
    chageLiberacaoRequest(liberado, empresa, departamento) {
      const data = {
        [departamento]: liberado,
        empresaId: empresa.id,
        dataCompetencia: this.getCompetenciaDate,
      };
      chageLiberacaoRequest(data)
        .then(() => (empresa.guia_liberacao[0][departamento] = liberado))
        .catch((error) => {
          this.$snack.error(error.response.data.message);
          empresa.guia_liberacao[0][departamento] = !liberado;
        });
    },
    sendGuia(empresa) {
      this.$buefy.dialog.confirm({
        title: "Estornar Guia",
        message: "Tem certeza que deseja enviar este email agora?",
        confirmText: "Enviar",
        cancelText: "Cancelar",
        type: "is-primary",
        hasIcon: true,
        onConfirm: () => this.onSendGuia(empresa),
      });
    },
    validateGUias(empresa) {
      const data = {
        empresaId: empresa.id,
        dataCompetencia: this.getCompetenciaDate,
      };
      validateGuias(data)
        .then((res) => {
          let { message, success, arquivos, missing } = res.data;
          
          if (success){ 
            this.$snack.success(message)
            if(!missing){
              empresa.guia_liberacao[0].contabilidade_departamento_liberacao = true
              empresa.guia_liberacao[0].rh_departamento_liberacao = true
              empresa.guia_liberacao[0].financeiro_departamento_liberacao = true
            }
          }
          if (!success) this.$snack.error(message);
        })
        .catch((err) => {
          this.$snack.error(err.response.data.message);
        });
    },
    onSendGuia(empresa) {
      const guiaLiberacao =
        empresa.guia_liberacao && empresa.guia_liberacao.length > 0
          ? empresa.guia_liberacao[0]
          : null;
      if (!this.validateLiberacao(guiaLiberacao)) {
        return;
      }
      this.loading = true;
      const data = {
        competencia: guiaLiberacao.competencia,
        guiaLiberacaoId: guiaLiberacao.id,
      };
      sendGuiaRequest(data)
        .then((res) => {
          this.$snack.success(res.data.message);
          this.fetchEmpresasWithGuias();
        })
        .catch((err) =>
          this.$snack.error(err.response.data.message || err.message)
        )
        .finally(() => (this.loading = false));
    },
    validateLiberacao(guiaLiberacao) {
      if (!guiaLiberacao) {
        this.$snack.error(
          "Por favor aguarde a liberação para enviar as guias."
        );
        return false;
      }
      if (!guiaLiberacao.rh_departamento_liberacao) {
        this.$snack.error("Por favor aguarde a liberação do RH.");
        return false;
      }
      if (!guiaLiberacao.contabilidade_departamento_liberacao) {
        this.$snack.error("Por favor aguarde a liberação da Contabilidade.");
        return false;
      }
      if (!guiaLiberacao.financeiro_departamento_liberacao) {
        this.$snack.error("Por favor aguarde a liberação Financeiro.");
        return false;
      }
      return true;
    },
    openGuiasModal(empresa) {
      this.currentEmpresa = empresa;
      this.guiasModal = true;
    },
    closeGuiasModal() {
      this.guiasModal = false;
      this.currentEmpresa = {};
    },
    handleLiberacaoTodas() {
      this.$buefy.dialog.confirm({
        title: "Liberação de guias",
        message:
          "Esta ação irá liberar para envio conforme as guias que estão anexadas. Deseja continuar?",
        confirmText: "Sim",
        cancelText: "Cancelar",
        type: "is-primary",
        hasIcon: true,
        onConfirm: () => this.liberacaoTodas(),
      });
    },
    liberacaoTodas() {
      this.loading = true;
      liberaGuiasRequest(this.dataCompetenciaComputed)
        .then((response) => this.$snack.success(response.data.message))
        .catch((error) => this.$snack.error(error.response.data.message))
        .finally(() => {
          this.loading = false;
          this.fetchEmpresasWithGuias();
        });
    },
    handleEnvioTodas() {
      this.$buefy.dialog.confirm({
        title: "Liberação de guias",
        message:
          "Esta ação irá enviar todas as guias liberadas. Deseja continuar?",
        confirmText: "Sim",
        cancelText: "Cancelar",
        type: "is-primary",
        hasIcon: true,
        onConfirm: () => this.enviaTodos(),
      });
    },
    enviaTodos() {
      this.loading = true;
      sendGuiasRequest(this.dataCompetenciaComputed)
        .then((response) => this.$snack.success(response.data.message))
        .catch((error) => this.$snack.error(error.response.data.message))
        .finally(() => {
          this.loading = false;
          this.fetchEmpresasWithGuias();
        });
    },
  },
};
</script>