<template>
  <Transition name="fade">
    <div v-if="!auth.isReady" class="app-loader">
      <div class="loader-content">
        <img :src="apocLogo" alt="APOC" class="loader-logo" />
        <div class="spinner"></div>
      </div>
    </div>
  </Transition>

  <div v-if="auth.isReady" class="app-layout">

    <Navbar v-if="auth.isLoggedIn && layout === 'dashboard'" />
    <PublicNavbar v-if="layout === 'public' && route.path !== '/login'" />

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <div :key="route.path">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </main>

    <FooterComponent v-if="layout === 'public' && !route.meta.hideFooter" />

  </div>

  <ToastContainer />

</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "./stores/auth";
import apocLogo from "./assets/apoc_navbar.png";

// Componentes
import Navbar from "./components/Navbar.vue";
import PublicNavbar from "./components/PublicNavbar.vue";
import FooterComponent from "./components/Footer.vue";
import ToastContainer from "./components/ToastContainer.vue";

const auth = useAuthStore();
const route = useRoute();
const layout = computed(() => route.meta.layout || 'public');

// AQUÍ INICIAMOS LA APP
onMounted(() => {
  auth.loadFromStorage();
});
</script>

<style>
/* =========================
   ESTILOS DEL LOADER
   ========================= */
.app-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loader-logo {
  height: 60px;
  animation: pulse 2s infinite ease-in-out;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 86, 166, 0.1);
  border-left-color: #0056A6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

.fade-leave-active { transition: opacity 0.5s ease; }
.fade-leave-to { opacity: 0; }

/* TRANSICIÓN DE PÁGINAS */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.3s ease-out;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* LAYOUT PRINCIPAL */
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 80vh;
}
</style>