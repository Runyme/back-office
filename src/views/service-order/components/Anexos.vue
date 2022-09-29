<template>
  <div class="grid grid-cols-3 md:grid-cols-3 mt-4">
    <div v-for="(value, key) in anexos" :key="key">
      <div class="anexos-file mx-1 mb-1">

        <span v-on:click="openFile(value)">
          <b-icon v-if="!value.loading" icon="attachment"></b-icon>
          <b-icon v-if="value.loading" icon="refresh border-0" class="float-left" custom-class="spinner"></b-icon>
          {{ value.name || value.nome_original || value.caminho || value.arquivo }}
        </span>

        <b-button size="is-small" class="float-right p-0 m-0 h-0" type="is-text"
                  v-on:click="deleteAnexo(value, key)" v-if="isDeletabled">
          <b-icon
            icon="close"
            class="delete-anexo-button mt-1"
            size="is-small"
          ></b-icon>
        </b-button>

      </div>
    </div>
  </div>
</template>

<script>
  import {arquivoDelete} from '../../../services/requests/arquivos';

  export default {
    name: "Anexos",
    props: {
      anexos: {
        type: Array,
        required: true
      },
      isDeletabled: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        loadingDelete: false,
      }
    },
    methods: {
      deleteAnexo(arquivo, index) {
        if (!arquivo.id) {
          this.anexos.splice(index, 1);
          return;
        }
        this.$forceUpdate();
        arquivo.loading = true;
        arquivoDelete(arquivo.id)
          .then(response => {
            this.$snack.success(response.data.message);
            this.anexos.splice(index, 1);
          })
          .catch(error => this.$snack.error(error.response.data.message))
          .finally(() => arquivo.loading = false)
      },
      openFile(file) {
        if (!file || !file.id) return;
        const path = `${process.env.VUE_APP_API_URL}/arquivos/${file.id}/open?token=${localStorage.getItem('lynx-token')}`;
        window.open(path, '_blank');
      }
    }
  }
</script>

<style scoped>
  .anexos-file {
    border: 1px solid #667EEA;
    padding: 5px 10px;
    border-radius: 5px;
    color: #667EEA;
    cursor: pointer;
  }

  .delete-anexo-button {
    border-radius: 41px;
    font-size: 11px;
    background-color: red;
    color: #fff;
    padding: 9px;
    cursor: pointer;
    opacity: 0.6;
    float: right;
  }
</style>
