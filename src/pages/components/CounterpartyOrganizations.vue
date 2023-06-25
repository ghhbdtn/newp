<template>
  <v-app>
    <v-content>
      <template>
        <v-col cols="10" sm="4" md="3">
          <label class="filter-label">Отфильтровать организации:</label>
        </v-col>
        <v-row align="center" justify="center">
          <v-col cols="6" sm="3" md="3">
            <v-text-field outlined
                          color="#6A76AB"
                          v-model="filterValues.name"
                          label="По названию"
                          clearable
                          class="filter-input"
            ></v-text-field>
          </v-col>

          <v-col cols="6" sm="3" md="3">
            <v-text-field outlined
                          color="#6A76AB"
                          v-model="filterValues.address"
                          label="По адресу организации"
                          clearable
                          class="filter-input"
            ></v-text-field>
          </v-col>
          <v-col cols="6" sm="3" md="3">
            <v-text-field outlined
                          clearable
                          color="#6A76AB"
                          label="По ИНН"
                          v-mask="'##########'"
                          v-model="filterValues.inn"
                          class="filter-input" />
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
      <v-data-table
                     :headers="organization_headers"
                     :items="organizations"
                     :items-per-page="itemsPerPage"
                     hide-default-footer
                     class="elevation-1"
      >
        <template v-slot:[`item.actions`]="{ item }" v-if="isAdmin">
          <v-icon small class="mr-2" @click="editItem(item);" style="color: #6A76AB">mdi-pencil</v-icon>
          <v-icon small text @click="deleteItem(item)" large style="color: darkred">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
      <template v-if="organizations.length > 0">
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
        <v-dialog v-model="dialog">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-if="isAdmin"
                color="#6A76AB"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
            >Добавить</v-btn>
          </template>
          <v-card>
            <v-card-text>
              <v-form ref="form"  style="background-color: rgb(255,255,255)">
                <v-container>
                  <v-card-title>Добавить организацию-контрагента</v-card-title>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                          color="#6A76AB"
                          clearable
                          outlined
                          v-model="editedOrganization.name"
                          label="Название организации"
                          name="name"
                          style="text-decoration-color: #303234; text-align: start"
                          type="input"
                          required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                          color="#6A76AB"
                          clearable
                          outlined
                          v-model="editedOrganization.address"
                          label="Адрес"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field color="#6A76AB"
                          clearable
                          outlined
                          v-model="editedOrganization.inn" type="text" label="ИНН"
                                    v-mask="'##########'" ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-card-actions>
                    <v-btn color="#6A76AB" dark @click="saveOrganization" v-if="isAdmin">Сохранить</v-btn>
                    <v-btn color="red" dark @click="closeForm">{{isAdmin ? `Отменить` : `Закрыть`}}</v-btn>
                  </v-card-actions>
                </v-container>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import {defineComponent} from "vue";
interface Organization {
  id?: number,
  name: string,
  address: string,
  inn: number
}
export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "CounterpartyOrganizations",

  data() {
    return {

      organization: {
        id: -1,
        name: "",
        address: "",
        inn: 0,
      } as Organization,
      editedOrganization: {
        id: -1,
        name: "",
        address: "",
        inn: 0,
      } as Organization,
      page: 1,
      itemsPerPage: 10,
      filterValues: {
        name: "",
        address: "",
        inn: 0,
      },
      organization_headers: [
        {text: "Название организации", value: "name"},
        {text: "Адресс", value: "address"},
        {text:  "ИНН", value: "inn"},
        { text: "Действия", value: "actions", sortable: false}
      ],
      dialog: false,
      editedIndex: -1,
    };
  },

  computed: {
    organizations(){
      return this.$store.state.counterparties.allOrganizations
    },
    isAdmin() {
      return this.$store.state.users.user.isAdmin
    },
    totalPages(){
      return this.$store.state.counterparties.totalPages;
    },
    totalElements(){
      return this.$store.state.counterparties.totalElements;
    }
  },
  methods: {
    saveOrganization () {
      if (this.editedIndex > -1 ) {
        const oldValue = this.organizations[this.editedIndex];
        const newValue = this.editedOrganization;
        if(oldValue.name !== newValue.name || oldValue.address !== newValue.address || oldValue.inn!== newValue.inn){
          const data = {
            id: this.editedOrganization.id,
            name: this.editedOrganization.name,
            address: this.editedOrganization.address,
            inn: this.editedOrganization.inn
          }
          this.$store.dispatch('counterparties/putOrganization',data)
        }
        Object.assign(this.organizations[this.editedIndex], this.editedOrganization)
      } else {
        const data = {
          name: this.editedOrganization.name,
          address: this.editedOrganization.address,
          inn: this.editedOrganization.inn
        }
        this.$store.dispatch('counterparties/addNewOrganization', data)
        //this.organizations.push(this.editedOrganization)
      }
      this.closeForm()
    },
    closeForm () {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedOrganization = Object.assign({}, this.organization)
        this.editedIndex = -1
      })
    },
    editItem (item: any) {
      this.editedIndex = this.organizations.indexOf(item)
      this.editedOrganization = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item: any) {
      //const index = this.organizations.indexOf(item)
      this.editedOrganization = Object.assign({}, item)
      confirm('Are you sure you want to delete this item?') &&
          this.$store.dispatch('counterparties/deleteOrganization', this.editedOrganization.id).then(()=>{
            this.closeForm();
            if (this.page == this.totalPages && this.totalElements == (this.page - 1) * this.itemsPerPage + 1) {
              this.page--
            }
            this.updatePage()
          })
    },
    updatePage() {
      const page = this.page - 1;
      const size = this.itemsPerPage;
      if ((this.filterValues.name == null || this.filterValues.name === "") &&
          (this.filterValues.address == null || this.filterValues.address === "") &&
          (this.filterValues.inn == null || this.filterValues.inn === 0) ) {
        const data = {
          page: page,
          size: size
        };
        this.$store.dispatch('counterparties/allCounterpartyOrganizations', data)
      } else {
        const arr = [] as {}[];
        for (var filter in this.filterValues) {
          switch (filter) {
            case 'name':
              if (this.filterValues.name != null && this.filterValues.name !== "") {
                const nameFilter = {
                  key: 'NAME',
                  targetEntity: "COUNTERPARTY_ORGANIZATION",
                  operator: "LIKE",
                  value: this.filterValues.name
                }
                arr.push(nameFilter)
              }
              break;
            case 'address':
              if (this.filterValues.address != null && this.filterValues.address !== "") {
                const addressFilter = {
                  key: 'ADDRESS',
                  targetEntity: "COUNTERPARTY_ORGANIZATION",
                  operator: "LIKE",
                  value: this.filterValues.address
                }
                arr.push(addressFilter)
              }
              break;
            case 'inn':
              if (this.filterValues.inn != null && this.filterValues.inn != 0 && this.filterValues.inn.toString() !== "") {
                const innFilter = {
                  key: 'INN',
                  targetEntity: "COUNTERPARTY_ORGANIZATION",
                  operator: "EQUAL",
                  value: this.filterValues.inn
                }
                arr.push(innFilter)
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
        this.$store.dispatch('counterparties/allCounterpartyOrganizations', data)
      }
    }
  },
  created() {
    this.$store.dispatch('counterparties/allCounterpartyOrganizations', {})
  }
});
</script>

<style scoped>

</style>
