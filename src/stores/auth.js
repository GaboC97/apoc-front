import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {

  const isReady = ref(false)   
  const isLoggedIn = ref(false)
  const user = ref(null)

  function loadFromStorage() {
    try {
      const token = localStorage.getItem("token")
      const rawUser = localStorage.getItem("user")

      if (!token || !rawUser) {
        isLoggedIn.value = false
        user.value = null
      } else {
        isLoggedIn.value = true
        user.value = JSON.parse(rawUser)
      }
    } catch {
      isLoggedIn.value = false
      user.value = null
    }

    // CAMBIO CLAVE AQUÍ:
    // Agregamos un pequeño delay (800ms) para que el usuario vea 
    // la animación de carga y no sea un parpadeo brusco.
    setTimeout(() => {
      isReady.value = true
    }, 800)
  }

  function login(token, userData) {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(userData))
    isLoggedIn.value = true
    user.value = userData
  }

  function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    isLoggedIn.value = false
    user.value = null
  }



  return { isReady, isLoggedIn, user, loadFromStorage, login, logout }
})