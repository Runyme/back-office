<template>
  <div class="flex h-full">
    <div class="w-1/2 lg:w-3/5 md:w-full flex flex-col items-center z-1">
      <div class="pt-8">
        <transition name="fade-left" appear>
          <Logo class="h-12 text-primary-500 md:h-8"/>
        </transition>
      </div>
      <div class="max-w-xl xl:max-w-md w-full font-light px-8 py-8 flex-grow flex flex-col justify-center">
        <transition name="fade-left" appear>
          <div>
            <slot name="content" />
          </div>
        </transition>
      </div>
    </div>
    <div class="w-1/2 lg:w-2/5 md:hidden"></div>
    <div class="w-1/2 lg:w-2/5 flex items-center justify-center bg-primary-500 px-8 py-8 fixed right-0 top-0 bottom-0 md:hidden">
      <transition name="fade-right" appear>
        <div class="w-full h-full max-w-lg">
          <slot name="SVG"/>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>

import Logo from '@/components/svgs/Logo'

export default {
  components: { Logo }
}
</script>