<template>
    <div class="admin-container">
        
        <header class="admin-header">
            <h2>Solicitudes Pendientes</h2>
            <p class="subtitle">Gestioná las solicitudes de los afiliados desde un solo lugar.</p>
        </header>

        <!-- PESTAÑAS (TABS) -->
        <div class="tabs">
            <button 
                class="tab-btn" 
                :class="{ active: activeTab === 'reintegros' }"
                @click="cambiarTab('reintegros')"
            >
                Reintegros 
                <span v-if="reintegros.length" class="badge">{{ reintegros.length }}</span>
            </button>
            <button 
                class="tab-btn" 
                :class="{ active: activeTab === 'subsidios' }"
                @click="cambiarTab('subsidios')"
            >
                Subsidios
                <span v-if="subsidios.length" class="badge">{{ subsidios.length }}</span>
            </button>
        </div>

        <!-- ALERTA DE ESTADO -->
        <div v-if="msg.text" class="alert" :class="msg.type">
            {{ msg.text }}
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
                        <th>Solicitud</th>
                        <th>Archivo adjunto</th>
                        <th class="text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in reintegros" :key="item.id">
                        <td>{{ formatDate(item.created_at) }}</td>
                        <td>
                            <div class="user-info">
                                <span class="fw-bold">{{ item.apellido_nombre }}</span>
                                <small class="text-muted">DNI: {{ item.dni }}</small>
                            </div>
                        </td>
                        <td>{{ item.organismo ? item.organismo.nombre : '-' }}</td>
                        <td class="font-mono">{{ item.cbu_alias || '-' }}</td>
                        <td>
                            <span class="tag tag-blue">{{ textoTipoReintegro(item.tipo_reintegro) }}</span>
                        </td>
                        <td>
                            <a v-if="item.archivo_path" :href="archivoUrl(item.archivo_path)" target="_blank" class="btn-link">
                                📎 Ver
                            </a>
                            <span v-else class="text-muted">-</span>
                        </td>
                        <td class="actions-cell">
                            <button class="btn-icon check" title="Aprobar" @click="aprobar(item.id, 'reintegros')">
                                ✓
                            </button>
                            <button class="btn-icon cross" title="Rechazar" @click="abrirModal(item, 'reintegro')">
                                ✕
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-else class="empty-state">
                No hay reintegros pendientes de revisión.
            </div>
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
                        <th>Motivo</th>
                        <th>Docs</th>
                        <th>Archivo adjunto</th>
                        <th class="text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in subsidios" :key="item.id">
                        <td>{{ formatDate(item.created_at) }}</td>
                        <td>
                            <div class="user-info">
                                <span class="fw-bold">{{ item.apellido_nombre }}</span>
                                <small class="text-muted">DNI: {{ item.dni }}</small>
                            </div>
                        </td>
                        <td>{{ item.organismo ? item.organismo.nombre : '-' }}</td>
                        <td class="font-mono">{{ item.cbu_alias }}</td>
                        <td>
                            <span class="tag tag-purple">{{ textoTipoSubsidio(item.tipo_subsidio) }}</span>
                        </td>
                        <td>
                            <!-- Mostramos cuántos docs adjuntó o un tooltip -->
                            <div class="docs-list" :title="formatDocs(item.docs_adjuntos)">
                                📋 {{ item.docs_adjuntos ? item.docs_adjuntos.length : 0 }} docs
                            </div>
                        </td>
                        <td>
                            <a v-if="item.archivo_path" :href="archivoUrl(item.archivo_path)" target="_blank" class="btn-link">
                                📎 Ver
                            </a>
                            <span v-else class="text-muted">-</span>
                        </td>
                        <td class="actions-cell">
                            <button class="btn-icon check" title="Aprobar" @click="aprobar(item.id, 'subsidios')">
                                ✓
                            </button>
                            <button class="btn-icon cross" title="Rechazar" @click="abrirModal(item, 'subsidio')">
                                ✕
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-else class="empty-state">
                No hay subsidios pendientes de revisión.
            </div>
        </div>

        <!-- MODAL DE RECHAZO (Compartido) -->
        <div v-if="modal.abierto" class="modal-overlay" @click.self="cerrarModal">
            <div class="modal-card">
                <header class="modal-header">
                    <h3>Rechazar Solicitud</h3>
                    <button class="close-btn" @click="cerrarModal">×</button>
                </header>
                
                <div class="modal-body">
                    <p>Estás por rechazar la solicitud de <strong>{{ modal.item.apellido_nombre }}</strong>.</p>
                    
                    <div class="form-group">
                        <label>Razón predefinida</label>
                        <select v-model="modal.razon_generica_id">
                            <option value="">-- Seleccioná un motivo --</option>
                            <option v-for="r in razonesActivas" :key="r.id" :value="r.id">
                                {{ r.titulo }}
                            </option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Mensaje personalizado (Opcional)</label>
                        <textarea v-model="modal.razon_personalizada" rows="3" placeholder="Escribí un detalle extra si hace falta..."></textarea>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn-ghost" @click="cerrarModal">Cancelar</button>
                    <button class="btn-danger" @click="confirmarRechazo" :disabled="loading">
                        {{ loading ? 'Procesando...' : 'Confirmar Rechazo' }}
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import api from "../api/axios";

export default {
    data() {
        return {
            activeTab: 'reintegros', // reintegros | subsidios
            reintegros: [],
            subsidios: [],
            
            // Razones cargadas desde DB
            razonesReintegro: [],
            razonesSubsidio: [],
            
            msg: { text: '', type: '' },
            loading: false,

            // Estado del Modal
            modal: {
                abierto: false,
                tipo: '', // 'reintegro' o 'subsidio' (singular para lógica interna)
                item: null,
                razon_generica_id: "",
                razon_personalizada: ""
            }
        };
    },
    computed: {
        razonesActivas() {
            return this.modal.tipo === 'reintegro' ? this.razonesReintegro : this.razonesSubsidio;
        }
    },
    async mounted() {
        await this.cargarTodo();
    },
    methods: {
        async cargarTodo() {
            this.loading = true;
            try {
                // Usamos Promise.all para cargar todo en paralelo y que sea rápido
                const [resReintegros, resSubsidios, resRazonesR, resRazonesS] = await Promise.all([
                    api.get('/admin/reintegros'),
                    api.get('/admin/subsidios'),
                    api.get('/razones/reintegro'),
                    api.get('/razones/subsidio')
                ]);

                this.reintegros = resReintegros.data;
                this.subsidios = resSubsidios.data;
                this.razonesReintegro = resRazonesR.data;
                this.razonesSubsidio = resRazonesS.data;
            } catch (e) {
                this.mostrarMensaje('Error al cargar datos. Verificá tu conexión.', 'error');
            } finally {
                this.loading = false;
            }
        },

        cambiarTab(tab) {
            this.activeTab = tab;
            this.msg.text = ''; // Limpiar mensajes al cambiar
        },

        // --- ACCIONES APROBAR ---
        async aprobar(id, tipoPlural) {
            if(!confirm("¿Estás seguro de aprobar esta solicitud?")) return;

            this.loading = true;
            try {
                // tipoPlural es 'reintegros' o 'subsidios' tal cual la URL
                await api.post(`/admin/${tipoPlural}/${id}/aprobar`);
                
                // Actualizamos la lista localmente
                if (tipoPlural === 'reintegros') {
                    this.reintegros = this.reintegros.filter(i => i.id !== id);
                } else {
                    this.subsidios = this.subsidios.filter(i => i.id !== id);
                }
                
                this.mostrarMensaje('Solicitud aprobada correctamente.', 'success');
            } catch (e) {
                this.mostrarMensaje('Error al intentar aprobar.', 'error');
            } finally {
                this.loading = false;
            }
        },

        // --- ACCIONES RECHAZAR (MODAL) ---
        abrirModal(item, tipoSingular) {
            this.modal.item = item;
            this.modal.tipo = tipoSingular; // 'reintegro' o 'subsidio'
            this.modal.razon_generica_id = "";
            this.modal.razon_personalizada = "";
            this.modal.abierto = true;
        },
        cerrarModal() {
            this.modal.abierto = false;
            this.modal.item = null;
        },
        async confirmarRechazo() {
            if (!this.modal.razon_generica_id && !this.modal.razon_personalizada) {
                alert("Debés indicar un motivo.");
                return;
            }

            this.loading = true;
            const id = this.modal.item.id;
            // Endpoint plural: 'reintegros' o 'subsidios'
            const endpointType = this.modal.tipo + 's'; 

            try {
                await api.post(`/admin/${endpointType}/${id}/rechazar`, {
                    razon_generica_id: this.modal.razon_generica_id,
                    razon_personalizada: this.modal.razon_personalizada
                });

                // Sacar de la lista
                if (endpointType === 'reintegros') {
                    this.reintegros = this.reintegros.filter(i => i.id !== id);
                } else {
                    this.subsidios = this.subsidios.filter(i => i.id !== id);
                }

                this.mostrarMensaje('Solicitud rechazada.', 'success'); // Usamos success para confirmar acción completada
                this.cerrarModal();
            } catch (e) {
                alert("Error al rechazar la solicitud.");
            } finally {
                this.loading = false;
            }
        },

        // --- HELPERS VISUALES ---
        mostrarMensaje(texto, tipo) {
            this.msg = { text: texto, type: tipo };
            setTimeout(() => this.msg.text = '', 4000);
        },
        archivoUrl(path) {
            return `${import.meta.env.VITE_API_URL}/storage/${path}`;
        },
        formatDate(dateString) {
            if(!dateString) return '-';
            return new Date(dateString).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' });
        },
        formatDocs(docs) {
            // docs es un array de strings (claves)
            if(!docs) return '';
            return docs.map(d => d.replace(/_/g, ' ')).join(', ');
        },
        textoTipoReintegro(t) {
            const map = {
                'armazon_cristales': 'Armazon / Cristales',
                'lentes_contacto': 'Lentes Contacto',
                'actividad_fisica': 'Gimnasio / Deporte'
            };
            return map[t] || t;
        },
        textoTipoSubsidio(t) {
            const map = {
                'nacimiento_adopcion': 'Nacimiento / Adopción',
                'hijo_menor_4': 'Hijo menor', // A veces se usa para guarderia o hijos pequeños
                'casamiento': 'Casamiento',
                'discapacidad': 'Discapacidad',
                'derivacion_medica': 'Derivación'
            };
            return map[t] || t;
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

.admin-header {
    margin-bottom: 30px;
}
.admin-header h2 {
    color: #0f172a;
    font-size: 28px;
    font-weight: 800;
}
.subtitle {
    color: #64748b;
    margin-top: 5px;
}

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
table {
    width: 100%;
    border-collapse: collapse;
    min-width: 800px;
}
thead tr {
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
}
th {
    text-align: left;
    padding: 16px;
    font-size: 13px;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 700;
}
td {
    padding: 16px;
    border-bottom: 1px solid #f1f5f9;
    color: #334155;
    vertical-align: middle;
}
tbody tr:last-child td {
    border-bottom: none;
}
.user-info {
    display: flex;
    flex-direction: column;
}
.fw-bold { font-weight: 600; }
.text-muted { color: #94a3b8; font-size: 0.85em; }
.font-mono { font-family: monospace; font-size: 1.1em; color: #475569; }

/* TAGS */
.tag {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
}
.tag-blue { background: #dbeafe; color: #1e40af; }
.tag-purple { background: #f3e8ff; color: #6b21a8; }

/* ACCIONES */
.actions-cell {
    text-align: right;
    white-space: nowrap;
}
.btn-icon {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 16px;
    margin-left: 8px;
    transition: transform 0.1s;
}
.btn-icon:hover { transform: scale(1.1); }
.btn-icon.check { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
.btn-icon.cross { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

.btn-link {
    color: #0056A6;
    text-decoration: none;
    font-weight: 500;
    font-size: 13px;
}
.btn-link:hover { text-decoration: underline; }

/* ALERTAS */
.alert {
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-weight: 500;
}
.alert.success { background: #dcfce7; color: #166534; }
.alert.error { background: #fee2e2; color: #991b1b; }

.empty-state {
    padding: 40px;
    text-align: center;
    color: #64748b;
    font-style: italic;
}

/* MODAL */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
    backdrop-filter: blur(2px);
}
.modal-card {
    background: white;
    width: 100%;
    max-width: 450px;
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    animation: slideUp 0.2s ease-out;
}
@keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}
.modal-header {
    padding: 15px 20px;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f8fafc;
}
.modal-header h3 { margin: 0; font-size: 18px; color: #0f172a; }
.close-btn { background: none; border: none; font-size: 24px; color: #94a3b8; cursor: pointer; }

.modal-body { padding: 20px; }
.modal-body p { margin-bottom: 15px; color: #334155; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: #475569; }
.form-group select, .form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font-size: 14px;
}

.modal-footer {
    padding: 15px 20px;
    background: #f8fafc;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
.btn-ghost { background: none; border: none; color: #64748b; font-weight: 600; cursor: pointer; }
.btn-danger { background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
.btn-danger:hover { background: #dc2626; }
</style>