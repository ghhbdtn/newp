<template>
  <v-app>
    <v-content>
      <v-data-table  @click:row="editItem"
                     :headers="user_headers"
                     :items="users"
                     :items-per-page="5"
                     class="elevation-1"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item);" style="color: darkcyan">mdi-pencil</v-icon>
          <v-icon small text @click="deleteItem(item)" large style="color: darkred">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
      <v-dialog v-model="dialog">
        <v-card>
          <v-card-text>
            <v-form ref="form" style="background-color: rgb(255,255,255)">
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
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
                        v-model="editedUser.login"
                        label="Имя пользователя"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedUser.terminationDate" type="date" label="Дата прекращения действия"
                                  ></v-text-field>
                  </v-col>
                </v-row>
                <v-card-actions>
                  <v-btn color="primary" @click="save">Сохранить</v-btn>
                  <v-btn color="red" @click="close">Отменить</v-btn>
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
  newPassword: string
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
        newPassword: ""
      } as User,
      editedUser: {
        id: -1,
        fullName: "",
        login: "",
        password: "",
        terminationDate: "",
        newPassword: ""
      } as User,
      user_headers: [
        {
          text: "ФИО",
          align: "start",
          value: "fullName",
        },
        { text: "Имя пользователя", align: "start", value: 'login'},
        { text: "Дата прекращения действия", align: "start", value:  "terminationDate"},
        { text: "Действия", align: "start", value:  "actions"},
      ],
      //users: [] as User[],
      editedIndex: -1,
      dialog: false,
    }
  },
  computed: {
    users(){
      const listOfUsers = this.$store.state.users.all
      return listOfUsers
    }
  },
  methods: {
    editItem (item: any) {
      this.editedIndex = this.users.indexOf(item)
      this.editedUser = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item: any) {
      const index = this.users.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.users.splice(index, 1)
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedUser = Object.assign({}, this.user)
        this.editedIndex = -1
      })
    },

    save () {
      if (this.editedIndex > -1 ) {
        Object.assign(this.users[this.editedIndex], this.editedUser)
      } else {
        this.users.push(this.editedUser)
      }
      this.close()
    }
  },
  beforeCreate() {
    this.$store.dispatch('users/allUsers', {})
  }
});
</script>


<style scoped>

</style>
