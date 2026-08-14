<template>
  <aside class="w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/80 flex flex-col shrink-0 h-screen transition-colors duration-200">
    <div class="p-6 flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-lg">
        🏢
      </div>
      <div>
        <h2 class="font-bold text-slate-900 dark:text-white text-base leading-tight">CondoMaster</h2>
        <span class="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950 px-1.5 py-0.5 rounded border border-purple-200 dark:border-purple-800/60">Pro</span>
      </div>
    </div>

    <nav class="flex-1 px-4 space-y-1.5 py-4">
      <RouterLink
        to="/dashboard"
        active-class="bg-purple-600 text-white shadow-lg shadow-purple-600/20"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
      >
        <span>🏠</span>
        <span>Inicio</span>
      </RouterLink>

      <RouterLink
        to="/residentes"
        active-class="bg-purple-600 text-white shadow-lg shadow-purple-600/20"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
      >
        <span>👥</span>
        <span>Residentes</span>
      </RouterLink>

      <RouterLink
        to="/chat"
        active-class="bg-purple-600 text-white shadow-lg shadow-purple-600/20"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
      >
        <span>💬</span>
        <span>Chat</span>
      </RouterLink>

      <RouterLink
        to="/documentos"
        active-class="bg-purple-600 text-white shadow-lg shadow-purple-600/20"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
      >
        <span>📄</span>
        <span>Documentos</span>
      </RouterLink>

      <RouterLink
        to="/configuracion"
        active-class="bg-purple-600 text-white shadow-lg shadow-purple-600/20"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
      >
        <span>⚙️</span>
        <span>Configuración</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>