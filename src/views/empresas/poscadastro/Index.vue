<template>
  <div>
    <div class="flex justify-between items-center">
      <Lynx-Title text="Pós Cadastro" />

      <Lynx-Button
        text="Relatorio Poscadastro"
        class="mb-4"
        @click.native="gerarRelatorio()"
        size="small"
        icon-size="3"
      />
      <Lynx-Button
        text="Atualizar"
        class="mb-4"
        icon="Reload"
        @click.native="fetchEmpresas"
        size="small"
        icon-size="3"
      />
    </div>

    <div class="flex justify-between mb-4">
      <b-input
        class="w-96"
        placeholder="Pesquise pelo número ou nome fantasia"
        v-model="search"
      />
      <label class="flex flex-col w-1/2 pb-6 pr-3">
        <!-- <Lynx-Label label="Carteiras" /> -->

        <treeselect
          :multiple="false"
          :options="lista_carteiras"
          placeholder="Selecione as carteiras..."
          v-model="carteira"
        />
      </label>

      <div class="flex">
        <b-select v-model="perPage">
          <option
            :value="perPageOption"
            v-for="perPageOption in perPageOptions"
            :key="perPageOption"
          >
            {{ perPageOption }}
          </option>
        </b-select>

        <b-dropdown
          class="mx-4"
          v-model="params.status_id"
          multiple
          aria-role="list"
          @change="fetchEmpresas()"
        >
          <button class="button" type="button" slot="trigger">
            <span>Status</span>
            <b-icon icon="menu-down"></b-icon>
          </button>

          <b-dropdown-item
            v-for="(status, index) in statusList"
            :value="index"
            :key="index"
            aria-role="listitem"
          >
            <span>{{ status }}</span>
          </b-dropdown-item>
        </b-dropdown>

        <b-select @input="fetchEmpresas()" v-model="params.tipo">
          <option :value="null">Tipo</option>
          <option value="abertura">Abertura</option>
          <option value="transferencia">Transferência</option>
        </b-select>
      </div>
    </div>

    <b-table
      class="w-full"
      :data="filteredEmpresas"
      :loading="loading"
      hoverable
      :per-page="perPage"
      paginated
      aria-next-label="Próxima página"
      aria-previous-label="Página Anterior"
      aria-page-label="Página"
      aria-current-label="Página atual"
    >
      <template slot-scope="props">
        <b-table-column field="id" label="#" width="30" numeric
          >{{ props.row.id }}
        </b-table-column>

        <b-table-column field="precadastro_tipo" label="Tipo">
          <span
            class="flex items-center"
            v-if="props.row.precadastro_tipo == 'abertura'"
          >
            <b-icon class="mr-1" icon="plus"></b-icon>Abertura
          </span>

          <span
            class="flex items-center"
            v-if="props.row.precadastro_tipo == 'transferencia'"
          >
            <b-icon class="mr-1" icon="autorenew"></b-icon>Transferência
          </span>
        </b-table-column>

        <b-table-column field="nome_fantasia" label="Nome"
          >{{
            props.row.razao_social
              ? props.row.razao_social
              : props.row.nome_socio_administrador
          }}
        </b-table-column>
        <b-table-column field="carteiras" label="Carteiras">
          <p v-for="(it, index) in props.row.carteiras" :key="index">
            {{ it.nome }}
          </p>
        </b-table-column>

        <b-table-column field="status" label="Status">
          <b-tag :type="statusColors[props.row.status_id]"
            >{{ props.row.status_label }}
          </b-tag>
        </b-table-column>

        <b-table-column field="actions" label width="120">
          <b-tooltip label="Reenviar contrato" position="is-bottom">
            <button
              v-if="contratoReenviavel(props.row)"
              class="flex items-center justify-center"
              @click.prevent="reenviarContrato(props.row.id)"
            >
              <b-icon class="mr-1" icon="send"></b-icon>
            </button>
          </b-tooltip>

          <b-tooltip label="Copiar Link" position="is-bottom">
            <button
              v-if="props.row.status_id == 2"
              class="flex items-center justify-center"
              @click.prevent="
                copyAssinaturaContratoLink(
                  props.row.id_socio_administrador,
                  props.row.id
                )
              "
            >
              <b-icon class="mr-1" icon="link-variant"></b-icon>
            </button>
          </b-tooltip>

          <b-tooltip label="Ver detalhes" position="is-bottom">
            <button
              v-if="props.row.status_id >= 3"
              class="flex items-center justify-center"
              @click.prevent="openEmpresaPosCadastroModal(props.row.id)"
            >
              <b-icon class="mr-1" icon="circle-edit-outline"></b-icon>
            </button>
          </b-tooltip>

          <b-tooltip label="Cancelar venda" position="is-bottom">
            <button
              v-if="props.row.status_id <= 2"
              class="flex items-center justify-center"
              @click.prevent="validateCancel(props.row.id)"
            >
              <b-icon class="mr-1" type="is-danger" icon="delete"></b-icon>
            </button>
          </b-tooltip>
        </b-table-column>
      </template>

      <template slot="empty">
        <Not-Found-Data
          class="mt-8"
          text="Nenhuma empresa no processo de pós cadastro"
        />
      </template>
    </b-table>

    <b-modal :active.sync="empresaPosCadastroModalOpened" full-screen>
      <EmpresaPosCadastroModal
        :empresaId="selectedEmpresa"
        @finalizada="empresaFinalizada"
      />
    </b-modal>

        <div class="my-8 w-full gap-4" style="min-height: 350px">
      <AwaitingFinishRegister class="h-full col-span-2" />
    </div>
  </div>
  
</template>

<script>
import AwaitingFinishRegister from "@/views/Home/Onboarding/components/AwaitingFinishRegister";

import {
  EmpresaPosCadastro,
  ReenviaContrato,
  EmpresaPosCadastroStatus,
} from "@/services/requests/empresaPosCadastro";
import { tokenByCliente } from "@/services/requests/clientes";
import EmpresaPosCadastroModal from "@/views/empresas/poscadastro/ShowModal";
import NotFoundData from "@/components/layouts/NotFoundData";
import { empresaCancelRequest } from "@/services/requests/empresas";
import Treeselect from "@riophae/vue-treeselect";

export default {
  name: "EmpresasPosCadastro",
  components: {
    NotFoundData,
    EmpresaPosCadastroModal,
    Treeselect,
    AwaitingFinishRegister,

  },
  data() {
    return {
      statusList: [],
      statusColors: {
        1: "is-warning",
        2: "is-light",
        3: "is-primary",
        4: "is-primary",
        5: "is-primary",
        6: "is-primary",
        7: "is-primary",
        99: "is-success",
      },
      empresas: [],
      params: {
        page: 1,
        tipo: null,
        status_id: [],
      },
      search: null,
      loading: false,
      empresaPosCadastroModalOpened: false,
      selectedEmpresa: null,
      perPage: 500,
      perPageOptions: [10, 50, 100],
      carteira: null,
      carteiras: [],
    };
  },
  computed: {
    lista_carteiras() {
      //  return this.$store.state.carteira.lista_carteiras;

      let carteira = Object.values(this.$store.state.carteira.lista_carteiras);
      let data = [];
      for (let i = 0; i < carteira.length; i++) {
        data.push({ id: carteira[i].id, label: carteira[i].nome });
      }
      return data;
    },
    filteredEmpresas() {
      if (this.search) {
        return this.empresas.data.filter((data) => {
          let serializedFields = JSON.stringify({
            id: data.id,
            razaosocial: data.nome_fantasia,
          });
          return (
            serializedFields
              .toLowerCase()
              .indexOf(this.search.toLowerCase()) !== -1
          );
        });
      } else if (this.carteira) {
        // console.log(this.carteira)
     

       return this.empresas.data.reduce((res,data) => {
        
 
          data.carteiras.forEach((element) => {
            if (this.carteira == element.id) {
              res.push(data);
            }
          });
       
            return res;
        },[]);
        
      } else if (!this.empresas.data || !this.search) {
        return this.empresas.data;
      }
    },
  },
  mounted() {
    this.fetchEmpresas();
    this.fetchEmpresasStatus();
  },
  methods: {
    fetchEmpresas() {
      this.loading = true;
      this.$store.dispatch("carteira/listar_carteiras");
      EmpresaPosCadastro(this.params)
        .then((res) => {
          this.empresas = res.data;
        })
        .finally(() => (this.loading = false));
    },
    fetchEmpresasStatus() {
      this.loading = true;
      EmpresaPosCadastroStatus()
        .then((res) => {
          this.statusList = res.data;
        })
        .finally(() => (this.loading = false));
    },
    onPageChange(page) {
      this.params.page = page;
      this.fetchEmpresas();
    },
    openEmpresaPosCadastroModal(empresaId) {
      this.selectedEmpresa = empresaId;
      this.empresaPosCadastroModalOpened = true;
    },
    contratoReenviavel(empresa) {
      if (empresa.status_id === 1) return true;
      return false;
    },
    reenviarContrato(empresaId) {
      this.$buefy.dialog.confirm({
        message:
          "Isto irá gerar um novo contrato e enviar ao cliente. Deseja continuar?",
        confirmText: "Sim",
        cancelText: "Não",
        type: "is-danger",
        onConfirm: () => this.handleReenviarContrato(empresaId),
      });
    },
    handleReenviarContrato(empresaId) {
      this.loading = true;

      ReenviaContrato(empresaId)
        .then((response) => {
          this.$snack.success(response.data.message);
          this.fetchEmpresas();
        })
        .catch((error) => this.$snack.error(error.response.data.message))
        .finally(() => (this.loading = false));
    },
    async copyAssinaturaContratoLink(idSocioAdministrador, empresaId) {
      let token = null;
      await tokenByCliente(idSocioAdministrador).then(
        (res) => (token = res.data)
      );

      const link = `https://cliente.runy.me/assinar-contrato?token=${token}&empresaId=${empresaId}`;

      this.$copyText(link).then(
        () => {
          this.$snack.success("O link foi copiado!");
        },
        () => {
          this.$snack.success("O link não foi copiado!");
        }
      );
    },
    empresaFinalizada() {
      this.empresaPosCadastroModalOpened = false;
      this.fetchEmpresas();
    },
    validateCancel(empresa_id) {
      this.$buefy.dialog.confirm({
        title: "Cancelar Empresa",
        message: "Tem certeza que deseja cancelar essa empresa??",
        confirmText: "Sim",
        cancelText: "Não",
        type: "is-primary",
        hasIcon: true,
        onConfirm: () => this.cancelCompany(empresa_id),
      });
    },
    cancelCompany(empresa_id) {
      this.loading = true;
      empresaCancelRequest(empresa_id)
        .then(() => {
          this.$snack.success("Empresa Cancelada com sucesso!");
          this.fetchEmpresas();
        })
        .catch(() =>
          this.$snack.error("Erro ao excluir esta venda. Essa venda é forte!!!")
        )
        .finally(() => (this.loading = false));
    },

    gerarRelatorio() {
      window.open(
        `${process.env.VUE_APP_API_URL}/empresas/poscadastro/relatorio/?token=${this.$store.getters.getToken}&status_id=${this.params.status_id}&carteira_id=${this.carteira}`,
        "_blank"
      );
    },
  },
};
</script>
