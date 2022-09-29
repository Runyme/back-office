<template>
  <div class="bg-neutral-300 shadow p-8 flex flex-col">
    <Lynx-Title text="Editar Atividade Agendada"/>

    <div class="w-full flex justify-center" v-if="loading">
      <Lynx-Spinner size="12"/>
    </div>

    <form class="flex flex-col" @submit.prevent="submitForm">
      <div class="mb-12 flex-wrap">
        <label class="block px-2">
          <Lynx-Label label="Descrição"/>
          <b-input
            type="textarea"
            v-model="form.description"
            maxlength="255"
            required
          />
        </label>

        <div class="flex flex-wrap">
          <label class="block w-2/6 px-2">
            <Lynx-Label label="Recorrencia"/>
            <b-select v-model="form.recurrence" required>
              <option v-for="(recurrence, index) in this.recurrences" :key="index" :value="recurrence.value">
                {{ recurrence.label }}
              </option>
            </b-select>
          </label>

          <label class="block w-2/6 px-2">
            <Lynx-Label label="Status"/>
            <b-select v-model="form.status" required>
              <option v-for="(status, index) in this.statuses" :key="index" :value="status">
                {{ status }}
              </option>
            </b-select>
          </label>

          <label class="block w-2/6 px-2">
            <Lynx-Label label="Regime"/>
            <b-select v-model="form.tax_regime" required>
              <option v-for="(regime, index) in this.regimes" :key="index" :value="regime">
                {{ regime }}
              </option>
            </b-select>
          </label>
        </div>

        <div class="flex flex-wrap">
          <label class="block w-2/5 px-2">
            <Lynx-Label label="Meta"/>
            <b-datepicker
              placeholder="Selecione a data"
              icon="calendar-today"
              trap-focus
              v-model="form.goal"
              :month-names="nomesMeses"
              :day-names="nomesDias"
              required
            />
          </label>

          <label class="block w-2/5 px-2">
            <Lynx-Label label="Data Limite"/>
            <b-datepicker
              placeholder="Selecione a data"
              icon="calendar-today"
              trap-focus
              v-model="form.deadline"
              :month-names="nomesMeses"
              :day-names="nomesDias"
              required
            />
          </label>
        </div>

        <div class="flex flex-wrap">
          <b-table
            title="Carteiras"
            :data="wallters"
            :columns="wallterColumns"
            :checked-rows.sync="form.wallter_id"
            checkable
            sticky-checkbox
            striped
            required
          />
        </div>

        <label class="block px-2 py-3">
          <Lynx-Label label="Observações"/>
          <b-input
            type="textarea"
            v-model="form.observation"
            maxlength="255"
            required
          />
        </label>
      </div>

      <Lynx-Button
        type="submit"
        text="Confirmar"
        class="self-end"
        :loading="loading"
        :disable="loading"
      />
    </form>
  </div>
</template>

<script>

import moment from "moment";
import formMixin from '@/mixins/form'
import {
  getRecurrencesRequest,
  getStatusRequest,
  getRegimesRequest,
  getWalltersRequest,
  showAtividadeScheduleRequest,
  updateAtividadeScheduleRequest
} from '@/services/requests/atividades'

export default {
  name: 'ClientesCreateModal',
  mixins: [formMixin],
  comments: { getRecurrencesRequest, getStatusRequest, getRegimesRequest, getWalltersRequest,
    showAtividadeScheduleRequest, updateAtividadeScheduleRequest },
  props: [ 'activityId' ],
  data() {
    return {
      loading: false,
      form: {
        description: '',
        recurrence: '',
        observation: '',
        status: '',
        tax_regime: '',
        wallter_id: [],
        goal: null,
        deadline: null,
      },
      recurrences: [],
      statuses: [],
      regimes: [],
      wallters: [],
      wallterColumns: [
        {
          field: 'id',
          label: 'ID',
          width: '40',
          numeric: true
        },
        {
          field: 'nome',
          label: 'Nome',
        },
      ],
      nomesMeses: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      nomesDias: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    }
  },
  mounted() {
    this.getWallters();
    this.getAtividade();
    this.getRecurrences();
    this.getStatuses();
    this.getRegimes();
  },
  methods: {
    async getAtividade() {
      this.loading = true;
      showAtividadeScheduleRequest(this.activityId)
        .then(res => {
          this.form.description = res.data.data.description;
          this.form.recurrence = res.data.data.recurrence;
          this.form.observation = res.data.data.observation;
          this.form.status = res.data.data.status;
          this.form.tax_regime = res.data.data.tax_regime;
          this.form.goal = moment(res.data.data.goal)._d;
          this.form.deadline = moment(res.data.data.deadline)._d;

          this.form.wallter_id = res.data.data.wallters.map((element) => {
            return this.wallters.find(find => {
              return find.id === element.id
            });
          });
        })
        .catch(() => {
          this.$snack.error('Não foi possivel verificar a atividade');
        })
        .finality(() => {
          this.loading = false
        })
    },
    async getRecurrences() {
      this.loading = true;

      getRecurrencesRequest().
      then(res => {
        this.recurrences = res.data.data;
      })
        .catch(() => {
          this.$snack.error('Não foi possivel verificar as recorrencias');
        })
        .finally(() => {
          this.loading = false
        })
    },
    async getStatuses() {
      this.loading = true;

      getStatusRequest().
      then(res => {
        this.statuses = res.data.data;
      })
        .catch(() => {
          this.$snack.error('Não foi possivel verificar os status');
        })
        .finally(() => {
          this.loading = false;
        })
    },
    async getRegimes() {
      this.loading = true;

      getRegimesRequest().
      then(res => {
        this.regimes = res.data.data;
      })
        .catch(() => {
          this.$snack.error('Não foi possivel verificar os regimes');
        })
        .finally(() => {
          this.loading = false;
        })
    },
    async getWallters() {
      this.loading = true;

      getWalltersRequest().
      then(res => {
        this.wallters = res.data.data;
      })
        .catch(() => {
          this.$snack.error('Não foi possivel verificar as carteiras');
        })
        .finally(() => {
          this.loading = false;
        })
    },
    async submitForm() {
      this.loading = true

      if (!await this.validateForm()) {
        this.loading = false;
        this.$snack.error('Todos os campos são obrigatórios');
        return;
      }

      updateAtividadeScheduleRequest(this.form, this.activityId)
        .then(() => {
          this.$emit('updated')
        })
        .catch(() => {
          this.$snack.error('Ocorreu um erro ao atualizar a Tarefa, tente mais tarde');
        })
        .finally(() => this.loading = false);
    },
    async validateForm() {
      if (this.form.description === '') {
        return false;
      }

      if (this.form.recurrence === '') {
        return false;
      }

      if (this.form.observation === '') {
        return false;
      }

      if (this.form.status === '') {
        return false;
      }

      if (this.form.tax_regime === '') {
        return false;
      }

      if (this.form.wallter_id.length === 0) {
        return false;
      }

      if (this.form.goal === null) {
        return false;
      }

      if (this.form.deadline === null) {
        return false;
      }

      return true
    }
  },
}
</script>
