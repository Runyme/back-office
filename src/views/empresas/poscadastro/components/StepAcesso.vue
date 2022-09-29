<template>
  <form class="flex flex-wrap mt-8" @submit.prevent="updateEmpresa">
    <div class="w-2/4 flex flex-wrap border-r-2 border-neutral-400 p-4">
      <label class="w-full px-2 block">
        <Lynx-Label label="Protocolo" />
        <Lynx-Input
          placeholder="Insira o Protocolo"
          v-model="form.precadastro.protocolo"
        />
      </label>

      <label class="w-full px-2 block">
        <Lynx-Label label="Site" />
        <Lynx-Input
          placeholder="Insira o Site"
          v-model="form.acessos_prefeituras.site"
        />
      </label>

      <label class="w-1/2 px-2 block">
        <Lynx-Label label="Login" />
        <Lynx-Input
          placeholder="Insira o Login"
          v-model="form.acessos_prefeituras.login"
        />
      </label>

      <label class="w-1/2 px-2 block">
        <Lynx-Label label="Senha" />
        <Lynx-Input
          placeholder="Insira a Senha"
          v-model="form.acessos_prefeituras.senha"
        />
      </label>

      <InputFile class="px-2" text="AIDF" ref="arquivoAidfInput" />
    </div>

    <div class="w-2/4 flex flex-wrap p-4">
      <p class="w-full text-xl font-display mb-4">Certificado Digital</p>

      <div class="flex">
        <InputFile
          v-show="!form.certificado_digital_empresa.arquivo"
          class="px-2"
          text="Certificado Digital"
          ref="arquivoCertificadoDigitalInput"
        />
        <Attachment
          class="px-2"
          v-if="form.certificado_digital_empresa.arquivo"
          :anexo="form.certificado_digital_empresa.arquivo"
          :is-deletabled="true"
          @remove-anexo="onRemoveAnexo"
        />

        <InputFile
          v-show="!form.certificado_digital_empresa.comprovante"
          class="px-2"
          text="Comprovante"
          ref="arquivoComprovanteCertificadoInput"
        />
        <Attachment
          class="px-2"
          v-if="form.certificado_digital_empresa.comprovante"
          :anexo="form.certificado_digital_empresa.comprovante"
          :is-deletabled="true"
          @remove-anexo="onRemoveAnexo"
        />
      </div>

      <label class="w-full px-2 block">
        <Lynx-Label label="Data de Vencimento" />

        <InputDate
          v-model="form.certificado_digital_empresa.validade"
          position="is-bottom-left"
        />
      </label>

      <label class="w-full px-2 block">
        <Lynx-Label label="Senha" />
        <Lynx-Input
          placeholder="Insira a Senha"
          v-model="form.certificado_digital_empresa.senha"
        />
      </label>

      <label class="w-full px-2 block">
        <Lynx-Label label="Código" />
        <Lynx-Input
          placeholder="Insira o Código"
          v-model="form.certificado_digital_empresa.codigo"
        />
      </label>
    </div>

    <!-- deiss -->
    <div class="w-2/4 flex flex-wrap border-neutral-400">
      <p class="text-neutral-600 ml-6">
        <b-switch v-model="temdeiss" :true-value="true" :false-value="false"
          >Possui DEISS</b-switch
        >
      </p>

      <div v-show="temdeiss" class="flex flex-wrap p-4">
        <p class="w-full text-xl font-display mb-4">Acesso deiss</p>

        <label class="w-full px-2 block">
          <Lynx-Label label="Site" />
          <Lynx-Input
            placeholder="Insira o Site"
            v-model="form.acessos_deiss.site"
          />
        </label>
        <label class="w-1/2 px-2 block">
          <Lynx-Label label="Login" />
          <Lynx-Input
            placeholder="Insira o Login"
            v-model="form.acessos_deiss.login"
          />
        </label>

        <label class="w-1/2 px-2 block">
          <Lynx-Label label="Senha" />
          <Lynx-Input
            placeholder="Insira a Senha"
            v-model="form.acessos_deiss.senha"
          />
        </label>
      </div>
    </div>

    <div class="w-full flex flex-col px-2 mt-4">
      <Lynx-Button
        type="submit"
        text="Salvar"
        class="self-end"
        :loading="loading"
        :disable="loading"
      />
    </div>
    <p class="text-neutral-600 ml-6">
      <b-switch v-model="pularAcessos" :true-value="true" :false-value="false"
        >Pular Acessos</b-switch
      >
    </p>

    <b-loading :active.sync="loading" :is-full-page="false"></b-loading>
  </form>
</template>

<script>
import {
  EmpresaPosCadastroUpdate,
  EmpresaPosCadastroUpdatePularAcesso,
} from "@/services/requests/empresaPosCadastro";
import InputFile from "@/components/helpers/InputFile";
import InputDate from "@/components/helpers/InputDate";
import Attachment from "@/components/shared/Attachment";

export default {
  name: "StepAcesso",
  components: { Attachment, InputFile, InputDate },
  props: ["empresa"],
  data() {
    return {
      loading: false,
      temdeiss: false,
      form: {
        precadastro: {
          protocolo: this.empresa.precadastro.empresa.protocolo ?? null,
        },
        acessos_prefeituras: {
          site: this.empresa.acessos_prefeituras.site,
          login: this.empresa.acessos_prefeituras.login,
          senha: this.empresa.acessos_prefeituras.senha,
          tipo: "emissor",
          arquivos: {
            aidf: null,
          },
        },
        certificado_digital_empresa: {
          validade: this.empresa.certificado_digital.validade,
          senha: this.empresa.certificado_digital.senha,
          codigo: this.empresa.certificado_digital.codigo,
          arquivo: null,
          comprovante: null,
        },
        acessos_deiss: {
          site: this.empresa.acessos_deiss.site,
          login: this.empresa.acessos_deiss.login,
          senha: this.empresa.acessos_deiss.senha,
          tipo: "deiss",
        },
      },
      pularAcessos: this.empresa.status_id == 6 ? false : true ,
    };
  },
  mounted() {
    this.mountCertificados();
  },
  methods: {
    async updateEmpresa() {
      this.loading = true;

      if (this.$refs.arquivoAidfInput) {
        this.form.acessos_prefeituras.arquivos.aidf =
          await this.$refs.arquivoAidfInput.submit();
      }

      if (this.$refs.arquivoCertificadoDigitalInput) {
        this.form.certificado_digital_empresa.arquivo =
          await this.$refs.arquivoCertificadoDigitalInput.submit();
      }

      if (this.$refs.arquivoComprovanteCertificadoInput) {
        this.form.certificado_digital_empresa.comprovante =
          await this.$refs.arquivoComprovanteCertificadoInput.submit();
      }

      EmpresaPosCadastroUpdate(this.empresa.id, this.form)
        .then(() => {
          this.$snack.success("Empresa atualizada com sucesso!");
          this.$emit("updated");
        })
        .catch((error) => {
          const errors = Object.values(error.response.data.errors);
          const message = errors
            .map((item) => item.map((error) => `<li>${error}</li>`).join(""))
            .join("");

          this.$buefy.dialog.alert({
            title: "Não foi possível atualizar a empresa",
            message: `<ul>${message}</ul>`,
            type: "is-danger",
            ariaRole: "alertdialog",
            ariaModal: true,
          });
        })
        .finally(() => (this.loading = false));
    },
    onRemoveAnexo() {
      this.$emit("updated");
    },
    mountCertificados() {
      let certificadoDigital = this.empresa.certificado_digital;
      let arquivoCertificado;
      let arquivoComprovante;

      if (certificadoDigital && certificadoDigital.arquivos) {
        arquivoCertificado = certificadoDigital.arquivos.filter(
          (arquivo) => arquivo.nome === "arquivo_certificado"
        );
        arquivoComprovante = certificadoDigital.arquivos.filter(
          (arquivo) => arquivo.nome === "comprovante_certificado"
        );
      }

      this.form.certificado_digital_empresa.arquivo =
        arquivoCertificado && arquivoCertificado.length
          ? arquivoCertificado[0]
          : null;
      this.form.certificado_digital_empresa.comprovante =
        arquivoComprovante && arquivoComprovante.length
          ? arquivoComprovante[0]
          : null;
    },
  },
  watch: {
    pularAcessos: function (status) {
      if (status == true) {
        console.log("testadno");
        EmpresaPosCadastroUpdatePularAcesso(this.empresa.id)
          .then(() => {
            this.$snack.success("Empresa atualizada com sucesso!");
            this.$emit("updated");
          })
          .catch((error) => {
            const errors = Object.values(error.response.data.errors);
            const message = errors
              .map((item) => item.map((error) => `<li>${error}</li>`).join(""))
              .join("");

            this.$buefy.dialog.alert({
              title: "Não foi possível atualizar a empresa",
              message: `<ul>${message}</ul>`,
              type: "is-danger",
              ariaRole: "alertdialog",
              ariaModal: true,
            });
          })
          .finally(() => (this.loading = false));
      }
    },
  },
};
</script>
