<template>
  <div id="app">
    <template v-if="!userIsAuthenticated">
      <LoginView />
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import LoginView from "@/components/LoginView.vue";

export default  defineComponent({
  name: 'App',
  components: {LoginView},
  computed: {
    userIsAuthenticated() {
      return this.$store.state.users.isAuthenticated
    },
  },
  created() {
    if (this.userIsAuthenticated) {
      switch (this.$router.currentRoute.name){
        case 'menu': this.$router.push('/menu').catch(()=>{})
              break;
        case 'contracts': this.$router.push('/menu/contracts').catch(()=>{})
              break;
        case 'organizations': this.$router.push('/menu/counterparty-organizations').catch(()=>{})
              break;
        case 'reports': this.$router.push('/menu/reports').catch(() => {})
              break;
        case 'all-contracts': this.$router.push('/menu/admin-root/all-contracts').catch(()=>{})
              break;
        case 'allUsers': this.$router.push('/menu/admin-root/users').catch(()=>{})
              break;
        default: this.$router.push('/menu')
      }
    }
  }
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
