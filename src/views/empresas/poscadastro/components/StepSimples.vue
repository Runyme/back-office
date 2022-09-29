<template>
  <form class="flex flex-wrap items-start mt-8" @submit.prevent="updateEmpresa">
    
   <label class="w-1/2 px-2 block">
      <Lynx-Label label="Código de Acesso do Simples" />
      <Lynx-Input placeholder="Insira a Inscrição municipal" v-model="form.empresa.codigo_acesso_simples" />
    </label>

    <label class="w-1/2 px-2 block">
      <Lynx-Label label="Data do Enquadramento do Simples" />

      <InputDate v-model="form.empresa.data_sn" />
    </label>

    <Input-File class="px-2" text="Comprovante de Enquadramento" ref="arquivoComprovanteDeEnquadramentoSimplesNacionalInput"/>

    <div class="w-full flex flex-col px-2 mt-4">
      <Lynx-Button type="submit" text="Salvar" class="self-end" :loading="loading" :disabled="loading || !check"/>
    </div>

    <b-loading :active.sync="loading" :is-full-page="false"></b-loading>
    <Label  class="mb-3 ml-2" for="checkbox">
                                   <b-switch  v-model="check">enquadramento do simples na prefeitura</b-switch>

        </Label> 
  </form>

  
</template>
q
<script>

import { EmpresaPosCadastroUpdate } from '@/services/requests/empresaPosCadastro'
import InputFile from '@/components/helpers/InputFile'
import InputDate from '@/components/helpers/InputDate'

export default {
  name: 'StepSimples',
  components: { InputFile, InputDate },
  props: [ 'empresa' ],
  data() {
    return {
      loading: false,
      // viabilidade: false,

      check:this.empresa.data_sn == null ?false:true,
      form: {
        empresa: {
          codigo_acesso_simples: this.empresa.codigo_acesso_simples,
          data_sn: this.empresa.data_sn,
          arquivos: {
            comprovante_do_enquadramento_simples_nacional: null,
          }
        },
      },
    }
  },
  mounted() {},
  methods: {
    async updateEmpresa() {
      this.loading = true

      if (this.$refs.arquivoComprovanteDeEnquadramentoSimplesNacionalInput) {
        this.form.empresa.arquivos.comprovante_do_enquadramento_simples_nacional = await this.$refs.arquivoComprovanteDeEnquadramentoSimplesNacionalInput.submit()
      }

      EmpresaPosCadastroUpdate(this.empresa.id, this.form)
        .then(() => {
          this.$snack.success('Empresa atualizada com sucesso!')
          this.$emit('updated')
        })
        .catch(error => {
          const errors = Object.values(error.response.data.errors)
          const message = errors.map(item => item.map(error => `<li>${error}</li>`).join('')).join('')

          this.$buefy.dialog.alert({
            title: 'Não foi possível atualizar a empresa',
            message: `<ul>${message}</ul>`,
            type: 'is-danger',
            ariaRole: 'alertdialog',
            ariaModal: true
          })
        })
        .finally(() => this.loading = false)
    },
  },
}
</script>
