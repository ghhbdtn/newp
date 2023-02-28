<template>
  <div class="base-demo" style="width: 800px">Договоры
    <v-data-table
    :headers="headers"
    :items="contrs"
    :hide-default-footer="true">
      <template>
        <v-icon small class="mr-2">mdi-pencil</v-icon>
        <v-icon small>mdi-delete</v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
//import VueTableDynamic from 'vue-table-dynamic';

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Contracts",
  data(){
    return {
        contrs: [],
        headers: [
          {text: 'Название', align: 'start', sortable: 'false'},
          {text: 'Тип договора', align: 'start', sortable: 'false'},
          {text: 'Плановые сроки', align: 'start', sortable: 'false'},
          {text: 'Фактические сроки', align: 'start', sortable: 'false'},
          {text: 'Сумма', align: 'start', sortable: 'false'},
          {text: 'Этап', align: 'start', sortable: 'false'},
          {text: 'Договоры с контр-агентами', align: 'start', sortable: 'false'},
        ]

    }
  }
})
</script>

<style scoped>
</style>
