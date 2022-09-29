<template>
  <b-collapse animation="slide" class="flex flex-col shadow hover:shadow-xl transition rounded" :open.sync="isOpen">
    <div class="px-6 flex rounded rounded-b-none items-center transition py-3 bg-neutral-300 flex justify-between" slot="trigger">
      <h2 class="text-xl font-display text-neutral-700" v-text="service.nome" />
      <div class="rounded-full bg-primary-600" style="padding: 0.3em">
        <Icon-Collapse class="text-neutral-100" size="3"/>
      </div>
    </div>
    <div class="bg-neutral-100 p-6 w-full">
      <ServiceOrderAtividadeCard
        class="service-order-activity-card"
        :activity="atividade"
        :mail-send="mailSend"
        :service-id="service.id"
        v-for="(atividade, key) in service.atividades" 
        :key="key"
      />
    </div>
</b-collapse>
</template>

<script>

import ServiceOrderAtividadeCard from '@/views/service-order/request/execute/components/service-order-atividade-card/ServiceOrderAtividadeCard.vue'

export default {
  name: 'ServiceOrderCard',
  components: { ServiceOrderAtividadeCard },
  props: {
    service: {
      type: Object,
      required: true
    },
    mailSend: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      isOpen: false,
    }
  },
  beforeMount() {
    this.isOpen = !(this.service.atividades.length > 1)
  }
}
</script>
