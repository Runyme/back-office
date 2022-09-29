<template>
  <div>
    <b-loading :active.sync="loading" />
    <div class="w-full flex justify-between items-center">
      <Lynx-Title text="Cadastro Fatura Motivo Cancelamento " />

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
      :data="lista_fatura_motivo_cancelamento"
      :per-page="perPage"
      :paginated="true"
      default-sort-direction="asc"
      default-sort="id"
      hoverables
      class="w-full rounded-t-none"
    >
      <template slot-scope="props">
        <b-table-column field="empresa" v-text="props.row.nome" />
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
      :active.sync="FaturaMotivoCancelamentoCadasModal"
      width="600px"
      id="modal-tall"
    >
      <div class="bg-neutral-300 p-8">
        <div class="modal-body" style="height: 280px">
          <Lynx-Title text="Motivo Cancelamento Fatura" />

          <!-- <Lynx-Label label="Nome da Cobrança" /> -->
          <Lynx-Input v-show="false" v-model="form.id" class="w-full my-2" />
          <Lynx-Label label="Nome" />
          <Lynx-Input
            v-show="!lista_campos.token"
            placeholder="Insira o nome da motivo"
            v-model="form.nome"
            class="w-full my-2"
          />
      
      
          <Lynx-Label label="Descrição" />
          <Lynx-Input
            placeholder="Insira a descrição"
            v-model="form.descricao"
            class="w-full my-2"
          />
        </div>

        <div class="flex flex-col ">
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

      },
      currentPage: 1,
      perPage: 10,
      loading: false,
      lista_campos: [],
      FaturaMotivoCancelamentoCadasModal: false,
      cliente: null,
      columns: [
        {
          field: "nome",
          label: "nome",
          sortable: false,
        },
        {
          field: "nome",
          label: "nome",
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
    lista_fatura_motivo_cancelamento() {
      return this.$store.state.financeiro.lista_fatura_motivo_cancelamento;
    },
    mensagem_alert() {
      return this.$store.state.financeiro.mensagem_alert;
    },
  },
  created() {
    this.listar_fatura_motivo_cancelamento();
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
        .dispatch("financeiro/create_fatura_motivo_cancelamento", this.form)
        .then(() => {
          this.$snack.success(this.mensagem_alert.message);
        })
        .catch((error) => this.$snack.error(mensagem_alert.message))
        .finally(() => (this.loading = false));

      this.FaturaMotivoCancelamentoCadasModal = false;
      this.listar_fatura_motivo_cancelamento();

      //   this.fireAlert({
      //     ...this.mensagem_alert,
      //     routeName: "produto",
      //   });
    },
    async update() {
      await this.$store
        .dispatch("financeiro/update_fatura_motivo_cancelamento", this.form)

        .then(() => {
          this.$snack.success(this.mensagem_alert.message);
        })
        .catch((error) => this.$snack.error(mensagem_alert.message))
        .finally(() => (this.loading = false));

      this.FaturaMotivoCancelamentoCadasModal = false;
      this.listar_fatura_motivo_cancelamento();
    },
    async delete(value) {
      await this.$store
        .dispatch("financeiro/delete_fatura_motivo_cancelamento", value)

        .then(() => {
          this.$snack.success(this.mensagem_alert.message);
        })
        .catch((error) => this.$snack.error(mensagem_alert.message))
        .finally(() => (this.loading = false));

      this.FaturaMotivoCancelamentoCadasModal = false;
      this.listar_fatura_motivo_cancelamento();
    },

    async listar_fatura_motivo_cancelamento() {
      await this.$store
        .dispatch("financeiro/listar_fatura_motivo_cancelamento")
        .finally(() => {
          this.$store.dispatch("configEmpresa/atualizar", "");
        });
    },

    cadastrar() {
      this.atualizar("");

      this.FaturaMotivoCancelamentoCadasModal = true;
    },
    atualizar(value) {
      this.lista_campos = value;
      this.form.id = value.id;

      this.form.nome = value.nome;
  
      this.form.descricao = value.descricao;
      this.FaturaMotivoCancelamentoCadasModal = true;
    },
  },
};
</script>

<style scoped>
</style>
