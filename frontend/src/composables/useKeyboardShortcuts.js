import { onMounted, onUnmounted } from 'vue';
import { useCommandPaletteStore } from '../stores/commandPalette.js';

export function useKeyboardShortcuts() {
  const commandPaletteStore = useCommandPaletteStore();

  function handleKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      commandPaletteStore.toggle();
    }
    if (e.key === 'Escape' && commandPaletteStore.isOpen) {
      commandPaletteStore.close();
    }
  }

  onMounted(() => window.addEventListener('keydown', handleKeyDown));
  onUnmounted(() => window.removeEventListener('keydown', handleKeyDown));
}
