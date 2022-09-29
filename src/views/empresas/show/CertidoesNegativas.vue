<template>
  <div>
    <b-collapse :open="false" @open="fetchCertidoes" aria-id="cnd-aria">
      <div class="flex items-center my-2" slot="trigger" aria-controls="cnd-aria">
        <Icon-BankAgency class="text-primary-600" size="8"/>
        <p class="pl-4 font-display text-xl font-bold">CND</p>
      </div>
      <div class="w-full flex flex-col">
        <div class="w-full flex justify-center py-4" v-if="loading">
          <Lynx-Spinner size="16"/>
        </div>
        <div class="flex flex-col w-full items-start" v-else-if="!loading && certidoes.length > 0">
          <div
            class="flex flex-col w-full mb-5"
            v-for="certidao in certidoes"
            :key="certidao.id"
          >
            <div class="flex row w-full justify-between items-center py-1">
              <span class="font-bold pr-2" v-text="certidao.tipo"/>
              <div class="flex">
                <a href="#" class="ml-3" @click.prevent="onPreview(certidao)">
                  <Icon-Eye size="4" class=" text-primary-600"/>
                </a>
                <a href="#" class="ml-3" @click.prevent="onDownload(certidao)">
                  <Icon-Download size="4" class=" text-primary-600"/>
                </a>
              </div>
            </div>
            <div class="flex row w-full justify-between items-center py-1">
              <span class="font-bold pr-2">Data de Emissão: </span>
              <span>{{ certidao.data_emissao | date }}</span>
            </div>
            <div class="flex row w-full justify-between items-center py-1">
              <span class="font-bold pr-2">Data de Validade: </span>
              <span>{{ certidao.data_validade | date }}</span>
            </div>
          </div>
        </div>
        <div class="my-4 self-center flex flex-col items-center" v-else-if="!loading">
          <NotFoundData text="Nenhuma Certidão Negativa de Débito foi encontrada"/>
        </div>
      </div>
    </b-collapse>
  </div>
</template>

<script>

  import {mapGetters} from 'vuex'
  import NotFoundData from '@/components/layouts/NotFoundData'
  import {certidoesNegativosByEmpresaRequest} from "../../../services/requests/certidaoNegativa";
  import moment from "moment";

  export default {
    name: 'CertidoesNegativas',
    components: {NotFoundData},
    data() {
      return {
        loading: false,
        certidoes: {}
      }
    },
    computed: {
      ...mapGetters(['getEmpresa', 'getToken'])
    },
    filters: {
      date: val => moment(val).format('DD/MM/YYYY'),
    },
    beforeMount() {
      // this.fetchCertidoes();
    },
    methods: {
      fetchCertidoes() {
        this.loading = true
        certidoesNegativosByEmpresaRequest(this.getEmpresa.id)
          .then(res => this.certidoes = res.data.data)
          .finally(() => this.loading = false)
      },
      onPreview(certidao) {
        window.open(`${process.env.VUE_APP_API_URL}/arquivos/${certidao.arquivo_id}/open?token=${this.getToken}`)
      },
      onDownload(certidao) {
        window.open(`${process.env.VUE_APP_API_URL}/arquivos/${certidao.arquivo_id}/download?token=${this.getToken}`)
      },
    },
  }
</script>
