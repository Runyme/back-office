<template>
  <div class="p-8 bg-neutral-300">
    <Lynx-Title text="Atribuir Certidão Negativa de Débitos a uma empresa" />

    <b-notification type="is-danger">
      {{certidao.error_message}}
    </b-notification>

    <form class="flex flex-col" @submit.prevent="onSubmit">
      <label class="flex flex-col w-full pb-8">
        <Lynx-Label
          label="Empresa"
          :validator="$v.form.empresa"
          :validations-message="validationsMessage.form.empresa"
        />
        <Lynx-Input
          placeholder="Digite o ID da empresa"
          :error="$v.form.empresa.$error"
          v-model.trim="$v.form.empresa.$model"
        />
      </label>
      <label class="flex flex-col w-full pb-8">
        <Lynx-Label
          label="Tipo"
          :validator="$v.form.tipo"
          :validations-message="validationsMessage.form.tipo"
        />
        <b-select
          placeholder="Selecione um tipo"
          :error="$v.form.tipo.$error"
          v-model.trim="$v.form.tipo.$model"
        >
          <option v-for="(tipo, index) in tipos" :value="tipo" :key="index">{{ tipo }}</option>
        </b-select>
      </label>
      <label class="flex flex-col w-full pb-8">
        <Lynx-Label
          label="Data de Emissão"
          :validator="$v.form.data_emissao"
          :validations-message="validationsMessage.form.data_emissao"
        />
        <b-datepicker
          placeholder="Selecione a data de emissão"
          icon="calendar-today"
          :month-names="monthNames"
          v-model="$v.form.data_emissao.$model"
          :error="$v.form.data_emissao.$error"
        />
      </label>
      <label class="flex flex-col w-full pb-8">
        <Lynx-Label
          label="Data de Validade"
          :validator="$v.form.data_validade"
          :validations-message="validationsMessage.form.data_validade"
        />
        <b-datepicker
          placeholder="Selecione a data de validade"
          icon="calendar-today"
          :month-names="monthNames"
          v-model="$v.form.data_validade.$model"
          :error="$v.form.data_validade.$error"
        />
      </label>
      <label class="flex flex-col w-full pb-8">
        <Lynx-Label label="Certidão Negativa de Débitos"/>
        <a class="underline font-bold text-primary-600" :href="certidao.url" target="_blank">{{ certidao.nome }}</a>
      </label>
      <Lynx-Button class="self-end" type="submit" text="Salvar" icon="Check" :loading="loadingButton"/>
    </form>
  </div>
</template>

<script>
  import { required } from "vuelidate/lib/validators";
  import { monthNames } from '../../utils/utils';
  import { createCertidaoNegativaRequest } from "../../services/requests/certidaoNegativa";

  export default {
    name: "CertidaoNegativaNaoProcessadaDetail",
    props: {
      certidao: Object,
    },
    data: () => ({
      monthNames,
      loadingButton: false,
      tipos: ['Federal', 'Municipal'],
      form: {
        empresa: null,
        tipo: null,
        data_emissao: null,
        data_validade: null,
      },
      validationsMessage: {
        form: {
          empresa: {
            required: 'Insira uma empresa',
          },
          tipo: {
            required: 'Selecione um tipo',
          },
          data_emissao: {
            required: 'Selecione uma data de emissão',
          },
          data_validade: {
            required: 'Selecione uma data de validade',
          },
        }
      },
    }),
    validations: () => ({
      form: {
        empresa: { required },
        tipo: { required },
        data_emissao: { required },
        data_validade: { required },
      }
    }),
    methods: {
      onSubmit() {
        if(this.$v.$invalid) return this.$snack.error('Preencha o formulário corretamente.');
        this.loadingButton = true;
        const data = this.form;
        data.file = this.certidao.id;
        createCertidaoNegativaRequest(data)
          .then(() => {
            this.$snack.success('Certidão Negativa de Débitos criada com sucesso.');
            this.$emit('createdCertidao', this.certidao);
          })
          .catch(err => this.$snack.error(err.response.data.message || err.message))
          .finally(() => {
            this.loadingButton = false;
            this.closeCertidaoDetail();
          })
      },
      closeCertidaoDetail() {
        this.$emit('onClose');
      }
    },
  }
</script>
