<template>
  <div class="p-8 bg-neutral-300">
    <div class="flex flex-col">
      <Lynx-Title :text="`Editar Bombeiro - ${empresaId}`" />
      <form class="flex flex-col" @submit.prevent="onSubmit">
        <label class="flex flex-col pb-5">
          <Lynx-Label label="Data de vencimento" />
          <b-datepicker
            :years-range="[-1, 5]"
            v-model="form.data_vencimento"
            :day-names="dayNames"
            :month-names="monthNames"
          />
        </label>

        <b-field class="file" required>
          <b-upload v-model="form.file" required>
            <a class="button is-primary">
              <b-icon icon="upload"></b-icon>
              <span>Realizar upload</span>
            </a>
          </b-upload>
          <span class="file-name" v-if="form.file">
            {{ form.file.name }}
          </span>
          <span
            class="file-name cursor-pointer"
            v-if="!form.file && arquivo"
            @click="openFile()"
          >
            {{ arquivo.nome }}
            <b-icon icon="attachment"></b-icon>
          </span>
        </b-field>

        <Lynx-Button
          type="submit"
          class="self-end"
          text="Enviar"
          icon="Check"
          :loading="loadingButton"
        />
      </form>
    </div>
  </div>
</template>

<script>
import {
  storeBombeiroRequest,
  updateBombeiroRequest,
  showBombeiroRequest,
} from '@/services/requests/bombeiro'
import { monthNames, dayNames } from "@/utils/utils";
import moment from "moment";
import base64Files from "../../../mixins/base64Files";
import { mapGetters } from "vuex";

export default {
  name: "BombeiroUpdate",
  mixins: [base64Files],
  props: {
    bombeiro: {
      required: true,
      type: Object,
    },
    empresaId: {
      required: true,
      type: Number,
    },
  },
  data() {
    return {
      arquivo: null,
      loadingFile: false,
      loadingButton: false,
      monthNames,
      dayNames,
      form: {
        empresa_id: this.empresaId,
        data_vencimento: new Date(),
      },
      errorMessage: "Não foi possivel editar o alvará",
    };
  },
  computed: {
    ...mapGetters(["getToken"]),
  },
  methods: {
    fetchFile() {
      
      this.loadingFile = true;
      showBombeiroRequest(this.bombeiro.id)
        .then((response) => {
          // console.log(response.data.data.arquivo)
          this.arquivo = response.data.data.arquivo;
        })
        .finally(() => (this.loadingFile = false));
    },
    async onSubmit() {
      this.loadingButton = true;
      const form = {
        ...this.form,
        file: await this.convertFileToBase64(this.form.file),
        data_vencimento: moment(this.form.data_vencimento).format("YYYY-MM-DD"),
      };
    

      if ( this.bombeiro == null) {
        storeBombeiroRequest(form)
          .then(() => {
           this.$emit('create-alvara')
            this.$snack.success("Bombeiro criado com sucesso");
          })
          .catch((err) =>
            this.$snack.error(err.response.data.message || this.errorMessage)
          )
          .finally(() => (this.loadingButton = false));
      } else {
        updateBombeiroRequest(this.bombeiro.id, form)
          .then(() => {
            this.$emit('create-alvara')
            this.$snack.success("Alvará atualizado com sucesso");
          })
          .catch((err) =>
            this.$snack.error(err.response.data.message || this.errorMessage)
          )
          .finally(() => (this.loadingButton = false));
      }
    },
    openFile() {
      window.open(
        `${process.env.VUE_APP_API_URL}/arquivos/${this.arquivo.id}/open?token=${this.getToken}`
      );
    },
  },
  beforeMount() {
    this.form = {
      empresa_id: this.empresaId,
      data_vencimento: new Date(moment(this.alvara.data_vencimento)),
    };
    // if (this.form.data_vencimento < new Date())
    //   this.form.data_vencimento = null;
  },
  mounted() {
    this.fetchFile();
  },
};
</script>
