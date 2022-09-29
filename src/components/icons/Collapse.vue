<template>
  <Icon-Template :size="size">
    <svg viewBox="0 0 9 6" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 6L0 0H9L4.5 6Z"/>
    </svg>
  </Icon-Template>
</template>

<script>

import IconTemplate from '@/components/icons/Template'

export default {
  props: ['size'],
  components: { IconTemplate }
}
</script>