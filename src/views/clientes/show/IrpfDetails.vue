<template>
  <div class="p-8 bg-neutral-300">
    <Lynx-Title text="Anexar Irpf"/>
    <form @submit.prevent="onSubmit">
      <div class="flex flex flex-col">
        <label class="flex flex-col pb-6">
          <Lynx-Label label="Quantidade de lançamento"/>
          <Lynx-Input type="number" placeholder="Insira a quantidade de lançamento" v-model="qtd_lancamento"/>
        </label>
        <label class="flex flex-col pb-6">
          <Lynx-Label label="Ano"/>
          <Lynx-Input type="number" placeholder="Insira o ano da IRPF" v-model="ano"/>
        </label>

        <div class="block">
          <b-checkbox v-model="rural">
            Rural
          </b-checkbox>
          <b-checkbox v-model="ganhoCaptal" class="ml-4">
            Ganho de captal
          </b-checkbox>
        </div>

        <div class="flex pb-6">
          <Input-File text="Declaração" ref="declaracaoInput"/>
          <Input-File class="ml-6" text="Recibo" ref="reciboInput"/>
        </div>
        <Lynx-Button class="self-end" type="submit" text="Enviar" :loading="loading" icon="Check"/>
      </div>
    </form>
  </div>
</template>

<script>

import InputFile from '@/components/helpers/InputFile'
import {mapGetters} from 'vuex'
import {updateDeclaracaoIrpfRequest} from '@/services/requests/irpf'

export default {
  name: 'IrpfDetails',
  components: {InputFile},
  props: ['declaracao'],
  data() {
    return {
      rural: false,
      ganhoCaptal: false,
      qtd_lancamento: '',
      ano: '',
      loading: false,
    }
  },
  computed: {
    ...mapGetters(['getCliente'])
  },
  methods: {
    async onSubmit() {
      if (!this.qtd_lancamento) return this.$snack.error('Insira uma quantiade de lançamento para continuar')
      if (!this.declaracao && !this.ano) return this.$snack.error('Insira o ano para continuar')

      const declaracaoId = await this.$refs.declaracaoInput.submit()
      if (!declaracaoId) return this.$snack.error('Insira um declaração')

      const reciboId = await this.$refs.reciboInput.submit()
      if (!reciboId) return this.$snack.error('Insira um recibo')

      this.loading = true

      const form = {
        qtd_lancamento: this.qtd_lancamento,
        ano: this.declaracao.ano || this.ano,
        declaracao_id: declaracaoId,
        recibo_id: reciboId,
        rural: this.rural,
        ganho_captal: this.ganhoCaptal,
      }

      updateDeclaracaoIrpfRequest(this.getCliente.id, form)
        .then(res => {
          this.$emit('update-irpf', res.data)
          this.$snack.success('Anexo feito com sucesso')
        })
        .catch(err => this.$snack.error(err.response.data.message || 'Não foi possivel realizar o anexo'))
        .finally(() => this.loading = false)
    }
  }
}

</script>
