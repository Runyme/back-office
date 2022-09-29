<template>
  <div class="flex flex-col h-full">
    <div class="bg-neutral-300 shadow py-12 w-full flex justify-center h-full items-center" v-if="loading">
      <Lynx-Spinner size="12"/>
    </div>

    <div class="bg-neutral-300 shadow p-10 flex flex-col rounded h-auto" v-else>
      <span class="text-lg font-display border-b border-neutral-400 w-full pb-2 flex mb-4">
        Sócios
      </span>

      <ul v-if="socios.length" class="py-2 mb-2">
        <li
          v-for="(socio, index) in socios"
          :key="index"
          class="flex justify-between items-center py-2"
        >
          <span class="w-full">
            {{ socio.nome_completo }} | CPF: {{ socio.cpf }}

            <button @click.prevent="editSocio(socio.id)">
              <b-icon class="ml-1" icon="circle-edit-outline"></b-icon>
            </button>

            <b-tooltip v-if="socio_administrador !== socio.id" label="Remover como sócio" position="is-bottom" type="is-danger">
              <button
                class="flex items-center justify-center ml-1"
                @click.prevent="socios.splice(index, 1)"
              >
                <b-icon class="mr-1" icon="close-circle-outline"></b-icon>
              </button>
            </b-tooltip>
          </span>

          <b-numberinput
            v-model="socio.porcentagem_societaria"
            controls-position="compact"
            class="w-32 flex-shrink-0"
            min="0"
            max="100"
          ></b-numberinput>

          <b-radio
            v-model="socio_administrador"
            :native-value="socio.id"
            class="flex-shrink-0 ml-4"
          >
            Administrador
          </b-radio>
        </li>
      </ul>

      <div class="w-full h-full flex flex-col justify-center items-center" v-else>
        <NotFoundData text="Nenhum sócio adicionado"/>
      </div>

      <div class="flex justify-between">
        <Lynx-Button text="Adicionar Sócio" @click.prevent.native="addSocio" icon="Plus"/>

        <Lynx-Button text="Salvar" @click.prevent.native="updateSocios" color="success-base" icon="ArrowRight"/>
      </div>
    </div>

    <b-modal :active.sync="clienteSearchModalOpened">
      <ClienteSearchModal @selected="onClienteSelected"/>
    </b-modal>

    <b-modal :active.sync="clienteEditModalOpened">
      <ClienteEditModal @updated="onClienteUpdated" :clienteId="clienteToEdit"/>
    </b-modal>
  </div>
</template>

<script>
import {empresasSociosRequest, empresasSociosUpdateRequest} from "@/services/requests/empresas";
import NotFoundData from '@/components/layouts/NotFoundData'
import ClienteSearchModal from '@/views/clientes/SearchModal'
import ClienteEditModal from '@/views/clientes/EditForm'

export default {
  name: "SociosUpdateModal",
  components: {NotFoundData, ClienteSearchModal, ClienteEditModal},
  props: ["empresaId"],
  data() {
    return {
      loading: false,
      socios: [],
      socio_administrador: '',
      clienteSearchModalOpened: false,
      clienteEditModalOpened: false,
      clienteToEdit: null,
    };
  },
  computed: {},
  mounted() {
    this.fetchSocios()
  },
  methods: {
    addSocio() {
      this.clienteSearchModalOpened = true
    },
    editSocio(clienteId) {
      this.clienteToEdit = clienteId,
      this.clienteEditModalOpened = true
    },
    onClienteUpdated() {
      this.clienteEditModalOpened = false
      this.fetchSocios()
    },
    onClienteSelected(cliente) {
      this.clienteSearchModalOpened = false

      const clientesIds = this.socios.map(socio => socio.id)

      if (clientesIds.includes(cliente.id)) {
        this.$snack.warning('O cliente já foi adicionado como sócio!')
        return
      }

      this.socios.push({
        ...cliente,
        porcentagem_societaria: 100,
      })

      if (this.socios.length == 1) {
        this.socio_administrador = cliente.id
      }
    },
    updateSocios() {
      if (this.socios.length == 0) {
        this.$snack.warning('Precisa ser selecionado pelo menos 1 sócio!')
        return
      }

      this.loading = true

      const payload = {
        "socios": this.socios.map((socio) => {
          return {
            "cliente_id": socio.id,
            "porcentagem_societaria": Number(socio.porcentagem_societaria),
            "socio_administrador": socio.id == this.socio_administrador
          }
        })
      }

      empresasSociosUpdateRequest(this.empresaId, payload)
        .then(() => {
          this.$snack.success('Sócios atualizados com sucesso!')
        })
        .catch(error => {
          const errors = Object.values(error.response.data.errors)
          const message = errors.map(item => item.map(error => `<li>${error}</li>`).join('')).join('')

          this.$buefy.dialog.alert({
            title: 'Não foi possível cadastrar a empresa',
            message: `<ul>${message}</ul>`,
            type: 'is-danger',
            ariaRole: 'alertdialog',
            ariaModal: true
          })
        })
        .finally(() => this.loading = false)

      this.$emit('updated')
    },
    fetchSocios() {
      this.loading = true;
      this.socios = null
      empresasSociosRequest(this.empresaId)
        .then((res) => {
          this.socios = res.data.data

          this.socios.forEach((socio) => {
            if (socio.socio_administrador) this.socio_administrador = socio.id
            socio.porcentagem_societaria = parseInt(socio.porcentagem_societaria)
          })
        })
        .finally(() => (this.loading = false))
    },
  },
};
</script>
