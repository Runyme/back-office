<template>
  <div class="shadow bg-neutral-300 p-8">
    <div class="w-full flex justify-between items-start">
      <Lynx-Title text="Contatos"/>
      <Lynx-Button text="Adicionar" icon="Plus" @click.native="addContato"/>
    </div>
    <div class="grid grid-cols-2 gap-8 items-start">
      <transition name="fade">
        <Card color="primary-500" :header="{ title:'Adicionar Contato', icon: 'Plus', textColor: 'white' }" v-if="creating">
          <form class="px-4 w-full py-2" @submit.prevent="createContato">
            <div class="flex items-center py-2">
              <Icon-Contact class="text-primary-700"/>
              <div class="pl-2 flex items-center">
                <span class="pr-4 text-primary-700">Tipo: </span>
                <div class="flex">
                  <select
                    class="px-2 border-l-4 border-solid border-primary-200 bg-white border-r-transparent rounded py-1 w-full transition focus:border-r-4 font-light shadow focus:outline-none"
                    v-model="$v.form.tipo.$model"
                  >
                    <option value="celular">Celular</option>
                    <option value="email">Email</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="flex items-center py-2">
              <component :is="`Icon-${getContatoIcon(form.tipo)}`" class="text-primary-700"/>
              <div class="pl-2 flex items-center">
                <span class="pr-4 text-primary-700">{{getTipoContatoLabel(form.tipo)}}: </span>
                <Lynx-Input class="flex-grow" v-model="$v.form.value.$model" :error="$v.form.value.$error" :mask="getContatoValueMask(form.tipo)"/>
              </div>
            </div>
            <div class="flex items-center py-2">
              <Icon-Info class="text-primary-700"/>
              <div class="pl-2 flex items-center">
                <span class="pr-4 text-primary-700">Notificável:</span>
                <div class="flex">
                  <b-checkbox v-model="$v.form.optin.$model"/>
                </div>
              </div>
            </div>
            <div class="flex items-center py-2" v-if="form.tipo === 'celular'">
              <Icon-Whatsapp class="text-primary-700"/>
              <div class="pl-2 flex items-center">
                <span class="pr-4 text-primary-700">Whatsapp:</span>
                <div class="flex">
                  <b-checkbox v-model="form.options.is_whatsapp"/>
                </div>
              </div>
            </div>
            <div class="flex items-center w-full justify-between my-2">
              <Lynx-Button
                text="Cancelar"
                size="small"
                outlined="true"
                type="button"
                color="error-base"
                @click.native="cancelAddContato"
              />
              <Lynx-Button
                text="Salvar"
                size="small"
                type="submit"
              />
            </div>
          </form>
        </Card>
      </transition>
      <Card
        color="primary-500"
        background="white"
        v-for="(contato, index) in contatos"
        :key="index"
      >
        <form class="px-4 w-full py-2" @submit.prevent="updateContato(index)">
          <div class="flex flex-col justify-between h-full">
            <div class="flex flex-col">
              <div class="flex items-center py-2">
                <Icon-Contact class="text-primary-700"/>
                <p class="pl-2 flex items-center">
                  <span class="pr-4 text-primary-700">Tipo:</span>
                  <transition name="fade" mode="out-in">
                    <span
                      class="font-light text-primary-700"
                      v-if="!isEditting(index)"
                      v-text="getTipoContatoLabel(contato.tipo)"
                    />
                    <select
                      class="px-2 border-l-4 border-solid border-primary-200 bg-white border-r-transparent rounded py-1 w-full transition focus:border-r-4 font-light shadow focus:outline-none"
                      v-model="$v.form.tipo.$model"
                      v-else
                    >
                      <option value="celular">Celular</option>
                      <option value="email">Email</option>
                    </select>
                  </transition>
                </p>
              </div>
              <div class="flex items-center py-2">
                <component :is="`Icon-${getContatoIcon(contato.tipo)}`" class="text-primary-700" v-if="!isEditting(index)"/>
                <component :is="`Icon-${getContatoIcon(form.tipo)}`" class="text-primary-700" v-else/>
                <p class="pl-2 flex items-center">
                  <span class="pr-4 text-primary-700" v-if="!isEditting(index)">{{getTipoContatoLabel(contato.tipo)}}: </span>
                  <span class="pr-4 text-primary-700" v-else>{{getTipoContatoLabel(form.tipo)}}: </span>
                  <transition name="fade" mode="out-in">
                    <span
                      class="font-light text-primary-700"
                      v-if="!isEditting(index)"
                      v-text="contato.value"
                    />
                    <Lynx-Input v-model="$v.form.value.$model" :mask="getContatoValueMask(form.tipo)" :error="$v.form.value.$error" v-else/>
                  </transition>
                </p>
              </div>
              <div class="flex items-center py-2">
                <Icon-Info class="text-primary-700"/>
                <p class="pl-2 flex items-center">
                  <span class="pr-4 text-primary-700">Notificável: </span>
                  <transition name="fade" mode="out-in">
                    <div class="flex" v-if="!isEditting(index)">
                      <Icon-Check class="text-primary-700" v-if="contato.optin"/>
                      <span class="text-primary-700 font-bold text-xl" v-else >X</span>
                    </div>
                    <b-checkbox v-model="$v.form.optin.$model" true-value="1" v-else/>
                  </transition>
                </p>
              </div>
              <div class="flex items-center py-2" v-if="(!isEditting(index) && contato.tipo === 'celular') || (isEditting(index) && form.tipo === 'celular')">
                <Icon-Whatsapp class="text-primary-700"/>
                <p class="pl-2 flex items-center">
                  <span class="pr-4 text-primary-700">Whatsapp: </span>
                  <transition name="fade" mode="out-in">
                    <div class="flex" v-if="!isEditting(index)">
                      <Icon-Check class="text-primary-700" v-if="contato && contato.options && contato.options.is_whatsapp"/>
                      <span class="text-primary-700 font-bold text-xl" v-else >X</span>
                    </div>
                    <b-checkbox v-model="form.options.is_whatsapp" v-else />
                  </transition>
                </p>
              </div>
            </div>
            <div>
              <div class="flex items-center w-full justify-between my-2" v-if="!isEditting(index)">
                <div class="flex">
                  <Lynx-Button
                    class="mr-4"
                    text="Editar"
                    size="small"
                    outlined="true"
                    @click.native="editContato(index)"
                    type="button"
                  />
                  <Lynx-Button
                    text="Excluir"
                    size="small"
                    outlined="true"
                    type="button"
                    color="error-base"
                    @click.native="handleDeleteContato(index)"
                  />
                </div>
              </div>
              <div class="flex items-center w-full justify-between my-2" v-else>
                <Lynx-Button
                  text="Cancelar"
                  size="small"
                  outlined="true"
                  color="error-base"
                  type="button"
                  @click.native="cancelEditContato"
                />
                <Lynx-Button
                  text="Salvar"
                  size="small"
                  type="submit"
                />
              </div>
            </div>
          </div>
        </form>
      </Card>
    </div>
  </div>
</template>

<script>

import { contatosCreateRequest, contatosUpdateRequest, contatosDeleteRequest } from '@/services/requests/contatos'
import Card from '@/components/helpers/Card'
import { required, maxLength, minLength, email } from 'vuelidate/lib/validators'
import formMixin from '@/mixins/form'

export default {
  name: 'ContatosDetails',
  components: { Card },
  mixins: [formMixin],
  data() {
    return {
      form: {
        tipo: '',
        value: '',
        optin: false,
        options: {
          is_whatsapp: false,
        }
      },
      editingIndex: null,
      creating: false,
      loading: false,
      searchMessage: 'Nenhum resultado encontrado...',
    }
  },
  validations() {
    let valueValidator = { email }
    if(this.form.tipo === 'celular') {
      valueValidator = {
        maxLength: maxLength(11),
        minLength: minLength(11)
      }
    }
    return {
      form: {
        tipo: { required },
        value: {
          required,
          ...valueValidator
        },
        optin: { required }
      }
    }
  },
  props: {
    contatos: {
      type: Array,
      required: true,
    },
    addOpened: {
      type: Boolean,
      default: false
    },
    contactable: {
      type: Object,
      required: true,
    }
  },
  computed: {
    validationsMessage() {
      let valueValidator = { email: 'Insira um e-mail válido' }
        if(this.form.tipo === 'celular') {
          valueValidator = {
            maxLength: 'Insira um celular válido',
            minLength: 'Insira um celular válido'
          }
        }
      return {
        form: {
          tipo: { required: 'O campo tipo é obrigatório' },
          value: {
            required: `O campo ${this.form.tipo === 'celular' ? 'Celular' : 'Email'} é obrigatório`,
            ...valueValidator
          },
          optin: { required: 'O campo notificável é obrigatório' }
        }
      }
    },
  },
  methods: {
    clearForm() {
      this.form = {
        tipo: '',
        value: '',
        optin: false,
        options: {
          is_whatsapp: false,
        }
      }
    },
    editContato(index) {
      this.editingIndex = index
      this.cancelAddContato()
      this.form = {
        ...this.contatos[index]
      }
      if(!this.contatos[index].options) this.form.options = {}
    },
    isEditting(index) {
      return this.editingIndex === index
    },
    cancelEditContato() {
      this.clearForm()
      this.editingIndex = null
    },
    updateContato(index) {
      if(this.$v.form.$invalid) {
        this.snackValidationMessage(this.$v, this.validationsMessage)
        return
      }
      this.loading = true
      const contatoId = this.contatos[index].id
      const form = {
        tipo: this.form.tipo,
        value: this.form.value,
        optin: this.form.optin,
        options: this.form.options
      }
      contatosUpdateRequest(contatoId, form)
        .then(() => {
          this.contatos[index] = this.form
          this.cancelEditContato()
          this.$snack.success('Contato editada com sucesso')
        })
        .catch(() => {
          this.$snack.error('Não foi possivel editar o contato')
          this.cancelEditContato()
        })
    },
    handleDeleteContato(index) {
      this.$buefy.dialog.confirm({
        message: 'Deseja realmente excluir o contato',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        type: 'is-danger',
        onConfirm: () => this.deleteContato(index)
      })
    },
    deleteContato(index) {
      this.loading = true
      const contatoId = this.contatos[index].id
      contatosDeleteRequest(contatoId)
        .then(() => {
          this.contatos.splice(index, 1)
          this.$snack.success('Contato removido com sucesso')
        })
        .catch(() => this.$snack.error('Não foi possivel excluir o contato'))
        .finally(() => this.loading = false)
    },
    addContato() {
      this.creating = true,
      this.cancelEditContato()
    },
    cancelAddContato() {
      this.creating = false
      this.clearForm()
    },
    createContato() {
      if(this.$v.form.$invalid) {
        this.snackValidationMessage(this.$v, this.validationsMessage)
        return
      }
      const form = {
        contactable_type: this.contactable.type,
        contactable_id: this.contactable.id,
        tipo: this.form.tipo,
        value: this.form.value,
        optin: this.form.optin,
        options: this.form.options
      }
      this.loading = true
      contatosCreateRequest(form)
        .then(res => {
          this.contatos.unshift(res.data)
          this.cancelAddContato()
          this.$snack.success('Contato adicionado com sucesso')
        })
        .catch(() => {
          this.$snack.error('Não foi possivel adicionar o contato')
          this.cancelAddContato()
        })
    },
    getTipoContatoLabel(tipoContato) {
      return tipoContato === 'email' ? 'Email' : 'Celular'
    },
     getContatoIcon(tipoContato) {
      return tipoContato === 'email' ? 'Mail' : 'Phone'
    },
     getContatoValueMask(tipoContato) {
      return tipoContato === 'email' ? null : '(##) #####-####'
    },
  },
  mounted() {
    if(this.addOpened) this.addContato()
  }
}
</script>
