<template>
  <div class="bg-neutral-200 flex flex-col">
    <Lynx-Title text="Cadastrar novo Cliente"/>

    <b-loading is-full-page :active.sync="loading" />

    <form class="flex flex-col" @submit.prevent="submitForm">
      <!-- DADOS CLEINTE -->
      <div class="mb-8 flex flex-wrap bg-neutral-100 p-4 rounded">
        <span class="text-lg font-display border-b border-neutral-400 w-full pb-2 flex mb-4">
          Dados do Cliente
        </span>

        <label class="block w-2/5 px-2">
          <Lynx-Label
            label="CPF"
            :validator="$v.form.cliente.cpf"
            :validations-message="validationsMessage.form.cliente.cpf"
          />

          <Lynx-Input
            placeholder="Insira o CPF"
            :error="$v.form.cliente.cpf.$error"
            v-model="$v.form.cliente.cpf.$model"
            mask="###.###.###-##"
            @input="getDocument"
            @paste="getDocument"
          />
        </label>

        <label class="block w-3/5 px-2">
          <Lynx-Label
            label="Nome Completo"
            :validator="$v.form.cliente.nome_completo"
            :validations-message="validationsMessage.form.cliente.nome_completo"
          />

          <Lynx-Input
            placeholder="Insira o Nome Completo"
            :error="$v.form.cliente.nome_completo.$error"
            v-model="$v.form.cliente.nome_completo.$model"
          />
        </label>

        <label class="block w-2/5 px-2">
          <Lynx-Label
            label="Data de Nascimento"
            :validator="$v.form.cliente.data_nascimento"
            :validations-message="validationsMessage.form.cliente.data_nascimento"
          />

          <b-datepicker
            placeholder="Selecione a data"
            icon="calendar-today"
            trap-focus
            v-model="$v.form.cliente.data_nascimento.$model"
            :month-names="nomesMeses"
            :day-names="nomesDias"
          >
          </b-datepicker>
        </label>

        <label class="block w-1/5 px-2">
          <Lynx-Label
            label="Sexo"
            :validator="$v.form.cliente.sexo"
            :validations-message="validationsMessage.form.cliente.sexo"
          />

          <b-select
            placeholder="Escolha o Sexo"
            v-model="$v.form.cliente.sexo.$model"
          >
            <option value="F">Feminino</option>
            <option value="M">Masculino</option>
          </b-select>
        </label>

        <label class="block w-2/5 px-2">
          <Lynx-Label
            label="Estado Civil"
            :validator="$v.form.cliente.estado_civil_id"
            :validations-message="validationsMessage.form.cliente.estado_civil_id"
          />

          <b-select
            placeholder="Escolha a Estado Civil"
            v-model="$v.form.cliente.estado_civil_id.$model"
          >
            <option v-for="(estadoCivil, index) in this.estadosCivis" :key="index" :value="estadoCivil.id">
              {{ estadoCivil.nome }}
            </option>
          </b-select>
        </label>

        <label class="block w-1/4 px-2">
          <Lynx-Label
            label="RG"
            :validator="$v.form.cliente.rg"
            :validations-message="validationsMessage.form.cliente.rg"
          />

          <Lynx-Input
            placeholder="Insira o RG"
            :error="$v.form.cliente.rg.$error"
            v-model="$v.form.cliente.rg.$model"
          />
        </label>

        <label class="block w-1/4 px-2">
          <Lynx-Label
            label="PIS"
            :validator="$v.form.cliente.pis"
            :validations-message="validationsMessage.form.cliente.pis"
          />

          <Lynx-Input
            placeholder="Insira o PIS"
            :error="$v.form.cliente.pis.$error"
            v-model="$v.form.cliente.pis.$model"
          />
        </label>

        <label class="block w-1/4 px-2">
          <Lynx-Label
            label="Nacionalidade"
            :validator="$v.form.cliente.nacionalidade"
            :validations-message="validationsMessage.form.cliente.nacionalidade"
          />

          <Lynx-Input
            placeholder="Insira a Nacionalidade"
            :error="$v.form.cliente.nacionalidade.$error"
            v-model="$v.form.cliente.nacionalidade.$model"
          />
        </label>

        <label class="block w-1/4 px-2">
          <Lynx-Label
            label="Naturalidade"
            :validator="$v.form.cliente.naturalidade"
            :validations-message="validationsMessage.form.cliente.naturalidade"
          />

          <Lynx-Input
            placeholder="Insira a Naturalidade"
            :error="$v.form.cliente.naturalidade.$error"
            v-model="$v.form.cliente.naturalidade.$model"
          />
        </label>

        <label class="block w-1/4 px-2">
          <Lynx-Label
            label="Instituição de Ensino"
            :validator="$v.form.cliente.ies_id"
            :validations-message="validationsMessage.form.cliente.ies_id"
          />

          <b-select
            placeholder="Escolha a Instituição de Ensino"
            v-model="$v.form.cliente.ies_id.$model"
          >
            <option v-for="(ies, index) in this.ies" :key="index" :value="ies.id">
              {{ ies.nome }} - {{ ies.estado }}
            </option>
          </b-select>
        </label>

        <label class="block w-1/4 px-2">
          <Lynx-Label
            label="Qualificação"
            :validator="$v.form.cliente.qualificacao_id"
            :validations-message="validationsMessage.form.cliente.qualificacao_id"
          />

          <b-select
            placeholder="Escolha a Qualificação"
            v-model="$v.form.cliente.qualificacao_id.$model"
          >
            <option v-for="(qualificacao, index) in this.qualificacoes" :key="index" :value="qualificacao.id">
              {{ qualificacao.nome }}
            </option>
          </b-select>
        </label>

        <label class="block w-1/4 px-2">
          <Lynx-Label
            label="Profissão"
            :validator="$v.form.cliente.profissao_id"
            :validations-message="validationsMessage.form.cliente.profissao_id"
          />

          <b-select
            placeholder="Escolha a Profissão"
            v-model="$v.form.cliente.profissao_id.$model"
          >
            <option v-for="(profissao, index) in this.profissoes" :key="index" :value="profissao.id">
              {{ profissao.nome }}
            </option>
          </b-select>
        </label>

        <label class="block w-1/4 px-2">
          <Lynx-Label
            label="Especialidade"
          />

          <b-select
            placeholder="Escolha a Especialidade"
            v-model="form.cliente.especialidade_id"
          >
            <option v-for="(especialidade, index) in this.especialidades" :key="index" :value="especialidade.id">
              {{ especialidade.nome }}
            </option>
          </b-select>
        </label>

        <Input-File class="mx-2" text="Arquivo RG" ref="arquivoRgInput"/>

        <Input-File class="mx-2" text="Arquivo CPF" ref="arquivoCpfInput"/>

        <Input-File class="mx-2" text="Arquivo RG/CPF ou CNH" ref="arquivoCnhInput"/>

        <Input-File
          v-if="this.form.cliente.estado_civil_id === 1"
          class="mx-2"
          text="Arquivo Certidão de Casamento"
          ref="arquivoCertidaoDeCasamentoInput"
        />
      </div>

      <!-- CONTATOS -->
      <div class="mb-8 flex flex-wrap bg-neutral-100 p-4 rounded">
        <span class="w-full text-lg font-display border-b border-neutral-400 w-full pb-2 flex mb-4">
          Contatos do Cliente
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

            <b-checkbox class="flex-shrink-0 ml-2" v-model="celular.options.is_whatsapp">
              Whatsapp
            </b-checkbox>
          </div>
        </div>
      </div>

      <!-- ENDEREÇO -->
      <div class="mb-8 bg-neutral-100 p-4 rounded">
        <span class="text-lg font-display border-b border-neutral-400 w-full pb-2 flex mb-4">
          Endereço do Cliente
        </span>

        <div class="flex">
          <label class="flex flex-col w-1/3 pr-4 pb-6">
            <Lynx-Label
              label="CEP"
              :validator="$v.form.endereco.cep"
              :validations-message="validationsMessage.form.endereco.cep"
            />
            <Lynx-Input
              placeholder="Insira o CEP"
              :error="$v.form.endereco.cep.$error"
              v-model.trim="$v.form.endereco.cep.$model"
              mask="#####-###"
              @input="fetchCep"
            />
          </label>
        </div>

        <div class="w-full flex">
          <label class="flex flex-col w-1/2 pb-6 pr-2">
            <Lynx-Label
              label="Logradouro"
              :validator="$v.form.endereco.logradouro"
              :validations-message="validationsMessage.form.endereco.logradouro"
            />
            <Lynx-Input
              placeholder="Insira o Logradouro"
              :error="$v.form.endereco.logradouro.$error"
              v-model.trim="$v.form.endereco.logradouro.$model"
            />
          </label>

          <label class="flex flex-col w-1/4 px-2 pb-6">
            <Lynx-Label
              label="Numero"
              :validator="$v.form.endereco.numero"
              :validations-message="validationsMessage.form.endereco.numero"
            />
            <Lynx-Input
              placeholder="Insira o Número"
              :error="$v.form.endereco.numero.$error"
              v-model.trim="$v.form.endereco.numero.$model"
            />
          </label>

          <label class="flex flex-col w-1/4 pl-2 pb-6">
            <Lynx-Label label="Complemento"/>
            <Lynx-Input
              placeholder="Insira o Complemento"
              v-model="form.endereco.complemento"
            />
          </label>
        </div>

        <div class="w-full flex">
          <label class="flex flex-col w-1/5 pb-6 pr-2">
            <Lynx-Label
              label="Estado"
              :validator="$v.form.endereco.uf"
              :validations-message="validationsMessage.form.endereco.uf"
            />
            <Lynx-Input
              placeholder="Insira o Estado"
              :error="$v.form.endereco.uf.$error"
              v-model.trim="$v.form.endereco.uf.$model"
            />
          </label>

          <label class="flex flex-col w-2/5 px-2 pb-6">
            <Lynx-Label
              label="Cidade"
              :validator="$v.form.endereco.cidade"
              :validations-message="validationsMessage.form.endereco.cidade"
            />
            <Lynx-Input
              placeholder="Insira a Cidade"
              :error="$v.form.endereco.cidade.$error"
              v-model.trim="$v.form.endereco.cidade.$model"
            />
          </label>

          <label class="flex flex-col w-2/5 px-2 pb-6">
            <Lynx-Label
              label="Bairro"
              :validator="$v.form.endereco.bairro"
              :validations-message="validationsMessage.form.endereco.bairro"
            />
            <Lynx-Input
              placeholder="Insira o bairro"
              :error="$v.form.endereco.bairro.$error"
              v-model.trim="$v.form.endereco.bairro.$model"
            />
          </label>
        </div>

        <Input-File text="Comprovante de Residência" ref="comprovanteDeResidenciaInput"/>
      </div>

      <!-- ENDEREÇO -->
      <div class="mb-8 bg-neutral-100 p-4 rounded">
        <span class="text-lg font-display border-b border-neutral-400 w-full pb-2 flex mb-4">
          Plano
        </span>

        <div v-if="loadingPlansError !== null">
          <b-notification
            :message="'Erro no carregamento dos planos: '+loadingPlansError"
            class="opacity-50"
            type="is-danger"
          />
        </div>

        <div
          v-for="(plano, index) in planos.filter(({type}) => type === 'pf')"
          :key="index"
          class="flex justify-between items-center rounded p-2 transition hover:bg-neutral-300"
          :class="{ 'opacity-75': !plano.selected }"
        >
          <label class="w-full flex items-center">
            <b-radio class="flex-shrink-0" name="plano" v-model="form.plan_id" :native-value="plano.id"></b-radio>
            <span class="w-full">{{ plano.name }}</span>
          </label>

          <span class="w-32 flex-shrink-0 px-4 flex items-center justify-between">
            <span>R$</span>
            <span>{{ plano.price.replace('.', ',') }}</span>
          </span>
        </div>

      </div>

      <div class="mb-8 bg-neutral-100 p-4 rounded flex justify-end">
        <Lynx-Button
          type="submit"
          text="Criar Cliente"
          class="self-end"
          :loading="loading"
          :disable="loading"
        />
      </div>
    </form>
  </div>
</template>

<script>

import moment from 'moment'

import {clientesCreateRequest} from '@/services/requests/clientes'
import {
  iesRequest,
  especialidadesRequest,
  estadosCivisRequest,
  profissoesRequest,
  qualificacoesRequest
} from '@/services/requests/clientePerfil'
import {contatosCreateRequest} from '@/services/requests/contatos'
import {enderecosCreateRequest} from '@/services/requests/enderecos'
import {viaCepRequest} from '@/services/requests/viaCep'
import {cpfRequest} from '@/services/requests/cpfCnpj'
import {required, numeric, minLength, maxLength} from 'vuelidate/lib/validators'
import formMixin from '@/mixins/form'
import InputFile from '@/components/helpers/InputFile'
import {planosRequest} from "@/services/requests/planos";

export default {
  name: 'ClientesCreateForm',
  components: {InputFile},
  mixins: [formMixin],
  data() {
    return {
      loading: false,
      planos: [],
      loadingPlansError: null,
      nomesMeses: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      nomesDias: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
      contatosEmail: [
        {tipo: 'email', value: '', optin: true,},
      ],
      contatosCelular: [
        {tipo: 'celular', value: '', optin: true, options: {is_whatsapp: true}},
      ],
      ies: [],
      especialidades: [],
      estadosCivis: [],
      profissoes: [],
      qualificacoes: [],
      form: {
        cliente: {
          nome_completo: null,
          cpf: null,
          rg: null,
          pis: null,
          data_nascimento: null,
          sexo: null,
          nacionalidade: null,
          naturalidade: null,
          ies_id: null,
          especialidade_id: null,
          estado_civil_id: null,
          profissao_id: null,
          qualificacao_id: null,
        },
        endereco: {
          cep: null,
          logradouro: null,
          numero: null,
          complemento: null,
          bairro: null,
          cidade: null,
          uf: null,
          ibge: null,
        },
        plan_id: null,
      },
      validationsMessage: {
        form: {
          cliente: {
            nome_completo: {required: 'O campo nome completo é obrigatório'},
            cpf: {required: 'O campo CPF é obrigatório'},
            rg: {required: 'O campo RG é obrigatório'},
            pis: {required: 'O campo PIS é obrigatório'},
            data_nascimento: {required: 'O campo data de nascimento é obrigatório'},
            sexo: {required: 'O campo sexo é obrigatório'},
            nacionalidade: {required: 'O campo nacionalidade é obrigatório'},
            naturalidade: {required: 'O campo naturalidade é obrigatório'},
            ies_id: {required: 'O campo instituição de ensino é obrigatório'},
            estado_civil_id: {required: 'O campo estaod civil é obrigatório'},
            profissao_id: {required: 'O campo profissão é obrigatório'},
            qualificacao_id: {required: 'O campo qualificação é obrigatório'},
          },
          endereco: {
            cep: {
              required: 'O campo CEP é obrigatório',
              numeric: 'O campo CEP deve ser numérico',
              minLength: 'O campo é CEP deve conter 8 caracteres',
              maxLength: 'O campo é CEP deve conter 8 caracteres',
            },
            logradouro: {required: 'O campo logradouro é obrigatório'},
            numero: {required: 'O campo número é obrigatório'},
            bairro: {required: 'O campo bairro é obrigatório'},
            cidade: {required: 'O campo cidade é obrigatório'},
            uf: {
              required: 'O campo estado é obrigatório',
              minLength: 'O campo estado deve conter 2 caracteres',
              maxLength: 'O campo estado deve conter 2 caracteres',
            },
          }
        },
      }
    }
  },
  validations() {
    return {
      form: {
        cliente: {
          nome_completo: {required},
          cpf: {required},
          rg: {required},
          pis: {required},
          data_nascimento: {required},
          sexo: {required},
          nacionalidade: {required},
          naturalidade: {required},
          ies_id: {required},
          estado_civil_id: {required},
          profissao_id: {required},
          qualificacao_id: {required},
        },
        endereco: {
          cep: {
            required,
            numeric,
            minLength: minLength(8),
            maxLength: maxLength(8)
          },
          logradouro: {required},
          numero: {required},
          bairro: {required},
          cidade: {required},
          uf: {
            required,
            minLength: minLength(2),
            maxLength: maxLength(2)
          },
        }
      }
    }
  },
  mounted() {
    this.fetchClientePerfil()
    this.fetchPlanos()
  },
  methods: {
    fetchPlanos() {
      planosRequest()
        .then(res => this.planos = res.data.data)
        .catch(err => this.loadingPlansError = err.response.data.message)
    },
    getDocument(cpf) {
      if (cpf.length == 11) {
        cpfRequest(cpf)
          .then(res => {
            this.form.cliente.nome_completo = res.data.nome
            this.form.cliente.data_nascimento = moment(res.data.nascimento).toDate()
            this.form.cliente.sexo = res.data.genero
          })
      }
    },
    addEmail() {
      this.contatosEmail.push({tipo: 'email', value: '', optin: true,})
    },
    addCelular() {
      this.contatosCelular.push({tipo: 'celular', value: '', optin: true, options: {is_whatsapp: true}})
    },
    fetchClientePerfil() {
      iesRequest().then(res =>
          (this.ies = res.data.sort((a, b) => {
              if (a.nome_completo < b.nome_completo) return -1;
              if (a.nome_completo > b.nome_completo) return 1;
              return 0;
            })))
      
      especialidadesRequest().then(res => this.especialidades = res.data)
      estadosCivisRequest().then(res => this.estadosCivis = res.data)
      profissoesRequest().then(res => this.profissoes = res.data)
      qualificacoesRequest().then(res => this.qualificacoes = res.data)
    },
    fetchCep(cep) {
      if (cep.length != 8) return
      viaCepRequest(cep)
        .then(res => {
          if (res.data.erro) return
          this.form.endereco.logradouro = res.data.logradouro
          this.form.endereco.cidade = res.data.localidade
          this.form.endereco.bairro = res.data.bairro
          this.form.endereco.ibge = res.data.ibge
          this.form.endereco.uf = res.data.uf
        })
    },
    async submitForm() {
      this.$v.form.$touch()

      if (this.$v.form.$invalid) {
        this.$snack.error('Corrija os campos inválidos!')
        return
      }

      const invalidContatosEmail = this.contatosEmail.filter(email => email.value == '').length
      if (invalidContatosEmail) {
        this.$snack.error('Adicione pelo menos um email')
        return
      }

      const invalidContatosEmailOptin = this.contatosEmail.filter(email => email.optin == false).length
      if (invalidContatosEmailOptin) {
        this.$snack.error('Adicione pelo menos um email que seja notificável')
        return
      }

      const invalidContatosCelular = this.contatosCelular.filter(celular => celular.value == '').length
      if (invalidContatosCelular) {
        this.$snack.error('Adicione pelo menos um celular')
        return
      }

      this.loading = true

      /* Comprovante de Residência Request */
      const comprovanteDeResidenciaId = await this.$refs.comprovanteDeResidenciaInput.submit()

      /* Arquivo RG Request */
      const arquivoRgId = await this.$refs.arquivoRgInput.submit()

      /* Arquivo CPF Request */
      const arquivoCpfId = await this.$refs.arquivoCpfInput.submit()

      /* Arquivo CNH Request */
      const arquivoCnhId = await this.$refs.arquivoCnhInput.submit()

      /* Arquivo Certidão de Casamento Request */
      const arquivoCertidaoDeCasamentoId = this.$refs.arquivoCertidaoDeCasamentoInput ? await this.$refs.arquivoCertidaoDeCasamentoInput.submit() : null

      /* Contatos Request */
      const contatosForm = [...this.contatosEmail, ...this.contatosCelular]
      let contatos = await Promise.all(contatosForm.map(async contato => {
        return contatosCreateRequest(contato)
      }))
      contatos = contatos.map(contato => contato.data.id)

      /* Endereços Request */
      const endereco = await enderecosCreateRequest(this.form.endereco)
      const enderecoId = endereco.data.id

      const cliente = {...this.form.cliente}
      cliente.data_nascimento = moment(cliente.data_nascimento).format('YYYY-MM-DD')

      const data = {
        plan_id: this.form.plan_id,
        cliente: cliente,
        contatos: contatos,
        endereco_id: enderecoId,
        arquivos: {
          comprovante_de_residencia_id: comprovanteDeResidenciaId,
          rg_id: arquivoRgId,
          cpf_id: arquivoCpfId,
          rg_cpf_id: arquivoCnhId,
          certidao_de_casamento_id: arquivoCertidaoDeCasamentoId,
        }
      }

      clientesCreateRequest(data)
        .then(res => {
          this.$snack.success('Cliente cadastrado com sucesso!')
          this.$emit('created', res.data)
        })
        .catch(error => {
          const errors = Object.values(error.response.data.errors)
          const message = errors.map(item => item.map(error => `<li>${error}</li>`).join('')).join('')

          this.$buefy.dialog.alert({
            title: 'Não foi possível cadastrar o cliente',
            message: `<ul>${message}</ul>`,
            type: 'is-danger',
            ariaRole: 'alertdialog',
            ariaModal: true
          })
        })
        .finally(() => this.loading = false)
    },
  },
}
</script>
