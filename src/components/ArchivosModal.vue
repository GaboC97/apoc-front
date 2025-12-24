<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="modal-backdrop" @click="close">
      <div class="modal-card modal-archivos" @click.stop>
        
        <div class="modal-header">
          <h3>📂 Documentos Adjuntos ({{ archivos.length }})</h3>
          <button class="btn-close" @click="close">✕</button>
        </div>

        <div class="modal-body-custom">
          <p v-if="archivos.length === 0" class="text-muted">No hay archivos para mostrar.</p>
          
          <div v-for="(archivo, index) in archivos" :key="index" class="file-item-modal">
            <span class="file-name">📄 {{ archivo.nombre_original }}</span>
            
            <a :href="getUrlArchivo(archivo.path)" target="_blank" class="btn-download">
              Descargar
            </a>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" @click="close">Cerrar</button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// Definición de la URL base para el archivo (usamos la misma lógica que la vista principal)
const BASE_URL = import.meta.env.VITE_API_URL.replace(/\/api$/, '');

const props = defineProps({
  isOpen: Boolean,
  archivos: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close']);
const close = () => emit('close');

const getUrlArchivo = (path) => {
    if (!path) return '#';
    return `${BASE_URL}/storage/${path}`;
}
</script>

<style scoped>
/* ESTILOS ESENCIALES DEL MODAL (AÑADIR A ArchivosModal.vue) */
.modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.65); backdrop-filter: blur(5px); display: flex; justify-content: center; align-items: center; z-index: 9999; padding: 20px; }
.modal-card { background: white; width: 100%; max-width: 450px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25); overflow: hidden; }
.modal-header { padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; }
.modal-header h3 { margin: 0; font-size: 16px; color: #0f172a; font-weight: 700; }
.modal-body-custom { padding: 20px; display: flex; flex-direction: column; gap: 10px; max-height: 400px; overflow-y: auto; }
.modal-footer { padding: 10px 20px; text-align: right; background: #f8fafc; border-top: 1px solid #f1f5f9; }
.btn-close { background: none; border: none; cursor: pointer; color: #94a3b8; font-size: 18px; transition: 0.2s; }
.btn-secondary { background: #e2e8f0; border: none; padding: 8px 15px; border-radius: 6px; font-weight: 600; color: #334155; cursor: pointer; }

/* ESTILOS DE ARCHIVO EN EL MODAL */
.file-item-modal { display: flex; justify-content: space-between; align-items: center; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; background: #fcfcfc; }
.file-name { font-size: 14px; color: #334155; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 60%; }
.btn-download { background: #0056A6; color: white; padding: 6px 10px; border-radius: 4px; font-size: 12px; text-decoration: none; font-weight: 600; transition: 0.2s; }
.btn-download:hover { background: #004485; }
</style>