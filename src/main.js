import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import api from './api/axios'
import { createPinia } from 'pinia'
import 'bootstrap-icons/font/bootstrap-icons.css';
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'

// Configurar token si existe
const token = localStorage.getItem("token");
if (token) {
    api.defaults.headers.Authorization = "Bearer " + token;
}

// Crear aplicación
const app = createApp(App)

// Registrar componente global AHORA (después de createApp)
app.component('Multiselect', Multiselect)

// Instalar Pinia
app.use(createPinia())

// Instalar Router
app.use(router)

// Montar app
app.mount('#app')
