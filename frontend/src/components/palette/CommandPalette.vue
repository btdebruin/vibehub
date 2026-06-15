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
            :active-descendant="results.length ? `palette-option-${store.selectedIndex}` : null"
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
import { useCommandPaletteStore } from '../../stores/commandPalette.js';
import { useAppsStore } from '../../stores/apps.js';
import { useFuzzySearch } from '../../composables/useFuzzySearch.js';
import PaletteInput from './PaletteInput.vue';
import PaletteResults from './PaletteResults.vue';
import PaletteFooter from './PaletteFooter.vue';

const store = useCommandPaletteStore();
const appsStore = useAppsStore();
const listRef = ref(null);

const { results } = useFuzzySearch(
  computed(() => appsStore.visibleApps),
  computed(() => store.query),
);

watch(
  () => store.isOpen,
  async (open) => {
    if (open && !appsStore.apps.length) {
      await appsStore.fetchApps();
    }
  },
);

// keep selection valid when results shrink (e.g. while typing)
watch(results, (list) => {
  if (store.selectedIndex >= list.length) store.selectedIndex = 0;
});

function handleKeyDown(e) {
  const count = results.value.length;
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (count) store.selectedIndex = (store.selectedIndex + 1) % count;
    scrollToSelected();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (count) store.selectedIndex = (store.selectedIndex - 1 + count) % count;
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
  padding: max(0.75rem, env(safe-area-inset-top, 0.75rem)) 0.75rem 0.75rem;
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
  max-height: 80dvh;
}

@media (min-width: 640px) {
  .palette-overlay {
    padding: 15vh 1rem 1rem;
  }

  .palette-modal {
    max-height: 60vh;
  }
}

.palette-body {
  overflow-y: auto;
  flex: 1;
}
</style>
