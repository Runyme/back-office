<template>
  <div>
    <b-loading :active.sync="loading" />
    <div class="w-full flex justify-between items-start">
      <Lynx-Title text="Declarações IRPF" />
      <div class="flex space-x-4">
        <label class="pb-4 flex flex-col">
          <Lynx-Label label="Competencia" />
          <b-select v-model="competencia_ano">
            <option
              v-for="(ano, index) in anos"
              :key="index"
              :value="ano"
              v-text="ano"
            />
          </b-select>
        </label>
        <Lynx-Button
          class="mb-3"
          icon="Reload"
          text="Atualizar Lista"
          size="small"
          icon-size="3"
          @click.native="fetchQuestionario"
        />
        <Lynx-Button
          class="mb-3"
          icon="Plus"
          text="Cadastrar"
          size="small"
          icon-size="3"
          @click.native="modalOpened = true"
        />
      </div>
    </div>

    <div class="w-full">
      <b-table
        :data="questionario"
        draggable
        @dragstart="dragstart"
        @drop="drop"
        @dragover="dragover"
        @dragleave="dragleave"
      >
        >
        <template slot-scope="{ row }">
          <b-table-column label="Pergunta" field="pergunta">
            {{ row.pergunta }}
          </b-table-column>

          <b-table-column label="Ativo" field="ativo" width="20">
            <b-switch
              :true-value="1"
              :false-value="0"
              v-model="row.ativo"
              @input="(val) => updateQuestao(row.id, { ativo: val })"
            ></b-switch>
          </b-table-column>

          <b-table-column label="" field="id" width="20">
            <div class="flex text-sm items-center">
              <a
                href="#"
                class="mr-4 bg-primary-600 rounded-full p-2"
                @click.prevent="openQuetaoModal(row)"
              >
                <Icon-Edit class="text-neutral-100" size="4" />
              </a>
              <a
                href="#"
                class="mr-4 bg-error-base rounded-full p-2"
                @click.prevent="deleteQuestao(row.id)"
              >
                <Icon-Trash class="text-neutral-100" size="4" />
              </a>
            </div>
          </b-table-column>
        </template>
      </b-table>
    </div>

    <b-modal :active.sync="modalOpened" @close="questaoSelecionada = {}">
      <ModalEditarQuestao
        :questao="questaoSelecionada"
        @updated="questionUpdated"
      />
    </b-modal>
  </div>
</template>

<script>
import {
  deleteQuestionarioRequest,
  getQuestionarioRequest,
  updateQuestionarioRequest,
} from "@/services/requests/irpf";
import ModalEditarQuestao from "@/views/Irpf/ModalEditarQuestao";

export default {
  name: "Questionario",
  components: { ModalEditarQuestao },
  data() {
    return {
      competencia_ano :2021,
      anos: [2020, 2021],
      modalOpened: false,
      questaoSelecionada: {},
      loading: false,
      questionario: [],
    };
  },
  mounted() {
    this.fetchQuestionario();
  },
  methods: {
    fetchQuestionario() {
      this.loading = true;
      return getQuestionarioRequest(this.competencia_ano)
        .then(({ data }) => (this.questionario = data))
        .finally(() => (this.loading = false));
    },
    dragstart(payload) {
      this.draggingRow = payload.row;
      this.draggingRowIndex = payload.index;
      payload.event.dataTransfer.effectAllowed = "copy";
    },
    dragover(payload) {
      payload.event.dataTransfer.dropEffect = "copy";
      payload.event.target.closest("tr").classList.add("is-selected");
      payload.event.preventDefault();
    },
    dragleave(payload) {
      payload.event.target.closest("tr").classList.remove("is-selected");
      payload.event.preventDefault();
    },
    drop(payload) {
      payload.event.target.closest("tr").classList.remove("is-selected");
      const droppedOnRowIndex = payload.index;

      if (droppedOnRowIndex === this.draggingRowIndex) {
        return;
      }

      let dragged = this.questionario[this.draggingRowIndex];
      let target = this.questionario[droppedOnRowIndex];

      this.loading = true;
      Promise.all([
        this.updateQuestao(dragged.id, { order: droppedOnRowIndex }),
        this.updateQuestao(target.id, { order: this.draggingRowIndex }),
      ])
        .then(() => this.fetchQuestionario())
        .finally(() => (this.loading = false));
    },
    updateQuestao(id, data) {
      return updateQuestionarioRequest(id, data);
    },
    openQuetaoModal(questao) {
      this.questaoSelecionada = questao;
      this.modalOpened = true;
    },
    deleteQuestao(id) {
      if (!confirm("Deseja realmente deletar este pergunta?")) return false;
      this.loading = true;
      deleteQuestionarioRequest(id)
        .then(() => this.fetchQuestionario())
        .catch(() => this.$snack.error("Erro ao deletar!"))
        .finally(() => (this.loading = false));
    },
    questionUpdated() {
      this.questaoSelecionada = {};
      this.modalOpened = false;
      this.fetchQuestionario();
    },
  },
};
</script>

<style scoped>
</style>
