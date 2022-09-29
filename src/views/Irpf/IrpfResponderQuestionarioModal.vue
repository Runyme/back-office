<template>
  <div>
    <b-message type="is-danger" closable v-if="error !== null">
      <pre class="text-error-dark">{{ error }}</pre>
    </b-message>

    <div class="divide-y divide-neutral-500">
      <div v-for="(item, index) in questions" :key="item.id" class="py-8">
        <h3 class="text-gray-700 text-xl">{{ item.pergunta }}</h3>

        <b-field class="pt-5">
          <b-radio-button
            v-model="questions[index].resposta"
            :native-value="0"
            type="is-danger">
            <b-icon icon="close"></b-icon>
            <span>Não</span>
          </b-radio-button>

          <b-radio-button
            v-model="questions[index].resposta"
            :native-value="1"
            type="is-success">
            <b-icon icon="check"></b-icon>
            <span>Sim</span>
          </b-radio-button>
        </b-field>

        <b-field label="Quantidade" class="w-40" v-if="item.resposta === 1 && item.quantitativo">
          <b-numberinput v-model="questions[index].quantidade" :min="1"></b-numberinput>
        </b-field>

      </div>

      <div class="py-8">
        <Lynx-Button
          class="self-end"
          text="Salvar"
          :loading="loading"
          :disabled="loading"
          icon="Check"
          @click.native="submitRespostas"
        />
      </div>
    </div>
  </div>
</template>

<script>

import {getQuestionarioClienteRequest, responderQuestionarioRequest} from "@/services/requests/irpf";

export default {
  name: "IrpfResponderQuestionarioModal",
  props: {
    clienteIrpf: Object
  },
  data() {
    return {
      loading: false,
      questions: [],
      error: null,
    }
  },
  computed: {},
  mounted() {
    this.fetchQuestionario()
  },
  methods: {
    fetchQuestionario() {
      this.loading = true
      getQuestionarioClienteRequest(this.clienteIrpf.id, {all: true})
        .then(({data: responseData}) => this.questions = responseData.data)
        .catch(({response}) => this.error = response.data)
        .finally(() => this.loading = false)
    },
    submitRespostas() {
      let form = this.questions.map(item => ({
        id: item.id,
        resposta: Boolean(item.resposta),
        quantidade: item.resposta ? item.quantidade ? item.quantidade : 1 : null,
      }))

      this.loading = true
      responderQuestionarioRequest(this.clienteIrpf.id, form)
        .then(() => {
          this.$snack.success('Salvo com sucesso')
          this.fetchQuestionario()
        })
        .catch(() => this.$snack.error('Não foi possível salvar!'))
        .finally(() => this.loading = false)
    },
  }
}
</script>

<style scoped>

</style>
