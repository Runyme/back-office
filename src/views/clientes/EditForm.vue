<template>
  <div class="bg-neutral-200 flex flex-col p-4">
    <Lynx-Title text="Editar Cliente"/>

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
            :validator="$v.form.cpf"
            :validations-message="validationsMessage.form.cpf"
          />

          <Lynx-Input
            placeholder="Insira o CPF"
            :error="$v.form.cpf.$error"
            v-model="$v.form.cpf.$model"
            mask="###.###.###-##"
            @input="getDocument"
            @paste="getDocument"
          />
        </label>

        <label class="block w-3/5 px-2">
          <Lynx-Label
            label="Nome Completo"
            :validator="$v.form.nome_completo"
            :validations-message="validationsMessage.form.nome_completo"
          />

          <Lynx-Input
            placeholder="Insira o Nome Completo"
            :error="$v.form.nome_completo.$error"
            v-model="$v.form.nome_completo.$model"
          />
        </label>

        <label class="block w-2/5 px-2">
          <Lynx-Label
            label="Data de Nascimento"
            :validator="$v.form.data_nascimento"
            :validations-message="validationsMessage.form.data_nascimento"
          />

          <b-datepicker
            placeholder="Selecione a data"
            icon="calendar-today"
            trap-focus
            v-model="$v.form.data_nascimento.$model"
            :month-names="nomesMeses"
            :day-names="nomesDias"
          >
          </b-datepicker>
        </label>

        <label class="block w-1/5 px-2">
          <Lynx-Label
            label="Sexo"
            :validator="$v.form.sexo"
            :validations-message="validationsMessage.form.sexo"
          />

          <b-select
            placeholder="Escolha o Sexo"
            v-model="$v.form.sexo.$model"
          >
            <option value="F">Feminino</option>
            <option value="M">Masculino</option>
          </b-select>
        </label>

        <label class="block w-2/5 px-2">
          <Lynx-Label
            label="Estado Civil"
            :validator="$v.form.estado_civil_id"
            :validations-message="validationsMessage.form.estado_civil_id"
          />

          <b-select
            placeholder="Escolha a Estado Civil"
            v-model="$v.form.estado_civil_id.$model"
          >
            <option v-for="(estadoCivil, index) in this.estadosCivis" :key="index" :value="estadoCivil.id">
              {{ estadoCivil.nome }}
            </option>
          </b-select>
        </label>

        <label class="block w-1/4 px-2">
          <Lynx-Label
            label="RG"
            :validator="$v.form.rg"
            :validations-message="validationsMessage.form.rg"
          />

          <Lynx-Input
            placeholder="Insira o RG"
            :error="$v.form.rg.$error"
            v-model="$v.form.rg.$model"
          />
        </label>

        <label class="block w-1/4 px-2">
          <Lynx-Label
            label="PIS"
            :validator="$v.form.pis"
            :validations-message="validationsMessage.form.pis"
          />

          <Lynx-Input
            placeholder="Insira o PIS"
            :error="$v.form.pis.$error"
            v-model="$v.form.pis.$model"
          />
        </label>

        <label class="block w-1/4 px-2">
          <Lynx-Label
            label="Nacionalidade"
            :validator="$v.form.nacionalidade"
            :validations-message="validationsMessage.form.nacionalidade"
          />

          <Lynx-Input
            placeholder="Insira a Nacionalidade"
            :error="$v.form.nacionalidade.$error"
            v-model="$v.form.nacionalidade.$model"
          />
        </label>

        <label class="block w-1/4 px-2">
          <Lynx-Label
            label="Naturalidade"
            :validator="$v.form.naturalidade"
            :validations-message="validationsMessage.form.naturalidade"
          />

          <Lynx-Input
            placeholder="Insira a Naturalidade"
            :error="$v.form.naturalidade.$error"
            v-model="$v.form.naturalidade.$model"
          />
        </label>

        <label class="block w-1/4 px-2">
          <Lynx-Label
            label="Instituição de Ensino"
            :validator="$v.form.ies_id"
            :validations-message="validationsMessage.form.ies_id"
          />

          <b-select
            placeholder="Escolha a Instituição de Ensino"
            v-model="$v.form.ies_id.$model"
          >
            <option v-for="(ies, index) in this.ies" :key="index" :value="ies.id">
              {{ ies.nome }} - {{ ies.estado }}
            </option>
          </b-select>
        </label>

        <label class="block w-1/4 px-2">
          <Lynx-Label
            label="Qualificação"
            :validator="$v.form.qualificacao_id"
            :validations-message="validationsMessage.form.qualificacao_id"
          />

          <b-select
            placeholder="Escolha a Qualificação"
            v-model="$v.form.qualificacao_id.$model"
          >
            <option v-for="(qualificacao, index) in this.qualificacoes" :key="index" :value="qualificacao.id">
              {{ qualificacao.nome }}
            </option>
          </b-select>
        </label>

        <label class="block w-1/4 px-2">
          <Lynx-Label
            label="Profissão"
            :validator="$v.form.profissao_id"
            :validations-message="validationsMessage.form.profissao_id"
          />

          <b-select
            placeholder="Escolha a Profissão"
            v-model="$v.form.profissao_id.$model"
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
            v-model="form.especialidade_id"
          >
            <option v-for="(especialidade, index) in this.especialidades" :key="index" :value="especialidade.id">
              {{ especialidade.nome }}
            </option>
          </b-select>
        </label>
      </div>

      <div class="flex items-start flex-wrap">
        <div class="mb-8 bg-neutral-100 p-4 rounded mr-8">
          <Contatos contactable-type="cliente" :contactable-id="clienteId"/>
        </div>

        <div class="mb-8 bg-neutral-100 p-4 rounded">
          <Endereco addressable-type="cliente" :addressable-id="clienteId"  />
        </div>
      </div>

      <div class="mb-8 bg-neutral-100 p-4 rounded flex justify-end">
        <Lynx-Button
          type="submit"
          text="Salvar Cliente"
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

import {clientesUpdateRequest, clientesShowRequest} from '@/services/requests/clientes'
import {
  iesRequest,
  especialidadesRequest,
  estadosCivisRequest,
  profissoesRequest,
  qualificacoesRequest
} from '@/services/requests/clientePerfil'
import {cpfRequest} from '@/services/requests/cpfCnpj'
import {required} from 'vuelidate/lib/validators'
import formMixin from '@/mixins/form'
import Endereco from '@/components/shared/Endereco'
import Contatos from '@/components/shared/Contatos'

export default {
  name: 'ClientesEditForm',
  mixins: [formMixin],
  components: {Endereco, Contatos},
  props: ['clienteId'],
  data() {
    return {
      loading: false,
      nomesMeses: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      nomesDias: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
      ies: [],
      especialidades: [],
      estadosCivis: [],
      profissoes: [],
      qualificacoes: [],
      form: {
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
      validationsMessage: {
        form: {
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
      }
    }
  },
  validations() {
    return {
      form: {
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
      }
    }
  },
  mounted() {
    this.fetchClientePerfil()
    this.populateClienteForm()
  },
  methods: {
    getDocument(cpf) {
      if (cpf.length == 11) {
        cpfRequest(cpf)
          .then(res => {
            this.form.nome_completo = res.data.nome
            this.form.data_nascimento = moment(res.data.nascimento).toDate()
            this.form.sexo = res.data.genero
          })
      }
    },
    fetchClientePerfil() {
      iesRequest().then(res => this.ies = res.data)
      especialidadesRequest().then(res => this.especialidades = res.data)
      estadosCivisRequest().then(res => this.estadosCivis = res.data)
      profissoesRequest().then(res => this.profissoes = res.data)
      qualificacoesRequest().then(res => this.qualificacoes = res.data)
    },
    async submitForm() {
      this.$v.form.$touch()

      if (this.$v.form.$invalid) {
        this.$snack.error('Corrija os campos inválidos!')
        return
      }

      this.loading = true

      const cliente = {...this.form}
      cliente.data_nascimento = moment(cliente.data_nascimento).format('YYYY-MM-DD')

      clientesUpdateRequest(this.clienteId, cliente)
        .then((res) => {
          this.$snack.success('Cliente atualizado com sucesso!')
          this.$emit('updated', res.data.data)
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
    populateClienteForm() {
      this.loading = true
      clientesShowRequest(this.clienteId)
        .then((res) => {
          const cliente = res.data.data

          this.form.nome_completo = cliente.nome_completo
          this.form.cpf = cliente.cpf
          this.form.rg = cliente.rg
          this.form.pis = cliente.pis
          this.form.data_nascimento = moment(cliente.data_nascimento).toDate()
          this.form.sexo = cliente.sexo
          this.form.nacionalidade = cliente.nacionalidade
          this.form.naturalidade = cliente.naturalidade
          this.form.ies_id = cliente.course[0] ? cliente.course[0].ies_id : null
          this.form.estado_civil_id = cliente.estado_civil ? cliente.estado_civil.id: null
          this.form.profissao_id = cliente.profissao ? cliente.profissao.id : null
          this.form.qualificacao_id = cliente.qualificacao ? cliente.qualificacao.id : null
          this.form.especialidade_id = cliente.especialidade ? cliente.especialidade.id : null
        })
        .finally(() => (this.loading = false))
    },
  },
}
</script>
