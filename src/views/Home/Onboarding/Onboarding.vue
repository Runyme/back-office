<template>
  <div class="w-full">
    <div class="flex flex-row-reverse "> 
      <div>   <Lynx-Label label="Carteiras Onboarding" />
    <select name=" form-class" id="" v-model="carteiraOnb" @click="onboardingSearch">
      <option value="0"> Todos</option>
      <option value="10">Onboarding 1</option>
      <option value="16">Onboarding 2</option>
      <option value="11">Onboarding Atletica</option>
    </select>
    </div>
    </div>


    <div class="my-8 w-full grid grid-cols-2 gap-4" style="min-height: 250px">
      <AlvaraCountStats />
      <CnpjCountStats />
      <NewCompaniesCountStats />
    </div>
    <div class="my-8 w-full grid grid-cols-2 gap-4" style="min-height: 250px">
      <EmpresaStatus class="h-full" />
      <CompaniesTimeByStep class="h-full" />
    </div>
    <div class="my-8 w-full gap-4" style="min-height: 350px">
      <EmpresaCarteira class="h-full" />
    </div>

    <!-- <div class="my-8 w-full gap-4" style="min-height: 350px">
      <AwaitingFinishRegister class="h-full col-span-2" />
    </div> -->
  </div>
</template>

<script>
import EmpresaStatus from "@/views/Home/Onboarding/components/EmpresaStatus";
import CompaniesTimeByStep from "@/views/Home/Onboarding/components/CompaniesTimeByStep";
// import AwaitingFinishRegister from "@/views/Home/Onboarding/components/AwaitingFinishRegister";
import AlvaraCountStats from "@/views/Home/Onboarding/components/AlvaraCountStats";
import CnpjCountStats from "@/views/Home/Onboarding/components/CnpjCountStats";

import NewCompaniesCountStats from "@/views/Home/Onboarding/components/NewCompaniesCountStats";
import EmpresaCarteira from "@/views/Home/Onboarding/components/EmpresaCarteira";
export default {
  name: "Onboarding",
  components: {
    NewCompaniesCountStats,
    AlvaraCountStats,
    // AwaitingFinishRegister,
    CompaniesTimeByStep,
    EmpresaStatus,
    EmpresaCarteira,
    CnpjCountStats,
  },
  data() {
    return { carteiraOnb: 10 };
  },
  created() {
    this.onboardingSearch();
  },
  methods: {
    async onboardingSearch() {
      await this.$store.dispatch(
        "configEmpresa/onboardingSearch",
        this.carteiraOnb
      );
    },
  },
};
</script>

<style scoped>
</style>
