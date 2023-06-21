<template>
  <div>
  <v-btn @click="counterpartyAct = !counterpartyAct"
         text
         dark
         color="indigo">
    Добавить договор с контрагентом
    <v-icon dark>
      mdi-plus
    </v-icon>
  </v-btn>
    <v-card-title>Таблица договоров с контрагентами</v-card-title>
    <v-data-table  @click:row="editCounterItem" v-if="countercontracts.length > 0"
                  :headers="countercontracts_headers"
                  :items="countercontracts"
                  :items-per-page="itemsPerPage"
                   hide-default-footer
                  class="elevation-3">
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editCounterItem(item);" style="color: darkcyan">mdi-pencil</v-icon>
        <v-icon small text @click="deleteCounterItem(item)" large style="color: darkred">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <template v-if="countercontracts.length> 0">
      <div>
        <v-pagination v-if="this.index !== -1"
            v-model="page"
            :length="totalPages"
            @input="updatePage"
        >
        </v-pagination>
      </div>
    </template>
    <v-dialog v-model="counterpartyAct" @click.prevent persistent>
<v-card>
<v-card-text>
  <v-form ref="form" style="background-color: rgb(255,255,255)">
    <v-container>
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
              v-model="editedCountercontract.name"
              label="Название"
              name="name"
              style="text-decoration-color: #303234; text-align: start"
              type="input"
              placeholder="Название договора"
              required
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-select
              v-model="editedCountercontract.type"
              :items="countercontractTypes"
              label="Тип договора"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-select
              v-model="editedCountercontract.organization"
              :items="organizations"
              item-text="name"
              item-value="id"
              persistent-hint
              return-object
              label="Организация-Контрагент"
          >
          </v-select>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field v-model="editedCountercontract.amount" label="Сумма"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field v-model="editedCountercontract.plannedDate" type="text" label="Плановые сроки"
                        v-mask="'##.##.#### - ##.##.####'" ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field v-model="editedCountercontract.actualDate" label="Фактические сроки"
                        v-mask="'##.##.#### - ##.##.####'"></v-text-field>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-btn color="primary" @click="saveCounter">Сохранить</v-btn>
        <v-btn color="red" @click="closeCounterForm">Отменить</v-btn>
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

interface CounterContract {
  id?: number,
  name: string,
  type: string,
  amount: number,
  plannedDate: string,
  actualDate: string,
  organization: {
    id: number,
    name: string,
    address: string,
    inn: number
  },
  counterpartyOrganizationId: number
}
export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "CounterpartyForm",
  props: {
    index: {
      type: Number
    }
  },
  data: function () {
    return {

      editedCountercontract: {
        id: -1,
        name: "",
        type: "",
        amount: 0,
        plannedDate: "",
        actualDate: "",
        organization: {
          id: -1,
          name: "",
          address: "",
          inn: 0
        },
        counterpartyOrganizationId: -1
      } as CounterContract,
      defaultCounterContract: {
        id: -1,
        name: "",
        type: "",
        amount: 0,
        plannedDate: "",
        actualDate: "",
        organization: {
          id: -1,
          name: "",
          address: "",
          inn: 0
        },
        counterpartyOrganizationId: -1
      } as CounterContract,
      countercontractTypes: ["Закупка", "Поставка", "Работы"],
      counterpartyAct: false,
      editedCounterIndex: -1,
      page: 1,
      itemsPerPage: 10,
      itemsPerPageForAdding: 0,
      countercontracts_headers: [
        {text: "Название", value: "name"},
        {text: "Тип договора", value: "type"},
        {text: "Организация-контрагент", value: "organization.name"},
        {text: "Плановые сроки начала и окончания", value: "plannedDate"},
        {text: "Фактические сроки начала и окончания", value: "actualDate"},
        {text: "Сумма договора", value: "amount"},
        {text: "Действия", value: "actions", sortable: false},
      ],
    };
  },
  computed: {
    countercontracts: function () {
      let countercontract: CounterContract = {
        id: -1,
        name: "",
        type: "",
        amount: 0,
        plannedDate: "",
        actualDate: "",
        organization: {
          id: -1,
          name: "",
          address: "",
          inn: 0
        },
        counterpartyOrganizationId: -1
      };
      let countercontractsAll = [] as CounterContract[];
      let countercontractList = this.$store.state.counterContracts.allCounterContracts
      if (countercontractList.length !== 0) {

        for (let i = 0; i < countercontractList.length; i++) {
          countercontract.id = countercontractList[i].id;
          countercontract.name = countercontractList[i].name;
          countercontract.type = countercontractList[i].type;
          //console.log(this.organizations,  countercontractList[i].counterpartyOrganization.id)
          countercontract.organization.id = countercontractList[i].counterpartyOrganization.id;
          countercontract.organization.name = countercontractList[i].counterpartyOrganization.name;
          countercontract.organization.address = countercontractList[i].counterpartyOrganization.address;
          countercontract.organization.inn = countercontractList[i].counterpartyOrganization.inn;
          countercontract.amount = countercontractList[i].amount;
          countercontract.plannedDate = countercontractList[i].plannedStartDate + ' - ' + countercontractList[i].plannedEndDate;
          countercontract.actualDate = countercontractList[i].actualStartDate + ' - ' + countercontractList[i].actualEndDate;
          countercontractsAll.push(countercontract);
          countercontract = {
            id: -1,
            name: "",
            type: "",
            amount: 0,
            plannedDate: "",
            actualDate: "",
            organization: {
              id: -1,
              name: "",
              address: "",
              inn: 0
            },
            counterpartyOrganizationId: -1
          };
        }
      } else countercontractsAll = [];
      return countercontractsAll

    },
    organizations(){
      interface Organization{
        id: number,
        name: string
      }
      let allOrganizations =[] as Organization[];
      let organizations = [] as Organization[]
      organizations = this.$store.state.counterparties.allOrganizations
      let org = {
        id: 0,
        name: ""
      } as Organization
      if(organizations.length !== 0) {
        for (let i = 0; i < organizations.length; i++) {
          org.id = organizations[i].id
          org.name = organizations[i].name
          allOrganizations.push(org)
          org = {
            id: 0,
            name: ""
          }
        }
        }
      return organizations
    },
    totalPages(): number{
      return this.$store.state.counterparties.totalPages;
    },
    totalElements(): number{
      return this.$store.state.counterparties.totalElements;
    }
  },
  methods: {
    // метод для сохранения данных этапа
    editCounterItem(item: CounterContract) {
      this.editedCounterIndex = this.countercontracts.indexOf(item);
      this.editedCountercontract = Object.assign({}, item);
      this.counterpartyAct = true;
    },
    saveCounter() {
      if(this.index === -1){
        this.itemsPerPageForAdding++;
        this.itemsPerPage = this.itemsPerPageForAdding;
        const cct = this.editedCountercontract;
        const planDate = cct.plannedDate.split("-");
        const factDate = cct.actualDate.split("-");
        let data = {
          name: cct.name,
          amount: cct.amount,
          type: cct.type,
          plannedStartDate: planDate[0].replace(" ", ""),
          plannedEndDate: planDate[1].replace(" ", ""),
          actualStartDate: factDate[0].replace(" ", ""),
          actualEndDate: factDate[1].replace(" ", ""),
          counterpartyOrganizationId: cct.organization.id,
          counterpartyOrganization: cct.organization,
          contractID: this.index
        }
        console.log(this.index)
        //this.contractStages.push(stg)
        this.$store.commit('counterContracts/SET_COUNTER_CONTRACT', data)
        this.countercontracts =  this.$store.state.counterContracts.allCounterContracts
      } else if (this.editedCounterIndex > -1) {
        const oldValue = this.countercontracts[this.editedCounterIndex];
        const newValue = this.editedCountercontract;
        console.log(oldValue, newValue)
        if (oldValue.name !== newValue.name || oldValue.amount !== newValue.amount ||
            oldValue.type !== newValue.type ||
            oldValue.organization.id !== newValue.organization.id ||
            oldValue.plannedDate !== newValue.plannedDate ||
            oldValue.actualDate !== newValue.actualDate) {
          const planDate = newValue.plannedDate.split("-");
          const factDate = newValue.actualDate.split("-");
          console.log(planDate, factDate)
          const data = {
            name: newValue.name,
            type: newValue.type,
            amount: newValue.amount,
            counterpartyOrganizationId: newValue.organization.id,
            plannedStartDate: planDate[0].replace(" ", ""),
            plannedEndDate: planDate[1].replace(" ", ""),
            actualStartDate: factDate[0].replace(" ", ""),
            actualEndDate: factDate[1].replace(" ", ""),
            counterpartyOrganization: newValue.organization,
            id: newValue.id
          }
          console.log(this.$store.state.stages.ID)
          this.$store.dispatch('counterContracts/putCounterContract', data).then(
              () => {
                this.editedCounterIndex = -1
                this.closeCounterForm()
              }
          )
        }
      }
      else{
        const cct = this.editedCountercontract;
        const planDate = cct.plannedDate.split("-");
        const factDate = cct.actualDate.split("-");
        let data = {
          name: cct.name,
          type: cct.type,
          amount: cct.amount,
          plannedStartDate: planDate[0].replace(" ", ""),
          plannedEndDate: planDate[1].replace(" ", ""),
          actualStartDate: factDate[0].replace(" ", ""),
          actualEndDate: factDate[1].replace(" ", ""),
          counterpartyOrganizationId: cct.organization.id,
          counterpartyOrganization: cct.organization,
          contractID: this.index
        }
        console.log(this.index)
        this.$store.dispatch('counterContracts/addCounterpartyContract', data).then(this.reload)
      }
      //this.counterparties.push(cct);
      this.closeCounterForm();
      this.counterpartyAct = false;
    },
    reload() {
      this.$store.dispatch('counterContracts/allCounterpartyContracts')
    },
    closeCounterForm() {
      this.editedCountercontract = Object.assign({}, this.defaultCounterContract)
      this.counterpartyAct = false;
      this.editedCounterIndex = -1;
    },
    deleteCounterItem(item: CounterContract){
      //const index = this.contractStages.indexOf(item)
      if(this.index == -1) {
        confirm('Are you sure you want to delete this item?') && this.$store.commit('counterContracts/DELETE_UNSAVED_COUNTER_CONTRACT', item)
        this.closeCounterForm();
      }else {
        this.editedCountercontract = Object.assign({}, item)
        confirm('Are you sure you want to delete this item?') &&
        this.$store.dispatch('counterContracts/deleteCounterContract', this.editedCountercontract.id)
        if (this.page == this.totalPages && this.totalElements == (this.page - 1) * this.itemsPerPage + 1) {
          this.page--;
        }
        this.updatePage();
        this.closeCounterForm();
      }
    },
    updatePage() {
      const page = this.page - 1;
      const size = this.itemsPerPage;
      const data = {
        page: page,
        size: size
      };
      this.$store.dispatch('counterContracts/allCounterpartyContracts', data)
    }
  }
});
</script>

<style scoped>

</style>
