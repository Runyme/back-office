<template>
  <div
    class="inset-0 fixed bg-white bg-opacity-50 z-100 h-screen md:min-h-screen"
    v-if="loading">
    <div class="flex w-full h-full justify-center items-center bg-white bg-opacity-50">
      <b-progress size="is-large" type="is-primary" :value="value" show-value class="w-1/2 mx-auto">
        <span v-if="showValue"> {{ showValue }}</span>
      </b-progress>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OverlayProgressBar',
  props: {
    loading: {
      default: () => true,
      type: Boolean
    },
    value: {
      default: 0,
      type: Number
    },
    showValue: {
      default: null,
      type: String
    }
  }
}
</script>
