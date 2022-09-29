<template>
  <div class="inset-0 fixed bg-white bg-opacity-50 z-100 flex items-center justify-center h-screen md:ml-0 md:min-h-screen" v-if="loading">
    <Lynx-Spinner size="16"/>
  </div>
</template>

<script>
export default {
  props: ['loading']
}
</script>
