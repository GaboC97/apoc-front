<script setup>
import { useAuthStore } from "../stores/auth"
import { storeToRefs } from "pinia"
import { ref, onMounted, watch, computed } from "vue"
import api from "../api/axios"
import { useNotificationStore } from "../stores/notification"
import ModalDetalle from "../components/ModalDetalle.vue";


const auth = useAuthStore()
const notify = useNotificationStore()
const { user, isReady } = storeToRefs(auth)

const isUser = computed(() => user.value?.role === 'user')

const stats = ref({ en_revision: 0, aprobados: 0, rechazados: 0, total: 0 })
const recentActivity = ref([])
const loadingStats = ref(true)

const showModal = ref(false);
const selectedItem = ref(null);


const formatearFecha = (fechaISO) => {
  if (!fechaISO) return '-';
  const fecha = new Date(fechaISO);
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(fecha);
};

const formatearEstado = (estado) => {
  if (!estado) return '';
  const mapa = {
    'en_revision': 'En Revisión',
    'EN_REVISION': 'En Revisión',
    'pendiente': 'Pendiente',
    'PENDIENTE': 'Pendiente',
    'aprobado': 'Aprobado',
    'APROBADO': 'Aprobado',
    'rechazado': 'Rechazado',
    'RECHAZADO': 'Rechazado'
  };
  return mapa[estado] || estado;
};

const formatearTipo = (tipo) => {
  if (!tipo) return 'Trámite';
  return tipo.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

const getStatusClass = (status) => {
  if (!status) return 'badge-warning';
  const s = status.toLowerCase();
  if (s.includes('aprobado')) return 'badge-success';
  if (s.includes('rechazado')) return 'badge-danger';
  return 'badge-warning';
}

const abrirModal = (item) => {
  console.log("Datos recibidos en modal:", item);

  selectedItem.value = {
    id: item.id,
    fecha: item.created_at || item.fecha,
    estado: item.estado,
    titulo: item.titulo || item.tipo_subsidio || item.tipo_reintegro || 'Detalle',
    tipo: item.tipo === 'reintegros' ? 'Reintegro' : 'Subsidio',
    archivos: item.archivos, 
    archivo_url: item.archivo_url || item.archivo_path,
    archivo_nombre: item.archivo_nombre || item.nombre_original,
    rechazo_motivo: item.rechazo_motivo || null,
    razon_personalizada: item.razon_personalizada || null
  };

  showModal.value = true;
};

const fetchDashboardData = async () => {
  loadingStats.value = true
  try {
    const { data: statsData } = await api.get('/dashboard-stats')
    stats.value = statsData

    if (isUser.value) {
      const [resReintegros, resSubsidios] = await Promise.all([
          api.get('/reintegros'),
          api.get('/subsidios')
      ]);
      const listaReintegros = Array.isArray(resReintegros.data) ? resReintegros.data : (resReintegros.data.data || []);
      const listaSubsidios  = Array.isArray(resSubsidios.data)  ? resSubsidios.data  : (resSubsidios.data.data  || []);
      const combinados = [...listaReintegros, ...listaSubsidios];
      combinados.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      recentActivity.value = combinados.slice(0, 5).map(item => {
          const esReintegro = !!item.tipo_reintegro;
          
          return {
            ...item,
            titulo: esReintegro 
                ? formatearTipo(item.tipo_reintegro) 
                : formatearTipo(item.tipo_subsidio),
            
            fecha: item.created_at,
            estado: item.estado,
            tipo: esReintegro ? 'reintegros' : 'subsidios', 
            archivo_url: item.archivo_path, 
            archivo_nombre: item.nombre_original || 'Documento Adjunto'
          };
      });
    }

  } catch (e) {
    console.error("Error al cargar dashboard:", e)
    notify.error("No se pudieron actualizar los datos")
  } finally {
    loadingStats.value = false
  }
}

onMounted(() => { if (isReady.value) fetchDashboardData() })
watch(isReady, (ready) => { if (ready) fetchDashboardData() })
</script>

<template>
  <div v-if="!isReady || loadingStats" class="loading-container">
    <div class="spinner"></div>
    <p>Actualizando información...</p>
  </div>

  <div v-else class="dashboard-container fade-in">

    <header class="dash-header">
      <div>
        <h1>Hola, <span class="highlight">{{ user?.name?.split(' ')[0] }}</span> 👋</h1>
        <p class="subtitle" v-if="isUser">Tu resumen de actividad reciente.</p>
        <p class="subtitle" v-else>Panel de Control General.</p>
      </div>

    </header>

<section class="kpi-grid" v-if="isUser">
      <div class="stat-card">
        <div class="stat-icon yellow">⏳</div>
        <div class="stat-text">
          <h3>{{ stats.en_revision }}</h3>
          <p>{{ isUser ? 'En Revisión' : 'Pendientes' }}</p> 
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">✅</div>
        <div class="stat-text">
          <h3>{{ stats.aprobados }}</h3>
          <p>Aprobados</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon red">❌</div>
        <div class="stat-text">
          <h3>{{ stats.rechazados }}</h3>
          <p>Rechazados</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon blue">📂</div>
        <div class="stat-text">
          <h3>{{ stats.total }}</h3>
          <p>Total Histórico</p>
        </div>
      </div>
    </section>

    <div :class="['dashboard-content', isUser ? 'layout-user' : 'layout-admin']">

      <div class="actions-section">
        <h2 class="section-title">{{ isUser ? 'Accesos Rápidos' : 'Gestión Administrativa' }}</h2>

        <div class="cards-grid">
          <template v-if="isUser">
            <router-link to="/reintegros" class="action-card">
              <span class="icon">🧾</span>
              <span class="text">Mis Reintegros</span>
              <span class="arrow">→</span>
            </router-link>
            <router-link to="/subsidios" class="action-card">
              <span class="icon">👶</span>
              <span class="text">Mis Subsidios</span>
              <span class="arrow">→</span>
            </router-link>
            <router-link to="/reintegros/nuevo" class="action-card highlight-card">
              <span class="icon">➕</span>
              <span class="text">Cargar Reintegro</span>
              <span class="arrow">→</span>
            </router-link>
            <router-link to="/subsidios/nuevo" class="action-card highlight-card">
              <span class="icon">🏥</span>
              <span class="text">Solicitar Subsidio</span>
              <span class="arrow">→</span>
            </router-link>
          </template>

          <template v-else>
            <router-link to="/admin/reintegros" class="action-card highlight-card admin-big">
              <div class="card-top">
                <span class="icon">⏳</span>
                <span class="badge-count">{{ stats.en_revision }}</span>
              </div>
              <div class="card-body">
                <h3>Pendientes</h3>
                <p>Solicitudes nuevas.</p>
              </div>
              <span class="arrow">Revisar →</span>
            </router-link>

            <router-link to="/admin/reintegros/historial" class="action-card admin-big">
              <div class="card-top">
                <span class="icon">📚</span>
              </div>
              <div class="card-body">
                <h3>Historial</h3>
                <p>Historial de Reintegros / Subsidios</p>
              </div>
              <span class="arrow">Ver todo →</span>
            </router-link>

            <div class="action-card admin-big disabled">
              <div class="card-top"><span class="icon">👥</span></div>
              <div class="card-body">
                <h3>Padrón</h3>
                <p>Próximamente.</p>
              </div>
            </div>
            <div class="action-card admin-big disabled">
              <div class="card-top"><span class="icon">⚙️</span></div>
              <div class="card-body">
                <h3>Ajustes</h3>
                <p>Configuración.</p>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div v-if="isUser" class="activity-section">
        <div class="section-header">
          <h2 class="section-title">Últimos Movimientos</h2>
          <router-link to="/reintegros" class="view-all">Ver todo</router-link>
        </div>

        <div class="activity-table-wrapper">
<table class="activity-table">
            <thead>
              <tr>
                <th>Trámite</th>
                <th>Tipo</th> <th>Estado</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in recentActivity" :key="item.id">
                <td>
                  <div class="td-title">{{ item.titulo }}</div>
                  <div class="td-date">{{ formatearFecha(item.fecha) }}</div>
                </td>

                <td>
                   <span class="category-badge" :class="item.tipo === 'reintegros' ? 'cat-reintegro' : 'cat-subsidio'">
                      {{ item.tipo === 'reintegros' ? 'Reintegro' : 'Subsidio' }}
                   </span>
                </td>

                <td>
                  <span class="badge" :class="getStatusClass(item.estado)">
                    {{ formatearEstado(item.estado) }}
                  </span>
                </td>
                <td class="td-action">
                  <button class="btn-icon btn-eye" @click="abrirModal(item)" title="Ver detalle">
                    👁️
                  </button>
                </td>
              </tr>

              <tr v-if="recentActivity.length === 0">
                <td colspan="4" class="text-center">No hay movimientos recientes.</td> </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
    <ModalDetalle v-if="showModal" :isOpen="showModal" :item="selectedItem" @close="showModal = false" />
  </div>
</template>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Inter', sans-serif;
  width: 100%;
}

/* HEADER */
.dash-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.dash-header h1 {
  font-size: 26px;
  color: #1e293b;
  margin: 0;
}

.highlight {
  color: #0056A6;
}

.subtitle {
  color: #64748b;
  margin-top: 5px;
  font-size: 15px;
}

.header-btn {
  background: #0056A6;
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: 0.2s;
}

.header-btn:hover {
  background: #004482;
  transform: translateY(-2px);
}

/* KPI GRID */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 50px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
  transition: 0.2s;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.yellow {
  background: #fffbeb;
}

.green {
  background: #dcfce7;
}

.red {
  background: #fee2e2;
}

.blue {
  background: #eff6ff;
}

.stat-text h3 {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.stat-text p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}


/* ===========================
   LAYOUT DINÁMICO (LA CLAVE)
   =========================== */

/* Caso 1: USUARIO (2 Columnas asimétricas) */
.layout-user {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  /* Izquierda chica, Derecha grande */
  gap: 40px;
}

.layout-user .cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  /* 2x2 */
  gap: 15px;
}

/* Caso 2: ADMIN (1 Columna full width, pero con tarjetas grandes) */
.layout-admin {
  display: block;
  /* Ocupa todo */
}

.layout-admin .cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  /* Tarjetas grandes adaptables */
  gap: 25px;
}

/* En tablets o móvil, ambos colapsan a 1 columna */
@media (max-width: 900px) {
  .layout-user {
    grid-template-columns: 1fr;
  }
}

/* --- CARTAS GENÉRICAS --- */
.action-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-left: 5px solid #0056A6;
  padding: 20px;
  border-radius: 12px;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  transition: all 0.2s ease-in-out;
  color: #475569;
  position: relative;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  
}

.action-card:hover {
  border-color: #003d73;
  border-left-color: #003d73;
  color: #0056A6;
  background: #f0f7ff;
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.action-card .icon {
  font-size: 28px;
}

.action-card .text {
  font-size: 14px;
  font-weight: 600;
}

.action-card .arrow {
  font-size: 12px;
  opacity: 0;
  transition: 0.2s;
  transform: translateY(5px);
}

.action-card:hover .arrow {
  opacity: 1;
transform: translateY(0);
text-decoration: none;
}
/* --- ESTILO ESPECIAL PARA ADMIN CARDS --- */
.admin-big {
  align-items: flex-start;
  text-align: left;
  padding: 25px;
  gap: 15px;
  min-height: 160px;
  justify-content: space-between;
}

.admin-big:not(.disabled):hover {
  border-color: #003d73;
  border-left-color: #003d73; /* Aseguramos que el borde izquierdo también se oscurezca */
  transform: translateY(-3px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  color: #475569;
  background: #f0f7ff;
}


.admin-big .card-top {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

/* Iconos más grandes y destacados */
.admin-big .icon {
    font-size: 28px;
    line-height: 1;
}

/* Badge (Contador) - Base */
.admin-big .badge-count {
  background: #0056A6; /* Azul por defecto */
  color: white;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 700;
  min-width: 25px;
  text-align: center;
}

.admin-big h3 {
  margin: 0;
  color: #1e293b;
  font-size: 20px;
  font-weight: 700;
}

.admin-big p {
  margin: 5px 0 0;
  font-size: 14px;
  color: #64748b;
}

.admin-big .arrow {
  align-self: flex-end;
  opacity: 1;
  transform: none;
  font-weight: 600;
  color: #0056A6;
  font-size: 14px;
}
.action-card:not(.disabled):hover .arrow {
    color: #003d73;
}

/* Estado Desactivado (Disabled) */
.disabled {
  opacity: 0.6;
  pointer-events: none;
  background-color: #f8fafc; /* Fondo ligeramente gris para inactivos */
  box-shadow: none;

  /* CAMBIO CLAVE: Borde izquierdo gris suave para las disabled */
  border-left-color: #cbd5e1; /* Borde izquierdo gris suave */
  border-color: #e2e8f0; /* El resto de los bordes siguen siendo sutiles */
}

/* Estilos de texto e ícono de tarjetas disabled */
.disabled h3, .disabled p {
    color: #94a3b8 !important;
}
.disabled .icon {
    filter: grayscale(100%);
    opacity: 0.8;
}
.disabled .arrow {
    display: none;
}

/* TABLA */
.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.view-all {
  font-size: 13px;
  color: #0056A6;
  text-decoration: none;
  font-weight: 600;
}

.activity-table-wrapper {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  /* Clave para que los bordes redondeados no se rompan */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
}

.activity-table {
  width: 100%;
  border-collapse: collapse;
}

.activity-table th {
  background: #0056A6;
  padding: 16px 24px;
  /* Más aire */
  text-align: left;
  font-size: 12px;
  color: #ffffff;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.activity-table td {
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
  background-color: white;
  /* Fondo base blanco */
  transition: background-color 0.2s ease;
  /* Transición suave */
}

.activity-table tbody tr:hover td {
  background-color: #e6f5ff;
  /* Azul muy clarito */
}

.activity-table tbody tr:last-child td {
  border-bottom: none;
}

/* Textos */
.td-title {
  font-weight: 700;
  color: #334155;
  font-size: 14px;
  margin-bottom: 2px;
}

/* Al hacer hover, oscurecemos un poquito el título para dar feedback */
.activity-table tbody tr:hover .td-title {
  color: #0056A6;
}

.td-date {
  font-size: 12px;
  color: #94a3b8;
}

/* Botón de acción (Ojito) */
.td-action {
  text-align: right;
  /* Alineado a la derecha para que quede prolijo */
  width: 50px;
  /* Ancho fijo para que no baile */
}

/* Hover de la fila afecta al botón también (opcional) */
.activity-table tbody tr:hover .btn-eye {
  color: #0056A6;
  /* Se pone azul cuando pasas el mouse por la fila */
}

/* --- BADGES DE CATEGORÍA (TIPO) --- */
.category-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
}

/* Estilo para Reintegros (Violeta) */
.cat-reintegro {
  background-color: #f3e8ff; /* Fondo lila suave */
  color: #7e22ce;            /* Texto violeta fuerte */
  border: 1px solid #d8b4fe;
}

/* Estilo para Subsidios (Naranja) */
.cat-subsidio {
  background-color: #ffedd5; /* Fondo naranja suave */
  color: #c2410c;            /* Texto naranja fuerte */
  border: 1px solid #fed7aa;
}

/* BADGES */
.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.badge-success {
  background: #dcfce7;
  color: #166534;
}

.badge-warning {
  background: #fef9c3;
  color: #854d0e;
}

.badge-danger {
  background: #fee2e2;
  color: #991b1b;
}

.btn-icon {
  text-decoration: none;
  font-size: 16px;
  opacity: 0.6;
}

.btn-eye {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  /* Gris por defecto */
}

/* Hover específico del botón */
.btn-eye:hover {
  background-color: #dbeafe;
  /* Azul más fuerte que la fila */
  color: #0056A6;
  transform: scale(1.1);
}

/* LOADING */
.loading-container {
  height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #0056A6;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>