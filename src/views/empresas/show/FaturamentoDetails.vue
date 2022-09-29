<template>
  <div class="bg-neutral-300 p-8">
    <Lynx-Title text="Faturamento"/>
    <div class="flex mb-8 flex-wrap">
      <div class="w-1/2 pr-4 sm:mb-8 sm:pr-0 sm:w-full">
        <Card :header="{ title: 'Faturamento' }">
          <div class="p-4 w-full font-light flex justify-center">
            <Lynx-Spinner size="8" v-if="faturamento.loading"/>
            <div class="flex items-center flex-col w-full" v-if="!faturamento.loading">
              <p><span class="font-semibold" v-text="qtdPrevisao" /> meses de previsão</p>
              <Lynx-Button
                @click.native="downloadDeclaracaoFaturamento"
                class="text-sm mt-4 w-full"
                text="Gerar Declaração"
              />
              <Float-List class="w-full mt-4">
                <template v-slot:trigger>
                  <Lynx-Button class="text-sm w-full" text="Enviar por Email"/>
                </template>
                <template v-slot:target>
                  <div class="bg-neutral-200 shadow-xl flex p-6" style="width: 20rem;">
                    <form @submit.prevent="sendDeclaracaoFaturamentoEmail" class="w-full flex">
                      <Lynx-Input type="email" placeholder="Insira o e-mail" class="flex mr-4" v-model="faturamento.email"/>
                      <Lynx-Button text="Enviar" class="py-1" size="small" type="submit" :loading="faturamento.loadingEmail"/>
                    </form>
                  </div>
                </template>
              </Float-List>
            </div>
          </div>
        </Card>
      </div>
      <div class="w-1/2 pl-4 sm:mb-8 sm:pr-0 sm:w-full">
        <Card :header="{ title: 'Renda' }">
          <div class="p-4 w-full font-light flex justify-center flex-col">
            <div class="pt-4 flex justify-center" v-if="renda.loading">
              <Lynx-Spinner size="12" />
            </div>
            <div class="flex items-center flex-col w-full pt-4" v-else-if="renda.indisponivel">
              <Not-Found-Data text="Renda Indisponivel"/>
            </div>
            <div v-else>
              <div class="flex justify-center w-full">
                <p>Valor: <span class="font-semibold" v-text="renda.valor" /></p>
              </div>
              <label class="flex flex-col pt-4">
                <Lynx-Label label="Sócio"/>
                <b-select v-model="renda.socio" placeholder="Selecione um sócio">
                  <option
                    v-for="option in socios"
                    :key="option.id"
                    :value="option"
                    v-text="option.nome_completo"
                  />
                </b-select>
              </label>
              <Lynx-Button
                @click.native="downloadDeclaracaoRenda"
                class="text-sm mt-4 w-full"
                text="Gerar Declaração"
                v-if="renda.socio"
              />
              <Float-List class="w-full mt-4" v-if="renda.socio">
                <template v-slot:trigger>
                  <Lynx-Button class="text-sm w-full" text="Enviar por Email"/>
                </template>
                <template v-slot:target>
                  <div class="bg-neutral-200 shadow-xl flex p-6" style="width: 20rem;">
                    <form @submit.prevent="sendDeclaracaoRendaEmail" class="w-full flex">
                      <Lynx-Input type="email" placeholder="Insira o e-mail" class="flex mr-4" v-model="renda.email"/>
                      <Lynx-Button text="Enviar" class="py-1" size="small" type="submit" :loading="renda.loadingEmail"/>
                    </form>
                  </div>
                </template>
              </Float-List>
            </div>
          </div>
        </Card>
      </div>
    </div>
    <table class="lynx-table" v-if="!faturamento.loading">
      <thead class="lynx-table__header">
        <tr>
          <th>Mês</th>
          <th>Faturamento</th>
        </tr>
      </thead>
      <tbody class="lynx-table__body">
        <tr v-for="faturamento in faturamento.items" v-bind:key="faturamento.id">
          <td>{{faturamento.mes}}</td>
          <td>{{faturamento.faturamento}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

import Card from '@/components/helpers/Card'
import FloatList from '@/components/helpers/FloatList'
import { mapGetters } from 'vuex'
import { empresasFaturamentoRequest, empresasRendaBySocioRequest } from '@/services/requests/empresas'
import { declaracaoFaturamentoSendEmailRequest, declaracaoRendaSendEmailRequest } from '@/services/requests/declaracao'
import NotFoundData from '@/components/layouts/NotFoundData'

export default {
  components: { Card, FloatList, NotFoundData },
  props: {
    socios: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      faturamento: {
        items: [],
        loading: false,
        email: '',
        loadingEmail: false,
      },
      renda: {
        socio: null,
        valor: '',
        loading: false,
        email: '',
        loadingEmail: false,
      }
    }
  },
  computed: {
    ...mapGetters(['getEmpresa', 'getToken']),
    qtdPrevisao() {
      const previsoes = this.faturamento.items.filter(faturamento => faturamento.previsao)
      return previsoes.length
    },
  },
  beforeMount() {
    this.fetchFaturamento()
    this.fetchRenda()
  },
  methods: {
    fetchFaturamento() {
      this.faturamento.loading = true
      empresasFaturamentoRequest(this.getEmpresa.id)
        .then(res => this.faturamento.items = res.data.data)
        .catch(error => this.$snack.error(error.response.data.message))
        .finally(() => this.faturamento.loading = false)
    },
    fetchRenda() {
      this.renda.loading = true
      empresasRendaBySocioRequest(this.getEmpresa.id)
        .then(res => {
          if (!res.data.data.renda_media) {
            this.renda.indisponivel = true
            return
          }
          this.renda.valor = res.data.data.renda_media
        })
        .catch(() => this.renda.indisponivel = true)
        .finally(() => this.renda.loading = false)
    },
    downloadDeclaracaoFaturamento() {
      window.open(`${process.env.VUE_APP_API_URL}/declaracao/faturamento/?empresa_id=${this.getEmpresa.id}&token=${this.getToken}`);
    },
    sendDeclaracaoFaturamentoEmail() {
      this.faturamento.loadingEmail = true
      const form = {
        sendEmail: true,
        email: this.faturamento.email,
        empresa_id: this.getEmpresa.id
      }
      declaracaoFaturamentoSendEmailRequest(form)
        .then(() => {
          this.$snack.success('Email enviado com sucesso')
          this.faturamento.email = ''
        })
        .catch(error => this.$snack.error(error.response.data.message))
        .finally(() => this.faturamento.loadingEmail = false)
    },
    downloadDeclaracaoRenda() {
      window.open(`${process.env.VUE_APP_API_URL}/declaracao/renda/?cliente_id=${this.renda.socio.id}&empresa_id=${this.getEmpresa.id}&token=${this.getToken}`);
    },
    sendDeclaracaoRendaEmail() {
      declaracaoRendaSendEmailRequest
      this.renda.loadingEmail = true
      const form = {
        sendEmail: true,
        email: this.renda.email,
        empresa_id: this.getEmpresa.id,
        cliente_id: this.renda.socio.id
      }
      declaracaoRendaSendEmailRequest(form)
        .then(() => {
          this.$snack.success('Email enviado com sucesso')
          this.renda.email = ''
        })
        .catch(error => this.$snack.error(error.response.data.message))
        .finally(() => this.renda.loadingEmail = false)
    }
  },
}
</script>
