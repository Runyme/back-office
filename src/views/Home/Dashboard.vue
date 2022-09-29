<template>
  <div class="pb-8">
    <Lynx-Title text="Dashboard"/>

    <div class="flex w-full mb-8">
      <Tab>
        <TabItem label="Comercial" :disabled="!$hasRole('Consultor')">
          <Comercial/>
        </TabItem>
        <TabItem label="Financeiro" :disabled="!$hasRole('Financeiro')">
          <Financeiro/>
        </TabItem>
        <TabItem label="Onboarding">
          <Onboarding/>
        </TabItem>
        <TabItem label="Operação">
          <Operacao/>
        </TabItem>
       
      </Tab>
    </div>

  </div>
</template>

<script>

import Tab from "@/components/shared/Tabs/Tab";
import TabItem from "@/components/shared/Tabs/TabItem";
import Onboarding from "@/views/Home/Onboarding/Onboarding";
import Financeiro from "@/views/Home/Financeiro/Financeiro";
import Comercial from "@/views/Home/Comercial/Comercial";
import Operacao from "@/views/Home/Operacao/Operacao";

export default {
  name: 'Dashboard',
  components: {
    Operacao,
    Comercial,
    Financeiro,
    Onboarding, TabItem, Tab,
    
  }
}
</script>
