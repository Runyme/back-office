<script>

import { Bar, mixins } from "vue-chartjs";
import ChartJsPluginDataLabels from 'chartjs-plugin-datalabels'


const { reactiveProp } = mixins;

export default {
  extends: Bar,
  mixins: [reactiveProp],
  props: ['chartData', 'options'],

  mounted() {
    this.addPlugin(ChartJsPluginDataLabels);
    this.renderChart(this.chartData, this.options);
    this.$refs.canvas.parentNode.style.width = '100%'
    this.$refs.canvas.parentNode.style.height = '100%'
  },
};
</script>
