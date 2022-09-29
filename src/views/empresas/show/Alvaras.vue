<template>
  <div>
    <b-collapse :open="true" aria-id="empresainfo-aria">
      <div
        class="flex items-center my-2"
        slot="trigger"
        aria-controls="empresainfo-aria"
      >
        <Icon-Document class="text-primary-600" size="8" />
        <p class="pl-4 font-display text-xl font-bold">Alvaras</p>
      </div>

      <b-tag type="is-warning" v-if="getEmpresa.type != 'normal'">{{
        getEmpresa.type
      }}</b-tag>

      <div class="flex items-center py-1">
        <div class="flex items-center">
          <span class="pr-2 font-bold">Inscrição Municipal:</span>
        </div>
        <span
          v-text="getEmpresa.inscricao_municipal"
          v-if="getEmpresa.inscricao_municipal"
        />

        <b-tooltip
          label="copiado"
          :active="copiado === getEmpresa.inscricao_municipal"
          always
        >
          <button
            class="ml-2"
            @click="copyText(getEmpresa.inscricao_municipal)"
          >
            <b-icon icon="content-copy" size="is-small"></b-icon>
          </button>
        </b-tooltip>
      </div>
      <div class="py-1 flex items-center" v-if="getEmpresa.alvara">
        <div
          class="py-1 flex items-center"
          v-if="getEmpresa.alvara.definitivo == 1"
        >
          Alvara Definitivo
        </div>
        <div class="py-1 flex items-center" v-else>
          <span class="mr-1 font-bold">Venc. Alvará:</span>
          <span
            class="text-neutral-100 py-0 px-1 rounded"
            :class="
              getDateDifferenceTheme(
                getDateDifferenceFrom(getEmpresa.alvara.data_vencimento)
              )
            "
            v-text="
              moment(getEmpresa.alvara.data_vencimento).format('DD/MM/YYYY')
            "
          >
          </span>
          <a
            href="#"
            class="ml-4 bg-primary-600 rounded-full p-2"
            @click.prevent="openEditAlvaraModal(getEmpresa.alvara)"
          >
            <Icon-Edit class="text-neutral-100" size="3" />
          </a>
        </div>
      </div>

      <div class="py-1 flex items-center" v-else>
        <span class="pr-2 font-bold">Venc. alvara:</span>
        <a
          href="#"
          class="ml-4 bg-primary-600 rounded-full p-2"
          @click.prevent="openEditAlvaraModal(getEmpresa.alvara)"
        >
          <Icon-Plus class="text-neutral-100" size="3" />
        </a>
      </div>
      <div class="py-1 flex items-center" v-if="getEmpresa.alvara_sanitario">
        <span class="pr-2 font-bold">Venc. Alvará Sanitário:</span>
        <span
          class="text-neutral-100 py-0 px-1 rounded"
          :class="
            getDateDifferenceTheme(
              getDateDifferenceFrom(getEmpresa.alvara_sanitario.data_vencimento)
            )
          "
          v-text="
            moment(getEmpresa.alvara_sanitario.data_vencimento).format(
              'DD/MM/YYYY'
            )
          "
        >
        </span>

        <a
          href="#"
          class="ml-4 bg-primary-600 rounded-full p-2"
          @click.prevent="openEditAlvaraSanModal(getEmpresa.alvara_sanitario)"
        >
          <Icon-Edit class="text-neutral-100" size="3" />
        </a>
      </div>
      <div class="py-1 flex items-center" v-else>
        <span class="pr-2 font-bold">Venc. Alvará Sanitário:</span>
        <a
          href="#"
          class="ml-4 bg-primary-600 rounded-full p-2"
          @click.prevent="openEditAlvaraSanModal(getEmpresa.alvara_sanitario)"
        >
          <Icon-Plus class="text-neutral-100" size="3" />
        </a>
      </div>
      <div class="py-1 flex items-center" v-if="getEmpresa.bombeiro">
        <span class="pr-2 font-bold">Venc. Bombeiro:</span>
        <span
          class="text-neutral-100 py-0 px-1 rounded"
          :class="
            getDateDifferenceTheme(
              getDateDifferenceFrom(getEmpresa.bombeiro.data_vencimento)
            )
          "
          v-text="
            moment(getEmpresa.bombeiro.data_vencimento).format('DD/MM/YYYY')
          "
        >
        </span>

        <a
          href="#"
          class="ml-4 bg-primary-600 rounded-full p-2"
          @click.prevent="openEditBombeiroModal(getEmpresa.bombeiro)"
        >
          <Icon-Edit class="text-neutral-100" size="3" />
        </a>
      </div>

      <div class="py-1 flex items-center" v-else>
        <span class="pr-2 font-bold">Venc. Bombeiro:</span>
        <a
          href="#"
          class="ml-4 bg-primary-600 rounded-full p-2"
          @click.prevent="openEditBombeiroModal(getEmpresa.bombeiro)"
        >
          <Icon-Plus class="text-neutral-100" size="3" />
        </a>
      </div>

      <!-- vencimento coworking -->
      <div class="py-1 flex items-center" v-if="getEmpresa.coworking">
        <span class="pr-2 font-bold">Venc. coworking:</span>
        <span
          class="text-neutral-100 py-0 px-1 rounded"
          :class="
            getDateDifferenceTheme(
              getDateDifferenceFrom(getEmpresa.coworking.data_vencimento)
            )
          "
          v-text="
            moment(getEmpresa.bombeiro.data_vencimento).format('DD/MM/YYYY')
          "
        >
        </span>
        <a
          href="#"
          class="ml-4 bg-primary-600 rounded-full p-2"
          @click.prevent="openEditCoworkingModal(getEmpresa.coworking)"
        >
          <Icon-Edit class="text-neutral-100" size="3" />
        </a>
      </div>

      <div class="py-1 flex items-center" v-else>
        <span class="pr-2 font-bold">Venc. Coworking:</span>
        <a
          href="#"
          class="ml-4 bg-primary-600 rounded-full p-2"
          @click.prevent="openEditCoworkingModal(getEmpresa.coworking)"
        >
          <Icon-Plus class="text-neutral-100" size="3" />
        </a>
      </div>
    </b-collapse>

    <b-modal
      :active.sync="editAlvaraModal"
      v-if="editAlvaraModal"
      width="500px"
    >
      <Edit-Alvara
        :alvara="alvara"
        :empresa-id="getEmpresa.id"
        @edit-alvara="onEditAlvara"
      />
    </b-modal>
    <b-modal
      :active.sync="editAlvaraSanModal"
      v-if="editAlvaraSanModal"
      width="600px"
    >
      <Edit-Alvara-Sanitario
        :alvaraSan="alvaraSan"
        :empresa-id="getEmpresa.id"
        @edit-alvara="onEditAlvara"
      />
    </b-modal>
    <b-modal
      :active.sync="editBombeiroModal"
      v-if="editBombeiroModal"
      width="500px"
    >
      <Edit-Bombeiro
        :bombeiro="bombeiro"
        :empresa-id="getEmpresa.id"
        @edit-alvara="onEditAlvara"
      />
    </b-modal>
    <b-modal
      :active.sync="editCoworkingModal"
      v-if="editCoworkingModal"
      width="500px"
    >
      <Edit-Bombeiro
        :coworking="coworking"
        :empresa-id="getEmpresa.id"
        @edit-alvara="onEditAlvara"
      />
    </b-modal>

    <b-modal :active.sync="showRegimeHistoryModal">
      <RegimeTributarioHistory :company-id="getEmpresa.id" />
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { formatEnToBr } from "@/utils/momentHelpers";
import moment from "moment";
import EditAlvara from "@/views/empresas/alvaras/Edit";
import EditAlvaraSanitario from "@/views/empresas/alvaraSanitario/Edit";
import EditBombeiro from "@/views/empresas/bombeiro/Edit";
import RegimeTributarioHistory from "@/views/empresas/show/RegimeTributarioHistory";

export default {
  name: "EmpresaShowInfos",
  components: {
    RegimeTributarioHistory,
    EditAlvara,
    EditAlvaraSanitario,
    EditBombeiro,
  },
  data() {
    return {
      showRegimeHistoryModal: false,
      copiado: false,
      editAlvaraModal: false,
      editAlvaraSanModal: false,
      editBombeiroModal: false,
      editCoworkingModal: false,

      alvara: {},
      alvaraSan: {},
      bombeiro: {},
    };
  },
  computed: {
    ...mapGetters(["getEmpresa"]),
    regimeTributario() {
      if (!this.getEmpresa.regime_tributario) {
        return null;
      }

      if (
        this.getEmpresa.regime_tributario === "SN" &&
        this.getEmpresa.data_sn
      ) {
        let date_simples = new Date(
          this.getEmpresa.data_sn
        ).toLocaleDateString();
        return `Simples N. - ${date_simples}`;
      }

      return this.getEmpresa.regime_tributario;
    },
  },
  methods: {
    copyText(value) {
      this.$copyText(value);
      this.copiado = value;
      setTimeout(() => (this.copiado = false), 1500);
    },
    formatEnToBr,
    moment,
    ...mapActions(["setEmpresa"]),
    getDateDifferenceFrom(val) {
      const momentDate = moment(val);
      const now = moment();
      return momentDate.diff(now, "days");
    },
    getDateDifferenceTheme(val) {
      if (val < 0) return "bg-neutral-900";
      if (val < 30) return "bg-error-base";
      if (val < 60) return "bg-warning-base";
      return "bg-info-base";
    },
    openEditAlvaraModal(alvara) {
      this.alvara = alvara;
      this.editAlvaraModal = true;
    },
    openEditAlvaraSanModal(alvara) {
      this.alvaraSan = alvara;
      this.editAlvaraSanModal = true;
    },
    openEditBombeiroModal(alvara) {
      this.bombeiro = alvara;
      this.editBombeiroModal = true;
    },
    openEditCoworkingModal(alvara) {
      this.coworking = alvara;
      this.editBombeiroModal = true;
    },
    onEditAlvara() {
      this.editAlvaraModal = false;
      this.$router.push({ name: "empresas.index" });
    },
  },
};
</script>
