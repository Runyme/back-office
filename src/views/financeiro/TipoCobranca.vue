<template>
  <div>
    <b-loading :active.sync="loading" />
    <div class="w-full flex justify-between items-center">
      <Lynx-Title text="Cadastro Tipo Cobrança" />

      <Lynx-Button
        text="Cadastrar"
        class="mb-8"
        icon-size="3"
        size="small"
        @click.native="cadastrar()"
      />
    </div>

    <b-table
      :columns="columns"
      :data="lista_tipo_cobrancas"
      :per-page="perPage"
      :paginated="true"
      default-sort-direction="asc"
      default-sort="id"
      hoverables
      class="w-full rounded-t-none"
    >
      <template slot-scope="props">
        <b-table-column field="empresa" v-text="props.row.nome" />
        <b-table-column field="cliente" v-text="props.row.valor" />
        <b-table-column field="cnpj" v-text="props.row.descricao" />

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
                class="mr-4 bg-error-base rounded-full p-2"
                @click.prevent="confirm('delete',props.row)"
              >
                <Icon-Cross class="text-neutral-100" size="4" />
              </a>
            </div>
          </div>
        </b-table-column>
      </template>
      <template #empty>
        <Not-Found-Data text="Nenhum tipo para a pesquisa informada" />
      </template>
    </b-table>

    <b-modal
      :active.sync="TipoCobrancaCadasModal"
      width="600px"
      id="modal-tall"
    >
      <div class="bg-neutral-300 p-8">
        <div class="modal-body" style="height: 310px">
          <Lynx-Title text="Tipo Cobrança" />

          <!-- <Lynx-Label label="Nome da Cobrança" /> -->
          <Lynx-Input v-show="false" v-model="form.id" class="w-full my-2" />
          <Lynx-Label label="Nome" />
          <Lynx-Input
            v-show="!lista_campos.token"
            placeholder="Insira o nome da Cobrança"
            v-model="form.nome"
            class="w-full my-2"
          />
          <Lynx-Label label="Valor" />
          <Lynx-Input
            placeholder="Insira o valor"
            v-model="form.valor"
            class="w-full my-2"
          />
          <Lynx-Label label="Descrição" />
          <Lynx-Input
            placeholder="Insira a descrição"
            v-model="form.descricao"
            class="w-full my-2"
          />
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
        nome: "",
        descricao: "",
        valor: 0,
      },
      currentPage: 1,
      perPage: 10,
      loading: false,
      lista_campos: [],
      TipoCobrancaCadasModal: false,
      cliente: null,
      columns: [
        {
          field: "nome",
          label: "nome",
          sortable: false,
        },
        {
          field: "valores",
          label: "valores",
          sortable: true,
        },
        {
          field: "descricao",
          label: "descricao",
          sortable: true,
        },
      ],
    };
  },
  computed: {
    lista_tipo_cobrancas() {
      return this.$store.state.financeiro.lista_tipo_cobrancas;
    },
    mensagem_alert() {
      return this.$store.state.financeiro.mensagem_alert;
    },
  },
  created() {
    this.listar_tipo_cobrancas();
  },
  methods: {
  
    async confirm(tipo,value) {
      await this.$buefy.dialog.confirm({
        message: `Esta ação  ` + tipo + ` um Tipo de Cobrança no sistema?`,
        confirmText: "Sim",
        cancelText: "Não",
        type: "is-success",
        onConfirm: () => {
          if (tipo == "cria") this.create();
          if (tipo == "edita") this.update();
          if (tipo == "delete") this.delete(value);
        },
      });
    },
    async create() {
      this.loading = true;
      await this.$store
        .dispatch("financeiro/create_tipo_cobranca", this.form)
        .then(() => {
          this.$snack.success(this.mensagem_alert.message);
        })
        .catch((error) => this.$snack.error(mensagem_alert.message))
        .finally(() => (this.loading = false));

      this.TipoCobrancaCadasModal = false;
      this.listar_tipo_cobrancas();

      //   this.fireAlert({
      //     ...this.mensagem_alert,
      //     routeName: "produto",
      //   });
    },
    async update() {
      await this.$store
        .dispatch("financeiro/update_tipo_conbranca", this.form)

        .then(() => {
          this.$snack.success(this.mensagem_alert.message);
        })
        .catch((error) => this.$snack.error(mensagem_alert.message))
        .finally(() => (this.loading = false));

      this.TipoCobrancaCadasModal = false;
      this.listar_tipo_cobrancas();
    },
    async delete(value) {
      await this.$store
        .dispatch("financeiro/delete_tipo_conbranca", value)

        .then(() => {
          this.$snack.success(this.mensagem_alert.message);
        })
        .catch((error) => this.$snack.error(mensagem_alert.message))
        .finally(() => (this.loading = false));

      this.TipoCobrancaCadasModal = false;
      this.listar_tipo_cobrancas();
    },

    async listar_tipo_cobrancas() {
      await this.$store
        .dispatch("financeiro/listar_tipo_cobrancas")
        .finally(() => {
          this.$store.dispatch("configEmpresa/atualizar", "");
        });
    },

    cadastrar() {
      this.atualizar("");

      this.TipoCobrancaCadasModal = true;
    },
    atualizar(value) {
      this.lista_campos = value;
      this.form.id = value.id;

      this.form.nome = value.nome;
      this.form.valor = value.valor;
      this.form.descricao = value.descricao;
      this.TipoCobrancaCadasModal = true;
    },
  },
};
</script>

<style scoped>
</style>
