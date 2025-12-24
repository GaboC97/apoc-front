<template>
  <div class="nosotros-container">

    <!-- HERO SECTION -->
    <section class="hero-nosotros">
      <div class="hero-content fade-in-up">
        <span class="badge-hero">Sobre APOC</span>
        <h1>Compromiso y Defensa</h1>
        <p>
          Somos una organización dedicada al bienestar, la defensa de derechos 
          y el desarrollo profesional de quienes construyen el control estatal día a día.
        </p>
      </div>
    </section>

    <!-- BLOQUE INSTITUCIONAL -->
    <section class="section institucional">
      <div class="container split-layout">
        
        <div class="text-col fade-in-up delay-1">
          <h2 class="section-title">Nuestra Identidad</h2>
          <p class="lead">
            Trabajamos para fortalecer la calidad institucional y garantizar derechos.
          </p>
          <p>
            APOC impulsa la transparencia en la gestión pública y asegura el acceso equitativo 
            a beneficios y oportunidades. Acompañamos cada etapa laboral, profesional y personal 
            de nuestra comunidad, promoviendo condiciones justas y capacitación permanente.
          </p>
        </div>

        <div class="img-col fade-in-up delay-2">
          <div class="image-card">
            <!-- Placeholder de imagen profesional -->
            <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80" alt="Equipo APOC" />
          </div>
        </div>

      </div>
    </section>

    <!-- MISIÓN Y VISIÓN -->
    <section class="section bg-light">
      <div class="container">
        <div class="mv-grid">
          
          <div class="mv-card fade-in-up delay-1">
            <div class="mv-icon">🎯</div>
            <h3>Misión</h3>
            <p>
              Defender y promover los derechos laborales, sociales y profesionales de 
              nuestras afiliadas y afiliados, acompañando su desarrollo con servicios 
              modernos, ágiles y transparentes.
            </p>
          </div>

          <div class="mv-card fade-in-up delay-2">
            <div class="mv-icon">👁️</div>
            <h3>Visión</h3>
            <p>
              Ser una organización referente en innovación sindical, cercana a la 
              comunidad y comprometida activamente con la calidad institucional y 
              el control público del país.
            </p>
          </div>

        </div>
      </div>
    </section>

    <!-- VALORES -->
    <section class="section valores">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="section-title">Nuestros Valores</h2>
          <p class="subtitle">Los pilares que guían cada una de nuestras acciones.</p>
        </div>

        <div class="valores-grid">
          
          <div class="valor-card fade-in-up">
            <div class="icon-wrapper blue">🔍</div>
            <h3>Transparencia</h3>
            <p>Procesos claros, accesibles y auditables para todos.</p>
          </div>

          <div class="valor-card fade-in-up delay-1">
            <div class="icon-wrapper green">🤝</div>
            <h3>Compromiso</h3>
            <p>Acompañamos de cerca cada necesidad de nuestros afiliados.</p>
          </div>

          <div class="valor-card fade-in-up delay-2">
            <div class="icon-wrapper purple">⚖️</div>
            <h3>Equidad</h3>
            <p>Promovemos igualdad de oportunidades y derechos.</p>
          </div>

          <div class="valor-card fade-in-up delay-3">
            <div class="icon-wrapper orange">💡</div>
            <h3>Innovación</h3>
            <p>Modernizamos constantemente nuestros servicios y herramientas.</p>
          </div>

        </div>
      </div>
    </section>

    <!-- CTA FINAL -->
    <section class="cta-section">
      <div class="cta-content fade-in-up">
        <h2>Conocé todo lo que podés hacer con APOC</h2>
        <p>Sumate a una comunidad que te respalda en cada paso de tu carrera.</p>
        <router-link to="/dashboard" class="btn-cta">
          Ingresar a Autogestión →
        </router-link>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* GENERAL */
.nosotros-container {
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

.section-title {
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 20px;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 18px;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
}

.text-center { text-align: center; }
.mb-5 { margin-bottom: 50px; }

/* HERO SECTION */
.hero-nosotros {
  background: linear-gradient(135deg, #0056A6 0%, #003d7a 100%);
  color: white;
  padding: 120px 20px 100px;
  text-align: center;
  position: relative;
  /* Curva sutil abajo */
  clip-path: ellipse(150% 100% at 50% 0%); 
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
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

.hero-nosotros h1 {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 20px;
  line-height: 1.1;
  color: white;
}

.hero-nosotros p {
  font-size: 20px;
  opacity: 0.9;
  line-height: 1.6;
}

/* INSTITUCIONAL (Split Layout) */
.split-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.lead {
  font-size: 20px;
  font-weight: 500;
  color: #0056A6;
  margin-bottom: 20px;
  line-height: 1.5;
}

.image-card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15);
  transform: rotate(2deg); /* Toque de diseño */
  border: 8px solid white;
}

.image-card img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.5s ease;
}

.image-card:hover img {
  transform: scale(1.05);
}

/* MISIÓN Y VISIÓN */
.mv-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.mv-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05);
  border-top: 5px solid #0056A6;
  transition: transform 0.3s;
}

.mv-card:hover {
  transform: translateY(-5px);
}

.mv-icon {
  font-size: 40px;
  margin-bottom: 20px;
}

.mv-card h3 {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 15px;
}

/* VALORES (Grid de 4) */
.valores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 30px;
}

.valor-card {
  background: white;
  padding: 30px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  text-align: center;
}

.valor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
}

/* Íconos con círculo (Igual al Dashboard) */
.icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin: 0 auto 20px;
}

.blue   { background: #eff6ff; color: #2563eb; }
.green  { background: #dcfce7; color: #16a34a; }
.purple { background: #f3e8ff; color: #9333ea; }
.orange { background: #ffedd5; color: #ea580c; }

.valor-card h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #0f172a;
}

.valor-card p {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
}

/* CTA FINAL */
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

.btn-cta {
  background: #0056A6;
  color: white;
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 700;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.2s;
  display: inline-block;
  box-shadow: 0 4px 15px rgba(0, 86, 166, 0.4);
}

.btn-cta:hover {
  background: #004485;
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 86, 166, 0.6);
}

/* ANIMACIONES */
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

/* RESPONSIVE */
@media (max-width: 900px) {
  .hero-nosotros h1 { font-size: 36px; }
  
  .split-layout {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 40px;
  }

  .image-card { transform: rotate(0deg); margin: 0 auto; max-width: 500px; }

  .mv-grid { grid-template-columns: 1fr; }
}
</style>