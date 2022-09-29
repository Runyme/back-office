<template>
  <div class="p-8 bg-neutral-300">
    <Lynx-Title text="Finalizar Atendimento"/>
    <form class="w-full flex flex-col" @submit.prevent="finishAttendance">
      <div class="flex flex-col pb-8">
        <div class="flex items-center pb-4">
          <Lynx-Label class="font-bold mt-2" label="Quais assuntos foram abordados neste atendimento?"/>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div v-for="(apontamento, key) in apontamentosOptions"
               :key="key"
               class="">
            <b-checkbox
              v-model="apontamentos"
              :native-value="apontamento.id"
            >
              {{ apontamento.nome }}
            </b-checkbox>
          </div>

        </div>
      </div>
      <Lynx-Button
        class="self-end"
        type="submit"
        text="Finalizar"
        :loading="loadingButton"
      />
    </form>
  </div>
</template>

<script>

import {getApontamentosRequest} from '@/services/requests/apontamentos'
import {monthNames, dayNames} from '@/utils/utils'
import {finishAttendanceRequest} from '@/services/chat/requests'

export default {
  name: 'ChatFinishAttendance',
  props: {
    attendance: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      monthNames,
      dayNames,
      loadingButton: false,
      apontamentosOptions: [],
      loadingApontamentos: false,
      apontamentos: [],
      osBaseOptions: [],
      loadingOsBase: false,
      osBaseId: null,
      data_vencimento: new Date(),
      observacao: ''
    }
  },
  methods: {
    fetchApontamentosOptions() {
      this.loadingApontamentos = true
      getApontamentosRequest()
        .then(res => this.apontamentosOptions = res.data.data)
        .finally(() => this.loadingApontamentos = false)
    },
    // fetchOsBases() {
    //   this.loadingOsBase = true
    //   fetchOsBasesRequest()
    //     .then(res => this.osBaseOptions = res.data)
    //     .finally(() => this.loadingOsBase = false)
    // },
    finishAttendance() {
      this.loadingButton = true
      const payload = {
        attendanceId: this.attendance.id,
        annotations: this.apontamentos
      }

      finishAttendanceRequest(payload)
        .then(response => this.$snack.success(response.data.message))
        .catch(error => this.$snack.success(error.response.data.message))
        .finally(() => {
          this.loadingButton = false
          this.$emit('attendanceFinished')
        })
    },
    // storeOs() {
    //   const osBase = {
    //     os_base_id: this.osBaseId,
    //     data_limite: moment(this.data_vencimento).format('YYYY-MM-DD')
    //   }
    //
    //   const payload = {
    //     empresa_id: this.attendance.companyId,
    //     cliente_id: this.attendance.Customer.id,
    //     os_base: [osBase]
    //   }
    //
    //   saveServiceOrderRequest(payload)
    //     .then(this.updateAttendance)
    // },
    // updateAttendance(res) {
    //   const payload = {
    //     ...this.attendance,
    //     orderServiceId: res.data.data.id
    //   }
    //   updateAttendanceRequest(payload)
    // },
  },
  mounted() {
    this.fetchApontamentosOptions()
  }
}
</script>
