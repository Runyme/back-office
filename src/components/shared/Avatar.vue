<template>
  <!--  https://codesandbox.io/s/68xm2?file=/src/App.vue-->
  <div
      class="w-6 h-6 flex items-center justify-center uppercase text-white font-medium shadow"
      :class="avatarClasses"
  >
    <img
        v-if="$attrs.src"
        class="w-full h-full overflow-hidden"
        :class="roundClasses"
        v-bind="$attrs"
        v-on="$listeners"
    >
    <span v-else>
      <slot>{{ avatarText }}</slot>
    </span>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: () => {
        let colors = [
          'primary', 'red', 'blue', 'yellow', 'neutral'
        ]
        return colors[Math.floor((Math.random() * colors.length))]
      }
    },
    size: {
      type: Number,
      default: 12
    },
    round: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    sizeClasses() {
      let textSize = 'text-md'
      switch (this.size) {
        case this.size <= 16:
          textSize = 'text-lg'
          break
        case this.size <= 24:
          textSize = 'text-lg text-2xl'
          break
      }
      return `h-${this.size} w-${this.size} ${textSize}`
    },
    roundClasses() {
      return this.round ? "rounded-full" : "rounded";
    },
    avatarClasses() {
      return `bg-${this.$attrs.src ? 'white' : this.color}-400 ${this.roundClasses} ${this.sizeClasses}`;
    },
    avatarText() {
      if (!this.name || typeof this.name !== "string" || !this.name.length) {
        return "";
      }
      return this.name.charAt(0);
    }
  }
};
</script>
