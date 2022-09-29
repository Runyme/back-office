<template>
  <div class="p-8 bg-neutral-300">
    <Lynx-Title text="Atribuir guia a uma empresa" />
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
          v-model.trim="$v.form.empresa.$model"
        />
      </label>
      <label class="flex flex-col w-full pb-8">
        <Lynx-Label
          label="Tipo de guia"
          :validator="$v.form.tipo"
          :validations-message="validationsMessage.form.tipo"
        />
        <b-select
          placeholder="Selecione um tipo de guia"
          :error="$v.form.tipo.$error"
          v-model.trim="$v.form.tipo.$model"
        >
          <option v-for="(tipo, index) in tiposGuias" :value="tipo" :key="index">{{ tipo }}</option>
        </b-select>
      </label>
      <label class="flex flex-col w-full pb-8">
        <Lynx-Label
          label="Valor da guia"
          :validator="$v.form.valor"
          :validations-message="validationsMessage.form.valor"
        />
        <InputMoney
          placeholder="Digite um valor"
          :error="$v.form.valor.$error"
          v-model="$v.form.valor.$model"
        />
      </label>
      <label class="flex flex-col w-full pb-8">
        <Lynx-Label label="Guia"/>
        <a class="underline font-bold text-primary-600" :href="guia.url" target="_blank">{{ guia.nome }}</a>
      </label>
      <Lynx-Button class="self-end" type="submit" text="Salvar" icon="Check" :loading="loadingButton"/>
    </form>
  </div>
</template>

<script>

import { required } from 'vuelidate/lib/validators'
import InputMoney from '@/components/helpers/InputMoney'
import { tiposGuiasRequest, createGuiaRequest } from '@/services/requests/guias'
import { mapGetters } from 'vuex'

export default {
  name: 'GuiaNaoProcessadaDetail',
  components: { InputMoney, },
  props: {
    open: Boolean,
    guia: Object,
  },
  data() {
    return {
      form: {
        empresa: '',
        tipo: '',
        valor: '',
      },
      tiposGuias: [],
      validationsMessage: {
        form: {
          empresa: {
            required: 'Insira uma empresa'
          },
          tipo: {
            required: 'Selecione um tipo'
          },
          valor: {
            required: 'Digite um valor'
          },
        }
      },
      loadingButton: false,
    }
  },
  computed: {
    ...mapGetters(['getCompetenciaDate']),
  },
  validations() {
    return {
      form: {
        empresa: { required },
        tipo: { required },
        valor: { required },
      }
    }
  },
  mounted() {
    this.fetchTiposGuias()
  },
  methods: {
    fetchTiposGuias() {
      tiposGuiasRequest()
        .then(res => this.tiposGuias = res.data.data)
    },
    onSubmit() {
      if(this.$v.$invalid) return this.$snack.error('Preencha o formulário corretamente.')
      this.loadingButton = true;
      const data = this.form;
      data.file_id = this.guia.id;
      data.competencia = this.getCompetenciaDate;
      createGuiaRequest(data)
        .then(() => {
          this.$snack.success('Guia criada com sucesso.')
          this.$emit('createdGuia', this.guia)
        })
        .catch(err => this.$snack.error(err.response.data.message || err.message))
        .finally(() => {
          this.loadingButton = false
          this.closeGuiaDetail()
        })
    },
    closeGuiaDetail() {
      this.$emit('onClose')
    }
  }
}
</script>
