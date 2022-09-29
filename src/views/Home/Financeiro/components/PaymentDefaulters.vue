<template>
  <div class="bg-white p-5 rounded flex items-center w-full transition hover:shadow-lg ">
    <div class="flex justify-center w-full" v-if="loading">
      <Lynx-Spinner size="12"/>
    </div>

    <div v-else class="w-full sticky">
      <h2 class="text-lg md:text-base text-neutral-600 transition">{{ header.title }}</h2>
      <div class="pt-2 flex flex-col items-center w-full">
        <b-table paginated :data="dataSet" per-page="4" class="w-full" default-sort="subtotal"
                 default-sort-direction="desc">
          <template slot-scope="{row}">
            <b-table-column label="" field="type" sortable>
              <div class="flex items-center text-center">
                <Avatar round :size="10" color="neutral">
                  <User v-if="row.type === 'cliente'"/>
                  <Company v-else/>
                </Avatar>
              </div>
            </b-table-column>
            <b-table-column label="Id" field="id" v-text="row.id" sortable/>
            <b-table-column label="Nome" field="name" v-text="row.name" sortable/>
            <b-table-column label="Total" field="subtotal" v-text="'R$ ' + row.subtotal" sortable/>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
import {paymentDefaultersRequest} from "@/services/requests/charts";
import Avatar from "@/components/shared/Avatar";
import User from "@/components/icons/User";
import Company from "@/components/icons/Company";

export default {
  name: "PaymentDefaulters",
  components: {Company, User, Avatar},
  data() {
    return {
      header: {
        title: 'Inadimplentes',
        icon: 'Money',
      },
      loading: true,
      dataSet: [],
    }
  },
  methods: {
    fetchDataSet() {
      paymentDefaultersRequest()
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
