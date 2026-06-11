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

  // The API returns the full app object on create/update, so mutations
  // patch local state instead of refetching the entire list.
  function replaceApp(app) {
    const idx = apps.value.findIndex((a) => a.id === app.id);
    if (idx === -1) {
      apps.value.push(app);
    } else {
      apps.value[idx] = app;
    }
  }

  async function createApp(formData) {
    const app = await apiFetch('POST', '/api/admin/apps', formData, true);
    apps.value.push(app);
    return app;
  }

  async function updateApp(id, data) {
    const app = await apiFetch('PUT', `/api/admin/apps/${id}`, data);
    replaceApp(app);
    return app;
  }

  async function uploadLogo(id, formData) {
    const app = await apiFetch('PUT', `/api/admin/apps/${id}/logo`, formData, true);
    replaceApp(app);
    return app;
  }

  async function deleteLogo(id) {
    const app = await apiFetch('DELETE', `/api/admin/apps/${id}/logo`);
    replaceApp(app);
  }

  async function deleteApp(id) {
    await apiFetch('DELETE', `/api/admin/apps/${id}`);
    apps.value = apps.value.filter((a) => a.id !== id);
  }

  async function reorderApps(ids) {
    await apiFetch('PUT', '/api/admin/apps/order', { ids });
    const order = new Map(ids.map((id, i) => [id, i]));
    apps.value = [...apps.value]
      .map((a) => ({ ...a, display_order: order.has(a.id) ? order.get(a.id) : a.display_order }))
      .sort((a, b) => a.display_order - b.display_order);
  }

  function getAppById(id) {
    return apps.value.find((a) => a.id === id);
  }

  async function fetchNotes(id) {
    const data = await apiFetch('GET', `/api/apps/${id}/notes`);
    return data.notes;
  }

  async function saveNotes(id, notes) {
    await apiFetch('PUT', `/api/apps/${id}/notes`, { notes });
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
    fetchNotes,
    saveNotes,
  };
});
