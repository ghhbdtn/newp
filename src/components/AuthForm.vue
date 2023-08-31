<template>
  <v-form ref="form" class="fields">
    <v-text-field
        v-model="username"
        :rules="[rules.required]"
        color="#6A76AB"
        label="Имя пользователя"
        required
        type="text"
    />
    <v-text-field
        v-model="password"
        :append-icon="isPasswordShown ? 'mdi-eye-off' : 'mdi-eye'"
        :rules="[rules.required]"
        :type="isPasswordShown ? 'password' : 'text'"
        color="#6A76AB"
        label="Пароль"
        required
        @click:append="togglePasswordVisibility"
    />
    <div class="red--text">{{ errorMessage }}</div>
    <v-card-actions style="justify-content: center">
      <v-btn class="mt-4" color="#6A76AB" @click="login">Вход</v-btn>
    </v-card-actions>
    <div class="grey--text mt-4" @click="switchToRegistration">
      Еще не зарегистрированы? Регистрация
    </div>
  </v-form>
</template>

<script lang="ts">
import {rules} from "@/pages/source/rules";
import {VForm} from "@/formType";
import {messages} from "@/pages/source/messages";
import {defineComponent} from "vue";

export default defineComponent({
  name: "AuthForm",
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
      isPasswordShown: true,
      rules: rules
    };
  },
  methods: {
    login: function () {
      let form: VForm = this.$refs.form as VForm;
      const valid = form.validate();
      if (valid) {
        let data = {
          login: this.username,
          password: this.password
        };
        this.$store.dispatch('users/signIn', data)
            .then(() => {
              this.$alert(messages.SUCCESS_LOGIN, '', 'success');
            })
            .catch(() => {
              if (this.errStatus === 401)
                this.errorMessage = messages.INVALID_DATA;
              else
                this.errorMessage = messages.FAILED_LOGIN;
            });
      }
    },
    togglePasswordVisibility() {
      this.isPasswordShown = !this.isPasswordShown;
    },
    switchToRegistration() {
      this.$emit("switch-mode", "RegisterForm");
    }
  },
  computed: {
    errStatus() {
      return this.$store.state.users.status;
    },
  },
});
</script>
