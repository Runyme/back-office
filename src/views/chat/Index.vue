<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between">
      <Lynx-Title text="Chat" :overflow-initial="true"/>
      <div class="flex h-10">
        <Lynx-Button class="h-full" text="Iniciar conversa" @click.native="openCreateAttendance" outlined="true"/>
      </div>
    </div>

    <b-loading :active.sync="getChatLoadingAttendances"/>
    <div class="w-full flex justify-center items-center"
         v-if="!getChatLoadingAttendances && !getChatAttendances.length">
      <NotFoundData text="Não há nenhum atendimento aberto"/>
    </div>
    <div class="flex flex-grow overflow-hidden pb-8 -mb-8" v-else-if="!getChatLoadingAttendances">
      <ChatSidebar class="w-1/3 pr-8 border-r-2 border-neutral-400 overflow-y-scroll hide-scrollbar"/>
      <Chat @attendanceFinished="handleAttendanceFinished" class="w-2/3 pl-8"/>
    </div>
    <b-modal :active.sync="creatingAttendance">
      <StartChat @newChatCreated="onNewChatCreated"/>
    </b-modal>
  </div>
</template>

<script>

import ChatSidebar from '@/views/chat/components/Sidebar'
import Chat from '@/views/chat/components/Chat'
import StartChat from '@/views/chat/components/StartChat'
import {mapGetters, mapActions} from 'vuex'
import {getAllStartedAttendanceByClerkId} from '@/services/chat/requests'
import io from 'socket.io-client'
import NotFoundData from '@/components/layouts/NotFoundData'

export default {
  name: 'ChatIndex',
  components: {NotFoundData, ChatSidebar, Chat, StartChat},
  data() {
    return {
      fetchInterval: null,
      creatingAttendance: false
    }
  },
  computed: {
    ...mapGetters([
      'getUser',
      'getChatSocketConnection',
      'getChatLoadingAttendances',
      'getChatAttendances'
    ])
  },
  methods: {
    ...mapActions([
      'setChatLoadingAttendances',
      'setChatAttendances',
      'setChatSocketConnection',
      'chatSocketConnect',
      'chatSocketDisconnect',
      'setChatCurrents',
      'resetCartState'
    ]),
    onNewChatCreated() {
      this.fetchAttendances(true)
      this.creatingAttendance = false
    },
    connectSocket() {
      let socket = io(process.env.VUE_APP_CHAT_API_URL, {autoConnect: false, forceNew: true})
      const socketConnection = socket.connect()
      this.setChatSocketConnection(socketConnection)
    },
    disconnectSocket() {
      this.getChatSocketConnection.disconnect()
      // this.setChatSocketConnection = null
    },
    setupSocketListeners() {
      this.getChatSocketConnection.on('connect', () => this.chatSocketConnect())
      this.getChatSocketConnection.on('disconnect', () => this.chatSocketDisconnect())
    },
    fetchAttendances(setFirst = false) {
      getAllStartedAttendanceByClerkId(this.getUser.id)
        .then(res => {
          const attendances = res.data.map(curr => {
            const lastMessage = curr.lastMessage.length ? curr.lastMessage[0] : null
            return {
              ...curr.attendance,
              lastMessage
            }
          })
          this.setChatAttendances(attendances)
          if (setFirst) this.setFirstAttendance()
          this.setChatLoadingAttendances(false)
        })
    },
    setFirstAttendance() {
      const firstAttendance = this.getChatAttendances[0]
      this.setChatCurrents(firstAttendance)
    },
    handleAttendanceFinished() {
      this.fetchAttendances()
      this.setChatCurrents({})
    },
    openCreateAttendance() {
      console.log('a')
      this.creatingAttendance = true
    }
  },
  beforeMount() {
    this.connectSocket()
    this.setChatLoadingAttendances(true)
    this.fetchAttendances()
    this.fetchInterval = setInterval(() => this.fetchAttendances(), 3500)
  },
  mounted() {
    this.setupSocketListeners()
  },
  destroyed() {
    clearInterval(this.fetchInterval)
    this.resetCartState()
    this.disconnectSocket()
  }
}
</script>
