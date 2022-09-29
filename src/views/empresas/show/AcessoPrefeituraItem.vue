<template>
  <div class="bg-neutral-100 rounded p-6 shadow-lg">
    <div class="flex items-center mb-4">
      <p class="font-display text-xl font-bold" v-text="acessoItem.label"/>
    </div>
    <div class="w-full flex flex-col">
      <div class="flex-col" v-if="acessoItem.acesso || isEditting">
        <form class="flex flex-col" @submit.prevent="submitMethod">
          <div class="flex items-center py-3">
            <div class="flex items-center">
              <span class="font-bold pr-2">Site:</span>
            </div>
            <div :class="{'truncate': !isEditting }">
              <transition name="fade" mode="out-in">
                <a
                  target="_blank"
                  class="underline"
                  :href="acessoItem.acesso.site"
                  v-text="acessoItem.acesso.site"
                  v-if="!isEditting"
                />
                <Lynx-Input v-model="$v.form.site.$model" :error="$v.form.site.$error" v-else/>
              </transition>
            </div>
          </div>
          <div class="flex items-center py-3">
            <p class="flex items-center">
              <span class="pr-2 font-bold">Login:</span>
              <transition name="fade" mode="out-in">
                <span class="truncate" v-text="acessoItem.acesso.login" v-if="!isEditting"/>
                <Lynx-Input v-model="$v.form.login.$model" :error="$v.form.login.$error" v-else/>
              </transition>
            </p>
          </div>
          <div class="flex items-center py-3">
            <p class="flex items-center">
              <span class="pr-2 font-bold">Senha:</span>
              <transition name="fade" mode="out-in">
                <span
                  class="truncate"
                  v-text="acessoItem.acesso.senha"
                  v-if="!isEditting"
                />
                <Lynx-Input v-model="$v.form.senha.$model" :error="$v.form.senha.$error" v-else/>
              </transition>
            </p>
          </div>
          <Lynx-Button
            class="my-4 self-start"
            text="Editar"
            icon="Edit"
            size="small"
            icon-size="4"
            @click.native="onEdit"
            v-if="!isEditting"
            type="button"
          />
          <div class="flex justify-between self-start py-4 w-full" v-else>
            <Lynx-Button text="Cancelar" :outlined="true" type="button" @click.native="cancelEditting" size="small"/>
            <Lynx-Button text="Salvar" type="submit" size="small"/>
          </div>
        </form>
      </div>
      <div class="my-4 self-center flex flex-col items-center" v-else>
        <NotFoundData text="Acesso ainda não cadastrado"/>
        <Lynx-Button text="Cadastrar" icon="Plus" @click.native="onCreate"/>
      </div>
    </div>

  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { acessosPrefeiturasCreateRequest, acessosPrefeiturasUpdateRequest} from '@/services/requests/acessoPrefeitura'
import { required, url } from 'vuelidate/lib/validators'
import NotFoundData from '@/components/layouts/NotFoundData'
import formMixin from '@/mixins/form'

export default {
  name: 'AcessoPrefeituraItem',
  components: { NotFoundData },
  mixins: [formMixin],
  props: {
    acessoItem: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      isEditting: false,
      loadingButton: false,
      submitMethod: null,
      form: {
        login: '',
        senha: '',
        site: '',
      },
      validationsMessage: {
        form: {
          login: {
            required: 'O campo é login obrigatório'
          },
          senha: {
            required: 'O campo é senha obrigatório'
          },
          site: {
            required: 'O campo é site obrigatório',
            url: 'Insira um site válido'
          },
        }
      }
    }
  },
  validations: {
    form: {
      login: { required },
      senha: { required },
      site: {
        required,
        url
      },
    }
  },
  computed: {
    ...mapGetters(['getEmpresa']),
  },
  methods: {
    onEdit() {
      this.submitMethod = this.updateAcessoPrefeitura
      this.form = {
        ...this.acessoItem.acesso
      }
      this.isEditting = true
    },
    onCreate() {
      this.submitMethod = this.createAcessoPrefeitura
      this.isEditting = true
    },
    updateAcessoPrefeitura() {
      if(this.$v.form.$invalid) return this.snackValidationMessage(this.$v, this.validationsMessage)
      const form = {
        ...this.form,
        tipo: this.acessoItem.tipo
      }
      acessosPrefeiturasUpdateRequest(this.getEmpresa.id, this.acessoItem.acesso.id, form)
        .then(() => {
          this.$emit('update-acesso')
          this.cancelEditting()
          this.$snack.success('Acesso editado com sucesso')
        })
        .catch(() => this.$snack.error('Não foi possível cadastrar o acesso'))
    },
    createAcessoPrefeitura() {
      if(this.$v.form.$invalid) return this.snackValidationMessage(this.$v, this.validationsMessage)
      const form = {
        ...this.form,
        tipo: this.acessoItem.tipo
      }
      acessosPrefeiturasCreateRequest(this.getEmpresa.id, form)
        .then(() => {
          this.$emit('update-acesso')
          this.cancelEditting()
          this.$snack.success('Acesso cadastrado com sucesso')
        })
        .catch(() => this.$snack.error('Não foi possível cadastrar o acesso'))
    },
    cancelEditting() {
      this.form = {}
      this.isEditting = false
    }
  },
}
</script>
