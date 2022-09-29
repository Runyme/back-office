<template>
  <div class="hidden md:flex absolute top-0 left-0 right-0 z-2 px-8">
    <div class="flex items-center justify-center relative w-full py-6 mt-1 text-primary-500">
      <router-link :to="{ name: 'dashboard' }">
        <Logo class="h-8"/>
      </router-link>
      <a href="#" class="absolute-center-y right-0" @click.prevent="openSidebar">
        <Icon-Menu size="large"/>
      </a>
    </div>
  </div>
</template>

<script>

import Logo from '@/components/svgs/Logo'
import Bus from '@/services/bus'

export default {
  components: { Logo },
  methods: {
    openSidebar() {
      Bus.$emit('open-sidebar');
    }
  }
}
</script>
