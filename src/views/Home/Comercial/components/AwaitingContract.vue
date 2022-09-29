<template>
  <div class="bg-white p-5 rounded flex items-center w-full transition hover:shadow-lg ">
    <div class="flex justify-center w-full" v-if="loading">
      <Lynx-Spinner size="12"/>
    </div>

    <div v-else class="w-full sticky">
      <h2 class="text-lg md:text-base text-neutral-600 transition">{{ header.title }}</h2>
      <div class="pt-2 flex flex-col items-center w-full">
        <div v-if="!dataSet.length">
          <not-found-data/>
        </div>
        <b-table
          v-else
          paginated
          :data="dataSet"
          per-page="4"
          class="w-full"
          default-sort="subtotal"
          default-sort-direction="desc">
          <template slot-scope="{row}">
            <b-table-column label="" field="id" sortable>
              <Avatar round :size="10" color="neutral">
                <Company/>
              </Avatar>
            </b-table-column>
            <b-table-column label="Id" field="id" v-text="row.id" sortable/>
            <b-table-column label="Nome" field="name" v-text="row.razao_social ? row.razao_social : row.nome_fantasia"
                            sortable/>
            <!--            <b-table-column label="Status" field="status" sortable>-->
            <!--              <span class="bg-primary-500 text-white rounded-lg px-2">{{ row.status_label }}</span>-->
            <!--            </b-table-column>-->
            <b-table-column label="Vendedor" field="vendedor" sortable v-text="row.vendedor.split(' ')[0]"/>
            <b-table-column label="Data cadastro" field="created_at" sortable
                            v-text="momentIntance(row.created_at).format('D/M/Y')"/>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
import {newSalesAwaitingContractRequest} from "@/services/requests/charts";
import Avatar from "@/components/shared/Avatar";
import Company from "@/components/icons/Company";
import NotFoundData from "@/components/layouts/NotFoundData";
import {momentIntance} from '@/utils/momentHelpers';

export default {
  name: "AwaitingContratc",
  components: {NotFoundData, Company, Avatar},
  data() {
    return {
      header: {
        title: 'Aguardando assinatura',
        icon: 'Money',
      },
      loading: true,
      dataSet: [],
    }
  },
  methods: {
    momentIntance,
    fetchDataSet() {
      newSalesAwaitingContractRequest()
        .then(res => {
          this.dataSet = res.data
        })
        .finally(() => this.loading = false)
    }
  },
  mounted() {
    this.fetchDataSet()
  }
}
</script>

<style scoped>

</style>
