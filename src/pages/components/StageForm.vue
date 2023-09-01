<template>
  <div>
    <v-btn v-if="!isUsersData"
           color="indigo"
           dark
           text
           @click="stageAct = !stageAct"
    >
      Добавить этап договора
      <v-icon dark>
        mdi-plus
      </v-icon>
    </v-btn>
    <v-data-table v-if="contractStages.length> 0"
                  :headers="headers"
                  :items="contractStages"
                  :items-per-page="!itemsPerPage ? 10 : parseInt(itemsPerPage)"
                  class="elevation-3"
                  hide-default-footer
                  no-data-text='Ничего не найдено'
    >
      <template #top>
        <v-divider/>
        <v-toolbar
            color="rgba(128, 101, 166, 0.22)"
            height="80"
            text
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
              :rules="[rules.itemsPerPage]"
              class="shrink"
              color="#6A76AB"
              label='Число отображаемых элементов'
              @input="beforeUpdatePage"
          />
          <v-spacer/>
        </v-toolbar>
        <v-divider/>
      </template>
      <template v-if="!isUsersData" #[`item.actions`]="{ item }">
        <v-icon
            class="mr-2"
            small
            style="color: #6A76AB"
            @click="editStageItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
            large
            small
            style="color: darkred"
            text
            @click="deleteStageItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <template v-if="contractStages.length> 0">
      <div>
        <v-pagination v-if="this.index !== -1"
                      v-model="page"
                      :length="totalPages"
                      color="#6A76AB"
                      @input="updatePage"
        />
      </div>
    </template>
    <v-dialog v-model="stageAct" persistent @click.prevent>
      <v-card>
        <v-card-text>
          <v-form ref="form" style="background-color: rgb(255,255,255)">
            <v-container>
              <v-card-title>{{ editedStageIndex !== -1 ? "Редактировать этап договора" : "Добавить этап договора" }}
              </v-card-title>
              <v-row>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field
                      v-model="editedStage.name"
                      :rules="[rules.required, rules.stringLen]"
                      clearable
                      color="#6A76AB"
                      label="Название этапа"
                      name="name"
                      outlined
                      required
                      style="text-decoration-color: #303234; text-align: start"
                      type="input"
                  />
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field
                      v-model="editedStage.plannedDate"
                      v-mask="'##.##.#### - ##.##.####'"
                      :rules="[rules.required, rules.planData, rules.range]"
                      clearable
                      color="#6A76AB"
                      label="Плановые сроки начала и окончания"
                      outlined
                      placeholder="дд.мм.гггг - дд.мм.гггг"
                      required
                      type="text"
                  />
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field
                      v-model="editedStage.actualDate"
                      v-mask="'##.##.#### - ##.##.####'"
                      :rules="[rules.factData, rules.range]"
                      clearable
                      color="#6A76AB"
                      label="Фактические сроки начала и окончания"
                      outlined
                      placeholder="дд.мм.гггг - дд.мм.гггг"
                      type="text"
                  />
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field
                      v-model="editedStage.amount"
                      :rules="[rules.number, rules.required]"
                      clearable
                      color="#6A76AB"
                      label="Сумма этапа (руб.)"
                      outlined
                      placeholder="0.00"
                  />
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field
                      v-model="editedStage.plannedMaterialCosts"
                      :rules="[rules.required, rules.number]"
                      aria-required="true"
                      clearable
                      color="#6A76AB"
                      label="Плановые расходы на материалы (руб.)"
                      outlined
                      placeholder="0.00"
                  />
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field
                      v-model="editedStage.actualMaterialCosts"
                      :rules="[rules.number]"
                      clearable
                      color="#6A76AB"
                      label="Фактические расходы на материалы (руб.)"
                      outlined
                      placeholder="0.00"
                  />
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field
                      v-model="editedStage.plannedSalaryExpenses"
                      :rules="[rules.required, rules.number]"
                      aria-required="true"
                      clearable
                      color="#6A76AB"
                      label="Плановые расходы на зарплаты (руб.)"
                      outlined
                      placeholder="0.00"
                  />
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field
                      v-model="editedStage.actualSalaryExpenses"
                      :rules="[rules.number]"
                      clearable
                      color="#6A76AB"
                      label="Фактические расходы на зарплаты (руб.)"
                      outlined
                      placeholder="0.00"
                  />
                </v-col>
              </v-row>
              <v-card-actions>
                <v-btn v-if="isAdmin" color="#6A76AB" dark type="submit" @click.prevent="saveStage">Сохранить</v-btn>
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

export default defineComponent({
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
    return {
      stageAct: false,
      editedStageIndex: -1,
      stagesHeaders: [
        {text: "Название", value: "name", sortable: false, show: true},
        {text: "Плановые сроки", value: "plannedDate", sortable: false, show: true},
        {text: "Фактические сроки", value: "actualDate", sortable: false, show: true},
        {text: "Сумма этапа (руб.)", value: "amount", sortable: false, show: true},
        {text: "Плановые расходы на материалы (руб.)", sortable: false, value: "plannedMaterialCosts", show: true},
        {text: "Фактические расходы на материалы (руб.)", sortable: false, value: "actualMaterialCosts", show: true},
        {text: "Плановые расходы на зарплаты (руб.)", sortable: false, value: "plannedSalaryExpenses", show: true},
        {text: "Фактические расходы на зарплаты (руб.)", sortable: false, value: "actualSalaryExpenses", show: true},
        {text: "Действия", value: "actions", sortable: false, show: !this.isUsersData}
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
      let stagesAll = [] as Stage[];
      let stageList = this.$store.state.stages.all;
      for (let i = 0; i < stageList.length; i++) {
        let dates: { plannedDate: string, actualDate: string } =
            dateToString(stageList[i].plannedStartDate, stageList[i].plannedEndDate,
                         stageList[i].actualStartDate, stageList[i].actualEndDate);
        stagesAll.push({
          id: stageList[i].id,
          actualDate: dates.actualDate,
          actualMaterialCosts: stageList[i].actualMaterialCosts,
          actualSalaryExpenses: stageList[i].actualSalaryExpenses,
          amount: stageList[i].amount,
          name: stageList[i].name,
          plannedDate: dates.plannedDate,
          plannedMaterialCosts: stageList[i].plannedMaterialCosts,
          plannedSalaryExpenses: stageList[i].plannedSalaryExpenses
        });
      }
      return stagesAll;
    },
    totalPages(): number {
      return this.$store.state.stages.totalPages;
    },
    totalElements(): number {
      return this.$store.state.stages.totalElements;
    },
    isAdmin(): boolean {
      return this.$store.state.users.user.isAdmin;
    },
    headers(): {}[] {
      return this.stagesHeaders.filter(x => x.show);
    }
  },
  methods: {
    editStageItem(item: Stage) {
      this.editedStageIndex = this.contractStages.indexOf(item);
      this.editedStage = Object.assign({}, item);
      this.stageAct = true;
    },
    saveStage() {
      let form: VForm = this.$refs.form as VForm;
      // Trigger validation for each field
      const valid = form.validate();
      // Check if all fields are valid
      if (valid) {
        const newValue = this.editedStage;
        const dates: { plannedStartDate: string, plannedEndDate: string, actualStartDate: string, actualEndDate: string } =
            stringToDate(newValue.plannedDate, newValue.actualDate);
        if (this.editedStageIndex == -1) {
          if (this.index == -1) {
            this.itemsPerPageForAdding++;
            this.itemsPerPage = this.itemsPerPageForAdding;
            let data = {
              name: newValue.name,
              amount: newValue.amount,
              plannedStartDate: dates.plannedStartDate,
              plannedEndDate: dates.plannedEndDate,
              actualStartDate: dates.actualStartDate,
              actualEndDate: dates.actualEndDate,
              actualMaterialCosts: newValue.actualMaterialCosts,
              plannedMaterialCosts: newValue.plannedMaterialCosts,
              actualSalaryExpenses: newValue.actualSalaryExpenses,
              plannedSalaryExpenses: newValue.plannedSalaryExpenses,
            };
            this.$store.commit('stages/SET_STAGE', data);
            this.$alert(messages.SUCCESS_ADDING_STAGE, '', 'success');
            this.closeStageForm();
          } else {
            let data = {
              name: newValue.name,
              amount: newValue.amount,
              plannedStartDate: dates.plannedStartDate,
              plannedEndDate: dates.plannedEndDate,
              actualStartDate: dates.actualStartDate,
              actualEndDate: dates.actualEndDate,
              actualMaterialCosts: newValue.actualMaterialCosts,
              plannedMaterialCosts: newValue.plannedMaterialCosts,
              actualSalaryExpenses: newValue.actualSalaryExpenses,
              plannedSalaryExpenses: newValue.plannedSalaryExpenses,
              contractID: this.index
            };
            this.$store.dispatch('stages/addStage', data).then(() => {
              this.updatePage();
              this.closeStageForm();
              this.$alert(messages.SUCCESS_ADDING_STAGE, '', 'success');
            }).catch(() => this.$alert(messages.FAILED_ADDING_STAGE, '', 'error'));
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
                  plannedStartDate: dates.plannedStartDate,
                  plannedEndDate: dates.plannedEndDate,
                  actualStartDate: dates.actualStartDate,
                  actualEndDate: dates.actualEndDate,
                },
                oldValueIndex: this.editedStageIndex
              };
              this.$store.commit('stages/PUT_STAGE_BEFORE_ADDING', data);
              this.$alert(messages.SAVED_CHANGES, '', 'success');
              this.closeStageForm();
            } else {
              const data = {
                name: newValue.name,
                plannedMaterialCosts: newValue.plannedMaterialCosts,
                actualMaterialCosts: newValue.actualMaterialCosts,
                plannedSalaryExpenses: newValue.plannedSalaryExpenses,
                actualSalaryExpenses: newValue.actualSalaryExpenses,
                amount: newValue.amount,
                plannedStartDate: dates.plannedStartDate,
                plannedEndDate: dates.plannedEndDate,
                actualStartDate: dates.actualStartDate,
                actualEndDate: dates.actualEndDate,
                id: newValue.id
              };
              this.$store.dispatch('stages/putStage', data)
                  .then(() => {
                    this.beforeUpdatePage();
                    this.closeStageForm();
                    this.$alert(messages.SAVED_CHANGES, '', 'success');
                  })
                  .catch(() =>
                      this.$alert(messages.FAILED_CHANGES, '', 'error')
                  );
            }
          } else this.closeStageForm();
        }
      }
    },
    closeStageForm() {
      this.editedStage = Object.assign({}, this.defaultStage);
      this.editedStage.plannedDate = "";
      this.editedStage.actualDate = "";
      this.editedStageIndex = -1;
      this.stageAct = false;
    },
    deleteStageItem(item: Stage) {
      if (this.index === -1) {
        this.$confirm(messages.DELETE_STAGE_CONFIRM, '', 'warning')
            .then(() => {
              this.$store.commit('stages/DELETE_UNSAVED_CONTRACT_STAGE', item);
              this.closeStageForm();
            })
            .catch(() => {})
      } else {
        this.editedStage = Object.assign({}, item);
        this.$confirm(messages.DELETE_STAGE_CONFIRM, '', 'warning')
            .then(() => {
              this.$store.dispatch('stages/deleteStage', this.editedStage.id)
                  .then(() => {
                    if (this.page == this.totalPages && this.totalElements == (this.page - 1) * this.itemsPerPage + 1) {
                      this.page--;
                    }
                    if (this.page < 1) this.beforeUpdatePage();
                    else this.updatePage();
                    this.closeStageForm();
                  })
                  .catch(() =>
                      this.$alert(messages.FAILED_DELETE_STAGE, '', 'error')
                  );
            })
            .catch(() => {})
      }
    },
    beforeUpdatePage() {
      this.page = 1;
      this.updatePage();
    },
    updatePage() {
      const data = {
        contractId: this.index,
        page: this.page - 1,
        size: this.itemsPerPage
      };
      if (this.index !== -1 && this.itemsPerPage > 0 && this.itemsPerPage <= 2147483647) {
        if (this.isAdmin)
          this.$store.dispatch('stages/allStagesAdmin', data);
        else
          this.$store.dispatch('stages/allStages', data);
      }
    }
  },
})
</script>
