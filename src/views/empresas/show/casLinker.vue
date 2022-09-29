 <template>
  <div class="bg-neutral-300 p-8">
    <b-loading :active.sync="loading" />

  <Card v-show="lista_campos.status != null " color="primary-700">
       <Lynx-Label  label="Conta Ja criada na linker" class="text-success-base  p-1" />
          <b-icon icon="check" class=" text-success-base" ></b-icon>
       
  </Card>
    <div class="modal-body" style="height: 325px">
      <Lynx-Label label="Empresa" />
      <Lynx-Input
        :disabled="true"
        placeholder="Insira o Id da empresa"
        v-model="form.empresas_id"
        class="w-full mb-2"
      />
       <Lynx-Label label="Email De Confirmação" />
      <Lynx-Input
   
        
        v-model="getEmpresa.socioAdministrador.emails[0].value"
        class="w-full mb-2"
      />
      <Lynx-Label label="Token Permissão Pagamento" />
      <Lynx-Input
        :disabled="!lista_campos.token ? false: true"

        placeholder="Insira o Token de pagamentos Caso Houver"
        v-model="form.token"
        class="w-full mb-2"
      />
          <Lynx-Label label="Token Permissão Extrato" />
      <Lynx-Input
        :disabled="!lista_campos.token_extrato ? false: true"

        placeholder="Insira o Token de extrato Caso Houver"
        v-model="form.token_extrato"
        class="w-full mb-2"
      />
      <Lynx-Label label="Faturamento" />
      <Lynx-Input
        :disabled="lista_campos.companyRevenue  ? true:false"
        placeholder="Insira o Faturamento anual estimado"
        v-model="form.companyRevenue"
        class="w-full "
      />
    </div>

    <div class="field mt-10">
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
        :text="lista_campos.status == null ? 'cria' : 'edita'"
        class="mb-8"
        icon="Reload"
        @click.native="confirm(lista_campos.status == null ? 'cria' : 'edita')"
        size="small"
        icon-size="3"
      />
    </div>
    <div class="flex flex-col ">
      <Lynx-Button
      v-show="lista_campos.status != null"
      :disabled="lista_campos.permission_pay == null ? false: true"
        :text="lista_campos.permission_pay == null ? 'gerar Permissão' : 'Permissão Pagamentos gerada'"
        class="mb-8"
        icon="Reload"
        @click.native="confirm('da permissao pagamento a')"
        size="small"
        icon-size="3"
      />
    </div>
      <div class="flex flex-col ">
      <Lynx-Button
      v-show="lista_campos.status != null"
      :disabled="lista_campos.token_extrato == null ? false: true"
        :text="lista_campos.token_extrato == null ? 'gerar Permissão Extrato' : 'Permissão Do Extrato gerada'"
        class="mb-8"
        icon="Reload"
        @click.native="confirm('da permissao extrato a')"
        size="small"
        icon-size="3"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

// import Card from "@/components/helpers/Card";
// import Template from "../../components/icons/Template.vue";
import Card from '@/components/helpers/Card'

export default {
  name: "index",
  components:{Card},
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
        token_extrato:null
      },
      currentPage: 1,
      perPage: 10,
      loading: false,
    
      linkerCadasModal: false,
      cliente: null,
      columns: [
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
      ],
    };
  },
  computed: {
    ...mapGetters(["getEmpresa", "getToken"]),
    faturamento() {
      return this.$store.state.linker.faturamento;
    },
    lista_campos() {
      return this.$store.state.linker.cliente_linker;
    },
    mensagem_alert() {
      return this.$store.state.linker.mensagem_alert;
    },
  },
  created() {
    this.get_faturamento();
    this.listar_cliente_linker();
  },
  methods: {
    async confirm(tipo) {
      await this.$buefy.dialog.confirm({
        message: `Esta ação  ` + tipo + ` uma conta linker no sistema?`,
        confirmText: "Sim",
        cancelText: "Não",
        type: "is-success",
        onConfirm: () => {
          if (tipo == "cria") this.create();
          if (tipo == "edita") this.update();
          if (tipo == "da permissao pagamento a") this.permissao_pagamentos();
          if (tipo == "da permissao extrato a") this.permissao_extrato();

         

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
       async permissao_pagamentos() {
      await this.$store
        .dispatch("linker/permissao_pagamentos_cliente_linker", this.form)

        .then(() => {
          this.$snack.success(this.mensagem_alert.message);
        })
        .catch((error) => this.$snack.error(mensagem_alert.message))
        .finally(() => (this.loading = false));

  
    },
       async permissao_extrato() {
      await this.$store
        .dispatch("linker/permissao_extrato_cliente_linker", this.form)

        .then(() => {
          this.$snack.success(this.mensagem_alert.message);
        })
        .catch((error) => this.$snack.error(mensagem_alert.message))
        .finally(() => (this.loading = false));

  
    },
    async listar_cliente_linker() {
      await this.$store
        .dispatch("linker/listar_cliente_linker", this.getEmpresa.id)
        .finally(() => {
          this.$store.dispatch("configEmpresa/atualizar", "");
        });
if(this.lista_campos.id){
      this.form.id = this.lista_campos.id;
      this.form.empresas_id = this.lista_campos.empresas_id;
      this.form.token = this.lista_campos.token;
      this.form.token_extrato = this.lista_campos.token_extrato;

      this.form.partnerPEP = this.lista_campos.partnerPEP == 1 ? true : false;
      this.form.companyPartnerChanged = this.lista_campos.companyPartnerChanged == 1 ? true : false;
      this.form.companyRevenue = this.lista_campos.companyRevenue;
      this.form.mailingAddress2 =
        this.lista_campos.mailingAddress == "comercial" ? true : false;
      this.form.mailingAddress1 =
        this.lista_campos.mailingAddress == "residencial" ? true : false;
}
    },

    async get_faturamento() {
      this.loading = true;

      let a = { empresas_id: this.getEmpresa.id };
      await this.$store.dispatch("linker/get_faturamento", a);
      this.loading = false;

      this.form.companyRevenue = this.faturamento;
      this.form.empresas_id = this.getEmpresa.id;
    },

    cadastrar() {
      this.linkerCadasModal = true;
    },
    // atualizar(value) {
    //   this.lista_campos = value;
    //   this.form.id = value.id
    //   this.form.empresas_id = value.empresas_id
    //   this.form.token= value.token,
    //   this.form.partnerPEP= value.partnerPEP == 1 ? true: false,
    //   this.form.companyPartnerChanged= value.companyPartnerChanged == 1 ? true: false,
    //   this.form.companyRevenue=  value.companyRevenue
    //   this.form.mailingAddress1= value.mailingAddress == 'comercial' ?  true :false,
    //   this.form.mailingAddress2= value.mailingAddress == 'residencial' ? true: false,
    //   this.linkerCadasModal = true;
    // },
  },
};
</script>

<style scoped>
</style>
