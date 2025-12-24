<template>
  <nav class="public-navbar">
    <div class="left">
      <img :src="apocLogo" class="logo" alt="APOC" />
      <span class="brand">APOC</span>
    </div>

    <div class="links">
      <router-link to="/">Inicio</router-link>
      <router-link to="/nosotros">Nosotros</router-link>
      <router-link to="/contacto">Contacto</router-link>

      <router-link 
        v-if="!auth.isLoggedIn" 
        to="/login" 
        class="nav-btn-public glass-btn">
        Autogestión
      </router-link>

      <router-link 
        v-else 
        to="/dashboard" 
        class="nav-btn-public solid-btn">
        Ir al Panel 
        <span class="arrow">→</span>
      </router-link>

    </div>
  </nav>
</template>

<script setup>
import apocLogo from "../assets/apoc_navbar.png";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
</script>

<style scoped>
/* =========================
   LAYOUT GENERAL
   ========================= */
.public-navbar {
  background: #0056A6;
  padding: 14px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  /* Sombra suave para separar del contenido */
  box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
}

.left {
  display: flex;
  align-items: center;
}

.logo {
  height: 40px;
  margin-right: 10px;
}

.brand {
  font-weight: 700;
  font-size: 20px;
  letter-spacing: 0.5px;
}

/* =========================
   LINKS DE NAVEGACIÓN
   ========================= */
.links {
  display: flex;
  align-items: center;
  gap: 25px; /* Espacio uniforme entre items */
}

.links a:not(.nav-btn-public) {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  transition: color 0.2s;
}

.links a:not(.nav-btn-public):hover {
  color: white;
  text-shadow: 0 0 8px rgba(255,255,255,0.4);
}

/* =========================
   BOTONES (AUTOGESTIÓN / PANEL)
   ========================= */
/* Clase base compartida para asegurar coherencia (mismo tamaño y forma) */
.nav-btn-public {
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* VARIANTE 1: Glass (Transparente para Autogestión) */
.glass-btn {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.glass-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

/* VARIANTE 2: Solid (Blanco para Ir al Panel) */
.solid-btn {
  background: white;
  color: #0056A6; /* Azul de la marca */
  border: 1px solid white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15); /* Sombrita para que flote */
}

.solid-btn:hover {
  background: #f0f9ff; /* Un blanco apenas azulado al hover */
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

/* ANIMACIÓN DE LA FLECHA */
.arrow {
  display: inline-block;
  transition: transform 0.2s ease;
  font-size: 16px;
  line-height: 1;
}

/* Cuando hago hover sobre el botón, la flecha se mueve */
.solid-btn:hover .arrow {
  transform: translateX(4px);
}
</style>