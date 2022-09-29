<template>
  <form class="flex flex-wrap items-start mt-8" @submit.prevent="updateEmpresa">
    <div class="flex flex-wrap">
      <label class="block px-2 w-full">
        <Lynx-Label label="Protocolo" />
        <Lynx-Input
          placeholder="Insira o Protocolo"
          v-model="form.precadastro.protocolo"
        />
      </label>

      <label class="block px-2 w-3/5">
        <Lynx-Label label="Razão Social" />
        <Lynx-Input
          placeholder="Insira a Razão Social"
          v-model="form.empresa.razao_social"
        />
      </label>

      <label class="block px-2 w-2/5">
        <Lynx-Label label="Início atividades" />
        <InputDate
          v-model="form.empresa.inicio_atividades"
          position="is-bottom-left"
        />
      </label>

      <label class="block px-2 w-3/5">
        <Lynx-Label label="CNPJ" />
        <Lynx-Input
          placeholder="Insira o CNPJ"
          v-model="form.empresa.cnpj"
          mask="##.###.###/####-##"
        />
      </label>

      <label class="block px-2 w-1/5">
        <Lynx-Label label="CNAE" />
        <Lynx-Input placeholder="Insira o CNAE" v-model="form.cnae.codigo" />
      </label>

      <label class="block px-2 w-1/5">
        <Lynx-Label label="NIRE" />
        <Lynx-Input placeholder="Insira o NIRE" v-model="form.empresa.nire" />
      </label>

      <InputFile class="px-2" text="Cartão Cnpj" ref="arquivoCartaoCnpjInput" />
      <InputFile
        class="px-2"
        text="Contrato Social"
        ref="arquivoContratoSocialInput"
      />
      <InputFile
        class="px-2"
        text="Enquadramento"
        ref="arquivoEnquadramentoInput"
      />
      <InputFile class="px-2" text="Guia" ref="arquivoGuiaInput" />
      <InputFile class="px-2" text="Comprovante" ref="ComprovanteInput" />
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
        :disabled="loading"
      />
    </div>

    <p class="text-neutral-600 ml-6 mt-2">
    
    </p>
    <div class="w-full flex flex-wrap mt-2"  >
      <p class="w-full px-2 text-xl font-display mb-4">Procuração</p>

      <label class="w-1/4 px-2 block">
        <Lynx-Label label="Data de Vencimento" />
PJ
        <InputDate v-model="form.procuracaopj.data_vencimento" />
        <div class="w-full flex flex-wrap mt-2">
          <InputFile class="px-2" text="Procuracao" ref="ProcuracaopfInput" />
        </div>
      </label>
      
        <label class="w-1/4 px-2 block">
        <Lynx-Label label="Data de Vencimento" />
PF
        <InputDate v-model="form.procuracaopf.data_vencimento" />
        <div class="w-full flex flex-wrap mt-2">
          <InputFile class="px-2" text="Procuracao" ref="ProcuracaopjInput" />
        </div>
      </label>
    </div>
                 <b-switch  v-model="viabilidade">cadastro feito na dominio</b-switch>



    <b-loading :active.sync="loading" :is-full-page="false"></b-loading>
  </form>
</template>

<script>
import { EmpresaPosCadastroUpdate } from "@/services/requests/empresaPosCadastro";
import InputFile from "@/components/helpers/InputFile";
import InputDate from "@/components/helpers/InputDate";
import { empresaCancelRequest } from "@/services/requests/empresas";

export default {
  name: "StepCnpj",
  components: { InputFile, InputDate },
  props: ["empresa"],
  data() {
    return {
      viabilidade:this.empresa.tem_cadastro_dominio ,
       procuracao: this.empresa.procuracaopj.data_vencimento == null ? false : true,
       
      loading: false,
      form: {
        precadastro: {
          protocolo: this.empresa.precadastro.empresa.protocolo ?? null,
        },
        empresa: {
          razao_social: this.empresa.razao_social,
          tem_cadastro_dominio: this.empresa.tem_cadastro_dominio,

          inicio_atividades: this.empresa.inicio_atividades,
          cnpj: this.empresa.cnpj,
          nire: this.empresa.nire,

          arquivos: {
            cartao_cnpj: null,
            contrato_social: null,
            enquadramento: null,
            guia: null,
            comprovante: null,
          },
        },
        procuracaopj: {
          data_vencimento: this.empresa.procuracaopj.data_vencimento,
          arquivos: {
            procuracao: null,
          },
        },
         procuracaopf: {
          data_vencimento: this.empresa.procuracaopf.data_vencimento,
          arquivos: {
            procuracao: null,
          },
        },

        cnae: {
          codigo: this.empresa.cnae.codigo,
        },
      },
    };
  },
  mounted() {},
  methods: {
    async updateEmpresa() {
      this.loading = true;

      if (this.$refs.arquivoCartaoCnpjInput) {
        this.form.empresa.arquivos.cartao_cnpj =
          await this.$refs.arquivoCartaoCnpjInput.submit();
      }

      if (this.$refs.arquivoContratoSocialInput) {
        this.form.empresa.arquivos.contrato_social =
          await this.$refs.arquivoContratoSocialInput.submit();
      }

      if (this.$refs.arquivoEnquadramentoInput) {
        this.form.empresa.arquivos.enquadramento =
          await this.$refs.arquivoEnquadramentoInput.submit();
      }

      if (this.$refs.arquivoGuiaInput) {
        this.form.empresa.arquivos.guia =
          await this.$refs.arquivoGuiaInput.submit();
      }
      if (this.$refs.ComprovanteInput) {
        this.form.empresa.arquivos.comprovante =
          await this.$refs.ComprovanteInput.submit();
      }

      if (this.$refs.ProcuracaopfInput) {
        this.form.procuracaopf.arquivos.procuracao =
          await this.$refs.ProcuracaopfInput.submit();
      }

 if (this.$refs.ProcuracaopjInput) {
        this.form.procuracaopj.arquivos.procuracao =
          await this.$refs.ProcuracaopjInput.submit();
      }

      this.form.empresa.tem_cadastro_dominio = this.viabilidade

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
  },
};
</script>
