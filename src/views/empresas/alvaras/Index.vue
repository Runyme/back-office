<template>
  <div>
    <b-loading :active.sync="loading" />
    <div class="w-full flex justify-between items-start">
      <Lynx-Title text="Alvarás" />
      <Lynx-Button
        text="Adicionar Alvará"
        class="mb-4"
        icon="Plus"
        @click.native="openCreateModal"
        size="small"
        icon-size="3"
      />
    </div>

    <div class="flex flex-col">
      <div class="w-full flex">
        <label class="flex flex-col w-1/2 pb-6 pr-3">
          <Lynx-Label label="Data Inicial" />
          <b-datepicker
            v-model="form.data_inicio"
            placeholder="Selecione uma data"
            :date-formatter="
              (date) => moment(date, 'YYYY/MM/DD').format('DD/MM/YYYY')
            "
            :date-parser="(date) => new Date(date)"
            :month-names="monthNames"
            :day-names="dayNames"
            :years-range="[-20, 10]"
          />
        </label>
        <label class="flex flex-col w-1/2 pb-6 pr-3">
          <Lynx-Label label="Data Final" />
          <b-datepicker
            v-model="form.data_fim"
            placeholder="Selecione uma data"
            :date-formatter="
              (date) => moment(date, 'YYYY/MM/DD').format('DD/MM/YYYY')
            "
            :date-parser="(date) => new Date(date)"
            :month-names="monthNames"
            :day-names="dayNames"
            :years-range="[-20, 10]"
          />
        </label>
        <label class="flex flex-col w-1/2 pb-6 pr-3">
          <Lynx-Label label="Carteiras" />

          <treeselect
            :multiple="false"
            :options="lista_carteiras"
            placeholder="Selecione as carteiras..."
            v-model="carteira"
          />
        </label>
        <label class="flex flex-col w-1/2 pb-6 pr-3">
          <Lynx-Button
            text="Relatorio Alvara"
            class="mb-4"
            style="margin-top: 32px"
            @click.native="gerarRelatorio()"
            size="small"
            icon-size="3"
          />
        </label>
      </div>
    </div>

    <b-table
      v-if="lista_alvaras.length"
      :data="lista_alvaras"
      hoverables
      paginated
      per-page="10"
      class="w-full pb-8"
    >
      <template slot-scope="props">
        <b-table-column
          label="ID da empresa"
          field="empresa.id"
          v-text="props.row.empresa.id"
          sortable
          searchable
        />
        <b-table-column
          label="Empresa"
          field="empresa.razao_social"
          v-text="props.row.empresa.razao_social"
          sortable
          searchable
        />
        <b-table-column field="carteiras" label="Carteiras">
          <p v-for="(it, index) in props.row.carteiras" :key="index">
            {{ it.nome }}
          </p>
        </b-table-column>
        <b-table-column field="status">
          <b-tag :type="props.row | statusType">{{ props.row.status }}</b-tag>
        </b-table-column>
        <b-table-column
          label="Data de Vencimento"
          field="data_vencimento"
          v-text="moment(props.row.data_vencimento).format('DD/MM/YYYY')"
          searchable=""
        />
        <b-table-column label="Ações">
          <div class="flex text-sm items-center">
            <a
              href="#"
              class="mr-4 bg-primary-600 rounded-full p-2"
              @click.prevent="openEditModal(props.row)"
            >
              <Icon-Edit class="text-neutral-100" size="4" />
            </a>
            <a
              href="#"
              class="bg-error-base rounded-full p-2"
              @click.prevent="deleteAlvara(props.row.id)"
            >
              <Icon-Trash class="text-neutral-100" size="4" />
            </a>
          </div>
        </b-table-column>
      </template>
    </b-table>
    <Not-Found-Data v-else-if="!loading" text="Nenhum alvará registrado" />
    <b-modal :active.sync="editModal" v-if="editModal" width="500px">
      <Edit-Alvara
        :alvara="currentAlvara"
        :empresa-id="currentAlvara.empresa.id"
        @edit-alvara="onEditAlvara"
      />
    </b-modal>
    <b-modal :active.sync="createModal" v-if="createModal" width="500px">
      <Create-Alvara @create-alvara="onCreateAlvara" />
    </b-modal>
  </div>
</template>

<script>
import {
  indexAlvarasRequest,
  destroyAlvarasRequest,
} from "@/services/requests/alvaras";
import EditAlvara from "@/views/empresas/alvaras/Edit";
import CreateAlvara from "@/views/empresas/alvaras/Create";
import NotFoundData from "@/components/layouts/NotFoundData";
import moment from "moment";
import { monthNames, dayNames } from "@/utils/utils";

import Treeselect from "@riophae/vue-treeselect";

export default {
  name: "AlvarasIndex",
  components: { EditAlvara, CreateAlvara, NotFoundData, Treeselect },
  data() {
    return {
      monthNames,
      dayNames,
      moment,
      loading: false,
      createModal: false,
      editModal: false,
      alvaras: [],

      currentAlvara: null,
      carteira: null,
      carteiras: [],
      form: {
        data_inicio: new Date(),
        data_fim: new Date(),
        carteira: {},
      },
    };
  },
  filters: {
    statusType: (val) => {
      if (val.status === "normal") {
        return "is-success";
      }

      if (val.status === "vencido") {
        return "is-danger";
      }
      return "default";
    },
  },
  computed: {
    lista_carteiras() {
      //  return this.$store.state.carteira.lista_carteiras;

      let carteira = Object.values(this.$store.state.carteira.lista_carteiras);
      let data = [{id:0,label:'todas'}];
      for (let i = 0; i < carteira.length; i++) {
        data.push({ id: carteira[i].id, label: carteira[i].nome });
      }
      return data;
    },
    lista_alvaras() {
      let alvara = this.alvaras;
      if (this.carteira) {
        return (alvara = alvara.reduce((res, data) => {
          data.carteiras.forEach((element) => {
            if (this.carteira == element.id) {
              res.push(data);
            }
          });

          return res;
        }, []));
      }

      return alvara;
    },
  },

  methods: {
    listar_carteiras() {
      this.$store.dispatch("carteira/listar_carteiras");
    },

    fetchAlvaras() {
      this.listar_carteiras();
      this.loading = true;
      indexAlvarasRequest()
        .then((res) => (this.alvaras = res.data.data))
        .finally(() => (this.loading = false));
    },
    openCreateModal() {
      this.createModal = true;
    },
    openEditModal(currentAlvara) {
      this.currentAlvara = currentAlvara;
      this.editModal = true;
    },
    onEditAlvara() {
      this.fetchAlvaras();
      this.editModal = false;
    },
    onCreateAlvara() {
      this.fetchAlvaras();
      this.createModal = false;
    },
    deleteAlvara(id) {
      this.$buefy.dialog.confirm({
        message: "Deseja realmente excluir o alvará desta empresa?",
        confirmText: "Excluir",
        cancelText: "Cancelar",
        type: "is-danger",
        onConfirm: () => this.onDeleteAlvara(id),
      });
    },
    onDeleteAlvara(id) {
      destroyAlvarasRequest(id)
        .then(() => {
          this.$snack.success("Alvará excluido com sucesso");
          this.fetchAlvaras();
        })
        .catch(() => this.$snack.error("Não foi possivel excluir o alvará"));
    },
    gerarRelatorio() {
      this.form.carteira = this.carteira;

      this.$store.dispatch("empresas/gerarRelatorioAlvara", this.form);
    },
  },
  beforeMount() {
    this.fetchAlvaras();
  },
};
</script>
