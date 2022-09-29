<template>
  <div class="w-full p-10 3">
    <Lynx-Title text="Calculadora de Plantões" />
    <div class="w-full flex mt-8 grid grid-cols-md-2 md:grid-cols-1 gap-8">
      <p>
        Descubra o valor líquido (livre de impostos) que você receberá com os
        plantões.
      </p>

      <h1 style="font-size: 20px; font-weight: 900" class="text-center">
        Quanto você irá receber:
      </h1>
    </div>
    <div
      class="w-full flex mt-8 grid grid-cols-2 md:grid-cols-1 gap-8 items-start"
    >
      <Card color="primary-500" :header="{ textColor: 'white' }">
        <div class="text-center pt-8 pb-5 mx-auto">
          <span
            style="font-size: 25px"
            class="text-neutral-800 font-display font-semibold"
            >Quantos Plantões <br />
            você pretende fazer?
          </span>

          <div class="w-full flex justify-between items-start">
            <label class="w-1/4"></label>

            <div class="w-full">
              <b-slider
                @input="cal(value)"
                :min="1"
                :max="60"
                v-model="value"
              ></b-slider>
            </div>

            <label class="w-1/4"></label>
          </div>
          <span
            style="font-size: 12px"
            class="text-neutral-700 font-display font-semibold"
            >Para o cálculo consideramos um plantão de <b>12 horas</b> e valor
            de hora a <b>R$100,00</b>(média nacional), Ou seja, R$1200,00 por
            plantão?:
          </span>
        </div>
      </Card>

      <div
        class="w-full flex grid grid-cols-2 md:grid-cols-1 gap-8 items-start"
      >
        <Card color="primary-500" :header="{ textColor: 'white' }">
          <div class="text-center pt-8 pb-5 mx-auto">
            <span
              style="font-size: 18px"
              class="text-neutral-800 font-display font-semibold"
              >Pessoa Física
            </span>

            <div class="text-left pt-8 p-3 mx-auto">
              <label class="w-full flex flex-col"
                >Faturamento Bruto {{ faturamento }}
              </label>

              <label class="w-full flex flex-col"
                >Desconto Impostos {{ impostoPf }}</label
              >

              <label class="w-full flex items-center"
                >Total Líquido <Lynx-Input class="ml-3" v-model="totalPf" />
              </label>
            </div>
          </div>
        </Card>

        <Card color="primary-500" :header="{ textColor: 'white' }">
          <div class="text-center pt-8 pb-5 mx-auto">
            <span
              style="font-size: 18px"
              class="text-neutral-800 font-display font-semibold"
              >Pessoa Jurídica
            </span>

            <div class="text-left p-3 mx-auto">
              <label class="w-full flex flex-col"
                >Faturamento Bruto {{ faturamento }}
              </label>
              <label class="w-full flex flex-col"
                >Desconto Impostos {{ impostoPj }}</label
              >

              <label class="w-full flex items-center"
                >Total Líquido <Lynx-Input class="ml-3" v-model="totalPj" />
              </label>

              <label class="w-full"></label>
            </div>
          </div>
        </Card>
      </div>
      <div class="w-full flex grid grid-cols-1 gap-8 items-start"></div>

      <div class="w-full flex grid grid-cols-2 gap-8 items-start">
        <div class="flex-col flex">
          <h1>Resultado:</h1>
          <span
            style="font-size: 12px"
            class="text-neutral-700 font-display font-semibold"
            >Você Economizará tabalhando como Pj :
          </span>
        </div>
        <div class="flex-col flex">
          <h1>Economia:</h1>
          <label class="w-full flex items-center">
            <Lynx-Input v-model="totalEconomia" />
          </label>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import Card from "@/components/helpers/Card";
import { moeda } from "@/utils/helpers";

export default {
  components: { Card },

  data() {
    return {
      value: 5,
      totalPf: 0,
      totalPj: 0,

      brutoPf: 0,
      impostoPf: 0,
      brutoPj: 0,
      impostoPj: 0,
      totalEconomia: 0,
    };
  },
  computed: {
    faturamento() {
      return moeda(this.value * 1200);
    },
    simulacao() {
      return this.$store.state.simulador.simulacao;
    },
  },
  methods: {
    async cal(val) {
      await new Promise((r) => setTimeout(() => r(), 1000));
      if (val == this.value)
        await this.$store.dispatch("simulador/simulation", {
          expense: "0",
          iss: "3",
          payroll: "0",
          value: this.value * 1200,
        });
      let sim = [this.simulacao[10]];
      let sim2 = [this.simulacao[13]];

      this.impostoPf =
        parseFloat(sim[0]["clt"].replace(".", "").replace(",", ".")) / 12;

      var impCondion = [
        sim[0]["anexo-3"].replace(".", "").replace(",", "."),

        sim[0]["anexo-5"].replace(".", "").replace(",", "."),
        
        sim[0]["sem-reducao"].replace(".", "").replace(",", "."),
      ];
     var min = impCondion.map(Number).reduce(function(a, b) {
  return Math.min(a, b);
});
console.log(min)
  this.impostoPj = min / 12;

      this.totalPf = sim2[0]["clt"].replace(".", "");
      this.totalPj = sim2[0]["anexo-3"].replace(".", "");

      // console.log(this.impostoPf);
 
     
      this.totalEconomia = moeda(
        parseFloat(
          this.totalPj.replace(",", ".") - this.totalPf.replace(",", ".")
        )
      );

      this.totalPf = moeda(parseFloat(this.totalPf.replace(",", ".")));

      this.impostoPf = moeda(this.impostoPf);

      this.totalPj = moeda(this.totalPj.replace(",", "."));
      this.impostoPj = moeda(this.impostoPj);
    },
  },
};
</script>