<template>
  <div>
    <b-loading :active.sync="loading" />
    <div class="w-full flex justify-between items-center">
      <Lynx-Title text="Motivo Retenção" />

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
      :data="lista_motivo_retencoes"
      :per-page="perPage"
      :paginated="true"
      default-sort-direction="asc"
      default-sort="id"
      hoverables
      class="w-full rounded-t-none"
    >
      <template slot-scope="props">
        <b-table-column field="id" v-text="props.row.id" />
        <!-- <b-table-column field="tempo" v-text="props.row.tempo" /> -->

        <b-table-column field="motivo" v-text="props.row.motivo" />

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
              <a
                href="#"
                class="bg-error-base rounded-full p-2"
                @click.prevent="confirmDelete(props.row.id)"
              >
                <Icon-Trash class="text-neutral-100" size="4" />
              </a>
            </div>
          </div>
        </b-table-column>
      </template>
      <template #empty>
        <Not-Found-Data text="Nenhuma Atividade para a pesquisa informada" />
      </template>
    </b-table>

    <b-modal :active.sync="MotivoRetencaoModel" width="600px" id="modal-tall">
      <div class="bg-neutral-300 p-8">
        <div class="modal-body" style="height: 170px">
          <label class="flex flex-col">
            <Lynx-Title text="Motivo Retenção Cadastro" />
          </label>
          <Lynx-Label label="Motivo" />
          <Lynx-Input
            placeholder="Insira Motivo para Retenções"
            v-model="form.motivo"
            class="w-full"
          />
        </div>

        <div class="flex flex-col mt-3">
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
        motivo: "",
      },
      status: [],
      isFetching: false,
      currentPage: 1,
      perPage: 10,
      loading: false,
      lista_campos: [],
      MotivoRetencaoModel: false,

      columns: [
        {
          field: "id",
          label: "id",
          sortable: false,
        },

        {
          field: "motivo",
          label: "motivo",
          sortable: false,
        },
        {
          field: "criação",
          label: "criação",
          sortable: false,
        },
      ],
      empresas: [],
    };
  },
  computed: {
    lista_motivo_retencoes() {
      return this.$store.state.motivoRetencao.lista_motivo_retencoes;
    },
    mensagem_alert() {
      return this.$store.state.motivoRetencao.mensagem_alert;
    },
  },
  created() {
    this.listar_motivo_retencoes();
  },
  methods: {
    async confirm(tipo) {
      await this.$buefy.dialog.confirm({
        message: `Esta ação  ` + tipo + ` uma Motivo Retenção no sistema?`,
        confirmText: "Sim",
        cancelText: "Não",
        type: "is-success",
        onConfirm: () => {
          if (tipo == "cria") this.create();
          if (tipo == "edita") this.update();
      
        },
      });
    },
    async confirmDelete(id) {
      await this.$buefy.dialog.confirm({
        message: "Esta ação deleta uma Motivo Retenção no sistema?",
        confirmText: "Sim",
        cancelText: "Não",
        type: "is-success",
        onConfirm: () => {
          this.delete(id);
        },
      });
    },
    async create() {
      this.$store.dispatch("configEmpresa/atualizar", "");
      // console.log(this.form);
      this.loading = true;
      await this.$store
        .dispatch("motivoRetencao/create_motivo_retencao", this.form)
        .then(() => {
          this.$snack.success(this.mensagem_alert.message);
          this.MotivoRetencaoModel = false;
        })
        .catch((error) => this.$snack.error(mensagem_alert.message))
        .finally(() => (this.loading = false));
    },

    async update() {
      await this.$store
        .dispatch("motivoRetencao/update_motivo_retencao", this.form)

        .then(() => {
          this.$snack.success(this.mensagem_alert.message);
          this.MotivoRetencaoModel = false;
        })
        .catch((error) => this.$snack.error(mensagem_alert.message))
        .finally(() => (this.loading = false));

      // this.listar_motivo_retencaoes();

      //   this.fireAlert({
      //     ...this.mensagem_alert,
      //     routeName: "produto",
      //   });
    },
    async delete(id) {
      await this.$store
        .dispatch("motivoRetencao/delete_motivo_retencao", id)

        .then(() => {
          this.$snack.success(this.mensagem_alert.message);
        })
        .catch((error) => this.$snack.error(mensagem_alert.message))
        .finally(() => (this.loading = false));
    },

    async listar_motivo_retencoes() {
      // this.$store.dispatch("carteira/listar_carteiras");

      await this.$store.dispatch("motivoRetencao/listar_motivo_retencoes");

      this.$store.dispatch("configEmpresa/atualizar", "");
    },

    cadastrar() {
      this.atualizar("");
      this.MotivoRetencaoModel = true;
    },

    atualizar(value) {
      this.lista_campos = value;
      this.form.id = value.id;
      this.form.motivo = value.motivo;
      // this.form.tempo = value.tempo;
      this.MotivoRetencaoModel = true;
    },

    // gerarRelatorio() {
    //   window.open(
    //     `${process.env.VUE_APP_API_URL}/api/Atividades/relatorio/clientes/?token=${this.$store.getters.getToken}&carteira_id=${this.carteira}`,
    //     "_blank"
    //   );
    // },
  },
};
</script>

<style scoped>
</style>
