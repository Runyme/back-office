<template>
  <div class="p-8 bg-neutral-300">
    <b-loading :active.sync="loading"/>
    <Lynx-Title :text="title"/>
    <div class="grid grid-cols-2 gap-16 pb-8">
      <div class="flex flex-col">
        <h3 class="text-xl text-neutral-700 pb-2 ">Plano
          <a href="#" v-if="changing"
             class=" inline-flex p-1 ml-5  bg-success-light transition hover:bg-info-base rounded-full"
             @click.prevent="currentPlans.push({})">
            <Icon-Plus size="3" class="text-neutral-100"/>
          </a>
        </h3>

        <div v-if="!changing">
          <li class=" text-neutral-800 text-lg" v-for="(item, key) in currentPlans" :key="key">
            {{ item.name }}
          </li>
        </div>

        <div v-else>
          <div v-for="(item, key) in currentPlans" :key="key">
            <b-select
              placeholder="Selecione um plano"
              class="inline-flex mb-2 w-48"
              v-model="currentPlans[key]"
            >
              <option
                v-for="(option, key) in planOptions"
                :value="option"
                :key="key">
                {{ option.name }}
              </option>
            </b-select>

            <a href="#"
               class=" inline-flex p-1 ml-5  bg-error-light transition hover:bg-error-base rounded-full"
               @click.prevent="currentPlans.splice(key, 1)">
              <Icon-Cross size="3" class="text-neutral-100"/>
            </a>
          </div>
        </div>
      </div>

      <div class="flex flex-col">
        <h3 class="text-xl text-neutral-700 pb-2 leading-tight">Forma de pagamento</h3>
        <div v-if="plan.credit_card && plan.credit_card.length > 0">
          <li class="text-neutral-800 text-lg" v-for="(item, key) in plan.credit_card" :key="key">
            {{ item.cartao_truncado }}
            <b-icon icon="check" type="is-success" v-if="item.principal"/>

            <a href="#"
               v-if="changing"
               class=" inline-flex p-1 ml-5  bg-error-light transition hover:bg-error-base rounded-full"
               @click.prevent="deleteCreditCard(item)">
              <Icon-Cross size="3" class="text-neutral-100"/>
            </a>

          </li>

        </div>
        <div v-else>
          <li class="text-neutral-800 text-lg">Boleto</li>
        </div>

      </div>
    </div>

    <div class="flex justify-between items-end">
      <div class="flex">
        <Lynx-Button
          :text="changing ? 'Cancelar' : 'Alterar'"
          size="small"
          :color="changing ? 'error-base' : 'info-base'"
          outlined="true"
          @click.native="cancelChange"
        />
        <Lynx-Button
          class="ml-5"
          v-if="changing"
          text="Feito"
          size="small"
          color="info-base"
          outlined="true"
          @click.native="changePlan"
        />
      </div>
      <div
        class="bg-white text-primary-500 text-xl px-4 py-2 shadow transition hover:shadow-xl font-light font-display rounded">
        <p>Valor: <span class="font-medium">R${{ subtotal | money }}</span></p>
      </div>
    </div>
  </div>
</template>

<script>

  import {formatEnToBr} from '@/utils/momentHelpers'
  import {
    createOrUpdateSubscription,
    createOrUpdateSubscriptionRequest
  } from "../../../services/requests/plan_subscriptions";
  import {deleteCartaoCreditoRequest} from "../../../services/requests/plans";

  export default {
    name: 'ViewPlan',
    props: {
      plan: {
        type: Object,
        required: true,
      },
      planOptions: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        loading: false,
        changing: false,
        currentPlans: this.plan.plans.slice(),
        form: {
          payer_id: this.plan.payer_id,
          payer_type: this.plan.payer_type,
          plans: []
        }
      }
    },
    filters: {
      vencimento: val => formatEnToBr(val),
      money: value => {
        let val = (value / 1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      },
    },
    computed: {
      title() {
        return `${this.plan.payer_id} - ${this.plan.payer_name}`
      },
      subtotal() {
        if (this.currentPlans && this.currentPlans.length > 0) {
          return this.currentPlans.reduce((sum, item) => sum + parseFloat(item.price), 0)
        }
        return 0
      }
    },
    methods: {
      deleteCreditCard(creditCard) {
        if (!confirm('Tem certeza que deseja remover este cartão? esta ação é irreversível!')) {
          return
        }
        this.loading = true
        deleteCartaoCreditoRequest(creditCard.id)
          .then(response => this.$snack.success(response.data.message))
          .catch(error => this.$snack.error(error.response.data.message))
          .finally(() => this.loading = false)
      },
      changePlan() {
        this.loading = true
        this.form.plans = this.currentPlans.map(plan => Object.assign({}, {plan_id: plan.id}))
        createOrUpdateSubscriptionRequest(this.form)
          .then(response => {
            this.$snack.success(response.data.message)
            this.$emit('on-update-subscription')
          })
          .catch(error => this.$snack.error(error.response.data.message))
          .finally(() => {
            this.loading = false
          })
      },
      cancelChange() {
        if (this.changing) { // when the change is switched off without apply
          this.currentPlans = this.plan.plans.slice()
        }
        this.changing = !this.changing
      }
    }
  }
</script>
