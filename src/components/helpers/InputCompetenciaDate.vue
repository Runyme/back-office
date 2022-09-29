<template>
  <b-datepicker
    placeholder="Selecione a data"
    icon="calendar-today"
    trap-focus
    :value="date"
    @input="handleInput"
    :month-names="nomesMeses"
    :position="position"
    :years-range="yearsRange"
    type="month"
    editable
    locale="pt-BR"
  />
</template>

<script>

import moment from 'moment'

export default {
  name: 'InputCompetenciaDate',
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
    }
  },
  computed: {
    date() {
      let date = moment().subtract(1, 'month').toDate()

      if (this.value) {
        date = moment(this.value, 'YYYY-MM-DD').toDate()
      }

      this.handleInput(date)

      return date
    },
  },
  methods: {
    handleInput(value) {
      this.$emit('input', moment(value).format('YYYY-MM-01'))
    },
  }
}
</script>
