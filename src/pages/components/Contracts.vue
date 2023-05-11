<template>
  <v-app>
  <v-content>
    <v-data-table  @click:row="editItem"
        :headers="headers"
        :items="contracts"
        :items-per-page="10"
        class="elevation-1"
    >
      <template v-slot:[`item.actions`]="{ item }" v-if="isAdmin1">
        <v-icon small class="mr-2" @click="editItem(item);" style="color: darkcyan">mdi-pencil</v-icon>
        <v-icon small text @click="deleteItem(item)" large style="color: darkred">
          mdi-delete
        </v-icon>
      </template>

    </v-data-table>

    <v-dialog v-model="dialogVisible"  @click.prevent persistent>
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-if="isAdmin1"
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
        <v-card-title>{{this.isEdit ? "Редактировать договор": "Добавить договор"}}</v-card-title>
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
                  aria-required="true"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                  v-model="EditedItem.type"
                  :items="types"
                  label="Тип договора"
                  aria-required="true"></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="EditedItem.plannedDate" type="text" label="Плановые сроки"
                            v-mask="'##.##.#### - ##.##.####'"
              placeholder="ГГГГ.ММ.ДД-ГГГГ.ММ.ДД"
                            aria-required="true"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="EditedItem.actualDate" label="Фактические сроки"
                            v-mask="'##.##.#### - ##.##.####'"
                            placeholder="ГГГГ.ММ.ДД-ГГГГ.ММ.ДД"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="EditedItem.amount" label="Сумма"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4" v-if="isAdmin1">
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
            <v-col cols="12" sm="6" md="4" v-if="isAdmin1">
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
          <v-btn color="primary" @click="save" v-if="isAdmin1">Сохранить</v-btn>
          <v-btn color="red" @click="close">{{isAdmin1 ? `Отменить` : `Закрыть`}}</v-btn>
          </v-card-actions>
        </v-container>
        <v-dialog v-model="stageAct" @click.prevent persistent>
          <stage-form v-on:addStage="saveStage" v-on:cancel="closeStageForm"/>
        </v-dialog>
        <v-dialog v-model="counterpartyAct">
          <counterparty-form  v-on:saveCountercontract="saveCounter" v-on:counterCancel="closeCounterForm"/>
        </v-dialog>
        <v-card-title>Таблица этапов договора</v-card-title>
        <v-data-table v-if="contractStages.length > 0"
          :headers="stages_headers"
          :items="contractStages"
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
        <v-data-table v-if="counterparties.length > 0"
            :headers="countercontracts_headers"
            :items="counterparties"
            :items-per-page="5"
            class="elevation-3">
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editCounterItem(item);" style="color: darkcyan">mdi-pencil</v-icon>
            <v-icon small text @click="deleteCounterItem(item)" large style="color: darkred">
              mdi-delete
            </v-icon>
          </template>
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
interface Contract {
  id?: number,
  name: string,
  type: string,
  amount: number,
  plannedDate: string,
  actualDate: string
}
interface Stage {
  id?: number,
  name: string,
  amount: number,
  plannedDate: string,
  actualDate: string,
  actualMaterialCosts: number,
  plannedMaterialCosts: number,
  actualSalaryExpenses: number,
  plannedSalaryExpenses: number
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
  name: "Contracts",

  components: {CounterpartyForm, StageForm},

  data() {
    return {
      EditedItem: {
        id: -1,
        name: "",
        type: "",
        plannedDate: "",
        actualDate: "",
        amount: 0,
        stage: {
          name: "",
          amount: 0,
          plannedDate: "",
          actualDate: "",
          actualMaterialCosts: 0,
          plannedMaterialCosts: 0,
          actualSalaryExpenses: 0,
          plannedSalaryExpenses: 0},
        countercontract: {
          countercontractName: "",
          countercontractType: "",
          counterParty: "",
          counterPlan: "",
          counterFact: "",
          counterAmount: 0,
        },
      },
      contractStages: [] as Stage[],
      counterparties: [] as Countercontract[],
      defaultItem: {
        id: -1,
        name: "",
        type: "",
        plannedDate: "",
        actualDate: "",
        amount: 0,
        stage: {
          name: "",
          amount: 0,
          plannedDate: "",
          actualDate: "",
          actualMaterialCosts: 0,
          plannedMaterialCosts: 0,
          actualSalaryExpenses: 0,
          plannedSalaryExpenses: 0},
        countercontract: {
          countercontractName: "",
          countercontractType: "",
          counterParty: "",
          counterPlan: "",
          counterFact: "",
          counterAmount: 0,
        },
      },
      stageAct: false,
      counterpartyAct: false,
      dialogVisible: false,
      editedIndex: -1,
      isEdit: false,
      nameRules: [
        required,
        minLength(3),
      ],
      valid: true,
      types: ["Закупка", "Поставка", "Работы"],
      headers: [
        {text: "Название", align: "start", sortable: false, value: "name"},
        { text: "Тип договора", align: "start", sortable: false, value: 'type'},
        { text: "Плановые сроки", align: "start", sortable: false, value: "plannedDate" },
        { text: "Фактические сроки", align: "start", sortable: false, value:  "actualDate"},
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
        {text: "Название", value: "name"},
        {text: "Плановые сроки", value: "plannedDate"},
        {text:  "Фактические сроки", value: "actualDate"},
        {text: "Сумма этапа", value: "amount"},
        {text: "Плановые расходы на материалы", value: "plannedMaterialCosts"},
        {text: "Фактические расходы на материалы", value: "actualMaterialCosts"},
        {text: "Плановые расходы на зарплаты", value: "plannedSalaryExpenses"},
        {text: "Фактические расходы на зарплаты", value: "actualSalaryExpenses"},
        { text: "Действия", value: "actions", sortable: false}
      ],

    };
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  computed: {
    isAdmin1() {
      return  this.$store.getters["users/getUserRole"];
    },
    contracts() {
      console.log(this.$store.state.contractsStore.all)
      let contractList = this.$store.state.contractsStore.all
      let contract: Contract = {actualDate: "", amount: 0, id: 0, name: "", plannedDate: "", type: ""};
      let contractsAll = [] as Contract[];
      for (let i=0; i<contractList.length; i++){
        contract.id = contractList[i].id;
        contract.name = contractList[i].name;
        contract.type = contractList[i].type;
        contract.amount = contractList[i].amount;
        contract.plannedDate = contractList[i].plannedStartDate + ' - ' + contractList[i].plannedEndDate;
        contract.actualDate = contractList[i].actualStartDate + ' - ' + contractList[i].actualEndDate;
        contractsAll.push(contract);
        contract = {actualDate: "", amount: 0, id: 0, name: "", plannedDate: "", type: ""};
      }
      return contractsAll
    },
    // stages() {
    //   console.log(this.$store.state.contractsStore.all)
    //   let stage: Stage = {
    //     id: 0,
    //     actualDate: "",
    //     actualMaterialCosts: 0,
    //     actualSalaryExpenses: 0,
    //     amount: 0,
    //     name: "",
    //     plannedDate: "",
    //     plannedMaterialCosts: 0,
    //     plannedSalaryExpenses: 0
    //   };
    //   let stagesAll = [] as Stage[];
    //   if(this.EditedItem.id != -1) {
    //     let stageList = this.$store.state.stages.all
    //     for (let i = 0; i < stageList.length; i++) {
    //       stage.id = stageList[i].id;
    //       stage.name = stageList[i].name;
    //       stage.actualMaterialCosts = stageList[i].actualMaterialCosts;
    //       stage.plannedMaterialCosts = stageList[i].plannedMaterialCosts;
    //       stage.actualSalaryExpenses = stageList[i].actualSalaryExpenses;
    //       stage.plannedSalaryExpenses = stageList[i].plannedSalaryExpenses;
    //       stage.amount = stageList[i].amount;
    //       stage.plannedDate = stageList[i].plannedStartDate + ' - ' + stageList[i].plannedEndDate;
    //       stage.actualDate = stageList[i].actualStartDate + ' - ' + stageList[i].actualEndDate;
    //       stagesAll.push(stage);
    //       stage = {
    //         id: 0,
    //         actualDate: "",
    //         actualMaterialCosts: 0,
    //         actualSalaryExpenses: 0,
    //         amount: 0,
    //         name: "",
    //         plannedDate: "",
    //         plannedMaterialCosts: 0,
    //         plannedSalaryExpenses: 0
    //       };
    //     }
    //   } else stagesAll = [];
    //   return stagesAll
    // }
  },
  methods: {
    editItem (item: any) {
      this.editedIndex = this.contracts.indexOf(item)
      this.EditedItem = Object.assign({}, item)
      this.contractStages = []
      this.counterparties = []
      this.isEdit = true
      let data = item.id
      this.$store.dispatch('contractsStore/allStages', data).then(()=> {
        //this.dialogVisible = true
        this.contractStages = this.$store.state.contractsStore.allStages
      })
      this.$store.dispatch('contractsStore/allCounterpartyContracts', data).then(()=>{
        this.dialogVisible = true
        this.counterparties = this.$store.state.contractsStore.allCounterContracts
      })
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
      this.isEdit = false
      this.$nextTick(() => {
        this.EditedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      if (this.editedIndex > -1 ) {
        const oldValue = this.contracts[this.editedIndex];
        const newValue = this.EditedItem;
        if (oldValue.name !== newValue.name || oldValue.amount !== newValue.amount ||
            oldValue.type !== newValue.type || oldValue.plannedDate !== newValue.plannedDate ||
            oldValue.actualDate !== newValue.actualDate) {
          const planDate = newValue.plannedDate.split("-");
          const factDate = newValue.actualDate.split("-");
          console.log(planDate, factDate)
          const data = {
            name: newValue.name,
            type: newValue.type,
            amount: newValue.amount,
            plannedStartDate: planDate[0].replace(" ", ""),
            plannedEndDate: planDate[1].replace(" ", ""),
            actualStartDate: factDate[0].replace(" ", ""),
            actualEndDate: factDate[1].replace(" ", ""),
            userId: this.$store.state.users.user.id,
            id: newValue.id
          }
          this.$store.dispatch('contractsStore/putContract', data)
        }
        Object.assign(this.contracts[this.editedIndex], this.EditedItem)
        this.isEdit = false
      } else {
        if (this.isEdit) {
          this.contracts.push(this.EditedItem)
        } else {
          const planDate = this.EditedItem.plannedDate.split("-");
          const factDate = this.EditedItem.actualDate.split("-");
          const data = {
            name: this.EditedItem.name,
            type: this.EditedItem.type,
            amount: this.EditedItem.amount,
            plannedStartDate: planDate[0].replace(" ", ""),
            plannedEndDate: planDate[1].replace(" ", ""),
            actualStartDate: factDate[0].replace(" ", ""),
            actualEndDate: factDate[1].replace(" ", ""),
            userId: this.$store.state.users.user.id
          }
          this.$store.dispatch("contractsStore/addNew", data)
        }
      }

      this.stageAct = false;
      this.close()
    },
    saveStage(stage: any ) { // новый метод для добавления этапа в массив
      this.EditedItem.stage = stage
      const stg = this.EditedItem.stage;
      const planDate = stg.plannedDate.split("-");
      const factDate = stg.actualDate.split("-");
      let data = {
        name: stg.name,
        amount: stg.amount,
        plannedStartDate: planDate[0].replace(" ", ""),
        plannedEndDate: planDate[1].replace(" ", ""),
        actualStartDate: factDate[0].replace(" ", ""),
        actualEndDate: factDate[1].replace(" ", ""),
        actualMaterialCosts: stg.actualMaterialCosts,
        plannedMaterialCosts: stg.plannedMaterialCosts,
        actualSalaryExpenses: stg.actualSalaryExpenses,
        plannedSalaryExpenses: stg.plannedSalaryExpenses,
        contractID: this.EditedItem.id
      }
      this.$store.dispatch('contractsStore/addStage', data).then(()=>this.stageAct = false)
      //this.contractStages.push(stg);
    },
    closeStageForm() {
      this.stageAct = false;

    },
    saveCounter(contract: any) {
      this.EditedItem.countercontract = contract;
      const cct = this.EditedItem.countercontract;
      this.counterparties.push(cct);
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
