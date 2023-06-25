<template>
  <v-app>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
          <v-card class="mt-5">
            <h3 class="text-center">Сформировать отчеты</h3>
            <v-divider></v-divider>
            <h4 class="subtitle-1">Отчет 1: Вывод всех договоров за задаваемый плановый период</h4>
            <v-row class="mb-4">
              <v-col cols="12" sm="6">
                <v-card-text class="subtitle-1">Плановая дата начала:</v-card-text>
                <v-text-field type="date" color="#6A76AB" v-model="startDate" outlined dense />
              </v-col>
              <v-col cols="12" sm="6">
                <v-card-text class="subtitle-1">Плановая дата окончания:</v-card-text>
                <v-text-field type="date" color="#6A76AB" v-model="endDate" outlined dense />
              </v-col>
            </v-row>
            <v-card-actions class="justify-center">
              <v-btn color="#6A76AB" dark @click="downloadContracts">Сформировать отчет</v-btn>
            </v-card-actions>
            <v-divider></v-divider>
            <h4 class="subtitle-1">Отчет 2: Вывод всех этапов для выбранного пользователем договора</h4>
            <v-row class="mb-4">
              <v-col cols="12">
                <v-card-text class="subtitle-1">Выберите договор:</v-card-text>
                <v-select
                    v-model="selectedContract"
                    :items="contracts"
                    item-text="name"
                    item-value="id"
                    color="#6A76AB"
                    outlined
                    dense
                    return-object
                >
                </v-select>
              </v-col>
            </v-row>
            <v-card-actions class="justify-center">
              <v-btn color="#6A76AB" dark @click="downloadStagesReport">Сформировать отчет</v-btn>
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
      selectedContract: {
        name: "",
        id: -1
      }
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
    downloadStagesReport() {
      const data = this.selectedContract.id
      this.$store.dispatch('reports/downloadStageReport', data)
    }

  },
  computed: {
    last(){
      return this.$store.state.contractsStore.last
    },
    contracts() {
      return this.$store.state.contractsStore.all
    }
  },
  created() {
    this.$store.dispatch('contractsStore/getAll', {page: 0, size: 2147483647})
  }
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

.col-12 {
  padding-top: 0;
  padding-bottom: 0;
}
.col-6 {
  padding-top: 0;
  padding-bottom: 0;
  color: #6A76AB;
}


</style>

