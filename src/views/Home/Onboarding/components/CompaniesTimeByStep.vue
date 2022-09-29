<template>
  <div class="bg-white p-5 rounded w-full flex items-center">
    <div class="flex justify-center w-full" v-if="loading">
      <Lynx-Spinner size="12" />
    </div>
    <div v-else class="w-full relative">
      <h2 class="text-lg md:text-base text-neutral-600 mb-3 pb-6 pr-5 ">{{ header.title }}</h2>
      <div class="pt-2 flex flex-col items-center w-full">
        <div class="flex justify-center max-w-full w-full h-100">
          <transition name="fade" mode="out-in">
            <NotFoundData
              text="Dados insuficientes para exibir o gráfico!"
              v-if="!chartData.datasets.length"
            />
            <BarChart :chart-data="chartData" :options="chartOptions" v-else />
          </transition>
        </div>
      </div>

      <div class="flex absolute right-0 top-0">
        <b-field>
          <b-radio-button
            @input="fetchResults"
            v-model="measurementUnity"
            native-value="days"
            size="is-small"
          >
            <span>Dias</span>
          </b-radio-button>

          <b-radio-button
            @input="fetchResults"
            v-model="measurementUnity"
            native-value="hours"
            size="is-small"
          >
            <span>Horas</span>
          </b-radio-button>
        </b-field>
      </div>
    </div>
  </div>
</template>

<script>
import { companiesTimeByStepRequest } from "@/services/requests/charts";
import { twColors, twFonts } from "@/services/tailwindConfig";
import BarChart from "@/components/Chart/BarChart";

export default {
  name: "CompaniesTimeByStep",
  components: { BarChart },
  data() {
    return {
      header: {
        title: "Tempo Médio Por Etapa",
        icon: "Document",
      },
      loading: true,
      measurementUnity: "hours",
      dataSet: [],
      label: [],
      notFoundMessage: "",
      maxDataValue: 10,
    };
  },
  computed: {
    onboarding_search() {
      return this.$store.state.configEmpresa.onboarding_search;
    },
    chartData() {
      return {
        labels: this.label,
        datasets: this.dataSet,
      };
    },
    chartOptions() {
      return {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                suggestedMax: this.maxDataValue,
              },
            },
          ],
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
          position: "right",
          labels: {
            fontSize: 0,
            fontColor: twColors.neutral[700],
            fontFamily: twFonts.body[0],
            padding: 20,
          },
        },
        plugins: {
          datalabels: {
            anchor: "end",
            align: "top",
            formatter: (val) =>
              `${val} ${this.measurementUnity === "hours" ? "Horas" : "Dias"}`,
            font: {
              weight: "bold",
            },
          },
        },
      };
    },
  },
  watch: {
    onboarding_search() {
      this.fetchResults();
    },
  },
  methods: {
    fetchResults() {
      this.loading = true
      companiesTimeByStepRequest({ measure: this.measurementUnity,carteira_id: this.onboarding_search } )
        .then((res) => {
          this.updateMaxDataValue();
          this.dataSet = res.data.datasets;
          this.label = res.data.label;
        })
        .finally(() => (this.loading = false));
    },
    updateMaxDataValue() {
      let maxDataValue = this.dataSet.map((item) => Math.max(...item.data));
      maxDataValue = Math.max(...maxDataValue);
      this.maxDataValue = maxDataValue + 10;
    },
  },
  beforeMount() {
    this.fetchResults();
  },
};
</script>
