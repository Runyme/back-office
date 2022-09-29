<template>
  <div class="bg-neutral-300 p-8">
    <Lynx-Title text="Criar Assinatura"/>
    <form
      class="flex flex-col"
      @submit.prevent="handleSubmit"
    >
      <div class="flex pb-8">
        <b-radio
          name="payer_type"
          v-model="form.payer_type"
          native-value="empresa"
          class="pr-4"
        >
          Pessoa Jurídica
        </b-radio>
        <b-radio
          name="payer_type"
          v-model="form.payer_type"
          native-value="cliente"
        >
          Pessoa física
        </b-radio>
      </div>

      <label class="flex flex-col pb-8" v-if="form.payer_type === 'empresa'">
        <Lynx-Label
          label="Empresa"
        />
        <b-autocomplete
          :data="filteredEmpresas"
          placeholder="Pesquise uma empresa"
          field="empresa"
          :loading="isFetching"
          @input="getAsyncEmpresa"
          @select="option => form.payer_id = option.id"
        />
      </label>

      <label class="flex flex-col pb-8" v-else>
        <Lynx-Label
          label="Cliente"
        />
        <b-autocomplete
          :data="filteredClientes"
          placeholder="Pesquise um Cliente"
          field="cliente"
          :loading="isFetching"
          @input="getAsyncCliente"
          @select="option => form.payer_id = option.id"
        />
      </label>

      <Lynx-Button
        text="Adicionar Plano"
        icon="Plus"
        size="small"
        icon-size="4"
        @click.native="addPlan"
        class="self-start mb-10"
        type="button"
      />

      <div class="flex flex-col mb-4" v-for="(item, key) in form.plans" :key="key">
        <div class="flex justify-between items-center">
          <label class="flex flex-col w-120">
            <Lynx-Label label="Plano"/>
            <b-select placeholder="Selecione" v-model="item.plan_id">
              <option
                v-for="(option, opt_key) in filteredPlans"
                :value="option.id"
                :key="opt_key"
                v-text="option.name"
              />
            </b-select>
          </label>

          <a href="#" class="p-1 mt-5 bg-error-light transition hover:bg-error-base rounded-full"
             @click.prevent="form.plans.splice(key, 1)">
            <Icon-Cross size="3" class="text-neutral-100"/>
          </a>
        </div>
      </div>

      <Lynx-Button
        text="Salvar"
        icon="Check"
        type="submit"
        class="self-end"
        :loading="loadingSubmit"
      />
    </form>
  </div>
</template>

<script>

  import {searchEmpresasRequest} from '@/services/requests/empresas'
  import debounce from '@/mixins/debounce'
  import {dayNames, monthNames} from '@/utils/utils'
  import {createOrUpdateSubscriptionRequest} from "../../../services/requests/plan_subscriptions";
  import {plansRequest} from "../../../services/requests/plans";
  import {clientesSearchRequest} from "@/services/requests/clientes";

  export default {
    mixins: [debounce],
    name: 'CreateFatura',
    data() {
      return {
        dayNames,
        monthNames,
        loadingSubmit: false,
        isFetching: false,
        empresas: [],
        clientes: [],
        plansArray: [],
        form: {
          payer_id: null,
          payer_type: 'empresa',
          tipo: 'avulso',
          plans: [{
            plan_id: null,
          }],
        },
      }
    },
    computed: {
      filteredEmpresas() {
        return this.empresas.map(item => {
          return {
            id: item.id,
            empresa: `${item.id} - ${item.razao_social}`
          }
        })
      },
      filteredClientes() {
        return this.clientes.map(item => {
          return {
            id: item.id,
            cliente: `${item.id} - ${item.nome_completo}`
          }
        })
      },
      filteredPlans() {
        if (this.form.payer_type === 'empresa') {
          return this.plansArray.filter(({type}) => type !== 'pf')
        }
        return this.plansArray.filter(({type}) => type === 'pf')
      }
    },
    mounted() {
      this.fetchPlans()
    },
    methods: {
      fetchPlans() {
        this.loading = true

        plansRequest()
          .then(response => this.plansArray = response.data.data)
          .catch(error => this.$snack.error(error.response.data.message))
          .finally(() => this.loading = false)
      },
      handleSubmit() {
        this.loadingSubmit = true
        createOrUpdateSubscriptionRequest(this.form)
          .then(response => {
            this.$snack.success(response.data.message)
            this.$emit('on-update-subscription')
          })
          .catch(error => this.$snack.error(error.response.data.message))
          .finally(() => this.loadingSubmit = false)
      },
      getAsyncEmpresa(name) {
        if (!name) return
        let self = this
        this.debounce(function () {
          self.isFetching = true
          searchEmpresasRequest(name)
            .then(response => {
              self.empresas = response.data.data
            })
            .catch(error => self.$snack.error(error.response.data.message))
            .finally(() => self.isFetching = false)
        }, 600);
      },
      getAsyncCliente(name) {
        if (!name) return
        let self = this
        this.debounce(function () {
          self.isFetching = true
          clientesSearchRequest(name)
            .then(response => {
              self.clientes = response.data.data || []
            })
            .catch(error => self.$snack.error(error.response.data.message))
            .finally(() => self.isFetching = false)
        }, 600);
      },

      addPlan() {
        const newPlan = {
          plan_id: null,
        }
        this.form.plans.push(newPlan)
      },
    }
  }
</script>
