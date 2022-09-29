<template>
  <div class="">
    <b-collapse :open="true" @open="fetchAcessosCliente" aria-id="nfse-aria">
      <div class="flex items-center my-2" slot="trigger" aria-controls="nfse-aria">
        <Icon-Key class="text-primary-600" size="8"/>
        <p class="pl-4 font-display text-xl font-bold">Acessos</p>
      </div>
      <div class="w-full flex flex-col">
        <div class="w-full flex justify-center py-4" v-if="loading">
          <Lynx-Spinner size="16"/>
        </div>
        <div class="flex-col" v-if="!loading && acessoFiltered">
          <div class="flex items-center py-1">
            <div class="flex items-center">
              <span class="font-bold pr-2">Site:</span>
            </div>
            <div class="truncate">
              <a
                target="_blank"
                class="underline"
                :href="acessoFiltered.url"
                v-text="acessoFiltered.url"
              />
            </div>
            <b-tooltip label="copiado" :active="copiado === acessoFiltered.url" always>
              <button class="ml-2" @click="copyText(acessoFiltered.url)">
                <b-icon icon="content-copy" size="is-small"></b-icon>
              </button>
            </b-tooltip>
          </div>
          <div class="flex items-center py-1">
            <p class="flex items-center">
              <span class="pr-2 font-bold">Login:</span>
              <span
                class="truncate"
                v-text="acessoFiltered.login"
              />
            </p>
            <b-tooltip label="copiado" :active="copiado === acessoFiltered.login" always>
              <button class="ml-2" @click="copyText(acessoFiltered.login)">
                <b-icon icon="content-copy" size="is-small"></b-icon>
              </button>
            </b-tooltip>
          </div>
          <div class="flex items-center py-1">
            <p class="flex items-center">
              <span class="pr-2 font-bold">Senha:</span>
              <span class="truncate" v-text="acessoFiltered.password"/>
            </p>
            <b-tooltip label="copiado" :active="copiado === acessoFiltered.password" always>
              <button class="ml-2" @click="copyText(acessoFiltered.password)">
                <b-icon icon="content-copy" size="is-small"></b-icon>
              </button>
            </b-tooltip>
          </div>
          <div class="flex items-center py-1">
            <p class="flex items-center">
              <span class="pr-2 font-bold">Tipo:</span>
              <span class="truncate" v-text="acessoFiltered.type.toUpperCase().replace('_', ' ')"/>
            </p>
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
      </div>
    </b-collapse>
    <b-modal :active.sync="modal">
      <Details :acesso="acessoCliente" @update-acesso="onUpdateAcesso"/>
    </b-modal>
  </div>
</template>

<script>

import {mapGetters} from 'vuex'
import {acessosClienteRequest} from '@/services/requests/acessoCliente'
import NotFoundData from '@/components/layouts/NotFoundData'
import Details from '@/views/clientes/show/AcessoDetail'

export default {
  name: 'AcessosCliente',
  components: {NotFoundData, Details},
  data() {
    return {
      acessoCliente: [],
      loading: false,
      modal: false,
      copiado: false
    }
  },
  computed: {
    ...mapGetters(['getCliente']),
    acessoFiltered() {
      return this.acessoCliente.find(item => item.type === 'meu_inss')
    }
  },
  methods: {
    copyText(value) {
      this.$copyText(value)
      this.copiado = value
      setTimeout(() => this.copiado = false, 1500)
    },
    fetchAcessosCliente() {
      this.loading = true
      acessosClienteRequest(this.getCliente.id)
        .then(res => this.acessoCliente = res.data.data)
        .finally(() => this.loading = false)
    },
    openModal() {
      this.modal = true
    },
    onUpdateAcesso() {
      this.modal = false
      this.fetchAcessosCliente()
    }
  },
  beforeMount() {
    this.fetchAcessosCliente()
  }
}
</script>
