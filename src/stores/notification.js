import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([]);
  let nextId = 1;

  // Tipos: 'success', 'error', 'info', 'warning'
  function add(type, message, duration = 4000) {
    const id = nextId++;
    const notification = { id, type, message };
    
    notifications.value.push(notification);

    // Auto-eliminar después del tiempo
    setTimeout(() => {
      remove(id);
    }, duration);
  }

  function remove(id) {
    notifications.value = notifications.value.filter(n => n.id !== id);
  }

  // Atajos rápidos
  const success = (msg) => add('success', msg);
  const error = (msg) => add('error', msg);
  const info = (msg) => add('info', msg);

  return { notifications, add, remove, success, error, info };
});