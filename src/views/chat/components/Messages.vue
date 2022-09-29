<template>
  <div class="flex flex-col flex-grow overflow-y-scroll custom-bar" ref="container">
    <Message
      v-for="message in getChatCurrentMessages"
      :key="message.id"
      :message="message"
    />
  </div>
</template>

<script>

import Message from '@/views/chat/components/Message'
import { mapGetters, mapActions } from 'vuex'
import bus from '@/services/bus'

export default {
  name: 'ChatMessages',
  components: { Message },
  computed: {
    ...mapGetters(['getChatCurrentAttendance', 'getChatCurrentMessages', 'getChatSocketConnection']),
  },
  methods: {
    ...mapActions(['setChatCurrentMessages', 'chatAddMessage', 'setChatLastMessage']),
    setupSocketListeners() {
      this.getChatSocketConnection.on('sendPreviousMessages', data => {
        this.setChatCurrentMessages(data.messages)
        bus.focusChatInput()
        this.$nextTick(bus.scrollChatMessagesContainer)
      })
      this.getChatSocketConnection.on('message', data => {
        this.chatAddMessage(data.message)
        this.setChatLastMessage(data.message)

        if(this.getChatCurrentAttendance.id === data.attendance.id) {
          this.$nextTick(bus.scrollChatMessagesContainer)
        } else {
          console.log('set as read')
        }
      })
    },
    setupMessageContainerOnBus() {
      bus.chatMessageContainer = this.$refs.container
    }
  },
  mounted() {
    this.setupSocketListeners()
    this.setupMessageContainerOnBus()
  }
}
</script>
