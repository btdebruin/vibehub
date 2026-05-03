<template>
  <div class="min-h-screen">
    <DashboardHeader />

    <main class="dashboard-main">
      <TagFilter v-model="activeTags" :tags="availableTags" />

      <template v-if="appsStore.loading">
        <div v-for="i in 4" :key="i" class="skeleton-card" />
      </template>
      <EmptyState v-else-if="!visibleApps.length" />
      <template v-else>
        <AppCard v-for="app in visibleApps" :key="app.id" :app="app" />
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import DashboardHeader from '../components/public/DashboardHeader.vue';
import AppCard from '../components/public/AppCard.vue';
import EmptyState from '../components/public/EmptyState.vue';
import TagFilter from '../components/public/TagFilter.vue';
import { useAppsStore } from '../stores/apps.js';
import { useTabStore } from '../stores/tab.js';

const appsStore = useAppsStore();
const tabStore = useTabStore();

const activeTags = ref([]);

// clear tag filter when switching tabs
watch(() => tabStore.activeTab, () => { activeTags.value = []; });

const tabApps = computed(() =>
  appsStore.apps.filter((a) => a.app_group === tabStore.activeTab)
);

const availableTags = computed(() => {
  const all = new Set();
  tabApps.value.forEach((a) => (a.tags || []).forEach((t) => all.add(t)));
  return [...all].sort();
});

const visibleApps = computed(() => {
  if (!activeTags.value.length) return tabApps.value;
  return tabApps.value.filter((a) =>
    activeTags.value.some((t) => (a.tags || []).includes(t))
  );
});

onMounted(() => {
  appsStore.fetchApps();
});
</script>

<style scoped>
.dashboard-main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-card {
  height: 90px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
