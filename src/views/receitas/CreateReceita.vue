<template>
  <div class="bg-neutral-300 p-8">
    <Lynx-Title text="Criar Prolabore" />
    <form class="flex flex-col" @submit.prevent="onSubmit">
      <label class="flex flex-col w-full pb-8">
        <Lynx-Label
          label="Empresa"
          :validator="$v.form.empresa"
          :validations-message="validationsMessage.form.empresa"
        />
        <Lynx-Input
          placeholder="Digite o ID da empresa"
          :error="$v.form.empresa.$error"
          :value="$v.form.empresa.$model"
          @input="inputEmpresa"
        />
      </label>
      <div class="w-full flex justify-center pb-8" v-if="loadingSocios">
        <Lynx-Spinner size="24"/>
      </div>
      <div class="flex flex-col" v-else>
        <div class="flex flex-col w-full pb-8" v-for="(socio, index) in socios" :key="index">
          <Lynx-Label :label="socio.nome_completo" />
          <InputMoney
            placeholder="Valor do Prolabore"
            v-model="socio.prolabore"
          />
        </div>
      </div>
      <Lynx-Button class="self-end" type="submit" text="Salvar" icon="Check" :loading="loadingButton"/>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import InputMoney from '@/components/helpers/InputMoney'
import { createReceitaRequest } from '@/services/requests/receitas'
import { empresasSociosRequest } from '@/services/requests/empresas'
import debounce from '@/mixins/debounce'

export default {
  name: 'CreateReceita',
  mixins: [ debounce ],
  components: { InputMoney, },
  data() {
    return {
      form: {
        empresa: '',
      },
      validationsMessage: {
        form: {
          empresa: {
            required: 'Insira uma Empresa'
          },
        }
      },
      loadingButton: false,
      socios: [],
      loadingSocios: false,
    }
  },
  computed: {
    ...mapGetters(['getCompetenciaDate']),
  },
  validations() {
    return {
      form: {
        empresa: { required },
      },
    }
  },
  methods: {
    closeModal() {
      this.$emit('onClose')
    },
    fetchSocios() {
      this.loadingSocios = true
      empresasSociosRequest(this.form.empresa)
        .then(res => this.socios = res.data.data)
        .catch(err => this.$snack.error(err.response.data.message || err.message))
        .finally(() => this.loadingSocios = false)
    },
    inputEmpresa(value) {
      if (value.length < 2) return
      const self = this
      this.debounce(function () {
        if (value.length > 1) self.fetchSocios()
      }, 700)
      this.form.empresa = value
    },
    onSubmit() {
      if(this.$v.$invalid) return this.$snack.error('Preencha o formulário corretamente.')
      this.loadingButton = true
      const data = {
        empresa: this.form.empresa,
        competencia: this.getCompetenciaDate,
        socios: this.socios.map(({ id, prolabore }) => ({ id, prolabore })),
      }
      createReceitaRequest(data)
        .then(() => {
          this.$snack.success('Receita criada com sucesso.')
          this.$emit('createdReceita')
        })
        .catch(err => this.$snack.error(err.response.data.message || err.message))
        .finally(() => {
          this.loadingButton = false
          this.closeModal()
        })
    }
  }
}
</script>
