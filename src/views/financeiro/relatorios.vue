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
        @click.native="congelados"
      >
        <div>
          <div class="p-6 flex items-start">
            <div class="flex flex-col ml-4">
              <p class="font-semibold pb-4 text-primary-800">Congeladas</p>
              <p class="font-semibold text-primary-800">
                <span class="text-neutral-800 font-normal text-neutral-700"
                  >• Relatório de Congelamento com Empresa; Cliente; Valor e
                  DATA de Congelamento</span
                >
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card
        class="font-body cursor-pointer"
        color="primary-500"
        @click.native="baixadosmodel = true"
      >
        <div>
          <div class="p-6 flex items-start">
            <div class="flex flex-col ml-4">
              <p class="font-semibold pb-4 text-primary-800">Baixados</p>
              <p class="font-semibold text-primary-800">
                <span class="text-neutral-800 font-normal text-neutral-700"
                  >• Relatório de Cancelamentos com Empresa; Cliente; Motivo e
                  Encerramento
                </span>
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card
        class="font-body cursor-pointer"
        color="primary-500"
        @click.native="semAlvara"
      >
        <div>
          <div class="p-6 flex items-start">
            <div class="flex flex-col ml-4">
              <p class="font-semibold pb-4 text-primary-800">
                Empresas Sem Alvara
              </p>
              <p class="font-semibold text-primary-800">
                <span class="text-neutral-800 font-normal text-neutral-700"
                  >• Relatório de Empresas sem Alvara</span
                >
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card
        class="font-body cursor-pointer"
        color="primary-500"
        @click.native="semContrato"
      >
        <div>
          <div class="p-6 flex items-start">
            <div class="flex flex-col ml-4">
              <p class="font-semibold pb-4 text-primary-800">
                Empresas Sem Contrato
              </p>
              <p class="font-semibold text-primary-800">
                <span class="text-neutral-800 font-normal text-neutral-700"
                  >• Relatório de Empresas sem Contrato</span
                >
              </p>
            </div>
          </div>
        </div>
      </Card>
      <Card
        class="font-body cursor-pointer"
        color="primary-500"
        @click.native="ClienteXFatura"
      >
        <div>
          <div class="p-6 flex items-start">
            <div class="flex flex-col ml-4">
              <p class="font-semibold pb-4 text-primary-800">
                Empresas X Fatura
              </p>
              <p class="font-semibold text-primary-800">
                <span class="text-neutral-800 font-normal text-neutral-700"
                  >• Relatório de Empresas x Fatura</span
                >
              </p>
            </div>
          </div>
        </div>
      </Card>
      <Card
        class="font-body cursor-pointer"
        color="primary-500"
        @click.native="ClienteXFaturaCartao"
      >
        <div>
          <div class="p-6 flex items-start">
            <div class="flex flex-col ml-4">
              <p class="font-semibold pb-4 text-primary-800">
                Empresas X Fatura Pagos no cartao
              </p>
              <p class="font-semibold text-primary-800">
                <span class="text-neutral-800 font-normal text-neutral-700"
                  >• Relatório de Empresas x Fatura Pagos no Cartão</span
                >
              </p>
            </div>
          </div>
        </div>
      </Card>
      <Card
        class="font-body cursor-pointer"
        color="primary-500"
        @click.native="exportRelatorio('previsoes')"
      >
        <div>
          <div class="p-6 flex items-start">
            <div class="flex flex-col ml-4">
              <p class="font-semibold pb-4 text-primary-800">
                Empresas Previsoes
              </p>
              <p class="font-semibold text-primary-800">
                <span class="text-neutral-800 font-normal text-neutral-700"
                  >• Relatório de Empresas Previsões Congelada Ativas e em
                  Abertura
                </span>
              </p>
            </div>
          </div>
        </div>
      </Card>
      <Card
        class="font-body cursor-pointer"
        color="primary-500"
        @click.native="exportRelatorio('cliente-faturados')"
      >
        <div>
          <div class="p-6 flex items-start">
            <div class="flex flex-col ml-4">
              <p class="font-semibold pb-4 text-primary-800">
                Relatorio Empresas Carteira Faturas
              </p>
              <p class="font-semibold text-primary-800">
                <span class="text-neutral-800 font-normal text-neutral-700"
                  >• Relatório de Empresas Divididas por carteira trazendo as ultimas 6 faturas
                </span>
              </p>
            </div>
          </div>
        </div>
      </Card>
      <Card
        class="font-body cursor-pointer"
        color="primary-500"
        @click.native="getUsers()"
      >
        <div>
          <div class="p-6 flex items-start">
            <div class="flex flex-col ml-4">
              <p class="font-semibold pb-4 text-primary-800">
                Empresas Comissões
              </p>
              <p class="font-semibold text-primary-800">
                <span class="text-neutral-800 font-normal text-neutral-700"
                  >• Relatório de Comissõe Dos Vendedores
                </span>
              </p>
            </div>
          </div>
        </div>
      </Card>
      <Card
        class="font-body cursor-pointer"
        color="primary-500"
        @click.native="exportRelatorio('comissoes/excongelados')"
      >
        <div>
          <div class="p-6 flex items-start">
            <div class="flex flex-col ml-4">
              <p class="font-semibold pb-4 text-primary-800">
                Empresas Comissões dos que congelaram mas voltaram
              </p>
              <p class="font-semibold text-primary-800">
                <span class="text-neutral-800 font-normal text-neutral-700"
                  >• Relatório de Comissõe Dos Vendedores
                </span>
              </p>
            </div>
          </div>
        </div>
      </Card>
        <Card
        class="font-body cursor-pointer"
        color="primary-500"
        @click.native="deondevem = true"
      >
        <div>
          <div class="p-6 flex items-start">
            <div class="flex flex-col ml-4">
              <p class="font-semibold pb-4 text-primary-800">
                 Relatório Financeiro Receita do Mes
              </p>
              <p class="font-semibold text-primary-800">
                <span class="text-neutral-800 font-normal text-neutral-700"
                  >•    Relatório Financeiro Valores de cada Tipo Cobrança
                </span>
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
    <b-modal :active.sync="comissao" v-b-modal.modal-lg can-cancel>
      <div class="modal-body bg-neutral-300 shadow p-10" style="height: 620px">
        <Lynx-Title text="Exportar" />
        <h2 class="pb-8 text-xl font-display text-primary-700">
          Relatório de Comissõe Dos Vendedores
        </h2>
        <div class="flex flex-wrap">
          <div class="w-full flex">
            <label class="flex flex-col w-1/3 pr-4">
              <Lynx-Label label="Competencia" />
              <b-datepicker
                placeholder="Informe uma data de competencia"
                icon="calendar-today"
                type="month"
                :month-names="monthNames"
                :day-names="dayNames"
                v-model="form.data_competencia"
              />
            </label>
            <label class="flex flex-col w-1/2 pb-6 pr-3">
              <Lynx-Label label="Usuarios" />

              <treeselect
                :multiple="false"
                :options="lista_usuarios"
                placeholder="Selecione os usuarios..."
                v-model="usuario"
              />
            </label>
          </div>
          <Lynx-Button
            text="gerar"
            class="mr-2"
            @click.native="comissaoRelatorio()"
          />
        </div>
      </div>
    </b-modal>
       <b-modal :active.sync="deondevem" v-b-modal.modal-lg can-cancel>
      <div class="modal-body bg-neutral-300 shadow p-10" style="height: 520px">
        <Lynx-Title text="Exportar" />
        <h2 class="pb-8 text-xl font-display text-primary-700">
          Relatório Financeiro Valores de cada Tipo Cobrança
        </h2>
        <div class="flex flex-wrap">
          <div class="w-full flex">
            <label class="flex flex-col w-1/3 pr-4">
              <Lynx-Label label="Competencia" />
              <b-datepicker
                placeholder="Informe uma data de competencia"
                icon="calendar-today"
                type="month"
                :month-names="monthNames"
                :day-names="dayNames"
                v-model="form.data_competencia"
              />
            </label>
         
          </div>
          <Lynx-Button
            text="gerar"
            class="mr-2 mt-3"
            @click.native="deondevemRelatorio()"
          />
        </div>
      </div>
    </b-modal> <b-modal :active.sync="baixadosmodel" v-b-modal.modal-lg can-cancel>
      <div class="modal-body bg-neutral-300 shadow p-10" style="height: 520px">
        <Lynx-Title text="Exportar" />
        <h2 class="pb-8 text-xl font-display text-primary-700">
          Relatório Baixados 
        </h2>
        <div class="flex flex-wrap">
          <div class="w-full flex">
            <label class="flex flex-col w-1/2 pr-3 pb-6">
          <Lynx-Label
            label="Data de Início"
          />
          <b-datepicker
          size="sm"
            v-model="form.data_inicial"
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
        <label class="flex flex-col w-1/2 pl-3 pb-6">
          <Lynx-Label
            label="Data de final"
          />
          <b-datepicker
            calendar-width="100%"
               menu-class="w-100"
            v-model="form.data_final"
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
          <Lynx-Button
            text="gerar"
            class="mr-2 mt-3"
            @click.native="canceladosRelatorio()"
          />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Card from "@/components/helpers/Card";
import moment from "moment";
import { monthNames, dayNames } from "@/utils/utils";
import Treeselect from "@riophae/vue-treeselect";
import { usersRequest } from "@/services/requests/users";
import { formatBrToEn } from '../../utils/momentHelpers';

export default {
  components: { Card, Treeselect },
  name: "index",
  data() {
    return {
      lista_usuarios: null,
      monthNames,
      dayNames,
      moment,
      deondevem:false,
      baixadosmodel:false,

      comissao: false,
      loading: false,
      emissor: false,
      irpf: false,
      docieIrpf: false,
      ano: null,
      cliente: null,
      usuario: null,
      form: {
        data_competencia: new Date(),
        usuario: {},
      },
    };
  },
  computed: {},
  created() {
    // this.listar_carteiras()
  },
  methods: {
    getUsers() {
      usersRequest().then(({ data: { data } }) => {
        let arrayNew = [];
        for (let i = 0; i < data.length; i++) {
          arrayNew.push({ id: data[i].id, label: data[i].nome_completo });
        }
        this.lista_usuarios = arrayNew;
      });
      this.comissao = true;
    },
    //   listar_carteiras() {
    //   this.$store.dispatch("carteira/listar_carteiras");
    // },
    async congelados() {
      this.loading = true;

      await this.$store.dispatch("finanRelatorio/gerarRelatorioCongelados");
      this.loading = false;
    },
    
    async semcrm() {
      this.loading = true;

      await this.$store.dispatch("finanRelatorio/gerarRelatorioEmpresaSemCrm");
      this.loading = false;
    },
    async semAlvara() {
      this.loading = true;

      await this.$store.dispatch(
        "finanRelatorio/gerarRelatorioEmpresaSemAlvara"
      );
      this.loading = false;
    },
    async semContrato() {
      this.loading = true;

      await this.$store.dispatch(
        "finanRelatorio/gerarRelatorioEmpresaSemContrato"
      );
      this.loading = false;
    },

    async ClienteXFatura() {
      this.loading = true;

      await this.$store.dispatch("finanRelatorio/gerarRelatorioClienteXFatura");
      this.loading = false;
    },
    async ClienteXFaturaCartao() {
      this.loading = true;

      await this.$store.dispatch(
        "finanRelatorio/gerarRelatorioClienteXFaturaCartao"
      );
      this.loading = false;
    },
    async comissaoRelatorio() {
      this.loading = true;
      this.form.usuario = this.usuario ?? {};

      await this.$store.dispatch(
        "finanRelatorio/gerarRelatorioComissao",
        this.form
      );
      this.loading = false;
    },
       async deondevemRelatorio() {
      this.loading = true;
   
   console.log(formatBrToEn(this.form.data_competencia))
 window.open(
        `${process.env.VUE_APP_API_URL}/relatorio/financeiro/valores` +
        
          `?token=${this.$store.getters.getToken}&date=${formatBrToEn(this.form.data_competencia)}`,
        "_blank"
      );
    
      this.loading = false;
    },
          async canceladosRelatorio() {
      this.loading = true;
   
  //  console.log(formatBrToEn(this.form.data_competencia))
 window.open(
        `${process.env.VUE_APP_API_URL}/relatorio/cancelados` +
        
          `?token=${this.$store.getters.getToken}&data_inicial=${formatBrToEn(this.form.data_inicial)}&data_final=${formatBrToEn(this.form.data_final)}`,
        "_blank"
      );
    
      this.loading = false;
    },
    
    
    exportRelatorio(nome) {
      window.open(
        `${process.env.VUE_APP_API_URL}/relatorio/` +
          nome +
          `?token=${this.$store.getters.getToken}`,
        "_blank"
      );
    },
  },
};
</script>

<style scoped>
</style>
