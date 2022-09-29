<template>
  <div>
    <b-loading :active.sync="loading"/>
    <div class="w-full flex justify-between items-center">
      <Lynx-Title text="Lançamentos"/>
    </div>

    <div class="w-full flex justify-between items-end pb-8">
      <div class="flex space-x-4">
        <label>
          <Lynx-Label label="Mês"/>
          <InputCompetenciaDate
            placeholder="Selecione o mês"
            v-model="mes"
            @input="fetchContasReceber"
          />
        </label>

        <div class="flex flex-col">
          <Lynx-Label label="Pesquisar"/>
          <b-input
            placeholder="Pesquise algo"
            v-model="search"
          />
        </div>
      </div>

      <div></div>

      <Lynx-Button
        text="Cadastrar lançamento"
        icon="Plus"
        icon-size="4"
        size="small"
        @click.native="openNewChargeModal"
      />
    </div>

    <b-table
      :data="contasReceberFiltered"
      :paginated="true"
      per-page="10"
      hoverables
      class="w-full rounded-t-none"
    >
      <template slot-scope="{row}">
        <b-table-column class="max-w-xs truncate" sortable field="payer_id" label="Id" v-text="row.payer_id"/>
        <b-table-column class="max-w-xs truncate" sortable field="payer_name" label="Pagador" v-text="row.payer_name"/>
        <b-table-column field="valor" label="Valor">{{ moeda(row.valor) }}</b-table-column>
        <b-table-column field="consumid_at" label="Status">
          <b-tag>Indisponível</b-tag>
        </b-table-column>
        <b-table-column field="id" label="">
          <div class="flex text-sm items-center">
            <a href="#" class="mr-4 bg-primary-600 rounded-full p-2" @click.prevent="openChargeModal(row)">
              <Icon-Eye class="text-neutral-100" size="4"/>
            </a>
          </div>
        </b-table-column>
      </template>
    </b-table>

    <b-modal :active="openSelectedChargeModal" :on-cancel="closeSelectedChargeModal">
      <div class="bg-neutral-300 p-8 bg-white rounded" v-if="openSelectedChargeModal">
        <Lynx-Title :text="`${selectedCharge.payer_id} - ${selectedCharge.payer_name}`"/>
        <div class="modal-content">

          <p class="mb-10 text-lg">
            <strong>Valor no dia:
              <span class="ml-2 text-xl" :class="{ 'text-success-base' : selectedCharge.valor > 0, }">
                {{ moeda(selectedCharge.valor) }}
              </span>
            </strong>
          </p>

          <div class=" border-t border-neutral-400 pt-5"></div>

          <div class="relative">
            <b-button class="absolute right-0 is-primary" @click="() => showCreateLancamentoModal = true">Adicionar
              lançamento
            </b-button>
            <b-modal :active="showCreateLancamentoModal" :on-cancel="() => showCreateLancamentoModal = false"
                     :destroy-on-hide="true">
              <div class="p-8 bg-neutral-200 rounded">
                <form class="w-1/2 mx-auto" @submit.prevent="submitCreateLancamento">
                  <h2 class="text-xl">Cadastrar lançamento</h2>
                  <b-field label="Descrição">
                    <b-input required v-model="lancamentoForm.descricao"></b-input>
                  </b-field>
                  <b-field label="Valor">
                    <input-money :value="0" v-model="lancamentoForm.valor"/>
                  </b-field>

                  <div class="flex justify-between">
                    <b-button native-type="submit" type="is-primary">Salvar</b-button>
                    <b-button @click="() => showCreateLancamentoModal = false">Cancelar</b-button>
                  </div>
                </form>
              </div>
            </b-modal>

            <div class="border-r-2 border-neutral-500 absolute h-full top-0" style="left: 15px"></div>
            <ul class="list-none m-0 p-0">
              <li class="mb-10" v-for="item in selectedCharge.movimento" :key="item.id">
                <div class="flex items-center mb-1">
                  <div class="bg-neutral-500 rounded-full h-8 w-8"></div>
                  <div class="flex flex-1 ml-4 font-semibold">
                    {{ formatDateToBr(item.created_at) }}
                    <b-icon class="flex items-center mx-4" icon="chevron-right"></b-icon>
                    <span :class="{
                      'text-success-base' : item.valor > 0,
                      'text-error-base' : item.valor < 0,
                    }">
                      {{ moeda(item.valor) }}
                    </span>
                  </div>
                </div>
                <div class="ml-12 flex text-neutral-600">
                  {{ item.descricao }}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </b-modal>

  </div>
</template>

<script>
import {createLancamentoRequest, getContaReceberById, getContasReceber} from "@/services/requests/faturas";
import InputCompetenciaDate from "@/components/helpers/InputCompetenciaDate";
import {moeda} from "@/utils/helpers";
import {formatDateToBr} from "@/utils/momentHelpers";
import InputMoney from "@/components/helpers/InputMoney";

export default {
  name: "ContasReceber",
  components: {InputMoney, InputCompetenciaDate},
  data() {
    return {
      loading: false,
      mes: null,
      search: null,
      selectedCharge: null,
      showNewChargeModal: false,
      showCreateLancamentoModal: false,
      contasReceber: [],
      lancamentoForm: {
        descricao: null,
        valor: null
      }
    }
  },
  computed: {
    openSelectedChargeModal() {
      return !!this.selectedCharge
    },
    contasReceberFiltered() {
      if (!this.search) {
        return this.contasReceber
      }
      return this.contasReceber.filter((data) => {
        let serializedFields = JSON.stringify({
          payer_id: data.payer_id,
          payer_name: data.payer_name
        });
        return serializedFields.toLowerCase().indexOf(this.search.toLowerCase()) !== -1
      });
    }
  },
  mounted() {
    this.fetchContasReceber()
  },
  methods: {
    submitCreateLancamento() {
      this.loading = true;
      this.lancamentoForm.contaReceberId = this.selectedCharge.id
      createLancamentoRequest(this.lancamentoForm)
        .then(() => {
          this.showCreateLancamentoModal = false
          this.openChargeModal(this.selectedCharge)
          this.fetchContasReceber()
        })
        .catch(() => this.$snack.error('Erro ao criar desconto'))
        .finally(() => this.loading = false)
    },
    openNewChargeModal() {
      this.showNewChargeModal = true
    },
    closeSelectedChargeModal() {
      this.selectedCharge = null
    },
    moeda,
    formatDateToBr,
    fetchContasReceber() {
      this.loading = true
      getContasReceber({mes: this.mes})
        .then(({data: response}) => this.contasReceber = response.data)
        .catch(error => console.log(error.response))
        .finally(() => this.loading = false)
    },
    openChargeModal(item) {
      this.loading = true
      getContaReceberById(item.id)
        .then(({data: response}) => this.selectedCharge = response.data)
        .catch(error => console.log(error.response))
        .finally(() => this.loading = false)
    }
  }
}
</script>

<style scoped>

</style>
