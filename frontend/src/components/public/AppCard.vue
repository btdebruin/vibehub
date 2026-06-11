<template>
  <div
    class="app-card p-3 sm:p-4 flex items-center gap-4 group"
    role="link"
    tabindex="0"
    :aria-label="`Open ${app.name}`"
    :style="{ '--accent': accent }"
    @click="openApp"
    @keydown.enter="openApp"
    @keydown.space.prevent="openApp"
  >
    <AppLogo :logo-path="app.logo_path" :name="app.name" :size="40" />

    <div class="flex-1 min-w-0">
      <div class="flex items-start sm:items-center justify-between gap-2">
        <div class="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
          <h2 class="text-base font-semibold text-zinc-100 flex-shrink-0 flex items-center gap-1.5">
            <span
              v-if="status"
              class="status-dot"
              :class="status"
              :title="status === 'up' ? 'Online' : 'Unreachable'"
            />
            {{ app.name }}
          </h2>
          <p class="text-sm text-zinc-400 truncate">{{ app.functionality }}</p>
          <div v-if="app.port || app.tags?.length" class="flex sm:hidden flex-wrap items-center gap-1 mt-1">
            <span v-if="app.port" class="port-chip">:{{ app.port }}</span>
            <span v-for="tag in app.tags" :key="tag" class="tag-chip">{{ tag }}</span>
          </div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0 self-center">
          <div class="hidden sm:flex items-center gap-1">
            <span v-if="app.port" class="port-chip">:{{ app.port }}</span>
            <span v-for="tag in app.tags" :key="tag" class="tag-chip">{{ tag }}</span>
          </div>
          <a
            v-if="app.github_url"
            :href="app.github_url"
            target="_blank"
            rel="noopener noreferrer"
            class="card-action text-zinc-500 hover:text-zinc-300 transition-colors rounded"
            title="GitHub repository"
            @click.stop
          >
            <Github :size="18" />
          </a>
          <button
            class="card-action text-zinc-500 hover:text-zinc-300 transition-colors rounded"
            title="Notes"
            @click.stop="openNotes"
          >
            <NotebookPen :size="18" />
          </button>
          <span class="text-zinc-600 group-hover:text-zinc-400 transition-colors">
            <ArrowUpRight :size="18" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Github, ArrowUpRight, NotebookPen } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import AppLogo from './AppLogo.vue';
import { accentFor } from '../../utils/gradient.js';
import { useStatusStore } from '../../stores/status.js';

const router = useRouter();
const statusStore = useStatusStore();

const props = defineProps({
  app: { type: Object, required: true },
});

const accent = computed(() => accentFor(props.app.name));
const status = computed(() => statusStore.statusFor(props.app.id));

function openApp() {
  window.open(props.app.app_url, '_blank', 'noopener,noreferrer');
}

function openNotes() {
  router.push(`/apps/${props.app.id}/notes`);
}
</script>

<style scoped>
.card-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  min-height: 40px;
}

@media (min-width: 640px) {
  .card-action {
    min-width: unset;
    min-height: unset;
    padding: 0.25rem;
  }
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot.up {
  background: rgb(52 211 153);
  box-shadow: 0 0 6px rgba(52, 211, 153, 0.6);
}

.status-dot.down {
  background: rgb(113 113 122);
}

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

.port-chip {
  padding: 0.1rem 0.45rem;
  border-radius: 20px;
  font-size: 0.6875rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgb(113 113 122);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
</style>
