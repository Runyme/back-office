<template>
  <div class="flex flex-wrap -mx-4">
    <div class="w-full px-4 mb-8">
      <p class="text-xl font-display mb-4 border-b-2 border-neutral-400">
        Sócios

        <button @click.prevent="openSociosUpdateModal(empresa.id)">
          <b-icon class="ml-1" icon="circle-edit-outline"></b-icon>
        </button>
      </p>

      <div class="flex">
        <div class="w-full px-4 py-3 mb-2 border border-neutral-600 rounded" v-for="(socio, index) in empresa.socios"
             :key="index">
          <p class="text-xl flex items-center">
            {{ socio.nome_completo }}
            <b-tag v-if="socio.pivot.socio_administrador" class="ml-2" type="is-dark">Administrador</b-tag>
          </p>
          <p>
            <strong>CPF: </strong>{{ socio.cpf }} |
            <strong>RG: </strong> {{ socio.rg }} |
            <strong>Porcentagem societária: </strong>{{ socio.pivot.porcentagem_societaria }}%
          </p>

          <p>
            <strong>Nacionalidade: </strong>
            <span v-if="socio.nacionalidade">{{ socio.nacionalidade }}</span>
            <span v-else class="px-2 bg-neutral-400 text-neutral-700 rounded-lg">Não cadastrado</span>
          </p>

          <p>
            <strong>Estado Civil: </strong>
            <span v-if="socio.estado_civil">{{ socio.estado_civil.nome }}</span>
            <span v-else class="px-2 bg-neutral-400 text-neutral-700 rounded-lg">Não cadastrado</span>
          </p>

          <p>
            <strong>Instituição de ensino: </strong>
            <span v-if="socio.ies">{{ socio.ies.nome }}</span>
            <span v-else class="px-2 bg-neutral-400 text-neutral-700 rounded-lg">Não cadastrado</span>
          </p>

          <p>
            <strong>Qualificação: </strong>
            <span v-if="socio.qualificacao">{{ socio.qualificacao.nome }}</span>
            <span v-else class="px-2 bg-neutral-400 text-neutral-700 rounded-lg">Não cadastrado</span>
          </p>

          <p>
            <strong>Qualificação: </strong>
            <span v-if="socio.profissao">{{ socio.profissao.nome }}</span>
            <span v-else class="px-2 bg-neutral-400 text-neutral-700 rounded-lg">Não cadastrado</span>
          </p>

          <p>
            <strong>Especialidade: </strong>
            <span v-if="socio.especialidade">{{ socio.especialidade.nome }}</span>
            <span v-else class="px-2 bg-neutral-400 text-neutral-700 rounded-lg">Não cadastrado</span>
          </p>

          <p>
            <strong>Naturalidade: </strong>
            <span v-if="socio.naturalidade">{{ socio.naturalidade }}</span>
            <span v-else class="px-2 bg-neutral-400 text-neutral-700 rounded-lg">Não cadastrado</span>
          </p>

          <p>
            <strong>Endereço: </strong>
            <span v-if="socio.endereco">
            {{ `${socio.endereco.cep} - ${socio.endereco.logradouro}, ${socio.endereco.numero}` }}
            {{ socio.endereco.complemento ? ` - ${socio.endereco.complemento}` : '' }} -
            {{ `${socio.endereco.bairro} - ${socio.endereco.cidade}/${socio.endereco.uf}` }}
            </span>
            <span v-else class="px-2 bg-neutral-400 text-neutral-700 rounded-lg">Não cadastrado</span>
          </p>

          <p><strong>Contatos: </strong>{{ socio.contatos | filterFormatContacts }}</p>

          <div class="flex flex-wrap">
            <button
              v-for="(arquivo, index) in socio.arquivos" :key="index"
              class="px-2 py-1 m-2 border border-neutral-600 rounded flex items-center"
              @click.prevent="openArquivo(arquivo.id)"
            >
              <b-icon class="text-neutral-600 mr-2" icon="file-eye-outline"></b-icon>
              {{ arquivo.nome ? arquivo.nome : arquivo.nome_original }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="w-2/5 px-4 mb-8">
      <p class="text-xl font-display mb-4 border-b-2 border-neutral-400">Vendedor</p>
      <p>{{ empresa.precadastro.usuario.nome_completo }}</p>
    </div>

    <div class="w-1/5 px-4 mb-8">
      <p class="text-xl font-display mb-4 border-b-2 border-neutral-400">Regime</p>
      <p v-if="empresa.regime_tributario == 'SN'">Simples Nacional</p>
      <p v-if="empresa.regime_tributario == 'presumido'">Lucro Presumido</p>
      <p v-if="empresa.regime_tributario == 'isento'">Isento</p>
    </div>

    <div class="w-1/5 px-4 mb-8">
      <p class="text-xl font-display mb-4 border-b-2 border-neutral-400">Tipo</p>
      <p>{{ empresa.tipo_societario }}</p>
    </div>

    <div class="w-1/5 px-4 mb-8">
      <p class="text-xl font-display mb-4 border-b-2 border-neutral-400">Clínica?</p>
      <p class="flex items-center" v-if="empresa.clinica_fisica == 0">
        <b-icon class="text-neutral-600 mr-1" icon="close"></b-icon>
        Não
      </p>

      <p class="flex items-center" v-if="empresa.clinica_fisica == 1">
        <b-icon class="text-neutral-600 mr-1" icon="check"></b-icon>
        Sim
      </p>
    </div>

    <div class="w-1/2 px-4 mb-8">
      <p class="text-xl font-display mb-4 border-b-2 border-neutral-400">Endereço</p>
      <p v-if="empresa.endereco.tipo">{{ `Tipo: ${empresa.endereco.tipo}` }}</p>
      <p>{{ `IPTU: ${empresa.endereco.iptu}` }}</p>
      <p>{{ `${empresa.endereco.logradouro}, ${empresa.endereco.numero}` }}
        {{ empresa.endereco.complemento ? ` - ${empresa.endereco.complemento}` : '' }}</p>
      <p>{{
          `${empresa.endereco.bairro} - ${empresa.endereco.cidade}/${empresa.endereco.uf} - ${empresa.endereco.cep}`
        }}</p>
    </div>

    <div class="w-1/2 px-4 mb-8">
      <p class="text-xl font-display mb-4 border-b-2 border-neutral-400">Contatos</p>
      <p v-for="(contato, index) in empresa.contatos" :key="index">
        {{ contato.value }}
      </p>
    </div>

    <div class="w-1/2 px-4 mb-8" v-if="empresa.precadastro.tipo == 'abertura'">
      <p class="text-xl font-display mb-4 border-b-2 border-neutral-400">Opções para Razão Social</p>

      <ul class="list-disc list-inside">
        <li v-for="(razao_social, index) in empresa.precadastro.empresa.razao_social" :key="index">
          {{ razao_social }}
        </li>
      </ul>
    </div>

    <div class="w-1/2 px-4 mb-8">
      <p class="text-xl font-display mb-4 border-b-2 border-neutral-400">
        Observações

        <button @click.prevent="observacoesOnUpdate = !observacoesOnUpdate">
          <b-icon class="ml-1" icon="circle-edit-outline"></b-icon>
        </button>
      </p>

      <div v-if="!observacoesOnUpdate">
        <p v-if="empresa.precadastro.empresa.observacoes">
          {{ empresa.precadastro.empresa.observacoes }}
        </p>

        <p v-else class="text-center text-neutral-500 text-xl">
          Sem Observações
        </p>
      </div>

      <div v-else class="flex flex-col items-end">
        <b-input v-model="observacoesToUpdate" type="textarea" placeholder="Insira as observações" class="w-full mb-4"></b-input>

        <b-button type="is-primary" @click.prevent="updateObservacoes">
          Salvar
        </b-button>
      </div>
    </div>

    <div class="w-full px-4">
      <p class="text-xl font-display mb-4 border-b-2 border-neutral-400">Arquivos</p>

      <div class="flex flex-wrap -mx-2">
        <button
          v-for="(arquivo, index) in empresa.arquivos" :key="index"
          class="px-2 py-1 m-2 border border-neutral-600 rounded flex items-center"
          @click.prevent="openArquivo(arquivo.id)">
          <b-icon class="text-neutral-600 mr-2" icon="file-eye-outline"></b-icon>
          {{ arquivo.nome }}
        </button>
      </div>
    </div>

    <b-modal :active.sync="sociosUpdateModalOpened">
      <SociosUpdateModal :empresaId="selectedEmpresa" @updated="onUpdatedSocios" />
    </b-modal>
  </div>
</template>

<script>

import {mapGetters} from 'vuex'
import {updateEmpresaPreCadastro} from "@/services/requests/empresaPreCadastro";
import SociosUpdateModal from "@/views/empresas/socios/SociosUpdateModal";

export default {
  name: 'EmpresaDataShow',
  components: {SociosUpdateModal},
  props: ['empresa'],
  data() {
    return {
      selectedEmpresa: null,
      sociosUpdateModalOpened: false,
      observacoesOnUpdate: false,
      observacoesToUpdate: '',
    }
  },
  filters: {
    filterFormatContacts(val) {
      return val.reduce(function (prevVal, currVal, idx) {
        return idx == 0 ? currVal.value : prevVal + ' | ' + currVal.value;
      }, '')
    }
  },
  computed: {
    ...mapGetters(['getToken']),
  },
  mounted() {
    this.observacoesToUpdate = this.empresa.precadastro.empresa.observacoes
  },
  methods: {
    openArquivo(arquivoId) {
      window.open(`${process.env.VUE_APP_API_URL}/arquivos/${arquivoId}/open?token=${this.getToken}`)
    },
    openSociosUpdateModal(empresaId) {
      this.selectedEmpresa = empresaId;
      this.sociosUpdateModalOpened = true;
    },
    onUpdatedSocios() {
      this.sociosUpdateModalOpened = false;
      this.$emit('updated')
    },
    updateObservacoes() {
      const payload = {
        precadastro: {
          empresa: {
            observacoes: this.observacoesToUpdate
          }
        }
      }

      updateEmpresaPreCadastro(this.empresa.id, payload)
        .then(() => {
          this.$snack.success('Observações atualizada com sucesso!')
          this.$emit('updated')
        })
        .catch(error => {
          const errors = Object.values(error.response.data.errors)
          const message = errors.map(item => item.map(error => `<li>${error}</li>`).join('')).join('')

          this.$buefy.dialog.alert({
            title: 'Não foi possível atualizar as observações',
            message: `<ul>${message}</ul>`,
            type: 'is-danger',
            ariaRole: 'alertdialog',
            ariaModal: true
          })
        })
        .finally(() => this.observacoesOnUpdate = false)

    }
  }
}
</script>
