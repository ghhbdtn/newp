<template>
  <v-app>
    <v-main>
      <v-container fill-height fluid>
        <v-layout align-center justify-center>
          <v-flex md4 sm8 xs12>
            <v-card class="elevation-12">
              <v-toolbar color="#6A76AB" dark>
                <v-toolbar-title>
                  {{ currentMode === "RegisterForm" ? "Регистрация" : "Вход" }}
                </v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <component :is="currentMode" @switch-mode="switchMode"/>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import AuthForm from '@/components/AuthForm.vue'
import RegisterForm from '@/components/RegisterForm.vue'
import {defineComponent} from "vue";

export default defineComponent({
  name: "LoginRegistration",
  components: {
    AuthForm,
    RegisterForm
  },
  data() {
    return {
      currentMode: "AuthForm"
    };
  },
  methods: {
    switchMode: function (mode: string) {
      this.currentMode = mode;
    }
  }
});
</script>
