<template>
  <div class="min-h-screen">
    <DashboardHeader />

    <main class="dashboard-main" :class="{ 'is-grid': isGrid }">
      <TagFilter v-model="activeTags" :tags="availableTags" class="full-row" />

      <div class="sort-bar full-row">
        <span class="sort-label">Sort</span>
        <SegmentedControl v-model="sortStore.mode" :items="sortOptions" />
      </div>

      <template v-if="appsStore.loading">
        <div
          v-for="i in (isGrid ? 8 : 4)"
          :key="i"
          :class="isGrid ? 'skeleton-tile' : 'skeleton-card'"
        />
      </template>
      <ErrorBanner
        v-else-if="appsStore.error"
        class="full-row"
        :message="`Could not load apps: ${appsStore.error}`"
        @retry="appsStore.fetchApps()"
      />
      <EmptyState
        v-else-if="!visibleApps.length"
        class="full-row"
        :variant="emptyVariant"
        @clear-filter="activeTags = []"
      />
      <template v-else-if="isGrid">
        <AppGridItem v-for="app in visibleApps" :key="app.id" :app="app" />
      </template>
      <template v-else>
        <AppCard v-for="app in visibleApps" :key="app.id" :app="app" />
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import DashboardHeader from '../components/public/DashboardHeader.vue';
import AppCard from '../components/public/AppCard.vue';
import AppGridItem from '../components/public/AppGridItem.vue';
import EmptyState from '../components/public/EmptyState.vue';
import ErrorBanner from '../components/shared/ErrorBanner.vue';
import TagFilter from '../components/public/TagFilter.vue';
import SegmentedControl from '../components/public/SegmentedControl.vue';
import { useAppsStore } from '../stores/apps.js';
import { useTabStore } from '../stores/tab.js';
import { useStatusStore } from '../stores/status.js';
import { useViewModeStore } from '../stores/viewMode.js';
import { useSortStore } from '../stores/sort.js';

const appsStore = useAppsStore();
const tabStore = useTabStore();
const statusStore = useStatusStore();
const viewModeStore = useViewModeStore();
const sortStore = useSortStore();

const sortOptions = [
  { label: 'Alphabetical', value: 'name' },
  { label: 'Port', value: 'port' },
];

const isGrid = computed(() => viewModeStore.mode === 'grid');

const activeTags = ref([]);

// clear tag filter when switching tabs
watch(() => tabStore.activeTab, () => { activeTags.value = []; });

const tabApps = computed(() =>
  appsStore.visibleApps.filter((a) => a.app_group === tabStore.activeTab)
);

const availableTags = computed(() => {
  const all = new Set();
  tabApps.value.forEach((a) => (a.tags || []).forEach((t) => all.add(t)));
  return [...all].sort();
});

const sortedApps = computed(() => {
  const list = [...tabApps.value];
  if (sortStore.mode === 'port') {
    return list.sort((a, b) => {
      // apps without a port sort to the end
      const ap = a.port ?? Infinity;
      const bp = b.port ?? Infinity;
      if (ap !== bp) return ap - bp;
      return a.name.localeCompare(b.name);
    });
  }
  return list.sort((a, b) => a.name.localeCompare(b.name));
});

const visibleApps = computed(() => {
  if (!activeTags.value.length) return sortedApps.value;
  return sortedApps.value.filter((a) =>
    activeTags.value.some((t) => (a.tags || []).includes(t))
  );
});

const emptyVariant = computed(() => {
  if (activeTags.value.length) return 'filtered';
  if (appsStore.visibleApps.length) return 'tab';
  return 'empty';
});

onMounted(() => {
  appsStore.fetchApps();
  statusStore.startPolling();
});

onUnmounted(() => {
  statusStore.stopPolling();
});
</script>

<style scoped>
.dashboard-main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

@media (min-width: 640px) {
  .dashboard-main {
    padding: 2rem 1.5rem;
    gap: 0.75rem;
  }
}

/* Launchpad-style grid */
.dashboard-main.is-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 0.5rem;
  align-items: start;
}

@media (min-width: 640px) {
  .dashboard-main.is-grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 0.75rem;
  }
}

@media (min-width: 1024px) {
  .dashboard-main.is-grid {
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 1rem;
  }

  .skeleton-tile {
    height: 230px;
  }
}

.full-row {
  grid-column: 1 / -1;
}

.sort-bar {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding-bottom: 0.25rem;
}

.sort-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: rgb(113 113 122);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.skeleton-tile {
  height: 140px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-lg);
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-card {
  height: 90px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-lg);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
