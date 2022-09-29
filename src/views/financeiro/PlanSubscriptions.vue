<template>
  <div>
    <b-loading :active.sync="loading"/>
    <div class="w-full flex justify-between items-center">
      <Lynx-Title text="Assinaturas de Planos"/>
    </div>
    <div class="w-full flex justify-between items-end pb-8">
      <div class="flex flex-col">
        <Lynx-Label label="Pesquisar"/>
        <b-input
          placeholder="Pesquise algo"
          v-model="search"
        />
      </div>
      <Lynx-Button text="Criar Assinatura" icon="Plus" icon-size="4" size="small"
                   @click.native="openNewSubscriptionModal"/>
    </div>

    <b-table
      :data="subscriptions"
      :columns="columns"
      :paginated="true"
      default-sort-direction="asc"
      default-sort="id"
      per-page="10"
      hoverables
      class="w-full rounded-t-none"
    >
      <template slot-scope="props">
        <b-table-column class="max-w-xs truncate" field="payer_id" v-text="props.row.payer_id"/>
        <b-table-column field="payer_type"> {{props.row.payer_type}}</b-table-column>
        <b-table-column field="payment_method">
          {{ props.row | paymentMethod }}
        </b-table-column>
        <b-table-column field="payer_name" v-text="props.row.payer_name"/>
        <b-table-column field="total_price"> {{props.row.total_price | money}}</b-table-column>
        <b-table-column field="acoes">
          <div class="flex text-sm">
            <div class="flex text-sm items-center">
              <a href="#" class="mr-4 bg-primary-600 rounded-full p-2"
                 @click.prevent="openSubscriptionModal(props.row)">
                <Icon-Eye class="text-neutral-100" size="4"/>
              </a>
              <a href="#" class="mr-4 bg-error-base rounded-full p-2"
                 @click.prevent="handleDeleteSubscription(props.row)">
                <Icon-Trash class="text-neutral-100" size="4"/>
              </a>
            </div>
          </div>
        </b-table-column>
      </template>
      <template #empty>
        <Not-Found-Data text="Nenhuma Plano encontrado!"/>
      </template>
    </b-table>
    <b-modal v-if="viewPlanModal" :active.sync="viewPlanModal" @close="closeViewPlanModal" width="700px">
      <ViewPlan :planOptions="planOptions" :plan="currentPlan" @on-update-subscription="handleUpdateSubscription"/>
    </b-modal>
    <b-modal :active.sync="showNewSubscriptionModal" width="600px">
      <CreateSubscription @on-update-subscription="handleUpdateSubscription"/>
    </b-modal>
  </div>
</template>

<script>

  import {mapGetters} from 'vuex'
  import {faturasRequest} from '@/services/requests/faturas'
  import {formatEnToBr, formatBrToEn, momentIntance} from '@/utils/momentHelpers'
  import {monthNames} from '@/utils/utils'
  import NotFoundData from '@/components/layouts/NotFoundData'
  import CreateSubscription from '@/views/financeiro/components/CreateSubscription'
  import VerFatura from '@/views/financeiro/components/VerFatura'
  import Card from '@/components/helpers/Card'
  import {plansRequest} from "../../services/requests/plans";
  import {deleteSubscriptionRequest, subscriptionRequest} from "../../services/requests/plan_subscriptions";

  export default {
    name: 'PlanSubscriptions',
    components: {
      NotFoundData,
      CreateSubscription,
      ViewPlan: () => import("./components/ViewPlan")
    },
    data: () => ({
      monthNames,
      dates: [],
      loading: false,
      columns: [
        {
          field: 'payer_id',
          label: 'Número',
          sortable: true,
        },
        {
          field: 'payer_type',
          label: 'Tipo',
          sortable: true,
        },
        {
          field: 'payment_method',
          label: 'Forma Pag.',
          sortable: true,
        },
        {
          field: 'payer_name',
          label: 'Nome',
          sortable: true,
        },
        {
          field: 'total_price',
          label: 'Valor',
          sortable: true,
        },
        // {
        //   field: 'acoes',
        //   label: 'Ações',
        // },
      ],
      statusFatura: null,
      search: null,
      subscriptionsArray: [],
      resumo: [],
      currentPlan: null,
      viewPlanModal: false,
      showNewSubscriptionModal: false,
      planOptions: []
    }),

    computed: {
      subscriptions() {
        if (!this.subscriptionsArray || !this.search) {
          return this.subscriptionsArray
        }
        return this.subscriptionsArray.filter((data) => {
          let serializedFields = JSON.stringify({
            payer_id: data.payer_id,
            payer_type: data.payer_type,
            payer_name: data.payer_name,
          });
          return serializedFields.toLowerCase().indexOf(this.search.toLowerCase()) !== -1
        });
      },
    },

    filters: {
      money: value => {
        let val = (value / 1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      },
      paymentMethod: value => {
        return value.credit_card && value.credit_card.length > 0 ? 'Cartão' : 'Boleto'
      }
    },
    mounted() {
      this.fetchSubscriptions()
      this.fetchPlans()
    },
    methods: {
      fetchSubscriptions() {
        this.loading = true

        subscriptionRequest()
          .then(response => this.subscriptionsArray = response.data.data)
          .catch(error => this.$snack.error(error.response.data.message))
          .finally(() => this.loading = false)
      },
      openSubscriptionModal(invoice) {
        this.currentPlan = invoice
        this.viewPlanModal = true
      },
      openNewSubscriptionModal() {
        this.showNewSubscriptionModal = true
      },
      closeNovaFaturaModal() {
        this.showNewSubscriptionModal = false
      },
      closeViewPlanModal() {
        this.currentPlan = null
        this.viewPlanModal = false
      },
      handleUpdateSubscription() {
        this.closeNovaFaturaModal()
        this.closeViewPlanModal()
        this.fetchSubscriptions()
      },
      getResumoStatusColor(status) {
        if (status === 'atrasado') return 'error-base'
        if (status === 'pendente') return 'warning-base'
        if (status === 'pago') return 'success-base'
        if (status === 'total') return 'info-base'
      },
      fetchPlans() {
        plansRequest()
          .then(response => this.planOptions = response.data.data)
          .catch(error => this.$snack.error(error.response.data.message))
      },
      handleDeleteSubscription(subscription) {
        if (!confirm('Ação irreversível. Tem certeza que deseja Deletar essa parada?')) {
          return
        }

        this.loading = true
        deleteSubscriptionRequest(subscription.payer_type, subscription.payer_id)
          .then(() => {
            this.subscriptionsArray = this.subscriptionsArray.filter(item => {
              return !(item.payer_id === subscription.payer_id && item.payer_type === subscription.payer_type)
            })
            this.$snack.success('Removido com sucesso!')
          })
          .catch(error => this.$snack.error(error.response.data.message))
          .finally(() => this.loading = false)
      }
    },
  }
</script>

