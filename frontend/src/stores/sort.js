import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

const STORAGE_KEY = 'hermes-sort-mode';
const MODES = ['name', 'port'];

export const useSortStore = defineStore('sort', () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const mode = ref(MODES.includes(stored) ? stored : 'port');

  watch(mode, (m) => localStorage.setItem(STORAGE_KEY, m));

  function setMode(m) { mode.value = m; }

  return { mode, setMode };
});
