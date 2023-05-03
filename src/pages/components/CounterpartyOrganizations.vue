<template>
  <v-app>
    <v-content>
      <v-data-table  @click:row="editItem"
                     :headers="organization_headers"
                     :items="organizations"
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
        <v-dialog v-model="dialog">
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
                          v-model="editedOrganization.organizationName"
                          label="Название организации"
                          name="name"
                          style="text-decoration-color: #303234; text-align: start"
                          type="input"
                          required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                          v-model="editedOrganization.address"
                          label="Адрес"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedOrganization.INN" type="text" label="ИНН"
                                    v-mask="'##########'" ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-card-actions>
                    <v-btn color="primary" @click="saveOrganization">Сохранить</v-btn>
                    <v-btn color="red" @click="closeForm">Отменить</v-btn>
                  </v-card-actions>
                </v-container>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import {defineComponent} from "vue";
interface Organization {
  organizationName: string,
  address: string,
  INN: number
}
export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "CounterpartyOrganizations",

  data() {
    return {

      organization: {
        organizationName: "",
        address: "",
        INN: 0,
      } as Organization,
      editedOrganization: {
        organizationName: "",
        address: "",
        INN: 0,
      },
      organization_headers: [
        {text: "Название организации", value: "organizationName"},
        {text: "Адресс", value: "address"},
        {text:  "ИНН", value: "INN"},
        { text: "Действия", value: "actions", sortable: false}
      ],
      organizations: [{organizationName: "sdfds;", address:"dssdfcds", INN:1231232135}] as Organization[],
      dialog: false,
      editedIndex: -1,
    };
  },
  methods: {
    saveOrganization () {
      if (this.editedIndex > -1 ) {
        Object.assign(this.organizations[this.editedIndex], this.editedOrganization)
      } else {
        this.organizations.push(this.editedOrganization)
      }
      this.closeForm()
    },
    closeForm () {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedOrganization = Object.assign({}, this.organization)
        this.editedIndex = -1
      })
    },
    editItem (item: any) {
      this.editedIndex = this.organizations.indexOf(item)
      this.editedOrganization = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item: any) {
      const index = this.organizations.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.organizations.splice(index, 1)
    },
    loadOrganizations() {
      // получение массива Organizations из API
      // и генерация события с массивом Organizations
      this.$emit('organizations-loaded', this.organizations)
    }
  }
});
</script>

<style scoped>

</style>
