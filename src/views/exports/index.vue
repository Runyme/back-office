<template>
  <div>
    <b-loading :active.sync="loading" />
    <div class="w-full flex justify-between items-center">
      <Lynx-Title text="Exportação de relatórios" />
    </div>

    <div class="w-full flex mt-8 grid grid-cols-2 gap-8 items-start">
      <Card
        class="font-body cursor-pointer"
        color="primary-500"
        @click.native="emissor = true"
      >
        <div>
          <div class="p-6 flex items-start">
            <div class="flex flex-col ml-4">
              <p class="font-semibold pb-4 text-primary-800">
                Empresas, Prefeitura por carteira
              </p>
              <p class="font-semibold text-primary-800">
                <span class="text-neutral-800 font-normal text-neutral-700"
                  >Empresas, acesso do emissor de notas, cidade por
                  carteira</span
                >
              </p>
            </div>
          </div>
        </div>
      </Card>

      <!-- <Card
        class="font-body cursor-pointer"
        color="primary-500"
        @click.native="irpf = true"
      >
        <div>
          <div class="p-6 flex items-start">
            <div class="flex flex-col ml-4">
              <p class="font-semibold pb-4 text-primary-800">
                Relação de Clientes com IRPF
              </p>
              <p class="font-semibold text-primary-800">
                <span class="text-neutral-800 font-normal text-neutral-700"
                  >Empresas, Nome, Email, Telefone, Carteiras, Respondeu
                  Questionário?,Enviou Pendências?</span
                >
              </p>
            </div>
          </div>
        </div>
      </Card> -->

      <Card
        class="font-body cursor-pointer"
        color="primary-500"
        @click.native="docieIrpf = true"
      >
        <div>
          <div class="p-6 flex items-start">
            <div class="flex flex-col ml-4">
              <p class="font-semibold pb-4 text-primary-800">Dociê IRPF</p>
              <p class="font-semibold text-primary-800">
                <span class="text-neutral-800 font-normal text-neutral-700"
                  >Perguntas e Respostas</span
                >
              </p>
            </div>
          </div>
        </div>
      </Card>
      <Card
        class="font-body cursor-pointer"
        color="primary-500"
        @click.native="exportClentesReport()"
      >
        <div>
          <div class="p-6 flex items-start">
            <div class="flex flex-col ml-4">
              <p class="font-semibold pb-4 text-primary-800">Clientes</p>
              <p class="font-semibold text-primary-800">
                <span class="text-neutral-800 font-normal text-neutral-700"
                  >Relatorio todos os Clientes</span
                >
              </p>
            </div>
          </div>
        </div>
      </Card>
      <Card
        class="font-body cursor-pointer"
        color="primary-500"
        @click.native="exportRelatorio2('empresas/relatorio/relatorio-ddd')"
      >
        <div>
          <div class="p-6 flex items-start">
            <div class="flex flex-col ml-4">
              <p class="font-semibold pb-4 text-primary-800">Empresas DDD carteira</p>
              <p class="font-semibold text-primary-800">
                <span class="text-neutral-800 font-normal text-neutral-700"
                  >Relatorio todos as empresas com ddd e carteira </span
                >
              </p>
            </div>
          </div>
        </div>
      </Card>
            <Card
        class="font-body cursor-pointer"
        color="primary-500"
        @click.native="exportRelatorio('financeiro/empresasocios')"
      >
        <div>
          <div class="p-6 flex items-start">
            <div class="flex flex-col ml-4">
              <p class="font-semibold pb-4 text-primary-800">Empresas Social</p>
              <p class="font-semibold text-primary-800">
                <span class="text-neutral-800 font-normal text-neutral-700"
                  >Relatorio todos as empresas com mesmo socio</span
                >
              </p>
            </div>
          </div>
        </div>
      </Card>
            <Card
        class="font-body cursor-pointer"
        color="primary-500"
        @click.native="exportRelatorio('financeiro/guialib')"
      >
        <div>
          <div class="p-6 flex items-start">
            <div class="flex flex-col ml-4">
              <p class="font-semibold pb-4 text-primary-800">Empresas Guia Liberação</p>
              <p class="font-semibold text-primary-800">
                <span class="text-neutral-800 font-normal text-neutral-700"
                  >Relatorio todos as liberações de guias para envio </span
                >
              </p>
            </div>
          </div>
        </div>
      </Card>
             <Card
        class="font-body cursor-pointer"
        color="primary-500"
        @click.native="exportRelatorio('financeiro/faturamentos')"
      >
        <div>
          <div class="p-6 flex items-start">
            <div class="flex flex-col ml-4">
              <p class="font-semibold pb-4 text-primary-800">Empresas Faturamentos</p>
              <p class="font-semibold text-primary-800">
                <span class="text-neutral-800 font-normal text-neutral-700"
                  >Relatorio Todas As empresas Faturamentos até 12 competencias anteriores </span
                >
              </p>
            </div>
          </div>
        </div>
      </Card>
         <Card
        class="font-body cursor-pointer"
        color="primary-500"
        @click.native="exportRelatorio2('relatorio-resumido-irpf')"
      >
        <div>
          <div class="p-6 flex items-start">
            <div class="flex flex-col ml-4">
              <p class="font-semibold pb-4 text-primary-800">Empresas IRPF Resumo</p>
              <p class="font-semibold text-primary-800">
                <span class="text-neutral-800 font-normal text-neutral-700"
                  >Relatorio IRPF os totais de cada cateira </span
                >
              </p>
            </div>
          </div>
        </div>
      </Card>
      <Card
        class="font-body cursor-pointer"
        color="primary-500"
        @click.native="ModelEmpresasRelataorio = true"
      >
        <div>
          <div class="p-6 flex items-start">
            <div class="flex flex-col ml-4">
              <p class="font-semibold pb-4 text-primary-800">
                Relatorios das Empresas
              </p>
              <p class="font-semibold text-primary-800">
                <span class="text-neutral-800 font-normal text-neutral-700"
                  >Empresas diversos relatorios sobre cliente
                </span>
              </p>
            </div>
          </div>
        </div>
      </Card>
      <Card
        class="font-body cursor-pointer"
        color="primary-500"
        @click.native="ModelAberturaDias = true"
      >
        <div>
          <div class="p-6 flex items-start">
            <div class="flex flex-col ml-4">
              <p class="font-semibold pb-4 text-primary-800">
                Relatorios das Empresas Abertura Dias e Status
              </p>
              <p class="font-semibold text-primary-800">
                <span class="text-neutral-800 font-normal text-neutral-700"
                  >Empresas com status e dias que estão presas no mesmo
                </span>
              </p>
            </div>
          </div>
        </div>
      </Card>
      <Card
        class="font-body cursor-pointer"
        color="primary-500"
        @click.native="exportRelatorio2('empresas/relatorio/data-ativacao')"
      >
        <div>
          <div class="p-6 flex items-start">
            <div class="flex flex-col ml-4">
              <p class="font-semibold pb-4 text-primary-800">
                Relatorios Data Empresas Ativas  
              </p>
              <p class="font-semibold text-primary-800">
                <span class="text-neutral-800 font-normal text-neutral-700"
                  >Data de ativação da Empresa conforme historico registrado
                </span>
              </p>
            </div>
          </div>
        </div>
      </Card>
           <Card
        class="font-body cursor-pointer"
        color="primary-500"
        @click.native="exportRelatorio2('satisfacao/relatorio')"
      >
        <div>
          <div class="p-6 flex items-start">
            <div class="flex flex-col ml-4">
              <p class="font-semibold pb-4 text-primary-800">
                Relatorios Satisfação  
              </p>
              <p class="font-semibold text-primary-800">
                <span class="text-neutral-800 font-normal text-neutral-700"
                  >Satisfação , notas e comentario por cliente
                </span>
              </p>
            </div>
          </div>
        </div>
      </Card>
        <Card
        class="font-body cursor-pointer"
        color="primary-500"
        @click.native="exportRelatorio2('guias/relatorio/fechamento')"
      >
        <div>
          <div class="p-6 flex items-start">
            <div class="flex flex-col ml-4">
              <p class="font-semibold pb-4 text-primary-800">
                Relatorios fechamento  
              </p>
              <p class="font-semibold text-primary-800">
                <span class="text-neutral-800 font-normal text-neutral-700"
                  >relatorio  trazendo faturamento, guias e receitas
                </span>
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
    <b-modal :active.sync="emissor" v-b-modal.modal-lg can-cancel>
      <div class="bg-neutral-300 shadow p-10">
        <Lynx-Title text="Exportar" />
        <h2 class="pb-8 text-xl font-display text-primary-700">
          Lista de Empresas, acesso do emissor de notas, cidade por carteira
        </h2>
        <div class="flex flex-wrap">
          <Lynx-Button text="Todas" class="mr-2" @click.native="exportReport" />

          <Lynx-Button
            v-show="
              (item.setor != 'rh') & (item.setor != 'abertura') ? true : false
            "
            v-for="(item, key) in lista_carteiras"
            :key="key"
            :text="item.nome"
            class="mr-2 mt-1"
            @click.native="exportReport({ key: 'carteira', value: item.id })"
          />

          <!-- <Lynx-Button  text="Congeladas" class="mr-2 mt-1" @click.native="exportReport({key: 'congelada', value: true})" v-if="$hasPermission('exportar relatorio congeladas')"/> -->
        </div>
      </div>
    </b-modal>

    <b-modal :active.sync="irpf" can-cancel>
      <div class="bg-neutral-300 shadow p-8">
        <Lynx-Title text="Exportar" />
        <h2 class="pb-8 text-xl font-display text-primary-700">
          Empresas, Nome, Email, Telefone, Carteiras, Respondeu
          Questionário?,Enviou Pendências?
        </h2>
        <div>
          <label class="block">
            <Lynx-Label label="Ano" />

            <Lynx-Input placeholder="Insira o Ano" v-model="ano" />
          </label>
          <Lynx-Button
            text="Exportar"
            class="mr-2"
            @click.native="exportIrpfReport"
          />
        </div>
      </div>
    </b-modal>

    <b-modal :active.sync="docieIrpf" can-cancel>
      <div class="bg-neutral-300 shadow p-8">
        <Lynx-Title text="Exportar" />
        <h2 class="pb-8 text-xl font-display text-primary-700">
          Perguntas e Respostas
        </h2>
        <div>
          <label class="block">
            <Lynx-Label label="Cliente" />

            <Lynx-Input placeholder="Insira o Cliente" v-model="cliente" />
          </label>
          <Lynx-Button
            text="Exportar"
            class="mr-2"
            @click.native="exportIrpfDocie"
          />
        </div>
      </div>
    </b-modal>
    <b-modal :active.sync="ModelEmpresasRelataorio" can-cancel>
      <div class="bg-neutral-300 shadow p-8">
        <Lynx-Title text="Exportar" />
        <h2 class="pb-8 text-xl font-display text-primary-700">
          Relatorios Diversos de Empresas
        </h2>
        <div class="flex flex-wrap">
          <Lynx-Button
            text="Empresas Residentes"
            class="mr-2"
            @click.native="exportRelatorio('empresasResidentes')"
          />
        
          <Lynx-Button
            text="Empresa Sem Crm Juridico"
            class="mr-2"
            @click.native="exportRelatorio('EmpresasSemCrmJuridico')"
          />
          <Lynx-Button
            text="Empresa Com Crm Juridico"
            class="mr-2"
            @click.native="exportRelatorio('EmpresasComCrmJuridico')"
          />
          <Lynx-Button
            text="Empresa Sem Crm PF E PJ"
            class="mt-2 mr-2"
            @click.native="exportRelatorio('semcrm')"
          />
              <Lynx-Button
            text="Empresas Clientes Adm"
            class="mt-2 mr-2"
            @click.native="exportRelatorio('relatorio-clientes-adm')"
          />
        </div>
      </div>
    </b-modal>

    <b-modal :active.sync="ModelAberturaDias" can-cancel>
      <div class="bg-neutral-300 shadow p-8">
        <div class="modal-body" style="height: 420px">
          <Lynx-Title text="Exportar" />

          <div class="w-full flex flex-wrap">
            <label class="flex flex-col w-2/4 pl-2 pb-6">
              <Lynx-Label label="Insira o(s) Status" />

              <treeselect
                :multiple="true"
                :options="lista_status"
                placeholder="Selecione Os Status..."
                v-model="form.status"
              />
            </label>
            <label class="flex flex-col w-1/4 pl-2 pb-6">
              <Lynx-Label label="Quantidade de Dias" />
              <Lynx-Input
                placeholder="Insira Quantidade de Dias"
                v-model="form.quantDay"
              />
            </label>
          </div>
          <Lynx-Button
            text="Exportar"
            class="mr-2"
            @click.native="exportAberturaDays"
          />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Card from "@/components/helpers/Card";
import Treeselect from "@riophae/vue-treeselect";

export default {
  components: { Card, Treeselect },
  name: "index",
  data() {
    return {
      loading: false,
      emissor: false,
      irpf: false,
      docieIrpf: false,
      ano: null,
      cliente: null,
      ModelEmpresasRelataorio: false,
      ModelAberturaDias: false,
      lista_status: [
        { id: 1, label: "Processando" },
        { id: 2, label: "Aguardando assinatura" },
        { id: 3, label: "Aguardando certificado" },
        { id: 4, label: "Aguardando CNPJ" },
        { id: 5, label: "Aguardando alvará" },
        { id: 6, label: "Aguardando acesso" },
        { id: 7, label: "Aguardando simples" },
        { id: 8, label: "Aguardando Documentação" },
        { id: 9, label: "Pré-cadastro" },
        { id: 99, label: "Aguardando ativação" },
      ],

      form: {
        quantDay: "",
        status: [],
      },
    };
  },
  computed: {
    lista_carteiras() {
      //  return this.$store.state.carteira.lista_carteiras;

      return this.$store.state.carteira.lista_carteiras;
    },
  },
  created() {
    this.listar_carteiras();
  },
  methods: {
    listar_carteiras() {
      this.$store.dispatch("carteira/listar_carteiras");
    },
    exportReport(param = null) {
      let filter;
      if (param != null) {
        filter = `&${param.key}=${param.value}`;
      }
      window.open(
        `${process.env.VUE_APP_API_URL}/reports/1?token=${this.$store.getters.getToken}${filter}`,
        "_blank"
      );
    },
    exportIrpfReport() {
      window.open(
        `${process.env.VUE_APP_API_URL}/reports/irpf/clientes?token=${this.$store.getters.getToken}&ano=${this.ano}`,
        "_blank"
      );
    },
    exportClentesReport() {
      window.open(
        `${process.env.VUE_APP_API_URL}/reports/clientes?token=${this.$store.getters.getToken}`,
        "_blank"
      );
    },
    exportIrpfDocie() {
      window.open(
        `${process.env.VUE_APP_API_URL}/irpf/${this.cliente}/docie?token=${this.$store.getters.getToken}`,
        "_blank"
      );
    },
    exportRelatorio(nome) {
      window.open(
        `${process.env.VUE_APP_API_URL}/relatorio/` +
          nome +
          `?token=${this.$store.getters.getToken}`,
        "_blank"
      );
    },
       exportRelatorio2(nome) {
      window.open(
        `${process.env.VUE_APP_API_URL}/` +
          nome +
          `?token=${this.$store.getters.getToken}`,
        "_blank"
      );
    },
    async exportAberturaDays() {
      this.loading = true;
      await this.$store.dispatch(
        "finanRelatorio/gerarRelatorioAberturaDays",
        this.form
      );
      this.loading = false;
    },
  },
};
</script>

<style scoped>
</style>
