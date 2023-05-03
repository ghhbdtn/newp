<template>
  <v-app>
  <div>
    <h2>Отчеты</h2>
    <div>
      <text-h2>Отчет 1: Вывод всех договоров за задаваемый плановый период</text-h2>
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <label for="start-date">Плановая дата начала:</label>
      <v-text-field type="date" id="start-date" v-model="startDate" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
      <label for="end-date">Плановая дата конца:</label>
      <v-text-field type="date" id="end-date" v-model="endDate" />
        </v-col>
      </v-row>
      <v-btn @click="fetchContracts">Сформировать отчет</v-btn>
    </div>
    <div>
      <text-h2>Отчет 2: Вывод всех этапов для выбранного пользователем договора</text-h2>
      <v-col cols="12" sm="6" md="4">
      <label for="selected-contract">Выберите договор:</label>
      <v-select id="selected-contract"
                v-model="selectedContract"
                variant="solo">
        <option v-for="contract in contracts" :key="contract.id" :value="contract.id">
          {{ contract.number }}
        </option>
      </v-select>
      </v-col>
      <v-btn @click="fetchStages">Сформировать отчет</v-btn>
    </div>
  </div>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from 'axios';

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Reports",
  data() {
    return {
      startDate: "",
      endDate: "",
      selectedContract: "",
      contracts: [] as any[],
      stages: [] as any[],
    };
  },
  methods: {
    async fetchContracts() {
      try {
        const response = await axios.get("/api/reports/contracts", {
          params: {
            startDate: this.startDate,
            endDate: this.endDate,
          },
        });
        this.contracts = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchStages() {
      try {
        const response = await axios.get(
            `/api/reports/stages/${this.selectedContract}`
        );
        this.stages = response.data;
      } catch (error) {
        console.error(error);
      }
    },
  },
});
</script>
<style scoped>

</style>
