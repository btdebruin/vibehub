<template>
  <AdminLayout>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-semibold text-zinc-100">Apps</h1>
      <RouterLink to="/admin/apps/nieuw" class="btn-primary">
        <Plus :size="16" />
        New app
      </RouterLink>
    </div>

    <!-- Loading -->
    <template v-if="appsStore.loading">
      <div v-for="i in 3" :key="i" class="skeleton-row" />
    </template>

    <!-- Load error -->
    <ErrorBanner
      v-else-if="appsStore.error"
      :message="`Could not load apps: ${appsStore.error}`"
      @retry="appsStore.fetchApps()"
    />

    <!-- Empty state -->
    <div v-else-if="!appsStore.apps.length" class="empty-admin">
      <LayoutGrid :size="32" class="text-zinc-700 mb-3" />
      <p class="text-zinc-400 font-medium">No apps yet</p>
      <p class="text-zinc-600 text-sm mt-1">Click "New app" to add your first one.</p>
    </div>

    <!-- Draggable list -->
    <AppList
      v-else
      :apps="appsStore.apps"
      @reorder="handleReorder"
      @delete="handleDeleteIntent"
    />

    <!-- Confirm delete dialog -->
    <ConfirmDialog
      :show="!!deletingApp"
      title="Delete app"
      :message="`Delete &quot;${deletingApp?.name}&quot;? This cannot be undone.`"
      confirm-label="Delete"
      @confirm="handleDeleteConfirm"
      @cancel="deletingApp = null"
    />
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Plus, LayoutGrid } from 'lucide-vue-next';
import AdminLayout from '../components/admin/AdminLayout.vue';
import AppList from '../components/admin/AppList.vue';
import ConfirmDialog from '../components/shared/ConfirmDialog.vue';
import ErrorBanner from '../components/shared/ErrorBanner.vue';
import { useAppsStore } from '../stores/apps.js';
import { useToastStore } from '../stores/toast.js';

const appsStore = useAppsStore();
const toastStore = useToastStore();
const deletingApp = ref(null);

onMounted(() => appsStore.fetchApps());

async function handleReorder(ids) {
  try {
    await appsStore.reorderApps(ids);
  } catch (e) {
    toastStore.show(e.message, 'error');
  }
}

function handleDeleteIntent(app) {
  deletingApp.value = app;
}

async function handleDeleteConfirm() {
  const app = deletingApp.value;
  deletingApp.value = null;
  try {
    await appsStore.deleteApp(app.id);
    toastStore.show(`"${app.name}" deleted`);
  } catch (e) {
    toastStore.show(e.message, 'error');
  }
}
</script>

<style scoped>
.skeleton-row {
  height: 68px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  margin-bottom: 0.5rem;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.empty-admin {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 1rem;
  text-align: center;
}
</style>
