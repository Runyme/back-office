<template>
  <div>
    <Lynx-Title text="Carteiras" />
    <Lynx-OverlaySpinner v-if="loading" :loading="loading"/>
    <div class="flex flex-col items-start" v-else>
      <router-link :to="{ name: 'carteiras.create' }" class="mb-4" tag="div">
        <Lynx-Button text="Adicionar Carteira" icon="Plus" />
      </router-link>
      <b-table
        :data="carteiras"
        :paginated="true"
        default-sort-direction="asc"
        default-sort="nome"
        per-page="10"
        hoverables
        class="w-full"
        v-if="carteiras.length"
      >
        <template slot-scope="props">
          <b-table-column field="nome" label="Nome" v-text="props.row.nome" sortable searchable />
          <b-table-column
            field="responsavel.nome_completo"
            label="Responsável"
            v-text="props.row.responsavel ? props.row.responsavel.nome_completo : ''"
            sortable
            searchable
          />
          <b-table-column field="setor" label="Setor" v-text="props.row.setor" sortable searchable />
          <b-table-column label="Ações">
            <div class="flex text-sm items-center">
              <router-link
                class="mr-4 bg-primary-600 rounded-full p-2"
                :to="{ name: 'carteiras.edit', params: { id: props.row.id }}"
                v-if="hasPermission('alterar carteira')"
              >
                <Icon-Edit size="4" class="text-neutral-100" />
              </router-link>

              <a
                href="#"
                class="bg-error-base rounded-full p-2"
                @click.prevent="handleDelete(props.row.id)"
                v-if="hasPermission('excluir carteira')"
              >
                <Icon-Trash size="4" class="text-neutral-100" />
              </a>
            </div>
          </b-table-column>
        </template>
      </b-table>
      <div class="w-full h-full flex justify-center items-center" v-else>
        <NotFoundData text="Nenhuma função foi encontrada"/>
      </div>
    </div>
  </div>
</template>

<script>
  import NotFoundData from '../../components/layouts/NotFoundData';
  import {carteirasRequest, deleteCarteiraRequest} from "@/services/requests/carteiras";
  import {hasPermission} from '@/utils/can';

  export default {
    name: 'Carteiras',
    components: { NotFoundData },
    data: () => ({
      loading: false,
      carteiras: [],
    }),
    mounted() {
      this.fetchCarteiras();
    },
    methods: {
      hasPermission,
      fetchCarteiras() {
        this.loading = true;
        carteirasRequest()
          .then(res => this.carteiras = res.data.data)
          .catch(() => {
            this.$snack.error({
              text: 'Ocorreu um erro, tente novamente mais tarde',
              button: 'X',
            });
          })
          .finally(() => {
            this.loading = false;
          });
      },
      handleDelete(id) {
        this.$buefy.dialog.confirm({
          message: 'Deseja realmente excluir essa Carteira ?',
          confirmText: 'Excluir',
          cancelText: 'Cancelar',
          type: 'is-danger',
          onConfirm: () => this.deleteCarteira(id),
        })
      },
      deleteCarteira(id) {
        deleteCarteiraRequest(id)
          .then(() => {
            this.$snack.success('Carteira excluida com sucesso.');
            this.fetchCarteiras();
          })
          .catch(() => this.$snack.error('Erro ao tentar excluir essa Carteira.'));
      },
    },
  }
</script>
