<template>
  <div class="p-8 bg-neutral-300">
    <Lynx-Title text="Acesso Prefeitura"/>
    <div class="grid grid-cols-3 gap-8">
      <Acesso-Prefeitura-Item 
        v-for="item in acessoItems"
        :key="item.id"
        :acesso-item="item"
        @update-acesso="onUpdateAcesso"
      />
    </div>
  </div>
</template>

<script>

import AcessoPrefeituraItem from '@/views/empresas/show/AcessoPrefeituraItem'

export default {
  name: 'AcessoPrefeituraDetails',
  components: { AcessoPrefeituraItem },
  props: {
    acessoPrefeitura: {
      required: true,
      type: Array
    },
  },
  computed: {
    acessoItems() {
      const emissor = this.acessoPrefeitura.find(curr => curr.tipo === 'emissor')
      const alvara = this.acessoPrefeitura.find(curr => curr.tipo === 'alvara')
      const prefeitura = this.acessoPrefeitura.find(curr => curr.tipo === 'prefeitura')
      const deiss = this.acessoPrefeitura.find(curr => curr.tipo === 'deiss')

      
      return [
        {
          label: 'Emissor',
          tipo: 'emissor',
          acesso: emissor,
        },
        {
          label: 'Alvara',
          tipo: 'alvara',
          acesso: alvara,
        },
        {
          label: 'Prefeitura',
          tipo: 'prefeitura',
          acesso: prefeitura,
        },
          {
          label: 'DEISS',
          tipo: 'deiss',
          acesso: deiss,
        },
      ]
    }
  },
  methods: {
    onUpdateAcesso() {
      this.$emit('update-acesso')
    }
  }
}
</script>