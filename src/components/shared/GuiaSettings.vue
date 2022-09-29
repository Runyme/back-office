<template>
  <div class="bg-white p-5 rounded w-full">
    <h2 class="text-lg md:text-base text-neutral-600">Configurações</h2>
    <div class="text-center pt-8 mx-auto">
      <span class="text-xl text-neutral-500 font-display font-semibold">Vigência: </span>
      <span class="text-2xl text-neutral-600 font-display font-semibold" v-text="competenciaDate"/>
      <Lynx-Button
        class="mt-6 mx-auto"
        text="Configurar"
        icon="Document"
        @click.native="openGuiaModalConfig"
        :outlined="true"
      />
    </div>

    <b-modal :active.sync="isConfiguring">
      <div class="p-8 flex flex-col items-center bg-neutral-300 mx-auto rounded pb-24">
        <div class="mt-8 w-144">
          <div class="border-b-2 border-neutral-400 pb-6">
            <form @submit.prevent="onSubmit" class="flex justify-between">
              <div class="flex w-full">
                <label class="flex flex-col w-full">
                  <Lynx-Label label="Data de competência em vigência"/>
                  <b-datepicker
                    type="month"
                    placeholder="Selecione a data de competência"
                    icon="calendar-today"
                    :month-names="monthNames"
                    v-model="newDate"
                  />
                </label>
              </div>
              <div class="flex">
                <Lynx-Button class="ml-4 self-end" type="submit" text="Enviar" icon="Check"/>
              </div>
            </form>
          </div>

          <div class="border-b-2 border-neutral-400 pb-6">
            <Lynx-Button
              class="w-full mt-6"
              text="Vencimento Guias"
              icon="Calendar"
              @click.native="openGuiaDatasPadrao"
              :outlined="true"
            />
          </div>

          <div class="flex mt-6 justify-between">
            <span class="text-xl text-neutral-600">Envio automático de guias <span
              class="has-text-weight-bold">{{ scheduleGuias.is_active ? 'Ativo' : 'Desativado' }}</span></span>
            <b-switch @input="changeActivationSendGuia" true-value="1" v-model="scheduleGuias.is_active"></b-switch>
          </div>
        </div>
      </div>
    </b-modal>

    <b-modal :active.sync="guiaDatasPadraoModal">
      <div class="p-8 bg-neutral-300">
        <GuiaDatasPadrao/>
      </div>
    </b-modal>
  </div>
</template>

<script>

import {monthNames} from "@/utils/utils";
import {mapActions, mapGetters} from "vuex";
import moment from "moment";
import {activateScheduleRequest, deactivateScheduleRequest, getScheduleRequest} from "@/services/requests/scheduleJobs";
import GuiaDatasPadrao from "@/components/shared/GuiaDatasPadrao";

export default {
  name: 'GuiaSettings',
  components: {GuiaDatasPadrao},
  data() {
    return {
      monthNames,
      newDate: null,
      guiaDatasPadraoModal: false,
      isConfiguring: false,
      scheduleGuias: {},
      header: {
        title: 'Status dos Contratos',
        icon: 'Document'
      }
    }
  },
  computed: {
    ...mapGetters(['getCompetenciaDate', 'getUser']),
    competenciaDate() {
      return moment(this.getCompetenciaDate, 'YYYY-MM-DD').format('MM/YYYY')
    }
  },
  methods: {
    changeActivationSendGuia(value) {
      if (value === false) {
        deactivateScheduleRequest('send-guias')
          .catch(() => {
            this.$snack.error('Não foi possível  a')
            this.scheduleGuias.is_active = 1
          })
        return
      }

      activateScheduleRequest('send-guias')
        .catch(() => {
          this.$snack.error('Não foi possível Ativar')
          this.scheduleGuias.is_active = false
        })
    },
    openGuiaModalConfig() {
      this.fetchScheduleJobGuias()
      this.isConfiguring = true
    },
    fetchScheduleJobGuias() {
      getScheduleRequest('send-guias')
        .then(response => this.scheduleGuias = response.data)
        .catch(() => this.$snack.error('Erro ao carregar agendamento de envio automático.'))
    },
    ...mapActions(['setCompetenciaDate']),
    onSubmit() {
      if (!this.newDate) {
        this.$snack.error('Selecione uma nova data de competência')
        return
      }
      const date = moment(this.newDate).set('date', 1).format('YYYY-MM-DD')
      this.setCompetenciaDate(date)
      this.$snack.success('Data de competência alterada com sucesso')
      window.location.reload()
    },
    openGuiaDatasPadrao() {
      this.guiaDatasPadraoModal = true
    },
  }
}
</script>
