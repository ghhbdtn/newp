<template>
  <v-app>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="14" sm="12" md="8" lg="6">
          <v-card class="mt-5">
            <h3>Сформировать отчеты</h3>
            <v-divider></v-divider>
            <h4 class="subtitle-1">Отчет 1: Вывод всех договоров за задаваемый плановый период</h4>
            <v-row>
              <v-col cols="10" sm="6">
                <v-card-text for="start-date" class="subtitle-1">Плановая дата начала:</v-card-text>
                <v-text-field type="date" id="start-date" v-model="startDate" />
              </v-col>
              <v-col cols="10" sm="6">
                <v-card-text class="subtitle-1" for="end-date">Плановая дата окончания:</v-card-text>
                <v-text-field type="date" id="end-date" v-model="endDate" />
              </v-col>
            </v-row>
            <v-card-actions>
              <v-btn color="#6A76AB" @click="downloadContracts" style="color: white">Сформировать отчет</v-btn>
            </v-card-actions>
            <v-divider></v-divider>
            <h4 class="subtitle-1">Отчет 2: Вывод всех этапов для выбранного пользователем договора</h4>
            <v-row>
              <v-col cols="10" sm="12">
                <v-card-text for="selected-contract" class="subtitle-1">Выберите договор:</v-card-text>
                <v-select
                    id="selected-contract"
                    v-model="selectedContract"
                    :items="contracts"
                    item-text="number"
                    item-value="id"
                    variant="outlined"
                ></v-select>
              </v-col>
            </v-row>
            <v-card-actions style="align-content: center">
              <v-btn color="#6A76AB" @click="fetchStages" style="color: white" >Сформировать отчет</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Reports",
  data() {
    return {
      startDate: "",
      endDate: "",
      selectedContract: "",
      contracts: [] as any[],
    };
  },
  methods: {
    downloadContracts() {
      const data = {
        plannedStartDate: this.startDate,
        plannedEndDate: this.endDate
      }
      this.$store.dispatch('reports/downloadReport', data)
    },

  },
});
</script>

<style scoped>
.v-card {
  background: rgba(128, 101, 166, 0.22);
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.text-center {
  text-align: center;
}

.mt-4 {
  margin-top: 1.5rem;
}

.v-divider {
  margin: 2rem 0;
}

.v-select {
  width: 50%;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.v-btn {
  margin-top: 1.5rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.h4{

}


</style>

