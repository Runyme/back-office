<template>
  <b-upload v-model="file" @input="upload">
    <a class="button is-primary">
      <span v-text="text"/>
      <b-icon icon="upload"></b-icon>
    </a>
  </b-upload>
</template>

<script>

import { arquivosCreateRequest } from '@/services/requests/arquivos'

export default {
  name: 'UploadFile',
  props: {
    text: {
      type: String,
      default: 'Upload'
    }
  },
  data() {
    return {
      file: null,
      loading: false,
    }
  },
  methods: {
    upload(file) {
      const formData = new FormData()
      formData.append('arquivo', file)
      arquivosCreateRequest(formData)
        .then(res => {
          
        })
    }
  }
}
</script>

<style>

</style>