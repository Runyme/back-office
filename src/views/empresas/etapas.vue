<template>
  <div>
    <b-loading :active.sync="loading" />
    <div class="w-full flex justify-between items-center ">
      <Lynx-Title :text="'Gerenciamento de Atividades : '" />

      <Lynx-Button
        text="Cadastrar"
        class="mb-8"
        icon-size="3"
        size="small"
        @click.native="cadastrar()"
      />
    </div>
<p style="font-size:20px;font-weight:800;">Fluxo : {{atividade.nome.toUpperCase()}}</p>
    <!-- <div class="flex flex-wrap grid grid-cols-4"> -->
    <div class="grid grid-cols-4 gap-4 items-start">
      <transition name="fade" v-for="item in lista_etapas" :key="item.id">
        <div class="card">
          <Card
            class=""
            @click.native="atualizar(item)"
            color="primary-500"
            :header="{
              title: `${item.titulo}`,
              icon: 'Edit',
              textColor: 'white',
            }"
          />
          <div class="flex flex-col w-full p-2">
            <p class="mt-1" style="font-size: 14px">
              SubTitulo: {{ item.subtitulo }}
            </p>
            <p class="mt-1" style="font-size: 14px">Horas: {{ item.tempo }}</p>

            <b-progress
              class="mt-2"
              size="is-large"
              :type=" 
                   'is-warning'
              "
              :value="0"
              show-value
              format="percent"
            />

            <!-- <Lynx-Button
              :loading="btnConclir"
              :disabled="true"
              :text="'etapa'"
              size="small"
              @click.native="confirm2(item)"
            /> -->
          </div>
        </div>
      </transition>
    </div>
    <!-- </div> -->

    <b-modal :active.sync="AtividadesCadasModal" width="600px" id="modal-tall">
      <div class="bg-neutral-300 p-8">
        <div class="modal-body" style="height: 270px">
          <label v-if="payer != null" class="flex flex-col pb-4">
            <Lynx-Label
              :label="this.currentFatura ? this.currentFatura.payer_type : ''"
            />
            <Lynx-Input disabled v-model="payer" />
          </label>
          <label v-if="payer == null" class="flex flex-col pb-4">
            <Lynx-Label label="titulo" />
            <Lynx-Input
              placeholder="Insira o titulo da etapa"
              v-model="form.titulo"
              class="w-full my-2"
            />
            <Lynx-Label label="subtitulo" />
            <Lynx-Input
              placeholder="Insira o subtitulo da etapa"
              v-model="form.subtitulo"
              class="w-full my-2"
            />
            <Lynx-Label label="tempo" />
            <Lynx-Input
              placeholder="Insira o tempo da etapa em horas"
              v-model="form.tempo"
              class="w-full my-2"
            />
          </label>
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
import Card from "@/components/helpers/Card";
// import Template from "../../components/icons/Template.vue";
import { searchEmpresasRequest } from "@/services/requests/empresas";
import debounce from "@/mixins/debounce";

import Treeselect from "@riophae/vue-treeselect";

export default {
  mixins: [debounce],

  name: "index",
  components: {
    Treeselect,
    Card,
  },
  data() {
    return {
      form: {
        atividades_id: null,
        titulo: "",
        subtitulo: "",
        tempo: "",
      },
      btnConclir: false,
      payer: null,
      isFetching: false,
      currentPage: 1,
      perPage: 10,
      loading: false,
      lista_campos: [],
      AtividadesCadasModal: false,
      cliente: null,
      carteira: null,
      carteiras: [],

      empresas: [],
    };
  },
  computed: {
    lista_etapas() {
      return this.$store.state.etapas.etapa;

      // if(this.carteira ){

      //    return empresas.reduce((res,data) => {

      //     data.empresa.carteirasrel.forEach((element) => {
      //       if (this.carteira == element.id) {
      //         res.push(data);
      //       }
      //     });

      //       return res;
      //   },[]);

      // } else  {
      //   return empresas;
      // }
    },
    atividade() {
      return this.$store.state.atividades.atividade;
    },
    mensagem_alert() {
      return this.$store.state.etapas.mensagem_alert;
    },
    //    lista_carteiras() {
    //   //  return this.$store.state.carteira.lista_carteiras;

    //   let carteira = Object.values(this.$store.state.carteira.lista_carteiras);
    //   let data = [];
    //   for (let i = 0; i < carteira.length; i++) {
    //     data.push({ id: carteira[i].id, label: carteira[i].nome });
    //   }
    //   return data;
    // },
    filteredEmpresas() {
      return this.empresas.map((item) => {
        return {
          id: item.id,
          empresa: `${item.id} - ${item.razao_social}`,
        };
      });
    },
  },
  created() {
    this.listar_etapa();
  },
  methods: {
    async confirm(tipo) {
      await this.$buefy.dialog.confirm({
        message: `Esta ação  ` + tipo + ` um Produto no sistema?`,
        confirmText: "Sim",
        cancelText: "Não",
        type: "is-success",
        onConfirm: () => {
          if (tipo == "cria") this.create();
          if (tipo == "edita") this.update();
        },
      });
    },
    async confirm2(value) {
      await this.$buefy.dialog.confirm({
        message: `Esta ação Conclui uma Etapa no sistema?`,
        confirmText: "Sim",
        cancelText: "Não",
        type: "is-success",
        onConfirm: () => {
          this.concluir(value);
        },
      });
    },
    async create() {
      this.form.atividades_id = this.$route.params.atividade_id;

      // console.log(this.form);
      this.loading = true;
      await this.$store
        .dispatch("etapas/create_etapas", this.form)
        .then(() => {
          this.$snack.success(this.mensagem_alert.message);
        })
        .catch((error) => this.$snack.error(mensagem_alert.message))
        .finally(() => (this.loading = false));
      this.AtividadesCadasModal = false;
    },
    async update() {
      await this.$store
        .dispatch("etapas/update_etapas", this.form)

        .then(() => {
          this.$snack.success(this.mensagem_alert.message);
        })
        .catch((error) => this.$snack.error(mensagem_alert.message))
        .finally(() => (this.loading = false));
      this.listar_etapa();

      //   this.fireAlert({
      //     ...this.mensagem_alert,
      //     routeName: "produto",
      //   });
    },

    async listar_etapa() {
      // this.$store.dispatch("carteira/listar_carteiras");
      this.loading = true;
      await this.$store.dispatch(
        "etapas/listar_etapa",
        this.$route.params.atividade_id
      );
        await this.$store.dispatch(
        "atividades/listar_atividade",
        this.$route.params.atividade_id
      );

      this.$store.dispatch("configEmpresa/atualizar", "");
      this.btnConclir = false;
      this.loading = false;
      this.AtividadesCadasModal = false;
    },

    cadastrar() {
      this.atualizar("");

      this.AtividadesCadasModal = true;
    },
    atualizar(value) {
      this.lista_campos = value;

      this.form.id = value.id;
      this.form.titulo = value.titulo;
      this.form.subtitulo = value.subtitulo;
      this.form.atividades_id = value.atividades_id;
      this.form.status = value.status;
      this.form.tempo = value.tempo;

      this.AtividadesCadasModal = true;
    },
    async concluir(value) {
      this.btnConclir = true;
      // console.log(value)
      value.status = 2;
      await this.$store
        .dispatch("etapas/update_etapas", value)

        .then(() => {
          this.$snack.success(this.mensagem_alert.message);
        })
        .catch((error) => this.$snack.error(mensagem_alert.message))
        .finally(() => (this.loading = false));
      this.listar_etapa();
    },

    getAsyncEmpresa(name) {
      if (!name) return;
      let self = this;
      this.debounce(function () {
        self.isFetching = true;
        searchEmpresasRequest(name)
          .then((response) => {
            self.empresas = response.data.data;
          })
          .catch((error) => self.$snack.error(error.response.data.message))
          .finally(() => (self.isFetching = false));
      }, 600);
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
