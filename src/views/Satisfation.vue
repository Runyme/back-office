<template>
<div :class="agradecimentos == true ? 'cor-central':'cor-central2 '">
       <div class="cor-header flex items-center justify-center w-full py-4  ">
      <Logo class="h-8 text-white " />
    </div>
  <div v-if="agradecimentos == true" class="w-full telas-cel">

    <Lynx-Title text="Pesquisa de Satisfação" />
    <div
      class="
        w-full
        flex
        mt-8
        justift-between
        grid grid-cols-2
        gap-8
        items-center
      "
    ></div>
    <div
      class="w-full flex mt-4 grid grid-cols-2 md:grid-cols-1 gap-8 items-start"
    >
      <div>
        <span>
          Queremos saber o que você esta achando do nosso atendimento até agora.
        </span>
        <h1 class="text-neutral-900 pb-3 pt-3">
          Mas antes de tudo, você precisa saber:
        </h1>
        <p style="font-size: 20px" class="text-neutral-500 pb-3 pt-3">
          QUEM SERÁ AVALIADO?
        </p>
        <p style="font-size: 85%">
          <b>Nossos times de atendimento</b>
        </p>
        <span style="font-size: 85%">
          Cada um de nossos clientes têm à disposição um time com
          <b>5 profissionais.</b> Cada integrante do time é responsável por
          acompanhar determinada etapa da jornada de sucesso do cliente, da
          abertura da PJ à evolução da carreira como médico(a).
        </span>
        <p style="font-size: 20px" class="text-neutral-500 pb-3 pt-3">
          COMO SERÁ A AVALIAÇÃO?
        </p>
        <span style="font-size: 85%">
          Esta pesquisa é sigilosa e o time responsável pelo seu atendimento
          <b>não</b>
          terá acesso à sua avaliação. Porém, para que possamos identificar qual
          time está sendo avaliado, nós solicitamos o seu CPF. Mas fique
          tranquilo(a)! O CPF não será compartilhado e/ou utilizado para
          qualquer outra finalidade.
        </span>
        <p style="font-size: 20px" class="text-neutral-500 pb-3 pt-3">
          POR QUE RESPONDER À PESQUISA?
        </p>
        <span style="font-size: 85%">
          Nosso objetivo é garantir a melhoria contínua do nosso atendimento e o
          sucesso dos nossos clientes. Por isso, é de extrema importância que
          você responda a pesquisa e descreva com muita sinceridade a
          justificativa de sua nota.
        </span>
      </div>
      <div
        class="w-full flex grid grid-cols-1 md:grid-cols-1 gap-8 items-start"
      >
        <Card color="primary-500  " :header="{ textColor: 'white' }">
          <div class="p-6">
            <span
              style="font-size: 18px"
              class="text-neutral-1000 font-display font-semibold"
              >De 0 a 10, o quanto você indicaria a Medb aos amigos?
            </span>
      <div class="w-full flex justify-between items-start mt-3 mb-3">
                <Lynx-Button
                  class="button"
                  text="0"
                  icon-size="3"
                  size="small"
                  outlined="true"
                  :style="active == 0 ? 'border-color: black ; border-style: dotted;':''"
                  style="
                    color: #fff;
                    background: #ff7178;
                    border-color: #ff7178;
                    border-radius: 18px;
                  "
                  @click.native="buttonsHummor(0)"
                />
                <Lynx-Button
                  class="button"
                  text="1"
                  icon-size="3"
                  size="small"
                  outlined="true"
                  :style="active == 1 ? 'border-color: black ; border-style: dotted;':''"

                  style="
                    color: #fff;
                    background: #ff7178;
                    border-color: #ff7178;
                    border-radius: 18px;
                  "
                  @click.native="buttonsHummor(1)"
                />
                <Lynx-Button
                  class="button"
                  text="2"
                  icon-size="3"
                  size="small"
                  outlined="true"
                  :style="active == 2 ? 'border-color: black ; border-style: dotted;':''"

                  style="
                    color: #fff;
                    background: #ff7178;
                    border-color: #ff7178;
                    border-radius: 18px;
                  "
                  @click.native="buttonsHummor(2)"
                />
                <Lynx-Button
                  class="button"
                  text="3"
                  icon-size="3"
                  size="small"
                  outlined="true"
                  :style="active == 3 ? 'border-color: black ; border-style: dotted;':''"

                  style="
                    color: #fff;
                    background: #ff7178;
                    border-color: #ff7178;
                    border-radius: 18px;
                  "
                  @click.native="buttonsHummor(3)"
                />
                <Lynx-Button
                  class="button"
                  text="4"
                  icon-size="3"
                  size="small"
                  outlined="true"
                  :style="active == 4 ? 'border-color: black ; border-style: dotted;':''"

                  style="
                    color: #fff;
                    background: #ff7178;
                    border-color: #ff7178;
                    border-radius: 18px;
                  "
                  @click.native="buttonsHummor(4)"
                />
                <Lynx-Button
                  class="button"
                  text="5"
                  icon-size="3"
                  size="small"
                  outlined="true"
                  :style="active == 5 ? 'border-color: black ; border-style: dotted;':''"

                  style="
                    color: #fff;
                    background: #ff7178;
                    border-color: #ff7178;
                    border-radius: 18px;
                  "
                  @click.native="buttonsHummor(5)"
                />
                <Lynx-Button
                  class="button"
                  text="6"
                  icon-size="3"
                  size="small"
                  outlined="true"
                  :style="active == 6 ? 'border-color: black ; border-style: dotted;':''"

                  style="
                    color: #fff;
                    background: #ff7178;
                    border-color: #ff7178;
                    border-radius: 18px;
                  "
                  @click.native="buttonsHummor(6)"
                />
                <Lynx-Button
                  class="button"
                  text="7"
                  icon-size="3"
                  size="small"
                  outlined="true"
                  :style="active == 7 ? 'border-color: black ; border-style: dotted;':''"

                  style="
                    color: #fff;
                    background: #fdd64f;
                    border-color: #fdd64f;
                    border-radius: 18px;
                  "
                  @click.native="buttonsHummor(7)"
                />
                <Lynx-Button
                  class="button"
                  text="8"
                  icon-size="3"
                  size="small"
                  outlined="true"
                  :style="active == 8 ? 'border-color: black ; border-style: dotted;':''"

                  style="
                    color: #fff;
                    background: #fdd64f;
                    border-color: #fdd64f;
                    border-radius: 18px;
                  "
                  @click.native="buttonsHummor(8)"
                />
                <Lynx-Button
                  class="button"
                  text="9"
                  icon-size="3"
                  size="small"
                  outlined="true"
                  :style="active == 9 ? 'border-color: black ; border-style: dotted;':''"

                  style="
                    color: #fff;
                    background: #80db81;
                    border-color: #80db81;
                    border-radius: 18px;
                  "
                  @click.native="buttonsHummor(9)"
                />
                <Lynx-Button
                  class="button"
                  text="10"
                  icon-size="3"
                  size="small"
                  outlined="true"
                  :style="active == 10 ? 'border-color: black ; border-style: dotted;':''"

                  style="
                    color: #fff;
                    background: #80db81;
                    border-color: #80db81;
                    border-radius: 18px;
                  "
                  @click.native="buttonsHummor(10)"
                />
              </div>
            <form @submit.prevent="salvar">
        

              <span>CPF</span>
              <Lynx-Input
                required
                placeholder="Insira o seu CPF"
                v-model="form.cpf"
                class="mt-2 mb-3"
              />

              <span>Justificativa</span>
              <Lynx-Textarea
                required
                placeholder="Descreva aqui o que motivou a sua nota"
                v-model="form.comentario"
                class="mt-2"
              />

              <Lynx-Button
                class="mb-1 mt-2"
                icon-size="3"
                size="small"
                outlined="true"
              >
                salvar
                <b-icon class="mr-1" icon="plus"></b-icon>
              </Lynx-Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  </div>
  <div v-show="agradecimentos ==false" class="w-full telas-cel">
    
    <p class="text-center texto-agradecimento " > Agradecemos sua colaboração</p>
    <p class="text-center texto-agradecimento2 " > Na medb, todas as suas críticas e sugestões serão<br> bem-vindas. Até breve!</p>

  </div>
  </div>
  
</template>


<script>
import Card from "@/components/helpers/Card";
import LynxTextarea from "@/components/helpers/Textarea";
import Logo from "@/components/svgs/Logo";

export default {
  components: { Card, LynxTextarea, Logo },

  data() {
    return {
      form: { satisfacao: 5, cpf: null, comentario: "" },
      active:null,
      agradecimentos:true
    };
  },
  computed: {
    //  lista_campos() {
    //     return this.$store.state.simulador.cliente_linker;
    //   },
    mensagem_alert() {
      return this.$store.state.simulador.mensagem_alert;
    },
  },
  methods: {
    buttonsHummor(val) {
      this.form.satisfacao = val;
      this.active = val
    },
    async salvar() {
      await this.$store.dispatch("simulador/satisfacao_create", this.form);
      this.$snack.success(this.mensagem_alert.message);
      this.agradecimentos = false;
      // this.$snack.success("você nos avaliou com " + val);

    },
  },
};
</script>


<style scoped>
@media (max-width: 1080px) {
  .button {
    font-family: "Poiret One", cursive;
    font-size: 12px;
    padding: 5px 5px 5px 5px;
    margin-right: 3px;
  }
}
@media (max-width: 500px) {
  .telas-cel {
    padding: 10px;
  }
}
@media (min-width: 1080px) {
  .telas-cel {
    padding: 50px;
  }

}
.cor-central{
    background: rgb(217, 252, 255);
    height: 100%;

}
.cor-central2{
    background:rgb(121, 207, 213);
    height: 100%;

}
  .cor-header {
  width: 100%;
  
  background: rgb(121, 207, 213);
}

.texto-agradecimento{
  margin-top:150px ;
font-size:20px;
color:rgb(51, 155, 162);
font-weight:900;
}

.texto-agradecimento2{
  margin-top:20px ;

font-size:17px;
color:rgb(51, 155, 162);
font-weight:600;
}
</style>