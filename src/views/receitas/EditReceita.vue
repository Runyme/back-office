<template>
  <div class="bg-neutral-300 p-8">
    <Lynx-Title text="Editar Receita" />
    <div class="flex flex-col">
      <form class="flex flex-col" @submit.prevent="editReceita">
        <div class="flex flex-col">
          <h2 class="font-bold text-primary-600 text-xl pb-4">Receita Atual</h2>
          <a class="text-primary-700 underline pb-4" v-if="receita.arquivo_id" :href="receita.arquivo_id | guiaLink" target="_blank">
            Visualizar Receita
          </a>
          <div class="flex flex-row">
            <div class="flex flex-col w-full pb-8">
              <Lynx-Label class="text-xl" label="Empresa" />
              <span>{{ receita.empresa_id }}</span>
            </div>
            <div class="flex flex-col w-full ml-5 pb-8">
              <Lynx-Label class="text-xl" label="Sócio" />
              <span>{{ receita.cliente_nome }}</span>
            </div>
            <div class="flex flex-col w-full ml-5 pb-8">
              <Lynx-Label class="text-xl" label="Competência" />
              <span>{{ receita.competencia_atual | labelDate }}</span>
            </div>
          </div>
          <div class="flex flex-row">
            <div class="flex flex-col w-full pb-8">
              <Lynx-Label class="text-xl" label="INSS/CPP" />
              <span>{{ receita.inss | money }}</span>
            </div>
            <div class="flex flex-col w-full ml-5 pb-8">
              <Lynx-Label class="text-xl" label="Fator R" />
              <span>{{ receita.fator_r | fatorR }}</span>
            </div>
            <div class="flex flex-col w-full ml-5 pb-8">
              <Lynx-Label class="text-xl" label="Prolabore" />
              <InputMoney v-model="prolabore" />
            </div>
          </div>
        </div>
        <div v-if="receitaAnterior" class="flex flex-col">
          <h2 class="font-bold text-neutral-700 text-xl pb-4">Receita Anterior</h2>
          <div class="flex flex-row">
            <div class="flex flex-col w-full pb-8">
              <Lynx-Label class="text-xl" label="Empresa" />
              <span>{{ receitaAnterior.empresa_id || '' }}</span>
            </div>
            <div class="flex flex-col w-full ml-5 pb-8">
              <Lynx-Label class="text-xl" label="Sócio" />
              <span>{{ receitaAnterior.cliente.nome_completo }}</span>
            </div>
            <div class="flex flex-col w-full ml-5 pb-8">
              <Lynx-Label class="text-xl" label="Competência" />
              <span>{{ receitaAnterior.data_competencia | labelDate }}</span>
            </div>
          </div>
          <div class="flex flex-row">
            <div class="flex flex-col w-full pb-8">
              <Lynx-Label class="text-xl" label="INSS/CPP" />
              <span>{{ receitaAnterior.inss | money }}</span>
            </div>
            <div class="flex flex-col w-full ml-5 pb-8">
              <Lynx-Label class="text-xl" label="Fator R" />
              <span>{{ receitaAnterior.fator_r | fatorR }}</span>
            </div>
            <div class="flex flex-col w-full ml-5 pb-8">
              <Lynx-Label class="text-xl" label="Prolabore" />
              <span>{{ receitaAnterior.prolabore | money }}</span>
            </div>
          </div>
        </div>
        <Lynx-Button class="self-end" type="submit" text="Salvar" icon="Check" :loading="loadingButton"/>
      </form>
    </div>
  </div>
</template>

<script>

import { editReceitaRequest } from '@/services/requests/receitas'
import moment from 'moment'
import InputMoney from '@/components/helpers/InputMoney'
import { mapGetters } from 'vuex'

export default {
  name: 'EditReceita',
  components: { InputMoney, },
  props: {
    open: Boolean,
    receita: Object,
    receitaAnterior: Object,
  },
  data() {
    return {
      loadingButton: false,
      prolabore: '',
    }
  },
  mounted() {
    this.prolabore = this.receita.prolabore_atual
  },
  filters: {
    labelDate: val => moment(val).format('MM/YYYY'),
    money: val => val ? 'R$ ' + val.replace('.', ',') : 'N/A',
    fatorR: val => val ? val : 'N/A',
    guiaLink: val => `${process.env.VUE_APP_API_URL}/arquivos/${val}/open?token=${localStorage.getItem('lynx-token')}`,
  },
  computed: {
    ...mapGetters(['getToken'])
  },
  methods: {
    editReceita() {
      this.loadingButton = true
      const { receita, prolabore } = this
      editReceitaRequest(receita.id, { prolabore })
        .then(res => {
          this.receita.prolabore_atual = this.prolabore.toFixed(2)
          this.$snack.success(res.data.message)
        })
        .finally(() => this.loadingButton = false)
    },
  }
}
</script>

