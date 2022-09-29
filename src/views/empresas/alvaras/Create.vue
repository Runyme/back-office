<template>
  <div class="p-8 bg-neutral-300">
    <div class="flex flex-col">
      <Lynx-Title text="Criar Alvará"/>
      <form class="flex flex-col" @submit.prevent="onSubmit">

        <label class="flex flex-col pb-8">
          <Lynx-Label label="Número da Empresa"/>
          <Lynx-Input
            v-model="form.empresa_id"
            @input="debounce(inputEmpresa, 700)"
            :error="empresaError"
            required
          />
        </label>

        <label class="flex flex-col pb-8">
          <Lynx-Label label="Data de vencimento"/>
          <b-datepicker
            :years-range="[-1,5]"
            v-model="form.data_vencimento"
            :day-names="dayNames"
            :month-names="monthNames"
          />
        </label>

        <b-field class="file" required>
          <b-upload v-model="form.file" required>
            <a class="button is-primary">
              <b-icon icon="upload"></b-icon>
              <span>Realizar upload</span>
            </a>
          </b-upload>
          <span class="file-name" v-if="form.file">
            {{ form.file.name }}
          </span>
        </b-field>

        <Lynx-Button
          type="submit"
          class="self-end"
          text="Enviar"
          icon="Check"
          :loading="loadingButton"
        />
      </form>
    </div>
  </div>
</template>

<script>

  import {storeAlvarasRequest} from '@/services/requests/alvaras'
  import {empresasShowRequest} from '@/services/requests/empresas'
  import {monthNames, dayNames} from '@/utils/utils'
  import debounce from '@/mixins/debounce'
  import moment from 'moment'
  import base64Files from "../../../mixins/base64Files";

  export default {
    name: 'AlvaraCreate',
    mixins: [debounce, base64Files],
    data() {
      return {
        loadingButton: false,
        empresaError: true,
        monthNames,
        dayNames,
        form: {
          empresa_id: '',
          data_vencimento: new Date()
        },
        errorMessage: 'Não foi possivel criar o alvará',
      }
    },
    methods: {
      inputEmpresa() {
        this.loadingEstados = true
        empresasShowRequest(this.form.empresa_id)
          .then(() => this.empresaError = false)
          .catch(() => {
            this.empresaError = true
            this.$snack.error('A empresa não foi encontrada')
          })
      },
      async onSubmit() {
        if (this.empresaError) return this.$snack.error('Escolha uma empresa válida')
        this.loadingButton = true

        const form = {
          ...this.form,
          file: await this.convertFileToBase64(this.form.file),
          data_vencimento: moment(this.form.data_vencimento).format('YYYY-MM-DD')
        }
        storeAlvarasRequest(form)
          .then(() => {
            this.$emit('create-alvara')
            this.$snack.success('Alvará criado com sucesso')
          })
          .catch(err => this.$snack.error(err.response.data.message || this.errorMessage))
          .finally(() => this.loadingButton = false)
      },
    },
  }
</script>
