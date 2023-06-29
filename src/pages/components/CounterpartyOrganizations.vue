<template>
  <v-app>
    <v-content>
      <v-data-table
                     :headers="_organization_headers"
                     :items="organizations"
                     :items-per-page="itemsPerPage"
                     hide-default-footer
                     class="elevation-1 grey lighten-5"
      >
        <template v-slot:top>
          <v-divider></v-divider>
        <v-toolbar
            text
            color="rgba(128, 101, 166, 0.22)"
        >
          <v-toolbar-title>Таблица организаций-контрагентов</v-toolbar-title>
          <v-divider
              class="mx-4"
              inset
              vertical
          ></v-divider>
          <v-text-field
              v-model="itemsPerPage"
              color="#6A76AB"
              type="number"
              hide-details
              outlined
              dense
              label="Число отображаемых элементов"
              class="shrink"
              @input="beforeUpdatePage"
          ></v-text-field>
          <v-spacer></v-spacer>
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
                  <v-card-title>{{editedIndex>-1 ? "Редактировать организацию-контрагента": "Добавить организацию-контрагента"}}</v-card-title>
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
                          :rules="[rules.required]"
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
                      <v-text-field
                          color="#6A76AB"
                          clearable
                          outlined
                          v-model="editedOrganization.inn" type="text" label="ИНН"
                          v-mask="'##########'"
                          :rules="[rules.inn, rules.required]"></v-text-field>
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
        </v-toolbar>
          <v-divider></v-divider>
        </template>
        <template v-slot:[`header.name`]="{ header }">
          {{ header.text }}
          <v-spacer></v-spacer>
          <template>
            <v-text-field outlined
                          color="#6A76AB"
                          dense
                          v-model="filterValues.name"
                          label="По названию"
                          clearable
                          class="filter-input"
                          style="font-size: 0.9rem;"
                          @input="beforeUpdatePage"
            ></v-text-field>
          </template>
        </template>
        <template v-slot:[`header.address`]="{ header }">
          {{ header.text }}
          <v-spacer></v-spacer>
          <template>
            <v-text-field outlined
                          color="#6A76AB"
                          dense
                          v-model="filterValues.address"
                          label="По адресу организации"
                          clearable
                          class="filter-input"
                          style="font-size: 0.9rem;"
                          @input="beforeUpdatePage"
            ></v-text-field>
          </template>
        </template>
        <template v-slot:[`header.inn`]="{ header }">
          {{ header.text }}
          <v-spacer></v-spacer>
          <template>
            <v-text-field outlined
                          clearable
                          dense
                          color="#6A76AB"
                          label="По ИНН"
                          v-mask="'##########'"
                          v-model="filterValues.inn"
                          class="filter-input"
                          style="font-size: 0.9rem;"
                          @change="beforeUpdatePage"/>
          </template>
        </template>
        <template v-if="isAdmin" v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item);" style="color: #6A76AB">mdi-pencil</v-icon>
          <v-icon small text @click="deleteOrganization(item)" large style="color: darkred">
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

    </v-content>
  </v-app>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import "vue-simple-alert/lib/index";
import {rules} from "@/pages/source/rules";
import {setOrganizationsFilters} from "@/pages/source/filters";
import {Organization} from "@/pages/source/interfaces";

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
        {text: "Название организации", value: "name", sortable: false, show: true,  class: "with-divider", cellClass: 'with-divider'},
        {text: "Адресс", value: "address", sortable: false, show: true,  class: "with-divider", cellClass: 'with-divider'},
        {text:  "ИНН", value: "inn", sortable: false, show: true,  class: "with-divider", cellClass: 'with-divider'},
        { text: "Действия", value: "actions", sortable: false, show: this.$store.state.users.user.isAdmin,  class: "with-divider", cellClass: 'with-divider'}
      ],
      dialog: false,
      editedIndex: -1,
      rules
    };
  },

  computed: {
    organizations(){
      return this.$store.state.counterparties.allOrganizations
    },
    isAdmin(): boolean {
      return this.$store.state.users.user.isAdmin
    },
    totalPages(){
      return this.$store.state.counterparties.totalPages;
    },
    totalElements(){
      return this.$store.state.counterparties.totalElements;
    },
    _organization_headers () : {text: string, value: string, sortable: boolean, show: boolean}[] {
      return this.organization_headers.filter(x => x.show)
    }
  },
  methods: {
    saveOrganization () {
      let form: any = this.$refs.form
      const valid = form.validate();
      if (valid) {
        if (this.editedIndex > -1) {
          const oldValue = this.organizations[this.editedIndex];
          const newValue = this.editedOrganization;
          if (oldValue.name !== newValue.name || oldValue.address !== newValue.address || oldValue.inn !== newValue.inn) {
            const data = {
              id: this.editedOrganization.id,
              name: this.editedOrganization.name,
              address: this.editedOrganization.address,
              inn: this.editedOrganization.inn
            }
            this.$store.dispatch('counterparties/putOrganization', data).then(()=> {
              this.$alert("Изменения сохранены успешно!", '', 'success')
              this.beforeUpdatePage()
              this.closeForm()
            }).catch(()=> this.$alert("Изменения не сохранены, проверьте правильность заполнения полей!", '', 'error'))
          }
          Object.assign(this.organizations[this.editedIndex], this.editedOrganization)
          this.closeForm()
        } else {
          const data = {
            name: this.editedOrganization.name,
            address: this.editedOrganization.address,
            inn: this.editedOrganization.inn
          }
          this.$store.dispatch('counterparties/addNewOrganization', data).then(()=> {
            this.$alert("Организация добавлена успешно!", '', 'success')
            this.beforeUpdatePage()
            this.closeForm()
          }).catch(()=>
              this.$alert("Не удалось добавить организацию, проверьте правильность заполнения полей!", '', 'error')
          )
        }
      }
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
    deleteOrganization (item: any) {
      this.editedIndex = this.organizations.indexOf(item)
      this.editedOrganization = Object.assign({}, item)
      const id = this.editedOrganization.id
      this.$confirm('Вы действительно хотите удалить данную организацию?', '','warning').then(()=>
          this.$store.dispatch('counterparties/deleteOrganization', id).then(()=>{
            if (this.page == this.totalPages && this.totalElements == (this.page - 1) * this.itemsPerPage + 1) {
              this.page--
            }
            this.updatePage()
            this.closeForm();
          }).catch(()=> this.$alert('Данная организация не может быть удалена', '', 'error')))
      this.closeForm()
    },
    beforeUpdatePage() {
      this.page = 1;
      this.updatePage();
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
        const arr = setOrganizationsFilters(this.filterValues);
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

<style>

</style>
