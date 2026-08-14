<template>
  <div class="flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-200">
    <Sidebar />

    <div class="flex-1 flex flex-col min-w-0 overflow-y-auto">
      <Navbar />

      <main class="p-6 md:p-8 space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Finanzas y Recibos de Pago</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">Control de cuotas de mantenimiento y comprobantes digitales</p>
          </div>
          <button
            v-if="esAdmin"
            @click="abrirModalEmitir"
            class="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-purple-600/20 transition-all text-sm shrink-0"
          >
            <span>💳</span>
            <span>Emitir Recibo de Cuota</span>
          </button>
        </div>

        <!-- Banner de Información Bancaria para Residentes -->
        <div v-if="!esAdmin && datosBancarios.clabe_interbancaria" class="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 class="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">Datos para Transferencias</h4>
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
              {{ datosBancarios.banco }}: <span class="font-mono text-purple-600 dark:text-purple-400">{{ datosBancarios.clabe_interbancaria }}</span>
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400">Beneficiario: {{ datosBancarios.beneficiario }}</p>
          </div>
          <div class="text-right">
            <span class="text-xs text-slate-500 dark:text-slate-400 block">Día límite de pago:</span>
            <span class="text-sm font-bold text-purple-600 dark:text-purple-300">Día {{ datosBancarios.dia_corte || 10 }} de cada mes</span>
          </div>
        </div>

        <!-- Filtros y Búsqueda -->
        <div class="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          <div class="relative flex-1 max-w-md">
            <svg class="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="busqueda"
              @input="cargarFacturas"
              type="text"
              placeholder="Buscar por folio, concepto o residente..."
              class="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          <!-- Filtro por Estado -->
          <div class="flex items-center gap-2">
            <button
              v-for="est in ['Todos', 'Pagado', 'Pendiente']"
              :key="est"
              @click="cambiarEstadoFiltro(est)"
              :class="filtroEstado === est ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20' : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60'"
              class="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
            >
              {{ est }}
            </button>
          </div>
        </div>

        <!-- Spinner -->
        <div v-if="cargando" class="flex justify-center py-16">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
        </div>

        <!-- Estado Vacío -->
        <div v-else-if="facturas.length === 0" class="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-12 text-center">
          <p class="text-slate-600 dark:text-slate-400 font-medium">No se encontraron recibos o facturas.</p>
        </div>

        <!-- Lista de Facturas / Recibos -->
        <div v-else class="space-y-3">
          <div
            v-for="fac in facturas"
            :key="fac._id || fac.id"
            class="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
          >
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-purple-500/10 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold text-xl shrink-0">
                🧾
              </div>

              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/80 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800/50">
                    {{ fac.folio }}
                  </span>
                  <h3 class="font-bold text-slate-900 dark:text-white text-base">{{ fac.concepto }}</h3>
                  <span
                    :class="fac.estado === 'Pagado' ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30' : 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30'"
                    class="text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider"
                  >
                    {{ fac.estado }}
                  </span>
                </div>

                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {{ fac.nombre_residente }} • <span class="font-semibold">{{ fac.unidad }}</span>
                </p>

                <div class="flex flex-wrap items-center gap-x-4 text-xs text-slate-400 mt-1">
                  <span>Emitido: {{ fac.fecha_emision }}</span>
                  <span>Vence: {{ fac.fecha_vencimiento }}</span>
                  <span v-if="fac.fecha_pago" class="text-emerald-500">Pagado el: {{ fac.fecha_pago }}</span>
                </div>
              </div>
            </div>

            <!-- Monto y Acciones -->
            <div class="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-700/50">
              <div class="text-left md:text-right">
                <span class="text-xs text-slate-400 block">Total a Pagar</span>
                <span class="text-2xl font-black text-slate-900 dark:text-white">${{ formatearMoneda(fac.monto) }}</span>
              </div>

              <div class="flex items-center gap-2">
                <!-- Botón Descargar Recibo Digital -->
                <button
                  @click="descargarRecibo(fac)"
                  title="Descargar Recibo Digital"
                  class="p-2.5 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-purple-600 hover:text-white rounded-xl transition-all flex items-center gap-1 text-xs font-semibold"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span class="hidden sm:inline">Recibo</span>
                </button>

                <!-- Botón Cambiar Estado (Solo Admin) -->
                <button
                  v-if="esAdmin"
                  @click="alternarEstado(fac)"
                  :title="fac.estado === 'Pagado' ? 'Marcar como Pendiente' : 'Marcar como Pagado'"
                  :class="fac.estado === 'Pagado' ? 'text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-950/50' : 'text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-950/50'"
                  class="p-2.5 rounded-xl border border-current transition-colors text-xs font-bold"
                >
                  {{ fac.estado === 'Pagado' ? '✓ Pagado' : 'Marcar Pago' }}
                </button>

                <!-- Eliminar (Solo Admin) -->
                <button
                  v-if="esAdmin"
                  @click="eliminarFactura(fac)"
                  class="p-2.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Modal Emitir Cuota (Solo Admin) -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="mostrarModalEmitir && esAdmin" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/70 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-slate-900 dark:text-white">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 class="text-lg font-bold">Emitir Recibo de Pago</h2>
            <button @click="mostrarModalEmitir = false" class="text-slate-400 hover:text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="guardarFactura" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Seleccionar Residente</label>
              <select v-model="formFac.residente_email" required class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500">
                <option value="" disabled>Selecciona un habitante...</option>
                <option v-for="res in residentesLista" :key="res._id" :value="res.email">
                  {{ res.nombre }} ({{ res.unidad }})
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Concepto</label>
              <input v-model="formFac.concepto" required type="text" placeholder="Ej. Cuota de Mantenimiento - Septiembre" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Monto ($)</label>
                <input v-model="formFac.monto" required type="number" step="0.01" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Fecha de Vencimiento</label>
                <input v-model="formFac.fecha_vencimiento" required type="date" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500" />
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button type="button" @click="mostrarModalEmitir = false" class="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-white">Cancelar</button>
              <button type="submit" :disabled="guardando" class="px-5 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg shadow-purple-600/20 disabled:opacity-50">
                {{ guardando ? 'Emitiendo...' : 'Emitir Recibo' }}
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

const facturas = ref([])
const residentesLista = ref([])
const busqueda = ref('')
const filtroEstado = ref('Todos')
const cargando = ref(true)
const guardando = ref(false)
const mostrarModalEmitir = ref(false)

const datosBancarios = ref({
  banco: '',
  clabe_interbancaria: '',
  beneficiario: '',
  dia_corte: 10
})

const formFac = ref({
  residente_email: '',
  concepto: 'Cuota de Mantenimiento',
  monto: 1500,
  fecha_vencimiento: ''
})

const formatearMoneda = (valor) => {
  return new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2 }).format(valor || 0)
}

const cambiarEstadoFiltro = (est) => {
  filtroEstado.value = est
  cargarFacturas()
}

const cargarFacturas = async () => {
  cargando.value = true
  try {
    const res = await api.get('/facturas', {
      params: { search: busqueda.value, estado: filtroEstado.value }
    })
    facturas.value = res.data.data

    const resConfig = await api.get('/configuracion')
    datosBancarios.value = resConfig.data.data
  } catch (err) {
    console.error('Error al cargar facturas:', err)
  } finally {
    cargando.value = false
  }
}

const abrirModalEmitir = async () => {
  try {
    const res = await api.get('/residentes')
    residentesLista.value = res.data.data
    formFac.value = {
      residente_email: residentesLista.value[0]?.email || '',
      concepto: 'Cuota de Mantenimiento',
      monto: datosBancarios.value.cuota_mantenimiento || 1500,
      fecha_vencimiento: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0]
    }
    mostrarModalEmitir.value = true
  } catch (err) {
    console.error('Error al cargar lista de residentes:', err)
  }
}

const guardarFactura = async () => {
  guardando.value = true
  try {
    await api.post('/facturas', formFac.value)
    mostrarModalEmitir.value = false
    await cargarFacturas()
  } catch (err) {
    console.error('Error al emitir factura:', err)
  } finally {
    guardando.value = false
  }
}

const alternarEstado = async (fac) => {
  const nuevo = fac.estado === 'Pagado' ? 'Pendiente' : 'Pagado'
  try {
    await api.put(`/facturas/${fac._id || fac.id}/estado`, { estado: nuevo })
    await cargarFacturas()
  } catch (err) {
    console.error('Error al cambiar estado:', err)
  }
}

const descargarRecibo = (fac) => {
  alert(`Descargando comprobante oficial digital del Folio: ${fac.folio} por $${formatearMoneda(fac.monto)}`)
}

const eliminarFactura = async (fac) => {
  if (confirm(`¿Eliminar el recibo ${fac.folio}?`)) {
    try {
      await api.delete(`/facturas/${fac._id || fac.id}`)
      await cargarFacturas()
    } catch (err) {
      console.error('Error al eliminar factura:', err)
    }
  }
}

onMounted(() => {
  cargarFacturas()
})
</script>