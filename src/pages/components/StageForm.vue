<template>
  <div>
    <h2>{{ mode === 'add' ? 'Добавление' : 'Редактирование' }} этапа договора</h2>
    <form>
      <div>
        <label for="name">Название:</label>
        <input type="text" id="name" v-model="name">
      </div>
      <div>
        <label for="start-date">Плановая дата начала:</label>
        <input type="date" id="start-date" v-model="plannedStartDate">
      </div>
      <div>
        <label for="end-date">Плановая дата окончания:</label>
        <input type="date" id="end-date" v-model="plannedEndDate">
      </div>
      <div>
        <label for="actual-start-date">Фактическая дата начала:</label>
        <input type="date" id="actual-start-date" v-model="actualStartDate">
      </div>
      <div>
        <label for="actual-end-date">Фактическая дата окончания:</label>
        <input type="date" id="actual-end-date" v-model="actualEndDate">
      </div>
      <div>
        <label for="amount">Сумма этапа:</label>
        <input type="number" id="amount" v-model="amount">
      </div>
      <div>
        <label for="planned-expenses">Плановые расходы:</label>
        <input type="number" id="planned-expenses" v-model="plannedExpenses">
      </div>
      <div>
        <label for="actual-expenses">Фактические расходы:</label>
        <input type="number" id="actual-expenses" v-model="actualExpenses">
      </div>
      <button type="submit" @click.prevent="save">Сохранить</button>
      <button type="button" @click="cancel">Отменить</button>
    </form>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "StageForm"
});


</script>

<style scoped>

</style>
