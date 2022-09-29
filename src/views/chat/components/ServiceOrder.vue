<template>
  <div class="p-8 bg-neutral-300">
    <Lynx-Title text="Finalizar Atendimento"/>
    <form class="w-full flex flex-col" @submit.prevent="storeOs">

      <div class="flex flex-col pb-8">
        <Lynx-Label class="font-bold" label="Ordem de serviço"/>
        <div class="w-full flex grid grid-cols-2 gap-8 items-start">
          <Card
            class="font-body cursor-pointer"
            :color="os_base.id === osBaseId ? 'primary-500' : 'neutral-400'"
            @click.native="selectOS(os_base)"
            v-for="os_base in osBaseOptions"
            :key="os_base.id"
            v-bind:class="os_base.id === osBaseId ? 'bg-dark' : ''"
          >
            <div class="flex flex-col p-6">
              <p
                class="font-semibold pb-4 "
                :class="os_base.id === osBaseId ? 'text-primary-800' : 'text-neutral-700'"
              >{{ os_base.nome }}</p>
              <p class="font-semibold">
                <span class="font-normal text-neutral-700">{{ os_base.descricao }}</span>
              </p>
            </div>
          </Card>
        </div>
      </div>
      <div class="flex flex-col pb-8">
        <Lynx-Label class="font-bold" label="Data de vencimento"/>
        <b-datepicker
          v-model="data_vencimento"
          :loading="loadingOsBase"
          :month-names="monthNames"
          :day-names="dayNames"
          required
        />
      </div>
      <div class="flex flex-col pb-8">
        <Lynx-Label class="font-bold" label="Observações"/>
        <Textarea placeholder="Descrição da solicitação." class="p-2 rounded" v-model="descricao" required/>
      </div>
      <Lynx-Button
        :disabled="loadingButton || !readyToSave"
        class="self-end"
        type="submit"
        text="Finalizar"
        :loading="loadingButton"
      />
    </form>
  </div>
</template>

<script>

import {monthNames, dayNames} from '@/utils/utils'
import {updateAttendanceRequest} from '@/services/chat/requests'
import {fetchOsBasesRequest} from "@/services/requests/service-order-base";
import {saveServiceOrderRequest} from "@/services/requests/service-order";
import Card from '@/components/helpers/Card'
import Textarea from "@/components/helpers/Textarea";
import {momentIntance} from "@/utils/momentHelpers";


export default {
  name: 'ServiceOrder',
  components: {Card, Textarea},
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
      descricao: '',
      data_vencimento: new Date(),
    }
  },
  computed: {
    readyToSave() {
      return this.osBaseId && this.descricao
    }
  },
  methods: {
    selectOS(os_base) {
      this.osBaseId = os_base.id
    },
    fetchOsBases() {
      this.loadingOsBase = true
      fetchOsBasesRequest()
        .then(res => this.osBaseOptions = res.data)
        .finally(() => this.loadingOsBase = false)
    },
    storeOs() {
      this.loadingButton = true
      const osBase = {
        os_base_id: this.osBaseId,
        data_limite: momentIntance(this.data_vencimento).format('YYYY-MM-DD')
      }

      const payload = {
        empresa_id: this.attendance.companyId,
        cliente_id: this.attendance.Customer.id,
        os_base: [osBase]
      }

      saveServiceOrderRequest(payload)
        .then(response => {
          this.$snack.success('Ordem de serviço criada.')
          this.updateAttendance(response)
        })
        .catch(error => this.$snack.error(error.response.data.message))
        .finally(() => this.loadingButton = true)
    },
    updateAttendance(res) {
      this.$emit('osCreated')
      // const payload = {
      //   ...this.attendance,
      //   orderServiceId: res.data.data.id
      // }
      // updateAttendanceRequest(payload)
    },
  },
  mounted() {
    this.fetchOsBases()
    console.log(this.attendance)
  }
}
</script>
