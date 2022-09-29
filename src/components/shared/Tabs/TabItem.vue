<template>
  <div class="flex w-full">
    <slot v-if="isActive"></slot>
  </div>
</template>

<script>
export default {
  name: "TabItem",
  props: {
    label: String,
    disabled: Boolean,
  },
  data() {
    return {
      isActive: false
    }
  }
}
</script>

<style scoped>

</style>
