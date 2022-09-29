<template>
  <div>
    <div class="flex w-full space-x-4">
      <Lynx-Button
        class="h-10"
        text="Editar empresa"
        icon="Edit"
        size="small"
        icon-size="4"
        @click.native="editingModalOpened = true"
        type="button"
        :disabled="getEmpresa.status === 'desativada'"
      />
      <Lynx-Button
        text="Documentos"
        icon="Document"
        size="small"
        icon-size="4"
        @click.native="arquivosModalOpened = true"
      />
      <Lynx-Button
        text="O.S."
        icon="Support"
        size="small"
        icon-size="4"
        @click.native="ordemServicoModalOpened = true"
        :disabled="true"
      />
      <Lynx-Button
        text="Financeiro"
        icon="Money"
        size="small"
        icon-size="4"
        @click.native="financeiroModalOpened = true"
      />
      <Lynx-Button
        text="Guias"
        icon="Document"
        size="small"
        icon-size="4"
        @click.native="guiasModalOpened = true"
      />
       <Lynx-Button
        text="Linker"
        icon="Money"
        size="small"
        icon-size="4"
        @click.native="linkerModalOpened = true"
      />
    </div>

    <b-modal :active.sync="arquivosModalOpened">
      <Arquivos model-type="empresa" :model-id="getEmpresa.id"/>
    </b-modal>

    <b-modal :active.sync="ordemServicoModalOpened">
      <div class="bg-neutral-300 p-8">
        <ServiceOrderFormCreate/>
      </div>
    </b-modal>

    <b-modal :active.sync="editingModalOpened">
      <EditEmpresa :empresa="getEmpresa" @updated="$emit('updated')"/>
    </b-modal>

    <b-modal :active.sync="financeiroModalOpened">
      <HistoricoFinanceiro model-type="empresa" :model-id="getEmpresa.id"/>
    </b-modal>

    <b-modal :active.sync="guiasModalOpened">
      <Guias/>
    </b-modal>
       <b-modal :active.sync="linkerModalOpened" width="600px" id="modal-tall">
      <Linker/>
    </b-modal>
  </div>
</template>

<script>
import EditEmpresa from "@/views/empresas/show/EditEmpresa";
import ServiceOrderFormCreate from "@/views/service-order/request/create/ServiceOrderFormCreate";
import Arquivos from "@/views/empresas/show/Arquivos";
import {mapGetters} from "vuex";
import Guias from "@/views/empresas/show/Guias";
import Linker from "@/views/empresas/show/casLinker"
import HistoricoFinanceiro from "@/views/empresas/show/HistoricoFinanceiro";

export default {
  name: "ButtonsBar",
  components: {HistoricoFinanceiro, Guias, Arquivos, ServiceOrderFormCreate, EditEmpresa,Linker},
  data() {
    return {
      arquivosModalOpened: false,
      ordemServicoModalOpened: false,
      editingModalOpened: false,
      financeiroModalOpened: false,
      guiasModalOpened: false,
      linkerModalOpened:false,
    }
  },
  computed: {
    ...mapGetters(['getEmpresa']),
  },
}
</script>

<style scoped>

</style>
