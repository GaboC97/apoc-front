<template>
  <div class="user-container">

    <header class="view-header">
      <div class="header-content">
        <h2>Mis Subsidios</h2>
        <p class="subtitle">Historial y estado de tus solicitudes de subsidios.</p>
      </div>
      <router-link to="/subsidios/nuevo" class="btn-action" v-if="subsidios.length">
        + Nuevo Subsidio
      </router-link>
    </header>

    <div v-if="!subsidios.length" class="empty-state fade-in">
      <div class="empty-icon">👶</div>
      <h3>Todavía no cargaste ningún subsidio</h3>
      <p>Solicitá beneficios por nacimiento, casamiento, discapacidad o derivación.</p>
      <router-link to="/subsidios/nuevo" class="btn-primary">
        Solicitar mi primer subsidio
      </router-link>
    </div>

    <div v-else class="table-responsive fade-in">
      <table class="styled-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo de Subsidio</th>
            <th>Estado</th>
            <th>Archivo</th>
            <th>Observaciones</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="s in subsidios" :key="s.id">

            <td>{{ formatFecha(s.created_at) }}</td>

            <td>
              <span class="tag tag-blue">{{ textoTipo(s.tipo_subsidio) }}</span>
            </td>

            <td>
              <span class="badge" :class="'badge-' + s.estado">
                {{ textoEstado(s.estado) }}
              </span>
            </td>

<td>
      <button 
        v-if="s.archivos && s.archivos.length > 0" 
        @click="abrirModalArchivos(s.archivos)" 
        class="btn-ver-archivos" 
        title="Ver todos los documentos">
        📄 Ver ({{ s.archivos.length }})
      </button>
      <span v-else class="text-muted">-</span>
    </td>

            <td class="obs-cell">
              <div v-if="s.estado === 'rechazado'" class="text-truncated"
                @mouseenter="mostrarTooltip($event, s.rechazo_motivo, s.razon_personalizada)"
                @mouseleave="ocultarTooltip">
                <span class="text-danger">
                  <strong>{{ s.rechazo_motivo }}:</strong> {{ s.razon_personalizada }}
                </span>
              </div>
              <span v-else class="text-muted">-</span>
            </td>

            <td>
              <button v-if="s.estado === 'rechazado'" @click="apelarSubsidio(s)" class="btn-fix"
                title="Corregir solicitud">
                ↻ Corregir
              </button>
              <span v-else class="text-muted">-</span>
            </td>

          </tr>
        </tbody>
      </table>
    </div>

    <div class="fixed-tooltip" v-show="tooltip.visible" :style="{ top: tooltip.top + 'px', left: tooltip.left + 'px' }">
      <div class="tooltip-header">{{ tooltip.titulo }}</div>
      <div class="tooltip-body">{{ tooltip.texto }}</div>
      <div class="tooltip-arrow"></div>
    </div>
    <ArchivosModal :is-open="showArchivosModal" :archivos="archivosSeleccionados" @close="showArchivosModal = false" />
  </div>
</template>

<script>
import api from "../api/axios";
import ArchivosModal from "../components/ArchivosModal.vue";

export default {
  data() {
    return {
      subsidios: [],
      showArchivosModal: false,
      archivosSeleccionados: [],
      // Datos para el Tooltip Flotante
      tooltip: {
        visible: false,
        top: 0,
        left: 0,
        titulo: '',
        texto: ''
      }
    };
  },
  async mounted() {
    try {
      const resp = await api.get("/subsidios");
      this.subsidios = resp.data;
    } catch (e) {
      console.error("Error cargando subsidios", e);
    }
  },

  components: {
    ArchivosModal,
  },

  methods: {
    archivoUrl(path) {
      const baseURL = import.meta.env.VITE_API_URL.replace(/\/api$/, '');
      return `${baseURL}/storage/${path}`;
    },

    textoEstado(estado) {
      const map = {
        'en_revision': 'En revisión',
        'aprobado': 'Aprobado',
        'rechazado': 'Rechazado'
      };
      return map[estado] || estado.replace(/_/g, ' ');
    },

    textoTipo(tipo) {
      // Mapeo basado en tu formulario de SolicitudSubsidio.vue
      const map = {
        'nacimiento_adopcion': 'Nacimiento / Adopción',
        'hijo_menor_4': 'Hijo menor de 4 años',
        'casamiento': 'Casamiento',
        'discapacidad': 'Discapacidad',
        'derivacion_medica': 'Derivación Médica'
      };
      return map[tipo] || tipo;
    },

    formatFecha(f) {
      if (!f) return '-';
      return new Date(f).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    },

    apelarSubsidio(item) {
      this.$router.push({
        path: '/subsidios/nuevo',
        query: { ref_id: item.id }
      });
    },

    // --- LÓGICA DEL TOOLTIP FLOTANTE ---
    mostrarTooltip(event, motivo, personalizada) {
      const rect = event.currentTarget.getBoundingClientRect();

      this.tooltip = {
        visible: true,
        top: rect.bottom + window.scrollY + 10,
        left: rect.left + (rect.width / 2),
        titulo: motivo,
        texto: personalizada
      };
    },
    ocultarTooltip() {
      this.tooltip.visible = false;
    },

    abrirModalArchivos(archivos) {
      this.archivosSeleccionados = archivos;
      this.showArchivosModal = true;
    },
  },
};
</script>

<style scoped>
/* CONTENEDOR PRINCIPAL */
.user-container {
  max-width: 1100px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: 'Inter', sans-serif;
}

/* HEADER */
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 30px;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 20px;
}

.view-header h2 {
  color: #0f172a;
  font-size: 28px;
  font-weight: 800;
  margin: 0;
}

.subtitle {
  color: #64748b;
  margin: 5px 0 0 0;
  font-size: 16px;
}

/* BOTONES */
.btn-action {
  background: white;
  color: #0056A6;
  border: 2px solid #0056A6;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-action:hover {
  background: #f0f9ff;
  transform: translateY(-2px);
}

.btn-primary {
  background: #0056A6;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  margin-top: 15px;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #004485;
}

/* EMPTY STATE */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  border: 2px dashed #cbd5e1;
  color: #64748b;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
  opacity: 0.8;
}

.empty-state h3 {
  color: #0f172a;
  margin-bottom: 8px;
}

/* TABLA */
.table-responsive {
  overflow-x: auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.styled-table th {
  background: #0056A6;
  color: #ffffff;
  padding: 16px;
  text-align: left;
  font-weight: 700;
  font-size: 13px;
  text-transform: uppercase;
  border-bottom: 1px solid #e2e8f0;
}

.styled-table td {
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  vertical-align: middle;
}

.styled-table tr:hover {
  background: #fcfcfc;
}

/* CELDAS DE OBSERVACIONES (Truncado) */
.obs-cell {
  width: 250px;
  max-width: 250px;
}

.text-truncated {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: help;
}

.btn-fix {
  background-color: white;
  color: #0056A6;
  border: 1px solid #0056A6;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s;
}

.btn-fix:hover {
  background-color: #0056A6;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 86, 166, 0.2);
}

.btn-fix:active {
  transform: translateY(0);
}

/* TOOLTIP FLOTANTE ("FANTASMA") */
.fixed-tooltip {
  position: absolute;
  transform: translateX(-50%);

  background-color: #1e293b;
  color: #fff;
  padding: 12px;
  border-radius: 8px;
  width: 280px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 99999;
  pointer-events: none;

  transition: opacity 0.2s ease;
}

.tooltip-header {
  font-weight: 700;
  font-size: 13px;
  color: #fca5a5;
  margin-bottom: 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 4px;
}

.tooltip-body {
  font-size: 13px;
  line-height: 1.4;
}

.tooltip-arrow {
  position: absolute;
  top: -6px;
  left: 50%;
  margin-left: -6px;
  border-width: 0 6px 6px 6px;
  border-style: solid;
  border-color: transparent transparent #1e293b transparent;
}

/* HELPERS & BADGES */
.text-muted {
  color: #94a3b8;
}

.text-danger {
  color: #ef4444;
  font-weight: 500;
  font-size: 14px;
}

.tag {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  display: inline-block;
}

.tag-blue {
  background: #dbeafe;
  color: #1e40af;
}

.badge {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  color: white;
  display: inline-block;
}

.badge-en_revision {
  background: #f59e0b;
}

.badge-aprobado {
  background: #22c55e;
}

.badge-rechazado {
  background: #ef4444;
}

.link-file {
  color: #0056A6;
  font-weight: 600;
  text-decoration: none;
  font-size: 14px;
}

.link-file:hover {
  text-decoration: underline;
}

/* ANIMACIÓN */
.fade-in {
  animation: fadeIn 0.4s ease-out;
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


.btn-ver-archivos {
  background: #0056A6;
  /* Fondo azul principal */
  color: white;
  /* Texto blanco */
  border: none;
  border-radius: 8px;
  /* Bordes redondeados */
  padding: 8px 12px;
  font-size: 13px;
  /* Usar 13px o 14px */
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 86, 166, 0.2);
}

.btn-ver-archivos:hover {
  background: #004485;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 86, 166, 0.3);
}
</style>