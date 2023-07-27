<template>
  <div class="">
    <b-collapse :open="true" @open="fetchAcessoPrefeitura" aria-id="nfse-aria">
      <div class="flex items-center my-2" slot="trigger" aria-controls="nfse-aria">
        <Icon-Key class="text-primary-600" size="8"/>
        <p class="pl-4 font-display text-xl font-bold">Acesso Prefeitura</p>
      </div>
      <div class="my-4 self-center flex flex-col items-center" v-if="inadimplencia">
        <NotFoundData text="Empresa com inadimplencia"/>
      </div>
      <div class="w-full flex flex-col" v-else>
        <div class="w-full flex justify-center py-4" v-if="loading">
          <Lynx-Spinner size="16"/>
        </div>
        <div class="flex-col" v-if="!loading && acessoPrefeituraFiltered">
          <div class="flex items-center py-1">
            <div class="flex items-center">
              <span class="font-bold pr-2">Site:</span>
            </div>
            <div class="truncate">
              <a
                target="_blank"
                class="underline"
                :href="acessoPrefeituraFiltered.site"
                v-text="acessoPrefeituraFiltered.site"
              />
            </div>
            <b-tooltip label="copiado" :active="copiado === acessoPrefeituraFiltered.site" always>
              <button class="ml-2" @click="copyText(acessoPrefeituraFiltered.site)">
                <b-icon icon="content-copy" size="is-small"></b-icon>
              </button>
            </b-tooltip>
          </div>
          <div class="flex items-center py-1">
            <p class="flex items-center">
              <span class="pr-2 font-bold">Login:</span>
              <span
                class="truncate"
                v-text="acessoPrefeituraFiltered.login"
              />
            </p>
            <b-tooltip label="copiado" :active="copiado === acessoPrefeituraFiltered.login" always>
              <button class="ml-2" @click="copyText(acessoPrefeituraFiltered.login)">
                <b-icon icon="content-copy" size="is-small"></b-icon>
              </button>
            </b-tooltip>
          </div>
          <div class="flex items-center py-1">
            <p class="flex items-center">
              <span class="pr-2 font-bold">Senha:</span>
              <span class="truncate" v-text="acessoPrefeituraFiltered.senha"/>
            </p>
            <b-tooltip label="copiado" :active="copiado === acessoPrefeituraFiltered.senha" always>
              <button class="ml-2" @click="copyText(acessoPrefeituraFiltered.senha)">
                <b-icon icon="content-copy" size="is-small"></b-icon>
              </button>
            </b-tooltip>
          </div>
        </div>
        <div class="my-4 self-center flex flex-col items-center" v-else-if="!loading">
          <NotFoundData text="Acesso ainda não cadastrado"/>
        </div>
        <Lynx-Button
          text="Detalhes"
          class="my-4"
          icon="Eye"
          icon-size="4"
          size="small"
          @click.native="openModal"
        />
       
          <Lynx-Button
          href="http://plataforma.runy.me"
          text="Emissor de nota"
          class="my-4"
          icon="FileDocumentBox"
          icon-size="4"
          size="small"
        />

      </div>
    </b-collapse>
    <b-modal :active.sync="modal">
      <Details :acesso-prefeitura="acessoPrefeitura" @update-acesso="onUpdateAcesso"/>
    </b-modal>
  </div>
</template>

<script>

import {mapGetters} from 'vuex'
import {acessosPrefeiturasRequest} from '@/services/requests/acessoPrefeitura'
import NotFoundData from '@/components/layouts/NotFoundData'
import Details from '@/views/empresas/show/AcessoPrefeituraDetails'

export default {
  name: 'EmpresaShowAcessoPrefeitura',
  components: {NotFoundData, Details},
  props: {
    inadimplencia: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      acessoPrefeitura: [],
      loading: false,
      modal: false,
      copiado:false
    }
  },
  computed: {
    ...mapGetters(['getEmpresa']),
    acessoPrefeituraFiltered() {
      return this.acessoPrefeitura.find(curr => curr.tipo === 'emissor')
    }
  },
  methods: {
    copyText(value){
      this.$copyText(value)
      this.copiado = value
      setTimeout(() => this.copiado = false, 1500)
    },
    fetchAcessoPrefeitura() {
      this.loading = true
      acessosPrefeiturasRequest(this.getEmpresa.id)
        .then(res => this.acessoPrefeitura = res.data.data)
        .finally(() => this.loading = false)
    },
    openModal() {
      this.modal = true
    },
    onUpdateAcesso() {
      this.modal = false
      this.fetchAcessoPrefeitura()
    }
  },
  beforeMount() {
    this.fetchAcessoPrefeitura()
  }
}
</script>
