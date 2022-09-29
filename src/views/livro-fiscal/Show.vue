<template>
  <div class="bg-neutral-300 shadow p-8 flex flex-wrap justify-end rounded">
    <div class="flex w-full">
      <Lynx-Title :text="`${data.empresa_id} - Livro de ${data.ano}`" class="w-full"/>
      <div>
        <span class="bg-neutral-400 rounded-xl px-4 py-1">{{ data.status }}</span>
      </div>
    </div>
    <Lynx-OverlaySpinner v-if="loading" :loading="loading"/>

    <div class="flex w-full">
      <span class="text-xl text-neutral-700">
        Arquivos:
        <a
          href="#"
          class=" "
          @click.prevent="form.arquivos.push({})"
        >
            <div class="inline-flex p-1 ml-5  bg-success-base transition hover:bg-success-light rounded-full">
              <Icon-Plus size="3" class="text-neutral-100"/>
            </div>
          </a>
      </span>
    </div>
    <div class="flex w-full flex-wrap" v-if="form.arquivos.length">
      <div v-for="(arquivo, key) in form.arquivos" :key="key" class="flex w-full items-end mt-4">
        <label class="mr-4">
          <Lynx-Label label="Número"/>
          <Lynx-Input v-model="form.arquivos[key].numero" type="number"/>
        </label>

        <label class="mr-4">
          <Lynx-Label label="Tipo"/>
          <b-select v-model="form.arquivos[key].tipo">
            <option value="diario">Diário</option>
            <option value="razao">Razão</option>
            <option value="dre">DRE</option>
            <option value="balanco">Balanço</option>
            <option value="nota">Nota</option>
          </b-select>
        </label>

        <InputFile v-model="form.arquivos[key].file"/>
      </div>
    </div>

    <div class="flex w-full mt-8" v-if="data.arquivos && data.arquivos.length">
      <Attachment
        v-for="(file, key) in data.arquivos"
        :anexo="file" :key="file.id"
        :is-deletabled="$hasRole('Super contador')"
        @remove-anexo="attachmentRemoved(key)"
      />
    </div>

    <div class="flex w-full mt-8">
      <label class="w-full">
        <Lynx-Label label="Observações:" class="text-xl text-neutral-700"/>
        <Textarea v-model="form.observacao" v-if="data.observacao === null"/>
        <span v-else>{{ data.observacao }}</span>
      </label>

    </div>

    <div class="flex w-full pt-8 border-t-2 border-neutral-400 mt-8 justify-between">
      <Lynx-Button
        @click.native="handleJustify"
        text="Justificar"
        :outlined="true"
      />
      <Lynx-Button
        @click.native="handleUpload"
        text="Enviar"
      />
    </div>
  </div>
</template>

<script>
import Attachment from "@/components/shared/Attachment";
import Textarea from "@/components/helpers/Textarea";
import InputFile from "@/components/helpers/InputFile";
import {updateLivroFiscalRequest} from "@/services/requests/livroFiscal";

export default {
  name: "Show",
  components: {InputFile, Textarea, Attachment},
  props: {
    data: Object
  },
  data() {
    return {
      form: {
        arquivos: [{}],
        observacao: this.data.observacao
      },
      loading: false,
    }
  },
  mounted() {
    if (this.data.arquivos && this.data.arquivos.length) {
      this.form.arquivos = []
    }
  },
  methods: {
    attachmentRemoved(index) {
      this.data.arquivos.splice(index, 1)
    },
    handleUpload() {
      this.loading = true
      updateLivroFiscalRequest(this.data.id, {
        ...this.form, status: 'entregue', ano: this.data.ano
      })
        .then(() => {
          this.$snack.success('Salvo com sucesso!')
          this.$emit('updated')
        })
        .catch(() => this.$snack.error('Não foi possível completar a solicitação!'))
        .finally(() => this.loading = false)
    },
    handleJustify() {
      this.loading = true
      updateLivroFiscalRequest(this.data.id, {
        ...this.form, status: 'justificado'
      })
        .then(() => {
          this.$snack.success('Salvo com sucesso!')
          this.$emit('updated')
        })
        .catch(() => this.$snack.error('Não foi possível completar a solicitação!'))
        .finally(() => this.loading = false)
    }
  }
}
</script>

<style scoped>

</style>
