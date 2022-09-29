<template>
  <div class="bg-neutral-300 shadow p-8 flex flex-col rounded">
    <div class="w-full flex justify-center" v-if="loading">
      <Lynx-Spinner size="12"/>
    </div>

    <Lynx-Title :text="`Credenciamento da Empresa: #${empresa.id}`"/>

    <b-steps v-model="step" :has-navigation="false">
      <b-step-item label="Edital" step="1" class="grid grid-cols-2 gap-3 pt-10">
        <div class="flex flex-wrap items-end border-2 border-neutral-400 rounded p-4 content-start">
          <div class="flex w-full justify-between">
            <p class="text-xl font-display mb-4">
              Anexos
            </p>

            <b-upload v-model="file" :disabled="isUploading">
              <a class="flex button is-outlined border-2 transition rounded-full"
                 :class="[isUploading ? 'is-disabled cursor-wait' : 'is-primary']">
                <Icon-Plus size="3" v-if="!isUploading"/>
                <Lynx-Spinner size="3" v-else/>
              </a>
            </b-upload>
          </div>

          <Attachment
            v-for="arquivo in credenciamento.arquivos"
            :key="arquivo.id"
            :anexo="arquivo"
            class="mr-2 mb-2"
          />
        </div>

        <div class="flex flex-wrap items-end border-2 border-neutral-400 rounded p-4 content-start">
          <p class="w-full text-xl font-display mb-4">CRM</p>
          <!-- todo  alterar para checkbox sem a opção de pf -->
          <b-radio v-model="crm" name="name" native-value="pj">
            CRM Pessoa Jurídica
          </b-radio>
          <b-radio v-model="crm" name="name" native-value="pf">
            CRM Pessoa Física
          </b-radio>

          <div v-if="!hasCrmJuridico && crm === 'pj'" class="mt-8">
            <p class="text-md text-error-base">
              Empresa sem CRM Jurídico
            </p>
            <Lynx-Button size="small" text="Acompanhar solicitação" v-if="hasOsCrm"/>
            <Lynx-Button size="small" text="Solicitar" v-else/>
          </div>
        </div>

        <div class="col-span-2 flex justify-end">
          <Lynx-Button :disabled="!hasCrmJuridico && crm === 'pj'" text="Avançar" @click.native="handleStep1"/>
        </div>
      </b-step-item>

      <b-step-item label="Certidões" step="2" class="pt-10">
        <b-table :data="cnd" :columns="[{label:'Tipo'}, {label:'Emissão'}, {label:'Validade'}]" class="w-full">
          <template #empty>
            <NotFoundData text="Não há certidões cadastrada!"/>
          </template>
          <template slot-scope="props">
            <b-table-column field="tipo" v-text="props.row.tipo"/>
            <b-table-column field="data_emissao" v-text="props.row.data_emissao"/>
            <b-table-column field="data_validade">
              <span class="bg-error-base text-white rounded px-1 text-sm"
                    v-if="props.row.data_validade < '2020-08-01' ">vencida</span> <br>
              <span>{{ props.row.data_validade }}</span>
            </b-table-column>
            <b-table-column>
              <b-button class="is-primary"/>
            </b-table-column>
          </template>
        </b-table>

        <p v-if="needsCnd" class="text-md text-error-base mt-1">
          Atenção! empresa com certidão vencida.
          <span class="has-text-weight-bold cursor-pointer" v-if="hasCndOs">
            Clique aqui para acompanhar a solicitação!
          </span>
        </p>

        <div class="flex justify-end mt-4">
          <Lynx-Button v-if="needsCnd" :disabled="hasCndOs" text="Solicitar CND" class="mr-4"/>
          <Lynx-Button :disabled="needsCnd" text="Avançar" @click.native="handleStep2"/>
        </div>
      </b-step-item>

      <b-step-item label="Finalizar" step="3" class="grid grid-cols-2 gap-2 pt-10">
        <!-- todo selecioanr os artefatos gerados e enviar para o cliente - confirmar o email a ser eviado -->
        <div class="flex flex-wrap items-end border-2 border-neutral-400 rounded p-4 content-start">
          <div class="flex w-full">
            <p class="w-full text-xl font-display mb-4">
              Anexos
            </p>
          </div>
          <b-checkbox v-model="artefatos" :value="arquivo.id" class="w-full field"
                      v-for="arquivo in credenciamento.arquivos" :key="arquivo.id">
            {{ arquivo.nome }}
          </b-checkbox>
        </div>

        <div class="flex flex-wrap items-end border-2 border-neutral-400 rounded p-4 content-start">
          <div class="flex w-full">
            <p class="w-full text-xl font-display mb-4">
              Certidões
            </p>
          </div>
          <b-checkbox v-model="artefatos" :value="item.arquivo_id" class="w-full field"
                      v-for="item in cnd" :key="item.id">
            {{ item.tipo }}
          </b-checkbox>
        </div>

        <div class="col-span-2 flex justify-end mt-4">
          <Lynx-Button text="Enviar" class="mr-4"/>
          <Lynx-Button text="Finalizar"/>
        </div>
      </b-step-item>
    </b-steps>
  </div>
</template>

<script>

import Attachment from "@/components/shared/Attachment";
import NotFoundData from "@/components/layouts/NotFoundData";

export default {
  name: "ProcessModal",
  components: {NotFoundData, Attachment},
  props: ['empresa'],
  data: function () {
    return {
      loading: false,
      step: 0,
      crm: 'pj',
      credenciamento: {
        arquivos: [
          {
            id: 1,
            nome: 'Edital 01/2020',
            size: 102451
          },
          {
            id: 2,
            nome: 'Edital 02/2020',
            size: 102445
          },
          {
            id: 3,
            nome: 'Documento anexado',
            size: 10245
          }
        ]
      },
      isUploading: false,
      file: null,
      cnd: [
        {
          id: 1,
          arquivo_id: 1,
          data_emissao: '2020-05-01',
          data_validade: '2020-10-01',
          tipo: 'Federal'
        },
        {
          id: 2,
          arquivo_id: 2,
          data_emissao: '2019-04-01',
          data_validade: '2020-09-01',
          tipo: 'Municipal'
        },
      ]
    }
  },
  computed: {
    hasCrmJuridico() {
      return true
    },
    hasOsCrm() {
      return true
    },
    needsCnd() {
      return !this.cnd.length || !!this.cnd.filter(item => item.data_validade < '2020-08-01').length
    },
    hasCndOs() {
      return true
    }
  },
  methods: {
    handleStep1: function () {
      // todo validate and handle request
      this.step = 1
    },
    handleStep2: function () {
      // todo validate and handle request
      this.step = 2
    }
  }
}
</script>

<style scoped>

</style>
