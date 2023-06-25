<template>
  <v-app>
    <v-content>
      <template>
        <v-col cols="10" sm="4" md="3">
          <label class="filter-label">Найти пользователя:</label>
        </v-col>
        <v-row align="center" justify="center">
          <v-col cols="6" sm="3" md="3">
            <v-text-field outlined
                          color="#6A76AB"
                          v-model="filterValues.fullName"
                          label="По ФИО"
                          clearable
                          class="filter-input"
            ></v-text-field>
          </v-col>

          <v-col cols="6" sm="3" md="3">
            <v-text-field outlined
                          color="#6A76AB"
                          v-model="filterValues.login"
                          label="По логину"
                          clearable
                          class="filter-input"
            ></v-text-field>
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
      <v-data-table  @click:row="editItem"
                     :headers="user_headers"
                     :items="users"
                     :items-per-page="itemsPerPage"
                     hide-default-footer
                     class="elevation-1"
      >
        <template v-slot:[`item.isAdmin`]="{ item }">
          <v-simple-checkbox
              v-model="item.isAdmin"
              disabled
          ></v-simple-checkbox>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item);" style="color: #6A76AB">mdi-pencil</v-icon>
          <v-icon small text @click="deleteItem(item)" large style="color: darkred">
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
                        required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                        color="#6A76AB"
                        clearable
                        outlined
                        v-model="editedUser.login"
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
                        label="Дата прекращения действия"
                                  ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                  <v-text-field
                      v-model="editedUser.newPassword"
                      label="Сменить пароль"
                      @click:append="() => (value = !value)"
                      :type="value ? 'password' : 'text'"
                      :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
                      color="#6A76AB"
                      clearable
                      outlined
                      placeholder="password"
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
                  <v-btn color="red" dark @click="close">Отменить</v-btn>
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
interface User {
  id?: number,
  fullName: string,
  login: string,
  password: string,
  terminationDate: string,
  newPassword: string,
  isAdmin: boolean
}
export default defineComponent( {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "UsersPage",

  data() {
    return{
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
        {
          text: "ФИО",
          align: "start",
          value: "fullName",
        },
        { text: "Имя пользователя", align: "start", value: 'login'},
        { text: "Дата прекращения действия", align: "start", value:  "terminationDate"},
        { text: "Администратор", align: "start", value: "isAdmin" },
        { text: "Действия", align: "start", value:  "actions"},
      ],
      page: 1,
      itemsPerPage: 10,
      filterValues: {
        fullName: "",
        login: ""
      },
      editedIndex: -1,
      dialog: false,
      value: false
    }
  },
  computed: {
    users(){
      return this.$store.state.users.all
    },
    totalPages(){
      return this.$store.state.users.totalPages;
    },
    totalElements(){
      return this.$store.state.users.totalElements;
    }
  },
  methods: {
    editItem (item: any) {
      this.editedIndex = this.users.indexOf(item)
      this.editedUser = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item: any) {
      this.editedUser = Object.assign({}, item);
      confirm('Are you sure you want to delete this item?') &&
      this.$store.dispatch('users/deleteUser', this.editedUser.id).then(() => {
        this.close();
        if (this.page == this.totalPages && this.totalElements == (this.page - 1) * this.itemsPerPage + 1) {
          this.page--
        }
        this.updatePage()
      })
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedUser = Object.assign({}, this.user)
        this.editedIndex = -1
      })
    },

    save () {
      const oldValue = this.users[this.editedIndex];
      const newValue = this.editedUser;
      if(oldValue.fullName !== newValue.fullName ||
          oldValue.login !== newValue.login ||
          oldValue.terminationDate !== newValue.terminationDate ||
          oldValue.isAdmin !== newValue.isAdmin){
        let data = {};
        if (newValue.newPassword !== '' && newValue.newPassword !== null) {
          data = {
            fullName: newValue.fullName,
            login: newValue.login,
            terminationDate: newValue.terminationDate,
            id: newValue.id,
            isAdmin: newValue.isAdmin,
            newPassword: newValue.newPassword
          }
        }
        else {
          data = {
            fullName: newValue.fullName,
            login: newValue.login,
            terminationDate: newValue.terminationDate,
            id: newValue.id,
            isAdmin: newValue.isAdmin
          }
        }
        this.$store.dispatch('users/putUser',data)
      }
      //Object.assign(this.users[this.editedIndex], this.editedUser)
      this.close()
      this.updatePage()
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
        const arr = [] as {}[];
        for (var filter in this.filterValues) {
          switch (filter) {
            case 'fullName':
              if (this.filterValues.fullName != null && this.filterValues.fullName !== "") {
                const nameFilter = {
                  key: 'FULL_NAME',
                  targetEntity: "USER",
                  operator: "LIKE",
                  value: this.filterValues.fullName
                }
                arr.push(nameFilter)
              }
              break;
            case 'login':
              if (this.filterValues.login != null && this.filterValues.login !== "") {
                const loginFilter = {
                  key: 'LOGIN',
                  targetEntity: "USER",
                  operator: "LIKE",
                  value: this.filterValues.login
                }
                arr.push(loginFilter)
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
        this.$store.dispatch('users/allUsers', data)
      }
    }
  },
  beforeCreate() {
    this.$store.dispatch('users/allUsers', {})
  }
});
</script>


<style scoped>

</style>
