<template>
  <AdminLayout>
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-zinc-100">
        {{ isNew ? 'New app' : 'Edit app' }}
      </h1>
      <p class="text-zinc-500 text-sm mt-1">
        {{ isNew ? 'Add a new app to your dashboard.' : `Editing "${existingApp?.name || ''}"` }}
      </p>
    </div>

    <div class="form-card">
      <AdminAppForm
        v-if="!loading"
        :existing-app="existingApp"
        :saving="saving"
        @submit="handleSubmit"
        @delete="showDeleteDialog = true"
        @logo-remove="pendingLogoRemove = true"
      />
      <div v-else class="flex items-center justify-center py-12">
        <div class="text-zinc-600 text-sm">Loading...</div>
      </div>
    </div>

    <ConfirmDialog
      :show="showDeleteDialog"
      title="Delete app"
      :message="`Delete &quot;${existingApp?.name}&quot;? This cannot be undone.`"
      confirm-label="Delete"
      @confirm="handleDelete"
      @cancel="showDeleteDialog = false"
    />
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AdminLayout from '../components/admin/AdminLayout.vue';
import AdminAppForm from '../components/admin/AdminAppForm.vue';
import ConfirmDialog from '../components/shared/ConfirmDialog.vue';
import { useAppsStore } from '../stores/apps.js';
import { useToastStore } from '../stores/toast.js';

const route = useRoute();
const router = useRouter();
const appsStore = useAppsStore();
const toastStore = useToastStore();

const isNew = computed(() => route.path === '/admin/apps/nieuw');
const appId = computed(() => (isNew.value ? null : route.params.id));
const existingApp = computed(() => (appId.value ? appsStore.getAppById(appId.value) : null));

const saving = ref(false);
const loading = ref(false);
const showDeleteDialog = ref(false);
const pendingLogoRemove = ref(false);

onMounted(async () => {
  if (!appsStore.apps.length) {
    loading.value = true;
    await appsStore.fetchApps();
    loading.value = false;
  }
});

async function handleSubmit(formData, logoFile) {
  saving.value = true;
  try {
    if (isNew.value) {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('functionality', formData.functionality);
      fd.append('app_url', formData.app_url);
      if (formData.github_url) fd.append('github_url', formData.github_url);
      fd.append('app_group', formData.app_group);
      fd.append('tags', JSON.stringify(formData.tags));
      if (formData.port) fd.append('port', formData.port);
      if (logoFile) fd.append('logo', logoFile);
      await appsStore.createApp(fd);
      toastStore.show('App created!');
    } else {
      // Handle logo remove first
      if (pendingLogoRemove.value && existingApp.value?.logo_path && !logoFile) {
        await appsStore.deleteLogo(appId.value);
        pendingLogoRemove.value = false;
      }

      await appsStore.updateApp(appId.value, {
        name: formData.name,
        functionality: formData.functionality,
        app_url: formData.app_url,
        github_url: formData.github_url || null,
        app_group: formData.app_group,
        tags: formData.tags,
        port: formData.port || null,
      });

      if (logoFile) {
        const fd = new FormData();
        fd.append('logo', logoFile);
        await appsStore.uploadLogo(appId.value, fd);
      }

      toastStore.show('App saved!');
    }
    router.push('/admin');
  } catch (e) {
    toastStore.show(e.message, 'error');
  } finally {
    saving.value = false;
  }
}

async function handleDelete() {
  showDeleteDialog.value = false;
  try {
    await appsStore.deleteApp(appId.value);
    toastStore.show(`"${existingApp.value?.name}" deleted`);
    router.push('/admin');
  } catch (e) {
    toastStore.show(e.message, 'error');
  }
}
</script>

<style scoped>
.form-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 1.75rem;
}
</style>
