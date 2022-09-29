<template>
  <div>
    <b-loading :active.sync="loading"/>
    <div class="w-full flex justify-between items-start">
      <Lynx-Title text="Viabilidade"/>
      <Lynx-Button 
        text="Adicionar Viabilidade" 
        class="mb-4" 
        icon="Plus" 
        @click.native="openCreateModal" 
        size="small" 
        icon-size="3"
        v-if="$hasPermission('criar viabilidade')"
      />
    </div>
    <div class="flex items-start pb-8">
      <b-field label="Ultima atualização" >
        <b-select  placeholder="Selecione um periodo" v-model="ultima_atualizacao_filter">
          <option
            v-for="item in ultima_atualizacao_filter_options"
            :value="item.value"
            :key="item.id"
            v-text="item.label"
          />
        </b-select>
      </b-field>
    </div>
    <b-table
      v-if="viabilidades.length"
      :data="viabilidadesFiltered"
      hoverables
      class="w-full pb-8"
    >
      <template slot-scope="props">
        <b-table-column label="Cidade" field="cidade" v-text="props.row.cidade" sortable searchable/>
        <b-table-column label="Estado" field="estado" v-text="props.row.estado" sortable searchable/>
        <b-table-column label="Ultima atualização">
          <span class="py-1 px-2 text-neutral-100 text-xs rounded" :class="getUpdatedAtTheme(getUpdatedAtDifference(props.row.updated_at))"> 
            {{ getUpdatedAtDifference(props.row.updated_at) | mes }}
          </span>
        </b-table-column>
        <b-table-column label="Ações">
          <div class="flex text-sm items-center">
            <a 
              href="#" 
              class="mr-4 bg-primary-600 rounded-full p-2"
              @click.prevent="openViewModal(props.row.id)"
              v-if="$hasPermission('ver viabilidade')"
            >
              <Icon-Eye class="text-neutral-100" size="4"/>
            </a>
            <a 
              href="#" 
              class="bg-error-base rounded-full p-2" 
              @click.prevent="deleteViabilidade(props.row.id)"
              v-if="$hasPermission('excluir viabilidade')"
            >
              <Icon-Trash class="text-neutral-100" size="4"/>
            </a>
          </div>
        </b-table-column>
      </template>
    </b-table>
    <Not-Found-Data v-else-if="!loading" text="Nenhuma viabilidade registrada" />
    <b-modal :active.sync="viewModal" v-if="viewModal" width="600px">
      <View-Viabilidade-Municipal
        :viabilidade-id="currentViabilidadeId"
        @edit-viabilidade="onEditViabilidade"
      />
    </b-modal>
    <b-modal :active.sync="createModal" v-if="createModal" width="600px">
      <Create-Viabilidade-Municipal @create-viabilidade="onCreateViabilidade" />
    </b-modal>
  </div>
</template>

<script>

import { indexViabilidadeMunicipalRequest, destroyViabilidadeMunicipalRequest } from '@/services/requests/viabilidadeMunicipal'
import ViewViabilidadeMunicipal from '@/views/viabilidade/municipal/View'
import CreateViabilidadeMunicipal from '@/views/viabilidade/municipal/Create'
import NotFoundData from '@/components/layouts/NotFoundData'
import moment from 'moment'

export default {
  name: 'ViabilidadeMunicipalIndex',
  components: { ViewViabilidadeMunicipal, CreateViabilidadeMunicipal, NotFoundData },
  data() {
    return {
      loading: false,
      createModal: false,
      viewModal: false,
      viabilidades: [],
      currentViabilidadeId: null,
      ultima_atualizacao_filter: 'todas',
      ultima_atualizacao_filter_options: [
        {
          value: 'todas',
          label: 'Todas'
        },
        {
          value: 6,
          label: '6 mêses atrás'
        },
        {
          value: 12,
          label: '12 mêses atrás'
        },
      ],
    }
  },
  filters: {
    mes(val) {
      return val === 1 ? `${val} mês atras` : `${val} meses atras`
    }
  },
  computed: {
    viabilidadesFiltered() {
      return this.viabilidades.filter(curr => {
        if(this.ultima_atualizacao_filter === 'todas') return true
        if(this.ultima_atualizacao_filter === 6) return this.getUpdatedAtDifference(curr.updated_at) >= 6
        if(this.ultima_atualizacao_filter === 12) return this.getUpdatedAtDifference(curr.updated_at) >= 12
      })
    }
  },
  methods: {
    fetchViabilidades() {
      this.loading = true
      indexViabilidadeMunicipalRequest()
        .then(res => this.viabilidades = res.data)
        .finally(() => this.loading = false)
    },
    getUpdatedAtDifference(val) {
      const updatedAtMonth = moment(val)
      const now = moment()
      return now.diff(updatedAtMonth, 'month')
    },
    getUpdatedAtTheme(val) {
      if(val < 6) return 'bg-info-base'
      if(val < 12) return 'bg-warning-base'
      return 'bg-error-base'
    },
    openCreateModal() {
      this.createModal = true
    },
    openViewModal(currentViabilidadeId) {
      this.currentViabilidadeId = currentViabilidadeId
      this.viewModal = true
    },
    onEditViabilidade() {
      this.fetchViabilidades()
      this.viewModal = false
    },
    onCreateViabilidade() {
      this.fetchViabilidades()
      this.createModal = false
    },
    deleteViabilidade(id) {
      this.$buefy.dialog.confirm({
        message: 'Deseja realmente excluir esta viabilidade?',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        type: 'is-danger',
        onConfirm: () => this.onDeleteViabilidade(id)
      })
    },
    onDeleteViabilidade(id) {
      destroyViabilidadeMunicipalRequest(id)
        .then(() => {
          this.$snack.success('Viabilidade excluida com sucesso')
          this.fetchViabilidades()
        })
        .catch(() => this.$snack.error('Não foi possivel excluir a viabilidade'))
    }
  },
  beforeMount() {
    this.fetchViabilidades()
  }
}
</script>