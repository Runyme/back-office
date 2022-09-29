<template>
  <div class="bg-neutral-300 p-8">
    <Lynx-Title text="Criar Plano"/>
    <form
      class="flex flex-col"
      @submit.prevent="handleSubmit"
    >

      <label class="flex flex-col pb-4">
        <Lynx-Label label="Nome"/>
        <Lynx-Input
          placeholder="Informe um nome"
          v-model="form.name"
          required
        />
      </label>

      <label class="flex flex-col pb-4">
        <Lynx-Label label="Descrição"/>
        <Lynx-Input
          placeholder="Informe uma Descrição"
          v-model="form.description"
          required
        />
      </label>

      <label class="flex flex-col pb-4">
        <Lynx-Label label="Tipo de empresa"/>
        <b-select placeholder="Selecione" v-model="form.type">
          <option value="normal">Normal</option>
          <option value="pf">Pessoa física</option>
          <option value="clinica">Clinica</option>
          <option value="atletica">Atlética</option>
        </b-select>
      </label>

      <div class="flex pb-10">
<!--        <label class="flex flex-col w-1/2 pr-4">-->
<!--          <Lynx-Label-->
<!--            label="Primeira Cobrança"-->
<!--          />-->
<!--          <b-datepicker-->
<!--            placeholder="Informe a data de inicio de cobrança"-->
<!--            icon="calendar-today"-->
<!--            :month-names="monthNames"-->
<!--            :day-names="dayNames"-->
<!--            :min-date="new Date()"-->
<!--            v-model="form.start_on"-->
<!--          />-->
<!--          <small class="has-text-grey">Considerando empresas com alvará.</small>-->
<!--        </label>-->

        <label class="flex flex-col">
          <Lynx-Label label="Preço"/>
          <Lynx-Input
            type="number"
            placeholder="Informe o valor"
            v-model="form.price"
            required
          />
        </label>

      </div>

<!--      <div class="flex justify mb-10">-->
<!--        <Lynx-Button-->
<!--          text="Adicionar O.S."-->
<!--          icon="Plus"-->
<!--          size="small"-->
<!--          icon-size="4"-->
<!--          @click.native="addOS"-->
<!--          class="self-start"-->
<!--          type="button"-->
<!--        />-->

<!--        <Lynx-Button-->
<!--          text="Adicionar Serviço"-->
<!--          icon="Plus"-->
<!--          size="small"-->
<!--          icon-size="4"-->
<!--          @click.native="addService"-->
<!--          class="self-start ml-5"-->
<!--          type="button"-->
<!--        />-->
<!--      </div>-->

<!--      <div class="flex flex-col mb-4" v-for="(item, key) in form.service_tables" :key="key">-->
<!--        <div class="flex justify-between items-center">-->
<!--          <label class="flex flex-col w-120">-->
<!--            <Lynx-Label label="Serviço"/>-->
<!--            <b-select placeholder="Selecione" v-model="item.service_table_id">-->
<!--              <option-->
<!--                v-for="(option, opt_key) in serviceTableData"-->
<!--                :value="option.id"-->
<!--                :key="opt_key"-->
<!--                v-text="option.name"-->
<!--              />-->
<!--            </b-select>-->
<!--          </label>-->

<!--          <label class="flex flex-col mx-5">-->
<!--            <Lynx-Label label="Quantidade"/>-->
<!--            <Lynx-Input-->
<!--              type="number"-->
<!--              placeholder="Informe a quantidade"-->
<!--              v-model="item.quantity"-->
<!--              required-->
<!--            />-->
<!--          </label>-->

<!--          <a href="#" class="p-1 mt-5 bg-error-light transition hover:bg-error-base rounded-full"-->
<!--             @click.prevent="form.service_tables.splice(key, 1)">-->
<!--            <Icon-Cross size="3" class="text-neutral-100"/>-->
<!--          </a>-->
<!--        </div>-->
<!--      </div>-->

<!--      <div class="flex flex-col mb-4" v-for="(item, key) in form.os_base" :key="key">-->
<!--        <div class="flex justify-between items-center">-->
<!--          <label class="flex flex-col w-120">-->
<!--            <Lynx-Label label="Ordem Serviço"/>-->
<!--            <b-select placeholder="Selecione" v-model="item.os_base_id">-->
<!--              <option-->
<!--                v-for="(option, opt_key) in osBaseData"-->
<!--                :value="option.id"-->
<!--                :key="opt_key"-->
<!--                v-text="option.nome"-->
<!--              />-->
<!--            </b-select>-->
<!--          </label>-->

<!--          <label class="flex flex-col mx-5">-->
<!--            <Lynx-Label label="Quantidade"/>-->
<!--            <Lynx-Input-->
<!--              type="number"-->
<!--              placeholder="Informe a quantidade"-->
<!--              v-model="item.quantity"-->
<!--              required-->
<!--            />-->
<!--          </label>-->

<!--          <a href="#" class="p-1 mt-5 bg-error-light transition hover:bg-error-base rounded-full"-->
<!--             @click.prevent="form.os_base.splice(key, 1)">-->
<!--            <Icon-Cross size="3" class="text-neutral-100"/>-->
<!--          </a>-->
<!--        </div>-->
<!--      </div>-->

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
  import {createPlanRequest, getOsBaseRequest, getServiceTableRequest} from "../../../services/requests/plans";

  export default {
    mixins: [debounce],
    name: 'CreateFatura',
    data() {
      return {
        dayNames,
        monthNames,
        loadingSubmit: false,
        loadingServiceTable: false,
        isFetching: false,
        serviceTableData: [],
        osBaseData: [],
        form: {
          name: null,
          description: null,
          type: null,
          start_on: null,
          price: null,
          // service_tables: [{
          //   service_table_id: null,
          //   quantity: 1
          // }],
          // os_base: [{
          //   os_base_id: null,
          //   quantity: 1
          // }],
        },
      }
    },
    computed: {},
    mounted() {
      this.fetchServiceTable()
      this.fetchOsBase()
    },
    methods: {
      fetchServiceTable() {
        this.loadingServiceTable = true
        getServiceTableRequest()
          .then(response => this.serviceTableData = response.data)
          .catch(error => this.$snack.error(error.response.data.message))
          .finally(() => this.loadingServiceTable = false)
      },
      fetchOsBase() {
        this.loadingOsBase = true
        getOsBaseRequest()
          .then(response => this.osBaseData = response.data)
          .catch(error => this.$snack.error(error.response.data.message))
          .finally(() => this.loadingOsBase = false)
        console.log(this.osBaseData)
      },
      handleSubmit() {
        this.loadingSubmit = true
        createPlanRequest(this.form)
          .then(response => {
            this.$snack.success(response.data.message)
            this.$emit('on-update-plan')
          })
          .catch(error => {
            if(error.response.status !== 422) {
              this.$snack.error(error.response.data.message)
              return
            }
            const errors = Object.values(error.response.data.errors)
            const message = errors.map(item => item.map(error => `<li>${error}</li>`).join('')).join('')

            this.$buefy.dialog.alert({
              title: 'Não foi possível criar o plano',
              message: `<ul>${message}</ul>`,
              type: 'is-danger',
              ariaRole: 'alertdialog',
              ariaModal: true
            })
          })
          .finally(() => this.loadingSubmit = false)
      },
      addOS() {
        const newItem = {
          os_base_id: null,
          quantity: 1
        }
        this.form.os_base.push(newItem)
      },
      addService() {
        const newItem = {
          service_table_id: null,
          quantity: 1
        }
        this.form.service_tables.push(newItem)
      },
    }
  }
</script>
