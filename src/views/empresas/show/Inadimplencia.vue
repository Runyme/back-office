<template>
  <div class="flex items-start">

    <div class="p-4 bg-error-lighter rounded border-l-4 border-error-dark flex flex-row justify-between w-full">
      <div class="flex items-center ">
        <Icon-Info class="text-error-dark"/>
        <span class="pl-4 font-semibold text-error-dark">Empresa com inadimplencia</span>
      </div>
      <Lynx-Button text="Ver Inadimplencias" icon="Eye" color="error-dark" size="small"
                   @click.native="inadimplenciaModal = true"/>
    </div>

    <b-modal :active.sync="inadimplenciaModal">
      <div class="p-8 bg-neutral-300 flex flex-col">
        <Lynx-Title text="Inadimplências"/>
        <div class="max-w-full overflow-x-auto mb-8 shadow hover:shadow-xl transition">
          <b-table
            class="lynx-table lynx-table--error"
            :data="faturas"
            checkable
            :checked-rows.sync="form.invoces"
          >

            <template slot-scope="props">
              <b-table-column field="id" label="ID" width="20">
                {{ props.row.id }}
              </b-table-column>

              <b-table-column field="subtotal" label="Valor" width="30">
                {{ props.row.subtotal }}
              </b-table-column>

              <b-table-column field="status" label="Status" width="30">
                {{ props.row.status }}
              </b-table-column>

              <b-table-column label="Vencimento" width="30">
                {{ moment(props.row.data_vencimento).format('DD/MM/YYYY') }}
              </b-table-column>

              <b-table-column label="Mês" width="30">
                {{ props.row.mes }}
              </b-table-column>

              <b-table-column width="30">
                <b-tooltip :label="copiado === props.row.pix_qrcode_text ? 'Copiado' : 'QRCode do PIX'">
                  <button class="ml-2" @click="copyPixQrCode(props.row.pix_qrcode_text)">
                    <b-icon icon="content-copy" size="is-small"></b-icon>
                  </button>
                </b-tooltip>
              </b-table-column>
            </template>

            <thead class="lynx-table__header">
            <tr>
              <th>Valor</th>
              <th>Status</th>
              <th>Mês</th>
              <th>Vencimento</th>
            </tr>
            </thead>
            <tbody class="lynx-table__body">
            <tr v-for="inadimplencia in faturas" v-bind:key="inadimplencia.id">
              <td data-title="Valor">R$ {{ inadimplencia.subtotal }}</td>
              <td data-title="Status">{{ inadimplencia.status }}</td>
              <td data-title="Mês">{{ inadimplencia.mes }}</td>
              <td data-title="Vencimento">{{ moment(inadimplencia.data_vencimento).format('DD/MM/YYYY') }}</td>
            </tr>
            </tbody>
          </b-table>
        </div>

        <div class="flex flex-col-2 justify-between">
          <div class="flex flex-col-2">
            <label>
              <Lynx-Input placeholder="emails" v-model="form.email"/>
            </label>
            <b-button class="is-primary ml-4" @click="sendFaturas()" :disabled="loadingRequest"
                      :loading="loadingRequest">Enviar
            </b-button>
          </div>
          <div
            class="bg-white text-error-base px-4 py-2 shadow transition hover:shadow-xl font-light font-display rounded self-end">
            <p>Total: <span class="font-medium">R$ {{ totalFatura }}</span></p>
          </div>
        </div>
      </div>
    </b-modal>

  </div>
</template>

<script>
import moment from "moment";
import {getInvoicesByPayerRequest, sendInvoiceRequest} from "../../../services/requests/faturas";
import {mapGetters} from "vuex";

export default {
  name: "Inadimplencia",
  props: ['faturas'],
  data() {
    return {
      loadingRequest: false,
      inadimplenciaModal: false,
      copiado: false,
      form: {
        payer_type: 'empresa',
        email: null,
        invoices: []
      },
    }
  },
  computed: {
    ...mapGetters(['getEmpresa']),
    totalFatura() {
      let valores_faturas = this.faturas.map(curr => Number(curr.subtotal));
      return valores_faturas.reduce((acc, curr) => acc + curr);
    },
  },
  methods: {
    copyPixQrCode(value) {
      if(!value) return this.$snack.error('Pix não disponível para esta fatura.')
      this.$copyText(value)
      this.copiado = value
      setTimeout(() => this.copiado = false, 1500)
    },
    moment,
    sendFaturas() {
      this.loadingRequest = true
      let data = this.form
      data.invoices = this.form.invoces.map(item => item.id)
      data.payer_id = this.getEmpresa.id
      sendInvoiceRequest(data)
        .then(response => {
          this.$snack.success(response.data.message)
          this.fetchInvoices()
        })
        .catch(error => this.$snack.error(error.response.data.message))
        .finally(() => {
          this.loadingRequest = false
          this.inadimplenciaModal = false
        })
    },
    fetchInvoices() {
      getInvoicesByPayerRequest('empresa', this.getEmpresa.id)
        .then(response => this.faturas = response.data.filter(item => item.status === 'atrasado'))
    }
  }
}
</script>

<style scoped>

</style>
