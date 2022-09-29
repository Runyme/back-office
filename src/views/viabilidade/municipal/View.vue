<template>
  <div class="p-8 bg-neutral-300">
    <div class="w-full flex items-center justify-center" v-if="loading">
      <Lynx-Spinner size="16" />
    </div>
    <div class="flex flex-col" v-else>
      <div class="flex justify-between items-center">
        <Lynx-Title :text="`${viabilidade.cidade.nome} - ${viabilidade.cidade.estado.uf}`"/>
        <Lynx-Button class="mb-8" @click.native="onCancelEdit" text="Cancelar" size="small" :outlined="true" v-if="isEditting"/>
        <Lynx-Button
          class="mb-8"
          @click.native="onEdit"
          text="Editar"
          icon="Edit"
          size="small"
          icon-size="4"
          v-else-if="$hasPermission('editar viabilidade')"
        />
      </div>
      <div class="flex items-center pb-8">
        <span class="pr-4 font-bold text-primary-600">Ultima atualização:</span>
        <span class="py-1 px-2 text-neutral-100 text-xs rounded" :class="getUpdatedAtTheme(getUpdatedAtDifference(viabilidade.updated_at))">
          {{ getUpdatedAtDifference(viabilidade.updated_at) | mes }}
        </span>
      </div>
      <form class="flex flex-col" @submit.prevent="onSubmit">
        <div class="flex flex-col pb-8">
          <label class="flex justify-between items-center">
            <Lynx-Label class="pr-8 font-bold" label="Emitem alvará para empresa médica com o endereço fiscal?"/>
            <b-checkbox class="pl-8" v-model="form.alvara_endereco_fiscal" v-if="isEditting" :true-value="1" :false-value="0"/>
            <span class="pl-8" v-else>{{ viabilidade.alvara_endereco_fiscal | boolean }}</span>
          </label>
        </div>
        <div class="flex flex-col pb-8">
          <label class="flex flex-col">
            <Lynx-Label class="pr-8 font-bold" label="CNAE especifico exigido pelo município"/>
            <Lynx-Input v-model="form.cnae_exigido" v-if="isEditting" placeholder="(Opcional)"/>
            <span v-else>{{ viabilidade.cnae_exigido | text }}</span>
          </label>
        </div>
        <div class="flex flex-col pb-8">
          <label class="flex justify-between items-center">
            <Lynx-Label class="pr-8 font-bold" label="Precisa de vigilancia?"/>
            <b-checkbox class="pl-8" v-model="form.vigilancia" v-if="isEditting" :true-value="1" :false-value="0"/>
            <span class="pl-8" v-else>{{ viabilidade.vigilancia | boolean }}</span>
          </label>
        </div>
        <div class="flex flex-col pb-8">
          <label class="flex flex-col">
            <Lynx-Label class="pr-8 font-bold" label="Modelo de Solicitação"/>
            <b-select v-model="form.modelo_solicitacao" v-if="isEditting" required>
              <option value="presencial">Presencial</option>
              <option value="email">Email</option>
              <option value="site">Site</option>
            </b-select>
            <span class="capitalize" v-text="viabilidade.modelo_solicitacao" v-else />
          </label>
        </div>
        <div class="flex flex-col pb-8" v-if="viabilidade.modelo_solicitacao_site || (isEditting && form.modelo_solicitacao === 'site')">
          <label class="flex flex-col">
            <Lynx-Label class="pr-8 font-bold" label="Site Modelo Solicitação"/>
            <Lynx-Input v-model="form.modelo_solicitacao_site" v-if="isEditting" type="url"/>
            <a class="underline text-primary-600" :href="viabilidade.modelo_solicitacao_site" v-text="viabilidade.modelo_solicitacao_site" target="_blank" v-else />
          </label>
        </div>
        <div class="flex flex-col pb-8" v-if="viabilidade.modelo_solicitacao_email || (isEditting && form.modelo_solicitacao === 'email')">
          <label class="flex flex-col">
            <Lynx-Label class="pr-8 font-bold" label="Email para Solicitação"/>
            <Lynx-Input v-model="form.modelo_solicitacao_email" v-if="isEditting" type="email"/>
            <span v-text="viabilidade.modelo_solicitacao_email" target="_blank" v-else />
          </label>
        </div>
        <div class="flex flex-col pb-8">
          <label class="flex justify-between items-center">
            <Lynx-Label class="pr-8 font-bold" label="Tempo para emissão do alvará"/>
            <div class="pl-8 flex items-center">
              <Lynx-Input class="ml-8 mr-2" v-model="form.tempo_emissao_alvara" v-if="isEditting" type="number" required />
              <span v-text="viabilidade.tempo_emissao_alvara" v-else />
              <span class="pl-2">dias</span>
            </div>
          </label>
        </div>
        <div class="flex flex-col pb-8">
          <label class="flex justify-between items-center">
            <Lynx-Label class="pr-8 font-bold" label="Tempo para emissão da licença sanitária"/>
            <div class="pl-8 flex items-center">
              <Lynx-Input class="ml-8 mr-2" v-model="form.tempo_emissao_licenca_sanitaria" v-if="isEditting" type="number" />
              <span v-else> {{ viabilidade.tempo_emissao_licenca_sanitaria | text }}</span>
              <span class="pl-2">dias</span>
            </div>
          </label>
        </div>
        <div class="flex flex-col pb-8">
          <label class="flex justify-between items-center">
            <Lynx-Label class="pr-8 font-bold" label="Valor do alvará"/>
            <div class="pl-8 flex items-center">
              <Input-Money class="ml-8 mr-2" v-model="form.valor_alvara" v-if="isEditting" required />
              <span v-else> {{ viabilidade.valor_alvara | money }}</span>
            </div>
          </label>
        </div>
        <div class="flex flex-col pb-8">
          <label class="flex flex-col">
            <Lynx-Label  class="pr-8 font-bold" label="Mes de Renovação do Alvará"/>
            <b-select placeholder="Selecione o mês de renovação" v-model="form.mes_renovacao_alvara" v-if="isEditting">
              <option
                v-for="(month, index) in monthNames"
                :key="month.id"
                v-text="month"
                :value="index + 1"
              />
            </b-select>
            <span v-else>{{ monthNames[viabilidade.mes_renovacao_alvara - 1] }}</span>
          </label>
        </div>
        <div class="flex flex-col pb-8">
          <label class="flex justify-between items-center">
            <Lynx-Label class="pr-8 font-bold" label="Valor da licença sanitária"/>
            <div class="pl-8 flex items-center">
              <Input-Money class="ml-8 mr-2" v-model="form.valor_licenca_sanitaria" v-if="isEditting" required />
              <span v-else> {{ viabilidade.valor_licenca_sanitaria !== null ? `R$${viabilidade.valor_licenca_sanitaria.replace('.', ',')}` : '-' }}</span>
            </div>
          </label>
        </div>
        <div class="flex flex-col pb-8">
          <label class="flex justify-between items-center">
            <Lynx-Label class="pr-8 font-bold" label="Percentual do ISS"/>
            <div class="pl-8 flex items-center">
              <Lynx-Input class="ml-8 mr-2" v-model="form.percentual_iss" v-if="isEditting" type="number" :min="0" step="any" :max="100" required/>
              <span v-else> {{ viabilidade.percentual_iss }}%</span>
            </div>
          </label>
        </div>
        <div class="flex flex-col pb-8">
          <label class="flex flex-col">
            <Lynx-Label class="pr-8 font-bold" label="Forma de emissão da NFS"/>
            <b-select v-model="form.nfs_eletronica_manual" v-if="isEditting" required>
              <option value="eletronica">Eletronica</option>
              <option value="manual">Manual</option>
            </b-select>
            <span class="capitalize" v-text="viabilidade.nfs_eletronica_manual" v-else />
          </label>
        </div>
        <div class="flex flex-col pb-8" v-if="viabilidade.nfs_eletronica_manual_site || (isEditting && form.nfs_eletronica_manual === 'eletronica')">
          <label class="flex flex-col">
            <Lynx-Label class="pr-8 font-bold" label="Site Modelo Solicitação"/>
            <Lynx-Input v-model="form.nfs_eletronica_manual_site" v-if="isEditting" type="url"/>
            <a class="underline text-primary-600" :href="viabilidade.nfs_eletronica_manual_site" v-text="viabilidade.nfs_eletronica_manual_site" target="_blank" v-else />
          </label>
        </div>
        <div class="flex flex-col pb-8">
          <label class="flex justify-between items-center">
            <Lynx-Label class="pr-8 font-bold" label="Precisa de CRM Juridico?"/>
            <b-checkbox class="pl-8" v-model="form.crm_juridico" v-if="isEditting" :true-value="1" :false-value="0"/>
            <span class="pl-8" v-else>{{ viabilidade.crm_juridico | boolean }}</span>
          </label>
        </div>
        <div class="flex flex-col pb-8" v-if="viabilidade.documentos_necessarios.length || isEditting">
          <div class="flex flex-col">
            <Lynx-Label class="pr-8 font-bold" label="Documentos Necessários"/>
            <b-taginput
              v-model="form.documentos_necessarios"
              :data="documentosNecessarios"
              v-if="isEditting"
              autocomplete
              :allow-new="true"
              :allow-duplicates="false"
              :open-on-focus="true"
              :loading="loadingDocumentos"
            />
            <ul class="flex flex-col list-disc pl-4" v-else>
              <li
                v-for="documento in viabilidade.documentos_necessarios"
                class="pb-1"
                :key="documento.id"
                v-text="documento"
              />
            </ul>
          </div>
        </div>
        <div class="flex flex-col pb-8">
          <label class="flex justify-between items-center">
            <Lynx-Label class="pr-8 font-bold" label="Faz abertura na área rural?"/>
            <b-checkbox class="pl-8" v-model="form.abertura_area_rural" v-if="isEditting" :true-value="1" :false-value="0"/>
            <span class="pl-8" v-else>{{ viabilidade.abertura_area_rural | boolean }}</span>
          </label>
        </div>
        <div class="flex flex-col pb-8" v-if="viabilidade.arquivos.length">
          <label class="flex flex-col">
            <Lynx-Label class="pr-8 font-bold" label="Anexos"/>
            <div class="grid grid-cols-2 row-gap-4 col-gap-8">
              <Anexo
                v-for="(anexo, index) in viabilidade.arquivos"
                :key="anexo.id"
                :anexo="anexo"
                :is-deletabled="isEditting"
                @remove-anexo="deleteAnexo(index)"
              />
            </div>
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
          v-if="isEditting"
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
          <label class="flex flex-col">
            <Lynx-Label class="pr-8 font-bold" label="Observações"/>
            <div class="bg-white" v-if="isEditting" >
              <vue-editor v-model="form.observacoes"></vue-editor>
            </div>
            <div v-else v-html="viabilidade.observacoes" class="bg-white rounded p-4 prose"></div>
          </label>
        </div>
        <Lynx-Button
          type="submit"
          class="self-end"
          text="Enviar"
          icon="Check"
          v-if="isEditting"
          :loading="loadingButton"
        />
      </form>
    </div>
  </div>
</template>

<script>

import { showViabilidadeMunicipalRequest, updateViabilidadeMunicipalRequest, getViabilidadeDocumentosBaseRequest } from '@/services/requests/viabilidadeMunicipal'
import InputMoney from '@/components/helpers/InputMoney'
import { monthNames } from '@/utils/utils'
import Anexo from '@/views/service-order/components/Anexo'
import InputFile from '@/components/helpers/InputFile'
import moment from 'moment'
import { VueEditor } from "vue2-editor";

export default {
  name: 'ViabilidadeMunicipalView',
  components: { InputMoney, Anexo, InputFile, VueEditor },
  props: {
    viabilidadeId: {
      required: true,
      type: Number,
    }
  },
  data() {
    return {
      loading: false,
      loadingButton: false,
      loadingDocumentos: false,
      viabilidade: {},
      isEditting: false,
      monthNames,
      documentosNecessarios: [],
      form: {},
      errorMessage: 'Não foi possivel editar a viabilidade',
    }
  },
  filters: {
    money(val) {
      return val ? 'R$ ' + val.replace('.', ',') : 'R$ 0,00'
    },
    boolean(val) {
      return val ? 'Sim' : 'Não'
    },
    text(val) {
      return val || '-'
    },
    mes(val) {
      return val === 1 ? `${val} mês atras` : `${val} meses atras`
    }
  },
  methods: {
    fetchViabilidade() {
      this.loading = true
      showViabilidadeMunicipalRequest(this.viabilidadeId)
        .then(res => this.viabilidade = res.data)
        .finally(() => this.loading = false)
    },
    fetchDocumentosNecessarios() {
      this.loadingDocumentos = true
      getViabilidadeDocumentosBaseRequest()
        .then(res => this.documentosNecessarios = res.data.map(curr => curr.name))
        .finally(() => this.loadingDocumentos = false)
    },
    getUpdatedAtDifference(val) {
      const updatedAtMonth = moment(val)
      const now = moment()
      return now.diff(updatedAtMonth, 'month')
    },
    getUpdatedAtTheme(val) {
      if(val < 6) return 'bg-info-base'
      if(val < 12) return 'bg-warning-base'
      return 'bg-error-base'
    },
    onEdit() {
      this.form = {
        ...this.viabilidade,
        anexos: []
      }
      this.isEditting = true
    },
    onCancelEdit() {
      this.form = {}
      this.isEditting = false
    },
    async onSubmit() {
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
        modelo_solicitacao_site: this.form.modelo_solicitacao === 'site' ? this.form.modelo_solicitacao_site : ''
      }
      updateViabilidadeMunicipalRequest(this.viabilidade.id, form)
        .then(() => {
          this.$emit('edit-viabilidade')
          this.$snack.success('Viabilidade atualizada com sucesso')
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
    deleteAnexo(index) {
      this.viabilidade.arquivos.splice(index, 1)
    },
  },
  beforeMount() {
    this.fetchViabilidade()
    this.fetchDocumentosNecessarios()
  }
}
</script>
