<template>
  <div class="bg-white p-5 rounded w-full flex items-center">
    <div class="flex justify-center w-full" v-if="loadingChart">
      <Lynx-Spinner size="12" />
    </div>

    <div class="w-full" v-else>
      <!-- <h2 class="text-lg md:text-base text-neutral-600">Guias</h2> -->
      <div class="w-full flex justify-between items-center">
        <h2 class="flex flex-col text-lg md:text-base text-neutral-600">
          Guias
        </h2>
        <label class="flex flex-col w-2/4 pb-6 pr-5 items-end">
          <Lynx-Label label="Carteiras" />

          <b-select
            class="form"
            placeholder="Selecione as carteiras..."
            v-model="carteira"
            @input="fetchResumoGuias"
          >
            <option value="">Todos</option>
            <option
              v-for="item in lista_carteiras"
              :key="item.id"
              :value="item.id"
            >
              {{ item.label }}
            </option>
          </b-select>
        </label>
      </div>
      <div class="pt-2 flex flex-col items-center w-full">
        <ResumoGuiasChart :values="dataSet" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ResumoGuiasChart from "@/views/charts/ResumoGuiasChart";
import { monthlyTaxesStatsRequest } from "@/services/requests/charts";

// import the component
import Treeselect from "@riophae/vue-treeselect";
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "ResumoGuias",

  components: { ResumoGuiasChart, Treeselect },
  data() {
    return {
      dataSet: {},
      loadingChart: true,
      carteira: null,
    };
  },
  computed: {
    ...mapGetters(["getCompetenciaDate"]),
    lista_carteiras() {
      //  return this.$store.state.carteira.lista_carteiras;

      let carteira = Object.values(this.$store.state.carteira.lista_carteiras);
      let data = [];
      for (let i = 0; i < carteira.length; i++) {
        if (carteira[i].setor == "contabilidade") {
          data.push({ id: carteira[i].id, label: carteira[i].nome });
        }
      }
      return data;
    },
  },
  methods: {
    fetchResumoGuias() {
      this.listar_carteiras();

      this.loadingChart = true;
      const dataCompetencia = this.$store.getters.getCompetenciaDate;
      const carteira = this.carteira;

      monthlyTaxesStatsRequest(dataCompetencia, carteira)
        .then((res) => {
          if (!res.data.enviado && !res.data.aguardando) return;
          this.dataSet = res.data;
        })
        .finally(() => (this.loadingChart = false));
    },

    listar_carteiras() {
      this.$store.dispatch("carteira/listar_carteiras");
    },
  },
  mounted() {
    this.fetchResumoGuias();
  },
};
</script>
