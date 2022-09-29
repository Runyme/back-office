<template>
  <div>
    <b-loading :active.sync="isLoading" />
    <Lynx-Title text="Ordem de serviço - Criar Solicitação"/>
    <form class="flex flex-col mb-8" @submit.prevent="saveNewService">
      <div class="flex flex-col pb-4">
        <label class="max-w-sm flex flex-col pb-6">
          <Lynx-Label label="Número da empresa"/>
          <Lynx-Input 
            placeholder="Digite o número da empresa" 
            v-model="serviceOrder.empresa_id"
            @input="debounce(searchCliente, 500)"
            :error="empresaInvalida"
          />
        </label>
        <div class="max-w-sm flex flex-col pb-6" v-if="clients.length">
          <Lynx-Label label="Cliente"/>
          <b-autocomplete
            clearable
            open-on-focus
            v-model="client"
            :data="filteredClientesArray"
            placeholder="Selecione o Cliente (opcional)"
            field="nome_completo"
            @select="option => serviceOrder.client = option"
          />
        </div>
        <div class="max-w-sm flex flex-col pb-6">
          <Lynx-Label label="Responsável"/>
          <b-autocomplete
            open-on-focus
            v-model="user"
            :data="filteredUsersArray"
            placeholder="Responsável"
            field="nome_completo"
            clearable
            @select="option => serviceOrder.user = option"
          />
        </div>
        <label class="max-w-sm flex flex-col pb-6">
          <Lynx-Label label="Descrição" :validations-message="validationsMessage.serviceOrder.descricao" :validator="$v.serviceOrder.descricao"/>
          <Lynx-Textarea 
            v-model="$v.serviceOrder.descricao.$model" 
            :error="$v.serviceOrder.descricao.$error"
            placeholder="Insira uma descrição da ordem de serviço"
          />
        </label>
      </div>
      <div class="pb-12" id="anexos">
        <div class="flex justify-between items-center">
          <h2 class="text-3xl text-primary-600 font-display" v-if="serviceOrder.anexos.length">Anexos</h2>
          <b-upload
            v-model="file"
            @input="addNewAnexo"
            class="md:w-full float-right md:float-none"
          >
            <a class="button is-primary is-outlined transition">
              Adicionar Anexos +
            </a>
          </b-upload>
        </div>
        <div class="grid grid-cols-3 gap-4 pt-6" v-if="serviceOrder.anexos.length">
          <Anexo
            v-for="(anexo, index) in serviceOrder.anexos"
            :key="anexo.id"
            :anexo="anexo" 
            :is-deletabled="true"
            @remove-anexo="onRemoveAnexo(index)"
          />
        </div>
      </div>
      <div class="pb-6" id="servicos">
        <div class="flex justify-between items-center pb-6">
          <h2 class="text-3xl text-primary-600 font-display">Serviços</h2>
          <a 
            class="button is-primary is-outlined transition" 
            @click.prevent="addNewService"
          >
            Adicionar Serviço +
          </a>
        </div>
        <div class="grid grid-cols-2 gap-6">
          <Card
            v-for="(value, key) in serviceOrder.os_base" 
            :key="key"
            background="neutral-100"
          >
            <div class="p-6 w-full relative">
              <div class="absolute top-0 right-0 mt-2 mr-2">
                <a
                  href="#" 
                  class="rounded-full bg-error-light transition hover:bg-error-base flex p-1" 
                  @click.prevent="deleteServico(key)"
                >
                  <Icon-Cross class="text-neutral-100" size="2"/>
                </a>
              </div>
              <label class="flex flex-col pb-6">
                <Lynx-Label label="Serviço"/>
                <b-select
                  placeholder="Selecione o serviço"
                  expanded
                  required
                  v-model="value.os_base_id"
                >
                  <option
                    v-for="option in services"
                    :value="option.id"
                    :key="option.id"
                    v-text="option.nome"
                  />
                </b-select>
              </label>
              <label class="flex flex-col pb-3">
                <Lynx-Label label="Data limite/vencimento"/>
                <b-datepicker
                  v-model="value.data_limite"
                  label="Selecione a data para o vencimento"
                  icon="calendar-today"
                  :month-names="monthNames"
                  :day-names="dayNames"
                  editable
                  required
                />
              </label>
            </div>
          </Card>
        </div>
      </div>
      <Lynx-Button
        type="submit"
        class="self-end"
        :loading="loading"
        :disabled="loading"
        text="Enviar"
        icon="Check"
      />
    </form>
  </div>
</template>

<script>

import debounce from '@/mixins/debounce'
import formMixin from '@/mixins/form'
import { required } from 'vuelidate/lib/validators'
import Card from '@/components/helpers/Card'
import LynxTextarea from '@/components/helpers/Textarea'
import Anexo from '@/views/service-order/components/Anexo'
import { saveServiceOrderRequest, searchClientesRequest } from '@/services/requests/service-order'
import { usersRequest } from '@/services/requests/users'
import { fetchOsBasesRequest } from '@/services/requests/service-order-base'
import { formatDateToEn } from '@/utils/momentHelpers'
import { monthNames, dayNames } from '@/utils/utils'

export default {
  name: 'ServiceOrderFormCreate',
  components: { Anexo, Card, LynxTextarea },
  mixins: [ debounce, formMixin ],
  data() {
    return {
      isLoading: false,
      user: '',
      loading: false,
      empresaInvalida: null,
      monthNames,
      dayNames,
      serviceOrder: {
        empresa_id: '',
        cliente: {},
        os_base: [{
          os_base_id: null,
          data_limite: new Date()
        }],
        anexos: [],
        descricao: ''
      },
      users: [
        {
          id: 15,
          nome_completo: 'Lais Tamires De Sá Custódio'
        },
        {
          id: 16,
          nome_completo: 'Cal Crivelaro'
        },
        {
          id: 32,
          nome_completo: 'Dani Garcia'
        },
        {
          id: 58,
          nome_completo: 'Thais Moroteg Alves'
        },
        {
          id: 53,
          nome_completo: 'Paola Reis'
        },
      ],
      client: '',
      clients: [],
      services: [],
      file: null,
      validationsMessage: {
        serviceOrder: {
          descricao: { required: 'Insira uma descrição para continuar' }
        }
      }
    }
  },
  validations: {
    serviceOrder: {
      descricao: { required }
    }
  },
  beforeMount() {
    this.fetchOsBase()
  },
  computed: {
    filteredClientesArray() {
      return this.clients.filter((option) => {
        return option.nome_completo
          .toString()
          .toLocaleLowerCase()
          .indexOf(this.client.toString().toLocaleLowerCase()) >= 0
      })
    },
    filteredUsersArray() {
      return this.users.filter((option) => {
        return option.nome_completo
          .toString()
          .toLocaleLowerCase()
          .indexOf(this.user.toString().toLocaleLowerCase()) >= 0
      })
    }
  },
  methods: {
    getUsers() {
      usersRequest().then(({data: {data}}) => {
        this.users = data;
      });
    },
    searchCliente() {
      this.isLoading = true
      searchClientesRequest(this.serviceOrder.empresa_id)
        .then(res => {
          this.clients = res.data.data
          this.empresaInvalida = false
        })
        .catch(() => {
          this.clients = []
          this.empresaInvalida = true
          this.$snack.error('Nenhuma empresa foi encontrada')
        })
        .finally(() => this.isLoading = false)
    },
    fetchOsBase() {
      this.isLoading = true
      fetchOsBasesRequest()
        .then(res => this.services = res.data)
        .finally(() => this.isLoading = false)
    },
    addNewAnexo(file) {
      this.serviceOrder.anexos.push(file)
    },
    addNewService() {
      this.serviceOrder.os_base.push({
        os_base_id: null,
        data_limite: new Date()
      })
    },
    onRemoveAnexo(index) {
      this.serviceOrder.anexos.splice(index, 1)
    },
    deleteServico(index) {
      if(this.serviceOrder.os_base.length < 2) {
        this.$snack.error('Não é possível excluir todos os serviços')
        return
      }
      this.serviceOrder.os_base.splice(index, 1)
    },
    saveNewService() {
      if(!this.serviceOrder.empresa_id || this.empresaInvalida) {
        this.$snack.error('Por favor selecione uma empresa válida')
        return
      }
      if(this.$v.$invalid) {
        this.$snack.error('Por favor preencha todas as informações corretamente')
        return
      }
      const serviceErrors = this.serviceOrder.os_base.filter(curr => !curr.os_base_id)
      if(serviceErrors.length) {
        this.$snack.error('Por favor selecione todos os serviços corretamente')
        return
      }
      this.loading = true
      const formData = this.buildFormData()
      saveServiceOrderRequest(formData)
        .then(() => {
          this.$snack.success('Ordem de serviço criado com sucesso.')
          this.clearForm()
        })
        .catch(err => this.$snack.error(err.data.response.errors.os_base[0]))
        .finally(() => this.loading = false)
    },
    clearForm() {
      this.serviceOrder = {
        empresa_id: '',
        cliente: {},
        os_base: [{
          os_base_id: null,
          data_limite: new Date()
        }],
        anexos: [],
        descricao: ''
      }
      this.user = ''
      this.clients = []
    },
    buildFormData() {
      const { user, client, empresa_id, descricao, os_base, anexos } = this.serviceOrder
      const formData = new FormData;
      formData.append('usuario_id', user.id)
      formData.append('empresa_id', empresa_id)
      formData.append('descricao', descricao)
      if(client) {
        formData.append('cliente_id', client.id)
      }

      const orderServiceBase = os_base.map((value => {
        return {
          ...value,
          data_limite: formatDateToEn(value.data_limite)
        }
      }));

      for (const [i, os] of Object.entries(orderServiceBase)) {
        for (const [key, value] of Object.entries(os)) {
          formData.append(`os_base[${ i }][${ key }]`, value)
        }
      }

      if (anexos.length) {
        for (let i = 0; i < anexos.length; i++) {
          formData.append('anexos[]', anexos[i]);
        }
      }

      return formData;
    }
  },
}
</script>
