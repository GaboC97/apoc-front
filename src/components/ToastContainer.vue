<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div 
        v-for="note in store.notifications" 
        :key="note.id" 
        class="toast"
        :class="note.type"
      >
        <span v-if="note.type === 'success'" class="icon">✅</span>
        <span v-if="note.type === 'error'" class="icon">❌</span>
        <span v-if="note.type === 'info'" class="icon">ℹ️</span>
        
        <span class="message">{{ note.message }}</span>
        
        <button class="close-btn" @click="store.remove(note.id)">×</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useNotificationStore } from '../stores/notification';
const store = useNotificationStore();
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000; /* Arriba de todo */
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none; /* Para que el click pase a través del contenedor vacío */
}

.toast {
  pointer-events: all; /* Reactivar clicks en la tarjeta */
  background: white;
  min-width: 300px;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  border-left: 5px solid #ccc;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

/* Tipos */
.toast.success { border-left-color: #16a34a; }
.toast.error   { border-left-color: #dc2626; }
.toast.info    { border-left-color: #2563eb; }

.close-btn {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #94a3b8;
}

/* Animaciones */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>