<template>
  <v-app>
    <v-content>
      <template>
        <v-col cols="10" sm="4" md="3">
          <label class="filter-label">Отфильтровать договоры:</label>
        </v-col>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="3" md="3">
            <v-text-field outlined
                          color="#6A76AB"
                          v-model="filterValues.name"
                          label="По названию"
                          clearable
                          class="filter-input"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="3" md="3">
            <v-select outlined
                      clearable
                      color="#6A76AB"
                      v-model="filterValues.type"
                      :items="types"
                      item-text="text"
                      item-value="value"
                      label="По типу договора"
                      class="filter-input"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="3" md="3">
            <v-select outlined
                clearable
                color="#6A76AB"
                v-model="filterValues.user"
                :items="users"
                item-text="fullName"
                item-value="id"
                persistent-hint
                return-object
                label="По ответственному пользователю"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="4" md="3">
            <label class="filter-label">По плановым срокам:</label>
          </v-col>

          <v-col cols="6" sm="3" md="3">
            <v-text-field outlined
                          clearable
                          color="#6A76AB"
                          type="date"
                          label="Плановая дата начала"
                          v-model="filterValues.plannedStartDate"
                          class="filter-input" />
          </v-col>

          <v-col cols="6" sm="3" md="3">
            <v-text-field outlined
                          clearable
                          color="#6A76AB"
                          type="date"
                          label="Плановая дата конца"
                          v-model="filterValues.plannedEndDate" class="filter-input" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="4" md="3">
            <label class="filter-label">По фактическим срокам:</label>
          </v-col>

          <v-col cols="6" sm="3" md="3">
            <v-text-field outlined
                          clearable
                          type="date"
                          color="#6A76AB"
                          label="Фактическая дата начала"
                          v-model="filterValues.actualStartDate" class="filter-input" />
          </v-col>

          <v-col cols="6" sm="3" md="3">
            <v-text-field outlined
                          clearable
                          type="date"
                          color="#6A76AB"
                          label="Фактическая дата конца"
                          v-model="filterValues.actualEndDate" class="filter-input" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="4" md="3">
            <label class="filter-label">По сумме договора:</label>
          </v-col>

          <v-col cols="6" sm="3" md="3">
            <v-text-field outlined
                          clearable
                          type="number"
                          color="#6A76AB"
                          label="Минимальная сумма"
                          v-model="filterValues.minAmount" class="filter-input" />
          </v-col>

          <v-col cols="6" sm="3" md="3">
            <v-text-field outlined
                          clearable
                          type="number"
                          color="#6A76AB"
                          label="Максимальная сумма"
                          v-model="filterValues.maxAmount" class="filter-input" />
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="4" md="3">
            <v-btn @click="updatePage" class="filter-button" color="#6A76AB" dark>
              Найти
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <v-data-table  @click:row="editItem"
                     :headers="headers"
                     :items="contracts"
                     :items-per-page="10"
                     hide-default-footer
                     class="elevation-1"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item);" style="color: #6A76AB">mdi-pencil</v-icon>
          <v-icon small text @click="deleteItem(item)" large style="color: darkred">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
      <template >
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
      <v-dialog v-model="dialogVisible"  @click.prevent persistent>
        <template v-slot:activator="{ on, attrs }">
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
            <v-form ref="form" v-model="valid" style="background-color: rgb(255,255,255)">
              <v-card-title>{{this.isEdit ? "Редактировать договор": "Добавить договор"}}</v-card-title>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                        color="#6A76AB"
                        clearable
                        outlined
                        v-model="EditedItem.user"
                        :items="users"
                        item-text="fullName"
                        item-value="id"
                        persistent-hint
                        return-object
                        label="Ответственный пользователь"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                        color="#6A76AB"
                        clearable
                        outlined
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
                        color="#6A76AB"
                        clearable
                        outlined
                        v-model="EditedItem.type"
                        :items="types"
                        label="Тип договора"
                        aria-required="true"></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="EditedItem.plannedDate" type="text" label="Плановые сроки"
                                  v-mask="'##.##.#### - ##.##.####'"
                                  placeholder="ДД.ММ.ГГГГ-ДД.ММ.ГГГГ"
                                  color="#6A76AB"
                                  outlined
                                  aria-required="true"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="EditedItem.actualDate" label="Фактические сроки"
                                  v-mask="'##.##.#### - ##.##.####'"
                                  color="#6A76AB"
                                  outlined
                                  placeholder="ДД.ММ.ГГГГ-ДД.ММ.ГГГГ"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="EditedItem.amount"
                                  color="#6A76AB"
                                  clearable
                                  outlined
                                  label="Сумма договора"></v-text-field>
                  </v-col>

                  <stg :index="contractID"></stg>
                  <counterparty-form :index="contractID"></counterparty-form>
                </v-row>
              </v-container>
              <v-card-actions>
                <v-btn color="#6A76AB" dark @click="save">Сохранить</v-btn>
                <v-btn color="red" dark @click="close">Отменить</v-btn>
              </v-card-actions>
            </v-form></v-card-text>
        </v-card>
      </v-dialog>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue, { defineComponent } from "vue";
import { required, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

import CounterpartyForm from "./CounterpartyForm.vue";
import { mapState } from 'vuex';
import Stg from "@/pages/components/stg.vue";


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
  actualDate: string,
  user?: User
}
interface User {
  id: number,
  login: string,
  fullName: string,
  terminationDate: string,
  isAdmin: boolean
}

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Administration",
  components: {Stg, CounterpartyForm},
  data() {
    return {
      EditedItem: {
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
      headers: [
        {text: "Ответственный пользователь", value: "user.fullName"},
        {text: "Название", align: "start", sortable: false, value: "name"},
        { text: "Тип договора", align: "start", sortable: false, value: 'type'},
        { text: "Плановые сроки", align: "start", sortable: false, value: "plannedDate" },
        { text: "Фактические сроки", align: "start", sortable: false, value:  "actualDate"},
        { text: "Сумма", align: "start", sortable: false, value: "amount"},
        { text: "Действия", value: "actions", sortable: false},
      ],
    };
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  computed: {
    ...mapState('contractsStore', ['all']),
    isAdmin1() {
      return  this.$store.getters["users/getUserRole"];
    },
    totalPages(){
      return this.$store.state.contractsStore.totalPages
    },
    totalItems(){
      return this.$store.state.contractsStore.totalElements
    },
    users() {
      let userList = [] as User[]
      userList = this.$store.state.users.all
      return userList
    },
    contracts() {
      console.log(this.$store.state.contractsStore.allForAdmin)
      let contractList = this.$store.state.contractsStore.allForAdmin
      let contract: Contract = {actualDate: "", amount: 0, id: 0, name: "", plannedDate: "", type: "",  user: {
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
        contract.plannedDate = contractList[i].plannedStartDate + ' - ' + contractList[i].plannedEndDate;
        contract.actualDate = contractList[i].actualStartDate + ' - ' + contractList[i].actualEndDate;
        contract.user = contractList[i].user
        contractsAll.push(contract);
        contract = {actualDate: "", amount: 0, id: 0, name: "", plannedDate: "", type: "",  user: {
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
      this.EditedItem = Object.assign({}, item)
      this.contractID = this.EditedItem.id
      console.log(this.EditedItem.id)
      this.isEdit = true
      let data = {contractId: this.EditedItem.id}
      this.$store.dispatch('stages/allStagesAdmin', data).then()
      this.$store.dispatch('counterContracts/allAdminCounterpartyContracts', data).then(()=>{
        this.dialogVisible = true
      })
    },

    deleteItem (item: any) {
      this.EditedItem = Object.assign({}, item)
      confirm('Are you sure you want to delete this item?') && this.$store.dispatch('contractsStore/deleteContract', this.EditedItem.id).
      then(()=> {
        this.close()
            if (this.page == this.totalPages && this.totalItems == (this.page - 1) * this.itemsPerPage + 1) {
              this.page--
            }
        this.updatePage()
      })
    },

    close () {
      this.dialogVisible = false
      this.isEdit = false
      this.$nextTick(() => {
        this.EditedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.contractID = -1
        this.$store.commit('stages/CLEAR_AFTER_ADDING')
        this.$store.commit('counterContracts/CLEAR_AFTER_ADDING')
      })
    },

    save () {
      if (this.editedIndex > -1 ) {
        const oldValue = this.contracts[this.editedIndex];
        const newValue = this.EditedItem;
        if (oldValue.name !== newValue.name || oldValue.amount !== newValue.amount ||
            oldValue.type !== newValue.type || oldValue.plannedDate !== newValue.plannedDate ||
            oldValue.actualDate !== newValue.actualDate ||  oldValue.user == null || newValue.user == null || oldValue.user.id !== newValue.user.id) {
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
            userId: (this.EditedItem.user == null) ? null : this.EditedItem.user.id,
            id: newValue.id
          }
          this.$store.dispatch('contractsStore/putContract', data).then(this.updatePage)
        }
        Object.assign(this.contracts[this.editedIndex], this.EditedItem)
        this.isEdit = false
      }  else {
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
          userId: this.EditedItem.user.id,
          contractStages: this.$store.state.stages.all,
          counterpartyContracts: this.$store.state.counterContracts.allCounterContracts
        }
        this.$store.dispatch("contractsStore/addNew", data).then(()=>{this.$store.dispatch('contractsStore/getAll', {})
          this.$store.commit('stages/CLEAR_AFTER_ADDING')
          this.$store.commit('counterContracts/CLEAR_AFTER_ADDING')
          this.updatePage()
        })
      }

      this.close()
    },
    reload() {
      this.$store.dispatch('contractsStore/allAdminContracts', {})
    },
    updatePage() {
      const page = this.page - 1;
      const size = this.itemsPerPage;
      if(this.filterValues.name == null && this.filterValues.type == null && this.filterValues.type == "" || this.filterValues.name == "") {
        const data = {
          page: page,
          size: size
        };
        this.$store.dispatch('contractsStore/allAdminContracts', data)
      }
      else {
        const arr = [] as {}[];
        for (var filter in this.filterValues) {
          switch (filter) {
            case 'user':
              if (this.filterValues.user.id != null && this.filterValues.user.id !== -1) {
                const userFilter = {
                  key: 'USER',
                  targetEntity: "CONTRACT",
                  operator: "EQUAL",
                  value: this.filterValues.user.id
                }
                arr.push(userFilter)
              }
              break;
            case 'name':
              if (this.filterValues.name !== null && this.filterValues.name !== "") {
                const nameFilter = {
                  key: 'NAME',
                  targetEntity: "CONTRACT",
                  operator: "LIKE",
                  value: this.filterValues.name
                }
                arr.push(nameFilter)
              }
              break;
            case 'type':
              if (this.filterValues.type != null && this.filterValues.type !== "") {
                const typeFilter = {
                  key: 'TYPE',
                  targetEntity: "CONTRACT",
                  operator: "EQUAL",
                  value: this.filterValues.type
                }
                arr.push(typeFilter)
              }
              break;
            case 'plannedStartDate':
              if (this.filterValues.plannedStartDate != null && this.filterValues.plannedStartDate !== "") {
                const plannedDateFilter = {
                  key: 'PLANNED_START_DATE',
                  targetEntity: "CONTRACT",
                  operator: "GREATER",
                  value: this.filterValues.plannedStartDate.split("-").reverse().join("-")
                }
                arr.push(plannedDateFilter)
              }
              break;
            case 'plannedEndDate':
              if (this.filterValues.plannedEndDate != null && this.filterValues.plannedEndDate !== "") {
                const plannedDateFilter = {
                  key: 'PLANNED_START_DATE',
                  targetEntity: "CONTRACT",
                  operator: "LESS",
                  value: this.filterValues.plannedEndDate.split("-").reverse().join("-")
                }
                arr.push(plannedDateFilter)
              }
              break;
            case 'actualStartDate':
              if (this.filterValues.actualStartDate != null && this.filterValues.actualStartDate !== "") {
                const actualDateFilter = {
                  key: 'ACTUAL_START_DATE',
                  targetEntity: "CONTRACT",
                  operator: "GREATER",
                  value: this.filterValues.actualStartDate.split("-").reverse().join("-")
                }
                arr.push(actualDateFilter)
              }
              break;
            case 'actualEndDate':
              if (this.filterValues.actualEndDate != null && this.filterValues.actualEndDate !== "") {
                const actualDateFilter = {
                  key: 'ACTUAL_END_DATE',
                  targetEntity: "CONTRACT",
                  operator: "LESS",
                  value: this.filterValues.actualEndDate.split("-").reverse().join("-")
                }
                arr.push(actualDateFilter)
              }
              break;
            case 'maxAmount':
              if (this.filterValues.maxAmount != null && this.filterValues.maxAmount.toString() !== "" && this.filterValues.maxAmount !== 0) {
                const amountFilter = {
                  key: 'AMOUNT',
                  targetEntity: "CONTRACT",
                  operator: "LESS",
                  value: this.filterValues.maxAmount
                }
                arr.push(amountFilter)
              }
              break;
            case 'minAmount':
              if (this.filterValues.minAmount != null && this.filterValues.minAmount.toString() !== "" && this.filterValues.minAmount !== 0) {
                const amountFilter = {
                  key: 'AMOUNT',
                  targetEntity: "CONTRACT",
                  operator: "GREATER",
                  value: this.filterValues.minAmount
                }
                arr.push(amountFilter)
              }
              break;
          }
        }
        let page1 = this.page - 1
        if (this.totalPages == 1)  {
          page1 = 0
          this.page = 1;
        }
        const data = {
          filters: arr,
          page: page1,
          size: size
        };
        this.$store.dispatch('contractsStore/allAdminContracts', data)
      }
    }


  },
  setup() {
    const v$ = useVuelidate();

    return { v$ };

  },
  created(){
    this.$store.dispatch('counterparties/allCounterpartyOrganizations', {})
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
</style>
