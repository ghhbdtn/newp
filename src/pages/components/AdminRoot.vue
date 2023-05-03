<template>

<v-toolbar>
    <router-link to="/menu/admin-root/all-contracts">Список всех договоров</router-link> |
    <router-link to="/menu/admin-root/users">Список всех пользователей</router-link>
</v-toolbar>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent ({
  name: "AdminRoot"
});
</script>

<style scoped>

</style>
