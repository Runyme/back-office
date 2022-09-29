<template>
  <div>
    <b-loading :active.sync="isLoading" />
    <Lynx-Title :text="headerTitle"/>
    <div class="flex pb-8">
      <div class="flex flex-col">
        <h3 class="text-2xl text-neutral-700 font-display pb-1">Empresa</h3>
        <span class="text-neutral-600">{{ serviceOrder.empresa_id }} - {{ serviceOrder.razao_social }}</span>
      </div>
      <div class="flex flex-col pl-12" v-if="serviceOrder.socio">
        <h3 class="text-2xl text-neutral-700 font-display pb-1">Sócio</h3>
        <span class="text-neutral-600" v-text="serviceOrder.socio" />
      </div>
    </div>
    <div class="flex flex-col pb-12">
      <h3 class="text-2xl text-neutral-700 font-display pb-1">Descrição</h3>
      <span class="text-neutral-600" v-text="serviceOrder.descricao" />
    </div>

    <div class="pb-12" v-if="serviceOrder.anexos.length">
      <h3 class="text-3xl text-gray-300 font-display text-primary-600 pb-4">Anexos</h3>
      <div class="grid grid-cols-4 gap-4">
        <Anexo
          v-for="(anexo, index) in serviceOrder.anexos"
          :key="anexo.id"
          :anexo="anexo"
          :is-deletabled="true"
          @remove-anexo="onRemoveAnexo(index)"
        />
      </div>
    </div>

    <div class="flex flex-col">
      <h3 class="text-3xl text-gray-300 font-display text-primary-600 pb-4">Serviços</h3>
      <div class="grid grid-cols-2 gap-8 items-start pb-8">
        <ServiceOrderCard
          :mail-send="mailSend"
          :service="service"
          v-for="(service, key) in serviceOrder.items"
          :key="key"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getServiceOrder } from "../../../../services/requests/service-order";
import Anexo from '@/views/service-order/components/Anexo';
import { mapGetters } from 'vuex'
import ServiceOrderCard from "./components/service-order-card/ServiceOrderCard";
import { buscarEmpresaEmailEnvio } from "../../../../services/requests/empresas";

export default {
  name: "Execute",
  components: { ServiceOrderCard, Anexo },
  data() {
    return {
      isLoading: false,
      serviceOrder: {
        cliente_id: '',
        anexos: [],
        items: []
      },
      mailSend: {
        cliente: '',
        gestor: '',
        usuario: ''
      }
    }
  },
  beforeMount() {
    this.getOrderServiceRouteParams();
  },
  computed: {
    ...mapGetters(['getUser']),
    headerTitle() {
      return `Ordem de serviço - Solicitação 00${ this.serviceOrder.id || '' }`
    }
  },
  methods: {
    getOrderServiceRouteParams() {
      this.isLoading = true;
      const {id} = this.$route.params;

      getServiceOrder(id).then(({data}) => {
        this.serviceOrder = data
      }).then(() => this.getClientMailSend())
        .finally(() => this.isLoading = false);
    },
    getClientMailSend() {
      this.isLoading = true;
      buscarEmpresaEmailEnvio(this.serviceOrder.empresa_id)
        .then(({data}) => {
            this.mailSend = {
              cliente: data[0],
              usuario: this.getUser.email
            }
        })
        .finally(() => this.isLoading = false);
    },
    onRemoveAnexo(index) {
      this.serviceOrder.anexos.splice(index, 1)
    }
  }
}
</script>

<style scoped>
  .anexos-file {
    border: 1px solid #667EEA;
    padding: 5px 10px;
    border-radius: 5px;
    color: #667EEA;
  }

  .delete-anexo-button {
    border-radius: 41px;
    font-size: 11px;
    background-color: red;
    color: #fff;
    padding: 9px;
    cursor: pointer;
    opacity: 0.6;
    float: right;
  }
</style>
