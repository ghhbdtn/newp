<template>
  <v-app >
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="#6A76AB">
                <v-toolbar-title>{{isRegister ? stateObj.register.name : stateObj.login.name}} form</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <form ref="form" @submit.prevent="isRegister ? register() : login()">
                  <v-text-field v-if="isRegister"
                                v-model="user.fullName"
                                name="name"
                                label="ФИО"
                                type="text"
                                placeholder="name"
                                required
                  ></v-text-field>
                  <v-text-field
                      v-model="user.username"
                      name="username"
                      label="Имя пользователя"
                      type="text"
                      placeholder="username"
                      required
                  ></v-text-field>

                  <v-text-field
                      v-model="user.password"
                      name="password"
                      label="Пароль"
                      type="password"
                      placeholder="password"
                      required
                  ></v-text-field>

                  <v-text-field v-if="isRegister"
                                v-model="confirmPassword"
                                name="confirmPassword"
                                label="Повторите пароль"
                                type="password"
                                placeholder="confirm password"
                                required
                  ></v-text-field>
                  <div class="red--text"> {{errorMessage}}</div>
                  <v-btn type="submit" class="mt-4" color="#6A76AB" value="Войти">{{isRegister ? stateObj.register.name : stateObj.login.name}}</v-btn>
                  <div class="grey--text mt-4" v-on:click="isRegister = !isRegister;">
                    {{toggleMessage}}
                  </div>
                </form>
              </v-card-text>
            </v-card>

          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
interface User {
  id: number,
  fullName: string,
  username: string,
  password: string,
}
import Vue from "vue";
export default Vue.extend({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Login",

data() {
    return {
      user: {
        id: 0,
        fullName: "",
        username: "",
        password: "",
      } as User,
      confirmPassword: "",
      isRegister : false,
      errorMessage: "",
      //users: [] as User[],
      stateObj: {
        register :{
          name: 'Зарегестрироваться',
          message: 'Уже авторизированы? Вход.'
        },
        login : {
          name: 'Вход',
          message: 'Регистрация'
        }
      }
    };
  },
  methods: {
    login() {
      let login = this.user.username
      let password = this.user.password
      let data = {
        login: login,
        password: password
      }
      this.$store.dispatch('users/signIn', data )
          .then(() =>{console.log(this.$store.state.users.user)
            //location.replace("pages/menu/menu.html")
          this.$router.replace("/menu")})
          .catch(err => this.stateObj.login.message = err)
    },

    register: function () {
      if (this.user.password == this.confirmPassword) {
        this.isRegister = false;
        this.errorMessage = "";
        (this.$refs.form as HTMLFormElement).reset();
        const fullName = this.user.fullName;
        const login = this.user.username;
        const password = this.user.password;
        const data = {
          fullName: fullName,
          login: login,
          password: password
        }
        this.$store.dispatch('users/signUp', data )
            .then(() => location.replace("pages/menu/menu.html"))
            .catch(err => this.stateObj.login.message = err)
      } else {
        this.errorMessage = "password did not match"
      }
    }
  },
  computed: {
    toggleMessage : function(): string {
      if (!this.isRegister) {
        return this.stateObj.login.message
      } else {
        return this.stateObj.register.message
      }
    }
  }
});
</script>

<style scoped>

</style>
