<template>
  <div class="bg-white">
    <div class="flex justify-center w-full" v-if="loading">
      <Lynx-Spinner size="16" />
    </div>
    <div v-else>
      <b-notification
        type="is-danger"
        :closable="false"
        v-if="empresa.status === 'desativada'"
      >
        <p class="mb-2">
          <span class="pr-2 font-bold text-xl">Empresa desativada</span>
        </p>
        <p v-if="empresa.motivo">
          <span class="pr-2 font-bold">Motivo:</span>
          <span v-text="empresa.motivo" />
        </p>
        <p v-if="empresa.autor">
          <span class="pr-2 font-bold">Autor:</span>
          <span v-text="empresa.autor" />
        </p>
        <p v-if="empresa.data">
          <span class="pr-2 font-bold">Data:</span>
          <span
            v-text="
              new Date(empresa.data.toLocaleString()).toLocaleDateString()
            "
          />
        </p>
      </b-notification>
      <p>
        <span class="pr-2 font-bold">Razão Social:</span>
        <span v-text="empresa.razao_social" />
      </p>
      <p>
        <span class="pr-2 font-bold">CNPJ:</span>
        <span v-text="empresa.cnpj" />
      </p>

      <div v-if="empresa.status === 'desativada'">
        <label class="flex flex-col w-1/3 pt-4">
          <Lynx-Label label="Reativar empresa" />
          <b-select placeholder="Selecione um tipo" v-model="status">
            <option
              v-for="(option, key) in lista_status"
              :value="option.id"
              :key="key"
              v-text="option.label"
            />
          </b-select>
        </label>

        <div class="flex flex-col w-1/3 pt-2">
          <Lynx-Button
            text="salvar"
            class="mb-8"
            icon="Reload"
            @click.native="reativar"
            size="small"
            icon-size="3"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { empresasShowRequest } from "@/services/requests/empresas";

export default {
  name: "Geral",
  props: ["empresa"],
  data() {
    return {
      loading: false,
      status: null,
      lista_status: [
        { id: 1, label: "Processando" },
        { id: 2, label: "Aguardando assinatura" },
        { id: 3, label: "Aguardando certificado" },
        { id: 4, label: "Aguardando CNPJ" },
        { id: 5, label: "Aguardando alvará" },
        { id: 6, label: "Aguardando acesso" },
        { id: 7, label: "Aguardando simples" },
        { id: 8, label: "Aguardando Documentação" },
        { id: 9, label: "Pré-cadastro" },
        { id: 99, label: "Aguardando ativação" },
        { id: 100, label: "Ativo" },

      ],
    };
  },
  computed: {
    mensagem_alert() {
      return this.$store.state.empresas.mensagem_alert;
    },
  },
  methods: {
    async reativar() {
      await this.$store.dispatch("empresas/empresa_status_ativa", {
        status: this.status,
        empresas_id: this.empresa.id,
      });
    
      this.$snack.success(this.mensagem_alert.message);

      //     empresasShowRequest(this.empresa.id)
      // .then(res => {
      //   this.setEmpresa(res.data.data)
      //   this.$router.push({name: 'empresas.show'})
      // })
      // .catch(() => this.$snack.error('Empresa não encontrada'))
      // .finally(() => bus.globalLoading = false)
    },
  },
};
</script>

<style scoped>
</style>
