<template>
  <div class="flex px-4 py-6 bg-neutral-300 rounded mb-8">
    <div class="w-24 h-24 flex items-center justify-center bg-neutral-300 border-2 rounded-full shadow border-white">
      <Icon-User size="10"/>
    </div>
    <div class="flex flex-grow pl-8 flex-col">
      <h2 class="font-semibold text-xl">{{ getChatCurrentAttendance.companyId }} -
        {{ getChatCurrentAttendance.Customer.name }}</h2>
      <Lynx-Button
        class="mt-4 mr-4 self-start"
        text="Ordem de Serviço"
        @click.native="openServiceOrderModal"
        size="small"
      />
    </div>
    <div class="flex flex-grow flex-col pl-8">
      <div class="flex self-end">
        <span class="font-semibold">Iniciado em:</span>
        <span class="pl-4">{{ moment(getChatCurrentAttendance.createdAt).format('DD/MM/YYYY') }}</span>
      </div>
      <Lynx-Button
        class="mt-4 self-end"
        text="Encerrar"
        icon="Check"
        @click.native="finishAttendance"
        size="small"
        outlined="true"
      />
    </div>
    <b-modal :active.sync="finishAttendanceModal">
      <FinishAttendance @attendanceFinished="emitFinish" :attendance="attendanceToFinish" :can-cancel="false"/>
    </b-modal>
    <b-modal :active.sync="serviceOrderModal">
      <ServiceOrder @osCreated="osCreated" :attendance="getChatCurrentAttendance" :can-cancel="true"/>
    </b-modal>
  </div>
</template>

<script>

import {mapGetters} from 'vuex'
import moment from 'moment'
import FinishAttendance from '@/views/chat/components/FinishAttendance'
import ServiceOrder from '@/views/chat/components/ServiceOrder'

export default {
  name: 'ChatHeader',
  components: {FinishAttendance, ServiceOrder},
  data() {
    return {
      moment,
      attendanceToFinish: {},
      finishAttendanceModal: false,
      serviceOrderModal: false,
    }
  },
  computed: {
    ...mapGetters([
      'getChatCurrentAttendance',
      'getChatSocketConnection',
    ])
  },
  methods: {
    osCreated() {
      this.serviceOrderModal = false
    },
    finishAttendance() {
      this.$buefy.dialog.confirm({
        message: 'Deseja realmente finalizar o atendimento?',
        confirmText: 'Finalizar',
        cancelText: 'Cancelar',
        type: 'is-primary',
        onConfirm: () => this.handleFinishAttendance()
      })
    },
    handleFinishAttendance() {
      const payload = this.getChatCurrentAttendance
      this.finishAttendanceModal = true
      this.attendanceToFinish = payload
    },
    openServiceOrderModal() {
      this.attendanceToFinish
      this.serviceOrderModal = true
    },
    emitFinish() {
      this.getChatSocketConnection.emit('finishAttendance', {attendance: this.attendanceToFinish})
      this.$emit('attendanceFinished')
    },
  }
}
</script>
