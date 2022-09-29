<template>
  <div>
    <b-loading :active.sync="loading" />
    <div class="w-full flex justify-between items-start">
      <Lynx-Title text="Declarações IRPF" />
      <Lynx-Button
        text="Relatorio IRPF"
        class="mb-3"
        @click.native="gerarRelatorio()"
        size="small"
        icon-size="3"
      />
    </div>

    <div class="w-full flex mb-4 justify-between items-end">
      <div class="flex">
        <b-field class="mr-5" label="Carteira">
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
        <b-field label="Status">
          <b-select placeholder="Selecione um status" v-model="status_filter">
            <option
              v-for="item in options_status_filter"
              :value="item.value"
              :key="item.id"
              v-text="item.label"
            />
          </b-select>
        </b-field>
      </div>

      <Lynx-Button
        class="mb-3"
        icon="Reload"
        text="Atualizar Lista"
        size="small"
        icon-size="3"
        @click.native="fetchList"
      />
    </div>

    <b-table
      :data="irpfListFiltered"
      :columns="columns"
      :paginated="true"
      default-sort-direction="asc"
      default-sort="nome_cliente"
      per-page="10"
    >
      <template slot-scope="props">
        <b-table-column field="empresa">
          {{ props.row.empresa }}
        </b-table-column>
        <b-table-column field="nome_cliente">
          {{ props.row.nome_cliente }}
        </b-table-column>
        <b-table-column field="status">
          <b-tag :type="props.row.irpf | stringStatusType">
            {{ props.row.irpf | stringStatus }}
          </b-tag>
        </b-table-column>
        <b-table-column field="pendencias">
          <b-tag :type="props.row.irpf | statusPendenciasTag">
            {{ props.row.irpf | statusPendencias }}
          </b-tag>
        </b-table-column>
        <b-table-column field="cancelados">
          <b-switch
            :value="props.row.irpf | canceladosIrpf"
            @input="changeCancelados(props.row)"
          />
        </b-table-column>
        <b-table-column field="aceitou">
          <b-switch
            :value="props.row.irpf | aceitouIrpf"
            @input="changeAceito(props.row)"
          />
        </b-table-column>

        <b-table-column field="isento">
          <b-switch
            :value="props.row.irpf | irpfIsento"
            @input="changeIsento(props.row)"
            :disabled="props.row.contratos && props.row.contratos.length > 0"
          />
        </b-table-column>
        <b-table-column field="acoes">
          <div class="flex text-sm items-center">
            <a
              href="#"
              class="mr-4 bg-primary-600 rounded-full p-2"
              @click.prevent="openIrpfModal(props.row)"
            >
              <Icon-Eye class="text-neutral-100" size="4" />
            </a>
          </div>
        </b-table-column>
      </template>
    </b-table>

    <b-modal
      :active.sync="showIrpfModal"
      @close="closeIrpfModal"
      v-if="showIrpfModal"
    >
      <div class="bg-neutral-300 p-8">
        <Lynx-Title text="Declaração IRPF" />
        <b-steps
          :has-navigation="false"
          :value="activeStep - 1"
          destroy-on-hide
        >
          <b-step-item label="Questionário" clickable step="1">
            <IrpfResponderQuestionarioModal
              :cliente-irpf="selectedCliente"
              @update-irpf="onUpdateIrpf"
            />
          </b-step-item>
          <b-step-item
            label="Pendencias"
            :clickable="pendenciaStepClickable"
            step="2"
          >
            <IrpfResponderPendenciaModal
              :cliente-irpf="selectedCliente"
              @update-irpf="onUpdateIrpf"
            />
          </b-step-item>
          <b-step-item
            label="Entrega"
            :clickable="entregaStepClickable"
            step="3"
          >
            <ClienteIrpfModal
              :cliente-irpf="selectedCliente"
              @update-irpf="onUpdateIrpf"
            />
          </b-step-item>
        </b-steps>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { irpfRequest } from "../../services/requests/irpf";
import ClienteIrpfModal from "./ClienteIrpfModal";
import IrpfResponderQuestionarioModal from "@/views/Irpf/IrpfResponderQuestionarioModal";
import IrpfResponderPendenciaModal from "@/views/Irpf/IrpfResponderPendenciaModal";
import { carteirasRequest } from "@/services/requests/carteiras";
import {
  changeIrpfToAceitoRequest,
  changeIrpfToCanceladoRequest,
  changeIrpfToIsentoRequest,
} from "@/services/requests/irpf";

export default {
  name: "ClientesIrpfList",
  components: {
    IrpfResponderPendenciaModal,
    IrpfResponderQuestionarioModal,
    ClienteIrpfModal,
  },
  data() {
    return {
      loading: false,
      carteira_filter: "todas",
      carteiras: [],
      status_filter: "todos",
      options_status_filter: [
        {
          value: "todos",
          label: "Todos",
        },
        {
          value: "nao_respondido",
          label: "Não respondido",
        },
        {
          value: "questionario_respondido",
          label: "Questionario respondido",
        },
        {
          value: "iniciou_pendencias",
          label: "Iniciou envio de pendências",
        },
        {
          value: "pendencias_enviadas",
          label: "Pendências enviadas",
        },
        {
          value: "finalizado",
          label: "Finalizado",
        },
        {
          value: "cancelado",
          label: "Cancelado",
        },
      ],
      columns: [
        {
          field: "empresa",
          label: "Empresa",
          searchable: true,
          sortable: true,
        },
        {
          field: "nome_cliente",
          label: "Cliente",
          sortable: true,
          searchable: true,
        },
        {
          field: "status",
          label: "Status",
        },
        {
          field: "pendencias",
          label: "Pendências enviadas",
        },

        {
          field: "cancelados",
          label: "Cancelados",
        },
        {
          field: "aceitou",
          label: "Fazer com MEDB?",
        },
        {
          field: "isento",
          label: "Isento?",
        },
        {
          field: "acoes",
          label: "Ação",
        },
      ],
      irpfList: [],
      showIrpfModal: false,
      selectedCliente: {},
    };
  },
  mounted() {
    this.fetchList();
    this.fetchCarteiras();
  },
  filters: {
    statusPendencias(val) {
      if (!val || !val.pendencias.required) {
        return "N/A";
      }
      if (val.pendencias.sent >= val.pendencias.required) {
        return "100%";
      }

      const porcentagem = (val.pendencias.sent * 100) / val.pendencias.required;

      return parseInt(porcentagem) + "%";
    },
    statusPendenciasTag(val) {
      if (!val || !val.pendencias.required) {
        return "is-default";
      }
      if (val.pendencias.sent >= val.pendencias.required) {
        return "is-success";
      }

      const porcentagem = (val.pendencias.sent * 100) / val.pendencias.required;
      if (parseInt(porcentagem) < 25) {
        return "is-danger";
      } else if (parseInt(porcentagem) < 50) {
        return "is-warning";
      } else if (parseInt(porcentagem) < 100) {
        return "is-primary";
      } else {
        return "is-default";
      }
    },
    stringStatus(val) {
      if (val == null || val.step === "questionario" && val.cancelado != 1 ) {
        return "Não respondido";
      } else if (val.step === "pendencia" && val.pendencias.sent === 0 && val.cancelado != 1 ) {
        return "Questionário respondido";
      } else if (val.step === "pendencia" && val.pendencias.sent > 0 && val.cancelado != 1 ) {
        return "Iniciou envio de pendências";
      } else if (val.step === "comprovante" && val.cancelado != 1 ) {
        return "Pendências enviadas";
      } else if (val.enviado) {
        return "Finalizado";
      }
    },
    stringStatusType(val) {
      if (val == null || val.step === "questionario") {
        return "is-default";
      } else if (val.step === "pendencia") {
        return "is-primary";
      } else if (val.step === "comprovante") {
        return "is-warning";
      } else if (val.enviado) {
        return "is-success";
      } else {
        return "is-default";
      }
    },
    aceitouIrpf(val) {
      return val ? val.aceitou === 1 : false;
    },
    canceladosIrpf(val) {
      return val ? val.cancelado === 1 : false;
    },
    irpfIsento(val) {
      return val ? val.isento === 1 : false;
    },
  },
  computed: {
    pendenciaStepClickable() {
      return (
        this.selectedCliente.irpf &&
        ["pendencia", "comprovante"].includes(this.selectedCliente.irpf.step)
      );
    },
    entregaStepClickable() {
      return (
        this.selectedCliente.irpf &&
        ["comprovante", "finalizado"].includes(this.selectedCliente.irpf.step)
      );
    },
    irpfListFiltered() {
      const { status_filter, carteira_filter } = this;
      const carteiraFilteredList = this.irpfList.filter((curr) => {
        if (carteira_filter === "todas") return true;
        if (carteira_filter === "sem_carteira")
          return !curr.carteiras || !curr.carteiras.length;

        return curr.carteiras.some(
          (carteira) => carteira.id === carteira_filter
        );
      });

      return carteiraFilteredList.filter((curr) => {
        if (status_filter === "todos") return true;
        if (status_filter === "nao_respondido")
          return !curr.irpf || curr.irpf.step === "questionario";
        if (status_filter === "questionario_respondido")
          return (
            curr.irpf &&
            curr.irpf.step === "pendencia" &&
            curr.irpf.pendencias.sent === 0
          );
        if (status_filter === "iniciou_pendencias")
          return (
            curr.irpf &&
            curr.irpf.step === "pendencia" &&
            curr.irpf.pendencias.sent > 0
          );
        if (status_filter === "pendencias_enviadas")
          return curr.irpf && curr.irpf.step === "comprovante";
        if (status_filter === "finalizado")
          return curr.irpf && curr.irpf.enviado;
        if (status_filter === "cancelado")
          return curr.irpf && curr.irpf.cancelado === 1;
      });
    },
    activeStep() {
      if (this.entregaStepClickable) {
        return 3;
      }
      if (this.pendenciaStepClickable) {
        return 2;
      }

      return 1;
    },
  },
  methods: {
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
    fetchList() {
      this.loading = true;
      irpfRequest({})
        .then((response) => (this.irpfList = response.data.data))
        .catch((error) => this.$snack.error(error.response.data.message))
        .finally(() => (this.loading = false));
    },
    openIrpfModal(cliente) {
      this.selectedCliente = cliente;
      this.showIrpfModal = true;
    },
    closeIrpfModal() {
      this.showIrpfModal = false;
    },
    onUpdateIrpf() {
      this.closeIrpfModal();
      this.fetchList();
    },
    async changeAceito(cliente) {
      const aceitou = cliente.irpf ? !cliente.irpf.aceitou : true;
      await changeIrpfToAceitoRequest({ aceitou }, cliente.id).then(
        (response) => {
          this.$snack.success(response.data.message);
        }
      );
    this.fetchList();
    },
    async changeCancelados(cliente) {
      const cancelou = cliente.irpf ? !cliente.irpf.cancelado : true;
      await changeIrpfToCanceladoRequest({ cancelou }, cliente.id).then(
        (response) => {
          this.$snack.success(response.data.message);
        }
      );
    
      this.fetchList();
      
    },
    changeIsento(cliente) {
      const isento = cliente.irpf ? !cliente.irpf.isento : true;
      changeIrpfToIsentoRequest({ isento }, cliente.id);
    },
    gerarRelatorio() {
      window.open(
        `${process.env.VUE_APP_API_URL}/relatorio-irpf/?token=${this.$store.getters.getToken}`,
        "_blank"
      );
    },
  },
};
</script>

<style scoped>
</style>
