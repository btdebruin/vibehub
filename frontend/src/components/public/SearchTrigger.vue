<template>
  <button class="search-trigger" @click="store.open()">
    <Search :size="15" class="text-zinc-400" />
    <span class="hidden sm:inline text-zinc-400 text-sm">Search</span>
    <kbd class="hidden sm:inline kbd">⌘K</kbd>
  </button>
</template>

<script setup>
import { Search } from 'lucide-vue-next';
import { useCommandPaletteStore } from '../../stores/commandPalette.js';

const store = useCommandPaletteStore();
</script>

<style scoped>
.search-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  cursor: pointer;
  transition: all 150ms ease-out;
  color: #A1A1AA;
  min-width: 40px;
  min-height: 40px;
  justify-content: center;
}

@media (min-width: 640px) {
  .search-trigger {
    padding: 0.375rem 0.75rem;
    min-width: unset;
    min-height: unset;
    justify-content: flex-start;
  }
}

.search-trigger:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  color: #F4F4F5;
}

.kbd {
  font-size: 0.7rem;
  padding: 0.15rem 0.4rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  color: #71717A;
  font-family: inherit;
}
</style>
