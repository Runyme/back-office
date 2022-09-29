<template>
  <div>
    <b-loading :active.sync="loading" />
    <div class="w-full flex justify-between items-center">
      <Lynx-Title text="Gerenciamento de Faturas" />
      <Lynx-Button
        text="Filtros"
        class="mb-8"
        icon="Search"
        icon-size="3"
        size="small"
        @click.native="openFiltroModal"
      />

      <Lynx-Button
        text="Atualizar Faturas"
        class="mb-8"
        icon="Reload"
        @click.native="fetchFaturas"
        size="small"
        icon-size="3"
      />
    </div>
    <div class="w-full flex justify-between items-end pb-8">
      <div class="flex flex-col">
        <Lynx-Label label="Status" />
        <b-select
          placeholder="Selecione um status"
          v-model="statusFatura"
          @input="fetchFaturas"
        >
          <option
            v-for="(option, key) in statusOptions"
            :value="option.value"
            :key="key"
            v-text="option.label"
          />
        </b-select>
      </div>
      <div class="flex flex-col">
        <Lynx-Label label="Filtrar por Data" />
        <b-datepicker
          placeholder="Selecione uma data"
          icon="calendar-today"
          :month-names="monthNames"
          @input="fetchFaturas"
          v-model="dates"
          range
        />
      </div>
      <div class="flex flex-col">
        <Lynx-Label label="Pesquisar" />
        <b-input placeholder="Pesquise algo" v-model="search" />
      </div>
      <Lynx-Button
        text="Criar Fatura"
        icon="Plus"
        icon-size="4"
        size="small"
        @click.native="openNovaFaturaModal"
      />
      <Lynx-Button
        color="neutral-800"
        text="Relatorio Fatura"
        icon="Search"
        icon-size="4"
        size="small"
        @click.native="gerarRelatorio"
      />
    </div>
    <div v-if="hasRole('super-admin')" class="grid grid-cols-4 gap-8 mb-8">
      <Card
      
        v-for="(item, key) in resumo"
        :key="key"
        :color="getResumoStatusColor(key)"
      >
        <div class="bg-white py-6 w-full flex flex-col items-center">
          <p
            class="font-bold text-xl font-display"
            :class="[`text-${getResumoStatusColor(key)}`]"
          >
            R$ {{ item.valor | money }}
          </p>
          <p class="tile-descricao">{{ item.quantidade }} {{ key }}</p>
        </div>
      </Card>
    </div>

    <b-table
      :data="faturas"
      :columns="columns"
      :paginated="true"
      default-sort-direction="asc"
      default-sort="id"
      per-page="10"
      hoverables
      class="w-full rounded-t-none"
    >
      <template slot-scope="props">
        <b-table-column class="max-w-xs truncate" field="payer_type">
          <Icon-User v-if="props.row.payer_type === 'cliente'" />
          <Icon-Company v-if="props.row.payer_type === 'empresa'" />
        </b-table-column>
        <b-table-column
          class="max-w-xs truncate"
          field="payer_name"
          v-text="`${props.row.payer_id} - ${props.row.payer_name}`"
        />
        <b-table-column
          field="forma_pagamento_id"
          v-text="props.row.forma_pagamento"
        />
        <b-table-column field="subtotal">
          R${{ props.row.subtotal | money }}
        </b-table-column>
        <b-table-column field="data_competencia">
          {{ props.row.data_competencia | competencia }}
        </b-table-column>
        <b-table-column field="data_vencimento">
          {{ props.row.data_vencimento | vencimento }}
        </b-table-column>
        <b-table-column field="status">
          <b-tag :type="props.row | statusType">{{ props.row.status }}</b-tag>
        </b-table-column>
        <b-table-column field="acoes">
          <div class="flex text-sm">
            <div class="flex text-sm items-center">
              <a
                href="#"
                class="mr-4 bg-primary-600 rounded-full p-2"
                @click.prevent="openFaturaModal(props.row)"
              >
                <Icon-Eye class="text-neutral-100" size="4" />
              </a>
                <a
                href="#"
                class="mr-4 bg-primary-600 rounded-full p-2"
                @click.prevent="openAtualizarFaturaModal(props.row)"
              >
                <Icon-Edit class="text-neutral-100" size="4" />
              </a>

              <a
                href="#"
                class="mr-4 bg-primary-600 rounded-full p-2"
                @click.prevent="handleSendInvoice(props.row)"
              >
                <Icon-Mail class="text-neutral-100" size="4" />
              </a>

              <a
                href="#"
                class="bg-error-base rounded-full p-2"
                @click.prevent="handleDeleteInvoice(props)"
                v-if="canCancel(props.row)"
              >
                <Icon-Trash class="text-neutral-100" size="4" />
              </a>
            </div>
          </div>
        </b-table-column>
      </template>
      <template #empty>
        <Not-Found-Data text="Nenhuma fatura para a pesquisa informada" />
      </template>
    </b-table>
    <b-modal
      v-if="verFaturaModal"
      :active.sync="verFaturaModal"
      @close="closeVerFaturaModal"
      width="700px"
    >
      <Ver-Fatura
        :current-fatura="currentFatura"
        @on-update-faturas="handleUpdateFaturas"
      />
    </b-modal>
    <b-modal :active.sync="novaFaturaModal" width="600px">
      <CreateFatura :current-fatura="''" @on-update-faturas="handleUpdateFaturas" />
    </b-modal>
        <b-modal :active.sync="AtualizarFaturaModal" width="600px">
      <CreateFatura :current-fatura="currentFatura"  @on-update-faturas="handleUpdateFaturas" />
    </b-modal>
    <b-modal :active.sync="filtroModal" width="500px" id="modal-tall">
      <div class="bg-neutral-300 p-8">
        <div class="modal-body" style="height: 400px">
          <Lynx-Title text="Filtro Faturas" />
          <div class="flex flex-col pb-2">
            <label class="flex flex-col w-3/3 pl-4">
              <div class="flex pb-8">
                <treeselect
                  :multiple="true"
                  :options="lista_carteiras"
                  placeholder="Selecione as carteiras..."
                  v-model="carteira"
                />
              </div>
            </label>
            <label class="flex flex-col w-3/3 pl-4">
              <Lynx-Label label="Tipo de cobrança" />
              <b-select placeholder="Selecione um tipo" v-model="tipoCobranca">
                <option
                  v-for="(option, key) in lista_tipo_cobrancas"
                  :value="option.nome"
                  :key="key"
                  v-text="option.nome"
                />
              </b-select>
            </label>
          </div>
        </div>
        
        <div class="flex flex-col w-3/3 pl-4">
          <Lynx-Button
            text="Atualizar Faturas"
            class="mb-8"
            icon="Reload"
            @click.native="fetchFaturas"
            size="small"
            icon-size="3"
          />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  deleteFaturaRequest,
  faturasRequest,
} from "@/services/requests/faturas";
import {
  formatEnToBr,
  formatBrToEn,
  momentIntance,
} from "@/utils/momentHelpers";
import { monthNames } from "@/utils/utils";
import NotFoundData from "@/components/layouts/NotFoundData";
import CreateFatura from "@/views/financeiro/components/CreateFatura";
import VerFatura from "@/views/financeiro/components/VerFatura";
import Card from "@/components/helpers/Card";
import {hasRole} from '@/utils/can';
import {
  getVoucherRequest,
  sendInvoiceRequest,
} from "../../services/requests/faturas";
// import the component
import Treeselect from "@riophae/vue-treeselect";
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "GerenciamentoGuias",
  components: {
    NotFoundData,
    CreateFatura,
    VerFatura,
    Card,
    Treeselect,
  },
  data: () => ({
    monthNames,
    dates: [],
    loading: false,
    statusOptions: [
      {
        label: "todos",
      },
      {
        label: "Pendente",
        value: "pendente",
      },
      {
        label: "Atrasado",
        value: "atrasado",
      },
      {
        label: "Cancelado",
        value: "cancelado",
      },
      {
        label: "Pago",
        value: "pago",
      },
      {
        label: "Expirado",
        value: "expirado",
      },
      {
        label: "Estornado",
        value: "estornado",
      },
      {
        label: "Serasa",
        value: "serasa",
      },
      {
        label: "Sem contato",
        value: "semcontato",
      },
      {
        label: "Em Negociação",
        value: "emnegociacao",
      },
    ],
    columns: [
      // {
      //   field: 'id',
      //   label: 'Nº fatura',
      //   sortable: true,
      // },
      {
        // tipo de pessoa
      },
      {
        field: "payer_name",
        label: "Pagador",
        sortable: true,
      },
      {
        field: "forma_pagamento_id",
        label: "Forma Pag.",
        sortable: true,
      },
      {
        field: "subtotal",
        label: "Valor",
      },
      {
        field: "data_competencia",
        label: "Competência",
      },
      {
        field: "data_vencimento",
        label: "Vencimento",
      },
      {
        field: "status",
        label: "Status",
      },
      {
        field: "acoes",
        label: "Ações",
      },
    ],
    statusFatura: null,
    search: null,
    faturasArray: [],
    resumo: [],
    currentFatura: null,
    verFaturaModal: false,
    novaFaturaModal: false,
    AtualizarFaturaModal: false,
    filtroModal: false,
    carteira: null,
    carteiras: [],
    tipoCobranca: "",
    tipoCobrancaOptions: [
       {
        label: "",
        value: "",
      },
      {
        label: "Honorário",
        value: "honorario",
      },
      {
        label: "Cobrança Avulsa",
        value: "avulso",
      },
      {
        label: "Alteração Contratual",
        value: "alteracao contratual",
      },
      {
        label: "Baixa",
        value: "baixa",
      },
      {
        label: "Congelamento",
        value: "congelamento",
      },
    ],
  }),

  computed: {
    ...mapGetters(["getCompetenciaDate"]),
    faturas() {
      if (!this.faturasArray || !this.search) {
        return this.faturasArray;
      }
      return this.faturasArray.filter((data) => {
        let serializedFields = JSON.stringify({
          payer_id: data.payer_id,
          payer_name: data.payer_name,
        });
        return (
          serializedFields.toLowerCase().indexOf(this.search.toLowerCase()) !==
          -1
        );
      });
    },

    lista_carteiras() {
      //  return this.$store.state.carteira.lista_carteiras;

      let carteira = Object.values(this.$store.state.carteira.lista_carteiras);
      let data = [];
      for (let i = 0; i < carteira.length; i++) {
        data.push({ id: carteira[i].id, label: carteira[i].nome });
      }
      return data;
    },
       lista_tipo_cobrancas() {
      return this.$store.state.financeiro.lista_tipo_cobrancas;
    },
  },

  filters: {
    money: (value) => {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    competencia: (val) => {
      return momentIntance(Date.parse(val)).add(1,'H').format("YYYY-MM-DD");
    },
    vencimento: (val) => formatEnToBr(val),
    liberado: (val) => (val && val.length > 0 ? val[0].liberado : false),
    statusType: (val) => {
      if (val.status === "pago") {
        return "is-success";
      }
      if (val.status === "estornado" || val.status === "cancelado") {
        return "is-dark";
      }
      if (val.status === "atrasado") {
        return "is-danger";
      }
      if (val.status === "seraza") {
        return "is-warning";
      }
      if (val.status === "expirado") {
        return "is-warning";
      }
      return "default";
    },
  },

  mounted() {
    this.fetchFaturas();
  },
  methods: {
    
    handleDeleteInvoice(props) {
      if (!confirm("Tem certeza que quer excluir este registro?")) return false;
      this.loading = true;
      deleteFaturaRequest(props.row.id)
        .then((response) => {
          this.$snack.success(response.data.message);
          this.faturasArray.splice(props.index, 1);
        })
        .catch((error) => this.$snack.error(error.response.data.message))
        .finally(() => (this.loading = false));
    },
       hasRole,
    canCancel(row) {
      return (
        (["atrasado", "processando"].includes(row.status) &&
          momentIntance().subtract(14, "days").isAfter(row.data_vencimento)) ||
        ["expirado"].includes(row.status)
      );
    },
    fetchFaturas() {
      this.filtroModal = false;
      this.loading = true;
      let params = this.resolveDates();
      params.status = this.statusFatura
      params.carteira = this.carteira
       params.tipoCobranca = this.tipoCobranca
      faturasRequest(params)
        .then((res) => {
          this.faturasArray = res.data.data;
          this.resumo = res.data.resumo;
        })
        .catch(() =>
          this.$snack.error("Ocorreu um erro, tente novamente mais tarde")
        )
        .finally(() => (this.loading = false));
    },
    async gerarRelatorio() {
      this.loading = true;
      let params = this.resolveDates();
      params.status = this.statusFatura
      params.carteira = this.carteira
      params.tipoCobranca = this.tipoCobranca
      await this.$store.dispatch(
        "finanRelatorio/gerarRelatorioFaturas",
        params
      );
      this.loading = false;
    },
    resolveDates() {
      if (this.dates.length) {
        let from = new Date(Date.parse(this.dates[0])).toLocaleDateString();
        let to = new Date(Date.parse(this.dates[1])).toLocaleDateString();
        return {
          from: formatBrToEn(from),
          to: formatBrToEn(to),
        };
      }

      let from = momentIntance(Date.parse(this.getCompetenciaDate))
        .add(2, "M")
     .set("date",2)
       

        .format("YYYY-MM-DD");
      let to = momentIntance(new Date).add(1, "M").set('date',1).format("YYYY-MM-DD");
      this.dates = [new Date(from), new Date(to)];
      return { from, to };
    },
    openFiltroModal() {
      this.listar_carteiras();
      this.filtroModal = true;
    },
    closeFiltroModal() {
      this.filtroModal = false;
    },
    async openFaturaModal(fatura) {
      this.loading = true;
      this.currentFatura = fatura;
      await this.fetchVoucher();
      this.verFaturaModal = true;
      this.loading = false;
    },
    openNovaFaturaModal() {
      this.novaFaturaModal = true;
    },
      openAtualizarFaturaModal(fatura) {
              this.currentFatura = fatura;
      this.AtualizarFaturaModal = true;
    },
      closeAtualizarFaturaModal() {
              
      this.AtualizarFaturaModal = false;
    },

    closeNovaFaturaModal() {
      this.novaFaturaModal = false;
    },
    closeVerFaturaModal() {
      this.currentFatura = null;
      this.verFaturaModal = false;
    },
    handleUpdateFaturas() {
      this.closeNovaFaturaModal();
      this.closeVerFaturaModal();
      this.closeAtualizarFaturaModal();

      this.fetchFaturas();
    },
    getResumoStatusColor(status) {
      if (status === "atrasado") return "error-base";
      if (status === "pendente") return "warning-base";
      if (status === "pago") return "success-base";
      if (status === "total") return "info-base";
    },
    handleSendInvoice(invoice) {
      this.$buefy.dialog.confirm({
        title: "Enviar Boleto",
        message: "Tem certeza que deseja enviar este boleto por email agora?",
        confirmText: "Enviar",
        cancelText: "Cancelar",
        type: "is-primary",
        hasIcon: true,
        onConfirm: () => this.sendInvoice(invoice),
      });
    },
    sendInvoice(invoice) {
      this.loading = true;
      let data = {
        payer_type: invoice.payer_type,
        payer_id: invoice.payer_id,
        email: null,
        invoices: [invoice.id],
      };
      sendInvoiceRequest(data)
        .then((response) => this.$snack.success(response.data.message))
        .catch((error) => this.$snack.error(error.response.data.message))
        .finally(() => (this.loading = false));
    },
    async fetchVoucher() {
      await getVoucherRequest(this.currentFatura.id).then((response) => {
        this.currentFatura.voucher = response.data;
      });
    },

    listar_carteiras() {
      this.$store.dispatch("carteira/listar_carteiras");
    },
        async listar_tipo_cobrancas() {
      await this.$store
        .dispatch("financeiro/listar_tipo_cobrancas")
        .finally(() => {
          this.$store.dispatch("configEmpresa/atualizar", "");
        });
    },
  },
};
</script>

