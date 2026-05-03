<template>
  <div class="min-h-screen">
    <header class="notes-header">
      <div class="notes-header-inner">
        <button class="back-btn" @click="$router.back()">
          <ArrowLeft :size="18" />
          <span>Back</span>
        </button>

        <div v-if="app" class="app-identity">
          <AppLogo :logo-path="app.logo_path" :name="app.name" :size="28" />
          <span class="app-name">{{ app.name }}</span>
          <span class="notes-label">/ Notes</span>
        </div>

        <div class="save-status">
          <span v-if="saving" class="status-saving">Saving…</span>
          <span v-else-if="saved" class="status-saved">
            <Check :size="14" />
            Saved
          </span>
        </div>
      </div>
    </header>

    <main class="notes-main">
      <div v-if="loading" class="skeleton-area" />
      <div v-else-if="!app" class="not-found">App not found.</div>
      <textarea
        v-else
        ref="textareaRef"
        v-model="notes"
        class="notes-area"
        placeholder="Write your notes here…"
        @input="onInput"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowLeft, Check } from 'lucide-vue-next';
import AppLogo from '../components/public/AppLogo.vue';
import { useAppsStore } from '../stores/apps.js';

const route = useRoute();
const appsStore = useAppsStore();

const app = ref(null);
const notes = ref('');
const loading = ref(true);
const saving = ref(false);
const saved = ref(false);
const textareaRef = ref(null);

let debounceTimer = null;
let savedTimer = null;

onMounted(async () => {
  const id = route.params.id;
  if (!appsStore.apps.length) await appsStore.fetchApps();
  app.value = appsStore.getAppById(id) ?? null;

  if (app.value) {
    notes.value = await appsStore.fetchNotes(id);
  }
  loading.value = false;
});

onUnmounted(() => {
  clearTimeout(debounceTimer);
  clearTimeout(savedTimer);
});

function onInput() {
  saved.value = false;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(persist, 800);
}

async function persist() {
  saving.value = true;
  try {
    await appsStore.saveNotes(route.params.id, notes.value);
    saved.value = true;
    clearTimeout(savedTimer);
    savedTimer = setTimeout(() => { saved.value = false; }, 2500);
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.notes-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 10;
}

.notes-header-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: rgb(161 161 170);
  font-size: 0.875rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  transition: color 0.15s, background 0.15s;
  flex-shrink: 0;
}

.back-btn:hover {
  color: rgb(228 228 231);
  background: rgba(255, 255, 255, 0.06);
}

.app-identity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
}

.app-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: rgb(228 228 231);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notes-label {
  font-size: 0.875rem;
  color: rgb(113 113 122);
  flex-shrink: 0;
}

.save-status {
  font-size: 0.8125rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  min-width: 4rem;
  justify-content: flex-end;
  flex-shrink: 0;
}

.status-saving {
  color: rgb(113 113 122);
}

.status-saved {
  color: rgb(52 211 153);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.notes-main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem;
  height: calc(100vh - 57px);
  display: flex;
  flex-direction: column;
}

.notes-area {
  flex: 1;
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  color: rgb(212 212 216);
  font-size: 0.9375rem;
  line-height: 1.75;
  font-family: inherit;
  caret-color: rgb(99 102 241);
}

.notes-area::placeholder {
  color: rgb(63 63 70);
}

.skeleton-area {
  flex: 1;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.not-found {
  color: rgb(113 113 122);
  padding: 2rem 0;
}
</style>
