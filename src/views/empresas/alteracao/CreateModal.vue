<template>
  <div class="bg-neutral-300 shadow rounded overflow-hidden">
    <div class="flex flex-col p-8">
      <Lynx-Title text="Solicitação"/>

      <form class="flex items-end" @submit.prevent="selectEmpresa()">
        <label class="flex flex-col w-64">
          <Lynx-Label label="Número da Empresa"/>

          <Lynx-Input
            v-model="empresaId"
            placeholder="Digite o número da empresa"
            type="number" required
          />
        </label>

        <Lynx-Button type="submit" size="small" text="Confirmar" icon="ArrowRight"/>
      </form>

      <div v-if="empresa" class="mt-8">
        <p class="text-xl font-display mb-4">
          {{ empresa.razao_social }} / {{ empresa.endereco.uf }}
        </p>

        <label class="flex flex-col w-96 mb-4">
          <Lynx-Label label="Tipo de Alteração"/>

          <b-select @input="cleanData()" v-model="form.solicitacao.tipo" placeholder="Selecione o tipo de alteração">
            <option value="Endereço">Endereço</option>
            <option value="Sócio/Administrador">Sócio/Administrador</option>
            <option value="Transformação de Empresa">Transformação de Empresa</option>
            <option value="Atividade/CNAE/Outros">Atividade/CNAE/Outros</option>
          </b-select>
        </label>

        <div v-if="form.solicitacao.tipo == 'Endereço'" class="flex flex-wrap w-full">
          <label class="flex flex-col w-56 mb-4">
            <Lynx-Label label="Estado"/>

            <b-select @input="fetchNewJuntaComercial()" v-model="newEstado" placeholder="Selecione o estado">
              <option v-for="(estado, index) in estados" :key="index" :value="estado.uf">{{ estado.nome }}</option>
            </b-select>
          </label>

          <div class="flex w-full mb-4">
            <Input-File class="pr-4" text="Comprovante de Endereço" ref="arquivoComprovanteDeEnderecoInput"/>
            <Input-File class="pr-4" text="IPTU" ref="arquivoIptuInput"/>
          </div>
        </div>

        <div v-if="form.solicitacao.tipo == 'Sócio/Administrador'">
          <div class="flex justify-between w-144 border border-neutral-500 p-2 mb-2 rounded"
               v-for="(socio, index) in empresa.socios" :key="index">
            <span>
              {{ socio.nome_completo }}
              <b-tag v-if="socio.socio_administrador" type="is-dark">administrador</b-tag>
            </span>

            <span>
              {{ socio.pivot.porcentagem_societaria }}%
            </span>
          </div>
        </div>

        <div class="flex flex-col w-96 mb-4" v-if="form.solicitacao.tipo == 'Transformação de Empresa'">
          <Lynx-Label label="Tipo Societário Atual"/>

          <span class="mb-4">
            {{ empresa.tipo_societario }}
          </span>

          <Lynx-Label label="Tipo Societário Alteração"/>

          <b-select v-model="form.solicitacao.tipo_societario" placeholder="Selecione o tipo societário">
            <option value="Endereço">Eireli</option>
            <option value="Sócio/Administrador">LTDA</option>
            <option value="Transformação de Empresa">Individual</option>
            <option value="Atividade/CNAE/Outros">Unipessoal</option>
            <option value="ONG">ONG</option>
          </b-select>
        </div>

        <label class="flex flex-col w-2/3 mb-4">
          <Lynx-Label label="Observação"/>
          <Textarea v-model="form.solicitacao.observacao"/>
        </label>
      </div>
    </div>

    <div class="bg-neutral-400 border-neutral-500 border-t p-8">
      <div v-if="empresa" class="flex">
        <div class="flex-1 mr-5">
          <p class="text-md font-display text-error-base" v-if="!juntaComercial.estado">
            Divergencia nos valores! Junta comercial nao cadastrada para este estado.
          </p>
          <p class="text-xl font-display">
            Valor Alteração: R$ {{ precoAlteracaoTotal }}
          </p>
        </div>
        <Lynx-Button @click.native.prevent="submitForm()" text="Realizar Solicitação" class=""/>
      </div>
    </div>
  </div>
</template>

<script>

import {EmpresaAlteracaoStore} from '@/services/requests/empresaAlteracao'
import {empresasShowRequest} from '@/services/requests/empresas'
import {JuntaComercialByUf} from '@/services/requests/juntaComercial'
import {indexEstadosRequest} from '@/services/requests/estados'
import Textarea from '@/components/helpers/Textarea'
import InputFile from '@/components/helpers/InputFile'

export default {
  name: 'EmpresaAlteracaoCreate',
  components: {Textarea, InputFile},
  data() {
    return {
      empresaId: null,
      empresa: null,
      juntaComercial: null,
      newEstado: null,
      newJuntaComercial: null,
      precoAlteracao: 250.00,
      form: {
        solicitacao: {
          tipo: null,
          observacao: null,
          arquivos: {
            comprovante_de_endereco: null,
            iptu: null,
          },
          tipo_societario: null,
        }
      },
      loading: false,
    }
  },
  computed: {
    precoAlteracaoTotal() {
      const precoJuntaComercialTaxa = this.juntaComercial ? parseFloat(this.juntaComercial.taxa_alteracao) : 0
      const precoJuntaComercialTaxaExtra = this.juntaComercial ? parseFloat(this.juntaComercial.taxa_alteracao_extra) : 0
      const precoJuntaComercialTaxaTotal = precoJuntaComercialTaxa + precoJuntaComercialTaxaExtra + this.precoAlteracao

      const precoNewJuntaComercialTaxa = this.newJuntaComercial ? parseFloat(this.newJuntaComercial.taxa_alteracao) : 0
      const precoNewJuntaComercialTaxaExtra = this.newJuntaComercial ? parseFloat(this.newJuntaComercial.taxa_alteracao_extra) : 0
      const precoNewJuntaComercialTaxaTotal = precoNewJuntaComercialTaxa + precoNewJuntaComercialTaxaExtra + this.precoAlteracao

      const total = this.newJuntaComercial ? precoJuntaComercialTaxaTotal + precoNewJuntaComercialTaxaTotal : precoJuntaComercialTaxaTotal

      return total.toFixed(2)
    }
  },
  mounted() {
    this.fetchEstados()
  },
  methods: {
    selectEmpresa() {
      this.loading = true
      this.empresa = null
      empresasShowRequest(this.empresaId)
        .then(res => {
          this.empresa = res.data.data
        })
        .catch(() => this.$snack.error('Empresa não encontrada'))
        .finally(() => {
          this.loading = false
          this.fetchJuntaComercial()
        })
    },
    fetchJuntaComercial() {
      this.loading = true
      JuntaComercialByUf(this.empresa.endereco.uf)
        .then(res => {
          if (res.status === 204) {
            this.$snack.error('Junta Comercial não cadastrada para este estado.')
          }
          this.juntaComercial = res.data.data
        })
        .catch(() => this.$snack.error('Junta Comercial não encontrada'))
        .finally(() => {
          this.loading = false
        })
    },
    fetchNewJuntaComercial() {
      this.loading = true
      JuntaComercialByUf(this.newEstado)
        .then(res => {
          this.newJuntaComercial = res.data.data
        })
        .catch(() => this.$snack.error('Junta Comercial não encontrada'))
        .finally(() => {
          this.loading = false
        })
    },
    fetchEstados() {
      this.loading = true
      indexEstadosRequest()
        .then(res => {
          this.estados = res.data
        })
        .finally(() => this.loading = false)
    },
    cleanData() {
      this.newEstado = null
      this.newJuntaComercial = null
      this.form.solicitacao.observacao = null
      this.form.solicitacao.arquivos.comprovante_de_endereco = null
      this.form.solicitacao.arquivos.iptu = null
      this.form.solicitacao.tipo_societario = null
    },
    async submitForm() {
      if (this.form.solicitacao.tipo == 'Endereço') {
        if (!this.newEstado) {
          this.$snack.error('Estado para alteração é obrigatório!')
          return
        }

        this.form.solicitacao.arquivos.comprovante_de_endereco = await this.$refs.arquivoComprovanteDeEnderecoInput.submit()
        if (!this.form.solicitacao.arquivos.comprovante_de_endereco) {
          this.$snack.error('Comprovante de endereço é obrigatório!')
          return
        }

        this.form.solicitacao.arquivos.iptu = await this.$refs.arquivoIptuInput.submit()
        if (!this.form.solicitacao.arquivos.iptu) {
          this.$snack.error('IPTU é obrigatório!')
          return
        }
      }

      if (this.form.solicitacao.tipo == 'Transformação de Empresa') {
        if (!this.form.solicitacao.tipo_societario) {
          this.$snack.error('Tipo societário para alteração é obrigatório!')
          return
        }
      }

      if (!this.form.solicitacao.observacao) {
        this.$snack.error('Observação é obrigatório!')
        return
      }

      const data = {...this.form}
      data.empresa_id = this.empresaId
      data.solicitacao.preco_alteracao = this.precoAlteracaoTotal

      EmpresaAlteracaoStore(data)
        .then(() => {
          this.$snack.success('Alteração solicitada com sucesso!')
          this.$emit('created')
        })
        .catch(error => {
          const errors = Object.values(error.response.data.errors)
          const message = errors.map(item => item.map(error => `<li>${error}</li>`).join('')).join('')

          this.$buefy.dialog.alert({
            title: 'Não foi possível solicitar a alteração',
            message: `<ul>${message}</ul>`,
            type: 'is-danger',
            ariaRole: 'alertdialog',
            ariaModal: true
          })
        })
        .finally(() => this.loading = false)
    },
  }
}
</script>
