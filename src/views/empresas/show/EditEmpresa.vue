<template>
  <div class="bg-neutral-300 p-8 flex items-start flex-col">
    <div class="flex items-center justify-between w-full">
      <Lynx-Title text="Editar dados da empresa"/>
    </div>

    <div class="w-full flex justify-center" v-if="loading">
      <Lynx-Spinner size="12"/>
    </div>

    <form @submit.prevent="onSubmit" v-else>
      <div class="grid grid-cols-4 gap-4">

        <label class="flex flex-col col-span-2">
          <Lynx-Label label="Razão Social"/>
          <Lynx-Input
            :disabled="$hasRole('Super Contador')"
            v-model="form.razao_social"
            required
          />
        </label>

        <label class="flex flex-col col-span-2">
          <Lynx-Label label="CNPJ"/>
          <Lynx-Input
            :disabled="$hasRole('Super Contador')"
            v-model="form.cnpj"
            required
          />
        </label>

        <label class="flex flex-col">
          <Lynx-Label label="Inscrição Municipal"/>
          <Lynx-Input
            :disabled="$hasRole('Super Contador')"
            v-model="form.inscricao_municipal"
            required
          />
        </label>

        <label class="flex flex-col">
          <Lynx-Label label="Data de Início"/>
          <InputDate v-model="form.inicio_atividades"/>
        </label>

        <label class="flex flex-col">
          <Lynx-Label label="Tipo de empresa"/>
          <b-select v-model="form.type">
            <option
              v-for="option in type_options"
              :key="option.id"
              :value="option.value"
              v-text="option.label"
            />
          </b-select>
        </label>

        <label class="flex flex-col">
          <Lynx-Label label="NIRE"/>
          <Lynx-Input
            v-model="form.nire"
            required
          />
        </label>

        <div class="col-span-4 border-b-2 border-neutral-400 mt-4 pb-2">
          <h3 class="text-2xl text-neutral-700">Regime tributário</h3>

        </div>

        <label class="flex flex-col">
          <Lynx-Label label="Regime Tributário"/>
          <b-select v-model="form.regime_tributario" @input="changedRegime">
            <option
              v-for="(option, key) in regime_tributario_options"
              :key="key"
              :value="option.value"
              v-text="option.label"
            />
          </b-select>
        </label>

        <label class="flex flex-col" v-if="originalData.regime_tributario !== form.regime_tributario">
          <Lynx-Label label="Motivo"/>
          <Lynx-Input
            v-model="form.regimeTributario.description"
            required
            placeholder="ex: Enquadramento"
          />
        </label>

        <label class="flex flex-col" v-if="originalData.regime_tributario !== form.regime_tributario">
          <Lynx-Label label="Data da mudança"/>
          <InputCompetenciaDate
            position="is-top-left"
            v-model="form.regimeTributario.occurred_at"
            required
          />
        </label>
      </div>

      <div class="flex justify-end self-start py-4 w-full mt-10">
        <Lynx-Button text="Salvar" type="submit" :loading="loadingSubmit" :disabled="loadingSubmit"/>
      </div>
    </form>
  </div>
</template>

<script>
import {dayNames, monthNames} from "@/utils/utils";
import moment from 'moment'
import InputDate from "@/components/helpers/InputDate";
import {empresasUpdateRequest} from "@/services/requests/empresas";
import InputCompetenciaDate from "@/components/helpers/InputCompetenciaDate";

export default {
  name: "EditEmpresa",
  components: {InputCompetenciaDate, InputDate},
  props: {
    empresa: Object
  },
  data() {
    return {
      monthNames,
      dayNames,
      loading: false,
      loadingSubmit: false,
      form: {...this.empresa},
      regime_tributario_options: [
        {
          value: 'SN',
          label: 'Simples Nacional'
        },
        {
          value: 'Presumido',
          label: 'Presumido'
        },
        {
          value: 'Isento',
          label: 'Isento'
        },
         {
          value: 'Eand',
          label: 'Aguardando enquadramento'
        }
      ],
      type_options: [
        {
          value: 'normal',
          label: 'Normal'
        },
        {
          value: 'clinica',
          label: 'Clinica'
        },
        {
          value: 'atletica',
          label: 'Atléticas'
        }
      ],
      originalData: {...this.empresa}
    }
  },
  methods: {
    moment,
    onSubmit() {
      this.loadingSubmit = true
      empresasUpdateRequest(this.empresa.id, this.form)
        .then(() => {
          this.$snack.success('Informações atualizadas com sucesso')
          this.$emit('updated')
        })
        .catch(() => this.$snack.error('Não foi possivel aterar as informações'))
        .finally(() => this.loadingSubmit = false)
    },
    changedRegime() {
      if (this.originalData.regime_tributario !== this.form.regime_tributario) {
        this.form.regimeTributario = {
          old_value: this.originalData.regime_tributario,
          new_value: this.form.regime_tributario
        }
      } else {
        this.form.regimeTributario = null
      }
    }
  },
}
</script>

<style scoped>

</style>
