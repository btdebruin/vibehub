<template>
  <div class="flex flex-col items-center justify-center py-24 text-center">
    <div class="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
      <LayoutGrid :size="28" class="text-zinc-600" />
    </div>
    <h3 class="text-zinc-300 font-semibold text-lg mb-2">No apps yet</h3>
    <p class="text-zinc-500 text-sm max-w-xs">
      Go to
      <RouterLink to="/admin" class="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">/admin</RouterLink>
      to add your first app.
    </p>
  </div>
</template>

<script setup>
import { LayoutGrid } from 'lucide-vue-next';
</script>
