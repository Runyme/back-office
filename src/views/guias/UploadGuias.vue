<template>
  <div>
    <Lynx-Title text="Upload de Guias"/>
    <Lynx-OverlayProgressBar
      :value="(progressBar.done * 100) / progressBar.total"
      :show-value="`Enviando ${ progressBar.done } de ${ progressBar.total } arquivos`"
      :loading="progressBar.shouldShow"
    />
    <DragAndDropInput @upload="handleUpload"/>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {uploadGuiasRequest} from "@/services/requests/guias";
import DragAndDropInput from "@/components/shared/DragAndDropInput";
import base64Files from "@/mixins/base64Files";

export default {
  name: 'UploadGuias',
  components: {DragAndDropInput},
  mixins: [base64Files],
  data: () => ({
    progressBar: {
      total: 0,
      done: 0,
      shouldShow: false
    },
    failedUploads: [],
  }),
  computed: {
    ...mapGetters(['getCompetenciaDate']),
  },
  methods: {
    async handleUpload(files) {
      this.setProgressBar(files.length)

      while (files.length > 0) {
        let chunk = files.splice(0, 10)
        this.updateProgressBar(chunk.length)
        await this.processAndUpload(chunk)
      }

      if (this.failedUploads.length) {
        this.failedUploads.forEach(item => files.push(item))
        this.failedUploads = []
      } else {
        this.$snack.success('Uploads realizados com sucesso!')
      }

      this.updateProgressBar(0, false)
    },
    async processAndUpload(chunk) {
      return await this.base64Files(chunk).then(async filesBase64Encoded => {
        const guias = filesBase64Encoded.map(file => ({
          name: file.name,
          base64: file.base64,
          competencia: this.getCompetenciaDate
        }));

        let upload
        try {
          upload = await this.uploadGuias(guias)
        }catch (e){
          upload = false
        }

        if (!upload) {
          chunk.forEach(item => {
            item.hasError = true
            this.failedUploads.push(item)
          })
        }
      });
    },
    async uploadGuias(guias) {
      return uploadGuiasRequest({guias})
        .then(() => true)
        .catch(() => {
          this.$snack.error('Erro ao realizar upload de algumas guias.');
          return false
        });
    },
    setProgressBar(length) {
      this.progressBar.total = length
      this.progressBar.shouldShow = true
    },
    updateProgressBar(qtd, show = true) {
      this.progressBar.done += qtd;
      if (!show) {
        setTimeout(() => {
          this.progressBar.shouldShow = false
          this.progressBar.total = 0
          this.progressBar.done = 0
        }, 1000)
      }
    }
  }
}
</script>

