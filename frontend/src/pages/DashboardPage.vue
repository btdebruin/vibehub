<template>
  <div class="min-h-screen">
    <DashboardHeader />

    <main class="dashboard-main">
      <!-- Loading skeleton -->
      <template v-if="appsStore.loading">
        <div v-for="i in 4" :key="i" class="skeleton-card" />
      </template>

      <!-- Empty state -->
      <EmptyState v-else-if="!appsStore.apps.length" />

      <!-- App cards -->
      <template v-else>
        <AppCard
          v-for="app in appsStore.apps"
          :key="app.id"
          :app="app"
        />
      </template>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import DashboardHeader from '../components/public/DashboardHeader.vue';
import AppCard from '../components/public/AppCard.vue';
import EmptyState from '../components/public/EmptyState.vue';
import { useAppsStore } from '../stores/apps.js';

const appsStore = useAppsStore();

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
