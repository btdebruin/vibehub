<template>
  <div class="error-banner" role="alert">
    <AlertCircle :size="18" class="flex-shrink-0" />
    <p class="flex-1 text-sm">{{ message }}</p>
    <button type="button" class="retry-btn" @click="$emit('retry')">
      <RotateCw :size="14" />
      Retry
    </button>
  </div>
</template>

<script setup>
import { AlertCircle, RotateCw } from 'lucide-vue-next';

defineProps({
  message: { type: String, required: true },
});
defineEmits(['retry']);
</script>

<style scoped>
.error-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: rgb(252 165 165);
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgb(254 202 202);
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}

.retry-btn:hover {
  background: rgba(239, 68, 68, 0.2);
}
</style>
