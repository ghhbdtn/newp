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

<script>
import LoginView from "@/components/LoginView.vue";
import {useRouter} from "vue-router/composables";
import store from "@/store";

export default {
  name: 'App',
  components: {
    LoginView
  },
  computed: {
    userIsAuthenticated() {
      return this.$store.state.users.isAuthenticated;
    }
  },
  mounted() {
    const router = useRouter();
    const redirectToRoute = (routeName) => {
      router.push({ name: routeName }).catch(() => {});
    };
    this.$nextTick(() => {
      let userIsAuthenticated = store.state.users.isAuthenticated;
      if (userIsAuthenticated) {
        switch (router.currentRoute.name) {
          case 'menu':
            redirectToRoute('menu');
            break;
          case 'contracts':
            redirectToRoute('contracts');
            break;
          case 'organizations':
            redirectToRoute('organizations');
            break;
          case 'reports':
            redirectToRoute('reports');
            break;
          case 'all-contracts':
            redirectToRoute('all-contracts');
            break;
          case 'allUsers':
            redirectToRoute('allUsers');
            break;
          default:
            redirectToRoute('menu');
        }
      }
    });
  }
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
