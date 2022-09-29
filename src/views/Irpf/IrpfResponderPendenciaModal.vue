<template>
  <div>
    <div class="w-full flex justify-center h-full items-center" v-if="loading">
      <Lynx-Spinner size="12"/>
    </div>
    <div>
      <b-message type="is-danger" closable v-if="error !== null">
        <pre class="text-error-dark">{{ error }}</pre>
      </b-message>

      <div class="space-y-5 divide-neutral-500" v-show="!loading">
        <div v-for="(wrapper, indexWrapper) in pendenciasWrapper" :key="indexWrapper"
             class="py-8 bg-white rounded px-5">
          <div>
            <h3 class="text-gray-700 text-xl">{{ wrapper.nome }}</h3>
            <p class="text-neutral-600">{{ wrapper.descricao }}</p>
          </div>

          <div v-if="!wrapper.pendencias.length">
            <b-message>Não possui</b-message>
          </div>

          <div class="grid grid-cols-2 gap-2 mt-5" v-else>
            <div v-for="(pendencia, indexPendencia) in wrapper.pendencias" :key="indexPendencia"
                 class="border border-neutral-500 p-5 rounded">

              <div v-for="(input, inputsKey) in pendencia.inputs" :key="inputsKey">
                <b-field :label="input.label">
                  <b-input
                    v-if="['text', 'cpf'].includes(input.type)"
                    :value="'teste'"
                    v-model="input.value"
                  />
                  <InputFile
                    v-if="input.type === 'file'  && typeof input.value !== 'number'"
                    v-model="input.value"
                  />
                  <Attachment
                    :anexo="{id: input.value, nome: input.name}"
                    is-deletabled
                    v-if="input.type === 'file' && typeof input.value === 'number'"
                    @remove-anexo="attachmentRemoved(indexWrapper, indexPendencia, inputsKey)"
                  />
                  <InputDate
                    v-if="input.type === 'date'"
                    v-model="input.value"
                  />
                </b-field>
              </div>
            </div>
            <div class="mt-4 w-full col-span-2">
              <b-button
                class="w-full"
                type="is-primary"
                @click.prevent="submitPendencia(indexWrapper)"
              >Salvar
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {
  getPendenciasClienteRequest,
  responderPendenciasRequest,
} from "@/services/requests/irpf";
import InputFile from "@/components/helpers/InputFile";
import InputDate from "@/components/helpers/InputDate";
import Attachment from "@/components/shared/Attachment";

export default {
  name: "IrpfResponderPendenciaModal",
  components: {Attachment, InputDate, InputFile},
  props: {
    clienteIrpf: Object
  },
  data() {
    return {
      sending: null,
      form: {},
      loading: false,
      pendenciasWrapper: [],
      error: null,
      payload: []
    }
  },
  computed: {},
  mounted() {
    this.fetchPendencias()
  },
  methods: {
    fetchPendencias() {
      this.loading = true
      getPendenciasClienteRequest(this.clienteIrpf.id, {all: true})
        .then(({data: responseData}) => this.pendenciasWrapper = responseData.data)
        .catch(({response}) => this.error = response.data)
        .finally(() => this.loading = false)
    },
    submitPendencia(indexWrapper) {
      this.loading = true
      responderPendenciasRequest(this.pendenciasWrapper[indexWrapper].pendencias, this.clienteIrpf.id)
        .then(() => {
          this.$snack.success('Salvo com sucesso')
          this.fetchPendencias()
        })
        .catch(() => this.$snack.error('Não foi possível salvar!'))
        .finally(() => this.loading = false)
    },
    attachmentRemoved(indexWrapper, indexPendencia, inputsKey) {
      this.pendenciasWrapper[indexWrapper].pendencias[indexPendencia].inputs[inputsKey].value = null;
      this.pendenciasWrapper[indexWrapper].pendencias[indexPendencia].inputs[inputsKey].name = null;
      this.submitPendencia(indexWrapper)
    }
  }
}
</script>

<style scoped>

</style>
