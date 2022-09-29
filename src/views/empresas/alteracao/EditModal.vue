<template>
  <div class="bg-neutral-300 shadow p-8 flex flex-col rounded">
    <div class="w-full flex justify-center" v-if="loading">
      <Lynx-Spinner size="12"/>
    </div>

    <form
      v-if="empresaAlteracao"
      @submit.prevent="submitForm"
      class="flex flex-col"
    >
      <Lynx-Title :text="`Alteração de Empresa: #${empresaAlteracao.alteracao.empresa.id}`"/>

      <div class="bg-neutral-100 border border-neutral-400 rounded p-6 mb-6">
        <span class="text-lg font-display border-b border-neutral-400 w-full pb-2 flex mb-4">
          Solicitação
        </span>

        <p>
          {{ empresaAlteracao.solicitacao.observacao }}
        </p>
      </div>

      <!-- SÓCIOS-->
      <div class="mb-8">
        <span class="text-lg font-display border-b border-neutral-400 w-full pb-2 flex mb-4">
          Sócios
        </span>

        <ul v-if="form.socios.length" class="py-2 mb-2">
          <li
            v-for="(socio, index) in form.socios"
            :key="index"
            class="flex justify-between items-center py-2"
          >
            <div class="w-full flex items-center">
              <span>
                {{ socio.nome_completo }} | CPF: {{ socio.cpf }}
              </span>

              <button
                v-if="form.socio_administrador != socio.id"
                class="pl-1 flex items-center justify-center flex-shrink-0 text-neutral-500"
                @click.prevent="form.socios.splice(index, 1)"
              >
                <b-icon icon="delete-forever"></b-icon>
              </button>
            </div>

            <b-radio
              v-model="form.socio_administrador"
              :native-value="socio.id"
              class="flex-shrink-0 ml-4"
            >
              Administrador
            </b-radio>
          </li>
        </ul>

        <div class="w-full h-full flex flex-col justify-center items-center" v-else>
          <NotFoundData text="Nenhum sócio adicionado"/>
        </div>

        <Lynx-Button text="Adicionar Sócio" @click.prevent.native="addSocio" icon="Plus" />
      </div>

      <!-- DADOS EMPRESA -->
      <div class="mb-8 flex flex-wrap">
        <span class="text-lg font-display border-b border-neutral-400 w-full pb-2 flex mb-4">
          Dados da Empresa
        </span>

        <label class="block w-full">
          <Lynx-Label label="Nome Fantasia" />

          <Lynx-Input
            placeholder="Insira o Nome Fantasia"
            v-model="form.empresa.nome_fantasia"
          />
        </label>

        <label class="block w-full">
          <Lynx-Label label="Razão Social" />

          <Lynx-Input
            placeholder="Insira o Razão Social"
            v-model="form.empresa.razao_social"
          />
        </label>

        <label class="block w-1/3 pr-4">
            <Lynx-Label label="Regime Tributário" />

            <b-select
              placeholder="Escolha um Regime Tributário"
              v-model="form.empresa.regime_tributario"
            >
              <option value="SN">Simples Nacional</option>
              <option value="Presumido">Presumido</option>
              <option value="Isento">Isento</option>
            </b-select>
          </label>

          <label class="block w-1/3 pr-4">
            <Lynx-Label label="Tipo Societário" />

            <b-select
              placeholder="Escolha um Tipo Societário"
              v-model="form.empresa.tipo_societario"
            >
              <option value="LTDA">LTDA</option>
              <option value="Eireli">Eireli</option>
              <option value="Individual">Individual</option>
              <option value="Unipessoal">Unipessoal</option>
              <option value="ONG">ONG</option>
            </b-select>
          </label>

          <b-checkbox class="block flex-shrink-0 pt-2" v-model="form.empresa.clinica_fisica">Possui Clinica Física</b-checkbox>
      </div>

      <!-- CONTATOS -->
      <div class="mb-8 flex flex-wrap">
        <span class="w-full text-lg font-display border-b border-neutral-400 pb-2 flex mb-4">
          Contatos da Empresa
        </span>

        <div class="w-1/2 pr-4">
          <span class="font-display w-full pb-2 flex items-center">
            Emails

            <b-button
              size="is-small"
              type="is-primary"
              @click.prevent="addEmail"
              class="ml-2"
            >
              Adicionar
            </b-button>
          </span>

          <div
            class="flex items-center w-full pb-6"
            v-for="(email, index) in contatosEmail" :key="index"
          >
            <button
              v-if="index != 0"
              class="pr-1 flex items-center justify-center flex-shrink-0 text-neutral-500"
              @click.prevent="contatosEmail.splice(index, 1)"
            >
              <b-icon icon="delete-forever"></b-icon>
            </button>

            <Lynx-Input
              placeholder="Insira um email"
              type="email"
              v-model="email.value"
              class="w-full"
            />

            <b-checkbox class="flex-shrink-0 ml-2" v-model="email.optin">
              Notificação
            </b-checkbox>
          </div>
        </div>

        <div class="w-1/2 pl-4">
          <span class="font-display w-full pb-2 flex items-center">
            Celulares

            <b-button
              size="is-small"
              type="is-primary"
              @click.prevent="addCelular"
              class="ml-2"
            >
              Adicionar
            </b-button>
          </span>

          <div
            class="flex items-center w-full pb-6"
            v-for="(celular, index) in contatosCelular" :key="index"
          >
            <button
              v-if="index != 0"
              class="pr-1 flex items-center justify-center flex-shrink-0 text-neutral-500"
              @click.prevent="contatosCelular.splice(index, 1)"
            >
              <b-icon icon="delete-forever"></b-icon>
            </button>

            <Lynx-Input
              placeholder="Insira um celular"
              v-model="celular.value"
              mask="(##) #####-####"
              class="w-full"
            />

            <b-checkbox class="flex-shrink-0 ml-2" v-model="celular.optin">
              Notificação
            </b-checkbox>
          </div>
        </div>
      </div>

      <!-- ENDEREÇO -->
      <div class="mb-8">
        <span class="text-lg font-display border-b border-neutral-400 w-full pb-2 flex mb-4">
          Endereço da Empresa
        </span>

        <div class="flex">
          <label class="flex flex-col w-1/3 pr-4 pb-6">
            <Lynx-Label label="CEP" />

            <Lynx-Input
              placeholder="Insira o CEP"
              v-model.trim="form.endereco.cep"
              mask="#####-###"
              @input="fetchCep"
            />
          </label>

          <label class="flex flex-col w-1/3 pr-4 pb-6">
            <Lynx-Label label="IPTU" />

            <Lynx-Input
              placeholder="Insira o IPTU"
              v-model.trim="form.endereco.iptu"
              mask="####################"
            />
          </label>
        </div>

        <div class="w-full flex">
          <label class="flex flex-col w-1/2 pb-6 pr-2">
            <Lynx-Label label="Logradouro" />

            <Lynx-Input
              placeholder="Insira o Logradouro"
              v-model.trim="form.endereco.logradouro"
            />
          </label>

          <label class="flex flex-col w-1/4 px-2 pb-6">
            <Lynx-Label label="Numero" />

            <Lynx-Input
              placeholder="Insira o Número"
              v-model.trim="form.endereco.numero"
            />
          </label>

          <label class="flex flex-col w-1/4 pl-2 pb-6">
            <Lynx-Label label="Complemento"/>
            <Lynx-Input
              placeholder="Insira o Número"
              v-model="form.endereco.complemento"
            />
          </label>
        </div>

        <div class="w-full flex">
          <label class="flex flex-col w-1/5 pb-6 pr-2">
            <Lynx-Label label="Estado" />

            <Lynx-Input
              placeholder="Insira o Estado"
              v-model.trim="form.endereco.uf"
            />
          </label>

          <label class="flex flex-col w-2/5 px-2 pb-6">
            <Lynx-Label label="Cidade" />

            <Lynx-Input
              placeholder="Insira a Cidade"
              v-model.trim="form.endereco.cidade"
            />
          </label>

          <label class="flex flex-col w-2/5 px-2 pb-6">
            <Lynx-Label label="Bairro" />

            <Lynx-Input
              placeholder="Insira o bairro"
              v-model.trim="form.endereco.bairro"
            />
          </label>
        </div>
      </div>

      <div class="flex justify-between">
        <Lynx-Button @click.native.prevent="finalizarAlteracao" type="button" text="Finalizar Alteração" class="self-start" color="success-base" :loading="loading" :disable="loading"/>

        <Lynx-Button type="submit" text="Salvar" class="self-end" :loading="loading" :disable="loading"/>
      </div>
    </form>

    <b-modal :active.sync="clienteSearchModalOpened">
      <ClienteSearchModal @selected="onClienteSelected" />
    </b-modal>
  </div>
</template>

<script>

import { EmpresaAlteracaoUpdate, FinalizarEmpresaAlteracao } from '@/services/requests/empresaAlteracao'
import { viaCepRequest } from '@/services/requests/viaCep'
import ClienteSearchModal from '@/views/clientes/SearchModal'

export default {
  name: 'EmpresasAlteracaoEditModal',
  components: { ClienteSearchModal },
  props: [ 'empresaAlteracao' ],
  data() {
    return {
      clienteSearchModalOpened: false,
      contatosEmail: [
        { tipo: 'email', value: '', optin: true, },
      ],
      contatosCelular: [
        { tipo: 'celular', value: '', optin: true, options: { is_whatsapp: true } },
      ],
      form: {
        socio_administrador: null,
        socios: this.empresaAlteracao.alteracao.socios,

        empresa: {
          ...this.empresaAlteracao.alteracao.empresa,
          razao_social: this.empresaAlteracao.alteracao.empresa.nome_empresa || this.empresaAlteracao.alteracao.empresa.razao_social,
        },

        contatos: this.empresaAlteracao.alteracao.contatos,

        endereco: this.empresaAlteracao.alteracao.endereco,
      },
      loading: false,
    }
  },
  computed: {  },
  mounted() {
    this.fetchSocioAdmministrador()
    this.fetchContatos()
  },
  methods: {
    addSocio() {
      this.clienteSearchModalOpened = true
    },
    onClienteSelected(cliente) {
      this.clienteSearchModalOpened = false

      const clientesIds = this.form.socios.map(socio => socio.id)

      if (clientesIds.includes(cliente.id)) {
        this.$snack.warning('O cliente já foi adicionado como sócio!')
        return
      }

      this.form.socios.push({ ...cliente })

      if (this.form.socios.length == 1) {
        this.form.socio_administrador = cliente.id
      }
    },
    fetchContatos() {
      const emails = this.form.contatos.filter(contato => contato.tipo == 'email')
      const celulares = this.form.contatos.filter(contato => contato.tipo == 'celular')

      if (emails.length) {
        this.contatosEmail = emails
      }

      if (celulares.length) {
        this.contatosCelular = celulares
      }
    },
    addEmail() {
      this.contatosEmail.push({ tipo: 'email', value: '', optin: true, })
    },
    addCelular() {
      this.contatosCelular.push({ tipo: 'celular', value: '', optin: true, options: { is_whatsapp: true } })
    },
    fetchSocioAdmministrador() {
      if (this.empresaAlteracao.alteracao.socio_administrador) {
        this.form.socio_administrador = this.empresaAlteracao.alteracao.socio_administrador
        return
      }

      const socio_administrador = this.empresaAlteracao.alteracao.socios.filter(socio => socio.pivot ? socio.pivot.socio_administrador : '')
      this.form.socio_administrador = socio_administrador.length ? socio_administrador[0].id : null
    },
    fetchCep(cep) {
      if(cep.length != 8) return
      viaCepRequest(cep)
        .then(res => {
          if(res.data.erro) return
          this.form.endereco.logradouro = res.data.logradouro
          this.form.endereco.cidade = res.data.localidade
          this.form.endereco.bairro = res.data.bairro
          this.form.endereco.ibge = res.data.ibge
          this.form.endereco.uf = res.data.uf
        })
    },
    submitForm() {
      this.loading = true

      const data = {
        alteracao: {
          ...this.form,
          contatos: [ ...this.contatosEmail, ...this.contatosCelular ]
        },
      }

      EmpresaAlteracaoUpdate(this.empresaAlteracao.id, data)
        .then(() => {
          this.$snack.success('Alteração salva com sucesso!')
          this.$emit('edited')
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
    finalizarAlteracao() {
      this.$buefy.dialog.confirm({
        title: 'Finalizar Alteração',
        message: 'Tem certeza que deseja finalizar a alteração?',
        confirmText: 'Finalizar',
        type: 'is-success',
        hasIcon: true,
        onConfirm: () => {
          this.loading = true

          FinalizarEmpresaAlteracao(this.empresaAlteracao.id)
            .then(() => {
              this.$snack.success('Alteração finalizado com sucesso!')
              this.$emit('edited')
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
        }
      })
    },
  },
}
</script>
