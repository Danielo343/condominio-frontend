<template>
  <div class="flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-200">
    <Sidebar />

    <div class="flex-1 flex flex-col min-w-0 overflow-y-auto">
      <Navbar />

      <main class="p-6 md:p-8 space-y-6">
        <!-- Header del Dashboard -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Panel de Control</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">Resumen general de la actividad del condominio en tiempo real</p>
          </div>
          <button
            v-if="esAdmin"
            @click="mostrarModalEvento = true"
            class="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-purple-600/20 transition-all duration-200 text-sm shrink-0"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Programar Evento</span>
          </button>
        </div>

        <!-- Spinner de Carga -->
        <div v-if="cargando" class="flex justify-center py-16">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
        </div>

        <div v-else class="space-y-6">
          <!-- 4 Tarjetas Superiores de Métricas -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <!-- Total Residentes -->
            <div class="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm space-y-3 transition-colors">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Residentes</span>
                <div class="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-500/20 dark:border-purple-500/30 flex items-center justify-center text-lg">
                  👥
                </div>
              </div>
              <div>
                <p class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{{ resumen.total_residentes }}</p>
                <p class="text-xs text-purple-600 dark:text-purple-400 font-medium mt-1">Registrados en MongoDB</p>
              </div>
            </div>

            <!-- Unidades Ocupadas -->
            <div class="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm space-y-3 transition-colors">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Unidades Ocupadas</span>
                <div class="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 dark:border-blue-500/30 flex items-center justify-center text-lg">
                  🏠
                </div>
              </div>
              <div>
                <p class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {{ resumen.unidades_ocupadas }}/{{ resumen.capacidad_total }}
                </p>
                <p class="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">{{ resumen.porcentaje_ocupacion }}% de ocupación</p>
              </div>
            </div>

            <!-- Ingresos del Mes -->
            <div class="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm space-y-3 transition-colors">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ingresos del Mes</span>
                <div class="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30 flex items-center justify-center text-lg">
                  📈
                </div>
              </div>
              <div>
                <p class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">${{ formatearMoneda(resumen.ingresos_mes) }}</p>
                <p class="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">Estimado según cuota</p>
              </div>
            </div>

            <!-- Eventos Próximos -->
            <div class="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm space-y-3 transition-colors">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Eventos Próximos</span>
                <div class="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-600/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 dark:border-amber-500/30 flex items-center justify-center text-lg">
                  🗓️
                </div>
              </div>
              <div>
                <p class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{{ resumen.total_eventos }}</p>
                <p class="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">Agendados en el condominio</p>
              </div>
            </div>
          </div>

          <!-- Paneles Inferiores: Actividad Reciente y Próximos Eventos -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Actividad Reciente -->
            <div class="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 space-y-4 transition-colors">
              <h2 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Actividad Reciente</h2>
              <div class="space-y-3">
                <div class="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div class="flex items-center gap-3">
                    <span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                    <div>
                      <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">Servicio de WebSockets iniciado</p>
                      <p class="text-xs text-slate-500 dark:text-slate-400">Canal de chat general listo</p>
                    </div>
                  </div>
                  <span class="text-xs font-medium text-slate-500">En vivo</span>
                </div>

                <div class="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div class="flex items-center gap-3">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <div>
                      <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">Base de datos sincronizada</p>
                      <p class="text-xs text-slate-500 dark:text-slate-400">MongoDB Atlas conectado</p>
                    </div>
                  </div>
                  <span class="text-xs font-medium text-slate-500">Activo</span>
                </div>

                <div class="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div class="flex items-center gap-3">
                    <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <div>
                      <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">Módulo de residentes operativo</p>
                      <p class="text-xs text-slate-500 dark:text-slate-400">{{ resumen.total_residentes }} registros en base de datos</p>
                    </div>
                  </div>
                  <span class="text-xs font-medium text-slate-500">OK</span>
                </div>
              </div>
            </div>

            <!-- Próximos Eventos -->
            <div class="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 space-y-4 transition-colors">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Próximos Eventos</h2>
                <span class="text-xs font-medium px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50">
                  {{ resumen.lista_eventos.length }} activos
                </span>
              </div>

              <div v-if="resumen.lista_eventos.length === 0" class="text-center py-8 text-slate-400 text-sm">
                No hay eventos programados en este momento.
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="evento in resumen.lista_eventos"
                  :key="evento._id || evento.id"
                  class="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700/80 rounded-2xl p-4 transition-all duration-200"
                >
                  <div class="flex items-start justify-between gap-4">
                    <div class="space-y-1.5 min-w-0">
                      <!-- Badge de Categoría + Título -->
                      <div class="flex items-center gap-2 flex-wrap">
                        <span
                          :class="obtenerColorBadge(evento.categoria)"
                          class="text-[11px] font-bold px-2.5 py-0.5 rounded-lg tracking-wide border"
                        >
                          {{ evento.categoria || 'Asamblea' }}
                        </span>
                        <h3 class="text-sm font-bold text-slate-900 dark:text-white truncate">{{ evento.titulo }}</h3>
                      </div>

                      <!-- Fecha, Hora y Lugar Claros -->
                      <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 pt-1">
                        <span class="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold">
                          <span>🗓️</span>
                          <span>{{ formatearFechaCompleta(evento.fecha) }}</span>
                        </span>
                        <span class="flex items-center gap-1">
                          <span>⏰</span>
                          <span>{{ evento.hora }} hrs</span>
                        </span>
                        <span class="flex items-center gap-1 truncate">
                          <span>📍</span>
                          <span>{{ evento.lugar }}</span>
                        </span>
                      </div>
                    </div>

                    <!-- Botón Eliminar Evento (Solo Admin) -->
                    <button
                      v-if="esAdmin"
                      @click="eliminarEvento(evento)"
                      title="Eliminar evento"
                      class="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Modal Programar Evento -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="mostrarModalEvento && esAdmin" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/70 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-slate-900 dark:text-white">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 class="text-lg font-bold">Programar Nuevo Evento</h2>
            <button @click="mostrarModalEvento = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="guardarEvento" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Título del Evento</label>
              <input v-model="formEvento.titulo" required type="text" placeholder="Ej. Asamblea General de Vecinos" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Fecha</label>
                <input v-model="formEvento.fecha" required type="date" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Hora</label>
                <input v-model="formEvento.hora" required type="time" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Categoría</label>
              <select v-model="formEvento.categoria" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500">
                <option value="Asamblea">Asamblea / Junta</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Social">Evento Social</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Lugar / Ubicación</label>
              <input v-model="formEvento.lugar" required type="text" placeholder="Ej. Salón Comunal o Jardines" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500" />
            </div>

            <div class="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button type="button" @click="mostrarModalEvento = false" class="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                Cancelar
              </button>
              <button type="submit" :disabled="guardando" class="px-5 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg shadow-purple-600/20 disabled:opacity-50">
                {{ guardando ? 'Guardando...' : 'Programar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const esAdmin = computed(() => authStore.user?.role === 'Administrador')

const cargando = ref(true)
const guardando = ref(false)
const mostrarModalEvento = ref(false)

const resumen = ref({
  total_residentes: 0,
  unidades_ocupadas: 0,
  capacidad_total: 150,
  porcentaje_ocupacion: 0,
  ingresos_mes: 0,
  total_eventos: 0,
  lista_eventos: []
})

const formEvento = ref({
  titulo: '',
  fecha: '',
  hora: '',
  lugar: '',
  categoria: 'Asamblea'
})

const formatearMoneda = (valor) => {
  return new Intl.NumberFormat('es-MX').format(valor || 0)
}

const formatearFechaCompleta = (fechaStr) => {
  if (!fechaStr) return 'Fecha por definir'
  try {
    const limpia = String(fechaStr).split('T')[0]
    const partes = limpia.split('-')
    if (partes.length === 3) {
      const anio = partes[0]
      const mesNum = parseInt(partes, 10) - 1
      const diaNum = parseInt(partes, 10)
      const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ]
      const nombreMes = meses[mesNum] || 'Agosto'
      return `${diaNum} de ${nombreMes}, ${anio}`
    }
    return fechaStr
  } catch (e) {
    return fechaStr
  }
}

const obtenerColorBadge = (categoria) => {
  switch (categoria) {
    case 'Mantenimiento':
      return 'bg-sky-50 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-500/30'
    case 'Social':
      return 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
    case 'Asamblea':
    default:
      return 'bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30'
  }
}

const cargarDashboard = async () => {
  cargando.value = true
  try {
    const res = await api.get('/dashboard/resumen')
    resumen.value = res.data.data
  } catch (err) {
    console.error('Error al cargar dashboard:', err)
  } finally {
    cargando.value = false
  }
}

const guardarEvento = async () => {
  guardando.value = true
  try {
    await api.post('/dashboard/eventos', formEvento.value)
    mostrarModalEvento.value = false
    formEvento.value = { titulo: '', fecha: '', hora: '', lugar: '', categoria: 'Asamblea' }
    await cargarDashboard()
  } catch (err) {
    console.error('Error al programar evento:', err)
  } finally {
    guardando.value = false
  }
}

const eliminarEvento = async (evento) => {
  const id = evento._id || evento.id
  if (confirm(`¿Eliminar el evento "${evento.titulo}"?`)) {
    try {
      await api.delete(`/dashboard/eventos/${id}`)
      await cargarDashboard()
    } catch (err) {
      console.error('Error al eliminar evento:', err)
    }
  }
}

onMounted(() => {
  cargarDashboard()
})
</script>