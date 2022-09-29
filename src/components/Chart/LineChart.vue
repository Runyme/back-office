<script>

import { Line, mixins } from 'vue-chartjs'
import Chart from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
Chart.plugins.unregister(ChartDataLabels)

const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['chartData', 'options'],
  mounted() {
    this.addPlugin(ChartDataLabels)
    this.renderChart(this.chartData, this.options)
    this.$refs.canvas.parentNode.style.width = '100%'
    this.$refs.canvas.parentNode.style.height = '100%'
  },
};
</script>
