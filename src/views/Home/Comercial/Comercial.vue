<template>
  <div class="w-full">
    <div class="flex mt-8 w-full" style="min-height: 200px">
      <HistoricoVendas class=" w-full"/>
    </div>
    <div class="flex my-8 w-full" style="min-height: 200px">
      <AwaitingContratc class="mb-8 w-full"/>
    </div>
  </div>
</template>

<script>

import HistoricoVendas from "@/views/Home/Comercial/components/HistoricoVendas";
import AwaitingContratc from "@/views/Home/Comercial/components/AwaitingContract";

export default {
  name: "Comercial",
  components: {AwaitingContratc, HistoricoVendas}
}
</script>

<style scoped>

</style>
