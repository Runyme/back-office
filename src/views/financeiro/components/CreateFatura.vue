<template>
  <div class="bg-neutral-300 p-8">
    <Lynx-Title text="Criar Fatura" />
      <Lynx-Button
          v-show="this.form.payer_id"
        text="Selecionar inadiplentes"
        icon="Money"
        size="small"
        icon-size="4"
        class="mb-3"
        @click.native="financeiroModalOpened = true"
        
      />
     
    <form class="flex flex-col" @submit.prevent="salvar">
      <div class="flex pb-4">
        <b-radio v-model="form.payer_type" native-value="empresa" class="pr-4">
          Pessoa Jurídica
        </b-radio>
        <b-radio v-model="form.payer_type" native-value="cliente">
          Pessoa física
        </b-radio>
      </div>
      <label v-if="this.currentFatura" class="flex flex-col pb-2">
        <Lynx-Label
          :label="this.currentFatura ? this.currentFatura.payer_type : ''"
        />
        <Lynx-Input disabled v-model="payer" />
      </label>

      <label
        v-show="!currentFatura"
        class="flex flex-col pb-4"
        v-if="form.payer_type === 'empresa'"
      >
        <Lynx-Label label="Empresa" />
        <b-autocomplete
          :data="filteredEmpresas"
          placeholder="Pesquise uma empresa"
          field="empresa"
          :loading="isFetching"
          @input="getAsyncEmpresa"
          @select="(option) => (form.payer_id = option.id)"
        />
      </label>

      <label v-show="!currentFatura" class="flex flex-col pb-2" v-else>
        <Lynx-Label label="Cliente" />
        <b-autocomplete
          :data="filteredClientes"
          placeholder="Pesquise um Cliente"
          field="cliente"
          :loading="isFetching"
          @input="getAsyncCliente"
          @select="(option) => (form.payer_id = option.id)"
        />
      </label>

      <div class="flex pb-4">
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
        <label class="flex flex-col w-1/3 pr-4">
          <Lynx-Label label="Vencimento" />
          <b-datepicker
            placeholder="Informe uma data de vencimento"
            icon="calendar-today"
            :month-names="monthNames"
            :day-names="dayNames"
            :min-date="new Date(new Date() - 1 * 86400000)"
            v-model="form.data_vencimento"
            @input="calcjuros"
          />
        </label>
        <label class="flex flex-col w-1/3 pl-4">
          <Lynx-Label label="Tipo de cobrança" />
          <b-select
            placeholder="Selecione um tipo"
            v-model="tipo_cobranca"
            @input="getvalueforstatus"
          >
            <option
              v-for="(option, key) in lista_tipo_cobrancas"
              :value="key"
              :key="key"
              v-text="option.nome"
              v-show="
                form.payer_type == option.payer_type || !option.payer_type
              "
            />
          </b-select>
        </label>
      </div>

      <label class="flex flex-col w-2/3 pb-4" v-show="tipo_cobranca == 2">
        <Lynx-Label label="Quantidade de Parcelar que faltou" />
        <Lynx-Input @input="calcMultaResiroria" v-model="QuantParcelasFatura" />
      </label>
      <Lynx-Button
      v-show="!financeiroModalOpened"
        text="Adicionar Fatura"
        icon="Plus"
        size="small"
        icon-size="4"
        @click.native="addFatura"
        class="self-start mb-10"
        type="button"
      />
        
      <!-- <Lynx-Button
        text="Lista Adicionais"
        icon="Plus"
        size="small"
        icon-size="4"
        @click.native="listar_adicionais"
        class="self-start mb-10"
        type="button"
      /> -->
      <div
        class="flex flex-col pb-4"
        v-for="(item, key) in form.items"
        :key="key"
      >
        <div class="flex justify-between items-center pb-4">
          <h3 class="text-primary-600 text-2xl">Nova Fatura</h3>
          <a
            href="#"
            class="
              p-1
              bg-error-light
              transition
              hover:bg-error-base
              rounded-full
            "
            @click.prevent="removeFatura(key)"
          >
            <Icon-Cross size="3" class="text-neutral-100" />
          </a>
        </div>
        <label class="flex flex-col pb-4">
          <Lynx-Label label="Descrição" />
          <Lynx-Input
            placeholder="Informe uma descrição"
            v-model="item.descricao"
            required
          />
        </label>
        <label class="flex flex-col pb-4">
          <Lynx-Label label="Valor" />
          <InputMoney
            required
            v-model="item.valor"
            @input="(money) => (item.valor = money)"
          ></InputMoney>
        </label>
      </div>
      <Lynx-Button
        :text="!currentFatura ? 'Salvar' : 'atualizar'"
        icon="Check"
        type="submit"
        class="self-end"
        :loading="loadingSubmit"
      />
    </form>
    
       <b-modal :active.sync="financeiroModalOpened">
      <HistoricoFaturaAtrasadas model-type="empresa" :model-id="this.form.payer_id"/>
    </b-modal>
  </div>
</template>

<script>
import {
  searchEmpresasRequest,
  cancelarFaturaRequest,
} from "@/services/requests/empresas";
import debounce from "@/mixins/debounce";
import {
  criarFaturaRequest,
  updateFaturaRequest,
} from "@/services/requests/faturas";
import { dayNames, monthNames } from "@/utils/utils";
import InputMoney from "../../../components/helpers/InputMoney";
import { clientesSearchRequest } from "@/services/requests/clientes";
import HistoricoFaturaAtrasadas from './HistoricoFaturaAtrasadas.vue'
import moment from "moment";

export default {
  mixins: [debounce],
  name: "CreateFatura",
  props: {
    currentFatura: {
      type: Object,
      required: true,
    },
  },
  components: { InputMoney ,HistoricoFaturaAtrasadas},
  data() {
    return {
      financeiroModalOpened:false,
      dayNames,
      monthNames,
      loadingSubmit: false,
      isFetching: false,
      empresas: [],
      clientes: [],
      payer: "",
      QuantParcelasFatura: "",
      tipo_cobranca: null,
      valor_padrao: 0,
      // tipoCobrancaOptions: [
      //   {
      //     id: 1,
      //     nome: "honorario",
      //   },

      //   {
      //     id: 2,
      //     nome: "congelamento",
      //   },
      // ],

      form: {
        payer_id: null,
        payer_type: "empresa",
        data_vencimento: new Date(new Date() - 1 * 86400000),
        data_competencia: new Date(),
        tipo_cobrancas_id: null,
        items: [
          {
            valor: "",
            descricao: "",
          },
        ],
      },
    };
  },
  computed: {
    filteredEmpresas() {
      return this.empresas.map((item) => {
        return {
          id: item.id,
          empresa: `${item.id} - ${item.razao_social}`,
        };
      });
    },
    filteredClientes() {
      return this.clientes.map((item) => {
        return {
          id: item.id,
          cliente: `${item.id} - ${item.nome_completo}`,
        };
      });
    },
    lista_adicionais() {
      return this.$store.state.financeiro.lista_adicionais;
    },
    lista_tipo_cobrancas() {
      return this.$store.state.financeiro.lista_tipo_cobrancas;
    },
    mensagem_alert() {
      return this.$store.state.financeiro.mensagem_alert;
    },
  },
  created() {
    this.listar_tipo_cobrancas();
    this.listar_campos();

    this.$store.dispatch("financeiro/set_campo", "");
  },
  methods: {
    moment,
    handleSubmit() {
      this.loadingSubmit = true;
      if (!this.form.payer_id)
        return this.$snack.error(
          "Por favor, selecione uma empresa/cliente para continuar"
        );
      if (!this.form.data_competencia)
        return this.$snack.error(
          "Por favor, selecione uma competencia para continuar"
        );
      const itemsError = this.form.items.filter(
        (curr) => !curr.valor || !curr.descricao
      );
      if (itemsError.length)
        return this.$snack.error(
          "Por favor, preencha todos os itens das faturas para continuar"
        );
      // if (this.form.payer_type === "cliente") this.form.tipo_cobrancas_id =    ;
      criarFaturaRequest(this.form)
        .then((response) => {
          this.$snack.success(response.data.message);
          this.$emit("on-update-faturas");
        })
        .catch((error) => this.$snack.error(error.response.data.message))
        .finally(() => (this.loadingSubmit = false));
      this.$store.dispatch("financeiro/set_campo", "");
    },
    handleSubmitUpdate() {
      this.loadingSubmit = true;
      if (!this.form.payer_id)
        return this.$snack.error(
          "Por favor, selecione uma empresa/cliente para continuar"
        );
      if (!this.form.data_competencia)
        return this.$snack.error(
          "Por favor, selecione uma competencia para continuar"
        );
      const itemsError = this.form.items.filter(
        (curr) => !curr.valor || !curr.descricao
      );
      if (itemsError.length)
        return this.$snack.error(
          "Por favor, preencha todos os itens das faturas para continuar"
        );
      // if (this.form.payer_type === "cliente") this.form.tipo_cobrancas_id =    ;
      updateFaturaRequest(this.form)
        .then((response) => {
          this.$snack.success(response.data.message);
      this.$emit("on-update-faturas");

        })
        .catch((error) => this.$snack.error(error.response.data.message))
        .finally(() => (this.loadingSubmit = false));
      this.$store.dispatch("financeiro/set_campo", "");
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
    getAsyncCliente(name) {
      if (!name) return;
      let self = this;
      this.debounce(function () {
        self.isFetching = true;
        clientesSearchRequest(name)
          .then((response) => {
            self.clientes = response.data.data;
          })
          .catch((error) => self.$snack.error(error.response.data.message))
          .finally(() => (self.isFetching = false));
      }, 600);
    },
    addFatura() {
      // if (this.lista_adicionais != "") {
      //   this.addAdicionaisFatura();
      // } else {
      const novaFatura = {
        valor: null,
        descricao: null,
      };

      this.form.items.push(novaFatura);
      // }
    },
    removeFatura(index) {
      if (this.form.items.length <= 1)
        return this.$snack.error("É necessário no minimo um item para fatura");
      this.form.items.splice(index, 1);
    },
    async listar_adicionais() {
      let a = {
        payer_id: this.form.payer_id,
        payer_type: this.form.payer_type,
      };
      await this.$store.dispatch("financeiro/listar_adicionais", a);
      this.form.items.push(this.lista_adicionais.faturamento);
      this.form.items.push(this.lista_adicionais.funcionario);
    },
    addAdicionaisFatura() {},

    async getvalueforstatus() {
      this.form.tipo_cobrancas_id =
        this.lista_tipo_cobrancas[this.tipo_cobranca].id;
      if (this.lista_tipo_cobrancas[this.tipo_cobranca].valor == null) {
        await this.$store.dispatch("financeiro/get_value_for_status", {
          payer_id: this.form.payer_id,
          tipo: this.form.tipo_cobrancas_id,
          payer_type: this.form.payer_type,
          data_vencimento: this.moment(this.form.data_vencimento).format("DD"),
          // quant_faltou: this.quant_faltou,
        });

        this.form.items[0].descricao =
          this.$store.state.financeiro.value_for_status.tipo +
          " " +
          this.moment(this.form.data_competencia).format("MM/YYYY");
        this.form.items[0].valor =
          this.$store.state.financeiro.value_for_status.value;
      } else {
        this.form.items[0].descricao =
          this.lista_tipo_cobrancas[this.tipo_cobranca].nome +
          " " +
          this.moment(this.form.data_competencia).format("MM/YYYY");
        this.form.items[0].valor =
          this.lista_tipo_cobrancas[this.tipo_cobranca].valor;
      }
      console.log(this.form);
    },
    async listar_tipo_cobrancas() {
      // if(this.currentFatura){
      // }
      await this.$store
        .dispatch("financeiro/listar_tipo_cobrancas2")
        .finally(() => {
          this.$store.dispatch("configEmpresa/atualizar", "");
        });
    },
    async onCancelarFatura(fatura) {
      await this.$store.dispatch("financeiro/set_fatura_motivo_cancelamento", {
        motivo_cancelamento_id: 4,
        id: fatura.id,
      });
      await this.$emit("on-update-faturas");

      this.$snack.success(this.mensagem_alert.message.message);
    },
    listar_campos() {
      if (this.currentFatura.data_vencimento) {
        this.form.tipo_cobrancas_id = this.currentFatura.tipo_cobrancas_id;

        this.form.id = this.currentFatura.id;
        console.log(this.currentFatura);
        this.tipo_cobranca = 0;

        (this.payer = `${this.currentFatura.payer_id} - ${this.currentFatura.payer_name}`),
          (this.form.payer_id = this.currentFatura.payer_id);

        this.form.data_competencia = new Date(
          this.currentFatura.data_competencia
        );
        this.form.data_competencia.setDate(
          this.form.data_competencia.getDate() + 1
        );

        this.currentFatura.items.forEach((value, index) => {
              this.form.items.push(value);
       
        
          //  if(  value.valor> 9){
          //           this.form.items[index].valor = value.valor.is_integer() ? value.valor+'00' :value.valor  ;
          //  }else{
          //           this.form.items[index].valor = value.valor.is_integer() ?  :
          //  }
        });
        this.form.items.shift()

      }
      console.log(this.form);
    },

    salvar() {
      if (this.currentFatura.data_vencimento) {
        this.atualizarFatura();
        // console.log('novo')
      } else {
        // console.log('atualiza')
        this.handleSubmit();
      }
    },
    atualizarFatura() {
      // console.log(this.currentFatura.id)
      // this.onCancelarFatura(this.currentFatura);

      this.handleSubmitUpdate();
    },
    calcMultaResiroria() {
      this.form.items[0].valor =
        (this.QuantParcelasFatura * this.form.items[0].valor) / 2;
    },
    calcjuros() {
      if (this.currentFatura.data_vencimento < new Date()) {
        let soma = this.moment(this.form.data_vencimento).format("DD/MM/YYYY");
        let soma2 = this.moment(this.currentFatura.data_vencimento).format(
          "DD/MM/YYYY"
        );
        console.log(soma2 + "  " + soma);

        var diff = moment(soma, "DD/MM/YYYY HH:mm:ss").diff(
          moment(soma2, "DD/MM/YYYY HH:mm:ss")
        );
        var dias = Math.round(moment.duration(diff).asDays());
        var mes = parseInt(moment.duration(diff).asMonths());

        console.log(dias); //dia
        console.log(mes); // mes

        var calculo =
          dias * 0.11 +
          (this.currentFatura.subtotal / 30) * dias * 0.1 +
          this.currentFatura.subtotal * 0.02;
        console.log(calculo + this.form.items[0].valor); // mes
        calculo = calculo + this.currentFatura.subtotal * 1;
        this.form.items[0].valor = calculo;
      }
    },
  },
};
</script>
