<template>
  <v-app >
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="green">
                <v-toolbar-title>{{isRegister ? stateObj.register.name : stateObj.login.name}} form</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <form ref="form" @submit.prevent="isRegister ? register() : login()">
                  <v-text-field v-if="isRegister"
                                v-model="name"
                                name="name"
                                label="Фамилия"
                                type="text"
                                placeholder="name"
                                required
                  ></v-text-field>
                  <v-text-field v-if="isRegister"
                                v-model="name"
                                name="name"
                                label="Имя"
                                type="text"
                                placeholder="name"
                                required
                  ></v-text-field>
                  <v-text-field v-if="isRegister"
                                v-model="name"
                                name="name"
                                label="Отчество"
                                type="text"
                                placeholder="name"
                                required
                  ></v-text-field>
                  <v-text-field
                      v-model="username"
                      name="username"
                      label="Имя пользователя"
                      type="text"
                      placeholder="username"
                      required
                  ></v-text-field>

                  <v-text-field
                      v-model="password"
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
                  <v-btn type="submit" class="mt-4" color="green" value="Войти">{{isRegister ? stateObj.register.name : stateObj.login.name}}</v-btn>
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
export default Vue.extend({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      confirmPassword: "",
      isRegister : false,
      errorMessage: "",
      stateObj: {
        register :{
          name: 'Register',
          message: 'Aleady have an Acoount? login.'
        },
        login : {
          name: 'Login',
          message: 'Register'
        }
      }
    };
  },
  methods: {
    login() {
      const { username } = this;
      location.replace("pages/menu/menu.html");
      console.log(username + "logged in")
    },

    register: function () {
      if (this.password == this.confirmPassword) {
        this.isRegister = false;
        this.errorMessage = "";
        (this.$refs.form as HTMLFormElement).reset();
        location.replace("pages/menu/menu.html");
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
