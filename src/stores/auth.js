import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    usuario: JSON.parse(localStorage.getItem('usuario')) || null,
    token: localStorage.getItem('token') || '',
  }),
  getters: {
    estaAutenticado: (state) => !!state.token,
    esAdmin: (state) => state.usuario?.role === 'admin',
  },
  actions: {
    async login(credenciales) {
      const respuesta = await api.post('/login', credenciales)
      this.token = respuesta.data.token
      this.usuario = respuesta.data.usuario

      localStorage.setItem('token', this.token)
      localStorage.setItem('usuario', JSON.stringify(this.usuario))
      return respuesta.data
    },

    async registro(datos) {
      const respuesta = await api.post('/registro', datos)
      this.token = respuesta.data.token
      this.usuario = respuesta.data.usuario

      localStorage.setItem('token', this.token)
      localStorage.setItem('usuario', JSON.stringify(this.usuario))
      return respuesta.data
    },

    async logout() {
      try {
        await api.post('/logout')
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
      } finally {
        this.token = ''
        this.usuario = null
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
      }
    },
  },
})