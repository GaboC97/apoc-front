<template>
  <footer class="footer">

    <div class="footer-content">

      <div class="footer-logo">
        <img :src="apocLogo" alt="APOC" />
        <p>Asociación del Personal de los Organismos de Control</p>
      </div>

      <div class="footer-links">
        <h3>Secciones</h3>
        <router-link to="/home">Inicio</router-link>
        <router-link to="/nosotros">Nosotros</router-link>
        <router-link to="/contacto">Contacto</router-link>
        
        <router-link v-if="!auth.isLoggedIn" to="/login">
          Autogestión
        </router-link>
        
        <router-link v-else to="/dashboard" class="link-dashboard">
          Ir a mi Panel ↪
        </router-link>
      </div>

      <div class="footer-info">
        <h3>Contacto</h3>
        <p>📧 contacto@apoc.org</p>
        <p>📞 0800-000-0000</p>
        <p>📍 CABA, Argentina</p>
      </div>

      <div class="footer-social">
        <h3>Redes</h3>
        <div class="icons">
          <a href="https://www.instagram.com" target="_blank">
            <i class="bi bi-instagram"></i>
          </a>
          <a href="proximamente" target="_blank">
            <i class="bi bi-whatsapp"></i>
          </a>
          <a href="https://www.facebook.com" target="_blank">
            <i class="bi bi-facebook"></i>
          </a>
        </div>
      </div>

    </div>

    <div class="footer-bottom">
      <p>© {{ new Date().getFullYear() }} APOC — Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<script setup>
import apocLogo from '../assets/apoc_navbar.png';
import { useAuthStore } from "../stores/auth"; // Importamos el store

const auth = useAuthStore(); // Lo iniciamos para usarlo en el template
</script>

<style scoped>
.footer {
  background: #003d73;
  color: white;
  padding: 60px 20px 20px;
  margin-top: 60px;
}

.footer-content {
  max-width: 1300px;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 40px;
}

/* LOGO */
.footer-logo img {
  height: 60px;
  margin-bottom: 10px;
}

.footer-logo p {
  opacity: 0.8;
  font-size: 14px;
  line-height: 1.4;
}

/* LINKS */
.footer-links h3,
.footer-info h3,
.footer-social h3 {
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: 600;
  color: #badcff;
}

.footer-links a {
  color: white;
  opacity: 0.85;
  text-decoration: none;
  display: block;
  margin-bottom: 10px;
  transition: 0.2s;
}

.footer-links a:hover {
  opacity: 1;
  text-decoration: underline;
}

/* ESTILO EXTRA PARA EL LINK DEL PANEL */
.link-dashboard {
  color: #67e8f9 !important; /* Un cyan brillante para destacar */
  font-weight: 700;
}
.link-dashboard:hover {
  color: white !important;
}

/* CONTACTO */
.footer-info p {
  margin-bottom: 10px;
  opacity: 0.85;
}

.icons {
  display: flex;
  gap: 16px; 
  align-items: center;
}

.footer-social .icons i {
  color: white !important;
  font-size: 28px;
  transition: 0.2s ease;
}

.footer-social .icons i:hover {
  color: #dbeafe !important;
  transform: translateY(-3px);
}

.footer-social .icons a {
  color: inherit !important;
  text-decoration: none;
}


/* COPYRIGHT */
.footer-bottom {
  margin-top: 30px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 12px;
  font-size: 13px;
  opacity: 0.8;
}
</style>