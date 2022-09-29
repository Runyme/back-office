<template>
  <div class="bg-neutral-300 shadow p-8">
    <Lynx-Title text="Desativamento"/>
    <h2 class="pb-8 text-xl font-display text-primary-700">{{this.getEmpresa.id}} | {{this.getEmpresa.razao_social}}</h2>
    <div class="w-full flex justify-center" v-if="loading">
      <Lynx-Spinner size="12" />
    </div>
    <form class="flex flex-col" @submit.prevent="onSubmit" v-else>
      <div class="w-full flex">
        <label class="flex flex-col w-1/2 pb-6 pr-3">
          <Lynx-Label
            label="Data de Competencia"
            :validator="$v.form.data_competencia"
            :validations-message="validationsMessage.form.data_competencia"
          />
          <b-datepicker
            v-model="form.data_competencia"
            placeholder="Selecione uma data"
            :date-formatter="date => moment(date, 'YYYY/MM/DD').format('DD/MM/YYYY')"
            :date-parser="date => new Date(date)"
            :month-names="monthNames"
            :day-names="dayNames"
            :years-range="[-20, 10]"
          />
        </label>

        <label class="flex flex-col w-1/2 pb-6 pr-3">
          <Lynx-Label
            label="Data de Encerramento"
            :validator="$v.form.data_encerramento"
            :validations-message="validationsMessage.form.data_encerramento"
          />

          <b-datepicker
            v-model="form.data_encerramento"
            placeholder="Selecione uma data"
            :date-formatter="date => moment(date, 'YYYY/MM/DD').format('DD/MM/YYYY')"
            :date-parser="date => new Date(date)"
            :month-names="monthNames"
            :day-names="dayNames"
            :years-range="[-20, 10]"
          />
        </label>
      </div>

      <label class="flex flex-col pb-6">
        <Lynx-Label
          label="Motivo"
          
          :validator="$v.form.motivo_desativamento"
          :validations-message="validationsMessage.form.motivo_desativamento"
        />
        <b-select class="w-full" v-model="form.motivo_desativamento">
          <option
            v-for="option in motivosOptions"
            :key="option.id"
            :value="option.motivo"
            v-text="option.motivo"
          />
        </b-select>
      </label>

      <label class="flex flex-col pb-6">
        <Lynx-Label
          label="Descrição"
          :validator="$v.form.data_competencia"
          :validations-message="validationsMessage.form.descricao"
        />
        <Lynx-Textarea v-model="form.descricao"/>
      </label>

      <Input-File  text="Carta de transferência" ref="cartaDeTrasferenciaInput"/>


      <Lynx-Button 
  
      type="submit" text="Desativar" color="error-base" class="self-end" :loading="loadingButton"/>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { empresasDesativamentoRequest, empresasMotivosDesativamentoRequest } from '@/services/requests/empresas'
import moment from 'moment'
import { required } from 'vuelidate/lib/validators'
import formMixin from '@/mixins/form'
import { monthNames, dayNames } from '@/utils/utils'
import LynxTextarea from '@/components/helpers/Textarea'
import InputFile from '@/components/helpers/InputFile'

export default {
  name: 'EmpresaShowDesativamento',
  mixins: [formMixin],
  components: { LynxTextarea, InputFile },
  data() {
    return {
      loading: false,
      loadingButton: false,
      monthNames,
      dayNames,
      motivosOptions: [],
      form: {
        data_competencia: new Date(),
        data_encerramento: new Date(),
        motivo_desativamento: '',
        descricao: '',
        file: null
      },
      validationsMessage: {
        form: {
          data_competencia: { required: 'Insira a data de competência do desativamento' },
          motivo_desativamento: { required: 'Insira o motivo do desativamento' },
        }
      }
    }
  },
  validations: {
    form: {
      data_competencia: { required },
      motivo_desativamento: { required },
    }
  },
  computed: {
    ...mapGetters(['getEmpresa']),
  },


  methods: {
    ...mapActions(['setEmpresa']),
    moment,
   async onSubmit() {

     
      if(this.$v.form.$invalid) {
        this.snackValidationMessage(this.$v, this.validationsMessage)
        return
      }

        if(this.form.motivo_desativamento ==  'Baixa da empresa' ? this.form.descricao !='' ? false:true:false ) {
      this.$snack.error('Informe o Motivo da Baixa no Campo Descrição')
        return
      }

// console.log(this.form.motivo_desativamento )
   



     const cartaDeTrasferenciaId = await this.$refs.cartaDeTrasferenciaInput.submit()
     this.file = cartaDeTrasferenciaId

         if(this.form.motivo_desativamento ==  'Transferecia outro contador' ? this.file != null ? false:true:false) {
      this.$snack.error('Obrigatoio Anexar a Carta de Transferencia')
        return
      }

     this.$buefy.dialog.confirm({
        message: 'Deseja realmente desativar?',
        confirmText: 'Desativar',
        cancelText: 'Cancelar',
        type: 'is-danger',
        onConfirm: () => this.desativarEmpresa()
      })
    },

    desativarEmpresa() {
      const form = {
        data_competencia: this.moment(this.form.data_competencia).format('YYYY-MM-01'),
        data_encerramento: this.moment(this.form.data_encerramento).format('YYYY-MM-DD'),
        motivo: this.form.motivo_desativamento,
        descricao: this.form.descricao,
        file: this.file ?? null,
      }


      this.loadingButton = true
      console.log(form)
     empresasDesativamentoRequest(this.getEmpresa.id, form)
        .then(() => {
          this.$router.push({ name: 'empresas.index'})
          this.$snack.success('Empresa desativda com sucesso')
        })
        .catch(() => this.$snack.error('Não foi possível desativar a empresa'))
        .finally(() => this.loadingButton = false)
    },
    fetchMotivosDesativamento() {
      this.loading = true
      empresasMotivosDesativamentoRequest()
        .then(res => this.motivosOptions = res.data)
        .finally(() => this.loading = false)
    }
  },
  beforeMount() {
    this.fetchMotivosDesativamento()
  }
}
</script>
