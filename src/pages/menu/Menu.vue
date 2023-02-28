<template>
<div id="menu">
<v-toolbar>
  <h1>Меню</h1>
  <nav>
    <router-link tag="a" type="contract" to="/menu/contracts" >
                 <span @click ="contract">Договоры</span></router-link> |
    <router-link tag="a" to="/menu/counterparty_organizations">Организации-Контрагенты</router-link> |
    <router-link tag="a" to="/menu/reports">Отчеты</router-link> |
    <router-link tag="a" to="/menu/admin">Администрирование</router-link>
  </nav>
  </v-toolbar>
<router-view />
</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Menu"
,
methods:
    {
      contract: function () {

        this.$store.dispatch('contract').then(()=>this.$router.push('/menu/contracts'));

        // this.$store.dispatch('register', data)
        //     .then(() => this.$router.push('/menu'))
        //     .catch((err:String) => console.log(err))
      }
    }
})

</script>

<style scoped>
#menu {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #303234;
}

nav a:active {
  background-color: rgb(210, 123, 137);
  cursor: pointer;
  font-weight: bold;
  color: #303234;
  padding: 5px;}
nav a {
  background-color: rgba(217, 178, 182, 0.97);
  cursor: pointer;
  font-weight: bold;
  color: #303234;
  padding: 5px;
}
nav{
  top: 80px;
  position: static;
}
</style>
