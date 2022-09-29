<template>
  <div class="bg-neutral-300 p-8 max-w-2xl">
    <Lynx-Title text="Iniciar nova conversa com cliente"/>
    <form class="flex flex-col" @submit.prevent="onSubmit">
      <label class="flex flex-col w-full pb-8">
        <Lynx-Label
          label="Empresa"
          :validator="$v.form.companyId"
          :validations-message="validationsMessage.form.companyId"
        />
        <Lynx-Input
          placeholder="Digite o ID da Empresa"
          :error="$v.form.companyId.$error"
          :value="$v.form.companyId.$model"
          @input="inputEmpresa"
        />
      </label>
      <div class="w-full flex justify-center pb-8" v-if="loadingSocios">
        <Lynx-Spinner size="24"/>
      </div>
      <div class="flex flex-col" v-else>
        <div class="flex flex-col w-full pb-8" v-for="(socio, index) in socios" :key="index">
          <div class="field">
            <b-radio v-model="form.customerId" :native-value="socio.id">
              {{ socio.nome_completo }}
            </b-radio>
          </div>
        </div>
      </div>

      <Lynx-Button
        :disabled="!everythingFilled || loadingButton"
        class="self-end"
        type="submit"
        text="Iniciar"
        icon="Check"
        :loading="loadingButton"
      />
    </form>
  </div>
</template>

<script>

import {mapGetters} from 'vuex'
import {required} from 'vuelidate/lib/validators'
import {empresasSociosRequest} from '@/services/requests/empresas'
import debounce from '@/mixins/debounce'
import {createAttendanceRequest} from "@/services/requests/attendance";

export default {
  name: 'ReceitaNaoProcessadaDetail',
  mixins: [debounce],
  props: {
    open: Boolean,
  },
  data() {
    return {
      form: {
        companyId: '',
        customerId: null,
      },
      validationsMessage: {
        form: {
          companyId: {
            required: 'Informe uma Empresa'
          },
        }
      },
      loadingButton: false,
      socios: [],
      loadingSocios: false,
    }
  },
  computed: {
    ...mapGetters(['getCompetenciaDate', 'getUser']),
    everythingFilled() {
      return this.form.companyId && this.form.customerId
    }
  },
  validations() {
    return {
      form: {
        companyId: {required},
      },
    }
  },
  methods: {
    closeStartChat() {
      this.$emit('onClose')
    },
    fetchSocios() {
      this.loadingSocios = true
      empresasSociosRequest(this.form.companyId)
        .then(res => {
          this.socios = res.data.data
          if (this.socios.length > 0) this.form.customerId = this.socios[0].id
        })
        .catch(err => this.$snack.error(err.response.data.message || err.message))
        .finally(() => this.loadingSocios = false)
    },
    inputEmpresa(value) {
      if (value.length < 2) return
      const self = this
      this.debounce(function () {
        if (value.length > 1) self.fetchSocios()
      }, 700)
      this.form.companyId = value
    },
    onSubmit() {
      if (this.$v.$invalid) return this.$snack.error('Preencha o formulário corretamente.')
      this.loadingButton = true

      createAttendanceRequest({...this.form, clerkId: this.getUser.id})
        .then(() => this.$emit('newChatCreated'))
        .catch(err => this.$snack.error(err.response.data.message || err.message))
        .finally(() => this.loadingButton = false)
    }
  }
}
</script>
