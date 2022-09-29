<template>
  <div class="shadow rounded relative">
    <div class="absolute-center-y right-0 pr-3" v-if="icon">
      <component
        :is="`Icon-${icon}`"
        size="smallest"
        class="text-neutral-700"
      />
    </div>
    <input
      v-if="!mask"
      :class="inputClasses"
      :value="value"
      @input="$emit('input', $event.target.value)"
      :placeholder="placeholder"
      :type="type"
      :inputmode="inputMode"
      :required="required"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
    >
    <the-mask
      v-else
      :class="inputClasses"
      :value="value"
      @input="value => $emit('input', value)"
      :mask="mask"
      :placeholder="placeholder"
      :masked="masked"
      :inputmode="inputMode"
      :disabled="disabled"
    />
  </div>
</template>

<script>

import { TheMask } from 'vue-the-mask'

export default {
  components: { TheMask },
  props: {
    value: [String, Number],
    error: Boolean,
    type: {
      type: String,
      default: 'text'
    },
    placeholder: String,
    icon: String,
    inputMode: String,
    mask: {
      type: [String, Array],
      default: null
    },
    min: {
      type: Number,
      defualt: null
    },
    max: {
      type: Number,
      defualt: null
    },
    step: {
      type: [String, Number],
      defualt: null
    },
    masked: { default: false },
    required: { default: false },
    disabled: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    inputClasses() {
      return [
        'px-2 border-l-4 border-solid rounded py-1 w-full transition focus:shadow focus:border-r-4 font-light',
        this.error ? 'border-error-base' : 'border-primary-200',
        this.disabled ? 'bg-neutral-200' : 'bg-white',
        { 'pr-12': this.icon }
      ]
    }
  }
}
</script>
