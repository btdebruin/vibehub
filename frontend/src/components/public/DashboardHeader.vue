<template>
  <header class="header">
    <div class="header-inner">
      <div class="header-brand">
        <img src="/hermes-logo.png" alt="Hermes" class="logo-mark" />
        <span class="text-zinc-100 font-semibold text-lg tracking-tight">Hermes</span>
      </div>

      <div class="header-tabs">
        <SegmentedControl :items="tabItems" v-model="tabStore.activeTab" />
      </div>

      <div class="header-actions">
        <SearchTrigger />
        <button
          class="admin-toggle"
          :title="viewModeStore.mode === 'grid' ? 'Switch to list view' : 'Switch to grid view'"
          :aria-label="viewModeStore.mode === 'grid' ? 'Switch to list view' : 'Switch to grid view'"
          @click="viewModeStore.toggle()"
        >
          <List v-if="viewModeStore.mode === 'grid'" :size="18" />
          <LayoutGrid v-else :size="18" />
        </button>
        <RouterLink to="/admin" class="admin-toggle" title="Admin">
          <Settings :size="18" />
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { Settings, List, LayoutGrid } from 'lucide-vue-next';
import SearchTrigger from './SearchTrigger.vue';
import SegmentedControl from './SegmentedControl.vue';
import { useTabStore } from '../../stores/tab.js';
import { useAppsStore } from '../../stores/apps.js';
import { useViewModeStore } from '../../stores/viewMode.js';

const tabStore = useTabStore();
const appsStore = useAppsStore();
const viewModeStore = useViewModeStore();

const TABS = [
  { label: 'Internal', value: 'internal' },
  { label: '9to5', value: '9to5' },
  { label: 'External', value: 'external' },
];

const tabItems = computed(() =>
  TABS.map((t) => ({
    ...t,
    count: appsStore.visibleApps.filter((a) => a.app_group === t.value).length,
  }))
);
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(12px);
  background: rgba(10, 10, 15, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

/* Mobile: wrap brand+actions on first row, tabs full-width below */
.header-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0.75rem 1rem 0.75rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.625rem;
}

.header-brand {
  order: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-actions {
  order: 2;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: auto;
}

.header-tabs {
  order: 3;
  width: 100%;
}

.header-tabs :deep(.segmented) {
  width: 100%;
}

.header-tabs :deep(.seg-btn) {
  flex: 1;
  text-align: center;
}

/* Desktop: single row with tabs centred */
@media (min-width: 640px) {
  .header-inner {
    flex-wrap: nowrap;
    padding: 0.875rem 1.5rem;
    gap: 0;
    justify-content: space-between;
  }

  .header-tabs {
    order: 2;
    width: auto;
  }

  .header-actions {
    order: 3;
    margin-left: 0;
  }

  .header-tabs :deep(.segmented) {
    width: auto;
  }

  .header-tabs :deep(.seg-btn) {
    flex: 0;
  }
}

.admin-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(113 113 122);
  transition: color 0.15s;
  padding: 0.375rem;
  border-radius: 6px;
  background: none;
  border: none;
  cursor: pointer;
}

.admin-toggle:hover {
  color: rgb(212 212 216);
}

.logo-mark {
  width: 30px;
  height: 30px;
  border-radius: 7px;
  object-fit: cover;
  flex-shrink: 0;
}
</style>
