<template>
  <div 
    class="flex items-start flex-col mb-8"
    :class="[overflowInitial ? 'overflow-initial' : 'overflow-hidden']"
  >
    <p class="text-3xl font-display pb-1 md:text-2xl truncate max-w-full font-bold text-neutral-800">{{text}}</p>
    <transition name="fade-left" appear>
      <span class="w-6 h-1 bg-primary-500 rounded"></span>
    </transition>
  </div>
</template>

<script>
export default {
  props: ['text', 'overflowInitial']
}
</script>

<style>

</style>