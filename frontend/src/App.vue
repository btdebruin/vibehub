<template>
  <RouterView />
  <CommandPalette />
  <Toast />
</template>

<script setup>
import { useKeyboardShortcuts } from './composables/useKeyboardShortcuts.js';
import CommandPalette from './components/palette/CommandPalette.vue';
import Toast from './components/shared/Toast.vue';

useKeyboardShortcuts();
</script>
