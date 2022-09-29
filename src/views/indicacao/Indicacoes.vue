<template>
  <div>
    <b-loading :active.sync="loading"/>
    <div class="w-full flex justify-between items-start">
      <Lynx-Title text="Indicações"/>

      <div class="flex flex-row-reverse items-end mb-4">
        <b-button
          class="is-primary ml-4"
          icon-right="refresh"
          @click.native="fetchInvites"
        >
          Atualizar Lista
        </b-button>
      </div>
    </div>
      <div class="flex flex-col">
      <div class="w-full flex">
        <label class="flex flex-col w-1/2 pb-6 pr-3">
          <Lynx-Label label="Data Inicial" />
          <b-datepicker
            v-model="form.data_inicio"
            placeholder="Selecione uma data"
            :date-formatter="
              (date) => moment(date, 'YYYY/MM/DD').format('DD/MM/YYYY')
            "
            :date-parser="(date) => new Date(date)"
            :month-names="monthNames"
            :day-names="dayNames"
            :years-range="[-20, 10]"
          />
        </label>
        <label class="flex flex-col w-1/2 pb-6 pr-3">
          <Lynx-Label label="Data Final" />
          <b-datepicker
            v-model="form.data_fim"
            placeholder="Selecione uma data"
            :date-formatter="
              (date) => moment(date, 'YYYY/MM/DD').format('DD/MM/YYYY')
            "
            :date-parser="(date) => new Date(date)"
            :month-names="monthNames"
            :day-names="dayNames"
            :years-range="[-20, 10]"
          />
        </label>
      
        <label class="flex flex-col w-1/2 pb-6 pr-3">
           
          <Lynx-Button
            text="Relatorio Alvara"
            class="mb-4"
            style="margin-top:32px;"
            @click.native="gerarRelatorio()"
            size="small"
            icon-size="3"
          />
        </label>
      </div>
    </div>

    <b-table :data="invites" paginated per-page="10">
      <template slot-scope="props">
        <b-table-column label="#" field="id" v-text="props.row.id"/>
        <b-table-column label="Cliente" field="customer_cpf">
          {{ props.row | customerTreatment }}
        </b-table-column>
        <b-table-column label="Status" field="status">
          {{ props.row.status }}
        </b-table-column>
        <b-table-column label="Indicação" field="invitee_name">
          {{ props.row.invitee_name }}
        </b-table-column>
        <b-table-column label="Contato" field="invitee_phone">
          <p>{{ props.row.invitee_phone }}</p>
          <p>{{ props.row.invitee_email }}</p>
          <p>{{ props.row.invitee_cpf }}</p>

        </b-table-column>
        <b-table-column>
          <div class="flex text-sm items-center">
            <a href="#" class="mr-4 bg-primary-600 rounded-full p-2">
              <Icon-Eye class="text-neutral-100" size="4"/>
            </a>
            <a href="#" class="bg-error-base rounded-full p-2" @click.prevent="deleteInvitee(props.row)">
              <Icon-Trash class="text-neutral-100" size="4"/>
            </a>
          </div>
        </b-table-column>
      </template>
      <template v-slot:empty>
        <NotFoundData text="Nenhum convite encontrado!"/>
      </template>
    </b-table>
  </div>
</template>

<script>
import NotFoundData from "@/components/layouts/NotFoundData";
import {deleteInviteRequest, getInvitesRequest} from "@/services/requests/invites";
import { monthNames, dayNames } from '@/utils/utils'
import moment from "moment";

export default {
  name: "Indicacoes",
  components: {NotFoundData},
  data() {
    return {
         monthNames,
      dayNames,
      moment,
      loading: false,
      invites: [],
         form: {
        data_inicio: new Date(),
        data_fim: new Date(),
      
      },
    }
  },
  mounted() {
    this.fetchInvites()
  },
  filters: {
    customerTreatment(value) {
      let name = ''
      if (value.customer && value.customer.empresa) {
        name += value.customer.empresa.map(a => a.id).join(', ')
        name += ' - ' + value.customer.nome_completo.split(' ')[0]
      } else if (value.customer) {
        name += value.customer.nome_completo.split(' ')[0]
      }
      return name
    }
  },
  methods: {
    deleteInvitee(item) {
      if (!confirm('Tem certeza que deseja remover este convidado?')) {
        return
      }
      this.loading = true
      deleteInviteRequest(item.id)
        .then(() => this.fetchInvites())
        .catch(error => this.$snack.error(error.response.data.message || 'Erro ao deletar'))
        .finally(() => this.loading = false)
    },
    fetchInvites() {
      this.loading = true
      getInvitesRequest(this.form)
        .then(response => this.invites = response.data)
        .catch(error => this.$snack.error(error.response.data.message))
        .finally(() => this.loading = false)
    },
      gerarRelatorio() {
   

      this.$store.dispatch('empresas/gerarRelatorioIndicacao',this.form)
    },
  }
}
</script>

<style scoped>

</style>
