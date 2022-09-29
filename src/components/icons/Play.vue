<template>
  <Icon-Template :size="size">
    <svg viewBox="0 0 372 495" xmlns="http://www.w3.org/2000/svg">
      <path d="M343.764 201.188L69.284 13.28C56.608 4.596 43.836 0 33.22 0C12.696 0 0 16.472 0 44.044V450.168C0 477.708 12.68 494.148 33.156 494.148C43.788 494.148 56.356 489.548 69.06 480.84L343.668 292.936C361.328 280.832 371.108 264.544 371.108 247.052C371.112 229.572 361.444 213.288 343.764 201.188Z"/>
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