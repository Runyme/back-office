<template>
  <div class="bg-neutral-300 p-8 flex items-start flex-col">
    <div class="flex items-center justify-between w-full">
      <Lynx-Title text="Arquivos"/>
      <Lynx-Button class="mb-8" text="Adicionar Arquivo" icon="Plus" icon-size="3" size="small" outlined="true"
                   @click.native="isAdding = true"/>
    </div>
    <form @submit.prevent="onInputFile" class="flex flex-col mb-8 w-full items-start" v-show="isAdding"
          v-if="modelType === 'empresa'">
      <label class="pb-4 flex flex-col">
        <Lynx-Label label="Tipo do arquivo"/>
        <b-select v-model="tipo">
          <option
            v-for="tipo in tipos"
            :key="tipo.id"
            :value="tipo.value"
            v-text="tipo.label"
          />
        </b-select>
      </label>
      <Input-File class="mb-4" text="Adicionar Arquivo" ref="fileInput"/>
      <div class="flex">
        <Lynx-Button text="Enviar" type="submit" size="small"/>
        <Lynx-Button text="Cancelar" class="ml-8" type="button" size="small" outlined="true"
                     @click.native="isAdding = false"/>
      </div>
    </form>
    <div class="w-full flex justify-center" v-if="loading">
      <Lynx-Spinner size="12"/>
    </div>
    <div class="w-full" v-else>
      <label class="pb-4 flex flex-col">
        <Lynx-Label label="Filtrar por:"/>
        <b-select v-model="tag" @input="fetchFiles">
          <option
            v-for="(tag, index) in tags"
            :key="index"
            :value="tag.value"
            v-text="tag.label"
          />
        </b-select>
      </label>
      <b-table
        :data="arquivos"
        :columns="columns"
        hoverables
      >
        <template slot-scope="props">
          <b-table-column field="nome">
            <a href="#" class="cursor-pointer" v-text="props.row.nome || props.row.nome_original"
               @click.prevent="openFile(props.row.id)"/>
          </b-table-column>
          <b-table-column field="data_envio">
            <span v-text="moment(props.row.created_at).format('DD/MM/YYYY')"/>
          </b-table-column>
          <b-table-column>
            <div class="flex items-center justify-end">
              <a href="#" class="cursor-pointer mr-4" @click.prevent="editArquivo(props.row)">
                <b-icon icon="pencil" size="is-small" class="text-primary-500"/>
              </a>
              <a href="#" class="cursor-pointer mr-4" @click.prevent="$openFile(props.row.id)">
                <Icon-Eye class="text-primary-500"/>
              </a>
              <!--              <a href="#" class="cursor-pointer mr-4" @click.prevent="$downloadFile(props.row.id)">-->
              <!--                <Icon-Download class="text-primary-500" size="4"/>-->
              <!--              </a>-->
              <a href="#" class="cursor-pointer" @click.prevent="deleteFile(props.row.id)">
                <Icon-Trash class="text-error-base" size="4"/>
              </a>
            </div>
          </b-table-column>
        </template>
        <template #empty>
          <Not-Found-Data text="Nenhum aqruivo foi encontrado"/>
        </template>
      </b-table>
    </div>

    <b-modal :active.sync="editing && editing.id ? true : false">
      <div class="bg-white p-10" v-if="editing">
        <label for="nomearquivo">Nome do arquivo</label>
        <b-input id="nomearquivo" v-model="editing.nome"/>

        <div>
          <b-button @click.native="cancelEditing" type="is-danger" class="mt-4">Cancelar</b-button>
          <b-button @click.native="saveEditing" type="is-primary" class="ml-4 mt-4">Salvar</b-button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>

import {arquivosDeleteRequest, arquivosSearchRequest, arquivosUpdateRequest} from '@/services/requests/arquivos'
import {mapGetters} from 'vuex'
import NotFoundData from '@/components/layouts/NotFoundData'
import moment from 'moment'
import InputFile from '@/components/helpers/InputFile'
import {empresasAddArquivoRequest} from '@/services/requests/empresas'

export default {
  name: 'Arquivos',
  components: {NotFoundData, InputFile},
  props: {
    modelType: {
      validator: value => ['empresa', 'cliente'].indexOf(value) !== -1,
      required: true
    },
    modelId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      tipos: [
        {
          label: 'CNPJ',
          value: 'cnpj',
        },
        {
          label: 'Contrato Social',
          value: 'contrato_social',
        },
        {
          label: 'IPTU',
          value: 'iptu',
        },
        {
          label: 'Outros',
          value: 'outros',
        },
      ],
      tipo: '',
      isAdding: false,
      arquivos: [],
      editing: null,
      loading: false,
      columns: [
        {
          field: 'nome',
          label: 'Nome',
        },
        {
          field: 'data_envio',
          label: 'Data de envio',
        }
      ],
      tags: [
        {label: 'Todos', value: 'all'},
        {label: 'Arquivos da Empresa', value: 'empresa'},
        {label: 'Alvará', value: 'alvara'},
        {label: 'Residencia Médica', value: 'residencia_medica'},
        {label: 'Cotrato', value: 'contrato'},
        {label: 'NFS-e', value: 'nfse'},
      ],
      tag: '',
    }
  },
  computed: {
    ...mapGetters(['getToken', 'getEmpresa']),
  },
  methods: {
    moment,
    editArquivo(arquivo) {
      this.editing = arquivo
    },
    cancelEditing() {
      this.editing = null
    },
    saveEditing() {
      this.loading = true
      arquivosUpdateRequest(this.editing.id, {nome: this.editing.nome})
        .then(() => {
          this.cancelEditing();
          this.fetchFiles()
        })
        .catch(error => this.$snack.error(error.response.data.message))
        .finally(() => this.loading = false)
    },
    fetchFiles() {
      this.loading = true
      arquivosSearchRequest({
        model_type: this.modelType,
        model_id: this.modelId,
        type: this.tag,
      })
        .then(res => this.arquivos = res.data.data)
        .finally(() => this.loading = false)
    },
    async onInputFile() {
      if (!this.tipo) return this.$snack.error('Selecione um tipo para o arquivo')
      const fileId = await this.$refs.fileInput.submit()
      if (!fileId) return this.$snack.error('Selecione um arquivo para enviar')
      const form = {
        arquivo_id: fileId,
        tipo: this.tipo
      }
      empresasAddArquivoRequest(this.getEmpresa.id, form)
        .then(() => {
          this.$snack.success('Arquivo adicionado com sucesso')
          this.isAdding = false
          this.fetchFiles()
        })
        .catch(() => this.$snack.error('Não foi possível adicionar o arquivo'))
    },
    deleteFile(id) {
      if (!confirm('Esta ação nao poderá ser revertida! deseja continuar?')) {
        return;
      }
      arquivosDeleteRequest(id)
        .then(() => {
          this.fetchFiles()
          this.$snack.success('Arquivo removido com sucesso')
        })
        .catch(() => this.$snack.error('Não foi possível remover o arquivo'))
    }
  },
  beforeMount() {
    this.fetchFiles()
  }
}
</script>
