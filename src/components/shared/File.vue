<template>
  <div class="flex flex-col items-center">
    <a class="bg-neutral-400 text-neutral-100 hover:bg-error-base rounded-full p-2 mb-2 self-end" href="#"
       @click.prevent="removeFile">
      <Icon-Cross class="transition" size="2"/>
    </a>
    <div class="file-design">PDF</div>
    <p class="pt-4 flex flex-col items-center">
      <span
        class="truncate w-24"
        :class="{'text-error-dark': file.hasError}"
      >
        {{ file.name }}
      </span>

      <span class="text-neutral-600">
        ({{ file.size | kb }} kb)
      </span>
    </p>
  </div>
</template>

<script>
export default {
  name: 'File',
  props: ['file'],
  filters: {
    kb: val => Math.floor(val / 1024),
  },
  methods: {
    removeFile() {
      this.$emit('removeFile', this.file)
    },
  }
}
</script>

<style scoped>
.file-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 130px;
  margin-right: 20px;
}

.file-design {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4c51bf;
  color: #fff;
  font-weight: bold;
  width: 45px;
  height: 60px;
  border-radius: 7px;
  border-top-right-radius: 21px;
}

.remove-file-button {
  background-color: #4c51bf;
  color: #fff;
  font-weight: bold;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  align-self: flex-end;
}
</style>
