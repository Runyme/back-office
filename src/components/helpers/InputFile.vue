<template>
  <b-field class="file">
    <b-upload v-model="file" @input="handleOnInput">
      <a class="button is-primary">
        <span v-text="text"/>
        <b-icon icon="upload" v-if="!loading"/>
        <Lynx-Spinner class="ml-2" color="neutral-100" size="4" v-else/>
      </a>
    </b-upload>
    <span class="file-name bg-white" v-if="file">
      {{ file.name }}
    </span>
  </b-field>
</template>

<script>

import {arquivosCreateRequest} from '@/services/requests/arquivos'
import base64Files from "@/mixins/base64Files";

export default {
  name: 'InputFile',
  mixins: [base64Files],
  props: {
    text: {
      default: 'Upload',
      type: String,
    }
  },
  data() {
    return {
      file: null,
      loading: false,
    }
  },
  methods: {
    async submit() {
      return new Promise((resolve) => {
        if (!this.file) {
          resolve()
          return
        }
        this.loading = true
        const formData = new FormData()
        formData.append('arquivo', this.file)
        arquivosCreateRequest(formData)
          .then(res => {
            resolve(res.data.id)
            this.file = null
          })
          .finally(() => this.loading = false)
      })
    },
    base64File() {
      return this.fileToBase64(this.file)
    },
    async handleOnInput() {
      this.loading = true
      let file = await this.base64File()
      this.$emit('input', file)
      this.loading = false
    }
  }
}
</script>
