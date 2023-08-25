<template>
  <div>
  <v-btn @click="counterpartyAct = !counterpartyAct"
         text
         dark
         color="indigo"
         v-if="!isUsersData">
    Добавить договор с контрагентом
    <v-icon dark>
      mdi-plus
    </v-icon>
  </v-btn>
    <v-data-table  v-if="countercontracts.length > 0"
                  :headers="_countercontracts_headers"
                  :items="countercontracts"
                  :items-per-page="itemsPerPage"
                   hide-default-footer
                  class="elevation-3"
                  no-data-text="Ничего не найдено">
      <template #top>
        <v-divider />
        <v-toolbar
            text
            color="rgba(128, 101, 166, 0.22)">
          <v-toolbar-title>Таблица договоров с контрагентами</v-toolbar-title>
          <v-divider
              class="mx-4"
              inset
              vertical
          />
          <v-text-field
              v-if="index !== -1"
              v-model="itemsPerPage"
              color="#6A76AB"
              label="Число отображаемых элементов"
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
        <v-icon small class="mr-2" @click="editCounterItem(item);" style="color: #6A76AB">mdi-pencil</v-icon>
        <v-icon small text @click="deleteCounterItem(item)" large style="color: darkred">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <template v-if="countercontracts.length> 0">
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
    <v-dialog v-model="counterpartyAct" @click.prevent persistent>
      <v-card>
        <v-card-text>
          <v-form ref="form" style="background-color: rgb(255,255,255)">
            <v-container>
              <v-card-title>{{editedCounterIndex !== -1 ? "Редактировать договор с контрагентом": "Добавить договор с контрагентом"}}</v-card-title>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                      v-model="editedCountercontract.name"
                      color="#6A76AB"
                      clearable
                      outlined
                      label="Название"
                      name="name"
                      style="text-decoration-color: #303234; text-align: start"
                      type="input"
                      placeholder="Название договора"
                      :rules="[rules.required, rules.stringLen]"
                      required
                  />
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select
                      v-model="editedCountercontract.type"
                      color="#6A76AB"
                      clearable
                      outlined
                      :items="countercontractTypes"
                      :rules="[rules.required]"
                      required
                      label="Тип договора"
                  />
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select
                      v-model="editedCountercontract.organization"
                      color="#6A76AB"
                      clearable
                      outlined
                      :items="organizations"
                      item-text="name"
                      item-value="id"
                      persistent-hint
                      return-object
                      :rules="[rules.requiredOrganization]"
                      required
                      label="Организация-Контрагент"
                  />
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                      v-model="editedCountercontract.amount"
                      color="#6A76AB"
                      placeholder="0.00"
                      clearable
                      outlined
                      :rules="[rules.number, rules.required]"
                      label="Сумма"/>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                      v-model="editedCountercontract.plannedDate"
                      color="#6A76AB"
                      clearable
                      outlined
                      type="text"
                      label="Плановые сроки"
                      :rules="[rules.required, rules.planData, rules.range]"
                      required
                      v-mask="'##.##.#### - ##.##.####'" />
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                      v-model="editedCountercontract.actualDate"
                      color="#6A76AB"
                      clearable
                      outlined
                      label="Фактические сроки"
                      :rules="[rules.factData, rules.range]"
                      v-mask="'##.##.#### - ##.##.####'"/>
                </v-col>
              </v-row>
              <v-card-actions>
                <v-btn color="#6A76AB" dark @click="saveCounter">Сохранить</v-btn>
                <v-btn color="red" dark @click="closeCounterForm">Отменить</v-btn>
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
import {CounterContract} from "@/pages/source/interfaces";
import {messages} from "@/pages/source/messages";
import {VForm} from "@/formType";


export default defineComponent({
  name: "CounterpartyForm",
  props: {
    index: {
      type: Number
    },
    isUsersData: {
      type: Boolean
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
          inn: ""
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
          inn: ""
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
        {text: "Название", value: "name", sortable: false, show: true},
        {text: "Тип договора", value: "type", sortable: false, show: true},
        {text: "Организация-контрагент", value: "organization.name", sortable: false, show: true},
        {text: "Плановые сроки начала и окончания", sortable: false, value: "plannedDate", show: true},
        {text: "Фактические сроки начала и окончания", sortable: false, value: "actualDate", show: true},
        {text: "Сумма договора (руб.)", value: "amount", sortable: false, show: true},
        {text: "Действия", value: "actions", sortable: false, show: this.isUsersData == false},
      ],
      rules
    };
  },
  computed: {
    countercontracts: function () {
      let dates: {plannedDate: string, actualDate: string} = {plannedDate: "", actualDate: ""}
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
          inn: ""
        }
      };
      let countercontractsAll = [] as CounterContract[];
      let countercontractList = this.$store.state.counterContracts.allCounterContracts
      if (countercontractList.length !== 0) {
        for (let i = 0; i < countercontractList.length; i++) {
          countercontract.id = countercontractList[i].id;
          countercontract.name = countercontractList[i].name;
          countercontract.type = countercontractList[i].type;
          countercontract.organization.id = countercontractList[i].counterpartyOrganization.id;
          countercontract.organization.name = countercontractList[i].counterpartyOrganization.name;
          countercontract.organization.address = countercontractList[i].counterpartyOrganization.address;
          countercontract.organization.inn = countercontractList[i].counterpartyOrganization.inn;
          countercontract.amount = countercontractList[i].amount;
          dates = dateToString(countercontractList[i].plannedStartDate, countercontractList[i].plannedEndDate,
              countercontractList[i].actualStartDate, countercontractList[i].actualEndDate)
          countercontract.plannedDate = dates.plannedDate;
          countercontract.actualDate = dates.actualDate ;
          countercontractsAll.push(countercontract);
          dates = {plannedDate: "", actualDate: ""};
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
              inn: ""
            },
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
    isAdmin(): boolean {
      return this.$store.state.users.user.isAdmin
    },
    totalPages(): number{
      return this.$store.state.counterContracts.totalPages;
    },
    totalElements(): number{
      return this.$store.state.counterContracts.totalElements;
    },
    _countercontracts_headers () :  {}[]{
      return this.countercontracts_headers.filter(x => x.show)

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
      let form: VForm = this.$refs.form as VForm
      // Trigger validation for each field
      const valid = form.validate();
      // Check if all fields are valid
      if (valid) {
        const newValue = this.editedCountercontract;
        const dates: {plannedStartDate: string, plannedEndDate: string, actualStartDate: string, actualEndDate: string} =
            stringToDate(newValue.plannedDate, newValue.actualDate);
        const plannedStartDate = dates.plannedStartDate;
        const plannedEndDate = dates.plannedEndDate;
        const actualStartDate = dates.actualStartDate;
        const actualEndDate = dates.actualEndDate;
        if(this.editedCounterIndex == -1) {
          if (this.index == -1) {
          this.itemsPerPageForAdding++;
          this.itemsPerPage = this.itemsPerPageForAdding;
          let data = {
            name: newValue.name,
            amount: newValue.amount,
            type: newValue.type,
            plannedStartDate: plannedStartDate,
            plannedEndDate: plannedEndDate,
            actualStartDate: actualStartDate,
            actualEndDate: actualEndDate,
            counterpartyOrganizationId: newValue.organization.id,
            counterpartyOrganization: newValue.organization
          }
          this.$store.commit('counterContracts/SET_COUNTER_CONTRACT', data)
          this.$alert(messages.SUCCESS_ADDING_COUNTERCONTRACT, '', 'success');
          this.closeCounterForm()
          }
          else {
            let data = {
              name: newValue.name,
              type: newValue.type,
              amount: newValue.amount,
              plannedStartDate: plannedStartDate,
              plannedEndDate: plannedEndDate,
              actualStartDate: actualStartDate,
              actualEndDate: actualEndDate,
              counterpartyOrganizationId: newValue.organization.id,
              counterpartyOrganization: newValue.organization,
              contractID: this.index
            }
            this.$store.dispatch('counterContracts/addCounterpartyContract', data)
                .then(()=>{
                  this.updatePage()
                  this.closeCounterForm()
                  this.$alert(messages.SUCCESS_ADDING_COUNTERCONTRACT, '', 'success');})
                .catch(()=>
                    this.$alert(messages.FAILED_ADDING_COUNTERCONTRACT, '', 'error')
                )
          }
        } else if (this.editedCounterIndex > -1) {
          const oldValue = this.countercontracts[this.editedCounterIndex];
          if (oldValue.name !== newValue.name || oldValue.amount !== newValue.amount ||
              oldValue.type !== newValue.type ||
              oldValue.organization.id !== newValue.organization.id ||
              oldValue.plannedDate !== newValue.plannedDate ||
              oldValue.actualDate !== newValue.actualDate) {
            if (this.index == -1) {
              let data = {
                newValue: {
                  name: newValue.name,
                  amount: newValue.amount,
                  type: newValue.type,
                  plannedStartDate: plannedStartDate,
                  plannedEndDate: plannedEndDate,
                  actualStartDate: actualStartDate,
                  actualEndDate: actualEndDate,
                  counterpartyOrganizationId: newValue.organization.id,
                  counterpartyOrganization: newValue.organization,
                },
                oldValueIndex: this.editedCounterIndex
              }
              this.$store.commit('counterContracts/PUT_COUNTER_CONTRACT_BEFORE_ADDING', data)
              this.$alert(messages.SAVED_CHANGES, '', 'success');
              this.closeCounterForm();
            }else {
              const data = {
                name: newValue.name,
                type: newValue.type,
                amount: newValue.amount,
                counterpartyOrganizationId: newValue.organization.id,
                plannedStartDate: plannedStartDate,
                plannedEndDate: plannedEndDate,
                actualStartDate: plannedStartDate,
                actualEndDate: plannedEndDate,
                counterpartyOrganization: newValue.organization,
                id: newValue.id
              }
              this.$store.dispatch('counterContracts/putCounterContract', data).then(
                  () => {
                    this.$alert(messages.SAVED_CHANGES, '', 'success');
                    this.updatePage();
                    this.closeCounterForm()
                  }
              ).catch(() => this.$alert(messages.FAILED_CHANGES, '', 'error'))
            }
          } else this.closeCounterForm()
        }

      }
    },
    closeCounterForm() {
      this.editedCountercontract = Object.assign({}, this.defaultCounterContract)
      this.counterpartyAct = false;
      this.editedCounterIndex = -1;
    },
    deleteCounterItem(item: CounterContract){
      if(this.index == -1) {
        this.$confirm(messages.DELETE_COUNTERCONTRACT_CONFIRM).then(()=>this.$store.commit('counterContracts/DELETE_UNSAVED_COUNTER_CONTRACT', item)).catch(()=>{})
        this.closeCounterForm();
      }else {
        this.editedCountercontract = Object.assign({}, item)
        this.$confirm(messages.DELETE_COUNTERCONTRACT_CONFIRM, '', 'warning').then(()=>
        this.$store.dispatch('counterContracts/deleteCounterContract', this.editedCountercontract.id).then(()=> {
          if (this.page == this.totalPages && this.totalElements == (this.page - 1) * this.itemsPerPage + 1 && this.page !==1) {
            this.page--;
          }
          if (this.page < 1) this.beforeUpdatePage()
          else this.updatePage()
          this.closeCounterForm();
        }).catch(()=>this.$alert(messages.FAILED_DELETE_COUNTERCONTRACT, '', 'error'))).catch(()=>{})
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
      if (this.itemsPerPage > 0) {
        this.$store.dispatch('counterContracts/allCounterpartyContracts', data)
      }
    }
  }
});
</script>
