<template>
  <header class="bg-white dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800/80 px-6 py-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md transition-colors duration-200">
    <!-- Left Area -->
    <div class="flex items-center gap-3">
      <h2 class="text-sm font-semibold text-slate-800 dark:text-slate-200 hidden sm:block">CondoMaster Pro</h2>
      <span
        :class="esAdmin ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800/50' : 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800/50'"
        class="text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider"
      >
        {{ usuario.role || 'Residente' }}
      </span>
    </div>

    <!-- Right Controls -->
    <div class="flex items-center gap-3 sm:gap-4">
      <!-- Toggle Modo Claro / Oscuro -->
      <button
        @click="alternarTema"
        class="p-2.5 text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 flex items-center justify-center border border-slate-200 dark:border-slate-700/60"
        :title="temaOscuro ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'"
      >
        <span v-if="temaOscuro" class="text-sm font-bold">☀️ Claro</span>
        <span v-else class="text-sm font-bold">🌙 Oscuro</span>
      </button>

      <!-- Campana de Notificaciones -->
      <div class="relative">
        <button
          @click="toggleNotificaciones"
          class="relative p-2 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          title="Notificaciones"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <!-- Badge con animación de pulso -->
          <span
            v-if="noLeidas > 0"
            class="absolute top-1 right-1 px-1.5 py-0.2 min-w-[18px] h-[18px] bg-purple-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-bounce"
          >
            {{ noLeidas }}
          </span>
        </button>

        <!-- Dropdown de Notificaciones -->
        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 scale-95 -translate-y-2"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 -translate-y-2"
        >
          <div
            v-if="mostrarNotificaciones"
            class="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl p-4 space-y-3 z-50 text-slate-800 dark:text-slate-100"
          >
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <h3 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>🔔 Notificaciones</span>
                <span v-if="noLeidas > 0" class="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/80 px-2 py-0.5 rounded-md">
                  {{ noLeidas }} nuevas
                </span>
              </h3>
              <button
                v-if="noLeidas > 0"
                @click="marcarTodasLeidas"
                class="text-[11px] text-purple-600 dark:text-purple-400 hover:underline font-semibold"
              >
                Marcar leídas
              </button>
            </div>

            <!-- Lista Dinámica -->
            <div class="space-y-2 max-h-72 overflow-y-auto pr-1">
              <div
                v-for="notif in notificaciones"
                :key="notif.id"
                :class="notif.leida ? 'bg-slate-50 dark:bg-slate-800/40 opacity-70 border-slate-200 dark:border-slate-800' : 'bg-purple-50/70 dark:bg-slate-800/90 border-purple-300 dark:border-purple-500/40 ring-1 ring-purple-500/20'"
                class="p-3 border rounded-xl space-y-1 transition-all"
              >
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-slate-900 dark:text-slate-100">{{ notif.titulo }}</span>
                  <span class="text-[10px] text-slate-500 dark:text-slate-400">{{ notif.tiempo }}</span>
                </div>
                <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{{ notif.mensaje }}</p>
              </div>

              <div v-if="notificaciones.length === 0" class="text-center py-6 text-xs text-slate-400">
                No tienes notificaciones pendientes.
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- User Profile Info & Logout -->
      <div class="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
        <div class="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold text-xs">
          {{ inicialesUsuario }}
        </div>
        <div class="hidden md:block text-left text-xs">
          <p class="font-semibold text-slate-800 dark:text-slate-200 leading-tight">{{ usuario.name }}</p>
          <p class="text-slate-500 dark:text-slate-400 text-[10px]">{{ usuario.role }}</p>
        </div>

        <button
          @click="cerrarSesion"
          title="Cerrar Sesión"
          class="p-2 text-slate-500 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors ml-1"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>

    <!-- TOAST POPUP FLOTANTE ULTRA LLAMATIVO EN PANTALLA -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-x-12 scale-95"
      enter-to-class="opacity-100 translate-x-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-x-0 scale-100"
      leave-to-class="opacity-0 translate-x-12 scale-95"
    >
      <div
        v-if="toastVisible"
        class="fixed top-20 right-6 z-50 max-w-sm w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-purple-500 shadow-2xl shadow-purple-500/30 rounded-2xl p-4 flex flex-col gap-3 backdrop-blur-2xl ring-4 ring-purple-500/20"
      >
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-300 border border-purple-300 dark:border-purple-800/50 flex items-center justify-center text-xl shrink-0">
            {{ toastInfo.icono }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">{{ toastInfo.titulo }}</h4>
              <span class="text-[10px] text-slate-400">Ahora</span>
            </div>
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate mt-0.5">{{ toastInfo.mensaje }}</p>
          </div>
          <button @click="toastVisible = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Botón de Acción Rápida -->
        <div v-if="toastInfo.ruta" class="flex justify-end pt-1">
          <button
            @click="irARuta(toastInfo.ruta)"
            class="text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 px-3.5 py-1.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <span>Ver detalle</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import echo from '@/services/echo'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const usuario = computed(() => authStore.user || { name: 'Usuario', role: 'Residente' })
const esAdmin = computed(() => usuario.value.role === 'Administrador')

const mostrarNotificaciones = ref(false)
const notificaciones = ref([])
const temaOscuro = ref(localStorage.getItem('tema') !== 'claro')

const toastVisible = ref(false)
const toastInfo = ref({ icono: '🔔', titulo: '', mensaje: '', ruta: '' })

const noLeidas = computed(() => notificaciones.value.filter(n => !n.leida).length)

const inicialesUsuario = computed(() => {
  if (!usuario.value || !usuario.value.name) return 'U'
  return usuario.value.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
})

// Sonido nativo y elegante de campana
const reproducirSonido = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const audioCtx = new AudioContext()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime) // Tono D5
    osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1) // Tono A5

    gain.gain.setValueAtTime(0.2, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45)

    osc.connect(gain)
    gain.connect(audioCtx.destination)

    osc.start()
    osc.stop(audioCtx.currentTime + 0.45)
  } catch (e) {
    // Si el navegador bloquea audio antes del primer clic
  }
}

const aplicarTema = (oscuro) => {
  if (oscuro) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('tema', 'oscuro')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('tema', 'claro')
  }
}

const alternarTema = () => {
  temaOscuro.value = !temaOscuro.value
  aplicarTema(temaOscuro.value)
}

const toggleNotificaciones = () => {
  mostrarNotificaciones.value = !mostrarNotificaciones.value
}

const dispararToast = (icono, titulo, mensaje, ruta = '') => {
  toastInfo.value = { icono, titulo, mensaje, ruta }
  toastVisible.value = true
  reproducirSonido()
  setTimeout(() => {
    toastVisible.value = false
  }, 5000)
}

const irARuta = (ruta) => {
  toastVisible.value = false
  if (ruta) {
    router.push(ruta)
  }
}

const cargarNotificaciones = async () => {
  try {
    const res = await api.get('/notificaciones')
    notificaciones.value = res.data.data
  } catch (err) {
    console.error('Error al cargar notificaciones:', err)
  }
}

const marcarTodasLeidas = async () => {
  try {
    await api.post('/notificaciones/marcar-leidas')
    notificaciones.value.forEach(n => (n.leida = true))
  } catch (err) {
    console.error('Error al marcar leídas:', err)
  }
}

const cerrarSesion = async () => {
  try {
    await api.post('/logout')
  } catch (err) {
    console.error('Error al cerrar sesión:', err)
  } finally {
    authStore.logout()
    router.push('/login')
  }
}

onMounted(() => {
  aplicarTema(temaOscuro.value)
  cargarNotificaciones()

  // 1. Notificación en vivo de Eventos
  echo.channel('notificaciones-generales')
    .listen('.NotificacionCreada', (e) => {
      const notif = e.notificacion || e
      notificaciones.value.unshift({
        id: notif._id || Date.now(),
        titulo: notif.titulo || 'Nuevo Evento en el Condominio',
        mensaje: notif.mensaje || '',
        tipo: 'evento',
        leida: false,
        tiempo: 'Justo ahora'
      })
      dispararToast('📅', notif.titulo || 'Nuevo Evento', notif.mensaje || 'Revisa el panel de control.', '/dashboard')
    })

  // 2. Notificación en vivo de Mensajes del Chat
  echo.channel('chat-general')
    .listen('.MensajeEnviado', (e) => {
      const msg = e.mensaje || e
      const miId = String(authStore.user?.id || authStore.user?._id || '')
      if (String(msg.user_id) !== miId) {
        if (route.path !== '/chat') {
          notificaciones.value.unshift({
            id: msg._id || Date.now(),
            titulo: `💬 ${msg.nombre_usuario}`,
            mensaje: msg.mensaje,
            tipo: 'chat',
            leida: false,
            tiempo: 'Justo ahora'
          })
          dispararToast('💬', `Mensaje de ${msg.nombre_usuario}`, msg.mensaje, '/chat')
        }
      }
    })
})

onUnmounted(() => {
  echo.leaveChannel('notificaciones-generales')
  echo.leaveChannel('chat-general')
})
</script>