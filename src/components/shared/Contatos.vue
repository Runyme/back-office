<template>
  <div>
    <b-collapse :open="true" @open="fetchContatos" aria-id="contatos-aria">
      <div class="flex items-center my-2" slot="trigger" aria-controls="contatos-aria">
        <Icon-Telephone class="text-primary-600" size="8"/>
        <p class="pl-4 font-display text-xl font-bold">Contatos</p>
      </div>
      <div class="w-full">
        <div class="w-full flex justify-center py-4" v-if="loading">
          <Lynx-Spinner size="16"/>
        </div>
        <div v-else>
          <div class="flex-col" v-if="contatos.length">
            <div class="flex-col">
              <div class="flex items-center py-1" v-for="contato in contatos" :key="contato.id">
                  <p class="flex items-center">
                  {{getContatoLabel(contato)}}: 
                  <span class="text-neutral-800 font-normal" v-text="contato.value"/>
                  </p>
                   <b-tooltip label="copiado" :active="copiado === contato.value" always>
              <button class="ml-2" @click="copyText(contato.value)">
                <b-icon icon="content-copy" size="is-small"></b-icon>
              </button>
            </b-tooltip>
              </div>
              <Lynx-Button class="my-4" text="Gerenciar Contatos" size="small" icon="Setting" icon-size="4"
                           @click.native.prevent="setModalOpened(true)"/>
            </div>
          </div>
          <div class="flex flex-col items-center pb-4" v-else>
            <NotFoundData text="Não há nenhum contato para a empresa"/>
            <Lynx-Button text="Adicionar Contato" size="small" icon="Plus" icon-size="4"
            @click.native="setModalOpened(true)"/>
          </div>
        </div>
      </div>
    </b-collapse>
    <b-modal :active.sync="modalOpened">
      <Details :contactable="contactable" :contatos="contatos" :add-opened="!contatos.length"/>
    </b-modal>
  </div>
</template>

<script>

  import Details from '@/components/shared/ContatosDetails'
  import {contatosRequest} from '@/services/requests/contatos'
  import NotFoundData from '@/components/layouts/NotFoundData'

  export default {
    name: 'Contatos',
    components: {Details, NotFoundData},
    props: {
      contactableType: {
        validator: value => ['empresa', 'cliente'].indexOf(value) !== -1,
        required: true
      },
      contactableId: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        contatos: [],
        loading: false,
        modalOpened: false,
        contactable: {
          type: this.contactableType,
          id: this.contactableId,
        },
          copiado:false
      }
    },
    methods: {
      fetchContatos() {
        this.loading = true
        contatosRequest(this.contactableType, this.contactableId)
          .then(res => this.contatos = res.data)
          .finally(() => this.loading = false)
      },
      setModalOpened(value) {
        this.modalOpened = value
      },
      getContatoIcon(contato) {
        return contato.tipo === 'email' ? 'Mail' : 'Phone'
      },
      getContatoLabel(contato) {
        return contato.tipo === 'email' ? 'Email' : 'Celular'
      },
       copyText(value){
      this.$copyText(value)
      this.copiado = value
      setTimeout(() => this.copiado = false, 1500)
    },
    },
    beforeMount() {
      this.fetchContatos()
    },
     
  }
</script>
