<template>
  <div @click.stop>
    <b-collapse class="flex items-end" :open.sync="isCollapsed" position="is-bottom">
      <div class="flex mr-4 items-end">
        <ul>
          <li class="rounded shadow-xl my-4" :class="`bg-${color}`" v-for="option in reversedOptions" :key="option.id">
            <button class="px-4 py-1 transition" :class="`text-${textColor}`" @click.prevent="onClick(option.callBack)" v-text="option.label" />
          </li>
        </ul>
      </div>
      <button class="p-5 flex rounded-full shadow-xl" :class="`bg-${color}`" @click.prevent slot="trigger">
        <component :is="`Icon-${icon}`" size="6" :class="`text-${textColor}`"/>
      </button>
    </b-collapse>
  </div>
</template>

<script>
export default {
  name: 'FloatActions',
  props: {
    options: {
      required: true,
      type: Array
    },
    color: {
      type: String,
      default: 'primary-700',
    },
    textColor: {
      type: String,
      default: 'neutral-100'
    },
    icon: {
      type: String,
      required: true,
    }
  },
  data() {
    return { isCollapsed: false }
  },
  mounted() {
    document.body.addEventListener('click', () => this.isCollapsed = false)
  },
  computed: {
    reversedOptions() {
      return this.options.slice(0).reverse()
    }
  },
  methods: {
    onClick(callBack) {
      callBack()
      this.isCollapsed = false
    }
  }
}
</script>