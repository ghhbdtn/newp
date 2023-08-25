<template>
  <v-app>
    <v-main>
      <v-data-table  @click:row="($event, {item})=>editItem(item)"
                     :headers="headers"
                     :items="contracts"
                     :items-per-page="10"
                     hide-default-footer
                     no-data-text="Ничего не найдено"
                     class="elevation-1 grey lighten-5"
      >
        <template #top>
          <v-divider/>
          <v-toolbar
              text
              color="rgba(128, 101, 166, 0.22)"
          >
            <v-toolbar-title>Список всех договоров</v-toolbar-title>
            <v-divider
                class="mx-4"
                inset
                vertical
            />
            <v-text-field
                v-model="itemsPerPage"
                color="#6A76AB"
                label="Число отображаемых элементов"
                class="shrink"
                outlined
                dense
                type="number"
                min = "0"
                hide-details
                @input="beforeUpdatePage"
            />
            <v-spacer />
            <v-dialog v-model="dialogVisible"  @click.prevent persistent>
              <template #activator="{ on, attrs }">
                <v-btn
                    color="#6A76AB"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                >Добавить</v-btn>
              </template>
              <v-card>
                <v-card-text>
                  <v-form ref="form" v-model="valid" style="background-color: rgb(255,255,255)" @submit.prevent="save">
                    <v-card-title>{{isEdit ? "Редактировать договор": "Добавить договор"}}</v-card-title>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-select
                              color="#6A76AB"
                              clearable
                              outlined
                              v-model="editedItem.user"
                              :items="usersList"
                              item-text="fullName"
                              item-value="id"
                              persistent-hint
                              return-object
                              label="Ответственный пользователь"
                          />
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                              color="#6A76AB"
                              clearable
                              outlined
                              v-model="editedItem.name"
                              label="Название"
                              name="name"
                              style="text-decoration-color: #303234; text-align: start"
                              type="input"
                              placeholder="Название договора"
                              :rules="[rules.required, rules.stringLen]"
                              aria-required="true"
                          />
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-select
                              color="#6A76AB"
                              clearable
                              outlined
                              v-model="editedItem.type"
                              :items="types"
                              label="Тип договора"
                              :rules="[rules.required]"
                              aria-required="true"/>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                              v-model="editedItem.plannedDate"
                              type="text"
                              label="Плановые сроки"
                              v-mask="'##.##.#### - ##.##.####'"
                              placeholder="ДД.ММ.ГГГГ-ДД.ММ.ГГГГ"
                              color="#6A76AB"
                              outlined
                              :rules="[rules.required, rules.planData, rules.range]"
                              aria-required="true"/>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                              v-model="editedItem.actualDate"
                              label="Фактические сроки"
                              v-mask="'##.##.#### - ##.##.####'"
                              color="#6A76AB"
                              outlined
                              :rules="[rules.factData, rules.range]"
                              placeholder="ДД.ММ.ГГГГ-ДД.ММ.ГГГГ"/>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                              v-model="editedItem.amount"
                              color="#6A76AB"
                              clearable
                              outlined
                              placeholder="0.00"
                              :rules="[rules.number, rules.required]"
                              label="Сумма договора (руб.)"/>
                        </v-col>
                        <StageForm :index="contractID"></StageForm>
                        <CounterpartyForm :index="contractID"></CounterpartyForm>
                      </v-row>
                    </v-container>
                    <v-card-actions>
                      <v-btn color="#6A76AB" dark @click="save">Сохранить</v-btn>
                      <v-btn color="red" dark @click="close">Отменить</v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-toolbar>
          <v-divider />
        </template>
        <template #[`header.user.fullName`]="{ header }">
          {{ header.text }}
          <v-spacer />
          <template>
            <v-select outlined
                      clearable
                      color="#6A76AB"
                      v-model="filterValues.user"
                      :items="usersList"
                      item-text="fullName"
                      item-value="id"
                      persistent-hint
                      return-object
                      label="По пользователю"
                      dense
                      style="font-size: 0.9rem;"
                      @input="beforeUpdatePage"
            />
          </template>
        </template>
        <template #[`header.name`]="{ header }">
          {{ header.text }}
          <v-spacer />
          <template>
            <v-text-field outlined
                          color="#6A76AB"
                          v-model="filterValues.name"
                          label="По названию"
                          clearable
                          dense
                          class="filter-input"
                          style="font-size: 0.9rem;"
                          @input="beforeUpdatePage"
            />
          </template>
        </template>
        <template #[`header.type`]="{ header }">
          {{ header.text }}
          <v-spacer />
          <template>
            <v-select outlined
                      clearable
                      color="#6A76AB"
                      v-model="filterValues.type"
                      :items="types"
                      item-text="text"
                      item-value="value"
                      label="По типу договора"
                      dense
                      class="filter-input"
                      style="font-size: 0.9rem;"
                      @input="beforeUpdatePage"
            />
          </template>
        </template>
        <template #[`header.plannedDate`]="{ header }">
          {{ header.text }}
          <v-spacer />
          <template>
            <v-text-field
                outlined
                color="#6A76AB"
                type="date"
                label="Дата начала"
                v-model="filterValues.plannedStartDate"
                class="filter-input"
                clearable
                dense
                style="font-size: 0.9rem;"
                @change="beforeUpdatePage"/>
            <v-text-field
                outlined
                color="#6A76AB"
                type="date"
                label="Дата окончания"
                v-model="filterValues.plannedEndDate"
                class="filter-input"
                dense
                clearable
                style="font-size: 0.9rem;"
                @change="beforeUpdatePage"/>
          </template>
        </template>
        <template #[`header.actualDate`]="{ header }">
          {{ header.text }}
          <v-spacer />
          <template>
            <v-text-field
                outlined
                color="#6A76AB"
                type="date"
                label="Дата начала"
                v-model="filterValues.actualStartDate"
                class="filter-input"
                clearable
                dense
                style="font-size: 0.9rem;"
                @change="beforeUpdatePage"/>
            <v-text-field
                outlined
                color="#6A76AB"
                type="date"
                label="Дата окончания"
                v-model="filterValues.actualEndDate"
                class="filter-input"
                dense
                clearable
                style="font-size: 0.9rem;"
                @change="beforeUpdatePage"/>
          </template>
        </template>
        <template #[`header.amount`]="{ header }">
          {{ header.text }}
          <v-spacer></v-spacer>
          <template>
            <v-text-field
                outlined
                type="number"
                color="#6A76AB"
                label="Минимальная сумма"
                v-model="filterValues.minAmount"
                class="filter-input"
                dense
                clearable
                style="font-size: 0.9rem;"
                @input="beforeUpdatePage"/>
            <v-text-field
                outlined
                type="number"
                color="#6A76AB"
                label="Максимальная сумма"
                v-model="filterValues.maxAmount"
                class="filter-input"
                dense
                clearable
                style="font-size: 0.9rem;"
                @input="beforeUpdatePage"/>
          </template>
        </template>
        <template #[`item.actions`]="{ item }">
          <td>
          <v-icon small class="mr-2" @click="editItem(item);" style="color: #6A76AB">mdi-pencil</v-icon>
          <v-icon small text @click.stop="deleteItem(item)" large style="color: darkred">
            mdi-delete
          </v-icon>
          </td>
        </template>
      </v-data-table>
      <template v-if="contracts.length > 0">
        <div>
          <v-pagination
              color="#6A76AB"
              v-model="page"
              :length="totalPages"
              @input="updatePage"
          >
          </v-pagination>
        </div>
      </template>
    </v-main>
  </v-app>
</template>

<script lang="ts">

import { required, minLength } from "@vuelidate/validators";
import CounterpartyForm from "./CounterpartyForm.vue";
import { mapState } from 'vuex';
import StageForm from "@/pages/components/StageForm.vue";
import {setFilters} from "@/pages/source/filters";
import {dateToString, stringToDate} from "@/pages/source/dateConverters";
import {rules} from "@/pages/source/rules";
import {Contract, User} from "@/pages/source/interfaces";
import {messages} from "@/pages/source/messages";
import {defineComponent} from "vue";
import {VForm} from "@/formType";
import {headers} from "@/pages/source/componentsHeaders";

export default defineComponent({
  name: "Administration",
  components: {StageForm, CounterpartyForm},
data() {
    return {
      editedItem: {
        id: -1,
        name: "",
        type: "",
        plannedDate: "",
        actualDate: "",
        amount: 0,
        user: {
          id: -1,
          login: "",
          fullName: "",
          terminationDate: "",
          isAdmin: false
        } as User
      } as Contract,
      defaultItem: {
        id: -1,
        name: "",
        type: "",
        plannedDate: "",
        actualDate: "",
        amount: 0,
        user: {
          id: -1,
          login: "",
          fullName: "",
          terminationDate: "",
          isAdmin: false
        } as User
      },
      contractID: -1,
      dialogVisible: false,
      editedIndex: -1,
      isEdit: false,
      nameRules: [
        required,
        minLength(3),
      ],
      valid: true,
      page: 1,
      itemsPerPage: 10,
      filterValues: {
        user: {} as User,
        name: "",
        type: "",
        plannedStartDate: "",
        plannedEndDate: "",
        actualStartDate: "",
        actualEndDate: "",
        maxAmount: 0,
        minAmount: 0
      },
      types: ["Закупка", "Поставка", "Работы"],
      headers: headers.administrationHeaders,
      rules: rules
    };
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  computed: {
    ...mapState('users', {
      usersList: 'all'
    }),
    totalPages(){
      return this.$store.state.contractsStore.totalPages
    },
    totalItems(){
      return this.$store.state.contractsStore.totalElements
    },
    contracts() {
      let dates: {plannedDate: string, actualDate: string} = {plannedDate: "", actualDate: ""}
      let contractList = this.$store.state.contractsStore.allForAdmin
      let contract: Contract = {actualDate: "", amount: 0, id: -1, name: "", plannedDate: "", type: "",  user: {
          id: -1,
          login: "",
          fullName: "",
          terminationDate: "",
          isAdmin: false
        } as User};
      let contractsAll = [] as Contract[];
      for (let i=0; i<contractList.length; i++){
        contract.id = contractList[i].id;
        contract.name = contractList[i].name;
        contract.type = contractList[i].type;
        contract.amount = contractList[i].amount;
        dates = dateToString(contractList[i].plannedStartDate, contractList[i].plannedEndDate,
            contractList[i].actualStartDate, contractList[i].actualEndDate)
        contract.plannedDate = dates.plannedDate;
        contract.actualDate = dates.actualDate ;
        contract.user = contractList[i].user
        contractsAll.push(contract);
        dates = {plannedDate: "", actualDate: ""};
        contract = {actualDate: "", amount: 0, id: -1, name: "", plannedDate: "", type: "",  user: {
            id: -1,
            login: "",
            fullName: "",
            terminationDate: "",
            isAdmin: false
          } as User};
      }
      return contractsAll
    }
  },
  methods: {
    editItem (item: any) {
      this.editedIndex = this.contracts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.contractID = this.editedItem.id == null ? -1 : this.editedItem.id
      this.isEdit = true
      let data = {contractId: this.editedItem.id}
      this.$store.dispatch('stages/allStagesAdmin', data).then()
      this.$store.dispatch('counterContracts/allAdminCounterpartyContracts', data).then(()=>{
        this.dialogVisible = true
      })
    },

    deleteItem (item: any) {
      this.editedItem = Object.assign({}, item)
      this.$confirm(messages.DELETE_CONTRACT_CONFIRM, '', "warning").then(()=>
          this.$store.dispatch('contractsStore/deleteContract', this.editedItem.id).
      then(()=> {
        this.close()
            if (this.page == this.totalPages && this.totalItems == (this.page - 1) * this.itemsPerPage + 1) {
              this.page--
            }
            if (this.page < 1) this.beforeUpdatePage()
            else this.updatePage()
        this.updatePage()
      }).catch(()=>this.$alert(messages.FAILED_DELETE_CONTRACT, '', 'error'))).catch(()=>{})
    },

    close () {
      this.dialogVisible = false
      this.isEdit = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.contractID = -1
        this.$store.commit('stages/CLEAR_AFTER_ADDING')
        this.$store.commit('counterContracts/CLEAR_AFTER_ADDING')
      })
    },

    save: function () {
      let form: VForm = this.$refs.form as VForm
      // Trigger validation for each field
      const valid = form.validate();
      // Check if all fields are valid
      if (valid)  {
        const newValue = this.editedItem;
        const dates: {plannedStartDate: string, plannedEndDate: string, actualStartDate: string, actualEndDate: string} =
            stringToDate(newValue.plannedDate, newValue.actualDate);
        const plannedStartDate = dates.plannedStartDate;
        const plannedEndDate = dates.plannedEndDate;
        const actualStartDate = dates.actualStartDate;
        const actualEndDate = dates.actualEndDate;
        if (this.editedIndex > -1) {
          const oldValue = this.contracts[this.editedIndex];
          if (oldValue.name !== newValue.name || oldValue.amount !== newValue.amount ||
              oldValue.type !== newValue.type || oldValue.plannedDate !== newValue.plannedDate ||
              oldValue.actualDate !== newValue.actualDate || oldValue.user == null ||
              newValue.user == null || oldValue.user.id !== newValue.user.id) {
            const data = {
              name: newValue.name,
              type: newValue.type,
              amount: newValue.amount,
              plannedStartDate: plannedStartDate,
              plannedEndDate: plannedEndDate,
              actualStartDate: actualStartDate,
              actualEndDate: actualEndDate,
              userId: (this.editedItem.user == null) ? null : this.editedItem.user.id,
              id: newValue.id
            }
            this.$store.dispatch('contractsStore/putContract', data).then(()=>{
              this.updatePage()
              this.close()
              this.$alert(messages.SAVED_CHANGES, '', 'success');})
                .catch(()=> this.$alert(messages.FAILED_CHANGES, '', 'error'))
          }
          Object.assign(this.contracts[this.editedIndex], this.editedItem)
          this.isEdit = false
          this.close()
        } else {
          const data = {
            name: newValue.name,
            type: newValue.type,
            amount: newValue.amount,
            plannedStartDate: plannedStartDate,
            plannedEndDate: plannedEndDate,
            actualStartDate: actualStartDate,
            actualEndDate: actualEndDate,
            userId: (this.editedItem.user == null || this.editedItem.user.id == -1) ? null : this.editedItem.user.id,
            contractStages: this.$store.state.stages.all,
            counterpartyContracts: this.$store.state.counterContracts.allCounterContracts
          }
          this.$store.dispatch("contractsStore/addNew", data).then(() => {
            this.$store.dispatch('contractsStore/getAll', {})
            this.$store.commit('stages/CLEAR_AFTER_ADDING')
            this.$store.commit('counterContracts/CLEAR_AFTER_ADDING')
            this.$alert(messages.SUCCESS_ADDING_CONTRACT, '', 'success');
            this.updatePage()
            this.close()
          }).catch(()=>this.$alert(messages.FAILED_ADDING_CONTRACT, '', 'error'))
        }
      }
    },
    beforeUpdatePage() {
      this.page = 1;
      this.updatePage();
    },
    updatePage() {
        const arr = setFilters(this.filterValues);
        let page1 = this.page - 1
        if (this.totalPages == 1)  {
          page1 = 0
          this.page = 1;
        }
        const data = {
          filters: arr,
          page: page1,
          size: this.itemsPerPage
        };
        if (this.itemsPerPage > 0) {
          this.$store.dispatch('contractsStore/allAdminContracts', data)
        }
    }
  },
  created(){
    this.$store.dispatch('counterparties/allCounterpartyOrganizations', {page:0, size: 2147483647})
    this.$store.dispatch('contractsStore/allAdminContracts', {})
    this.$store.dispatch('users/allUsers', {page:0, size: 2147483647})
  }
});
</script>

<style>
.col-12 {
  padding-top: 0;
  padding-bottom: 0;
}
.col-6 {
  padding-top: 0;
  padding-bottom: 0;
  color: #6A76AB;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr > th, .v-data-table >
.v-data-table__wrapper > table > thead > tr > th, .v-data-table > .v-data-table__wrapper >
table > tfoot > tr > th {
  font-size: 1.0rem;
  height: 40px;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td, .v-data-table >
.v-data-table__wrapper > table > thead > tr > td, .v-data-table > .v-data-table__wrapper >
table > tfoot > tr > td {
  font-size: 1.0rem;
  height: 40px;
}
.with-divider {
  border-right: 1px solid grey;
}
.filter-input{
  top: 10px;
}
</style>
