<template>
  <div class="bg-neutral-300 p-8">
    <Lynx-Title :text="`${currentEmpresa.id} - ${currentEmpresa.razao_social}`"/>
    <div class="modal-content">
      <b-notification
        v-if="thereIsErrorOnEnvio"
        type="is-danger"
        has-icon
        aria-close-label="Close notification"
        role="alert">
        {{ errorMessage }}
      </b-notification>

      <b-notification
        v-if="currentEmpresa.pagamento_cartao"
        type="is-info"
        aria-close-label="Close notification"
        role="alert">
        <b-icon icon="credit-card" size="is-small"></b-icon>
        Honorário em débito automático.
      </b-notification>

      <b-table
        :data="currentEmpresa.guias"
        :columns="columns"
      >
        <template slot-scope="props">
          <b-table-column field="guia" v-text="props.row.tipo"/>
          <b-table-column field="data">
            {{ props.row | data_upload }}
          </b-table-column>
          <b-table-column field="acoes">
            <div class="flex text-sm items-center">
              <a :href="getGuiaLink(props.row.arquivo_id)" target="_blank" class="mr-4 bg-primary-600 rounded-full p-2">
                <Icon-Eye class="text-neutral-100" size="4"/>
              </a>
              <a href="#" class="bg-error-base rounded-full p-2" @click.prevent="estornaGuia(props.row)">
                <Icon-Trash class="text-neutral-100" size="4"/>
              </a>
            </div>
          </b-table-column>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>

import {mapGetters} from 'vuex'
import {estornarGuiaRequest} from '@/services/requests/guias'

export default {
  name: 'GerenciamentoGuiasDetails',
  props: ['currentEmpresa'],
  data() {
    return {
      columns: [
        {
          field: 'guia',
          label: 'Guia'
        },
        {
          field: 'data_upload',
          label: 'Upload',
          width: 150,
        },
        {
          field: 'acoes',
          label: 'Ações',
          width: 150,
        },
      ]
    }
  },
  computed: {
    ...mapGetters(['getToken']),
    thereIsErrorOnEnvio() {
      const liberacao = this.currentEmpresa.guia_liberacao[0]
      return liberacao && liberacao.erro_envio && !liberacao.data_envio
    },
    errorMessage() {
      const liberacao = this.currentEmpresa.guia_liberacao[0]
      return liberacao.error_message || 'Erro no envio de e-mail'
    },
  },
  methods: {
    getGuiaLink(val) {
      return `${process.env.VUE_APP_API_URL}/arquivos/${val}/open?token=${this.getToken}`
    },
    estornaGuia(guia) {
      this.$buefy.dialog.confirm({
        title: 'Estornar Guia',
        message: 'Tem certeza que deseja estornar a guia ' + guia.tipo + ' ?',
        confirmText: 'Estornar',
        cancelText: 'Cancelar',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => {
          estornarGuiaRequest(guia.id)
            .then(() => {
              this.currentEmpresa.guias = this.currentEmpresa.guias.filter(item => item !== guia)
              this.$emit('estornar')
            })
        }
      })
    },
  },
  filters: {
    data_upload(guia) {
      if (guia.data_upload) {
        return new Date(guia.data_upload).toLocaleString()
      }
    }
  }
}
</script>

<style>

</style>
