<template>
  <div>
    <Lynx-Input class="w-full mb-4" v-model="attendanceFilter" placeholder="Filtre os atendimentos" icon="Search"/>
    <Attendance
      v-for="attendance in filteredAttendances"
      :key="attendance.id"
      :attendance="attendance"
      @click.native="setChatCurrents(attendance)"
    />
  </div>
</template>

<script>

import Attendance from '@/views/chat/components/Attendance'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ChatSidebar',
  components: { Attendance },
  data() {
    return {
      attendanceFilter: '',
    }
  },
  computed: {
    ...mapGetters(['getChatAttendances']),
    filteredAttendances() {
      return this.getChatAttendances.filter(curr => {
        const attendanceName = (`${curr.companyId} - ${curr.Customer.name}`).toLowerCase()
        const filter = this.attendanceFilter.toLowerCase()
        return attendanceName.match(filter)
      })
    }
  },
  methods: {
    ...mapActions(['setChatCurrents']),
  }
}
</script>