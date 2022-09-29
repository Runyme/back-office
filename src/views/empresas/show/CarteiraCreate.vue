<template>
  <div class="p-8 bg-neutral-300 flex flex-col">
    <Lynx-Title text="Adicionar Carteira"/>
    <div class="w-full flex justify-center items-center" v-if="loading">
      <Lynx-Spinner size="16"/>
    </div>
    <form class="flex flex-col" @submit.prevent="onSubmit" v-else>
      <div class="flex items-center ">
        <p class="flex items-center">
          <span class="pr-2 font-bold">Carteira:</span>
          <b-select placeholder="Selecione uma Carteira" v-model="carteiraInput">
            <option
              v-for="(item, key) in allCarteiras"
              :value="item"
              :key="key"
              v-text="item.nome + ' - ' + item.setor"
            />
          </b-select>
        </p>
      </div>
      <div class="flex justify-between self-end pt-8">
        <Lynx-Button text="Enviar" type="submit" icon="Check"/>
      </div>
    </form>
  </div>
</template>

<script>

import { empresaAddCarteiraRequest } from '@/services/requests/empresas'
import { mapGetters } from 'vuex'
import { carteirasRequest } from '@/services/requests/carteiras'

export default {
  name: 'CarteiraCreate',
  data() {
    return {
      loading: false,
      carteiraInput: null,
      allCarteiras: [],
    }
  },
  computed: {
    ...mapGetters(['getEmpresa'])
  },
  methods: {
    onSubmit() {
      this.loading = true
      empresaAddCarteiraRequest(this.getEmpresa.id, { carteira_id: this.carteiraInput.id })
        .then(res => {
          this.$emit('carteira-created')
          this.carteiraInput = null;
          this.$snack.success(res.data.message);
        })
        .catch(() => this.$snack.error('Não foi possível vincular a Carteira.'))
        .finally(() => this.loading = false);
    },
    fetchAllCarteiras() {
      this.loading = true
      carteirasRequest()
        .then(response =>  this.allCarteiras = response.data.data)
        .catch(error => this.$snack.error(error.response.data.message))
        .finally(() => this.loading = false)
    }
  },
  beforeMount() {
    this.fetchAllCarteiras()
  }
}
</script>

<style>

</style>