<template>
  <div class="admin-container">
    
    <header class="admin-header">
      <h2>Historial de Solicitudes</h2>
      <p class="subtitle">Registro completo de solicitudes aprobadas y rechazadas.</p>
    </header>

    <!-- PESTAÑAS (TABS) -->
    <div class="tabs">
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'reintegros' }"
        @click="activeTab = 'reintegros'"
      >
        Reintegros
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'subsidios' }"
        @click="activeTab = 'subsidios'"
      >
        Subsidios
      </button>
    </div>

    <!-- TABLA: REINTEGROS -->
    <div v-if="activeTab === 'reintegros'" class="table-responsive fade-in">
      <table v-if="reintegros.length">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Afiliado</th>
            <th>Organismo</th>
            <th>CBU / Alias</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Archivo</th>
            <th>Detalle / Motivo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in reintegros" :key="r.id">
            <td>{{ formatDate(r.created_at) }}</td>
            <td>
              <div class="user-info">
                <span class="fw-bold">{{ r.apellido_nombre }}</span>
                <small class="text-muted">DNI: {{ r.dni }}</small>
              </div>
            </td>
            <td>{{ r.organismo ? r.organismo.nombre : '-' }}</td>
            <td class="font-mono">{{ r.cbu_alias || '-' }}</td>
            <td><span class="tag tag-blue">{{ textoTipoReintegro(r.tipo_reintegro) }}</span></td>
            <td>
              <span class="badge" :class="estadoClass(r.estado)">
                {{ textoEstado(r.estado) }}
              </span>
            </td>
            <td>
              <a v-if="r.archivo_path" :href="archivoUrl(r.archivo_path)" target="_blank" class="btn-link">📎 Ver</a>
              <span v-else class="text-muted">-</span>
            </td>
            
            <!-- COLUMNA MOTIVO CORREGIDA -->
            <td class="motivo-cell">
               <span v-if="r.estado === 'rechazado'" class="text-danger">
                 {{ r.rechazo_motivo || r.razon_personalizada || 'Rechazado' }}
               </span>
               <span v-else-if="r.estado === 'aprobado'" class="text-success">
                 Solicitud Aprobada
               </span>
               <span v-else class="text-muted">
                 -
               </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">No hay historial de reintegros.</div>
    </div>

    <!-- TABLA: SUBSIDIOS -->
    <div v-if="activeTab === 'subsidios'" class="table-responsive fade-in">
      <table v-if="subsidios.length">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Afiliado</th>
            <th>Organismo</th>
            <th>CBU / Alias</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Archivo</th>
            <th>Detalle / Motivo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in subsidios" :key="s.id">
            <td>{{ formatDate(s.created_at) }}</td>
            <td>
              <div class="user-info">
                <span class="fw-bold">{{ s.apellido_nombre }}</span>
                <small class="text-muted">DNI: {{ s.dni }}</small>
              </div>
            </td>
            <td>{{ s.organismo ? s.organismo.nombre : '-' }}</td>
            <td class="font-mono">{{ s.cbu_alias || '-' }}</td>
            <td><span class="tag tag-purple">{{ textoTipoSubsidio(s.tipo_subsidio) }}</span></td>
            <td>
              <span class="badge" :class="estadoClass(s.estado)">
                {{ textoEstado(s.estado) }}
              </span>
            </td>
            <td>
              <a v-if="s.archivo_path" :href="archivoUrl(s.archivo_path)" target="_blank" class="btn-link">📎 Ver</a>
              <span v-else class="text-muted">-</span>
            </td>
            
            <!-- COLUMNA MOTIVO CORREGIDA -->
            <td class="motivo-cell">
               <span v-if="s.estado === 'rechazado'" class="text-danger">
                 {{ s.rechazo_motivo || s.razon_personalizada || 'Rechazado' }}
               </span>
               <span v-else-if="s.estado === 'aprobado'" class="text-success">
                 Solicitud Aprobada
               </span>
               <span v-else class="text-muted">
                 -
               </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">No hay historial de subsidios.</div>
    </div>

  </div>
</template>

<script>
import api from "../api/axios";

export default {
  data() {
    return {
      activeTab: 'reintegros',
      reintegros: [],
      subsidios: [],
      loading: false
    };
  },
  async mounted() {
    await this.cargarHistorial();
  },
  methods: {
    async cargarHistorial() {
      this.loading = true;
      try {
        const [resR, resS] = await Promise.all([
          api.get("/admin/reintegros/historial"),
          api.get("/admin/subsidios/historial")
        ]);
        this.reintegros = resR.data;
        this.subsidios = resS.data;
      } catch (e) {
        console.error("Error cargando historial", e);
      } finally {
        this.loading = false;
      }
    },
    archivoUrl(path) {
      return `${import.meta.env.VITE_API_URL}/storage/${path}`;
    },
    formatDate(dateString) {
      if (!dateString) return '-';
      return new Date(dateString).toLocaleDateString('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      });
    },
    estadoClass(estado) {
      if (estado === 'aprobado') return 'bg-success';
      if (estado === 'rechazado') return 'bg-danger';
      return 'bg-warning';
    },
    textoTipoReintegro(t) {
      const map = {
        'armazon_cristales': 'Armazon / Cristales',
        'lentes_contacto': 'Lentes Contacto',
        'actividad_fisica': 'Gimasio / Deporte'
      };
      return map[t] || t;
    },
    textoTipoSubsidio(t) {
      const map = {
        'nacimiento_adopcion': 'Nacimiento / Adopción',
        'hijo_menor_4': 'Hijo menor',
        'casamiento': 'Casamiento',
        'discapacidad': 'Discapacidad',
        'derivacion_medica': 'Derivación'
      };
      return map[t] || t;
    },
    textoEstado(e) {
      const map = {
        'en_revision': 'En Revisión',
        'aprobado': 'Aprobado',
        'rechazado': 'Rechazado'
      };
      // Si no está en el mapa, simplemente reemplazamos guiones bajos por espacios
      return map[e] || e.replace(/_/g, ' ');
    }
  }
};
</script>

<style scoped>
.admin-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
    font-family: 'Inter', sans-serif;
}

.admin-header { margin-bottom: 30px; }
.admin-header h2 { color: #0f172a; font-size: 28px; font-weight: 800; }
.subtitle { color: #64748b; margin-top: 5px; }

/* TABS - ESTILO MEJORADO */
.tabs {
    display: flex;
    gap: 12px; /* Un poco menos de espacio para que se sientan conectadas */
    margin-bottom: 25px;
    
    /* Quitamos el borde de abajo para que parezcan botones flotantes */
    /* border-bottom: 2px solid #e2e8f0; */ 
    
    padding: 4px; /* Un pequeño padding contenedor */
    background: #f1f5f9; /* Fondo gris suave para el contenedor de tabs */
    border-radius: 12px; /* Bordes redondeados del contenedor */
    width: fit-content; /* Que ocupe solo lo necesario */
}

.tab-btn {
    background: transparent;
    border: none;
    padding: 10px 24px; /* Más ancho para mejor click */
    font-size: 15px;
    font-weight: 600;
    color: #64748b; /* Gris medio para los inactivos */
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s ease-in-out;
    display: flex;
    align-items: center;
    gap: 10px;
}

.tab-btn:hover {
    color: #334155;
    background: rgba(255, 255, 255, 0.5); /* Efecto hover sutil */
}

/* ESTADO ACTIVO (El cambio fuerte) */
.tab-btn.active {
    background: #0056A6; /* Azul corporativo solido */
    color: white;        /* Texto blanco */
    box-shadow: 0 4px 6px -1px rgba(0, 86, 166, 0.3); /* Sombrita elegante */
}

/* BADGE (Contador) */
.badge {
    background: #ef4444; /* Rojo para alertas */
    color: white;
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 12px;
    font-weight: 700;
    
    /* Si el botón está activo, cambiamos el badge para que contraste mejor sobre azul */
    transition: all 0.2s;
}

.tab-btn.active .badge {
    background: white;   /* Fondo blanco */
    color: #0056A6;      /* Texto azul */
}

/* TABLA */
.table-responsive {
    overflow-x: auto;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
}
table { width: 100%; border-collapse: collapse; min-width: 900px; }
thead tr { background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
th {
    text-align: left; padding: 16px; font-size: 13px;
    color: #475569; text-transform: uppercase; font-weight: 700;
}
td {
    padding: 16px; border-bottom: 1px solid #f1f5f9;
    color: #334155; vertical-align: middle;
}
.user-info { display: flex; flex-direction: column; }
.fw-bold { font-weight: 600; }
.text-muted { color: #94a3b8; font-size: 0.85em; }
.font-mono { font-family: monospace; font-size: 1.1em; color: #475569; }

/* HELPERS */
.tag { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.tag-blue { background: #dbeafe; color: #1e40af; }
.tag-purple { background: #f3e8ff; color: #6b21a8; }

.badge {
    padding: 4px 10px; border-radius: 6px; font-size: 12px;
    font-weight: 700; text-transform: capitalize; color: white;
}
.bg-success { background: #22c55e; }
.bg-danger { background: #ef4444; }
.bg-warning { background: #f59e0b; }

.text-danger { color: #ef4444; font-size: 13px; font-weight: 500; }
.text-success { color: #22c55e; font-weight: 600; font-size: 13px; }

.btn-link { color: #0056A6; text-decoration: none; font-weight: 500; font-size: 13px; }
.btn-link:hover { text-decoration: underline; }

.empty-state { padding: 40px; text-align: center; color: #64748b; font-style: italic; }
</style>