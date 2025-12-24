<template>
    <div class="nuevo-container">
        <div class="form-card fade-in">

            <header class="card-header">
                <h2>Solicitud de Subsidios</h2>
                <div class="info-box">
                    <p>ℹ️ <strong>Requisito Excluyente:</strong> Beneficio válido solo para afiliados con 6 meses de
                        carencia.</p>
                </div>
            </header>

            <form @submit.prevent="enviar">
                <div class="main-layout">

                    <div class="col-datos">

                        <div class="section-title" v-if="esAdmin">Administración</div>

                        <div class="form-group full-width" v-if="esAdmin">
                            <label>Seleccionar Afiliado *</label>

                            <div v-if="cargandoUsuarios" class="loading-text">
                                <span class="mini-spinner"></span> Cargando afiliados...
                            </div>

                            <Multiselect v-else v-model="usuarioSeleccionado" :options="usuarios" :searchable="true"
                                placeholder="Buscar por nombre o DNI..." label="name" track-by="id"
                                :custom-label="formatoUsuario" select-label="Enter para seleccionar"
                                deselect-label="Clic para quitar">
                                <template #noResult><span class="mensaje-azul">⚠️ No encontrado.</span></template>
                                <template #noOptions><span class="mensaje-azul">Lista vacía.</span></template>
                            </Multiselect>

                            <button v-if="errorUsuarios" type="button" @click="cargarUsuarios" class="btn-retry">
                                🔄 Reintentar
                            </button>
                        </div>

                        <div v-if="!esAdmin">
                            <div class="section-title">Datos del Solicitante</div>
                            <div class="inputs-grid">
                                <div class="form-group full-width">
                                    <label>Correo electrónico *</label>
                                    <input type="email" v-model="correo_electronico" required :disabled="isLoading" />
                                </div>
                                <div class="form-group">
                                    <label>Apellido y nombre *</label>
                                    <input type="text" v-model="apellido_nombre" required :disabled="isLoading" />
                                </div>
                                <div class="form-group">
                                    <label>DNI *</label>
                                    <input type="text" v-model="dni" required :disabled="isLoading" />
                                </div>
                                <div class="form-group">
                                    <label>Celular *</label>
                                    <input type="text" v-model="telefono" required :disabled="isLoading" />
                                </div>
                                <div class="form-group full-width">
                                    <label>Organismo *</label>
                                    <div class="select-wrapper">
                                        <select v-model="organismo_id" required :disabled="isLoading">
                                            <option value="" disabled>Seleccioná...</option>
                                            <option v-for="o in organismos" :key="o.id" :value="o.id">{{ o.nombre }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="section-title-pago">Datos de Pago</div>
                        <div class="form-group full-width">
                            <label>CBU / Alias</label>
                            <input type="text" v-model="cbu_alias"
                                placeholder="Si lo dejás vacío, usamos el último guardado" :disabled="isLoading" />

                            <div class="warning-box" v-if="esAdmin">
                                <small v-if="cbu_alias">✏️ Se actualizará el CBU del usuario.</small>
                                <small v-else>⚠️ Usaremos el CBU actual del usuario.</small>
                            </div>
                        </div>

                        <div v-if="tipo_subsidio === 'derivacion_medica'" class="info-derivacion fade-in">
                            <h4>🚑 Información sobre Derivación</h4>
                            <p>Para este trámite es obligatorio adjuntar:</p>
                            <ul>
                                <li>Derivación autorizada por SEROS.</li>
                                <li>Confirmación de turno.</li>
                                <li>Estudios médicos adicionales (si los tuviera).</li>
                            </ul>
                        </div>

                    </div>

                    <div class="col-acciones">
                        <div class="sticky-wrapper">
                            <div class="section-title">Detalles del Trámite</div>

                            <div class="form-group">
                                <label class="mb-label">Motivo de solicitud *</label>
                                <div class="radio-cards-compact">

                                    <label class="radio-card"
                                        :class="{ active: tipo_subsidio === 'nacimiento_adopcion' }">
                                        <input type="radio" value="nacimiento_adopcion" v-model="tipo_subsidio"
                                            :disabled="isLoading" />
                                        <span>👶 Nacimiento / Adopción</span>
                                    </label>

                                    <label class="radio-card" :class="{ active: tipo_subsidio === 'hijo_menor_4' }">
                                        <input type="radio" value="hijo_menor_4" v-model="tipo_subsidio"
                                            :disabled="isLoading" />
                                        <span>🧸 Hijo menor de 4 años</span>
                                    </label>

                                    <label class="radio-card" :class="{ active: tipo_subsidio === 'casamiento' }">
                                        <input type="radio" value="casamiento" v-model="tipo_subsidio"
                                            :disabled="isLoading" />
                                        <span>💍 Casamiento</span>
                                    </label>

                                    <label class="radio-card" :class="{ active: tipo_subsidio === 'discapacidad' }">
                                        <input type="radio" value="discapacidad" v-model="tipo_subsidio"
                                            :disabled="isLoading" />
                                        <span>♿ Discapacidad</span>
                                    </label>

                                    <label class="radio-card"
                                        :class="{ active: tipo_subsidio === 'derivacion_medica' }">
                                        <input type="radio" value="derivacion_medica" v-model="tipo_subsidio"
                                            :disabled="isLoading" />
                                        <span>🚑 Derivación Médica</span>
                                    </label>

                                </div>
                            </div>

                            <div class="form-group mt-4">
                                <label class="mb-label-title">Documentación a presentar *</label>
                                <div class="checklist-grid">
                                    <label class="check-item" :class="{ disabled: !esCompatible('nacimiento') }">
                                        <input type="checkbox" value="partida_nacimiento" v-model="docs_adjuntos"
                                            :disabled="!esCompatible('nacimiento') || isLoading">
                                        Partida nacimiento
                                    </label>
                                    <label class="check-item" :class="{ disabled: !esCompatible('nacimiento') }">
                                        <input type="checkbox" value="certificado_adopcion" v-model="docs_adjuntos"
                                            :disabled="!esCompatible('nacimiento') || isLoading">
                                        Cert. adopción
                                    </label>
                                    <label class="check-item" :class="{ disabled: !esCompatible('casamiento') }">
                                        <input type="checkbox" value="certificado_casamiento" v-model="docs_adjuntos"
                                            :disabled="!esCompatible('casamiento') || isLoading">
                                        Cert. Casamiento
                                    </label>
                                    <label class="check-item" :class="{ disabled: !esCompatible('hijo') }">
                                        <input type="checkbox" value="dni_hijos" v-model="docs_adjuntos"
                                            :disabled="!esCompatible('hijo') || isLoading">
                                        DNI Hijos
                                    </label>
                                    <label class="check-item" :class="{ disabled: !esCompatible('discapacidad') }">
                                        <input type="checkbox" value="certificado_discapacidad" v-model="docs_adjuntos"
                                            :disabled="!esCompatible('discapacidad') || isLoading">
                                        Cert. Discapacidad
                                    </label>
                                    <label class="check-item" :class="{ disabled: !esCompatible('derivacion') }">
                                        <input type="checkbox" value="derivacion_turno" v-model="docs_adjuntos"
                                            :disabled="!esCompatible('derivacion') || isLoading">
                                        Derivación + Turno
                                    </label>
                                </div>
                            </div>

                            <div class="form-group mt-4">
                                <label class="mb-label-title">Comprobantes / Archivos *</label>

                                <div class="file-upload-wrapper">
                                    <input type="file" id="file-upload" @change="onFilesSelected" class="file-input"
                                        multiple :disabled="isLoading" />
                                    <label for="file-upload" class="file-label">
                                        <span class="upload-text">📎 <strong>Adjuntar archivos</strong> (Clic
                                            aquí)</span>
                                    </label>
                                </div>
                                <div class="help-mini">Podés subir varios archivos (PDF o Imágenes). Máx 10MB c/u.</div>

                                <div v-if="archivos.length > 0" class="files-list fade-in">
                                    <div v-for="(file, index) in archivos" :key="index" class="file-item">
                                        <span class="file-name">📄 {{ file.name }}</span>
                                        <button type="button" @click="removeFile(index)" class="btn-remove"
                                            title="Quitar">❌</button>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" class="btn-enviar" :disabled="isLoading">
                                <span v-if="isLoading" class="btn-spinner"></span>
                                <span v-else>Confirmar Solicitud</span>
                            </button>
                        </div>
                    </div>

                </div>
            </form>

        </div>
    </div>
</template>

<script>
import api from "../api/axios";
import { useAuthStore } from "../stores/auth";
import { useNotificationStore } from "../stores/notification"; // 1. IMPORTAR
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';

export default {
    components: { Multiselect },
    data() {
        return {
            correo_electronico: "",
            apellido_nombre: "",
            dni: "",
            organismo_id: "",
            telefono: "",
            cbu_alias: "",
            tipo_subsidio: "",
            docs_adjuntos: [],
            archivos: [],
            archivoNombre: "",

            isLoading: false, // 2. ESTADO DE CARGA

            organismos: [],
            usuarios: [],
            cargandoUsuarios: false,
            errorUsuarios: false,
            esAdmin: false,
            usuarioSeleccionado: null,
        };
    },
    watch: {
        usuarioSeleccionado(nuevoUsuario) {
            if (this.esAdmin && nuevoUsuario) {
                this.cbu_alias = nuevoUsuario.cbu_alias || "";
                this.correo_electronico = nuevoUsuario.email || "";
                this.telefono = nuevoUsuario.telefono || "";
                this.apellido_nombre = nuevoUsuario.name || "";
                this.dni = nuevoUsuario.dni || "";
                this.organismo_id = nuevoUsuario.organismo_id || "";
            } else if (this.esAdmin && !nuevoUsuario) {
                this.cbu_alias = "";
                this.correo_electronico = "";
                this.telefono = "";
                this.apellido_nombre = "";
                this.dni = "";
                this.organismo_id = "";
            }
        },
        tipo_subsidio(nuevoTipo) {
            const mapa = {
                'hijo_menor_4': ['dni_hijos'],
                'casamiento': ['certificado_casamiento'],
                'discapacidad': ['certificado_discapacidad'],
                'derivacion_medica': ['derivacion_turno']
            };
            this.docs_adjuntos = mapa[nuevoTipo] || [];
        }
    },
    async mounted() {
        const auth = useAuthStore();
        this.esAdmin = auth.user?.role === "admin";

        await this.cargarOrganismos();
        if (this.esAdmin) await this.cargarUsuarios();

        // 1. Carga inicial de datos de perfil
        if (!this.esAdmin && auth.user) {
            this.correo_electronico = auth.user.email || '';
            this.apellido_nombre = auth.user.name || '';
            this.dni = auth.user.dni || '';
            this.telefono = auth.user.telefono || '';
            this.organismo_id = auth.user.organismo_id || '';
            if (auth.user.cbu_alias) this.cbu_alias = auth.user.cbu_alias;
        }

        // 2. LÓGICA DE RECUPERACIÓN (Para botón "Corregir")
        const idRechazado = this.$route.query.ref_id;

        if (idRechazado) {
            this.isLoading = true;
            const notify = useNotificationStore();

            try {
                // Pedimos los datos (asumiendo que el back ya tiene with('archivos') en show)
                const { data } = await api.get(`/subsidios/${idRechazado}`);

                // A. Rellenamos el Tipo de Subsidio (Esto marcará el Radio Button)
                this.tipo_subsidio = data.tipo_subsidio;

                // B. Precargamos los Checkboxes (Documentación a presentar)
                if (data.docs_adjuntos) {
                    this.docs_adjuntos = typeof data.docs_adjuntos === 'string'
                        ? JSON.parse(data.docs_adjuntos)
                        : data.docs_adjuntos;
                }

                // C. Precargamos otros datos
                if (data.cbu_alias) this.cbu_alias = data.cbu_alias;

                // D. Avisamos al usuario
                notify.info("Datos recuperados. Por favor, adjuntá los archivos corregidos.");

            } catch (e) {
                console.error(e);
                notify.error("No se pudo recuperar el trámite para corregir.");
            } finally {
                this.isLoading = false;
            }
        }
    },
    methods: {
        esCompatible(grupo) {
            if (!this.tipo_subsidio) return false;
            const mapa = {
                'nacimiento': ['nacimiento_adopcion'],
                'hijo': ['hijo_menor_4'],
                'casamiento': ['casamiento'],
                'discapacidad': ['discapacidad'],
                'derivacion': ['derivacion_medica']
            };
            return mapa[grupo].includes(this.tipo_subsidio);
        },
        async cargarOrganismos() {
            try {
                const res = await api.get("/organismos");
                this.organismos = res.data;
            } catch (e) { console.error(e); }
        },
        async cargarUsuarios() {
            this.cargandoUsuarios = true;
            this.errorUsuarios = false;
            try {
                const res = await api.get("/admin/usuarios");
                if (Array.isArray(res.data)) {
                    this.usuarios = res.data;
                } else if (res.data && res.data.data) {
                    this.usuarios = res.data.data;
                }
            } catch (e) {
                console.error(e);
                this.errorUsuarios = true;
            } finally {
                this.cargandoUsuarios = false;
            }
        },
        onFilesSelected(e) {
            const selectedFiles = Array.from(e.target.files);
            const notify = useNotificationStore();

            // Validamos tamaño antes de añadir
            const validFiles = selectedFiles.filter(file => {
                if (file.size > 10 * 1024 * 1024) {
                    notify.error(`El archivo ${file.name} supera los 10MB.`);
                    return false;
                }
                return true;
            });

            // Agregamos al array existente
            this.archivos = [...this.archivos, ...validFiles];
            e.target.value = ''; // Limpiar input para permitir nueva selección
        },

        removeFile(index) {
            this.archivos.splice(index, 1);
        },
        async enviar() {
            const notify = useNotificationStore();

            if (!this.tipo_subsidio) return notify.error("Debés seleccionar un motivo.");
            if (this.archivos.length === 0) return notify.error("Es obligatorio adjuntar al menos un comprobante."); // Validamos array length
            if (this.docs_adjuntos.length === 0) return notify.error("Marcá la documentación presentada.");
            if (this.esAdmin && !this.usuarioSeleccionado) return notify.error("Seleccioná un afiliado.");

            this.isLoading = true;
            const formData = new FormData();

            // ... (Tus append de datos de usuario/CBU) ...
            if (!this.esAdmin) {
                formData.append("correo_electronico", this.correo_electronico);
                formData.append("apellido_nombre", this.apellido_nombre);
                formData.append("dni", this.dni);
                formData.append("organismo_id", this.organismo_id);
                formData.append("telefono", this.telefono);
            } else {
                formData.append("user_id", this.usuarioSeleccionado.id);
            }
            formData.append("cbu_alias", this.cbu_alias || '');
            formData.append("tipo_subsidio", this.tipo_subsidio);
            formData.append("docs_adjuntos", JSON.stringify(this.docs_adjuntos));

            // --- CAMBIO CLAVE: Enviamos el array de archivos ---
            this.archivos.forEach((file, index) => {
                formData.append(`archivos[${index}]`, file);
            });
            // -----------------------------------------------------

            try {
                await api.post("/subsidios", formData, { headers: { "Content-Type": "multipart/form-data" } });
                notify.success("Solicitud enviada correctamente.");
                this.$router.push('/subsidios');

            } catch (e) {
                console.error(e);
                const errorMsg = e.response?.data?.message || "Error al enviar la solicitud.";
                notify.error(errorMsg);
            } finally {
                this.isLoading = false;
            }
        },
        formatoUsuario(usuario) {
            return `${usuario.name} — DNI: ${usuario.dni ?? 'Sin DNI'}`;
        },
        formatoUsuario(usuario) {
            return `${usuario.name} — DNI: ${usuario.dni ?? 'Sin DNI'}`;
        }
    }
};
</script>

<style scoped>
/* ============================
   ESTILOS GENERALES
============================ */
.nuevo-container {
    display: flex;
    justify-content: center;
    padding: 40px 20px;
    background-color: #f3f4f6;
    min-height: 100vh;
}

.form-card {
    background: white;
    width: 100%;
    max-width: 1000px;
    padding: 35px 45px;
    border-radius: 18px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.06);
    height: fit-content;
}

.card-header {
    text-align: center;
    margin-bottom: 30px;
}

h2 {
    color: #0f172a;
    font-size: 26px;
    font-weight: 800;
    margin-bottom: 15px;
}

.info-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin: 0 auto;
    padding: 12px 20px;
    max-width: 90%;
    background-color: #eff6ff;
    color: #1e40af;
    border: 1px solid #dbeafe;
    border-left: 4px solid #2563eb;
    border-radius: 6px;
    font-size: 14px;
    line-height: 1.5;
    box-shadow: 0 2px 5px rgba(37, 99, 235, 0.1);
}

.main-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 50px;
    align-items: start;
}

.col-datos {
    border-right: 1px solid #f1f5f9;
    padding-right: 40px;
}

.sticky-wrapper {
    position: sticky;
    top: 20px;
    background: #f8fafc;
    padding: 25px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
}

.inputs-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
}

.form-group.full-width {
    grid-column: span 2;
}

.section-title {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #64748b;
    font-weight: 700;
    margin-bottom: 20px;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 5px;
}

.section-title-pago {
    margin-top: 20px;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #64748b;
    font-weight: 700;
    margin-bottom: 20px;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 5px;
}

label {
    font-size: 13px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 6px;
}

.mb-label {
    margin-bottom: 10px;
    display: block;
    font-weight: 700;
    color: #334155;
}

.mb-label-title {
    margin-top: 15px;
    margin-bottom: 10px;
    display: block;
    font-weight: 700;
    color: #334155;
}

input,
select {
    padding: 10px 12px;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
    font-size: 14px;
    outline: none;
    transition: 0.2s;
    background: white;
    width: 100%;
}

input:focus,
select:focus {
    border-color: #0056A6;
    box-shadow: 0 0 0 3px rgba(0, 86, 166, 0.1);
}

input:disabled,
select:disabled {
    background: #f1f5f9;
    cursor: not-allowed;
}

.warning-box {
    margin-top: 10px;
    padding: 10px;
    background-color: #fff1f2;
    color: #9f1239;
    font-size: 12px;
    border-radius: 6px;
    border: 1px solid #fecdd3;
}

/* INFO DERIVACIÓN */
.info-derivacion {
    margin-top: 25px;
    background-color: #f0f9ff;
    border: 1px solid #bfdbfe;
    border-left: 4px solid #0056A6;
    border-radius: 8px;
    padding: 20px;
    color: #334155;
    font-size: 14px;
    box-shadow: 0 4px 15px -3px rgba(0, 86, 166, 0.1);
    transition: all 0.3s ease;
}

.info-derivacion:hover {
    background-color: #e0f2fe;
    box-shadow: 0 6px 20px -4px rgba(0, 86, 166, 0.15);
}

.info-derivacion h4 {
    margin: 0 0 12px 0;
    color: #0056A6;
    font-size: 15px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
}

.info-derivacion ul {
    margin: 0;
    padding-left: 20px;
}

.info-derivacion li {
    margin-bottom: 6px;
    line-height: 1.5;
}

/* RADIOS */
.radio-cards-compact {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.radio-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    cursor: pointer;
    background: white;
    transition: all 0.2s ease-in-out;
}

.radio-card:hover {
    border-color: #cbd5e1;
    background: #f8fafc;
}

.radio-card.active {
    border-color: #0056A6;
    background: #eff6ff;
    box-shadow: 0 4px 10px -2px rgba(0, 86, 166, 0.1);
    color: #0056A6;
    font-weight: 600;
}

.radio-card input {
    width: 14px;
    height: 14px;
    margin: 0;
    cursor: pointer;
    accent-color: #0056A6;
    background-color: transparent;
    border: none;
    outline: none;
    box-shadow: none;
    appearance: auto;
}

/* CHECKBOXES */
.checklist-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}

.check-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #475569;
    cursor: pointer;
    transition: 0.2s;
}

.check-item.disabled {
    opacity: 0.4;
    pointer-events: none;
    text-decoration: line-through;
}

.check-item input {
    width: 14px;
    height: 14px;
    accent-color: #0056A6;
    margin: 0;
}

/* FILE UPLOAD */
.file-upload-wrapper {
    position: relative;
    height: 45px;
}

.file-input {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 2;
}

.file-label {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    border: 1px dashed #0056A6;
    border-radius: 8px;
    background: #f0f9ff;
    color: #0056A6;
    font-size: 13px;
    transition: 0.2s;
}

.file-input:hover+.file-label {
    background: #e0f2fe;
}

.help-mini {
    font-size: 11px;
    color: #94a3b8;
    text-align: center;
    margin-top: 5px;
}

/* BTN ENVIAR */
.btn-enviar {
    margin-top: 20px;
    width: 100%;
    padding: 14px;
    background: #0056A6;
    color: white;
    font-weight: 700;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 15px;
    transition: 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.btn-enviar:hover:not(:disabled) {
    background: #004485;
    transform: translateY(-1px);
}

.btn-enviar:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    opacity: 0.8;
}

.btn-spinner {
    width: 18px;
    height: 18px;
    border: 2px solid #ffffff;
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.files-list {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 13px;
    color: #334155;
}

.file-name {
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 90%;
}

.btn-remove {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 12px;
    opacity: 0.7;
    transition: 0.2s;
}
.btn-remove:hover {
    opacity: 1;
    transform: scale(1.1);
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* MULTISELECT */
:deep(.multiselect) {
    min-height: 40px;
}

:deep(.multiselect__tags) {
    border: 1px solid #cbd5e1;
    border-radius: 6px;
}

:deep(.multiselect__option--highlight) {
    background: #0056A6;
}

.loading-text {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #64748b;
    margin-bottom: 10px;
}

.mini-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid #cbd5e1;
    border-top-color: #0056A6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.mensaje-azul {
    background: #0056A6;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 40px;
    margin: -12px;
    padding: 10px;
    border-radius: 0;
}

.fade-in {
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 900px) {
    .main-layout {
        grid-template-columns: 1fr;
        gap: 30px;
    }

    .col-datos {
        border-right: none;
        padding-right: 0;
        padding-bottom: 20px;
        border-bottom: 1px solid #e2e8f0;
    }

    .checklist-grid,
    .inputs-grid {
        grid-template-columns: 1fr;
    }

    .form-card {
        padding: 25px 20px;
    }
}
</style>