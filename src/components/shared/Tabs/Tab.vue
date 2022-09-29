<template>
  <div class="w-full">
    <nav class="flex items-start">
      <button
        v-for="(tab,index) in tabs"
        :key="index"
        @click="selectTab(index)"
        class="py-2 px-6 rounded hover:bg-primary-200 transition sticky"
        v-bind="$attrs"
        :disabled="tab.disabled"
        :class="{
        'bg-primary-200': index === selectedTab,
        'text-primary-700': index === selectedTab,
        'text-neutral-600': index !== selectedTab && !tab.disabled,
        'mr-4': (index + 1) < tabs.length,
        'mr-4': (index + 1) < tabs.length,
        'cursor-not-allowed hover:bg-neutral-300 text-neutral-500': tab.disabled,
      }"
      >
        {{ tab.label }}
      </button>
    </nav>

    <slot/>
    <not-found-data class="mt-12" v-if="selectedTab === null"/>

  </div>
</template>

<script>

import NotFoundData from "@/components/layouts/NotFoundData";

export default {
  name: "Tab",
  components: {NotFoundData},
  data() {
    return {
      selectedTab: null,
      tabs: []
    }
  },
  created() {
    this.tabs = this.$children
  },
  mounted() {
    this.tabs.forEach((tab, index) => {
      if (tab.disabled === false && this.selectedTab === null) {
        this.selectTab(index)
      }
    })
  },
  methods: {
    selectTab(i) {
      this.selectedTab = i
      // loop over all the tabs
      this.tabs.forEach((tab, index) => {
        tab.isActive = (index === i)
      })
    }
  }
}
</script>

<style scoped>

</style>
