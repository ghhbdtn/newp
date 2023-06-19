<template>
  <v-app>
  <v-content>
    <v-card>
    <v-data-table  @click:row="editItem"
        :headers="headers"
        :items="contracts"
        :items-per-page="itemsPerPage"
        :page.sync="page"
        hide-default-footer
        class="elevation-1"
    >


      <!-- <template v-slot:top="{ pagination, options, updateOptions }">
         <v-data-footer
             :pagination="pagination"
             :options="options"
             @update:options="updateOptions"
             items-per-page-text="$vuetify.dataTable.itemsPerPageText"/>
       </template> -->
       <!-- <template v-slot:bottom>
         <div class="text-center pt-2">

           <v-pagination
               v-model="page"
               :length="totalPages"
               :classes="bootstrapPaginationClasses"
               :page-count="totalPages"
               color="primary"
           ></v-pagination>

         </div>
       </template> -->
      <template v-slot:[`item.actions`]="{ item }" v-if="isAdmin1">
        <v-icon small class="mr-2" @click="editItem(item);" style="color: darkcyan">mdi-pencil</v-icon>
        <v-icon small text @click="deleteItem(item)" large style="color: darkred">
          mdi-delete
        </v-icon>
      </template>

    </v-data-table>
      <template v-if="contracts.length> 0">
        <div>
          <v-pagination
              v-model="page"
              :length="totalPages"
              @input="updatePage"
          >
          </v-pagination>
        </div>
      </template>
      <!-- <v-select
          dense
          outlined
          hide-details
          :value="itemsPerPage"
          label="Items per page"
          @change="itemsPerPage = parseInt($event, 10)"
          :items="perPageChoices">
      </v-select>-->
    </v-card>
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

              <stg :index="contractID"></stg>
            <counterparty-form :index="contractID"></counterparty-form>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-btn color="primary" @click="save" v-if="isAdmin1">Сохранить</v-btn>
          <v-btn color="red" @click="close">{{isAdmin1 ? `Отменить` : `Закрыть`}}</v-btn>
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
      // perPageChoices: [
      //   {text:'10 records/page' , value: 10},
      //   {text:'20 records/page' , value: 20},
      // ],
      headers: [
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
      let data = this.EditedItem.id
      this.$store.dispatch('stages/allStages', data).then(()=> {
        //this.dialogVisible = true
        //this.contractStages = this.$store.state.stages.all
      })
      this.$store.dispatch('counterContracts/allCounterpartyContracts', data).then(()=>{
        this.dialogVisible = true
      })
    },

    deleteItem (item: any) {
      this.EditedItem = Object.assign({}, item)
      confirm('Are you sure you want to delete this item?') && this.$store.dispatch('contractsStore/deleteContract', this.EditedItem.id).
          then(()=> this.close())
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
            userId: this.$store.state.users.user.id,
            contractStages: this.$store.state.stages.all,
            counterpartyContracts: this.$store.state.counterContracts.allCounterContracts
          }
          this.$store.dispatch("contractsStore/addNew", data).then(()=>{this.$store.dispatch('contractsStore/getAll', {})
          this.$store.commit('stages/CLEAR_AFTER_ADDING')
            this.$store.commit('counterContracts/CLEAR_AFTER_ADDING')
          })
        }

      this.close()
    },
    updatePage() {
      const page = this.page - 1;
      const size = this.itemsPerPage;
      const data = {
        page: page,
        size: size
      };
      this.$store.dispatch('contractsStore/getAll', data)
    }


  },
  setup() {
    const v$ = useVuelidate();

    return { v$ };

  },
  created(){
    this.$store.dispatch('counterparties/allCounterpartyOrganizations', {})
    this.$store.dispatch('contractsStore/getAll', {})
  }
});
</script>

<style>

</style>
