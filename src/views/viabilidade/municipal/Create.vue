<template>
  <div class="p-8 bg-neutral-300">
    <div class="flex flex-col">
      <Lynx-Title text="Criar Viabilidade Municipal"/>
      <form class="flex flex-col" @submit.prevent="onSubmit">
        <div class="flex flex-col pb-8">
          <label class="flex flex-col">
            <Lynx-Label class="pr-8 font-bold" label="Estado"/>
            <b-select @input="onSelectEstado" :loading="loadingEstados" :disabled="!estados.length">
              <option
                v-for="estado in estados"
                :key="estado.id"
                :value="estado.id"
                v-text="estado.nome"
              />
            </b-select>
          </label>
        </div>
        <div class="flex flex-col pb-8">
          <label class="flex flex-col">
            <Lynx-Label class="pr-8 font-bold" label="Cidade"/>
            <b-select
              v-model="form.cidade_id"
              :loading="loadingCidades"
              :disabled="!cidades.length || loadingCidades"
              placeholder="Selecione a cidade"
            >
              <option
                v-for="cidade in cidades"
                :key="cidade.id"
                :value="cidade.id"
                v-text="cidade.nome"
              />
            </b-select>
          </label>
        </div>
        <div class="flex flex-col pb-8">
          <label class="flex justify-between items-center">
            <Lynx-Label class="pr-8 font-bold" label="Emitem alvará para empresa médica com o endereço fiscal?"/>
            <b-checkbox class="pl-8" v-model="form.alvara_endereco_fiscal" :true-value="1" :false-value="0"/>
          </label>
        </div>
        <div class="flex flex-col pb-8">
          <label class="flex flex-col">
            <Lynx-Label class="pr-8 font-bold" label="CNAE especifico exigido pelo município"/>
            <Lynx-Input v-model="form.cnae_exigido" placeholder="(Opcional)"/>
          </label>
        </div>
        <div class="flex flex-col pb-8">
          <label class="flex justify-between items-center">
            <Lynx-Label class="pr-8 font-bold" label="Precisa de vigilancia?"/>
            <b-checkbox class="pl-8" v-model="form.vigilancia" :true-value="1" :false-value="0"/>
          </label>
        </div>
        <div class="flex flex-col pb-8">
          <label class="flex flex-col">
            <Lynx-Label class="pr-8 font-bold" label="Modelo de Solicitação"/>
            <b-select v-model="form.modelo_solicitacao" required>
              <option value="presencial">Presencial</option>
              <option value="email">Email</option>
              <option value="site">Site</option>
            </b-select>
          </label>
        </div>
        <div class="flex flex-col pb-8" v-if="form.modelo_solicitacao === 'site'">
          <label class="flex flex-col">
            <Lynx-Label class="pr-8 font-bold" label="Site Modelo Solicitação"/>
            <Lynx-Input v-model="form.modelo_solicitacao_site" type="url"/>
          </label>
        </div>
        <div class="flex flex-col pb-8" v-if="form.modelo_solicitacao === 'email'">
          <label class="flex flex-col">
            <Lynx-Label class="pr-8 font-bold" label="Email para Solicitação"/>
            <Lynx-Input v-model="form.modelo_solicitacao_email" type="email"/>
          </label>
        </div>
        <div class="flex flex-col pb-8">
          <label class="flex justify-between items-center">
            <Lynx-Label class="pr-8 font-bold" label="Tempo para emissão do alvará"/>
            <div class="pl-8 flex items-center">
              <Lynx-Input class="ml-8 mr-2" v-model="form.tempo_emissao_alvara" type="number" required />
              <span class="pl-2">dias</span>
            </div>
          </label>
        </div>
        <div class="flex flex-col pb-8">
          <label class="flex justify-between items-center">
            <Lynx-Label class="pr-8 font-bold" label="Tempo para emissão da licença sanitária"/>
            <div class="pl-8 flex items-center">
              <Lynx-Input class="ml-8 mr-2" v-model="form.tempo_emissao_licenca_sanitaria" type="number" />
              <span class="pl-2">dias</span>
            </div>
          </label>
        </div>
        <div class="flex flex-col pb-8">
          <label class="flex justify-between items-center">
            <Lynx-Label class="pr-8 font-bold" label="Valor do alvará"/>
            <div class="pl-8 flex items-center">
              <Input-Money class="ml-8 mr-2" v-model="form.valor_alvara" required />
            </div>
          </label>
        </div>
        <div class="flex flex-col pb-8">
          <label class="flex justify-between items-center">
            <Lynx-Label class="pr-8 font-bold" label="Valor da licença sanitária"/>
            <div class="pl-8 flex items-center">
              <Input-Money class="ml-8 mr-2" v-model="form.valor_licenca_sanitaria" required />
            </div>
          </label>
        </div>
        <div class="flex flex-col pb-8">
          <label class="flex justify-between items-center">
            <Lynx-Label class="pr-8 font-bold" label="Percentual do ISS"/>
            <div class="pl-8 flex items-center">
              <Lynx-Input class="ml-8 mr-2" v-model="form.percentual_iss" type="number" step="any" :min="0" :max="100" required/>
            </div>
          </label>
        </div>
         <div class="flex flex-col pb-8">
          <label class="flex flex-col">
            <Lynx-Label class="pr-8 font-bold" label="Forma de emissão da NFS"/>
            <b-select v-model="form.nfs_eletronica_manual" required>
              <option value="eletronica">Eletronica</option>
              <option value="manual">Manual</option>
            </b-select>
          </label>
        </div>
        <div class="flex flex-col pb-8" v-if="form.nfs_eletronica_manual === 'eletronica'">
          <label class="flex flex-col">
            <Lynx-Label class="pr-8 font-bold" label="Site Modelo Solicitação"/>
            <Lynx-Input v-model="form.nfs_eletronica_manual_site" type="url"/>
          </label>
        </div>
        <div class="flex flex-col pb-8">
          <label class="flex justify-between items-center">
            <Lynx-Label class="pr-8 font-bold" label="Precisa de CRM Juridico?"/>
            <b-checkbox class="pl-8" v-model="form.crm_juridico" :true-value="1" :false-value="0"/>
          </label>
        </div>
        <div class="flex flex-col pb-8">
          <div class="flex flex-col">
            <Lynx-Label class="pr-8 font-bold" label="Documentos Necessários"/>
            <b-taginput
              v-model="form.documentos_necessarios"
              :data="documentosNecessarios"
              autocomplete
              :allow-new="true"
              :allow-duplicates="false"
              :open-on-focus="true"
              :loading="loadingDocumentos"
            />
          </div>
        </div>
        <div class="flex flex-col pb-8">
          <label class="flex justify-between items-center">
            <Lynx-Label class="pr-8 font-bold" label="Faz abertura na área rural?"/>
            <b-checkbox class="pl-8" v-model="form.abertura_area_rural" :true-value="1" :false-value="0"/>
          </label>
        </div>
        <Lynx-Button
          class="self-start mb-8"
          text="Adicionar Anexo"
          @click.native="addAnexo"
          icon="Attachment"
          size="small"
          icon-size="4"
          :outlined="true"
          type="button"
        />
        <div
          class="flex pb-8 items-end relative"
          v-for="(anexo, index) in form.anexos"
          :key="anexo.id"
        >
          <a href="#" class="p-1 bg-error-light transition hover:bg-error-base rounded-full absolute right-0 top-0" @click.prevent="removeAnexo(index)">
            <Icon-Cross size="3" class="text-neutral-100"/>
          </a>
          <label class="flex flex-col flex-grow pr-8">
            <Lynx-Label class="pr-8 font-bold" label="Nome do anexo"/>
            <Lynx-Input v-model="anexo.nome" placeholder="Digite o nome do anexo" required/>
          </label>
          <Input-File text="Anexo" ref="anexosInput"/>
        </div>
        <div class="flex flex-col pb-8">
          <div class="flex flex-col">
            <Lynx-Label class="pr-8 font-bold" label="Observações"/>
            <div class="bg-white">
              <vue-editor v-model="form.observacoes"></vue-editor>
            </div>
          </div>
        </div>
        <Lynx-Button
          type="submit"
          class="self-end"
          text="Enviar"
          icon="Check"
          :loading="loadingButton"
        />
      </form>
    </div>
  </div>
</template>

<script>

import { storeViabilidadeMunicipalRequest, getViabilidadeDocumentosBaseRequest } from '@/services/requests/viabilidadeMunicipal'
import InputMoney from '@/components/helpers/InputMoney'
import InputFile from '@/components/helpers/InputFile'
import { indexEstadosRequest, showEstadosRequest } from '@/services/requests/estados'
import { VueEditor } from "vue2-editor";

export default {
  name: 'ViabilidadeMunicipalCreate',
  components: { InputMoney, InputFile, VueEditor },
  data() {
    return {
      estados: [],
      cidades: [],
      documentosNecessarios: [],
      loadingEstados: false,
      loadingCidades: false,
      loadingButton: false,
      loadingDocumentos: false,
      form: {
        cidade_id: null,
        alvara_endereco_fiscal: false,
        cnae_exigido: '',
        vigilancia: false,
        modelo_solicitacao: 'email',
        modelo_solicitacao_site: null,
        modelo_solicitacao_email: null,
        tempo_emissao_alvara: null,
        tempo_emissao_licenca_sanitaria: null,
        valor_licenca_sanitaria: 0,
        valor_alvara: 0,
        mes_renovacao_alvara: 1,
        percentual_iss: null,
        nfs_eletronica_manual: 'manual',
        nfs_eletronica_manual_site: null,
        crm_juridico: 0,
        documentos_necessarios: [],
        abertura_area_rual: false,
        anexos: [],
        observacoes: '',
      },
      errorMessage: 'Não foi possivel criar a viabilidade',
    }
  },
  methods: {
    fetchEstados() {
      this.loadingEstados = true
      indexEstadosRequest()
        .then(res => this.estados = res.data)
        .finally(() => this.loadingEstados = false)
    },
    fetchDocumentosNecessarios() {
      this.loadingDocumentos = true
      getViabilidadeDocumentosBaseRequest()
        .then(res => this.documentosNecessarios = res.data.map(curr => curr.name))
        .finally(() => this.loadingDocumentos = false)
    },
    onSelectEstado(id) {
      this.loadingCidades = true
      showEstadosRequest(id)
        .then(res => this.cidades = res.data.cidades)
        .finally(() => this.loadingCidades = false)
    },
    async onSubmit() {
      if(!this.form.cidade_id) return this.$snack.error('Selecione a cidade para a viabilidade')
      if(this.form.anexos.length) {
        const hasNoFiles = this.$refs.anexosInput.filter(curr => !curr.file)
        if(hasNoFiles.length) return this.$snack.error('Insira todos os arquivos dos anexos')
        const promises = this.$refs.anexosInput.map(async (curr, index) => {
          const fileId = await curr.submit()
          this.form.anexos[index].arquivo_id = fileId
        })
        await Promise.all(promises)
      }
      this.loadingButton = true
      const form = {
        ...this.form,
        modelo_solicitacao_site: this.form.modelo_solicitacao === 'site' ? this.form.modelo_solicitacao_site : '',
        modelo_solicitacao_email: this.form.modelo_solicitacao === 'email' ? this.form.modelo_solicitacao_email : '',
        nfs_eletronica_manual_site: this.form.nfs_eletronica_manual === 'eletronica' ? this.form.nfs_eletronica_manual_site : '',
      }
      storeViabilidadeMunicipalRequest(form)
        .then(() => {
          this.$emit('create-viabilidade')
          this.$snack.success('Viabilidade criada com sucesso')
        })
        .catch(err => this.$snack.error(err.response.data.message || this.errorMessage))
        .finally(() => this.loadingButton = false)
    },
    addAnexo() {
      const newAnexo = {
        nome: '',
        arquivo_id: null
      }
      this.form.anexos.push(newAnexo)
    },
    removeAnexo(index) {
      this.form.anexos.splice(index, 1)
    },
  },
  beforeMount() {
    this.fetchEstados()
    this.fetchDocumentosNecessarios()
  },
}
</script>
