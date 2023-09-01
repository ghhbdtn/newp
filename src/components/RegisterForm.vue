<template>
  <v-form ref="form">
    <v-text-field
        v-model="fullName"
        :rules="[rules.required, rules.stringLen]"
        color="#6A76AB"
        label="ФИО"
        required
        type="text"
    />
    <v-text-field
        v-model="username"
        :rules="[rules.minLength, rules.required, rules.stringLen]"
        color="#6A76AB"
        label="Имя пользователя"
        required
        type="text"
    />
    <v-text-field
        v-model="password"
        :append-icon="isPasswordShown ? 'mdi-eye-off' : 'mdi-eye'"
        :rules="[rules.password, rules.required, rules.stringLen]"
        :type="isPasswordShown ? 'password' : 'text'"
        color="#6A76AB"
        label="Пароль"
        required
        @click:append="togglePasswordVisibility"
    />
    <v-text-field
        v-model="confirmPassword"
        :rules="[rules.required]"
        color="#6A76AB"
        label="Повторите пароль"
        required
        type="password"
    />
    <div class="red--text">{{ errorMessage }}</div>
    <v-card-actions style="justify-content: center">
      <v-btn class="mt-4" color="#6A76AB" @click="register">Регистрация</v-btn>
    </v-card-actions>
    <div class="grey--text mt-4" @click="switchToLogin">
      Уже зарегистрированы? Вход
    </div>
  </v-form>
</template>

<script lang="ts">
import {rules} from "@/pages/source/rules";
import {VForm} from "@/formType";
import {messages} from "@/pages/source/messages";
import {defineComponent} from "vue";

export default defineComponent({
  name: "Registration",
  data() {
    return {
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "",
      errorMessage: "",
      isPasswordShown: true,
      rules: rules
    };
  },
  methods: {
    register: function () {
      let form: VForm = this.$refs.form as VForm;
      const valid = form.validate();
      if (valid) {
        if (this.password === this.confirmPassword) {
          this.errorMessage = "";
          const registerData = {
            fullName: this.fullName,
            login: this.username,
            password: this.password
          };
          const loginData = {
            login: this.username,
            password: this.password
          };
          this.$store.dispatch('users/signUp', registerData)
              .then(() => {
                this.$alert(messages.SUCCESS_REGISTRATION, '', 'success');
                this.$nextTick(() => {
                  this.$store.dispatch('users/signIn', loginData)
                      .catch(() => {
                        this.errorMessage = messages.FAILED_LOGIN;
                      });
                });
              })
              .catch(() => {
                if (this.errStatus === 409)
                  this.errorMessage = messages.EXISTING_USER;
                else
                  this.errorMessage = messages.FAILED_REGISTRATION;
              });
        } else {
          this.errorMessage = messages.DIFFERENT_PASSWORDS;
        }
      }
    },
    togglePasswordVisibility() {
      this.isPasswordShown = !this.isPasswordShown;
    },
    switchToLogin() {
      this.$emit("switch-mode", "AuthForm");
    }
  },
  computed: {
    errStatus() {
      return this.$store.state.users.status;
    },
  },
});
</script>
