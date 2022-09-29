<template>
  <div id="app" class="h-full border-primary-200 border-t-4">
    <transition name="fade" mode="out-in" appear>
      <Global-Spinner v-if="loading" :loading="loading"/>
      <router-view v-else/>
    </transition>
  </div>
</template>

<script>

  import GlobalSpinner from '@/components/helpers/GlobalSpinner'
  import Bus from '@/services/bus'

  export default {
    name: 'App',
    components: { GlobalSpinner },
    computed: {
      loading() {
        return Bus.globalLoading
      }
    }
  }
</script>
