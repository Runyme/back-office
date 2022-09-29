<template>
  <div>
    <Lynx-Title text="Data de vencimento das guias"/>
    <div class="w-full flex justify-center" v-if="loading">
      <Lynx-Spinner size="12"/>
    </div>
    <div class="w-full flex flex-col" v-else >
      <form class="flex flex-col" @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-8">
          <label class="flex items-center" v-for="(guia, index) in guias" :key="guia.id">
            <span class="font-semibold pr-2 text-xl" v-text="guia.tipo"/>
            <b-datepicker
              placeholder="Selecione a data de vencimento"
              icon="calendar-today"
              :month-names="monthNames"
              :day-names="dayNames"
              v-model="form[index].data_vencimento"
              v-if="isEditting"
            />
            <span class="text-primary-600 font-semibold pl-2" v-else>
              {{ guia.data_vencimento | date }}
            </span>
          </label>
        </div>
        <Lynx-Button class="mt-4 self-end" type="button" text="Editar" icon="Edit" @click.native="edit" v-if="!isEditting" />
        <div class="flex justify-between mt-8" v-else>
          <Lynx-Button type="button" text="Cancelar" outlined="true" @click.native="cancelEdit" />
          <Lynx-Button type="submit" text="Enviar" icon="Check" />
        </div>
      </form>
    </div>
  </div>
</template>

<script>

import moment from 'moment'
import { guiasDatasPadraoIndexRequest, guiasDatasPadraoUpdateRequest } from '@/services/requests/guiaDatasPadrao'
import { monthNames, dayNames } from '@/utils/utils'

export default {
  name: 'GuiaDatasPadrao',
  data() {
    return {
      monthNames,
      dayNames,
      guias: [],
      form: [],
      isEditting: false,
      loading: false,
      loadingButton: false,
    }
  },
  filters: {
    date(val) {
      return moment(val).format('DD/MM/YYYY')
    }
  },
  methods: {
    fetchGuias() {
      this.loading = true
      guiasDatasPadraoIndexRequest()
        .then(res => this.guias = res.data)
        .finally(() => this.loading = false)
    },
    onSubmit() {
      const form = this.form.map(curr => {
        return {
          ...curr,
          data_vencimento: moment(curr.data_vencimento).format('YYYY-MM-DD')
        }
      })
      this.loadingButton = true
      guiasDatasPadraoUpdateRequest(form)
        .then(res => {
          this.guias = res.data
          this.$snack.success('Vencimento alterado com sucesso')
          this.cancelEdit()
        })
        .catch(() => this.$snack.error('Não foi possivel alterar as datas'))
        .finally(() => this.loadingButton = false)
    },
    clearForm() {
      this.form = JSON.parse(JSON.stringify(this.guias))
      this.form = this.form.map(curr => {
        curr.data_vencimento = new Date(moment(curr.data_vencimento))
        return curr
      })
    },
    edit() {
      this.clearForm()
      this.isEditting = true
    },
    cancelEdit() {
      this.clearForm()
      this.isEditting = false
    }
  },
  beforeMount() {
    this.fetchGuias()
  }
}
</script>