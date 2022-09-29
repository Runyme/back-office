<template>
  <div>
    <b-collapse :open="false" @open="fetchCrm" aria-id="crm-aria">
      <div class="flex items-center my-2" slot="trigger" aria-controls="crm-aria">
        <Icon-Id class="text-primary-600" size="8"/>
        <p class="pl-4 font-display font-bold text-xl">CRM</p>
      </div>
      <div class="w-full flex justify-center py-4" v-if="loading">
        <Lynx-Spinner size="16"/>
      </div>

      <b-switch @input="checkChanges" v-if="isEditting" v-model="hasCrm" :true-value="true" :false-value="false">
        CRM já emitido
      </b-switch>

      <div class="flex-col" v-if="!loading && (crm.id || isEditting)">
        <form class="flex flex-col" @submit.prevent="submitMethod">
          <div class="flex items-center py-1">
            <p class="flex items-center">
              <span class="pr-2 text-neutral-700 font-bold">{{ hasCrm ? 'Emissão' : 'Previsão' }}:</span>
              <transition name="fade" mode="out-in">
                <span class="text-neutral-700 truncate" v-if="!isEditting">
                  {{ handledDataEmissao }}
                </span>
                <input-date v-model="$v.form.data_emissao.$model" :error="$v.form.data_emissao.$error" v-else/>
              </transition>
            </p>
          </div>
          <div class="flex items-center py-1" v-if="hasCrm || !isOnlyPrevision">
            <p class="flex items-center">
              <span class="pr-2 text-neutral-700 font-bold">Numero:</span>
              <transition name="fade" mode="out-in">
                <span class="text-neutral-700 truncate" v-text="crm.numero" v-if="!isEditting"/>
                <Lynx-Input v-model="$v.form.numero.$model" :error="$v.form.numero.$error" v-else/>
              </transition>
            </p>
          </div>
          <div class="flex items-center py-1" v-if="hasCrm || !isOnlyPrevision">
            <p class="flex items-center">
              <span class="pr-2 text-neutral-700 font-bold">Senha:</span>
              <transition name="fade" mode="out-in">
                <span
                  class="text-neutral-700"
                  v-if="!isEditting && !crm.senha"
                > - </span>
                <span
                  class="text-neutral-700"
                  v-text="crm.senha"
                  v-else-if="!isEditting"
                />
                <Lynx-Input v-model="$v.form.senha.$model" :error="$v.form.senha.$error" v-else/>
              </transition>
            </p>
          </div>
          <div class="flex items-center py-1" v-if="hasCrm || !isOnlyPrevision">
            <p class="flex items-center">
              <span class="pr-2 text-neutral-700 font-bold">Estado:</span>
              <transition name="fade" mode="out-in">
                <span
                  class="text-neutral-700"
                  v-if="!isEditting && !crm.estado"
                > - </span>
                <span
                  class="text-neutral-700"
                  v-text="crm.estado"
                  v-else-if="!isEditting"
                />
                <b-select v-model="$v.form.estado.$model" v-else>
                  <option
                    v-for="option in estadoOptions"
                    :key="option.id"
                    :value="option.value"
                    v-text="option.nome"
                  />
                </b-select>
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
      <div class="my-4 self-center flex flex-col items-center" v-else-if="!loading">
        <NotFoundData text="CRM ainda não cadastrado"/>
        <Lynx-Button text="Cadastrar" size="small" icon="Plus" @click.native="onCreate"/>
      </div>
    </b-collapse>

  </div>
</template>

<script>

import {crmsRequest, crmsCreateRequest, crmsUpdateRequest} from '@/services/requests/crms'
import {required} from 'vuelidate/lib/validators'
import NotFoundData from '@/components/layouts/NotFoundData'
import formMixin from '@/mixins/form'
import moment from 'moment'
import InputDate from "@/components/helpers/InputDate";

export default {
  name: 'Crm',
  props: {
    ownerType: {
      validator: value => ['empresa', 'cliente'].indexOf(value) !== -1,
      required: true
    },
    ownerId: {
      type: Number,
      required: true,
    }
  },
  components: {InputDate, NotFoundData},
  mixins: [formMixin],
  data() {
    return {
      opnendCard: false,
      hasCrm: false,
      crm: {},
      loading: false,
      isEditting: false,
      loadingButton: false,
      submitMethod: null,
      estadoOptions: [
        {
          'value': 'RO',
          'nome': 'Rondônia',
        },
        {
          'value': 'AC',
          'nome': 'Acre',
        },
        {
          'value': 'AM',
          'nome': 'Amazonas',
        },
        {
          'value': 'RR',
          'nome': 'Roraima',
        },
        {
          'value': 'PA',
          'nome': 'Pará',
        },
        {
          'value': 'AP',
          'nome': 'Amapá',
        },
        {
          'value': 'TO',
          'nome': 'Tocantins',
        },
        {
          'value': 'MA',
          'nome': 'Maranhão',
        },
        {
          'value': 'PI',
          'nome': 'Piauí',
        },
        {
          'value': 'CE',
          'nome': 'Ceará',
        },
        {
          'value': 'RN',
          'nome': 'Rio Grande do Norte',
        },
        {
          'value': 'PB',
          'nome': 'Paraíba',
        },
        {
          'value': 'PE',
          'nome': 'Pernambuco',
        },
        {
          'value': 'AL',
          'nome': 'Alagoas',
        },
        {
          'value': 'SE',
          'nome': 'Sergipe',
        },
        {
          'value': 'BA',
          'nome': 'Bahia',
        },
        {
          'value': 'MG',
          'nome': 'Minas Gerais',
        },
        {
          'value': 'ES',
          'nome': 'Espírito Santo',
        },
        {
          'value': 'RJ',
          'nome': 'Rio de Janeiro',
        },
        {
          'value': 'SP',
          'nome': 'São Paulo',
        },
        {
          'value': 'PR',
          'nome': 'Paraná',
        },
        {
          'value': 'SC',
          'nome': 'Santa Catarina',
        },
        {
          'value': 'RS',
          'nome': 'Rio Grande do Sul',
        },
        {
          'value': 'MS',
          'nome': 'Mato Grosso do Sul',
        },
        {
          'value': 'MT',
          'nome': 'Mato Grosso',
        },
        {
          'value': 'GO',
          'nome': 'Goiás',
        },
        {
          'value': 'DF',
          'nome': 'Distrito Federal',
        }
      ],
      form: {
        numero: '',
        senha: '',
        estado: '',
        data_emissao: ''
      },
      validationsMessage: {
        form: {
          numero: {
            required: 'O campo numero é obrigatório'
          },
          senha: {
            required: 'O campo senha é obrigatório'
          },
          estado: {
            required: 'O campo estado é obrigatório'
          },
          data_emissao: {
            required: 'Informe a data de emissão'
          },
        }
      }
    }
  },
  validations: {
    form: {
      numero: {},
      senha: {},
      estado: {},
      data_emissao: {required},
    }
  },
  computed: {
    handledDataEmissao() {
      if (!this.crm.data_emissao) {
        return 'Sem data :('
      }

      let date = moment(this.crm.data_emissao)

      if (this.isOnlyPrevision) {
        return date.format('DD/MM/YYYY') + ' (previsão)'
      }

      return date.format('DD/MM/YYYY')
    },
    isOnlyPrevision() {
      return !this.hasCrm || moment(this.crm.data_emissao).isAfter(new Date) || (this.crm.data_emissao && !this.crm.numero)
    }
  },
  methods: {
    fetchCrm() {
      this.loading = true
      crmsRequest(this.ownerType, this.ownerId)
        .then(res => {
          this.crm = {...res.data}
          if (this.crm.numero) {
            this.hasCrm = true
          }
        })
        .finally(() => this.loading = false)
    },
    onEdit() {
      this.submitMethod = this.updateCrm
      this.form = {
        ...this.crm
      }
      this.isEditting = true
    },
    onCreate() {
      this.submitMethod = this.createCrm
      this.isEditting = true
    },
    updateCrm() {
      if (this.$v.form.$invalid) {
        this.snackValidationMessage(this.$v, this.validationsMessage)
        return
      }
      const form = {
        ...this.form
      }
      crmsUpdateRequest(this.crm.id, form)
        .then(res => {
          this.crm = res.data
          this.cancelEditting()
          this.$snack.success('CRM editado com sucesso')
        })
        .catch(() => this.$snack.error('Não foi possível editar o CRM'))
    },
    createCrm() {
      if (this.$v.form.$invalid) {
        this.snackValidationMessage(this.$v, this.validationsMessage)
        return
      }
      const form = {
        ...this.form,
        owner_type: this.ownerType,
        owner_id: this.ownerId
      }
      crmsCreateRequest(form)
        .then(res => {
          this.crm = res.data
          this.cancelEditting()
          this.$snack.success('CRM cadastrado com sucesso')
        })
        .catch(() => this.$snack.error('Não foi possível cadastrar o CRM'))
    },
    cancelEditting() {
      this.fetchCrm()
      this.form = {}
      this.isEditting = false
    },
    checkChanges(newValueHasCrm) {
      if (newValueHasCrm === false) {
        this.form.numero = null
        this.form.senha = null
        this.form.estado = null

        this.crm.numero = null
        this.crm.senha = null
        this.crm.estado = null
      }

    }
  },
  beforeMount() {
    // this.fetchCrm()
  }
}
</script>
