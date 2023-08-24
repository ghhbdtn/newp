<template>
  <v-form ref="form">
    <v-text-field
        v-model="fullName"
        label="ФИО"
        type="text"
        :rules="[rules.required, rules.stringLen]"
        required
        color="#6A76AB"
    />
    <v-text-field
        v-model="username"
        label="Имя пользователя"
        type="text"
        :rules="[rules.minLength, rules.required, rules.stringLen]"
        required
        color="#6A76AB"
    />
    <v-text-field
        v-model="password"
        label="Пароль"
        :type="isPasswordShown ? 'password' : 'text'"
        @click:append="togglePasswordVisibility"
        :append-icon="isPasswordShown ? 'mdi-eye-off' : 'mdi-eye'"
        :rules= "[rules.password, rules.required, rules.stringLen]"
        required
        color="#6A76AB"
    />
    <v-text-field
        v-model="confirmPassword"
        label="Повторите пароль"
        type="password"
        :rules="[rules.required]"
        required
        color="#6A76AB"
    />
    <div class="red--text">{{ errorMessage }}</div>
    <v-card-actions style="justify-content: center">
      <v-btn @click="register" class="mt-4" color="#6A76AB">Регистрация</v-btn>
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
    register: function() {
      let form: VForm = this.$refs.form as VForm
      const valid = form.validate()
      if (valid) {
        if (this.password === this.confirmPassword) {
          this.errorMessage = "";
          const registerData = {
            fullName: this.fullName,
            login: this.username,
            password: this.password
          }
          const loginData = {
            login: this.username,
            password: this.password
          }
          this.$store.dispatch('users/signUp', registerData).then(() => {
            this.$alert(messages.SUCCESS_REGISTRATION, '', 'success')
            this.$nextTick(() => {this.$store.dispatch('users/signIn', loginData).catch(() => {
              this.errorMessage = messages.FAILED_LOGIN
            })})
          }).catch(() => {
            if (this.errStatus === 409) {
              this.errorMessage = messages.EXISTING_USER
            } else this.errorMessage = messages.FAILED_REGISTRATION
          })
        } else {
          this.errorMessage = messages.DIFFERENT_PASSWORDS
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
      return this.$store.state.users.status
    },
  },
});
</script>

