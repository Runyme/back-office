<template>
  <div>
    <b-loading :active.sync="isLoading" />
    <div id="requests">
      <Lynx-Title text="Ordem de serviço - Solicitações"/>
      <div>
        <div class="flex justify-between pb-6">
          <div class="flex">
            <b-select 
              class="mr-4" 
              placeholder="Selecione o status" 
              @input="debounce(searchServiceOrder, 100)" 
              v-model="search"
            >
              <option
                v-for="option in status"
                :value="option.value"
                :key="option.key">
                {{ option.key }}
              </option>
            </b-select>
            <b-datepicker
              :month-names="monthNames"
              :day-names="dayNames"
              v-model="searchData"
              @input="debounce(searchServiceOrder, 100)"
              placeholder="Selecione uma data"
              icon="calendar-today"
              editable
            />
          </div>
          <Lynx-Button 
            text="Nova Solicitação" 
            icon="Plus" 
            icon-size="3" 
            size="small" 
            @click.native="goToOrderServiceCreate" 
          />
        </div>
        <b-table :data="data">
          <template slot-scope="props">
            <b-table-column field="id" label="Número" v-text="props.row.id" sortable />
            <b-table-column class="truncate" style="max-width: 1px;" field="empresa" label="Empresa" v-text="props.row.empresa" :title="props.row.empresa" sortable />
            <b-table-column class="align-middle" field="progresso" label="Progresso" sortable>
              <b-progress size="is-large" type="is-success" :value="props.row.progresso" show-value format="percent" />
            </b-table-column>
            <b-table-column field="responsavel" label="Responsável" v-text="props.row.responsavel" sortable />
            <b-table-column field="created_at" label="Data Solicitação" v-text="props.row.created_at" sortable />
            <b-table-column field="data_limite" label="Data Limite" v-text="props.row.data_limite" sortable />
            <b-table-column>
              <div @click="goToExecutePage(props.row.id)">
                <b-tooltip
                  label="Executar"
                  class="cursor-pointer"
                >
                  <Icon-Play class="text-primary-600"/>
                </b-tooltip>
              </div>
            </b-table-column>
          </template>
          <template #empty>
            <div class="w-full flex justify-center">
              <Not-Found-Data text="Nenhuma ordem de serviço foi encontrada" />
            </div>
          </template>
        </b-table>
        <div class="float-right m-4">
          <b-pagination
            :total="pagination.total"
            :current.sync="pagination.currentPage"
            :per-page="pagination.perPage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { serviceOrderRequest } from '@/services/requests/service-order'
import debounce from '@/mixins/debounce'
import Progress from '@/components/globals/Progress'
import { monthNames, dayNames } from '@/utils/utils'
import NotFoundData from '@/components/layouts/NotFoundData'

export default {
  name: 'ServiceOrderIndex',
  components: { Progress, NotFoundData },
  mixins: [ debounce ],
  data() {
    return {
      isLoading: false,
      monthNames,
      dayNames,
      status: [
        {
          key: 'Pendente',
          value: 'pendente'
        },
        {
          key: 'Concluído',
          value: 'concluido'
        },
        {
          key: 'Todos',
          value: 'todos'
        },
      ],
      search: 'pendente',
      searchData: null,
      data: [
        {},
      ],
      pagination: {
        total: 10,
        currentPage: 1,
        perPage: 10,
      },
    }
  },
  created() {
    this.setParamsOnPaginationOrRoute()
    this.searchServiceOrder()
  },
  methods: {
    setParamsOnPaginationOrRoute() {
      const { query } = this.$router.currentRoute

      if (!query.page) {
        return this.setPageParamsOnRoute()
      }

      this.pagination = {
        ...this.pagination,
        currentPage: query.page,
      }

      this.search = query.search || 'pendente'
    },

    setPageParamsOnRoute() {
      const { currentPage } = this.pagination

      this.$router.push({
        query: {
          page: currentPage,
          search: this.search
        }
      })
    },
    searchServiceOrder() {
      this.isLoading = true
      const queryString = this.buildQueryString()
      serviceOrderRequest(queryString)
        .then(({data: {data, meta}}) => {
          this.data = data
          this.pagination.currentPage = meta.current_page
          this.pagination.total = meta.total
          this.pagination.perPage = meta.per_page
          this.setPageParamsOnRoute()
        })
        .finally(() => this.isLoading = false)
    },
    buildQueryString() {
      const {currentPage, perPage} = this.pagination

      let queryString = `?page=${ currentPage }&per-page=${ perPage }`

      if (this.search && this.search !== 'todos') {
        queryString += `&search=${ this.search }`
      }

      if (this.searchData !== null) {
        queryString += `&search-data=${ this.searchData.toLocaleDateString() }`;
      }

      return queryString;

    },
    goToOrderServiceCreate() {
      this.$router.push({name: 'request.create'})
    },
    goToExecutePage(id) {
      this.$router.push({path: `/service-order/request/${ id }`})
    }
  },
  watch: {
    'pagination.currentPage': {
      handler: function () {
        this.searchServiceOrder();
        this.setPageParamsOnRoute();
      },
      deep: true
    }
  }
}
</script>