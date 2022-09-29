<template>
  <div
    class="border-l-transparent border-2 animate-spin rounded-full"
    :class="[sizeClass, borderClass]"
  ></div>
</template>

<script>
export default {
  props: {
    size: {
      default: '4',
    },
    color: {
      default: 'primary-500',
    },
  },
  computed: {
    sizeClass() {
      return `w-${this.size} h-${this.size}`;
    },
    borderClass() {
      return `border-${this.color}`;
    },
  }
}
</script>
