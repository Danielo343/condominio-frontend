<template>
  <div class="flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-200">
    <Sidebar />

    <div class="flex-1 flex flex-col min-w-0 overflow-y-auto">
      <Navbar />

      <main class="p-6 md:p-8 space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Directorio del Condominio</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">Directorio de habitantes y administración del condominio</p>
          </div>
          <button
            v-if="esAdmin"
            @click="abrirModalCrear"
            class="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-purple-600/20 transition-all duration-200 text-sm"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Agregar Persona</span>
          </button>
        </div>

        <!-- Search Bar -->
        <div class="relative">
          <svg class="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="busqueda"
            @input="obtenerResidentes"
            type="text"
            placeholder="Buscar por nombre, departamento o correo..."
            class="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500"
          />
        </div>

        <!-- Spinner -->
        <div v-if="cargando" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
        </div>

        <!-- Lista de Residentes -->
        <div v-else class="space-y-3">
          <div
            v-for="residente in residentes"
            :key="residente._id || residente.id"
            class="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 hover:border-purple-400 dark:hover:border-slate-600 rounded-2xl p-4 sm:p-5 flex items-center justify-between transition-all shadow-sm"
          >
            <div class="flex items-center gap-4 min-w-0">
              <div class="w-11 h-11 rounded-xl bg-purple-500/10 dark:bg-purple-600/20 text-purple-700 dark:text-purple-400 border border-purple-500/20 dark:border-purple-500/30 flex items-center justify-center font-bold text-sm shrink-0">
                {{ obtenerIniciales(residente.nombre) }}
              </div>

              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="font-semibold text-slate-900 dark:text-slate-100 truncate text-base">{{ residente.nombre }}</h3>
                  <span class="text-xs font-semibold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50">
                    {{ residente.unidad }}
                  </span>
                  <span
                    v-if="residente.rol === 'Administrador'"
                    class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30"
                  >
                    ADMIN
                  </span>
                </div>
                <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span class="truncate">{{ residente.email }}</span>
                  <span class="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                  <span>{{ residente.telefono }}</span>
                </div>
              </div>
            </div>

            <!-- Botones de Acción (Solo Admin) -->
            <div v-if="esAdmin" class="flex items-center gap-2 shrink-0 ml-4">
              <button
                @click="abrirModalEditar(residente)"
                title="Editar"
                class="p-2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="confirmarEliminar(residente)"
                title="Eliminar"
                class="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Modal Form (Crear / Editar) -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="mostrarModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/70 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-slate-900 dark:text-white">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 class="text-lg font-bold">
              {{ modoEdicion ? 'Editar Registro' : 'Registrar Persona' }}
            </h2>
            <button @click="cerrarModal" class="text-slate-400 hover:text-slate-600 dark:hover:text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="guardarResidente" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Nombre Completo</label>
              <input v-model="formulario.nombre" required type="text" placeholder="Ej. Ana Pérez" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Unidad / Depto</label>
                <input v-model="formulario.unidad" required type="text" placeholder="Ej. Depto 204" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Rol en el Sistema</label>
                <select v-model="formulario.rol" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500">
                  <option value="Residente">Residente</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Correo Electrónico</label>
              <input v-model="formulario.email" required type="email" placeholder="usuario@email.com" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500" />
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Teléfono</label>
              <input v-model="formulario.telefono" required type="text" placeholder="3312345678" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500" />
            </div>

            <div v-if="!modoEdicion">
              <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Contraseña Inicial</label>
              <input v-model="formulario.password" required type="text" placeholder="Condo1234" class="w-full bg-slate-50 dark:bg-slate-800 border border-purple-500/50 rounded-xl px-3.5 py-2.5 text-sm text-purple-600 dark:text-purple-300 font-mono focus:outline-none" />
            </div>

            <div class="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button type="button" @click="cerrarModal" class="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">Cancelar</button>
              <button type="submit" :disabled="guardando" class="px-5 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg shadow-purple-600/20 disabled:opacity-50">
                {{ guardando ? 'Guardando...' : 'Guardar' }}
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

const residentes = ref([])
const busqueda = ref('')
const cargando = ref(false)
const guardando = ref(false)

const mostrarModal = ref(false)
const modoEdicion = ref(false)
const idEdicion = ref(null)

const formulario = ref({
  nombre: '',
  unidad: '',
  email: '',
  telefono: '',
  rol: 'Residente',
  password: 'Condo1234'
})

const obtenerIniciales = (nombre) => {
  if (!nombre) return 'R'
  return nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

const obtenerResidentes = async () => {
  cargando.value = true
  try {
    const response = await api.get('/residentes', {
      params: { search: busqueda.value }
    })
    residentes.value = response.data.data
  } catch (error) {
    console.error('Error al cargar residentes:', error)
  } finally {
    cargando.value = false
  }
}

const abrirModalCrear = () => {
  modoEdicion.value = false
  idEdicion.value = null
  formulario.value = { nombre: '', unidad: '', email: '', telefono: '', rol: 'Residente', password: 'Condo1234' }
  mostrarModal.value = true
}

const abrirModalEditar = (residente) => {
  modoEdicion.value = true
  idEdicion.value = residente._id || residente.id
  formulario.value = {
    nombre: residente.nombre,
    unidad: residente.unidad,
    email: residente.email,
    telefono: residente.telefono,
    rol: residente.rol || 'Residente'
  }
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
}

const guardarResidente = async () => {
  guardando.value = true
  try {
    if (modoEdicion.value) {
      await api.put(`/residentes/${idEdicion.value}`, formulario.value)
    } else {
      await api.post('/residentes', formulario.value)
    }
    cerrarModal()
    await obtenerResidentes()
  } catch (error) {
    console.error('Error al guardar:', error)
  } finally {
    guardando.value = false
  }
}

const confirmarEliminar = async (residente) => {
  const id = residente._id || residente.id
  if (confirm(`¿Estás seguro de eliminar a ${residente.nombre}?`)) {
    try {
      await api.delete(`/residentes/${id}`)
      await obtenerResidentes()
    } catch (error) {
      console.error('Error al eliminar:', error)
    }
  }
}

onMounted(() => {
  obtenerResidentes()
})
</script>