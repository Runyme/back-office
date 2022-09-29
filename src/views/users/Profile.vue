<template>
  <div>
    <b-loading :active.sync="loading"/>
    <Lynx-Title text="Perfil"/>
    <Card color="primary-200">
      <div class="p-4 w-full flex sm:flex-col sm:items-center sm:py-6">
        <div class="cursor-pointer" @click="openPicInput">
          <UserAvatar sexo="F" :avatar="getUser.availableIncomingBitrate" :base64="imgPrev"/>
        </div>
        <div class=" flex flex-col pl-4 font-thin sm:pl-0 sm:pt-6">
          <p class="text-neutral-700 text-xl">{{ getUser.nome_completo }}</p>
          <div class="pt-2 text-neutral-600">
            <p><span class="font-normal">Email:</span> {{ getUser.email }}</p>
          </div>
        </div>
      </div>
    </Card>
    <form class="pt-8 flex flex-col font-thin" @submit.prevent="onSubmit">
      <input type="file" class="hidden" ref="avatarInput" @change="onPicInputChange">
      <label class="flex flex-col w-full pb-6">
        <div class="flex justify-between items-center pb-2">
          <span>Nome Completo</span>
          <div v-if="$v.form.nome_completo.$error">
            <Lynx-Tooltip
              :content="validationsMessage.form.nome_completo.required"
              v-if="!$v.form.nome_completo.required"
              theme="error"
            />
          </div>
        </div>
        <Lynx-Input
          placeholder="Insira seu nome completo"
          :error="$v.form.nome_completo.$error"
          v-model.trim="$v.form.nome_completo.$model"
        />
      </label>
      <label class="flex flex-col w-full pb-6">
        <div class="flex justify-between items-center pb-2">
          <span>Email</span>
          <div v-if="$v.form.email.$error">
            <Lynx-Tooltip
              :content="validationsMessage.form.email.email"
              v-if="!$v.form.email.email"
              theme="error"
            />
          </div>
        </div>
        <Lynx-Input
          placeholder="Insira seu email"
          :error="$v.form.email.$error"
          v-model.trim="$v.form.email.$model"
          type="email"
        />
      </label>
      <a href="#" class="mb-6 self-start" @click.prevent="toggleMudarSenha">
        <span class="flex items-center" v-if="mudarSenha">
          <Icon-Minus size="smaller" class="text-primary-500"/>
          <span class="pl-2">Esconder Senha</span>
        </span>
        <span class="flex items-center" v-if="!mudarSenha">
          <Icon-Locker size="smaller" class="text-primary-500"/>
          <span class="pl-2">Mudar Senha</span>
        </span>
      </a>
      <div v-if="mudarSenha">
        <label class="flex flex-col w-full pb-6">
          <div class="flex justify-between items-center pb-2">
            <span>Senha Atual</span>
            <div v-if="$v.form.senha_atual.$error">
              <Lynx-Tooltip
                :content="validationsMessage.form.senha_atual.requiredIf"
                v-if="!$v.form.senha_atual.requiredIf"
                theme="error"
              />
            </div>
          </div>
          <Lynx-Input
            placeholder="Insira sua senha atual"
            :error="$v.form.senha_atual.$error"
            v-model.trim="$v.form.senha_atual.$model"
            type="password"
          />
        </label>
        <div class="w-full flex flex-wrap">
          <label class="flex flex-col w-1/2 sm:w-full sm:pr-0 pb-6 pr-3">
            <div class="flex justify-between items-center pb-2">
              <span>Nova Senha</span>
              <div v-if="$v.form.senha.$error">
                <Lynx-Tooltip
                  :content="validationsMessage.form.senha.requiredIf"
                  v-if="!$v.form.senha.requiredIf"
                  theme="error"
                />
              </div>
            </div>
            <Lynx-Input
              placeholder="Insira sua nova senha"
              :error="$v.form.senha.$error"
              v-model.trim="$v.form.senha.$model"
              type="password"
            />
            <small>minimo 6 caracteres</small>
          </label>
          <label class="flex flex-col w-1/2 sm:w-full sm:pl-0 pb-6 pl-3">
            <div class="flex justify-between items-center pb-2">
              <span>Confirme a nova senha</span>
              <div v-if="$v.form.senha_confirmacao.$error">
                <Lynx-Tooltip
                  :content="validationsMessage.form.senha_confirmacao.sameAs"
                  v-if="!$v.form.senha_confirmacao.sameAs"
                  theme="error"
                />
              </div>
            </div>
            <Lynx-Input
              placeholder="Repita sua nova senha"
              :error="$v.form.senha_confirmacao.$error"
              v-model.trim="$v.form.senha_confirmacao.$model"
              type="password"
            />
          </label>
        </div>
      </div>
      <Lynx-Button
        type="submit"
        icon="Check"
        text="Atualizar"
        class="self-end mt-2"
      />
    </form>
  </div>

</template>

<script>
import Card from "@/components/helpers/Card";
import {mapActions, mapGetters} from "vuex";
import {required, email, sameAs, requiredIf, minLength} from 'vuelidate/lib/validators'
import UserAvatar from "@/views/users/UserAvatar";
import {usersUpdateRequest} from "@/services/requests/users";

export default {
  name: "Profile",
  components: {Card, UserAvatar},
  data() {
    return {
      loading: false,
      form: {
        nome_completo: '',
        email: '',
        senha_atual: '',
        senha: '',
        senha_confirmacao: '',
      },
      validationsMessage: {
        form: {
          nome_completo: {required: 'Insira o seu nome completo'},
          email: {email: 'Insira um e-mail válido'},
          senha_atual: {required: 'Insira sua senha atual'},
          senha: {
            required: 'Insira uma nova senha',
            minLength: 'Pelomenos 6 caracteres para a nova senha!'
          },
          senha_confirmacao: {sameAs: 'As senhas devem ser identicas'}
        }
      },
      avatarUrl: '',
      imgPrev: false,
      mudarSenha: false,
      disableMudarSenha: false
    }
  },
  validations() {
    return {
      form: {
        nome_completo: {required},
        email: {email},
        senha_atual: {
          requiredIf: requiredIf(() => this.mudarSenha)
        },
        senha: {
          requiredIf: requiredIf(() => this.mudarSenha),
          minLength: minLength(6)
        },
        senha_confirmacao: {
          sameAs: sameAs('senha')
        }
      }
    }
  },
  computed: {
    ...mapGetters(['getUser'])
  },
  mounted() {
    this.form.nome_completo = this.getUser.nome_completo
    this.form.email = this.getUser.email
    this.avatarUrl = this.getUser.avatar
  },
  methods: {
    ...mapActions(['setCliente',]),
    onSubmit() {
      if (this.$v.$invalid) {
        this.$snack.error('Preencha corretamente o formulário');
        return;
      }
      this.loading = true

      let formData = {
        id: this.$store.state.user.user.id,
        nome_completo: this.form.nome_completo,
        email: this.form.email,
      }
      if (this.mudarSenha) {
        formData.senha_atual = this.form.senha_atual
        formData.senha = this.form.senha
        formData.senha_confirmacao = this.form.senha_confirmacao
      }

      usersUpdateRequest(formData)
        .then(response => {
          this.$store.dispatch('setUser', response.data.data)
          this.$snack.success('Dados atualizados com sucesso')
        })
        .catch(error => this.$snack.error(error.response.data.message))
        .finally(() => this.loading = false)
    },
    openPicInput() {
      return;
      const avatarInput = this.$refs.avatarInput;
      avatarInput.click();
    },
    onPicInputChange(e) {
      if (!e.target.files.length) return;
      this.form.avatar = e.target.files[0]
      const reader = new FileReader();
      const self = this;
      reader.onload = function (e) {
        self.avatarUrl = e.target.result;
      }
      reader.readAsDataURL(e.target.files[0]);
      this.imgPrev = true;
    },
    toggleMudarSenha() {
      this.mudarSenha = !this.mudarSenha
    }
  }

}
</script>

<style scoped>

</style>
