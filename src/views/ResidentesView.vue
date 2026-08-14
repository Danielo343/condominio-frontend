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
                  <span class="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50">
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
                  <span>{{ formatearTelefono(residente.telefono) }}</span>
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

    <!-- Modal Form Estandarizado -->
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

          <div v-if="errorFormulario" class="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold">
            {{ errorFormulario }}
          </div>

          <form @submit.prevent="guardarResidente" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Nombre y Apellido</label>
              <input v-model="formulario.nombre" required type="text" placeholder="Ej. Ana Pérez García" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500" />
            </div>

            <!-- Sección de Departamento Estandarizada -->
            <div class="space-y-1.5 p-3.5 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 rounded-2xl">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold uppercase text-purple-700 dark:text-purple-300 mb-1">Torre / Edificio</label>
                  <select v-model="formulario.torre" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500">
                    <option value="Torre A">Torre A</option>
                    <option value="Torre B">Torre B</option>
                    <option value="Torre C">Torre C</option>
                    <option value="Torre D">Torre D</option>
                    <option value="Sector Casas">Sector Casas</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase text-purple-700 dark:text-purple-300 mb-1">Número de Depto</label>
                  <input
                    v-model="formulario.numeroDepto"
                    @input="sanitizarDepto"
                    maxlength="4"
                    required
                    type="text"
                    placeholder="101"
                    class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
              <p class="text-[11px] text-purple-700 dark:text-purple-300 font-semibold pt-1">
                📌 Identificador final: <span class="underline font-bold">{{ formulario.torre }} - Depto {{ formulario.numeroDepto || '___' }}</span>
              </p>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Rol</label>
                <select v-model="formulario.rol" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500">
                  <option value="Residente">Residente</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Teléfono (10 Dígitos)</label>
                <input
                  v-model="formulario.telefono"
                  @input="sanitizarTelefono"
                  maxlength="10"
                  required
                  type="tel"
                  placeholder="3312345678"
                  class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Correo Electrónico</label>
              <input v-model="formulario.email" required type="email" placeholder="usuario@email.com" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500" />
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
const errorFormulario = ref('')

const mostrarModal = ref(false)
const modoEdicion = ref(false)
const idEdicion = ref(null)

const formulario = ref({
  nombre: '',
  torre: 'Torre A',
  numeroDepto: '',
  unidad: '',
  email: '',
  telefono: '',
  rol: 'Residente',
  password: 'Condo1234'
})

const sanitizarTelefono = (e) => {
  formulario.value.telefono = e.target.value.replace(/\D/g, '').slice(0, 10)
}

const sanitizarDepto = (e) => {
  formulario.value.numeroDepto = e.target.value.replace(/\D/g, '').slice(0, 4)
}

const formatearTelefono = (tel) => {
  if (!tel || tel.length !== 10) return tel || 'Sin teléfono'
  return `${tel.slice(0, 3)}-${tel.slice(3, 6)}-${tel.slice(6)}`
}

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
  errorFormulario.value = ''
  formulario.value = {
    nombre: '',
    torre: 'Torre A',
    numeroDepto: '',
    unidad: '',
    email: '',
    telefono: '',
    rol: 'Residente',
    password: 'Condo1234'
  }
  mostrarModal.value = true
}

const abrirModalEditar = (residente) => {
  modoEdicion.value = true
  idEdicion.value = residente._id || residente.id
  errorFormulario.value = ''

  // Desglosar la unidad existente (ej. "Torre B - Depto 204")
  let torreDetectada = 'Torre A'
  let numeroDetectado = ''

  if (residente.unidad && residente.unidad.includes(' - ')) {
    const partes = residente.unidad.split(' - ')
    torreDetectada = partes[0]
    numeroDetectado = partes.replace(/\D/g, '')
  } else if (residente.unidad) {
    numeroDetectado = residente.unidad.replace(/\D/g, '')
  }

  formulario.value = {
    nombre: residente.nombre,
    torre: torreDetectada,
    numeroDepto: numeroDetectado,
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
  errorFormulario.value = ''

  const palabras = formulario.value.nombre.trim().split(/\s+/)
  if (palabras.length < 2) {
    errorFormulario.value = 'Debes ingresar al menos un nombre y un apellido.'
    return
  }

  if (!formulario.value.numeroDepto || formulario.value.numeroDepto.length < 2) {
    errorFormulario.value = 'Ingresa un número de departamento válido (ej. 101, 204).'
    return
  }

  if (formulario.value.telefono.length !== 10) {
    errorFormulario.value = 'El número de teléfono debe tener exactamente 10 dígitos.'
    return
  }

  // Generar la unidad estandarizada
  formulario.value.unidad = `${formulario.value.torre} - Depto ${formulario.value.numeroDepto}`

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
    errorFormulario.value = error.response?.data?.message || 'Error al guardar.'
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