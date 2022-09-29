<template>
<div>
    <b-loading />
    <div class="w-full flex justify-between items-center">
        <Lynx-Title text="Simulação de Impostos" />

    </div>

    <div class="w-full flex justify-start">
        <div class="flex flex-col " style="max-width:300px;">
            <treeselect :multiple="true" :options="lista_headers" placeholder="Selecione as colunas..." v-model="headers" />

        </div>
    </div>

    <div class="w-full flex justify-start">
        <form class="flex justify-between w-full" @submit.prevent="handleSubmit">
            <label class="flex flex-col pb-4">
                <Lynx-Label label="Faturamento mensal" />
                <Lynx-Input placeholder="Informe uma Faturamento" type="number" step="0.01" v-model="form.value" required />
            </label>
            <label class="flex flex-col pb-4">
                <Lynx-Label label="ISS" />
                <Lynx-Input placeholder="Informe o valor do ISS" v-model="form.iss" type="number" mim="1" max="5" step="0.01" required />
            </label>
            <label class="flex flex-col pb-4">
                <Lynx-Label label="Despesa mensal" />
                <Lynx-Input placeholder="Informe o valor das despesas" v-model="form.expense" type="number" step="0.01" required />
            </label>
            <label class="flex flex-col pb-4">
                <Lynx-Label label="Folha de pagamento mensal" />
                <Lynx-Input placeholder="Informe o valor da folha de pagamento" v-model="form.payroll" type="number" step="0.01" required />
            </label>
            <div class="self-end pb-4">
                <Lynx-Button text="Calcular" type="submit" size="small" :loading="loadingSubmit" />
            </div>
        </form>
        <div class="self-end pb-4 pl-2">
            <Lynx-Button color="neutral-800" text="Exportar" icon="Search" size="small" @click.native="exportSimulcao()" />
        </div>
    </div>

    <template>
        <b-table :data="data" :columns="columns" striped></b-table>
    </template>
</div>
</template>

<script>
import {
    simulationRequest
} from "@/services/requests/simulator";
import Treeselect from "@riophae/vue-treeselect";
export default {
    name: "show",
    components: {

        Treeselect
    },
    data() {
        return {
            data: this.data,
            loadingSubmit: false,
            form: {
                value: null,
                iss: null,
                payroll: null,
                expense: null,
            },
            columns: [{
                    field: "id",
                    width: "50",
                    numeric: false,
                },
                {
                    field: "anexo-3",
                    label: "Simples Nacional Anexo 3",
                    centered: true,
                },
                {
                    field: "anexo-5",
                    label: "Simples Nacional Anexo 5",
                },
                {
                    field: "clt",
                    label: "CLT",
                },
                {
                    field: "rpa",
                    label: "RPA",
                },
                {
                    field: "sem-reducao",
                    label: "Presumido Sem Redução",
                    color: "red",
                },
                {
                    field: "com-reducao",
                    label: "Presumido Com Redução",
                },

                {
                    field: "livro-caixa",
                    label: "Livro Caixa",
                },
            ],
            headers: [],
        };
    },
    computed: {
        lista_headers() {
            //  return this.$store.state.carteira.lista_carteiras;

            let column = Object.values(this.columns);
            let data = [];
            for (let i = 1; i < column.length; i++) {
                data.push({
                    id: column[i].field,
                    label: column[i].label
                });
            }
            return data;
        },
    },
    mounted() {},
    methods: {
        handleSubmit() {
            this.loadingSubmit = true;
            simulationRequest(this.form)
                .then((response) => {
                    this.data = response.data;
                    this.$snack.success(response.data.message);
                })
                .catch((error) => this.$snack.error(error.response.data.message))
                .finally(() => (this.loadingSubmit = false));
        },
        async exportSimulcao() {

            let data = [];
            let column = Object.values(this.columns);
            for (let j = 0; j < this.headers.length; j++) {

                for (let i = 1; i < column.length; i++) {

                    if (column[i].field == this.headers[j])
                        data.push({
                            id: column[i].field,
                            label: column[i].label
                        });
                }
            }
            console.log(data)
            let a = {
                campos: data,
                params: this.form
            }

            await this.$store.dispatch("simulador/exportaSimulacao", a);

        },
    },
};
</script>

<style scoped>
</style>
