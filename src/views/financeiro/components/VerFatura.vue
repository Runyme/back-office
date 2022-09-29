<template>
  <div class="p-8 bg-neutral-300">
    <Lynx-Title :text="title" />
    <div class="grid grid-cols-3 gap-16 pb-8">
      <div class="flex flex-col">
        <h3 class="text-2xl text-neutral-700 pb-2">Data de criação</h3>
        <span class="text-neutral-600 text-lg">{{
          currentFatura.created_at | vencimento
        }}</span>
      </div>

      <div class="flex flex-col">
        <h3 class="text-2xl text-neutral-700 pb-2 leading-tight">
          Data de Vencimento
        </h3>
        <span class="text-neutral-600 text-lg">{{
          currentFatura.data_vencimento | vencimento
        }}</span>
      </div>
      <div class="flex flex-col">
        <h3 class="text-2xl text-neutral-700 pb-2 leading-tight">
          Data de Pagamento
        </h3>
        <span class="text-neutral-600 text-lg">
          <span v-if="currentFatura.data_recebimento">{{
            currentFatura.data_recebimento | vencimento
          }}</span>
          <span v-else>N/A</span>
        </span>
      </div>
    </div>

    <div class="flex justify-between items-end">
      <div class="flex">
        <Lynx-Button
          class="mr-4"
          text="Cancelar"
          size="small"
          color="error-base"
          outlined="true"
          v-if="isCancelable"
          :loading="currentFatura.loadingCancelamento"
          @click.native="openMotivoCancelamentoModel(currentFatura)"
        />

        <Lynx-Button
          class="mr-4"
          text="Estornar"
          size="small"
          color="warning-base"
          outlined="true"
          v-if="isReversible"
          :loading="currentFatura.loadingEstorno"
          @click.native="estornarFatura(currentFatura)"
        />

        <a
          target="_blank"
          :href="currentFatura.fatura_url"
          class="
            border-info-base
            text-info-base
            shadow
            rounded
            font-display
            flex
            items-center
            border-2
            transition
            hover:shadow-xl
            justify-center
            mr-4
            px-2
            py-1
            text-sm
          "
          v-if="currentFatura.fatura_url"
        >
          Abrir
        </a>

        <b-button
          v-if="currentFatura.voucher && currentFatura.voucher.id"
          class="is-primary transition hover:shadow-lg"
          icon-right="attachment"
          @click="openFile(currentFatura.voucher.arquivo.id)"
        >
          {{ currentFatura.voucher.arquivo.nome }}
        </b-button>

        <b-field
          class="file mr-4"
          v-if="
            currentFatura.voucher !== null &&
            ['pendente', 'atrasado', 'estornado', 'expirado'].includes(
              currentFatura.status
            )
          "
        >
          <b-upload
            v-model="formVoucher"
            @input="handleUpload"
            :disabled="loadingUpload"
          >
            <a
              class="button is-primary transition hover:shadow-lg"
              :disabled="loadingUpload"
            >
              <b-icon v-if="!loadingUpload" icon="attachment"></b-icon>
              <b-icon v-else icon="refresh" class="spinner border-none">
              </b-icon>
              <span>Comprovante</span>
            </a>
          </b-upload>
          <span class="file-name" v-if="formVoucher">
            {{ formVoucher.name }}
          </span>
        </b-field>
      </div>
      <label
        v-show="currentFatura.status != 'pago'"
        class="flex flex-col w-3/3 pl-4"
      >
        <Lynx-Label label="Tipo de Status" />
        <b-select placeholder="Selecione um tipo" v-model="statusFatura">
          <option
            v-for="(option, key) in statusOptions"
            :value="option.value"
            :key="key"
            v-text="option.label"
          />
        </b-select>
      </label>
      <div
        class="
          bg-white
          text-primary-500 text-xl
          px-4
          py-2
          shadow
          transition
          hover:shadow-xl
          font-light font-display
          rounded
        "
      >
        <p>
          Valor:
          <span class="font-medium"
            >R${{ currentFatura.subtotal | money }}</span
          >
        </p>
      </div>
    </div>

    <div class="flex mt-4">
      <div>
        <span class="text-neutral-600">QrCode Pix</span>
        <b-tooltip
          label="Copiado"
          :active="copiado === currentFatura.pix_qrcode_text"
        >
          <button
            class="ml-2"
            @click="copyPixQrCode(currentFatura.pix_qrcode_text)"
          >
            <b-icon icon="content-copy" size="is-small"></b-icon>
          </button>
        </b-tooltip>
      </div>

      <div>
        <span class="text-neutral-600 ml-8">Link Fatura</span>
        <b-tooltip
          label="Copiado"
          :active="copiado === currentFatura.fatura_url"
        >
          <button class="ml-2" @click="copyFaturaUrl(currentFatura.fatura_url)">
            <b-icon icon="content-copy" size="is-small"></b-icon>
          </button>
        </b-tooltip>
      </div>
    </div>

    <b-modal :active.sync="motivoCancelamentoModel" width="600px">
      <div class="bg-neutral-300 p-8">
        <div class="modal-body" style="height: 150px">
          <Lynx-Title text="Motivo do Desativamento" />
          <b-select v-model="motivo_cancelamento_id">
            <option
              v-for="(item, index) in lista_fatura_motivo_cancelamento"
              :key="index"
              :value="item.id"
            >
              {{ item.nome }}
            </option>
          </b-select>
          <Lynx-Button
            :disabled="!motivo_cancelamento_id"
            class="mt-4"
            text="Cancelar"
            size="small"
            color="error-base"
            outlined="true"
            v-if="isCancelable"
            :loading="currentFatura.loadingCancelamento"
            @click.native="cancelarFatura()"
          />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { formatEnToBr } from "@/utils/momentHelpers";
import {
  cancelarFaturaRequest,
  estornarFaturaRequest,
  uploadVoucherRequest,
} from "../../../services/requests/faturas";
import { mapGetters } from "vuex";

export default {
  name: "VerFatura",
  props: {
    currentFatura: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loadingUpload: false,
      formVoucher: null,
      voucher: null,
      statusFatura: this.currentFatura.status,
      showTicketAttachContent: false,
      copiado: false,
      statusOptions: [
        {
          label: "Pendente",
          value: "pendente",
        },
        {
          label: "Atrasado",
          value: "atrasado",
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
      motivo_cancelamento_id: 0,
      motivoCancelamentoModel: false,
      byfatura: null,
    };
  },
  watch: {
    statusFatura(value) {
      // console.log(value);
      this.confirm(value);
    },
  },
  filters: {
    vencimento: (val) => formatEnToBr(val),
    money: (value) => {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
  },
  computed: {
    ...mapGetters(["getToken"]),
    title() {
      return `${this.currentFatura.payer_id} - ${this.currentFatura.payer_name}`;
    },
    isReversible() {
      return (
        this.currentFatura.forma_pagamento_id === 2 &&
        this.currentFatura.data_recebimento &&
        this.currentFatura.status === "pago"
      );
    },
    isCancelable() {
      return (
        !(
          this.currentFatura.status === "pago" ||
          this.currentFatura.data_recebimento
        ) && ["atrasado", "pendente"].includes(this.currentFatura.status)
      );
    },
    mensagem_alert() {
      return this.$store.state.financeiro.mensagem_alert;
    },
    lista_fatura_motivo_cancelamento() {
      return this.$store.state.financeiro.lista_fatura_motivo_cancelamento;
    },
  },
  methods: {
    copyPixQrCode(value) {
      if (!value)
        return this.$snack.error("Pix não disponível para esta fatura.");
      this.$copyText(value);
      this.copiado = value;
      setTimeout(() => (this.copiado = false), 1500);
    },
    copyFaturaUrl(value) {
      if (!value) return this.$snack.error("Link da fatura não disponível.");
      this.$copyText(value);
      this.copiado = value;
      setTimeout(() => (this.copiado = false), 1500);
    },
    openFile(fileId) {
      window.open(
        `${process.env.VUE_APP_API_URL}/arquivos/${fileId}/open?token=${this.getToken}`
      );
    },
    handleUpload() {
      this.loadingUpload = true;
      let file = new FormData();
      file.append("voucher", this.formVoucher);
      uploadVoucherRequest(this.currentFatura.id, file)
        .then((response) => {
          this.$snack.success(response.data.message);
          this.$emit("on-update-faturas");
        })
        .catch((error) => this.$snack.error(error.response.data.message))
        .finally(() => (this.loadingUpload = false));
    },
    async openMotivoCancelamentoModel(fatura) {
      this.loadingUpload = true;
      this.motivo_cancelamento_id = 0;
      await this.$store.dispatch(
        "financeiro/listar_fatura_motivo_cancelamento"
      );
      this.motivoCancelamentoModel = true;
      this.byfatura = fatura;
      this.loadingUpload = false;
    },
    async motivoCancelamento() {
      await this.$store.dispatch(
        "financeiro/set_fatura_motivo_cancelamento",
        {
          motivo_cancelamento_id: this.motivo_cancelamento_id,
          id: this.byfatura.id,
        }
      );

     await this.$emit("on-update-faturas");
          
      this.$snack.success(this.mensagem_alert.message.message);
      this.motivoCancelamentoModel = false
    },
    cancelarFatura() {
      this.$buefy.dialog.confirm({
        message: "Deseja realmente cancelar a fatura?",
        confirmText: "Sim",
        cancelText: "Sair",
        type: "is-danger",
        onConfirm: () => this.motivoCancelamento(),
      });
    },
    // onCancelarFatura(fatura) {
    //   fatura.loadingCancelamento = true;
    //   cancelarFaturaRequest(fatura.id)
    //     .then((response) => {
    //       this.$snack.success(response.data.message);
    //       this.$emit("on-update-faturas");
    //     })
    //     .catch((error) => this.$snack.error(error.response.data.message))
    //     .finally(() => (fatura.loadingCancelamento = false));
    // },
    estornarFatura(fatura) {
      this.$buefy.dialog.confirm({
        message: "Deseja realmente estornar a fatura?",
        confirmText: "Sim",
        cancelText: "Sair",
        type: "is-primary",
        onConfirm: () => this.onEstornarFatura(fatura),
      });
    },
    onEstornarFatura(fatura) {
      fatura.loadingEstorno = true;
      estornarFaturaRequest(fatura.id)
        .then((response) => {
          this.$snack.success(response.data.message);
          this.$emit("on-update-faturas");
        })
        .catch((error) => this.$snack.error(error.response.data.message))
        .finally(() => (fatura.loadingEstorno = false));
    },
    openFaturaUrl(url) {
      window.open(url, "_blank");
    },

    async confirm(tipo) {
      await this.$buefy.dialog.confirm({
        message:
          `Esta ação atualizara a fatura para o seguinte status : ` +
          tipo +
          ` tem certeza?`,
        confirmText: "Sim",
        cancelText: "Não",
        type: "is-success",
        onConfirm: () => {
          this.create(tipo);
        },
      });
    },
    async create(value) {
      var a = {
        status: value,
        id: this.currentFatura.id,
      };
      // console.log(a)
      this.loading = true;
      await this.$store
        .dispatch("financeiro/update_fatura_status", a)
        .then(() => {
          this.$snack.success(this.mensagem_alert.message);
        })
        .catch((error) => this.$snack.error(mensagem_alert.message))
        .finally(() => (this.loading = false));
      //   this.fireAlert({
      //     ...this.mensagem_alert,
      //     routeName: "produto",
      //   });
    },
  },
};
</script>
