<template>
  <v-app>
    <v-main>
      <v-data-table :headers="headers"
                    :items="contracts"
                    :page.sync="page"
                    :server-items-length="totalItems"
                    class="elevation-1 grey lighten-5"
                    hide-default-footer
                    no-data-text="Ничего не найдено"
                    @click:row="($event, {item})=>editItem(item)"
      >
        <template #top>
          <v-toolbar
              color="rgba(128, 101, 166, 0.22)"
              height="80"
              text
          >
            <v-toolbar-title top>Таблица договоров</v-toolbar-title>
            <v-divider
                class="mx-4"
                inset
                vertical
            />
            <v-text-field
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
        <template #[`header.name`]="{ header }">
          {{ header.text }}
          <template>
            <v-text-field
                v-model="filterValues.name"
                class="filter-input"
                clearable
                color="#6A76AB"
                dense
                label="По названию"
                outlined
                style="font-size: 0.9rem;"
                @input="beforeUpdatePage"
            />
          </template>
        </template>
        <template #[`header.type`]="{ header }">
          {{ header.text }}
          <template>
            <v-select
                v-model="filterValues.type"
                :items="types"
                class="filter-input"
                clearable
                color="#6A76AB"
                dense
                item-text="text"
                item-value="value"
                label="По типу договора"
                outlined
                style="font-size: 0.9rem;"
                @change="beforeUpdatePage"
            />
          </template>
        </template>
        <template #[`header.plannedDate`]="{ header }">
          {{ header.text }}
          <v-spacer/>
          <template>
            <v-text-field
                v-model="filterValues.plannedStartDate"
                class="filter-input"
                clearable
                color="#6A76AB"
                dense
                label="Дата начала"
                outlined
                style="font-size: 0.9rem;"
                type="date"
                @change="beforeUpdatePage"
            />
            <v-text-field
                v-model="filterValues.plannedEndDate"
                class="filter-input"
                clearable
                color="#6A76AB"
                dense
                label="Дата окончания"
                outlined
                style="font-size: 0.9rem;"
                type="date"
                @change="beforeUpdatePage"
            />
          </template>
        </template>
        <template #[`header.actualDate`]="{ header }">
          {{ header.text }}
          <v-spacer/>
          <template>
            <v-text-field
                v-model="filterValues.actualStartDate"
                class="filter-input"
                clearable
                color="#6A76AB"
                dense
                label="Дата начала"
                outlined
                style="font-size: 0.9rem;"
                type="date"
                @change="beforeUpdatePage"
            />
            <v-text-field
                v-model="filterValues.actualEndDate"
                class="filter-input"
                clearable
                color="#6A76AB"
                dense
                label="Дата окончания"
                outlined
                style="font-size: 0.9rem;"
                type="date"
                @change="beforeUpdatePage"
            />
          </template>
        </template>
        <template #[`header.amount`]="{ header }">
          {{ header.text }}
          <v-spacer/>
          <template>
            <v-text-field
                v-model="filterValues.minAmount"
                class="filter-input"
                clearable
                color="#6A76AB"
                dense
                label="Минимальная сумма"
                outlined
                type="number"
                @input="beforeUpdatePage"
            />
            <v-text-field
                v-model="filterValues.maxAmount"
                class="filter-input"
                clearable
                color="#6A76AB"
                dense
                label="Максимальная сумма"
                outlined
                type="number"
                @input="beforeUpdatePage"
            />
          </template>
        </template>
      </v-data-table>
      <template v-if="contracts.length> 0">
        <div>
          <v-pagination
              v-model="page"
              :length="totalPages"
              color="#6A76AB"
              @input="updatePage"
          />
        </div>
      </template>
      <v-dialog v-model="dialogVisible" persistent @click.prevent>
        <v-card>
          <v-card-text>
            <v-form ref="form" v-model="valid" style="background-color: rgb(255,255,255)">
              <v-card-title>Карточка договора</v-card-title>
              <v-container>
                <v-row>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                        v-model="editedItem.name"
                        aria-required="true"
                        color="#6A76AB"
                        label="Название"
                        name="name"
                        outlined
                        placeholder="Название договора"
                        readonly
                        style="text-decoration-color: #303234; text-align: start"
                        type="input"
                    />
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-select
                        v-model="editedItem.type"
                        :items="types"
                        aria-required="true"
                        color="#6A76AB"
                        label="Тип договора"
                        outlined
                        readonly
                    />
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                        v-model="editedItem.plannedDate"
                        v-mask="'##.##.#### - ##.##.####'"
                        aria-required="true"
                        color="#6A76AB"
                        label="Плановые сроки"
                        outlined
                        placeholder="ДД.ММ.ГГГГ-ДД.ММ.ГГГГ"
                        readonly
                        type="text"
                    />
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                        v-model="editedItem.actualDate"
                        v-mask="'##.##.#### - ##.##.####'"
                        color="#6A76AB"
                        label="Фактические сроки"
                        outlined
                        placeholder="ДД.ММ.ГГГГ-ДД.ММ.ГГГГ"
                        readonly
                    />
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                        v-model="editedItem.amount"
                        color="#6A76AB"
                        label="Сумма договора"
                        outlined
                        readonly
                    />
                  </v-col>
                  <StageForm :index="contractID" :isUsersData="true"></StageForm>
                  <CounterpartyForm :index="contractID" :isUsersData="true"></CounterpartyForm>
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
import {defineComponent} from "vue";
import CounterpartyForm from "./CounterpartyForm.vue";
import {VPagination} from 'vuetify/lib';
import {setFilters} from "@/pages/source/filters";
import {dateToString} from "@/pages/source/dateConverters";
import StageForm from "@/pages/components/StageForm.vue";
import {Contract} from "@/pages/source/interfaces";
import {headers} from "@/pages/source/componentsHeaders";
import {rules} from "@/pages/source/rules";

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
      rules
    };
  },
  computed: {
    totalPages() {
      return this.$store.state.contractsStore.totalPages;
    },
    totalItems() {
      return this.$store.state.contractsStore.totalElements;
    },
    contracts() {
      let contractList = this.$store.state.contractsStore.all;
      let contractsAll = [] as Contract[];
      for (let i = 0; i < contractList.length; i++) {
        let dates: { plannedDate: string, actualDate: string } =
            dateToString(contractList[i].plannedStartDate, contractList[i].plannedEndDate,
                contractList[i].actualStartDate, contractList[i].actualEndDate);
        contractsAll.push({
          id: contractList[i].id,
          name: contractList[i].name,
          plannedDate: dates.plannedDate,
          actualDate: dates.actualDate,
          amount: contractList[i].amount,
          type: contractList[i].type
        });
      }
      return contractsAll;
    }
  },
  methods: {
    editItem(item: any) {
      this.editedIndex = this.contracts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.contractID = this.editedItem.id == null ? -1 : this.editedItem.id;
      this.isEdit = true;
      let data = {contractId: this.editedItem.id};
      this.$store.dispatch('stages/allStages', data);
      this.$store.dispatch('counterContracts/allCounterpartyContracts', data).then(() => {
        this.dialogVisible = true;
      })
    },
    close() {
      this.dialogVisible = false;
      this.isEdit = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.contractID = -1;
        this.$store.commit('stages/CLEAR_AFTER_ADDING');
        this.$store.commit('counterContracts/CLEAR_AFTER_ADDING');
      })
    },
    beforeUpdatePage() {
      this.page = 1;
      this.updatePage();
    },
    updatePage() {
      const size = this.itemsPerPage;
      const filtersList = setFilters(this.filterValues);
      let currentPage = this.page - 1;
      if (this.totalPages == 1) {
        currentPage = 0;
        this.page = 1;
      }
      const data = {
        filters: filtersList,
        page: currentPage,
        size: size
      };
      if (size > 0 && size <= 2147483647) {
        this.$store.dispatch('contractsStore/getAll', data);
      }
    }
  },
  created() {
    this.$store.dispatch('contractsStore/getAll', {});
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
