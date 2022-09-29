<template>
  <div>
    <div
      class="drag-area transition"
      :class="{ 'inverse-drag-color': dragEnter }"
      @dragover.prevent="onDragEnter"
      @dragenter.prevent="onDragEnter"
      @dragleave.prevent="onDragLeave"
      @dragend.prevent="onDragLeave"
      @drop.prevent="dropFiles"
      @click="$refs.fileInput.click()"
    >
      <div
        class="subarea-drag transition"
        :class="{ 'border-white': dragEnter }"
      >
        <div class="space-y-1 text-center">
          <UploadCloud
            class="mx-auto text-primary-600 upload-icon transition"
            :class="{ 'text-white': dragEnter }"
            :size="20"
          />
          <div class="flex text-sm text-neutral-600">
            <input style="display: none" ref="fileInput" type="file" @change="selectFiles" multiple/>
            <span class="bg-neutral-100 px-2 rounded-md font-medium text-primary-600">Selecione arquivos</span>
            <p class="pl-1">ou arraste e solte</p>
          </div>
          <p class="text-xs text-neutral-500">
            (Somente PDF)
          </p>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap grid grid-cols-4 gap-3" v-if="!thereAreNotFiles">
      <File
        class="bg-white rounded-lg p-5"
        v-for="(file, index) in files"
        :file="file"
        :key="index"
        @removeFile="removeFile"
      />
    </div>
    <form @submit.prevent="upload" class="mt-8">
      <Lynx-Button text="Enviar" :disabled="thereAreNotFiles"/>
    </form>
  </div>
</template>

<script>

import File from '@/components/shared/File'
import UploadCloud from '@/components/icons/UploadCloud'

export default {
  name: 'DragAndDropInput',
  components: {
    File,
    UploadCloud
  },
  props: {
    uploadSuccess: Boolean,
  },
  data() {
    return {
      dragEnter: false,
      files: [],
    }
  },
  computed: {
    thereAreNotFiles() {
      return this.files.length === 0
    },
  },
  methods: {
    onDragEnter() {
      this.dragEnter = true
    },
    onDragLeave() {
      this.dragEnter = false
    },
    dropFiles(event) {
      this.onDragLeave()
      let files = event.dataTransfer.files
      if (!files) return
      this.addFiles(files)
    },
    selectFiles(event) {
      let files = event.target.files
      if (!files) return
      this.addFiles(files)
    },
    addFiles(files) {
      ([...files]).forEach(file => {
        if (file.type !== 'application/pdf') {
          return this.$snack.error('É permitido apenas arquivos do tipo PDF.')
        }
        this.files.push(file)
      })
    },
    removeFile(file) {
      this.files = this.files.filter(item => item !== file)
    },
    upload() {
      this.$emit('upload', this.files)
    }
  },
  watch: {
    uploadSuccess(newValue) {
      if (newValue) this.files = []
    }
  },
}
</script>

<style lang="scss">
.drag-area {
  @apply bg-white rounded p-2 mb-8 cursor-pointer
}

.inverse-drag-color {
  @apply bg-primary-700 transition
}

.drag-area:hover {
  @apply inverse-drag-color
}

.inverse-subarea {
  @apply border-white
}

.drag-area:hover > .subarea-drag {
  @apply inverse-subarea
}

.drag-area:hover * .upload-icon {
  color: white !important;
}

.subarea-drag {
  @apply flex justify-center px-6 pt-5 pb-6 border-2 border-primary-700 border-dashed rounded
}
</style>
