import Vue from 'vue'
export default new Vue({
  data() {
    return {
      globalLoading: false
    }
  },
  methods: {
    scrollChatMessagesContainer() {
      this.chatMessageContainer.scrollTop = this.chatMessageContainer.scrollHeight
    },
    focusChatInput() {
      this.chatInput.focus()
    }
  }
})