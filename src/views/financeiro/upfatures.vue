<template>
  <div>
    <b-loading :active.sync="loading" />
    <div class="w-full flex justify-between items-center">
      <Lynx-Title text="Cadastro Empresa Faturamentos" />

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
      :data="lista_faturamentos"
      :per-page="perPage"
      :paginated="true"
      default-sort-direction="asc"
      default-sort="id"
      hoverables
      class="w-full rounded-t-none"
    >
      <template slot-scope="props">
        <b-table-column
          field="empresa"
          v-text="props.row.empresa.razao_social"
        />
        <b-table-column field="cnpj" v-text="props.row.empresa.cnpj" />
        <b-table-column field="faturamento" v-text="props.row.faturamento" />
        <b-table-column field="mes" v-text="props.row.mes" />

        <!-- 
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
        </b-table-column> -->
      </template>
      <template #empty>
        <Not-Found-Data text="Nenhum tipo para a pesquisa informada" />
      </template>
    </b-table>

    <b-modal :active.sync="FaturamentoCadasModal" width="600px" id="modal-tall">
      <div class="bg-neutral-300 p-8">
        <div class="modal-body" style="height: 150px">
          <Lynx-Title text="Fatumentos" />
          <b-field class="file">
            <b-upload v-model="file" @input="handleOnInput">
              <a class="button is-primary">
                <span v-text="text" />
                <b-icon icon="upload" v-if="!loading" />
                <Lynx-Spinner
                  class="ml-2"
                  color="neutral-100"
                  size="4"
                  v-else
                />
              </a>
            </b-upload>
            <span class="rounded w-full bg-white" v-if="file">
              {{ file.name }}
            </span>
          </b-field>
        </div>

        <div class="flex flex-col mt-5">
          <Lynx-Button
            :disabled="loading"
            text="upload"
            class="mb-8"
            icon="Reload"
            @click.native="confirm('cria')"
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
      file: null,
      text: "",
      currentPage: 1,
      perPage: 10,
      loading: false,
      lista_campos: [],
      FaturamentoCadasModal: false,
      cliente: null,
      columns: [
        {
          field: "empresa",
          label: "empresa",
          sortable: false,
        },
        {
          field: "cnpj",
          label: "cnpj",
          sortable: true,
        },
        {
          field: "faturamento",
          label: "faturamento",
          sortable: true,
        },
        {
          field: "mes",
          label: "mes",
          sortable: true,
        },
      ],
    };
  },
  computed: {
    lista_faturamentos() {
      return this.$store.state.financeiro.lista_faturamentos;
    },
    mensagem_alert() {
      return this.$store.state.financeiro.mensagem_alert;
    },
  },
  created() {
    this.listar_faturamentos();
  },
  methods: {
    async confirm(tipo) {
      await this.$buefy.dialog.confirm({
        message: `Esta ação  ` + tipo + ` um Tipo de Cobrança no sistema?`,
        confirmText: "Sim",
        cancelText: "Não",
        type: "is-success",
        onConfirm: () => {
          if (tipo == "cria") this.create();
          // if (tipo == "edita") this.update();
          // if (tipo == "delete") this.delete(value);
        },
      });
    },
    async create() {
      const formData = new FormData();
      formData.append("file", this.file);
      this.loading = true;
      await this.$store
        .dispatch("financeiro/create_up_fatures", formData)
        .then(() => {
          this.$snack.success(this.mensagem_alert.message);
        })
        .catch((error) => this.$snack.error(mensagem_alert.message))
        .finally(() => (this.loading = false));

      this.FaturamentoCadasModal = false;
      this.listar_faturamentos();

      //   this.fireAlert({
      //     ...this.mensagem_alert,
      //     routeName: "produto",
      //   });
    },

    async listar_faturamentos() {
      await this.$store
        .dispatch("financeiro/listar_faturamentos")
        .finally(() => {
          // this.$store.dispatch("configEmpresa/atualizar", "");
        });
    },

    cadastrar() {
      this.FaturamentoCadasModal = true;
    },
  },
};
</script>

<style scoped>
</style>
