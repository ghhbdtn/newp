<template>
  <v-app>
    <v-main>
      <v-data-table  @click:row="($event, {item})=>editItem(item)"
                     :headers="user_headers"
                     :items="users"
                     :items-per-page="itemsPerPage"
                     hide-default-footer
                     no-data-text="Ничего не найдено"
                     class="elevation-1 grey lighten-5"
      >
        <template v-slot:top>
          <v-divider></v-divider>
          <v-toolbar
              text
              color="rgba(128, 101, 166, 0.22)"
          >
            <v-toolbar-title>Список всех пользователей</v-toolbar-title>
            <v-divider
                class="mx-4"
                inset
                vertical
            ></v-divider>
            <v-text-field
                v-model="itemsPerPage"
                color="#6A76AB"
                label="Число отображаемых элементов"
                type="number"
                hide-details
                outlined
                dense
                class="shrink"
                min="0"
                @input="beforeUpdatePage"
            ></v-text-field>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-divider></v-divider>
        </template>
        <template v-slot:[`header.fullName`]="{ header }">
          {{ header.text }}
          <v-spacer></v-spacer>
          <template>
            <v-text-field outlined
                          color="#6A76AB"
                          v-model="filterValues.fullName"
                          label="По ФИО"
                          clearable
                          class="filter-input"
                          dense
                          style="font-size: 0.9rem;"
                          @input="beforeUpdatePage"
            ></v-text-field>
          </template>
        </template>
        <template v-slot:[`header.login`]="{ header }">
          {{ header.text }}
          <v-spacer></v-spacer>
          <template>
            <v-text-field outlined
                          color="#6A76AB"
                          v-model="filterValues.login"
                          label="По логину"
                          clearable
                          class="filter-input"
                          dense
                          style="font-size: 0.9rem;"
                          @input="beforeUpdatePage"
            ></v-text-field>
          </template>
        </template>
        <template v-slot:[`item.isAdmin`]="{ item }">
          <v-simple-checkbox
              v-model="item.isAdmin"
              disabled
          ></v-simple-checkbox>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item);" style="color: #6A76AB">mdi-pencil</v-icon>
          <v-icon small text @click.stop="deleteItem(item)" large style="color: darkred">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
      <template v-if="users.length > 0">
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
        <v-card>
          <v-card-text>
            <v-form ref="form" style="background-color: rgb(255,255,255)">
              <v-container>
                <v-card-title>Редактировать пользователя</v-card-title>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                        color="#6A76AB"
                        clearable
                        outlined
                        v-model="editedUser.fullName"
                        label="ФИО"
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
                        v-model="editedUser.login"
                        :rules="[rules.required, rules.minLength]"
                        required
                        label="Имя пользователя"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                        color="#6A76AB"
                        clearable
                        outlined
                        v-model="editedUser.terminationDate"
                        v-mask="'##.##.####'"
                        placeholder="ДД.ММ.ГГГГ"
                        :rules="[rules.date]"
                        label="Дата прекращения действия"
                                  ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                  <v-text-field
                      v-model="editedUser.newPassword"
                      label="Сменить пароль"
                      @click:append="() => (value = !value)"
                      :type="value ? 'password' : 'text'"
                      :append-icon="value ? 'mdi-eye-off' : 'mdi-eye'"
                      color="#6A76AB"
                      clearable
                      outlined
                      :rules="[rules.password, rules.stringLen]"
                      placeholder="Новый пароль"
                  ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-checkbox
                        color="#6A76AB"
                        clearable
                        outlined
                        v-model="editedUser.isAdmin"
                        label="Назначить администратором"></v-checkbox>
                  </v-col>
                </v-row>
                <v-card-actions>
                  <v-btn  color="#6A76AB" dark @click="save">Сохранить</v-btn>
                  <v-btn color="red" dark @click.stop="close">Отменить</v-btn>
                </v-card-actions>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>

</template>

<script lang="ts">

import {defineComponent} from "vue";
import {rules} from "@/pages/source/rules";
import {setUsersFilters} from "@/pages/source/filters";
import {User} from "@/pages/source/interfaces";
import {messages} from "@/pages/source/messages";

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "UsersPage",
  data() {
    return {
      user: {
        id: -1,
        fullName: "",
        login: "",
        password: "",
        terminationDate: "",
        newPassword: "",
        isAdmin: false
      } as User,
      editedUser: {
        id: -1,
        fullName: "",
        login: "",
        password: "",
        terminationDate: "",
        newPassword: "",
        isAdmin: false
      } as User,
      user_headers: [
        {text: "ФИО", align: "start", value: "fullName", class: "with-divider", cellClass: 'with-divider', sortable: false},
        {text: "Имя пользователя", align: "start", value: 'login', class: "with-divider", cellClass: 'with-divider', sortable: false},
        {text: "Дата прекращения действия", align: "start", value: "terminationDate", class: "with-divider", cellClass: 'with-divider', sortable: false},
        {text: "Администратор", align: "start", value: "isAdmin", class: "with-divider", cellClass: 'with-divider', sortable: false},
        {text: "Действия", align: "start", value: "actions", class: "with-divider", cellClass: 'with-divider', sortable: false},
      ],
      page: 1,
      itemsPerPage: 10,
      filterValues: {
        fullName: "",
        login: ""
      },
      editedIndex: -1,
      dialog: false,
      value: true,
      rules
    }
  },
  computed: {
    users() {
      return this.$store.state.users.all
    },
    totalPages() {
      return this.$store.state.users.totalPages;
    },
    totalElements() {
      return this.$store.state.users.totalElements;
    }
  },
  methods: {
    editItem(item: any) {
      this.editedIndex = this.users.indexOf(item)
      this.editedUser = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem(item: any) {
      this.editedUser = Object.assign({}, item);
      if (this.editedUser.isAdmin){
        this.$alert(messages.DELETE_ADMIN, '', 'error')
      } else {
        this.$confirm(messages.DELETE_USER_CONFIRM, '', 'warning').then(() =>
            this.$store.dispatch('users/deleteUser', this.editedUser.id).then(() => {
              this.close();
              if (this.page == this.totalPages && this.totalElements == (this.page - 1) * this.itemsPerPage + 1) {
                this.page--
              }
              if (this.page < 1) this.beforeUpdatePage()
              else this.updatePage()
            }).catch(() => this.$alert(messages.FAILED_DELETE_USER, '', 'error'))).catch(() => {
        })
      }
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedUser = Object.assign({}, this.user)
        this.editedIndex = -1
      })
    },
    save() {
      let form: any = this.$refs.form
      if(form.validate) {
        const oldValue = this.users[this.editedIndex];
        const newValue = this.editedUser;
        if (oldValue.fullName !== newValue.fullName ||
            oldValue.login !== newValue.login ||
            oldValue.terminationDate !== newValue.terminationDate ||
            oldValue.isAdmin !== newValue.isAdmin || oldValue.newPassword !== newValue.newPassword) {
          let data = {};
          if (newValue.newPassword !== '' && newValue.newPassword != null) {
            data = {
              fullName: newValue.fullName,
              login: newValue.login,
              terminationDate: newValue.terminationDate,
              id: newValue.id,
              isAdmin: newValue.isAdmin,
              newPassword: newValue.newPassword
            }
          } else {
            data = {
              fullName: newValue.fullName,
              login: newValue.login,
              terminationDate: newValue.terminationDate,
              id: newValue.id,
              isAdmin: newValue.isAdmin
            }
          }
          this.$store.dispatch('users/putUser', data).then(()=>{
            this.$alert(messages.SAVED_CHANGES, '', 'success')
            this.beforeUpdatePage()
            this.close()
          }).catch(()=> this.$alert(messages.FAILED_CHANGES, '', 'error'))
        }
      }
    },
    beforeUpdatePage() {
      this.page = 1;
      this.updatePage();
    },
    updatePage() {
      const page = this.page - 1;
      const size = this.itemsPerPage;
      if ((this.filterValues.fullName == null || this.filterValues.fullName === "") &&
          (this.filterValues.login == null || this.filterValues.login === "")) {
        const data = {
          page: page,
          size: size
        };
        this.$store.dispatch('users/allUsers', data)
      } else {
        const arr = setUsersFilters(this.filterValues);
        let page1 = this.page - 1
        if (this.totalPages == 1) {
          page1 = 0
          this.page = 1;
        }
        const data = {
          filters: arr,
          page: page1,
          size: size
        };
        this.$store.dispatch('users/allUsers', data)
      }
    }
  },
  beforeCreate() {
    this.$store.dispatch('users/allUsers', {})
  }
});
</script>

<style>

</style>
