<template>
  <div>
    <b-collapse :open="false" @open="fetchContasBancarias" aria-id="contasbancarias-aria">
      <div class="flex items-center my-2" slot="trigger" aria-controls="contasbancarias-aria">
        <Icon-Bank class="text-primary-600" size="8"/>
        <p class="pl-4 font-display text-xl font-bold">Contas Bancárias</p>
      </div>
      <div class="w-full">
        <div class="w-full flex justify-center py-4" v-if="loading">
          <Lynx-Spinner size="16"/>
        </div>
        <div v-else>
          <div class="flex-col" v-if="!loading && contasBancarias.length">
            <div class="flex-col" v-if="contaBancariaPrincipal">
              <div class="flex items-center py-1">
                <p class="font-bold">CPF/CNPJ: <span class="font-normal" v-text="contaBancariaPrincipal.cpf_cnpj"/></p>
              </div>
              <div class="flex items-center py-1">
                <p class="font-bold">Banco: <span class="font-normal">{{lynxPadStart(contaBancariaPrincipal.banco.id)}} - {{contaBancariaPrincipal.banco.nome}}</span>
                </p>
              </div>
              <div class="flex items-center py-1">
                <p class="font-bold">
                  Conta:
                  <span class="font-normal">
                  {{contaBancariaPrincipal.conta}}
                  <span v-if="contaBancariaPrincipal.dv_conta" v-text="` - ${contaBancariaPrincipal.dv_conta}`"/>
                </span>
                </p>
              </div>
              <div class="flex items-center py-1 font-light">
                <p class="font-bold">
                  Agência:
                  <span class="font-normal">
                  {{contaBancariaPrincipal.agencia}}
                  <span v-if="contaBancariaPrincipal.dv_agencia" v-text="` - ${contaBancariaPrincipal.dv_agencia}`"/>
                </span>
                </p>
              </div>
              <div class="flex items-center my-4">
                <Lynx-Button text="Gerenciar Contas" size="small" icon="Setting" icon-size="4"
                             @click.native="setModalOpened(true)"/>
              </div>
            </div>
            <div class="flex flex-col items-center my-4" v-else>
              <NotFoundData text="Não há uma conta principal ainda."/>
              <Lynx-Button text="Definir conta principal" size="small" icon="Setting" icon-size="4"
                           @click.native="setModalOpened(true)"/>
            </div>
          </div>
          <div class="flex flex-col items-center my-4" v-else>
            <NotFoundData text="Não há nenhuma conta bancária."/>
            <Lynx-Button text="Adicionar Conta" size="small" icon="Plus" icon-size="4"
                         @click.native="setModalOpened(true)"/>
          </div>
        </div>
      </div>
    </b-collapse>

    <b-modal :active.sync="modalOpened" ref="contasBancariasDetails">
      <Details :contas-bancarias="contasBancarias" :add-opened="!contasBancarias.length" :owner="owner"/>
    </b-modal>
  </div>
</template>

<script>

  import Details from '@/components/shared/ContasBancariasDetails'
  import {contasBancariasRequest} from '@/services/requests/contasBancarias'
  import {lynxPadStart} from '@/utils/utils'
  import NotFoundData from '@/components/layouts/NotFoundData'

  export default {
    name: 'ContasBancarias',
    components: {Details, NotFoundData},
    props: {
      ownerType: {
        validator: value => ['empresa', 'cliente'].indexOf(value) !== -1,
        required: true
      },
      ownerId: {
        type: Number,
        required: true,
      },
      ownerCpfCnpj: {
        type: [Number, String],
        required: true
      }
    },
    data() {
      return {
        contasBancarias: [],
        loading: false,
        modalOpened: false,
        owner: {
          id: this.ownerId,
          type: this.ownerType,
          cpfCnpj: this.ownerCpfCnpj
        }
      }
    },
    computed: {
      contaBancariaPrincipal() {
        return this.contasBancarias.find(curr => curr.principal)
      },
    },
    methods: {
      lynxPadStart,
      fetchContasBancarias() {
        this.loading = true
        contasBancariasRequest(this.ownerType, this.ownerId)
          .then(res => this.contasBancarias = res.data)
          .finally(() => this.loading = false)
      },
      setModalOpened(value) {
        this.modalOpened = value
      },
    },
    beforeMount() {
      // this.fetchContasBancarias()
    },
  }
</script>
