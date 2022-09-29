<template>
  <div>
    <b-loading :active.sync="isLoading" />
    <div class="flex flex-col">
      <Lynx-Title text="Ordem de serviço base - Criar"/>
      <form class="flex flex-col pb-6 max-w-sm">
        <label class="flex flex-col pb-6">
          <Lynx-Label
            label="Nome do procedimento"
            :validations-message="validationsMessage.baseServiceOrder.nome"
            :validator="$v.baseServiceOrder.nome"
          />
          <Lynx-Input
            placeholder="Ex: Recalculo de ISS"
            v-model="$v.baseServiceOrder.nome.$model"
            :error="$v.baseServiceOrder.nome.$error"
            required
          />
        </label>
        <label class="flex flex-col pb-6">
          <Lynx-Label
            label="Descrição"
            :validations-message="validationsMessage.baseServiceOrder.descricao"
            :validator="$v.baseServiceOrder.descricao"
          />
          <Lynx-Textarea
            placeholder="Descreva o procedimento"
            v-model="$v.baseServiceOrder.descricao.$model"
            :error="$v.baseServiceOrder.descricao.$error"
            required
          />
        </label>
        <label class="flex flex-col pb-6">
          <Lynx-Label
            label="Preço"
            :validations-message="validationsMessage.baseServiceOrder.preco"
            :validator="$v.baseServiceOrder.preco"
          />
          <Input-Money
            placeholder="Preço do procedimento"
            v-model="$v.baseServiceOrder.preco.$model"
            :error="$v.baseServiceOrder.preco.$error"
            required
          />
        </label>
        <div class="flex flex-col pb-6">
          <Lynx-Label label="Setor Responsável" />
          <b-autocomplete
            open-on-focus
            :data="roles"
            field="name"
            placeholder="Selecione o setor responsável"
            clearable
            @select="option => baseServiceOrder.role_id = option.id"
          >
            <template slot="empty">Nenhum Cliente foi encontrado</template>
          </b-autocomplete>
        </div>
        <label class="flex flex-col py-3">
          <b-checkbox
            @input="baseServiceOrder.procedimento_interno ? baseServiceOrder.notificacao = false : ''"
            v-model="baseServiceOrder.procedimento_interno">
            Procedimento Interno?
          </b-checkbox>
        </label>
        <label class="flex flex-col py-3">
          <b-checkbox v-model="baseServiceOrder.pagamento_antecipado">Pagamento Antecipado?</b-checkbox>
        </label>
        <label class="flex flex-col py-3">
          <b-checkbox v-model="baseServiceOrder.notificacao">Notificável ao cliente?</b-checkbox>
        </label>
      </form>
      <Lynx-Button
        class="self-start mb-8"
        text="Adicionar Atividade"
        outlined="true"
        icon="Plus"
        @click.native="addNewAtividade"
      />
      <div class="mb-8" v-if="baseServiceOrder.atividades.length">
        <h2 class="text-3xl text-primary-600 font-display pb-6">Atividades</h2>
        <div class="grid grid-cols-2 gap-6 items-start">
          <Atividade
            v-for="(atividade, index) in baseServiceOrder.atividades"
            :key="atividade.id"
            :atividade="atividade"
            @remove-atividade="onRemoveAtividade(index)"
          />
        </div>
      </div>
      <Lynx-Button
        @click.native="saveNewBaseServiceOrder"
        class="self-end mb-8"
        :loading="isLoading"
        text="Salvar"
        icon="Check"
      />
    </div>
  </div>
</template>

<script>

import { saveServiceBaseOrder } from '@/services/requests/service-order-base'
import { rolesRequest } from '@/services/requests/roles'
import Atividade from '@/views/service-order/components/Atividade'
import LynxTextarea from '@/components/helpers/Textarea'
import InputMoney from '@/components/helpers/InputMoney'
import { required, decimal } from 'vuelidate/lib/validators'
import formMixin from '@/mixins/form'

export default {
  name: 'Create',
  components: { Atividade, LynxTextarea, InputMoney },
  mixins: [ formMixin ],
  data() {
    return {
      isLoading: false,
      baseServiceOrder: {
        nome: '',
        descricao: '',
        role_id: '',
        preco: 0,
        atividades: [],
        procedimento_interno: true,
        pagamento_antecipado: false,
        notificacao: false,
      },
      roles: [],
      validationsMessage: {
        baseServiceOrder: {
          nome: { required: 'Insira um nome para o procedimento' },
          descricao: { required: 'Insira uma descrição para o procedimento' },
          preco: {
            required: 'Insira um preço para o procedimento',
            decimal: 'Insira um preço válido para o procedimento'
          }
        }
      }
    }
  },
  validations: {
    baseServiceOrder: {
      nome: { required },
      descricao: { required },
      preco: { required, decimal }
    }
  },
  beforeMount() {
    this.fetchRoles()
  },
  methods: {
    fetchRoles() {
      this.isLoading = true
      rolesRequest()
        .then(res => this.roles = res.data.data)
        .catch(() => this.$snack)
        .finally(() => this.isLoading = false)
    },
    addNewAtividade() {
      this.baseServiceOrder.atividades.push({
        nome: '',
        descricao: '',
        sla_hora: '',
        input: [],
      })
    },
    onRemoveAtividade(index) {
      if(this.baseServiceOrder.atividades.length < 2) return this.$snack.error('Você não pode remover todas as atividades')
      this.baseServiceOrder.atividades.splice(index, 1)
    },
    clearBaseServiceOrder() {
      this.baseServiceOrder = {
        nome: '',
        descricao: '',
        preco: 0,
        atividades: [],
        role_id: '',
        procedimento_interno: true,
      }
    },
    saveNewBaseServiceOrder() {
      if(this.$v.$invalid) return this.$snack.error('Por favor preencha todas informações corretamente')

      if(!this.baseServiceOrder.role_id) return this.$snack.error('Por favor, selecione um setor responsavel para o procedimento')

      if(!this.baseServiceOrder.atividades.length) return this.$snack.error('Por favor selecione uma atividade para o procedimento')

      const atividadesErrors = this.baseServiceOrder.atividades.filter(curr => !curr.nome || !curr.descricao || !curr.sla_hora)
      if(atividadesErrors.length) return this.$snack.error('Por favor preencha as informações das atividades corretamente')

      const campos = this.baseServiceOrder.atividades.map(curr => curr.input)
      const camposErrorsArray = campos.map(curr => curr.filter(campo => !campo.nome || !campo.tipo))
      const camposErrors = camposErrorsArray.filter(curr => curr.length)
      if(camposErrors.length) return this.$snack.error('Por favor preencha as informações dos campos das atividades corretamente')

      this.isLoading = true

      saveServiceBaseOrder(this.baseServiceOrder)
        .then(() => {
          this.$snack.success('Ordem de serviço base criado com sucesso.')
          this.clearBaseServiceOrder()
        })
        .catch(() => this.$snack.error('Não foi possível salvar a ordem de serviço'))
        .finally(() => this.isLoading = false)
    }
  }
}
</script>
