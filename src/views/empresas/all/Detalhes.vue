<template>
  <div class="bg-white p-8">
    <div class="flex justify-center w-full" v-if="loading">
      <Lynx-Spinner size="16"/>
    </div>
    <div v-else>
      <Lynx-Title :text="empresa.id + ' - ' + empresa.razao_social"/>


      <b-tabs type="is-boxed" v-model="selectedTab">
        <b-tab-item label="Geral" icon="information-outline">
          <Geral :empresa="empresa" />
        </b-tab-item>
        <b-tab-item label="Contrato" icon="file-outline" :disabled="empresa.status === 'desativada'">
          <Contrato v-if="selectedTab === 1" :empresa-id="empresaId"/>
        </b-tab-item>
        <b-tab-item disabled label="Outros" icon="settings"></b-tab-item>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import Contrato from './Contrato'
import Geral from "./Geral";
import {empresasShowRequest} from "@/services/requests/empresas";

export default {
  name: 'EmpresaDetalhesModal',
  props: ['empresaId'],
  components: {Geral, Contrato},
  data() {
    return {
      loading: false,
      selectedTab: 0,
      empresa: {}
    }
  },
  methods: {
    fetchEmpresa() {
      this.loading = true
      empresasShowRequest(this.empresaId)
        .then(res => {
          this.empresa = res.data.data
        })
        .catch(() => this.$snack.error('Empresa não encontrada'))
        .finally(() => this.loading = false)
    }
  },
  mounted() {
    this.fetchEmpresa();
  }
}
</script>
