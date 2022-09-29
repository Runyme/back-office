<template>
  <div class="h-full w-full">
    <div class="flex justify-end items-center mt-1 mr-1 ">
      <div
        class="p-2 bg-neutral-700 text-primary-100 rounded text-1xl uppercase font-bold flex-col  "
      >
        {{ socio.socio_administrador == 1 ? "Administrador" : "" }}
      </div>
    </div>
    <div class="flex items-center truncate px-8 pt-2">
      <div
        class="p-2 bg-primary-500 text-primary-100 mr-8 rounded text-2xl mb-8"
      >
        C{{ socio.id }}
      </div>
      <Lynx-Title :text="socio.nome_completo" />
    </div>

    <div class="flex pb-8">
      <div class="px-8 w-1/2 border-r-2 border-neutral-300">
        <span class="text-display text-2xl text-primary-600"
          >Dados Cadastrais</span
        >
        <div class="flex items-center pt-4">
          <ul class="flex-grow pr-4">
            <li class="py-3 flex items-center">
              <p class="text-neutral-700 pl-2 font-bold">
                Nome:
                <span class="font-normal text-neutral-800">{{
                  socio.nome_completo
                }}</span>
                <b-tooltip
                  label="copiado"
                  :active="copiado === socio.nome_completo"
                  always
                >
                  <button class="ml-2" @click="copyText(socio.nome_completo)">
                    <b-icon icon="content-copy" size="is-small"></b-icon>
                  </button>
                </b-tooltip>
              </p>
            </li>
            <li class="flex py-3 items-center">
              <p class="text-neutral-700 pl-2 font-bold">
                CPF:
                <span class="font-normal text-neutral-800">{{
                  socio.cpf
                }}</span>
                <b-tooltip
                  label="copiado"
                  :active="copiado === socio.cpf"
                  always
                >
                  <button class="ml-2" @click="copyText(socio.cpf)">
                    <b-icon icon="content-copy" size="is-small"></b-icon>
                  </button>
                </b-tooltip>
              </p>
            </li>
          </ul>
          <a href="#" @click.prevent="goToSocio(socio.id)">
            <Icon-ArrowRight class="text-primary-600" />
          </a>
        </div>
      </div>
      <div class="px-8 w-1/2">
        <span class="text-display text-2xl text-primary-600">Persona</span>
        <div class="flex-col pt-4">
          <ul class="flex-grow pr-4">
            <li class="py-3 flex items-center">
              <p class="text-neutral-700 pl-2 font-bold">
                Especialização:
                <span class="font-normal text-neutral-800">Lorem Ipsum</span>
              </p>
            </li>
            <li class="py-3 flex items-center">
              <p class="text-neutral-700 pl-2 font-bold">
                Instituição:
                <span class="font-normal text-neutral-800">UEM</span>
              </p>
            </li>
            <li class="py-3 flex items-center">
              <p class="text-neutral-700 pl-2 font-bold">
                Ano de Conlcusão:
                <span class="font-normal text-neutral-800">2014</span>
              </p>
            </li>
            <li class="flex items-center">
              <p class="text-neutral-700 pl-2 font-bold flex items-center">
                Trabalha como PF:
                <b-checkbox class="pl-4" />
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from "@/services/bus";
import { clientesShowRequest } from "@/services/requests/clientes";
import { mapActions } from "vuex";

export default {
  name: "EmpresaShowSocios",
  props: ["socio"],
  data() {
    return {
      copiado: false,
    };
  },
  methods: {
    ...mapActions(["setCliente"]),
    goToSocio(id) {
      bus.globalLoading = true;
      clientesShowRequest(id)
        .then((res) => {
          this.setCliente(res.data.data);
          this.$router.push({ name: "clientes.show" });
        })
        .finally(() => (bus.globalLoading = false));
    },

    copyText(value) {
      this.$copyText(value);
      this.copiado = value;
      setTimeout(() => (this.copiado = false), 1500);
    },
  },
};
</script>
