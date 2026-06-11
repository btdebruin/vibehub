<template>
  <div
    class="grid-item group"
    role="link"
    tabindex="0"
    :aria-label="`Open ${app.name}`"
    :style="{ '--accent': accent }"
    @click="openApp"
    @keydown.enter="openApp"
    @keydown.space.prevent="openApp"
  >
    <div class="icon-wrap">
      <AppLogo :logo-path="app.logo_path" :name="app.name" :size="72" />
      <span
        v-if="status"
        class="status-dot"
        :class="status"
        :title="status === 'up' ? 'Online' : 'Unreachable'"
      />
    </div>

    <span class="item-name">{{ app.name }}</span>
    <span v-if="app.port" class="item-port">:{{ app.port }}</span>

    <div class="item-actions">
      <a
        v-if="app.github_url"
        :href="app.github_url"
        target="_blank"
        rel="noopener noreferrer"
        class="item-action"
        title="GitHub repository"
        @click.stop
      >
        <Github :size="14" />
      </a>
      <button class="item-action" title="Notes" @click.stop="openNotes">
        <NotebookPen :size="14" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Github, NotebookPen } from 'lucide-vue-next';
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
.grid-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
  padding: 1.25rem 0.75rem 1rem;
  border-radius: var(--radius-lg);
  border: 1px solid transparent;
  cursor: pointer;
  transition: background 200ms ease-out, border-color 200ms ease-out, transform 200ms ease-out;
  text-align: center;
}

.grid-item:hover {
  background: linear-gradient(135deg, rgb(var(--accent) / 0.12), rgb(var(--accent) / 0.04));
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.icon-wrap {
  position: relative;
  filter: drop-shadow(0 6px 16px rgb(var(--accent) / 0.25));
  transition: transform 200ms ease-out;
}

.grid-item:hover .icon-wrap {
  transform: scale(1.06);
}

.icon-wrap :deep(.logo-container),
.icon-wrap :deep(.logo-img),
.icon-wrap :deep(.logo-fallback) {
  border-radius: var(--radius-lg);
}

.status-dot {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #0A0A0F;
}

.status-dot.up {
  background: rgb(52 211 153);
  box-shadow: 0 0 6px rgba(52, 211, 153, 0.6);
}

.status-dot.down {
  background: rgb(113 113 122);
}

.item-name {
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgb(228 228 231);
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-port {
  font-size: 0.6875rem;
  color: rgb(113 113 122);
  font-variant-numeric: tabular-nums;
  margin-top: -0.4rem;
}

.item-actions {
  position: absolute;
  top: 0.375rem;
  right: 0.375rem;
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 150ms ease-out;
}

.grid-item:hover .item-actions,
.grid-item:focus-within .item-actions {
  opacity: 1;
}

.item-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: var(--radius-sm);
  background: rgba(10, 10, 15, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgb(161 161 170);
  cursor: pointer;
  transition: color 150ms ease-out, background 150ms ease-out;
}

.item-action:hover {
  color: rgb(244 244 245);
  background: rgba(255, 255, 255, 0.12);
}

/* touch devices have no hover — keep actions visible */
@media (hover: none) {
  .item-actions {
    opacity: 1;
  }

  .item-action {
    width: 34px;
    height: 34px;
  }
}
</style>
