<template>
    <Transition name="modal-fade">
        <!-- BACKDROP: Oscuro y con desenfoque -->
        <div v-if="isOpen" class="modal-backdrop" v-on:click="close">
            <div class="modal-card" v-on:click.stop>

                <!-- HEADER: Limpio y espacioso -->
                <div class="modal-header">
                    <div class="header-content">
                        <div class="icon-box">
                            {{ getIcono(item.titulo) }}
                        </div>
                        <div class="header-text">
                            <span class="modal-overline">Detalle de Solicitud</span>
                            <h3 class="text-capitalize">{{ item.titulo }}</h3>
                            <div class="meta-row">
                                <span class="meta-tag">Trámite N°: {{ padId(item.id) }}</span>
                                <span class="meta-dot">•</span>
                                <span class="meta-date">{{ formatearFecha(item.fecha) }}</span>
                            </div>
                        </div>
                    </div>
                    <button class="btn-close" v-on:click="close" title="Cerrar">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <!-- BODY: Información organizada -->
                <div class="modal-body">

                    <!-- ESTADO PRINCIPAL -->
                    <div class="status-section">
                        <span class="status-label">Estado actual</span>
                        <span class="status-badge" :class="getStatusClass(item.estado)">
                            <span class="status-dot"></span>
                            {{ formatearTexto(item.estado) }}
                        </span>
                    </div>
                    <div v-if="item.estado === 'rechazado'" class="rejection-alert">
                        <div class="alert-header">
                            <span class="alert-icon">⛔</span>
                            <span class="alert-title">Motivo del rechazo</span>
                        </div>
                        <div class="alert-content">
                            <span class="reason-badge">{{ item.rechazo_motivo }}</span>
                            <p class="reason-text">
                                {{ item.razon_personalizada || 'Sin comentarios adicionales del administrador.' }}
                            </p>
                        </div>
                    </div>
                    <div class="divider"></div>

                    <!-- DATOS EN GRID -->
                    <div class="info-grid">
                        <div class="info-item">
                            <label>Solicitante</label>
                            <div class="user-info">
                                <div class="avatar-circle">{{ (user?.name || 'U').charAt(0) }}</div>
                                <p class="text-capitalize">{{ user?.name || 'Usuario' }}</p>
                            </div>
                        </div>
                        <div class="info-item">
                            <label>Tipo de Gestión</label>
                            <p class="text-capitalize highlight-text">{{ formatearTexto(item.tipo) }}</p>
                        </div>
                    </div>

                    <!-- SECCIÓN DE ARCHIVOS -->
                    <div class="files-section">
                        <label>ADJUNTOS <span v-if="listaArchivos.length">({{ listaArchivos.length }})</span></label>

                        <div v-if="listaArchivos.length > 0" class="files-container">

                            <div v-for="(archivo, index) in listaArchivos" :key="index" class="file-card">
                                <div class="file-icon">
                                    📄
                                </div>
                                <div class="file-details">
                                    <span class="filename" :title="archivo.nombre">
                                        {{ truncarNombre(archivo.nombre) }}
                                    </span>
                                    <span class="file-meta">Documento PDF/IMG</span>
                                </div>

                                <a :href="getUrlArchivo(archivo.path)" target="_blank" class="btn-action">
                                    <span>Ver / Descargar</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                </a>
                            </div>

                        </div>

                        <div v-else class="empty-state">
                            No hay documentación adjunta.
                        </div>
                    </div>
                </div>

                <!-- FOOTER -->
                <div class="modal-footer">
                    <button class="btn-secondary" v-on:click="close">Cerrar</button>
                </div>

            </div>
        </div>
    </Transition>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
import { computed } from 'vue';
const auth = useAuthStore();
const user = auth.user;

const props = defineProps({
    isOpen: Boolean,
    item: Object
});


const listaArchivos = computed(() => {
    if (props.item.archivos && Array.isArray(props.item.archivos) && props.item.archivos.length > 0) {
        return props.item.archivos.map(a => ({
            path: a.path,
            nombre: a.nombre_original || 'Documento Adjunto'
        }));
    }
    if (props.item.archivo_url) {
        return [{
            path: props.item.archivo_url,
            nombre: props.item.archivo_nombre || 'Documento Adjunto'
        }];
    }

    // 3. Si no hay nada
    return [];
});
const emit = defineEmits(['close']);
const close = () => emit('close');

// --- HELPERS ---

const getIcono = (titulo) => {
    if (!titulo) return '📄';
    const t = titulo.toLowerCase();
    if (t.includes('fisica') || t.includes('gimnasio')) return '🏋️';
    if (t.includes('lentes') || t.includes('armazon')) return '👓';
    if (t.includes('dental') || t.includes('odonto')) return '🦷';
    if (t.includes('hijo') || t.includes('nacimiento')) return '👶';
    if (t.includes('casamiento')) return '💍';
    return '📄';
};

const padId = (id) => id?.toString();

const formatearTexto = (texto) => {
    if (!texto) return '';
    const limpio = texto.replace(/_/g, ' ');
    return limpio.charAt(0).toUpperCase() + limpio.slice(1).toLowerCase();
};

const formatearFecha = (fechaISO) => {
    if (!fechaISO) return '-';
    return new Date(fechaISO).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const getStatusClass = (status) => {
    if (!status) return 'badge-warning';
    const s = status.toLowerCase();
    if (s.includes('aprobado')) return 'badge-success';
    if (s.includes('rechazado')) return 'badge-danger';
    return 'badge-warning';
}

const BASE_URL_STORAGE = 'http://127.0.0.1:8000/storage/';

const getUrlArchivo = (path) => {
    if (!path) return '#';
    if (path.startsWith('http')) return path;
    return `${BASE_URL_STORAGE}${path}`;
}

const truncarNombre = (nombre) => {
    if (!nombre) return 'Archivo';
    if (nombre.length > 30) return nombre.substring(0, 27) + '...';
    return nombre;
}
</script>

<style scoped>
/* BACKDROP */
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(15, 23, 42, 0.65);
    /* Azul muy oscuro semitransparente */
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    padding: 20px;
}

/* CARD PRINCIPAL */
.modal-card {
    background: white;
    width: 100%;
    max-width: 500px;
    border-radius: 20px;
    /* Bordes más redondeados */
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    overflow: hidden;
    animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
}

/* HEADER */
.modal-header {
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    background: white;
}

.header-content {
    display: flex;
    gap: 16px;
    align-items: center;
}

.icon-box {
    font-size: 28px;
    width: 56px;
    height: 56px;
    background: #f1f5f9;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.02);
}

.header-text {
    display: flex;
    flex-direction: column;
}

.modal-overline {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #94a3b8;
    font-weight: 700;
    margin-bottom: 2px;
}

.header-text h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
}

.meta-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
    font-size: 13px;
    color: #64748b;
}

.meta-tag {
    font-family: monospace;
    background: #f1f5f9;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 600;
    color: #475569;
}

.meta-dot {
    color: #cbd5e1;
}

.btn-close {
    background: transparent;
    border: none;
    color: #cbd5e1;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: all 0.2s;
    display: flex;
}

.btn-close:hover {
    background: #f1f5f9;
    color: #64748b;
}

/* BODY */
.modal-body {
    padding: 0 24px 30px;
}

/* ESTADO */
.status-section {
    background: #f8fafc;
    border-radius: 12px;
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border: 1px solid #e2e8f0;
}

.status-label {
    font-size: 13px;
    font-weight: 600;
    color: #475569;
}

.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 50px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
}

.badge-success {
    background: #dcfce7;
    color: #166534;
}

.badge-warning {
    background: #fffbeb;
    color: #b45309;
}

.badge-danger {
    background: #fee2e2;
    color: #991b1b;
}

.divider {
    height: 1px;
    background: #f1f5f9;
    margin: 20px 0;
}

/* GRID INFO */
.info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 25px;
}

.info-item label {
    display: block;
    font-size: 11px;
    color: #94a3b8;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 8px;
    letter-spacing: 0.5px;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 10px;
}

.avatar-circle {
    width: 28px;
    height: 28px;
    background: #3b82f6;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
}

.info-item p {
    margin: 0;
    font-size: 15px;
    font-weight: 500;
    color: #334155;
}

.highlight-text {
    color: #0f172a;
    font-weight: 600;
}

/* ALERTA DE RECHAZO */
/* ALERTA DE RECHAZO MEJORADA */
.rejection-alert {
    background-color: #FFF5F5;
    /* Un rojo un poco más limpio */
    border: 1px solid #FED7D7;
    border-left: 5px solid #E53E3E;
    /* Borde izquierdo un poco más grueso */
    border-radius: 8px;
    padding: 18px;
    /* Un poco más de aire interno */
    margin-bottom: 25px;
    animation: fadeIn 0.3s ease;
    display: flex;
    flex-direction: column;
    gap: 12px;
    /* Espacio entre título y contenido */
}

.alert-header {
    display: flex;
    align-items: center;
    gap: 10px;
}

.alert-icon {
    font-size: 16px;
    /* Icono un pelín más grande */
}

.alert-title {
    font-size: 12px;
    font-weight: 800;
    color: #C53030;
    /* Rojo más oscuro para el título */
    text-transform: uppercase;
    letter-spacing: 0.8px;
}

.alert-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding-left: 4px;
    /* Pequeña indentación visual */
}

/* Badge con fondo sólido (Más moderno) */
.reason-badge {
    background: #FEB2B2;
    /* Fondo rojo suave sólido */
    color: #742A2A;
    /* Texto rojo oscuro */
    font-size: 11px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 6px;
    display: inline-block;
}

/* Texto normal (sin itálica) y con mejor color */
.reason-text {
    margin: 0;
    font-size: 14px;
    color: #2D3748;
    /* Gris oscuro casi negro, mucho más legible */
    line-height: 1.5;
    font-weight: 500;
    /* Un poco más de peso que normal */
    font-style: normal;
    /* Quitamos la cursiva */
}

/* FILE CARD */
.files-section label {
    display: block;
    font-size: 11px;
    font-weight: 800;
    color: #94a3b8;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.file-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    background: white;
    transition: 0.2s;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
}

.file-card:hover {
    border-color: #cbd5e1;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.file-icon {
    font-size: 24px;
    padding: 8px;
    background: #f1f5f9;
    border-radius: 8px;
    margin-right: 12px;
}

.file-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin-right: 12px;
}

.filename {
    font-size: 14px;
    font-weight: 600;
    color: #334155;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.file-meta {
    font-size: 11px;
    color: #64748b;
}

.btn-action {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #f8fafc;
    color: #0f172a;
    text-decoration: none;
    font-size: 13px;
    font-weight: 600;
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    transition: all 0.2s;
}

.btn-action:hover {
    background: #0f172a;
    color: white;
    border-color: #0f172a;
}

.empty-state {
    text-align: center;
    color: #94a3b8;
    font-size: 13px;
    padding: 20px;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px dashed #cbd5e1;
}

.files-container {
    display: flex;
    flex-direction: column;
    gap: 10px; /* Espacio entre tarjetitas */
}
/* FOOTER */
.modal-footer {
    padding: 16px 24px;
    background: #f8fafc;
    border-top: 1px solid #f1f5f9;
    display: flex;
    justify-content: flex-end;
}

.btn-secondary {
    background: white;
    border: 1px solid #cbd5e1;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    color: #475569;
    cursor: pointer;
    transition: 0.2s;
    font-size: 14px;
}

.btn-secondary:hover {
    background: #fff;
    border-color: #94a3b8;
    color: #0f172a;
}

/* ANIMACIONES */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

@keyframes slideUp {
    from {
        transform: translateY(30px) scale(0.98);
        opacity: 0;
    }

    to {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
}
</style>