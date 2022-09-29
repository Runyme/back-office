<template>
  <div :class="wrapperClasses">
    <a @click.prevent="$openFile(message.attachmentId)" class="relative flex items-center" v-if="isAttachment">
      <Icon-Attachment :class="attachmentIconClasses"/>
      <span :class="attachmentClasses" v-text="message.text"/>
    </a>
    <div :class="messageClasses" v-text="message.text" v-else/>
    <!-- <div 
      class="absolute"
      :class="isClerkMessage ? clerkClasses.curve : ''"
      v-if="isLast"
    >
      <SVG-Chat-User-Last-Message-Curve class="w-2 shadow-lg" />
    </div> -->
  </div>
</template>

<script>

// import SVGChatUserLastMessageCurve from '@/components/svgs/ChatUserLastMessageCurve'

export default {
  name: 'ChatUserMessage',
  // components: { SVGChatUserLastMessageCurve },
  props: {
    message: {
      required: true,
      type: Object
    },
  },
  computed: {
    isClerkMessage() {
      return !!this.message.clerkId
    },
    isAttachment() {
      return !!this.message.attachmentId
    },
    wrapperClasses() {
      const clerkClasses = 'pr-2 self-end'
      const customerClasses = 'pl-2 self-start'
      return `relative mb-4 ${this.isClerkMessage ? clerkClasses : customerClasses}`
    },
    messageClasses() {
      const clerkClasses = 'bg-white rounded-l-full text-neutral-900'
      const customerClasses = 'bg-neutral-700 text-neutral-100 rounded-r-full'
      return `shadow-lg px-4 py-2 ${this.isClerkMessage ? clerkClasses : customerClasses}`
    },
    attachmentClasses() {
      const clerkClasses = 'rounded-l-full pl-12'
      const customerClasses = 'rounded-r-full pr-12'
      return `bg-primary-600 text-neutral-100 shadow-lg px-4 py-2 font-bold hover:text-primary-200 ${this.isClerkMessage ? clerkClasses : customerClasses}`
    },
    attachmentIconClasses() {
      const clerkClasses = 'ml-4 left-0'
      const customerClasses = 'mr-4 right-0'
      return `absolute text-neutral-100 ${this.isClerkMessage ? clerkClasses : customerClasses}`
    }
  }
}
</script>