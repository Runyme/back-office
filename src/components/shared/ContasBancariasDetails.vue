<template>
  <div class="shadow bg-neutral-300 p-8">
    <div class="w-full flex justify-between items-start">
      <Lynx-Title text="Contas Bancarias"/>
      <Lynx-Button text="Adicionar" icon="Plus" @click.native="addContaBancaria"/>
    </div>
    <div class="grid grid-cols-2 gap-8 items-start">
      <transition name="fade">
        <Card 
          color="primary-500" 
          :header="{ title:'Adicionar', icon: 'Plus', textColor: 'white' }"
          v-if="creating"
        >
          <form class="px-4 w-full py-2" @submit.prevent="createContaBancaria">
            <div class="flex items-center py-2">
              <Icon-Id class="text-primary-700"/>
              <p class="pl-2 flex items-center">
                <span class="pr-4 text-primary-700">CPF/CNPJ:</span>
                <Lynx-Input 
                  class="flex-grow" 
                  v-model="$v.form.cpf_cnpj.$model" 
                  :error="$v.form.cpf_cnpj.$error"
                  :mask="['###.###.###-##', '##.###.###/####-##']"
                />
              </p>
            </div>
            <div class="flex items-center py-2">
              <Icon-Bank class="text-primary-700"/>
              <p class="pl-2 flex items-center">
                <span class="pr-4 text-primary-700">Banco:</span>
                <b-autocomplete
                  :data="bancos"
                  placeholder="Digite o código ou nome do banco"
                  field="id_nome"
                  @typing="fetchBancos"
                  @select="onSelectBanco"
                  v-model="form.id_nome"
                  :loading="bancosLoading"
                  :open-on-focus="true"
                >
                  <template slot="empty">{{searchMessage}}</template>
                </b-autocomplete>
              </p>
            </div>
            <div class="flex items-center py-2">
              <Icon-MoneyBag class="text-primary-700"/>
              <div class="pl-2 flex items-center">
                <span class="pr-4 text-primary-700">Conta:</span>
                <div class="flex">
                  <Lynx-Input class="flex-grow" mask="##########" :error="$v.form.conta.$error" v-model="$v.form.conta.$model"/>
                  <span class="px-2"> - </span>
                  <Lynx-Input v-model="$v.form.dv_conta.$model" mask="##" :error="$v.form.dv_conta.$error"/>
                </div>
              </div>
            </div>
            <div class="flex items-center py-2">
              <Icon-BankAgency class="text-primary-700"/>
              <div class="pl-2 flex items-center">
                <span class="pr-4 text-primary-700">Agência:</span>
                <div class="flex">
                  <Lynx-Input class="flex-grow" v-model="$v.form.agencia.$model" :error="$v.form.agencia.$error" mask="##########"/>
                  <span class="px-2"> - </span>
                  <Lynx-Input v-model="$v.form.dv_agencia.$model" :error="$v.form.dv_agencia.$error" mask="##"/>
                </div>
              </div>
            </div>
            <div class="flex items-center py-2">
              <Icon-CreditCard class="text-primary-700"/>
              <div class="pl-2 flex items-center">
                <span class="pr-4 text-primary-700">Tipo de Conta:</span>
                <div class="flex">
                  <select 
                    class="px-2 border-l-4 border-solid border-primary-200 bg-white border-r-transparent rounded py-1 w-full transition focus:border-r-4 font-light shadow focus:outline-none" 
                    v-model="form.tipo"
                  >
                    <option value="p">Poupança</option>
                    <option value="c">Corrente</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="flex items-center py-2">
              <Icon-Key class="text-primary-700"/>
              <div class="pl-2 flex items-center">
                <span class="pr-4 text-primary-700">Conta Principal:</span>
                <div class="flex">
                  <b-checkbox v-model="form.principal" true-value="1"/>
                </div>
              </div>
            </div>
            <div class="flex items-center w-full justify-between my-2">
              <Lynx-Button 
                text="Cancelar" 
                size="small" 
                outlined="true"
                type="button"
                color="error-base"
                @click.native="cancelAddContaBancria"
              />
              <Lynx-Button 
                text="Salvar" 
                size="small"
                type="submit"
              />
            </div>
          </form>
        </Card>
      </transition>
      <Card 
        color="primary-500" 
        :background="contaBancaria.principal ? 'primary-500' : 'white'"
        v-for="(contaBancaria, index) in contasBancarias"
        :key="index"
      >
        <form class="px-4 w-full py-2" @submit.prevent="updateContaBancaria(index)">
          <div class="flex items-center py-2">
            <Icon-Id :class="contaBancaria.principal ? 'text-white' : 'text-primary-700'"/>
            <p class="pl-2 flex items-center">
              <span class="pr-4" :class="contaBancaria.principal ? 'text-white' : 'text-primary-700'">CPF/CNPJ:</span>
              <transition name="fade" mode="out-in">
                <span 
                  class="font-light" 
                  :class="contaBancaria.principal ? 'text-white' : 'text-primary-700'" 
                  v-if="!isEditting(index)" 
                  v-text="contaBancaria.cpf_cnpj"
                />
                <Lynx-Input 
                  class="flex-grow" 
                  v-model="$v.form.cpf_cnpj.$model" 
                  :error="$v.form.cpf_cnpj.$error"
                  :mask="['###.###.###-##', '##.###.###/####-##']"
                  v-else
                />
              </transition>
            </p>
          </div>
          <div class="flex items-center py-2">
            <Icon-Bank :class="contaBancaria.principal ? 'text-white' : 'text-primary-700'"/>
            <p class="pl-2 flex items-center">
              <span class="pr-4" :class="contaBancaria.principal ? 'text-white' : 'text-primary-700'">Banco:</span>
              <transition name="fade" mode="out-in">
                <span class="font-light" :class="contaBancaria.principal ? 'text-white' : 'text-primary-700'" v-if="!isEditting(index)">
                  {{lynxPadStart(contaBancaria.banco.id)}} - {{contaBancaria.banco.nome}}
                </span>
                <b-autocomplete
                  :data="bancos"
                  placeholder="Digite o código ou nome do banco"
                  field="id_nome"
                  @typing="fetchBancos"
                  @select="onSelectBanco"
                  v-model="form.id_nome"
                  :loading="bancosLoading"
                  :open-on-focus="true"
                  v-else
                >
                  <template slot="empty">{{searchMessage}}</template>
                </b-autocomplete>
              </transition>
            </p>
          </div>
          <div class="flex items-center py-2">
            <Icon-MoneyBag :class="contaBancaria.principal ? 'text-white' : 'text-primary-700'"/>
            <p class="pl-2 flex items-center">
              <span class="pr-4" :class="contaBancaria.principal ? 'text-white' : 'text-primary-700'">Conta:</span>
              <transition name="fade" mode="out-in">
                <span class="font-light" :class="contaBancaria.principal ? 'text-white' : 'text-primary-700'" v-if="!isEditting(index)">
                  {{contaBancaria.conta}}
                  <span v-if="contaBancaria.dv_conta" v-text="` - ${contaBancaria.dv_conta}`"/>
                </span>
                <div class="flex" v-else>
                  <Lynx-Input class="flex-grow" :error="$v.form.conta.$error" mask="##########" v-model="$v.form.conta.$model"/>
                  <span class="px-2"> - </span>
                  <Lynx-Input v-model="$v.form.dv_conta.$model" :error="$v.form.dv_conta.$error" mask="##"/>
                </div>
              </transition>
            </p>
          </div>
          <div class="flex items-center py-2">
            <Icon-BankAgency :class="contaBancaria.principal ? 'text-white' : 'text-primary-700'"/>
            <p class="pl-2 flex items-center">
              <span class="pr-4" :class="contaBancaria.principal ? 'text-white' : 'text-primary-700'">Agência:</span>
              <transition name="fade" mode="out-in">
                <span class="font-light" :class="contaBancaria.principal ? 'text-white' : 'text-primary-700'" v-if="!isEditting(index)">
                  {{contaBancaria.agencia}}
                  <span v-if="contaBancaria.dv_agencia" v-text="` - ${contaBancaria.dv_agencia}`"/>
                </span>
                <div class="flex" v-else>
                  <Lynx-Input class="flex-grow" v-model="$v.form.agencia.$model" mask="##########" :error="$v.form.agencia.$error"/>
                  <span class="px-2"> - </span>
                  <Lynx-Input v-model="$v.form.dv_agencia.$model" mask="##" :error="$v.form.dv_agencia.$error"/>
                </div>
              </transition>
            </p>
          </div>
          <div class="flex items-center py-2">
            <Icon-CreditCard :class="contaBancaria.principal ? 'text-white' : 'text-primary-700'"/>
            <p class="pl-2 flex items-center">
              <span class="pr-4" :class="contaBancaria.principal ? 'text-white' : 'text-primary-700'">Tipo da conta:</span>
              <transition name="fade" mode="out-in">
                <span class="font-light" :class="contaBancaria.principal ? 'text-white' : 'text-primary-700'" v-if="!isEditting(index)" v-text="getTipoContaLabel(contaBancaria.tipo)"/>
                <div class="flex" v-else>
                  <div class="flex">
                    <select 
                      class="px-2 border-l-4 border-solid border-primary-200 bg-white border-r-transparent rounded py-1 w-full transition focus:border-r-4 font-light shadow focus:outline-none" 
                      v-model="form.tipo"
                    >
                      <option value="p">Poupança</option>
                      <option value="c">Corrente</option>
                    </select>
                  </div>
                </div>
              </transition>
            </p>
          </div>
          <div class="flex items-center w-full justify-between my-2" v-if="!isEditting(index)">
            <div class="flex">
              <Lynx-Button 
                class="mr-4" 
                text="Editar" 
                size="small" 
                outlined="true" 
                @click.native="editContaBancaria(index)"
                type="button"
                :color="contaBancaria.principal ? 'white' : 'primary-500'"
              />
              <Lynx-Button 
                text="Excluir" 
                size="small" 
                outlined="true" 
                type="button"
                :color="contaBancaria.principal ? 'white' : 'error-base'"
                @click.native="handleDeleteContaBancaria(index)"
              />
            </div>
            <Lynx-Button 
              text="Definir conta prinicpal" 
              size="small" 
              type="button" 
              v-if="!contaBancaria.principal"
              @click.native="handleSetContaPrincipal(index)"
            />
            <div class="flex text-white items-center" v-else>
              <Icon-Key />
              <span class="pl-4">Conta principal</span>
            </div>
          </div>
          <div class="flex items-center w-full justify-between my-2" v-else>
            <Lynx-Button 
              text="Cancelar" 
              size="small" 
              outlined="true" 
              :color="contaBancaria.principal ? 'white' : 'error-base'"
              type="button"
              @click.native="cancelEditContaBancaria"
            />
            <Lynx-Button 
              text="Salvar" 
              size="small"
              type="submit"
              :color="contaBancaria.principal ? 'white' : 'primary-500'"
              :text-color="contaBancaria.principal ? 'primary-500' : 'white'"
            />
          </div>
        </form>
      </Card>
    </div>
  </div>
</template>

<script>

import { contasBancariasCreateRequest, contasBancariasUpdateRequest, contasBancariasDeleteRequest } from '@/services/requests/contasBancarias'
import { bancosSearchRequest } from '@/services/requests/bancos'
import { lynxPadStart } from '@/utils/utils'
import Card from '@/components/helpers/Card'
import { required, maxLength, minLength } from 'vuelidate/lib/validators'
import formMixin from '@/mixins/form'

export default {
  name: 'ContasBancariasDetails',
  components: { Card },
  props: {
    owner: {
      type: Object,
      required: true
    },
    contasBancarias: {
      type: Array,
      required: true
    },
    addOpened: {
      type: Boolean,
      default: false,
    }
  },
  mixins: [formMixin],
  data() {
    return {
      form: {},
      editingIndex: null,
      creating: false,
      loading: false,
      bancosLoading: false,
      bancos: [],
      searchMessage: 'Nenhum resultado encontrado...',
      validationsMessage: { 
        form: {
          conta: { 
            required: 'Insira uma conta',
            minLength: 'O campo conta deve conter no minimo 3 caracteres',
            maxLength: 'O campo conta deve conter no maximo 10 caracteres'
          },
          dv_conta: { 
            maxLength: 'O digito verificador deve conter no máximo 2 caracteres'
          },
          agencia: { 
            required: 'Insira uma agência',
            minLength: 'O campo agencia deve conter no minimo 3 caracteres',
            maxLength: 'O campo agencia deve conter no maximo 10 caracteres'
          },
          dv_agencia: { 
            maxLength: 'O digito verificador deve conter no máximo 2 caracteres'
          },
          cpf_cnpj: { 
            maxLength: 'Insira um CPF/CNPJ válido',
            minLength: 'Insira um CPF/CNPJ válido'
          },
        }
      }
    }
  },
  validations: {
    form: {
      conta: { 
        required, 
        minLength: minLength(3),
        maxLength: maxLength(10)
      },
      dv_conta: { maxLength: maxLength(2) },
      agencia: { 
        required, 
        minLength: minLength(3),
        maxLength: maxLength(10)
      },
      dv_agencia: { maxLength: maxLength(2) },
      cpf_cnpj: {
        minLength: minLength(11),
        maxLength: maxLength(14)
      }
    }
  },
  methods: {
    lynxPadStart,
    clearForm() {
      this.form = {
        banco_id: '',
        id_nome: '',
        conta: '',
        dv_conta: '',
        agencia: '',
        dv_agencia: '',
        tipo: 'c',
        principal: 0,
        cpf_cnpj: '',
        pessoa: 'pj',
        id: '',
        banco: {
          id: '',
          nome: ''
        }
      }
    },
    onSelectBanco(banco) {
      if(banco) {
        this.form.banco_id = banco.id
        this.form.banco.id = banco.id
        this.form.banco.nome = banco.nome
      }
    },
    fetchBancos(query) {
      this.bancosLoading = true
      bancosSearchRequest(query)
        .then(res => {
          this.bancos = res.data.filter(curr => {
            curr.id_nome = `${lynxPadStart(curr.id)} - ${curr.nome}`
            return curr
          })
          this.bancosLoading = false
        })
    },
    editContaBancaria(index) {
      this.editingIndex = index
      this.cancelAddContaBancria()
      this.form = {
        ...this.contasBancarias[index],
        id_nome: `${lynxPadStart(this.contasBancarias[index].banco.id)} - ${this.contasBancarias[index].banco.nome}`
      }
      this.fetchBancos(this.form.id)
    },
    isEditting(index) {
      return this.editingIndex === index
    },
    cancelEditContaBancaria() {
      this.clearForm()
      this.editingIndex = null
    },
    updateContaBancaria(index) {
      if(this.$v.form.$invalid) return this.snackValidationMessage(this.$v, this.validationsMessage)
      this.loading = true
      const contaId = this.contasBancarias[index].id
      const form = {
        cpf_cnpj: this.form.cpf_cnpj,
        agencia: this.form.agencia,
        dv_agencia: this.form.dv_agencia,
        conta: this.form.conta,
        dv_conta: this.form.dv_conta,
        tipo: this.form.tipo,
        pessoa: this.form.pessoa,
        banco_id: this.form.banco_id,
        principal: this.form.principal,
      }
      contasBancariasUpdateRequest(contaId, form)
        .then(() => {
          this.contasBancarias[index] = this.form
          this.cancelEditContaBancaria()
          this.$snack.success('Conta bancaria editada com sucesso')
        })
        .catch(() => {
          this.$snack.error('Não foi possivel editar a conta bancaria')
          this.cancelEditContaBancaria()
        })
    },
    handleDeleteContaBancaria(index) {
      this.$buefy.dialog.confirm({
        message: 'Deseja realmente excluir a conta bancária?',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        type: 'is-danger',
        onConfirm: () => this.deleteContaBancaria(index)
      })
    },
    deleteContaBancaria(index) {
      this.loading = true
      const contaId = this.contasBancarias[index].id
      contasBancariasDeleteRequest(contaId)
        .then(() => {
          this.contasBancarias.splice(index, 1)
          this.$snack.success('Conta removida com sucesso')
        })
        .catch(() => this.$snack.error('Não foi possivel excluir a conta bancaria'))
        .finally(() => this.loading = false)
    },
    addContaBancaria() {
      this.creating = true,
      this.cancelEditContaBancaria()
    },
    cancelAddContaBancria() {
      this.creating = false
      this.clearForm()
    },
    createContaBancaria() {
      if(!this.form.banco_id) return this.$snack.error('Selecione um banco para a conta')
      if(this.$v.form.$invalid) return this.snackValidationMessage(this.$v, this.validationsMessage)
      const form = {
        owner_type: this.owner.type,
        owner_id: this.owner.id,
        cpf_cnpj: this.form.cpf_cnpj,
        agencia: this.form.agencia,
        dv_agencia: this.form.dv_agencia,
        conta: this.form.conta,
        dv_conta: this.form.dv_conta,
        tipo: this.form.tipo,
        pessoa: this.form.pessoa,
        banco_id: this.form.banco_id,
        principal: this.form.principal,
      }
      this.loading = true
      contasBancariasCreateRequest(form)
        .then(res => {
          if(form.principal) this.resetContaPrincipal()
          const newConta = {
            ...res.data,
            banco: this.form.banco
          }
          this.contasBancarias.unshift(newConta)
          this.cancelAddContaBancria()
          this.$snack.success('Conta bancaria criada com sucesso')
        })
        .catch(() => {
          this.$snack.error('Não foi possivel criar a conta bancaria')
          this.cancelAddContaBancria()
        })
    },
    handleSetContaPrincipal(index) {
      this.$buefy.dialog.confirm({
        message: 'Deseja realmente definir a conta bancária como principal?',
        confirmText: 'Definir',
        cancelText: 'Cancelar',
        type: 'is-primary',
        onConfirm: () => this.setContaPrincipal(index)
      })
    },
    setContaPrincipal(index) {
      const contaBancaria = this.contasBancarias[index]
      const form = {
        cpf_cnpj: contaBancaria.cpf_cnpj,
        agencia: contaBancaria.agencia,
        dv_agencia: contaBancaria.dv_agencia,
        conta: contaBancaria.conta,
        dv_conta: contaBancaria.dv_conta,
        tipo: contaBancaria.tipo,
        pessoa: contaBancaria.pessoa,
        banco_id: contaBancaria.banco_id,
        principal: 1,
      }
      contasBancariasUpdateRequest(contaBancaria.id, form)
        .then(() => {
          this.resetContaPrincipal()
          this.contasBancarias[index].principal = 1
          this.$snack.success('Conta bancaria definida como principal')
        })
        .catch(() => this.$snack.error('Não foi possivel definir a conta bancaria como principal'))
    },
    resetContaPrincipal() {
      this.contasBancarias.forEach(curr => curr.principal = 0)
    },
    getTipoContaLabel(tipoConta) {
      switch (tipoConta) {
        case 'c':
          return 'Corrente'
        case 'p':
          return 'Poupança'
        default:
          break;
      }
    }
  },
  mounted() {
    if(this.addOpened) this.addContaBancaria()
  }
}
</script>