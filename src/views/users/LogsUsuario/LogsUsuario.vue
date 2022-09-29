<template>
  <div class="w-full">
    <Lynx-Title text="Usuários Logs" />

    <div
      class="
        bg-white
        p-5
        rounded
        w-full
        flex
        items-center
        justify-around
        hover:shadow-lg
        transition
        relative
      "
    >
      <div class="flex flex-col">
        <div class="w-full flex">
          <label class="flex flex-col w-1/2 pb-6 pr-3">
            <Lynx-Label label="Data Inicial" />
            <b-datepicker
              v-model="data_inicio"
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
              v-model="data_fim"
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
        </div>
      </div>
      <div class="flex justify-center w-full" v-if="loading">
        <Lynx-Spinner size="12" />
      </div>

      <div class="w-full flex justify-between items-end pb-8">
        <div class="flex">
          <label class="flex flex-col w-3/3 pl-4">
            <Lynx-Label label="Tipo de Status" />
            <b-select placeholder="Selecione um tipo" v-model="subsject_type">
               <option value="" v-text="'todos'" />
              <option
                v-for="(lista, index) in lista_subsject_types"
                :key="index"
                :value="lista.subject_type"
                v-text="
                  lista.subject_type.substring(
                    lista.subject_type.lastIndexOf('\\') + 1
                  )
                "
              />
            </b-select>
          </label>
          <label class="flex flex-col w-3/3 pl-4">
            <Lynx-Label label="Usuarios" />
            <b-select placeholder="Selecione um usuario" v-model="usuario">
               <option value="" v-text="'todos'" />

              <option
                v-for="(lista, index) in users"
                :key="index"
                :value="lista.id"
                v-text="lista.nome_completo"
              />
            </b-select>
          </label>
        </div>
      </div>
      <Lynx-Button
        class="ml-3 mb-2"
        text="Logs Usuario"
        icon="Search"
        icon-size="3"
        size="small"
        outlined="true"
        @click.native="listar_logs()"
      />
    </div>
    
    <div
       v-show="type.substring(type.lastIndexOf('\\') + 1) != ''"
      class="
        mt-5
        bg-white
        p-5
        rounded
        w-full
        justify-around
        hover:shadow-lg
        transition
        relative
      "
    >
      <div class="flex justify-center w-full" v-if="loading2">
        <Lynx-Spinner size="12" />
      </div>

      <Lynx-Title :text="type.substring(type.lastIndexOf('\\') + 1)" />
      <div class="flex flex-col justify-between">
        <div v-for="(lista, index) in lista_logs" :key="index">
          <div class="flex flex-col justify-between items-start mb-2 mt-2">
            <div class="flex">
              <Lynx-Label label="Ação: " />
              <Lynx-Label
                class="uppercase ml-2"
                :label="
                  lista.description == 'updated'
                    ? 'atualização'
                    : lista.description == 'created'
                    ? 'criação'
                    : lista.description
                "
              />
            </div>
            <div class="flex mt-2">
              <Lynx-Label label="Usuario ID: " />

              <Lynx-Label class="ml-2" :label="lista.causer_id + ''" />
            </div>
            <div class="flex mt-2">
              <Lynx-Label label="Usuario: " />

              <Lynx-Label class="ml-2" :label="lista.nome_completo" />
            </div>
            <div class="flex mt-2">
              <Lynx-Label label="Propriedades: " />

              {{ !lista.properties.attributes ? "sem atribustos" : "" }}

              <Lynx-Button
                v-show="lista.properties.attributes ? true : false"
                class="rounded-full ml-2 mb-2"
                size="small"
                @click.native="openModal(lista.properties)"
                icon="Eye"
                icon-size="4"
              />

              <!-- <Lynx-Label class="ml-2" :label="lista.properties.attributes" /> -->
            </div>
          </div>
          <hr
            style="
              border: 0;
              height: 2px;
              background-image: linear-gradient(
                to right,
                transparent,
                #ccc,
                transparent
              );
            "
          />
        </div>
      </div>
    </div>
    <b-modal :active.sync="propriedadesModel">
      <div class="bg-neutral-300 p-8">
        <div
          v-if="propriedades.attributes"
          class="flex flex-col justify-between items-start mb-2 mt-2"
        >
          <div v-for="(itens, index) in propriedades.attributes" :key="index">
            <div class="flex mt-2">
              <!-- <p> -->
              <!-- {{ index }}
                    </p> -->
              <Lynx-Label class="ml-1" :label="index + ': '" />

              <Lynx-Label class="ml-1" :label="itens" />
            </div>
          </div>
          <div
            v-if="propriedades.old"
            class="flex flex-col justify-between items-start mb-2 mt-2"
          >
            <div v-for="(itens, index) in propriedades.old" :key="index">
              <div class="flex mt-2">
                <p>
                  {{ index }}
                </p>
                <p>
                  {{ itens }}
                </p>
                <!-- <Lynx-Label class="ml-1" :label="index + ': '" />

              <Lynx-Label class="ml-1" :label="itens" /> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { usersRequest } from "@/services/requests/users";

import moment from "moment";
import { monthNames, dayNames } from "@/utils/utils";

export default {
  data() {
    return {
      users: [],
      usuario: "",
      loading: false,
      loading2: false,
      type: "",
      monthNames,
      moment,
      dayNames,
      subsject_type: "",
      data_inicio: new Date(),
      data_fim: new Date(),
      propriedadesModel: false,
      propriedades: [],
    };
  },
  created() {
    this.listar_subject_type();
    this.fetchUsers();
  },
  computed: {
    lista_subsject_types() {
      return this.$store.state.activityLogs.lista_subsject_types;
    },
    lista_logs() {
      return this.$store.state.activityLogs.lista_logs;
    },
  },
  methods: {
    async listar_subject_type() {
      this.loading = true;
      await this.$store
        .dispatch("activityLogs/listar_subject_type")
        .finally(() => {
          //   this.$store.dispatch("configEmpresa/atualizar", "");
          this.loading = false;
        });
    },
    async listar_logs() {
      this.loading2 = true;

      var a = {
        subject_type: this.subsject_type,
        data_inicio: this.data_inicio,
        data_fim: this.data_fim,
        usuario: this.usuario,
      };
      this.type = this.subsject_type == '' ? 'todos' :this.subsject_type ;
      await this.$store.dispatch("activityLogs/listar_logs", a).finally(() => {
        // this.$store.dispatch("configEmpresa/atualizar", "");
        this.loading2 = false;
      });
    },
    openModal(value) {
      this.propriedadesModel = true;
      this.propriedades = value;
    },
    fetchUsers() {
      this.loading = true;
      usersRequest()
        .then(
          (res) =>
            (this.users = res.data.data.sort((a, b) => {
              if (a.nome_completo < b.nome_completo) return -1;
              if (a.nome_completo > b.nome_completo) return 1;
              return 0;
            }))
        )
        .catch(() => {
          this.$snack.error({
            text: "Ocorreu um erro, tente novamente mais tarde",
            button: "X",
          });
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>
