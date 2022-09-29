<template>
  <div class="bg-neutral-300 shadow p-8">
    <Lynx-Title text="Congelamento"/>
    <h2 class="pb-8 text-xl font-display text-primary-700">{{this.getEmpresa.id}} | {{this.getEmpresa.razao_social}}</h2>
    <form class="flex flex-col" @submit.prevent="onSubmit">
      <label class="flex flex-col w-full pb-6">
        <Lynx-Label
          label="Data de Competencia"
          :validator="$v.form.data_competencia"
          :validations-message="validationsMessage.form.data_competencia"
        />
        <b-datepicker
          v-model="form.data_competencia"
          type="month"
          placeholder="Selecione uma data"
          :date-formatter="date => moment(date, 'YYYY/MM').format('MM/YYYY')"
          :date-parser="date => new Date(date)"
          :month-names="monthNames"
          :years-range="[-20, 10]"
        />
      </label>
      <div v-if="!getEmpresa.congelada">
        <label class="flex flex-col w-full pb-6">
          <Lynx-Label
            label="Motivo"
            :validator="$v.form.motivo_congelamento"
            :validations-message="validationsMessage.form.motivo_congelamento"
          />
          <b-select class="w-full" v-model="form.motivo_congelamento">
            <option
              v-for="option in motivo_options"
              :key="option.id"
              :value="option.value"
              v-text="option.value"
            />
          </b-select>
        </label>

        <label class="lex flex-col w-full pb-6">
          <Lynx-Label
            label="Data de Congelamento"
            :validator="$v.form.freeze_date"
            :validations-message="validationsMessage.form.freeze_date"
          />

          <b-datepicker
            v-model="form.freeze_date"
            placeholder="Selecione uma data"
            :date-formatter="date => moment(date, 'YYYY/MM/DD').format('DD/MM/YYYY')"
            :date-parser="date => new Date(date)"
            :month-names="monthNames"
            :day-names="dayNames"
            :years-range="[-20, 10]"
          />
        </label>

        <label class="flex flex-col w-full pb-6">
          <Lynx-Label
            label="Previsão de retorno"
            :validator="$v.form.previsao_retorno"
            :validations-message="validationsMessage.form.previsao_retorno"
          />
          <b-datepicker
            v-model="form.previsao_retorno"
            type="month"
            placeholder="Selecione uma data"
            :date-formatter="date => moment(date, 'YYYY/MM').format('MM/YYYY')"
            :date-parser="date => new Date(date)"
            :month-names="monthNames"
            :years-range="[-20, 10]"
            position="is-top-right"
          />
        </label>

      </div>
      <Lynx-Button type="submit" text="Enviar" icon="Check" class="self-end" :loading="loadingButton"/>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { empresasCongelamentoRequest } from '@/services/requests/empresas'
import moment from 'moment'
import { required, requiredIf } from 'vuelidate/lib/validators'
import formMixin from '@/mixins/form'
import { monthNames } from '@/utils/utils'

export default {
  name: 'EmpresaShowCongelamento',
  mixins: [formMixin],
  data() {
    return {
      loadingButton: false,
      monthNames,
      motivo_options: [
        { value: 'Mais Médicos' },
        { value: 'CLT' },
        { value: 'Outro' },
      ],
      form: {
        data_competencia: new Date(),
        motivo_congelamento: '',
        previsao_retorno: new Date(),
        freeze_date: new Date()
      },
      validationsMessage: {
        form: {
          data_competencia: { required: 'Insira a data de competência' },
          motivo_congelamento: { required: 'Insira o motivo do congelamento' },
          previsao_retorno: { required: 'Insira a previsão de retorno' },
          freeze_date: {required: 'Insira a previsão de retorno'}
        }
      }
    }
  },
  validations() {
    return {
      form: {
        data_competencia: { required },
        motivo_congelamento: {
          required: requiredIf(() => !this.getEmpresa.congelada)
        },
        previsao_retorno: {
          required: requiredIf(() => !this.getEmpresa.congelada)
        },
        freeze_date: { required }
      }
    }
  },
  computed: {
    ...mapGetters(['getEmpresa']),
    errorMessage() {
      return this.getEmpresa.congelada ? 'Não foi possível descongelar a empresa' : 'Não foi possível congelar a empresa'
    },
    successMessage() {
      return this.getEmpresa.congelada ? 'Empresa descongelada com sucesso' : 'Empresa congelada com sucesso'
    },
  },
  methods: {
    ...mapActions(['setEmpresa']),
    moment,
    onSubmit() {
      if(this.$v.form.$invalid) {
        this.snackValidationMessage(this.$v, this.validationsMessage)
        return
      }
      const form = {
        empresa_id: this.getEmpresa.id,
        data_competencia: this.moment(this.form.data_competencia).format('YYYY-MM-01'),
        freeze_date: this.moment(this.form.freeze_date).format('YYYY-MM-DD')

      }
      if(!this.getEmpresa.congelada) {
        form.previsao_retorno = this.moment(this.form.previsao_retorno).format('YYYY-MM-01'),
        form.motivo_congelamento = this.form.motivo_congelamento
      } else {
        form.congelada = true
      }
      this.loadingButton = true
      empresasCongelamentoRequest(this.getEmpresa.id, form)
        .then(res => {
          this.$snack.success(this.successMessage)
          this.$emit('set-modal', false)
          this.setEmpresa(res.data.data)
        })
        .catch(() => this.$snack.error(this.errorMessage))
        .finally(() => this.loadingButton = false)
    }
  },
}
</script>
