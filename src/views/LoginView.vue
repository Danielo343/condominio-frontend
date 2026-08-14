<template>
  <div class="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-100 font-sans">
    <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      <!-- Glow Decorativo -->
      <div class="absolute -top-12 -right-12 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Header de la Aplicación -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 bg-purple-600/20 border border-purple-500/30 rounded-2xl text-purple-400 font-bold text-2xl mb-3 shadow-lg shadow-purple-600/10">
          🏢
        </div>
        <h1 class="text-2xl font-bold text-white tracking-tight">CondoMaster Pro</h1>
        <p class="text-xs text-slate-400 mt-1">Plataforma de Gestión de Condominios</p>
      </div>

      <!-- Alerta de Respuesta -->
      <div v-if="mensaje" :class="esError ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'" class="p-3.5 rounded-xl border text-xs font-medium mb-6">
        {{ mensaje }}
      </div>

      <!-- VISTA 1: INICIO DE SESIÓN -->
      <form v-if="paso === 'login'" @submit.prevent="iniciarSesion" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Correo Electrónico</label>
          <input
            v-model="formLogin.email"
            required
            type="email"
            placeholder="admin@lospinos.com"
            class="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <div class="flex justify-between items-center mb-1.5">
            <label class="block text-xs font-semibold uppercase text-slate-400">Contraseña</label>
            <button type="button" @click="paso = 'solicitar'" class="text-xs text-purple-400 hover:underline">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <input
            v-model="formLogin.password"
            required
            type="password"
            placeholder="••••••••"
            class="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
          />
        </div>

        <button
          type="submit"
          :disabled="cargando"
          class="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-purple-600/20 transition-all disabled:opacity-50 text-sm"
        >
          {{ cargando ? 'Iniciando Sesión...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <!-- VISTA 2: SOLICITAR CÓDIGO DE 6 DÍGITOS -->
      <form v-else-if="paso === 'solicitar'" @submit.prevent="enviarCodigo" class="space-y-4">
        <p class="text-xs text-slate-400 mb-2">Ingresa tu correo registrado para recibir un código de 6 dígitos.</p>
        <div>
          <label class="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Correo Electrónico</label>
          <input
            v-model="formRecuperar.email"
            required
            type="email"
            placeholder="admin@lospinos.com"
            class="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
          />
        </div>

        <button
          type="submit"
          :disabled="cargando"
          class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-purple-600/20 transition-all disabled:opacity-50 text-sm"
        >
          {{ cargando ? 'Enviando Código...' : 'Enviar Código a mi Correo' }}
        </button>

        <button type="button" @click="paso = 'login'" class="w-full text-xs text-slate-400 hover:text-white mt-2">
          Volver al Inicio de Sesión
        </button>
      </form>

      <!-- VISTA 3: RESTABLECER CON CÓDIGO DE 6 DÍGITOS -->
      <form v-else-if="paso === 'restablecer'" @submit.prevent="restablecerPassword" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Código de 6 Dígitos</label>
          <input
            v-model="formReset.codigo"
            required
            maxlength="6"
            type="text"
            placeholder="123456"
            class="w-full bg-slate-800/80 border border-purple-500/50 text-center tracking-[0.5em] font-bold text-lg rounded-xl px-4 py-3 text-purple-300 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Nueva Contraseña</label>
          <input
            v-model="formReset.password"
            required
            type="password"
            placeholder="••••••••"
            class="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Confirmar Nueva Contraseña</label>
          <input
            v-model="formReset.password_confirmation"
            required
            type="password"
            placeholder="••••••••"
            class="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
          />
        </div>

        <button
          type="submit"
          :disabled="cargando"
          class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-purple-600/20 transition-all disabled:opacity-50 text-sm"
        >
          {{ cargando ? 'Restableciendo...' : 'Restablecer Contraseña' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const paso = ref('login')
const cargando = ref(false)
const mensaje = ref('')
const esError = ref(false)

const formLogin = ref({ email: 'admin@lospinos.com', password: '' })
const formRecuperar = ref({ email: '' })
const formReset = ref({ codigo: '', password: '', password_confirmation: '' })

const iniciarSesion = async () => {
  cargando.value = true
  mensaje.value = ''
  esError.value = false

  try {
    const res = await api.post('/login', formLogin.value)
    
    if (res.data && res.data.token) {
      authStore.setToken(res.data.token)
      authStore.setUser(res.data.user)
      router.push('/dashboard')
    } else {
      esError.value = true
      mensaje.value = res.data?.message || 'Error al iniciar sesión.'
    }
  } catch (err) {
    console.error('Error capturado en iniciarSesion:', err)
    esError.value = true
    if (err.response?.data?.message) {
      mensaje.value = err.response.data.message
    } else {
      mensaje.value = 'Credenciales o conexión incorrecta.'
    }
  } finally {
    cargando.value = false
  }
}

const enviarCodigo = async () => {
  cargando.value = true
  mensaje.value = ''
  esError.value = false
  try {
    const res = await api.post('/recuperar-clave', formRecuperar.value)
    mensaje.value = res.data.message
    paso.value = 'restablecer'
  } catch (err) {
    console.error('Error al enviar código:', err)
    esError.value = true
    mensaje.value = err.response?.data?.message || 'No se pudo enviar el código.'
  } finally {
    cargando.value = false
  }
}

const restablecerPassword = async () => {
  cargando.value = true
  mensaje.value = ''
  esError.value = false
  try {
    const payload = {
      email: formRecuperar.value.email,
      codigo: formReset.value.codigo,
      password: formReset.value.password,
      password_confirmation: formReset.value.password_confirmation
    }
    const res = await api.post('/restablecer-clave', payload)
    mensaje.value = res.data.message
    setTimeout(() => {
      paso.value = 'login'
      mensaje.value = 'Contraseña actualizada. Inicia sesión.'
    }, 2000)
  } catch (err) {
    console.error('Error al restablecer contraseña:', err)
    esError.value = true
    mensaje.value = err.response?.data?.message || 'Error al restablecer la contraseña.'
  } finally {
    cargando.value = false
  }
}
</script>