<template>
  <div class="flex justify-between items-center pb-2">
    <span v-text="label"></span>
    <div v-if="validator && validator.$error">
      <div v-for="(value, key) in validationsMessage" :key="key">
        <Lynx-Tooltip
          :content="value"
          v-if="!validator[key]"
          icon="Question"
          theme="error"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    validationsMessage: { 
      type: Object,
      default: null
    },
    validator: { 
      type: Object,
      default: null
    }
  }
}
</script>

<style>

</style>