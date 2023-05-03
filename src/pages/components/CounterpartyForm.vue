<template>
<v-card>
<v-card-text>
  <v-form ref="form" style="background-color: rgb(255,255,255)">
    <v-container>
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
              v-model="EditedCounterContract.countercontractName"
              label="Название"
              name="name"
              style="text-decoration-color: #303234; text-align: start"
              type="input"
              placeholder="Название договора"
              required
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-select
              v-model="EditedCounterContract.countercontractType"
              :items="countercontractTypes"
              label="Тип договора"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-select
              v-on:organizations-loaded="onOrganizationsLoaded"
              v-model="EditedCounterContract.counterParty"
              :items="counterpartiesTable"
              label="Организация-Контрагент"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field v-model="EditedCounterContract.counterPlan" label="Сумма"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field v-model="EditedCounterContract.counterPlan" type="text" label="Плановые сроки"
                        v-mask="'##.##.#### - ##.##.####'" ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field v-model="EditedCounterContract.counterFact" label="Фактические сроки"
                        v-mask="'##.##.#### - ##.##.####'"></v-text-field>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-btn color="primary" @click="saveCountercontract">Сохранить</v-btn>
        <v-btn color="red" @click="counterCancel">Отменить</v-btn>
      </v-card-actions>
    </v-container>

  </v-form>
</v-card-text>
</v-card>
</template>

<script lang="ts">
import {defineComponent} from "vue";
interface Countercontract {
  countercontractName: string,
  countercontractType: string,
  counterParty: string,
  counterPlan: string,
  counterFact: string,
  counterAmount: number,
}
export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "CounterpartyForm",

  data: function () {
    return {

      countercontract: {

        countercontractName: "",
        countercontractType: "",
        counterParty: "",
        counterPlan: "",
        counterFact: "",
        counterAmount: 0,
      } as Countercontract,
      EditedCounterContract: {
        countercontractName: "",
        countercontractType: "",
        counterParty: "",
        counterPlan: "",
        counterFact: "",
        counterAmount: 0,
      },
      countercontractTypes: ["Закупка", "Поставка", "Работы"],
      counterpartiesTable: ["КОНТРАГЕНТ1", "КОНТРАГЕНТ2", "КОНТРАГЕНТ3"]
    };
  },
  methods: {
    // метод для сохранения данных этапа
    saveCountercontract() {
      const contract = this.EditedCounterContract;

      this.$emit("saveCountercontract", contract); // передаем этап договора в родительский компонент
      this.EditedCounterContract = Object.assign({}, this.countercontract)
    },
    // метод для отмены редактирования/добавления
    counterCancel() {
      this.$emit("counterCancel");
      this.EditedCounterContract = Object.assign({}, this.countercontract)
    },
    onOrganizationsLoaded(organizations: any) {
      this.counterpartiesTable = organizations;
    }
  }
});
</script>

<style scoped>

</style>
