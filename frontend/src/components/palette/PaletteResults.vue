<template>
  <div id="palette-listbox" class="palette-results" role="listbox" aria-label="Apps">
    <div v-if="results.length === 0" class="palette-empty">
      No apps found
    </div>
    <template v-else>
      <div class="palette-section-header">Apps</div>
      <PaletteItem
        v-for="(app, index) in results"
        :key="app.id"
        :id="`palette-option-${index}`"
        :app="app"
        :active="index === selectedIndex"
        :data-index="index"
        role="option"
        :aria-selected="index === selectedIndex"
        @click="$emit('select', app)"
        @mouseenter="$emit('hover', index)"
      />
    </template>
  </div>
</template>

<script setup>
import PaletteItem from './PaletteItem.vue';

defineProps({
  results: { type: Array, required: true },
  selectedIndex: { type: Number, default: 0 },
});

defineEmits(['select', 'hover']);
</script>

<style scoped>
.palette-results {
  padding: 0.5rem 0;
}

.palette-empty {
  padding: 2rem 1rem;
  text-align: center;
  color: #52525B;
  font-size: 0.875rem;
}

.palette-section-header {
  padding: 0.375rem 1rem 0.25rem;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #52525B;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
</style>
