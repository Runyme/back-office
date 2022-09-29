<template>
  <div class="p-8 bg-neutral-300">
   <Lynx-Title :text="title" />
   <transition name="fade" mode="out-in">
    <div class="flex w-ful justify-center" v-if="loadingSocios">
      <Lynx-Spinner size="20" />
    </div>
      <form class="flex flex-col " @submit.prevent="onSubmit" v-else>
        <div class="grid grid-cols-2 gap-16">
          <div class="flex flex-col w-full" v-for="(socio, index) in socios" :key="index">
            <h3 class="text-lg font-bold pb-4 text-primary-600" v-text="socio.nome_completo" />
            <div class="flex flex-row">
              <div class="flex flex-col pr-4">
                <Lynx-Label label="Prolabore fixo ?" />
                <b-switch v-model="socio.prolabore_fixo" />
              </div>
              <div class="flex flex-col flex-grow pl-4" v-if="socio.prolabore_fixo">
                <Lynx-Label label="Valor do Prolabore Fixo" />
                <InputMoney placeholder="Valor do Prolabore Fixo" v-model="socio.valor_prolabore_fixo"/>
              </div>
              <div v-else class="flex flex-col flex-grow pl-4">
                <Lynx-Label label="Percentual do Prolabore" />
                <Lynx-Input placeholder="Percentual do Prolabore" type="number" v-model.trim="socio.percentual_prolabore" :min="0" :max="100"/>
              </div>
            </div>
          </div>
        </div>
        <div v-if="errors.length" class="text-error-base pt-8">
          <p v-for="error in errors" :key="error.id" v-text="error" />
        </div>
        <Lynx-Button class="self-end mt-8" type="submit" text="Salvar" icon="Check" :loading="loadingButton"/>
      </form>
   </transition>
  </div>
</template>

<script>

import InputMoney from '@/components/helpers/InputMoney'
import { empresasSociosRequest } from '@/services/requests/empresas'
import { divisaoReceitasRequest } from '@/services/requests/receitas'

export default {
  name: 'DivisaoReceitaEdit',
  components: { InputMoney, },
  props: {
    open: Boolean,
    empresa: Object,
  },
  data() {
    return {
      loadingButton: false,
      loadingSocios: true,
      socios: [],
      errors: [],
    }
  },
  mounted() {
    this.fetchSocios()
  },
  computed: {
    title() {
      return `${this.empresa.id} - ${this.empresa.razao_social}`
    }
  },
  methods: {
    fetchSocios() {
      this.loadingSocios = true
      empresasSociosRequest(this.empresa.id)
        .then(res => this.socios = res.data.data)
        .catch(() => this.$snack.error('Ocorreu um erro, tente novamente mais tarde'))
        .finally(() => this.loadingSocios = false)
    },
    onSubmit() {
      if (!this.validate()) return
      this.loadingButton = true
      const data = {
        somaPercentual: this.somaPercentual(),
        socios: this.socios.map(item => ({
          id: item.id,
          empresa_id: this.empresa.id,
          prolabore_fixo: item.prolabore_fixo,
          valor_prolabore_fixo: item.valor_prolabore_fixo,
          percentual_prolabore: item.percentual_prolabore,
        })),
      };
      divisaoReceitasRequest(data)
        .then(res => this.$snack.success(res.data.message))
        .catch(error => {
          const message = error.response.data.errors.somaPercentual[0] || error.response.data.errors.socios[0]
          this.errors.push(message || error.response.data.message)
        })
        .finally(() => this.loadingButton = false)
    },
    validate() {
      this.errors = []
      if (this.somaPercentual() !== 100) {
        this.errors.push('A soma do percentual de prolabore dos Sócios deve ser igual a 100%');
        return false
      }
      return true
    },
    somaPercentual() {
      const sociosVariaveis = this.socios.filter(item => !item.prolabore_fixo)
      const somaPercentual = sociosVariaveis
        .map(item => item.percentual_prolabore)
        .reduce((accumulator, current) => parseFloat(accumulator) + parseFloat(current), 0)
      return sociosVariaveis.length > 0 ? parseFloat(somaPercentual) : 100
    }
  },
}
</script>
