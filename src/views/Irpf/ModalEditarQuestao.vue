<template>
  <div class="bg-neutral-300 p-8">
    <div class="flex items-center justify-between w-full">
      <Lynx-Title text="Questão de IRPF"/>
    </div>

    <div class="w-full flex justify-center" v-if="loading">
      <Lynx-Spinner size="12"/>
    </div>

    <div class="space-y-5">
      <div class="bg-neutral-100 p-5 rounded space-y-4">
        <span class="text-lg font-display border-b border-neutral-400 w-full pb-2 flex mb-4">
          Questionário
        </span>
        <b-field label="Pergunta">
          <b-input v-model="form.pergunta"></b-input>
        </b-field>
        <b-field label="Descrição">
          <b-input v-model="form.descricao"></b-input>
        </b-field>
     <label class="flex flex-col w-1/4 mb-2">
           <Lynx-Label label="Competencia" />
          <b-select v-model="form.ano">
            <option
              v-for="(ano, index) in anos"
              :key="index"
              :value="ano"
              v-text="ano"
            />
          </b-select>
     </label>
     
        <div class="inline-flex space-x-10">
          <b-field label="É Quantitativo?">
            <b-switch v-model="form.quantitativo" :true-value="1" :false-value="0"/>
          </b-field>
          <b-field label="É Visível ao cliente?">
            <b-switch v-model="form.visivel_cliente" :true-value="1" :false-value="0"/>
          </b-field>
          <b-field label="Gerar pendencia?">
            <b-switch v-model="form.gera_pendencia" :true-value="1" :false-value="0"/>
          </b-field>
        </div>
      </div>

      <div class="bg-neutral-100 p-5 rounded space-y-4" v-if="form.gera_pendencia">
        <span class="text-lg font-display border-b border-neutral-400 w-full pb-2 flex mb-4">
          Pendencia a gerar
        </span>
        <b-field label="Título">
          <b-input v-model="form.pendencia.nome"></b-input>
        </b-field>
        <b-field label="Descrição">
          <b-input v-model="form.pendencia.descricao"></b-input>
        </b-field>

        <div class="text-lg font-display border-b border-neutral-400 w-full flex pt-8 pb-2 justify-between">
          <span>Campos para a pendencia</span>
          <b-button
            class="font-semibold" size="is-small" type="is-primary"
            @click.prevent="form.pendencia.inputs.push({label:'',type:'text', name:''})"
          >
            Adicionar Campo +
          </b-button>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div v-for="(campo, index) in form.pendencia.inputs" :key="index"
               class="bg-neutral-200 border border-neutral-400 p-2 rounded relative">

            <a href="#"
               class="rounded-full bg-error-light transition hover:bg-error-base flex p-1 mr-2 absolute right-0"
               @click.prevent="deletePendenciaInput(index)"
               v-if="form.pendencia.inputs.length > 1"
            >
              <Icon-Cross class="text-neutral-100" size="2"/>
            </a>

            <b-field label="Título do campo">
              <b-input v-model="form.pendencia.inputs[index].label"></b-input>
            </b-field>

            <div class="grid grid-cols-2 gap-2">
              <b-field label="Tipo de campo" :class="{
                'col-span-2': form.pendencia.inputs[index].type !== 'file'
              }">
                <b-select v-model="form.pendencia.inputs[index].type">
                  <option value="text">Texto</option>
                  <option value="number">Número</option>
                  <option value="file">Arquivo</option>
                  <option value="cpf">CPF</option>
                  <option value="date">Data</option>
                </b-select>
              </b-field>

              <b-field label="Nome do arquivo" v-if="form.pendencia.inputs[index].type === 'file'">
                <b-input v-model="form.pendencia.inputs[index].name"></b-input>
              </b-field>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-neutral-100 p-5 rounded flex justify-end">
        <b-button
          :loading="loading"
          :disabled="loading"
          icon-right="floppy"
          label="Salvar"
          type="is-primary"
          @click.native="submit"/>
      </div>

    </div>

  </div>
</template>

<script>
import {
  createQuestionarioRequest,
  deletePendenciaInputRequest,
  updateQuestionarioRequest
} from "@/services/requests/irpf";

export default {
  name: "ModalEditarQuestao",
  props: {
    questao: Object
  },
  mounted() {
    if (this.questao.id) {
      this.form = {...this.questao}
      if (!this.questao.pendencia) {
        this.form.pendencia = {
          nome: null,
          descricao: null,
          inputs: [{
            name: null,
            type: 'text',
          }]
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      anos: [2020, 2021],

      form: {
        nome: null,
        quantitativo: 0,
        visivel_cliente: 1,
        gera_pendencia: 0,
        ano:null,
        pendencia: {
          nome: null,
          descricao: null,
          inputs: [{
            name: null,
            type: 'text',
          }]
        }
      }
    }
  },
  methods: {
    submit() {
      let request;
      this.loading = true

      if (!this.form.gera_pendencia) {
        this.form.pendencia = null;
      }

      if (this.form.id) {
        request = updateQuestionarioRequest(this.form.id, this.form)
      } else {
        request = createQuestionarioRequest(this.form)
      }

      request
        .then(() => {
          this.$snack.success('Salvo com sucesso!')
          this.$emit('updated')
        })
        .catch(() => this.$snack.error('Erro ao salvar.'))
        .finally(() => this.loading = false)
    },
    deletePendenciaInput(index) {
      if (this.form.pendencia.inputs[index].id && !confirm('Esse registro será removido mesmos em salvar! deseja continuar?')) return
      if (this.form.pendencia.inputs[index].id) {
        deletePendenciaInputRequest(this.form.pendencia.inputs[index].id)
      }
      this.form.pendencia.inputs.splice(index, 1)
    }
  }
}
</script>

<style scoped>

</style>
