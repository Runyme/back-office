<template>
  <form @submit.prevent="onSubmit" class="flex justify-between mt-4 items-center">
    <div class="relative flex flex-grow items-center">
      <Icon-Document class="absolute ml-4 text-primary-600" v-if="attachment"/>
      <input
        type="text"
        class="px-4 border-l-4 border-solid bg-white rounded-l-full py-2 w-full transition focus:shadow focus:border-r-4 font-light rounded-r-full border-primary-600 shadow-lg"
        :class="{ 'pl-10 bg-neutral-300 pr-10': attachment }"
        v-model="text"
        placeholder="Digite sua mensagem"
        :disabled="attachment"
        ref="input"
        required
      />
      <button
        type="button"
        class="absolute right-0 mr-4 bg-neutral-500 rounded-full p-1"
        v-if="attachment"
        @click.prevent="removeAttachment"
      >
        <Icon-Cross size="2"/>
      </button>
    </div>
    <b-upload
      class="mx-4 w-10 h-10 rounded-full bg-neutral-700 shadow-lg flex items-center justify-center text-neutral-100 cursor-pointer transition hover:bg-primary-400"
      v-model="attachment"
      @input="onInputAttachment"
    >
      <Icon-Attachment/>
    </b-upload>
    <button
      class="w-10 h-10 rounded-full bg-primary-600 shadow-lg flex items-center justify-center text-neutral-100 cursor-pointer transition hover:bg-primary-400"
      type="submit"
      :disabled="loading"
    >
      <Lynx-Spinner color="neutral-100" v-if="loading"/>
      <Icon-ArrowRight v-else/>
    </button>
  </form>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'
import { arquivosCreateRequest } from '@/services/requests/arquivos'
import bus from '@/services/bus'

export default {
  name: 'ChatActions',
  data() {
    return {
      text: '',
      attachment: null,
      loading: false,
    }
  },
  computed: {
    ...mapGetters(['getChatSocketConnection', 'getChatCurrentAttendance'])
  },
  methods: {
    ...mapActions(['chatAddMessage', 'setChatLastMessage']),
    setupInputOnBus() {
      bus.chatInput = this.$refs.input
    },
    sendMessage(attachmentId) {
      const message = {
        attendanceId: this.getChatCurrentAttendance.id,
        clerkId: this.getChatCurrentAttendance.clerkId,
        text: this.text,
        attachmentId
      }
      this.getChatSocketConnection.emit('sendMessage', { message })
      this.chatAddMessage(message)
      this.setChatLastMessage(message)
      bus.focusChatInput()
      this.$nextTick(bus.scrollChatMessagesContainer)
      this.text = ''
      this.attachment = null
    },
    uploadAttachment() {
      this.loading = true
      const formData = new FormData()
      formData.append('arquivo', this.attachment)
      return arquivosCreateRequest(formData)
    },
    onSubmit() {
      if(!this.text) return
      this.loading = true
      if(!this.attachment) {
        this.sendMessage()
        this.loading = false
        return
      }
      this.uploadAttachment()
        .then(res => this.sendMessage(res.data.id))
        .finally(() => this.loading = false)
    },
    onInputAttachment() {
      this.text = this.attachment.name
    },
    removeAttachment() {
      this.text = ''
      this.attachment = null
    }
  },
  mounted() {
    this.setupInputOnBus()
  }
}
</script>
