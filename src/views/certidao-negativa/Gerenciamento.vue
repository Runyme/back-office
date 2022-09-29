<template>
  <div>
    <b-loading :active.sync="loading"/>
    <div class="w-full flex justify-between items-start">
      <Lynx-Title text="Gerenciamento de Certidões Negativas de Débitos"/>
      <Lynx-Button text="Atualizar" class="mb-4" icon="Reload" @click.native="fetchCertidoes" size="small" icon-size="3"/>
    </div>
    <div class="flex items-start pb-8">
      <b-field label="Data de validade" >
        <b-select placeholder="Selecione um periodo" v-model="validade_filter">
          <option
            v-for="item in options_validade_filter"
            :value="item.value"
            :key="item.id"
            v-text="item.label"
          />
        </b-select>
      </b-field>
    </div>
    <b-table
      :data="filteredCertidoes"
      :columns="columns"
      :paginated="true"
      default-sort-direction="asc"
      default-sort="empresa_id"
      per-page="10"
      class="w-full"
    >
      <template slot-scope="props">
        <b-table-column field="empresa_id" v-text="props.row.empresa_id"/>
        <b-table-column field="empresa_nome" v-text="props.row.empresa_nome"/>
        <b-table-column field="tipo" v-text="props.row.tipo"/>
        <b-table-column field="data_emissao">
          {{ props.row.data_emissao | date }}
        </b-table-column>
        <b-table-column field="data_validade">
          <span class="py-1 px-2 text-neutral-100 text-xs rounded" :class="getStatusType(props.row.data_validade)"> 
            {{ props.row.data_validade | date }}
          </span>
        </b-table-column>
        <b-table-column field="arquivo_nome">
          <a class="text-primary-700 underline pb-4" v-if="props.row.arquivo_id" :href="props.row.arquivo_id | link" target="_blank">
            {{ props.row.arquivo_nome }}
          </a>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
  import {certidaoNegativaRequest} from "../../services/requests/certidaoNegativa";
  import moment from "moment";

  export default {
    name: "GerenciamentoCertidaoNegativa",
    data: () => ({
      loading: false,
      certidoes: [],
      validade_filter: 'todas',
      options_validade_filter: [
        {
          value: 'todas',
          label: 'Todas'
        },
        {
          value: 60,
          label: '60 Dias'
        },
        {
          value: 30,
          label: '30 Dias'
        },
        {
          value: -1,
          label: 'Vencidas'
        },
      ],
      columns: [
        {
          field: 'empresa_id',
          label: 'ID',
          searchable: true,
          sortable : true,
        },
        {
          field: 'empresa_nome',
          label: 'Empresa',
          searchable: true,
          sortable : true,
        },
        {
          field: 'tipo',
          label: 'Tipo',
          searchable: true,
          sortable : true,
        },
        {
          field: 'data_emissao',
          label: 'Data de Emissão',
          searchable: true,
          sortable : true,
        },
        {
          field: 'data_validade',
          label: 'Data de Validade',
          searchable: true,
          sortable : true,
        },
        {
          field: 'arquivo_nome',
          label: 'Link',
        },
      ],
    }),
    filters: {
      link: val => `${process.env.VUE_APP_API_URL}/arquivos/${val}/open?token=${localStorage.getItem('lynx-token')}`,
      date: val => moment(val).format('DD/MM/YYYY'),
    },
    mounted() {
      this.fetchCertidoes();
    },
    computed: {
      filteredCertidoes() {
        if(this.validade_filter === 'todas') return this.certidoes
        return this.certidoes.filter(curr => this.getDaysDifference(curr.data_validade) <= this.validade_filter)
      }
    },
    methods: {
      fetchCertidoes() {
        this.loading = true
        certidaoNegativaRequest()
          .then(res => this.certidoes = res.data.data)
          .catch(() => this.$snack.error('Ocorreu um erro, tente novamente mais tarde'))
          .finally(() => this.loading = false)
      },
      getDaysDifference(date) {
        const momentDate = moment(date)
        const now = moment()
        return momentDate.diff(now, 'days')
      },
      getStatusType(val) {
        const vencimento = this.getDaysDifference(val)
        if (vencimento < 0) return 'bg-neutral-900'
        if (vencimento <= 15) return 'bg-error-base'
        if (vencimento <= 30) return 'bg-warning-base'
        return 'bg-info-base'
      }
    },
  }
</script>
