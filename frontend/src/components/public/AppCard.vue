<template>
  <div class="app-card p-5 flex items-center gap-4 group" @click="openApp">
    <AppLogo :logo-path="app.logo_path" :name="app.name" :size="64" />

    <div class="flex-1 min-w-0">
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0">
          <h2 class="text-lg font-semibold text-zinc-100 truncate">{{ app.name }}</h2>
          <p class="text-sm text-zinc-400 mt-0.5 truncate">{{ app.functionality }}</p>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <a
            v-if="app.github_url"
            :href="app.github_url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-zinc-500 hover:text-zinc-300 transition-colors p-1 rounded"
            title="GitHub repository"
            @click.stop
          >
            <Github :size="18" />
          </a>
          <span class="text-zinc-600 group-hover:text-zinc-400 transition-colors">
            <ArrowUpRight :size="18" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Github, ArrowUpRight } from 'lucide-vue-next';
import AppLogo from './AppLogo.vue';

const props = defineProps({
  app: { type: Object, required: true },
});

function openApp() {
  window.open(props.app.app_url, '_blank', 'noopener,noreferrer');
}
</script>
