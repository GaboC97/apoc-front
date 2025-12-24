# APOC · Frontend (Vue 3 + Vite)

> 🇪🇸 **Versión en Español**  
> 🇬🇧 **English version below**

---

## 🇪🇸 Español

Frontend de la plataforma **APOC**, una aplicación web para la **gestión de reintegros y subsidios**, con autenticación por roles y consumo de una API REST.

Este proyecto es un **demo funcional**, desarrollado para mostrar buenas prácticas de desarrollo frontend moderno, arquitectura clara y correcta integración con un backend en Laravel.

---

### 🚀 Tecnologías utilizadas

- **Vue 3** (Composition API)
- **Vite** (bundler y entorno de desarrollo)
- **Vue Router** (navegación y rutas protegidas)
- **Pinia** (gestión de estado global)
- **Axios** (comunicación con API REST)
- **Bootstrap Icons**
- **Vue Multiselect**
- **CSS moderno / UI personalizada**

---

### 🧱 Arquitectura del proyecto

```
src/
├── api/                # Configuración de Axios y API
│   └── api.js
├── components/         # Componentes reutilizables
├── views/              # Vistas (Login, Dashboard, etc.)
├── router/             # Vue Router + guards
│   └── index.js
├── stores/             # Pinia stores (auth, datos)
├── assets/             # Estilos e imágenes
├── App.vue
└── main.js
```

#### 🔌 Comunicación con la API
- Backend en **Laravel**
- Autenticación por **token (Sanctum)**
- Interceptor Axios para adjuntar el token automáticamente
- Control de acceso por rol (usuario / admin)

---

### 🔐 Roles y permisos

**Usuario**
- Iniciar sesión
- Crear y visualizar reintegros
- Consultar el estado de sus solicitudes

**Administrador**
- Acceso al panel administrativo
- Visualizar todos los reintegros
- Aprobar / rechazar solicitudes
- Consultar historial

---

### 🧪 Credenciales de prueba (Demo)

**Usuario**
- Email: usuario@demo.com
- Password: 12345

**Administrador**
- Email: admin@demo.com
- Password: 12345

---

### ⚙️ Variables de entorno

```env
VITE_API_URL=https://tu-backend.com/backend/public/api
```

---

### ▶️ Cómo ejecutar el proyecto

```bash
npm install
npm run dev
```

Build de producción:
```bash
npm run build
npm run preview
```

---

### 🌍 Deploy

- Frontend: **Vercel**
- Backend: **Hostinger (Laravel + MySQL)**
- SPA routing configurado correctamente (refresh / F5)
- Comunicación segura vía HTTPS

---

### 🎯 Objetivo del proyecto

- Demostrar experiencia real con **Vue 3**
- Implementar autenticación y roles
- Aplicar arquitectura frontend limpia y escalable
- Servir como demo técnico para recruiters o clientes

---

## 🇬🇧 English

Frontend of the **APOC** platform, a web application for **reimbursements and subsidies management**, featuring role-based authentication and REST API consumption.

This project is a **fully functional demo**, created to showcase modern frontend development practices, clean architecture, and proper integration with a Laravel backend.

---

### 🚀 Tech Stack

- **Vue 3** (Composition API)
- **Vite** (build tool & dev server)
- **Vue Router**
- **Pinia**
- **Axios**
- **Bootstrap Icons**
- **Vue Multiselect**
- **Modern CSS / custom UI**

---

### 🧱 Project Architecture

```
src/
├── api/
├── components/
├── views/
├── router/
├── stores/
├── assets/
├── App.vue
└── main.js
```

---

### 🔐 Roles & Permissions

**User**
- Login
- Create and view reimbursements
- Track request status

**Administrator**
- Admin dashboard access
- Approve / reject requests

---

### 🧪 Demo Credentials

**User**
- Email: usuario@demo.com
- Password: 12345

**Administrator**
- Email: admin@demo.com
- Password: 12345

---

## 👨‍💻 Author

Gabriel Carbone  
Full Stack Developer  
