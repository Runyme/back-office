<template>
  <div>
    <b-collapse :open="true" @open="fetchAttachedCarteiras" aria-id="carteira-aria">
      <div class="flex items-center my-2" slot="trigger" aria-controls="carteira-aria">
        <Icon-Folder class="text-primary-600" size="8"/>
        <p class="pl-4 font-display text-xl font-bold">Carteiras</p>
      </div>
      <div class="flex flex-col">
        <div class="w-full flex justify-center py-4" v-if="loading">
          <Lynx-Spinner size="16"/>
        </div>
        <div class="flex flex-col" v-else>
          <div class="my-4 self-center flex flex-col items-center" v-if="!attachedCarteiras.length">
            <NotFoundData text="Nenhuma Carteira vinculada"/>
          </div>
          <div class="flex flex-col" v-else>
            <div class="flex flex-col mb-8 bg-neutral-200 p-6 rounded relative" v-for="carteira in attachedCarteiras"
                 :key="carteira.id">
              <span class="font-semibold text-xl text-primary-600 pb-2" v-text="carteira.nome"/>
              <p class="flex">
                <span class="pr-2 font-bold">Setor:</span>
                <span v-text="carteira.setor"/>
              </p>
              <p class="flex">
                <span class="pr-2 font-bold">Responsável:</span>
                <span v-text="carteira.responsavel.nome_completo"/>
              </p>
              <a
                class="bg-error-light p-2 absolute top-0 right-0 rounded-full text-neutral-100 mt-4 mr-4 transition hover:text-error-dark"
                href="#"
                @click.prevent="handleRemove(carteira.id)"
              >
                <Icon-Cross size="2"/>
              </a>
            </div>
          </div>
          <Lynx-Button class="self-start" text="Cadastrar" size="small" icon-size="4" icon="Plus"
                       @click.native="onCreate"/>
        </div>
      </div>
    </b-collapse>

    <b-modal :active.sync="isCreating" width="500px">
      <CarteiraCreate @carteira-created="onCarteiraCreated"/>
    </b-modal>
  </div>
</template>

<script>
  import NotFoundData from '@/components/layouts/NotFoundData'
  import {empresaCarteirasRequest, empresaRemoveCarteiraRequest} from '@/services/requests/empresas'
  import {mapGetters} from 'vuex'
  import CarteiraCreate from '@/views/empresas/show/CarteiraCreate'


  export default {
    name: 'EmpresaShowCarteira',
    components: {NotFoundData, CarteiraCreate},
    data: () => ({
      loading: false,
      isCreating: false,
      attachedCarteiras: [],
    }),
    computed: {
      ...mapGetters(['getEmpresa']),
    },
    mounted() {
      this.fetchAttachedCarteiras();
    },
    methods: {
      fetchAttachedCarteiras() {
        this.loading = true;
        empresaCarteirasRequest(this.getEmpresa.id)
          .then(response => this.attachedCarteiras = response.data.data)
          .catch(error => this.$snack.error(error.response.data.message))
          .finally(() => this.loading = false);
      },
      handleRemove(id) {
        this.$buefy.dialog.confirm({
          message: 'Deseja realmente remover essa Carteira ?',
          confirmText: 'Remover',
          cancelText: 'Cancelar',
          type: 'is-danger',
          onConfirm: () => this.removeCarteira(id),
        })
      },
      removeCarteira(id) {
        this.loading = true;
        empresaRemoveCarteiraRequest(this.getEmpresa.id, {carteira_id: id})
          .then(res => {
            this.fetchAttachedCarteiras();
            this.$snack.success(res.data.message);
          })
          .catch(() => this.$snack.error('Não foi possível remover a Carteira.'))
          .finally(() => this.loading = false);
      },
      onCreate() {
        this.isCreating = true;
      },
      onCarteiraCreated() {
        this.isCreating = false
        this.fetchAttachedCarteiras()
      }
    },
  }
</script>
