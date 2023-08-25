<template>
  <v-app>
    <div>
      <v-app-bar color="#6A76AB"
           dark>
        <v-toolbar-title style="font-size: x-large">Меню</v-toolbar-title>
        <v-spacer/>
        <template #extension>
          <v-tabs align-with-title>
            <v-tab :to="{ name: 'contracts' }">Договоры</v-tab>
            <v-tab :to="{ name: 'organizations' }">Организации-Контрагенты</v-tab>
            <v-tab :to="{ name: 'reports' }">Отчеты</v-tab>
            <v-menu open-on-hover offset-y transition="slide-x-transition" bottom right v-if="isAdmin">
              <template #activator="{ on, attrs }">
                <v-btn
                    text
                    height="100%"
                    variant="plain"
                    v-bind="attrs"
                    v-on="on">
                  Администрирование
                  <v-icon end>
                    mdi-menu-down
                  </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                    v-for="(item) in items"
                    :key="item.id"
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
      <router-view />
    </div>
  </v-app>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {messages} from "@/pages/source/messages";

export default defineComponent({
  name: "Menu",
  data() {
    return {
      items: [
        { id: 0, title: 'Список всех договоров', path: '/menu/admin-root/all-contracts'},
        { id: 1, title: 'Список всех пользователей', path: '/menu/admin-root/users' }
      ],
    }
  },
methods:
    {
      reports: function () {
        this.$router.push('/menu/reports').catch(() => {})
      },
      contracts1: function () {
        const data = {};
        this.$store.dispatch('contractsStore/getAll', data).then(() => {
            this.$router.push('/menu/contracts').catch(()=>{})});
      },
      logout: function () {
        this.$confirm(messages.LOG_OUT_CONFIRM)
            .then(() => {this.$store.dispatch('users/logOut')
                .then(() =>{
                  if(this.$router.currentRoute.path === '/menu/contracts'){
                    this.$router.replace('/menu').catch(()=>{})
                    location.replace("/")
                  }
                  else location.replace("/")
                }).catch()
            }).catch(()=>{});
        },
   },
  computed: {
    isAdmin() {
      return  this.$store.getters["users/getUserRole"];
    }
  },
  created() {
    if(this.$router.currentRoute.name == 'menu' || this.$router.currentRoute.name == 'contracts')
      this.contracts1()
  }
})

</script>
