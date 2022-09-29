<template>
  <div id="atividades-id">
    <div
      class="flex"
      :class="[(isFinishActivity || isStartActivity) && activity.arquivos.length ? 'border-b-2 border-neutral-300 pb-6' : 'pb-3']"
    >
      <div class="w-1/2 pr-6 border-r-2 border-neutral-300">
        <h2 class="text-xl text-neutral-700 pb-2" v-text="activity.nome" />
        <span class="text-sm text-neutral-600" v-text="activity.descricao"/>
      </div>
      <div class="w-1/2 pl-6">
        <div class="flex flex-col pb-2">
          <span class="text-lg">Data limite</span>
          <span class="text-warning-dark" v-text="formatDataLimite(activity.created_at)" />
        </div>
        <div class="flex flex-col pb-2">
          <span class="text-lg">SLA hora</span>
          <span class="text-neutral-600">{{ activity.sla_hora }} min</span>
        </div>
        <div class="flex flex-col pb-2 items-start">
          <span class="text-lg">Status</span>
          <span
            class="rounded py-1 px-2 text-neutral-100 mt-1 text-sm"
            :class="activityStatusClass"
            v-text="activityStatusText"
          />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3 pt-6 gap-4" v-if="activity.arquivos.length">
      <Anexo
        v-for="(anexo, index) in activity.arquivos"
        :key="anexo.id"
        :anexo="anexo"
        :is-deletabled="true"
        @remove-anexo="onRemoveAnexo(index)"
      />
    </div>

    <div class="pt-6 flex justify-end">
      <transition name="fade" mode="out-in">
        <Lynx-Button
          v-if="!isStartActivity"
          @click.native="startActivity(activity)"
          text="Iniciar Atividade"
          :loading="startActivityLoading"
          size="small"
        />

        <div class="flex justify-between w-full" v-if="isStartActivity && !isFinishActivity">
          <b-upload class="mr-4" v-model="file" @input="submitInputActivity" :disabled="isUploading">
            <a class="flex button is-outlined border-2 transition" :class="[isUploading ? 'is-disabled cursor-wait' : 'is-primary']">
              <span class="mr-4">Adicionar Arquivos</span>
              <Icon-Plus size="3" v-if="!isUploading"/>
              <Lynx-Spinner size="3" v-else/>
            </a>
          </b-upload>
          <Lynx-Button
            class="ml-4"
            text="Encerrar Atividade"
            @click.native="finishActivity"
            size="small"
            color="success-base"
            :loading="finishActivityLoading"
          />
        </div>

        <Lynx-Button
          @click.native="openModal"
          v-if="isFinishActivity"
          class="self-end"
          size="small"
          text="Enviar e-mail"
          icon="Check"
          icon-size="3"
        />
      </transition>
    </div>

    <b-modal :active.sync="isModalOpen" width="500px">
      <div class="bg-neutral-300 p-6">
        <Lynx-Title text="Selecionar emails"/>
        <form @submit.prevent="sendEmail" class="flex flex-col">
          <label class="flex flex-col pb-6">
            <Lynx-Label :validations-message="validationsMessage.mailSend.cliente" :validator="$v.mailSend.cliente" label="Cliente"/>
            <Lynx-Input v-model="$v.mailSend.cliente.$model" :error="$v.mailSend.cliente.$error" placeholder="Digite o e-mail do cliente" />
          </label>
          <label class="flex flex-col pb-6">
            <Lynx-Label :validations-message="validationsMessage.mailSend.usuario" :validator="$v.mailSend.usuario" label="Usuário"/>
            <Lynx-Input v-model="$v.mailSend.usuario.$model" :error="$v.mailSend.usuario.$error" placeholder="Digite o e-mail do usuário" />
          </label>
          <label
            class="flex flex-col pb-6 relative"
            v-for="(copy, key) in cc"
            :key="key"
          >
            <div class="absolute top-0 right-0">
              <a
                href="#"
                class="rounded-full bg-error-light transition hover:bg-error-base flex p-1"
                @click.prevent="deleteCCEmail(key)"
              >
                <Icon-Cross class="text-neutral-100" size="2"/>
              </a>
            </div>
            <Lynx-Label label="Email para cópia"/>
            <Lynx-Input v-model="copy.email" placeholder="Digite o e-mail para enviar uma cópia" type="email" required/>
          </label>

          <Lynx-Button
            outlined="true"
            text="Adicionar Email"
            icon="Plus"
            @click.native="sendCCEmail"
            type="button"
          />

          <label class="flex flex-col py-6">
            <Lynx-Label label="Mensagem"/>
            <Lynx-Textarea v-model="mensagem" placeholder="Acrescente uma mensagem para o email..." />
            <span class="text-sm text-neutral-600 pt-1">Esta mensagem será acrescentada entre o titulo e mensagens padrão do email</span>
          </label>

          <div class="flex justify-between pt-4">
            <Lynx-Button
              :loading="isLoading"
              text="Enviar"
              icon="Check"
              type="submit"
            />
          </div>
        </form>
      </div>
    </b-modal>

  </div>
</template>

<script>
import { formatEnToBr } from '@/utils/momentHelpers'
import moment from 'moment'
import {
  deleteFileById,
  finishActivityRequest,
  sendEmailRequest,
  startActivityRequest,
  subimitInputActivityRequest
} from '@/services/requests/service-order'
import Anexo from '@/views/service-order/components/Anexo'
import { required, email } from 'vuelidate/lib/validators'
import LynxTextarea from '@/components/helpers/Textarea';

export default {
  name: 'ServiceOrderAtividadeCard',
  components: { Anexo, LynxTextarea },
  props: {
    activity: {
      type: Object,
      required: true
    },
    serviceId: {
      type: Number,
      required: true
    },
    mailSend: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      mensagem: null,
      isModalOpen: false,
      file: null,
      files: [],
      isLoading: false,
      isUploading: false,
      startActivityLoading: false,
      finishActivityLoading: false,
      cc: [],
      validationsMessage: {
        mailSend: {
          cliente: {
            required: 'Insira um email para o cliente',
            email: 'Insira um email válido para o cliente'
          },
          usuario: {
            required: 'Insira um email para o usuário',
            email: 'Insira um email valido para o usuário'
          },
        }
      }
    }
  },
  validations: {
    mailSend: {
      cliente: { required, email },
      usuario: { required, email },
    }
  },
  computed: {
    isStartActivity() {
      return this.activity.data_inicio
    },
    isFinishActivity() {
      return this.activity.data_fim !== null;
    },
    activityStatusText() {
      if (!this.isStartActivity) return 'Pendente'
      if (!this.isFinishActivity) return 'Em Andamento'
      return 'Concluído'
    },
    activityStatusClass() {
      if (!this.isStartActivity) return 'bg-warning-base'
      if (!this.isFinishActivity) return 'bg-info-base'
      return 'bg-success-base'
    }
  },
  methods: {
    formatDataLimite(data) {
      return formatEnToBr(data);
    },
    startActivity() {
      this.startActivityLoading = true
      this.activity.data_inicio = moment().format('YYYY-MM-DD HH:mm')
      startActivityRequest(this.activity.id)
        .then(() => this.$snack.success('Atividade iniciada com sucesso.'))
        .catch(() => this.$snack.error('Ocorreu um erro ao iniciar a atividade.'))
        .finally(() => this.startActivityLoading = false)
    },
    onRemoveAnexo(index) {
      this.activity.arquivos.splice(index, 1)
    },
    finishActivity() {
      const { input, arquivos } = this.activity
      if(input.length > arquivos.length) return this.$snack.error('Anexo de arquivos faltando.')
      this.finishActivityLoading = true
      finishActivityRequest({atividade_id: this.activity.id})
        .then(({data}) => {
          this.activity.data_fim = new Date()
          this.$snack.success(data.message)
        })
        .catch(error => this.$snack.error(error.response.data.message))
        .finally(() => this.finishActivityLoading = false)
    },
    submitInputActivity() {
      this.isUploading = true
      const formData = new FormData()
      formData.append('atividade_id', this.activity.id)
      formData.append(this.file.name, this.file)

      subimitInputActivityRequest(formData)
        .then(res => {
          const data = res.data.data
          const file = {
            id: data.id,
            nome_original: data.nome_original,
            caminho: data.caminho
          }
          this.activity.arquivos.push(file)
          this.$snack.success(res.data.message)
        })
        .catch(error => {
          this.$snack.error(error.response.data.message)
        })
        .finally(() => this.isUploading = false)
    },
    deleteCCEmail(i) {
      this.cc.splice(i, 1)
    },
    sendEmail() {
      if(this.$v.$invalid) return this.$snack.error('Por favor preencha todas as informações corretamente')
      const ccEmailErrors = this.cc.filter(curr => !curr.email)
      if(ccEmailErrors.length) return this.$snack.error('Por favor preencha todos os emails para cópia corretamente')
      this.isLoading = true
      this.$buefy.dialog.confirm({
        title: 'Enviar e-mail de conclusão',
        message: 'Tem certeza que deseja notificar o cliente sobre a conclusão desta solicitação?',
        cancelText: 'Não',
        confirmText: 'Enviar e-mail',
        type: 'is-primary',
        onCancel: () => this.isLoading = false,
        onConfirm: () => {
          const payload = {
            os_item_id: this.serviceId,
            mensagem: this.mensagem,
            emails: {
              ...this.mailSend,
              cc: this.cc,
            }
          }

          sendEmailRequest(payload)
            .then(response => {
              this.$snack.success(response.data.message)
              this.isModalOpen = false
            })
            .catch(error => this.$snack.error(error.response.data.message))
            .finally(() => this.isLoading = false)
        }
      });
    },
    sendCCEmail() {
      this.cc.push({ email: '' })
    },
    deleteFile(key) {

      if (this.isFinishActivity) return;

      const {arquivos} = this.activity;

      const arquivo = arquivos.find((element, index) => index === key);

      deleteFileById(arquivo.id).then(({data: {message}}) => {
        this.$snack.success(message);
        arquivos.splice(key, 1);
      }).catch(error => {
        this.$snack.error(error.response.data.message)
      })
    },
    openModal() {
      this.isModalOpen = true;
    }
  },
}
</script>
