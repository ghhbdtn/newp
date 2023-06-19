<template>
  <v-app>
    <v-content>
      <v-data-table  @click:row="editItem"
                     :headers="organization_headers"
                     :items="organizations"
                     :items-per-page="5"
                     hide-default-footer
                     class="elevation-1"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item);" style="color: darkcyan">mdi-pencil</v-icon>
          <v-icon small text @click="deleteItem(item)" large style="color: darkred">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
      <template v-if="organizations.length > 0">
        <div>
          <v-pagination
              v-model="page"
              :length="totalPages"
              @input="updatePage"
          >
          </v-pagination>
        </div>
      </template>
<!--      <v-select-->
<!--          dense-->
<!--          outlined-->
<!--          hide-details-->
<!--          :value="itemsPerPage"-->
<!--          label="Items per page"-->
<!--          @change="itemsPerPage = parseInt($event, 10)"-->
<!--          :items="perPageChoices">-->
<!--      </v-select>-->
        <v-dialog v-model="dialog">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-if="isAdmin"
                color="primary"
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
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
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
                          v-model="editedOrganization.address"
                          label="Адрес"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedOrganization.inn" type="text" label="ИНН"
                                    v-mask="'##########'" ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-card-actions>
                    <v-btn color="primary" @click="saveOrganization" v-if="isAdmin">Сохранить</v-btn>
                    <v-btn color="red" @click="closeForm">{{isAdmin ? `Отменить` : `Закрыть`}}</v-btn>
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
      // perPageChoices: [
      //   {text:'10 records/page' , value: 10},
      //   {text:'20 records/page' , value: 20},
      // ],
      organization_headers: [
        {text: "Название организации", value: "name"},
        {text: "Адресс", value: "address"},
        {text:  "ИНН", value: "inn"},
        { text: "Действия", value: "actions", sortable: false}
      ],
      //organizations: [{organizationName: "sdfds;", address:"dssdfcds", INN:1231232135}] as Organization[],
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
          this.$store.dispatch('counterparties/deleteOrganization', this.editedOrganization.id)
      //&& this.organizations.splice(index, 1)
    },
    updatePage() {
      const page = this.page - 1;
      const size = this.itemsPerPage;
      const data = {
        page: page,
        size: size
      };
      this.$store.dispatch('counterparties/allCounterpartyOrganizations', data)
    }
  },
  created() {
    this.$store.dispatch('counterparties/allCounterpartyOrganizations', {})
  }
});
</script>

<style scoped>

</style>
