<template>
  <div class="bg-neutral-300 shadow p-8">
    <Lynx-Title text="Retencao" />
    <h2 class="pb-8 text-xl font-display text-primary-700">
      {{ this.getEmpresa.id }} | {{ this.getEmpresa.razao_social }}
    </h2>
    <div class="w-full flex justify-center" v-if="loading">
      <Lynx-Spinner size="12" />
    </div>
    <form
      class="flex flex-col"
      @submit.prevent="confirm(!retencao.id ? 'cria' : 'edita')"
      v-else
    >
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
          :validations-message="validationsMessage.form.motivo_retencao_id"
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
        :text="!retencao.id ? 'Reter' : 'atualizar retenção'"
        color="error-base"
        class="self-end"
        :loading="loadingButton"
      />
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import moment from "moment";
import { required } from "vuelidate/lib/validators";
import formMixin from "@/mixins/form";
import { monthNames, dayNames } from "@/utils/utils";
import LynxTextarea from "@/components/helpers/Textarea";
import InputFile from "@/components/helpers/InputFile";

export default {
  name: "EmpresaShowDesativamento",
  mixins: [formMixin],
  components: { LynxTextarea, InputFile },
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
    };
  },
  validations: {
    form: {
      data_retencao: { required },
      motivo_retencao_id: { required },
    },
  },
  computed: {
    ...mapGetters(["getEmpresa"]),
    motivosOptions() {
      return this.$store.state.motivoRetencao.lista_motivo_retencoes;
    },
    mensagem_alert() {
      return this.$store.state.retencao.mensagem_alert;
    },
    retencao() {
      return this.$store.state.retencao.retencao;
    },
  },

  methods: {
    async confirm(tipo) {
      await this.$buefy.dialog.confirm({
        message: `Esta ação  ` + tipo + ` uma  Retenção no sistema?`,
        confirmText: "Sim",
        cancelText: "Não",
        type: "is-success",
        onConfirm: () => {
          if (tipo == "cria") this.reterEmpresa();
          if (tipo == "edita") this.reterEmpresaUpdate();
        },
      });
    },
    ...mapActions(["setEmpresa"]),
    moment,
    async onSubmit() {
      // console.log(this.form.motivo_retencao_id )

      this.$buefy.dialog.confirm({
        message: "Deseja realmente Reter a Empresa?",
        confirmText: "Reter",
        cancelText: "Cancelar",
        type: "is-danger",
        onConfirm: () => this.reterEmpresa(),
      });
    },

   async reterEmpresa() {
      const form = {
        data_retencao: this.moment(this.form.data_retencao).format(
          "YYYY-MM-DD H:m:s"
        ),
        motivo_retencao_id: this.form.motivo_retencao_id,
        descricao: this.form.descricao,
        empresas_id: this.getEmpresa.id,
      };
      this.loadingButton = true;
   await   this.$store
        .dispatch("retencao/create_retencao", form)
        .then(() => {
        // console.log(this.mensagem_alert.message)
        this.$snack.success(this.mensagem_alert.message);
          this.$router.push({ name: "empresas.index" });


        })
        .catch(() => this.$snack.error("Não foi possível reter a empresa"))
        .finally(() => (this.loadingButton = false));
    },
   async reterEmpresaUpdate() {
      const form = {
        data_retencao: this.moment(this.form.data_retencao).format(
          "YYYY-MM-DD H:m:s"
        ),
        id: this.form.id,
        motivo_retencao_id: this.form.motivo_retencao_id,
        descricao: this.form.descricao,
        empresas_id: this.getEmpresa.id,
      };

      this.loadingButton = true;

    await  this.$store
        .dispatch("retencao/update_retencao", form)
        // .then(() => {
          this.$snack.success(this.mensagem_alert.message);
          this.$router.push({ name: "empresas.index" });

        // })
        // .catch(() => this.$snack.error("Não foi possível reter a empresa"))
        // .finally(() => (this.loadingButton = false));
    },

    async listar_motivo_retencoes() {
        this.loading =true 
      this.$store.dispatch("retencao/listar_retencao", this.getEmpresa.id);

      await this.$store.dispatch("motivoRetencao/listar_motivo_retencoes");
        this.loading =false 

      if (this.retencao) {
        let campos = this.retencao;
        this.form.id = campos.id;
        this.form.motivo_retencao_id = campos.motivo_retencao_id;
        this.form.empresas_id = campos.empresas_id;
        this.form.descricao = campos.descricao;
      }
    },
  },
  beforeMount() {
    this.listar_motivo_retencoes();
  },
};
</script>
