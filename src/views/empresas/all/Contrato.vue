<template>
  <div class="bg-white">
    <div class="flex justify-center w-full" v-if="loading">
      <Lynx-Spinner size="16"/>
    </div>
    <div v-else>
      <div class="flex"     v-if="empresa.contrato != null"> 
        <Anexo
          class="mr-8 mb-8"
      
          v-for="arquivo in empresa.contrato.arquivos"
          :key="arquivo.id"
          :anexo="arquivo"
          :isDeletabled="false"
        />
      </div>
  <div class="flex"     v-if="empresa.contrato == null"> 
    <b><p> Não existe contrato</p></b>
  </div>
      <div class="flex justify-between">
        <Lynx-Button
          text="Gerar"
          icon="ArrowRight"
          v-if="!hasContratoAssinado"
          @click.native="makeContrato"
        />

        <Lynx-Button
          v-if="empresa.link"
          text="Copiar link"
          icon="Attachment"
          @click.native="copyLinkAssinaturaContrato()"
        />
      </div>

    </div>
  </div>
</template>

<script>

import {getEmpresaWithContrato, storeContrato} from '@/services/requests/empresaContrato'
import Anexo from '@/views/service-order/components/Anexo'

export default {
  name: 'EmpresaDetalhesModal',
  components: {Anexo},
  props: ['empresaId'],
  data() {
    return {
      loading: false,
      empresa: null,
    }
  },
  computed: {
    hasContratoAssinado() {
      if(this.empresa.contrato != null){
      return this.empresa.contrato && this.empresa.contrato.signed_at !== null
      }
      return this.empresa;
    }
  },
  methods: {
    fetchEmpresa() {
      this.loading = true
      getEmpresaWithContrato(this.empresaId)
        .then(res => this.empresa = res.data.data)
        .finally(() => this.loading = false)
    },
    makeContrato() {
      this.loading = true
      const form = {empresa_id: this.empresaId, sendEmail: false}
      storeContrato(form)
        .then(res => this.empresa = res.data.data)
        .finally(() => this.loading = false)
    },
    async copyLinkAssinaturaContrato() {
      this.$copyText(this.empresa.link).then(() => {
        this.$snack.success('O link foi copiado!');
      }, () => {
        this.$snack.success('O link não foi copiado!');
      })
    },
  },
  beforeMount() {
    this.fetchEmpresa()
  }
}
</script>
