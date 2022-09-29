<template>
  <div class="bg-neutral-300 p-8 flex items-start flex-col">
    <div class="flex items-center justify-between w-full">
      <Lynx-Title text="Financeiro"/>
    </div>

    <div class="w-full flex flex-col">
      <b-table :loading="loading" :data="faturas" hoverables>
        <template slot-scope="{row}">
          <b-table-column field="id" label="ID">

                  <b-checkbox v-model="fatAtrasadas[row.id]" :true-value="row.id"/>
           <!-- <b-checkbox v-model="fatAtrasadas"  class="w-full field"/> -->
               <!-- <b-radio-button v-model="fatAtrasadas" :native-value="row.id"> -->
          <!-- </b-radio-button> -->
          </b-table-column>
          <b-table-column field="subtotal" label="Valor">
            <span class="font-bold pr-2" v-text="row.subtotal"/>
          </b-table-column>

          <b-table-column field="data_competencia" label="Competência">
            <span>{{ moment(row.data_competencia).format('MM/YYYY') }}</span>
          </b-table-column>

          <b-table-column field="status" label="Status">
            <span>{{ row.status }}</span>
          </b-table-column>

          <b-table-column field="data_vencimento" label="Vencimento">
            <span>{{ moment(row.data_vencimento).format('DD/MM/YYYY') }}</span>
          </b-table-column>

          <b-table-column>
            <div class="flex items-center justify-end">
              <a :href="row.fatura_url" target="_blank" class="cursor-pointer mr-4">
                <Icon-Eye class="text-primary-500"/>
              </a>
            </div>
          </b-table-column>
        </template>
        <template #empty>
          <Not-Found-Data text="Nenhum registro foi encontrado"/>
        </template>
      </b-table>
    </div>
    <Lynx-Button
        text="Adicionar Fatura"
        icon="Plus"
        size="small"
        icon-size="4"
        @click.native="addFatura"
        class="self-start mb-5 mt-2"
        type="button"
      />
  </div>
</template>

<script>

import {mapGetters} from 'vuex'
import moment from 'moment'
import NotFoundData from '@/components/layouts/NotFoundData'
import {getInvoicesByPayerAtrasadasRequest} from "@/services/requests/faturas";

export default {
  name: 'HistoricoFinanceiro',
  components: {NotFoundData},
  props: {
    modelType: String,
    modelId: Number
  },
  data() {
    return {
      loading: false,
      faturas: [],
      fatAtrasadas:[]
    }
  },
  computed: {
    ...mapGetters(['getEmpresa', 'getToken'])
  },
  methods: {
    moment,
    fetchFaturas() {
      this.loading = true
      getInvoicesByPayerAtrasadasRequest(this.modelType, this.modelId)
        .then(({data}) => this.faturas = data)
        .finally(() => this.loading = false)
    },
    addFatura(){
        let arrayfat = [] 
        this.fatAtrasadas.forEach(element => {
            
            arrayfat.push(element)
        });
        console.log(arrayfat)
    }
  },
  beforeMount() {
    this.fetchFaturas()
  }
}
</script>
