<template>
  <div class="bg-neutral-300 p-8">
    <Lynx-Title :text="`Extrato Previdenciário - ${cpf} - ${nomeCompleto}`" />
    <b-button class="is-primary ml-4 mb-2 float-right" icon-right="download" @click.native="
      () => {
        exportRelatorioPorCliente();
      }
    ">Exportar Relatório
    </b-button>
    <div class="modal-content">
      <b-table :data="extrato" height="480" sticky-header>
        <template slot-scope="props">
          <b-table-column field="cnpj_contratante" numeric label="Contratante" sortable searchable>{{
              formatCnpj(props.row.cnpj_contratante)
          }}</b-table-column>
          <b-table-column field="data_competencia" centered label="Competência" sortable searchable>
            {{ props.row.data_competencia != undefined ? new
                Date(props.row.data_competencia).toLocaleDateString('pt-BR', {
                  timeZone:
                    'UTC'
                })
                : ''
            }}
          </b-table-column>
          <b-table-column field="indicadores" label="Indicadores" sortable searchable>{{ props.row.indicadores
          }}</b-table-column>
          <b-table-column field="renumeracao" numeric label="Renumeração" sortable>{{ toMoeda(props.row.renumeracao)
          }}</b-table-column>
          <b-table-column field="aporte" numeric label="Aporte" sortable>{{ toMoeda(props.row.aporte)
          }}</b-table-column>

        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import { moeda } from '@/utils/helpers'

export default {
  name: 'PgblDetails',
  props: {
    extrato: { required: true, default: [] },
    cpf: { required: true },
    clientesId: { required: true },
    nomeCompleto: { required: true },
  },
  data() {
    return {
    }
  },
  methods: {
    toMoeda(value) {
      return moeda(value);
    },

    exportRelatorioPorCliente() {
      window.open(
        `${process.env.VUE_APP_API_URL}/pgbl/relatorio-detalhado-cliente-excel/${this.clientesId}?token=${this.$store.getters.getToken}`,
        "_blank"
      );
    },

    formatCnpj(cnpj) {
      if (cnpj.length == 14) {
        return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
      } else if (cnpj.length == 8) {
        return cnpj.replace(/^(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
      }
      return cnpj;
    }

  }
}
</script>
