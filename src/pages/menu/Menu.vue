<template>
  <v-app>
    <div id="menu">
      <v-app-bar color="#6A76AB"
           dark>
        <v-toolbar-title style="font-size: x-large">Меню</v-toolbar-title>
        <v-spacer></v-spacer>
        <template v-slot:extension>
          <v-tabs align-with-title>
            <v-tab @click="contracts1"> Договоры</v-tab>
            <v-tab @click="counterparty">Организации-Контрагенты</v-tab>
            <v-tab @click="reports">Отчеты</v-tab>
            <v-menu open-on-hover offset-y transition="slide-x-transition" bottom right v-if="isAdmin1">
              <template v-slot:activator="{ on, attrs }">
                <v-btn text
               height="100%"
               variant="plain"
               v-bind="attrs" v-on="on">
                  Администрирование
                  <v-icon end>
                    mdi-menu-down
                  </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                    v-for="(item, index) in items"
                    :key="index"
                    router :to="item.path">
                  <v-list-item-action>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-tabs>
        </template>
        <v-btn icon @click="logout">
          <v-icon>mdi-exit-to-app</v-icon>
        </v-btn>
      </v-app-bar>
      <router-view /></div>
  </v-app>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Menu",
  data() {
    return {
      items: [
        { title: 'Список всех договоров', path: "/menu/admin-root/all-contracts" },
        { title: 'Список всех пользователей', path: "/menu/admin-root/users" }
      ],
    }
  },
methods:
    {
      reports: function () {
        this.$router.push("/menu/reports").catch(() => {})
      },
      counterparty: function () {
        this.$store.dispatch('counterparties/allCounterpartyOrganizations', {}).then(()=>
            this.$router.push('/menu/counterparty-organizations').catch(()=>{}))
      },
      contracts1: function () {
        const data = {};
        this.$store.dispatch('contractsStore/getAll', data).then(() => {
            this.$router.push('/menu/contracts').catch(()=>{})});
      },
      logout() {

        this.$confirm('Вы действительно хотите выйти из системы?').then(() => {this.$store.dispatch('users/logOut').then(() =>{if(this.$router.currentRoute.path === '/menu/contracts'){
          this.$router.replace('/menu').catch(()=>{})
         location.replace("/index.html")
        }
          else location.replace("/index.html")}).catch()}).catch();
      },
   },
  computed: {
    isAdmin1() {
      return  this.$store.getters["users/getUserRole"];
    }
  },
  created() {
    this.$router.push('/menu/contracts').catch(()=>{})
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
button.right {
  position: absolute;
  right: 20px;
}
</style>
