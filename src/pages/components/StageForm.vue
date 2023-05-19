<template>
  <div>
    <v-card>
      <v-card-text>
    <v-form ref="form" style="background-color: rgb(255,255,255)">
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="4">

        <v-text-field id="name" v-model="stage.name"
                      label="Название этапа"
                      name="name"
                      style="text-decoration-color: #303234; text-align: start"
                      type="input"
                      required>{{stage.name}}</v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
        <v-text-field type="text"
                      v-model="stage.plannedDate"
                      v-mask="'##.##.#### - ##.##.####'"
                      label="Плановые сроки начала и окончания"
                      placeholder="дд.мм.гггг - дд.мм.гггг"
                      required></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field type="text"
                          v-model="stage.actualDate"
                          v-mask="'##.##.#### - ##.##.####'"
                          label="Фактические сроки начала и окончания"
                          placeholder="дд.мм.гггг - дд.мм.гггг"
                          required></v-text-field>
          </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-text-field type="number"
                      v-model="stage.amount"
                      label="Сумма этапа"></v-text-field>
      </v-col>
          <v-col cols="12" sm="6" md="4">
        <v-text-field type="number"
                      v-model="stage.plannedMaterialCosts"
                      label="Плановые расходы на материалы"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field type="number"
                          v-model="stage.actualMaterialCosts"
                          label="Фактические расходы на материалы"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field type="number"
                          v-model="stage.plannedSalaryExpenses"
                          label="Плановые расходы на зарплаты"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field type="number"
                          v-model="stage.actualSalaryExpenses"
                          label="Фактические расходы на зарплаты"></v-text-field>
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
  id?: number,
  name: string,
  amount: number,
  plannedDate: string,
  actualDate: string,
  actualMaterialCosts: number,
  plannedMaterialCosts: number,
  actualSalaryExpenses: number,
  plannedSalaryExpenses: number
}
export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "StageForm",
  props: {
    value: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      stage: this.value as Stage,
      defaultStage: {
        name: "",
        amount: 0,
        plannedDate: "",
        actualDate: "",
        actualMaterialCosts: 0,
        plannedMaterialCosts: 0,
        actualSalaryExpenses: 0,
        plannedSalaryExpenses: 0
      } as Stage,
    //   editedStage: {
    //     name: "",
    //     amount: 0,
    //     plannedDate: "",
    //     actualDate: "",
    //     actualMaterialCosts: 0,
    //     plannedMaterialCosts: 0,
    //     actualSalaryExpenses: 0,
    //     plannedSalaryExpenses: 0
    //   }
    };
  },

  methods: {
    // метод для сохранения данных этапа
    addStage() {

        const stg = this.stage;
        console.log(stg)
        this.$emit("addStage", stg); // передаем этап договора в родительский компонент
        //this.stage = Object.assign({}, this.defaultStage)
    },
    // метод для отмены редактирования/добавления
    cancel() {
      console.log(this.stage)
      this.$emit("cancel");
      //this.stage = Object.assign({}, this.defaultStage)
    },

  }
});
</script>

<style scoped>

</style>
