<template>
  <b-datepicker
    placeholder="Selecione a data"
    icon="calendar-today"
    trap-focus
    :value="date"
    @input="handleInput"
    :month-names="nomesMeses"
    :day-names="nomesDias"
    :position="position"
    :years-range="yearsRange"
  >
  </b-datepicker>
</template>

<script>

import moment from 'moment'

export default {
  name: 'InputDate',
  props: {
    value: String,
    position: String,
    yearsRange: {
      type: Array,
      default: () => [-5, 5]
    },
  },
  data() {
    return {
      nomesMeses: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      nomesDias: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    }
  },
  computed: {
    date() {
      if (!this.value) {
        return []
      }

      return moment(this.value, 'YYYY-MM-DD').toDate()
    },
  },
  methods: {
    handleInput(value) {
      this.$emit('input', moment(value).format('YYYY-MM-DD'))
    },
  }
}
</script>
