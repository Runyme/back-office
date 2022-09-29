<template>
  <div class="p-8 bg-neutral-300">
    <Lynx-Title text="Acessos do cliente"/>
    <div class="grid grid-cols-3 gap-8">
      <AcessoItem
        v-for="item in acessoItems"
        :key="item.id"
        :acesso-item="item"
        @update-acesso="onUpdateAcesso"
      />
    </div>
  </div>
</template>

<script>

import AcessoItem from '@/views/clientes/show/AcessoItem'

export default {
  name: 'AcessoDetail',
  components: {AcessoItem},
  props: {
    acesso: {
      required: true,
      type: Array
    },
  },
  computed: {
    acessoItems() {
      const emissor = this.acesso.find(item => item.type === 'meu_inss')

      console.log(emissor)
      return [
        {
          label: 'Meu Inss',
          tipo: 'meu_inss',
          acesso: emissor,
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
