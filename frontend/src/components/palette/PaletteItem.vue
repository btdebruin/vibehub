<template>
  <div
    class="palette-item"
    :class="{ active }"
    @click="$emit('click')"
    @mouseenter="$emit('mouseenter')"
  >
    <AppLogo :logo-path="app.logo_path" :name="app.name" :size="36" />
    <div class="palette-item-text">
      <div class="palette-item-name">{{ app.name }}</div>
      <div class="palette-item-func">{{ app.functionality }}</div>
    </div>
    <ArrowUpRight :size="16" class="palette-item-arrow" />
  </div>
</template>

<script setup>
import { ArrowUpRight } from 'lucide-vue-next';
import AppLogo from '../public/AppLogo.vue';

defineProps({
  app: { type: Object, required: true },
  active: { type: Boolean, default: false },
});

defineEmits(['click', 'mouseenter']);
</script>

<style scoped>
.palette-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1rem;
  cursor: pointer;
  transition: background 120ms ease-out;
  border-radius: 0;
}

.palette-item:hover,
.palette-item.active {
  background: rgba(99, 102, 241, 0.12);
}

.palette-item-text {
  flex: 1;
  min-width: 0;
}

.palette-item-name {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #F4F4F5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.palette-item-func {
  font-size: 0.8125rem;
  color: #71717A;
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.palette-item-arrow {
  color: #52525B;
  flex-shrink: 0;
  transition: color 120ms ease-out;
}

.palette-item:hover .palette-item-arrow,
.palette-item.active .palette-item-arrow {
  color: #6366F1;
}
</style>
