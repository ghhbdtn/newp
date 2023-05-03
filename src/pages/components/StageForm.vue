<template>
  <div>
    <v-card>
      <v-card-text>
    <v-form ref="form" style="background-color: rgb(255,255,255)">
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="4">

        <v-text-field id="name" v-model="editedStage.stageName"
                      label="Название этапа"
                      name="name"
                      style="text-decoration-color: #303234; text-align: start"
                      type="input"
                      required></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
        <v-text-field type="text"
                      v-model="editedStage.planDate"
                      v-mask="'##.##.#### - ##.##.####'"
                      label="Плановые сроки начала и окончания"
                      placeholder="дд.мм.гггг - дд.мм.гггг"
                      required></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field type="text"
                          v-model="editedStage.factDate"
                          v-mask="'##.##.#### - ##.##.####'"
                          label="Фактические сроки начала и окончания"
                          placeholder="дд.мм.гггг - дд.мм.гггг"
                          required></v-text-field>
          </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-text-field type="number"
                      v-model="editedStage.stageAmount"
                      label="Сумма этапа"></v-text-field>
      </v-col>
          <v-col cols="12" sm="6" md="4">
        <v-text-field type="number"
                      v-model="editedStage.planSum"
                      label="Плановые расходы"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field type="number"
                          v-model="editedStage.factSum"
                          label="Фактические расходы"></v-text-field>
          </v-col>
        </v-row>
      <v-btn color="primary" type="submit" @click.prevent="addStage">Сохранить</v-btn>
      <v-btn color="red" type="button" @click="cancel">Отменить</v-btn>
      </v-container>
    </v-form>
    </v-card-text>
    </v-card>
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
