<template>
  <div class="flex flex-col h-full bg-white rounded p-8 my-8">
    <p class="font-display text-xl font-bold border-b mb-8">Envio de Arquivos</p>

    <div class="w-full flex flex-col justify-center h-full items-center" v-if="loadingMail">
      <p class="mb-4 font-bold text-2xl text-primary-600">Enviando Email</p>
      <Lynx-Spinner size="12"/>
    </div>

    <div v-else>
      <div class="flex mb-4">
        <Input-File class="mr-4" text="Arquivo" ref="arquivoInput"/>
        <b-button type="is-primary" @click.prevent="uploadFile">Fazer Upload do Arquivo</b-button>
      </div>

      <div class="mb-4">
        <div class="w-full flex justify-center h-full items-center" v-if="loading">
          <Lynx-Spinner size="12"/>
        </div>

        <div v-else>
          <div v-if="arquivos.length !== 0" class="flex">
            <div v-for="(arquivo, index) in arquivos" :key="index" class="p-2">
              <b-checkbox v-model="form.files_ids" :native-value="arquivo.id" size="is-medium">
                {{ arquivo.nome_original }}
              </b-checkbox>
            </div>
          </div>

          <Not-Found-Data text="Nenhum arquivo!" v-else />
        </div>
      </div>

      <div>
        <form @submit.prevent="sendMail">
          <b-field label="Email">
            <b-input v-model="form.email" type="email" required></b-input>
          </b-field>

          <b-field label="Assunto">
            <b-input v-model="form.subject" required></b-input>
          </b-field>

          <b-field label="Mensagem">
            <b-input type="textarea" v-model="form.message" required></b-input>
          </b-field>

          <b-button type="is-primary" size="is-medium" native-type="submit">Enviar Email</b-button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import NotFoundData from "@/components/layouts/NotFoundData";
import InputFile from '@/components/helpers/InputFile'
import {
  EmpresaPosCadastroFiles,
  EmpresaPosCadastroAttachFiles,
  EmpresaPosCadastroSendFiles
} from "@/services/requests/empresaPosCadastro";

export default {
  name: "EmpresaPosCadastroEnvioArquivos",
  components: {InputFile, NotFoundData},
  props: ['empresaId'],
  data() {
    return {
      loadingMail: false,
      loading: false,
      arquivos: [],
      form: {
        email: '',
        subject: '',
        message: '',
        files_ids: [],
      }
    };
  },
  computed: {},
  mounted() {
    this.fetchArquivos()
  },
  methods: {
    fetchArquivos() {
      this.loading = true;

      EmpresaPosCadastroFiles(this.empresaId)
        .then((res) => {
          this.arquivos = res.data;
        })
        .finally(() => (this.loading = false));
    },
    async uploadFile() {
      this.loading = true;

      const arquivoId = await this.$refs.arquivoInput.submit()

      EmpresaPosCadastroAttachFiles(this.empresaId, { 'file_id': arquivoId })
        .then((res) => {
          this.arquivos = res.data;
        })
        .finally(() => (this.loading = false));
    },
    async sendMail() {
      this.loadingMail = true;

      EmpresaPosCadastroSendFiles(this.empresaId, this.form)
        .then(() => {
          this.$snack.success('Email enviado com sucesso!')
        })
        .finally(() => (this.loadingMail = false));
    },
  },
};
</script>
