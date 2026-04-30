import { defineStore } from 'pinia';
import { ref } from 'vue';

async function apiFetch(method, url, body, isFormData = false) {
  const options = {
    method,
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
  };
  if (body !== undefined) {
    options.body = isFormData ? body : JSON.stringify(body);
  }
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const useAppsStore = defineStore('apps', () => {
  const apps = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function fetchApps() {
    loading.value = true;
    error.value = null;
    try {
      apps.value = await apiFetch('GET', '/api/apps');
    } catch (e) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  }

  async function createApp(formData) {
    const app = await apiFetch('POST', '/api/admin/apps', formData, true);
    await fetchApps();
    return app;
  }

  async function updateApp(id, data) {
    const app = await apiFetch('PUT', `/api/admin/apps/${id}`, data);
    await fetchApps();
    return app;
  }

  async function uploadLogo(id, formData) {
    const app = await apiFetch('PUT', `/api/admin/apps/${id}/logo`, formData, true);
    await fetchApps();
    return app;
  }

  async function deleteLogo(id) {
    await apiFetch('DELETE', `/api/admin/apps/${id}/logo`);
    await fetchApps();
  }

  async function deleteApp(id) {
    await apiFetch('DELETE', `/api/admin/apps/${id}`);
    await fetchApps();
  }

  async function reorderApps(ids) {
    await apiFetch('PUT', '/api/admin/apps/order', { ids });
    await fetchApps();
  }

  function getAppById(id) {
    return apps.value.find((a) => a.id === id);
  }

  return {
    apps,
    loading,
    error,
    fetchApps,
    createApp,
    updateApp,
    uploadLogo,
    deleteLogo,
    deleteApp,
    reorderApps,
    getAppById,
  };
});
