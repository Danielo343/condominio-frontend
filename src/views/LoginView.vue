<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
    <!-- Alerta de Notificación con Transición de Vue -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="mensajeAlerta.texto"
        :class="[
          'fixed top-6 right-6 px-5 py-3 rounded-lg shadow-xl text-sm font-medium z-50 flex items-center gap-3 border',
          mensajeAlerta.tipo === 'exito'
            ? 'bg-emerald-950 border-emerald-500/50 text-emerald-200'
            : 'bg-rose-950 border-rose-500/50 text-rose-200'
        ]"
      >
        <span>{{ mensajeAlerta.texto }}</span>
      </div>
    </Transition>

    <div class="w-full max-w-md bg-slate-800/90 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-2xl">
      <!-- Encabezado -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 mb-3 border border-purple-500/30">
          <svg width="28" height="28" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V12m0 0h4m-4 0H7" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-white tracking-wide">CondoMaster <span class="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-400/30">Pro</span></h1>
        <p class="text-slate-400 text-sm mt-1">Plataforma de gestión comunitaria</p>
      </div>

      <!-- Selector Login / Registro -->
      <div class="flex bg-slate-900/80 p-1 rounded-xl mb-6 border border-slate-700/50">
        <button
          type="button"
          @click="esRegistro = false"
          :class="['flex-1 py-2 text-sm font-medium rounded-lg transition-all', !esRegistro ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200']"
        >
          Login
        </button>
        <button
          type="button"
          @click="esRegistro = true"
          :class="['flex-1 py-2 text-sm font-medium rounded-lg transition-all', esRegistro ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200']"
        >
          Registro
        </button>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="esRegistro">
          <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Nombre completo</label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="Ej. Carlos Rodríguez"
            class="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Correo electrónico</label>
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="admin@lospinos.com"
            class="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Contraseña</label>
          <input
            v-model="form.password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div v-if="esRegistro" class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Teléfono</label>
            <input
              v-model="form.phone"
              type="text"
              placeholder="315-555-0110"
              class="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Rol</label>
            <select
              v-model="form.role"
              class="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
            >
              <option value="residente">Residente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </div>

        <!-- Botón submit con indicador animado -->
        <button
          type="submit"
          :disabled="cargando"
          class="w-full mt-6 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer"
        >
          <Transition name="fade" mode="out-in">
            <span v-if="cargando" class="flex items-center gap-2">
              <svg width="20" height="28" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </span>
            <span v-else>
              {{ esRegistro ? 'Crear Cuenta' : 'Ingresar' }}
            </span>
          </Transition>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const esRegistro = ref(false)
const cargando = ref(false)
const mensajeAlerta = reactive({ texto: '', tipo: 'exito' })

const form = reactive({
  name: '',
  email: '',
  password: '',
  phone: '',
  role: 'residente',
})

const mostrarAlerta = (texto, tipo = 'exito') => {
  mensajeAlerta.texto = texto
  mensajeAlerta.tipo = tipo
  setTimeout(() => {
    mensajeAlerta.texto = ''
  }, 4000)
}

const handleSubmit = async () => {
  cargando.value = true
  try {
    if (esRegistro.value) {
      await authStore.registro(form)
      mostrarAlerta('¡Cuenta registrada exitosamente!', 'exito')
    } else {
      await authStore.login({
        email: form.email,
        password: form.password,
      })
      mostrarAlerta('¡Inicio de sesión exitoso!', 'exito')
    }

    setTimeout(() => {
      router.push({ name: 'dashboard' })
    }, 1000)
  } catch (error) {
    const errorTexto = error.response?.data?.mensaje || error.response?.data?.message || 'Error al conectar con el servidor'
    mostrarAlerta(errorTexto, 'error')
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>