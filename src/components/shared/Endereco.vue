<template>
  <div class="">
    <b-collapse :open="true" @open="fetchEndereco" aria-id="endereco-aria">
      <div class="flex items-center my-2" slot="trigger" aria-controls="endereco-aria">
        <Icon-Home class="text-primary-600" size="8"/>
        <p class="pl-4 font-display text-xl font-bold">Endereços</p>
      </div>

      <div class="w-full">
        <div class="w-full flex justify-center py-4" v-if="loading">
          <Lynx-Spinner size="16"/>
        </div>
        <div v-else>
          <div class="flex-col" v-if="endereco.id">
            <div v-if="endereco.tipo" class="flex items-center py-1">
              <p class="font-bold">
                Tipo:
                <span class="font-normal">
                {{endereco.tipo}}
              </span>
              </p>
            </div>
            <div class="flex items-center py-1">
              <p class="font-bold">
                Cidade:
                <span class="font-normal">
                {{endereco.cidade}} - {{endereco.uf}}
              </span>
              </p>
            </div>
            <div class="flex items-center py-1">
              <p class="font-bold">
                Endereço: <br />
                <span class="font-normal">
                {{endereco.logradouro}}, {{endereco.numero}} {{ endereco.complemento ? ` - ${endereco.complemento}` : '' }}<br />
                {{`${endereco.bairro} - ${endereco.cep}`}}
              </span>
              </p>
            </div>
            <Lynx-Button class="my-4" text="Editar" size="small" icon="Edit" icon-size="4"
                         @click.native.prevent="onEditEndereco()"/>
          </div>
          <div class="flex flex-col items-center pb-4" v-else>
            <NotFoundData text="Não há nenhum endereço registrado para empresa"/>
            <Lynx-Button text="Adicionar Endereço" size="small" icon="Plus" icon-size="4"
                         @click.native="onCreateEndereco()"/>
          </div>
        </div>
      </div>
    </b-collapse>


    <b-modal :active.sync="modalOpened">
      <div class="bg-neutral-300 shadow p-8">
        <Lynx-Title :text="modalTitle"/>
        <div class="w-full flex justify-center" v-if="loadingCep">
          <Lynx-Spinner size="12"/>
        </div>
        <form class="flex flex-col" @submit.prevent="submitMethod" v-else>
          <b-field label="Tipo">
            <b-select v-model="form.tipo">
              <option value="Residencial">Residencial</option>
              <option value="Estabelecimento Fixo"> Estabelecimento Fixo</option>
              <option value="Coworking">Coworking</option>
            </b-select>
          </b-field>
          <label class="flex flex-col w-full pb-6">
            <Lynx-Label
              label="IPTU"
              :validator="$v.form.iptu"
              :validations-message="validationsMessage.form.iptu"
            />
            <Lynx-Input
              placeholder="Insira o IPTU"
              :error="$v.form.iptu.$error"
              v-model.trim="$v.form.iptu.$model"
              mask="####################"
            />
          </label>
          <label class="flex flex-col w-full pb-6">
            <Lynx-Label
              label="CEP"
              :validator="$v.form.cep"
              :validations-message="validationsMessage.form.cep"
            />
            <Lynx-Input
              placeholder="Insira o CEP"
              :error="$v.form.cep.$error"
              v-model.trim="$v.form.cep.$model"
              mask="#####-###"
              @input="fetchCep"
            />
          </label>
          <div class="w-full flex">
            <label class="flex flex-col w-1/2 pb-6 pr-2">
              <Lynx-Label
                label="Logradouro"
                :validator="$v.form.logradouro"
                :validations-message="validationsMessage.form.logradouro"
              />
              <Lynx-Input
                placeholder="Insira o Logradouro"
                :error="$v.form.logradouro.$error"
                v-model.trim="$v.form.logradouro.$model"
              />
            </label>
            <label class="flex flex-col w-1/4 px-2 pb-6">
              <Lynx-Label
                label="Numero"
                :validator="$v.form.numero"
                :validations-message="validationsMessage.form.numero"
              />
              <Lynx-Input
                placeholder="Insira o Número"
                :error="$v.form.numero.$error"
                v-model.trim="$v.form.numero.$model"
              />
            </label>
            <label class="flex flex-col w-1/4 pl-2 pb-6">
              <Lynx-Label label="Complemento"/>
              <Lynx-Input
                placeholder="Insira o Número"
                v-model="form.complemento"
              />
            </label>
          </div>
          <div class="w-full flex">
            <label class="flex flex-col w-1/5 pb-6 pr-2">
              <Lynx-Label
                label="Estado"
                :validator="$v.form.uf"
                :validations-message="validationsMessage.form.uf"
              />
              <Lynx-Input
                placeholder="Insira o Estado"
                :error="$v.form.uf.$error"
                v-model.trim="$v.form.uf.$model"
              />
            </label>
            <label class="flex flex-col w-2/5 px-2 pb-6">
              <Lynx-Label
                label="Cidade"
                :validator="$v.form.cidade"
                :validations-message="validationsMessage.form.cidade"
              />
              <Lynx-Input
                placeholder="Insira a Cidade"
                :error="$v.form.cidade.$error"
                v-model.trim="$v.form.cidade.$model"
              />
            </label>
            <label class="flex flex-col w-2/5 px-2 pb-6">
              <Lynx-Label
                label="Bairro"
                :validator="$v.form.bairro"
                :validations-message="validationsMessage.form.bairro"
              />
              <Lynx-Input
                placeholder="Insira o bairro"
                :error="$v.form.bairro.$error"
                v-model.trim="$v.form.bairro.$model"
              />
            </label>
          </div>
          <label class="flex flex-col w-full pb-6">
            <Lynx-Label
              label="IBGE"
              :validator="$v.form.ibge"
              :validations-message="validationsMessage.form.ibge"
            />
            <Lynx-Input
              placeholder="Insira o ibge"
              :error="$v.form.ibge.$error"
              v-model.trim="$v.form.ibge.$model"
              mask="#######"
            />
          </label>
          <Lynx-Button type="submit" text="Salvar" icon="Check" class="self-end" :loading="loadingButton"/>
        </form>
      </div>
    </b-modal>
  </div>
</template>

<script>

  import {enderecosRequest, enderecosCreateRequest, enderecosUpdateRequest} from '@/services/requests/enderecos'
  import {required, numeric, minLength, maxLength} from 'vuelidate/lib/validators'
  import {viaCepRequest} from '@/services/requests/viaCep'
  import NotFoundData from '@/components/layouts/NotFoundData'
  import formMixin from '@/mixins/form'

  export default {
    name: 'Endereco',
    components: {NotFoundData},
    mixins: [formMixin],
    props: {
      addressableType: {
        validator: value => ['empresa', 'cliente'].indexOf(value) !== -1,
        required: true
      },
      addressableId: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        endereco: {},
        loading: false,
        loadingButton: false,
        modalOpened: false,
        submitMethod: null,
        loadingCep: false,
        modalTitle: '',
        form: {
          iptu: '',
          cep: '',
          logradouro: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          uf: '',
          ibge: '',
          tipo: '',
        },
        validationsMessage: {
          form: {
            iptu: {
              required: 'O campo iptu é obrigatório',
              numeric: 'O campo iptu deve ser numérico'
            },
            cep: {
              required: 'O campo CEP é obrigatório',
              numeric: 'O campo CEP deve ser numérico',
              minLength: 'O campo é CEP deve conter 8 caracteres',
              maxLength: 'O campo é CEP deve conter 8 caracteres',
            },
            logradouro: {required: 'O campo logradouro é obrigatório'},
            numero: {required: 'O campo número é obrigatório'},
            bairro: {required: 'O campo bairro é obrigatório'},
            cidade: {required: 'O campo cidade é obrigatório'},
            uf: {
              required: 'O campo estado é obrigatório',
              minLength: 'O campo estado deve conter 2 caracteres',
              maxLength: 'O campo estado deve conter 2 caracteres',
            },
            ibge: {
              required: 'O campo ibge é obrigatório',
              numeric: 'O campo ibge deve ser numérico',
              minLength: 'O campo ibge deve conter 7 caracteres',
              maxLength: 'O campo ibge deve conter 7 caracteres',
            },
          }
        }
      }
    },
    validations() {
      return {
        form: {
          iptu: {required, numeric},
          cep: {
            required,
            numeric,
            minLength: minLength(8),
            maxLength: maxLength(8)
          },
          logradouro: {required},
          numero: {required},
          bairro: {required},
          cidade: {required},
          uf: {
            required,
            minLength: minLength(2),
            maxLength: maxLength(2)
          },
          ibge: {
            required,
            numeric,
            minLength: minLength(7),
            maxLength: maxLength(7)
          },
        }
      }
    },
    methods: {
      fetchEndereco() {
        this.loading = true
        enderecosRequest(this.addressableType, this.addressableId)
          .then(res => this.endereco = res.data)
          .finally(() => this.loading = false)
      },
      setModalOpened(value) {
        this.modalOpened = value
      },
      fetchCep(cep) {
        if (cep.length != 8) return
        this.cepLoading = true
        viaCepRequest(cep)
          .then(res => {
            if (res.data.erro) return
            this.form.logradouro = res.data.logradouro
            this.form.cidade = res.data.localidade
            this.form.bairro = res.data.bairro
            this.form.ibge = res.data.ibge
            this.form.uf = res.data.uf
          })
          .finally(() => this.cepLoading)
      },
      onEditEndereco() {
        this.modalTitle = 'Editar endereço'
        this.submitMethod = this.updateEndereco
        this.form = {...this.endereco}
        this.setModalOpened(true)
      },
      updateEndereco() {
        if (this.$v.form.$invalid) {
          this.snackValidationMessage(this.$v, this.validationsMessage)
          return
        }
        this.loadingButton = true
        enderecosUpdateRequest(this.endereco.id, this.form)
          .then(res => {
            this.endereco = res.data
            this.$snack.success('Endereço alterado com sucesso')
            this.setModalOpened(false)
          })
          .catch(() => this.$snack.error('Ocorreu um erro ao alterar o endereço'))
          .finally(() => this.loadingButton = false)
      },
      onCreateEndereco() {
        this.modalTitle = 'Adicionar endereço'
        this.submitMethod = this.createEndereco
        this.setModalOpened(true)
      },
      createEndereco() {
        if (this.$v.form.$invalid) {
          this.snackValidationMessage(this.$v, this.validationsMessage)
          return
        }
        this.loadingButton = true
        const form = {
          ...this.form,
          addressable_type: this.addressableType,
          addressable_id: this.addressableId,
        }
        enderecosCreateRequest(form)
          .then(res => {
            this.endereco = res.data
            this.$snack.success('Endereço adicionado com sucesso')
            this.setModalOpened(false)
          })
          .catch(() => this.$snack.error('Ocorreu um erro ao adicionar o endereço'))
          .finally(() => this.loadingButton = false)
      }
    },
    beforeMount() {
      this.fetchEndereco()
    },
  }
</script>
