<template>
  <div>
    <b-loading :active.sync="loading" />
    <div class="w-full flex justify-between items-center">
      <Lynx-Title text="Cadastro Linker" />

      <Lynx-Button
        text="Cadastrar"
        class="mb-8"
        icon-size="3"
        size="small"
        @click.native="cadastrar()"
      />
    </div>
    <div class="w-full flex justify-between items-center">
      <label class="flex flex-col w-1/2 pb-6 pr-3">
        <!-- <Lynx-Label label="Carteiras" /> -->

        <treeselect
          :multiple="false"
          :options="lista_carteiras"
          placeholder="Selecione a carteira..."
          v-model="carteira_filter"
        />
      </label>

      <label class="flex flex-col w-1/2 pb-6 pr-3">
        <!-- <Lynx-Label label="Carteiras" /> -->

        <treeselect
          :multiple="false"
          :options="status_id"
          placeholder="Selecione status..."
          v-model="status_filter"
        />
      </label>
      <label class="flex flex-col w-1/5 pb-6 pt-4">
        <Lynx-Button
          text="Relatorio Clientes Linker"
          class="mb-4"
          @click.native="gerarRelatorio()"
          size="small"
          icon-size="3"
        />
      </label>
    </div>

    <b-table
      :columns="columns"
      :data="lista_clientes_linker"
      :per-page="perPage"
      :paginated="true"
      default-sort-direction="asc"
      default-sort="id"
      hoverables
      class="w-full rounded-t-none"
    >
      <template slot-scope="props">
        <b-table-column field="id" v-text="props.row.empresa.id" />
        <b-table-column
          field="empresa"
          v-text="props.row.empresa.razao_social"
        />
        <b-table-column field="cliente" v-text="props.row.cliente" />
        <b-table-column field="cnpj" v-text="props.row.empresa.cnpj" />
        <b-table-column field="cpf" v-text="props.row.cpf" />
        <b-table-column field="carteiras" label="Carteiras">
          <p v-for="(it, index) in props.row.empresa.carteirasrel" :key="index">
            {{ it.nome }}
          </p>
        </b-table-column>

        <b-table-column
          field="status"
          v-text="props.row.status == 'ENRICHED' ? 'Em analise' : 'Ativo'"
        />

        <b-table-column field="acoes">
          <div class="flex text-sm">
            <div class="flex text-sm items-center">
              <a
                href="#"
                class="mr-4 bg-primary-600 rounded-full p-2"
                @click.prevent="atualizar(props.row)"
              >
                <Icon-Edit class="text-neutral-100" size="4" />
              </a>
            </div>
          </div>
        </b-table-column>
      </template>
      <template #empty>
        <Not-Found-Data text="Nenhuma fatura para a pesquisa informada" />
      </template>
    </b-table>

    <b-modal :active.sync="linkerCadasModal" width="600px" id="modal-tall">
      <div class="bg-neutral-300 p-8">
        <div class="modal-body" style="height: 270px">
          <Lynx-Label label="Empresa" />
          <Lynx-Input
            placeholder="Insira o Id da empresa"
            v-model="form.empresas_id"
            class="w-full my-2"
          />
          <Lynx-Label label="Token Permissão" />
          <Lynx-Input
            v-show="!lista_campos.token"
            placeholder="Insira o Token de pagamentos Caso Houver"
            v-model="form.token"
            class="w-full my-2"
          />
          <Lynx-Label label="Faturamento" />
          <Lynx-Input
            placeholder="Insira o Faturamento anual estimado"
            v-model="form.companyRevenue"
            class="w-full my-2"
          />
        </div>

        <div class="field">
          <b-checkbox v-model="form.partnerPEP" :native-value="true">
            O socio é pessoa politicamente exposta?
          </b-checkbox>
          <b-checkbox v-model="form.companyPartnerChanged" :native-value="true">
            A alguma alteração no quadro societario nos ultimos 3 meses?
          </b-checkbox>

          <b-checkbox v-model="form.mailingAddress1" :native-value="true">
            A empresa e um ponto de referência? ( Residencial)
          </b-checkbox>
          <b-checkbox v-model="form.mailingAddress2" :native-value="false">
            A empresa possui um local físico? ( Comercial)
          </b-checkbox>
        </div>

        <div class="flex flex-col mt-5">
          <Lynx-Button
            :disabled="lista_campos.status == ''"
            :text="!lista_campos.id ? 'cria' : 'edita'"
            class="mb-8"
            icon="Reload"
            @click.native="confirm(!lista_campos.id ? 'cria' : 'edita')"
            size="small"
            icon-size="3"
          />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
// import Card from "@/components/helpers/Card";
// import Template from "../../components/icons/Template.vue";
import Treeselect from "@riophae/vue-treeselect";

export default {
  name: "index",
  components: {
    Treeselect,
  },
  data() {
    return {
      form: {
        empresas_id: null,
        token: null,
        partnerPEP: false,
        companyPartnerChanged: false,
        companyRevenue: 0,
        mailingAddress1: "",
        mailingAddress2: "",
      },
      currentPage: 1,
      perPage: 10,
      loading: false,
      lista_campos: [],
      linkerCadasModal: false,
      cliente: null,
      carteira_filter: 'todas',
      status_filter: 'todas',

      carteiras: [],
      columns: [
        {
          field: "id",
          label: "id",
          sortable: false,
        },
        {
          field: "empresa",
          label: "empresa",
          sortable: false,
        },
        {
          field: "cliente",
          label: "cliente",
          sortable: true,
        },
        {
          field: "cnpj",
          label: "cnpj",
          sortable: true,
        },
        {
          field: "cpf",
          label: "cpf",
          sortable: true,
        },
        {
          field: "carteiras",
          label: "carteiras",
          sortable: true,
        },
        //{
        //   field: "criacao",
        //   label: "criação",
        //   sortable: true,
        // },
        {
          field: "status",
          label: "status",
          sortable: true,
        },
      ],
      status_id: [
          {
          id: "todas",
          label: "Todas",
        },
        {
          id: "ENRICHED",
          label: "Em analise",
        },
        {
          id: "REGISTERED",
          label: "Ativo",
        },
      ],
    };
  },
  computed: {
    lista_clientes_linker() {
   //   let empresas = this.$store.state.linker.lista_clientes_linker;
      const { status_filter, carteira_filter } = this;
      const carteiraFilteredList =
        this.$store.state.linker.lista_clientes_linker.filter((curr) => {
          if (carteira_filter === "todas") return true;
          if (carteira_filter === "sem_carteira")
            return !curr.carteiras || !curr.carteiras.length;

          return curr.empresa.carteirasrel.some(
            (carteira) => carteira.id === carteira_filter
          );
        });

      return carteiraFilteredList.filter((curr) => {
        if(status_filter === 'todas') return true
        if (status_filter === curr.status) return true;
        if (status_filter === curr.status) return true;
      });
    },
    mensagem_alert() {
      return this.$store.state.linker.mensagem_alert;
    },
    lista_carteiras() {
      //  return this.$store.state.carteira.lista_carteiras;

      let carteira = Object.values(this.$store.state.carteira.lista_carteiras);
      let data = [];
      data.push({ id: "todas", label: "todas" });
      data.push({ id: "sem_carteira", label: "sem carteira" });
      for (let i = 0; i < carteira.length; i++) {
        if (carteira[i].setor == "contabilidade")
          data.push({ id: carteira[i].id, label: carteira[i].nome });
      }
      return data;
    },
  },
  created() {
    this.listar_linkers();
  },
  methods: {
    async confirm(tipo) {
      await this.$buefy.dialog.confirm({
        message: `Esta ação  ` + tipo + ` uma Conta Linker no sistema?`,
        confirmText: "Sim",
        cancelText: "Não",
        type: "is-success",
        onConfirm: () => {
          if (tipo == "cria") this.create();
          if (tipo == "edita") this.update();
        },
      });
    },
    async create() {
      this.loading = true;
      await this.$store
        .dispatch("linker/create_cliente_linker", this.form)
        .then(() => {
          this.$snack.success(this.mensagem_alert.message);
        })
        .catch((error) => this.$snack.error(mensagem_alert.message))
        .finally(() => (this.loading = false));
      //   this.fireAlert({
      //     ...this.mensagem_alert,
      //     routeName: "produto",
      //   });
    },
    async update() {
      await this.$store
        .dispatch("linker/update_cliente_linker", this.form)

        .then(() => {
          this.$snack.success(this.mensagem_alert.message);
        })
        .catch((error) => this.$snack.error(mensagem_alert.message))
        .finally(() => (this.loading = false));

      //   this.fireAlert({
      //     ...this.mensagem_alert,
      //     routeName: "produto",
      //   });
    },

    async listar_linkers() {
      this.$store.dispatch("carteira/listar_carteiras");

      await this.$store

        .dispatch("linker/listar_clientes_linker")
        .finally(() => {
          this.$store.dispatch("configEmpresa/atualizar", "");
        });
    },

    cadastrar() {
      this.atualizar("");

      this.linkerCadasModal = true;
    },
    atualizar(value) {
      this.lista_campos = value;
      this.form.id = value.id;
      this.form.empresas_id = value.empresas_id;
      (this.form.token = value.token),
        (this.form.partnerPEP = value.partnerPEP == 1 ? true : false),
        (this.form.companyPartnerChanged =
          value.companyPartnerChanged == 1 ? true : false),
        (this.form.companyRevenue = value.companyRevenue);
      (this.form.mailingAddress2 =
        value.mailingAddress == "comercial" ? true : false),
        (this.form.mailingAddress1 =
          value.mailingAddress == "residencial" ? true : false),
        (this.linkerCadasModal = true);
    },

    gerarRelatorio() {
      window.open(
        `${process.env.VUE_APP_API_URL}/api/linker/relatorio/clientes/?token=${this.$store.getters.getToken}&carteira_id=${this.carteira}`,
        "_blank"
      );
    },
  },
};
</script>

<style scoped>
</style>
