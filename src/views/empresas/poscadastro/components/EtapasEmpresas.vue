<template>
  <div v-if="lista_etapas_empresas.atividades[0]">
    <b-loading :active.sync="loading" />
    <div class="w-full flex justify-between items-center">
      <Lynx-Title
        :text="'Fluxo de Atividades ' + lista_etapas_empresas.atividades[0].nome"
      />
    </div>

    <div v-if="!lista_etapas_empresas.etapas[0]">
      <Lynx-Button
        :loading="btnConclir"
        text=" Liberar etapas"
        size="small"
        @click.native="liberarEtapas(item)"
      />
    </div>
    <!-- <div class="flex flex-wrap grid grid-cols-4"> -->
    <div v-else class="grid grid-cols-4 md:grid-cols-1 gap-4 items-start">
      <transition
        name="fade"
        v-for="item in lista_etapas_empresas.etapas"
        :key="item.id"
      >

        
        <div class="card">
          <Card
            class=""
            color="primary-500"
            :header="{
              title: `${item.etapa.titulo}`,

              textColor: 'white',
            }"
          />
          <div class="flex flex-col w-full p-2">
            <p class="mt-1" style="font-size: 14px">
              SubTitulo: {{ item.etapa.subtitulo }}
            </p>
            <p class="mt-1" style="font-size: 14px">
              Horas: {{ item.etapa.tempo }}
            </p>

            <b-progress
              class="mt-2"
              size="is-large"
              :type="
                status == 0
                  ? 'is-danger '
                  : item.status == 1
                  ? 'is-warning'
                  : 'is-success'
              "
              :value="item.progress"
              show-value
              format="percent"
            />
           
            <div class="flex justify-end">
           
             <!-- <div class="flex justify-start">
               <a href="#" class="bg-primary-600 rounded-full p-2 mb-3 mr-3  " @click.native="comentarios_etapa_empresa(item)">
              <Icon-Eye class="text-neutral-100" size="4"/>
            </a>
             </div> -->
              <div class="grid-cols-1 grid">

                <Lynx-Button
                  class="mb-3 error-base"
                  :loading="btnConclir"
                  text="comentar"
                  size="small"
                  @click.native="cadastrar(item)"
                />
              </div>
            </div>

            <Lynx-Button
              :loading="btnConclir"
              :disabled="item.status == 2 ? true : false"
              :text="
                status == 0
                  ? 'Concluir Atrasado'
                  : item.status == 1
                  ? 'Concluir'
                  : item.status == 4
                  ? 'aguardando etapa anterior'
                  : 'concluido'
              "
              size="small"
              @click.native="confirm2(item)"
            />
          </div>
        </div>
      </transition>
    </div>
    <!-- </div> -->

    <b-modal :active.sync="EtapasEmpresaModel" width="600px" id="modal-tall">
      <div class="bg-neutral-300 p-6 modal-radius">
        <div class="modal-body" style="height: 170px">
          <label class="flex flex-col pb-4">
            <Lynx-Label label="Tipo" />

            <b-select
              class="form"
              placeholder="Selecione o tipo comentario da etapa..."
              v-model="form.tipo"
              @input="fetchResumoGuias"
            >
              <option
                v-for="item in lista_tipo_comentario_etapa"
                :key="item.id"
                :value="item.id"
              >
                {{ item.nome }}
              </option>
            </b-select>
          </label>
          <label class="flex flex-col pb-4">
            <Lynx-Label label="Comentario" />
            <Lynx-Input
              placeholder="Insira um comentario"
              v-model="form.comentario"
              class="w-full my-2"
            />
          </label>
        </div>

        <div class="flex flex-col mt-5">
          <Lynx-Button
            :disabled="lista_campos.status == ''"
            :text="!lista_campos.id ? 'comenta' : 'edita comentario'"
            class="mb-8"
            icon="Reload"
            @click.native="confirm('comenta')"
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
import debounce from "@/mixins/debounce";

import Treeselect from "@riophae/vue-treeselect";

export default {
  mixins: [debounce],

  name: "index",
  components: {
    Treeselect,
    Card,
  },
  props: ["empresa"],
  data() {
    return {
      form: {
        etapas_empresas_id: null,
        comentario: "",
        empresas_id: "",
        tipo: "",
      },
      btnConclir: false,
      payer: null,
      isFetching: false,
      currentPage: 1,
      perPage: 10,
      loading: false,
      lista_campos: [],
      EtapasEmpresaModel: false,
      cliente: null,
      carteira: null,
      carteiras: [],

      empresas: [],

      lista_tipo_comentario_etapa: [
        { id: 1, nome: "concluido" },
        { id: 2, nome: "impedimento " },
        { id: 3, nome: "desconciderar " },
      ],
    };
  },
  computed: {
    lista_etapas() {
      return this.$store.state.etapas.etapa;
    },
    lista_etapas_empresas() {
      return this.$store.state.etapasEmpresa.lista_etapas_empresas;
    },
    mensagem_alert() {
      return this.$store.state.etapasEmpresa.mensagem_alert;
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
    this.listar_etapas_empresa();
  },
  methods: {
    async confirm(tipo) {
      await this.$buefy.dialog.confirm({
        message: `Esta ação  ` + tipo + ` uma atividade no sistema?`,
        confirmText: "Sim",
        cancelText: "Não",
        type: "is-success",
        onConfirm: () => {
          if (tipo == "cria") this.create();
          if (tipo == "edita") this.update();
          if (tipo == "comenta") this.create_comentario();
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

    async update() {
      await this.$store
        .dispatch("etapasEmpresa/update_etapas", this.form)

        .then(() => {
          this.$snack.success(this.mensagem_alert.message);
        })
        .catch((error) => this.$snack.error(mensagem_alert.message))
        .finally(() => (this.loading = false));
      this.listar_etapas_empresa();

      //   this.fireAlert({
      //     ...this.mensagem_alert,
      //     routeName: "produto",
      //   });
    },

  async  create_comentario() {
      this.form.empresas_id = this.empresa.id;
      this.loading = true;

      await this.$store.dispatch(
        "etapasEmpresa/comentar_etapa_empresa",
        this.form
      ).then(() => {
          this.$snack.success(this.mensagem_alert.message);
           this.loading = false;
        })
        .catch((error) => this.$snack.error(this.mensagem_alert.message))
        .finally(() => (this.loading = false));
this.EtapasEmpresaModel = false;
     
    },

    async listar_etapas_empresa() {
      // this.$store.dispatch("carteira/listar_carteiras");
      this.loading = true;
      await this.$store.dispatch("etapasEmpresa/listar_etapas_empresas", {
        status_id: this.empresa.status_id,
        empresas_id: this.empresa.id,
      });

      this.$store.dispatch("configEmpresa/atualizar", "");
      this.btnConclir = false;
      this.loading = false;

      // if (!this.lista_etapas_empresas.etapas[0]) {
      //   this.liberarEtapas();
      // }
    },

    cadastrar(value) {
      this.atualizar("");
      this.form.etapas_empresas_id = value.id;
      this.EtapasEmpresaModel = true;
    },
    atualizar(value) {
      this.lista_campos = value;

      this.form.id = value.id;
      this.form.atividades_id = value.atividades_id;
      this.form.empresa_id = value.empresa_id;
      this.form.etapas_id = value.etapas_id;

      this.form.status = value.status;
      this.form.tempo = value.tempo;

      this.EtapasEmpresaModel = true;
    },
    async concluir(value) {
      this.btnConclir = true;
      // console.log(value)
      value.status = 2;
      await this.$store
        .dispatch("etapasEmpresa/update_etapas_empresa", value)

        .then(() => {
          this.$snack.success(this.mensagem_alert.message);
        })
        .catch((error) => this.$snack.error(mensagem_alert.message))
        .finally(() => (this.loading = false));
      this.listar_etapas_empresa();
    },

    async liberarEtapas() {
      await this.$store.dispatch("etapasEmpresa/liberar_etapas", {
        empresas_id: this.empresa.id,
        atividade_id: this.lista_etapas_empresas.atividades[0].id,
      });
    },
    //  async comentarios_etapa_empresa(item) {
    //   await this.$store.dispatch("etapasEmpresa/comentarios_etapa_empresa",item);
    // },


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
