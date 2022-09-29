<template>
  <div>
    <div>
      <Lynx-OverlaySpinner v-if="loading" :loading="loading"/>
      <Lynx-Title :text="$route.meta.title"/>
      <form class="flex flex-col" @submit.prevent="onSubmit">
        <label class="flex flex-col w-full pb-8">
          <Lynx-Label
            label="Nome da Carteira"
            :validator="$v.form.nome"
            :validations-message="validationsMessage.form.nome"
          />
          <Lynx-Input
            placeholder="Nome da Carteira"
            :error="$v.form.nome.$error"
            v-model.trim="$v.form.nome.$model"
          />
        </label>
        <label class="flex flex-col w-full pb-8">
          <Lynx-Label
            label="Setor"
            :validator="$v.form.setor"
            :validations-message="validationsMessage.form.setor"
          />
          <b-select
            placeholder="Setor"
            :error="$v.form.setor.$error"
            v-model.trim="$v.form.setor.$model"
          >
            <option
              v-for="(item, key) in ['Gestor','contabilidade', 'rh', 'onboarding', 'KAM']"
              :key="key"
              :value="item"
            >
              {{item}}
            </option>
          </b-select>
        </label>
        <label class="flex flex-col pb-8">
          <Lynx-Label
            label="Responsável"
            :validator="$v.form.responsavel_id"
            :validations-message="validationsMessage.form.responsavel_id"
          />
          <b-autocomplete
            placeholder="Pesquise um usuário"
            :data="users"
            field="nome_completo"
            @input="fetchAsyncUsers"
            :value="form.responsavel"
            @select="option => form.responsavel_id = option.id"
            :loading="isFetchingUsers"
          />
        </label>
        <div class="flex justify-between">
          <router-link :to="{ name: 'carteiras.index' }">
            <Lynx-Button type="button" text="Voltar" icon="ArrowLeft" outlined="true"/>
          </router-link>
          <Lynx-Button type="submit" text="Enviar" icon="Check" :loading="loadingButton"/>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import {required} from "vuelidate/lib/validators";
  import {carteiraByIdRequest, createCarteiraRequest, updateCarteiraRequest} from "../../services/requests/carteiras";
  import {searchUsersRequest} from "../../services/requests/users";

  export default {
    name: 'CarteirasForm',
    data: () => ({
      loading: false,
      loadingButton: false,
      isFetchingUsers: false,
      form: {
        nome: null,
        setor: null,
        responsavel_id: null,
      },
      validationsMessage: {
        form: {
          nome: {
            required: 'Insira o nome da Carteira',
          },
          setor: {
            required: 'Insira um Setor',
          },
          responsavel_id: {
            required: 'Selecione um Responsável',
          },
        },
      },
      users: [],
    }),
    validations: {
      form: {
        nome: { required },
        setor: { required },
        responsavel_id: { required },
      }
    },
    mounted() {
      if (this.$route.params.id) {
        this.fetchCarteira();
      }
    },
    methods: {
      fetchCarteira() {
        this.loading = true;
        carteiraByIdRequest(this.$route.params.id)
          .then(res => {
            const { nome, setor, responsavel_id, responsavel } = res.data.data;
            this.form = { nome, setor, responsavel_id, responsavel: responsavel.nome_completo };
          })
          .catch(() => {
            this.$router.push({ name: 'carteiras.index' });
            this.$snack.error('Carteira não encontrado.');
          })
          .finally(() => this.loading = false);
      },
      fetchAsyncUsers(nome) {
        if(!nome || nome.length < 3) return;
        this.isFetchingUsers = true;
        searchUsersRequest(nome)
          .then(response =>  this.users = response.data.data)
          .catch(error => this.$snack.error(error.response.data.message))
          .finally(() => this.isFetchingUsers = false);
      },
      onSubmit() {
        if(this.$v.$invalid) {
          this.$snack.error('Preencha o formulário corretamente.');
          return;
        }
        this.loadingButton = true;
        if (this.$route.params.id) {
          this.updateRequest();
          return;
        }
        this.createRequest();
      },
      createRequest() {
        createCarteiraRequest(this.form)
          .then(() => {
            this.$snack.success('Carteira criada com sucesso.');
            this.$router.push({ name: 'carteiras.index' });
          })
          .catch(() => this.$snack.error('Erro ao criar Carteira.'))
          .finally(() => this.loadingButton = false);
      },
      updateRequest() {
        updateCarteiraRequest(this.form, this.$route.params.id)
          .then(() => {
            this.$snack.success('Carteira alterada com sucesso.');
            this.$router.push({ name: 'carteiras.index' });
          })
          .catch(() => this.$snack.error('Erro ao alterar Carteira.'))
          .finally(() => this.loadingButton = false);
      },
    },
  }
</script>
