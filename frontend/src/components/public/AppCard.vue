<template>
  <div class="app-card p-2 flex items-center gap-4 group" @click="openApp">
    <AppLogo :logo-path="app.logo_path" :name="app.name" :size="36" />

    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-baseline justify-between gap-4 flex-1 min-w-0">
          <h2 class="text-base font-semibold text-zinc-100 flex-shrink-0">{{ app.name }}</h2>
          <p class="text-sm text-zinc-400">{{ app.functionality }}</p>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <div v-if="app.tags?.length" class="flex items-center gap-1">
            <span v-for="tag in app.tags" :key="tag" class="tag-chip">{{ tag }}</span>
          </div>
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

<style scoped>
.tag-chip {
  padding: 0.1rem 0.45rem;
  border-radius: 20px;
  font-size: 0.6875rem;
  font-weight: 500;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: rgb(148 153 255);
  white-space: nowrap;
}
</style>
