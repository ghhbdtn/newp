<template>
  <div id="app">
    <nav>
      <router-link to="/">Вход в систему</router-link>
    </nav>
    <router-view/>
  </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";

export default  defineComponent({
  name: 'App',
  created () {
    this.$router.push('/')
  },
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
