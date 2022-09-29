<template>
  <form class="flex flex-wrap mt-8" @submit.prevent="updateEmpresa">
    <div
      class="w-full flex flex-wrap items-end border-2 border-neutral-400 rounded p-4 my-2"
      v-for="(value, index) in form.socios" :key="index">
      <h1>{{ value.nome_completo }} • {{ value.cpf }}</h1>

      <div class="w-full flex flex-wrap bg-neutral-400 p-4 rounded mt-4 items-start">
        <p class="text-neutral-600 w-full mb-4">Documentos pessoais</p>
        <Anexo
          v-if="value.arquivoRg"
          :anexo="value.arquivoRg"
          :is-deletabled="true"
          class=""
          @remove-anexo="onRemoveAnexo"
        />
        <input-file
          v-show="!value.arquivoRg"
          class="px-2"
          text="RG"
          ref="attachmentRgInput"
        />

        <Anexo
          v-if="value.arquivoCpf"
          :anexo="value.arquivoCpf"
          :is-deletabled="true"
          class="ml-2"
          @remove-anexo="onRemoveAnexo"
        />
        <InputFile
          v-show="!value.arquivoCpf"
          class="px-2"
          text="CPF"
          ref="attachmentCpfInput"
        />

        <Anexo
          v-if="value.arquivoRgCpf"
          :anexo="value.arquivoRgCpf"
          :is-deletabled="true"
          class="ml-2"
          @remove-anexo="onRemoveAnexo"
        />
        <InputFile
          v-show="!value.arquivoRgCpf"
          class="px-2"
          text="RG/CPF"
          ref="attachmentRgCpfInput"
        />

        <Anexo
          v-if="value.arquivoComprovanteResidencia"
          :anexo="value.arquivoComprovanteResidencia"
          :is-deletabled="true"
          class="ml-2"
          @remove-anexo="onRemoveAnexo"
        />
        <InputFile
          v-show="!value.arquivoComprovanteResidencia"
          class="px-2"
          text="Comprovante de residência"
          ref="attachmentComprovanteResidencia"
        />
      </div>

      <div class="w-full flex flex-wrap bg-neutral-400 p-4 rounded mt-4">
        <p class="text-neutral-600 w-full mb-4 flex justify-between">
          <span>CRM</span>
          <b-switch v-model="form.socios[index].hasCrm" :true-value="true" :false-value="false">Possui CRM</b-switch>
        </p>

        <label>
          <Lynx-Label :label="`${form.socios[index].hasCrm ? 'Data de emissão' : 'Previsão de emissão'}`"/>
          <input-date v-model="form.socios[index].crm.data_emissao"/>
        </label>

        <label class="ml-2" v-if="form.socios[index].hasCrm">
          <Lynx-Label label="Número"/>
          <Lynx-Input v-model="form.socios[index].crm.numero"/>
        </label>

        <label class="ml-2" v-if="form.socios[index].hasCrm">
          <Lynx-Label label="Senha"/>
          <Lynx-Input v-model="form.socios[index].crm.senha"/>
        </label>

        <label class="ml-2" v-if="form.socios[index].hasCrm">
          <Lynx-Label label="Estado"/>
          <Lynx-Input v-model="form.socios[index].crm.estado"/>
        </label>

        <div class="ml-2" v-show="form.socios[index].hasCrm">
          <Lynx-Label label="Arquivo"/>
          <input-file
            v-show="!value.crm.arquivo"
            ref="attachmentCrmArquivo"
          />
          <Anexo
            v-if="value.crm.arquivo"
            :anexo="value.crm.arquivo"
            :is-deletabled="true"
            class="ml-2"
            @remove-anexo="onRemoveAnexo"
          />
        </div>
      </div>

      <div class="w-full flex flex-wrap bg-neutral-400 p-4 rounded mt-4">
        <div class="text-neutral-600 w-full mb-4 flex justify-between">
          <span>IRPF</span>
                   <div class="mb-2 grid grid-cols-1 ">

          <b-switch class="mb-2" v-model="form.socios[index].hadIrpf">Teve declaração ano anterior</b-switch>
          <b-switch  v-model="viabilidade">Viabiliadade</b-switch>
</div>
       
        </div>
     

        <div v-show="form.socios[index].hadIrpf">
          <Lynx-Label label="Declaração"/>
          <input-file
            v-show="!value.irpf.arquivos.declaracao"
            ref="attachmentIrpfDeclaracao"
          />
          <Anexo
            v-if="value.irpf.arquivos.declaracao"
            :anexo="value.irpf.arquivos.declaracao"
            :is-deletabled="true"
            class="ml-2"
            @remove-anexo="onRemoveAnexo"
          />
        </div>

        <div v-show="form.socios[index].hadIrpf" class="ml-5">
          <Lynx-Label label="Recibo"/>
          <InputFile
            ref="attachmentIrpfRecibo"
            v-show="!value.irpf.arquivos.recibo"
          />
          <Anexo
            v-if="value.irpf.arquivos.recibo"
            :anexo="value.irpf.arquivos.recibo"
            :is-deletabled="true"
            class="ml-2"
            @remove-anexo="onRemoveAnexo"
          />
        </div>

        <label class="ml-5 flex items-end mb-2" v-if="form.socios[index].hadIrpf">
          <b-switch true-value="interno" false-value="externo" v-model="form.socios[index].irpf.realizacao">
            Realizado com a medb?
          </b-switch>
        </label>
      </div>
    </div>

    <div class="w-full flex justify-between mt-4">
      <Lynx-Button @click.native="validateCancel" type="button" text="Cancelar empresa" color="error-base"
                   :loading="loading"/>
      <Lynx-Button :disabled="!viabilidade" type="submit" text="Salvar" :loading="loading" :disable="loading"/>
    </div>

    <b-loading :active.sync="loading" :is-full-page="false"></b-loading>
  </form>
</template>

<script>

import {EmpresaPosCadastroUpdate} from '@/services/requests/empresaPosCadastro'
import InputFile from '@/components/helpers/InputFile'
import Anexo from "@/views/service-order/components/Anexo";
import {empresaCancelRequest} from "@/services/requests/empresas";
import InputDate from "@/components/helpers/InputDate";

export default {
  name: 'StepCertificado',
  components: {InputDate, Anexo, InputFile},
  props: ['empresa'],
  data() {
    return {
      loading: false,
      viabilidade:false,
      form: {
        socios: [],
      },
    }
  },
  mounted() {
    this.sociosDocuments()
  },
  methods: {
    async updateEmpresa() {
      this.loading = true

      const promisesIrpfRecibo = this.$refs.attachmentIrpfRecibo.map(async (input, index) => {
        if (input) {
          this.form.socios[index].irpf.attachmentRecibo = await input.submit()
        }
      });

      const promisesIrpfDeclaracao = this.$refs.attachmentIrpfDeclaracao.map(async (input, index) => {
        if (input) {
          this.form.socios[index].irpf.attachmentDeclaracao = await input.submit()
        }
      });

      const promisesCrm = this.$refs.attachmentCrmArquivo.map(async (input, index) => {
        if (input) {
          this.form.socios[index].crm.attachmentCrm = await input.submit()
        }
      });

      const promisesComprovanteResidencia = this.$refs.attachmentComprovanteResidencia.map(async (input, index) => {
        if (input) {
          this.form.socios[index].attachmentComprovanteResidencia = await input.submit()
        }
      });

      const promisesRg = this.$refs.attachmentRgInput.map(async (input, index) => {
        if (input) {
          this.form.socios[index].attachmentRg = await input.submit()
        }
      });

      const promisesCpf = this.$refs.attachmentCpfInput.map(async (input, index) => {
        if (input) {
          this.form.socios[index].attachmentCpf = await input.submit()
        }
      });

      const promisesRgCpf = this.$refs.attachmentRgCpfInput.map(async (input, index) => {
        if (input) {
          this.form.socios[index].attachmentRgCpf = await input.submit()
        }
      });

      await Promise.all([
        ...promisesRg,
        ...promisesCpf,
        ...promisesRgCpf,
        ...promisesIrpfRecibo,
        ...promisesIrpfDeclaracao,
        ...promisesCrm,
        ...promisesComprovanteResidencia,
      ])

      let validationMessages = this.form.socios.map(socio => {
        const messages = []

        if (!socio.attachmentRg) {
          //messages.push('Está faltando anexar algum documento.')
        }

        return messages
      }).flat()
      validationMessages = [...new Set(validationMessages)]

      if (validationMessages.length) {
        validationMessages.forEach(message => {
          this.$snack.warning(message)
        })

        this.loading = false

        return
      }

      let mapedSocios = this.form.socios.map(socio => {
        let newSocioObj = {...socio};
        if (!socio.hasCrm) {
          newSocioObj.crm.numero = null
          newSocioObj.crm.senha = null
          newSocioObj.crm.estado = null
        }
        return newSocioObj
      })
      let data = {
        socios: mapedSocios
      }

      EmpresaPosCadastroUpdate(this.empresa.id, data)
        .then(() => {
          this.$snack.success('Empresa atualizada com sucesso!')
          this.$emit('updated')
        })
        .catch(error => {
          const errors = Object.values(error.response.data.errors)
          const message = errors.map(item => item.map(error => `<li>${error}</li>`).join('')).join('')

          this.$buefy.dialog.alert({
            title: 'Não foi possível atualizar a empresa',
            message: `<ul>${message}</ul>`,
            type: 'is-danger',
            ariaRole: 'alertdialog',
            ariaModal: true
          })
        })
        .finally(() => this.loading = false)
    },
    sociosDocuments() {
      this.empresa.socios.forEach(socio => {
        let documents = socio;
        let arquivoRg;
        let arquivoCpf;
        let arquivoRgCpf;
        let arquivoComprovanteResidencia;
        let irpf = {
          realizacao: null,
          arquivos: {}
        };

        if (documents && documents.arquivos) {
          arquivoRg = documents.arquivos.filter(arquivo => arquivo.nome === 'rg')
          arquivoCpf = documents.arquivos.filter(arquivo => arquivo.nome === 'cpf')
          arquivoRgCpf = documents.arquivos.filter(arquivo => arquivo.nome === 'rg_cpf')
          arquivoComprovanteResidencia = documents.arquivos.filter(arquivo => arquivo.nome === 'comprovante_de_residencia')
        }

        if (socio.irpf) {
          irpf.realizacao = socio.irpf.realizacao
          if (socio.irpf.arquivos.length) {
            irpf.arquivos.declaracao = socio.irpf.arquivos.find(({nome}) => nome === 'declaracao')
            irpf.arquivos.recibo = socio.irpf.arquivos.find(({nome}) => nome === 'recibo')
          }
        }


        this.form.socios.push({
          id: socio.id,
          nome_completo: socio.nome_completo,
          cpf: socio.cpf,
          arquivoRg: arquivoRg && arquivoRg.length ? arquivoRg[0] : null,
          arquivoCpf: arquivoCpf && arquivoCpf.length ? arquivoCpf[0] : null,
          arquivoRgCpf: arquivoRgCpf && arquivoRgCpf.length ? arquivoRgCpf[0] : null,
          arquivoComprovanteResidencia: arquivoComprovanteResidencia && arquivoComprovanteResidencia.length ? arquivoComprovanteResidencia[0] : null,
          hasCrm: Boolean(socio.crm && socio.crm.numero),
          crm: socio.crm ?? {},
          hadIrpf: Boolean(irpf && irpf.arquivos.length),
          irpf: irpf
        });
      });
    },
    onRemoveAnexo() {
      this.$emit('updated')
    },
    validateCancel() {
      this.$buefy.dialog.confirm({
        title: 'Cancelar Empresa',
        message: 'Tem certeza que deseja cancelar essa empresa??',
        confirmText: 'Sim',
        cancelText: 'Não',
        type: 'is-primary',
        hasIcon: true,
        onConfirm: () => this.cancelCompany()
      })
    },
    cancelCompany() {
      this.loading = true;
      empresaCancelRequest(this.empresa.id)
        .then(() => {
          this.$snack.success('Empresa Cancelada com sucesso!')
          this.$emit('canceled')
        })
        .finally(() => (this.loading = false));
    }
  },
}
</script>
