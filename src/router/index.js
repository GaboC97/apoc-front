import { createRouter, createWebHistory } from "vue-router";

import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import ReintegroNuevoView from "../views/ReintegroNuevoView.vue";
import ReintegrosView from "../views/ReintegrosUsuarioView.vue";
import SubsidioView from "../views/SubsidiosUsuarioView.vue";
import HomeView from "../views/HomeView.vue";
import AdminReintegrosView from "../views/AdminPendientes.vue";
import AdminReintegrosHistorialView from "../views/AdminHistorial.vue";
import NosotrosView from "../views/NosotrosView.vue";
import ContactoView from "../views/ContactoView.vue";
import SubsidioNuevoView from "../views/SubsidioNuevoView.vue";
import { useAuthStore } from "../stores/auth.js";

const routes = [
  // =========================================
  // RUTAS PÚBLICAS (Layout: 'public')
  // =========================================
  { path: "/", redirect: "/home" },

  { 
    path: "/home", 
    name: "home", 
    component: HomeView,
    meta: { layout: 'public' } // <--- Navbar Pública
  },
  { 
    path: "/login", 
    name: "login", 
    component: LoginView,
    meta: { layout: 'public' } // <--- Navbar Pública
  },
  { 
    path: "/nosotros", 
    name: "nosotros", 
    component: NosotrosView,
    meta: { layout: 'public' } // <--- Navbar Pública
  },
  { 
    path: "/contacto", 
    name: "contacto", 
    component: ContactoView,
    meta: { layout: 'public' } // <--- Navbar Pública
  },

  // =========================================
  // RUTAS PROTEGIDAS (Layout: 'dashboard')
  // =========================================
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
    // Agregamos layout: 'dashboard' a las existentes
    meta: { requiresAuth: true, layout: 'dashboard' }, 
  },
  {
    path: "/reintegros",
    name: "reintegros",
    component: ReintegrosView,
    // Mantenemos tu hideFooter y agregamos el layout
    meta: { requiresAuth: true, hideFooter: true, layout: 'dashboard' }, 
  },
  {
    path: "/subsidios",
    name: "subsidios",
    component: SubsidioView,
    meta: { requiresAuth: true, hideFooter: true, layout: 'dashboard' },
  },
  {
    path: "/subsidios/nuevo",
    name: "subsidios-nuevo",
    component: SubsidioNuevoView,
    meta: { requiresAuth: true, layout: 'dashboard' },
  },
  {
    path: "/reintegros/nuevo",
    name: "reintegros-nuevo",
    component: ReintegroNuevoView,
    meta: { requiresAuth: true, layout: 'dashboard' },
  },
  
  // =========================================
  // RUTAS ADMIN (Layout: 'dashboard')
  // =========================================
  {
    path: "/admin/reintegros",
    name: "admin.reintegros",
    component: AdminReintegrosView,
    meta: { requiresAuth: true, layout: 'dashboard' },
  },
  {
    path: "/admin/reintegros/historial",
    name: "admin.reintegros.historial",
    component: AdminReintegrosHistorialView,
    meta: { requiresAuth: true, layout: 'dashboard' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard de navegación (Sin cambios, solo validamos que funcione bien)
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  // esperar a que el store esté listo
  if (!auth.isReady) {
    const unwatch = auth.$subscribe(() => {
      unwatch();
      next();
    });
    return;
  }

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next("/login");
  }

  next();
});

export default router;