<template>
  <div>
    <b-loading :active.sync="loading" />
    <div class="w-full flex justify-between items-center">
      <Lynx-Title text="Cadastro Atividades" />

      <Lynx-Button
        text="Cadastrar"
        class="mb-8"
        icon-size="3"
        size="small"
        @click.native="cadastrar()"
      />
    </div>
    <!-- <div class="w-full flex justify-between items-center"> -->
    <!-- <label class="flex flex-col w-1/2 pb-6 pr-3"> -->
    <!-- <Lynx-Label label="Carteiras" /> -->
    <!-- 
        <treeselect
          :multiple="false"
          :options="lista_carteiras"
          placeholder="Selecione as carteiras..."
          v-model="carteira"
        />
      </label>
      <label class="flex flex-col w-1/5 pb-6 pt-4">
        <Lynx-Button
          text="Relatorio Clientes Atividades"
          class="mb-4"
          @click.native="gerarRelatorio()"
          size="small"
          icon-size="3"
        />
      </label>
    </div> -->

    <b-table
      :columns="columns"
      :data="lista_atividades"
      :per-page="perPage"
      :paginated="true"
      default-sort-direction="asc"
      default-sort="id"
      hoverables
      class="w-full rounded-t-none"
    >
      <template slot-scope="props">
        <b-table-column field="nome" v-text="props.row.nome" />
        <!-- <b-table-column field="tempo" v-text="props.row.tempo" /> -->

        <b-table-column field="status" v-text="props.row.status_id" />

        <b-table-column field="criação">{{
          props.row.created_at | formatEnToBr
        }}</b-table-column>

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
            </div>
            <div class="flex text-sm items-center">
              <a
                href="#"
                class="mr-4 bg-primary-600 rounded-full p-2"
                @click.prevent="entrar(props.row)"
              >
                <Icon-Eye class="text-neutral-100" size="4" />
              </a>
            </div>
          </div>
        </b-table-column>
      </template>
      <template #empty>
        <Not-Found-Data text="Nenhuma Atividade para a pesquisa informada" />
      </template>
    </b-table>

    <b-modal :active.sync="AtividadesCadasModal" width="600px" id="modal-tall">
      <div class="bg-neutral-300 p-8">
        <div class="modal-body" style="height: 270px">
          <label class="flex flex-col pb-4">
            <Lynx-Label label="Status" />
            <b-autocomplete
              :data="filteredStatus"
              placeholder="Pesquise um status"
              field="status"
              @input="searchStatus"
              @select="(option) => (form.status_id = option.id)"
            />
          </label>
          <Lynx-Label label="Nome" />
          <Lynx-Input
            placeholder="Insira o Nome da Atividade"
            v-model="form.nome"
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
import { searchEmpresasRequest } from "@/services/requests/empresas";
import debounce from "@/mixins/debounce";

import Treeselect from "@riophae/vue-treeselect";
import NotFoundData from "@/components/layouts/NotFoundData";

import { formatEnToBr } from "@/utils/momentHelpers";

export default {
  mixins: [debounce],

  name: "index",
  components: {
    Treeselect,
    NotFoundData,
  },
  filters: {
    formatEnToBr,
  },
  data() {
    return {
      form: {
        status_id: null,
        nome: "",
      },
      status: [],
      isFetching: false,
      currentPage: 1,
      perPage: 10,
      loading: false,
      lista_campos: [],
      AtividadesCadasModal: false,
      cliente: null,
      carteira: null,
      carteiras: [],
      status_id: [
        {
          id: 9,
          status: "Pré-cadastro",
        },
        {
          id: 3,
          status: "Aguardando certificado",
        },
        {
          id: 4,
          status: "Aguardando CNPJ",
        },

        {
          id: 5,
          status: "Aguardando alvará",
        },
        {
          id: 6,

          status: "Aguardando acesso",
        },
        {
          id: 7,
          status: "Aguardando simples",
        },
        {
          id: 99,

          status: "Aguardando ativação",
        },
      ],
      status_id2: [],

      columns: [
        {
          field: "nome",
          label: "nome",
          sortable: false,
        },

        {
          field: "status",
          label: "status",
          sortable: true,
        },
        {
          field: "criação",
          label: "criação",
          sortable: true,
        },
      ],
      empresas: [],
    };
  },
  computed: {
    lista_atividades() {
      return this.$store.state.atividades.lista_atividades;
    },
    mensagem_alert() {
      return this.$store.state.atividades.mensagem_alert;
    },

    filteredStatus() {
      return this.status_id.map((item) => {
        return {
          id: item.id,
          status: `${item.id} - ${item.status}`,
        };
      });
    },
  },
  created() {
    this.listar_atividades();
  },
  methods: {
    async confirm(tipo) {
      await this.$buefy.dialog.confirm({
        message: `Esta ação  ` + tipo + ` uma Atividade no sistema?`,
        confirmText: "Sim",
        cancelText: "Não",
        type: "is-success",
        onConfirm: () => {
          if (tipo == "cria") this.create();
          if (tipo == "edita") this.update();
        },
      });
    },
    async create() {
         this.$store.dispatch("configEmpresa/atualizar", "");
      // console.log(this.form);
      this.loading = true;
      await this.$store
        .dispatch("atividades/create_atividades", this.form)
        .then(() => {
          this.$snack.success(this.mensagem_alert.message);
                this.AtividadesCadasModal = false;

        })
        .catch((error) => this.$snack.error(mensagem_alert.message))
        .finally(() => (this.loading = false));
    },

    async update() {
      await this.$store
        .dispatch("atividades/update_atividades", this.form)

        .then(() => {
          this.$snack.success(this.mensagem_alert.message);
                this.AtividadesCadasModal = false;
        })
        .catch((error) => this.$snack.error(mensagem_alert.message))
        .finally(() => (this.loading = false));
      this.listar_atividades();

      //   this.fireAlert({
      //     ...this.mensagem_alert,
      //     routeName: "produto",
      //   });
    },

    async listar_atividades() {
      this.status_id2 = this.status_id;
      // this.$store.dispatch("carteira/listar_carteiras");

      await this.$store.dispatch("atividades/listar_atividades");

      this.$store.dispatch("configEmpresa/atualizar", "");
    },

    cadastrar() {
      this.atualizar("");

      this.AtividadesCadasModal = true;
    },
    atualizar(value) {
      this.lista_campos = value;

      this.form.id = value.id;
      this.form.nome = value.nome;
      // this.form.tempo = value.tempo;
  
      this.AtividadesCadasModal = true;

          this.form.status_id = value.status_id;
    },
    entrar(value) {
      //  this.$router.push({path: 'empresas.show'})
      this.$router.push({ path: `/atividades/etapas/${value.id}` });
    },

    // gerarRelatorio() {
    //   window.open(
    //     `${process.env.VUE_APP_API_URL}/api/Atividades/relatorio/clientes/?token=${this.$store.getters.getToken}&carteira_id=${this.carteira}`,
    //     "_blank"
    //   );
    // },
  async  searchStatus(name) {
     this.status_id = [];
    await  this.status_id2.forEach((element) => {
     let texto = element.status.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
     let texto2 = name.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")

        if (texto.match(`${texto2}`)) {
          
          this.status_id.push(element);
        }
      });
    },
  },
};
</script>

<style scoped>
</style>
