<template>
  <div
    class="py-6 px-4 cursor-pointer transition hover:bg-neutral-300 rounded"
    :class="{ 'bg-neutral-300': isSelected }"
  >
    <div class="flex items-center">
      <div
        class="p-4 flex items-center justify-center bg-neutral-300 border-2 rounded-full shadow"
        :class="[hasNotification ? 'border-primary-500' : 'border-white']"
      >
        <Icon-User size="8"/>
      </div>
      <div class="flex-grow flex justify-center pl-6 flex-col">
        <h2
          class="text-lg pb-2"
          :class="{ 'font-semibold': hasNotification }"
        >
          {{ attendance.companyId }} - {{ attendance.Customer.name }}
        </h2>
        <h3 class="text-sm text-neutral-600" v-text="attendance.lastMessage.text" v-if="attendance.lastMessage"/>
      </div>
      <div
        class="flex items-center justify-center bg-primary-600 text-neutral-100 p-2 text-xs rounded-full shadow"
        v-if="hasNotification"
      ></div>
    </div>
  </div>
</template>

<script>

import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'ChatAttendance',
  props: {
    attendance: {
      required: true,
      type: Object
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters([
      'getChatCurrentAttendance',
      'getChatSocketConnection',
      'getUser',
      'getChatAttendances',
    ]),
    isSelected() {
      return this.getChatCurrentAttendance.id === this.attendance.id
    },
    hasNotification() {
      let has = this.getChatAttendances.filter(attendance =>
        attendance.lastMessage && attendance.lastMessage.readAt === null
      )
      return !!has.length
    }
  },
  methods: {
    ...mapActions(['setChatMessagesToAttendance']),
    socketJoin() {
      this.getChatSocketConnection.emit('join', {
        attendance: this.attendance,
        user: {
          name: this.getUser.nome_completo,
          clerkId: this.getUser.id
        }
      })
    },
  },
  mounted() {
    this.socketJoin()
  }
}
</script>
