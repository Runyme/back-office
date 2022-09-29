<template>
  <div class="w-20 h-20 rounded-full border-2 border-neutral-100 overflow-hidden flex items-center justify-center">
    <div v-if="avatar" class="w-full h-full flex items-center justify-center">
      <img class="object-cover w-full h-full" :src="avatarUrl">
    </div>
    <div v-else class="w-full h-full flex items-center justify-center">
      <Rounded-Avatar class="w-full" />
    </div>
  </div>
</template>

<script>

import RoundedAvatar from '@/components/svgs/RoundedAvatar'

export default {
  props: ['avatar', 'base64'],
  components: { RoundedAvatar },
  computed: {
    avatarUrl() {
      return this.base64 ? this.avatar : `${process.env.VUE_APP_STORAGE_URL}${this.avatar}`;
    }
  }
}

</script>