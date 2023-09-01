<template>
  <div>
    <v-btn v-if="!isUsersData"
           color="indigo"
           dark
           text
           @click="counterpartyAct = !counterpartyAct">
      Добавить договор с контрагентом
      <v-icon dark>
        mdi-plus
      </v-icon>
    </v-btn>
    <v-data-table v-if="countercontracts.length > 0"
                  :headers="headers"
                  :items="countercontracts"
                  :items-per-page="!itemsPerPage ? 10 : parseInt(itemsPerPage)"
                  class="elevation-3"
                  hide-default-footer
                  no-data-text="Ничего не найдено"
    >
      <template #top>
        <v-divider/>
        <v-toolbar
            color="rgba(128, 101, 166, 0.22)"
            height="80"
            text
        >
          <v-toolbar-title>Таблица договоров с контрагентами</v-toolbar-title>
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
              label="Число отображаемых элементов"
              @input="beforeUpdatePage"
          />
          <v-spacer/>
        </v-toolbar>
        <v-divider/>
      </template>
      <template v-if="!isUsersData" #[`item.actions`]="{ item }">
        <v-icon class="mr-2" small style="color: #6A76AB" @click="editCounterItem(item);">mdi-pencil</v-icon>
        <v-icon large small style="color: darkred" text @click="deleteCounterItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <template v-if="countercontracts.length> 0">
      <div>
        <v-pagination v-if="this.index !== -1"
                      v-model="page"
                      :length="totalPages"
                      color="#6A76AB"
                      @input="updatePage"
        />
      </div>
    </template>
    <v-dialog v-model="counterpartyAct" persistent @click.prevent>
      <v-card>
        <v-card-text>
          <v-form ref="form" style="background-color: rgb(255,255,255)">
            <v-container>
              <v-card-title>
                {{ editedCounterIndex !== -1 ? "Редактировать договор с контрагентом" : "Добавить договор с контрагентом" }}
              </v-card-title>
              <v-row>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field
                      v-model="editedCountercontract.name"
                      :rules="[rules.required, rules.stringLen]"
                      clearable
                      color="#6A76AB"
                      label="Название"
                      name="name"
                      outlined
                      placeholder="Название договора"
                      required
                      style="text-decoration-color: #303234; text-align: start"
                      type="input"
                  />
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-select
                      v-model="editedCountercontract.type"
                      :items="countercontractTypes"
                      :rules="[rules.required]"
                      clearable
                      color="#6A76AB"
                      label="Тип договора"
                      outlined
                      required
                  />
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-select
                      v-model="editedCountercontract.organization"
                      :items="organizations"
                      :rules="[rules.requiredOrganization]"
                      clearable
                      color="#6A76AB"
                      item-text="name"
                      item-value="id"
                      label="Организация-Контрагент"
                      outlined
                      persistent-hint
                      required
                      return-object
                  />
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field
                      v-model="editedCountercontract.amount"
                      :rules="[rules.number, rules.required]"
                      clearable
                      color="#6A76AB"
                      label="Сумма"
                      outlined
                      placeholder="0.00"
                  />
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field
                      v-model="editedCountercontract.plannedDate"
                      v-mask="'##.##.#### - ##.##.####'"
                      :rules="[rules.required, rules.planData, rules.range]"
                      clearable
                      color="#6A76AB"
                      label="Плановые сроки"
                      outlined
                      required
                      type="text"
                  />
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field
                      v-model="editedCountercontract.actualDate"
                      v-mask="'##.##.#### - ##.##.####'"
                      :rules="[rules.factData, rules.range]"
                      clearable
                      color="#6A76AB"
                      label="Фактические сроки"
                      outlined
                  />
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
      countercontractsHeaders: [
        {text: "Название", value: "name", sortable: false, show: true},
        {text: "Тип договора", value: "type", sortable: false, show: true},
        {text: "Организация-контрагент", value: "organization.name", sortable: false, show: true},
        {text: "Плановые сроки начала и окончания", sortable: false, value: "plannedDate", show: true},
        {text: "Фактические сроки начала и окончания", sortable: false, value: "actualDate", show: true},
        {text: "Сумма договора (руб.)", value: "amount", sortable: false, show: true},
        {text: "Действия", value: "actions", sortable: false, show: !this.isUsersData},
      ],
      rules
    };
  },
  computed: {
    countercontracts: function () {
      let countercontractsAll = [] as CounterContract[];
      let countercontractList = this.$store.state.counterContracts.allCounterContracts;
      for (let i = 0; i < countercontractList.length; i++) {
        let dates: { plannedDate: string, actualDate: string } =
            dateToString(countercontractList[i].plannedStartDate, countercontractList[i].plannedEndDate,
                         countercontractList[i].actualStartDate, countercontractList[i].actualEndDate);
        countercontractsAll.push({
          id: countercontractList[i].id,
          name: countercontractList[i].name,
          type: countercontractList[i].type,
          amount: countercontractList[i].amount,
          plannedDate: dates.plannedDate,
          actualDate: dates.actualDate,
          organization: {
            id: countercontractList[i].counterpartyOrganization.id,
            name: countercontractList[i].counterpartyOrganization.name,
            address: countercontractList[i].counterpartyOrganization.address,
            inn: countercontractList[i].counterpartyOrganization.inn
          }
        });
      }
      return countercontractsAll;
    },
    organizations() {
      interface Organization {
        id: number,
        name: string
      }

      let allOrganizations = [] as Organization[];
      let organizations = this.$store.state.counterparties.allOrganizations as Organization[];
      if (organizations.length !== 0) {
        for (let i = 0; i < organizations.length; i++) {
          allOrganizations.push({
            id: organizations[i].id,
            name: organizations[i].name
          });
        }
      }
      return organizations;
    },
    isAdmin(): boolean {
      return this.$store.state.users.user.isAdmin;
    },
    totalPages(): number {
      return this.$store.state.counterContracts.totalPages;
    },
    totalElements(): number {
      return this.$store.state.counterContracts.totalElements;
    },
    headers(): {}[] {
      return this.countercontractsHeaders.filter(x => x.show);

    }
  },
  methods: {
    editCounterItem(item: CounterContract) {
      this.editedCounterIndex = this.countercontracts.indexOf(item);
      this.editedCountercontract = Object.assign({}, item);
      this.counterpartyAct = true;
    },
    saveCounter() {
      let form: VForm = this.$refs.form as VForm;
      // Trigger validation for each field
      const valid = form.validate();
      // Check if all fields are valid
      if (valid) {
        const newValue = this.editedCountercontract;
        const dates: { plannedStartDate: string, plannedEndDate: string, actualStartDate: string, actualEndDate: string } =
            stringToDate(newValue.plannedDate, newValue.actualDate);
        if (this.editedCounterIndex == -1) {
          if (this.index == -1) {
            this.itemsPerPageForAdding++;
            this.itemsPerPage = this.itemsPerPageForAdding;
            let data = {
              name: newValue.name,
              amount: newValue.amount,
              type: newValue.type,
              plannedStartDate: dates.plannedStartDate,
              plannedEndDate: dates.plannedEndDate,
              actualStartDate: dates.actualStartDate,
              actualEndDate: dates.actualEndDate,
              counterpartyOrganizationId: newValue.organization.id,
              counterpartyOrganization: newValue.organization
            };
            this.$store.commit('counterContracts/SET_COUNTER_CONTRACT', data);
            this.$alert(messages.SUCCESS_ADDING_COUNTERCONTRACT, '', 'success');
            this.closeCounterForm();
          } else {
            let data = {
              name: newValue.name,
              type: newValue.type,
              amount: newValue.amount,
              plannedStartDate: dates.plannedStartDate,
              plannedEndDate: dates.plannedEndDate,
              actualStartDate: dates.actualStartDate,
              actualEndDate: dates.actualEndDate,
              counterpartyOrganizationId: newValue.organization.id,
              counterpartyOrganization: newValue.organization,
              contractID: this.index
            };
            this.$store.dispatch('counterContracts/addCounterpartyContract', data)
                .then(() => {
                  this.updatePage();
                  this.closeCounterForm();
                  this.$alert(messages.SUCCESS_ADDING_COUNTERCONTRACT, '', 'success');
                })
                .catch(() =>
                    this.$alert(messages.FAILED_ADDING_COUNTERCONTRACT, '', 'error')
                );
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
                  plannedStartDate: dates.plannedStartDate,
                  plannedEndDate: dates.plannedEndDate,
                  actualStartDate: dates.actualStartDate,
                  actualEndDate: dates.actualEndDate,
                  counterpartyOrganizationId: newValue.organization.id,
                  counterpartyOrganization: newValue.organization,
                },
                oldValueIndex: this.editedCounterIndex
              };
              this.$store.commit('counterContracts/PUT_COUNTER_CONTRACT_BEFORE_ADDING', data);
              this.$alert(messages.SAVED_CHANGES, '', 'success');
              this.closeCounterForm();
            } else {
              const data = {
                name: newValue.name,
                type: newValue.type,
                amount: newValue.amount,
                counterpartyOrganizationId: newValue.organization.id,
                plannedStartDate: dates.plannedStartDate,
                plannedEndDate: dates.plannedEndDate,
                actualStartDate: dates.actualStartDate,
                actualEndDate: dates.actualEndDate,
                counterpartyOrganization: newValue.organization,
                id: newValue.id
              };
              this.$store.dispatch('counterContracts/putCounterContract', data)
                  .then(() => {
                    this.$alert(messages.SAVED_CHANGES, '', 'success');
                    this.updatePage();
                    this.closeCounterForm();
                  })
                  .catch(() =>
                      this.$alert(messages.FAILED_CHANGES, '', 'error')
                  );
            }
          } else this.closeCounterForm();
        }
      }
    },
    closeCounterForm() {
      this.editedCountercontract = Object.assign({}, this.defaultCounterContract);
      this.counterpartyAct = false;
      this.editedCounterIndex = -1;
    },
    deleteCounterItem(item: CounterContract) {
      if (this.index == -1) {
        this.$confirm(messages.DELETE_COUNTERCONTRACT_CONFIRM)
            .then(() =>
                this.$store.commit('counterContracts/DELETE_UNSAVED_COUNTER_CONTRACT', item)
            )
            .catch(() => {});
        this.closeCounterForm();
      } else {
        this.editedCountercontract = Object.assign({}, item);
        this.$confirm(messages.DELETE_COUNTERCONTRACT_CONFIRM, '', 'warning')
            .then(() =>
                this.$store.dispatch('counterContracts/deleteCounterContract', this.editedCountercontract.id)
                    .then(() => {
                      if (this.page == this.totalPages && this.totalElements == (this.page - 1) * this.itemsPerPage + 1 && this.page !== 1) {
                        this.page--;
                      }
                      if (this.page < 1) this.beforeUpdatePage();
                      else this.updatePage();
                      this.closeCounterForm();
                    })
                    .catch(() => this.$alert(messages.FAILED_DELETE_COUNTERCONTRACT, '', 'error')))
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
      if (this.itemsPerPage > 0 && this.itemsPerPage <= 2147483647) {
        if (this.isAdmin)
          this.$store.dispatch('counterContracts/allAdminCounterpartyContracts', data);
        else
          this.$store.dispatch('counterContracts/allCounterpartyContracts', data);
      }
    }
  }
});
</script>
