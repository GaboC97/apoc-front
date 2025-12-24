<template>
  <div class="user-container">

    <header class="view-header">
      <div class="header-content">
        <h2>Mis Reintegros</h2>
        <p class="subtitle">Historial y estado de tus solicitudes de reintegro.</p>
      </div>
      <!-- Botón flotante para acción rápida -->
      <router-link to="/reintegros/nuevo" class="btn-action" v-if="reintegros.length">
        + Nuevo Reintegro
      </router-link>
    </header>

    <!-- ESTADO VACÍO (Empty State) -->
    <div v-if="!reintegros.length" class="empty-state fade-in">
      <div class="empty-icon">📂</div>
      <h3>Todavía no cargaste ningún reintegro</h3>
      <p>Comenzá tu solicitud de óptica, lentes o gimnasio ahora mismo.</p>
      <router-link to="/reintegros/nuevo" class="btn-primary">
        Solicitar mi primer reintegro
      </router-link>
    </div>

    <!-- TABLA DE DATOS -->
    <div v-else class="table-responsive fade-in">
      <table class="styled-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo de Trámite</th>
            <th>Estado</th>
            <th>Archivo</th>
            <th>Observaciones</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="r in reintegros" :key="r.id">
            <td>{{ formatFecha(r.created_at) }}</td>

            <td>
              <span class="tag tag-blue">{{ textoTipo(r.tipo_reintegro) }}</span>
            </td>

            <td>
              <span class="badge" :class="'badge-' + r.estado">
                {{ textoEstado(r.estado) }}
              </span>
            </td>

<td>
              <button 
                v-if="r.archivos && r.archivos.length > 0" 
                @click="abrirModalArchivos(r.archivos)" 
                class="btn-ver-archivos" 
                title="Ver todos los documentos">
                📄 Ver ({{ r.archivos.length }})
              </button>
              <span v-else class="text-muted">-</span>
            </td>

            <td class="obs-cell">
              <div v-if="r.estado === 'rechazado'" class="text-truncated"
                @mouseenter="mostrarTooltip($event, r.rechazo_motivo, r.razon_personalizada)"
                @mouseleave="ocultarTooltip">
                <span class="text-danger">
                  <strong>{{ r.rechazo_motivo }}:</strong> {{ r.razon_personalizada }}
                </span>
              </div>
              <span v-else class="text-muted">-</span>
            </td>

            <td>
              <button v-if="r.estado === 'rechazado'" @click="apelarReintegro(r)" class="btn-fix"
                title="Corregir y volver a enviar">
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
      reintegros: [],
      showArchivosModal: false,
      archivosSeleccionados: [],
      tooltip: {
        visible: false,
        top: 0,
        left: 0,
        titulo: '',
        texto: ''
      }
    };
  },

  components: {
    ArchivosModal
  },

  async mounted() {
    try {
      const resp = await api.get("/reintegros");
      this.reintegros = resp.data;
    } catch (e) {
      console.error("Error cargando reintegros", e);
    }

    const idParaCorregir = this.$route.query.ref_id;

    if (idParaCorregir) {
      this.isLoading = true;
      try {
        // 2. Pedimos los datos del trámite viejo al Backend
        const { data } = await api.get(`/reintegros/${idParaCorregir}`);

        // 3. RELLENAMOS EL FORMULARIO (Autocompletado)
        this.tipo_reintegro = data.tipo_reintegro;
        this.cbu_alias = data.cbu_alias;
        // ... rellenar resto de campos si tenés más ...

        // NOTA: El archivo NO se puede pre-cargar por seguridad del navegador.
        // El usuario DEBE seleccionar el archivo nuevo manualmente.

        this.$notify.info("Datos cargados. Adjuntá el archivo correcto y volvé a enviar.");

      } catch (error) {
        console.error(error);
        this.$notify.error("No se pudieron recuperar los datos del trámite.");
      } finally {
        this.isLoading = false;
      }
    }
  },
  methods: {
    archivoUrl(path) {
      // 1. Tomamos la URL base y le eliminamos '/api' del final
      const baseURL = import.meta.env.VITE_API_URL.replace(/\/api$/, '');

      // 2. Construimos la ruta ABSOLUTA correcta: http://localhost:8000/storage/...
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
      const map = {
        'armazon_cristales': 'Armazon / Cristales',
        'lentes_contacto': 'Lentes Contacto',
        'actividad_fisica': 'Gimanasio / Deporte'
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

    apelarReintegro(item) {
      this.$router.push({
        path: '/reintegros/nuevo',
        query: { ref_id: item.id, mode: 'fix' }
      });
    },

    mostrarTooltip(event, motivo, personalizada) {
      // Obtenemos la posición exacta del elemento donde pusimos el mouse
      const rect = event.currentTarget.getBoundingClientRect();

      this.tooltip = {
        visible: true,
        // Calculamos: posición del elemento + scroll de la ventana
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

/* Botón de Corregir / Apelar */
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


/* Nuevo estilo para el botón 'Ver (X)' en la tabla */
.btn-ver-archivos {
  background: #0056A6; /* Fondo azul principal */
  color: white; /* Texto blanco */
  border: none; /* Sin borde por defecto */
  border-radius: 8px; /* Bordes más redondeados */
  padding: 8px 12px; /* Espaciado interno generoso */
  font-size: 14px; /* Tamaño de fuente legible */
  font-weight: 600; /* Peso de la fuente */
  text-decoration: none; /* ¡QUITAR SUBRAYADO! */
  display: inline-flex; /* Permite icono y texto en línea */
  align-items: center; /* Alineación vertical */
  gap: 8px; /* Espacio entre icono y texto */
  cursor: pointer; /* Indica que es clickeable */
  transition: all 0.2s ease; /* Transición suave en hover */
  min-width: 100px; /* Ancho mínimo para que sea un botón claro */
  justify-content: center; /* Centra el contenido */
  box-shadow: 0 2px 6px rgba(0, 86, 166, 0.2); 
}

.btn-ver-archivos:hover {
  background: #004485;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 86, 166, 0.3);
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

/* 1. Forzamos el límite en la celda */
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

/* 1. Contenedor Relativo: Necesario para posicionar el tooltip hijo */
.tooltip-wrapper {
  position: relative;
  cursor: help;
  width: 100%;
}


/* 3. El Tooltip Flotante (Oculto por defecto) */
.fixed-tooltip {
  position: absolute;
  /* Se mueve libremente por la pantalla */
  transform: translateX(-50%);
  /* Para centrarlo respecto al mouse */

  background-color: #1e293b;
  color: #fff;
  padding: 12px;
  border-radius: 8px;
  width: 280px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 99999;
  /* Siempre encima de todo */
  pointer-events: none;
  /* El mouse lo atraviesa */

  /* Animación */
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

/* Flechita decorativa hacia abajo */
.tooltip-arrow {
  position: absolute;
  top: -6px;
  left: 50%;
  margin-left: -6px;
  border-width: 0 6px 6px 6px;
  border-style: solid;
  border-color: transparent transparent #1e293b transparent;
}

/* --- ACCIÓN DE HOVER (La Magia) --- */
.tooltip-wrapper:hover .custom-tooltip {
  visibility: visible;
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* HELPERS & BADGES */
.text-muted {
  color: #94a3b8;
}

.text-secondary {
  color: #64748b;
  font-weight: 500;
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

/* ANIMACIÓN SUAVE */
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
</style>