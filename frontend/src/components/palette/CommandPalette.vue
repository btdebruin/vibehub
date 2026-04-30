<template>
  <Teleport to="body">
    <Transition name="palette">
      <div
        v-if="store.isOpen"
        class="palette-overlay"
        @click.self="store.close()"
      >
        <div class="palette-modal" @keydown="handleKeyDown">
          <PaletteInput
            :model-value="store.query"
            @update:model-value="store.query = $event; store.selectedIndex = 0"
          />

          <div class="palette-body" ref="listRef">
            <PaletteResults
              :results="results"
              :selected-index="store.selectedIndex"
              @select="openApp"
              @hover="store.selectedIndex = $event"
            />
          </div>

          <PaletteFooter />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue';
import Fuse from 'fuse.js';
import { useCommandPaletteStore } from '../../stores/commandPalette.js';
import { useAppsStore } from '../../stores/apps.js';
import PaletteInput from './PaletteInput.vue';
import PaletteResults from './PaletteResults.vue';
import PaletteFooter from './PaletteFooter.vue';

const store = useCommandPaletteStore();
const appsStore = useAppsStore();
const listRef = ref(null);

const fuse = computed(
  () =>
    new Fuse(appsStore.apps, {
      keys: [
        { name: 'name', weight: 2 },
        { name: 'functionality', weight: 1 },
      ],
      threshold: 0.4,
      includeScore: true,
    }),
);

const results = computed(() => {
  if (!store.query.trim()) return appsStore.apps;
  return fuse.value.search(store.query).map((r) => r.item);
});

watch(
  () => store.isOpen,
  async (open) => {
    if (open && !appsStore.apps.length) {
      await appsStore.fetchApps();
    }
  },
);

function handleKeyDown(e) {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    store.selectedIndex = Math.min(store.selectedIndex + 1, results.value.length - 1);
    scrollToSelected();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    store.selectedIndex = Math.max(store.selectedIndex - 1, 0);
    scrollToSelected();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const app = results.value[store.selectedIndex];
    if (app) openApp(app);
  } else if (e.key === 'Escape') {
    store.close();
  }
}

function openApp(app) {
  window.open(app.app_url, '_blank', 'noopener,noreferrer');
  store.close();
}

async function scrollToSelected() {
  await nextTick();
  const el = listRef.value?.querySelector(`[data-index="${store.selectedIndex}"]`);
  el?.scrollIntoView({ block: 'nearest' });
}
</script>

<style scoped>
.palette-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
  padding-left: 1rem;
  padding-right: 1rem;
}

.palette-modal {
  width: 100%;
  max-width: 560px;
  background: #141418;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(99, 102, 241, 0.1),
    0 24px 64px rgba(0, 0, 0, 0.6),
    0 8px 24px rgba(99, 102, 241, 0.1);
  display: flex;
  flex-direction: column;
  max-height: 60vh;
}

.palette-body {
  overflow-y: auto;
  flex: 1;
}
</style>
