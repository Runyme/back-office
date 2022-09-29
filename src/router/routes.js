// TEMPLATE PARENTS
import AppTemplate from '@/templates/App'

//MIDDLEWARES
import auth from '@/router/middleware/auth'
import guest from '@/router/middleware/guest'
import rolesAndPermissions from '@/router/middleware/rolesAndPermissions'
import empresas from '@/router/middleware/empresas'
import clientes from '@/router/middleware/clientes'

const baseMiddleware = [ auth, rolesAndPermissions ]

//VIEWS
import Test from '@/views/Test'
// import SimuladorPlantao from '@/views/SimuladorPlantao'


//AUTH
import AuthLogin from '@/views/auth/Login'


//USERS
import Users from '@/views/users/Index'
import UsersShow from '@/views/users/Show'
import UsersCreate from '@/views/users/Create'

//ROLES
import Roles from '@/views/roles/Index'
import RolesShow from '@/views/roles/Show'
import RolesCreate from '@/views/roles/Create'

//PERMISSIONS
import Permissions from '@/views/permissions/Index'
import PermissionsCreate from '@/views/permissions/Create'

//CLIENTES
import Clientes from '@/views/clientes/Index'
import ClientesShow from '@/views/clientes/Show'

//PAGES
import Dashboard from '@/views/Home/Dashboard'

//EMPRESAS
import Empresas from '@/views/empresas/Index'
import EmpresasAll from '@/views/empresas/All'
import EmpresasCreate from '@/views/empresas/Create'
import EmpresasShow from '@/views/empresas/Show'
import EmpresasPosCadastro from '@/views/empresas/poscadastro/Index'

//EMPRESAS ALTERAÇÃO
import EmpresaAlteracao from '@/views/empresas/alteracao/Index'

//EMPRESAS ALVARAS
import EmpresaAlvara from '@/views/empresas/alvaras/Index'
import motivoRetencao from '@/views/empresas/motivoRetencao'
import Retencao from '@/views/empresas/Retencao'



//ARQUIVOS
import Arquivos from '@/views/Arquivos'

//PAGES - GUIAS
import GerenciamentoGuias from '@/views/guias/GerenciamentoGuias'
import UploadGuias from '@/views/guias/UploadGuias'
import GuiasNaoProcessadas from "@/views/guias/GuiasNaoProcessadas";

//PAGES - RECEITAS
import GerenciamentoReceitas from '@/views/receitas/GerenciamentoReceitas'
import UploadReceitas from '@/views/receitas/UploadReceitas'
import ReceitasNaoProcessadas from "@/views/receitas/ReceitasNaoProcessadas";
import DivisaoReceita from "@/views/receitas/DivisaoReceita";

//PAGES - FINANCEIRO
import Faturas from "../views/financeiro/Faturas";
import GerenciamentoCobrancas from "../views/financeiro/GerenciamentoCobrancas";

// PAGES - ORDEM DE SERVICO
import ServiceOrderList from '@/views/service-order/request/index/Index'
import ServiceOrderCreate from '@/views/service-order/request/create/Create'
import ServiceOrderExecute from '@/views/service-order/request/execute/Execute'

//PAGES - ORDEM DE SERVICO BASE
import ServiceOrdemBaseList from '@/views/service-order/procedure/index/Index'
import ServiceOrderBaseCreate from '@/views/service-order/procedure/create/Create'

//PAGES - VIABILIDADE
import ViabilidadeMunicipal from '@/views/viabilidade/municipal/Index'

//JUNTA COMERCIAL
import JuntaComercial from '@/views/junta-comercial/Index'

// CARTEIRAS
import Carteiras from "../views/carteiras/Index";
import CarteirasForm from "../views/carteiras/Form";

// CERTIDÃO NEGATIVA
import GerenciamentoCertidaoNegativa from "../views/certidao-negativa/Gerenciamento";
import UploadCertidaoNegativa from "../views/certidao-negativa/Upload";
import CertidaoNegativaNaoProcessadas from "../views/certidao-negativa/NaoProcessadas";

// Irpf
import ClientesIrpfList from "../views/Irpf/ClientesIrpfList";
import Plans from "../views/financeiro/Plans";
import PlanSubscriptions from "../views/financeiro/PlanSubscriptions";

// CHAT
import ChatIndex from '@/views/chat/Index'
import ChatApontamentos from '@/views/chat/Apontamentos'

// CONTRATANTES
import ContratanteIndex from '@/views/contratantes/Index'

// ATIVIDADES
import GerenciamentoAtividades from '@/views/atividades/GerenciamentoAtividades'
import GerenciamentoAtividadesDo from '@/views/atividades/GerenciamentoAtividadesDo'

const routes = [
  {
    path: '',
    name: 'app',
    redirect: { name: 'dashboard' },
    component: AppTemplate,
    children: [
      {
        path: '/uploads',
        name: 'uploads.index',
        component: () =>  import('@/views/arquivos/upload/Holerites'),
        meta: {
          title: 'Uploads',
          middleware: baseMiddleware,
        }
      },
      {
        path: '/livro-fiscal',
        name: 'livro-fiscal.index',
        component: () =>  import('@/views/livro-fiscal/LivroFiscal'),
        meta: {
          title: 'Livro fiscal',
          middleware: baseMiddleware,
        }
      },
      {
        path: '/indicacoes',
        name: 'indicacoes.index',
        component: () =>  import('@/views/indicacao/Indicacoes'),
        meta: {
          title: 'Indicações',
          middleware: baseMiddleware,
        }
      },
      {
        path: '/credenciamentos',
        name: 'credenciamentos.index',
        component: () =>  import('@/views/credenciamento/Credenciamento'),
        meta: {
          title: 'Credenciamentos',
          middleware: baseMiddleware,
        }
      },
      {
        path: '/teste',
        name: 'teste',
        component: Test,
        meta: {
          title: 'Teste',
          middleware: baseMiddleware
        }
      },
      //PAGES
      {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: {
          title: 'Dashboard',
          middleware: baseMiddleware
        }
      },
      //EMPRESAS
      {
        path: '/empresas',
        name: 'empresas.index',
        component: Empresas,
        meta: {
          title: 'Empresas',
          middleware: baseMiddleware
        }
      },
      {
        path: '/empresas/cartaoCredito',
        name: 'empresas.cartaoCredito',
        component: () =>  import('@/views/empresas/CartaoCredito'),
        meta: {
          title: 'Cartao Credito',
          middleware: baseMiddleware
        }
      },
      {
        path: '/empresas/atividades',
        name: 'empresas.atividades',
        component: () =>  import('@/views/empresas/Atividades'),
        meta: {
          title: 'Atividades',
          middleware: baseMiddleware
        }
      },
      {
        path: '/atividades/etapas/:atividade_id',
        name: 'atividades.etapas',
        component: () =>  import('@/views/empresas/etapas'),
        meta: {
          title: 'Etapas',
          middleware: baseMiddleware
        }
      },
      {
        path: '/empresas/linker',
        name: 'empresas.linker',
        component: () =>  import('@/views/empresas/linker'),
        meta: {
          title: 'Todas Empresas',
          middleware: baseMiddleware
        }
      },
      {
        path: '/empresas/all',
        name: 'empresas.all',
        component: EmpresasAll,
        meta: {
          title: 'Todas Empresas',
          middleware: baseMiddleware
        }
      },
      {
        path: '/empresas/show',
        name: 'empresas.show',
        component: EmpresasShow,
        meta: {
          title: 'Empresa',
          middleware: [...baseMiddleware, empresas]
        }
      },
      {
        path: '/empresas/create',
        name: 'empresas.create',
        component: EmpresasCreate,
        meta: {
          title: 'Cadastrar nova Empresa',
          middleware: baseMiddleware
        }
      },
      {
        path: '/empresas/pos-cadastro',
        name: 'empresas.posCadastro',
        component: EmpresasPosCadastro,
        meta: {
          title: 'Pós Cadastro',
          middleware: baseMiddleware
        }
      },
      {
        path: '/empresas/alteracao',
        name: 'empresas.alteracao',
        component: EmpresaAlteracao,
        meta: {
          title: 'Alteração',
          middleware: baseMiddleware
        }
      },
      {
        path: '/empresas/alvaras',
        name: 'empresas.alvaras.index',
        component: EmpresaAlvara,
        meta: {
          title: 'Alvarás',
          middleware: baseMiddleware
        }
      },
      {
        path: '/empresas/retencao',
        name: 'empresas.retencao',
        component: Retencao,
        meta: {
          title: 'Retenção',
          middleware: baseMiddleware
        }
      },
      {
        path: '/empresas/motivoRetencao',
        name: 'empresas.motivoRetencao',
        component: motivoRetencao,
        meta: {
          title: 'Motivo Retenção',
          middleware: baseMiddleware
        }
      },
      {
        path: '/exports',
        name: 'exports',
        component: () =>  import('@/views/exports/index'),
        meta: {
          title: 'Exports',
          middleware: [...baseMiddleware ]
        }
      },
      {
        path: '/simulator',
        name: 'simulator',
        component: () =>  import('@/views/simulator/show'),
        meta: {
          title: 'Simulador',
          middleware: [...baseMiddleware ]
        }
      },
      {
        path: '/simulador/plantao',
        name: 'simulador.plantao',
        component: () =>  import('@/views/SimuladorPlantao'),
        meta: {
          title: 'Plantao',
          middleware: [ guest ],
        }
      },
      //PAGES - ATIVIDADES
      {
        path: '/atividades',
        name: 'atividades.gerenciamento',
        component: GerenciamentoAtividades,
        meta: {
          title: 'Modelo de atividades',
          middleware: baseMiddleware
        }
      },
      {
        path: '/atividades-fazer',
        name: 'atividades.gerenciamento.fazer',
        component: GerenciamentoAtividadesDo,
        meta: {
          title: 'Atividades',
          middleware: baseMiddleware
        }
      },
      //CLIENTES
      {
        path: '/clientes',
        name: 'clientes.index',
        component: Clientes,
        meta: {
          title: 'Clientes',
          middleware: baseMiddleware
        }
      },
      {
        path: '/clientes/show',
        name: 'clientes.show',
        component: ClientesShow,
        meta: {
          title: 'Cliente',
          middleware: [...baseMiddleware, clientes]
        }
      },
      {
        path: '/clientes/create',
        name: 'clientes.create',
        component: () => import('@/views/clientes/Create'),
        meta: {
          title: 'Cliente',
          middleware: [...baseMiddleware]
        }
      },
      //PAGES - GUIAS
      {
        path: '/guias',
        name: 'guias.gerenciamento',
        component: GerenciamentoGuias,
        meta: {
          title: 'Gerenciamento de Guias',
          middleware: baseMiddleware
        }
      },
      {
        path: '/upload-guias',
        name: 'guias.upload',
        component: UploadGuias,
        meta: {
          title: 'Upload de Guias',
          middleware: baseMiddleware
        }
      },
      {
        path: '/guias-nao-processadas',
        name: 'guias.nao-processadas',
        component: GuiasNaoProcessadas,
        meta: {
          title: 'Guias não processadas',
          middleware: baseMiddleware
        }
      },
      //PAGES - CERTIDÃO NEGATIVA
      {
        path: '/certidao-negativa',
        name: 'certidao-negativa.gerenciamento',
        component: GerenciamentoCertidaoNegativa,
        meta: {
          title: 'Gerenciamento de Certidões Negativas de Débitos',
          middleware: baseMiddleware
        }
      },
      {
        path: '/upload-certidao-negativa',
        name: 'certidao-negativa.upload',
        component: UploadCertidaoNegativa,
        meta: {
          title: 'Upload de Certidão Negativa de Débitos',
          middleware: baseMiddleware
        }
      },
      {
        path: '/certidao-negativa-nao-processadas',
        name: 'certidao-negativa.nao-processadas',
        component: CertidaoNegativaNaoProcessadas,
        meta: {
          title: 'Certidões Negativas de Débitos não processadas',
          middleware: baseMiddleware
        }
      },
      //PAGES - RECEITAS
      {
        path: '/receitas',
        name: 'receitas.gerenciamento',
        component: GerenciamentoReceitas,
        meta: {
          title: 'Gerenciamento de Prolabore',
          middleware: baseMiddleware
        }
      },
      {
        path: '/upload-receitas',
        name: 'receitas.upload',
        component: UploadReceitas,
        meta: {
          title: 'Upload de Prolabore',
          middleware: baseMiddleware
        }
      },
      {
        path: '/receitas-nao-processadas',
        name: 'receitas.nao-processadas',
        component: ReceitasNaoProcessadas,
        meta: {
          title: 'Prolabore não processado',
          middleware: baseMiddleware
        }
      },
      {
        path: '/divisao-receita',
        name: 'receitas.divisao',
        component: DivisaoReceita,
        meta: {
          title: 'Divisão de Receita',
          middleware: baseMiddleware
        }
      },
      //PAGES - Financeiro
      {
        path: '/financeiro/gerenciar-fatura',
        name: 'financeiro.gerenciar-fatura',
        component: Faturas,
        meta: {
          title: 'Financeiro - Faturas',
          middleware: baseMiddleware,
          roles: ['Financeiro']
        }
      },
      {
        path: '/financeiro/plans',
        name: 'financeiro.plans',
        component: Plans,
        meta: {
          title: 'Financeiro - Planos',
          middleware: baseMiddleware,
          roles: ['Financeiro']
        }
      },
      {
        path: '/financeiro/assinaturas',
        name: 'financeiro.subscriptions',
        component: PlanSubscriptions,
        meta: {
          title: 'Financeiro - Assinaturas',
          middleware: baseMiddleware,
          roles: ['Financeiro']
        }
      },
      {
        path: '/financeiro/gerenciar-cobrancas',
        name: 'financeiro.gerenciar-cobrancas',
        component: GerenciamentoCobrancas,
        meta: {
          title: 'Financeiro - Faturas',
          middleware: baseMiddleware,
          roles: ['Financeiro']
        }
      },
      {
        path: '/financeiro/nfse',
        name: 'financeiro.nfse',
        component: () => import('@/views/financeiro/Nfse.vue'),
        meta: {
          title: 'Financeiro - Nfse',
          middleware: baseMiddleware,
          roles: ['Financeiro']
        }
      },
      {
        path: '/financeiro/upfatures',
        name: 'financeiro.upfature',
        component: () => import('@/views/financeiro/upfatures'),
        meta: {
          title: 'Financeiro -',
          middleware: baseMiddleware,
          roles: ['Financeiro']
        }
      },
      {
        path: '/financeiro/contas-receber',
        name: 'financeiro.contas-receber',
        component: () => import('@/views/financeiro/ContasReceber'),
        meta: {
          title: 'Financeiro - Contas a Receber',
          middleware: baseMiddleware,
          roles: ['Financeiro']
        }
      },
      {
        path: '/financeiro/relatorios',
        name: 'financeiro.relatorios',
        component: () => import('@/views/financeiro/relatorios'),
        meta: {
          title: 'Financeiro - Relatorios',
          middleware: baseMiddleware,
          roles: ['Financeiro']
        }
      },
      {
        path: '/financeiro/tipoCobranca',
        name: 'financeiro.tipoCobranca',
        component: () => import('@/views/financeiro/TipoCobranca'),
        meta: {
          title: 'Financeiro - tipoCobranca',
          middleware: baseMiddleware,
          roles: ['Financeiro']
        }
      },
      {
        path: '/financeiro/FaturaMotivoCancelamento',
        name: 'financeiro.FaturaMotivoCancelamento',
        component: () => import('@/views/financeiro/FaturaMotivoCancelamento'),
        meta: {
          title: 'Financeiro - FaturaMotivoCancelamento',
          middleware: baseMiddleware,
          roles: ['Financeiro']
        }
      },
      // PAGES - ORDEM DE SERVICO
      {
        path: '/service-order/request',
        name: 'request.index',
        component: ServiceOrderList,
        meta: {
          title: 'Ordem de serviço',
          middleware: baseMiddleware
        }
      },
      {
        path: '/service-order/request/create',
        name: 'request.create',
        component: ServiceOrderCreate,
        meta: {
          title: 'Ordem de servico',
          middleware: baseMiddleware
        }
      },
      {
        path: '/service-order/request/:id',
        name: 'request.execute',
        component: ServiceOrderExecute,
        meta: {
          title: 'Ordem de servico',
          middleware: baseMiddleware
        }
      },
      // PAGES - ORDEM DE SERVICO BASE
      {
        path: '/service-order-base',
        name: 'procedure.index',
        component: ServiceOrdemBaseList,
        meta: {
          title: 'Ordem de servico base',
          middleware: baseMiddleware
        }
      },
      {
        path: '/service-order-base/create',
        name: 'procedure.create',
        component: ServiceOrderBaseCreate,
        meta: {
          title: 'Ordem de servico base',
          middleware: baseMiddleware
        }
      },
      // PAGES - VIABILIDADE
      {
        path: '/viabilidade',
        name: 'viabilidade',
        component: ViabilidadeMunicipal,
        meta: {
          title: 'Viabilidade',
          middleware: baseMiddleware
        }
      },
      // PAGES - VIABILIDADE
      {
        path: '/junta-comercial',
        name: 'juntaComercial.index',
        component: JuntaComercial,
        meta: {
          title: 'Junta Comercial',
          middleware: baseMiddleware
        }
      },
      {
        path: '/irpf',
        name: 'irpf.index',
        component: ClientesIrpfList,
        meta: {
          title: 'Irpf',
          middleware: baseMiddleware
        }
      },
      {
        path: '/irpf/questionario',
        name: 'irpf.questionario',
        component: () => import('@/views/Irpf/Questionario'),
        meta: {
          title: 'Questionário Irpf',
          middleware: baseMiddleware
        }
      },
      //USERS
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/views/users/Profile'),
        meta: {
          title: 'Perfil',
          middleware: baseMiddleware
        }
      },
      {
        path: '/users',
        name: 'users.index',
        component: Users,
        meta: {
          title: 'Usuários',
          middleware: baseMiddleware,
        }
      },
      {
        path: '/users/logs',
        name: 'users.LogsUsuario.LogsUsuario',
        component: () => import('@/views/users/LogsUsuario/LogsUsuario'),
        meta: {
          title: 'Usuários',
          middleware: baseMiddleware,
        }
      },
      {
        path: '/users/create',
        name: 'users.create',
        component: UsersCreate,
        meta: {
          title: 'Adicionar Usuário',
          middleware: baseMiddleware
        }
      },
      {
        path: '/users/:id',
        name: 'users.show',
        component: UsersShow,
        meta: {
          title: 'Usuário',
          middleware: baseMiddleware,
          permissions: ['editar usuario']
        }
      },
      //ROLES
      {
        path: '/roles',
        name: 'roles.index',
        component: Roles,
        meta: {
          title: 'Funções',
          middleware: baseMiddleware
        }
      },
      {
        path: '/roles/create',
        name: 'roles.create',
        component: RolesCreate,
        meta: {
          title: 'Adicionar Função',
          middleware: baseMiddleware,
        }
      },
      {
        path: '/roles/:id',
        name: 'roles.show',
        component: RolesShow,
        meta: {
          title: 'Função',
          middleware: baseMiddleware,
        }
      },
      //PERMISSIONS
      {
        path: '/permissions',
        name: 'permissions.index',
        component: Permissions,
        meta: {
          title: 'Permissões',
          middleware: baseMiddleware
        }
      },
      {
        path: '/permissions/create',
        name: 'permissions.create',
        component: PermissionsCreate,
        meta: {
          title: 'Adicionar Permissão',
          middleware: baseMiddleware
        }
      },
      // CARTEIRAS
      {
        path: '/carteiras',
        name: 'carteiras.index',
        component: Carteiras,
        meta: {
          title: 'Gerenciamento de Carteiras',
          middleware: baseMiddleware
        }
      },
      {
        path: '/carteiras/create',
        name: 'carteiras.create',
        component: CarteirasForm,
        meta: {
          title: 'Adicionar Carteira',
          middleware: baseMiddleware,
          roles: ['Gerenciar carteiras']
        }
      },
      {
        path: '/carteiras/:id/edit',
        name: 'carteiras.edit',
        component: CarteirasForm,
        meta: {
          title: 'Editar Carteira',
          middleware: baseMiddleware
        }
      },
      //CHAT
      {
        path: '/chat',
        name: 'chat.index',
        component: ChatIndex,
        meta: {
          title: 'Chat',
          middleware: baseMiddleware
        }
      },
      {
        path: '/chat/apontamentos',
        name: 'chat.apontamentos',
        component: ChatApontamentos,
        meta: {
          title: 'Apontamentos',
          middleware: baseMiddleware
        }
      },
      // CONTRATANTES
      {
        path: '/contratantes',
        name: 'contratantes.index',
        component: ContratanteIndex,
        meta: {
          title: 'Contratantes',
          middleware: baseMiddleware
        }
      },
    ]
  },
  {
    path: '/auth/login',
    name: 'auth.login',
    component: AuthLogin,
    meta: {
      title: 'Login',
      middleware: [ guest ],
    }
  },
  {
    path: '/plantao',
    name: 'plantao',
    component: () =>  import('@/views/SimuladorPlantao'),
    meta: {
      title: 'Plantao',
      middleware: [ guest ],
    }
  },
  {
    path: '/satisfacao',
    name: 'satisfacao',
    component: () =>  import('@/views/Satisfation'),
    meta: {
      title: 'satisfacao',
      middleware: [ guest ],
    }
  },

]

export default routes
