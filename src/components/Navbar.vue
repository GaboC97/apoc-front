<template>
  <nav class="navbar">

    <div class="nav-header">
      <router-link to="/dashboard" class="logo-link">
        <img :src="apocLogo" alt="APOC" class="nav-logo" />
      </router-link>

      <button class="menu-toggle" @click="toggleMenu">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
    </div>

    <div class="menu-backdrop" :class="{ 'is-visible': isOpen }" @click="closeMenu"></div>

    <div class="nav-menu" :class="{ 'is-open': isOpen }">

      <div class="mobile-drawer-header">
        <span class="drawer-title">Menú</span>
        <button class="close-drawer-btn" @click="closeMenu">✕</button>
      </div>

      <div class="nav-center">
        <router-link to="/dashboard" class="nav-link" @click="closeMenu">Inicio</router-link>
        <router-link to="/reintegros" class="nav-link" @click="closeMenu">Mis Reintegros</router-link>
        <router-link to="/subsidios" class="nav-link" @click="closeMenu">Mis Subsidios</router-link>

        <div class="divider desktop-only"></div>

        <div class="actions-group">
          <router-link to="/reintegros/nuevo" class="nav-btn btn-light" @click="closeMenu">+ Reintegro</router-link>
          <router-link to="/subsidios/nuevo" class="nav-btn btn-light" @click="closeMenu">+ Subsidio</router-link>
        </div>
      </div>

      <div class="nav-right">
        <div v-if="esAdmin" class="admin-panel">
          <span class="admin-label">Admin:</span>
          <router-link to="/admin/reintegros" class="nav-link admin-link" @click="closeMenu">Pendientes</router-link>
          <router-link to="/admin/reintegros/historial" class="nav-link admin-link"
            @click="closeMenu">Historial</router-link>
        </div>

        <div class="user-menu">
          <span class="user-name">Hola, {{ auth.user?.name?.split(' ')[0] }}</span>
          <button @click="logout" class="logout-btn">Salir ↪</button>
        </div>
      </div>

    </div>
  </nav>
</template>

<script setup>
import apocLogo from "../assets/apoc_navbar.png";
import { useAuthStore } from "../stores/auth";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

// Estado del menú móvil
const isOpen = ref(false);

const esAdmin = computed(() => auth.user?.role === 'admin');

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

// Función para cerrar el menú al hacer clic en un enlace
const closeMenu = () => {
  isOpen.value = false;
};

const logout = () => {
  closeMenu(); // Cerramos menú por las dudas
  auth.logout();
  router.push("/login");
};
</script>

<style scoped>
/* =========================
   CONTAINER PRINCIPAL
   ========================= */
.navbar {
  background: #0056A6;
  color: white;
  height: 70px;
  padding: 0 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  /* Z-index alto para que tape todo */
}

/* Header (Logo + Botón móvil) */
.nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: auto;
}

.nav-logo {
  height: 45px;
  object-fit: contain;
}

/* El contenedor que agrupa todo el menú */
.nav-menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  margin-left: 20px;
}

.nav-center,
.nav-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* Links básicos */
.nav-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.nav-link:hover,
.router-link-active {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

/* Botones de acción */
.actions-group {
  display: flex;
  gap: 10px;
}

.nav-btn {
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 20px;
  white-space: nowrap;
}

.btn-light {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.divider {
  width: 1px;
  height: 25px;
  background: rgba(255, 255, 255, 0.3);
  margin: 0 5px;
}

/* Panel Admin */
.admin-panel {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 4px 15px;
  border-radius: 50px;
  gap: 10px;
}

.admin-label {
  font-size: 10px;
  text-transform: uppercase;
  color: #67e8f9;
  font-weight: 800;
}

/* Usuario */
.user-menu {
  display: flex;
  align-items: center;
  gap: 15px;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  padding-left: 20px;
}

.logout-btn {
  background: rgb(236, 42, 42);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
}

/* =========================
   HAMBURGUESA (MÓVIL)
   ========================= */
.menu-toggle {
  display: none;
  /* Oculto en escritorio */
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1100;
}

.bar {
  width: 100%;
  height: 3px;
  background-color: white;
  border-radius: 3px;
  transition: all 0.3s ease;
}

/* Animación de la hamburguesa a X */
.menu-toggle.is-active .bar:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}

.menu-toggle.is-active .bar:nth-child(2) {
  opacity: 0;
}

.menu-toggle.is-active .bar:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

/* Estilos nuevos para el header interno del menú */
.mobile-drawer-header {
  display: none;
  /* Oculto en escritorio */
}

/* =========================
   RESPONSIVE: SIDE DRAWER PREMIUM (CORREGIDO)
   ========================= */
@media (max-width: 1024px) {
  .navbar {
    padding: 0 20px;
    height: 70px;
  }

  /* --- 1. ACTIVAR EL BOTÓN HAMBURGUESA (CRÍTICO) --- */
  .menu-toggle {
    display: flex;
    /* ¡Esto es lo que faltaba! */
    z-index: 1002;
    /* Por encima de todo si fuera necesario */
  }

  /* El header solo ocupa el ancho necesario */
  .nav-header {
    width: 100%;
  }

  /* --- 2. TELÓN DE FONDO (BACKDROP) --- */
  .menu-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    /* Efecto borroso pro */
    z-index: 1000;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
  }

  .menu-backdrop.is-visible {
    opacity: 1;
    pointer-events: all;
  }

  /* --- 3. EL CAJÓN LATERAL (DRAWER) --- */
  .nav-menu {
    position: fixed;
    top: 0;
    right: 0;
    /* Sale de la derecha */
    width: 300px;
    max-width: 85vw;
    height: 100vh;
    background: #0056A6;

    display: flex;
    flex-direction: column;
    padding: 0;

    /* Animación lateral */
    transform: translateX(100%);
    transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
    z-index: 1001;
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.4);
  }

  .nav-menu.is-open {
    transform: translateX(0);
  }

  /* --- 4. HEADER DEL MENÚ (LIMPIO) --- */
  .mobile-drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px;
    background: transparent;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .drawer-title {
    font-weight: 800;
    font-size: 22px;
    color: white;
  }

  .close-drawer-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .close-drawer-btn:active {
    background: rgba(255, 255, 255, 0.3);
  }

  /* --- 5. LINKS --- */
  .nav-center,
  .nav-right {
    flex-direction: column;
    width: 100%;
    align-items: stretch;
    gap: 0;
  }

  .nav-link {
    width: 100%;
    padding: 18px 25px;
    text-align: left;
    border-radius: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    font-size: 16px;
    font-weight: 500;
  }

  .nav-link:active {
    background: rgba(255, 255, 255, 0.05);
  }

  .divider,
  .desktop-only {
    display: none;
  }

  /* --- 6. BOTONES (GRID 50/50) --- */
  .actions-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding: 25px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .nav-btn {
    width: 100%;
    text-align: center;
    justify-content: center;
    display: flex;
    padding: 12px 0;
    font-size: 14px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  /* --- 7. ADMIN PANEL --- */
  .admin-panel {
    background: rgba(0, 0, 0, 0.15);
    border: none;
    border-radius: 0;
    padding: 25px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .admin-label {
    margin-bottom: 12px;
    color: #67e8f9;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  .admin-link {
    width: 100%;
    text-align: left;
    padding: 8px 0;
    padding-left: 15px;
    border-left: 2px solid rgba(103, 232, 249, 0.5);
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    margin-bottom: 4px;
  }

  /* --- 8. USUARIO (AL FONDO) --- */
  .user-menu {
    margin-top: auto;
    border: none;
    padding: 25px;
    background: #003d7a;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .user-name {
    font-size: 15px;
    font-weight: 600;
  }

  .logout-btn {
    background: rgba(255, 0, 0, 0.2);
    border: 1px solid rgba(255, 0, 0, 0.3);
    padding: 8px 14px;
    border-radius: 8px;
    font-size: 13px;
  }
}
</style>