<template>
  <div class="flex flex-col h-full">
    <div class="w-full flex justify-center h-full items-center" v-if="loading">
      <Lynx-Spinner size="12" />
    </div>

    <div class="bg-neutral-300 shadow p-10 flex flex-col rounded h-auto" v-else>
      <div v-if="empresa" class="flex flex-col">
        <div class="flex justify-between items-start">
          <button @click="$parent.close()" class="mt-3">
            <ArrowLeft />
          </button>
          <Lynx-Title :text="`${empresa.id} • ${nomeTitulo}`" />
          <b-tag type="is-primary" size="is-large">{{
            empresa.status_label
          }}</b-tag>
        </div>

        <!-- STEPS POSCADASTRO -->
        <div class="border-b-4 border-primary-500 mb-8 pb-4 step-forms">
          <b-steps v-model="activeStep" :has-navigation="false">
            <!-- STEP PRE-CADASTRO -->
            <b-step-item
              label="Pré-cadastro"
              v-if="empresa.status_id === 9"
              :clickable="true"
              class="bg-neutral-300"
            >
              <StepPreCadastro
                :empresa="empresa"
                @updated="fetchEmpresa"
                @canceled="empresaFinalizada"
              />
            </b-step-item>

            <!-- STEP CERTIFICADO -->
            <b-step-item
              label="Certificado"
              :clickable="isStepCertificadoAndDocsActive"
              class="bg-neutral-300"
            >
              <StepCertificado
                :empresa="empresa"
                @updated="fetchEmpresa"
                @canceled="empresaFinalizada"
              />
            </b-step-item>

            <!-- STEP DOCUMENTAÇÂO -->
            <b-step-item
              label="Documentação"
              :clickable="isStepCertificadoAndDocsActive"
              class="bg-neutral-300"
            >
              <StepDocumentacao
                :empresa="empresa"
                @updated="fetchEmpresa"
                @canceled="empresaFinalizada"
              />
            </b-step-item>

            <!-- STEP CNPJ -->
            <b-step-item label="CNPJ" :clickable="isStepCnpjActive">
              <StepCnpj
                :empresa="empresa"
                @updated="fetchEmpresa"
                @canceled="empresaFinalizada"
              />
            </b-step-item>

            <!-- STEP ALVARA -->
            <b-step-item label="Alvará" :clickable="isStepAlvaraActive">
              <StepAlvara :empresa="empresa" @updated="fetchEmpresa" />
            </b-step-item>

            <!-- STEP ACESSO -->
            <b-step-item label="Acesso" :clickable="isStepAcessoActive">
              <StepAcesso :empresa="empresa" @updated="fetchEmpresa" />
            </b-step-item>

            <!-- STEP SIMPLES -->
            <b-step-item
              
              label="Simples"
              :clickable="isStepSimplesActive"
            >
              <StepSimples :empresa="empresa" @updated="fetchEmpresa" />
            </b-step-item>

            <!-- STEP FINALIZAR -->
            <b-step-item label="Finalizar" :clickable="isStepFinalizarActive">
              <StepFinalizar :empresa="empresa" @updated="empresaFinalizada" />
            </b-step-item>
          </b-steps>
        </div>


        <!-- INFORMAÇÕES EMPRESAS -->
        <EmpresaDataShow
          v-if="shouldShowAllData"
          :empresa="empresa"
          @updated="fetchEmpresa"
        />
<EtapasEmpresas :empresa="empresa"/>


        <!-- ENVIO ARQUIVOS -->
        <EnvioArquivos :empresaId="empresaId" />

        <!-- COMENTÁRIOS -->

<!-- v-if="shouldShowAllData"-->

        <Comentarios
         
          commentableType="empresa"
          :commentableId="empresaId"
        />
      </div>
    </div>

    <footer class="flex modal-card-foot">
      <Lynx-Button
        icon-position="left"
        icon="ArrowLeft"
        text="Voltar"
        @click.native="$parent.close()"
      />
    </footer>
  </div>
</template>

<script>
import { EmpresaPosCadastroShow } from "@/services/requests/empresaPosCadastro";
import EmpresaDataShow from "@/views/empresas/poscadastro/components/EmpresaDataShow";
import StepCertificado from "@/views/empresas/poscadastro/components/StepCertificado";
import StepCnpj from "@/views/empresas/poscadastro/components/StepCnpj";
import StepAlvara from "@/views/empresas/poscadastro/components/StepAlvara";
import StepAcesso from "@/views/empresas/poscadastro/components/StepAcesso";
import StepSimples from "@/views/empresas/poscadastro/components/StepSimples";
import StepFinalizar from "@/views/empresas/poscadastro/components/StepFinalizar";
import StepDocumentacao from "@/views/empresas/poscadastro/components/StepDocumentacao";
import Comentarios from "@/components/shared/Comentarios";
import ArrowLeft from "@/components/icons/ArrowLeft";
import StepPreCadastro from "@/views/empresas/poscadastro/components/StepPreCadastro";
import EnvioArquivos from "@/views/empresas/poscadastro/components/EnvioArquivos";
import EtapasEmpresas from "@/views/empresas/poscadastro/components/EtapasEmpresas"
export default {
  name: "EmpresasPosCadastroShowModal",
  components: {
    StepPreCadastro,
    ArrowLeft,
    EmpresaDataShow,
    StepCertificado,
    StepDocumentacao,
    StepCnpj,
    StepAlvara,
    StepAcesso,
    StepSimples,
    StepFinalizar,
    Comentarios,
    EnvioArquivos,
    EtapasEmpresas
  },
  props: ["empresaId"],
  data() {
    return {
      activeStep: 0,
      loading: false,
      empresa: null,
    };
  },
  computed: {
    isSimples() {
      return this.empresa.regime_tributario === "SN";
    },
    isStepCnpjActive() {
      return (
        this.empresa.status_id >= 4 && ![8, 9].includes(this.empresa.status_id)
      );
    },
    isStepAlvaraActive() {
      return (
        this.empresa.status_id >= 5 && ![8, 9].includes(this.empresa.status_id)
      );
    },
    isStepAcessoActive() {
      return (
        (this.empresa.status_id === 5 &&
          this.empresa.inscricao_municipal != null) ||
        (this.empresa.status_id >= 6 &&
          ![8, 9].includes(this.empresa.status_id))
      );
    },
    isStepSimplesActive() {
      return (
        this.empresa.status_id >= 7 && ![8, 9].includes(this.empresa.status_id)
      );
    },
    isStepFinalizarActive() {
      return this.empresa.status_id === 99;
    },
    isStepCertificadoAndDocsActive() {
      return this.empresa.status_id !== 9;
    },
    socioAdministrador() {
      let socio_adm = this.empresa.socios.filter((socio) => {
        return socio.pivot.socio_administrador === 1;
      });
      return socio_adm[0];
    },
    nomeTitulo() {
      let razao_social = this.empresa.razao_social;
      return razao_social
        ? razao_social
        : this.socioAdministrador.nome_completo;
    },
    shouldShowAllData() {
      return this.empresa.status_id !== 9;
    },
  },
  mounted() {
    this.fetchEmpresa();
  },
  methods: {
    fetchEmpresa() {
      this.loading = true;
      this.empresa = null;
      let data =null
      EmpresaPosCadastroShow(this.empresaId)
        .then((res) => {
        data = res.data.data;
          if (data.status_id) {
            this.empresa = data;
            this.activeStep = this.stepByStatus(this.empresa.status_id);
          } else {
            this.$snack.error(data.msg);
            this.loading = false;
            this.$parent.close()
          }
        })

        .finally(() => (this.loading = false));
    },
    stepByStatus(status) {
      const steps = {
        9: 0,
        3: 1,
        4: 2,
        5: 3,
        6: 4,
        7: 5,
        99: this.isSimples ? 7 : 6,
      };

      return steps[status];
    },
    empresaFinalizada() {
      this.$emit("finalizada");
    },
  },
};
</script>
<style>
.step-forms .step-details {
  background: unset !important;
}
</style>
