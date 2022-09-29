<template>
  <form
    class="mt-8 flex flex-col justify-content-between"
    @submit.prevent="updateEmpresa"
  >
    <Icon-BadgeCheck class="text-success-base w-24 h-24 mb-4" />

    <p class="text-xl text-center text-success-dark font-display mb-4">
      Pronto! Essa empresa já tem todos os requesitos para ser ativada!
    </p>

    <label class="block w-full pr-4">
      <Lynx-Label label="Carteira Contabilidade" />

      <b-select
        v-model="form.carteira.contabilidade"
        placeholder="Escolha um carteira"
        required
      >
        <option
          v-for="(option, index) in contabilidade"
          :key="index.id"
          :value="option.id"
        >
          {{ option.nome }}
        </option>
      </b-select>
    </label>

    <label class="block w-full pr-4">
      <Lynx-Label label="Carteira RH" />
      <b-select
        v-model="form.carteira.rh"
        placeholder="Escolha um carteira"
        required
      >
        <option
          v-for="(option, index) in rh"
          :key="index.id"
          :value="option.id"
        >
          {{ option.nome }}
        </option>
      </b-select>
    </label>

    <label class="w-1/6">
        <label class="flex flex-col w-3/3 pr-4">
          <Lynx-Label label="Competencia" />
          <b-datepicker
            placeholder="Informe uma data de competencia"
            icon="calendar-today"
            type="month"
            :month-names="monthNames"
            :day-names="dayNames"
            v-model="data"
              @input="DataContasReceber()"
          />
        </label>
      <!-- <Lynx-Label label="Data Inicial" />
      <b-datepicker
        v-model="data"
        placeholder="Selecione uma data"
        :date-formatter="
          (date) => moment(date, 'YYYY/MM/20').format('20/MM/YYYY')
        "
        :date-parser="(date) => new Date(date)"
        :month-names="monthNames"
        :day-names="dayNames"
        :years-range="[-20, 10]"
        @input="DataContasReceber()"
      /> -->
    </label>

    <p v-if="moment(new Date(data)).format('YYYY-MM-20') <= moment(new Date()).format('YYYY-MM-DD')" class="self-center">
      Escolha uma data de vencimento para desbloquear a Ativação da empresa
    </p>
    <Lynx-Button
      :disabled="moment(new Date(data)).format('YYYY-MM-20') <= moment(new Date()).format('YYYY-MM-DD')  "
      type="submit"
      text="Ativar Empresa"
      icon="Check"
      color="success-base"
      class="self-center"
      :loading="loading"
      :disable="loading"
    />
  </form>
</template>

<script>
import { EmpresaPosCadastroUpdate } from "@/services/requests/empresaPosCadastro";
import {
  SearchCarteirasBySetor,
  SearchCarteirasLike,
} from "@/services/requests/carteiras";
import { required } from "vuelidate/lib/validators";
import moment from "moment";
import { monthNames, dayNames } from "@/utils/utils";
export default {
  name: "StepFinalizar",
  components: {},
  props: ["empresa"],
  data() {
    return {
      ativar:false,
      monthNames,
      dayNames,
      moment,
      data: new Date(new Date() - 1 * 86400000),
      loading: false,
      form: {
        carteira: {
          rh: "",
          contabilidade: "",
        },
      },
      contabilidade: {},
      rh: {},
    };
  },
  computed:{
       mensagem_alert() {
      return this.$store.state.configEmpresa.mensagem_alert;
    },
  },
  mounted() {
    SearchCarteirasLike("contabil").then((res) => {
      this.contabilidade = res.data;
    });

    SearchCarteirasBySetor("rh").then((res) => {
      this.rh = res.data;
    });
  },
  methods: {
    updateEmpresa() {
      this.loading = true;
      EmpresaPosCadastroUpdate(this.empresa.id, this.form)
        .then(() => {
          this.$snack.success("Empresa atualizada com sucesso!");
          this.$emit("updated");
        })
        .catch((error) => {
          const errors = Object.values(error.response.data.errors);
          const message = errors
            .map((item) => item.map((error) => `<li>${error}</li>`).join(""))
            .join("");

          this.$buefy.dialog.alert({
            title: "Não foi possível atualizar a empresa",
            message: `<ul>${message}</ul>`,
            type: "is-danger",
            ariaRole: "alertdialog",
            ariaModal: true,
          });
        })
        .finally(() => (this.loading = false));
    },
   async DataContasReceber() {
     console.log(moment(new Date(this.data)).format('YYYY-MM-20'))
     console.log( moment(new Date()).format('YYYY-MM-DD') )
      if ( moment(new Date(this.data)).format('YYYY-MM-20')>= moment(new Date()).format('YYYY-MM-DD')) {
        var a = {
          payer_id: this.empresa.id,
          data: this.data,
        };
       await this.$store.dispatch("configEmpresa/CreateContasReceberPosCadastro", a);
       console.log(this.mensagem_alert.message)
         this.$snack.success(this.mensagem_alert.message);
      }else{
        // this.data = new Date()
         this.$snack.success("Data não valida ou competencia inferior a atual!");
      }
    },
  },
};
</script>
