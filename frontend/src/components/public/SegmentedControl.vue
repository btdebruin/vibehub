<template>
  <div class="segmented">
    <button
      v-for="item in items"
      :key="item.value"
      type="button"
      class="seg-btn"
      :class="{ active: modelValue === item.value }"
      :aria-pressed="modelValue === item.value"
      @click="$emit('update:modelValue', item.value)"
    >
      {{ item.label }}
      <span v-if="item.count != null" class="seg-count">{{ item.count }}</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true },
  modelValue: { type: String, required: true },
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
.segmented {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
  padding: 3px;
  gap: 2px;
}

.seg-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.3rem 1rem;
  border-radius: calc(var(--radius-md) - 3px);
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgb(113 113 122);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.15s, background 0.15s, box-shadow 0.15s;
  white-space: nowrap;
}

.seg-btn:hover {
  color: rgb(212 212 216);
}

.seg-btn.active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.85), rgba(139, 92, 246, 0.85));
  color: white;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.35);
}

.seg-count {
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 0.05rem 0.4rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.08);
  color: rgb(161 161 170);
  font-variant-numeric: tabular-nums;
}

.seg-btn.active .seg-count {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}
</style>
