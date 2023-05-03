<template>
  <v-app>
<div id="menu">
<v-app-bar color="#6A76AB"
           dark>
  <v-app-bar-title>Меню</v-app-bar-title>
  <v-tabs align-with-title>
    <v-tab>
    <router-link tag="a" type="contract" to="/menu/contracts" style="color: white">
                 <span @click ="contract">Договоры</span></router-link> </v-tab>
    <v-tab>
    <router-link tag="a" to="/menu/counterparty-organizations" style="color: white">Организации-Контрагенты</router-link></v-tab>
    <v-tab>
    <router-link tag="a" to="/menu/reports" style="color: white">Отчеты</router-link></v-tab>
    <v-tab v-if="isAdmin1">
    <v-menu open-on-hover offset-y transition="slide-x-transition" bottom right>
      <template v-slot:activator="{ on, attrs }">
        <v-btn text
            flat v-bind="attrs" v-on="on"
               style="color: white"
        >
          Администрирование
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
    </v-menu> </v-tab>
    <v-btn @click="logout" class="right">Выход из системы</v-btn>
  </v-tabs>
  </v-app-bar>
<router-view />
</div>
  </v-app>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import { mapState} from "vuex";

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Menu",
  data() {
    return {
      items: [
        { title: 'Список всех договоров', path: "/menu/admin-root/all-contracts" },
        { title: 'Список всех пользователей', path: "/menu/admin-root/users" }
      ],
      //isAdminVar: this.$store.getters["users/getUserRole"],
    }
  },
methods:
    {
      contract: function () {

        this.$store.dispatch('contract').then(()=>this.$router.push('/menu/contracts'));

        // this.$store.dispatch('register', data)
        //     .then(() => this.$router.push('/menu'))
        //     .catch((err:String) => console.log(err))
      },
      logout() {
        //(this.$refs.form as HTMLFormElement).reset();
        this.$store.dispatch('users/logOut').then(() => window.location.href="/public/index.html");
      },
      // isAdmin() {
      //   let user = this.$store.state.users.user
      //   console.log(user);
      //   return user.isAdmin
      // }
   },
  computed: {
   ...mapState(['users']),
    isAdmin1() {
      let admin = this.$store.getters["users/getUserRole"];
      console.log(admin);
      return admin
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
button.right {
  position: absolute;
  top: 15px;
  right: 20px;
}
</style>
