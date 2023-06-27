<template>
  <div>
    <v-btn @click="stageAct = !stageAct"
           text
           dark
           color="indigo"
           v-if="!isUsersData">
      Добавить этап договора
      <v-icon dark>
        mdi-plus
      </v-icon>
    </v-btn>
    <v-card-title v-if="contractStages.length> 0">Таблица этапов договора</v-card-title>
    <v-data-table  v-if="contractStages.length> 0"
                  :headers="_stages_headers"
                  :items="contractStages"
                  :items-per-page="itemsPerPage"
                   hide-default-footer
                  class="elevation-3">
      <template v-slot:[`item.actions`]="{ item }" v-if="!isUsersData">
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
                              :rules="[rules.required]"
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
                              :rules="[rules.required, rules.planData]"
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
                              :rules="[rules.factData]"
                              ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                              v-model="editedStage.amount"
                              color="#6A76AB"
                              clearable
                              outlined
                              :rules="[rules.number]"
                              label="Сумма этапа (руб.)"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                              v-model="editedStage.plannedMaterialCosts"
                              color="#6A76AB"
                              clearable
                              outlined
                              :rules="[rules.required, rules.number]"
                              label="Плановые расходы на материалы (руб.)"
                              aria-required="true"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                              v-model="editedStage.actualMaterialCosts"
                              color="#6A76AB"
                              clearable
                              outlined
                              label="Фактические расходы на материалы (руб.)"
                              :rules="[rules.number]"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                              v-model="editedStage.plannedSalaryExpenses"
                              color="#6A76AB"
                              clearable
                              outlined
                              label="Плановые расходы на зарплаты (руб.)"
                              :rules="[rules.required, rules.number]"
                              aria-required="true"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                              v-model="editedStage.actualSalaryExpenses"
                              color="#6A76AB"
                              clearable
                              outlined
                              label="Фактические расходы на зарплаты (руб.)"
                              :rules="[rules.number]"></v-text-field>
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
    },
    isUsersData: {
      type: Boolean
    }
  },
  data() {
    return{
      stageAct: false,
      editedStageIndex: -1,
      stages_headers: [
        {text: "Название", value: "name", sortable: false, show: true},
        {text: "Плановые сроки", value: "plannedDate", sortable: false, show: true},
        {text:  "Фактические сроки", value: "actualDate", sortable: false, show: true},
        {text: "Сумма этапа", value: "amount", sortable: false, show: true},
        {text: "Плановые расходы на материалы", sortable: false, value: "plannedMaterialCosts", show: true},
        {text: "Фактические расходы на материалы", sortable: false, value: "actualMaterialCosts", show: true},
        {text: "Плановые расходы на зарплаты", sortable: false, value: "plannedSalaryExpenses", show: true},
        {text: "Фактические расходы на зарплаты", sortable: false, value: "actualSalaryExpenses", show: true},
        { text: "Действия", value: "actions", sortable: false, show: this.isUsersData == false}
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
      itemsPerPageForAdding: 0,
      rules: {
        required: (value: String|Number) => !!value || "Обязательное поле",
        number: (v: string) => !v ||/^\d+$/.test(v) || 'Должно быть числом',
        planData: (v: string) => /^(0?[1-9]|[12][0-9]|3[01])[.](0?[1-9]|1[012])[.]\d{4} [-] (0?[1-9]|[12][0-9]|3[01])[.](0?[1-9]|1[012])[.]\d{4}$/.test(v)
            || "Формат: ДД.ММ.ГГГ - ДД.ММ.ГГ",
        factData: (v: string) => !v || "" || /^(0?[1-9]|[12][0-9]|3[01])[.](0?[1-9]|1[012])[.]\d{4} [-] (0?[1-9]|[12][0-9]|3[01])[.](0?[1-9]|1[012])[.]\d{4}$/.test(v)
            || /^(0?[1-9]|[12][0-9]|3[01])[.](0?[1-9]|1[012])[.]\d{4} [-] $/.test(v) ||
            "Формат: 'ДД.ММ.ГГГ - ДД.ММ.ГГ', или 'ДД.ММ.ГГГГ - ', или пустое поле",
      },
    }
  },
  computed: {

    contractStages() {
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
    },
    _stages_headers () :  {}[]{
      return this.stages_headers.filter(x => x.show)

}
  },
  methods: {
    editStageItem(item: Stage) {
      this.editedStageIndex = this.contractStages.indexOf(item);
      this.editedStage = Object.assign({}, item);
      this.stageAct = true
    },
    saveStage( ) {
      let form: any = this.$refs.form
      if(form.validate) {
        if (this.index == -1 && this.editedStageIndex == -1) {// новый метод для добавления этапа в массив
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
          this.$store.commit('stages/SET_STAGE', data)
          this.contractStages = this.$store.state.stages.all
        } else if (this.editedStageIndex > -1) {
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
        if(this.editedStageIndex > -1)this.$alert("Этап договора добавлен успешно!", '', 'success');
      }
    },
    closeStageForm() {
      this.editedStage = Object.assign({}, this.defaultStage)
      this.editedStage.plannedDate = ""
      this.editedStage.actualDate = ""
      this.editedStageIndex = -1
      this.stageAct = false;
    },
    deleteStageItem(item: Stage){
      const message: string = 'Вы действительно хотите удалить данный этап договора?';
      if (this.index === -1) {
        this.$confirm(message, '', 'warning').then( () => {
        this.$store.commit('stages/DELETE_UNSAVED_CONTRACT_STAGE', item)
        this.closeStageForm()});
      } else {
        this.editedStage = Object.assign({}, item)
        this.$confirm(message, '', 'warning').then(() => {
          this.$store.dispatch('stages/deleteStage', this.editedStage.id).then( () => {
        if (this.page == this.totalPages && this.totalElements == (this.page - 1) * this.itemsPerPage + 1) {
          this.page--;
        }
        this.updatePage();})})
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
