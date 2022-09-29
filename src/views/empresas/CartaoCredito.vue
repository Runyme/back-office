<template>
  <div>
    <b-loading :active.sync="loading" />
    <div class="w-full flex justify-between items-center">
      <Lynx-Title text="Cadastro Cartão Credito" />

      <Lynx-Button
        text="Cadastrar"
        class="mb-8"
        icon-size="3"
        size="small"
        @click.native="cadastrar()"
      />

      <Lynx-Button
        text="Relatorio Cartão Credito"
        class="mb-4"
        @click.native="gerarRelatorio()"
        size="small"
        icon-size="3"
      />
    </div>

    <b-table
      :columns="columns"
      :data="lista_cartao_credito"
      :per-page="perPage"
      :paginated="true"
      default-sort-direction="asc"
      default-sort="id"
      hoverables
      class="w-full rounded-t-none"
    >
      <template slot-scope="props">
        <b-table-column field="empresa_id" v-text="props.row.empresa_id" />
        <b-table-column field="numero" v-text="props.row.numero" />
        <b-table-column field="cvv" v-text="props.row.cvc" />
        <b-table-column field="ano" v-text="props.row.ano" />
        <b-table-column field="mes" v-text="props.row.mes" />
        <b-table-column field="dono cartao" v-text="props.row.dono_cartao" />

        <b-table-column field="acoes">
          <div class="flex text-sm">
            <div class="flex text-sm items-center">
              <a
                href="#"
                class="mr-4 bg-primary-600 rounded-full p-2"
                @click.prevent="atualizar(props.row)"
              >
                <Icon-Edit class="text-neutral-100" size="4" />
              </a>
              <a
                href="#"
                class="bg-error-base rounded-full p-2"
                @click.prevent="confirmDelete(props.row)"
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

    <b-modal :active.sync="CreditoCadasModal" width="650px" id="modal-tall">
      <div class="bg-neutral-300 p-8">
        <div class="modal-body" style="height: 300px">
          <div class="w-full flex flex-wrap">
            <label class="flex flex-col w-1/4 pl-2 pb-6">
              <Lynx-Label label="Empresa" />
              <Lynx-Input
                :disabled="lista_campos.id"
                placeholder="Insira o Id da empresa"
                v-model="form.empresa_id"
                class="my-2"
              />
            </label>
            <label class="flex flex-col w-1/4 pl-2 pb-6">
              <Lynx-Label label="Ano" />
              <Lynx-Input
                placeholder=" Ano do Cartao"
                v-model="form.ano"
                class="my-2"
              />
            </label>
            <label class="flex flex-col w-1/4 pl-2 pb-6">
              <Lynx-Label label="Mes" />
              <Lynx-Input
                placeholder="Mes do Cartao"
                v-model="form.mes"
                class="my-2"
              />
            </label>
            <label class="flex flex-col w-1/4 pl-2 pb-6">
              <Lynx-Label label="Numero" />
              <Lynx-Input
                placeholder="Numero do Cartão"
                v-model="form.numero"
                class="w-full my-2"
              />
            </label>
            <label class="flex flex-col w-3/4 pl-2 pb-6">
              <Lynx-Label label="Nome No Cartão" />
              <Lynx-Input
                placeholder="Insira o Nome do Dono Presente no Cartão "
                v-model="form.dono_cartao"
                class="w-full my-2"
              />
            </label>
            <label class="flex flex-col w-1/4 pl-2 pb-6">
              <Lynx-Label label="cvc" />
              <Lynx-Input
                placeholder="CVC do Cartao"
                v-model="form.cvc"
                class="w-full my-2"
              />
            </label>
          </div>
        </div>

        <div class="flex flex-col mt-5">
          <Lynx-Button
            :disabled="lista_campos.status == ''"
            :text="!lista_campos.id ? 'cria' : 'edita'"
            class="mb-8"
            icon="Reload"
            @click.native="confirm(!lista_campos.id ? 'cria' : 'edita')"
            size="small"
            icon-size="3"
          />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
// import Card from "@/components/helpers/Card";
// import Template from "../../components/icons/Template.vue";

export default {
  name: "index",
  data() {
    return {
      form: {
        empresa_id: null,
        numero: null,
        cvc: null,
        ano: null,
        mes: null,
        dono_cartao: null,
      },
      currentPage: 1,
      perPage: 10,
      loading: false,
      lista_campos: [],
      CreditoCadasModal: false,
      cliente: null,
      columns: [
        {
          field: "empresa_id",
          label: "empresa_id",
          searchable: true,
          sortable: true,
        },
        {
          field: "numero",
          label: "numero",
          sortable: true,
        },
        {
          field: "cvc",
          label: "cvc",
          sortable: true,
        },
        {
          field: "ano",
          label: "ano",
          sortable: true,
        },
        {
          field: "mes",
          label: "mes",
          sortable: true,
        },
        {
          field: "dono_cartao",
          label: "dono_cartao",
          searchable: true,
          sortable: true,
        },
      ],
    };
  },
  computed: {
    lista_cartao_credito() {
      return this.$store.state.configEmpresa.lista_cartao_credito;
    },
    mensagem_alert() {
      return this.$store.state.configEmpresa.mensagem_alert;
    },
  },
  created() {
    this.listar_cartao_credito();
  },
  methods: {
    async confirm(tipo) {
      await this.$buefy.dialog.confirm({
        message: `Esta ação  ` + tipo + ` um Cartao credito no sistema?`,
        confirmText: "Sim",
        cancelText: "Não",
        type: "is-success",
        onConfirm: () => {
          if (tipo == "cria") this.create();
          if (tipo == "edita") this.update();
        },
      });
    },
    async confirmDelete(item) {
      await this.$buefy.dialog.confirm({
        message: `Esta ação deleta um Cartao credito no sistema?`,
        confirmText: "Sim",
        cancelText: "Não",
        type: "is-success",
        onConfirm: () => {
          this.deletar(item);
        },
      });
    },
    async create() {
      this.loading = true;
      await this.$store
        .dispatch("configEmpresa/create_cartao_credito", this.form)
        .then(() => {
          this.$snack.success(this.mensagem_alert.message);
        })
        .catch((error) => this.$snack.error(mensagem_alert.message))
        .finally(() => (this.loading = false));
      this.CreditoCadasModal;

      this.form = {
        empresa_id: null,
        numero: null,
        cvc: null,
        ano: null,
        mes: null,
      };
      //   this.fireAlert({
      //     ...this.mensagem_alert,
      //     routeName: "produto",
      //   });
    },
    async update() {
      await this.$store
        .dispatch("configEmpresa/update_cartao_credito", this.form)

        .then(() => {
          this.$snack.success(this.mensagem_alert.message);
        })
        .catch((error) => this.$snack.error(mensagem_alert.message))
        .finally(() => (this.loading = false));
      this.CreditoCadasModal = false;

      //   this.fireAlert({
      //     ...this.mensagem_alert,
      //     routeName: "produto",
      //   });
    },

    async deletar(value) {
      await this.$store
        .dispatch("configEmpresa/delete_cartao_credito", value)
        .then(() => {
          this.$snack.success(this.mensagem_alert.message);
        })
        .catch((error) => this.$snack.error(mensagem_alert.message))
        .finally(() => (this.loading = false));
      this.CreditoCadasModal = false;
    },

    async listar_cartao_credito() {
      await this.$store
        .dispatch("configEmpresa/listar_cartao_credito")
        .finally(() => {
          this.$store.dispatch("configEmpresa/atualizar", "");
        });
    },

    cadastrar() {
      this.atualizar("");

      this.CreditoCadasModal = true;
    },
    atualizar(value) {
      this.lista_campos = value;
      this.form.id = value.id;
      this.form.empresa_id = value.empresa_id;
      this.form.mes = value.mes;
      this.form.ano = value.ano;
      this.form.dono_cartao = value.dono_cartao;
      this.form.cvc = value.cvc;
      this.form.numero = value.numero;
      this.CreditoCadasModal = true;
    },
    gerarRelatorio() {
      window.open(
        `${process.env.VUE_APP_API_URL}/cartaoCredito/relatorio/?token=${this.$store.getters.getToken}`,
        "_blank"
      );
    },
  },
};
</script>

<style scoped>
</style>
