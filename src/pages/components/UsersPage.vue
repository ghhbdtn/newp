<template>
  <v-app>
    <v-main>
      <v-data-table :headers="userHeaders"
                    :items="users"
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
            <v-toolbar-title>Список всех пользователей</v-toolbar-title>
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
        <template #[`header.fullName`]="{ header }">
          {{ header.text }}
          <v-spacer/>
          <template>
            <v-text-field
                v-model="filterValues.fullName"
                class="filter-input"
                clearable
                color="#6A76AB"
                dense
                label="По ФИО"
                outlined
                style="font-size: 0.9rem;"
                @input="beforeUpdatePage"
            />
          </template>
        </template>
        <template #[`header.login`]="{ header }">
          {{ header.text }}
          <v-spacer/>
          <template>
            <v-text-field
                v-model="filterValues.login"
                class="filter-input"
                clearable
                color="#6A76AB"
                dense
                label="По логину"
                outlined
                style="font-size: 0.9rem;"
                @input="beforeUpdatePage"
            />
          </template>
        </template>
        <template #[`item.isAdmin`]="{ item }">
          <v-simple-checkbox
              v-model="item.isAdmin"
              disabled
          />
        </template>
        <template #[`item.actions`]="{ item }">
          <v-icon class="mr-2" small style="color: #6A76AB" @click="editItem(item);">
            mdi-pencil
          </v-icon>
          <v-icon large small style="color: darkred" text @click.stop="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
      <template v-if="users.length > 0">
        <div>
          <v-pagination
              v-model="page"
              :length="totalPages"
              color="#6A76AB"
              @input="updatePage"
          />
        </div>
      </template>
      <v-dialog v-model="dialog">
        <v-card>
          <v-card-text>
            <v-form ref="form" style="background-color: rgb(255,255,255)">
              <v-container>
                <v-card-title>Редактировать пользователя</v-card-title>
                <v-row>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                        v-model="editedUser.fullName"
                        :rules="[rules.required, rules.stringLen]"
                        clearable
                        color="#6A76AB"
                        label="ФИО"
                        name="name"
                        outlined
                        required
                        style="text-decoration-color: #303234; text-align: start"
                        type="input"
                    />
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                        v-model="editedUser.login"
                        :rules="[rules.required, rules.stringLen, rules.minLength]"
                        clearable
                        color="#6A76AB"
                        label="Имя пользователя"
                        outlined
                        required
                    />
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                        v-model="editedUser.terminationDate"
                        v-mask="'##.##.####'"
                        :rules="[rules.date]"
                        clearable
                        color="#6A76AB"
                        label="Дата прекращения действия"
                        outlined
                        placeholder="ДД.ММ.ГГГГ"
                    />
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                        v-model="editedUser.newPassword"
                        :append-icon="isPasswordShown ? 'mdi-eye-off' : 'mdi-eye'"
                        :rules="[rules.password, rules.stringLen]"
                        :type="isPasswordShown ? 'password' : 'text'"
                        clearable
                        color="#6A76AB"
                        label="Сменить пароль"
                        outlined
                        placeholder="Новый пароль"
                        @click:append="() => (isPasswordShown = !isPasswordShown)"
                    />
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-checkbox
                        v-model="editedUser.isAdmin"
                        clearable
                        color="#6A76AB"
                        label="Назначить администратором"
                        outlined
                    />
                  </v-col>
                </v-row>
                <v-card-actions>
                  <v-btn color="#6A76AB" dark @click="save">Сохранить</v-btn>
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
import {VForm} from "@/formType";
import {headers} from "@/pages/source/componentsHeaders";

export default defineComponent({
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
      userHeaders: headers.userHeaders,
      page: 1,
      itemsPerPage: 10,
      filterValues: {
        fullName: "",
        login: ""
      },
      editedIndex: -1,
      dialog: false,
      isPasswordShown: true,
      rules
    }
  },
  computed: {
    users() {
      return this.$store.state.users.all;
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
      this.editedIndex = this.users.indexOf(item);
      this.editedUser = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item: any) {
      this.editedUser = Object.assign({}, item);
      if (this.editedUser.isAdmin) {
        this.$alert(messages.DELETE_ADMIN, '', 'error');
      } else {
        this.$confirm(messages.DELETE_USER_CONFIRM, '', 'warning')
            .then(() => this.$store.dispatch('users/deleteUser', this.editedUser.id)
                .then(() => {
                  this.close();
                  if (this.page == this.totalPages && this.totalElements == (this.page - 1) * this.itemsPerPage + 1) {
                    this.page--;
                  }
                  if (this.page < 1) this.beforeUpdatePage();
                  else this.updatePage();
                })
                .catch(() => this.$alert(messages.FAILED_DELETE_USER, '', 'error'))
            )
            .catch(() => {})
      }
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedUser = Object.assign({}, this.user);
        this.editedIndex = -1;
      })
    },
    save() {
      let form: VForm = this.$refs.form as VForm;
      if (form.validate()) {
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
            };
          } else {
            data = {
              fullName: newValue.fullName,
              login: newValue.login,
              terminationDate: newValue.terminationDate,
              id: newValue.id,
              isAdmin: newValue.isAdmin
            };
          }
          this.$store.dispatch('users/putUser', data)
              .then(() => {
                this.$alert(messages.SAVED_CHANGES, '', 'success');
                this.beforeUpdatePage();
                this.close();
              })
              .catch(() =>
                  this.$alert(messages.FAILED_CHANGES, '', 'error')
              );
        }
      }
    },
    beforeUpdatePage() {
      this.page = 1;
      this.updatePage();
    },
    updatePage() {
      let currentPage = this.page - 1;
      const size = this.itemsPerPage;
      const filtersList = setUsersFilters(this.filterValues);
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
        this.$store.dispatch('users/allUsers', data);
      }
    }
  },
  beforeCreate() {
    this.$store.dispatch('users/allUsers', {});
  }
});
</script>
