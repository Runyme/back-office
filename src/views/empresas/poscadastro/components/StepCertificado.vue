<template>
  <form class="flex flex-wrap mt-8" @submit.prevent="updateEmpresa">
    <div
      class="
        w-full
        flex flex-wrap
        items-end
        border-2 border-neutral-400
        rounded
        p-4
        my-2
      "
      v-for="(certificado, index) in form.certificado_digital_cliente"
      :key="index"
    >
      <div class="flex w-full justify-between">
        <h2 class="font-display text-xl px-2 mb-4">
          {{ certificado.cliente_nome }} • {{ certificado.cliente_cpf }}
        </h2>
        <div class="mb-2 grid grid-cols-1">
          <b-switch @input="frags2()" v-model="cert.isWithCustomer" class="mb-2"
            >Certificado com o cliente</b-switch
          >

          <b-switch @input="frags()" v-model="cert.isWithPartner" class="mb-2"
            >Certificado feito com parceiro</b-switch
          >
          <b-switch  v-model="uploads" class="mb-2"
            >Fazer upload</b-switch
          >
        </div>
      </div>

      <div
        v-if="uploads ? true : !cert.isWithCustomer && !cert.isWithPartner? true : false"
        class="w-full flex flex-wrap items-end"
      >
        <label class="block px-2 w-1/4">
          <Lynx-Label label="Validade" />
          <InputDate v-model="certificado.validade" />
        </label>

        <label class="block px-2 w-1/4">
          <Lynx-Label label="Senha" />
          <Lynx-Input
            placeholder="Insira o Senha"
            v-model="certificado.senha"
          />
        </label>

        <label class="block px-2 w-2/4">
          <Lynx-Label label="Código" />
          <Lynx-Input
            placeholder="Insira o Código"
            v-model="certificado.codigo"
          />
        </label>

        <div class="flex">
          <Attachment
            v-if="certificado.arquivoCertificado"
            :anexo="certificado.arquivoCertificado"
            :is-deletabled="true"
            @remove-anexo="onRemoveAnexo"
          />
          <InputFile
            v-show="!certificado.arquivoCertificado"
            class="px-2"
            text="Certificado Digital"
            ref="arquivoCertificadoDigitalInput"
          />

          <Attachment
            v-if="certificado.arquivoComprovante"
            :anexo="certificado.arquivoComprovante"
            :is-deletabled="true"
            class="ml-2"
            @remove-anexo="onRemoveAnexo"
          />
          <InputFile
            v-show="!certificado.arquivoComprovante"
            class="px-2"
            text="Comprovante"
            ref="arquivoComprovanteCertificadoraInput"
          />
        </div>
      </div>
      </div>

    <div class="w-full flex justify-between mt-4">
      <Lynx-Button
        @click.native="validateCancel"
        type="button"
        text="Cancelar empresa"
        color="error-base"
        :loading="loading"
      />
      <Lynx-Button
        type="submit"
        text="Salvar"
        :loading="loading"
        :disable="loading"
      />
    </div>

    <b-loading :active.sync="loading" :is-full-page="false"></b-loading>
  </form>
</template>

<script>
import { EmpresaPosCadastroUpdate } from "@/services/requests/empresaPosCadastro";
import InputFile from "@/components/helpers/InputFile";
import InputDate from "@/components/helpers/InputDate";
import Attachment from "@/components/shared/Attachment";
import { empresaCancelRequest } from "@/services/requests/empresas";

export default {
  name: "StepCertificado",
  components: { Attachment, InputFile, InputDate },
  props: ["empresa"],
  data() {
    return {
      loading: false,
      uploads:true,
      form: {
        certificado_digital_cliente: [],
      },
      cert: {
        isWithCustomer: true,
        isWithPartner: false,
      },
    };
  },
  mounted() {
    this.sociosCertificados();
  },

  methods: {
    async updateEmpresa() {
      this.loading = true;

      const promisesCertificado = this.$refs.arquivoCertificadoDigitalInput.map(
        async (input, index) => {
          if (input) {
            this.form.certificado_digital_cliente[index].arquivo =
              await input.submit();
          }
        }
      );

      const promisesComprovanteCertificado =
        this.$refs.arquivoComprovanteCertificadoraInput.map(
          async (input, index) => {
            if (input) {
              this.form.certificado_digital_cliente[index].comprovante =
                await input.submit();
            }
          }
        );
      await Promise.all([
        ...promisesCertificado,
        ...promisesComprovanteCertificado,
      ]);

      let validationMessages = this.form.certificado_digital_cliente
        .map((certificado) => {
          const messages = [];
          if (certificado.isWithCustomer === true) {
            return messages;
          }
          if (certificado.isWithPartner === true) {
            return messages;
          }

          if (!certificado.validade) {
            messages.push("Está faltando preencher alguma validade");
          }

          if (!certificado.senha) {
            messages.push("Está faltando preencher alguma senha");
          }

          if (!certificado.senha) {
            messages.push("Está faltando preencher algum código");
          }

          if (!certificado.arquivo && !certificado.comprovante) {
            messages.push(
              "Está faltando anexar algum certificado ou comprovante."
            );
          }

          return messages;
        })
        .flat();
      validationMessages = [...new Set(validationMessages)];

      if (validationMessages.length) {
        validationMessages.forEach((message) => {
          this.$snack.warning(message);
        });

        this.loading = false;

        return;
      }
      this.form.certificado_digital_cliente[0].isWithCustomer =
        this.cert.isWithCustomer;
      this.form.certificado_digital_cliente[0].isWithPartner =
        this.cert.isWithPartner;

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
    sociosCertificados() {
      this.empresa.socios.forEach((socio) => {
        let certificadoDigital = socio.certificado_digital;
        let arquivoCertificado;
        let arquivoComprovante;

        if (certificadoDigital && certificadoDigital.arquivos) {
          arquivoCertificado = certificadoDigital.arquivos.filter(
            (arquivo) => arquivo.nome === "certificado_digital"
          );
          arquivoComprovante = certificadoDigital.arquivos.filter(
            (arquivo) => arquivo.nome === "comprovante_certificado"
          );
        }
        this.cert.isWithCustomer = certificadoDigital
          ? !!socio.certificado_digital.isWithCustomer
          : false;
        this.cert.isWithPartner = certificadoDigital
          ? !!socio.certificado_digital.isWithPartner
          : false;

        this.form.certificado_digital_cliente.push({
          cliente_id: socio.id,
          cliente_nome: socio.nome_completo,
          cliente_cpf: socio.cpf,
          senha: certificadoDigital ? socio.certificado_digital.senha : null,
          validade: certificadoDigital
            ? socio.certificado_digital.validade
            : null,
          codigo: certificadoDigital ? socio.certificado_digital.codigo : null,
          arquivo: null,
          isWithCustomer: certificadoDigital
            ? !!socio.certificado_digital.isWithCustomer
            : false,
          isWithPartner: certificadoDigital
            ? !!socio.certificado_digital.isWithPartner
            : false,
          arquivoCertificado:
            arquivoCertificado && arquivoCertificado.length
              ? arquivoCertificado[0]
              : null,
          arquivoComprovante:
            arquivoCertificado && arquivoComprovante.length
              ? arquivoComprovante[0]
              : null,
        });
      });
    },
    onRemoveAnexo() {
      this.$emit("updated");
    },
    validateCancel() {
      this.$buefy.dialog.confirm({
        title: "Cancelar Empresa",
        message: "Tem certeza que deseja cancelar essa empresa??",
        confirmText: "Sim",
        cancelText: "Não",
        type: "is-primary",
        hasIcon: true,
        onConfirm: () => this.cancelCompany(),
      });
    },
    cancelCompany() {
      this.loading = true;
      empresaCancelRequest(this.empresa.id)
        .then(() => {
          this.$snack.success("Empresa Cancelada com sucesso!");
          this.$emit("canceled");
        })
        .finally(() => (this.loading = false));
    },
    frags() {
      if (this.cert.isWithPartner == true) {
        this.cert.isWithCustomer = false;
      }
    },
    frags2() {
      if (this.cert.isWithCustomer == true) {
        this.cert.isWithPartner = false;
      }
    },
  
  },
};
</script>
