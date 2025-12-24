<template>
    <div class="contacto-container">

        <!-- HERO SECTION (Con estilo Nosotros) -->
        <section class="hero-contacto">
            <div class="hero-content fade-in-up">
                <h1>Hablemos</h1>
                <p>
                    Estamos para ayudarte. Escribinos tu consulta y te responderemos a la brevedad.
                </p>
            </div>
        </section>

        <!-- CONTENIDO PRINCIPAL (Formulario + Info) -->
        <section class="section contact-split">
            <div class="container split-layout">

                <!-- 1. FORMULARIO -->
                <div class="form-card fade-in-up delay-1">
                    <h2>Dejanos tu mensaje</h2>

                    <form @submit.prevent="enviar">
                        <div class="form-group">
                            <label>Nombre y Apellido</label>
                            <input type="text" v-model="nombre" required placeholder="Tu nombre completo" :disabled="loading" />
                        </div>

                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" v-model="email" required placeholder="email@ejemplo.com" :disabled="loading" />
                        </div>

                        <div class="form-group">
                            <label>Mensaje</label>
                            <textarea rows="6" v-model="mensaje" required placeholder="Escribí aquí tu consulta..." :disabled="loading"></textarea>
                        </div>

                        <button type="submit" class="btn-enviar" :disabled="loading">
                            <span v-if="!loading">Enviar mensaje</span>
                            
                            <!-- CORRECCIÓN: Separamos el spinner del texto -->
                            <span v-else class="loading-content">
                                <span class="spinner-only"></span>
                                Enviando...
                            </span>
                        </button>
                    </form>

                    <!-- Mensaje de estado (éxito/error) -->
                    <div v-if="successMsg" class="alert-box success fade-in">{{ successMsg }}</div>
                    <div v-if="errorMsg" class="alert-box error fade-in">{{ errorMsg }}</div>
                </div>

                <!-- 2. INFO CARD -->
                <div class="info-card fade-in-up delay-2">
                    <h2>Información de contacto</h2>

                    <div class="info-group">
                        <div class="info-item">
                            <span class="info-icon">📧</span>
                            <div class="info-details">
                                <span class="label">Correo Electrónico</span>
                                <span class="value">contacto@apoc.org</span>
                            </div>
                        </div>

                        <div class="info-item">
                            <span class="info-icon">📞</span>
                            <div class="info-details">
                                <span class="label">Teléfono Gratuito</span>
                                <span class="value">0800-000-0000</span>
                            </div>
                        </div>

                        <div class="info-item">
                            <span class="info-icon">📍</span>
                            <div class="info-details">
                                <span class="label">Oficina Central</span>
                                <span class="value">Ciudad Autónoma de Buenos Aires</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Mapa de ubicación (Placeholder visual) -->
                    <div class="map-placeholder">
                        <p>📍 Ver nuestra ubicación en el mapa</p>
                    </div>
                </div>

            </div>
        </section>

    </div>
</template>

<script>
import api from "../api/axios"; // Importamos la librería de axios/api

export default {
    data() {
        return {
            nombre: "",
            email: "",
            mensaje: "",
            successMsg: "",
            errorMsg: "",
            loading: false,
        };
    },
    methods: {
        async enviar() {
            this.loading = true;
            this.successMsg = "";
            this.errorMsg = "";

            try {
                // LLAMADA AL ENDPOINT DE LARAVEL PARA ENVIAR EL MAIL
                const resp = await api.post("/contacto/send", {
                    nombre: this.nombre,
                    email: this.email,
                    mensaje: this.mensaje,
                });

                // Si el servidor devuelve éxito (código 200)
                this.successMsg = resp.data.message || "¡Mensaje enviado con éxito! Te contactaremos pronto.";
                
                // Limpiar formulario
                this.nombre = "";
                this.email = "";
                this.mensaje = "";

            } catch (err) {
                console.error("Error de envío:", err);
                // Manejamos errores de validación o del servidor
                const serverError = err.response?.data?.message || "Error al enviar el mensaje. Revisa tu conexión.";
                this.errorMsg = serverError;
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>

<style scoped>
/* =======================================
   GENERAL & LAYOUT (Consistente con Nosotros)
   ======================================= */
.contacto-container {
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
    padding: 60px 0;
}
.bg-light {
    background-color: #f8fafc;
}
.split-layout {
    display: grid;
    grid-template-columns: 2fr 1fr; /* Formulario más grande que la info */
    gap: 40px;
    align-items: flex-start;
}

/* =======================================
   HERO SECTION (CON CURVA)
   ======================================= */
.hero-contacto {
    background: linear-gradient(135deg, #0056A6 0%, #003d7a 100%);
    color: white;
    padding: 100px 20px 120px; /* Más padding para la curva */
    text-align: center;
    position: relative;
    /* La clave para la curva */
    clip-path: ellipse(150% 100% at 50% 0%); 
}
.hero-content h1 {
    font-size: 40px;
    font-weight: 800;
    margin-bottom: 10px;
    color: white;
}
.hero-content p {
    font-size: 18px;
    opacity: 0.9;
}

/* =======================================
   FORMULARIO Y ESTADOS
   ======================================= */
.form-card {
    background: white;
    padding: 35px;
    border-radius: 16px;
    box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.08);
    border: 1px solid #e2e8f0;
}

.form-card h2 {
    color: #0f172a;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 30px;
}

.form-group {
    margin-bottom: 20px;
}

label {
    font-weight: 600;
    display: block;
    margin-bottom: 6px;
    color: #475569;
    font-size: 14px;
}

input,
textarea {
    width: 100%;
    padding: 12px 14px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    font-size: 15px;
    background: #f8fafc;
    transition: 0.2s;
    resize: vertical;
}

input:focus,
textarea:focus {
    border-color: #0056A6;
    background: white;
    box-shadow: 0 0 0 3px rgba(0, 86, 166, 0.1);
}

.btn-enviar {
    width: 100%;
    background: #0056A6;
    padding: 14px;
    border-radius: 8px;
    border: none;
    color: white;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s ease;
    
    /* Para centrar el spinner y el texto */
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px;
}

.btn-enviar:hover:not(:disabled) {
    background: #004485;
}

.btn-enviar:disabled {
    background: #94a3b8;
    cursor: not-allowed;
}

/* ALERTS */
.alert-box {
    margin-top: 20px;
    padding: 12px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
}
.alert-box.success {
    background: #dcfce7;
    color: #16a34a;
}
.alert-box.error {
    background: #fee2e2;
    color: #dc2626;
}

/* =======================================
   INFO CARD (Derecha)
   ======================================= */
.info-card {
    background: #f8fafc;
    padding: 35px;
    border-radius: 16px;
    box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
}

.info-card h2 {
    margin-bottom: 30px;
    font-size: 20px;
    color: #0056A6;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 10px;
}

.info-group {
    margin-bottom: 30px;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 25px;
}

.info-icon {
    font-size: 24px;
    background: #eff6ff;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.info-details {
    text-align: left;
}
.info-details .label {
    display: block;
    font-size: 12px;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.info-details .value {
    display: block;
    font-size: 16px;
    color: #1e293b;
    font-weight: 500;
    margin-top: 2px;
}

.map-placeholder {
    background: #eaf3ff;
    padding: 20px;
    border-radius: 12px;
    border: 1px dashed #bfdbfe;
    text-align: center;
    font-size: 14px;
    color: #0056A6;
}

/* =======================================
   ANIMACIONES & SPINNER CORREGIDO
   ======================================= */
.fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
    opacity: 0;
    transform: translateY(30px);
}
.delay-1 { animation-delay: 0.2s; }
.delay-2 { animation-delay: 0.4s; }

@keyframes fadeInUp {
    to { opacity: 1; transform: translateY(0); }
}

/* Contenido del loading */
.loading-content {
    display: flex;
    align-items: center;
    gap: 8px; /* Espacio entre el spinner y el texto */
    font-size: 15px; /* Para que el texto no gire, va fuera de spinner-only */
}

/* SPINNER CIRCULAR PURO */
.spinner-only {
    border: 3px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top: 3px solid white;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
    flex-shrink: 0; /* Evita que se encoja */
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}


@media (max-width: 900px) {
    .split-layout {
        grid-template-columns: 1fr;
    }
    .form-card { order: 2; }
    .info-card { order: 1; }
}
</style>