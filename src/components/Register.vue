<template>
  <div>
    <h4>Регистрация</h4>
    <form @submit.prevent="register">
      <label>Имя</label>
      <div><input required v-model.trim="first_name" type="text" placeholder="Имя"/></div>
      <label>Фамилия</label>
      <div><input required v-model.trim="last_name" type="text" placeholder="Фамилия"/></div>
      <label >Отчество</label>
      <div><input v-model.trim="middle_name" type="text" placeholder="Отчество"/></div>
      <label>Логин</label>
      <div><input required v-model="log" type="login" placeholder="Логин"/></div>
      <label>Пароль</label>
      <div><input required v-model="password" type="password" placeholder="Пароль"/></div>
      <label for="password-confirm">Повторите пароль</label>
      <div>
        <input id="password-confirm" type="password" v-model="password_confirmation" required>
      </div>
      <div>
        <button type="submit">Зарегистрироваться</button>
      </div>
    </form></div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend(  {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Register",
  data() {
    return{
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      is_admin: null
    }
  },
  methods: {
    register: function() {
      let data = {
        name: this.name,
        email: this.email,
        password: this.password,
        is_admin: this.is_admin
      }
      this.$store.dispatch('register', data)
          .then(() => this.$router.push('/menu'))
          .catch((err:String) => console.log(err))
    }
  }
})
</script>

<style scoped>

</style>
