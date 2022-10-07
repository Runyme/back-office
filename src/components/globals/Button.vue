<template>
  <button
    class="shadow rounded font-display flex items-center border-2 transition hover:shadow-xl justify-center"
    :class="classes"
    :disabled="disabled || loading"
  >
    <div class="flex items-center" v-if="!$slots.default">
      <div :class="{'mr-2': text != null}" v-if="icon && !loading && iconPosition === 'left'">
        <component :is="`Icon-${icon}`" :size="iconSize"></component>
      </div>
      <span v-text="text"></span>
      <div :class="{'ml-2': text != null}" v-if="icon && !loading && iconPosition === 'right'">
        <component :is="`Icon-${icon}`" :size="iconSize"></component>
      </div>
      <div class="ml-2" v-if="loading">
        <Lynx-Spinner :size="iconSize" color="primary-100"/>
      </div>
    </div>

    <slot v-else/>
  </button>
</template>

<script>
export default {
  props: {
    text: {required: false},
    icon: {required: false},
    outlined: {default: false},
    loading: {default: false},
    disabled: {default: false},
    size: {required: false},
    color: {default: 'primary-500'},
    textColor: {default: 'neutral-100'},
    iconSize: {default: '5'},
    iconPosition: {default: 'right'}
  },
  computed: {
    classes() {
      return [
        this.outlinedClasses,
        this.backgroundClasses,
        this.textColorClasses,
        {
          'bg-runy-base border-neutral-600': this.disabled && !this.outlined,
          'border-neutral-600': this.disabled && this.outlined,
          'px-3 py-2': !this.size,
          'px-2 py-1 text-sm': this.size === 'small',
          'px-4 py-3': this.size === 'large',
          'cursor-not-allowed': this.disabled
        }
      ]
    },
    outlinedClasses() {
      return this.outlined && !this.disabled ? `text-${this.color} border-${this.color}` : ''
    },
    backgroundClasses() {
      return !this.outlined && !this.disabled ? `bg-${this.color} border-${this.color}` : ''
    },
    textColorClasses() {
      return !this.outlined ? `text-${this.textColor}` : ''
    }
  },
}
</script>
