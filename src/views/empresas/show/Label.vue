<template>
  <div>
    <Lynx-Spinner size="4" v-if="loading"/>
    <div v-if="!loading">
      <Lynx-Button text="Adicionar" icon="Plus" icon-size="3" size="small" @click.native="addLabel"
                   v-if="!currentLabel.id"/>
      <b-notification :closable="false" :type="isEditting ? getColor(form.status) : getColor(currentLabel.status)"
                      aria-close-label="Close notification">
        <form @submit.prevent="onSubmit" class="flex flex-col">
          <label class="flex items-center">
            <b-select v-model="form.status" v-if="isEditting">
              <option
                v-for="status in statusOptions"
                :key="status.id"
                :value="status.value"
                v-text="status.label"
              />
            </b-select>

          </label>
          <label class="flex flex-col">
              <span class="font-bold flex">
                Observações
              <a class=" ml-2 rounded-full p-2" @click.prevent="editLabel" v-if="!isEditting">
                <Icon-Edit class="text-neutral-100" size="3"/>
              </a>
              </span>

            <span v-text="currentLabel.note" v-if="!isEditting && currentLabel.note"/>
            <div class="text-neutral-800" v-else-if="isEditting">
              <Lynx-Textarea v-model="form.note"/>
            </div>
            <span class="text-neutral-400" v-text="'nenhum comentário adicionado.'" v-else/>
          </label>
          <div class="flex justify-between" v-if="isEditting">
            <Lynx-Button
              @click.native="cancelEdit"
              text="Cancelar"
              size="small"
              type="button"
            />
            <Lynx-Button
              text="Enviar"
              type="submit"
              size="small"
              :loading="loadingButton"
            />
          </div>
        </form>
      </b-notification>
    </div>
  </div>
</template>

<script>

  import {storeLabelsRequest, updateLabelsRequest} from '../../../services/requests/labels'
  import LynxTextarea from '@/components/helpers/Textarea'

  export default {
    name: 'EmpresaLabel',
    components: {LynxTextarea},
    props: {
      labelable: {
        required: false,
        type: Object
      }
    },
    data() {
      return {
        loading: false,
        loadingButton: false,
        currentLabel: this.labelable.label || {},
        modal: false,
        isEditting: false,
        form: {},
        statusOptions: [
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
      }
    },
    methods: {
      getColor(status) {
        switch (status) {
          case 1:
            return 'is-success'
          case 2:
            return 'is-warning'
          case 3:
            return 'is-danger'
        }
      },
      addLabel() {
        this.loading = true
        const form = {
          labelable_type: this.labelable.razao_social ? 'empresa' : 'cliente',
          labelable_id: this.labelable.id,
          status: 2,
          note: 'Atenção',
        }
        storeLabelsRequest(form)
          .then(res => this.currentLabel = res.data.data)
          .finally(() => this.loading = false)
      },
      openModal() {
        this.modal = true
      },
      editLabel() {
        this.form = {...this.currentLabel}
        this.isEditting = true
      },
      cancelEdit() {
        this.isEditting = false
        this.form = {}
      },
      onSubmit() {
        this.loadingButton = true
        updateLabelsRequest(this.currentLabel.id, this.form)
          .then(res => {
            this.currentLabel = res.data.data
            this.modal = false
            this.isEditting = false
            this.$snack.success('Status alterado com sucesso')
          })
          .catch(() => this.$snack.error('Não foi possivel alterar o status'))
          .finally(() => this.loadingButton = false)
      }
    }
  }
</script>
