<template>
  <div class="p-8 bg-neutral-300">
    <div class="flex flex-col">
      <Lynx-Title :text="`Editar alvará - ${empresaId}`" />
      <form class="flex flex-col">
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
          <b-upload v-model="form.file">
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
      </form>
      <!--  TAXAS -->
      <div v-if="alvara">
      <Lynx-Label class="mt-2" label="TAXA" />

      <div v-for="(taxa, index) in taxas" :key="index">
        <div class="v-line mt-2" v-if="index >= 1"></div>
        <b-select
          class="mt-2"
          v-model="taxa.tipo_taxa"
          placeholder="selecione uma taxa"
        >
          <option
            v-for="status in taxasOptions"
            :key="status.id"
            :value="status.value"
            v-text="status.label"
          ></option>
        </b-select>
        <label class="flex flex-col pb-1 mt-2">
          <Lynx-Label label="Data de vencimento" />
          <b-datepicker
            :years-range="[-1, 5]"
            v-model="taxa.data_vencimento"
            :day-names="dayNames"
            :month-names="monthNames"
          />
        </label>

        <b-field class="file mt-3" required>
          <b-upload v-model="taxa.file">
            <a class="button is-primary">
              <b-icon icon="upload"></b-icon>
              <span>Realizar upload</span>
            </a>
          </b-upload>
          <span class="file-name" v-if="taxa.file">
            {{ taxa.file.name }}
          </span>
          <!-- <span
            class="file-name cursor-pointer"
            v-if="taxa.file && taxa.arquivo.nome"
            @click="openFile()"
          >
            {{ taxa.arquivo.nome }}
            <b-icon icon="attachment"></b-icon>
          </span> -->
        </b-field>
      </div>

      <Lynx-Button
        class="self-start mt-2"
        text="adicionar"
        icon="plus"
        @click.native="addTaxa()"
      />
      </div>
      <Lynx-Button
        type="submit"
        class="self-end"
        text="Enviar"
        icon="Check"
        :loading="loadingButton"
        @click.native="onSubmit"
      />
    </div>
  </div>
</template>

<script>
import {
  storeAlvarasRequest,
  updateAlvarasRequest,
  showAlvarasRequest,
} from "@/services/requests/alvaras";

import {
  storeTaxasRequest,
  updateTaxasRequest,
  showTaxasRequest,
} from "@/services/requests/taxas";

import { monthNames, dayNames } from "@/utils/utils";
import moment from "moment";
import base64Files from "../../../mixins/base64Files";
import { mapGetters } from "vuex";
import { formatDateToBr } from '../../../utils/momentHelpers';

export default {
  name: "Alvara",
  mixins: [base64Files],
  props: {
    alvara: {
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
      taxas: [
        {
          type_document: "alvara",
          document_id: this.alvara.id,
          empresa_id: this.empresaId,
          tipo_taxa: 0,
          data_vencimento: new Date(),
        },
      ],
      form: {
        empresa_id: this.empresaId,
        data_vencimento: new Date(),
      },
      errorMessage: "Não foi possivel editar o alvará",
      taxasOptions: [
        {
          label: "selecione uma taxa",
          value: 0,
        },
        {
          label: "Taxa de Alvará",
          value: 1,
        },
        {
          label: "Taxa de fiscalização",
          value: 2,
        },
        {
          label: "Taxa de Expediente",
          value: 3,
        },

        {
          label: "Taxa Mobiliaria ",
          value: 4,
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["getToken"]),
  },
  methods: {
    fetchFile() {
      this.loadingFile = true;
      if(this.alvara != null){
    showTaxasRequest(this.alvara.id)
        .then((response) => {
        
   
        this.taxas = response.data.data

        
      this.taxas.forEach(element => {
        element.data_vencimento = new Date(moment(element.data_vencimento))
      });

    
      
        
       
        })
        .finally(() => (this.loadingFile = false));
      

      showAlvarasRequest(this.alvara.id)
        .then((response) => {
          // console.log(response.data.data.arquivo)
      
          this.arquivo = response.data.data.arquivo;
        })
        .finally(() => (this.loadingFile = false));
      }
    },
    async onSubmit() {
      this.loadingButton = true;

 if(!this.arquivo){

      const form = {
        ...this.form,
        file: await this.convertFileToBase64(this.form.file),
        data_vencimento: moment(this.form.data_vencimento).format("YYYY-MM-DD"),
      };
 
      if (this.alvara == null) {
     

        storeAlvarasRequest(form)
          .then(() => {
            this.$emit("edit-alvara");
            this.$snack.success("Alvará  criado com sucesso");
          })
          .catch((err) =>
            this.$snack.error(err.response.data.message || this.errorMessage)
          )
          .finally(() => (this.loadingButton = false));

      } else {
        updateAlvaraRequest(this.alvara.id, form)
          .then(() => {
            this.$emit("edit-alvara");
            this.$snack.success("Alvará  atualizado com sucesso");
          })
          .catch((err) =>
            this.$snack.error(err.response.data.message || this.errorMessage)
          )
          .finally(() => (this.loadingButton = false));
        

      }
 }

         for (let index = 0; index < this.taxas.length; index++) {
   
        this.taxas[index].file= await this.convertFileToBase64(this.taxas[index].file),
        this.taxas[index].data_vencimento= moment(this.taxas[index].data_vencimento).format("YYYY-MM-DD")
    
    }
      console.log(this.taxas)

  if (this.alvara != null) {
             storeTaxasRequest(this.taxas)
          .then((response) => {
          console.log(response)
            this.$snack.success("Taxa criada com sucesso");
        //  for (let index = 0; index < this.taxas.length; index++) {
       
        //  }
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
    addTaxa() {
      this.taxas.push({
        type_document: "sanitario",
        document_id: this.alvara.id,
        empresa_id: this.empresaId,
        tipo_taxa: 0,
        data_vencimento: new Date(),
        file: null,
      });
    },
  },
  beforeMount() {
   
       if(this.alvara != null){
    this.form = {
      empresa_id: this.empresaId,
      data_vencimento: new Date(moment(this.alvara.data_vencimento)),
    };
       }else{
            this.form= {
        empresa_id: this.empresaId,
        data_vencimento: new Date(),
      }
       }
    // if (this.form.data_vencimento < new Date())
    //   this.form.data_vencimento = null;
  },
  mounted() {

    this.fetchFile();
  },
};
</script>

<style scoped>
.v-line {
  height: 0.1vw;
  width: 100%;
  border-width: 0;
  color: rgb(63, 62, 62);
  background-color: rgb(35, 34, 34);
}
</style>
