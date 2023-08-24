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
    <v-data-table  v-if="contractStages.length> 0"
                  :headers="_stages_headers"
                  :items="contractStages"
                  :items-per-page="itemsPerPage"
                   hide-default-footer
                   no-data-text='Ничего не найдено'
                   class="elevation-3">
      <template #top>
        <v-divider />
        <v-toolbar
            text
            color="rgba(128, 101, 166, 0.22)"
        >
          <v-toolbar-title>Таблица этапов договора</v-toolbar-title>
          <v-divider
              class="mx-4"
              inset
              vertical
          />
          <v-text-field
              v-if="index !== -1"
              v-model="itemsPerPage"
              color="#6A76AB"
              label='Число отображаемых элементов'
              type="number"
              outlined
              dense
              hide-details
              class="shrink"
              min="0"
              @input="beforeUpdatePage"
          />
          <v-spacer />
        </v-toolbar>
        <v-divider />
      </template>
      <template #[`item.actions`]="{ item }" v-if="!isUsersData">
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
            <v-card-title>{{editedStageIndex != -1 ? "Редактировать этап договора": "Добавить этап договора"}}</v-card-title>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                    v-model="editedStage.name"
                    color="#6A76AB"
                    clearable
                    outlined
                    label="Название этапа"
                    name="name"
                    style="text-decoration-color: #303234; text-align: start"
                    type="input"
                    :rules="[rules.required, rules.stringLen]"
                    required/>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                    type="text"
                    v-model="editedStage.plannedDate"
                    color="#6A76AB"
                    clearable
                    outlined
                    v-mask="'##.##.#### - ##.##.####'"
                    label="Плановые сроки начала и окончания"
                    placeholder="дд.мм.гггг - дд.мм.гггг"
                    :rules="[rules.required, rules.planData, rules.range]"
                    required/>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                    type="text"
                    v-model="editedStage.actualDate"
                    color="#6A76AB"
                    clearable
                    outlined
                    v-mask="'##.##.#### - ##.##.####'"
                    label="Фактические сроки начала и окончания"
                    placeholder="дд.мм.гггг - дд.мм.гггг"
                    :rules="[rules.factData, rules.range]"
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                    v-model="editedStage.amount"
                    placeholder="0.00"
                    color="#6A76AB"
                    clearable
                    outlined
                    :rules="[rules.number, rules.required]"
                    label="Сумма этапа (руб.)"/>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                    v-model="editedStage.plannedMaterialCosts"
                    placeholder="0.00"
                    color="#6A76AB"
                    clearable
                    outlined
                    :rules="[rules.required, rules.number]"
                    label="Плановые расходы на материалы (руб.)"
                    aria-required="true"/>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                    v-model="editedStage.actualMaterialCosts"
                    placeholder="0.00"
                    color="#6A76AB"
                    clearable
                    outlined
                    label="Фактические расходы на материалы (руб.)"
                    :rules="[rules.number]"/>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                    v-model="editedStage.plannedSalaryExpenses"
                    placeholder="0.00"
                    color="#6A76AB"
                    clearable
                    outlined
                    label="Плановые расходы на зарплаты (руб.)"
                    :rules="[rules.required, rules.number]"
                    aria-required="true"/>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                    v-model="editedStage.actualSalaryExpenses"
                    placeholder="0.00"
                    color="#6A76AB"
                    clearable
                    outlined
                    label="Фактические расходы на зарплаты (руб.)"
                    :rules="[rules.number]"/>
              </v-col>
            </v-row>
            <v-card-actions>
              <v-btn color="#6A76AB" dark type="submit" @click.prevent="saveStage" v-if="isAdmin">Сохранить </v-btn>
              <v-btn color="red" dark type="button" @click="closeStageForm">Отменить</v-btn>
            </v-card-actions>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {dateToString, stringToDate} from "@/pages/source/dateConverters";
import {rules} from "@/pages/source/rules";
import {Stage} from "@/pages/source/interfaces";
import {messages} from "@/pages/source/messages";
import {VForm} from "@/formType";

export default defineComponent( {
  name: "StageForm",
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
        {text: "Сумма этапа (руб.)", value: "amount", sortable: false, show: true},
        {text: "Плановые расходы на материалы (руб.)", sortable: false, value: "plannedMaterialCosts", show: true},
        {text: "Фактические расходы на материалы (руб.)", sortable: false, value: "actualMaterialCosts", show: true},
        {text: "Плановые расходы на зарплаты (руб.)", sortable: false, value: "plannedSalaryExpenses", show: true},
        {text: "Фактические расходы на зарплаты (руб.)", sortable: false, value: "actualSalaryExpenses", show: true},
        { text: "Действия", value: "actions", sortable: false, show: this.isUsersData == false}
      ],
      defaultStage: {
        id: -1,
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
        id: -1,
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
      rules
    }
  },
  computed: {

    contractStages() {
      let dates: {plannedDate: string, actualDate: string} = {plannedDate: "", actualDate: ""}
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
          dates = dateToString(stageList[i].plannedStartDate, stageList[i].plannedEndDate,
              stageList[i].actualStartDate, stageList[i].actualEndDate)
          stage.plannedDate = dates.plannedDate;
          stage.actualDate = dates.actualDate ;
          stagesAll.push(stage);
          dates = {plannedDate: "", actualDate: ""};
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
      let form: VForm = this.$refs.form as VForm
      // Trigger validation for each field
      const valid = form.validate();
      // Check if all fields are valid
      if (valid) {
        const newValue = this.editedStage;
        const dates: {plannedStartDate: string, plannedEndDate: string, actualStartDate: string, actualEndDate: string} =
            stringToDate(newValue.plannedDate, newValue.actualDate);
        const plannedStartDate = dates.plannedStartDate;
        const plannedEndDate = dates.plannedEndDate;
        const actualStartDate = dates.actualStartDate;
        const actualEndDate = dates.actualEndDate;
        if ( this.editedStageIndex == -1) {
          if (this.index == -1) {
            this.itemsPerPageForAdding++;
            this.itemsPerPage = this.itemsPerPageForAdding;
            let data = {
              name: newValue.name,
              amount: newValue.amount,
              plannedStartDate: plannedStartDate,
              plannedEndDate: plannedEndDate,
              actualStartDate: actualStartDate,
              actualEndDate: actualEndDate,
              actualMaterialCosts: newValue.actualMaterialCosts,
              plannedMaterialCosts: newValue.plannedMaterialCosts,
              actualSalaryExpenses: newValue.actualSalaryExpenses,
              plannedSalaryExpenses: newValue.plannedSalaryExpenses,
            }
            this.$store.commit('stages/SET_STAGE', data)
            this.$alert(messages.SUCCESS_ADDING_STAGE, '', 'success');
            this.closeStageForm()
          }else {
            let data = {
              name: newValue.name,
              amount: newValue.amount,
              plannedStartDate: plannedStartDate,
              plannedEndDate: plannedEndDate,
              actualStartDate: actualStartDate,
              actualEndDate: actualEndDate,
              actualMaterialCosts: newValue.actualMaterialCosts,
              plannedMaterialCosts: newValue.plannedMaterialCosts,
              actualSalaryExpenses: newValue.actualSalaryExpenses,
              plannedSalaryExpenses: newValue.plannedSalaryExpenses,
              contractID: this.index
            }
            this.$store.dispatch('stages/addStage', data).then(() => {
              this.updatePage()
              this.closeStageForm()
              this.$alert(messages.SUCCESS_ADDING_STAGE, '', 'success');
            }).catch(
                ()=> this.$alert(messages.FAILED_ADDING_STAGE, '', 'error')
            )
          }
        } else if (this.editedStageIndex > -1) {
          const oldValue = this.contractStages[this.editedStageIndex];
            if (oldValue.name !== newValue.name || oldValue.amount !== newValue.amount ||
                oldValue.plannedMaterialCosts !== newValue.plannedMaterialCosts ||
                oldValue.actualMaterialCosts !== newValue.actualMaterialCosts ||
                oldValue.plannedSalaryExpenses !== newValue.plannedSalaryExpenses ||
                oldValue.actualSalaryExpenses !== newValue.actualSalaryExpenses ||
                oldValue.plannedDate !== newValue.plannedDate ||
                oldValue.actualDate !== newValue.actualDate) {
              if (this.index == -1) {
                const data = {
                  newValue: {
                    name: newValue.name,
                    plannedMaterialCosts: newValue.plannedMaterialCosts,
                    actualMaterialCosts: newValue.actualMaterialCosts,
                    plannedSalaryExpenses: newValue.plannedSalaryExpenses,
                    actualSalaryExpenses: newValue.actualSalaryExpenses,
                    amount: newValue.amount,
                    plannedStartDate: plannedStartDate,
                    plannedEndDate: plannedEndDate,
                    actualStartDate: actualStartDate,
                    actualEndDate: actualEndDate,
                  },
                  oldValueIndex: this.editedStageIndex
                }
                this.$store.commit('stages/PUT_STAGE_BEFORE_ADDING', data)
                this.$alert(messages.SAVED_CHANGES, '', 'success')
                this.closeStageForm()
              }
              else  {
                const data = {
                name: newValue.name,
                plannedMaterialCosts: newValue.plannedMaterialCosts,
                actualMaterialCosts: newValue.actualMaterialCosts,
                plannedSalaryExpenses: newValue.plannedSalaryExpenses,
                actualSalaryExpenses: newValue.actualSalaryExpenses,
                amount: newValue.amount,
                plannedStartDate: plannedStartDate,
                plannedEndDate: plannedEndDate,
                actualStartDate: actualStartDate,
                actualEndDate: actualEndDate,
                id: newValue.id
              }
              this.$store.dispatch('stages/putStage', data).then(
                  () => {
                    this.beforeUpdatePage()
                    this.closeStageForm()
                    this.$alert(messages.SAVED_CHANGES, '', 'success')
                  }
              ).catch(() => this.$alert(messages.FAILED_CHANGES, '', 'error'))
            }
          } else this.closeStageForm()
        }
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
      if (this.index === -1) {
        this.$confirm(messages.DELETE_STAGE_CONFIRM, '', 'warning').then( () => {
        this.$store.commit('stages/DELETE_UNSAVED_CONTRACT_STAGE', item)
        this.closeStageForm()}).catch(()=>{})
      } else {
        this.editedStage = Object.assign({}, item)
        this.$confirm(messages.DELETE_STAGE_CONFIRM, '', 'warning').then(() => {
          this.$store.dispatch('stages/deleteStage', this.editedStage.id).then( () => {
            if (this.page == this.totalPages && this.totalElements == (this.page - 1) * this.itemsPerPage + 1) {
              this.page--
            }
            if (this.page < 1) this.beforeUpdatePage()
            else this.updatePage()
            this.closeStageForm()
          })
        }).catch(()=>this.$alert(messages.FAILED_DELETE_STAGE, '', 'error'))
      }
    },
    beforeUpdatePage() {
      this.page = 1;
      this.updatePage();
    },
    updatePage() {
      const page = this.page - 1;
      const size = this.itemsPerPage;
      const data = {
        contractId: this.index,
        page: page,
        size: size
      };
      if (this.index !== -1 && this.itemsPerPage > 0) {
        this.$store.dispatch('stages/allStages', data)
      }
    }
  }
})
</script>
