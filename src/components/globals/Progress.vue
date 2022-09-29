<template>
  <div class="border-2 rounded text-center" :class="classes" v-text="`${progress}%`"/>
</template>

<script>
  export default {
    name: 'Progress',
    props: {
      progress: {
        type: Number,
        default: 0
      }
    },
    computed: {
      classes() {
        return [this.progress === 100 ? 'bg-success-base border-success-base text-neutral-100' : 'border-neutral-500']
      }
    }
  }
</script>