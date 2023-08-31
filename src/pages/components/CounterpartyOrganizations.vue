<template>
  <v-app>
    <v-main>
      <v-data-table :headers="headers"
                    :items="organizations"
                    class="elevation-1 grey lighten-5"
                    hide-default-footer
                    no-data-text="Ничего не найдено"
                    @click:row="($event, {item})=>editItem(item)"
      >
        <template #top>
          <v-divider/>
          <v-toolbar
              color="rgba(128, 101, 166, 0.22)"
              height="80"
              text
          >
            <v-toolbar-title>Таблица организаций-контрагентов</v-toolbar-title>
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
            <v-dialog v-model="dialog">
              <template #activator="{ on, attrs }">
                <v-btn v-if="isAdmin"
                       class="mb-2"
                       color="#6A76AB"
                       dark
                       v-bind="attrs"
                       v-on="on"
                >Добавить
                </v-btn>
              </template>
              <v-card>
                <v-card-text>
                  <v-form ref="form" style="background-color: rgb(255,255,255)">
                    <v-container>
                      <v-card-title v-if="isAdmin">
                        {{ editedIndex > -1 ? "Редактировать организацию-контрагента" : "Добавить организацию-контрагента" }}
                      </v-card-title>
                      <v-card-title v-if="!isAdmin">Карточка организации-контрагента</v-card-title>
                      <v-row>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                              v-model="editedOrganization.name"
                              :rules="[rules.required, rules.stringLen]"
                              clearable
                              color="#6A76AB"
                              label="Название организации"
                              name="name"
                              outlined
                              required
                              style="text-decoration-color: #303234; text-align: start"
                              type="input"
                          />
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                              v-model="editedOrganization.address"
                              :rules="[rules.required, rules.stringLen]"
                              clearable
                              color="#6A76AB"
                              label="Адрес"
                              outlined
                              required
                          />
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                              v-model="editedOrganization.inn"
                              v-mask="'##########'"
                              :rules="[rules.inn, rules.required]"
                              clearable
                              color="#6A76AB"
                              label="ИНН"
                              outlined
                              required
                              type="text"
                          />
                        </v-col>
                      </v-row>
                      <v-card-actions>
                        <v-btn v-if="isAdmin" color="#6A76AB" dark @click="saveOrganization">Сохранить</v-btn>
                        <v-btn color="red" dark @click="closeForm">{{ isAdmin ? `Отменить` : `Закрыть` }}</v-btn>
                      </v-card-actions>
                    </v-container>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-toolbar>
          <v-divider/>
        </template>
        <template #[`header.name`]="{ header }">
          {{ header.text }}
          <v-spacer/>
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
        <template #[`header.address`]="{ header }">
          {{ header.text }}
          <v-spacer></v-spacer>
          <template>
            <v-text-field
                v-model="filterValues.address"
                class="filter-input"
                clearable
                color="#6A76AB"
                dense
                label="По адресу организации"
                outlined
                style="font-size: 0.9rem;"
                @input="beforeUpdatePage"
            />
          </template>
        </template>
        <template #[`header.inn`]="{ header }">
          {{ header.text }}
          <v-spacer/>
          <template>
            <v-text-field
                v-model="filterValues.inn"
                v-mask="'##########'"
                class="filter-input"
                clearable
                color="#6A76AB"
                dense
                label="По ИНН"
                outlined
                style="font-size: 0.9rem;"
                @input="beforeUpdatePage"
            />
          </template>
        </template>
        <template v-if="isAdmin" #[`item.actions`]="{ item }">
          <v-icon class="mr-2" small style="color: #6A76AB" @click="editItem(item);">mdi-pencil</v-icon>
          <v-icon large small style="color: darkred" text @click.stop="deleteOrganization(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
      <template v-if="organizations.length > 0">
        <div>
          <v-pagination
              v-model="page"
              :length="totalPages"
              color="#6A76AB"
              @input="updatePage"
          />
        </div>
      </template>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import "vue-simple-alert/lib/index";
import {rules} from "@/pages/source/rules";
import {setOrganizationsFilters} from "@/pages/source/filters";
import {Organization} from "@/pages/source/interfaces";
import {messages} from "@/pages/source/messages";
import {VForm} from "@/formType";

export default defineComponent({
  name: "CounterpartyOrganizations",
  data() {
    return {
      organization: {
        id: -1,
        name: "",
        address: "",
        inn: "",
      } as Organization,
      editedOrganization: {
        id: -1,
        name: "",
        address: "",
        inn: "",
      } as Organization,
      page: 1,
      itemsPerPage: 10,
      filterValues: {
        name: "",
        address: "",
        inn: "",
      },
      organizationHeaders: [
        {text: "Название организации", value: "name", sortable: false, show: true, class: "with-divider", cellClass: 'with-divider'},
        {text: "Адресс", value: "address", sortable: false, show: true, class: "with-divider", cellClass: 'with-divider'},
        {text: "ИНН", value: "inn", sortable: false, show: true, class: "with-divider", cellClass: 'with-divider'},
        {text: "Действия", value: "actions", sortable: false, show: this.$store.state.users.user.isAdmin, class: "with-divider", cellClass: 'with-divider'}
      ],
      dialog: false,
      editedIndex: -1,
      rules
    };
  },

  computed: {
    organizations() {
      return this.$store.state.counterparties.allOrganizations;
    },
    isAdmin(): boolean {
      return this.$store.state.users.user.isAdmin;
    },
    totalPages() {
      return this.$store.state.counterparties.totalPages;
    },
    totalElements() {
      return this.$store.state.counterparties.totalElements;
    },
    headers(): { text: string, value: string, sortable: boolean, show: boolean }[] {
      return this.organizationHeaders.filter(x => x.show);
    }
  },
  methods: {
    saveOrganization() {
      let form: VForm = this.$refs.form as VForm;
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
            };
            this.$store.dispatch('counterparties/putOrganization', data)
                .then(() => {
                  this.$alert(messages.SAVED_CHANGES, '', 'success');
                  this.beforeUpdatePage();
                  this.closeForm();
                })
                .catch(() =>
                    this.$alert(messages.FAILED_CHANGES, '', 'error')
                );
          }
          this.closeForm();
        } else {
          const data = {
            name: this.editedOrganization.name,
            address: this.editedOrganization.address,
            inn: this.editedOrganization.inn
          };
          this.$store.dispatch('counterparties/addNewOrganization', data)
              .then(() => {
                this.$alert(messages.SUCCESS_ADDING_ORGANIZATION, '', 'success');
                this.beforeUpdatePage();
                this.closeForm();
              })
              .catch(() =>
                  this.$alert(messages.FAILED_ADDING_ORGANIZATION, '', 'error')
              );
        }
      }
    },
    closeForm() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedOrganization = Object.assign({}, this.organization);
        this.editedIndex = -1;
      });
    },
    editItem(item: any) {
      this.editedIndex = this.organizations.indexOf(item);
      this.editedOrganization = Object.assign({}, item);
      this.dialog = true;
    },
    deleteOrganization(item: any) {
      this.editedIndex = this.organizations.indexOf(item);
      this.editedOrganization = Object.assign({}, item);
      const id = this.editedOrganization.id;
      this.$confirm(messages.DELETE_ORGANIZATION_CONFIRM, '', 'warning')
          .then(() =>
              this.$store.dispatch('counterparties/deleteOrganization', id)
                  .then(() => {
                    if (this.page == this.totalPages && this.totalElements == (this.page - 1) * this.itemsPerPage + 1) {
                      this.page--;
                    }
                    if (this.page < 1) this.beforeUpdatePage();
                    else this.updatePage();
                    this.closeForm();
                  })
                  .catch(() => this.$alert(messages.FAILED_DELETE_ORGANIZATION, '', 'error')))
          .catch(() => {})
      this.closeForm();
    },
    beforeUpdatePage() {
      this.page = 1;
      this.updatePage();
    },
    updatePage() {
      let currentPage = this.page - 1;
      const size = this.itemsPerPage;
      const filtersList = setOrganizationsFilters(this.filterValues);
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
        this.$store.dispatch('counterparties/allCounterpartyOrganizations', data);
      }
    }
  },
  created() {
    this.$store.dispatch('counterparties/allCounterpartyOrganizations', {});
  }
});
</script>
