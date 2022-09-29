<template>
  <div>
    <b-loading :active.sync="loading"/>
    <div class="w-full flex justify-between items-start">
      <Lynx-Title text="Certidões Negativas de Débitos não processadas"/>
      <Lynx-Button text="Atualizar" class="mb-4" icon="Reload" @click.native="fetchCertidoes" size="small" icon-size="3"/>
    </div>
    <b-table
      :data="certidoes"
      :columns="columns"
      :paginated="true"
      default-sort-direction="asc"
      default-sort="nome"
      per-page="10"
      hoverables
      class="w-full"
    >
      <template slot-scope="props">
        <b-table-column field="nome" v-text="props.row.nome"/>
        <b-table-column field="created_at"> {{props.row.created_at | formatEnToBr}} </b-table-column>
        <b-table-column field="acoes">
          <div class="flex text-sm items-center">
            <a href="#" class="mr-4 bg-primary-600 rounded-full p-2" @click.prevent="openCertidaoDetail(props.row)">
              <Icon-Edit class="text-neutral-100" size="4"/>
            </a>
            <a href="#" class="bg-error-base rounded-full p-2" @click.prevent="deleteCertidao(props.row)">
              <Icon-Trash class="text-neutral-100" size="4"/>
            </a>
          </div>
        </b-table-column>
      </template>
    </b-table>
    <b-modal :active.sync="certidaoDetailModal" v-if="certidaoDetailModal" width="700px">
      <CertidaoNegativaNaoProcessadaDetail
        :certidao="currentCertidao"
        @onClose="closeCertidaoDetail"
        @createdCertidao="removeCertidaoFromList"
      />
    </b-modal>
  </div>
</template>

<script>
  import CertidaoNegativaNaoProcessadaDetail from "./NaoProcessadaDetail";
  import {formatEnToBr} from "../../utils/momentHelpers";
  import {
    certidoesNegativosNaoProcessadasRequest,
    deleteCertidaoNegativaNaoProcessadaRequest
  } from "../../services/requests/certidaoNegativa";

  export default {
    name: "CertidaoNegativaNaoProcessadas",
    components: { CertidaoNegativaNaoProcessadaDetail },
    data: () => ({
      loading: false,
      certidoes: [],
      columns: [
        {
          field: 'nome',
          label: 'Certidão',
          searchable: true,
          sortable: true,
        },
        {
          field: 'created_at',
          label: 'Data',
        },
        {
          field: 'acoes',
          label: 'Ações',
        },
      ],
      certidaoDetailModal: false,
      currentCertidao: null,
    }),
    mounted() {
      this.fetchCertidoes();
    },
    filters:{
      formatEnToBr
    },
    methods: {
      fetchCertidoes() {
        this.loading = true
        certidoesNegativosNaoProcessadasRequest()
          .then(res => this.certidoes = res.data.data)
          .catch(() => this.$snack.error('Ocorreu um erro, tente novamente mais tarde'))
          .finally(() => this.loading = false)
      },
      openCertidaoDetail(certidao) {
        this.currentCertidao = certidao;
        this.certidaoDetailModal = true;
      },
      closeCertidaoDetail() {
        this.certidaoDetailModal = false;
        this.currentCertidao = null;
      },
      deleteCertidao(certidao) {
        this.$buefy.dialog.confirm({
          title: 'Excluir Certidão Negativa de Débitos',
          message: 'Tem certeza que deseja excluir a certidão ' + certidao.nome + ' ?',
          confirmText: 'Excluir',
          cancelText: 'Cancelar',
          type: 'is-danger',
          hasIcon: true,
          onConfirm: () => this.onDeleteCertidao(certidao),
        })
      },
      onDeleteCertidao(certidao) {
        this.loading = true
        deleteCertidaoNegativaNaoProcessadaRequest(certidao.id)
          .then(() => this.removeCertidaoFromList(certidao))
          .finally(() => this.loading = false)
      },
      removeCertidaoFromList(certidao) {
        this.certidoes = this.certidoes.filter(item => item !== certidao);
      },
    },
  }
</script>
