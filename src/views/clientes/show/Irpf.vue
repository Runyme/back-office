<template>
  <div>
    <div class="flex items-center mb-4">
      <Icon-MoneyBag class="text-primary-600" size="8"/>
      <p class="pl-4 font-display text-xl font-bold">Irpf</p>
    </div>
    <div class="w-full flex flex-col">
      <div class="w-full flex justify-center py-4" v-if="loading">
        <Lynx-Spinner size="16"/>
      </div>
      <b-collapse
        v-else-if="!loading"
        class="p-1"
        animation="slide"
        v-for="(declaracao, index) of declaracoes"
        :key="index"
        :open="isOpen === index"
        @open="openDeclaracao(declaracao, index)"
      >
        <div slot="trigger" slot-scope="props" class="card-header shadow-none" role="button">
          <p class="card-header-title text-neutral-700">
            {{ declaracao.ano }}
          </p>
          <a class="card-header-icon">
            <b-icon :icon="props.open ? 'menu-down' : 'menu-right'"></b-icon>
          </a>
        </div>
        <div class="flex flex-col w-full" v-if="hasIrpfArquivos(declaracao)">
          <div class="flex flex-col pt-2">
            <div
              class="flex justify-between pb-6 items-center"
              v-for="arquivo in declaracao.arquivos"
              :key="arquivo.id"
            >
              <span class="cursor-pointer capitalize" @click.prevent="$openFile(arquivo.id)" v-text="arquivo.nome"/>
              <a href="#" @click.prevent="$openFile(arquivo.id)">
                <Icon-Eye class="text-primary-600" size="6"/>
              </a>
            </div>
          </div>

          <div>
            <Lynx-Button
              @click.native="openIrpfAssetsModal = true"
              text="Ver detalhes"
              size="small"
              icon="Eye"
            />
          </div>
        </div>
        <div class="my-4 self-center flex flex-col items-center" v-else-if="!loading">
          <NotFoundData text="Nenhuma declaração foi encontrada foi encontrada"/>
          <Lynx-Button
            text="Anexar"
            icon="Attachment"
            size="small"
            icon-size="4"
            @click.native="openAnexoModal(declaracao)"
          />
        </div>
      </b-collapse>

      <div class="my-4 self-center flex flex-col items-center" v-if="!loading && !declaracoes.length">
        <NotFoundData text="Nenhuma declaração foi encontrada foi encontrada"/>
        <Lynx-Button
          text="Anexar"
          icon="Attachment"
          size="small"
          icon-size="4"
          @click.native="openAnexoModal()"
        />
      </div>

      <b-modal :active.sync="anexoModal">
        <IrpfDetails :declaracao="irpf" @update-irpf="onUpdateIrpf"/>
      </b-modal>

      <b-modal :active.sync="openIrpfAssetsModal">
        <IrpfAssets :cliente-id="irpf.cliente_id"/>
      </b-modal>
    </div>
  </div>
</template>

<script>

import { getDeclaracaoIrpfRequest } from '@/services/requests/irpf'
import NotFoundData from '@/components/layouts/NotFoundData'
import IrpfDetails from '@/views/clientes/show/IrpfDetails'
import { mapGetters } from 'vuex'
import IrpfAssets from "@/views/clientes/show/IrpfAssets";

export default {
  name: 'Irpf',
  components: {IrpfAssets, NotFoundData, IrpfDetails },
  data() {
    return {
      loading: false,
      anexoModal: false,
      openIrpfAssetsModal: false,
      irpf: {},
      declaracoes: [],
      isOpen: null,
    }
  },
  computed: {
    ...mapGetters(['getCliente']),
  },
  methods: {
    fetchIrpf() {
      this.loading = true
      getDeclaracaoIrpfRequest(this.getCliente.id)
        .then(res => this.declaracoes = res.data)
        .finally(() => this.loading = false)
    },
    openAnexoModal(declaracao = {}) {
      this.anexoModal = true
      this.irpf = declaracao
    },
    onUpdateIrpf() {
      this.anexoModal = false
      this.irpf = {}
      this.fetchIrpf()
    },
    hasIrpfArquivos(declaracao) {
      return declaracao && declaracao.arquivos && declaracao.arquivos.length
    },
    openDeclaracao(declaracao, index) {
      this.isOpen = index
      this.irpf = declaracao
    },
  },
  beforeMount() {
    this.fetchIrpf()
  }
}
</script>
