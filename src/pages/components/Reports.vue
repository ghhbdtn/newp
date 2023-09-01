<template>
  <v-app>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" lg="6" md="8" sm="10">
          <v-card class="mt-5" color="rgba(128, 101, 166, 0.22)">
            <v-card-title class="justify-center">Формирование отчетов</v-card-title>
            <v-divider/>
            <h4 class="subtitle-1 text-decoration-underline">Отчет 1: Вывод всех договоров за задаваемый плановый период</h4>
            <v-row class="mb-4" justify="center">
              <v-col cols="12" sm="5">
                <v-card-text class="subtitle-1">Плановая дата начала:</v-card-text>
                <v-text-field
                    v-model="startDate"
                    clearable
                    color="#6A76AB"
                    dense
                    outlined
                    type="date"
                />
              </v-col>
              <v-col cols="12" sm="5">
                <v-card-text class="subtitle-1">Плановая дата окончания:</v-card-text>
                <v-text-field
                    v-model="endDate"
                    clearable
                    color="#6A76AB"
                    dense
                    outlined
                    type="date"
                />
              </v-col>
            </v-row>
            <v-card-actions class="justify-center">
              <v-btn color="#6A76AB" dark @click="downloadContracts">Сформировать отчет</v-btn>
            </v-card-actions>
            <v-divider/>
            <h4 class="subtitle-1 text-decoration-underline">Отчет 2: Вывод всех этапов для выбранного договора</h4>
            <v-row class="mb-4">
              <v-col cols="12">
                <v-card-text class="subtitle-1">Выберите договор:</v-card-text>
                <v-select
                    v-model="selectedContract"
                    :items="contracts"
                    color="#6A76AB"
                    dense
                    item-text="name"
                    item-value="id"
                    no-data-text="Ничего не найдено"
                    outlined
                    return-object
                />
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
import {defineComponent} from "vue";
import {messages} from "@/pages/source/messages";

export default defineComponent({
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
        plannedStartDate: this.startDate == null ? "" : this.startDate.split("-").reverse().join("."),
        plannedEndDate: this.endDate == null ? "" : this.endDate.split("-").reverse().join(".")
      };
      this.$store.dispatch('reports/downloadReport', data)
          .catch(() => {
            this.$alert(messages.FAILED_DOWNLOADING, '', 'error');
          });
    },
    downloadStagesReport() {
      const data = this.selectedContract.id;
      this.$store.dispatch('reports/downloadStageReport', data)
          .catch(() => {
            this.$alert(messages.FAILED_DOWNLOADING, '', 'error');
          });
    }
  },
  computed: {
    contracts() {
      return this.$store.state.contractsStore.all;
    },
    errorMessage() {
      return this.$store.state.reports.err;
    }
  },
  created() {
    this.$store.dispatch('contractsStore/getAll', {page: 0, size: 2147483647}).catch();
  },
});
</script>

<style scoped>
.v-card {
  border-radius: 10px;
  box-shadow: 2px 4px rgba(12, 12, 12, 0.45);
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
