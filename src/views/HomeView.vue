<template>
  <div class="home-container">

    <!-- HERO PRINCIPAL (Con estilo de Nosotros) -->
    <section class="hero">
      <div class="hero-content fade-in-up">
        <span class="badge-hero">Tu Portal de Afiliado</span>
        <h1>APOC — Cuidando a quienes cuidan</h1>
        <p class="lead-text">
          Un espacio diseñado para ofrecer acompañamiento, transparencia y acceso fácil 
          a todos tus trámites como afiliado.
        </p>
<div class="hero-actions">
  
  <router-link v-if="!auth.isLoggedIn" to="/login" class="no-decoration">
    <button class="btn-primary">Ingresar a Autogestión</button>
  </router-link>

  <div v-else class="hero-badges-container">
    
    <div class="apoc-badge">
      <span class="badge-icon">🛡️</span>
      <div class="badge-text">
        <span class="title">Defensa</span>
        <span class="subtitle">Gremial</span>
      </div>
    </div>

    <div class="divider-vertical"></div>

    <div class="apoc-badge">
      <span class="badge-icon">⚖️</span>
      <div class="badge-text">
        <span class="title">Gestión</span>
        <span class="subtitle">Transparente</span>
      </div>
    </div>

    <div class="divider-vertical"></div>

    <div class="apoc-badge">
      <span class="badge-icon">🤝</span>
      <div class="badge-text">
        <span class="title">Comunidad</span>
        <span class="subtitle">Solidaria</span>
      </div>
    </div>

  </div>

</div>
      </div>
    </section>

    <!-- SECCIÓN SERVICIOS (Tarjetas de Acceso Rápido) -->
    <section class="section bg-light">
      <div class="container text-center">
        <h2 class="section-title">Servicios Destacados</h2>

        <div class="features-grid">

          <div class="feature-card fade-in-up delay-1">
            <div class="icon-wrapper blue">🧾</div>
            <h3>Reintegros</h3>
            <p>Cargá facturas, consultá estados y hacé seguimiento completo de tus gestiones.</p>
          </div>

          <div class="feature-card fade-in-up delay-2">
            <div class="icon-wrapper green">💙</div>
            <h3>Coberturas</h3>
            <p>Información clara sobre coseguro, prestaciones, órdenes y autorizaciones.</p>
          </div>

          <div class="feature-card fade-in-up delay-3">
            <div class="icon-wrapper orange">🎁</div>
            <h3>Beneficios</h3>
            <p>Convenios, descuentos y programas pensados para vos y tu familia.</p>
          </div>

        </div>
      </div>
    </section>

    <!-- SECCIÓN NOSOTROS DESTACADA (Split Layout) -->
    <section class="section about-preview">
      <div class="container split-about">
        
        <div class="about-text fade-in-up delay-1">
          <h2 class="section-title text-left">¿Qué es APOC?</h2>
          <p class="lead-text">
            Somos la Asociación del Personal de los Organismos de Control, una organización que 
            acompaña, defiende y asiste a trabajadores de todo el país.
          </p>
          <p class="text-secondary">
            Promovemos bienestar, igualdad y defensa de los derechos laborales, 
            siempre con transparencia en la gestión institucional.
          </p>

          <router-link to="/nosotros" class="btn-secondary">
            Conocé más sobre nuestra misión →
          </router-link>
        </div>

        <div class="about-image fade-in-up delay-2"></div>
      </div>
    </section>

    <!-- SECCIÓN CONTACTO RÁPIDO -->
    <section class="cta-section">
      <div class="cta-content fade-in-up">
        <h2>¿Necesitás ayuda?</h2>
        <p>Nuestro equipo está para acompañarte. Escribinos y te responderemos a la brevedad.</p>

        <router-link to="/contacto" class="btn-primary">
          Ir a contacto
        </router-link>
      </div>
    </section>

  </div>
</template>

<script setup>
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
</script>

<style scoped>
/* =======================================
   GENERAL & TIPOGRAFÍA
   ======================================= */
.home-container {
    font-family: 'Inter', sans-serif;
    color: #334155;
    overflow-x: hidden;
}
.container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 20px;
}
.section {
    padding: 80px 0;
}
.bg-light {
    background-color: #f8fafc;
}
.lead-text {
    font-size: 18px;
    color: #334155;
    margin-bottom: 28px;
    line-height: 1.6;
}
.section-title {
    font-size: 32px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 40px;
    letter-spacing: -0.5px;
}
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-secondary { color: #64748b; }


/* =======================================
   HERO (Clonando estilo de Nosotros con curva)
   ======================================= */
.hero {
  /* Fondo moderno degradado y oscuro (tomado de Nosotros) */
  background: linear-gradient(135deg, #0056A6 0%, #003d7a 100%);
  color: white;
  padding: 140px 20px 180px; /* Más padding abajo para la curva */
  text-align: center;
  position: relative;
  /* La clave para la curva */
  clip-path: ellipse(150% 100% at 50% 0%); 
}

.hero-content h1 {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 15px;
  color: white; /* Color blanco sobre fondo azul */
}

.badge-hero {
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 16px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 20px;
  display: inline-block;
}
.hero-content .lead-text {
  color: white;
  opacity: 0.9;
}

/* =======================================
   BOTONES
   ======================================= */
.btn-primary {
  background: #fdfdfd; /* Botón claro para contrastar con Hero azul */
  padding: 16px 32px;
  border-radius: 50px; 
  color: #0056A6;
  font-size: 18px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  transition: 0.2s ease;
  display: inline-block;
  text-decoration: none;
  box-shadow: 0 6px 15px rgba(255, 255, 255, 0.3);
}

.btn-primary:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.5);
}

.btn-secondary {
  background: white;
  border: 2px solid #0056A6;
  padding: 12px 22px;
  border-radius: 8px;
  cursor: pointer;
  color: #0056A6;
  font-weight: 600;
  transition: 0.25s;
  text-decoration: none;
  display: inline-block;
}

.btn-secondary:hover {
  background: #e6f0ff;
}

/* =======================================
   SECCIÓN SERVICIOS (FEATURES)
   ======================================= */
.features-grid {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.feature-card {
  background: white;
  width: 300px;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  transition: 0.25s;
  text-align: center;
  border: 1px solid #e1e7f0;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 32px rgba(0,0,0,0.12);
  border-color: #bfdbfe;
}

/* Iconos circulares (Consistente con Dashboard) */
.icon-wrapper {
  width: 55px;
  height: 55px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto 15px;
}
.blue   { background: #eff6ff; color: #2563eb; }
.green  { background: #dcfce7; color: #16a34a; }
.orange { background: #ffedd5; color: #ea580c; }

.feature-card h3 {
  font-size: 20px;
  color: #0056a6;
  margin-bottom: 8px;
  font-weight: 700;
}

.feature-card p {
  color: #475569;
  font-size: 14px;
}

/* =======================================
   SECCIÓN NOSOTROS (SPLIT)
   ======================================= */
.split-about {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.about-text {
  max-width: 500px;
}

.about-image {
  width: 100%;
  padding-bottom: 60%; /* Ratio 16:10 */
  border-radius: 20px;
  background: url("https://images.unsplash.com/photo-1549925232-47525287f395?auto=format&fit=crop&w=800&q=80") center/cover no-repeat;
  box-shadow: 0 12px 30px rgba(0,0,0,0.15);
}

/* =======================================
   SECCIÓN CONTACTO CTA
   ======================================= */
.cta-section {
  background: #0f172a; /* Fondo oscuro elegante */
  color: white;
  padding: 80px 20px;
  text-align: center;
}

.cta-content h2 {
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 15px;
  color: white;
}

.cta-content p {
  font-size: 18px;
  opacity: 0.8;
  margin-bottom: 30px;
}


/* =======================================
   ANIMACIONES Y RESPONSIVE
   ======================================= */
.fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}
.delay-1 { animation-delay: 0.2s; }
.delay-2 { animation-delay: 0.4s; }
.delay-3 { animation-delay: 0.6s; }


@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.no-decoration {
  text-decoration: none;
}

/* =======================================
   BADGES INSTITUCIONALES (Solo logueado)
   ======================================= */
.hero-actions {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.hero-badges-container {
  display: flex;
  align-items: center;
  gap: 20px;
  
  /* Efecto Cristal del contenedor completo */
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  padding: 12px 30px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.apoc-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  text-align: left; /* Alineamos texto a la izquierda del icono */
}

.badge-icon {
  font-size: 24px;
  /* Un suave brillo detrás del icono */
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.4);
}

.badge-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.badge-text .title {
  font-weight: 800;
  font-size: 15px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.badge-text .subtitle {
  font-size: 12px;
  opacity: 0.8;
  font-weight: 400;
}

/* Separadores verticales */
.divider-vertical {
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.3);
}

/* RESPONSIVE: En celular se ponen uno debajo del otro */
@media (max-width: 768px) {
  .hero-badges-container {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start; /* Alinear a la izquierda se ve mejor en lista */
    padding: 20px;
    width: 100%;
    max-width: 300px; /* Que no sea gigante en móvil */
  }
  
  .divider-vertical {
    display: none; /* Ocultamos las líneas verticales en móvil */
  }
  
  .apoc-badge {
    width: 100%;
  }
}

/* Animación hover */
.btn-dashboard:hover .hero-arrow {
  transform: translateX(5px);
}
@media (max-width: 900px) {
  .hero-content h1 { font-size: 38px; }

  .split-about {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .about-image { 
    height: 250px;
    padding-bottom: 0;
  }

  .about-text {
    text-align: center;
    order: 2;
  }
  
  .about-text .section-title { text-align: center; }

  .features-grid {
    gap: 20px;
  }

  .feature-card {
    width: 100%;
    max-width: 400px;
  }
}
</style>