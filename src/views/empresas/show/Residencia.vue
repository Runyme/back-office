<template>
  <div class="bg-neutral-300 p-10 mt-4" style="height:610px;">
    <Lynx-Title text="Cadastro de Residência Médica" />
    <h2 class="pb-8 text-xl font-display text-primary-700">
      {{ this.getEmpresa.id }} | {{ this.getEmpresa.razao_social }}
    </h2>
    <div class="w-full flex justify-center" v-if="loading">
      <Lynx-Spinner size="12" />
    </div>
    <form
      class="flex flex-col"
      @submit.prevent="lista_campos == '' ? onSubmit() : update()"
      v-else
    >
      <label class="flex flex-col w-full pb-6">
        <Lynx-Label
          label="Especialidade"
          :validator="$v.form.especialidade"
          :validations-message="validationsMessage.form.especialidade"
        />
        <b-select class="w-full" v-model="form.especialidade">
          <option
            v-for="option in especialidadeOptions"
            :key="option.id"
            :value="option.nome"
            v-text="option.nome"
          />
        </b-select>
      </label>
      <div class="w-full flex">
        <label class="flex flex-col w-1/2 pr-3 pb-6">
          <Lynx-Label
            label="Data de Início"
            :validator="$v.form.data_inicio"
            :validations-message="validationsMessage.form.data_inicio"
          />
          <b-datepicker
          size="sm"
            v-model="form.data_inicio"
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
            label="Data de Conclusão"
            :validator="$v.form.data_conclusao"
            :validations-message="validationsMessage.form.data_conclusao"
          />
          <b-datepicker
            calendar-width="100%"
               menu-class="w-100"
            v-model="form.data_conclusao"
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
      <label class="flex flex-col w-full pb-6">
        <Lynx-Label
          label="Cliente"
          :validator="$v.form.cliente_id"
          :validations-message="validationsMessage.form.cliente_id"
        />
        <b-select class="w-full" v-model="form.cliente_id">
          <option
            v-for="option in socios"
            :key="option.id"
            :value="option.id"
            v-text="option.nome_completo"
          />
        </b-select>
      </label>
      <Input-File text="Comprovante" ref="comprovanteInput" />
      <Lynx-Button
        type="submit"
        :text="lista_campos ==''?'Enviar' : 'Atualizar'"
        icon="Check"
        class="self-end"
        :loading="loadingButton"
      />
    </form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  clienteResidenciaCreateRequest,
  clienteResidenciaEspecialidadesRequest,
  clienteResidenciaUpdateRequest,
} from "@/services/requests/clienteResidencia";
import moment from "moment";
import { required, integer } from "vuelidate/lib/validators";
import formMixin from "@/mixins/form";
import { monthNames, dayNames } from "@/utils/utils";
import InputFile from "@/components/helpers/InputFile";

export default {
  name: "EmpresaShowResidencia",
  mixins: [formMixin],
  props: ["socios"],
  components: { InputFile },
  data() {
    return {
      loadingButton: false,
      loading: false,
      monthNames,
      dayNames,
      especialidadeOptions: [],
      form: {
        especialidade: "",
        data_inicio: new Date(),
        data_conclusao: new Date(),
        cliente_id: "",
      },
      validationsMessage: {
        form: {
          especialidade: { required: "Insira uma especialidade" },
          data_inicio: { required: "Insira uma data de início" },
          data_conclusao: { required: "Insira uma data de conclusão" },
          cliente_id: {
            required: "Insira um cliente",
            integer: "Insira um cliente válido",
          },
        },
      },
    };
  },
  validations: {
    form: {
      especialidade: { required },
      data_inicio: { required },
      data_conclusao: { required },
      cliente_id: { required, integer },
    },
  },

  created() {
    this.preenxerCampos();
  },
  computed: {
    lista_campos() {
      return this.$store.state.configEmpresa.lista_campos;
    },
    ...mapGetters(["getEmpresa"]),
  },
  methods: {
    moment,
    async onSubmit() {
      if (this.$v.form.$invalid) {
        this.snackValidationMessage(this.$v, this.validationsMessage);
        return;
      }
      const comprovanteId = await this.$refs.comprovanteInput.submit();

      if (!comprovanteId) {
        this.$snack.error("Insira um comprovante");
        return;
      }

      const form = {
        empresa_id: this.getEmpresa.id,
        cliente_id: this.form.cliente_id,
        especialidade: this.form.especialidade,
        data_inicio: this.moment(this.form.data_inicio).format("YYYY-MM-DD"),
        data_conclusao: this.moment(this.form.data_conclusao).format(
          "YYYY-MM-DD"
        ),
        comprovante_id: comprovanteId,
      };

      this.loadingButton = true;

      clienteResidenciaCreateRequest(form)
        .then(() => {
          this.$snack.success("Residência médica cadastrada com sucesso");
          this.$emit("set-modal", false);
        })
        .catch(() =>
          this.$snack.error("A residência médica não pdoe ser cadastrada")
        )
        .finally(() => (this.loadingButton = false));
    },

  async  update() {
     if (this.$v.form.$invalid) {
        this.snackValidationMessage(this.$v, this.validationsMessage);
        return;
      }
      const comprovanteId = await this.$refs.comprovanteInput.submit();

      // if (!comprovanteId) {
      //   this.$snack.error("Insira um comprovante");
      //   return;
      // }

      const form = {
        empresa_id: this.getEmpresa.id,
        cliente_id: this.form.cliente_id,
        especialidade: this.form.especialidade,
        data_inicio: this.moment(this.form.data_inicio).format("YYYY-MM-DD"),
        data_conclusao: this.moment(this.form.data_conclusao).format(
          "YYYY-MM-DD"
        ),
        comprovante_id: comprovanteId,
      };

      this.loadingButton = true;

      clienteResidenciaUpdateRequest( this.lista_campos.id ,form)
        .then(() => {
          this.$snack.success("Residência médica cadastrada com sucesso");
          this.$emit("set-modal", false);
        })
        .catch(() =>
          this.$snack.error("A residência médica não pode ser cadastrada")
        )
        .finally(() => (this.loadingButton = false));
    },
    fetchEspecialidades() {
      this.loading = true;
      clienteResidenciaEspecialidadesRequest()
        .then((res) => (this.especialidadeOptions = res.data))
        .finally(() => (this.loading = false));
    },
    async preenxerCampos() {
    
   
      if (this.lista_campos != "") {
        this.form.especialidade = this.lista_campos.especialidade;
        this.form.data_inicio = new Date(this.lista_campos.data_inicio)
        this.form.data_conclusao =new Date(this.lista_campos.data_conclusao);
        this.form.cliente_id = this.lista_campos.cliente_id;
      }
    },
  },
  beforeMount() {
    this.fetchEspecialidades();
  },
};
</script>
