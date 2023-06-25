<template>
  <div>
    <v-btn @click="stageAct = !stageAct"
           text
           dark
           color="indigo"
           v-if="isAdmin">
      Добавить этап договора
      <v-icon dark>
        mdi-plus
      </v-icon>
    </v-btn>
    <v-card-title v-if="contractStages.length> 0">Таблица этапов договора</v-card-title>
    <v-data-table  v-if="contractStages.length> 0"
                  :headers="stages_headers"
                  :items="contractStages"
                  :items-per-page="itemsPerPage"
                   hide-default-footer
                  class="elevation-3">
      <template v-slot:[`item.actions`]="{ item }" v-if="isAdmin">
        <v-icon small class="mr-2" @click="editStageItem(item);" style="color: #6A76AB">mdi-pencil</v-icon>
        <v-icon small text @click="deleteStageItem(item)" large style="color: darkred">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <template v-if="contractStages.length> 0">
      <div>
        <v-pagination v-if="this.index !== -1"
            v-model="page"
            color="#6A76AB"
            :length="totalPages"
            @input="updatePage"
        >
        </v-pagination>
      </div>
    </template>
    <v-dialog v-model="stageAct" @click.prevent persistent>
    <v-card>
      <v-card-text>
        <v-form ref="form" style="background-color: rgb(255,255,255)">
          <v-container>
            <v-card-title>Добавить стадию договора</v-card-title>
            <v-row>
              <v-col cols="12" sm="6" md="4">

                <v-text-field id="name" v-model="editedStage.name"
                              color="#6A76AB"
                              clearable
                              outlined
                              label="Название этапа"
                              name="name"
                              style="text-decoration-color: #303234; text-align: start"
                              type="input"
                              required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field type="text"
                              v-model="editedStage.plannedDate"
                              color="#6A76AB"
                              clearable
                              outlined
                              v-mask="'##.##.#### - ##.##.####'"
                              label="Плановые сроки начала и окончания"
                              placeholder="дд.мм.гггг - дд.мм.гггг"
                              required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field type="text"
                              v-model="editedStage.actualDate"
                              color="#6A76AB"
                              clearable
                              outlined
                              v-mask="'##.##.#### - ##.##.####'"
                              label="Фактические сроки начала и окончания"
                              placeholder="дд.мм.гггг - дд.мм.гггг"
                              required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field type="number"
                              v-model="editedStage.amount"
                              color="#6A76AB"
                              clearable
                              outlined
                              label="Сумма этапа"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field type="number"
                              v-model="editedStage.plannedMaterialCosts"
                              color="#6A76AB"
                              clearable
                              outlined
                              label="Плановые расходы на материалы"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field type="number"
                              v-model="editedStage.actualMaterialCosts"
                              color="#6A76AB"
                              clearable
                              outlined
                              label="Фактические расходы на материалы"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field type="number"
                              v-model="editedStage.plannedSalaryExpenses"
                              color="#6A76AB"
                              clearable
                              outlined
                              label="Плановые расходы на зарплаты"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field type="number"
                              v-model="editedStage.actualSalaryExpenses"
                              color="#6A76AB"
                              clearable
                              outlined
                              label="Фактические расходы на зарплаты"></v-text-field>
              </v-col>
            </v-row>
            <v-btn color="#6A76AB" dark type="submit" @click.prevent="saveStage" v-if="isAdmin">Сохранить</v-btn>
            <v-btn color="red" dark type="button" @click="closeStageForm">Отменить</v-btn>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
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
export default defineComponent( {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "stg",
  props: {
    index: {
      type: Number
    }
  },
  data() {
    return{
      //contractStages: [] as Stage[],
      stageAct: false,
      editedStageIndex: -1,
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
      defaultStage: {
        name: "",
        amount: 0,
        plannedDate: "",
        actualDate: "",
        actualMaterialCosts: 0,
        plannedMaterialCosts: 0,
        actualSalaryExpenses: 0,
        plannedSalaryExpenses: 0
      } as Stage,
      editedStage: {
        name: "",
        amount: 0,
        plannedDate: "",
        actualDate: "",
        actualMaterialCosts: 0,
        plannedMaterialCosts: 0,
        actualSalaryExpenses: 0,
        plannedSalaryExpenses: 0
      } as Stage,
      page: 1,
      itemsPerPage: 10,
      itemsPerPageForAdding: 0
    }
  },
  computed: {

    contractStages() {
      // if (this.index === -1) {
      //   return []
      // }
      console.log(this.$store.state.contractsStore.all)
      let stage: Stage = {
        id: 0,
        actualDate: "",
        actualMaterialCosts: 0,
        actualSalaryExpenses: 0,
        amount: 0,
        name: "",
        plannedDate: "",
        plannedMaterialCosts: 0,
        plannedSalaryExpenses: 0
      };
      let stagesAll = [] as Stage[];
      let stageList = this.$store.state.stages.all
      if(stageList.length !== 0) {

        for (let i = 0; i < stageList.length; i++) {
          stage.id = stageList[i].id;
          stage.name = stageList[i].name;
          stage.actualMaterialCosts = stageList[i].actualMaterialCosts;
          stage.plannedMaterialCosts = stageList[i].plannedMaterialCosts;
          stage.actualSalaryExpenses = stageList[i].actualSalaryExpenses;
          stage.plannedSalaryExpenses = stageList[i].plannedSalaryExpenses;
          stage.amount = stageList[i].amount;
          stage.plannedDate = stageList[i].plannedStartDate + ' - ' + stageList[i].plannedEndDate;
          stage.actualDate = stageList[i].actualStartDate + ' - ' + stageList[i].actualEndDate;
          stagesAll.push(stage);
          stage = {
            id: 0,
            actualDate: "",
            actualMaterialCosts: 0,
            actualSalaryExpenses: 0,
            amount: 0,
            name: "",
            plannedDate: "",
            plannedMaterialCosts: 0,
            plannedSalaryExpenses: 0
          };
        }
      }
      return stagesAll
    },
    totalPages(): number{
      return this.$store.state.stages.totalPages;
    },
    totalElements(): number{
      return this.$store.state.stages.totalElements;
    },
    isAdmin(): boolean {
      return this.$store.state.users.user.isAdmin
    }
  },
  methods: {
    editStageItem(item: Stage) {
      console.log(item, 'asd')
      this.editedStageIndex = this.contractStages.indexOf(item);
      this.editedStage = Object.assign({}, item);
      //this.$set(this.EditedItem.stage, 'stage', { ...item });
      //console.log(this.EditedItem.stage)
      this.stageAct = true
    },
    saveStage( ) { // новый метод для добавления этапа в массив
      if(this.index == -1){
        this.itemsPerPageForAdding++;
        this.itemsPerPage = this.itemsPerPageForAdding;
        const stg = this.editedStage;
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
          contractID: this.index
        }
        //this.contractStages.push(stg)
        this.$store.commit('stages/SET_STAGE', data)
        this.contractStages =  this.$store.state.stages.all
      }
      //this.editedStage = stage
      else if (this.editedStageIndex > -1) {
        const oldValue = this.contractStages[this.editedStageIndex];
        const newValue = this.editedStage;
        if (oldValue.name !== newValue.name || oldValue.amount !== newValue.amount ||
            oldValue.plannedMaterialCosts !== newValue.plannedMaterialCosts ||
            oldValue.actualMaterialCosts !== newValue.actualMaterialCosts ||
            oldValue.plannedSalaryExpenses !== newValue.plannedSalaryExpenses ||
            oldValue.actualSalaryExpenses !== newValue.actualSalaryExpenses ||
            oldValue.plannedDate !== newValue.plannedDate ||
            oldValue.actualDate !== newValue.actualDate) {
          const planDate = newValue.plannedDate.split("-");
          const factDate = newValue.actualDate.split("-");
          console.log(planDate, factDate)
          const data = {
            name: newValue.name,
            plannedMaterialCosts: newValue.plannedMaterialCosts,
            actualMaterialCosts: newValue.actualMaterialCosts,
            plannedSalaryExpenses: newValue.plannedSalaryExpenses,
            actualSalaryExpenses: newValue.actualSalaryExpenses,
            amount: newValue.amount,
            plannedStartDate: planDate[0].replace(" ", ""),
            plannedEndDate: planDate[1].replace(" ", ""),
            actualStartDate: factDate[0].replace(" ", ""),
            actualEndDate: factDate[1].replace(" ", ""),
            id: newValue.id
          }
          console.log(this.$store.state.stages.ID)
          this.$store.dispatch('stages/putStage', data).then(
              () => {
                this.editedStageIndex = -1
                this.closeStageForm()
              }
          )
        }
      } else {
        const stg = this.editedStage;
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
          contractID: this.index
        }
        this.$store.dispatch('stages/addStage', data).then(() => {
          this.closeStageForm()
          this.editedStage = Object.assign({}, this.defaultStage)
        })
      }
      this.closeStageForm()
      //this.EditedItem.stage = Object.assign({}, this.defaultItem.stage)
      //this.contractStages.push(stg);
    },
    closeStageForm() {
      this.editedStage = Object.assign({}, this.defaultStage)
      this.editedStage.plannedDate = ""
      this.editedStage.actualDate = ""
      this.editedStageIndex = -1
      this.stageAct = false;
    },
    deleteStageItem(item: Stage){
      if (this.index === -1) {
        confirm('Are you sure you want to delete this item?') && this.$store.commit('stages/DELETE_UNSAVED_CONTRACT_STAGE', item)
        this.closeStageForm();
      } else {
        //const index = this.contractStages.indexOf(item)
        this.editedStage = Object.assign({}, item)
        confirm('Are you sure you want to delete this item?') && this.$store.dispatch('stages/deleteStage', this.editedStage.id)
        if (this.page == this.totalPages && this.totalElements == (this.page - 1) * this.itemsPerPage + 1) {
          this.page--;
        }
        this.updatePage();
        this.closeStageForm();
      }
    },
    updatePage() {
      const page = this.page - 1;
      const size = this.itemsPerPage;
      const data = {
        contractId: this.index,
        page: page,
        size: size
      };
      if (this.index !== -1) {
        this.$store.dispatch('stages/allStages', data)
      }
      // else{
      //   const data = {
      //     page: page + 1,
      //     size: size
      //   };
      //   this.$store.commit('stages/STAGES_PER_PAGE', data)
      // }
    }

  }
})
</script>

<style scoped>

</style>
