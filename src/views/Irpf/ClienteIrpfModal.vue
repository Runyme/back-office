<template>
  <div class="modal-content">
    <form @submit.prevent="onSubmit" v-if="!hasIrpfArquivos">
      <div class="flex flex flex-col">
        <label class="flex flex-col pb-6">
          <Lynx-Label label="Quantidade de lançamento"/>
          <Lynx-Input type="number" placeholder="Insira a quantidade de lançamento" v-model="qtd_lancamento"/>
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

    <div class="flex flex-col w-full" v-else-if="!loading && hasIrpfArquivos">
     
      <div class="w-full flex justify-between items-start">
        <b-tag
          v-if="clienteIrpf.irpf.enviado"
          type="is-success"
        >
          {{ clienteIrpf.irpf.enviado | dataEnvio }}
        </b-tag>
           <Lynx-Button
        text="excluir declaração"
        class="mb-3"
          color="error-base"
        @click.native="excluirDeclaracao()"
        size="small"
        icon-size="3"
      />
      </div>

      <div class="flex flex-col pt-2">
        <div
          class="flex justify-between pb-6 items-center"
          v-for="arquivo in clienteIrpf.irpf.arquivos"
          :key="arquivo.id"
        >
          <span class="cursor-pointer capitalize" @click.prevent="$openFile(arquivo.id)" v-text="arquivo.nome"/>
          <a href="#" @click.prevent="$openFile(arquivo.id)">
            <Icon-Eye class="text-primary-600" size="6"/>
          </a>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import InputFile from "../../components/helpers/InputFile";
import {updateDeclaracaoIrpfRequest} from "../../services/requests/irpf";

export default {
  name: "ClienteIrpfModal",
  props: ['clienteIrpf'],
  components: {InputFile},
  data() {
    return {
      qtd_lancamento: '',
      rural: false,
      ganhoCaptal: false,
      loading: false,
    }
  },
  computed: {
    hasIrpfArquivos() {
      return this.clienteIrpf.irpf && this.clienteIrpf.irpf.arquivos && this.clienteIrpf.irpf.arquivos.length === 2
    }
  },
  filters: {
    dataEnvio: (val) => {
      const date = new Date(val)
      return 'Enviado em ' + date.toLocaleDateString()
    },
  },
  methods: {
    async onSubmit() {
      if (!this.qtd_lancamento) return this.$snack.error('Insira uma quantiade de lançamento para continuar')

      const declaracaoId = await this.$refs.declaracaoInput.submit()
      if (!declaracaoId) return this.$snack.error('Insira um declaração')

      const reciboId = await this.$refs.reciboInput.submit()
      if (!reciboId) return this.$snack.error('Insira um recibo')

      this.loading = true

      const form = {
        qtd_lancamento: this.qtd_lancamento,
        ano: this.clienteIrpf.irpf.ano,
        rural: this.rural,
        ganho_captal: this.ganhoCaptal,
        declaracao_id: declaracaoId,
        recibo_id: reciboId,
      }

      updateDeclaracaoIrpfRequest(this.clienteIrpf.id, form)
        .then(response => {
          this.$emit('update-irpf')
          this.$snack.success(response.data.message)
        })
        .catch(err => this.$snack.error(err.response.data.message || 'Não foi possivel realizar o anexo'))
        .finally(() => this.loading = false)
    },
    excluirDeclaracao(){
   
      this.$store.dispatch('empresas/exclusaoIrpf',this.clienteIrpf.irpf)
          this.$emit('update-irpf')
          this.$snack.success('deletado com sucesso')

  }
}}
</script>

<style scoped>

</style>
