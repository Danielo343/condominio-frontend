<template>
  <div class="flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-200">
    <Sidebar />

    <div class="flex-1 flex flex-col min-w-0 overflow-y-auto">
      <Navbar />

      <main class="p-6 md:p-8 space-y-6 max-w-5xl">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Configuración</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">Parámetros operativos del condominio y seguridad de cuenta</p>
        </div>

        <!-- Pestañas -->
        <div class="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-medium">
          <button
            v-if="esAdmin"
            @click="tabActiva = 'condominio'"
            :class="tabActiva === 'condominio' ? 'border-purple-500 text-purple-600 dark:text-purple-400 border-b-2 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            class="pb-3 transition-colors"
          >
            Condominio
          </button>
          <button
            @click="tabActiva = 'perfil'"
            :class="tabActiva === 'perfil' ? 'border-purple-500 text-purple-600 dark:text-purple-400 border-b-2 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            class="pb-3 transition-colors"
          >
            Mi Perfil
          </button>
          <button
            @click="tabActiva = 'seguridad'"
            :class="tabActiva === 'seguridad' ? 'border-purple-500 text-purple-600 dark:text-purple-400 border-b-2 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            class="pb-3 transition-colors"
          >
            Seguridad & Sesiones
          </button>
        </div>

        <!-- Alertas -->
        <div v-if="mensaje" :class="esError ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400' : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400'" class="p-4 rounded-xl border text-sm font-medium">
          {{ mensaje }}
        </div>

        <!-- TAB 1: CONDOMINIO (SOLO ADMIN) -->
        <div v-if="tabActiva === 'condominio' && esAdmin" class="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 space-y-6 shadow-sm">
          <div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Información y Capacidad del Condominio</h2>
            <p class="text-xs text-slate-400">Define los parámetros que utilizará el panel de control y facturación.</p>
          </div>

          <form @submit.prevent="guardarCondominio" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Nombre del Condominio</label>
                <input v-model="formCondominio.nombre_condominio" required type="text" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Dirección</label>
                <input v-model="formCondominio.direccion" required type="text" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Capacidad Total de Unidades (Plazas)</label>
                <input v-model="formCondominio.capacidad_total" required type="number" min="1" max="1000" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Cuota de Mantenimiento ($)</label>
                <input v-model="formCondominio.cuota_mantenimiento" required type="number" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Día Límite de Pago Mensual</label>
                <input v-model="formCondominio.dia_corte" required type="number" min="1" max="31" placeholder="Ej. 10" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Teléfono del Administrador</label>
                <input v-model="formCondominio.telefono" required type="text" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100" />
              </div>
            </div>

            <!-- Datos Bancarios -->
            <div class="pt-4 border-t border-slate-200 dark:border-slate-700/60 space-y-3">
              <h3 class="text-sm font-bold text-slate-800 dark:text-slate-200">Datos Bancarios para Recibir Pagos</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Banco</label>
                  <input v-model="formCondominio.banco" placeholder="BBVA" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100" />
                </div>
                <div>
                  <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">CLABE Interbancaria</label>
                  <input v-model="formCondominio.clabe_interbancaria" placeholder="18 dígitos" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono" />
                </div>
                <div>
                  <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Beneficiario</label>
                  <input v-model="formCondominio.beneficiario" placeholder="Condominio Los Pinos AC" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100" />
                </div>
              </div>
            </div>

            <div class="pt-3">
              <button type="submit" :disabled="guardando" class="bg-purple-600 hover:bg-purple-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-purple-600/20 transition-all">
                {{ guardando ? 'Guardando...' : 'Guardar Parámetros' }}
              </button>
            </div>
          </form>
        </div>

        <!-- TAB 2: MI PERFIL -->
        <div v-if="tabActiva === 'perfil'" class="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Información Personal</h2>
          <form @submit.prevent="guardarPerfil" class="space-y-4 max-w-md">
            <div>
              <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Nombre Completo</label>
              <input v-model="formPerfil.name" required type="text" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100" />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Correo Electrónico</label>
              <input v-model="formPerfil.email" required type="email" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100" />
            </div>
            <button type="submit" :disabled="guardando" class="bg-purple-600 hover:bg-purple-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-purple-600/20 transition-all">
              {{ guardando ? 'Guardando...' : 'Actualizar Mi Perfil' }}
            </button>
          </form>
        </div>

        <!-- TAB 3: SEGURIDAD -->
        <div v-if="tabActiva === 'seguridad'" class="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">Cambio de Contraseña</h2>
          <p class="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-3 rounded-xl">
            ⚠️ Al cambiar tu contraseña se cerrará la sesión en todos los demás dispositivos.
          </p>

          <form @submit.prevent="cambiarPassword" class="space-y-4 max-w-md">
            <div>
              <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Contraseña Actual</label>
              <input v-model="formSeguridad.current_password" required type="password" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100" />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Nueva Contraseña</label>
              <input v-model="formSeguridad.new_password" required type="password" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100" />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Confirmar Nueva Contraseña</label>
              <input v-model="formSeguridad.new_password_confirmation" required type="password" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100" />
            </div>
            <button type="submit" :disabled="guardando" class="bg-purple-600 hover:bg-purple-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-purple-600/20 transition-all">
              {{ guardando ? 'Actualizando...' : 'Cambiar Contraseña' }}
            </button>
          </form>
        </div>
      </main>
    </div>
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

const tabActiva = ref(authStore.user?.role === 'Administrador' ? 'condominio' : 'perfil')
const guardando = ref(false)
const mensaje = ref('')
const esError = ref(false)

const formCondominio = ref({
  nombre_condominio: '',
  direccion: '',
  administrador: '',
  telefono: '',
  cuota_mantenimiento: 1500,
  capacidad_total: 50,
  dia_corte: 10,
  banco: 'BBVA',
  clabe_interbancaria: '',
  beneficiario: '',
  moneda: 'MXN'
})

const formPerfil = ref({ name: '', email: '' })
const formSeguridad = ref({ current_password: '', new_password: '', new_password_confirmation: '' })

const cargarDatos = async () => {
  try {
    const resConfig = await api.get('/configuracion')
    formCondominio.value = resConfig.data.data

    const resUser = await api.get('/user')
    formPerfil.value = { name: resUser.data.user.name, email: resUser.data.user.email }
  } catch (err) {
    console.error('Error al cargar datos:', err)
  }
}

const guardarCondominio = async () => {
  guardando.value = true
  mensaje.value = ''
  try {
    const res = await api.post('/configuracion', formCondominio.value)
    esError.value = false
    mensaje.value = res.data.message
  } catch (err) {
    esError.value = true
    mensaje.value = 'Error al guardar la configuración.'
  } finally {
    guardando.value = false
  }
}

const guardarPerfil = async () => {
  guardando.value = true
  mensaje.value = ''
  try {
    const res = await api.put('/perfil', formPerfil.value)
    esError.value = false
    mensaje.value = res.data.message
  } catch (err) {
    esError.value = true
    mensaje.value = 'Error al actualizar el perfil.'
  } finally {
    guardando.value = false
  }
}

const cambiarPassword = async () => {
  guardando.value = true
  mensaje.value = ''
  try {
    const res = await api.post('/cambiar-clave', {
      current_password: formSeguridad.value.current_password,
      new_password: formSeguridad.value.new_password,
      new_password_confirmation: formSeguridad.value.new_password_confirmation
    })
    esError.value = false
    mensaje.value = res.data.message
    formSeguridad.value = { current_password: '', new_password: '', new_password_confirmation: '' }
  } catch (err) {
    esError.value = true
    mensaje.value = err.response?.data?.message || 'Error al cambiar la contraseña.'
  } finally {
    guardando.value = false
  }
}

onMounted(() => {
  cargarDatos()
})
</script>