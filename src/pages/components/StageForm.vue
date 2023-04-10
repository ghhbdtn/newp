<template>

  <div>
    <h2 style="background-color: rgb(255,255,255)">Этап договора</h2>
    <v-form ref="form" style="background-color: rgb(255,255,255)">
      <div>
        <label for="name">Название:</label>
        <input type="text" id="name" v-model="editedStage.stageName">
      </div>
      <div>
        <label for="start-date">Плановая дата начала:</label>
        <input type="date" id="start-end-date" v-model="editedStage.planDate">
      </div>
      <div>
        <label for="actual-start-date">Фактическая дата начала:</label>
        <input type="date" id="fact-date" v-model="editedStage.factDate">
      </div>
      <div>
        <label for="amount">Сумма этапа:</label>
        <input type="number" id="amount" v-model="editedStage.stageAmount">
      </div>
      <div>
        <label for="planned-expenses">Плановые расходы:</label>
        <input type="number" id="planned-expenses" v-model="editedStage.planSum">
      </div>
      <div>
        <label for="actual-expenses">Фактические расходы:</label>
        <input type="number" id="actual-expenses" v-model="editedStage.factSum">
      </div>
      <button type="submit" @click.prevent="addStage">Сохранить</button>
      <button type="button" @click="cancel">Отменить</button>
    </v-form>
  </div>

</template>

<script lang="ts">
import {defineComponent} from "vue";
interface Stage {
  stageName: string,
  planDate: string,
  factDate: string,
  stageAmount: number,
  planSum: number,
  factSum: number,
}
export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "StageForm",

  data() {
    return {

      stage: {

        stageName: "",
        planDate: "",
        factDate: "",
        stageAmount: 0,
        planSum: 0,
        factSum: 0,
      } as Stage,
      editedStage: {
        stageName: "",
        planDate: "",
        factDate: "",
        stageAmount: 0,
        planSum: 0,
        factSum: 0,
      }
    };
  },
  methods: {
    // метод для сохранения данных этапа
    addStage() {
        // this.stage.stageAmount = this.editedStage.stageAmount;
        // this.stage.stageName = this.editedStage.stageName;
        // this.stage.factDate = this.editedStage.factDate;
        // this.stage.factSum = this.editedStage.factSum;
        // this.stage.planSum = this.editedStage.planSum;
        // this.stage.planDate = this.editedStage.planDate;
        const stg = this.editedStage;

        this.$emit("addStage", stg); // передаем этап договора в родительский компонент
        this.editedStage = Object.assign({}, this.stage)

       // this.$emit("cancel"); // закрываем диалоговое окно


    },
    // метод для отмены редактирования/добавления
    cancel() {
      this.$emit("cancel");
      this.editedStage = Object.assign({}, this.stage)
    }
  }
});
</script>

<style scoped>

</style>
