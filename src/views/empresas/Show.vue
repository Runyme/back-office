<template>
  <div>
    <div class="w-full flex justify-between">
      <div class="flex items-center truncate">
        <div
          class="p-2 bg-primary-500 text-primary-100 mr-8 rounded text-2xl mb-8"
        >{{ getEmpresa.id }}
        </div>
        <Lynx-Title :text="getEmpresa.razao_social || '...'"/>
  
        <b-tooltip label="copiado" :active="copiado === getEmpresa.razao_social" position="is-left" always
                   class="ml-4 mb-12">
          <button class="ml-2" @click="copyText(getEmpresa.razao_social)">
            <b-icon icon="content-copy" size="is-small"></b-icon>
          </button>
        </b-tooltip>
          
      </div>

      <div class="flex h-10">
        <Lynx-Button class="mr-4 pl-1 h-full" text="" icon="Reload" outlined="true" @click.native="fetchEmpresa"/>
        <router-link :to="{ name: 'empresas.index' }">
          <Lynx-Button class="h-full" text="Voltar" icon="ArrowLeft" outlined="true"/>
        </router-link>
      </div>
    </div>
   
    <!-- desativação agendada alert -->
    <b-notification type="is-warning" :closable="false" v-if="getEmpresa.status === 'Desativação Agendada'">
      <p class="mb-2"><span class="pr-2 font-bold text-xl">Desativação Agendada Para o Dia:
        {{ dataEncerramento }}</span></p>
      <p v-if="getEmpresa.autor">
        <span class="pr-2 font-bold">Autor:</span>
        <span v-text="getEmpresa.autor"/>
      </p>
      <div class="flex flex-wrap -mx-2">
        <button
          v-for="(arquivo, index) in getEmpresa.files" :key="index"
          class="px-2 py-1 m-2 border border-neutral-600 rounded flex items-center"
          @click.prevent="openArquivo(arquivo.id)"
        >
          <b-icon class="text-neutral-600 mr-2" icon="file-eye-outline"></b-icon>
          {{ arquivo.nome }}
        </button>
      </div>
    </b-notification>

    <!-- empresa desativada alert -->
    <div v-if="getEmpresa.status === 'desativada'">
      <b-notification type="is-danger" :closable="false">
        <p class="mb-2"><span class="pr-2 font-bold text-xl">Empresa desativada</span></p>
        <p v-if="getEmpresa.motivo">
          <span class="pr-2 font-bold">Motivo:</span>
          <span v-text="getEmpresa.motivo"/>
        </p>
              <p v-if="getEmpresa.descricao">
          <span class="pr-2 font-bold">Descrição:</span>
          <span v-text="getEmpresa.descricao"/>
        </p>
        <p v-if="getEmpresa.autor">
          <span class="pr-2 font-bold">Autor:</span>
          <span v-text="getEmpresa.autor"/>
        </p>
        <p v-if="getEmpresa.data">
          <span class="pr-2 font-bold">Data:</span>
          <span v-text="new Date(getEmpresa.data.toLocaleString()).toLocaleDateString()"/>
        </p>
          <p v-if="getEmpresa.data_competencia">
          <span class="pr-2 font-bold">Data Competencia:</span>
          <span v-text="new Date(getEmpresa.data_competencia.toLocaleString()).toLocaleDateString()"/>
        </p>
          <p v-if="getEmpresa.data_solucitacao">
          <span class="pr-2 font-bold">Data Solicitação:</span>
          <span v-text="new Date(getEmpresa.data_solucitacao.toLocaleString()).toLocaleDateString()"/>
        </p>
          <p v-if="getEmpresa.data_enceramento">
          <span class="pr-2 font-bold">Data Encerramento:</span>
          <span v-text="new Date(getEmpresa.data_enceramento.toLocaleString()).toLocaleDateString()"/>
        </p>
        <div class="flex flex-wrap -mx-2">
          <button
            v-for="(arquivo, index) in getEmpresa.files" :key="index"
            class="px-2 py-1 m-2 border border-neutral-600 rounded flex items-center"
            @click.prevent="openArquivo(arquivo.id)"
          >
            <b-icon class="text-neutral-600 mr-2" icon="file-eye-outline"></b-icon>
            {{ arquivo.nome }}
          </button>
        </div>
      </b-notification>

      <!-- buttons bar -->
      <div class="w-full flex pb-4">
        <ButtonsBar/>
      </div>

      <div class="flex" v-if="hasRole('Super contador')">
        <div class="w-2/3 pr-4 pb-8">
          <Card background="neutral-100" color="neutral-300">
            <div class="flex p-4 w-full">
              <div class="w-1/2 flex flex-col border-neutral-300 border-r-2 mr-4 pr-4">
                <AcessoPrefeitura class="custom-card-info border-b-0"/>
              </div>
              <div class="w-1/2 flex flex-col">
                <Contatos contactable-type="empresa" class="custom-card-info border-b-0"
                          :contactable-id="getEmpresa.id"/>
                <Carteira class="mb-4 border-none custom-card-info" />

              </div>
            </div>
          </Card>
        </div>

        <div class="w-1/3 pl-4 pb-8">
          <Card background="neutral-100" color="neutral-300">
            <div class="flex flex-col w-full">
              <Comentarios
                class="my-4 border-none custom-card-info hover:bg-neutral-100 mx-2"
                commentableType="empresa"
                :commentableId="getEmpresa.id"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>

    <div v-else class="">
      <!-- label alert comment -->
      <EmpresaLabel :labelable="getEmpresa" v-if="getEmpresa.label"/>
       

      <!-- empresa congelada alert-->
      <Card background="neutral-100" color="error-base" v-if="getEmpresa.congelada" >
        <div class="w-full h-full flex items-center justify-center p-4">
          <div class="flex">
            <Icon-Frozen class="text-primary-600" size="24"/>
            <div class="flex flex-col items-start">
              <p class="text-2xl font-display">Empresa Congelada</p>
            <div v-if="getEmpresa.motivoCongelamento.length>0">
             <p v-if="getEmpresa.motivoCongelamento[getEmpresa.motivoCongelamento.length -1].created_at">
          <span class="pr-2 font-bold">Data Solicitação:</span>
          <span v-text="new Date(getEmpresa.motivoCongelamento[getEmpresa.motivoCongelamento.length -1].created_at.toLocaleString()).toLocaleDateString()"/>
        </p>
          <p v-if="getEmpresa.motivoCongelamento[getEmpresa.motivoCongelamento.length -1].data_competencia">
          <span class="pr-2 font-bold">Data Competencia:</span>
          <span v-text="new Date(getEmpresa.motivoCongelamento[getEmpresa.motivoCongelamento.length -1].data_competencia.toLocaleString()).toLocaleDateString()"/>
        </p>
          <p v-if="getEmpresa.motivoCongelamento[getEmpresa.motivoCongelamento.length -1].data_congelamento">
          <span class="pr-2 font-bold">Data Congelamento:</span>
          <span v-text="new Date(getEmpresa.motivoCongelamento[getEmpresa.motivoCongelamento.length -1].data_congelamento.toLocaleString()).toLocaleDateString()"/>
        </p>
        </div>
              <Lynx-Button
                class="mt-4"
                size="small"
                text="Descongelar"
                @click.native="() => setCongelamentoModal(true)"
              />
            </div>
          </div>
        </div>
      </Card>

      <div class="flex flex-wrap text-neutral-700 space-y-4">

          <!-- inadimplecia alert -->
          <Inadimplencia v-if="hasInadimplencia" :faturas="getEmpresa.fatura" class="w-full"/>

          <!-- residencia alert -->
          <div class="p-4 bg-info-lighter rounded border-l-4 border-info-dark flex flex-col items-start w-full" v-if="getEmpresa.residencia">
            <div class="flex items-center pb-4">
              <Icon-Info class="text-info-dark"/>
              <span class="pl-4 font-semibold text-info-dark">Empresa em residência</span>
            </div>
            <div class="flex items-center pb-4">
              <span class="text-info-dark">Data de Início:</span>
              <span class="font-light text-info-dark pl-4" v-text="residenciaDataInicio"/>
            </div>
            <div class="flex items-center pb-4">
              <span class="text-info-dark">Data de Conclusão:</span>
              <span class="font-light text-info-dark pl-4" v-text="residenciaDataConclusao"/>
            </div>
            <div class="flex items-center pb-4">
              <span class="text-info-dark">Especialidade:</span>
              <span
                class="font-light text-info-dark pl-4"
                v-text="getEmpresa.residencia.especialidade"
              />
            </div>
               <Lynx-Button 
       
              text="Editar"
              icon="Edit"
              color="primary-500"
              size="small"
              
                   @click.native="() => setResidenciaModalEditar(true)"
            />
            <Lynx-Button 
            v-if="getEmpresa.residencia_medica_arquivo != null"
              text="Ver Comprovante"
              icon="Eye"
              color="info-dark"
              size="small"
              
                   @click.native="() =>openArquivo(getEmpresa.residencia_medica_arquivo.arquivo_id)"
            />
                 <Lynx-Button 
            v-if="getEmpresa.residencia_medica_arquivo == null"
              text="comprovante não foi cadastrado"
            
              color="error-base"
              size="small"
                
            />

          
          </div>

        <!-- buttons bar -->
        <div class="w-full flex">
          <ButtonsBar/>
        </div>

        <div class="w-2/3 pr-4 pb-8">
          <Card background="neutral-100" color="neutral-300">
            <div class="flex p-4 w-full">
              <div class="w-1/2 flex flex-col border-neutral-300 border-r-2 mr-4 pr-4">
                <Infos class="custom-card-info mt-4" @updated="fetchEmpresa"/>
                 <Alvaras class="custom-card-info mt-4" @updated="fetchEmpresa"/>
                <AcessoPrefeitura class="custom-card-info" :inadimplencia="hasInadimplencia"
                                  v-if="!getEmpresa.congelada || hasRole('Super contador')"/>
                <ContasBancarias owner-type="empresa" :owner-id="getEmpresa.id" :owner-cpf-cnpj="getEmpresa.cnpj"
                                 class="mb-4 border-none custom-card-info" v-if="!getEmpresa.congelada"/>
              </div>

              <div class="w-1/2 flex flex-col">
                <Endereco addressable-type="empresa" :addressable-id="getEmpresa.id" class="custom-card-info mt-4"/>
                <Contatos contactable-type="empresa" class="custom-card-info" :contactable-id="getEmpresa.id"/>
                <Crm owner-type="empresa" :owner-id="getEmpresa.id" class="custom-card-info"
                     v-if="!getEmpresa.congelada"/>

                <CertidoesNegativas class="custom-card-info" v-if="!getEmpresa.congelada"/>
                <Faturamento class="custom-card-info" :socios="socios" v-if="!getEmpresa.congelada"/>
                <Carteira class="mb-4 border-none custom-card-info" :carteira="getEmpresa.carteira"/>
              </div>
            </div>
          </Card>
        </div>

        <div class="w-1/3 pl-4 pb-8">
          <Card background="neutral-100" color="neutral-300">
            <div class="flex flex-col w-full">
              <Comentarios
                class="my-4 border-none custom-card-info hover:bg-neutral-100 mx-2"
                commentableType="empresa"
                :commentableId="getEmpresa.id"
              />
            </div>
          </Card>

        </div>
        <div class="w-full flex flex-col">
          <h2
            class="font-display font-bold text-3xl pb-3 border-b-2 border-neutral-400 text-primary-600"
          >Sócios</h2>
          <div class="grid grid-cols-2 gap-8 w-full py-8">
            <Card
              background="neutral-100"
              color="neutral-300"
              v-for="socio in socios"
              :key="socio.id"
            >
              <Socio :socio="socio"/>
            </Card>
          </div>
        </div>

        <FloatActions
          class="fixed bottom-0 right-0 pb-4 mr-4"
          :options="statusActionsOptions"
          icon="Warning"
        />
      </div>
      <b-modal :active.sync="congelamentoModal" width="500px">
        <Congelamento @set-modal="setCongelamentoModal"/>
      </b-modal>
      <b-modal :active.sync="desativamentoModal" width="500px">
        <Desativamento/>
      </b-modal>
      <b-modal :active.sync="residenciaModal" size="lg">
        <Residencia @set-modal="setResidenciaModal" :socios="socios"/>
      </b-modal>
          <b-modal :active.sync="retencaoModal" width="500px">
        <Retencao @set-modal="setResidenciaModal" />
      </b-modal>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {empresasSociosRequest} from "@/services/requests/empresas";
import Card from "@/components/helpers/Card";
import Socio from "@/views/empresas/show/Socio";
import ContasBancarias from "@/components/shared/ContasBancarias";
import AcessoPrefeitura from "@/views/empresas/show/AcessoPrefeitura";
import Guias from "@/views/empresas/show/Guias";
import CertidoesNegativas from "@/views/empresas/show/CertidoesNegativas";
import Infos from "@/views/empresas/show/Infos";
import Crm from "@/components/shared/Crm";
import Endereco from "@/components/shared/Endereco";
import Faturamento from "@/views/empresas/show/Faturamento";
import Contatos from "@/components/shared/Contatos";
import Congelamento from "@/views/empresas/show/Congelamento";
import Desativamento from "@/views/empresas/show/Desativamento";
import Residencia from "@/views/empresas/show/Residencia";
import Carteira from "@/views/empresas/show/Carteira";
import Inadimplencia from "@/views/empresas/show/Inadimplencia";
import FloatActions from "@/components/helpers/FloatActions";
import Comentarios from "@/components/shared/Comentarios";
import moment from "moment";
import DivisaoReceita from "../receitas/DivisaoReceita";
import EmpresaLabel from './show/Label'
import {storeLabelsRequest} from "@/services/requests/labels";
import {empresasShowRequest} from "@/services/requests/empresas";
import bus from "../../services/bus";
import {hasRole} from '@/utils/can';
import ButtonsBar from "@/views/empresas/show/ButtonsBar";
import Alvaras  from "@/views/empresas/show/Alvaras";
import Retencao from  "@/views/empresas/show/Retencao";

export default {
  name: "EmpresasShow",
  components: {
    ButtonsBar,
    EmpresaLabel,
    DivisaoReceita,
    Card,
    Socio,
    ContasBancarias,
    AcessoPrefeitura,
    Guias,
    CertidoesNegativas,
    Infos,
    Crm,
    Endereco,
    Faturamento,
    Contatos,
    Congelamento,
    Desativamento,
    Residencia,
    Carteira,
    FloatActions,
    Inadimplencia,
    Comentarios,
    Alvaras,
    Retencao
  },
  data() {
    return {
      isCollapsed:false,
      copiado: false,
      socios: [],
      loading: false,
      congelamentoModal: false,
      desativamentoModal: false,
      residenciaModal: false,
      retencaoModal: false,

      statusEmpresa: null,
      statusActionsOptions: [
         {
          label: "Retenção Empresa",
          callBack: () => this.setRetencaoModal(true),
        },
        {
          label: "Adicionar Alerta",
          callBack: () => this.addLabel(),
        },
        {
          label: "Congelar Empresa",
          callBack: () => this.setCongelamentoModal(true),
        },
        {
          label: "Desativar Empresa",
          callBack: () => this.setDesativamentoModal(true),
        },
        {
          label: "Residência Médica",
          callBack: () => this.setResidenciaModal(true),
        },
        
      ],
    };
  },
  computed: {
    ...mapGetters(['getEmpresa', 'getToken']),
    residenciaDataInicio() {
      return moment(this.getEmpresa.residencia.data_inicio).format(
        "DD/MM/YYYY"
      );
    },
    dataEncerramento() {
      return moment(this.getEmpresa.data_encerramento).format(
        "DD/MM/YYYY"
      );
    },
    residenciaDataConclusao() {
      return moment(this.getEmpresa.residencia.data_conclusao).format(
        "DD/MM/YYYY"
      );
    },
    hasInadimplencia() {
      return this.getEmpresa.fatura && this.getEmpresa.fatura.length > 0;
    },
  },
  methods: {
    copyText(value) {
      this.$copyText(value)
      this.copiado = value
      setTimeout(() => this.copiado = false, 1500)
    },
    ...mapActions(['setEmpresa']),
    hasRole,
    moment,
    fetchSocios() {
      this.loading = true;
      empresasSociosRequest(this.getEmpresa.id)
        .then((res) => (this.socios = res.data.data))
        .finally(() => (this.loading = false));
    },
    setCongelamentoModal(value) {
      this.congelamentoModal = value;
    },
    setDesativamentoModal(value) {
      this.desativamentoModal = value;
    },
      setRetencaoModal(value) {
      this.retencaoModal = value;
    },
    setResidenciaModal(value) {
      this.$store.dispatch("configEmpresa/atualizar", '');

      this.residenciaModal = value;
    },
     setResidenciaModalEditar(value) {
      this.$store.dispatch("configEmpresa/atualizar", this.getEmpresa.residencia);

      this.residenciaModal = value;    
    },

    
    addLabel() {
      this.loading = true
      const form = {
        labelable_type: 'empresa',
        labelable_id: this.getEmpresa.id,
        status: 2,
        note: 'Atenção',
      }
      storeLabelsRequest(form)
        .then(() => this.fetchEmpresa())
        .finally(() => this.loading = false)
    },
    fetchEmpresa() {
      bus.globalLoading = true
      empresasShowRequest(this.getEmpresa.id)
        .then(res => {
          this.setEmpresa(res.data.data)
          this.$router.push({name: 'empresas.show'})
        })
        .catch(() => this.$snack.error('Empresa não encontrada'))
        .finally(() => bus.globalLoading = false)
    },
    openArquivo(arquivoId) {
      window.open(`${process.env.VUE_APP_API_URL}/arquivos/${arquivoId}/open?token=${this.getToken}`)
    },

  },
  mounted() {
    this.fetchSocios();
  },

};
</script>
