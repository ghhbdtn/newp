<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="#6A76AB">
                <v-toolbar-title>
                  {{ currentMode === "RegisterForm" ? "Регистрация" : "Вход" }}
                </v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <component :is="currentMode" @switch-mode="switchMode" />
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
export default defineComponent( {
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
