<template>
  <div>
    <div class="w-full flex justify-between">
      <div class="flex items-center truncate">
        <div class="p-2 bg-primary-500 text-primary-100 mr-8 rounded text-2xl mb-8">
          C{{ getCliente.id }}
        </div>
        <Lynx-Title :text="getCliente.nome_completo"/>
      </div>
      <router-link :to="{ name: 'clientes.index' }">
        <Lynx-Button text="Voltar" icon="ArrowLeft" outlined="true"/>
      </router-link>
    </div>
    <div class="flex flex-wrap text-neutral-700">
      <div class="w-2/3 pr-4 pb-8">
        <Card
          background="neutral-100"
          color="neutral-300"
        >
          <div class="flex p-8 w-full">
            <div class="w-1/2 flex flex-col border-neutral-300 border-r-2">
              <Infos class="border-neutral-300 border-b-2 pb-4 mr-8"/>
              <Crm owner-type="cliente" :owner-id="getCliente.id" class="mt-8 pb-4 mr-8 border-neutral-300 border-b-2"/>
              <Contatos class="flex p-8 w-full" contactable-type="cliente" :contactable-id="getCliente.id"/>
            </div>
            <div class="w-1/2 flex flex-col">
              <Contas-Bancarias
                owner-type="cliente"
                :owner-id="getCliente.id"
                class="pb-4 ml-8 border-neutral-300 border-b-2"
                :owner-cpf-cnpj="getCliente.cpf"
              />
              <Irpf class="pb-4 ml-8 mt-8 border-neutral-300 border-b-2"/>

              <Endereco
                addressable-type="cliente"
                :addressable-id="getCliente.id"
                class="mx-8 mt-8 pb-4 border-neutral-300 border-b-2"
              />

              <AcessosCliente class="mx-8 mt-8 pb-4"/>
            </div>
          </div>
        </Card>
      </div>
      <div class="w-1/3 pl-4 pb-8">
        <Card
          background="neutral-100"
          color="neutral-300"
        >
          <div class="flex flex-col w-full">
            <Comentarios
              class="my-4 border-none custom-card-info hover:bg-neutral-100 mx-2"
              commentableType="cliente"
              :commentableId="getCliente.id"
            />
          </div>
        </Card>
      </div>
      <div class="flex flex-col">
        <h2 class="font-display font-bold text-3xl pb-3 border-b-2 border-neutral-400 text-primary-600">Empresas</h2>
        <div class="grid grid-cols-2 gap-8 w-full py-8">
          <Card
            background="neutral-100"
            color="neutral-300"
            v-for="empresa in empresas"
            :key="empresa.id"
          >
            <Empresa :empresa="empresa"/>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {mapGetters} from 'vuex'
import {clientesEmpresasRequest} from '@/services/requests/clientes'
import Card from '@/components/helpers/Card'
import ContasBancarias from '@/components/shared/ContasBancarias'
import Irpf from '@/views/clientes/show/Irpf'
import Infos from '@/views/clientes/show/Infos'
import Crm from '@/components/shared/Crm'
import Endereco from '@/components/shared/Endereco'
import Contatos from '@/components/shared/Contatos'
import Empresa from '@/views/clientes/show/Empresa'
import Comentarios from "@/components/shared/Comentarios";
import AcessosCliente from "@/views/clientes/show/AcessosCliente";

export default {
  name: 'ClientesShow',
  components: {
    AcessosCliente,
    Comentarios,
    Card,
    ContasBancarias,
    Irpf,
    Infos,
    Crm,
    Endereco,
    Contatos,
    Empresa,
  },
  data() {
    return {
      empresas: [],
      loading: false,
    }
  },
  computed: {
    ...mapGetters(['getCliente'])
  },
  methods: {
    fetchEmpresas() {
      this.loading = true
      clientesEmpresasRequest(this.getCliente.id)
        .then(res => this.empresas = res.data.data)
        .finally(() => this.loading = false)
    },
  },
  mounted() {
    this.fetchEmpresas()
  }
}
</script>
