<template>
  <div>
    <Lynx-Title text="Upload de Certidão Negativa de Débitos"/>
    <Lynx-OverlaySpinner v-if="loading" :loading="loading"/>
    <DragAndDropInput @upload="upload" :uploadSuccess="uploadSuccess"/>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import DragAndDropInput from "../../components/shared/DragAndDropInput";
  import base64Files from "../../mixins/base64Files";
  import {uploadCertidoesNegativasRequest} from "../../services/requests/certidaoNegativa";

  export default {
    name: "UploadCertidaoNegativa",
    components: {DragAndDropInput},
    mixins: [base64Files],
    data: () => ({
      loading: false,
      uploadSuccess: false,
    }),
    computed: {
      ...mapGetters(['getCompetenciaDate']),
    },
    methods:{
      upload(files) {
        this.loading = true;
        this.uploadSuccess = false;
        this.base64Files(files).then(files => {
          const certidoes = files.map(({name, base64}) => ({ name, base64, competencia: this.getCompetenciaDate }));
          uploadCertidoesNegativasRequest({ certidoes })
            .then(response => {
              this.loading = false;
              this.uploadSuccess = true;
              this.$snack.success(response.data.message);
            })
            .catch(error => {
              this.loading = false;
              const errors = error.response.data.errors;
              if (!errors) this.$snack.error(error.response.data.message);
              for (const errorMessage in errors) {
                this.$snack.error(errors[errorMessage][0] || error.response.data.message);
              }
            });
        });
      },
    },
  }
</script>
