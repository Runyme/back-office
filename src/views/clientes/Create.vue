<template>
  <div>
    <ClientesCreateForm @created="customerCreated" v-if="!stored"/>

    <div class="mt-8 flex flex-col items-center" v-else>
      <Icon-BadgeCheck class="text-success-base w-24 h-24 mb-4"/>
      <p class="text-xl text-center text-success-dark font-display mb-4">
        Pronto! Essa cidadão já foi cadastrado! Id: {{customer.id}}
      </p>
    </div>
  </div>
</template>

<script>
import ClientesCreateForm from "@/views/clientes/CreateForm";

export default {
  name: "Create",
  components: {ClientesCreateForm},
  data() {
    return {
      customer: {},
      stored: false
    }
  },
  methods: {
    customerCreated(data) {
      this.customer = data
      this.stored = true
    }
  }
}
</script>

<style scoped>

</style>
