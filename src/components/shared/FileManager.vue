<template>
  <div class="flex flex-col">
    <form class="flex flex-col" @submit.prevent="onSubmit">
      <Lynx-Label label="Adicione uma tag"/>
      <div class="flex items-center">
        <b-taginput
          class="flex-grow"
          v-model="tags"
          ellipsis
          icon="label"
          placeholder="Adicione uma Tag"
          >
        </b-taginput>
        <Lynx-Button class="ml-8" text="Pesquisar" icon="Search" size="small"/>
      </div>
    </form>
    <div class="w-full flex justify-center pt-8" v-if="loading">
      <Lynx-Spinner size="16"/>
    </div>
    <div v-else>
      <div class="grid grid-cols-6 pt-8 gap-8" v-if="files.length">
        <Card
          v-for="file in files"
          :key="file.id"
        >
          <div class="p-4 w-full flex flex-col items-center">
            <span class="pb-4 text-xl text-neutral-600" v-text="file.nome_original"/>
            <Icon-Pdf size="12"/>
          </div>
        </Card>
      </div>
      <div class="w-full flex justify-center pt-8" v-else>
        <NotFoundData text="Nenhum arquivo foi encontrado" />
      </div>
    </div>
  </div>
</template>

<script>

import { arquivosSearchRequest } from '@/services/requests/arquivos'
import Card from '@/components/helpers/Card'
import NotFoundData from '@/components/layouts/NotFoundData'

export default {
  name: 'FileManager',
  components: { Card, NotFoundData },
  data() {
    return {
      tags: [],
      files: [],
      loading: false,
    }
  },
  methods: {
    onSubmit() {
      if(!this.tags.length) {
        this.$snack.error('Insira uma tag para continuar')
        return
      }
      this.loading = true
      arquivosSearchRequest({ tags: this.tags })
        .then(res => this.files = res.data.data)
        .finally(() => this.loading = false)
    }
  }
}
</script>

<style>

</style>