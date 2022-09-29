<template>
  <div class="flex flex-col items-center py-4">
    <Icon-Empty class="w-16 h-16"/>
    <p class="font-thin pt-4 text-xl text-center" v-text="text"></p>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: 'Nenhum dado foi encontrado aqui'
    }
  }
}
</script>

<style>

</style>