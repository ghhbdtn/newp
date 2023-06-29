<template>
  <div id="app">
    <Login></Login>
  </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import Login from "@/components/Login.vue";

export default  defineComponent({
  name: 'App',
  components: {Login},
  // created () {
  //   this.$router.push('/')
  // },
});
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #279e69;
    }
  }
}
</style>
