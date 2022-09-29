<template>
  <div class="bg-white p-5 rounded w-full flex items-center">
    <div class="flex justify-center w-full" v-if="loading">
      <Lynx-Spinner size="12" />
    </div>
    <div v-else class="w-full">
      <div class="w-full flex justify-between items-center">
        <h2 class="flex flex-col text-lg md:text-base text-neutral-600">
          {{ header.title }}
        </h2>
        <label class="flex flex-col w-3/5 pb-6 pr-5 items-end">
          <Lynx-Label label="Data Historico" />
           <b-datepicker
          placeholder="Selecione uma data"
          icon="calendar-today"
          :month-names="monthNames"
          @input="fetchResults"
          v-model="form.data"
          range
        />
        </label>
      </div>

      <div class="pt-2 flex flex-col items-center w-full">
        <EmpresaStatusChart :values="dataSet" :label="label" />
      </div>
    </div>
  </div>
</template>

<script>
import EmpresaStatusChart from "@/views/charts/empresas/EmpresaStatusChart";
import { companiesOpeningStatsRequest } from "@/services/requests/charts";

import NotFoundData from "@/components/layouts/NotFoundData";
import moment from "moment";
import { monthNames, dayNames } from "@/utils/utils";
export default {
  name: "EmpresaStatus",
  components: { EmpresaStatusChart },
  data() {
    return {
      header: {
        title: "Status Pos cadastro",
        icon: "Document",
      },
      loading: true,
      dataSet: [],
      label: [],
      form: { data: "", carteira_id: null },
      monthNames,
      dayNames,
      moment,
    };
  },
  computed: {
    onboarding_search() {
      return this.$store.state.configEmpresa.onboarding_search;
    },
  },
  watch: {
    onboarding_search() {
      this.fetchResults();
    },
  },
  methods: {
    fetchResults() {
      this.form.carteira_id = this.onboarding_search;
      this.loading = true;
      companiesOpeningStatsRequest(this.form)
        .then((res) => {
          this.dataSet = res.data.datasets;
          this.label = res.data.label;
        })
        .finally(() => (this.loading = false));
    },
  },
  beforeMount() {
    this.fetchResults();
  },
};
</script>
