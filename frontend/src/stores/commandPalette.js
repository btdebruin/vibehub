import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCommandPaletteStore = defineStore('commandPalette', () => {
  const isOpen = ref(false);
  const query = ref('');
  const selectedIndex = ref(0);

  function open() {
    isOpen.value = true;
    query.value = '';
    selectedIndex.value = 0;
  }

  function close() {
    isOpen.value = false;
    query.value = '';
    selectedIndex.value = 0;
  }

  function toggle() {
    isOpen.value ? close() : open();
  }

  return { isOpen, query, selectedIndex, open, close, toggle };
});
