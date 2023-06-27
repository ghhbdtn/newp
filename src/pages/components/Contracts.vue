<template>
  <v-app>
  <v-content>
    <v-card>
          <v-data-table  @click:row="editItem"
        :headers="headers"
        :items="contracts"
        :items-per-page="itemsPerPage"
        :total-items="totalItems"
        :page.sync="page"
        hide-default-footer
        class="elevation-1 grey lighten-5"
    >
            <template v-slot:top>
              <v-toolbar
                  flat
              >
                <v-toolbar-title>Таблица договоров</v-toolbar-title>
                <v-divider
                    class="mx-4"
                    inset
                    vertical
                ></v-divider>
                <v-text-field
                    v-model="itemsPerPage"
                    color="#6A76AB"
                    label="Количество элементов на странице"
                    type="number"
                    hide-details
                    class="items-per-page-field"
                    @input="updatePage"
                ></v-text-field>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-divider></v-divider>
            </template>
            <template v-slot:[`header.name`]="{ header }">
              {{ header.text }}
                <template>
                    <v-text-field outlined
                                  color="#6A76AB"
                                  v-model="filterValues.name"
                                  label="По названию"
                                  clearable
                                  dense
                                  class="filter-input"
                                  @input="updatePage"
                    ></v-text-field>
                    </template>
            </template>
            <template v-slot:[`header.type`]="{ header }">
              {{ header.text }}
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
                          @change="updatePage"
                ></v-select>
              </template>
            </template>
            <template v-slot:[`header.plannedDate`]="{ header }">
              {{ header.text }}
              <v-spacer></v-spacer>
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
                    @change="updatePage"/>
                <v-text-field
                    outlined
                    color="#6A76AB"
                    type="date"
                    label="Дата окончания"
                    v-model="filterValues.plannedEndDate"
                    class="filter-input"
                    dense
                    clearable
                    @change="updatePage"/>
              </template>
            </template>
            <template v-slot:[`header.actualDate`]="{ header }">
              {{ header.text }}
              <v-spacer></v-spacer>
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
                    @change="updatePage"/>
                <v-text-field
                    outlined
                    color="#6A76AB"
                    type="date"
                    label="Дата окончания"
                    v-model="filterValues.actualEndDate"
                    class="filter-input"
                    dense
                    clearable
                    @change="updatePage"/>
              </template>
            </template>
            <template v-slot:[`header.amount`]="{ header }">
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
                    @change="updatePage"/>
                <v-text-field
                    outlined
                    type="number"
                    color="#6A76AB"
                    label="Максимальная сумма"
                    v-model="filterValues.maxAmount"
                    class="filter-input"
                    dense
                    clearable
                    @change="updatePage"/>
              </template>
            </template>
    </v-data-table>
      <template v-if="contracts.length> 0">
        <div>
          <v-pagination
              color="#6A76AB"
              v-model="page"
              :length="Math.ceil(totalItems / itemsPerPage)"
              @input="updatePage"
          >
          </v-pagination>
        </div>
      </template>
    </v-card>
    <v-dialog v-model="dialogVisible"  @click.prevent persistent>
      <v-card>
      <v-card-text>
      <v-form ref="form" v-model="valid" style="background-color: rgb(255,255,255)">
        <v-card-title>Карточка договора</v-card-title>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                  color="#6A76AB"
                  outlined
                  v-model="EditedItem.name"
                  label="Название"
                  name="name"
                  style="text-decoration-color: #303234; text-align: start"
                  type="input"
                  placeholder="Название договора"
                  readonly
                  aria-required="true"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                  color="#6A76AB"
                  outlined
                  v-model="EditedItem.type"
                  :items="types"
                  label="Тип договора"
                  readonly
                  aria-required="true"></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="EditedItem.plannedDate"
                            color="#6A76AB"
                            outlined
                            type="text" label="Плановые сроки"
                            v-mask="'##.##.#### - ##.##.####'"
              placeholder="ГГГГ.ММ.ДД-ГГГГ.ММ.ДД"
                            readonly
                            aria-required="true"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="EditedItem.actualDate"
                            color="#6A76AB"
                            outlined
                            label="Фактические сроки"
                            readonly
                            v-mask="'##.##.#### - ##.##.####'"
                            placeholder="ГГГГ.ММ.ДД-ГГГГ.ММ.ДД"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="EditedItem.amount"
                            color="#6A76AB"
                            outlined
                            readonly
                            label="Сумма договора"></v-text-field>
            </v-col>
              <stg :index="contractID" :isUsersData="true" ></stg>
            <counterparty-form :index="contractID" :isUsersData ="true"></counterparty-form>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-btn color="red" dark @click="close">Закрыть</v-btn>
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

import CounterpartyForm from "./CounterpartyForm.vue";
import { mapState } from 'vuex';
import Stg from "@/pages/components/stg.vue";
import { VPagination } from 'vuetify/lib';



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

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Contracts",
  components: {Stg, CounterpartyForm, VPagination},
  data() {
    return {
      EditedItem: {
        id: -1,
        name: "",
        type: "",
        plannedDate: "",
        actualDate: "",
        amount: 0,
      },
      defaultItem: {
        id: -1,
        name: "",
        type: "",
        plannedDate: "",
        actualDate: "",
        amount: 0,
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
      types: ["Закупка", "Поставка", "Работы"],
      page: 1,
      itemsPerPage: 10,
      filterValue: "",
      filterField: "",
      headers: [
        {text: "Название", align: "start", sortable: false, value: "name",  class: "with-divider", cellClass: 'with-divider'},
        { text: "Тип договора", align: "start", sortable: false, value: 'type', class: "with-divider", cellClass: 'with-divider'},
        { text: "Плановые сроки", align: "start", sortable: false, value: "plannedDate", class: "with-divider", cellClass: 'with-divider'},
        { text: "Фактические сроки", align: "start", sortable: false, value:  "actualDate", class: "with-divider", cellClass: 'with-divider'},
        { text: "Сумма", align: "start", sortable: false, value: "amount", class: "with-divider", cellClass: 'with-divider'},
      ],
      filterValues: {
        name: "",
        type: "",
        plannedStartDate: "",
        plannedEndDate: "",
        actualStartDate: "",
        actualEndDate: "",
        maxAmount: 0,
        minAmount: 0
      },
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
    isLast() {
      return this.$store.state.contractsStore.last
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
      this.$store.dispatch('stages/allStages', data).then(()=> {
        //this.dialogVisible = true
        //this.contractStages = this.$store.state.stages.all
      })
      this.$store.dispatch('counterContracts/allCounterpartyContracts', data).then(()=>{
        this.dialogVisible = true
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
    updatePage() {
      const page = this.page - 1;
      const size = this.itemsPerPage;
      if(this.filterValues.name == null && this.filterValues.type == null && this.filterValues.type == "" || this.filterValues.name == "") {
        const data = {
          page: page,
          size: size
        };
        this.$store.dispatch('contractsStore/getAll', data)
      }
      else {
        const arr = [] as {}[];
        for (var filter in this.filterValues) {
          switch (filter) {
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
        this.$store.dispatch('contractsStore/getAll', data)
      }
    }


  },
  created(){
    this.$store.dispatch('counterparties/allCounterpartyOrganizations', {})
    this.$store.dispatch('contractsStore/getAll', {})
  }
});
</script>

<style scoped>

.filter-input {
  width: 70%;
}

.col-12 {
  padding-top: 0;
  padding-bottom: 0;
}
.col-6 {
  padding-top: 0;
  padding-bottom: 0;
  color: #6A76AB;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr > th, .v-data-table > .v-data-table__wrapper > table > thead > tr > th, .v-data-table > .v-data-table__wrapper > table > tfoot > tr > th

{

  font-size: 1.0rem;

  height: 48px;
}
.with-divider {
  border-right: 1px solid grey;
}
</style>
