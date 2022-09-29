<template>
  <div class="flex flex-col shadow hover:shadow-xl transition rounded">
    <div class="px-4 flex rounded rounded-b-none items-center transition" :class="headerClasses">
      <div class="mr-4" v-if="header.icon">
        <component :is="`Icon-${header.icon}`" size="small"/>
      </div>
      <h2 class="text-lg font-light md:text-base" v-if="header.title">{{header.title}}</h2>
      <slot name="header"></slot>
    </div>
    <div :class="bodyClasses">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    header: {
      type: Object,
      default() {
        return {}
      }
    },
    color: {
      type: String,
      default: 'neutral-400'
    },
    bodyClassesProps: {
      type: String,
      default: 'flex rounded rounded-t-none h-full'
    },
    background: {
      type: String,
      default: 'white'
    }
  },
  computed: {
    headerClasses() {
      return [
        `bg-${this.color}`,
        this.header.textColor ? `text-${this.header.textColor}` : 'text-neutral-800',
        { 'py-2': this.header.title, 'h-1': !this.header.title }
      ]
    },
    bodyClasses() {
      return `${this.bodyClassesProps} bg-${this.background}`
    }
  }
}
</script>
