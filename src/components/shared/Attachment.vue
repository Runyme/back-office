<template>
  <div class="border-2 rounded border-primary-500 px-4 py-2 flex justify-between items-center">
    <a
      class="flex items-center"
      :class="{
        'cursor-default': !anexo.id,
        'cursor-wait pointer-events-none': anexo.loading
      }"
      href="#"
      @click.prevent="openAnexo"
    >
      <div class="pr-2">
        <Icon-Attachment v-if="!anexo.loading" size="4" class="text-primary-700"/>
        <Lynx-Spinner v-if="anexo.loading" size="4"/>
      </div>
      <span class="text-primary-700 text-sm"
            v-text="anexo.nome || anexo.nome_original || anexo.caminho || anexo.arquivo"/>
    </a>
    <a href="#" class="rounded-full bg-error-light transition hover:bg-error-base flex p-1 ml-4"
       @click.prevent="deleteAnexo" v-if="isDeletabled">
      <Icon-Cross class="text-neutral-100" size="2"/>
    </a>
  </div>
</template>

<script>

import {arquivosDeleteRequest} from '@/services/requests/arquivos'
import {mapGetters} from 'vuex'

export default {
  name: 'Attachment',
  props: {
    anexo: {
      required: true
    },
    isDeletabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loadingDelete: false,
    }
  },
  computed: {
    ...mapGetters(['getToken'])
  },
  methods: {
    deleteAnexo() {
      this.$buefy.dialog.confirm({
        message: 'Deseja realmente excluir o anexo?',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        type: 'is-danger',
        onConfirm: () => this.onDeleteAnexo()
      })
    },
    onDeleteAnexo() {
      if (!this.anexo.id) {
        this.$emit('remove-anexo', true)
        return
      }
      this.$forceUpdate()
      this.anexo.loading = true
      arquivosDeleteRequest(this.anexo.id)
        .then(response => {
          this.$snack.success(response.data.message)
          this.$emit('remove-anexo', true)
        })
        .catch(error => {
          this.$snack.error(error.response.data.message || 'nao foi possivel excluir')
          this.$emit('remove-anexo', false)
        })
        .finally(() => this.anexo.loading = false)
    },
    openAnexo() {
      if (!this.anexo || !this.anexo.id) return
      const path = `${process.env.VUE_APP_API_URL}/arquivos/${this.anexo.id}/open?token=${this.getToken}`
      window.open(path, '_blank')
    }
  }
}
</script>
