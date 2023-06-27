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
    <v-card-title v-if="countercontracts.length> 0">Таблица договоров с контрагентами</v-card-title>
    <v-data-table  v-if="countercontracts.length > 0"
                  :headers="_countercontracts_headers"
                  :items="countercontracts"
                  :items-per-page="itemsPerPage"
                   hide-default-footer
                  class="elevation-3">
      <template v-slot:[`item.actions`]="{ item }" v-if="!isUsersData">
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
      <v-card-title>Добавить договор с контрагентом</v-card-title>
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
              :rules="[rules.required]"
              required
          ></v-text-field>
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
          ></v-select>
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
              :rules="[rules.required]"
              required
              label="Организация-Контрагент"
          >
          </v-select>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field v-model="editedCountercontract.amount"
                        color="#6A76AB"
                        clearable
                        outlined
                        :rules="[rules.number]"
                        label="Сумма"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field v-model="editedCountercontract.plannedDate"
                        color="#6A76AB"
                        clearable
                        outlined
                        type="text" label="Плановые сроки"
                        :rules="[rules.required, rules.planData]"
                        required
                        v-mask="'##.##.#### - ##.##.####'" ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field v-model="editedCountercontract.actualDate"
                        color="#6A76AB"
                        clearable
                        outlined
                        label="Фактические сроки"
                        :rules="[rules.factData]"
                        v-mask="'##.##.#### - ##.##.####'"></v-text-field>
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
        {text: "Название", value: "name", sortable: false, show: true},
        {text: "Тип договора", value: "type", sortable: false, show: true},
        {text: "Организация-контрагент", value: "organization.name", sortable: false, show: true},
        {text: "Плановые сроки начала и окончания", sortable: false, value: "plannedDate", show: true},
        {text: "Фактические сроки начала и окончания", sortable: false, value: "actualDate", show: true},
        {text: "Сумма договора", value: "amount", sortable: false, show: true},
        {text: "Действия", value: "actions", sortable: false, show: this.isUsersData == false},
      ],
      rules: {
        required: (value: String|Number) => !!value || "Обязательное поле",
        number: (v: string) => !v ||/^\d+$/.test(v) || 'Должно быть числом',
        planData: (v: string) => /^(0?[1-9]|[12][0-9]|3[01])[.](0?[1-9]|1[012])[.]\d{4} [-] (0?[1-9]|[12][0-9]|3[01])[.](0?[1-9]|1[012])[.]\d{4}$/.test(v)
            || "Формат: ДД.ММ.ГГГ - ДД.ММ.ГГ",
        factData: (v: string) => !v || "" || /^(0?[1-9]|[12][0-9]|3[01])[.](0?[1-9]|1[012])[.]\d{4} [-] (0?[1-9]|[12][0-9]|3[01])[.](0?[1-9]|1[012])[.]\d{4}$/.test(v)
            || /^(0?[1-9]|[12][0-9]|3[01])[.](0?[1-9]|1[012])[.]\d{4} [-] $/.test(v) ||
            "Формат: 'ДД.ММ.ГГГ - ДД.ММ.ГГ', или 'ДД.ММ.ГГГГ - ', или пустое поле",
      },
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
    isAdmin(): boolean {
      return this.$store.state.users.user.isAdmin
    },
    totalPages(): number{
      return this.$store.state.counterparties.totalPages;
    },
    totalElements(): number{
      return this.$store.state.counterparties.totalElements;
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
      let form: any = this.$refs.form
      if(form.validate) {
        if (this.index === -1) {
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
          if(this.editedCounterIndex > -1) this.$store.commit('counterContracts/PUT_COUNTER_CONTRACT', data)
          else this.$store.commit('counterContracts/SET_COUNTER_CONTRACT', data)
          this.countercontracts = this.$store.state.counterContracts.allCounterContracts
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
        } else {
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
        this.closeCounterForm();
        this.$alert("Договор с контрагентом добавлен успешно!", '', 'success');
      }
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
      const message: string = 'Вы действительно хотите удалить данный договор с контрагентом?';
      if(this.index == -1) {
        this.$confirm(message).then(()=>this.$store.commit('counterContracts/DELETE_UNSAVED_COUNTER_CONTRACT', item))
        this.closeCounterForm();
      }else {
        this.editedCountercontract = Object.assign({}, item)
        this.$confirm(message, '', 'warning').then(()=>
        this.$store.dispatch('counterContracts/deleteCounterContract', this.editedCountercontract.id).then(()=> {
          if (this.page == this.totalPages && this.totalElements == (this.page - 1) * this.itemsPerPage + 1) {
            this.page--;
          }
          this.updatePage();
          this.closeCounterForm();
        }))
      }
    },
    updatePage() {
      const page = this.page - 1;
      const size = this.itemsPerPage;
      const data = {
        contractId: this.index,
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
