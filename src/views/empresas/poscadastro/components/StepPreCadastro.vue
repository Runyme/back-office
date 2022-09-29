<template>
  <div class="flex mt-10 grid grid-cols-4 gap-5">
    <div>
      <div class="mb-8 bg-neutral-100 p-4 rounded">
        <span
          class="
            text-lg
            font-display
            border-b border-neutral-400
            w-full
            pb-2
            flex
            mb-4
          "
        >
          Informações da venda
        </span>

        <div class="flex flex-col">
          <div class="flex">
            <div>
              <ArrowRight class="text-info-base" size="6" />
            </div>
            <span class="ml-4 text-neutral-700"
              >Vendedor(a):
              {{ empresa.precadastro.usuario.nome_completo }}</span
            >
          </div>

          <div class="flex mt-5">
            <div>
              <ArrowRight class="text-info-base" size="6" />
            </div>
            <span class="ml-4 text-neutral-700"
              >Data do cadastro: {{ formatEnToBr(empresa.created_at) }}</span
            >
          </div>
        </div>
      </div>
      <div class="mb-8 bg-neutral-100 p-4 rounded">
        <span
          class="
            text-lg
            font-display
            border-b border-neutral-400
            w-full
            pb-2
            flex
            mb-4
          "
        >
          Status
        </span>

        <div class="flex flex-col">
          <div class="flex">
            <div>
              <BadgeCheck
                class="text-success-base"
                size="6"
                v-if="isContratoAssinado"
              />
              <Warning class="text-error-base" size="6" v-else />
            </div>
            <span class="ml-4 text-neutral-700">Contrato assinado</span>
          </div>

          <div class="flex mt-5">
            <div>
              <Warning class="text-error-base" size="6" />
            </div>
            <span class="ml-4 text-neutral-700">Comprovante de IPTU</span>
          </div>

          <div class="flex mt-5">
            <div>
              <BadgeCheck class="text-success-base" size="6" />
            </div>
            <span class="ml-4 text-neutral-700">Dados dos sócios</span>
          </div>

          <div class="flex mt-5">
            <div>
              <BadgeCheck
                class="text-success-base"
                size="6"
                v-if="isCompanyDataOk"
              />
              <Warning class="text-error-base" size="6" v-else />
            </div>
            <span class="ml-4 text-neutral-700">Dados da empresa</span>
          </div>

          <div class="flex mt-5">
            <div>
              <BadgeCheck
                class="text-success-base"
                size="6"
                v-if="isEnderecoOk"
              />
              <Warning class="text-error-base" size="6" v-else />
            </div>
            <span class="ml-4 text-neutral-700">Endereço da empresa</span>
          </div>

          <div class="flex mt-5">
            <div>
              <BadgeCheck
                class="text-success-base"
                size="6"
                v-if="isContactsOk"
              />
              <Warning class="text-error-base" size="6" v-else />
            </div>
            <span class="ml-4 text-neutral-700">Contatos da empresa</span>
          </div>

          <div class="flex mt-5">
            <div>
              <BadgeCheck
                class="text-success-base"
                size="6"
                v-if="form.plan_id != null"
              />
              <Warning class="text-error-base" size="6" v-else />
            </div>
            <span class="ml-4 text-neutral-700">Plano</span>
          </div>
        </div>
      </div>
    </div>

    <form class="col-span-3 flex flex-col" @submit.prevent="submitForm">
      <!-- TIPO -->
      <div class="mb-8 bg-neutral-100 p-4 rounded">
        <span
          class="
            text-lg
            font-display
            border-b border-neutral-400
            w-full
            pb-2
            flex
            mb-4
          "
        >
          Anexos
        </span>

        <div class="flex">
          <Attachment
            v-for="item in empresa.arquivos"
            :key="item.id"
            :anexo="item"
            class="mr-4"
          />

          <Attachment
            v-if="empresa.contrato && empresa.contrato.arquivo"
            :anexo="empresa.contrato.arquivo"
          />
        </div>
      </div>

      <!-- SÓCIOS-->
      <div class="mb-8 bg-neutral-100 p-4 rounded">
        <span
          class="
            text-lg
            font-display
            border-b border-neutral-400
            w-full
            pb-2
            flex
            mb-4
          "
        >
          Sócios
        </span>

        <ul v-if="socios.length" class="py-2 mb-2">
          <li
            v-for="(socio, index) in socios"
            :key="index"
            class="flex justify-between items-center py-2"
          >
            <span class="w-full">
              {{ socio.cliente.nome_completo }} | CPF: {{ socio.cliente.cpf }}

              <button @click.prevent="editSocio(socio.cliente.id)">
                <b-icon class="ml-1" icon="circle-edit-outline"></b-icon>
              </button>

              <b-tooltip
                v-if="socio_administrador !== socio.cliente.id"
                label="Remover como sócio"
                position="is-bottom"
                type="is-danger"
              >
                <button
                  class="flex items-center justify-center ml-1"
                  @click.prevent="socios.splice(index, 1)"
                >
                  <b-icon class="mr-1" icon="close-circle-outline"></b-icon>
                </button>
              </b-tooltip>
            </span>

            <b-numberinput
              v-model="socio.porcentagem_societaria"
              controls-position="compact"
              class="w-32 flex-shrink-0"
              min="0"
              max="100"
            ></b-numberinput>

            <b-radio
              v-model="socio_administrador"
              :native-value="socio.cliente.id"
              class="flex-shrink-0 ml-4"
            >
              Administrador
            </b-radio>
          </li>
        </ul>

        <div
          class="w-full h-full flex flex-col justify-center items-center"
          v-else
        >
          <not-found-data text="Nenhum sócio adicionado" />
        </div>

        <Lynx-Button
          text="Adicionar Sócio"
          @click.prevent.native="addSocio"
          icon="Plus"
        />
      </div>

      <!-- DADOS EMPRESA -->
      <div class="mb-8 bg-neutral-100 p-4 rounded">
        <span
          class="
            text-lg
            font-display
            border-b border-neutral-400
            w-full
            pb-2
            flex
            mb-4
          "
        >
          Dados da Empresa
        </span>

        <b-field>
          <b-radio-button v-model="form.tipo" native-value="abertura">
            <span>Abertura</span>
          </b-radio-button>

          <b-radio-button v-model="form.tipo" native-value="transferencia">
            <span>Transferência</span>
          </b-radio-button>
        </b-field>

        <label v-if="this.form.tipo == 'transferencia'" class="block">
          <Lynx-Label
            label="CNPJ"
            :validator="$v.form.cnpj"
            :validations-message="validationsMessage.form.cnpj"
          />

          <Lynx-Input
            placeholder="Insira o CNPJ"
            :error="$v.form.cnpj.$error"
            v-model.trim="$v.form.cnpj.$model"
            mask="##.###.###/####-##"
            @input="getDocument"
            @paste="getDocument"
          />
        </label>

        <label class="block">
          <Lynx-Label label="Nome Fantasia" />
          <Lynx-Input
            placeholder="Insira o Nome Fantasia"
            v-model.trim="form.nome_fantasia"
          />
        </label>

        <div
          v-if="this.form.tipo == 'transferencia'"
          class="block flex flex-wrap"
        >
          <Lynx-Label label="Razão Social" class="mr-2" />

          <Lynx-Input
            placeholder="Insira o Razão Social"
            v-model="form.razao_social[0]"
            class="w-full my-2"
          />
        </div>

        <div v-if="this.form.tipo == 'abertura'" class="block flex flex-wrap">
          <Lynx-Label label="Razão Social" class="mr-2" />

          <b-button
            size="is-small"
            type="is-primary"
            v-if="form.tipo == 'abertura'"
            @click.prevent="form.razao_social.push('')"
          >
            Adicionar Razão Social
          </b-button>

          <div
            class="w-full flex"
            v-for="(item, index) in form.razao_social"
            :key="index"
          >
            <Lynx-Input
              placeholder="Insira o Razão Social"
              v-model="form.razao_social[index]"
              class="w-full my-2"
            />

            <button
              v-if="index != 0"
              class="
                pl-2
                flex
                items-center
                justify-center
                flex-shrink-0
                text-neutral-500
              "
              @click.prevent="form.razao_social.splice(index, 1)"
            >
              <b-icon icon="delete-forever"></b-icon>
            </button>
          </div>
          <p class="text-xs text-neutral-600">Informe pelo menos 3 opções</p>
        </div>

        <div class="flex">
          <label class="block w-full pr-4">
            <Lynx-Label
              label="Regime Tributário"
              :validator="$v.form.regime_tributario"
              :validations-message="validationsMessage.form.regime_tributario"
            />

            <b-select
              placeholder="Escolha um Regime Tributário"
              v-model="$v.form.regime_tributario.$model"
            >
              <option value="SN">Simples Nacional</option>
              <option value="Presumido">Presumido</option>
              <option value="Isento">Isento</option>
            </b-select>
          </label>

          <label class="block w-full pr-4">
            <Lynx-Label
              label="Tipo Societário"
              :validator="$v.form.tipo_societario"
              :validations-message="validationsMessage.form.tipo_societario"
            />

            <b-select
              placeholder="Escolha um Tipo Societário"
              v-model="$v.form.tipo_societario.$model"
            >
              <option value="LTDA">LTDA</option>
              <option value="Eireli">Eireli</option>
              <option value="Individual">Individual</option>
              <option value="Unipessoal">Unipessoal</option>
              <option value="ONG">ONG</option>
            </b-select>
          </label>

          <label class="block w-full pr-4">
            <Lynx-Label
              label="Tipo Empresa"
              :validator="$v.form.type"
              :validations-message="validationsMessage.form.type"
            />

            <b-select
              placeholder="Escolha um Tipo de Empresa"
              v-model="$v.form.type.$model"
            >
              <option value="normal">Normal</option>
              <option value="clinica">Clinica</option>
              <option value="atletica">Atlética</option>
            </b-select>
          </label>
          <b-checkbox
            class="block flex-shrink-0 pt-2"
            v-model="form.clinica_fisica"
            >Possui Clinica Física</b-checkbox
          >
        </div>

        <label class="block">
          <Lynx-Label label="Observações" />

          <Textarea
            placeholder="Insira observações"
            v-model.trim="form.observacoes"
          />
        </label>

        <Input-File
          text="Cartão CNPJ"
          ref="cartaoCnpjInput"
          v-if="this.form.tipo == 'transferencia'"
        />
        <Input-File
          v-if="!isContratoAssinado"
          text="Contrato assinado"
          ref="contratoAssinadoInput"
        />
      </div>

      <!-- CONTATOS -->
      <div class="mb-8 flex flex-wrap bg-neutral-100 p-4 rounded">
        <span
          class="
            w-full
            text-lg
            font-display
            border-b border-neutral-400
            w-full
            pb-2
            flex
            mb-4
          "
        >
          Contatos da Empresa
        </span>

        <div class="flex w-full pb-4">
          <small class="text-neutral-600"
            >Atenção! Contatos não "Notificáveis" não receberão o contrato,
            guias ou qualquer outra informação relevante para proceguir como
            processo.</small
          >
        </div>

        <div class="flex flex-wrap w-full">
          <div class="w-1/2">
            <div class="mr-1 p-2 border border-neutral-400 rounded">
              <span class="font-display w-full pb-2 flex items-center">
                Emails

                <b-button
                  size="is-small"
                  type="is-primary"
                  @click.prevent="addEmail"
                  class="ml-2"
                >
                  Adicionar
                </b-button>
              </span>

              <div
                class="flex items-center w-full pb-6"
                v-for="(email, index) in contatosEmail"
                :key="index"
              >
                <button
                  v-if="index != 0"
                  class="
                    pr-1
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                    text-neutral-500
                  "
                  @click.prevent="contatosEmail.splice(index, 1)"
                >
                  <b-icon icon="delete-forever"></b-icon>
                </button>

                <Lynx-Input
                  placeholder="Insira um email"
                  type="email"
                  v-model="email.value"
                  class="w-full"
                />

                <b-checkbox class="flex-shrink-0 ml-2" v-model="email.optin">
                  Notificação
                </b-checkbox>
              </div>
            </div>
          </div>

          <div class="w-1/2">
            <div class="ml-1 p-2 border border-neutral-400 rounded">
              <span class="font-display w-full pb-2 flex items-center">
                Celulares

                <b-button
                  size="is-small"
                  type="is-primary"
                  @click.prevent="addCelular"
                  class="ml-2"
                >
                  Adicionar
                </b-button>
              </span>

              <div
                class="flex items-center w-full pb-6"
                v-for="(celular, index) in contatosCelular"
                :key="index"
              >
                <button
                  v-if="index != 0"
                  class="
                    pr-1
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                    text-neutral-500
                  "
                  @click.prevent="contatosCelular.splice(index, 1)"
                >
                  <b-icon icon="delete-forever"></b-icon>
                </button>

                <Lynx-Input
                  placeholder="Insira um celular"
                  v-model="celular.value"
                  mask="(##) #####-####"
                  class="w-full"
                />

                <b-checkbox class="flex-shrink-0 ml-2" v-model="celular.optin">
                  Notificação
                </b-checkbox>

                <b-checkbox
                  class="flex-shrink-0 ml-2"
                  v-model="celular.options.is_whatsapp"
                >
                  Whatsapp
                </b-checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ENDEREÇO -->
      <div class="mb-8 bg-neutral-100 p-4 rounded">
        <span
          class="
            text-lg
            font-display
            border-b border-neutral-400
            w-full
            pb-2
            flex
            mb-4
          "
        >
          Endereço da Empresa
        </span>

        <div class="flex">
          <label class="flex flex-col w-1/3 pr-4 pb-6">
            <Lynx-Label
              label="CEP"
              :validator="$v.form.endereco.cep"
              :validations-message="validationsMessage.form.endereco.cep"
            />
            <Lynx-Input
              placeholder="Insira o CEP"
              :error="$v.form.endereco.cep.$error"
              v-model.trim="$v.form.endereco.cep.$model"
              mask="#####-###"
              @input="fetchCep"
            />
          </label>

          <label class="flex flex-col w-1/3 pr-4 pb-6">
            <Lynx-Label
              label="IPTU"
              :validator="$v.form.endereco.iptu"
              :validations-message="validationsMessage.form.endereco.iptu"
            />
            <Lynx-Input
              placeholder="Insira o IPTU"
              :error="$v.form.endereco.iptu.$error"
              v-model.trim="$v.form.endereco.iptu.$model"
              mask="####################"
            />
          </label>

          <b-field label="Tipo">
            <b-select v-model="form.endereco.tipo">
              <option value="Residencial">Residencial</option>
              <option value="Clínica Física">Clínica Física</option>
              <option value="Coworking">Coworking</option>
            </b-select>
          </b-field>
        </div>

        <div class="w-full flex">
          <label class="flex flex-col w-1/2 pb-6 pr-2">
            <Lynx-Label
              label="Logradouro"
              :validator="$v.form.endereco.logradouro"
              :validations-message="validationsMessage.form.endereco.logradouro"
            />
            <Lynx-Input
              placeholder="Insira o Logradouro"
              :error="$v.form.endereco.logradouro.$error"
              v-model.trim="$v.form.endereco.logradouro.$model"
            />
          </label>

          <label class="flex flex-col w-1/4 px-2 pb-6">
            <Lynx-Label
              label="Numero"
              :validator="$v.form.endereco.numero"
              :validations-message="validationsMessage.form.endereco.numero"
            />
            <Lynx-Input
              placeholder="Insira o Número"
              :error="$v.form.endereco.numero.$error"
              v-model.trim="$v.form.endereco.numero.$model"
            />
          </label>

          <label class="flex flex-col w-1/4 pl-2 pb-6">
            <Lynx-Label label="Complemento" />
            <Lynx-Input
              placeholder="Insira o Número"
              v-model="form.endereco.complemento"
            />
          </label>
        </div>

        <div class="w-full flex">
          <label class="flex flex-col w-1/5 pb-6 pr-2">
            <Lynx-Label
              label="Estado"
              :validator="$v.form.endereco.uf"
              :validations-message="validationsMessage.form.endereco.uf"
            />
            <Lynx-Input
              placeholder="Insira o Estado"
              :error="$v.form.endereco.uf.$error"
              v-model.trim="$v.form.endereco.uf.$model"
            />
          </label>

          <label class="flex flex-col w-2/5 px-2 pb-6">
            <Lynx-Label
              label="Cidade"
              :validator="$v.form.endereco.cidade"
              :validations-message="validationsMessage.form.endereco.cidade"
            />
            <Lynx-Input
              placeholder="Insira a Cidade"
              :error="$v.form.endereco.cidade.$error"
              v-model.trim="$v.form.endereco.cidade.$model"
            />
          </label>

          <label class="flex flex-col w-2/5 px-2 pb-6">
            <Lynx-Label
              label="Bairro"
              :validator="$v.form.endereco.bairro"
              :validations-message="validationsMessage.form.endereco.bairro"
            />
            <Lynx-Input
              placeholder="Insira o bairro"
              :error="$v.form.endereco.bairro.$error"
              v-model.trim="$v.form.endereco.bairro.$model"
            />
          </label>
        </div>

        <Input-File
          text="Comprovante de Residência"
          ref="comprovanteDeResidenciaInput"
        />
      </div>

      <!-- PLANOS -->
      <div class="mb-8 bg-neutral-100 p-4 rounded">
        <span
          class="
            text-lg
            font-display
            border-b border-neutral-400
            w-full
            pb-2
            flex
            mb-4
          "
        >
          Escolha de Planos
        </span>

        <div v-if="loadingPlansError !== null">
          <b-notification
            :message="'Erro no carregamento dos planos: ' + loadingPlansError"
            class="opacity-50"
            type="is-danger"
          />
        </div>
        <div
          v-for="(plano, index) in plansType(this.form.type)"
          :key="index"
          class="
            flex
            justify-between
            items-center
            rounded
            p-2
            transition
            hover:bg-neutral-300
          "
          :class="{ 'opacity-75': !plano.selected }"
        >
          <label class="w-full flex items-center">
            <b-radio
              class="flex-shrink-0"
              name="plano"
              v-model="form.plan_id"
              :native-value="plano.id"
            ></b-radio>
            <span class="w-full">{{ plano.name }}</span>
          </label>

          <span
            class="w-32 flex-shrink-0 px-4 flex items-center justify-between"
          >
            <span>R$</span>
            <span>{{ plano.price.replace(".", ",") }}</span>
          </span>
        </div>
      </div>

      <div class="w-full flex justify-between mt-4">
        <Lynx-Button
          @click.native="validateCancel"
          type="button"
          text="Cancelar empresa"
          color="error-base"
          :loading="loading"
        />
        <Lynx-Button
          type="submit"
          text="Salvar"
          :loading="loading"
          :disable="loading"
        />
      </div>

      <b-loading :active.sync="loading" :is-full-page="false"></b-loading>
    </form>
    <!-- Carterias -->
    <div class="flex flex-col"></div>
    <div class="col-span-3 flex flex-col">
      <div class="mb-8 bg-neutral-100 p-4 rounded">
        <span
          class="
            text-lg
            font-display
            border-b border-neutral-400
            w-full
            pb-2
            flex
            mb-4
          "
        >
          Escolha de Carteiras
        </span>
        <div class="flex pb-3">
          <treeselect
            :multiple="true"
            :options="lista_carteiras"
            placeholder="Selecione as carteiras..."
            v-model="carteira"
          />
        </div>
        <Lynx-Button @click.prevent.native="carteias_save" text="Salvar" />
      </div>
    </div>

    <b-modal :active.sync="clienteSearchModalOpened">
      <ClientesSearchModal @selected="onClienteSelected" />
    </b-modal>

    <b-modal :active.sync="clienteEditModalOpened">
      <ClienteEditModal
        @updated="onClienteUpdated"
        :clienteId="clienteToEdit"
      />
    </b-modal>
  </div>
</template>

<script>
import { EmpresaPosCadastroUpdate } from "@/services/requests/empresaPosCadastro";
import InputFile from "@/components/helpers/InputFile";
import InputDate from "@/components/helpers/InputDate";
import Attachment from "@/components/shared/Attachment";
import {
  empresaCancelRequest,
  empresasStoreRequest,
} from "@/services/requests/empresas";
import ClientesSearchModal from "@/views/clientes/SearchModal";
import NotFoundData from "@/components/layouts/NotFoundData";
import {
  maxLength,
  minLength,
  numeric,
  required,
  requiredIf,
} from "vuelidate/lib/validators";
import { planosRequest } from "@/services/requests/planos";
import { viaCepRequest } from "@/services/requests/viaCep";
import { cnpjRequest } from "@/services/requests/cpfCnpj";
import { formatBrToEn, formatEnToBr } from "@/utils/momentHelpers";
import { contatosCreateRequest } from "@/services/requests/contatos";
import { enderecosCreateRequest } from "@/services/requests/enderecos";
import Textarea from "@/components/helpers/Textarea";
import BadgeCheck from "@/components/icons/BadgeCheck";
import CheckList from "@/components/svgs/CheckList";
import Warning from "@/components/icons/Warning";
import Id from "@/components/icons/Id";
import Info from "@/components/icons/Info";
import ArrowRight from "@/components/icons/ArrowRight";
import { updateEmpresaPreCadastro } from "@/services/requests/empresaPreCadastro";
import ClienteEditModal from "@/views/clientes/EditForm";
// import the component
import Treeselect from "@riophae/vue-treeselect";
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "StepPreCadastro",
  components: {
    ArrowRight,
    Warning,
    BadgeCheck,
    Textarea,
    NotFoundData,
    ClientesSearchModal,
    Attachment,
    InputFile,
    InputDate,
    ClienteEditModal,
    Treeselect,
  },
  props: ["empresa"],
  data() {
    return {
      form_carterira: {
        empresa_id: null,
        carteiras: [],
      },
      carteira: null,
      carteiras: [],
      clienteEditModalOpened: false,
      clienteToEdit: null,
      loadingPlans: false,
      loadingPlansError: null,
      loading: false,
      clienteSearchModalOpened: false,
      planos: [],
      socios: [],
      socio_administrador: "",
      contatosEmail: [{ tipo: "email", value: "", optin: true }],
      contatosCelular: [
        {
          tipo: "celular",
          value: "",
          optin: true,
          options: { is_whatsapp: true },
        },
      ],
      form: {
        id: "",
        tipo: "abertura",
        comprovante_residencia: null,
        cnpj: "",
        nome_fantasia: "",
        razao_social: [""],
        regime_tributario: "",
        tipo_societario: "",
        type: "normal",
        clinica_fisica: false,
        observacoes: "",
        endereco: {
          iptu: "",
          cep: "",
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          uf: "",
          ibge: "",
          tipo: "Residencial",
        },
        plan_id: null,
      },
      validationsMessage: {
        form: {
          cnpj: {
            required: "O campo CNPJ é obrigatório",
            numeric: "O campo CNPJ deve ser numérico",
            minLength: "O campo é CNPJ deve conter 14 caracteres",
            maxLength: "O campo é CNPJ deve conter 14 caracteres",
          },
          regime_tributario: {
            required: "O campo regime tributário é obrigatório",
          },
          tipo_societario: {
            required: "O campo tipo societário é obrigatório",
          },
          type: {
            required: "O campo Tipode de empresa é obrigatório",
          },
          clinica_fisica: {
            required: "O campo clinica física é obrigatório",
          },
          endereco: {
            iptu: {
              required: "O campo iptu é obrigatório",
              numeric: "O campo iptu deve ser numérico",
            },
            cep: {
              required: "O campo CEP é obrigatório",
              numeric: "O campo CEP deve ser numérico",
              minLength: "O campo é CEP deve conter 8 caracteres",
              maxLength: "O campo é CEP deve conter 8 caracteres",
            },
            logradouro: { required: "O campo logradouro é obrigatório" },
            numero: { required: "O campo número é obrigatório" },
            bairro: { required: "O campo bairro é obrigatório" },
            cidade: { required: "O campo cidade é obrigatório" },
            uf: {
              required: "O campo estado é obrigatório",
              minLength: "O campo estado deve conter 2 caracteres",
              maxLength: "O campo estado deve conter 2 caracteres",
            },
          },
        },
      },
    };
  },
  validations() {
    return {
      form: {
        cnpj: {
          required: requiredIf(function () {
            if (this.form.tipo == "transferencia") {
              return true;
            }
          }),
          numeric,
          minLength: minLength(14),
          maxLength: maxLength(14),
        },
        regime_tributario: { required },
        tipo_societario: { required },
        type: { required },
        clinica_fisica: { required },
        endereco: {
          iptu: { required, numeric },
          cep: {
            required,
            numeric,
            minLength: minLength(8),
            maxLength: maxLength(8),
          },
          logradouro: { required },
          numero: { required },
          bairro: { required },
          cidade: { required },
          uf: {
            required,
            minLength: minLength(2),
            maxLength: maxLength(2),
          },
        },
      },
    };
  },
  mounted() {
    this.listar_carteiras();
    this.fetchPlanos();
    this.populateEmpresaForm();
  },
  methods: {
    editSocio(clienteId) {
      (this.clienteToEdit = clienteId), (this.clienteEditModalOpened = true);
    },
    onClienteUpdated(cliente) {
      this.clienteEditModalOpened = false;

      this.socios = this.socios.map((socio) => {
        if (socio.cliente.id == cliente.id) {
          return { ...socio, cliente };
        }

        return socio;
      });
    },
    formatEnToBr,
    populateEmpresaForm() {
      this.socios.push({
        cliente: this.empresa.socios[0],
        porcentagem_societaria: 100,
      });
      this.socio_administrador = this.empresa.socios[0].id;

      this.form.id = this.empresa.id;
      this.form.plan_id = null;

      this.empresa.contatos.map((item) => {
        if (item.tipo === "celular") {
          this.contatosCelular = [];
          this.contatosCelular.push({
            ...item,
            optin: Boolean(item.optin),
          });
        }
        if (item.tipo === "email") {
          this.contatosEmail = [];
          this.contatosEmail.push({
            ...item,
            optin: Boolean(item.optin),
          });
        }
      });
    },
    async submitForm() {
      this.$v.form.$touch();

      if (this.$v.form.$invalid) {
        this.$snack.error("Corrija os campos inválidos!");
        return;
      }

      if (this.socios.length == 0) {
        this.$snack.error("Adicione pelo menos um sócio");
        return;
      }

      if (this.form.tipo == "abertura" && this.form.razao_social.length < 1) {
        this.$snack.error("Adicione pelo menos 1 alternativa de razão social");
        return;
      } else if (
        this.form.tipo == "transferencia" &&
        this.form.razao_social.length != 1
      ) {
        this.$snack.error("Adicione a razão social");
        return;
      }

      const invalidContatosEmail = this.contatosEmail.filter(
        (email) => email.value == ""
      ).length;
      if (invalidContatosEmail) {
        this.$snack.error("Adicione pelo menos um email");
        return;
      }

      const invalidContatosEmailOptin = this.contatosEmail.filter(
        (email) => email.optin == false
      ).length;
      if (invalidContatosEmailOptin) {
        this.$snack.error("Adicione pelo menos um email que seja notificável");
        return;
      }

      const invalidContatosCelular = this.contatosCelular.filter(
        (celular) => celular.value == ""
      ).length;
      if (invalidContatosCelular) {
        this.$snack.error("Adicione pelo menos um celular");
        return;
      }

      if (!this.form.plan_id) {
        this.$snack.error("Escolha pelo menos um plano");
        return;
      }

      this.loading = true;

      /* Comprovante de Residência Request */
      const comprovanteResidenciaId =
        await this.$refs.comprovanteDeResidenciaInput.submit();

      let ContratoAssinadoId = null;
      if (this.$refs.contratoAssinadoInput) {
        ContratoAssinadoId = await this.$refs.contratoAssinadoInput.submit();
      }

      /* Cartão CNPJ Request */
      let cartaoCnpjId = null;
      if (this.$refs.cartaoCnpjInput) {
        cartaoCnpjId = await this.$refs.cartaoCnpjInput.submit();
      }

      const data = {
        precadastro: {
          tipo: this.form.tipo,
          empresa: {
            razao_social:
              this.form.tipo == "transferencia"
                ? this.form.razao_social
                : this.form.razao_social,
            observacoes: this.form.observacoes,
          },
        },
        comprovante_residencia_id: comprovanteResidenciaId,
        cartao_cnpj_id: cartaoCnpjId,
        arquivo_contrato_id: ContratoAssinadoId,
        empresa: {
          cnpj: this.form.tipo == "transferencia" ? this.form.cnpj : null,
          razao_social:
            this.form.tipo == "transferencia"
              ? this.form.razao_social[0]
              : null,
          nome_fantasia: this.form.nome_fantasia,
          regime_tributario: this.form.regime_tributario,
          tipo_societario: this.form.tipo_societario,
          type: this.form.type,
          clinica_fisica: this.form.clinica_fisica,
        },
        contatos: [...this.contatosEmail, ...this.contatosCelular],
        endereco: this.form.endereco,
        socios: this.socios.map((socio) => {
          return {
            cliente_id: socio.cliente.id,
            porcentagem_societaria: socio.porcentagem_societaria,
            socio_administrador: socio.cliente.id == this.socio_administrador,
          };
        }),
        plan_id: this.form.plan_id,
      };

      updateEmpresaPreCadastro(this.form.id, data)
        .then(() => {
          this.$snack.success("Operação realizada com sucesso!");
          this.$emit("updated");
        })
        .catch((error) => {
          const errors = Object.values(error.response.data.errors);
          const message = errors
            .map((item) => item.map((error) => `<li>${error}</li>`).join(""))
            .join("");

          this.$buefy.dialog.alert({
            title: "Não foi possível cadastrar a empresa",
            message: `<ul>${message}</ul>`,
            type: "is-danger",
            ariaRole: "alertdialog",
            ariaModal: true,
          });
        })
        .finally(() => (this.loading = false));
    },
    getDocument(cnpj) {
      if (cnpj.length == 14) {
        cnpjRequest(cnpj).then((res) => {
          console.log(res.data);
          this.form.nome_fantasia = res.data.fantasia;
          this.form.razao_social = [res.data.razao];
          this.form.inicio_atividade = formatBrToEn(res.data.inicioAtividade);
        });
      }
    },
    addSocio() {
      this.clienteSearchModalOpened = true;
    },
    addEmail() {
      this.contatosEmail.push({ tipo: "email", value: "", optin: true });
    },
    addCelular() {
      this.contatosCelular.push({
        tipo: "celular",
        value: "",
        optin: true,
        options: { is_whatsapp: true },
      });
    },
    onClienteSelected(cliente) {
      this.clienteSearchModalOpened = false;

      const clientesIds = this.socios.map((socio) => socio.cliente.id);

      if (clientesIds.includes(cliente.id)) {
        this.$snack.warning("O cliente já foi adicionado como sócio!");
        return;
      }

      this.socios.push({
        cliente,
        porcentagem_societaria: 100,
      });

      if (this.socios.length == 1) {
        this.socio_administrador = cliente.id;
      }
    },
    fetchCep(cep) {
      if (cep.length != 8) return;
      viaCepRequest(cep).then((res) => {
        if (res.data.erro) return;
        this.form.endereco.logradouro = res.data.logradouro;
        this.form.endereco.cidade = res.data.localidade;
        this.form.endereco.bairro = res.data.bairro;
        this.form.endereco.ibge = res.data.ibge;
        this.form.endereco.uf = res.data.uf;
      });
    },
    fetchPlanos() {
      planosRequest()
        .then((res) => (this.planos = res.data.data))
        .catch((err) => (this.loadingPlansError = err.response.data.message));
    },
    plansType() {
      return this.planos.filter((plano) => plano.type == this.form.type);
    },
    async updateEmpresa() {
      this.loading = true;

      const promisesCertificado = this.$refs.arquivoCertificadoDigitalInput.map(
        async (input, index) => {
          if (input) {
            this.form.certificado_digital_cliente[index].arquivo =
              await input.submit();
          }
        }
      );

      const promisesComprovanteCertificado =
        this.$refs.arquivoComprovanteCertificadoraInput.map(
          async (input, index) => {
            if (input) {
              this.form.certificado_digital_cliente[index].comprovante =
                await input.submit();
            }
          }
        );
      await Promise.all([
        ...promisesCertificado,
        ...promisesComprovanteCertificado,
      ]);

      let validationMessages = this.form.certificado_digital_cliente
        .map((certificado) => {
          const messages = [];
          if (certificado.isWithCustomer === true) {
            return messages;
          }

          if (!certificado.validade) {
            messages.push("Está faltando preencher alguma validade");
          }

          if (!certificado.senha) {
            messages.push("Está faltando preencher alguma senha");
          }

          if (!certificado.senha) {
            messages.push("Está faltando preencher algum código");
          }

          if (!certificado.arquivo && !certificado.comprovante) {
            messages.push(
              "Está faltando anexar algum certificado ou comprovante."
            );
          }

          return messages;
        })
        .flat();
      validationMessages = [...new Set(validationMessages)];

      if (validationMessages.length) {
        validationMessages.forEach((message) => {
          this.$snack.warning(message);
        });

        this.loading = false;

        return;
      }

      EmpresaPosCadastroUpdate(this.empresa.id, this.form)
        .then(() => {
          this.$snack.success("Empresa atualizada com sucesso!");
          this.$emit("updated");
        })
        .catch((error) => {
          const errors = Object.values(error.response.data.errors);
          const message = errors
            .map((item) => item.map((error) => `<li>${error}</li>`).join(""))
            .join("");

          this.$buefy.dialog.alert({
            title: "Não foi possível atualizar a empresa",
            message: `<ul>${message}</ul>`,
            type: "is-danger",
            ariaRole: "alertdialog",
            ariaModal: true,
          });
        })
        .finally(() => (this.loading = false));
    },
    sociosCertificados() {
      this.empresa.socios.forEach((socio) => {
        let certificadoDigital = socio.certificado_digital;
        let arquivoCertificado;
        let arquivoComprovante;

        if (certificadoDigital && certificadoDigital.arquivos) {
          arquivoCertificado = certificadoDigital.arquivos.filter(
            (arquivo) => arquivo.nome === "certificado_digital"
          );
          arquivoComprovante = certificadoDigital.arquivos.filter(
            (arquivo) => arquivo.nome === "comprovante_certificado"
          );
        }

        this.form.certificado_digital_cliente.push({
          cliente_id: socio.id,
          cliente_nome: socio.nome_completo,
          cliente_cpf: socio.cpf,
          senha: certificadoDigital ? socio.certificado_digital.senha : null,
          validade: certificadoDigital
            ? socio.certificado_digital.validade
            : null,
          codigo: certificadoDigital ? socio.certificado_digital.codigo : null,
          arquivo: null,
          isWithCustomer: certificadoDigital
            ? !!socio.certificado_digital.isWithCustomer
            : false,
          arquivoCertificado:
            arquivoCertificado && arquivoCertificado.length
              ? arquivoCertificado[0]
              : null,
          arquivoComprovante:
            arquivoCertificado && arquivoComprovante.length
              ? arquivoComprovante[0]
              : null,
        });
      });
    },
    onRemoveAnexo() {
      this.$emit("updated");
    },
    validateCancel() {
      this.$buefy.dialog.confirm({
        title: "Cancelar Empresa",
        message: "Tem certeza que deseja cancelar essa empresa??",
        confirmText: "Sim",
        cancelText: "Não",
        type: "is-primary",
        hasIcon: true,
        onConfirm: () => this.cancelCompany(),
      });
    },
    cancelCompany() {
      this.loading = true;
      empresaCancelRequest(this.empresa.id)
        .then(() => {
          this.$snack.success("Empresa Cancelada com sucesso!");
          this.$emit("canceled");
        })
        .finally(() => (this.loading = false));
    },
    async listar_carteiras() {
      await this.$store.dispatch("carteira/listar_carteiras");
      let carteira_emp = this.empresa.carteiras;
      let data = [];
      for (let index = 0; index < carteira_emp.length; index++) {
        data.push(carteira_emp[index].id);
      }

      this.carteira = data;
    },
    carteias_save() {
      // this.$store.dispatch("carteira/listar_carteiras");

      this.form_carterira.empresa_id = this.empresa.id;
      this.form_carterira.carteiras = this.carteira;
      this.$store.dispatch(
        "carteira/vincular_empresa_carteiras",
        this.form_carterira
      );
      this.$snack.success(this.mensagem_alert.message);
    },
  },
  computed: {
    isContactsOk() {
      return (
        this.contatosEmail.filter(({ value, optin }) => {
          return value != "" && value != null && optin === true;
        }).length &&
        this.contatosCelular.filter(({ value, optin }) => {
          return value != "" && value != null && optin === true;
        }).length
      );
    },
    isEnderecoOk() {
      return (
        this.form.endereco.cep &&
        this.form.endereco.bairro &&
        this.form.endereco.cidade &&
        this.form.endereco.iptu &&
        this.form.endereco.logradouro &&
        this.form.endereco.numero &&
        this.form.endereco.uf
      );
    },
    isCompanyDataOk() {
      let razao_social = false;
      if (
        this.form.tipo === "abertura" &&
        this.form.razao_social.filter((item) => item != "").length >= 3
      ) {
        razao_social = true;
      } else if (
        this.form.tipo === "transferencia" &&
        this.form.razao_social.filter((item) => item != "").length === 1
      ) {
        razao_social = this.form.cnpj != "";
      }
      return (
        razao_social &&
        this.form.regime_tributario != "" &&
        this.form.tipo_societario != ""
      );
    },
    isContratoAssinado() {
      return this.empresa.contrato && this.empresa.contrato.signed_at;
    },
    lista_carteiras() {
      //  return this.$store.state.carteira.lista_carteiras;

      let carteira = Object.values(this.$store.state.carteira.lista_carteiras);
      let data = [];
      for (let i = 0; i < carteira.length; i++) {
        data.push({ id: carteira[i].id, label: carteira[i].nome });
      }
      return data;
    },
    message_alert() {
      return this.$store.state.carteira.mensagem_alert;
    },
  },
};
</script>
