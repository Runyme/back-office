<template>
  <form class="flex flex-wrap items-start mt-8" @submit.prevent="updateEmpresa">
     
    <div
      class="
        w-2/5
        flex flex-wrap
        items-end
        border-2 border-neutral-400
        rounded
        p-4
      "
    >
   
 
 <div class="w-full flex justify-between items-center">
        <p class="px-2 text-xl font-display mb-4">Alvará</p>
        <Label  class="mb-3" for="checkbox">
          <input
            style="font-size: 20px"
            type="checkbox"
            id="checkbox"
            v-model="alvaraDefinitivo"
            class="form-control"
            @click="alvaraProvisorio = false "
          />
          Alvara Definitivo
        </Label>
        <Label  class="mb-3" for="checkbox">
          <input
            style="font-size: 20px"
            type="checkbox"
            id="checkbox"
            v-model="alvaraProvisorio"
            class="form-control"
            @click="alvaraDefinitivo = false "

          />
          Alvara Provisorio
        </Label>
      </div>
      <label v-show="alvaraProvisorio" class="w-full px-2 block">
        <Lynx-Label label="Data de Vencimento" />

        <InputDate v-model="form.alvara.data_vencimento" />
      </label>

      <div class="w-full flex flex-wrap">
        <Input-File class="px-2 mb-4" text="Alvará" ref="arquivoAlvaraInput" />
        <Input-File
          class="px-2 mb-4"
          text="Requerimento"
          ref="arquivoRequerimentoInput"
        />
        <Input-File
          class="px-2 mb-4"
          text="Guia Laudo"
          ref="arquivoGuiaLaudoInput"
        />
      </div>
    </div>

    <div class="w-3/5 flex flex-wrap pl-4 mb-5">
      <label class="w-1/2 px-2 block">
        <Lynx-Label label="Inscrição municipal" />
        <Lynx-Input
          placeholder="Insira a Inscrição municipal"
          v-model="form.empresa.inscricao_municipal"
        />
      </label>

      <label class="w-1/2 px-2 block">
        <Lynx-Label label="Protocolo" />
        <Lynx-Input
          placeholder="Insira o Protocolo"
          v-model="form.precadastro.protocolo"
        />
      </label>

      <div
        v-if="empresa.regime_tributario == 'SN'"
        class="
          w-full
          flex flex-wrap
          items-end
          border-2 border-neutral-400
          rounded
          p-2
        "
      >
        <p class="w-full px-2 text-xl font-display">Simples Nacional</p>

        <label class="w-1/2 px-2 block">
          <Lynx-Label label="Código de Acesso" />
          <Lynx-Input
            placeholder="Insira a Código de Acesso"
            v-model="form.empresa.codigo_acesso_simples"
          />
        </label>

        <label class="w-1/2 px-2 block mb-6">
          <Lynx-Label label="Data do Enquadramento" />

          <InputDate v-model="form.empresa.data_sn" position="is-bottom-left" />
        </label>
      </div>
    </div>
    <div class="w-2/5 flex flex-wrap border-2 border-neutral-400 rounded p-4">
      <p class="w-full px-2 text-xl font-display mb-4">Alvará Sanitario</p>

      <label class="w-full px-2 block">
        <Lynx-Label label="Data de Vencimento" />

        <InputDate v-model="form.alvara_sanitario.data_vencimento" />
      </label>

      <div class="w-full flex flex-wrap">
        <Input-File
          class="px-2 mb-4"
          text="Alvará"
          ref="arquivoAlvaraSanitarioInput"
        />
      </div>
    </div>
    <div
      class="ml-4 w-2/5 flex flex-wrap border-2 border-neutral-400 rounded p-4"
    >
      <p class="w-full px-2 text-xl font-display mb-4">Bombeiro</p>

      <label class="w-full px-2 block">
        <Lynx-Label label="Data de Vencimento" />

        <InputDate v-model="form.bombeiro.data_vencimento" />
      </label>

      <div class="w-full flex flex-wrap">
        <Input-File
          class="px-2 mb-4"
          text="Alvará"
          ref="arquivoBombeiroInput"
        />
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

          <Label  class="mb-3" for="checkbox">
                          <b-switch  v-model="check">viabilidade</b-switch>

        </Label> 

    <b-loading :active.sync="loading" :is-full-page="false"></b-loading>
  </form>
</template>

<script>
import { EmpresaPosCadastroUpdate } from "@/services/requests/empresaPosCadastro";
import InputFile from "@/components/helpers/InputFile";
import InputDate from "@/components/helpers/InputDate";

export default {
  name: "StepAlvara",
  components: { InputFile, InputDate },
  props: ["empresa"],
  data() {
    return {
      alvaraDefinitivo: this.empresa.alvara.alvaraDefinitivo == 1,
      alvaraProvisorio: this.empresa.alvara.alvaraDefinitivo == null,
          check: this.empresa.alvara.arquivos != null ? true:false   ,
      loading: false,
      form: {
        precadastro: {
          protocolo: this.empresa.precadastro.empresa.protocolo ?? null,
        },
        empresa: {
          codigo_acesso_simples: this.empresa.codigo_acesso_simples,
          data_sn: this.empresa.data_sn,
          inscricao_municipal: this.empresa.inscricao_municipal,
        },
        alvara_sanitario: {
          data_vencimento: this.empresa.alvara_sanitario.data_vencimento,
          arquivos: {
            alvara: null,
          },
        },
        bombeiro: {
          data_vencimento: this.empresa.alvara_sanitario.data_vencimento,
          arquivos: {
            alvara: null,
          },
        },
        alvara: {
          data_vencimento: this.empresa.alvara.data_vencimento,
          definitivo: this.alvaraDefinitivo == true ? 1 : 0,
          arquivos: {
            alvara: null,
            requerimento: null,
            guia_laudo: null,
          },
        },
      },
    };
  },
  mounted() {},
  methods: {
    async updateEmpresa() {
      this.loading = true;

      if (this.$refs.arquivoAlvaraInput) {
        this.form.alvara.arquivos.alvara =
          await this.$refs.arquivoAlvaraInput.submit();
      }

      if (this.$refs.arquivoRequerimentoInput) {
        this.form.alvara.arquivos.requerimento =
          await this.$refs.arquivoRequerimentoInput.submit();
      }

      if (this.$refs.arquivoGuiaLaudoInput) {
        this.form.alvara.arquivos.guia_laudo =
          await this.$refs.arquivoGuiaLaudoInput.submit();
      }

      if (this.$refs.arquivoAlvaraSanitarioInput) {
        this.form.alvara_sanitario.arquivos.alvara =
          await this.$refs.arquivoAlvaraSanitarioInput.submit();
      }
      if (this.$refs.arquivoBombeiroInput) {
        this.form.bombeiro.arquivos.alvara =
          await this.$refs.arquivoBombeiroInput.submit();
      }

         this.form.alvara.definitivo =  this.alvaraDefinitivo == true ? 1 : 0,
      

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
  },
};
</script>
