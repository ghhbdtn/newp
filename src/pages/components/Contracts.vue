<template>
  <v-app>
  <v-content>
    <v-data-table  @click:row="editItem"
        :headers="headers"
        :items="contracts"
        :items-per-page="5"
        class="elevation-1"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item);" style="color: darkcyan">mdi-pencil</v-icon>
        <v-icon small text @click="deleteItem(item)" large style="color: darkred">
          mdi-delete
        </v-icon>
      </template>

    </v-data-table>

    <v-dialog v-model="dialogVisible"  @click.prevent persistent>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            color="primary"
            dark
            class="mb-2"
            v-bind="attrs"
            v-on="on"
        >Добавить</v-btn>
      </template>
      <v-card>
      <v-card-text>
      <v-form ref="form" v-model="valid" style="background-color: rgb(255,255,255)">
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                  v-model="EditedItem.name"
                  label="Название"
                  name="name"
                  style="text-decoration-color: #303234; text-align: start"
                  type="input"
                  placeholder="Название договора"
                  required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                  v-model="EditedItem.type"
                  :items="types"
                  label="Тип договора"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="EditedItem.plan" type="text" label="Плановые сроки"
                            v-mask="'##.##.#### - ##.##.####'" ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="EditedItem.fact" label="Фактические сроки"
                            v-mask="'##.##.#### - ##.##.####'"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="EditedItem.amount" label="Сумма"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-card-title class="headline">Добавить этап договора</v-card-title>
              <v-btn @click="stageAct = !stageAct"
                  class="mx-2"
                  fab
                  dark
                  color="indigo"
                  x-small>
                <v-icon dark>
                  mdi-plus
                </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-card-title class="headline">Добавить договор с контрагентом</v-card-title>
              <v-btn @click="counterpartyAct = !counterpartyAct"
                     class="mx-2"
                     fab
                     dark
                     color="indigo"
                     x-small>
                <v-icon dark>
                  mdi-plus
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-card-actions>
          <v-btn color="primary" @click="save">Сохранить</v-btn>
          <v-btn color="primary" @click="close">Отменить</v-btn>
          </v-card-actions>
        </v-container>
        <v-dialog v-model="stageAct" >
          <stage-form v-on:addStage="saveStage" v-on:cancel="closeStageForm"/>
        </v-dialog>
        <v-dialog v-model="counterpartyAct" >
          <counterparty-form v-on:addStage="saveCounterpartyContract" v-on:cancel="closeCounterpartyForm"/>
        </v-dialog>
        <v-card-title>Таблица этапов договора</v-card-title>
        <v-data-table v-if="EditedItem.stages.length > 1"
          :headers="stages_headers"
          :items="EditedItem.stages"
          :items-per-page="5"
          class="elevation-3">
        </v-data-table>
        <v-card-title>Таблица договоров с контр-агентами</v-card-title>
        <v-data-table v-if="EditedItem.counterparties.length > 1"
            :headers="countercontracts_headers"
            :items="EditedItem.counterparties"
            :items-per-page="5"
            class="elevation-3">
        </v-data-table>
      </v-form></v-card-text></v-card>
    </v-dialog>

  </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue, { defineComponent } from "vue";
import { required, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import StageForm from "./StageForm.vue";
import CounterpartyForm from "./CounterpartyForm.vue";
// Add validate method to Vue prototype
Vue.prototype.validate = function () {
  if (this.$refs.form) {
    this.$refs.form.validate();
  }
};

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Contracts",
  // eslint-disable-next-line vue/no-unused-components
  components: {CounterpartyForm, StageForm},

  data() {
    return {
      EditedItem: {
        name: "",
        type: "",
        plan: "",
        fact: "",
        amount: "",
        stage: {
          stageName:"",
          planDate: "",
          factDate: "",
          stageAmount: 0,
          planSum: 0,
          factSum: 0},
        stages: [{
          stageName:"",
          planDate: "",
          factDate: "",
          stageAmount: 0,
          planSum: 0,
          factSum: 0}],
        countercontract: {
          counterName: "",
          type: "",
          organization: "",
          counterAmount: 0,
          planCounterDate: "",
          factCounterDate: "",
        },
        counterparties: [{
          counterName: "",
          type: "",
          organization: "",
          counterAmount: 0,
          planCounterDate: "",
          factCounterDate: "",
        }],
      },
      defaultItem: {
        name: "",
        type: "",
        plan: "",
        fact: "",
        amount: "",
        stage: {
          stageName:"",
          planDate: "",
          factDate: "",
          stageAmount: 0,
          planSum: 0,
          factSum: 0},
        stages: [{
          stageName:"",
          planDate: "",
          factDate: "",
          stageAmount: 0,
          planSum: 0,
          factSum: 0}],
        countercontract: {
          counterName: "",
          type: "",
          organization: "",
          counterAmount: 0,
          planCounterDate: "",
          factCounterDate: "",
        },
        counterparties: [{
          counterName: "",
          type: "",
          organization: "",
          counterAmount: 0,
          planCounterDate: "",
          factCounterDate: "",
        }],
      },
      stageAct: false,
      counterpartyAct: false,
      dialogVisible: false,
      editedIndex: -1,
      nameRules: [
        required,
        minLength(3),
      ],
      valid: true,
      types: ["Закупка", "Поставка", "Работы"],
      headers: [
        {
          text: "Название",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Тип договора", align: "start", sortable: false, value: 'type'},
        { text: "Плановые сроки", align: "start", sortable: false, value: "plan" },
        { text: "Фактические сроки", align: "start", sortable: false, value:  "fact"},
        { text: "Сумма", align: "start", sortable: false, value: "amount"},
        // { text: "Этап", align: "start", sortable: false, value: "stage" },
        // {
        //   text: "Договоры с контр-агентами",
        //   align: "start",
        //   sortable: false,
        //   value: "counterparties",
        // },
        { text: "Действия", value: "actions", sortable: false},
      ],
      countercontracts_headers: [
        {text: "Название", value: "counterName"},
        {text: "Тип договора", value: "type"},
        {text: "Организация-контрагент", value: "organization"},
        {text: "Сумма договора", value: "counterAmount"},
        {text: "Плановые сроки начала и окончания", value: "planCounterDate"},
        {text: "Фактические сроки начала и окончания", value: "factCounterDate"},
      ],
      stages_headers: [
        {text: "Название", value: "stageName"},
        {text: "Плановые сроки", value: "planDate"},
        {text:  "Фактические сроки", value: "factDate"},
        {text: "Сумма этапа", value: "stageAmount"},
        {text: "Плановые расходы", value: "planSum"},
        {text: "Фактические расходы", value: "factSum"},
        { text: "Действия", value: "actions", sortable: false}
      ],
      contracts: [
        {
          name: "Договор 1",
          type: "Тип 1",
          plan: "01.01.2023 - 01.01.2024",
          fact: "01.01.2023 - 01.01.2024",
          amount: "1000000",
          stage: {
            stageName:"",
            planDate: "",
            factDate: "",
            stageAmount: 0,
            planSum: 0,
            factSum: 0},
          stages: [{
            stageName:"",
            planDate: "",
            factDate: "",
            stageAmount: 0,
            planSum: 0,
            factSum: 0}],
          countercontract: {
            counterName: "",
            type: "",
            organization: "",
            counterAmount: 0,
            planCounterDate: "",
            factCounterDate: "",
          },
          counterparties: [{
            counterName: "",
            type: "",
            organization: "",
            counterAmount: 0,
            planCounterDate: "",
            factCounterDate: "",
          }],
        },
        {
          name: "Договор 2",
          type: "Тип 2",
          plan: "01.02.2023 - 01.02.2024",
          fact: "01.02.2023 - 01.02.2024",
          amount: "2000000",
          stage: {
            stageName:"",
            planDate: "",
            factDate: "",
            stageAmount: "",
            planSum: "",
            factSum: ""},
          stages: [{
            stageName:"",
            planDate: "",
            factDate: "",
            stageAmount: 0,
            planSum: 0,
            factSum: 0}],
          countercontract: {
            counterName: "",
            type: "",
            organization: "",
            counterAmount: 0,
            planCounterDate: "",
            factCounterDate: "",
          },
          counterparties: [{
            counterName: "",
            type: "",
            organization: "",
            counterAmount: 0,
            planCounterDate: "",
            factCounterDate: "",
          }],
        },
        {
          name: "Договор 3",
          type: "Тип 3",
          plan: "01.03.2023 - 01.03.2024",
          fact: "01.03.2023 - 01.03.2024",
          amount: "3000000",
          stage: {
            stageName:"",
            planDate: "",
            factDate: "",
            stageAmount: 0,
            planSum: 0,
            factSum: 0},
          stages: [{
            stageName:"",
            planDate: "",
            factDate: "",
            stageAmount: 0,
            planSum: 0,
            factSum: 0}],
          countercontract: {
            counterName: "",
            type: "",
            organization: "",
            counterAmount: 0,
            planCounterDate: "",
            factCounterDate: "",
          },
          counterparties: [{
            counterName: "",
            type: "",
            organization: "",
            counterAmount: 0,
            planCounterDate: "",
            factCounterDate: "",
          }],
        },
      ],

    };
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
  },
  methods: {

    editItem (item: any) {
      this.editedIndex = this.contracts.indexOf(item)
      this.EditedItem = Object.assign({}, item)
      this.dialogVisible = true
    },

    deleteItem (item: any) {
      const index = this.contracts.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.contracts.splice(index, 1)
    },

    close () {
      this.dialogVisible = false
      this.$nextTick(() => {
        this.EditedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      if (this.editedIndex > -1 ) {
        Object.assign(this.contracts[this.editedIndex], this.EditedItem)
      } else {
        this.contracts.push(this.EditedItem)
      }

      this.stageAct = false;
      this.close()
    },
    saveStage(stage: any ) { // новый метод для добавления этапа в массив
      console.log("im here");
      this.EditedItem.stage = stage
      const stg = this.EditedItem.stage;
      this.EditedItem.stages.push(stg);
      this.stageAct = false;
    },
    closeStageForm() {
      this.stageAct = false;
    }
  },
  setup() {
    const v$ = useVuelidate();

    return { v$ };

  }
});
</script>

<style>

</style>
