<template>
    <div class="login-container">
        
        <div class="login-card fade-in">
            
            <!-- LOGO -->
            <div class="logo-wrapper">
                <img :src="apocLogo" alt="APOC" class="login-logo" />
            </div>

            <h2 class="welcome-title">Bienvenido</h2>
            <p class="subtitle">Ingresá tus credenciales para continuar</p>

            <!-- FORMULARIO -->
            <form @submit.prevent="handleLogin">
                
                <div class="form-group">
                    <label>Correo electrónico</label>
                    <input 
                        v-model="email" 
                        type="email" 
                        placeholder="ejemplo@email.com" 
                        required 
                        :disabled="loading"
                    />
                </div>

                <div class="form-group">
                    <label>Contraseña</label>
                    <input 
                        v-model="password" 
                        type="password" 
                        placeholder="••••••••" 
                        required 
                        :disabled="loading"
                    />
                </div>

                <!-- MENSAJE DE ERROR -->
                <div v-if="error" class="error-alert">
                    ⚠️ {{ error }}
                </div>

                <!-- BOTÓN PRINCIPAL -->
                <button type="submit" class="btn-login" :class="{ 'loading': loading }" :disabled="loading">
                    <span v-if="!loading">Ingresar</span>
                    <span v-else class="spinner"></span>
                </button>
            </form>
            
            <!-- BOTÓN SECUNDARIO / HOME -->
            <router-link to="/home" class="btn-home-link">
                ← Volver al Inicio
            </router-link>


            <!-- FOOTER -->
            <div class="login-footer">
                <p>© 2025 APOC - Chubut</p>
            </div>

        </div>
    </div>
</template>

<script>
import api from "../api/axios";
import apocLogo from "../assets/apoc.png";
import { useAuthStore } from "../stores/auth";

export default {
    data() {
        return {
            email: "",
            password: "",
            error: "",
            loading: false, // Estado de carga
            apocLogo,
        };
    },
    methods: {
        async handleLogin() {
            const auth = useAuthStore();
            this.error = "";
            this.loading = true; // Activamos carga

            try {
                const resp = await api.post("/login", {
                    email: this.email,
                    password: this.password,
                });

                // Lógica robusta para encontrar el token/user
                const incomingToken = resp.data?.token || resp.token || resp.data?.data?.token;
                const incomingUser = resp.data?.user || resp.user || resp.data?.data?.user;

                if (incomingToken && incomingUser) {
                    auth.login(incomingToken, incomingUser);
                    this.$router.push("/dashboard");
                } else {
                    console.error("Respuesta inesperada:", resp);
                    this.error = "Error de comunicación con el servidor.";
                }

            } catch (err) {
                console.error(err);
                // Mensaje amigable según el error
                if (err.response && err.response.status === 401) {
                    this.error = "Credenciales incorrectas. Verificá tu email y contraseña.";
                } else {
                    this.error = "Ocurrió un problema. Intentalo más tarde.";
                }
            } finally {
                this.loading = false; // Desactivamos carga siempre
            }
        }
    }
};
</script>

<style scoped>
/* CONTENEDOR FONDO */
.login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f4f8; /* Gris azulado muy suave */
    padding: 20px;
    font-family: 'Inter', sans-serif;
}

/* TARJETA LOGIN */
.login-card {
    background: white;
    width: 100%;
    max-width: 400px;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 
                0 8px 10px -6px rgba(0, 0, 0, 0.01);
    text-align: center;
    border: 1px solid #e2e8f0;
}

/* LOGO */
.logo-wrapper {
    margin-bottom: 25px; 
}
.login-logo {
    width: 120px; 
    height: auto;
    display: inline-block;
}

/* TEXTOS */
.welcome-title {
    font-size: 24px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 8px 0;
    letter-spacing: -0.5px;
}

.subtitle {
    font-size: 14px;
    color: #64748b;
    margin: 0 0 30px 0;
}

/* FORMULARIO */
.form-group {
    text-align: left;
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #334155;
    margin-bottom: 6px;
}

.form-group input {
    width: 100%;
    padding: 12px 16px;
    font-size: 15px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    outline: none;
    transition: all 0.2s ease;
    background-color: #f8fafc;
    color: #0f172a;
}

.form-group input:focus {
    border-color: #0056A6;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(0, 86, 166, 0.1);
}

/* BOTÓN PRINCIPAL */
.btn-login {
    width: 100%;
    padding: 12px;
    background-color: #0056A6;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px; /* Altura fija */
    margin-bottom: 15px; /* Espacio para el botón Home */
}

.btn-login:hover:not(:disabled) {
    background-color: #004485;
}

.btn-login:disabled {
    background-color: #94a3b8;
    cursor: not-allowed;
}

/* BOTÓN SECUNDARIO HOME */
.btn-home-link {
    display: block;
    width: 100%;
    padding: 10px;
    font-size: 14px;
    color: #0056A6;
    text-decoration: none;
    font-weight: 600;
    border-radius: 8px;
    transition: background 0.2s;
}

.btn-home-link:hover {
    background-color: #e6f0ff; /* Fondo azul claro al pasar el mouse */
}

/* ALERTAS */
.error-alert {
    margin-bottom: 20px;
    padding: 12px;
    background-color: #fee2e2;
    color: #991b1b;
    font-size: 13px;
    font-weight: 500;
    border-radius: 8px;
    border: 1px solid #fecaca;
    animation: shake 0.4s ease-in-out;
}

/* FOOTER */
.login-footer {
    margin-top: 30px;
    border-top: 1px solid #f1f5f9;
    padding-top: 20px;
}
.login-footer p {
    font-size: 12px;
    color: #94a3b8;
    margin: 0;
}

/* ANIMACIONES */
.fade-in {
    animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
}

/* SPINNER */
.spinner {
    border: 3px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top: 3px solid white;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>