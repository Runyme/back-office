<template>
  <div>
    <b-loading :active.sync="loading" />
    <div class="w-full flex justify-between items-start">
      <Lynx-Title text="Gerenciamento de Guias" />

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
        <!-- <b-button class="is-primary ml-4" icon-right="email-send" @click.native="handleEnvioTodas">Enviar Agora
        </b-button> -->
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

        <b-field label="Status" class="ml-4">
          <b-select placeholder="Selecione um status" v-model="filter_status">
            <option
              v-for="item in status_guias"
              :value="item.id"
              :key="item.id"
            >
              {{ item.status }}
            </option>
          </b-select>
        </b-field>

        <b-field class="ml-4" label="Carteira">
          <b-select
            placeholder="Selecione uma carteira"
            v-model="carteira_filter"
          >
            <option label="Todas" value="todas" />
            <option label="Sem carteira" value="sem_carteira" />
            <option
              v-for="item in carteiras"
              v-text="item.nome"
              :value="item.id"
              :key="item.id"
            />
          </b-select>
        </b-field>
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

    <b-table
      :data="empresasComputed"
      :columns="columns"
      :paginated="true"
      default-sort-direction="asc"
      default-sort="id"
      per-page="10"
      class="w-full"
    >
      <template slot-scope="props">
        <b-table-column field="id" v-text="props.row.id" />
        <b-table-column field="guias">
          <div class="flex flex-wrap -mb-2">
            <div
              class="py-1 px-2 bg-neutral-300 rounded mr-2 mb-2 text-xs"
              v-for="(guia, key) in props.row.guias"
              :key="key"
              v-text="guia.tipo"
            ></div>
            <div
              class="py-1 px-2 bg-neutral-300 rounded mr-2 mb-2 text-xs"
              v-show="props.row.pagamento_cartao"
            >
              <b-icon
                size="is-small"
                type="is-success"
                icon="credit-card"
              ></b-icon>
            </div>
          </div>
        </b-table-column>
        <b-table-column field="financeiro">
          <b-switch
            :value="props.row.guia_liberacao | liberado_financeiro"
            @input="
              changeLiberacao(props.row, 'financeiro_departamento_liberacao')
            "
            :disabled="!$hasRole('Financeiro')"
          />
        </b-table-column>
        <b-table-column field="rh">
          <b-switch
            :value="props.row.guia_liberacao | liberado_rh"
            @input="changeLiberacao(props.row, 'rh_departamento_liberacao')"
            :disabled="!hasPermission('liberar guias manualmente')"
          />
        </b-table-column>
        <b-table-column field="contabilidade">
          <b-switch
            :value="props.row.guia_liberacao | liberado_contabilidade"
            @input="
              changeLiberacao(props.row, 'contabilidade_departamento_liberacao')
            "
            :disabled="!hasPermission('liberar guias manualmente')"
          />
        </b-table-column>
        <b-table-column field="status">
          <b-tag :type="props.row.guia_liberacao | statusType">{{
            props.row.guia_liberacao | dataEnvio
          }}</b-tag>
        </b-table-column>
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
            <a
              href="#"
              class="ml-4 bg-primary-600 rounded-full p-2"
              @click.prevent="sendGuia(props.row)"
            >
              <Icon-Mail class="text-neutral-100" size="4" />
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
          field: "guias",
          label: "Guias",
          sortable: true,
        },
        {
          field: "financeiro",
          label: "Financ.",
        },
        {
          field: "rh",
          label: "RH",
        },
        {
          field: "contabilidade",
          label: "Cont.",
        },
        {
          field: "status",
          label: "Status",
          sortable: true,
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
    empresasComputed() {
      const { carteira_filter, filter_status } = this;

      if (!this.empresas) {
        return this.empresas;
      }

      const empresasFilteredList = this.empresas.filter((empresa) => {
        if (carteira_filter === "todas") return true;
        if (carteira_filter === "sem_carteira")
          return !empresa.carteiras || !empresa.carteiras.length;

        return empresa.carteiras
          ? empresa.carteiras.some(
              (carteira) => carteira.id === carteira_filter
            )
          : false;
      });

      return empresasFilteredList.filter((data) => {
        switch (filter_status) {
          case 1:
            return (
              data.guia_liberacao.length &&
              data.guia_liberacao[0].data_envio != null &&
              data.guias.length > 0
            );
          case 2:
            return (
              data.guia_liberacao.length && data.guia_liberacao[0].erro_envio
            );
          case 3:
            return (
              !data.guia_liberacao.length ||
              !data.guia_liberacao[0].financeiro_departamento_liberacao
            );
          case 4:
            return (
              !data.guia_liberacao.length ||
              !data.guia_liberacao[0].rh_departamento_liberacao
            );
          case 5:
            return (
              !data.guia_liberacao.length ||
              !data.guia_liberacao[0].contabilidade_departamento_liberacao
            );
          case 6:
            return (
              !data.guia_liberacao.length || !data.guia_liberacao[0].data_envio
            );
          default:
            return true;
        }
      });
    },
  },
  filters: {
    liberado_contabilidade: (val) =>
      val && val.length > 0
        ? val[0].contabilidade_departamento_liberacao
        : false,
    liberado_rh: (val) =>
      val && val.length > 0 ? val[0].rh_departamento_liberacao : false,
    liberado_financeiro: (val) =>
      val && val.length > 0 ? val[0].financeiro_departamento_liberacao : false,
    liberado: (val) => {
      if (!val || !val.length) return false;
      return (
        val[0].rh_departamento_liberacao &&
        val[0].contabilidade_departamento_liberacao
      );
    },
    dataEnvio: (val) => {
      const thereIsEnvio = val && val.length > 0 && val[0].data_envio;
      const thereIsError = val && val.length > 0 && val[0].erro_envio;
      const thereIsNoGuia = val && val.length > 0 && val[0].sem_guia;
      if (thereIsEnvio) {
        return formatDateTimeToBr(val[0].data_envio);
      }
      if (thereIsError) {
        return "Erro no envio";
      }
      if (thereIsNoGuia) {
        return "Sem guia";
      }
      return "Pendente";
    },
    statusType: (val) => {
      const thereIsEnvio = val && val.length > 0 && val[0].data_envio;
      const thereIsError = val && val.length > 0 && val[0].erro_envio;
      const thereIsNoGuia = val && val.length > 0 && val[0].sem_guia;
      if (thereIsEnvio) return "is-success";
      if (thereIsError) return "is-danger";
      if (thereIsNoGuia) return "is-warning";
      return "default";
    },
  },
  mounted() {
    this.fetchCarteiras();
    this.fetchEmpresasWithGuias();
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
    fetchCarteiras() {
      carteirasRequest()
        .then((response) => {
          const { data } = response.data;
          this.carteiras = data.filter(
            (carteira) => carteira.setor === "contabilidade"
          );
        })
        .catch((error) => this.$snack.error(error.response.data.message));
    },
    fetchUploadReport() {
      getUploadReport()
        .then((response) => (this.uploadReport = response.data))
        .catch(() => this.$snack.error("Erro ao calcular Uploads pendentes."));
    },
    fetchEmpresasWithGuias() {
      this.loading = true;

      empresasWithGuiasRequest({
        competencia: this.dataCompetenciaComputed,
        data_envio: this.dataEnvio ? formatBrToEn(this.dataEnvio) : "",
      })
        .then((res) => (this.empresas = res.data.data))
        .catch(() =>
          this.$snack.error("Ocorreu um erro, tente novamente mais tarde")
        )
        .finally(() => (this.loading = false));
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
