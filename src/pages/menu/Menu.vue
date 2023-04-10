<template>
  <v-app>
<div id="menu">
<v-toolbar style="background-color: #1565C0">
  <h1 style="color: white">Меню</h1>
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
  </v-app>
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
  color: white;
}

nav a:active {
  background-color: rgb(73, 114, 154);
  cursor: pointer;
  font-weight: bold;
  color: white;
  padding: 5px;}
nav a {

  cursor: pointer;
  font-weight: bold;
  color: white;
  padding: 5px;
}
nav{
  top: 80px;
  position: static;
}
</style>
