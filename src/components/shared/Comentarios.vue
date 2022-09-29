<template>
  <div>
    <b-collapse :open="true" aria-id="comentario-aria">
      <div class="flex items-center my-2" slot="trigger" aria-controls="comentario-aria">
        <Icon-Document class="text-primary-600" size="8"/>
        <p class="pl-4 font-display text-xl font-bold">Atividades</p>
      </div>
      <form class="pb-5" @submit.prevent="idComentario == null ? createComentario() : updateComentario()">
           <b-select v-model="status" placeholder="selecione um status">
              <option
                v-for="status in statusOptions"
                :key="status.id"
                :value="status.value"
                v-text="status.label"
              />
            </b-select>
        <div class="flex mt-4 h-16">
               
          <Textarea v-model="newComentario" placeholder="Escreva um comentário" class="rounded-none rounded-l"/>
          <Lynx-Button :text="idComentario == null ? 'Criar': 'Editar'" type="submit" class="h-full is-primary rounded-none rounded-r" :loading="loading"
                       :disable="loading"/>
        </div>
      </form>

      <div class="pb-4 " v-if="comentarios.length" style="max-height: 30rem;overflow: auto;">
        <h2 class="font-display font-bold text-md pb-1 text-primary-600">
          {{ comentarios.length }}
          Comentários
        </h2>
 

        <div :class="getColor(comentario.status)" class="my-3 shadow rounded p-2" v-for="(comentario, index) in comentarios" :key="index">
    
          <div class="flex" :class="comentario.status > 0 ? 'text-neutral-100': 'text-primary-500'" >
            <div class="font-display font-bold text-sm  flex flex-1">
              {{ comentario.usuario.nome_completo }}
              <div class="font-display text-xs  font-normal ml-2 flex-1">
                 {{comentario.created_at | formatEnToBr}}
              </div>
                   <a class=" ml-2 rounded-full p-2 hover:text-neutral-800" @click.prevent="getComentario(comentario)" >
                <Icon-Edit  size="5"/>
              </a>
            </div>

            <div class="font-display font-bold text-smflex-2"  v-if="hasRole('Super contador')|hasRole('super-admin') ">
              <a
              
                class="bg-error-light p-1 flex rounded-full text-neutral-100 ml-2 transition hover:text-error-dark"
                href="#"
                @click.prevent="handleRemove(comentario.id)"
              >
                <Icon-Cross size="2"/>
              </a>
               
            </div>
          </div>

          <span class="font-display my-2 text-neutral-900">{{ comentario.conteudo }}</span>
      

        </div>

      </div>

      <Not-Found-Data class="pb-8" text="Nenhum comentário!" v-else/>

    </b-collapse>
  </div>
</template>

<script>
import {
  ComentarioDelete,
  ComentarioIndex,
  ComentarioStore,
  ComentarioUpdate
} from "../../services/requests/comentarios";
import Textarea from "@/components/helpers/Textarea";
import NotFoundData from "@/components/layouts/NotFoundData";
import moment from "moment";
import {formatEnToBr} from "@/utils/momentHelpers";
import {hasRole} from '@/utils/can';

export default {
  name: "Comentarios",
  components: {Textarea, NotFoundData},
  props: ["commentableType", "commentableId"],
  data() {
    return {
      comentarios: [],
      newComentario: null,
      loading: false,
      status:null,
      idComentario:null,
      statusOptions: [
          {
            label: '',
            value: null,
          },
          {
            label: 'Verde',
            value: 1,
          },
          {
            label: 'Amarelo',
            value: 2,
          },
          {
            label: 'Vermelho',
            value: 3,
          }
        ]
    };
  },
    filters:{
      formatEnToBr
    },
  computed: {},
  methods: {
    humanizeDate(date) {
      return moment(date).fromNow();
    },
        hasRole,
    formatDate(date) {
      return moment(date).format("MMMM Do YYYY, h:mm a");
    },
  
    fetchComentarios() {
      this.loading = true;

      ComentarioIndex(this.commentableType, this.commentableId)
        .then((res) => (this.comentarios = res.data))
        .finally(() => (this.loading = false));
    },
    createComentario() {
      this.loading = true;

      const data = {
        commentable_type: this.commentableType,
        commentable_id: this.commentableId,
        conteudo: this.newComentario,
        status: this.status
      };

      ComentarioStore(data)
        .then(() => {
          this.$snack.success("Comentário criado com sucesso!")
          this.newComentario = null;
          this.fetchComentarios();
        })
        .catch(() => this.$snack.error("Erro ao criar o comentário!"))
        .finally(() => {
          this.loading = false;
        });
    },
    getComentario(value){
          this.idComentario = value.id
         this.newComentario = value.conteudo
         this.status = value.status
    },

    updateComentario(){
      
        const data = {
        conteudo: this.newComentario,
        status: this.status
      };

        ComentarioUpdate(this.idComentario,data)
        .then(() => {
          this.$snack.success("Atualizado com sucesso!")
          this.newComentario = null;
                this.status = null;
          this.idComentario = null;

          this.fetchComentarios();
        })
        .catch(() => this.$snack.error("Erro ao atualizado o comentário!"))
        .finally(() => {
          this.loading = false;
        });
    

    },
    handleRemove(id) {
      if (!confirm('Certeza que deseja apagar este comentário?')) {
        return
      }
      ComentarioDelete(id)
        .then(() => {
          this.fetchComentarios();
          this.$snack.success("Comentário removido com sucesso!")
        })
        .catch(error => this.$snack.error(error.response.data.message || 'Erro desconhecido ao remover.'))
        .finally(() => this.loading = false)
    },
      getColor(status) {
        switch (status) {
          case 1:
            return 'bg-success-base'
          case 2:
            return 'bg-warning-base'
          case 3:
            return 'bg-error-base'
        }
      },
  },

  beforeMount() {
    this.fetchComentarios();
  },
      
};
</script>
