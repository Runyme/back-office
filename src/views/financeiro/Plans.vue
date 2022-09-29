<template>
  <div>
    <b-loading :active.sync="loading"/>
    <div class="w-full flex justify-between items-center">
      <Lynx-Title text="Gerenciamento de Planos"/>
    </div>
    <div class="w-full flex justify-between items-end pb-8">
      <div class="flex flex-col">
        <Lynx-Label label="Pesquisar"/>
        <b-input
          placeholder="Pesquise algo"
          v-model="search"
        />
      </div>
      <Lynx-Button text="Criar Plano" icon="Plus" icon-size="4" size="small" @click.native="openNewPlanModal"/>
    </div>

    <b-table
      :data="plans"
      :columns="columns"
      :paginated="true"
      default-sort-direction="asc"
      default-sort="id"
      per-page="10"
      hoverables
      class="w-full rounded-t-none"
    >
      <template slot-scope="props">
        <b-table-column class="max-w-xs truncate" field="id" v-text="props.row.id"/>
        <b-table-column field="name" v-text="props.row.name"/>
        <b-table-column field="price"> {{ props.row.price | money }}</b-table-column>
        <b-table-column field="interval_type" v-text="props.row.interval_type"/>
        <b-table-column field="payable_with" v-text="props.row.payable_with"/>
        <!--        <b-table-column field="acoes">-->
        <!--          <div class="flex text-sm">-->
        <!--            <div class="flex text-sm items-center">-->
        <!--            <a href="#" class="mr-4 bg-primary-600 rounded-full p-2" @click.prevent="openFaturaModal(props.row)">-->
        <!--              <Icon-Eye class="text-neutral-100" size="4"/>-->
        <!--            </a>-->
        <!--          </div>-->
        <!--          </div>-->
        <!--        </b-table-column>-->
      </template>
      <template #empty>
        <Not-Found-Data text="Nenhuma Plano encontrado!"/>
      </template>
    </b-table>
    <!--    <b-modal v-if="viewPlanModal" :active.sync="viewPlanModal" @close="closeViewPlanModal" width="700px">-->
    <!--      <View-Plan :current-plan="currentPlan" @on-update-plan="handleUpdatePlan"/>-->
    <!--    </b-modal>-->
    <b-modal :active.sync="showNewPlanModal" width="600px">
      <CreatePlan @on-update-plan="handleUpdatePlan"/>
    </b-modal>
  </div>
</template>

<script>

import {mapGetters} from 'vuex'
import {faturasRequest} from '@/services/requests/faturas'
import {formatEnToBr, formatBrToEn, momentIntance} from '@/utils/momentHelpers'
import {monthNames} from '@/utils/utils'
import NotFoundData from '@/components/layouts/NotFoundData'
import CreatePlan from '@/views/financeiro/components/CreatePlan'
import VerFatura from '@/views/financeiro/components/VerFatura'
import Card from '@/components/helpers/Card'
import {plansRequest} from "../../services/requests/plans";

export default {
  name: 'Plans',
  components: {
    NotFoundData,
    CreatePlan
  },
  data: () => ({
    monthNames,
    dates: [],
    loading: false,
    columns: [
      {
        field: 'id',
        label: 'Número',
        sortable: true,
      },
      {
        field: 'name',
        label: 'Nome',
        sortable: true,
      },
      {
        field: 'price',
        label: 'Valor',
      },
      {
        field: 'interval_type',
        label: 'Intervalo',
      },
      {
        field: 'payable_with',
        label: 'Forma Pag.',
        sortable: true,
      },
      // {
      //   field: 'acoes',
      //   label: 'Ações',
      // },
    ],
    statusFatura: null,
    search: null,
    plansArray: [],
    resumo: [],
    currentPlan: null,
    viewPlanModal: false,
    showNewPlanModal: false,
  }),

  computed: {
    plans() {
      if (!this.plansArray || !this.search) {
        return this.plansArray
      }
      return this.plansArray.filter((data) => {
        let serializedFields = JSON.stringify({
          name: data.name,
          description: data.description
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
    openFaturaModal(fatura) {
      this.currentPlan = fatura
      this.viewPlanModal = true
    },
    openNewPlanModal() {
      this.showNewPlanModal = true
    },
    closeNovaFaturaModal() {
      this.showNewPlanModal = false
    },
    closeViewPlanModal() {
      this.currentPlan = null
      this.viewPlanModal = false
    },
    handleUpdatePlan() {
      this.closeNovaFaturaModal()
      this.closeViewPlanModal()
      this.fetchPlans()
    },
    getResumoStatusColor(status) {
      if (status === 'atrasado') return 'error-base'
      if (status === 'pendente') return 'warning-base'
      if (status === 'pago') return 'success-base'
      if (status === 'total') return 'info-base'
    }
  },
}
</script>

