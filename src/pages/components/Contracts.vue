<template>
  <v-app>
  <v-content>
    <v-data-table
        :headers="headers"
        :items="contracts"
        :items-per-page="5"
        class="elevation-1"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item);" style="color: darkcyan">mdi-pencil</v-icon>
        <v-icon small text @click="deleteItem(item)" large style="color: darkred">
          mdi-delete
        </v-icon>
      </template>

    </v-data-table>

    <v-dialog v-model="dialogVisible"  @click.prevent persistent @cancel="cancel">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            color="primary"
            dark
            class="mb-2"
            v-bind="attrs"
            v-on="on"
        >Добавить</v-btn>
      </template>
      <v-card>
      <v-card-text>
      <v-form ref="form" v-model="valid" style="background-color: rgb(255,255,255)">
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="4">

              <v-text-field
                  v-model="EditedItem.name"
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
                  v-model="EditedItem.type"
                  :items="types"
                  label="Тип договора"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="EditedItem.plan" type="text" label="Плановые сроки"
                            v-mask="'##.##.#### - ##.##.####'" ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="EditedItem.fact" label="Фактические сроки"
                            v-mask="'##.##.#### - ##.##.####'"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="EditedItem.amount" label="Сумма"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">

              <v-card-text v-model="EditedItem.stage"
                        :items="stages"
                            type="input" label="Этап"
                            style="border-block-color: #303234"></v-card-text>
              <v-btn
                  class="mx-2"
                  fab
                  dark
                  color="indigo"
                  small
              >
                <v-icon dark>
                  mdi-plus

                </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="EditedItem.counterparties" label="Договоры с контр-агентами" ></v-text-field>
            </v-col>
          </v-row>
          <v-card-actions>
          <v-btn color="primary" @click="save">Сохранить</v-btn>
          <v-btn color="primary" @click="close">Отменить</v-btn>
          </v-card-actions>
        </v-container>
        <stage-form/>
        <v-card-title>Таблица этапов договора</v-card-title>
        <v-data-table
          :headers="stages_headers"
          :items="stages"
          :items-per-page="5"
          class="elevation-3">
        </v-data-table>
      </v-form></v-card-text></v-card>
    </v-dialog>

  </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue, { defineComponent } from "vue";
import { required, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import StageForm from "./StageForm.vue"
// Add validate method to Vue prototype
Vue.prototype.validate = function () {
  if (this.$refs.form) {
    this.$refs.form.validate();
  }
};

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Contracts",
  // eslint-disable-next-line vue/no-unused-components
  components: {StageForm},
  data() {
    return {
      EditedItem: {
        name: "",
        type: "",
        plan: "",
        fact: "",
        amount: "",
        stage: "",
        counterparties: ""
      },
      defaultItem: {
        name: "",
        type: "",
        plan: "",
        fact: "",
        amount: "",
        stage: "",
        counterparties: ""
      },
      dialogVisible: false,
      editedIndex: -1,
      nameRules: [
        required,
        minLength(3),
      ],
      valid: true,
      types: ["Закупка", "Поставка", "Работы"],
      headers: [
        {
          text: "Название",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Тип договора", align: "start", sortable: false, value: 'type'},
        { text: "Плановые сроки", align: "start", sortable: false, value: "plan" },
        { text: "Фактические сроки", align: "start", sortable: false, value:  "fact"},
        { text: "Сумма", align: "start", sortable: false, value: "amount"},
        { text: "Этап", align: "start", sortable: false, value: "stage" },
        {
          text: "Договоры с контр-агентами",
          align: "start",
          sortable: false,
          value: "counterparties",
        },
        { text: "Действия", value: "actions", sortable: false},
      ],
      stages_headers: [
        {
          text: "Название"
        },
        {
          text: "Плановые сроки"
        },
        {
         text:  "Фактические сроки"
        },
        {
          text: "Сумма этапа"
        },
        {
          text: "Плановые расходы"
        },
        {
          text: "Фактические расходы"
        }],
      stages: [],
      contracts: [
        {
          name: "Договор 1",
          type: "Тип 1",
          plan: "01.01.2023 - 01.01.2024",
          fact: "01.01.2023 - 01.01.2024",
          amount: "1000000",
          stage: "Этап 1",
          counterparties: "Контрагент 1",
        },
        {
          name: "Договор 2",
          type: "Тип 2",
          plan: "01.02.2023 - 01.02.2024",
          fact: "01.02.2023 - 01.02.2024",
          amount: "2000000",
          stage: "Этап 2",
          counterparties: "Контрагент 2",
        },
        {
          name: "Договор 3",
          type: "Тип 3",
          plan: "01.03.2023 - 01.03.2024",
          fact: "01.03.2023 - 01.03.2024",
          amount: "3000000",
          stage: "Этап 3",
          counterparties: "Контрагент 3",
        },
      ],

    };
  },
  computed: {
    formTitle () {
      if (this.editedIndex !== -1) {
        return 'Edit Item'
      } else {
        return 'New Item'
      }
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
  },
  methods: {

    editItem (item: any) {
      this.editedIndex = this.contracts.indexOf(item)
      this.EditedItem = Object.assign({}, item)
      this.dialogVisible = true
    },

    deleteItem (item: any) {
      const index = this.contracts.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.contracts.splice(index, 1)
    },

    close () {
      this.dialogVisible = false
      this.$nextTick(() => {
        this.EditedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.contracts[this.editedIndex], this.EditedItem)
      } else {
        this.contracts.push(this.EditedItem)
      }
      this.close()
    },
  },
  setup() {
    const v$ = useVuelidate();

    return { v$ };

  }
});
</script>

<style>

</style>
