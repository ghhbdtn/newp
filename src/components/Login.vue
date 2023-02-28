<template>
  <div
      class="fixed-top d-flex align-items-center justify-content-center">
    <form class="login">
      <h2 style="left: 200px; position: absolute"> Вход</h2>
      <label style="left: 200px; top: 40px; position: absolute">Имя</label>
      <input required v-model.trim="first_name" type="text" placeholder="Имя" style="left: 200px; top:60px; position: absolute"/>
      <label style="left: 200px; top: 90px; position: absolute">Фамилия</label>
      <input required v-model.trim="last_name" type="text" placeholder="Фамилия" style="left: 200px; top:110px; position: absolute"/>
      <label style="left: 200px; top: 140px; position: absolute">Отчество</label>
      <input v-model.trim="middle_name" type="text" placeholder="Отчество" style="left: 200px; top:160px; position: absolute"/>
      <label style="left: 200px; top: 190px; position: absolute">Логин</label>
      <input required v-model="log" type="login" placeholder="Логин" style="left: 200px; top:210px; position: absolute"/>
      <label style="left: 200px; top: 240px; position: absolute">Пароль</label>
      <input required v-model="password" type="password" placeholder="Пароль" style="left: 200px; top: 260px; position: absolute"/>
      <button  @submit.prevent="login" @click="login" type="submit" style="background-color: rosybrown; border-radius: 5px; left: 210px; top: 290px; position: absolute">Login</button>
    </form>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent( {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Login",
  data(){
    return{
      log: "",
      password: "",
      first_name: "",
      last_name: "",
      middle_name: ""
    }
  },
  methods: {
    login: function() {
      //this.$router.push('/menu');
      location.replace("pages/menu/menu.html");
      //this.$router.push('/menu');
      // let log = this.log
      // let password = this.password
      // this.$store.dispatch('login', {email: log, password})
      //     .then(() => this.$router.push('/menu'))
      //     .catch((err:String) => {
      //       console.log(err);
      //     })
    }
  }
})
</script>

<style scoped>
.login {
  background-color: mistyrose;
  position: absolute;
  border-radius: 10px;
  width: 500px;
  height: 400px;
  top: 200px; left: 500px;
}
</style>

