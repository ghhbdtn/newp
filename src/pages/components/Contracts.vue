<template>
  <v-app>
    <v-main>
    <v-data-table  @click:row="($event, {item})=>editItem(item)"
                   :headers="headers"
                   :items="contracts"
                   :items-per-page="itemsPerPage"
                   :server-items-length="totalItems"
                   :page.sync="page"
                   hide-default-footer
                   no-data-text="Ничего не найдено"
                   class="elevation-1 grey lighten-5"
    >
      <template #top>
        <v-toolbar text color="rgba(128, 101, 166, 0.22)">
          <v-toolbar-title>Таблица договоров</v-toolbar-title>
          <v-divider
              class="mx-4"
              inset
              vertical/>
          <v-text-field
              v-model="itemsPerPage"
              color="#6A76AB"
              type="number"
              hide-details
              outlined
              dense
              min = "0"
              label="Число отображаемых элементов"
              class="shrink"
              @input="beforeUpdatePage"
          />
          <v-spacer />
        </v-toolbar>
        <v-divider />
      </template>
      <template #[`header.name`]="{ header }">
        {{ header.text }}
        <template>
          <v-text-field
              outlined
              color="#6A76AB"
              v-model="filterValues.name"
              label="По названию"
              clearable
              dense
              class="filter-input"
              style="font-size: 0.9rem;"
              @input="beforeUpdatePage"/>
        </template>
      </template>
      <template #[`header.type`]="{ header }">
        {{ header.text }}
        <template>
          <v-select
              outlined
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
              @change="beforeUpdatePage"/>
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
        <v-spacer />
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
              @input="beforeUpdatePage"/>
        </template>
      </template>
    </v-data-table>
    <template v-if="contracts.length> 0">
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
                      v-model="editedItem.name"
                      label="Название"
                      name="name"
                      style="text-decoration-color: #303234; text-align: start"
                      type="input"
                      placeholder="Название договора"
                      readonly
                      aria-required="true"/>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select
                      color="#6A76AB"
                      outlined
                      v-model="editedItem.type"
                      :items="types"
                      label="Тип договора"
                      readonly
                      aria-required="true" />
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                      v-model="editedItem.plannedDate"
                      color="#6A76AB"
                      outlined
                      type="text"
                      label="Плановые сроки"
                      v-mask="'##.##.#### - ##.##.####'"
                      placeholder="ДД.ММ.ГГГГ-ДД.ММ.ГГГГ"
                      readonly
                      aria-required="true" />
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                      v-model="editedItem.actualDate"
                      color="#6A76AB"
                      outlined
                      label="Фактические сроки"
                      readonly
                      v-mask="'##.##.#### - ##.##.####'"
                      placeholder="ДД.ММ.ГГГГ-ДД.ММ.ГГГГ" />
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                      v-model="editedItem.amount"
                      color="#6A76AB"
                      outlined
                      readonly
                      label="Сумма договора" />
                </v-col>
                <StageForm :index="contractID" :isUsersData="true" ></StageForm>
                <CounterpartyForm :index="contractID" :isUsersData ="true"></CounterpartyForm>
              </v-row>
            </v-container>
            <v-card-actions>
              <v-btn color="red" dark @click="close">Закрыть</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { required, minLength } from "@vuelidate/validators";

import CounterpartyForm from "./CounterpartyForm.vue";
import { VPagination } from 'vuetify/lib';
import {setFilters} from "@/pages/source/filters";
import {dateToString} from "@/pages/source/dateConverters";
import StageForm from "@/pages/components/StageForm.vue";
import {Contract} from "@/pages/source/interfaces";
import {headers} from "@/pages/source/componentsHeaders";

export default defineComponent({
  name: "Contracts",
  components: {StageForm, CounterpartyForm, VPagination},
  data() {
    return {
      editedItem: {
        id: -1,
        name: "",
        type: "",
        plannedDate: "",
        actualDate: "",
        amount: 0,
      } as Contract,
      defaultItem: {
        id: -1,
        name: "",
        type: "",
        plannedDate: "",
        actualDate: "",
        amount: 0,
      } as Contract,
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
      headers: headers.contractsHeaders,
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
    isAdmin1() {
      return  this.$store.getters["users/getUserRole"];
    },
    totalPages(){
      return this.$store.state.contractsStore.totalPages
    },
    totalItems(){
      return this.$store.state.contractsStore.totalElements
    },
    contracts() {
      let dates: {plannedDate: string, actualDate: string} = {plannedDate: "", actualDate: ""}
      let contractList = this.$store.state.contractsStore.all
      let contract: Contract = {actualDate: "", amount: 0, id: 0, name: "", plannedDate: "", type: ""};
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
        contractsAll.push(contract);
        dates = {plannedDate: "", actualDate: ""};
        contract = {actualDate: "", amount: 0, id: 0, name: "", plannedDate: "", type: ""};
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
      this.$store.dispatch('stages/allStages', data)
      this.$store.dispatch('counterContracts/allCounterpartyContracts', data).then(()=>{
        this.dialogVisible = true
      })
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
    beforeUpdatePage() {
      this.page = 1;
      this.updatePage();
    },
    updatePage() {
      const size = this.itemsPerPage;
        const arr = setFilters(this.filterValues);
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
        if (size > 0) {
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
.v-data-table > .v-data-table__wrapper > table > tbody > tr > th, .v-data-table >
.v-data-table__wrapper > table > thead > tr > th, .v-data-table > .v-data-table__wrapper >
table > tfoot > tr > th {
  font-size: 1.0rem;
  height: 48px;
}
.with-divider {
  border-right: 1px solid grey;
}
</style>
