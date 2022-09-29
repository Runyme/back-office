<template>
  <div
    class="w-64 xl:w-56 lg:w-48 md:w-full fixed left-0 top-0 bottom-0 sidebar text-sm text-neutral-100 bg-primary-700 border-t-4 border-primary-200 shadow-xl z-100 flex justify-center transition"
    :class="{ 'md:opacity-0 md:pointer-events-none': !isOpen }"
  >
    <div class="flex flex-col md:max-w-md w-full py-8 overflow-y-auto hide-scrollbar">
      <div class="flex justify-center relative">
        <div class="w-24 self-center text-neutral-100">
          <router-link :to="{ name: 'dashboard' }">
            <Logo/>
          </router-link>
        </div>
        <a href="#" @click.prevent="closeSidebar">
          <Icon-Cross class="hidden md:block absolute-center-y text-primary-600 right-0 mr-4"/>
        </a>
      </div>
      <div class="flex flex-col w-full mt-8">
        <User-Avatar :avatar="getUser.avatar" class="self-center"/>
        <div class="mt-6">
          <Float-List floatClasses="w-full">
            <template #trigger>
              <div class="flex flex-col">
                <div class="flex justify-between items-center">
                  <h3 class="font-display font-bold leading-normal px-4 text-base">Olá, {{ getUserFirstName }}</h3>
                  <a href="#" class="mx-4" @click.prevent>
                    <Icon-Dropdown class="w-4 h-4"/>
                  </a>
                </div>
              </div>
            </template>
            <template #target>
              <ul
                class="flex flex-col text-neutral-800 bg-neutral-200 py-4 border-b-2 border-neutral-800 shadow-xl md:mx-4">
                <router-link :to="{ name: 'profile' }" class="menu-item relative cursor-pointer" tag="li" exact>
                  <div class="absolute right-0 top-0 bottom-0 flex items-center menu-mark transition text-primary-500">
                    <SVG-Menu-Mark class="w-1"/>
                  </div>
                  <div class="w-full flex px-4 items-center">
                    <Icon-User/>
                    <span class="ml-6">Editar Perfil</span>
                  </div>
                </router-link>
                <li class="menu-item mt-4 relative">
                  <div class="absolute right-0 top-0 bottom-0 flex items-center menu-mark transition text-primary-500">
                    <SVG-Menu-Mark class="w-1"/>
                  </div>
                  <a @click.prevent="onLogout" href="#" class="w-full flex px-4 items-center">
                    <Icon-Logout/>
                    <span class="ml-6">Sair</span>
                  </a>
                </li>
              </ul>
            </template>
          </Float-List>
        </div>
      </div>
      <div class="flex w-full mt-8">
        <form class="mx-auto" @submit.prevent="searchEmpresa">
          <div class="relative text-primary-400 focus-within:text-primary-400">
            <span class="absolute inset-y-0 left-0 flex items-center pl-2">
              <button type="submit" class="p-1 focus:outline-none focus:shadow-outline">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                     viewBox="0 0 24 24" class="w-6 h-6"><path
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </button>
            </span>
            <input type="search" name="q" v-model="search"
                   class="py-2 text-sm text-white bg-primary-800 rounded-md pl-10 focus:outline-none focus:bg-primary-900 focus:text-primary-200"
                   placeholder="Pesquisar empresa" autocomplete="off">
          </div>
        </form>
      </div>
      <ul class="flex flex-col mt-2">
        <router-link
          v-for="item in menuDefaultItems"
          :key="item.id"
          :to="{ name: item.to }"
          :class="`transition hover:bg-primary-600 py-2 menu-item mt-2 relative cursor-pointer text-lg order-${item.order || '50'}`"
          tag="li"
          active-class="active"
          exact
        >
          <div class="absolute right-0 top-0 bottom-0 flex items-center menu-mark transition text-neutral-100">
            <SVG-Menu-Mark class="w-1"/>
          </div>
          <div class="w-full flex px-4 items-center">
            <component :is="`Icon-${item.icon}`"/>
            <span class="ml-6 link-label" v-text="item.label"></span>
          </div>
        </router-link>
        <li
          v-for="submenu in menus.submenus"
          :key="submenu.id"
          :class="`py-2 transition  hover:bg-primary-600 mt-2 relative order-${submenu.order || '50'}`"
        >
          <b-collapse :open="false">
            <a href="#" @click.prevent class="hover:bg-primary-600  w-full flex px-4 justify-between items-center relative menu-item text-lg"
               slot="trigger">
              <div class="flex">
                <component :is="`Icon-${submenu.icon}`"/>
                <span class="ml-6 link-label" v-text="submenu.label"></span>
              </div>
              <Icon-Dropdown size="3"/>
              <div class="absolute right-0 top-0 bottom-0 flex items-center menu-mark transition text-primary-500">
                <SVG-Menu-Mark class="w-1 text-neutral-100"/>
              </div>
            </a>
            <ul class="mt-4">
              <li
                v-for="item in submenu.items"
                :key="item.id"
              >
                <router-link
                  :to="{ name: item.to }"
                  exact-active-class="active"
                  class="menu-item mt-4 relative flex text-neutral-500"
                  active-class=""
                  v-if="!itemHasPermission(item) || !itemHasRole(item)"
                >
                  <div class="absolute right-0 top-0 bottom-0 flex items-center menu-mark transition text-neutral-300">
                    <SVG-Menu-Mark class="w-1"/>
                  </div>
                  <div class="w-full flex pl-8 pr-4 items-center">
                    <component :is="`Icon-${item.icon}`"/>
                    <span class="ml-6 link-label" v-text="item.label"></span>
                  </div>
                </router-link>
              </li>
            </ul>
          </b-collapse>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

import Logo from '@/components/svgs/Logo'
import SVGMenuMark from '@/components/svgs/MenuMark'
import FloatList from '@/components/helpers/FloatList'
import UserAvatar from '@/components/layouts/UserAvatar'
import {mapGetters, mapActions} from 'vuex'
import Bus from '@/services/bus'
import bus from "@/services/bus";
import {empresasShowRequest} from "@/services/requests/empresas";

export default {
  components: {Logo, SVGMenuMark, FloatList, UserAvatar},
  data() {
    return {
      isOpen: false,
      search: null,
      menus: {
        default: [
          {
            label: 'Dashboard',
            to: 'dashboard',
            icon: 'Dashboard',
            order: 1
          },
          {
            label: 'Viabilidade',
            to: 'viabilidade',
            icon: 'Checkbox',
            permissions: ['listar viabilidade']
          },
          {
            label: 'Livro fiscal',
            to: 'livro-fiscal.index',
            icon: 'Document',
            role: ['Gerenciar livro fiscal']
          },
          {
            label: 'Holerites',
            to: 'uploads.index',
            icon: 'UploadCloud',
            role: ['Gerenciar uploads']
          },
          {
            label: 'Indicações',
            to: 'indicacoes.index',
            icon: 'Users',
            permissions: ['listar indicacoes']
          },
          {
            label: 'Junta Comercial',
            to: 'juntaComercial.index',
            icon: 'Taxes',
          },
          {
            label: 'Exports',
            to: 'exports',
            icon: 'Document',
            order: 'last'
          },
          {
            label: 'Simulador',
            to: 'simulator',
            icon: 'FileDocumentBox',
            order: 'last'
          },
          {
            label: 'Contratantes',
            to: 'contratantes.index',
            icon: 'Business',
          },
        ],
        submenus: [
          {
            label: 'Empresas',
            icon: 'Company',
            order: 2,
            items: [
                {
                label: 'linker',
                to: 'empresas.linker',
                icon: 'Collection',
              },
              {
                label: 'Pesquisar',
                to: 'empresas.index',
                icon: 'Search',
              },
             
                 {
                label: 'Atividades',
                to: 'empresas.atividades',
                icon: 'Collection',
              },
              {
                label: 'Todas',
                to: 'empresas.all',
                icon: 'FileDocumentBox',
              },
              {
                label: 'Cadastrar',
                to: 'empresas.create',
                icon: 'Plus',
              },
              {
                label: 'Pós Cadastro',
                to: 'empresas.posCadastro',
                icon: 'Collection',
              },
              {
                label: 'Alteração',
                to: 'empresas.alteracao',
                icon: 'Edit',
              },
              {
                label: 'Alvarás',
                to: 'empresas.alvaras.index',
                icon: 'Document',
              },
                 {
                label: 'Motivo Retenção',
                to: 'empresas.motivoRetencao',
                icon: 'Document',
              },
                {
                label: 'Retenção',
                to: 'empresas.retencao',
                icon: 'Document',
              },
            ]
          },
          {
            label: 'Clientes',
            icon: 'User',
            order: 3,
            items: [
              {
                label: 'Pesquisar',
                to: 'clientes.index',
                icon: 'Search',
              },
              {
                label: 'Cadastrar',
                to: 'clientes.create',
                icon: 'Plus',
              },
            ]
          },
          {
            label: 'Guias',
            icon: 'Document',
            items: [
              {
                label: 'Gerenciamento',
                to: 'guias.gerenciamento',
                icon: 'Setting',
              },
              {
                label: 'Upload',
                to: 'guias.upload',
                icon: 'UploadCloud',
              },
              {
                label: 'Não processadas',
                to: 'guias.nao-processadas',
                icon: 'Alert',
              },
            ]
          },
          {
            label: 'Irpf',
            icon: 'FileDocumentBox',
            items: [
              {
                label: 'Gerenciar declarações',
                to: 'irpf.index',
                icon: 'FileDocumentBox',
              },
              {
                label: 'Conf. Questionário',
                to: 'irpf.questionario',
                icon: 'Setting',
              }
            ]
          },
          {
            label: 'CND',
            icon: 'BankAgency',
            items: [
              {
                label: 'Gerenciamento',
                to: 'certidao-negativa.gerenciamento',
                icon: 'Setting',
              },
              {
                label: 'Upload',
                to: 'certidao-negativa.upload',
                icon: 'UploadCloud',
              },
              {
                label: 'Não processadas',
                to: 'certidao-negativa.nao-processadas',
                icon: 'Alert',
              },
            ]
          },
          {
            label: 'Financeiro',
            icon: 'Money',
            items: [
              {
                label: 'Faturas',
                to: 'financeiro.gerenciar-fatura',
                icon: 'Document',
              },
                 {
                label: 'Cartão Credito',
                to: 'empresas.cartaoCredito',
                icon: 'Money',
              },
                    {
                label: 'Tipo Cobrança',
                to: 'financeiro.tipoCobranca',
                icon: 'Setting',
              },
               {
                label: 'Motivo Cancelamento',
                to: 'financeiro.FaturaMotivoCancelamento',
                icon: 'Setting',
              },
              {
                label: 'Assinaturas',
                to: 'financeiro.subscriptions',
                icon: 'Setting',
              },
              {
                label: 'Planos',
                to: 'financeiro.plans',
                icon: 'Setting',
              },
              {
                label: 'NFSE',
                to: 'financeiro.nfse',
                icon: 'FileDocumentBox',
              },
              {
                label: 'Contas a receber',
                to: 'financeiro.contas-receber',
                icon: 'Setting',
              },
              
                {
                label: 'Subir Faturamentos',
                to: 'financeiro.upfature',
                icon: 'UploadCloud',
              },
                    {
                label: 'Relatorios',
                to: 'financeiro.relatorios',
                icon: 'Setting',
              },
            ]
          },
          {
            label: 'Prolabores',
            icon: 'MoneyBag',
            items: [
              {
                label: 'Gerenciamento',
                to: 'receitas.gerenciamento',
                icon: 'Setting',
              },
              {
                label: 'Upload',
                to: 'receitas.upload',
                icon: 'UploadCloud',
              },
              {
                label: 'Não processadas',
                to: 'receitas.nao-processadas',
                icon: 'Alert',
              },
              {
                label: 'Divisão de Receita',
                to: 'receitas.divisao',
                icon: 'Rh',
              },
            ]
          },
          {
            label: 'Autenticação',
            icon: 'Warning',
            items: [
              {
                label: 'Usuários',
                to: 'users.index',
                icon: 'Users',
              },
              {
                label: 'Funções',
                to: 'roles.index',
                icon: 'Locker',
              },
              {
                label: 'Permissões',
                to: 'permissions.index',
                icon: 'Key',
              },
              {
                label: 'Carteiras',
                to: 'carteiras.index',
                icon: 'Folder',
              },
              {
                label: 'Logs Usuario',
                to: 'users.LogsUsuario.LogsUsuario',
                icon: 'Folder',
              },
            ]
          },
          // {
          //   label: 'O.S',
          //   icon: 'Support',
          //   order: 4,
          //   items: [
          //     {
          //       label: 'Geral',
          //       to: 'request.index',
          //       icon: 'Support',
          //     },
          //     {
          //       label: 'Credenciamentos',
          //       to: 'credenciamentos.index',
          //       icon: 'Document',
          //     },
          //     {
          //       label: 'Nova O.S',
          //       to: 'request.create',
          //       icon: 'Plus',
          //     },
          //     {
          //       label: 'Procedimentos',
          //       to: 'procedure.index',
          //       icon: 'Gears',
          //     }
          //   ]
          // },
          // {
          //   label: 'Chat',
          //   icon: 'Chat',
          //   order: 3,
          //   items: [
          //     {
          //       label: 'Atendimentos',
          //       to: 'chat.index',
          //       icon: 'Chat',
          //     },
          //     {
          //       label: 'Apontamentos',
          //       to: 'chat.apontamentos',
          //       icon: 'Edit',
          //     },
          //   ]
          // },
          // {
          //   label: 'Atividades',
          //   icon: 'Document',
          //   items: [
          //     {
          //       label: 'Modelo de atividades',
          //       to: 'atividades.gerenciamento',
          //       icon: 'Setting',
          //     },
          //     {
          //       label: 'Atividades',
          //       to: 'atividades.gerenciamento.fazer',
          //       icon: 'Document',
          //     },
          //   ]
          // },
        ]
      }
    }
  },
  methods: {
    ...mapActions(['logout']),
    searchEmpresa() {
      if (!this.search) return
      bus.globalLoading = true
      empresasShowRequest(this.search)
        .then(res => {
          this.$store.dispatch('setEmpresa', res.data.data)
          this.$router.push({name: 'empresas.show'})
        })
        .catch(() => this.$snack.error('Empresa não encontrada'))
        .finally(() => bus.globalLoading = false)
    },
    onLogout() {
      OneSignal.push(function () {
        OneSignal.removeExternalUserId();
      });
      this.logout()
      document.body.classList.remove('overflow-hidden')
      this.$snack.success('Logout feito com sucesso')
    },
    closeSidebar() {
      this.isOpen = false
      document.body.classList.remove('overflow-hidden')
    },
    openSidebar() {
      this.isOpen = true
      document.body.classList.add('overflow-hidden')
    },
    itemHasPermission(item) {
      if (!item.permissions) return false
      return !!item.permissions.filter(curr => this.$hasPermission(curr)).length
    },
    itemHasRole(item) {
      if (!item.roles) return false
      return !!item.roles.filter(curr => this.$hasRole(curr)).length
    },
  },
  computed: {
    ...mapGetters([
      'getUserFirstName',
      'getUser'
    ]),
    menuDefaultItems() {
      return this.menus.default.filter(curr => {
        if (!curr.permissions && !curr.roles) return true
        return this.itemHasRole(curr) || this.itemHasPermission(curr)
      })
    },
    submenus() {
      return this.menus.submenus.filter(curr => {
        if (!curr.permissions && !curr.roles) return true
        return this.itemHasRole(curr) || this.itemHasPermission(curr)
      })
    },
  },
  watch: {
    $route() {
      this.closeSidebar();
    }
  },
  mounted() {
    Bus.$on('open-sidebar', () => this.openSidebar())
  }
}
</script>

<style scoped lang="scss">

.sidebar::-webkit-scrollbar {
  display: none;
}

.menu-item {
  &:hover {
    .link-label {
      font-weight: bold;
    }

    .menu-mark {
      opacity: 100;
    }
  }

  .menu-mark {
    opacity: 0;
    @screen md {
      margin-right: 1rem;
    }
  }

  &.active {
    font-weight: bold;
    @apply text-neutral-100;
    .menu-mark {
      opacity: 100;
    }
  }
}

</style>
