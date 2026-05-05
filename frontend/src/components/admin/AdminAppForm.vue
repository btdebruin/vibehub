<template>
  <form class="form-container" @submit.prevent="handleSubmit">
    <!-- Name -->
    <div class="form-group">
      <label class="form-label">Name <span class="text-red-500">*</span></label>
      <input v-model="form.name" type="text" class="form-input" placeholder="SoundBoard" required />
    </div>

    <!-- Functionality -->
    <div class="form-group">
      <label class="form-label">
        Functionality <span class="text-red-500">*</span>
        <span class="label-hint">({{ form.functionality.length }}/100)</span>
      </label>
      <input
        v-model="form.functionality"
        type="text"
        class="form-input"
        placeholder="Spotify song collector & mood boards"
        maxlength="100"
        required
      />
      <p class="form-hint">Keep it short — 4-5 words works best</p>
    </div>

    <!-- App URL -->
    <div class="form-group">
      <label class="form-label">App URL <span class="text-red-500">*</span></label>
      <input
        v-model="form.app_url"
        type="url"
        class="form-input"
        :class="{ 'input-error': urlError }"
        placeholder="https://soundboard.home"
        required
        @blur="validateUrl('app_url')"
      />
      <p v-if="urlError" class="error-msg">Please enter a valid URL (http/https)</p>
    </div>

    <!-- GitHub URL -->
    <div class="form-group">
      <label class="form-label">GitHub URL <span class="label-optional">optional</span></label>
      <input
        v-model="form.github_url"
        type="url"
        class="form-input"
        :class="{ 'input-error': githubUrlError }"
        placeholder="https://github.com/you/soundboard"
        @blur="validateUrl('github_url')"
      />
      <p v-if="githubUrlError" class="error-msg">Please enter a valid URL (http/https)</p>
    </div>

    <!-- Port -->
    <div class="form-group">
      <label class="form-label">Port <span class="label-optional">optional</span></label>
      <input
        v-model.number="form.port"
        type="number"
        class="form-input"
        placeholder="3000"
        min="1"
        max="65535"
      />
      <p class="form-hint">Local port the app runs on</p>
    </div>

    <!-- Tags -->
    <div class="form-group">
      <label class="form-label">Tags <span class="label-optional">optional</span></label>
      <TagInput v-model="form.tags" :suggestions="tagSuggestions" />
      <p class="form-hint">Enter to confirm · Backspace to remove</p>
    </div>

    <!-- Group -->
    <div class="form-group">
      <label class="form-label">Group</label>
      <div class="group-picker">
        <button
          v-for="opt in groupOptions"
          :key="opt.value"
          type="button"
          class="group-btn"
          :class="{ active: form.app_group === opt.value }"
          @click="form.app_group = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- Logo -->
    <div class="form-group">
      <LogoUploadField
        :current-logo-path="existingApp?.logo_path || null"
        @change="logoFile = $event"
        @remove="handleLogoRemove"
      />
    </div>

    <!-- Actions -->
    <div class="form-actions">
      <div class="flex gap-3">
        <button type="submit" class="btn-primary" :disabled="saving">
          <span v-if="saving">Saving...</span>
          <span v-else>{{ existingApp ? 'Save changes' : 'Create app' }}</span>
        </button>
        <RouterLink to="/admin" class="btn-secondary">Cancel</RouterLink>
      </div>

      <button
        v-if="existingApp"
        type="button"
        class="btn-danger"
        @click="$emit('delete')"
      >
        <Trash2 :size="15" />
        Delete app
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { Trash2 } from 'lucide-vue-next';
import LogoUploadField from './LogoUploadField.vue';
import TagInput from './TagInput.vue';
import { useAppsStore } from '../../stores/apps.js';

const props = defineProps({
  existingApp: { type: Object, default: null },
  saving: { type: Boolean, default: false },
});

const emit = defineEmits(['submit', 'delete', 'logo-remove']);

const appsStore = useAppsStore();

const tagSuggestions = computed(() => {
  const all = new Set();
  appsStore.apps.forEach((a) => (a.tags || []).forEach((t) => all.add(t)));
  return [...all].sort();
});

const groupOptions = [
  { label: 'Internal', value: 'internal' },
  { label: '9to5', value: '9to5' },
  { label: 'External', value: 'external' },
];

const form = reactive({
  name: props.existingApp?.name || '',
  functionality: props.existingApp?.functionality || '',
  app_url: props.existingApp?.app_url || '',
  github_url: props.existingApp?.github_url || '',
  app_group: props.existingApp?.app_group || 'internal',
  tags: props.existingApp?.tags ? [...props.existingApp.tags] : [],
  port: props.existingApp?.port || null,
});

const logoFile = ref(null);
const urlError = ref(false);
const githubUrlError = ref(false);

function isValidUrl(value) {
  if (!value) return true;
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function validateUrl(field) {
  if (field === 'app_url') urlError.value = form.app_url ? !isValidUrl(form.app_url) : false;
  if (field === 'github_url') githubUrlError.value = form.github_url ? !isValidUrl(form.github_url) : false;
}

function handleLogoRemove() {
  logoFile.value = null;
  emit('logo-remove');
}

function handleSubmit() {
  validateUrl('app_url');
  validateUrl('github_url');
  if (urlError.value || githubUrlError.value) return;
  emit('submit', { ...form }, logoFile.value);
}
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.label-hint {
  font-size: 0.75rem;
  color: #52525B;
  font-weight: 400;
  margin-left: 0.25rem;
}

.label-optional {
  font-size: 0.75rem;
  color: #52525B;
  font-weight: 400;
}

.form-hint {
  font-size: 0.75rem;
  color: #52525B;
  margin: 0;
}

.group-picker {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 3px;
  gap: 2px;
}

.group-btn {
  flex: 1;
  padding: 0.35rem 0;
  border-radius: 7px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgb(113 113 122);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}

.group-btn:hover {
  color: rgb(212 212 216);
}

.group-btn.active {
  background: rgba(255, 255, 255, 0.1);
  color: rgb(244 244 245);
}

.input-error {
  border-color: #EF4444 !important;
}

.error-msg {
  font-size: 0.75rem;
  color: #EF4444;
  margin: 0;
}

.form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  margin-top: 0.5rem;
  flex-wrap: wrap;
}
</style>
