<template>
  <div class="flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-200">
    <Sidebar />

    <div class="flex-1 flex flex-col min-w-0 h-screen">
      <Navbar />

      <!-- Chat Header -->
      <div class="bg-white dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800/80 px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>💬 Chat General del Condominio</span>
            <span class="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" title="Servidor WebSocket Activo"></span>
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400">Canal de comunicación en tiempo real entre vecinos</p>
        </div>
      </div>

      <!-- Messages Area -->
      <div ref="contenedorMensajes" class="flex-1 overflow-y-auto p-6 space-y-4">
        <div v-if="cargando" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>

        <div v-else-if="mensajes.length === 0" class="text-center py-12 text-slate-400 text-sm">
          No hay mensajes en el chat. ¡Sé el primero en escribir!
        </div>

        <div
          v-for="msg in mensajes"
          :key="msg._id || msg.id"
          :class="esMiMensaje(msg) ? 'justify-end' : 'justify-start'"
          class="flex"
        >
          <div
            :class="esMiMensaje(msg) ? 'bg-purple-600 text-white rounded-2xl rounded-tr-none shadow-md shadow-purple-600/10' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-100 rounded-2xl rounded-tl-none shadow-sm'"
            class="max-w-md p-4 space-y-1"
          >
            <div class="flex items-center justify-between gap-4 text-[11px] font-semibold opacity-75">
              <span>{{ msg.nombre_usuario }}</span>
              <span class="text-[10px] font-normal opacity-60">{{ msg.hora }}</span>
            </div>
            <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ msg.mensaje }}</p>
          </div>
        </div>
      </div>

      <!-- Input Bar -->
      <div class="p-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 shrink-0">
        <form @submit.prevent="enviarMensaje" class="flex items-center gap-3">
          <input
            v-model="nuevoMensaje"
            type="text"
            placeholder="Escribe un mensaje para los condóminos..."
            class="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/70 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            :disabled="!nuevoMensaje.trim() || enviando"
            class="bg-purple-600 hover:bg-purple-700 text-white font-medium px-5 py-3 rounded-xl shadow-lg shadow-purple-600/20 transition-all disabled:opacity-40"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'
import api from '@/services/api'
import echo from '@/services/echo'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const mensajes = ref([])
const nuevoMensaje = ref('')
const cargando = ref(false)
const enviando = ref(false)
const contenedorMensajes = ref(null)

const esMiMensaje = (msg) => {
  const miId = String(authStore.user?.id || authStore.user?._id || '')
  return String(msg.user_id) === miId
}

const desplazarAbajo = async () => {
  await nextTick()
  if (contenedorMensajes.value) {
    contenedorMensajes.value.scrollTop = contenedorMensajes.value.scrollHeight
  }
}

const cargarMensajes = async () => {
  cargando.value = true
  try {
    const res = await api.get('/chat/mensajes')
    mensajes.value = res.data.data
    desplazarAbajo()
  } catch (err) {
    console.error('Error al cargar historial de chat:', err)
  } finally {
    cargando.value = false
  }
}

const enviarMensaje = async () => {
  if (!nuevoMensaje.value.trim()) return

  enviando.value = true
  const texto = nuevoMensaje.value
  nuevoMensaje.value = ''

  try {
    const res = await api.post('/chat/mensajes', { mensaje: texto })
    mensajes.value.push(res.data.data)
    desplazarAbajo()
  } catch (err) {
    console.error('Error al enviar mensaje:', err)
    nuevoMensaje.value = texto
  } finally {
    enviando.value = false
  }
}

const procesarNuevoMensaje = (e) => {
  const msg = e.mensaje || e
  const miId = String(authStore.user?.id || authStore.user?._id || '')
  if (String(msg.user_id) !== miId) {
    mensajes.value.push(msg)
    desplazarAbajo()
  }
}

onMounted(() => {
  cargarMensajes()

  echo.channel('chat-general')
    .listen('.MensajeEnviado', procesarNuevoMensaje)
    .listen('MensajeEnviado', procesarNuevoMensaje)
})

onUnmounted(() => {
  echo.leaveChannel('chat-general')
})
</script>