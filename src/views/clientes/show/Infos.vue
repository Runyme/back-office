<template>
  <div>
    <div class="w-full">
      <div class="flex items-center mb-4">
        <Icon-Info class="text-primary-600" size="8" />
        <p class="pl-4 font-display text-xl font-bold">
          Informações do Cliente
        </p>
      </div>
      <div class="py-3 flex">
        <div class="flex items-center">
          <span class="pr-2 font-bold">CPF:</span>
        </div>
        <span v-text="getCliente.cpf" />
      </div>
      <div class="py-3 flex">
        <div class="flex items-center">
          <span class="pr-2 font-bold">Data de nascimento:</span>
        </div>
        <span v-text="data_nascimento" />
      </div>
      <div class="py-3 flex">
        <div class="flex items-center">
          <span class="pr-2 font-bold">Idade:</span>
        </div>
        <span v-text="getCliente.idade" />
      </div>
      <form class="flex flex-col" @submit.prevent="onSubmit">
        <div class="flex items-center py-3">
          <div class="flex items-center">
            <span class="pr-2 font-bold">RG:</span>
          </div>
          <transition name="fade" mode="out-in">
            <span v-text="getCliente.rg" v-if="!isEditting && getCliente.rg" />
            <span v-else-if="!isEditting"> - </span>
            <Lynx-Input
              v-if="isEditting"
              v-model="$v.form.rg.$model"
              :error="$v.form.rg.$error"
              mask="##.###.###-#"
            />
          </transition>
        </div>
        <div class="flex items-center py-3">
          <div class="flex items-center">
            <span class="pr-2 font-bold">PIS:</span>
          </div>
          <transition name="fade" mode="out-in">
            <span
              v-text="getCliente.pis"
              v-if="!isEditting && getCliente.pis"
            />
            <span v-else-if="!isEditting"> - </span>
            <Lynx-Input
              v-if="isEditting"
              v-model="$v.form.pis.$model"
              :error="$v.form.pis.$error"
            />
          </transition>
        </div>
        <div class="flex items-center py-3">
          <div class="flex items-center">
            <span class="pr-2 font-bold">Nacionalidade:</span>
          </div>
          <transition name="fade" mode="out-in">
            <span
              v-text="getCliente.nacionalidade"
              v-if="!isEditting && getCliente.nacionalidade"
            />
            <span v-else-if="!isEditting"> - </span>
            <b-select v-if="isEditting" v-model="form.nacionalidade">
              <option value="Brasileiro">Brasileiro</option>
            </b-select>
          </transition>
        </div>
        <div class="flex items-center py-3">
          <div class="flex items-center">
            <span class="pr-2 font-bold">Naturalidade:</span>
          </div>
          <transition name="fade" mode="out-in">
            <span
              v-text="getCliente.naturalidade"
              v-if="!isEditting && getCliente.naturalidade"
            />
            <span v-else-if="!isEditting"> - </span>
            <Lynx-Input
              v-if="isEditting"
              v-model="$v.form.naturalidade.$model"
              :error="$v.form.naturalidade.$error"
            />
          </transition>
        </div>
        <div class="py-4 self-start flex" v-if="!isEditting">
          <Lynx-Button
            text="Editar"
            icon="Edit"
            size="small"
            icon-size="4"
            @click.native="onEdit"
            type="button"
          />
          <Lynx-Button
            class="ml-2"
            text="Docs"
            icon="Document"
            size="small"
            icon-size="4"
            @click.native="openArquivosModal"
            type="button"
          />
          <Lynx-Button
            class="ml-2"
            text="Receitas"
            icon="Money"
            size="small"
            icon-size="4"
            type="button"
            @click.native="receitaModalOpened = true"
          />
          <Lynx-Button
            class="ml-2"
            text="Reset Senha"
            icon="Setting"
            size="small"
            icon-size="4"
            type="button"
            @click.native="resetSenha"
          />
        </div>
        <div class="flex justify-between self-start py-4 w-full" v-else>
          <Lynx-Button
            text="Cancelar"
            :outlined="true"
            type="button"
            @click.native="cancelEditting"
            size="small"
          />
          <Lynx-Button text="Salvar" type="submit" size="small" />
        </div>
      </form>
    </div>

    <b-modal :active.sync="arquivosModalOpened">
      <Arquivos model-type="cliente" :model-id="getCliente.id" />
    </b-modal>

    <b-modal :active.sync="receitaModalOpened">
      <Receitas :customer-id="getCliente.id" />
    </b-modal>
  </div>
</template>

<script>
import moment from "moment";
import Arquivos from "./Arquivos";
import { clientesUpdateRequest } from "@/services/requests/clientes";
import { mapGetters, mapActions } from "vuex";
import { required, maxLength, minLength } from "vuelidate/lib/validators";
import Receitas from "@/views/clientes/show/Receitas";
import formMixin from "@/mixins/form";

export default {
  name: "ClienteShowInfos",
  components: { Receitas, Arquivos },
  mixins: [formMixin],
  data() {
    return {
      arquivosModalOpened: false,
      receitaModalOpened: false,
      isEditting: false,
      form: {
        rg: "",
        pis: "",
        nacionalidade: "",
        naturalidade: "",
      },
      validationsMessage: {
        form: {
          rg: {
            required: "Inisra um RG",
            maxLength: "Insira um RG válido",
            minLength: "Insira um RG válido",
          },
          pis: { required: "Insira um PIS" },
          nacionalidade: { required: "Insira uma nacionalidade" },
          naturalidade: { required: "Insira uma naturalidade" },
        },
      },
    };
  },
  validations() {
    return {
      form: {
        rg: {
          required,
          maxLength: maxLength(9),
          minLength: minLength(9),
        },
        pis: { required },
        nacionalidade: { required },
        naturalidade: { required },
      },
    };
  },
  computed: {
    ...mapGetters(["getCliente"]),
    data_nascimento() {
      return moment(this.getCliente.data_nascimento).format("DD/MM/YYYY");
    },
    mensagem_alert() {
      return this.$store.state.empresas.mensagem_alert;
    },
  },
  methods: {
    ...mapActions(["setCliente"]),
    clearForm() {
      this.form = {
        rg: "",
        pis: "",
        nacionalidade: "",
        naturalidade: "",
      };
    },
    async resetSenha() {
      await this.$store.dispatch("empresas/resetSenha", {
        cliente_id: this.getCliente.id,
      });
      this.$snack.success(this.mensagem_alert.message);
    },
    onEdit() {
      this.form = {
        rg: this.getCliente.rg,
        pis: this.getCliente.pis,
        nacionalidade: this.getCliente.nacionalidade,
        naturalidade: this.getCliente.naturalidade,
      };
      this.isEditting = true;
    },
    cancelEditting() {
      this.clearForm();
      this.isEditting = false;
    },
    onSubmit() {
      clientesUpdateRequest(this.getCliente.id, this.form)
        .then((res) => {
          this.setCliente(res.data.data);
          this.clearForm();
          this.$snack.success("Informações atualizadas com sucesso");
          this.isEditting = false;
        })
        .catch(() =>
          this.$snack.error("Não foi possivel aterar as informações")
        );
    },
    openArquivosModal() {
      this.arquivosModalOpened = true;
    },
  },
};
</script>
