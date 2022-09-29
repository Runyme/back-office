<template>
  <div class="flex my-8 w-full grid grid-cols-4 gap-4" style="min-height: 200px">
    <GuiaSettings class="h-full"/>
    <ResumoGuias class="col-span-2 h-full"/>
    <ResumoContratos class="h-full"/>
    <ResumoEmpresas class="h-full col-span-2"/>
    <ResumoIRPF class="h-full col-span-2"/>
  </div>
</template>

<script>

import ResumoContratos from '@/components/shared/ResumoContratos'
import ResumoGuias from "@/components/shared/ResumoGuias";
import GuiaSettings from "@/components/shared/GuiaSettings";
import ResumoEmpresas from "@/views/Home/Operacao/components/ResumoEmpresas";
import ResumoIRPF from "@/views/Home/Operacao/components/ResumoIRPF";

export default {
  name: "Operacao",
  components: {ResumoIRPF, ResumoEmpresas, GuiaSettings, ResumoGuias, ResumoContratos}
}
</script>

<style scoped>

</style>
