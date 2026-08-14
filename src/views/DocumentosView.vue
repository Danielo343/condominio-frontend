<template>
  <div class="flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-200">
    <Sidebar />

    <div class="flex-1 flex flex-col min-w-0 overflow-y-auto">
      <Navbar />

      <main class="p-6 md:p-8 space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Documentos Oficiales</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">Reglamentos, asambleas y estados de cuenta del condominio</p>
          </div>
          <button
            v-if="esAdmin"
            @click="mostrarModalSubir = true"
            class="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-purple-600/20 transition-all text-sm shrink-0"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Subir Documento</span>
          </button>
        </div>

        <!-- Barra de Búsqueda y Filtros -->
        <div class="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <div class="relative flex-1 max-w-md">
            <svg class="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="busqueda"
              @input="cargarDocumentos"
              type="text"
              placeholder="Buscar documentos por nombre o descripción..."
              class="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          <!-- Pestañas de Filtros -->
          <div class="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 text-xs font-semibold">
            <button
              v-for="cat in categorias"
              :key="cat"
              @click="cambiarCategoria(cat)"
              :class="categoriaSeleccionada === cat ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20' : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white border border-slate-200 dark:border-slate-700/60'"
              class="px-3.5 py-2 rounded-xl transition-all whitespace-nowrap"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- Spinner -->
        <div v-if="cargando" class="flex justify-center py-16">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
        </div>

        <!-- Estado Vacío -->
        <div v-else-if="documentos.length === 0" class="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-12 text-center">
          <svg class="w-12 h-12 text-slate-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-slate-700 dark:text-slate-300 font-medium">No se encontraron documentos</p>
          <p class="text-xs text-slate-400 mt-1">No hay archivos registrados en esta categoría.</p>
        </div>

        <!-- Grid de Tarjetas de Documentos -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="doc in documentos"
            :key="doc._id || doc.id"
            class="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-purple-400 dark:hover:border-slate-600 rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all group"
          >
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="w-11 h-11 rounded-xl bg-purple-500/10 dark:bg-purple-600/20 text-purple-700 dark:text-purple-400 border border-purple-500/20 dark:border-purple-500/30 flex items-center justify-center font-bold text-lg">
                  📄
                </div>
                <span :class="obtenerColorBadge(doc.categoria)" class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border">
                  {{ doc.categoria }}
                </span>
              </div>

              <div>
                <h3 class="font-bold text-slate-900 dark:text-slate-100 text-base leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">{{ doc.titulo }}</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">{{ doc.descripcion }}</p>
              </div>
            </div>

            <div class="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
              <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
                {{ doc.tamanio_archivo }} • {{ (doc.extension || 'PDF').toUpperCase() }}
              </span>

              <div class="flex items-center gap-1">
                <button
                  @click="descargarArchivo(doc)"
                  title="Descargar documento"
                  class="p-2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>

                <button
                  v-if="esAdmin"
                  @click="eliminarDocumento(doc)"
                  title="Eliminar documento"
                  class="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Modal Subir Documento (Solo Admin) -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="mostrarModalSubir && esAdmin" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/70 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-slate-900 dark:text-white">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 class="text-lg font-bold">Subir Nuevo Documento</h2>
            <button @click="mostrarModalSubir = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="guardarDocumento" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Título del Documento</label>
              <input v-model="formDoc.titulo" required type="text" placeholder="Ej. Reglamento de Áreas Comunes" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500" />
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Categoría</label>
              <select v-model="formDoc.categoria" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500">
                <option value="Reglamento">Reglamento</option>
                <option value="Asamblea">Asamblea</option>
                <option value="Finanzas">Finanzas</option>
                <option value="Mantenimiento">Mantenimiento</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Descripción</label>
              <textarea v-model="formDoc.descripcion" rows="2" placeholder="Resumen o notas sobre este archivo..." class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"></textarea>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Seleccionar Archivo (PDF, DOCX, JPG)</label>
              <input @change="manejarArchivo" type="file" accept=".pdf,.doc,.docx,.png,.jpg" class="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-600/10 file:text-purple-700 dark:file:bg-purple-600/20 dark:file:text-purple-300 hover:file:bg-purple-600/30 file:cursor-pointer" />
            </div>

            <div class="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button type="button" @click="mostrarModalSubir = false" class="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">Cancelar</button>
              <button type="submit" :disabled="guardando" class="px-5 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg shadow-purple-600/20 disabled:opacity-50">
                {{ guardando ? 'Subiendo...' : 'Guardar Documento' }}
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

const documentos = ref([])
const busqueda = ref('')
const cargando = ref(true)
const guardando = ref(false)
const mostrarModalSubir = ref(false)
const archivoSeleccionado = ref(null)

const categorias = ['Todos', 'Reglamento', 'Asamblea', 'Finanzas', 'Mantenimiento']
const categoriaSeleccionada = ref('Todos')

const formDoc = ref({
  titulo: '',
  descripcion: '',
  categoria: 'Reglamento'
})

const cambiarCategoria = (cat) => {
  categoriaSeleccionada.value = cat
  cargarDocumentos()
}

const manejarArchivo = (event) => {
  archivoSeleccionado.value = event.target.files[0] || null
}

const obtenerColorBadge = (categoria) => {
  switch (categoria) {
    case 'Reglamento':
      return 'bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30'
    case 'Asamblea':
      return 'bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30'
    case 'Finanzas':
      return 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
    case 'Mantenimiento':
      return 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30'
    default:
      return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
  }
}

const cargarDocumentos = async () => {
  cargando.value = true
  try {
    const res = await api.get('/documentos', {
      params: {
        search: busqueda.value,
        categoria: categoriaSeleccionada.value
      }
    })
    documentos.value = res.data.data
  } catch (err) {
    console.error('Error al cargar documentos:', err)
  } finally {
    cargando.value = false
  }
}

const guardarDocumento = async () => {
  guardando.value = true
  try {
    const formData = new FormData()
    formData.append('titulo', formDoc.value.titulo)
    formData.append('descripcion', formDoc.value.descripcion)
    formData.append('categoria', formDoc.value.categoria)
    if (archivoSeleccionado.value) {
      formData.append('archivo', archivoSeleccionado.value)
    }

    await api.post('/documentos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    mostrarModalSubir.value = false
    formDoc.value = { titulo: '', descripcion: '', categoria: 'Reglamento' }
    archivoSeleccionado.value = null
    await cargarDocumentos()
  } catch (err) {
    console.error('Error al guardar documento:', err)
  } finally {
    guardando.value = false
  }
}

const descargarArchivo = (doc) => {
  alert(`Descargando el archivo: ${doc.nombre_archivo}`)
}

const eliminarDocumento = async (doc) => {
  const id = doc._id || doc.id
  if (confirm(`¿Estás seguro de eliminar el documento "${doc.titulo}"?`)) {
    try {
      await api.delete(`/documentos/${id}`)
      await cargarDocumentos()
    } catch (err) {
      console.error('Error al eliminar documento:', err)
    }
  }
}

onMounted(() => {
  cargarDocumentos()
})
</script>