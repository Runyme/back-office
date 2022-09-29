<template>
  <div>
    <b-loading :active.sync="loading" />
    <div class="w-full flex justify-between items-center">
      <Lynx-Title text="Retenção" />
      <Lynx-Button
        text="Relatorio Retenção"
        class="mb-4"
        @click.native="gerarRelatorio()"
        size="small"
        icon-size="3"
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
      :data="lista_retencoes"
      :per-page="perPage"
      :paginated="true"
      default-sort-direction="asc"
      default-sort="id"
      hoverables
      class="w-full rounded-t-none"
    >
      <template slot-scope="props">
        <b-table-column field="id" v-text="props.row.empresas_id" />
        <b-table-column field="CNPJ" v-text="props.row.empresa.cnpj" />
        <b-table-column field="razão social" v-text="props.row.empresa.razao_social" />


        <!-- <b-table-column field="tempo" v-text="props.row.tempo" /> -->

        <b-table-column field="motivo" v-text="props.row.motivo.motivo" />

        <b-table-column field="data retenção">{{
          props.row.data_retencao | formatEnToBr
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

    <b-modal :active.sync="RetencaoModel" width="600px" id="modal-tall">
      <div class="bg-neutral-300 p-8">
        <div class="modal-body" style="height: 350px">
          <form class="flex flex-col" @submit.prevent="confirm('edita')">
            <div class="w-full flex">
              <label class="flex flex-col w-1/2 pb-6 pr-3">
                <Lynx-Label
                  label="Data Retencao"
                  :validator="$v.form.data_retencao"
                  :validations-message="validationsMessage.form.data_retencao"
                />
                <b-datepicker
                  v-model="form.data_retencao"
                  placeholder="Selecione uma data"
                  :date-formatter="
                    (date) => moment(date, 'YYYY/MM/DD').format('DD/MM/YYYY')
                  "
                  :date-parser="(date) => new Date(date)"
                  :month-names="monthNames"
                  :day-names="dayNames"
                  :years-range="[-20, 10]"
                />
              </label>
            </div>

            <label class="flex flex-col pb-6">
              <Lynx-Label
                label="Motivo"
                :validator="$v.form.motivo_retencao_id"
                :validations-message="
                  validationsMessage.form.motivo_retencao_id
                "
              />
              <b-select class="w-full" v-model="form.motivo_retencao_id">
                <option
                  v-for="option in motivosOptions"
                  :key="option.id"
                  :value="option.id"
                  v-text="option.motivo"
                />
              </b-select>
            </label>

            <label class="flex flex-col pb-6">
              <Lynx-Label
                label="Descrição"
                :validator="$v.form.data_retencao"
                :validations-message="validationsMessage.form.descricao"
              />
              <Lynx-Textarea v-model="form.descricao" />
            </label>

            <Lynx-Button
              type="submit"
              :text="'atualizar retenção'"
              color="error-base"
              class="self-end"
              :loading="loadingButton"
            />
          </form>
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
import { required } from "vuelidate/lib/validators";

import Treeselect from "@riophae/vue-treeselect";
import NotFoundData from "@/components/layouts/NotFoundData";
import moment from "moment";
import { monthNames, dayNames } from "@/utils/utils";
import LynxTextarea from "@/components/helpers/Textarea";

import { formatEnToBr } from "@/utils/momentHelpers";

export default {
  mixins: [debounce],

  name: "index",
  components: {
    Treeselect,
    NotFoundData,
    LynxTextarea,
  },

  filters: {
    formatEnToBr,
  },
  data() {
    return {
      loading: false,
      loadingButton: false,
      monthNames,
      dayNames,
      form: {
        data_retencao: new Date(),
        motivo_retencao_id: "",
        descricao: "",
      },
      validationsMessage: {
        form: {
          data_retencao: {
            required: "Insira a data de competência do desativamento",
          },
          motivo_retencao_id: { required: "Insira o motivo do desativamento" },
        },
      },
      status: [],
      isFetching: false,
      currentPage: 1,
      perPage: 10,
      loading: false,
      lista_campos: [],
      RetencaoModel: false,

      columns: [
        {
          field: "id",
          label: "id",
          sortable: false,
        },
        {
          field: "CNPJ",
          label: "CNPJ",
          sortable: false,
        },
        {
          field: "razão social",
          label: "razão social",
          sortable: false,
        },

        {
          field: "motivo",
          label: "motivo",
          sortable: false,
        },
        {
          field: "data retenção",
          label: "data retenção",
          sortable: false,
        },
      ],
      empresas: [],
    };
  },
  validations: {
    form: {
      data_retencao: { required },
      motivo_retencao_id: { required },
    },
  },
  computed: {
    motivosOptions() {
      return this.$store.state.motivoRetencao.lista_motivo_retencoes;
    },
    lista_retencoes() {
      return this.$store.state.retencao.lista_retencoes;
    },
    mensagem_alert() {
      return this.$store.state.retencao.mensagem_alert;
    },
  },
  created() {
    this.listar_retencoes();
  },
  methods: {
    moment,

    async confirm(tipo) {
      await this.$buefy.dialog.confirm({
        message: `Esta ação  ` + tipo + ` uma  Retenção no sistema?`,
        confirmText: "Sim",
        cancelText: "Não",
        type: "is-success",
        onConfirm: () => {
          // if (tipo == "cria") this.create();
          if (tipo == "edita") this.update();
        },
      });
    },
    async confirmDelete(id) {
      await this.$buefy.dialog.confirm({
        message: "Esta ação deleta uma  Retenção no sistema?",
        confirmText: "Sim",
        cancelText: "Não",
        type: "is-success",
        onConfirm: () => {
          this.delete(id);
        },
      });
    },

    async update() {
      const form = {
        data_retencao: this.moment(this.form.data_retencao).format(
          "YYYY-MM-DD H:m:s"
        ),
        motivo_retencao_id: this.form.motivo_retencao_id,
        descricao: this.form.descricao,
        empresas_id: this.form.empresas_id,
        id: this.form.id,
      };
      await this.$store
        .dispatch("retencao/update_retencao", form)
        .then(() => {
          this.$snack.success(this.mensagem_alert.message);
          this.RetencaoModel = false;
        })
        .catch((error) => this.$snack.error(this.mensagem_alert.message))
        .finally(() => (this.loading = false));
        this.listar_retencoes();
      // this.listar_motivo_retencaoes();

      //   this.fireAlert({
      //     ...this.mensagem_alert,
      //     routeName: "produto",
      //   });
    },
    async delete(id) {
      await this.$store
        .dispatch("retencao/delete_retencao", id)

        .then(() => {
          this.$snack.success(this.mensagem_alert.message);
        })
        .catch((error) => this.$snack.error(mensagem_alert.message))
        .finally(() => (this.loading = false));
    },
    async listar_retencoes() {
      // this.$store.dispatch("carteira/listar_carteiras");
      await this.$store.dispatch("retencao/listar_retencoes");
      await this.$store.dispatch("motivoRetencao/listar_motivo_retencoes");
      this.$store.dispatch("configEmpresa/atualizar", "");
    },
    cadastrar() {
      this.atualizar("");
      this.RetencaoModel = true;
    },
    atualizar(value) {
      console.log(value);
      let campos = value;
      this.form.id = campos.id;
      this.form.motivo_retencao_id = campos.motivo_retencao_id;
      this.form.empresas_id = campos.empresas_id;
      this.form.descricao = campos.descricao;

      this.RetencaoModel = true;
    },

  gerarRelatorio() {
      window.open(
        `${process.env.VUE_APP_API_URL}/retencao/relatorio/?token=${this.$store.getters.getToken}`,
        "_blank"
      );
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
