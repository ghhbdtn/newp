<template>
  <v-app >
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="#6A76AB">
                <v-toolbar-title>{{isRegister ? stateObj.register.name : stateObj.login.name}}</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <form ref="form" @submit.prevent="isRegister ? register() : login()">
                  <v-text-field v-if="isRegister"
                                color="#6A76AB"
                                v-model="fullName"
                                name="name"
                                label="ФИО"
                                type="text"
                                placeholder="ФИО"
                                :rules="[rules.required]"
                                :aria-required="true"
                                required
                  ></v-text-field>
                  <v-text-field
                      v-model="username"
                      color="#6A76AB"
                      name="username"
                      label="Имя пользователя"
                      type="text"
                      placeholder="Имя пользователя"
                      :rules="isRegister ? [rules.minLength, rules.required] : [rules.required]"
                      required
                  ></v-text-field>
                  <v-text-field
                      v-model="password"
                      color="#6A76AB"
                      name="password"
                      label="Пароль"
                      placeholder="Пароль"
                      @click:append="() => (value = !value)"
                      :type="value ? 'password' : 'text'"
                      :append-icon="value ? 'mdi-eye-off' : 'mdi-eye'"
                      :rules="isRegister ? [rules.password, rules.required] : [rules.required]"
                      required
                  ></v-text-field>
                  <v-text-field v-if="isRegister"
                                color="#6A76AB"
                                v-model="confirmPassword"
                                name="confirmPassword"
                                label="Повторите пароль"
                                type="password"
                                placeholder="Повторите пароль"
                                :rules="[rules.required]"
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
import Vue from "vue";
import {rules} from "@/pages/source/rules";
export default Vue.extend({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Login",

data() {
    return {
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "",
      isRegister : false,
      errorMessage: "",
      stateObj: {
        register :{
          name: 'Регистрация',
          message: 'Уже зарегестрированы? Вход.'
        },
        login : {
          name: 'Вход',
          message: 'Еще не зарегестрированы? Регистрация'
        }
      },
      value: true,
      rules
    };
  },
  methods: {
    login() {
        let login = this.username
        let password = this.password
        let data = {
          login: login,
          password: password
        }
      console.log(location.hostname)
        this.$store.dispatch('users/signIn', data)
            .then(() => {
              console.log(this.$store.state.users.user.id)
              location.replace("menu.html")
            })
            .catch(err => {
              if (this.errStatus  == 401) {
                this.errorMessage = "Неверное имя пользователя или пароль"
              } else this.errorMessage = err})
    },

    register: function () {
        if (this.password == this.confirmPassword) {
          this.isRegister = false;
          this.errorMessage = "";
          (this.$refs.form as HTMLFormElement).reset();
          const fullName = this.fullName;
          const login = this.username;
          const password = this.password;
          const data = {
            fullName: fullName,
            login: login,
            password: password
          }
          this.$store.dispatch('users/signUp', data ).then(() => this.login()).catch(err => {
            if (this.errStatus == 409) {
              this.errorMessage = "Пользователь с таким логином уже существует"
              console.log(this.errStatus)
            } else this.errorMessage = err
          })
        } else {
          this.errorMessage = "Пароли не совпадают"
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
    },
    errStatus() {
      return this.$store.state.users.status
    }
  }
});
</script>

<style scoped>

</style>
