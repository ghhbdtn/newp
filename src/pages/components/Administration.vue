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
                    <v-select
                        v-model="EditedItem.user.fullName"
                        :items="users"
                        label="Ответственный пользователь"
                    ></v-select>
                  </v-col>
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
                    <v-card-text>Добавить этап договора</v-card-text>
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
                    <v-card-text>Добавить договор с контрагентом</v-card-text>
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
                  <v-btn color="red" @click="close">Отменить</v-btn>
                </v-card-actions>
              </v-container>
              <v-dialog v-model="stageAct" @click.prevent persistent>
                <stage-form v-on:addStage="saveStage" v-on:cancel="closeStageForm"/>
              </v-dialog>
              <v-dialog v-model="counterpartyAct">
                <counterparty-form  v-on:saveCountercontract="saveCounter" v-on:counterCancel="closeCounterForm"/>
              </v-dialog>
              <v-card-title>Таблица этапов договора</v-card-title>
              <v-data-table v-if="EditedItem.stages.length > 0"
                            :headers="stages_headers"
                            :items="EditedItem.stages"
                            :items-per-page="5"
                            class="elevation-3">
                <template v-slot:[`item.actions`]="{ item }">
                  <v-icon small class="mr-2" @click="editStageItem(item);" style="color: darkcyan">mdi-pencil</v-icon>
                  <v-icon small text @click="deleteStageItem(item)" large style="color: darkred">
                    mdi-delete
                  </v-icon>
                </template>
              </v-data-table>
              <v-card-title>Таблица договоров с контрагентами</v-card-title>
              <v-data-table v-if="EditedItem.counterparties.length > 0"
                            :headers="countercontracts_headers"
                            :items="EditedItem.counterparties"
                            :items-per-page="5"
                            class="elevation-3">
                <template v-slot:[`item.actions`]="{ item }">
                  <v-icon small class="mr-2" @click="editCounterItem(item);" style="color: darkcyan">mdi-pencil</v-icon>
                  <v-icon small text @click="deleteCounterItem(item)" large style="color: darkred">
                    mdi-delete
                  </v-icon>
                </template>
              </v-data-table>
            </v-form>
          </v-card-text>
        </v-card>
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
interface Stage {
  stageName: string,
  planDate: string,
  factDate: string,
  stageAmount: number,
  planSum: number,
  factSum: number,
}

interface User {
  fullName: string,
  username: string,
}

interface Countercontract {
  countercontractName: string,
  countercontractType: string,
  counterParty: string,
  counterPlan: string,
  counterFact: string,
  counterAmount: number,
}
export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Administration",

  components: {CounterpartyForm, StageForm},

  data() {
    return {
      EditedItem: {
        user: {
          fullName: "",
          username: "",
        } as User,
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
        stages: [] as Stage[],
        countercontract: {
          countercontractName: "",
          countercontractType: "",
          counterParty: "",
          counterPlan: "",
          counterFact: "",
          counterAmount: 0,
        },
        counterparties: [] as Countercontract[],
      },
      defaultItem: {
        user: {
          fullName: "",
          username: "",
        } as User,
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
        stages: [] as Stage[],
        countercontract: {
          countercontractName: "",
          countercontractType: "",
          counterParty: "",
          counterPlan: "",
          counterFact: "",
          counterAmount: 0,
        },
        counterparties: [] as Countercontract[],
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
        { text: "Ответственный пользователь", align: "start", sortable: false, value: 'user.fullName'},
        {text: "Название", align: "start", sortable: false, value: "name",},
        { text: "Тип договора", align: "start", sortable: false, value: 'type'},
        { text: "Плановые сроки", align: "start", sortable: false, value: "plan" },
        { text: "Фактические сроки", align: "start", sortable: false, value:  "fact"},
        { text: "Сумма", align: "start", sortable: false, value: "amount"},
        { text: "Действия", value: "actions", sortable: false},
      ],
      countercontracts_headers: [
        {text: "Название", value: "countercontractName"},
        {text: "Тип договора", value: "countercontractType"},
        {text: "Организация-контрагент", value: "counterParty"},
        {text: "Плановые сроки начала и окончания", value: "counterPlan"},
        {text: "Фактические сроки начала и окончания", value: "counterFact"},
        {text: "Сумма договора", value: "counterAmount"},
        {text: "Действия", value: "actions", sortable: false},
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
      users: [] as User[],
      contracts: [
        {
          user: {
            fullName: "Пупсиков Пупсик Пупсикович",
            username: "pups1",
          } as User,
          name: "Договор 1",
          type: "Тип 1",
          plan: "01.01.2023 - 01.01.2024",
          fact: "01.01.2023 - 01.01.2024",
          amount: "1000000",
          stage: {
            stageName: "",
            planDate: "",
            factDate: "",
            stageAmount: 0,
            planSum: 0,
            factSum: 0
          },
          stages: [{
            stageName: "",
            planDate: "",
            factDate: "",
            stageAmount: 0,
            planSum: 0,
            factSum: 0
          }],
          countercontract: {
            countercontractName: "",
            countercontractType: "",
            counterParty: "",
            counterPlan: "",
            counterFact: "",
            counterAmount: 0,
          },
          counterparties: [{
            countercontractName: "",
            countercontractType: "",
            counterParty: "",
            counterPlan: "",
            counterFact: "",
            counterAmount: 0,
          }],
        },
        {
          user: {
            fullName: "Пупсиков Пупсик Пупсикович",
            username: "pups2",
          } as User,
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
            countercontractName: "",
            countercontractType: "",
            counterParty: "",
            counterPlan: "",
            counterFact: "",
            counterAmount: 0,
          },
          counterparties: [{
            countercontractName: "",
            countercontractType: "",
            counterParty: "",
            counterPlan: "",
            counterFact: "",
            counterAmount: 0,
          }],
        },
        {
          user: {
            fullName: "Пупсиков Пупсик Пупсикович",
            username: "pups3",
          } as User,
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
            countercontractName: "",
            countercontractType: "",
            counterParty: "",
            counterPlan: "",
            counterFact: "",
            counterAmount: 0,
          },
          counterparties: [{
            countercontractName: "",
            countercontractType: "",
            counterParty: "",
            counterPlan: "",
            counterFact: "",
            counterAmount: 0,
          }]
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
    editStageItem(item: any) {
      this.EditedItem.stage = Object.assign({}, item);
      this.stageAct = true
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
      this.EditedItem.stage = stage
      const stg = this.EditedItem.stage;
      this.EditedItem.stages.push(stg);
      this.stageAct = false;
    },
    closeStageForm() {
      this.stageAct = false;

    },
    saveCounter(contract: any) {
      this.EditedItem.countercontract = contract;
      const cct = this.EditedItem.countercontract;
      this.EditedItem.counterparties.push(cct);
      this.counterpartyAct = false;
    },
    closeCounterForm() {
      this.counterpartyAct = false;
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

