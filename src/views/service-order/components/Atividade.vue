<template>
  <Card background="neutral-100">
    <div class="p-6 w-full relative">
      <div class="absolute top-0 right-0 mt-2 mr-2">
        <a
          href="#" 
          class="rounded-full bg-error-light transition hover:bg-error-base flex p-1" 
          @click.prevent="removeAtividade"
        >
          <Icon-Cross class="text-neutral-100" size="2"/>
        </a>
      </div>
      <div class="flex flex-col pb-6">
        <label class="flex flex-col pb-4">
          <Lynx-Label label="Nome"/>
          <Lynx-Input v-model="atividade.nome" placeholder="Insira o nome da atividade" required/>
        </label>
        <label class="flex flex-col pb-4">
          <Lynx-Label label="SLA (Minutos)"/>
          <Lynx-Input type="number" v-model="atividade.sla_hora" placeholder="Insira o SLA" required/>
        </label>
        <label class="flex flex-col">
          <Lynx-Label label="Descrição"/>
          <Lynx-Textarea v-model="atividade.descricao" placeholder="Descreva a atividade" required/>
        </label>
      </div>
      <Lynx-Button 
        text="Adicionar campo" 
        size="small" 
        icon-size="4" 
        icon="Plus"
        outlined="true"
        @click.native="addNewInput"
      />
      <div v-if="atividade.input.length">
        <div 
          class="flex relative mt-10"
          v-for="(campo, index) in atividade.input"
          :key="campo.id"
        >
          <div class="absolute top-0 right-0">
            <a
              href="#" 
              class="rounded-full bg-neutral-500 transition hover:bg-error-base flex p-1" 
              @click.prevent="removeCampo(index)"
            >
              <Icon-Cross class="text-neutral-100" size="2"/>
            </a>
          </div>
          <label class="flex flex-col pr-3">
            <Lynx-Label label="Nome"/>
            <Lynx-Input placeholder="Insira o nome" v-model="campo.nome" required/>
          </label>
          <label class="flex flex-col pl-3">
            <Lynx-Label label="Tipo"/>
            <b-select
              placeholder="Tipo"
              v-model="campo.tipo"
              expanded
            >
              <option
                v-for="option in tipo_campo_options"
                :value="option.value"
                :key="option.value"
                v-text="option.text"
              />
            </b-select>
          </label>
        </div>
      </div>
    </div>
  </Card>
</template>

<script>

import Card from '@/components/helpers/Card'
import LynxTextarea from '@/components/helpers/Textarea'

export default {
  name: 'Atividade',
  components: { Card, LynxTextarea},
  props: {
    atividade: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tipo_campo_options: [
        { value: 'string', text: 'Texto' },
        { value: 'date', text: 'Data' },
        { value: 'money', text: 'Dinheiro' },
        { value: 'integer', text: 'Número' },
        { value: 'boolean', text: 'Verdadeiro ou Falso' },
        { value: 'file', text: 'Anexo de Arquivo' },
      ],
    }
  },
  methods: {
    addNewInput() {
      this.atividade.input.push({
        nome: '',
        tipo: 'string',
        valor: null
      })
    },
    removeAtividade() {
      this.$emit('remove-atividade')
    },
    removeCampo(index) {
      this.atividade.input.splice(index, 1)
    }
  }
}
</script>
