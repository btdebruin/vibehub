import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

const STORAGE_KEY = 'hermes-view-mode';

export const useViewModeStore = defineStore('viewMode', () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const mode = ref(stored === 'list' ? 'list' : 'grid');

  watch(mode, (m) => localStorage.setItem(STORAGE_KEY, m));

  function setMode(m) { mode.value = m; }
  function toggle() { mode.value = mode.value === 'grid' ? 'list' : 'grid'; }

  return { mode, setMode, toggle };
});
